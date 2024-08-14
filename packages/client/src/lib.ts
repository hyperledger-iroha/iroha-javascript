/**
 * @module @iroha2/client
 */

/**
 * @packageDocumentation
 *
 * Client library to interact with Iroha v2 Peer. Library implements Transactions, Queries,
 * Events, Status & Health check.
 */

import type { KeyPair } from '@iroha2/crypto-core'
import { freeScope } from '@iroha2/crypto-core'
import { datamodel, signTransaction, transactionHash } from '@iroha2/data-model'
import type { Except } from 'type-fest'
import type { SetupBlocksStreamParams } from './blocks-stream'
import { setupBlocksStream } from './blocks-stream'
import {
  ENDPOINT_CONFIGURATION,
  ENDPOINT_HEALTH,
  ENDPOINT_METRICS,
  ENDPOINT_STATUS,
  ENDPOINT_TRANSACTION,
  HEALTHY_RESPONSE,
} from './const'
import type { SetupEventsParams } from './events'
import { setupEvents } from './events'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'
import defer from 'p-defer'
import type { z } from 'zod'
import { doQuery, type QueryOutput, type QueryPayload } from './query'

type Fetch = typeof fetch

export interface SetPeerConfigParams {
  logger: {
    level: datamodel.LogLevel
  }
}

export interface CreateClientParams {
  http: Fetch
  ws: IsomorphicWebSocketAdapter
  toriiURL: string
  chain: z.input<typeof datamodel.ChainId$schema>
  accountDomain: z.input<typeof datamodel.DomainId$schema>
  accountKeyPair: KeyPair
}

export interface SubmitParams {
  /**
   * Whether to wait for the transaction to be accepted/rejected/expired.
   * @default false
   */
  verify?: boolean
  verifyAbort?: AbortSignal
  payload?: Except<z.input<typeof datamodel.TransactionPayload$schema>, 'chain' | 'authority' | 'instructions'>
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
  public reason: datamodel.TransactionRejectionReason

  public constructor(reason: datamodel.TransactionRejectionReason) {
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
  public reason: datamodel.ValidationFail

  public constructor(reason: datamodel.ValidationFail) {
    super('Query validation failed')
    this.reason = reason
  }
}

export class Client {
  public params: CreateClientParams
  // public readonly signer: Signer

  public constructor(params: CreateClientParams) {
    this.params = params
  }

  public accountId(): datamodel.AccountId {
    return freeScope(() =>
      datamodel.AccountId({
        domain: this.params.accountDomain,
        signatory: this.params.accountKeyPair.publicKey(),
      }),
    )
  }

