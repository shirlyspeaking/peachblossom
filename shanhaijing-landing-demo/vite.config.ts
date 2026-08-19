import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => ({
  plugins: [vue()],
  base: mode === 'production' ? '/shanhaijing-landing/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5180,
  },
  build: {
    outDir: '../shanhaijing-landing',
    emptyOutDir: true,
    chunkSizeWarningLimit: 700,
  },
}))
