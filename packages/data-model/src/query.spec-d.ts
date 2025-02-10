import type {
  Account,
  AccountId,
  Asset,
  ExecutorDataModel,
  Json,
  Metadata,
  Name,
  Parameters,
  QueryBox,
  QueryOutputBatchBox,
  QuerySelectorMap,
  SelectorOutputMap,
  SignedBlock,
  SingularQueryBox,
  SingularQueryOutputBox,
} from './data-model.ts'
import type {
  DefaultQueryOutput,
  GetQueryOutput,
  GetSelectorOutput,
  GetSingularQueryOutput,
  SelectorToOutput,
  SingularQueryOutputMap,
} from './query.ts'
import type { Variant, VariantUnit } from './util.ts'

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

type test_query_selector_map_has_all_queries = Expect<Equal<keyof QuerySelectorMap, QueryBox['kind']>>

type dbg1 = QuerySelectorMap[keyof QuerySelectorMap]
type dbg2 = keyof SelectorOutputMap

type test_query_selector_map_matches_selector_output_map = Expect<
  QuerySelectorMap[keyof QuerySelectorMap] extends keyof SelectorOutputMap ? true : false
>

type selector_output_atoms = SelectorOutputMap[keyof SelectorOutputMap]['Atom']
type query_output_box_kinds = QueryOutputBatchBox['kind']

type test_all_selector_output_atoms_are_present_in_output_box = Expect<
  Equal<Exclude<selector_output_atoms, query_output_box_kinds>, never>
>

/**
 * Effectively these output kinds are impossible to receive from Iroha at the moment.
 *
 * The `String` output exists because there is a `StringPredicateAtom`. It is a design
 * limitation (or implementation issue?) of selectors & predicates in Iroha codebase -
 * they mirror each other.
 *
 * As for `Parameter`, it is neither possible to use in predicates nor in selectors and is
 * completely redundant at the moment. Maybe it was added as a stub for future.
 */
type test_few_output_options_arent_covered_by_selectors = Expect<
  Equal<Exclude<query_output_box_kinds, selector_output_atoms>, 'String' | 'Parameter'>
>

type test_selector_account_domain_name = Expect<
  Equal<
    GetSelectorOutput<'Account', Variant<'Id', Variant<'Domain', Variant<'Name', VariantUnit<'Atom'>>>>>,
    //
    Name
  >
>

type test_selector_metadata_key = Expect<
  Equal<
    GetSelectorOutput<'Metadata', Variant<'Key', { key: Name; projection: VariantUnit<'Atom'> }>>,
    //
    Json
  >
>

type test_selector_accout_metadata_key = Expect<
  Equal<
    GetSelectorOutput<'Account', Variant<'Metadata', Variant<'Key', { key: Name; projection: VariantUnit<'Atom'> }>>>,
    //
    Json
  >
>

type test_selector_metadata_atom = Expect<Equal<GetSelectorOutput<'Metadata', VariantUnit<'Atom'>>, Metadata>>

type test_find_account_and_id = Expect<
  Equal<
    SelectorToOutput<'FindAccounts', [VariantUnit<'Atom'>, Variant<'Id', VariantUnit<'Atom'>>]>,
    [Account, AccountId]
  >
>

type test_find_account_metadata_key = Expect<
  Equal<
    SelectorToOutput<
      'FindAccounts',
      Variant<'Metadata', Variant<'Key', { key: Name; projection: VariantUnit<'Atom'> }>>
    >,
    Json
  >
>

type test_default_output_for_blocks = Expect<Equal<DefaultQueryOutput<'FindBlocks'>, SignedBlock>>

type singular_queries_in_output = keyof SingularQueryOutputMap
type singular_query_output_kinds = SingularQueryOutputBox['kind']

type test_singular_query_output_map_covers_all_queries = Expect<
  Equal<singular_queries_in_output, SingularQueryBox['kind']>
>

type test_singular_query_output_map_matches_with_output_box = Expect<
  Equal<SingularQueryOutputMap[singular_queries_in_output], singular_query_output_kinds>
>

type test_singular_query_output_dm = Expect<Equal<GetSingularQueryOutput<'FindExecutorDataModel'>, ExecutorDataModel>>
type test_singular_query_output_params = Expect<Equal<GetSingularQueryOutput<'FindParameters'>, Parameters>>

type test_query_outputs =
  & Expect<Equal<GetQueryOutput<'FindAccounts', Record<string, never>>, Account>>
  & Expect<Equal<GetQueryOutput<'FindAccounts', { predicate: undefined }>, Account>>

type test_selector_as_array_not_tuple = Expect<Equal<SelectorToOutput<'FindAssets', VariantUnit<'Atom'>[]>, Asset[]>>
