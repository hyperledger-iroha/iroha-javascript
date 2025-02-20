import type { PrivateKey } from '@iroha/core/crypto'
import * as types from '@iroha/core/data-model'
import type { Except } from 'type-fest'
import defer from 'p-defer'
import { buildTransactionPayload, signTransaction, transactionHash, type TransactionPayloadParams } from '@iroha/core'

import { type Fetch, HttpTransport, MainAPI } from './api.ts'
import {
  type SetupBlocksStreamParams,
  type SetupBlocksStreamReturn,
  type SetupEventsParams,
  type SetupEventsReturn,
  WebSocketAPI,
} from './api-ws.ts'
import type { IsomorphicWebSocketAdapter } from './web-socket/mod.ts'
import { FindAPI } from './find-api._generated_.ts'
import { QueryExecutor } from './query.ts'

export { FindAPI }

export interface CreateClientParams {
  /**
   * Custom {@linkcode fetch} for environments where it is not available natively.
   */
  fetch?: Fetch
  /**
   * WebSocket adapter. For environments where {@linkcode WebSocket} is not available natively.
   */
  ws?: IsomorphicWebSocketAdapter
  /**
   * The base URL of **Torii**, Iroha API Gateway.
   */
  toriiBaseURL: URL
  /**
   * Chain ID.
   */
  chain: string
  /**
   * Authority on which behalf to sign transactions and queries.
   */
  authority: types.AccountId
  /**
   * The private key of {@linkcode CreateClientParams.authority}.
   */
  authorityPrivateKey: types.PrivateKey
}

export interface SubmitParams {
  /**
   * Whether to wait for the transaction to be accepted/rejected/expired.
   * @default false
   */
  verify?: boolean
  verifyAbort?: AbortSignal
}

export class TransactionRejectedError extends Error {
  public reason: types.TransactionRejectionReason

  public constructor(reason: types.TransactionRejectionReason) {
    super()
    this.name = 'TransactionRejectedError'
    this.reason = reason
  }
}

export class TransactionExpiredError extends Error {
  public constructor() {
    super()
    this.name = 'TransactionExpiredError'
  }
}

/**
 * All-in-one Iroha client.
 *
 * Through it, it is possible to perform all different kinds of interactions with Iroha, e.g.
 * signing and submitting transactions and queries or listening to events through WebSockets.
 *
 * It is possible to use each layer of functionality separately, through lower-level layers:
 *
 * - {@linkcode MainAPI}
 * - {@linkcode WebSocketAPI}
 *
 * It could be useful if e.g. you don't need to submit transactions (which requires an account with a key pair),
 * but only want to check Iroha status.
 */
export class Client {
  public readonly params: CreateClientParams

  /**
   * Lower-level API calls.
   */
  public readonly api: MainAPI
  /**
   * Lower-level WebSocket API calls.
   */
  public readonly socket: WebSocketAPI
  /**
   * Shortcuts for querying data from Iroha
   */
  public readonly find: FindAPI

  public constructor(params: CreateClientParams) {
    this.params = params
    const http = new HttpTransport(params.toriiBaseURL, params.fetch)
    this.api = new MainAPI(http)

    const executor = new QueryExecutor(this.api, this.authority, this.authorityPrivateKey)
    this.find = new FindAPI(executor)

    this.socket = new WebSocketAPI(params.toriiBaseURL, params.ws)
  }

  public get authority(): types.AccountId {
    return this.params.authority
  }

  public get authorityPrivateKey(): PrivateKey {
    return this.params.authorityPrivateKey
  }

  /**
   * Create a transaction.
   *
   * @param executable the executable of the transactions
   * @param params parameters to adjust the constructed transaction payload
   * @returns the handle to perform further operations, such as computing transaction's hash or submitting it to Iroha.
   */
  public transaction(
    executable: types.Executable,
    params?: Except<TransactionPayloadParams, 'authority' | 'chain'>,
  ): TransactionHandle {
    const tx = signTransaction(
      buildTransactionPayload(executable, {
        chain: this.params.chain,
        authority: this.authority,
        ...params,
      }),
      this.authorityPrivateKey,
    )

    return new TransactionHandle(tx, this)
  }

  /**
   * Receive events from Iroha in real time.
   */
  public async events(params?: SetupEventsParams): Promise<SetupEventsReturn> {
    return this.socket.events(params)
  }

  /**
   * Receive blocks from Iroha in real time.
   */
  public async blocks(params?: SetupBlocksStreamParams): Promise<SetupBlocksStreamReturn> {
    return this.socket.blocksStream(params)
  }
}

export class TransactionHandle {
  private readonly client: Client
  private readonly tx: types.SignedTransaction
  private readonly txHash: types.Hash

  public constructor(tx: types.SignedTransaction, client: Client) {
    this.client = client
    this.tx = tx
    this.txHash = transactionHash(tx)
  }

  public get hash(): types.Hash {
    return this.txHash
  }

  public async submit(params?: SubmitParams) {
    if (params?.verify) {
      // const hash = transactionHash(tx)
      const stream = await this.client.events({
        filters: [
          types.EventFilterBox.Pipeline.Transaction({
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

      // TODO: replace with Promise.withResolvers
      const confirmation = defer<void>()
      stream.ee.on('event', (event) => {
        if (event.kind === 'Pipeline' && event.value.kind === 'Transaction') {
          const txEvent = event.value.value
          if (txEvent.status.kind === 'Approved') confirmation.resolve()
          else if (txEvent.status.kind === 'Rejected') {
            confirmation.reject(new TransactionRejectedError(txEvent.status.value))
          } else if (txEvent.status.kind === 'Expired') confirmation.reject(new TransactionExpiredError())
        }
      })
      stream.ee.on('close', () => {
        confirmation.reject(new Error('Events stream was unexpectedly closed'))
      })
      params.verifyAbort?.addEventListener('abort', () => {
        confirmation.reject(new Error('Aborted'))
      })

      try {
        await this.client.api.transaction(this.tx)
        await confirmation.promise
      } finally {
        stream.stop()
      }
    } else {
      await this.client.api.transaction(this.tx)
    }
  }
}
