import type {
  MaplibreGeocoderApi,
  MaplibreGeocoderApiConfig,
  MaplibreGeocoderFeatureResults,
  CarmenGeojsonFeature,
} from '@maplibre/maplibre-gl-geocoder';

import type { GeocodingResponse } from 'opencage-api-client';
import { geocode } from 'opencage-api-client';

export const geocodeAndReverseGeocode = async (
  config: MaplibreGeocoderApiConfig,
  apiKey: string = import.meta.env.VITE_OPENCAGE_API_KEY
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
      key: apiKey,
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

export const createGeocoderApi = (apiKey?: string): MaplibreGeocoderApi => ({
  reverseGeocode: (config) => geocodeAndReverseGeocode(config, apiKey),
  forwardGeocode: (config) => geocodeAndReverseGeocode(config, apiKey),
});
