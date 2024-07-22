import { defineConfig } from 'vitest/config'
import { resolve } from './etc/util'

const NODE_WASM_ID = '@iroha2/crypto-target-node~rollup-wasm'

// Config for global monorepo unit-testing
export default defineConfig({
  resolve: {
    alias: {
      '@iroha2/i64-fixnum': resolve('./packages/i64-fixnum/src/lib.ts'),
      '@iroha2/data-model': resolve('./packages/data-model/src/lib.ts'),
      '@iroha2/crypto-core': resolve('./packages/crypto/packages/core/src/lib.ts'),
      '@iroha2/crypto-util': resolve('./packages/crypto/packages/util/src/lib.ts'),
      '@iroha2/crypto-target-node': resolve('./packages/crypto/packages/target-node/src/lib.ts'),
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
    setupFiles: ['./etc/vitest-setup-crypto-node.ts'],
  },
  plugins: [
    {
      name: 'crypto-target-node',
      resolveId(id) {
        if (id === NODE_WASM_ID) {
          return id
        }
      },
      load(id) {
        if (id === NODE_WASM_ID) {
          return (
            `import { createRequire } from 'module'\n` +
            `export const wasmPkg = createRequire(import.meta.url)('${resolve('packages/crypto/crypto-rs/wasm-pkg-nodejs/iroha_crypto.js')}')`
          )
        }
      },
    },
  ],
})
