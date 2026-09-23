import { defineConfig } from 'vitest/config';
import path from 'node:path';

const currentDir = import.meta.dirname || path.resolve('.');

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    include: [
      'tests/**/*.test.{js,jsx,ts,tsx}'
    ],
    isolate: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(currentDir, './frontend/src'),
      '@backend': path.resolve(currentDir, './src')
    }
  }
});
