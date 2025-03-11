import { fail } from '@std/assert/fail'
import * as types from './data-model/mod.ts'
import type * as prototypes from './data-model/prototypes.generated.ts'
import { getActualSelector, predicateProto, QUERIES_WITH_PAYLOAD, selectorProto } from './query-internal.ts'
import type { GetQueryPayload, PredicateOf, QueryKind, SelectedTuple } from './query-types.ts'

export * from './query-types.ts'

const DEFAULT_SELECTOR = [{ kind: 'Atom' }]

function buildQueryParams(
  params?: QueryBuilderParams,
): types.QueryParams {
  return {
    fetchSize: params?.fetchSize?.map(BigInt) ?? null,
    pagination: {
      offset: params?.offset ? BigInt(params.offset) : 0n,
      limit: params?.limit?.map(BigInt) ?? null,
    },
    sorting: {
      sortByMetadataKey: params?.sorting?.byMetadataKey ?? null,
    },
  }
}

export type QueryBuilderCtorArgs<Q extends QueryKind> = GetQueryPayload<Q> extends infer P
  ? P extends null ? [query: Q, params?: QueryBuilderParams] : [query: Q, payload: P, params?: QueryBuilderParams]
  : never

export type DefaultQueryOutput<Q extends QueryKind> = SelectedTuple<prototypes.QuerySelectors[Q]>

export class QueryBuilder<Q extends QueryKind, Output = DefaultQueryOutput<Q>> {
  protected kind: Q
  protected payload: GetQueryPayload<Q>
  protected params: types.QueryParams
  protected selector: unknown = DEFAULT_SELECTOR
  protected predicate: types.CompoundPredicate<unknown> = types.CompoundPredicate.PASS
  protected parseOutput: (resp: types.QueryOutputBatchBoxTuple) => Generator<Output> = generateOutputTuples<Output>

  constructor(...args: QueryBuilderCtorArgs<Q>) {
    this.kind = args[0]

    if ((QUERIES_WITH_PAYLOAD as Set<QueryKind>).has(this.kind)) {
      ;[this.payload, this.params] = args.length === 2
        ? [args[1] as GetQueryPayload<Q>, buildQueryParams()]
        : args.length === 3
        ? [args[1] as GetQueryPayload<Q>, buildQueryParams(args[2])]
        : fail('bad arguments')
    } else {
      ;[this.payload, this.params] = (
          // @ts-expect-error it doesn't understand that there is an optional param
          args.length === 1
        )
        ? [null as GetQueryPayload<Q>, buildQueryParams()]
        : args.length === 2
        ? [null as GetQueryPayload<Q>, buildQueryParams(args[1] as QueryBuilderParams)]
        : fail('bad arguments')
    }
  }

  public selectWith<const ProtoTuple>(
    fn: (prototype: prototypes.QuerySelectors[Q]) => ProtoTuple,
  ): QueryBuilder<Q, SelectedTuple<ProtoTuple>> {
    const proto = selectorProto<Q>()
    const protoTuple = fn(proto)
    this.selector = protoTupleIntoActualSelector(protoTuple)
    return this as QueryBuilder<Q, SelectedTuple<ProtoTuple>>
  }

  public filterWith(fn: (prototype: prototypes.QueryPredicates[Q]) => types.CompoundPredicate<PredicateOf<Q>>): this {
    const proto = predicateProto<Q>()
    this.predicate = fn(proto)
    return this
  }

  public build(): types.QueryWithParams {
    return {
      query: {
        kind: this.kind,
        value: {
          query: this.payload,
          predicate: this.predicate,
          selector: this.selector,
        } satisfies types.QueryWithFilter<unknown, unknown, unknown>,
      } as types.QueryBox,
      params: this.params,
    }
  }
}

function protoTupleIntoActualSelector(tuple: unknown): unknown {
  if (Array.isArray(tuple)) {
    return tuple.map((x) => getActualSelector(x))
  }
  return [getActualSelector(tuple)]
}
export interface QueryBuilderParams {
  /**
   * TODO what fetch size affects, why to set
   */
  fetchSize?: types.NonZero<number | bigint>
  /**
   * TODO pagination offset
   */
  offset?: number | bigint
  /**
   * TODO pagination limit
   */
  limit?: types.NonZero<number | bigint>
  /**
   * Specify sorting of the output
   */
  sorting?: {
    /**
     * Sort output by the key-value entry in the entity's metadata.
     * TODO describe example
     */
    byMetadataKey?: types.Name
  }
}

function* generateOutputTuples<Output>(response: types.QueryOutputBatchBoxTuple): Generator<Output> {
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
