import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.111:8090',
        changeOrigin: true,
        secure: false,
        // DO NOT add a rewrite rule like: rewrite: (path) => path.replace(/^\/api/, '')
        // We WANT the /api prefix to be sent to the backend.
      },
    },
  },
});
