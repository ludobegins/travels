import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl, Marker, Popup } from 'mapbox-gl'
import { getDatabase, ref, onValue, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  private map: any;
  private locations: any; // tipar depois que definir direito na db
  
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
    for (let locationId of Object.keys(this.locations)){
      const marker = new Marker()
        .setLngLat([this.locations[locationId].coordinates.longitude, this.locations[locationId].coordinates.latitude])
        .setPopup(new Popup().setHTML("<h1>Hello World!</h1>"))
        .addTo(this.map);
    }
  };

}
