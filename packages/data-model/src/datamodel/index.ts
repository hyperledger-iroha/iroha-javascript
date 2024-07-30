export * from './core'
export * from './generated'

import * as core from './core'
import { structCodec } from '../core'

export interface Uptime {
  secs: bigint
  nanos: number
}

export const Uptime$codec = structCodec<Uptime>([
  ['secs', core.Compact$codec],
  ['nanos', core.U32$codec],
])

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

export const Status$codec = structCodec<Status>([
  ['peers', core.Compact$codec],
  ['blocks', core.Compact$codec],
  ['txsAccepted', core.Compact$codec],
  ['txsRejected', core.Compact$codec],
  ['uptime', Uptime$codec],
  ['viewChanges', core.Compact$codec],
  ['queueSize', core.Compact$codec],
])
