import type { PrivateKey } from '@iroha2/crypto'
import * as dm from '@iroha2/data-model'
import invariant from 'tiny-invariant'
import type { MainAPI } from './api.ts'

export class QueryExecutor {
  private readonly api: MainAPI
  private readonly authority: dm.AccountId
  private readonly privateKey: PrivateKey

  public constructor(api: MainAPI, authority: dm.AccountId, authorityPrivateKey: PrivateKey) {
    this.api = api
    this.authority = authority
    this.privateKey = authorityPrivateKey
  }

  public async *execute(query: dm.QueryWithParams): AsyncGenerator<dm.QueryOutput> {
    let continueCursor: dm.ForwardCursor | null = null
    do {
      const response = await this.api.query(
        this.signQuery(continueCursor ? dm.QueryRequest.Continue(continueCursor) : dm.QueryRequest.Start(query)),
      )

      invariant(response.kind === 'Iterable')
      yield response.value

      continueCursor = response.value.continueCursor
    } while (continueCursor)
  }

  public async executeSingular(query: dm.SingularQueryBox): Promise<dm.SingularQueryOutputBox> {
    const response = await this.api.query(this.signQuery({ kind: 'Singular', value: query }))
    invariant(response.kind === 'Singular')
    return response.value
  }

  public signQuery(request: dm.QueryRequest): dm.SignedQuery {
    return dm.signQuery({ request, authority: this.authority }, this.privateKey)
  }
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
