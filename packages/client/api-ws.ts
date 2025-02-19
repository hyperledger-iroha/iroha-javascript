import type Emittery from 'emittery'
import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import { ENDPOINT_BLOCKS_STREAM, ENDPOINT_EVENTS } from './const.ts'
import type { SocketEmitMapBase } from './util.ts'
import { setupWebSocket } from './util.ts'
import { type IsomorphicWebSocketAdapter, nativeWS } from './web-socket/mod.ts'

export class WebSocketAPI {
  public readonly toriiBaseURL: URL
  public readonly adapter: IsomorphicWebSocketAdapter

  /**
   * Create an instance.
   * @param toriiBaseURL Torii base URL
   * @param adapter A custom WebSocket adapter. Uses native by default.
   * See the {@linkcode [web-socket]} module for more details.
   */
  public constructor(toriiBaseURL: URL, adapter?: IsomorphicWebSocketAdapter) {
    this.toriiBaseURL = toriiBaseURL
    this.adapter = adapter ?? nativeWS
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
      adapter: this.adapter,
    })

    ee.on('open', () => {
      sendRaw(
        getCodec(dm.BlockSubscriptionRequest).encode({
          fromBlockHeight: params?.fromBlockHeight?.map(BigInt) ?? new dm.NonZero(1n),
        }).buffer,
      )
    })

    ee.on('message', (raw) => {
      const block = getCodec(dm.SignedBlock).decode(raw)
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
      adapter: this.adapter,
    })

    ee.on('open', () => {
      sendRaw(getCodec(dm.EventSubscriptionRequest).encode({ filters: params?.filters ?? [] }).buffer)
    })

    ee.on('message', (raw) => {
      const event = getCodec(dm.EventBox).decode(raw)
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
