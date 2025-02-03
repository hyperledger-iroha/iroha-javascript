import * as dm from './items/index'

export interface TransactionPayloadParams {
  chain: dm.ChainId
  authority: dm.AccountId

  /**
   * @default dm.Timestamp.now()
   */
  creationTime?: dm.Timestamp
  /**
   * @default new dm.NonZero(dm.Duration.fromMillis(100_000))
   */
  timeToLive?: dm.NonZero<dm.Duration>
  /**
   * @default null
   */
  nonce?: dm.NonZero<dm.U32>
  /**
   * @default []
   */
  metadata?: dm.Metadata
}

/**
 * Build {@link dm.TransactionPayload}.
 *
 * @param executable
 * @param params
 * @returns
 */
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
