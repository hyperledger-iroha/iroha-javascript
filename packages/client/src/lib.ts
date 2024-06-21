/**
 * @packageDocumentation
 *
 * Client library to interact with Iroha v2 Peer. Library implements Transactions, Queries,
 * Events, Status & Health check.
 */

import type { cryptoTypes } from '@iroha2/crypto-core'
import { Bytes, freeScope } from '@iroha2/crypto-core'
import type { Result } from '@iroha2/data-model'
import { type Enumerate, datamodel, toCodec, variant } from '@iroha2/data-model'
import type { Except } from 'type-fest'
import type { SetupBlocksStreamParams, SetupBlocksStreamReturn } from './blocks-stream'
import { setupBlocksStream } from './blocks-stream'
import {
  ENDPOINT_CONFIGURATION,
  ENDPOINT_HEALTH,
  ENDPOINT_METRICS,
  ENDPOINT_QUERY,
  ENDPOINT_STATUS,
  ENDPOINT_TRANSACTION,
  HEALTHY_RESPONSE,
} from './const'
import type { SetupEventsParams, SetupEventsReturn } from './events'
import { setupEvents } from './events'
import { cryptoHash } from './util'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'
import { getCryptoAnyway } from './crypto-singleton'

type Fetch = typeof fetch

type KeyPair = cryptoTypes.KeyPair

export interface SetPeerConfigParams {
  logger: {
    level: datamodel.Level extends Enumerate<infer E> ? keyof E : never
  }
}

export class Signer {
  public readonly keyPair: KeyPair
  public readonly accountId: datamodel.AccountId

  public constructor(accountId: datamodel.AccountId, keyPair: KeyPair) {
    this.accountId = accountId
    this.keyPair = keyPair
  }

  public sign(message: Bytes): datamodel.Signature {
    return freeScope(() => {
      const signature = getCryptoAnyway().Signature.create(this.keyPair.privateKey(), message)

      return {
        payload: signature.payload(),
      }
    })
  }
}

// #region Transaction helpers

