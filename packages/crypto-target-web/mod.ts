/**
 * `iroha_crypto` WASM built for Web target (native Browser ESModule environment).
 *
 * @example
 * ```ts
 * import { setWASM } from '@iroha/core/crypto'
 * import { wasmPkg, init } from '@iroha/crypto-target-web'
 *
 * // this is necessary
 * await init()
 *
 * setWASM(wasmPkg)
 * ```
 *
 * @example
 * ```ts
 * import '@iroha/crypto-target-web/install'
 * ```
 *
 * @module
 */

import { setWASM } from '@iroha/core/crypto'
// @ts-types="./wasm-target/iroha_crypto.d.ts"
import * as wasmPkg from './wasm-target/iroha_crypto.js'
import init from './wasm-target/iroha_crypto.js'

/**
 * Shortcut to initialise and install the WASM.
 */
export async function install() {
  await init()
  setWASM(wasmPkg)
}

export { init, wasmPkg }
