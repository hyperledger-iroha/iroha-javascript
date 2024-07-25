import type Emittery from 'emittery'
import Debug from 'debug'
import { datamodel } from '@iroha2/data-model'
import { ENDPOINT_BLOCKS_STREAM } from './const'
import type { SocketEmitMapBase } from './util'
import { setupWebSocket } from './util'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'

const debug = Debug('@iroha2/client:blocks-stream')

export interface SetupBlocksStreamParams {
  toriiURL: string
  adapter: IsomorphicWebSocketAdapter
  fromBlockHeight?: datamodel.NonZero<datamodel.U64>
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
    baseURL: params.toriiURL,
    endpoint: ENDPOINT_BLOCKS_STREAM,
    parentDebugger: debug,
    adapter: params.adapter,
  })

  ee.on('open', () => {
    sendRaw(
      datamodel.BlockSubscriptionRequest$codec.encode({
        fromBlockHeight: params.fromBlockHeight ?? datamodel.NonZero$schema(datamodel.U64$schema).parse(1n),
      }),
    )
  })

  ee.on('message', (raw) => {
    const block = datamodel.SignedBlock$codec.decode(raw)
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
