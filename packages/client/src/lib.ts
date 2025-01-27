/**
 * @module @iroha2/client
 */

/**
 * @packageDocumentation
 *
 * Client library to interact with Iroha v2 Peer. Library implements Transactions, Queries,
 * Events, Status & Health check.
 */

import type { KeyPair, PrivateKey } from '@iroha2/crypto-core'
import * as dm from '@iroha2/data-model'
import type { Schema as DataModelSchema } from '@iroha2/data-model-schema'
import defer from 'p-defer'

import type { Except } from 'type-fest'
import type { SetupBlocksStreamParams } from './blocks-stream'
import { setupBlocksStream } from './blocks-stream'
import {
  ENDPOINT_CONFIGURATION,
  ENDPOINT_HEALTH,
  ENDPOINT_METRICS,
  ENDPOINT_SCHEMA,
  ENDPOINT_STATUS,
  ENDPOINT_TRANSACTION,
  HEALTHY_RESPONSE,
} from './const'
import type { SetupEventsParams } from './events'
import { setupEvents } from './events'
import { queryBatchStream } from './query'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'
import * as query from './query'
import { FindApi } from './generated/find-api'

type Fetch = typeof fetch

export interface SetPeerConfigParams {
  logger: {
    level: dm.Level['kind']
  }
}

export interface CreateClientParams {
  fetch?: Fetch
  ws: IsomorphicWebSocketAdapter
  toriiBaseURL: string
  chain: string
  accountDomain: dm.DomainId
  accountKeyPair: KeyPair
}

export interface SubmitParams {
  /**
   * Whether to wait for the transaction to be accepted/rejected/expired.
   * @default false
   */
  verify?: boolean
  verifyAbort?: AbortSignal
}

export interface TransactionPayloadParams {
  payload?: Except<dm.TransactionPayload, 'chain' | 'authority' | 'instructions'>
  creationTime?: dm.Timestamp
  timeToLive?: dm.NonZero<dm.Duration>
  nonce?: never
  metadata?: dm.Metadata
}

export class ResponseError extends Error {
  public static async assertStatus(response: Response, status: number) {
    if (response.status !== status) {
      let message = 'got an error response'
      if (/text\/plain/.test(response.headers.get('content-type') ?? '')) {
        message = await response.text()
      }
      throw new ResponseError(response, message)
    }
  }

  public constructor(response: Response, message: string) {
    super(`${response.status} (${response.statusText}): ${message}`)
  }
}

export class TransactionRejectedError extends Error {
  public reason: dm.TransactionRejectionReason

  public constructor(reason: dm.TransactionRejectionReason) {
    // TODO: parse reason into a specific message
    super('Transaction rejected')
    this.reason = reason
  }
}

export class TransactionExpiredError extends Error {
  public constructor() {
    super('Transaction expired')
  }
}

export class QueryValidationError extends Error {
  public reason: dm.ValidationFail

  public constructor(reason: dm.ValidationFail) {
    super('Query validation failed')
    this.reason = reason
  }
}

export class HttpTransport {
  public readonly toriiBaseURL: string
  public readonly fetch: Fetch

  public constructor(toriiBaseURL: string, fetch?: Fetch) {
    this.toriiBaseURL = toriiBaseURL
    this.fetch = fetch ?? globalThis.fetch
  }
}

export class TransactionHandle {
  private readonly client: Client
  private readonly tx: dm.SignedTransaction
  private readonly txHash: dm.HashWrap

  public constructor(tx: dm.SignedTransaction, client: Client) {
    this.client = client
    this.tx = tx
    this.txHash = dm.HashWrap.fromCrypto(dm.transactionHash(tx))
  }

  public get hash(): dm.HashWrap {
    return this.txHash
  }

