// @ts-self-types="./wasm/iroha_crypto_wasm.d.ts"

export * from './wasm/iroha_crypto_wasm.internal.js'
import * as internal from './wasm/iroha_crypto_wasm.internal.js'

const imports = { './iroha_crypto_wasm.internal.js': internal }

let wasm

try {
  wasm = await import('./wasm/iroha_crypto_wasm.wasm')
  if (!(typeof wasm === 'object' && typeof wasm.__wbindgen_start === 'function')) {
    throw 'not module'
  }
} catch (errImport) {
  try {
    const response = fetch(new URL('./wasm/iroha_crypto_wasm.wasm', import.meta.url))
    const { instance } = await WebAssembly.instantiateStreaming(response, imports)
    wasm = instance.exports
  } catch (errFetch) {
    try {
      const fs = await import(
        // turn off Vite warning https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility
        /* @vite-ignore */
        'node' + ':fs'
      )
      const bytes = fs.readFileSync(new URL('./wasm/iroha_crypto_wasm.wasm', import.meta.url))
      const wasmModule = new WebAssembly.Module(bytes)
      const wasmInstance = new WebAssembly.Instance(wasmModule, imports)
      wasm = wasmInstance.exports
    } catch (errNodeFs) {
      console.error(
        'Unable to import/load `iroha_crypto_wasm.wasm`. There are a few ways to fix it:\n' +
          ` - If you are using a bundler such as Vite, consider using "vite-plugin-wasm" to enable direct imports of \`.wasm\` modules. ` +
          `This documentation could help: https://vite.dev/guide/features#webassembly\n` +
          ` - If you are using importing directly in Browser, consider using https://github.com/guybedford/es-module-shims\n` +
          `Below are collected errors:\n`,
        ` - when tried import() with .wasm:`,
        errImport,
        `\n - when tried fetch():`,
        errFetch,
        `\n - when tried import('node:fs') + readFileSync:`,
        errNodeFs,
      )
      throw new TypeError('Could not import `iroha_crypto_wasm.wasm`')
    }
  }
}

internal.__wbg_set_wasm(wasm)
wasm.__wbindgen_start()
