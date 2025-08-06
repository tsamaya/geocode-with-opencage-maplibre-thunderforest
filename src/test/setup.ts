import { vi } from 'vitest';

// Mock environment variables for testing
vi.mock('import.meta.env', () => ({
  VITE_OPENCAGE_API_KEY: 'test-api-key',
  VITE_THUNDERFOREST_API_KEY: 'test-thunderforest-key',
}));

// Mock maplibre-gl to avoid DOM issues in tests
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn().mockImplementation(() => ({
      addControl: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
    })),
  },
}));

// Mock the geocoder module
vi.mock('@maplibre/maplibre-gl-geocoder', () => ({
  default: vi.fn().mockImplementation(() => ({
    onAdd: vi.fn(),
    onRemove: vi.fn(),
  })),
}));

// Mock opencage-api-client
vi.mock('opencage-api-client', () => ({
  geocode: vi.fn(),
}));
