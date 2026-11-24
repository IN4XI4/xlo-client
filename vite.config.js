import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['flowbite-react', 'flowbite'],
          'vendor-icons': ['react-icons'],
          'vendor-http': ['axios'],
          'vendor-analytics': ['react-ga4'],
        }
      }
    }
  },
  plugins: [
    react(),
  ]
});