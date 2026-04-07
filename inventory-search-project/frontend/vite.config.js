import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Proxy API requests in development to the backend server
    proxy: {
      '/search': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // Ensure the build output is served correctly by the backend
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
