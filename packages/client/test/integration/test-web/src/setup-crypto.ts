import { wasmPkg, init } from '@iroha2/crypto-target-web'
import { setWASM } from '@iroha2/crypto-core'

await init()
setWASM(wasmPkg)
