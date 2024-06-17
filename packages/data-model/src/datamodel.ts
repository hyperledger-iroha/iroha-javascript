import { Duration } from './__generated__'
import { Compact } from './codecs'
import { structCodec, toCodec, wrapCodec } from './core'

export * from './__generated__'
export * from './codecs'

/**
 * [`/status`](https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status) endpoint response
 */
export interface Status {
  peers: bigint
  blocks: bigint
  txsAccepted: bigint
  txsRejected: bigint
  uptime: Duration
  viewChanges: bigint
  queueSize: bigint
}

export const Status = wrapCodec(
  structCodec<Status>([
    ['peers', toCodec(Compact)],
    ['blocks', toCodec(Compact)],
    ['txsAccepted', toCodec(Compact)],
    ['txsRejected', toCodec(Compact)],
    ['uptime', toCodec(Duration)],
    ['viewChanges', toCodec(Compact)],
    ['queueSize', toCodec(Compact)],
  ]),
)
