import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import path from 'path'
import { PORT_PEER_API, PORT_PEER_SERVER, PORT_VITE } from './etc/meta'

// const resolveInPkgSrc = (unscopedName: string, ...paths: string[]) =>
//   path.resolve(__dirname, '../../../../', unscopedName, ...paths)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
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
        target: `http://127.0.0.1:${PORT_PEER_API}`,
        rewrite: (path) => path.replace(/^\/torii/, ''),
      },
      '/peer-server': {
        ws: true,
        target: `http://127.0.0.1:${PORT_PEER_SERVER}`,
        rewrite: (path) => path.replace(/^\/peer-server/, ''),
      },
    },
  },
  preview: {
    port: PORT_VITE,
    strictPort: true,
  },
  // resolve: {
  //   alias: {
  //     '@iroha2/client-isomorphic-ws': resolveInPkgSrc('client-isomorphic-ws', 'dist/native.js'),
  //     '@iroha2/client-isomorphic-fetch': resolveInPkgSrc('client-isomorphic-fetch', 'dist/native.js'),
  //   },
  // },
})
