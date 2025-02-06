import { startPeer } from '@iroha2/test-peer'
import * as colors from 'jsr:@std/fmt/colors'
import { KeyPair } from '@iroha2/crypto'
import { createGenesis } from '@iroha2/test-configuration/node'
import { install } from '@iroha2/crypto-target-node'

install()

const API = 8080
const P2P = 1337

const keypair = KeyPair.random()
const genesis = await createGenesis({ topology: [keypair.publicKey()] })

console.log(`Torii URL: ${colors.blue(`http://localhost:${API}`)}`)
await startPeer({ ports: { api: API, p2p: P2P }, genesis, keypair })
