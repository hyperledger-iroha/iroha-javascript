import { run } from '@iroha/test-peer/api/server'
import { PORT_PEER_API, PORT_PEER_P2P, PORT_PEER_SERVER } from './meta.ts'

await run({ server: PORT_PEER_SERVER, toriiApi: PORT_PEER_API, toriiP2p: PORT_PEER_P2P })
