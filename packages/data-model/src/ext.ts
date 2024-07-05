import * as datamodel from './datamodel'
import * as crypto from '@iroha2/crypto-core'

/**
 * The one that is used for e.g. {@link datamodel.TransactionEventFilter}
 */
export function transactionHash(tx: datamodel.SignedTransaction): crypto.Hash {
  const bytes = datamodel.SignedTransaction$codec.encode(tx)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

export function signQuery(payload: datamodel.ClientQueryPayload, privateKey: crypto.PrivateKey): datamodel.SignedQuery {
  const payloadBytes = datamodel.ClientQueryPayload$codec.encode(payload)
  const signature = privateKey.sign(crypto.Bytes.array(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload()))
  return {
    t: 'V1',
    value: {
      payload,
      signature: datamodel.Signature(signature),
    },
  }
}

export function signTransaction(
  payload: datamodel.TransactionPayload,
  privateKey: crypto.PrivateKey,
): datamodel.SignedTransaction {
  return crypto.freeScope(() => {
    const payloadBytes = datamodel.TransactionPayload$codec.encode(payload)
    const signature = privateKey.sign(crypto.Bytes.array(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload()))
    return {
      t: 'V1',
      value: {
        payload,
        signature: datamodel.Signature(signature),
      },
    }
  })
}
