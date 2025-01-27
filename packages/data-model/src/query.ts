import * as types from './items/index'
import { VariantUnit } from './util'

export type SingularQueryOutputMap = {
  FindExecutorDataModel: 'ExecutorDataModel'
  FindParameters: 'Parameters'
}

export type SingularQueryKind = keyof SingularQueryOutputMap & types.SingularQueryBox['kind']

export type GetSingularQueryOutput<K extends SingularQueryKind> =
  SingularQueryOutputMap[K] extends infer OutputKind extends types.SingularQueryOutputBox['kind']
    ? (types.SingularQueryOutputBox & { kind: OutputKind })['value']
    : never

export type GetSelectorOutput<K extends keyof types.SelectorOutputMap, S> = S extends { kind: 'Atom' }
  ? types.SelectorOutputMap[K]['Atom'] extends infer OutputKind extends types.QueryOutputBatchBox['kind']
    ? (types.QueryOutputBatchBox & { kind: OutputKind })['value'] extends (infer Output)[]
      ? Output
      : never
    : never
  : [K, S] extends ['Metadata', { kind: 'Key'; value: { key: types.Name; projection: infer NextS } }]
    ? GetSelectorOutput<'Json', NextS>
    : S extends { kind: infer SKind extends keyof types.SelectorOutputMap[K]; value: infer NextS }
      ? types.SelectorOutputMap[K][SKind] extends infer NextK extends keyof types.SelectorOutputMap
        ? GetSelectorOutput<NextK, NextS>
        : never
      : never

export type QueryKind = types.QueryBox['kind'] & keyof types.QuerySelectorMap

export type GetSelectorTupleOutput<K extends keyof types.SelectorOutputMap, Tuple> = Tuple extends [
  infer Head,
  ...infer Tail,
]
  ? [GetSelectorOutput<K, Head>, ...GetSelectorTupleOutput<K, Tail>]
  : Tuple extends []
    ? []
    // Not as ergonomic (lost `const` somewhere?), but still works and is correct
    : Tuple extends Array<infer T>
      ? GetSelectorOutput<K, T>[]
      : never

export type SelectorToOutput<
  Q extends QueryKind & keyof types.QuerySelectorMap,
  Selection,
> = types.QuerySelectorMap[Q] extends infer Selector extends keyof types.SelectorOutputMap
  ? Selection extends readonly [infer S]
    ? GetSelectorOutput<Selector, S>
    : Selection extends readonly []
      ? never
      : Selection extends readonly [...infer S]
        ? GetSelectorTupleOutput<Selector, S>
        : GetSelectorOutput<Selector, Selection>
  : never

export type DefaultQueryOutput<Q extends QueryKind> = GetSelectorOutput<
  Q extends keyof types.QuerySelectorMap
    ? types.QuerySelectorMap[Q] extends infer Selector extends keyof types.SelectorOutputMap
      ? Selector
      : never
    : never,
  VariantUnit<'Atom'>
>

export type PredicateFor<Q extends QueryKind> =
  (types.QueryBox & { kind: Q })['value'] extends types.QueryWithFilter<any, types.CompoundPredicate<infer P>, any>
    ? P
    : never

const DEFAULT_SELECTOR = [{ kind: 'Atom' }]

export type QueryKindWithoutPayload = { [K in QueryKind]: GetQueryPayload<K> extends null ? K : never }[QueryKind]

export type QueryKindWithPayload = { [K in QueryKind]: GetQueryPayload<K> extends null ? never : K }[QueryKind]

export function buildQuery<K extends QueryKind, const P extends BuildQueryParams<K>>(
  kind: K,
  payload: GetQueryPayload<K>,
  params?: P,
): BuildQueryResult<GetQueryOutput<K, P>> {
  return {
    query: {
      query: {
        kind,
        value: {
          query: payload,
          predicate: params?.predicate || types.CompoundPredicate.PASS,
          selector: params?.selector
            ? Array.isArray(params?.selector)
              ? params.selector
              : [params.selector]
            : DEFAULT_SELECTOR,
        } as types.QueryWithFilter<unknown, types.CompoundPredicate<unknown>, unknown>,
      } as types.QueryBox,
      params: {
        fetchSize: params?.fetchSize?.map(BigInt) ?? null,
        pagination: {
          offset: params?.offset ? BigInt(params.offset) : 0n,
          limit: params?.limit?.map(BigInt) ?? null,
        },
        sorting: {
          sortByMetadataKey: params?.sorting?.byMetadataKey ?? null,
        },
      },
    },
    parseResponse: generateOutputTuples,
  }
}

// TODO: document fields!
export interface BuildQueryParams<K extends QueryKind> {
  predicate?: types.CompoundPredicate<PredicateFor<K>>
  selector?: unknown
  fetchSize?: types.NonZero<number | bigint>
  offset?: number | bigint
  limit?: types.NonZero<number | bigint>
  sorting?: {
    byMetadataKey?: types.Name
  }
}

export type GetQueryPayload<K extends QueryKind> =
  (types.QueryBox & { kind: K })['value'] extends types.QueryWithFilter<infer Payload, any, any> ? Payload : never

export interface BuildQueryResult<Output> {
  query: types.QueryWithParams
  parseResponse: (response: types.QueryOutputBatchBoxTuple) => Generator<Output>
}

export type GetQueryOutput<K extends QueryKind, P extends BuildQueryParams<K>> = P extends {
  selector: infer S
}
  ? SelectorToOutput<K, S>
  : SelectorToOutput<K, VariantUnit<'Atom'>>

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
