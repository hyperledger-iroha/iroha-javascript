import { datamodel, toCodec } from '@iroha2/data-model'
import Emittery from 'emittery'
import Debug from 'debug'
import { SocketEmitMapBase, setupWebSocket } from './util'
import { ENDPOINT_EVENTS } from './const'
import { IsomorphicWebSocketAdapter } from './web-socket/types'

const debug = Debug('@iroha2/client:events')

export interface EventsEmitteryMap extends SocketEmitMapBase {
  event: datamodel.EventBox
}

export interface SetupEventsParams {
  toriiApiURL: string
  filters?: datamodel.EventFilterBox[]
  adapter: IsomorphicWebSocketAdapter
}

export interface SetupEventsReturn {
  stop: () => Promise<void>
  isClosed: () => boolean
  ee: Emittery<EventsEmitteryMap>
}

/**
 * Promise resolved when connection handshake is acquired
 */
export async function setupEvents(params: SetupEventsParams): Promise<SetupEventsReturn> {
  const {
    ee,
    isClosed,
    close,
    accepted,
    send: sendRaw,
  } = setupWebSocket<EventsEmitteryMap>({
    baseURL: params.toriiApiURL,
    endpoint: ENDPOINT_EVENTS,
    parentDebugger: debug,
    adapter: params.adapter,
  })

  ee.on('open', () => {
    sendRaw(toCodec(datamodel.EventSubscriptionRequest).encode({ filters: params.filters ?? [] }))
  })

  ee.on('message', (raw) => {
    const event = toCodec(datamodel.EventBox).decode(raw)
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
