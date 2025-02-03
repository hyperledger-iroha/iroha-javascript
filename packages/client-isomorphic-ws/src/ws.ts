import type { IncomingData, initWebSocket as trueInit } from '../types'
import WebSocket from 'ws'

function handleIncomingData(data: string | Buffer | ArrayBuffer | Buffer[]): IncomingData {
  if (Buffer.isBuffer(data)) {
    return new Uint8Array(data)
  }

  console.error('Bad incoming data:', data)
  throw new Error('Unable to parse incoming data')
}

export const initWebSocket: typeof trueInit = (params) => {
  const socket = new WebSocket(params.url)

  socket.onopen = params.onopen
  socket.onclose = params.onclose
  socket.onmessage = (msg) => {
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
}
