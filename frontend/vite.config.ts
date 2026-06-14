import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// Tailwind v3 se integra via postcss.config.js — no como plugin de Vite
export default defineConfig({
  // En GitHub Pages el sitio vive en /nombre-repo/.
  // Localmente BASE_PATH no se define, por lo que queda en '/' (comportamiento por defecto).
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SanitIA',
        short_name: 'SanitIA',
        description: 'Plataforma de saneamiento sanitario',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\/api\/v1\/tasks/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tasks-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 8,
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
