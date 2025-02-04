import type Emittery from 'emittery'
import Debug from 'debug'
import * as dm from '@iroha2/data-model'
import { ENDPOINT_BLOCKS_STREAM, ENDPOINT_EVENTS } from './const'
import type { SocketEmitMapBase } from './util'
import { setupWebSocket } from './util'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'

const debugBlocksStream = Debug('@iroha2/client:blocks-stream')
const debugEvents = Debug('@iroha2/client:events')

export class WsTransport {
  public readonly toriiBaseURL: URL
  public readonly ws: IsomorphicWebSocketAdapter
}

export class WebSocketAPI {
  public readonly toriiBaseURL: URL
  public readonly adapter: IsomorphicWebSocketAdapter

  public constructor(toriiBaseURL: URL, adapter: IsomorphicWebSocketAdapter) {
    this.toriiBaseURL = toriiBaseURL
    this.adapter = adapter
  }

  public async blocksStream(params?: SetupBlocksStreamParams): Promise<SetupBlocksStreamReturn> {
    const {
      ee,
      send: sendRaw,
      isClosed,
      close,
      accepted,
    } = setupWebSocket<BlocksStreamEmitteryMap>({
      baseURL: this.toriiBaseURL,
      endpoint: ENDPOINT_BLOCKS_STREAM,
      parentDebugger: debugBlocksStream,
      adapter: this.adapter,
    })

    ee.on('open', () => {
      sendRaw(
        dm.codecOf(dm.BlockSubscriptionRequest).encode({
          fromBlockHeight: params?.fromBlockHeight?.map(BigInt) ?? new dm.NonZero(1n),
        }).buffer,
      )
    })

    ee.on('message', (raw) => {
      const block = dm.codecOf(dm.SignedBlock).decode(raw)
      ee.emit('block', block)
    })

    await accepted()

    return {
      ee:
        // Emittery typing bug
        ee as unknown as Emittery<BlocksStreamEmitteryMap>,
      stop: close,
      isClosed,
    }
  }

  public async events(params?: SetupEventsParams): Promise<SetupEventsReturn> {
    const {
      ee,
      isClosed,
      close,
      accepted,
      send: sendRaw,
    } = setupWebSocket<EventsEmitteryMap>({
      baseURL: this.toriiBaseURL,
      endpoint: ENDPOINT_EVENTS,
      parentDebugger: debugEvents,
      adapter: this.adapter,
    })

    ee.on('open', () => {
      sendRaw(dm.codecOf(dm.EventSubscriptionRequest).encode({ filters: params?.filters ?? [] }).buffer)
    })

    ee.on('message', (raw) => {
      const event = dm.codecOf(dm.EventBox).decode(raw)
      ee.emit('event', event)
    })

    await accepted()

    return {
      stop: close,
      ee:
        // Emittery typing bug :<
        ee as any,
      isClosed,
    }
  }
}

export interface SetupBlocksStreamParams {
  fromBlockHeight?: dm.NonZero<number | bigint>
}

export interface BlocksStreamEmitteryMap extends SocketEmitMapBase {
  block: dm.SignedBlock
}

export interface SetupBlocksStreamReturn {
  stop: () => Promise<void>
  isClosed: () => boolean
  ee: Emittery<BlocksStreamEmitteryMap>
}

export interface EventsEmitteryMap extends SocketEmitMapBase {
  event: dm.EventBox
}

export interface SetupEventsParams {
  filters?: dm.EventFilterBox[]
}

export interface SetupEventsReturn {
  stop: () => Promise<void>
  isClosed: () => boolean
  ee: Emittery<EventsEmitteryMap>
}