export interface MakeTransactionPayloadParams {
  chain: string
  account: datamodel.AccountId
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

export function makeTransactionPayload(params: MakeTransactionPayloadParams): datamodel.TransactionPayload {
  return {
    chain: params.chain,
    authority: params.account,
    instructions: params.executable,
    timeToLiveMs: params.ttl ? datamodel.Option.Some(params.ttl) : datamodel.Option.None(),
    nonce: params?.nonce ? datamodel.Option.Some(params.nonce) : datamodel.Option.None(),
    metadata: params?.metadata ?? new Map(),
    creationTimeMs: params.creationTime ?? BigInt(Date.now()),
  }
}

export function computeTransactionHash(payload: datamodel.TransactionPayload): Uint8Array {
  return cryptoHash(Bytes.array(toCodec(datamodel.TransactionPayload).encode(payload)))
}

export function signTransaction(payload: datamodel.TransactionPayload, signer: Signer): datamodel.Signature {
  const hash = computeTransactionHash(payload)
  return signer.sign(Bytes.array(hash))
}

export function makeSignedTransaction(
  payload: datamodel.TransactionPayload,
  signer: Signer,
): datamodel.SignedTransaction {
  const signature = signTransaction(payload, signer)
  return datamodel.SignedTransaction.V1({
    payload,
    signature,
  })
}

export function executableIntoSignedTransaction(params: {
  signer: Signer
  executable: datamodel.Executable
  payloadParams: Except<MakeTransactionPayloadParams, 'account' | 'executable'>
}): datamodel.SignedTransaction {
  return makeSignedTransaction(
    makeTransactionPayload({
      executable: params.executable,
      account: params.signer.accountId,
      ...params.payloadParams,
    }),
    params.signer,
  )
}

// #endregion

// #region Query helpers

interface MakeQueryPayloadParams {
  account: datamodel.AccountId
  query: datamodel.QueryBox
  /**
   * @default PredicateBox.Raw(QueryOutputPredicate.Pass)
   */
  filter?: datamodel.PredicateBox
  timestampMs?: bigint
  sorting?: datamodel.Sorting
  pagination?: datamodel.Pagination
  fetchSize?: number
}

export function makeQueryPayload(params: MakeQueryPayloadParams): datamodel.ClientQueryPayload {
  return {
    authority: params.account,
    query: params.query,
    filter: params?.filter ?? datamodel.PredicateBox.Raw(datamodel.QueryOutputPredicate.Pass),
    fetchSize: {
      fetchSize: params.fetchSize
        ? datamodel.Option.Some(datamodel.NonZero.define(params.fetchSize))
        : datamodel.Option.None(),
    },
    sorting: params.sorting ?? { sortByMetadataKey: datamodel.Option.None() },
    pagination: params.pagination ?? { start: datamodel.Option.None(), limit: datamodel.Option.None() },
  }
}

export function computeQueryHash(payload: datamodel.ClientQueryPayload): Uint8Array {
  return cryptoHash(Bytes.array(toCodec(datamodel.ClientQueryPayload).encode(payload)))
}

export function signQuery(payload: datamodel.ClientQueryPayload, signer: Signer): datamodel.Signature {
  const hash = computeQueryHash(payload)
  return signer.sign(Bytes.array(hash))
}

export function makeSignedQuery(payload: datamodel.ClientQueryPayload, signer: Signer): datamodel.SignedQuery {
  const signature = signQuery(payload, signer)
  return datamodel.SignedQuery.V1({ payload, signature })
}

export function queryBoxIntoSignedQuery(params: {
  query: datamodel.QueryBox
  signer: Signer
  payloadParams?: Except<MakeQueryPayloadParams, 'account' | 'query'>
}): datamodel.SignedQuery {
  return makeSignedQuery(
    makeQueryPayload({
      query: params.query,
      account: params.signer.accountId,
      ...params.payloadParams,
    }),
    params.signer,
  )
}

// #endregion

// #region TORII

export interface ToriiRequirementsPartUrlApi {
  apiURL: string
}

export interface ToriiRequirementsPartHttp {
  fetch: Fetch
}

export interface ToriiRequirementsPartWebSocket {
  ws: IsomorphicWebSocketAdapter
}

export type ToriiRequirementsForApiHttp = ToriiRequirementsPartUrlApi & ToriiRequirementsPartHttp

export type ToriiRequirementsForApiWebSocket = ToriiRequirementsPartUrlApi & ToriiRequirementsPartWebSocket

export type ToriiQueryResult = Result<datamodel.BatchedResponse, datamodel.ValidationFail>

export interface ToriiApiHttp {
  submit: (prerequisites: ToriiRequirementsForApiHttp, tx: datamodel.SignedTransaction) => Promise<void>
  request: (prerequisites: ToriiRequirementsForApiHttp, query: datamodel.SignedQuery) => Promise<ToriiQueryResult>
  getHealth: (prerequisites: ToriiRequirementsForApiHttp) => Promise<Result<null, string>>
  setPeerConfig: (prerequisites: ToriiRequirementsForApiHttp, params: SetPeerConfigParams) => Promise<void>
  getStatus: (prerequisites: ToriiRequirementsForApiHttp) => Promise<datamodel.Status>
  getMetrics: (prerequisites: ToriiRequirementsForApiHttp) => Promise<string>
}

export interface ToriiApiWebSocket {
  listenForEvents: (
    prerequisites: ToriiRequirementsForApiWebSocket,
    params: Pick<SetupEventsParams, 'filters'>,
  ) => Promise<SetupEventsReturn>
  listenForBlocksStream: (
    prerequisites: ToriiRequirementsForApiWebSocket,
    params: Pick<SetupBlocksStreamParams, 'fromBlockHeight'>,
  ) => Promise<SetupBlocksStreamReturn>
}

export type ToriiOmnibus = ToriiApiHttp & ToriiApiWebSocket

export const Torii: ToriiOmnibus = {
  async submit(pre, tx) {
    const body = toCodec(datamodel.SignedTransaction).encode(tx)

    const response = await pre.fetch(pre.apiURL + ENDPOINT_TRANSACTION, {
      body,
      method: 'POST',
    })

    ResponseError.throwIfStatusIsNot(response, 200)
  },

  async request(pre, query) {
    const queryBytes = toCodec(datamodel.SignedQuery).encode(query)
    const response = await pre
      .fetch(pre.apiURL + ENDPOINT_QUERY, {
        method: 'POST',
        body: queryBytes!,
      })
      .then()

    const bytes = new Uint8Array(await response.arrayBuffer())

    if (response.status === 200) {
      // OK
      return variant('Ok', toCodec(datamodel.BatchedResponse).decode(bytes))
    } else {
      // ERROR
      const error = toCodec(datamodel.ValidationFail).decode(bytes)
      return variant('Err', error)
    }
  },

  async getHealth(pre) {
    let response: Response
    try {
      response = await pre.fetch(pre.apiURL + ENDPOINT_HEALTH)
    } catch (err) {
      return variant('Err', `Network error: ${String(err)}`)
    }

    ResponseError.throwIfStatusIsNot(response, 200)

    const text = await response.text()
    if (text !== HEALTHY_RESPONSE) {
      return variant('Err', `Expected '${HEALTHY_RESPONSE}' response; got: '${text}'`)
    }

    return variant('Ok', null)
  },

  async listenForEvents(pre, params: Pick<SetupEventsParams, 'filters'>) {
    return setupEvents({
      filters: params.filters,
      toriiApiURL: pre.apiURL,
      adapter: pre.ws,
    })
  },

  async listenForBlocksStream(pre, params: Pick<SetupBlocksStreamParams, 'fromBlockHeight'>) {
    return setupBlocksStream({
      fromBlockHeight: params.fromBlockHeight,
      toriiApiURL: pre.apiURL,
      adapter: pre.ws,
    })
  },

  async getStatus(pre): Promise<datamodel.Status> {
    // TODO
    const response = await pre.fetch(pre.apiURL + ENDPOINT_STATUS)
    ResponseError.throwIfStatusIsNot(response, 200)
    return response.arrayBuffer().then((buffer) => toCodec(datamodel.Status).decode(new Uint8Array(buffer)))
  },

  async getMetrics(pre) {
    return pre.fetch(pre.apiURL + ENDPOINT_METRICS).then((response) => {
      ResponseError.throwIfStatusIsNot(response, 200)
      return response.text()
    })
  },

  async setPeerConfig(pre, params: SetPeerConfigParams) {
    const response = await pre.fetch(pre.apiURL + ENDPOINT_CONFIGURATION, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    ResponseError.throwIfStatusIsNot(response, 200)
  },
}

export class ResponseError extends Error {
  public static throwIfStatusIsNot(response: Response, status: number) {
    if (response.status !== status) throw new ResponseError(response)
  }

  public constructor(response: Response) {
    super(`${response.status}: ${response.statusText}`)
  }
}

// #endregion

// #region Client

export class Client {
  public readonly signer: Signer

  public constructor(params: { signer: Signer }) {
    this.signer = params.signer
  }

  public async submitExecutable(
    pre: ToriiRequirementsForApiHttp,
    executable: datamodel.Executable,
    payloadParams: Except<MakeTransactionPayloadParams, 'account' | 'executable'>,
  ) {
    return Torii.submit(pre, executableIntoSignedTransaction({ executable, signer: this.signer, payloadParams }))
  }

  public async requestWithQueryBox(pre: ToriiRequirementsForApiHttp, query: datamodel.QueryBox) {
    return Torii.request(pre, queryBoxIntoSignedQuery({ query, signer: this.signer }))
  }
}

// #endregion

export * from './events'
export * from './blocks-stream'
export * from './crypto-singleton'
export * from './web-socket/types'
