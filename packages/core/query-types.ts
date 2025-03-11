import type * as types from './data-model/mod.ts'
import type * as prototypes from './data-model/prototypes.generated.ts'

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
 * Kinds of _iterable_ queries.
 *
 * Note that this differs from {@link SingularQueryKind}.
 */
export type QueryKind =
  & types.QueryBox['kind']
  & keyof prototypes.QueryPredicates
  & keyof prototypes.QuerySelectors
  & keyof prototypes.QueryCompatibleSelectors

/**
 * Maps query kind to its corresponding predicate type.
 */
export type PredicateOf<Q extends QueryKind> = (types.QueryBox & { kind: Q })['value'] extends
  types.QueryWithFilter<any, types.CompoundPredicate<infer P>, any> ? P
  : never

type MapSelectedTuple<O> = O extends
  readonly [{ __selector: infer Id extends keyof prototypes.SelectorIdToOutput }, ...infer Rest]
  ? [prototypes.SelectorIdToOutput[Id], ...MapSelectedTuple<Rest>]
  : O extends [] ? []
  : never

export type SelectedTuple<O> = O extends { __selector: infer Id extends keyof prototypes.SelectorIdToOutput }
  ? prototypes.SelectorIdToOutput[Id]
  : O extends readonly [infer Single] ? SelectedTuple<Single>
  : MapSelectedTuple<O>

export type GetQueryPayload<K extends QueryKind> = (types.QueryBox & { kind: K })['value'] extends
  types.QueryWithFilter<infer Payload, any, any> ? Payload : never
