// deno-lint-ignore-file no-unused-vars

import * as types from '@iroha/core/data-model'
import { type Client, QueryBuilder, type QueryExecutor } from '@iroha/client'

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

declare const executor: QueryExecutor
declare const client: Client

const selectPeerKeys = await new QueryBuilder(executor, 'FindPeers')
  .filterWith((proto) => types.CompoundPredicate.Atom(proto.publicKey.equals(types.PublicKey.fromMultihash('test'))))
  .selectWith((proto) => proto.publicKey)
  .executeAll()
type test_select_peer_keys = Expect<Equal<typeof selectPeerKeys, types.PublicKey[]>>

const selectAccountMulti = await new QueryBuilder(executor, 'FindAccounts', {
  offset: 5n,
  limit: new types.NonZero(5),
})
  .selectWith((
    account,
  ) => [
    account.id.domain.name,
    account.metadata.key(new types.Name('key1')),
    account.metadata.key(new types.Name('key2')),
  ])
  .executeAll()
type test_select_account_multi = Expect<Equal<typeof selectAccountMulti, [types.Name, types.Json, types.Json][]>>

type BuilderOutput<Handle extends QueryBuilder<any, any>> = Handle extends QueryBuilder<any, infer T> ? T : never

const findAccs = client.find.accounts()
type test_find_accounts_output = Expect<Equal<BuilderOutput<typeof findAccs>, types.Account>>

const findAccsWithFilter = client.find.accounts()
  .filterWith((proto) => types.CompoundPredicate.Atom(proto.id.domain.name.contains('alice')))
type test_find_accs_with_filter = Expect<Equal<BuilderOutput<typeof findAccsWithFilter>, types.Account>>

const findAccsWithSelector = client.find.accounts().selectWith((x) => x)
type test_find_accs_selector = Expect<Equal<BuilderOutput<typeof findAccsWithSelector>, types.Account>>

const findAccsWithSelector2 = client.find.accounts().selectWith((x) => [x])
type test_find_accs_selector2 = Expect<Equal<BuilderOutput<typeof findAccsWithSelector2>, types.Account>>

const findAccsWithSelector3 = client.find.accounts()
  .selectWith((acc) => [acc.id.signatory, acc.id.domain.name])
type test_find_accs_selector3 = Expect<
  Equal<BuilderOutput<typeof findAccsWithSelector3>, [types.PublicKey, types.Name]>
>

const accountsExecuteAll = await client.find.accounts().executeAll()
type test_accs_exec_all = Expect<Equal<typeof accountsExecuteAll, types.Account[]>>

const findBlockHeaderHashes = client.find.blockHeaders().selectWith((x) => x.hash)
type test_block_header_hashes = Expect<Equal<BuilderOutput<typeof findBlockHeaderHashes>, types.Hash>>

const findDomainsMetadata = client.find.domains().selectWith((x) => x.metadata)
const findAccountsMetadata = client.find.accounts()
  .selectWith((x) => x.metadata)
  .filterWith((x) => types.CompoundPredicate.Atom(x.id.domain.name.contains('test')))
