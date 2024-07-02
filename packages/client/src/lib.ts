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
import type { DefineQueryPayloadParams, DefineTransactionPayloadParams, Result } from '@iroha2/data-model'
import {
  type Enumerate,
  datamodel,
  defineQueryPayload,
  defineTxPayload,
  publicKeyFromCrypto,
  signQuery,
  signTransaction,
  toCodec,
  transactionHash,
  variant,
} from '@iroha2/data-model'
import type { Except } from 'type-fest'
import type { SetupBlocksStreamParams } from './blocks-stream'
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
import type { SetupEventsParams } from './events'
import { setupEvents } from './events'
import type { IsomorphicWebSocketAdapter } from './web-socket/types'
import defer from 'p-defer'

type Fetch = typeof fetch

export interface SetPeerConfigParams {
  logger: {
    level: datamodel.Level extends Enumerate<infer E> ? keyof E : never
  }
}

export interface CreateClientParams {
  http: Fetch
  ws: IsomorphicWebSocketAdapter
  toriiURL: string
  chain: string
  accountDomain: string
  accountKeyPair: KeyPair
}

export interface SubmitParams {
  /**
   * Whether to wait for the transaction to be accepted/rejected/expired.
   * @default false
   */
  verify?: boolean
  payload?: Except<DefineTransactionPayloadParams, 'chain' | 'authority' | 'executable'>
}

export class ResponseError extends Error {
  public static throwIfStatusIsNot(response: Response, status: number) {
    if (response.status !== status) throw new ResponseError(response)
  }

  public constructor(response: Response) {
    super(`${response.status}: ${response.statusText}`)
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
    return {
      domain: { name: this.params.accountDomain },
      // TODO: optimise!
      signatory: freeScope(() => publicKeyFromCrypto(this.params.accountKeyPair.publicKey())),
    }
  }

  public async submit(executable: datamodel.Executable, params?: SubmitParams) {
    const payload = defineTxPayload({
      chain: this.params.chain,
      authority: this.accountId(),
      executable,
      ...params?.payload,
    })
    const tx = freeScope(() => signTransaction(payload, this.params.accountKeyPair.privateKey()))

    if (params?.verify) {
      const hash = freeScope(() => transactionHash(tx).bytes())
      const stream = await this.eventsStream({
        filters: [
          datamodel.EventFilterBox.Pipeline(
            datamodel.PipelineEventFilterBox.Transaction({
              hash: datamodel.Option.Some(
                // FIXME: use `Uint8Array` in data model here
                [...hash],
              ),
              blockHeight: datamodel.Option.None(),
              // FIXME: this is bad designed on Iroha side
              status: datamodel.Option.None(),
            }),
          ),
        ],
      })

      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const deferred = defer<void>()
      stream.ee.on('event', (event) => {
        const txEvent = event.as('Pipeline').as('Transaction')
        if (txEvent.status.tag === 'Approved') deferred.resolve()
        else if (txEvent.status.tag === 'Rejected')
          deferred.reject(new TransactionRejectedError(txEvent.status.content))
        else if (txEvent.status.tag === 'Expired') deferred.reject(new TransactionExpiredError())
      })
      stream.ee.on('close', () => {
        deferred.reject(new Error('Events stream was unexpectedly closed'))
      })

      await Promise.all([
        await submitTransaction(this.toriiRequestRequirements, tx),
        deferred.promise.finally(() => {
          stream.stop()
        }),
      ])
    } else {
      await submitTransaction(this.toriiRequestRequirements, tx)
    }
  }

  public async query(
    query: datamodel.QueryBox,
    params?: { payload: Except<DefineQueryPayloadParams, 'account' | 'query'> },
  ): Promise<datamodel.BatchedResponse> {
    const payload = defineQueryPayload({ query, account: this.accountId(), ...params?.payload })
    const signed = freeScope(() => signQuery(payload, this.params.accountKeyPair.privateKey()))
    const queryBytes = toCodec(datamodel.SignedQuery).encode(signed)
    const response = await this.params
      .http(this.params.toriiURL + ENDPOINT_QUERY, {
        method: 'POST',
        body: queryBytes!,
      })
      .then()

    const bytes = new Uint8Array(await response.arrayBuffer())

    if (response.status === 200) {
      return toCodec(datamodel.BatchedResponse).decode(bytes)
    } else {
      const reason = toCodec(datamodel.ValidationFail).decode(bytes)
      throw new QueryValidationError(reason)
    }
  }

  public async getHealth(): Promise<Result<null, string>> {
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

export async function getHealth({ http, toriiURL }: ToriiHttpParams): Promise<Result<null, string>> {
  let response: Response
  try {
    response = await http(toriiURL + ENDPOINT_HEALTH)
  } catch (err) {
    return variant('Err', `Network error: ${String(err)}`)
  }

  ResponseError.throwIfStatusIsNot(response, 200)

  const text = await response.text()
  if (text !== HEALTHY_RESPONSE) {
    return variant('Err', `Expected '${HEALTHY_RESPONSE}' response; got: '${text}'`)
  }

  return variant('Ok', null)
}

export async function getStatus({ http, toriiURL }: ToriiHttpParams): Promise<datamodel.Status> {
  const response = await http(toriiURL + ENDPOINT_STATUS, {
    headers: { accept: 'application/x-parity-scale' },
  })
  ResponseError.throwIfStatusIsNot(response, 200)
  return response.arrayBuffer().then((buffer) => toCodec(datamodel.Status).decode(new Uint8Array(buffer)))
}

export async function getMetrics({ http, toriiURL }: ToriiHttpParams) {
  return http(toriiURL + ENDPOINT_METRICS).then((response) => {
    ResponseError.throwIfStatusIsNot(response, 200)
    return response.text()
  })
}

export async function setPeerConfig({ http, toriiURL }: ToriiHttpParams, params: SetPeerConfigParams) {
  const response = await http(toriiURL + ENDPOINT_CONFIGURATION, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  ResponseError.throwIfStatusIsNot(response, 202 /* ACCEPTED */)
}

export async function submitTransaction({ http, toriiURL }: ToriiHttpParams, tx: datamodel.SignedTransaction) {
  const body = toCodec(datamodel.SignedTransaction).encode(tx)
  const response = await http(toriiURL + ENDPOINT_TRANSACTION, { body, method: 'POST' })
  ResponseError.throwIfStatusIsNot(response, 200)
}

export * from './events'
export * from './blocks-stream'
export * from './web-socket/types'
