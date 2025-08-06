# Testing

This project uses [Vitest](https://vitest.dev/) for unit testing with full TypeScript support.

## Test Scripts

- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:ui` - Run tests with UI interface
- `pnpm test:coverage` - Run tests with coverage report

## Test Structure

### Test Files

- `src/geocoding.test.ts` - Tests for geocoding functionality
- `src/main.test.ts` - Tests for main application setup
- `src/test/setup.ts` - Test environment setup and mocks
- `src/test/utils.ts` - Test utilities and helpers

### Test Coverage

The tests provide comprehensive coverage of:

- ✅ Geocoding API integration
- ✅ Error handling
- ✅ Edge cases (empty queries, API errors)
- ✅ Map initialization
- ✅ Geocoder setup

## Running Tests

```bash
# Run all tests
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode (development)
pnpm test

# Run tests with UI
pnpm test:ui
```

## Test Utilities

The `src/test/utils.ts` file provides helper functions for creating mock data:

- `createMockGeocodingResponse()` - Creates mock API responses
- `createMockGeocodingResult()` - Creates mock geocoding results
- `createMockGeocoderConfig()` - Creates mock geocoder configurations

## Mocking Strategy

The tests use comprehensive mocking to isolate the code under test:

- **External APIs**: OpenCage API is mocked to avoid real network calls
- **Map Library**: Maplibre GL is mocked to avoid DOM dependencies
- **Environment Variables**: API keys are mocked for testing
- **Geocoder**: The Maplibre geocoder is mocked to test integration

## Adding New Tests

When adding new functionality:

1. Create test files alongside source files (e.g., `feature.ts` → `feature.test.ts`)
2. Use the provided test utilities for common patterns
3. Mock external dependencies appropriately
4. Test both success and error scenarios
5. Ensure good test coverage

## Example Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { myFunction } from './myModule';

describe('myModule', () => {
  it('should handle successful case', async () => {
    const result = await myFunction('test');
    expect(result).toBe('expected');
  });

  it('should handle errors gracefully', async () => {
    // Test error scenarios
  });
});
```
