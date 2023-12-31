import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl, Marker, Popup, Projection } from 'mapbox-gl'
import { firebaseConfig } from '../../../env'
import { initializeApp } from "firebase/app";
import { getDatabase, ref as ref_db, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start
import { getStorage, ref as ref_storage, listAll, getDownloadURL } from "firebase/storage";

interface Location {
  name: string,
  description: string,
  coordinates: {
    latitude: number,
    longitude: number,
  },
  imgs: string[],
  city: string,
  country: string,
  tags: string[],
  date: string,
  postId: number,
}

interface Locations {
  [id: string]: Location,
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  private map!: Map;
  private projection: Projection | any = 'mercator'; // ideia: botao que muda projeçao pra 'globe'
  private locations!: Locations;
  private app: any;
  private storage: any;
  public showBlogPost: boolean = false;

  public imgs1: string[] = [];
  public imgs2: string[] = []; 
  public imgs3: string[] = [];
  public postId = 0;
  
  async ngOnInit() {
    this.mapConfig();
    this.app = initializeApp(firebaseConfig);
    await this.fetchLocations();
    await this.addLocationsMarkers();
  };
  
  mapConfig(){
    this.mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v12', //https://docs.mapbox.com/api/maps/styles/
      projection: this.projection,
      center: [-10, 10],
      zoom: 2
    });
    this.map.addControl(new NavigationControl());
    this.map.on('style.load', () => {
      this.map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
      });
      this.map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      });
  }

  async fetchLocations() { 
    const db = getDatabase();
    const dbRef = ref_db(db);

    let snapshot = await get(child(dbRef, 'locations'));
    if (snapshot.exists()) {
      this.locations = snapshot.val();
      console.log(this.locations)
      return;
    };
    console.warn('No locations');
  };

  async addLocationsMarkers(){
    for (let id of Object.keys(this.locations)){
      const imgUrl = await this.getLocationImgUrl(id);

      const innerHtmlContent = `<h1>${this.locations[id].name}</h1><img class="popup-img" src=${imgUrl}> <div>${this.locations[id].description}</div> <h4>Primeira visita: ${this.locations[id].date}<\h4>`;
      const popupDivElement = document.createElement('div');
      const openTxtBtn = document.createElement('div');
      openTxtBtn.innerHTML = `<button class="open-post-btn"> Abrir texto</button>`;
      popupDivElement.innerHTML = innerHtmlContent;
      popupDivElement.appendChild(openTxtBtn);
      openTxtBtn.addEventListener('click', (e) => {
        this.postId = this.locations[id].postId;
        this.openBlogPost(this.postId);
      });

      const marker = new Marker()
        .setLngLat([this.locations[id].coordinates.longitude, this.locations[id].coordinates.latitude])
        .setPopup(new Popup({ className: "location-popup" }).setDOMContent(popupDivElement))
        .addTo(this.map);
    }
  };

  async getLocationImgUrl(locationId: string): Promise<string>{
    this.storage = getStorage(this.app);
    const listRef = ref_storage(this.storage, `locations/${locationId}`);

    let imgPath = '';
    let res = await listAll(listRef);
    res.items.forEach((itemRef) => {
      imgPath = itemRef.fullPath
    });

    let url = await getDownloadURL(ref_storage(this.storage, imgPath))
    return url;
  }

  async openBlogPost(postId: number){
    console.log('post id', postId);
    this.storage = getStorage(this.app);
    const imgUrls = await this.getPostImgsUrls(postId);
    console.log(imgUrls)
    imgUrls.forEach((url) => {
      // ta gambi
      if (url.includes('2F1_')) this.imgs1.push(url);
      if (url.includes('2F2_')) this.imgs2.push(url);
      if (url.includes('2F3_')) this.imgs3.push(url);
    });
    this.showBlogPost = true;
  }

  async getPostImgsUrls(postId: number): Promise<string[]> {
    const imgPromises: Promise<string>[] = [];
    const listRef = ref_storage(this.storage, `posts/${postId}`);
    const res = await listAll(listRef);
    res.items.forEach((itemRef) => {
      const imgPath = itemRef.fullPath;
      const urlPromise = getDownloadURL(ref_storage(this.storage, imgPath));
      imgPromises.push(urlPromise);
    });
    const imgsUrls = await Promise.all(imgPromises);
    return imgsUrls;
  }

}
