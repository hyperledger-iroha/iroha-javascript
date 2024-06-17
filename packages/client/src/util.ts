import { CloseEvent, IsomorphicWebSocketAdapter, SendData, Event as WsEvent } from './web-socket/types'
import { Debugger } from 'debug'
import Emittery from 'emittery'
import { getCryptoAnyway } from './crypto-singleton'
import { Bytes, freeScope } from '@iroha2/crypto-core'

export function cryptoHash(input: Bytes): Uint8Array {
  return freeScope(() => getCryptoAnyway().Hash.hash(input).bytes())
}

export function transformProtocolInUrlFromHttpToWs(url: string): string {
  return url.replace(/^https?:\/\//, (substr) => {
    const isSafe = /https/.test(substr)
    return `ws${isSafe ? 's' : ''}://`
  })
}

export interface SocketEmitMapBase {
  open: WsEvent
  close: CloseEvent
  error: WsEvent
  message: ArrayBufferView
}

export function setupWebSocket<EmitMap extends SocketEmitMapBase>(params: {
  baseURL: string
  endpoint: string
  parentDebugger: Debugger
  adapter: IsomorphicWebSocketAdapter
}): {
  ee: Emittery<EmitMap>
  isClosed: () => boolean
  send: (data: SendData) => void
  close: () => Promise<void>
  accepted: () => Promise<void>
} {
  const debug = params.parentDebugger.extend('websocket')
  const url = transformProtocolInUrlFromHttpToWs(params.baseURL) + params.endpoint
  const ee = new Emittery<EmitMap>()

  const onceOpened = ee.once('open')
  const onceClosed = ee.once('close')

  debug('opening connection to %o', url)

  const { isClosed, send, close } = params.adapter.initWebSocket({
    url,
    onopen: (e) => {
      debug('connection opened')
      ee.emit('open', e)
    },
    onclose: (e) => {
      debug('connection closed; code: %o, reason: %o, was clean: %o', e.code, e.reason, e.wasClean)
      ee.emit('close', e)
    },
    onerror: (e) => {
      debug('connection error %o', e)
      ee.emit('error', e)
    },
    onmessage: ({ data }) => {
      debug('message', data)
      ee.emit('message', data)
    },
  })

  async function closeAsync() {
    if (isClosed()) return
    debug('closing connection...')
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
