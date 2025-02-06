/**
 * @module @iroha2/client
 */

/**
 * @packageDocumentation
 *
 * Client library to interact with Iroha v2 Peer. Library implements Transactions, Queries,
 * Events, Status & Health check.
 */

import type { KeyPair, PrivateKey } from '@iroha2/crypto'
import * as dm from '@iroha2/data-model'
import defer from 'p-defer'
import type { Except } from 'type-fest'

import { MainAPI, type Fetch, HttpTransport } from './api.ts'
import { type SetupBlocksStreamParams, type SetupEventsParams, WebSocketAPI } from './api-ws.ts'
import type { IsomorphicWebSocketAdapter } from './web-socket/types.ts'
import { FindAPI } from './generated/find-api.ts'
import { QueryExecutor } from './query.ts'

export interface CreateClientParams {
  fetch?: Fetch
  ws: IsomorphicWebSocketAdapter
  toriiBaseURL: URL
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

export class TransactionRejectedError extends Error {
  public reason: dm.TransactionRejectionReason

  public constructor(reason: dm.TransactionRejectionReason) {
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

export class Client {
  public readonly params: CreateClientParams

  /**
   * Raw API calls.
   */
  public readonly api: MainAPI
  /**
   * Raw WebSocket API calls.
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

    const executor = new QueryExecutor(this.api, this.authority(), this.authorityPrivateKey())
    this.find = new FindAPI(executor)

    this.socket = new WebSocketAPI(params.toriiBaseURL, params.ws)
  }

  public authority(): dm.AccountId {
    return new dm.AccountId(
      dm.PublicKeyRepr.fromCrypto(this.params.accountKeyPair.publicKey()),
      this.params.accountDomain,
    )
  }

  public authorityPrivateKey(): PrivateKey {
    return this.params.accountKeyPair.privateKey()
  }

  public transaction(
    executable: dm.Executable,
    params?: Except<dm.TransactionPayloadParams, 'authority' | 'chain'>,
  ): TransactionHandle {
    const tx = dm.signTransaction(
      dm.buildTransactionPayload(executable, {
        chain: this.params.chain,
        authority: this.authority(),
        ...params,
      }),
      this.params.accountKeyPair.privateKey(),
    )

    return new TransactionHandle(tx, this)
  }

  public async events(params?: SetupEventsParams) {
    return this.socket.events(params)
  }

  public async blocks(params?: SetupBlocksStreamParams) {
    return this.socket.blocksStream(params)
  }
}

export class TransactionHandle {
  private readonly client: Client
  private readonly tx: dm.SignedTransaction
  private readonly txHash: dm.HashRepr

  public constructor(tx: dm.SignedTransaction, client: Client) {
    this.client = client
    this.tx = tx
    this.txHash = dm.HashRepr.fromCrypto(dm.transactionHash(tx))
  }

  public get hash(): dm.HashRepr {
    return this.txHash
  }

  public async submit(params?: SubmitParams) {
    if (params?.verify) {
      // const hash = transactionHash(tx)
      const stream = await this.client.events({
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
      const confirmation = defer<void>()
      stream.ee.on('event', (event) => {
        if (event.kind === 'Pipeline' && event.value.kind === 'Transaction') {
          const txEvent = event.value.value
          if (txEvent.status.kind === 'Approved') confirmation.resolve()
          else if (txEvent.status.kind === 'Rejected')
            confirmation.reject(new TransactionRejectedError(txEvent.status.value))
          else if (txEvent.status.kind === 'Expired') confirmation.reject(new TransactionExpiredError())
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
