/**
 * `iroha_crypto` WASM built for Node.js target.
 *
 * Works with Deno too, but requires `--allow-read` permission.
 *
 * @example
 * ```ts
 * import { setWASM } from '@iroha/core/crypto'
 * import { wasmPkg } from '@iroha/crypto-target-node'
 *
 * setWASM(wasmPkg)
 * ```
 *
 * @example
 * ```ts
 * import '@iroha/crypto-target-node/install'
 * ```
 *
 * @module
 */

import { setWASM } from '@iroha/core/crypto'
// @ts-types="./wasm-target/iroha_crypto.d.ts"
import wasmPkg from './wasm-target/iroha_crypto.js'

export { wasmPkg }

/**
 * Shortcut to `setWASM(wasmPkg)`.
 */
export function install() {
  setWASM(wasmPkg)
}
