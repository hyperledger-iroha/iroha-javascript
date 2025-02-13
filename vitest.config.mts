import { defineConfig } from 'vitest/config'
import deno from '@deno/vite-plugin'

// Config for global monorepo unit-testing
export default defineConfig({
  plugins: [deno()],
  test: {
    include: ['**/*.spec.ts'],
    exclude: [
      './.iroha',
      './tests/node',
      './tests/browser',
      './crypto-wasm',
      '**/node_modules',
      '**/dist',
      '**/dist-tsc',
    ],
  },
})
