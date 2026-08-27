import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages serves project sites from /<repo>/. The workflow sets
  // BASE_PATH; everywhere else the app lives at the root.
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
