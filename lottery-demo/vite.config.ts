import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/lottery/' : '/',
  plugins: [react()],
  build: {
    outDir: '../lottery',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5175,
  },
}));
