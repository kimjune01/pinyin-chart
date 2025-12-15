// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://kimjune01.github.io',
  base: '/pinyin-chart',
  integrations: [react()],
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Separate service worker from main bundle
          manualChunks: {
            'sw': ['workbox-window']
          }
        }
      }
    }
  }
});