import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the app works at any mount point
  // (e.g. GitHub Pages serves it from /cjw/). Safe because routing is hash-based.
  base: './',
  plugins: [react()],
})
