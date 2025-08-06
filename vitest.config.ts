import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
      ],
    },
  },
  define: {
    'import.meta.env.VITE_OPENCAGE_API_KEY': '"test-api-key"',
    'import.meta.env.VITE_THUNDERFOREST_API_KEY': '"test-thunderforest-key"',
  },
});
