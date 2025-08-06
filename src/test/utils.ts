/* eslint-disable @typescript-eslint/no-explicit-any */

import type { MaplibreGeocoderApiConfig } from '@maplibre/maplibre-gl-geocoder';

/**
 * Creates a mock geocoding response for testing
 */
export const createMockGeocodingResponse = (results: any[] = []) =>
  ({
    results,
    total_results: results.length,
    status: { code: 200, message: 'OK' },
    documentation: 'https://opencagedata.com/api',
    licenses: [
      {
        name: 'see attribution guide',
        url: 'https://opencagedata.com/credits',
      },
    ],
    stay_informed: {
      blog: 'https://blog.opencagedata.com',
      mastodon: 'https://en.osm.town/@opencage',
    },
    thanks: 'For using an OpenCage API',
    timestamp: {
      created_http: 'Wed, 06 Aug 2025 15:26:52 GMT',
      created_unix: 1754494012,
    },
  }) as any;

/**
 * Creates a mock geocoding result
 */
export const createMockGeocodingResult = (
  formatted: string,
  lat: number,
  lng: number,
  components: Record<string, any> = {},
  bounds?: {
    southwest: { lat: number; lng: number };
    northeast: { lat: number; lng: number };
  }
) => ({
  formatted,
  geometry: { lat, lng },
  components,
  bounds,
});

/**
 * Creates a mock geocoder config for testing
 */
export const createMockGeocoderConfig = (
  query: string
): MaplibreGeocoderApiConfig => ({
  query,
});

/**
 * Helper to wait for async operations in tests
 */
export const waitFor = (ms: number = 0): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
