import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/hua-wu-que/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../hua-wu-que',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5176,
  },
}))
