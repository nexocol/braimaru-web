import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  build: {
    rolldownOptions: {
      output: {
        // Vendor libraries change far less often than the storefront code: keeping them in their own
        // long-cache chunks avoids re-downloading ~400 kB on every deploy and keeps each chunk < 500 kB.
        advancedChunks: {
          groups: [
            { name: 'vendor-react', test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'vendor-gsap', test: /node_modules[\\/]gsap[\\/]/ },
            { name: 'vendor-motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/ },
          ],
        },
      },
    },
  },
});
