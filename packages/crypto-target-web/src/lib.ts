/**
 * @module @iroha2/crypto-target-web
 */

import { setWASM } from '@iroha2/crypto'
import * as wasmPkg from './wasm-target/iroha_crypto.js'
import init from './wasm-target/iroha_crypto.js'

export { wasmPkg, init }

export async function install() {
  await init()
  setWASM(wasmPkg)
}
