/**
 * @module @iroha2/crypto-target-node
 */

import { setWASM } from '@iroha2/crypto'
import wasmPkg from './wasm-target/iroha_crypto.js'

export { wasmPkg }

export function install() {
  setWASM(wasmPkg)
}
