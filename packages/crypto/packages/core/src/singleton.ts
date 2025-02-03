import type { WasmPkg } from './types'

let __WASM: WasmPkg | null = null

export function setWASM(crypto: WasmPkg | null) {
  __WASM = crypto
}

function getWASM(): null | WasmPkg
function getWASM(force: true): WasmPkg
function getWASM(force?: true): null | WasmPkg {
  if (force && !__WASM) throw new Error('WASM is not set. Have you called `setWASM()`?')
  return __WASM
}

export { getWASM }
