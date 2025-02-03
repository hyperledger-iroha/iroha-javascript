import { init, wasmPkg } from '@iroha2/crypto-target-web'
import { setWASM } from '@iroha2/crypto-core'

await init()
setWASM(wasmPkg)
