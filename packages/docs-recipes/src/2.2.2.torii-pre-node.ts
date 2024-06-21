import type {
  ToriiRequirementsForApiHttp,
  ToriiRequirementsForApiWebSocket,
} from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/node'

import nodeFetch from 'node-fetch'
// another alternative
import { fetch as undiciFetch } from 'undici'

const toriiRequirements: ToriiRequirementsForApiHttp & ToriiRequirementsForApiWebSocket =
  {
    apiURL: 'http://127.0.0.1:8080',
    ws: WS,
    // type assertion is acceptable here
    // you can pass `undiciFetch` here as well
    fetch: nodeFetch as unknown as typeof fetch,
  }
