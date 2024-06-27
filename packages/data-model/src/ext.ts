import { toCodec } from './core'
import * as datamodel from './datamodel'
import * as crypto from '@iroha2/crypto-core'

// TODO: it should be somehow nicely integrated into the relevant types
export interface DefineTransactionPayloadParams {
  chain: string
  authority: datamodel.AccountId
  executable: datamodel.Executable
  ttl?: datamodel.NonZero<datamodel.U64>
  /**
   * @default Date.now()
   */
  creationTime?: bigint
  /**
   * @default // none
   */
  nonce?: datamodel.NonZero<datamodel.U32>
  metadata?: datamodel.Metadata
}

// TODO: this should be `TransactionPayload.define`
export function defineTxPayload(params: DefineTransactionPayloadParams): datamodel.TransactionPayload {
  return {
    chain: params.chain,
    authority: params.authority,
    instructions: params.executable,
    timeToLiveMs: params.ttl ? datamodel.Option.Some(params.ttl) : datamodel.Option.None(),
    nonce: params?.nonce ? datamodel.Option.Some(params.nonce) : datamodel.Option.None(),
    metadata: params?.metadata ?? new Map(),
    creationTimeMs: params.creationTime ?? BigInt(Date.now()),
  }
}

export function algorithmFromCrypto(algorithm: crypto.Algorithm): datamodel.Algorithm {
  switch (algorithm) {
    case 'ed25519':
      return datamodel.Algorithm.Ed25519
    case 'secp256k1':
      return datamodel.Algorithm.Secp256k1
    case 'bls_small':
      return datamodel.Algorithm.BlsSmall
    case 'bls_normal':
      return datamodel.Algorithm.BlsNormal
  }
}

export function algorithmToCrypto(algorithm: datamodel.Algorithm): crypto.Algorithm {
  switch (algorithm.tag) {
    case 'Ed25519':
      return 'ed25519'
    case 'Secp256k1':
      return 'secp256k1'
    case 'BlsSmall':
      return 'bls_small'
    case 'BlsNormal':
      return 'bls_normal'
  }
}

export function publicKeyFromCrypto(publicKey: crypto.PublicKey): datamodel.PublicKey {
  return {
    algorithm: algorithmFromCrypto(publicKey.algorithm),
    payload: publicKey.payload(),
  }
}

export function signatureToCrypto(signature: datamodel.Signature): crypto.Signature {
  return crypto.Signature.fromBytes(crypto.Bytes.array(signature.payload))
}

export function signatureFromCrypto(signature: crypto.Signature): datamodel.Signature {
  return { payload: signature.payload() }
}

/**
 * The one that is used for e.g. {@link datamodel.TransactionEventFilter}
 */
export function transactionHash(tx: datamodel.SignedTransaction): crypto.Hash {
  const bytes = toCodec(datamodel.SignedTransaction).encode(tx)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

// export function

export function signTransaction(
  payload: datamodel.TransactionPayload,
  privateKey: crypto.PrivateKey,
): datamodel.SignedTransaction {
  return crypto.freeScope(() => {
    const payloadBytes = toCodec(datamodel.TransactionPayload).encode(payload)
    const signature = privateKey.sign(crypto.Bytes.array(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).bytes()))
    return datamodel.SignedTransaction.V1({ payload, signature: signatureFromCrypto(signature) })
  })
}

// TODO: other crypto conversions? hash?
