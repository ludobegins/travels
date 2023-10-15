import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Map, NavigationControl } from 'mapbox-gl'
import { getDatabase, ref, onValue, get, child } from "firebase/database"; // https://firebase.google.com/docs/database/web/start

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  private map: any;
  
  ngOnInit(): void {
    this.mapboxgl.accessToken = environment.mapbox.accessToken;
    this.map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11'
    });
    this.map.addControl(new NavigationControl());
    this.fetchDbData();
  }

  fetchDbData() { 
    const db = getDatabase();
    const dbRef = ref(db);

    get(child(dbRef, 'locations')).then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
        } else {
          console.log("No locations");
        }
      }).catch((error) => {
        console.error(error);
      });
  }

}