  public async submit(params?: SubmitParams) {
    if (params?.verify) {
      // const hash = transactionHash(tx)
      const stream = await this.client.eventsStream({
        filters: [
          dm.EventFilterBox.Pipeline.Transaction({
            hash: this.txHash,
            blockHeight: null,
            // TODO: include "status" when Iroha API is fixed about it
            // FIXME: Iroha design issue
            //   If I want to filter by "rejected" status, I will also have to include a rejection reason into the
            //   filter. I could imagine users wanting to just watch for rejections with all possible reasons.
            status: null,
          }),
        ],
      })

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const deferred = defer<void>()
      stream.ee.on('event', (event) => {
        if (event.kind === 'Pipeline' && event.value.kind === 'Transaction') {
          const txEvent = event.value.value
          if (txEvent.status.kind === 'Approved') deferred.resolve()
          else if (txEvent.status.kind === 'Rejected')
            deferred.reject(new TransactionRejectedError(txEvent.status.value))
          else if (txEvent.status.kind === 'Expired') deferred.reject(new TransactionExpiredError())
        }
      })
      stream.ee.on('close', () => {
        deferred.reject(new Error('Events stream was unexpectedly closed'))
      })

      const abortPromise = new Promise<void>((resolve, reject) => {
        // FIXME: can this lead to a memory leak?
        params.verifyAbort?.addEventListener('abort', () => {
          reject(new Error('Aborted'))
        })
        stream.ee.once('close').then(() => resolve())
      })

      await Promise.all([
        await submitTransaction(this.client.httpTransport, this.tx),
        deferred.promise.finally(() => {
          stream.stop()
        }),
        abortPromise,
      ])
    } else {
      await submitTransaction(this.client.httpTransport, this.tx)
    }
  }
}

function* generateOutputTuples<Output>(response: dm.QueryOutputBatchBoxTuple): Generator<Output> {
  // FIXME: this is redundant in runtime, just a safe guard
  //   invariant(
  //     response.length === tuple.length,
  //     () => `Expected response to have exactly ${tuple.length} elements, got ${response.length}`,
  //   )
  //   for (let i = 0; i < tuple.length; i++) {
  //     invariant(
  //       response[i].kind === tuple[i],
  //       () => `Expected response to have type ${tuple[i]} at element ${i}, got ${response[i].kind}`,
  //     )
  //   }
  const len = response[0].value.length
  const tupleLen = response.length
  for (let i = 0; i < len; i++) {
    if (tupleLen === 1) yield response[0].value[i] as Output
    else yield Array.from({ length: tupleLen }, (_v, j) => response[j].value[i]) as Output
  }
}

export class Client {
  public params: CreateClientParams

  public readonly find: FindApi = new FindApi({
    execute: (x) => queryBatchStream(this.queryBaseParams(), x),
    executeSingular: (x) => query.querySingular(this.queryBaseParams(), x),
  })

  public constructor(params: CreateClientParams) {
    this.params = params
  }

  public authority(): dm.AccountId {
    return new dm.AccountId(
      dm.PublicKeyWrap.fromCrypto(this.params.accountKeyPair.publicKey()),
      this.params.accountDomain,
    )
  }

  public authorityPrivateKey(): PrivateKey {
    return this.params.accountKeyPair.privateKey()
  }

  public transaction(executable: dm.Executable, params?: TransactionPayloadParams): TransactionHandle {
    const payload: dm.TransactionPayload = {
      chain: this.params.chain,
      authority: this.authority(),
      instructions: executable,
      creationTime: params?.creationTime ?? dm.Timestamp.fromDate(new Date()),
      timeToLive: params?.timeToLive ?? new dm.NonZero(dm.Duration.fromMillis(100_000)),
      nonce: params?.nonce ?? null,
      metadata: params?.metadata ?? new Map(),
      ...params?.payload,
    }
    const tx = dm.signTransaction(payload, this.params.accountKeyPair.privateKey())

    return new TransactionHandle(tx, this)
  }

