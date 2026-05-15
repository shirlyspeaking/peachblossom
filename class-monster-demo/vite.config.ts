import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/class-monster/' : '/',
  plugins: [react()],
  build: {
    outDir: '../class-monster',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
  },
}));
