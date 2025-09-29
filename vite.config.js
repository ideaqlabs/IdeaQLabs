import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Maps @/... to src/... so imports like "@/App" work
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,  // Allows external access, useful for Render preview
    port: 3000
  },
  build: {
    outDir: 'dist', // Vite default, matches Render publish directory
  },
})
