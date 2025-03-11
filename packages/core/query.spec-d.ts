// deno-lint-ignore-file no-unused-vars

import { CompoundPredicate } from './data-model/compound.ts'
import * as types from './data-model/mod.ts'
import type * as proto from './data-model/prototypes.generated.ts'
import { type GetSingularQueryOutput, QueryBuilder, type SingularQueryOutputMap } from './query.ts'

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

type BuilderOutput<Q extends QueryBuilder<any, any>> = Q extends QueryBuilder<any, infer O> ? O : never

type test_all_queries_in_predicates = Expect<Equal<keyof proto.QueryPredicates, types.QueryBox['kind']>>
type test_all_queries_in_selectors = Expect<Equal<keyof proto.QuerySelectors, types.QueryBox['kind']>>
type test_all_queries_in_compat = Expect<Equal<keyof proto.QueryCompatibleSelectors, types.QueryBox['kind']>>

const selectAccountDomainName = new QueryBuilder('FindAccounts').selectWith((acc) => acc.id.domain.name)
type test_selector_account_domain_name = Expect<
  Equal<
    BuilderOutput<typeof selectAccountDomainName>,
    types.Name
  >
>

const selectMetadataKey = new QueryBuilder('FindDomains').selectWith((x) => x.metadata.key(new types.Name('test')))
type test_selector_metadata_key = Expect<
  Equal<
    BuilderOutput<typeof selectMetadataKey>,
    types.Json
  >
>

const selectAccountAndId = new QueryBuilder('FindAccounts').selectWith((x) => [x, x.id])
type test_find_account_and_id = Expect<
  Equal<
    BuilderOutput<typeof selectAccountAndId>,
    [types.Account, types.AccountId]
  >
>

const selectBlocksDefault = new QueryBuilder('FindBlocks')
type test_default_output_for_blocks = Expect<Equal<BuilderOutput<typeof selectBlocksDefault>, types.SignedBlock>>

type singular_queries_in_output = keyof SingularQueryOutputMap
type singular_query_output_kinds = types.SingularQueryOutputBox['kind']

type test_singular_query_output_map_covers_all_queries = Expect<
  Equal<singular_queries_in_output, types.SingularQueryBox['kind']>
>

type test_singular_query_output_map_matches_with_output_box = Expect<
  Equal<SingularQueryOutputMap[singular_queries_in_output], singular_query_output_kinds>
>

type test_singular_query_output_dm = Expect<
  Equal<GetSingularQueryOutput<'FindExecutorDataModel'>, types.ExecutorDataModel>
>
type test_singular_query_output_params = Expect<Equal<GetSingularQueryOutput<'FindParameters'>, types.Parameters>>

const filterAllKinds = new QueryBuilder('FindAssets').filterWith((asset) =>
  CompoundPredicate.Or(
    CompoundPredicate.Not(
      CompoundPredicate.And(
        CompoundPredicate.Atom(asset.id.account.domain.name.endsWith('test')),
        CompoundPredicate.Atom(asset.id.definition.name.contains('test')),
      ),
    ),
    CompoundPredicate.Atom(asset.value.isStore()),
    CompoundPredicate.Atom(asset.value.store.key(new types.Name('test')).equals(types.Json.fromValue([false, true]))),
  )
)
