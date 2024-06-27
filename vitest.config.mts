import { defineConfig } from 'vitest/config'
import path from 'path'
import url from 'url'

const resolve = (...paths: string[]) => path.resolve(url.fileURLToPath(new URL('.', import.meta.url)), ...paths)

// Config for global monorepo unit-testing
export default defineConfig({
  resolve: {
    alias: {
      '@iroha2/i64-fixnum': resolve('./packages/i64-fixnum/src/lib.ts'),
      '@iroha2/data-model': resolve('./packages/data-model/src/lib.ts'),
      '@iroha2/crypto-core': resolve('./packages/crypto/packages/core/src/lib.ts'),
      '@iroha2/crypto-util': resolve('./packages/crypto/packages/util/src/lib.ts'),
      // '@iroha2/crypto-target-node': resolve('./packages/crypto/packages/target-node/src/lib.ts'),
    },
  },
  test: {
    include: ['**/*.spec.ts'],
    exclude: ['**/test/integration', '**/node_modules', '**/dist', '**/dist-tsc'],
    includeSource: [
      'packages/i64-fixnum/src/**/*.ts',
      'packages/client/src/**/*.ts',
      'packages/data-model/etc/**/*.ts',
    ],
  },
})
