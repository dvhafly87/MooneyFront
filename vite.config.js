import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@img': '/src/img',
      '@route': '/src/route',
      '@assets': '/src/assets',
      '@css': '/src/css',
      '@contexts': '/src/contexts',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@services': '/src/services',
    },
  },
});
