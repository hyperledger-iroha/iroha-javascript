import * as coreDatamodel from './core-datamodel'
import { structCodec } from './core'

export * from './generated/index'
export * from './core-datamodel'

export interface Uptime {
  secs: bigint
  nanos: number
}

export const Uptime$codec = structCodec<Uptime>([
  ['secs', coreDatamodel.Compact$codec],
  ['nanos', coreDatamodel.U32$codec],
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
  ['peers', coreDatamodel.Compact$codec],
  ['blocks', coreDatamodel.Compact$codec],
  ['txsAccepted', coreDatamodel.Compact$codec],
  ['txsRejected', coreDatamodel.Compact$codec],
  ['uptime', Uptime$codec],
  ['viewChanges', coreDatamodel.Compact$codec],
  ['queueSize', coreDatamodel.Compact$codec],
])
