import type {
  MaplibreGeocoderApi,
  MaplibreGeocoderApiConfig,
  MaplibreGeocoderFeatureResults,
  CarmenGeojsonFeature,
} from '@maplibre/maplibre-gl-geocoder';

import type { GeocodingResponse } from 'opencage-api-client';

import maplibregl from 'maplibre-gl';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import { geocode } from 'opencage-api-client';

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

const geocodeAndReverseGeocode = async (
  config: MaplibreGeocoderApiConfig
): Promise<MaplibreGeocoderFeatureResults> => {
  const features: CarmenGeojsonFeature[] = [];
  let query: string | undefined;
  if (typeof config.query === 'string') {
    query = config.query;
  }
  if (!query) {
    return { type: 'FeatureCollection', features };
  }
  try {
    const response: GeocodingResponse = await geocode({
      key: import.meta.env.VITE_OPENCAGE_API_KEY,
      q: query,
      limit: 5,
      no_annotations: 1,
    });
    if (response.results && response.results.length > 0) {
      for (const result of response.results) {
        const center: [number, number] = [
          result.geometry.lng,
          result.geometry.lat,
        ];
        const point: CarmenGeojsonFeature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: center,
          },
          id: result.formatted,
          text: result.formatted,
          properties: result.components,
          place_name: result.formatted,
          place_type: ['place'],
          bbox: result.bounds
            ? [
                result.bounds?.southwest?.lng,
                result.bounds?.southwest?.lat,
                result.bounds?.northeast?.lng,
                result.bounds?.northeast?.lat,
              ]
            : undefined,
        };
        features.push(point);
      }
    }
  } catch (e) {
    console.error(`Failed to forwardGeocode with error: ${e}`);
  }

  return {
    type: 'FeatureCollection',
    features,
  };
};

const geocoderApi: MaplibreGeocoderApi = {
  reverseGeocode: geocodeAndReverseGeocode,
  forwardGeocode: geocodeAndReverseGeocode,
};

map.addControl(
  new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    placeholder: 'Search or lat,lon',
  })
);
