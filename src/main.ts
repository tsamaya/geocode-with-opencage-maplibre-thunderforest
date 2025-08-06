import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { createGeocoderApi } from './geocoding';

import 'maplibre-gl/dist/maplibre-gl.css';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import './style.css';

const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.thunderforest.com/styles/atlas/style.json?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`,
  center: [-0.1275, 51.507222],
  zoom: 3,
  canvasContextAttributes: { antialias: true },
});

const geocoderApi = createGeocoderApi();

map.addControl(
  new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    placeholder: 'Search or lat,lon',
  })
);
