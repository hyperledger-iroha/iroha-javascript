import { setWASM } from '@iroha2/crypto'
import { wasmPkg } from '@iroha2/crypto-target-node'
import { run } from '@iroha2/test-peer/api/server'
import { PORT_PEER_SERVER } from './meta.ts'

setWASM(wasmPkg)

await run(PORT_PEER_SERVER)
