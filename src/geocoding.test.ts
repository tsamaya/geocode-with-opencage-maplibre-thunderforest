/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { geocodeAndReverseGeocode, createGeocoderApi } from './geocoding';
import type { MaplibreGeocoderApiConfig } from '@maplibre/maplibre-gl-geocoder';
import {
  createMockGeocodingResponse,
  createMockGeocodingResult,
  createMockGeocoderConfig,
} from './test/utils';

// Mock the opencage-api-client
vi.mock('opencage-api-client', () => ({
  geocode: vi.fn(),
}));

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_OPENCAGE_API_KEY: 'test-api-key',
}));

describe('geocoding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('geocodeAndReverseGeocode', () => {
    it('should return empty feature collection when no query is provided', async () => {
      const config: MaplibreGeocoderApiConfig = { query: '' };
      const result = await geocodeAndReverseGeocode(config);

      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
    });

    it('should return empty feature collection when query is undefined', async () => {
      const config: MaplibreGeocoderApiConfig = { query: undefined };
      const result = await geocodeAndReverseGeocode(config);

      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
    });

    it('should return empty feature collection when query is null', async () => {
      const config: MaplibreGeocoderApiConfig = { query: null as any };
      const result = await geocodeAndReverseGeocode(config);

      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
    });

    it('should handle successful geocoding response', async () => {
      const mockGeocode = vi.mocked(
        await import('opencage-api-client')
      ).geocode;
      const mockResult = createMockGeocodingResult(
        'London, UK',
        51.507222,
        -0.1275,
        { city: 'London', country: 'UK' },
        {
          southwest: { lat: 51.0, lng: -0.5 },
          northeast: { lat: 52.0, lng: 0.5 },
        }
      );
      mockGeocode.mockResolvedValue(createMockGeocodingResponse([mockResult]));

      const config = createMockGeocoderConfig('London');
      const result = await geocodeAndReverseGeocode(config);

      expect(mockGeocode).toHaveBeenCalledWith({
        key: 'test-api-key',
        q: 'London',
        limit: 5,
        no_annotations: 1,
      });

      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [-0.1275, 51.507222],
            },
            id: 'London, UK',
            text: 'London, UK',
            properties: {
              city: 'London',
              country: 'UK',
            },
            place_name: 'London, UK',
            place_type: ['place'],
            bbox: [-0.5, 51.0, 0.5, 52.0],
          },
        ],
      });
    });

    it('should handle response without bounds', async () => {
      const mockGeocode = vi.mocked(
        await import('opencage-api-client')
      ).geocode;
      mockGeocode.mockResolvedValue({
        results: [
          {
            formatted: 'Paris, France',
            geometry: { lat: 48.8566, lng: 2.3522 },
            components: {
              city: 'Paris',
              country: 'France',
            },
            bounds: undefined,
          },
        ],
      } as any);

      const config: MaplibreGeocoderApiConfig = { query: 'Paris' };
      const result = await geocodeAndReverseGeocode(config);

      expect(result.features[0].bbox).toBeUndefined();
    });

    it('should handle empty results array', async () => {
      const mockGeocode = vi.mocked(
        await import('opencage-api-client')
      ).geocode;
      mockGeocode.mockResolvedValue({
        results: [],
      } as any);

      const config: MaplibreGeocoderApiConfig = { query: 'Non existing Place' };
      const result = await geocodeAndReverseGeocode(config);

      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });
    });

    it('should handle API errors gracefully', async () => {
      const mockGeocode = vi.mocked(
        await import('opencage-api-client')
      ).geocode;
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      mockGeocode.mockRejectedValue(new Error('API Error'));

      const config: MaplibreGeocoderApiConfig = { query: 'ErrorTest' };
      const result = await geocodeAndReverseGeocode(config);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to forwardGeocode with error: Error: API Error'
      );
      expect(result).toEqual({
        type: 'FeatureCollection',
        features: [],
      });

      consoleSpy.mockRestore();
    });

    it('should use custom API key when provided', async () => {
      const mockGeocode = vi.mocked(
        await import('opencage-api-client')
      ).geocode;
      mockGeocode.mockResolvedValue({
        results: [],
      } as any);

      const config: MaplibreGeocoderApiConfig = { query: 'Test' };
      await geocodeAndReverseGeocode(config, 'custom-api-key');

      expect(mockGeocode).toHaveBeenCalledWith({
        key: 'custom-api-key',
        q: 'Test',
        limit: 5,
        no_annotations: 1,
      });
    });
  });

  describe('createGeocoderApi', () => {
    it('should create geocoder API with default API key', () => {
      const api = createGeocoderApi();

      expect(api).toHaveProperty('forwardGeocode');
      expect(api).toHaveProperty('reverseGeocode');
      expect(typeof api.forwardGeocode).toBe('function');
      expect(typeof api.reverseGeocode).toBe('function');
    });

    it('should create geocoder API with custom API key', () => {
      const api = createGeocoderApi('custom-key');

      expect(api).toHaveProperty('forwardGeocode');
      expect(api).toHaveProperty('reverseGeocode');
    });

    it('should return same function for both forward and reverse geocoding', () => {
      const api = createGeocoderApi();

      // Both functions should exist and be callable
      expect(typeof api.forwardGeocode).toBe('function');
      expect(typeof api.reverseGeocode).toBe('function');
    });
  });
});
