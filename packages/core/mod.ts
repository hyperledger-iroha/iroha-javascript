import * as crypto from '@iroha/core/crypto'
import { getCodec } from './traits.ts'
import * as types from '@iroha/core/data-model'

export * from './query.ts'
export * from './transaction.ts'
export * from './codec.ts'
export * from './util.ts'
export * from './traits.ts'

/**
 * The one that is used for e.g. {@link types.TransactionEventFilter}
 */
export function transactionHash(tx: types.SignedTransaction): crypto.Hash {
  const bytes = getCodec(types.SignedTransaction).encode(tx)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

export function signQuery(payload: types.QueryRequestWithAuthority, privateKey: crypto.PrivateKey): types.SignedQuery {
  const payloadBytes = getCodec(types.QueryRequestWithAuthority).encode(payload)
  const signature = privateKey.sign(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload)
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
  const payloadBytes = getCodec(types.TransactionPayload).encode(payload)
  const signature = privateKey.sign(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload)
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
  const encoded = getCodec(types.BlockHeader).encode(header)
  return crypto.Hash.hash(crypto.Bytes.array(encoded))
}
