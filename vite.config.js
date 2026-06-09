import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/products.js')) return 'catalog-fallback';
          if (id.includes('/src/checkout/')) return 'checkout';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      // Product image folders live in dist/, served by Express on 3001
      '/lehengas':       { target: 'http://localhost:3001', changeOrigin: true },
      '/kurtas':         { target: 'http://localhost:3001', changeOrigin: true },
      '/sarees':         { target: 'http://localhost:3001', changeOrigin: true },
      '/co-ords':        { target: 'http://localhost:3001', changeOrigin: true },
      '/tops':           { target: 'http://localhost:3001', changeOrigin: true },
      '/bottoms':        { target: 'http://localhost:3001', changeOrigin: true },
      '/dresses':        { target: 'http://localhost:3001', changeOrigin: true },
      '/dupatta-sets':   { target: 'http://localhost:3001', changeOrigin: true },
      '/suit-sets':      { target: 'http://localhost:3001', changeOrigin: true },
      '/mens':           { target: 'http://localhost:3001', changeOrigin: true },
      '/t-shirts':       { target: 'http://localhost:3001', changeOrigin: true },
      '/combos':         { target: 'http://localhost:3001', changeOrigin: true },
      '/banners':        { target: 'http://localhost:3001', changeOrigin: true },
      '/promo-banners':  { target: 'http://localhost:3001', changeOrigin: true },
      '/product-media':  { target: 'http://localhost:3001', changeOrigin: true },
      '/category-circles':  { target: 'http://localhost:3001', changeOrigin: true },
      '/category-cutouts':  { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  preview: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/product-media': { target: 'http://localhost:3001', changeOrigin: true },
      '/combos': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
