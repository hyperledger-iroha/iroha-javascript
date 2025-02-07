import * as h3 from 'h3'
import { listen } from 'listhen'

import * as lib from '../lib.ts'
import { KeyPair } from '@iroha2/crypto'
import { createGenesis } from '@iroha2/test-configuration/node'

export async function run(ports: { server: number; toriiApi: number; toriiP2p: number }) {
  let peer: lib.StartPeerReturn | undefined

  const app = h3.createApp({ debug: true })

  const router = h3
    .createRouter()
    .post(
      '/start',
      h3.eventHandler(async (event) => {
        if (peer) {
          h3.setResponseStatus(event, 400)
          return 'Kill first'
        }

        const keypair = KeyPair.random()
        const genesis = await createGenesis({ topology: [keypair.publicKey()] })
        peer = await lib.startPeer({ genesis, ports: { api: ports.toriiApi, p2p: ports.toriiP2p }, keypair })

        h3.setResponseStatus(event, 204)
        await h3.send(event)
      }),
    )
    .post(
      '/kill',
      h3.eventHandler(async (event) => {
        if (!peer) {
          h3.setResponseStatus(event, 204)
          return 'Not alive'
        }

        await peer.kill()
        peer = undefined

        h3.setResponseStatus(event, 204)
        await h3.send(event)
      }),
    )
    .get(
      '/is-alive',
      h3.eventHandler(async () => {
        return { isAlive: peer?.isAlive() ?? false }
      }),
    )

  app.use(router)
  const { server: port } = ports

  try {
    await listen(h3.toNodeListener(app), { port: { port, alternativePortRange: [port, port], random: false } })
  } finally {
    await peer?.kill()
  }
}
