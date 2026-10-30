import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['lib/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['lib/engine/**/*.ts'],
      exclude: ['lib/engine/types.ts', 'lib/engine/__tests__/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});