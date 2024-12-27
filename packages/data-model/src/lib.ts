/**
 * @module @iroha2/data-model
 */
/**
 * @packageDocumentation
 *
 * Iroha v2 data model codecs. Primarily contains the code generated by the `@scale-codec/definition-compiler`
 */

import * as types from './items/index'
import * as crypto from '@iroha2/crypto-core'

export * from './items/index'
export { type Codec, type CodecProvider, codecOf } from './codec'
export { SumTypeKind, SumTypeKindValue } from './util'

// export * from './core'

export class ExtractQueryOutputError extends Error {
  public query: string
  public expectedOutput: string
  public actualOutput: string

  public constructor(query: string, expectedOutput: string, actualOutput: string) {
    // TODO: improve message
    super(
      `Failed to extract output of query "${query}": expected "${expectedOutput}" data type, got "${actualOutput}". This is a bug!`,
    )
  }
}

export function extractQueryOutput<Q extends keyof types.QueryOutputMap>(
  query: Q,
  response: types.QueryResponse,
): types.QueryOutputMap[Q] {
  const outputKind = types.QueryOutputKindMap[query as keyof types.QueryOutputMap]
  if (response.kind === 'Iterable' && response.value.batch.kind === outputKind)
    return response.value.batch.value as types.QueryOutputMap[Q]
  // TODO throw good error
  throw new Error('unimplemented')
}

export function extractSingularQueryOutput<Q extends keyof types.SingularQueryOutputMap>(
  query: Q,
  response: types.QueryResponse,
): types.SingularQueryOutputMap[Q] {
  const outputKind = types.SingularQueryOutputKindMap[query as keyof types.SingularQueryOutputMap]
  if (response.kind === 'Singular' && response.value.kind === outputKind)
    return response.value.value as types.SingularQueryOutputMap[Q]
  // TODO throw good error
  throw new Error('unimplemented')
}

/**
 * The one that is used for e.g. {@link types.TransactionEventFilter}
 */
export function transactionHash(tx: types.SignedTransaction): crypto.Hash {
  const bytes = encode(tx, types.SignedTransaction)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

export function signQuery(payload: types.QueryRequestWithAuthority, privateKey: crypto.PrivateKey): types.SignedQuery {
  const payloadBytes = encode(payload, types.QueryRequestWithAuthority)
  const signature = privateKey.sign(crypto.Bytes.array(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload()))
  return {
    kind: 'V1',
    value: {
      payload,
      signature,
    },
  }
}

export function signTransaction(
  payload: types.TransactionPayload,
  privateKey: crypto.PrivateKey,
): types.SignedTransaction {
  const payloadBytes = encode(payload, types.TransactionPayload)
  const signature = privateKey.sign(crypto.Bytes.array(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload()))
  return {
    kind: 'V1',
    value: {
      payload,
      signature,
    },
  }
}

// TODO test
export function blockHash(header: types.BlockHeader): crypto.Hash {
  const encoded = encode(header, types.BlockHeader)
  return crypto.Hash.hash(crypto.Bytes.array(encoded))
}
