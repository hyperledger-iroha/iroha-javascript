import { defineConfig } from 'vitest/config'
import { resolve } from './etc/util'

// Config for global monorepo unit-testing
export default defineConfig({
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
    includeSource: ['packages/i64-fixnum/src/**/*.ts', 'packages/client/src/**/*.ts'],
    setupFiles: [resolve('etc/vitest-setup-crypto-node.ts')],
  },
})
