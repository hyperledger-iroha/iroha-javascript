import * as types from './data-model/mod.ts'
import type { VariantUnit } from './util.ts'

/**
 * Type map, defining relation between the variants of {@link types.SingularQueryBox} and its outputs in
 * {@link types.SingularQueryOutputBox}
 */
export interface SingularQueryOutputMap {
  FindExecutorDataModel: 'ExecutorDataModel'
  FindParameters: 'Parameters'
}

/**
 * Kinds of singular queries.
 */
export type SingularQueryKind = keyof SingularQueryOutputMap & types.SingularQueryBox['kind']

/**
 * Type function to map a singular query kind into the value of its output box.
 */
export type GetSingularQueryOutput<K extends SingularQueryKind> = SingularQueryOutputMap[K] extends
  infer OutputKind extends types.SingularQueryOutputBox['kind']
  ? (types.SingularQueryOutputBox & { kind: OutputKind })['value']
  : never

/**
 * Type function to map the selector of arbitrary shape to the corresponding output value.
 */
export type GetSelectorOutput<K extends keyof types.SelectorOutputMap, S> = S extends { kind: 'Atom' }
  ? types.SelectorOutputMap[K]['Atom'] extends infer OutputKind extends types.QueryOutputBatchBox['kind']
    ? (types.QueryOutputBatchBox & { kind: OutputKind })['value'] extends (infer Output)[] ? Output
    : never
  : never
  : [K, S] extends ['Metadata', { kind: 'Key'; value: { key: types.Name; projection: infer NextS } }]
    ? GetSelectorOutput<'Json', NextS>
  : S extends { kind: infer SKind extends keyof types.SelectorOutputMap[K]; value: infer NextS }
    ? types.SelectorOutputMap[K][SKind] extends infer NextK extends keyof types.SelectorOutputMap
      ? GetSelectorOutput<NextK, NextS>
    : never
  : never

/**
 * Kinds of _iterable_ queries.
 *
 * Note that this differs from {@link SingularQueryKind}.
 */
export type QueryKind = types.QueryBox['kind'] & keyof types.QuerySelectorMap

/**
 * Map a tuple with {@link GetSelectorOutput}.
 */
export type GetSelectorTupleOutput<K extends keyof types.SelectorOutputMap, Tuple> = Tuple extends [
  infer Head,
  ...infer Tail,
] ? [GetSelectorOutput<K, Head>, ...GetSelectorTupleOutput<K, Tail>]
  : Tuple extends [] ? []
  // Not as ergonomic (lost `const` somewhere?), but still works and is correct
  : Tuple extends Array<infer T> ? GetSelectorOutput<K, T>[]
  : never

/**
 * Maps a query kind and a selector to the corresponding output of this query and this selector.
 *
 * The selector must be either a single value or an array. Values of the selectors are actual variants
 * and structs of the selectors in the schema.
 *
 * If the selector is a single value or an array with a single value, the output will be just a value.
 */
export type SelectorToOutput<
  Q extends QueryKind & keyof types.QuerySelectorMap,
  Selection,
> = types.QuerySelectorMap[Q] extends infer Selector extends keyof types.SelectorOutputMap
  ? Selection extends readonly [infer S] ? GetSelectorOutput<Selector, S>
  : Selection extends readonly [] ? never
  : Selection extends readonly [...infer S] ? GetSelectorTupleOutput<Selector, S>
  : GetSelectorOutput<Selector, Selection>
  : never

/**
 * The default output is the root value of the query output, without any projections inside.
 */
export type DefaultQueryOutput<Q extends QueryKind> = GetSelectorOutput<
  Q extends keyof types.QuerySelectorMap
    ? types.QuerySelectorMap[Q] extends infer Selector extends keyof types.SelectorOutputMap ? Selector
    : never
    : never,
  VariantUnit<'Atom'>
>

const DEFAULT_SELECTOR = [{ kind: 'Atom' }]

/**
 * Maps query kind to its corresponding predicate type.
 */
export type PredicateFor<Q extends QueryKind> = (types.QueryBox & { kind: Q })['value'] extends
  types.QueryWithFilter<any, types.CompoundPredicate<infer P>, any> ? P
  : never

/**
 * Utility to build a query in a type-safe way.
 *
 * @param kind kind of the query
 * @param payload payload of the query (for most, it's `null`)
 * @param params params such as predicate, selector, pagination etc
 * @returns a constructed {@link types.QueryWithParams} and a function that extracts the typed output from
 * query response.
 */
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
            ? Array.isArray(params?.selector) ? params.selector : [params.selector]
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
/**
 * Params for {@link buildQuery}.
 */
export interface BuildQueryParams<K extends QueryKind> {
  /**
   * TODO how to work with predicates
   */
  predicate?: types.CompoundPredicate<PredicateFor<K>>
  /**
   * TODO examples of selectors
   */
  selector?: unknown
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

export type GetQueryPayload<K extends QueryKind> = (types.QueryBox & { kind: K })['value'] extends
  types.QueryWithFilter<infer Payload, any, any> ? Payload : never

/**
 * Result of {@link buildQuery}
 */
export interface BuildQueryResult<Output> {
  query: types.QueryWithParams
  parseResponse: (response: types.QueryOutputBatchBoxTuple) => Generator<Output>
}

/**
 * Utility type
 */
export type GetQueryOutput<K extends QueryKind, P extends BuildQueryParams<K>> = P extends {
  selector: infer S
} ? SelectorToOutput<K, S>
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
