import type {
  ToriiRequirementsForApiHttp,
  ToriiRequirementsForApiWebSocket,
} from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/native'

const toriiRequirements: ToriiRequirementsForApiHttp & ToriiRequirementsForApiWebSocket =
  {
    apiURL: 'http://127.0.0.1:8080',
    ws: WS,
    fetch:
      // passing globally available `fetch`, but binding it to `window`
      // to avoid `TypeError: "'fetch' called on an
      //           object that does not implement interface Window."`
      fetch.bind(window),
  }
