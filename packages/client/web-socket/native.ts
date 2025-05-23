import type { IncomingData, IsomorphicWebSocketAdapter } from './types.ts'

async function handleIncomingData(data: any): Promise<IncomingData> {
  if (data instanceof Blob) {
    const buff = await new Response(data).arrayBuffer()
    return new Uint8Array(buff)
  }

  console.error('Bad incoming data:', data)
  throw new Error('Unable to parse incoming data')
}

/**
 * Implementation of {@linkcode IsomorphicWebSocketAdapter} based on the native {@link WebSocket}.
 */
const adapter: IsomorphicWebSocketAdapter = {
  initWebSocket: (params) => {
    const socket = new WebSocket(params.url)

    socket.onopen = params.onopen
    socket.onclose = params.onclose
    socket.onmessage = async (msg) => {
      params.onmessage({ data: await handleIncomingData(msg.data) })
    }
    socket.onerror = params.onerror

    return {
      send: (data) => socket.send(data),
      close: (code, reason) => socket.close(code, reason),
      isClosed: () => socket.readyState === socket.CLOSED,
    }
  },
}

export default adapter
