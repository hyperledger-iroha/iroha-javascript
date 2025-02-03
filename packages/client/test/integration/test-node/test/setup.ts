import { setWASM } from '@iroha2/crypto-core'
import { wasmPkg } from '@iroha2/crypto-target-node'

// For some reason, WASM resets each time between test files
setWASM(wasmPkg)
