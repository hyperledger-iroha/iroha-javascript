import { assert } from '@std/assert'
import { getCodec, type Variant, type VariantUnit } from '@iroha/core'
import * as dm from '@iroha/core/data-model'
import type { Schema as DataModelSchema } from '@iroha/core/data-model/schema'
import {
  ENDPOINT_CONFIGURATION,
  ENDPOINT_HEALTH,
  ENDPOINT_METRICS,
  ENDPOINT_PEERS,
  ENDPOINT_QUERY,
  ENDPOINT_SCHEMA,
  ENDPOINT_STATUS,
  ENDPOINT_TRANSACTION,
  HEALTHY_RESPONSE,
} from './const.ts'
import { urlJoinPath } from './util.ts'
import type { PartialDeep } from 'type-fest'

/**
 * Peer information returned from {@link TelemetryAPI.peers}
 */
export interface PeerJson {
  /**
   * Socket address of the peer
   */
  address: string
  /**
   * Peer public key
   */
  id: dm.PublicKey
}

export type PeerGetConfig = {
  logger: {
    level: dm.Level['kind']
    /**
     * Filter directives, e.g. `info,iroha_core=debug`.
     */
    filter: string
  }
  network: {
    blockGossipPeriod: dm.Duration
    blockGossipSize: number
    transactionGossipPeriod: dm.Duration
    transactionGossipSize: number
  }
  publicKey: dm.PublicKey
  queue: {
    capacity: number
  }
}

type PeerGetConfigRaw = {
  logger: {
    level: dm.Level['kind']
    filter: string
  }
  network: {
    block_gossip_period_ms: number
    block_gossip_size: number
    transaction_gossip_period_ms: number
    transaction_gossip_size: number
  }
  public_key: string
  queue: {
    capacity: number
  }
}

export type PeerSetConfig = PartialDeep<Pick<PeerGetConfig, 'logger'>>

export type Fetch = typeof fetch

export type HealthResult = VariantUnit<'healthy'> | Variant<'error', unknown>

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

/**
 * Adapter for HTTP requests made by various methods.
 */
export class HttpTransport {
  public readonly toriiBaseURL: URL
  private readonly fetch: Fetch

  /**
   * @param toriiBaseURL URL of Torii (Iroha API Gateway)
   * @param fetch `fetch` implementation for environments where it is not available natively.
   * For example, you might need to use `node-fetch` or `undici` in older versions of Node.js.
   */
  public constructor(toriiBaseURL: URL, fetch?: Fetch) {
    this.toriiBaseURL = toriiBaseURL
    this.fetch = fetch ?? globalThis.fetch
  }

  public getFetch(): Fetch {
    // this is needed to avoid an issue when `Window.fetch` is called with `this` object not being `Window`
    return this.fetch
  }
}

/**
 * Lower-level client to interact with Iroha HTTP APIs.
 *
 * It is separated from {@linkcode WebSocketAPI}.
 *
 * It is lower-level in a sense that, for example, {@linkcode MainAPI#transaction} accepts an already signed transaction
 * and simply "fire and forget"s it, while {@linkcode Client#transaction} helps to construct a transaction, submit it,
 * and verify that it is accepted.
 */
export class MainAPI {
  /**
   * Works only if Iroha is compiled with `telemetry` feature flag.
   */
  public readonly telemetry: TelemetryAPI

  private readonly http: HttpTransport

  public constructor(http: HttpTransport) {
    this.http = http
    this.telemetry = new TelemetryAPI(http)
  }

  public async health(): Promise<HealthResult> {
    let response: Response
    try {
      response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_HEALTH))
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

  public async transaction(transaction: dm.SignedTransaction): Promise<void> {
    const body = getCodec(dm.SignedTransaction).encode(transaction)
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_TRANSACTION), {
      body,
      method: 'POST',
    })
    await ResponseError.assertStatus(response, 200)
  }

  public async query(query: dm.SignedQuery): Promise<dm.QueryResponse> {
    return this.http
      .getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_QUERY), {
        method: 'POST',
        body: getCodec(dm.SignedQuery).encode(query),
      })
      .then(handleQueryResponse)
  }

  public async getConfig(): Promise<PeerGetConfig> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_CONFIGURATION))
    await ResponseError.assertStatus(response, 200)
    // TODO: use schema parser e.g. zod?
    const raw: PeerGetConfigRaw = await response.json()
    return {
      publicKey: dm.PublicKey.fromMultihash(raw.public_key),
      logger: raw.logger,
      network: {
        blockGossipSize: raw.network.block_gossip_size,
        blockGossipPeriod: dm.Duration.fromMillis(raw.network.block_gossip_period_ms),
        transactionGossipSize: raw.network.transaction_gossip_size,
        transactionGossipPeriod: dm.Duration.fromMillis(raw.network.transaction_gossip_period_ms),
      },
      queue: raw.queue,
    }
  }

  public async setConfig(config: PeerSetConfig): Promise<void> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_CONFIGURATION), {
      method: 'POST',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await ResponseError.assertStatus(response, 202 /* ACCEPTED */)
  }

  /**
   * Will only work if Iroha is compiled with `schema` feature enabled.
   */
  public async schema(): Promise<DataModelSchema> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_SCHEMA))
    await ResponseError.assertStatus(response, 200)
    return response.json()
  }

  public async peers(): Promise<PeerJson[]> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_PEERS))
    await ResponseError.assertStatus(response, 200)
    return response.json().then(
      // array of strings in format `<pub key multihash>@<socket addr>`
      (ids: string[]) => {
        assert(Array.isArray(ids))
        return ids.map((id) => {
          assert(typeof id === 'string')
          const [pubkey, address] = id.split('@')
          return { id: dm.PublicKey.fromMultihash(pubkey), address }
        })
      },
    )
  }
}

async function handleQueryResponse(resp: Response): Promise<dm.QueryResponse> {
  if (resp.status === 200) {
    const bytes = await resp.arrayBuffer()
    return getCodec(dm.QueryResponse).decode(new Uint8Array(bytes))
  } else if (resp.status >= 400 && resp.status < 500) {
    const bytes = await resp.arrayBuffer()
    const error = getCodec(dm.ValidationFail).decode(new Uint8Array(bytes))
    throw new QueryValidationError(error)
  }
  throw new Error(`unexpected response from Iroha: ${resp.status} ${resp.statusText}`)
}

export class QueryValidationError extends Error {
  public reason: dm.ValidationFail

  public constructor(reason: dm.ValidationFail) {
    super()

    this.name = 'QueryValidationError'
    this.reason = reason
  }
}

// TODO: handle errors with a hint that Iroha might be not compiled with the needed features
export class TelemetryAPI {
  private readonly http: HttpTransport

  public constructor(http: HttpTransport) {
    this.http = http
  }

  public async status(): Promise<dm.Status> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_STATUS), {
      headers: { accept: 'application/x-parity-scale' },
    })
    await ResponseError.assertStatus(response, 200)
    return response.arrayBuffer().then((buffer) => getCodec(dm.Status).decode(new Uint8Array(buffer)))
  }

  public async metrics(): Promise<string> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_METRICS))
    await ResponseError.assertStatus(response, 200)
    return response.text()
  }
}
