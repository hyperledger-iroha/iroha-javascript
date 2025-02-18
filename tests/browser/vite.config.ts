import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import deno from '@deno/vite-plugin'
import wasm from 'vite-plugin-wasm'
import { PORT_PEER_API, PORT_PEER_SERVER, PORT_VITE } from './etc/meta.ts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), deno(), wasm()],
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
    port: PORT_VITE,
    strictPort: true,
    proxy: {
      '/torii': {
        ws: true,
        target: `http://localhost:${PORT_PEER_API}`,
        rewrite: (path) => path.replace(/^\/torii/, ''),
      },
      '/peer-server': {
        ws: true,
        target: `http://localhost:${PORT_PEER_SERVER}`,
        rewrite: (path) => path.replace(/^\/peer-server/, ''),
      },
    },
    fs: { allow: ['../../'] },
  },
  preview: {
    port: PORT_VITE,
    strictPort: true,
  },
})
