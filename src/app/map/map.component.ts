import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl, Marker, Popup } from 'mapbox-gl'
import { getDatabase, ref, onValue, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start

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
  private locations!: Locations;
  
  async ngOnInit() {
    this.mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11'
    });
    this.map.addControl(new NavigationControl());
    await this.fetchDbData();
    this.addLocationsMarkers();
  };

  async fetchDbData() { 
    const db = getDatabase();
    const dbRef = ref(db);

    let snapshot = await get(child(dbRef, 'locations'));
    if (snapshot.exists()) {
      this.locations = snapshot.val();
      return;
    };
    console.warn('No locations');
  };

  addLocationsMarkers(){
    for (let id of Object.keys(this.locations)){
      let popupHtml = `<h1>${this.locations[id].name}</h1> <div>${this.locations[id].description}</div> <h4>Primeira visita: ${this.locations[id].date}<\h4>`
      const marker = new Marker()
        .setLngLat([this.locations[id].coordinates.longitude, this.locations[id].coordinates.latitude])
        .setPopup(new Popup().setHTML(popupHtml))
        .addTo(this.map);
    }
  };

}
