import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Map } from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
  private map = new Map();
  
  ngOnInit(): void {
    this.mapboxgl.accessToken = environment.mapbox.accessToken;
    let map = new this.mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });
}

}
