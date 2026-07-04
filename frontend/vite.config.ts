import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ai-powered-smart-city-integration.onrender.com/',
        changeOrigin: true,
      },
      '/ws': {
        target: 'wss://ai-powered-smart-city-integration.onrender.com/ws',
        ws: true,
      },
    },
  },
});
