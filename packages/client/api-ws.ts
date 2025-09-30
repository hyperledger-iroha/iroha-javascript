import type Emittery from 'emittery'
import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import { ENDPOINT_BLOCKS_STREAM, ENDPOINT_EVENTS } from './const.ts'
import type { SocketEmitMapBase } from './util.ts'
import { setupWebSocket } from './util.ts'
import { type IsomorphicWebSocketAdapter, nativeWS } from './web-socket/mod.ts'
import pDefer from 'p-defer'

/**
 * Lower-level client
 */
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

  // TODO: refine the API with async generator; document, provide code sample
  // TODO: provide dispose symbol
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
        getCodec(dm.BlockStreamMessage).encode(
          dm.BlockStreamMessage.Subscribe({
            height: params?.fromBlockHeight?.map(BigInt) ?? new dm.NonZero(1n),
          }),
        ).buffer,
      )
    })

    ee.on('message', (raw) => {
      const block = getCodec(dm.BlockStreamMessage).decode(raw)
      if (block.kind !== 'Block') throw new TypeError(`Expected a block, got BlockStreamMessage::${block.kind}`)
      ee.emit('block', block.value)
    })

    await accepted()

    const stream = lazyBlocks(
      ee,
      () => sendRaw(getCodec(dm.BlockStreamMessage).encode(dm.BlockStreamMessage.Next).buffer),
    )

    return {
      stream,
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

async function* lazyBlocks(
  ee: Emittery<BlocksStreamEmitteryMap>,
  sendNext: () => void,
): AsyncGenerator<dm.SignedBlock> {
  while (true) {
    sendNext()

    const resultDeferred = pDefer<{ t: 'cont'; block: dm.SignedBlock } | { t: 'halt' }>()

    ee.once('close').then(() => resultDeferred.resolve({ t: 'halt' }))
    ee.once('block').then((block) => resultDeferred.resolve({ t: 'cont', block }))

    const result = await resultDeferred.promise
    if (result.t === 'cont') yield result.block
    else return
  }
}

export interface SetupBlocksStreamParams {
  fromBlockHeight?: dm.NonZero<number | bigint>
}

export interface BlocksStreamEmitteryMap extends SocketEmitMapBase {
  block: dm.SignedBlock
}

export interface SetupBlocksStreamReturn {
  stream: AsyncGenerator<dm.SignedBlock>
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
