import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@tanstack/react-query', '@tanstack/query-core'],
        },
      },
    },
  },
  plugins: [react() /* , splitVendorChunkPlugin() */],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 3000,
  },
});
