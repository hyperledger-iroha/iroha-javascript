import { startPeer } from '@iroha/test-peer'
import * as colors from '@std/fmt/colors'
import { KeyPair } from '@iroha/core/crypto'
import { createGenesis } from '@iroha/test-configuration/node'

const API = 8080
const P2P = 1337

const keypair = KeyPair.random()
const genesis = await createGenesis({ topology: [keypair.publicKey()] })

console.log(`Torii URL: ${colors.blue(`http://localhost:${API}`)}`)
await startPeer({ ports: { api: API, p2p: P2P }, genesis, keypair })
