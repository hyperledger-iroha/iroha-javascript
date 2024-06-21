import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: { target: 'esnext' },
  build: {
    target: 'esnext',
    minify: false,
  },
})
