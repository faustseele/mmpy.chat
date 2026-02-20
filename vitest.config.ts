import path from 'path';
/* TODO: fix this */
// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    /* Jest-like global variables (describe(), it(), expect()) */
    globals: true,
    /* for testing DOM, non-node.js component (window, document, HTMLElement) */
    environment: 'jsdom', 
    /* for global mocks */
    setupFiles: ['./src/app/tests/setup.ts'],
  },
  resolve: {
    alias: {
      /* syncs w/ tsconfig.json so vitest can find our files thru aliases */
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@features': path.resolve(__dirname, './src/features'),
      '@entities': path.resolve(__dirname, './src/entities'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
