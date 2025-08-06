import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies
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

vi.mock('@maplibre/maplibre-gl-geocoder', () => ({
  default: vi.fn().mockImplementation(() => ({
    onAdd: vi.fn(),
    onRemove: vi.fn(),
  })),
}));

const mockCreateGeocoderApi = vi.fn().mockReturnValue({
  forwardGeocode: vi.fn(),
  reverseGeocode: vi.fn(),
});

vi.mock('./geocoding', () => ({
  createGeocoderApi: mockCreateGeocoderApi,
}));

describe('main', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize map and geocoder when imported', async () => {
    // Import the main module to trigger the initialization
    await import('./main');

    // Verify that the geocoder API was created
    expect(mockCreateGeocoderApi).toHaveBeenCalledWith();
  });
});
