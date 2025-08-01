// Import necessary libraries
// import maplibregl from 'maplibre-gl';
// import MaplibreGeocoder from '@maplibre/maplibre-geocoder';
import { geocode } from 'opencage-api-client';

const map = new maplibregl.Map({
  container: 'map',
  style: `https://api.thunderforest.com/styles/atlas/style.json?apikey=${import.meta.env.VITE_THUNDERFOREST_API_KEY}`, // Replace with your Thunderforest API key
  center: [-0.1275, 51.507222],
  zoom: 3,
  canvasContextAttributes: { antialias: true },
});

const geocoderApi = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      const response = await geocode({
        key: import.meta.env.VITE_OPENCAGE_API_KEY,
        q: config.query,
        limit: 5, // Limit results to 5
        no_annotations: 1, // Exclude annotations for simplicity
      });
      if (response.results && response.results.length > 0) {
        for (const result of response.results) {
          const center = [result.geometry.lng, result.geometry.lat];
          const point = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: center,
            },
            place_name: result.formatted,
            properties: result.components,
            text: result.formatted,
            place_type: ['place'],
            center,
          };
          features.push(point);
        }
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }

    return {
      features,
    };
  },
};
map.addControl(
  new MaplibreGeocoder(geocoderApi, {
    maplibregl,
  })
);
