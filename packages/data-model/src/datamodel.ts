// import { Duration } from './__generated__'
import { Compact, U32 } from './codecs'
import { structCodec, toCodec, wrapCodec } from './core'

export * from './__generated__'
export * from './codecs'

export interface Uptime {
  secs: bigint
  nanos: number
}

export const Uptime = wrapCodec(
  structCodec<Uptime>([
    ['secs', toCodec(Compact)],
    ['nanos', toCodec(U32)],
  ]),
)

/**
 * [`/status`](https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status) endpoint response
 */
export interface Status {
  peers: bigint
  blocks: bigint
  txsAccepted: bigint
  txsRejected: bigint
  uptime: Uptime
  viewChanges: bigint
  queueSize: bigint
}

export const Status = wrapCodec(
  structCodec<Status>([
    ['peers', toCodec(Compact)],
    ['blocks', toCodec(Compact)],
    ['txsAccepted', toCodec(Compact)],
    ['txsRejected', toCodec(Compact)],
    ['uptime', toCodec(Uptime)],
    ['viewChanges', toCodec(Compact)],
    ['queueSize', toCodec(Compact)],
  ]),
)
