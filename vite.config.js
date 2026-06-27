import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base é '/' em dev; nos builds de deploy passamos VITE_BASE=/<repo>/app/
// para os assets resolverem sob o subcaminho do GitHub Pages.
// (Service worker/PWA desativado por ora para evitar cache agressivo durante a demo.)
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: { port: 5173, host: true },
})
