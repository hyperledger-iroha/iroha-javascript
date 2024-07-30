import { z } from 'zod'
import * as crypto from '@iroha2/crypto-core'
import * as datamodel from './datamodel/index'

function hexChar(hex: string, index: number): number {
  const char = hex[index].toLowerCase()
  if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0)
  if (char >= 'a' && char <= 'f') return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
  throw new Error(`Expected 0..9/a..f/A..F, got '${hex[index]}' at position ${index}`)
}

export function* parseHex(hex: string): Generator<number> {
  for (let i = 0; i < hex.length; i += 2) {
    yield hexChar(hex, i) * 16 + hexChar(hex, i + 1)
  }
}

export function parseAccountId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('@')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'account id should have format `signatory@domain`' })
    return z.NEVER
  }
  const [signatory, domain] = parts
  const result = { domain, signatory }
  return result
}

export function parseAssetDefinitionId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('#')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'asset definition id should have format `name#domain`' })
    return z.NEVER
  }
  const [name, domain] = parts
  return { name, domain }
}

/**
 * Parses either `asset##account@domain` or `asset#domain1#account@domain2`
 */
export function parseAssetId(str: string, ctx: z.RefinementCtx) {
  const match = str.match(/^(.+)#(.+)?#(.+)@(.+)$/)
  if (!match) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'asset id should have format `asset#asset_domain#account@account_domain` ' +
        'or `asset##account@domain` (when asset & account domain are the same)',
    })
    return z.NEVER
  }
  const [, asset, domain1, account, domain2] = match
  // TODO
  return {
    account: parseAccountId(`${account}@${domain2}`, ctx),
    definition: { domain: domain1 ?? domain2, name: asset },
  }
}

export function parseMultihashPublicKey(hex: string, ctx: z.RefinementCtx) {
  let key: crypto.PublicKey
  try {
    key = crypto.PublicKey.fromMultihash(hex)
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Failed to parse PublicKey from a multihash hex: ${err}\n\n invalid input: "${hex}"`,
    })
    return z.NEVER
  }
  const result = { algorithm: key.algorithm, payload: key.payload() }
  key.free()
  return result
}

export class ExtractQueryOutputError extends Error {
  public kind: keyof datamodel.QueryOutputMap
  public response: datamodel.QueryResponse

  public constructor(kind: keyof datamodel.QueryOutputMap, response: datamodel.QueryResponse, message: string) {
    // TODO: improve message
    super(`Failed to extract output of query ${kind}: ${message}. This is a bug!`)
    this.kind = kind
    this.response = response
  }
}

// TODO: stronger signature?

function extractQueryOutput<
  Q extends keyof datamodel.QueryOutputMap,
  P extends 'Singular',
  B extends datamodel.SingularQueryOutputBox['t'],
>(
  query: Q,
  plurality: P,
  box: B,
): datamodel.QueryOutputMap[Q] extends (datamodel.SingularQueryOutputBox & { t: B })['value']
  ? (response: datamodel.QueryResponse) => datamodel.QueryOutputMap[Q]
  : never

function extractQueryOutput<
  Q extends keyof datamodel.QueryOutputMap,
  P extends 'Iterable',
  B extends datamodel.IterableQueryOutputBatchBox['t'],
>(
  query: Q,
  plurality: P,
  box: B,
): datamodel.QueryOutputMap[Q] extends (datamodel.IterableQueryOutputBatchBox & { t: B })['value']
  ? (response: datamodel.QueryResponse) => datamodel.QueryOutputMap[Q]
  : never

function extractQueryOutput<
  Q extends keyof datamodel.QueryOutputMap,
  P extends 'Singular' | 'Iterable',
  B extends datamodel.SingularQueryOutputBox['t'] | datamodel.IterableQueryOutputBatchBox['t'],
>(query: Q, plurality: P, box: B): (response: datamodel.QueryResponse) => datamodel.QueryOutputMap[Q] {
  return (response) => {
    if (plurality === 'Singular' && response.t === 'Singular' && response.value.t === box)
      return response.value.value as any
    if (plurality === 'Iterable' && response.t === 'Iterable' && response.value.batch.t === box)
      return response.value.batch.value
    throw new ExtractQueryOutputError(
      query,
      response,
      `Expected "${plurality}" kind of query response with "${box}" kind of output`,
    )
  }
}

export { extractQueryOutput }

/**
 * The one that is used for e.g. {@link datamodel.TransactionEventFilter}
 */
export function transactionHash(tx: datamodel.SignedTransaction): crypto.Hash {
  const bytes = datamodel.SignedTransaction$codec.encode(tx)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

export function signQuery(
  payload: datamodel.QueryRequestWithAuthority,
  privateKey: crypto.PrivateKey,
): datamodel.SignedQuery {
  const payloadBytes = datamodel.QueryRequestWithAuthority$codec.encode(payload)
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
