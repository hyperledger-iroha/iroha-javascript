import type { CloseEvent, Event as WsEvent, IsomorphicWebSocketAdapter, SendData } from './web-socket/types.ts'
// import type { Debugger } from 'debug'
import Emittery from 'emittery'

export function transformProtocolInUrlFromHttpToWs(url: URL): URL {
  const { protocol } = url
  if (protocol === 'ws:' || protocol === 'wss:') return url
  if (protocol === 'http:') {
    const val = new URL(url)
    val.protocol = 'ws:'
    return val
  }
  if (protocol === 'https:') {
    const val = new URL(url)
    val.protocol = 'wss:'
    return val
  }

  throw new TypeError(`Expected protocol of ${url} to be on of: ws, wss, http, https`)
}

export function urlJoinPath(url: URL, path: string): URL {
  const val = new URL(url)
  if (val.pathname.endsWith('/') && path.startsWith('/')) val.pathname += path.slice(1)
  else val.pathname += path
  return val
}

export interface SocketEmitMapBase {
  open: WsEvent
  close: CloseEvent
  error: WsEvent
  message: ArrayBufferView
}

export function setupWebSocket<EmitMap extends SocketEmitMapBase>(params: {
  baseURL: URL
  endpoint: string
  // parentDebugger: Debugger
  adapter: IsomorphicWebSocketAdapter
}): {
  ee: Emittery<EmitMap>
  isClosed: () => boolean
  send: (data: SendData) => void
  close: () => Promise<void>
  accepted: () => Promise<void>
} {
  // const debug = params.parentDebugger.extend('websocket')
  const url = urlJoinPath(transformProtocolInUrlFromHttpToWs(params.baseURL), params.endpoint)
  const ee = new Emittery<EmitMap>()

  const onceOpened = ee.once('open')
  const onceClosed = ee.once('close')

  // debug('opening connection to %o', url)

  const { isClosed, send, close } = params.adapter.initWebSocket({
    url,
    onopen: (e) => {
      // debug('connection opened')
      ee.emit('open', e)
    },
    onclose: (e) => {
      // debug('connection closed; code: %o, reason: %o, was clean: %o', e.code, e.reason, e.wasClean)
      ee.emit('close', e)
    },
    onerror: (e) => {
      // debug('connection error %o', e)
      ee.emit('error', e)
    },
    onmessage: ({ data }) => {
      // debug('message', data)
      ee.emit('message', data)
    },
  })

  async function closeAsync() {
    if (isClosed()) return
    // debug('closing connection...')
    close()
    return ee.once('close').then(() => {})
  }

  async function accepted() {
    return new Promise<void>((resolve, reject) => {
      onceOpened.then(() => resolve())
      onceClosed.then(() => reject(new Error('Handshake acquiring failed - connection closed')))
    })
  }

  return { isClosed, send, close: closeAsync, ee, accepted }
}
