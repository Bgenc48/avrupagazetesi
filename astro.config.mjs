import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bgenc48.github.io',
  base: '/avrupagazetesi',
  integrations: [sitemap()],
  output: 'static',
});
