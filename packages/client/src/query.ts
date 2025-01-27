import type { PrivateKey } from '@iroha2/crypto-core'
import * as dm from '@iroha2/data-model'
import invariant from 'tiny-invariant'
import { ENDPOINT_QUERY } from './const'

export interface BaseParams {
  fetch: typeof fetch
  toriiBaseURL: string
  authority: dm.AccountId
  authorityPrivateKey: () => PrivateKey
}

function signQueryRequest(request: dm.QueryRequest, params: BaseParams) {
  return dm.signQuery({ authority: params.authority, request }, params.authorityPrivateKey())
}

export async function* queryBatchStream(params: BaseParams, query: dm.QueryWithParams): AsyncGenerator<dm.QueryOutput> {
  let continueCursor: dm.ForwardCursor | null = null
  do {
    const response: dm.QueryResponse = await params
      .fetch(params.toriiBaseURL + ENDPOINT_QUERY, {
        method: 'POST',
        body: dm
          .codecOf(dm.SignedQuery)
          .encode(
            signQueryRequest(
              continueCursor ? dm.QueryRequest.Continue(continueCursor) : dm.QueryRequest.Start(query),
              params,
            ),
          ),
      })
      .then(handleQueryResponse)

    invariant(response.kind === 'Iterable')
    yield response.value

    continueCursor = response.value.continueCursor
  } while (continueCursor)
}

export async function querySingular(
  params: BaseParams,
  query: dm.SingularQueryBox,
): Promise<dm.SingularQueryOutputBox> {
  const response = await params
    .fetch(params.toriiBaseURL + ENDPOINT_QUERY, {
      method: 'POST',
      body: dm.codecOf(dm.SignedQuery).encode(signQueryRequest({ kind: 'Singular', value: query }, params)),
    })
    .then(handleQueryResponse)

  invariant(response.kind === 'Singular')
  return response.value
}

async function handleQueryResponse(resp: Response): Promise<dm.QueryResponse> {
  if (resp.status === 200) {
    const bytes = await resp.arrayBuffer()
    return dm.codecOf(dm.QueryResponse).decode(new Uint8Array(bytes))
  } else if (resp.status >= 400 && resp.status < 500) {
    const bytes = await resp.arrayBuffer()
    const error = dm.codecOf(dm.ValidationFail).decode(new Uint8Array(bytes))
    // TODO handle error properly
    console.error(error)
    throw new Error(`Query execution fail`)
  }
  throw new Error(`unexpected response from Iroha: ${resp.status} ${resp.statusText}`)
}

export class QueryHandle<Output> {
  private readonly _query: dm.BuildQueryResult<Output>
  private readonly _executor: QueryExecutor

  public constructor(query: dm.BuildQueryResult<Output>, executor: QueryExecutor) {
    this._query = query
    this._executor = executor
  }

  public async executeAll(): Promise<Output[]> {
    const items: Output[] = []
    for await (const batch of this.batches()) {
      items.push(...batch)
    }
    return items
  }

  public async executeSingle(): Promise<Output> {
    const items = await this.executeAll()
    if (items.length === 1) return items[0]
    throw new TypeError(`Expected query to return exactly one element, got ${items.length}`)
  }

  public async executeSingleOpt(): Promise<null | Output> {
    const items = await this.executeAll()
    if (items.length <= 1) return items.at(0) ?? null
    throw new TypeError(`Expected query to return one or non elements, got ${items.length}`)
  }

  public async *batches(): AsyncGenerator<Output[]> {
    for await (const { batch } of this._executor.execute(this._query.query)) {
      const items = [...this._query.parseResponse(batch)]
      yield items
    }
  }
}

export interface QueryExecutor {
  execute: (query: dm.QueryWithParams) => AsyncGenerator<dm.QueryOutput>
  executeSingular: (query: dm.SingularQueryBox) => Promise<dm.SingularQueryOutputBox>
}

export function buildQueryHandle<K extends dm.QueryKind, O>(
  executor: QueryExecutor,
  kind: K,
  payload: dm.GetQueryPayload<K>,
  params?: dm.BuildQueryParams<K>,
): QueryHandle<O> {
  const query = dm.buildQuery(kind, payload, params)
  return new QueryHandle<any>(query, executor)
}

export async function executeSingularQuery<K extends dm.SingularQueryKind>(
  executor: QueryExecutor,
  kind: K,
): Promise<dm.GetSingularQueryOutput<K>> {
  const result = await executor.executeSingular({ kind })
  return result.value as dm.GetSingularQueryOutput<K>
}
