import * as dm from '@iroha2/data-model'
import type { Schema as DataModelSchema } from '../../data-model/src/schema/lib.ts'
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
import invariant from 'tiny-invariant'

/**
 * Peer information returned from {@link ApiTelemetry.peers}
 */
export interface PeerJson {
  /**
   * Socket address of the peer
   */
  address: string
  /**
   * Peer public key
   */
  id: dm.PublicKeyRepr
}

export interface PeerConfig {
  logger: {
    level: dm.Level['kind']
  }
}

export type Fetch = typeof fetch

export type HealthResult = dm.VariantUnit<'healthy'> | dm.Variant<'error', unknown>

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
   * @param fetch `fetch` implementation for environments where it is not available globally.
   * For example, you might need to use `node-fetch` or `undici` in older versions of Node.js.
   */
  public constructor(toriiBaseURL: URL, fetch?: Fetch) {
    this.toriiBaseURL = toriiBaseURL
    this.fetch = fetch ?? globalThis.fetch
  }

  public getFetch() {
    // this is needed to avoid an issue when `Window.fetch` is called with `this` object not being `Window`
    return this.fetch
  }
}

export class MainAPI {
  /**
   * Works only if Iroha is compiled with `telemetry` feature flag.
   */
  public readonly telemetry: ApiTelemetry

  private readonly http: HttpTransport

  public constructor(http: HttpTransport) {
    this.http = http
    this.telemetry = new ApiTelemetry(http)
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
    const body = dm.getCodec(dm.SignedTransaction).encode(transaction)
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
        body: dm.getCodec(dm.SignedQuery).encode(query),
      })
      .then(handleQueryResponse)
  }

  public async getConfig(): Promise<PeerConfig> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_CONFIGURATION))
    await ResponseError.assertStatus(response, 200)
    return response.json()
  }

  public async setConfig(config: PeerConfig): Promise<void> {
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
}

async function handleQueryResponse(resp: Response): Promise<dm.QueryResponse> {
  if (resp.status === 200) {
    const bytes = await resp.arrayBuffer()
    return dm.getCodec(dm.QueryResponse).decode(new Uint8Array(bytes))
  } else if (resp.status >= 400 && resp.status < 500) {
    const bytes = await resp.arrayBuffer()
    const error = dm.getCodec(dm.ValidationFail).decode(new Uint8Array(bytes))
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
export class ApiTelemetry {
  private readonly http: HttpTransport

  public constructor(http: HttpTransport) {
    this.http = http
  }

  public async status(): Promise<dm.Status> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_STATUS), {
      headers: { accept: 'application/x-parity-scale' },
    })
    await ResponseError.assertStatus(response, 200)
    return response.arrayBuffer().then((buffer) => dm.getCodec(dm.Status).decode(new Uint8Array(buffer)))
  }

  public async peers(): Promise<PeerJson[]> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_PEERS))
    await ResponseError.assertStatus(response, 200)
    return response.json().then(
      // array of strings in format `<pub key multihash>@<socket addr>`
      (ids: string[]) => {
        invariant(Array.isArray(ids))
        return ids.map((id) => {
          invariant(typeof id === 'string')
          const [pubkey, address] = id.split('@')
          return { id: dm.PublicKeyRepr.fromHex(pubkey), address }
        })
      },
    )
  }

  public async metrics(): Promise<string> {
    const response = await this.http.getFetch()(urlJoinPath(this.http.toriiBaseURL, ENDPOINT_METRICS))
    await ResponseError.assertStatus(response, 200)
    return response.text()
  }
}
