import { Except } from 'type-fest'
import * as dm from './items/index'

export interface TransactionPayloadParams {
  chain: dm.ChainId
  authority: dm.AccountId

  payload?: Except<dm.TransactionPayload, 'chain' | 'authority' | 'instructions'>
  creationTime?: dm.Timestamp
  timeToLive?: dm.NonZero<dm.Duration>
  nonce?: dm.NonZero<dm.U32>
  metadata?: dm.Metadata
}

export function buildTransactionPayload(
  executable: dm.Executable,
  params: TransactionPayloadParams,
): dm.TransactionPayload {
  const payload: dm.TransactionPayload = {
    chain: params.chain,
    authority: params.authority,
    instructions: executable,
    creationTime: params.creationTime ?? dm.Timestamp.fromDate(new Date()),
    timeToLive: params.timeToLive ?? new dm.NonZero(dm.Duration.fromMillis(100_000)),
    nonce: params.nonce ?? null,
    metadata: params.metadata ?? [],
  }

  return payload
}
