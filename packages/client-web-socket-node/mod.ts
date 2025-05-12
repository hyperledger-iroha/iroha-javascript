/**
 * Client WebSocket adapter for Node.js (and Bun). Wrapper over the [`npm:ws`](https://www.npmjs.com/package/ws).
 *
 * @example Use with `Client`
 *
 * ```ts
 * import ws from '@iroha/client-web-socket-node'
 * import { Client, type CreateClientParams } from '@iroha/client'
 *
 * function createClient(params: CreateClientParams) {
 *   const client = new Client({
 *      ...params,
 *
 *      // provide WebSocket adapter here
 *      ws,
 *   })
 * }
 * ```
 *
 * @example Use with `WebSocketAPI`
 *
 * ```ts
 * import ws from '@iroha/client-web-socket-node'
 * import { WebSocketAPI } from '@iroha/client'
 *
 * new WebSocketAPI(new URL('http://localhost:8080'), ws)
 * ```
 *
 * @module
 */

import type { IncomingData, IsomorphicWebSocketAdapter } from '@iroha/client/web-socket'
import WebSocket from 'ws'
import { Buffer } from 'node:buffer'

function handleIncomingData(
  data: string | Buffer | ArrayBuffer | Buffer[],
): IncomingData {
  if (Buffer.isBuffer(data)) {
    return new Uint8Array(data)
  }

  console.error('Bad incoming data:', data)
  throw new Error('Unable to parse incoming data')
}

/**
 * The WebSocket adapter.
 */
const adapter: IsomorphicWebSocketAdapter = {
  initWebSocket: (params) => {
    const socket = new WebSocket(params.url)

    socket.onopen = params.onopen
    socket.onclose = params.onclose
    socket.onmessage = (msg: any) => {
      params.onmessage({
        data: handleIncomingData(msg.data),
      })
    }
    socket.onerror = params.onerror

    return {
      isClosed: () => socket.readyState === socket.CLOSED,
      send: (data) => socket.send(data),
      close: (code, reason) => socket.close(code, reason),
    }
  },
}

export default adapter
