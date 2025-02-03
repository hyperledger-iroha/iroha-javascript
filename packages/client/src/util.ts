import type { CloseEvent, IsomorphicWebSocketAdapter, SendData, Event as WsEvent } from './web-socket/types'
import type { Debugger } from 'debug'
import Emittery from 'emittery'

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

async function* asyncIterFlatten<T>(iter: AsyncIterable<T[]>) {
  for await (const batch of iter) {
    for (const i of batch) {
      yield i
    }
  }
}

/**
 * A util to get just all items from all batches from an async iterator.
 */
export async function asyncIterAll<T>(iter: AsyncIterable<T[]>): Promise<T[]> {
  // TODO: replace with Array.fromAsync when available
  const acc: T[] = []
  for await (const i of asyncIterFlatten(iter)) {
    acc.push(i)
  }
  return acc
}

/**
 * A util extracting one and only one item from an async iterator.
 *
 * It is an error if the iterator yields more than one item or finishes without yielding anything.
 */
export async function asyncIterOne<T>(iter: AsyncIterable<T[]>): Promise<T> {
  const item = await asyncIterOneOpt(iter)
  if (!item) throw new Error('expected async iterator to yield exactly one item, but it yielded no items at all')
  return item.some
}

/**
 * A util extracting a single optional element from an async iterator.
 *
 * It is an error if the iterator yields more than a single item.
 */
export async function asyncIterOneOpt<T>(iter: AsyncIterable<T[]>): Promise<null | { some: T }> {
  // TODO: maybe simplify with collecting just all
  let item: null | { some: T } = null
  for await (const batch of iter) {
    if (!item && batch.length === 1) item = { some: batch[0] }
    else if ((item && batch.length) || (!item && batch.length > 1))
      throw new Error('expected async iterator with batches to yield exactly one item, but it yields more')
  }
  return item
}
