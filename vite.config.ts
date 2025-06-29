import { defineConfig } from 'vite'

export default defineConfig({
  base: '/webgpu-bayer-ordered-dithering/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})