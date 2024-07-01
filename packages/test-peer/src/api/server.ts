import * as h3 from 'h3'
import { listen } from 'listhen'

import * as lib from '../lib'

export async function run(port = 8765) {
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

        peer = await lib.startPeer()

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
  await listen(h3.toNodeListener(app), { port })
}
