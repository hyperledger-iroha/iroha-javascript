import type { IncomingData, IsomorphicWebSocketAdapter } from './types.ts'
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

export const adapter: IsomorphicWebSocketAdapter = {
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
