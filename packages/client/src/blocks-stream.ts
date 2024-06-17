import Emittery from 'emittery'
import Debug from 'debug'
import { datamodel, toCodec } from '@iroha2/data-model'
import { ENDPOINT_BLOCKS_STREAM } from './const'
import { SocketEmitMapBase, setupWebSocket } from './util'
import { IsomorphicWebSocketAdapter } from './web-socket/types'

const debug = Debug('@iroha2/client:blocks-stream')

export interface SetupBlocksStreamParams {
  toriiApiURL: string
  fromBlockHeight?: datamodel.NonZero<datamodel.U64>
  adapter: IsomorphicWebSocketAdapter
}

export interface BlocksStreamEmitteryMap extends SocketEmitMapBase {
  block: datamodel.SignedBlock
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
    baseURL: params.toriiApiURL,
    endpoint: ENDPOINT_BLOCKS_STREAM,
    parentDebugger: debug,
    adapter: params.adapter,
  })

  ee.on('open', () => {
    sendRaw(
      toCodec(datamodel.BlockSubscriptionRequest).encode({
        fromBlockHeight: params.fromBlockHeight ?? datamodel.NonZero.define(1n),
      }),
    )
  })

  ee.on('message', (raw) => {
    const block = toCodec(datamodel.SignedBlock).decode(raw)
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
