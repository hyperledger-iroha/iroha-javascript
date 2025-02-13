/**
 * @module @iroha/crypto-target-node
 */

import { setWASM } from '@iroha/core/crypto'
// @ts-types="./wasm-target/iroha_crypto.d.ts"
import wasmPkg from './wasm-target/iroha_crypto.js'

export { wasmPkg }

export function install() {
  setWASM(wasmPkg)
}
