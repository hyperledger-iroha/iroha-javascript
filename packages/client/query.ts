import {
  type DefaultQueryOutput,
  QueryBuilder as BaseQueryBuilder,
  type QueryBuilderCtorArgs,
  type QueryKind,
  type SelectedTuple,
  signQuery,
} from '@iroha/core'
import * as types from '@iroha/core/data-model'
import type { PrivateKey } from '@iroha/core/crypto'
import { assert } from '@std/assert'
import type { MainAPI } from './api.ts'
import type { QuerySelectors } from '../core/data-model/prototypes.generated.ts'

export class QueryExecutor {
  private readonly api: MainAPI
  private readonly authority: types.AccountId
  private readonly privateKey: PrivateKey

  public constructor(api: MainAPI, authority: types.AccountId, authorityPrivateKey: PrivateKey) {
    this.api = api
    this.authority = authority
    this.privateKey = authorityPrivateKey
  }

  public async *execute(query: types.QueryWithParams): AsyncGenerator<types.QueryOutput> {
    let continueCursor: types.ForwardCursor | null = null
    do {
      const response = await this.api.query(
        this.signQuery(continueCursor ? types.QueryRequest.Continue(continueCursor) : types.QueryRequest.Start(query)),
      )

      assert(response.kind === 'Iterable')
      yield response.value

      continueCursor = response.value.continueCursor
    } while (continueCursor)
  }

  public async executeSingular(query: types.SingularQueryBox): Promise<types.SingularQueryOutputBox> {
    const response = await this.api.query(this.signQuery({ kind: 'Singular', value: query }))
    assert(response.kind === 'Singular')
    return response.value
  }

  public signQuery(request: types.QueryRequest): types.SignedQuery {
    return signQuery({ request, authority: this.authority }, this.privateKey)
  }
}

export class QueryBuilder<Q extends QueryKind, Output = DefaultQueryOutput<Q>> extends BaseQueryBuilder<Q, Output> {
  #executor: QueryExecutor

  public constructor(executor: QueryExecutor, ...args: QueryBuilderCtorArgs<Q>) {
    // @ts-ignore causes `deno publish` to fail https://github.com/denoland/deno/issues/28472
    super(...args)
    this.#executor = executor
  }

  public override selectWith<const ProtoTuple>(
    fn: (prototype: QuerySelectors[Q]) => ProtoTuple,
  ): QueryBuilder<Q, SelectedTuple<ProtoTuple>> {
    super.selectWith(fn)
    return this as QueryBuilder<Q, SelectedTuple<ProtoTuple>>
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
    for await (const { batch } of this.#executor.execute(this.build())) {
      const items = [...this.parseOutput(batch)]
      yield items
    }
  }
}
