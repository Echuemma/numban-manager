import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Add this for proper typing and TS support in Node
/// <reference types="node" />

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@/features': path.resolve(__dirname, './src/features'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/styles': path.resolve(__dirname, './src/styles'),
      '@/types': path.resolve(__dirname, './src/shared/types'),
      '@/utils': path.resolve(__dirname, './src/shared/utils'),
      '@/services': path.resolve(__dirname, './src/shared/services'),
      '@/components': path.resolve(__dirname, './src/shared/components'),
      '@/hooks': path.resolve(__dirname, './src/shared/hooks'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
