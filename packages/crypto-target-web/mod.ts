/**
 * @module @iroha/crypto-target-web
 */

import { setWASM } from '@iroha/crypto'
// @ts-types="./wasm-target/iroha_crypto.d.ts"
import * as wasmPkg from './wasm-target/iroha_crypto.js'
import init from './wasm-target/iroha_crypto.js'

export async function install() {
  await init()
  setWASM(wasmPkg)
}

export { init, wasmPkg }