  public async submit(instructions: z.input<typeof datamodel.Executable$schema>, params?: SubmitParams) {
    const payload = datamodel.TransactionPayload({
      chain: this.params.chain,
      authority: this.accountId(),
      instructions,
      ...params?.payload,
    })
    const tx = freeScope(() => signTransaction(payload, this.params.accountKeyPair.privateKey()))

    if (params?.verify) {
      const hash = freeScope(() => transactionHash(tx).payload())
      const stream = await this.eventsStream({
        filters: [
          // TODO: include "status" when Iroha API is fixed about it
          datamodel.EventFilterBox({
            t: 'Pipeline',
            value: {
              t: 'Transaction',
              value: {
                // FIXME: fix data model, allow `null | Hash`
                hash: { Some: hash },
                // TODO: specify `status`, but now it requires `reason` which is Iroha API design problem
              },
            },
          }),
        ],
      })

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const deferred = defer<void>()
      stream.ee.on('event', (event) => {
        if (event.t === 'Pipeline' && event.value.t === 'Transaction') {
          const txEvent = event.value.value
          if (txEvent.status.t === 'Approved') deferred.resolve()
          else if (txEvent.status.t === 'Rejected') deferred.reject(new TransactionRejectedError(txEvent.status.value))
          else if (txEvent.status.t === 'Expired') deferred.reject(new TransactionExpiredError())
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
        await submitTransaction(this.toriiRequestRequirements, tx),
        deferred.promise.finally(() => {
          stream.stop()
        }),
        abortPromise,
      ])
    } else {
      await submitTransaction(this.toriiRequestRequirements, tx)
    }
  }

  public query<
    Q extends keyof datamodel.QueryOutputMap | keyof datamodel.SingularQueryOutputMap,
    P extends QueryPayload<Q>,
  >(query: Q, params: P): QueryOutput<Q> {
    return doQuery(query, {
      ...params,
      authority: this.accountId(),
      // FIXME
      authorityPrivateKey: this.params.accountKeyPair.privateKey(),
      toriiURL: this.params.toriiURL,
    } /* FIXME */ as any)
  }

  public async getHealth(): Promise<HealthResult> {
    return getHealth(this.toriiRequestRequirements)
  }

  public async eventsStream(params?: Except<SetupEventsParams, 'adapter' | 'toriiURL'>) {
    return setupEvents({
      filters: params?.filters,
      toriiURL: this.params.toriiURL,
      adapter: this.params.ws,
    })
  }

  public async blocksStream(params?: Except<SetupBlocksStreamParams, 'adapter' | 'toriiURL'>) {
    return setupBlocksStream({
      fromBlockHeight: params?.fromBlockHeight,
      toriiURL: this.params.toriiURL,
      adapter: this.params.ws,
    })
  }

  public async getStatus(): Promise<datamodel.Status> {
    return getStatus(this.toriiRequestRequirements)
  }

  public async getMetrics() {
    return getMetrics(this.toriiRequestRequirements)
  }

  public async setPeerConfig(params: SetPeerConfigParams) {
    return setPeerConfig(this.toriiRequestRequirements, params)
  }

  private get toriiRequestRequirements() {
    return { http: this.params.http, toriiURL: this.params.toriiURL }
  }
}

export interface ToriiHttpParams {
  http: Fetch
  toriiURL: string
}

export type HealthResult = { t: 'ok' } | { t: 'err'; err: unknown }

export async function getHealth({ http, toriiURL }: ToriiHttpParams): Promise<HealthResult> {
  let response: Response
  try {
    response = await http(toriiURL + ENDPOINT_HEALTH)
  } catch (err) {
    return { t: 'err', err }
  }

  ResponseError.assertStatus(response, 200)

  const text = await response.text()
  if (text !== HEALTHY_RESPONSE) {
    return { t: 'err', err: new Error(`Expected '${HEALTHY_RESPONSE}' response; got: '${text}'`) }
  }

  return { t: 'ok' }
}

export async function getStatus({ http, toriiURL }: ToriiHttpParams): Promise<datamodel.Status> {
  const response = await http(toriiURL + ENDPOINT_STATUS, {
    headers: { accept: 'application/x-parity-scale' },
  })
  await ResponseError.assertStatus(response, 200)
  return response.arrayBuffer().then((buffer) => datamodel.Status$codec.decode(new Uint8Array(buffer)))
}

export async function getMetrics({ http, toriiURL }: ToriiHttpParams) {
  const response = await http(toriiURL + ENDPOINT_METRICS)
  await ResponseError.assertStatus(response, 200)
  return response.text()
}

export async function setPeerConfig({ http, toriiURL }: ToriiHttpParams, params: SetPeerConfigParams) {
  const response = await http(toriiURL + ENDPOINT_CONFIGURATION, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await ResponseError.assertStatus(response, 202 /* ACCEPTED */)
}

export async function submitTransaction({ http, toriiURL }: ToriiHttpParams, tx: datamodel.SignedTransaction) {
  const body = datamodel.SignedTransaction$codec.encode(tx)
  const response = await http(toriiURL + ENDPOINT_TRANSACTION, { body, method: 'POST' })
  await ResponseError.assertStatus(response, 200)
}

export * from './events'
export * from './blocks-stream'
export * from './web-socket/types'
