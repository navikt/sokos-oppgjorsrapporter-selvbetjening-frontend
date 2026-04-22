import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  base: '/oppgjorsrapporter',
  build: {
    inlineStylesheets: 'always',
    assetsPrefix:
      'https://cdn.nav.no/oppgjorsrapporter/sokos-oppgjorsrapporter-selvbetjening-frontend',
  },
  integrations: [react()],
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
});