  private queryBaseParams(): query.BaseParams {
    return {
      authority: this.authority(),
      authorityPrivateKey: () => this.authorityPrivateKey(),
      ...this.httpTransport,
    }
  }

  public async health(): Promise<HealthResult> {
    return getHealth(this.httpTransport)
  }

  public async eventsStream(params?: Except<SetupEventsParams, 'adapter' | 'toriiURL'>) {
    return setupEvents({
      filters: params?.filters,
      toriiURL: this.params.toriiBaseURL,
      adapter: this.params.ws,
    })
  }

  public async blocksStream(params?: Except<SetupBlocksStreamParams, 'adapter' | 'toriiURL'>) {
    return setupBlocksStream({
      fromBlockHeight: params?.fromBlockHeight,
      toriiURL: this.params.toriiBaseURL,
      adapter: this.params.ws,
    })
  }

  public async status(): Promise<dm.Status> {
    return getStatus(this.httpTransport)
  }

  public async metrics() {
    return getMetrics(this.httpTransport)
  }

  /**
   * Only available if Iroha is compiled with certain feature flags (TODO document)
   */
  public async schema(): Promise<DataModelSchema> {
    const { fetch, toriiBaseURL } = this.httpTransport
    return fetch(toriiBaseURL + ENDPOINT_SCHEMA, { method: 'GET' }).then((x) => x.json())
  }

  public async setPeerConfig(params: SetPeerConfigParams) {
    return setPeerConfig(this.httpTransport, params)
  }

  /**
   * @internal
   */
  public get httpTransport(): HttpTransport {
    return new HttpTransport(this.params.toriiBaseURL, this.params.fetch)
  }
}

export interface ToriiHttpParams {
  fetch: Fetch
  toriiBaseURL: string
}

export type HealthResult = dm.VariantUnit<'healthy'> | dm.Variant<'error', unknown>

export async function getHealth({ fetch, toriiBaseURL }: ToriiHttpParams): Promise<HealthResult> {
  let response: Response
  try {
    response = await fetch(toriiBaseURL + ENDPOINT_HEALTH)
  } catch (err) {
    return { kind: 'error', value: err }
  }

  await ResponseError.assertStatus(response, 200)

  const text = await response.text()
  if (text !== HEALTHY_RESPONSE) {
    return { kind: 'error', value: new Error(`Expected '${HEALTHY_RESPONSE}' response; got: '${text}'`) }
  }

  return { kind: 'healthy' }
}

export async function getStatus({ fetch, toriiBaseURL }: ToriiHttpParams): Promise<dm.Status> {
  const response = await fetch(toriiBaseURL + ENDPOINT_STATUS, {
    headers: { accept: 'application/x-parity-scale' },
  })
  await ResponseError.assertStatus(response, 200)
  return response.arrayBuffer().then((buffer) => dm.codecOf(dm.Status).decode(new Uint8Array(buffer)))
}

export async function getMetrics({ fetch, toriiBaseURL }: ToriiHttpParams) {
  const response = await fetch(toriiBaseURL + ENDPOINT_METRICS)
  await ResponseError.assertStatus(response, 200)
  return response.text()
}

export async function setPeerConfig({ fetch, toriiBaseURL }: ToriiHttpParams, params: SetPeerConfigParams) {
  const response = await fetch(toriiBaseURL + ENDPOINT_CONFIGURATION, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await ResponseError.assertStatus(response, 202 /* ACCEPTED */)
}

export async function submitTransaction(http: HttpTransport, tx: dm.SignedTransaction) {
  const body = dm.codecOf(dm.SignedTransaction).encode(tx)
  const response = await http.fetch(http.toriiBaseURL + ENDPOINT_TRANSACTION, { body, method: 'POST' })
  await ResponseError.assertStatus(response, 200)
}

// TODO: peers endpoint

export * from './query'
export * from './events'
export * from './blocks-stream'
export * from './web-socket/types'
