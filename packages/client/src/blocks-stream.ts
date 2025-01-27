import type Emittery from 'emittery'
import Debug from 'debug'
import { BlockSubscriptionRequest, NonZero, SignedBlock, codecOf } from '@iroha2/data-model'
import { ENDPOINT_BLOCKS_STREAM } from './const'
import type { SocketEmitMapBase } from './util'
import { setupWebSocket } from './util'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'

const debug = Debug('@iroha2/client:blocks-stream')

export interface SetupBlocksStreamParams {
  toriiURL: string
  adapter: IsomorphicWebSocketAdapter
  fromBlockHeight?: NonZero<number | bigint>
}

export interface BlocksStreamEmitteryMap extends SocketEmitMapBase {
  block: SignedBlock
}

export interface SetupBlocksStreamReturn {
  stop: () => Promise<void>
  isClosed: () => boolean
  ee: Emittery<BlocksStreamEmitteryMap>
}

export async function setupBlocksStream(params: SetupBlocksStreamParams): Promise<SetupBlocksStreamReturn> {
  const {
    ee,
    send: sendRaw,
    isClosed,
    close,
    accepted,
  } = setupWebSocket<BlocksStreamEmitteryMap>({
    baseURL: params.toriiURL,
    endpoint: ENDPOINT_BLOCKS_STREAM,
    parentDebugger: debug,
    adapter: params.adapter,
  })

  ee.on('open', () => {
    sendRaw(
      codecOf(BlockSubscriptionRequest).encode({
        fromBlockHeight: params.fromBlockHeight?.map(BigInt) ?? new NonZero(1n),
      }).buffer,
    )
  })

  ee.on('message', (raw) => {
    const block = codecOf(SignedBlock).decode(raw)
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
