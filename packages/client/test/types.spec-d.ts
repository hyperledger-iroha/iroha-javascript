import { Client, QueryHandle } from '@iroha2/client'
import * as dm from '@iroha2/data-model'

type Expect<T extends true> = T
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false

declare const client: Client

type QueryHandleOutput<Handle extends QueryHandle<any>> = Handle extends QueryHandle<infer T> ? T : never

// const findAccs = client.query('FindAccounts')
// type test_find_accounts_output = Expect<Equal<QueryHandleOutput<typeof findAccs>, dm.Account>>

const findAccs = client.find.accounts()
type test_find_accounts_output = Expect<Equal<QueryHandleOutput<typeof findAccs>, dm.Account>>

const findAccsWithFilter = client.find.accounts({
  predicate: dm.CompoundPredicate.Atom<dm.AccountProjectionPredicate>(
    dm.AccountProjectionPredicate.Id.Domain.Name.Atom.Contains('alice'),
  ),
})
type test_find_accs_with_filter = Expect<Equal<QueryHandleOutput<typeof findAccsWithFilter>, dm.Account>>

const findAccsWithSelector = client.find.accounts({
  selector: dm.AccountProjectionSelector.Atom,
})
type test_find_accs_selector = Expect<Equal<QueryHandleOutput<typeof findAccsWithSelector>, dm.Account>>

const findAccsWithSelector2 = client.find.accounts({
  selector: [dm.AccountProjectionSelector.Atom],
})
type test_find_accs_selector2 = Expect<Equal<QueryHandleOutput<typeof findAccsWithSelector2>, dm.Account>>

const findAccsWithSelector3 = client.find.accounts({
  selector: [dm.AccountProjectionSelector.Id.Signatory.Atom, dm.AccountProjectionSelector.Id.Domain.Name.Atom],
})
type test_find_accs_selector3 = Expect<
  Equal<QueryHandleOutput<typeof findAccsWithSelector3>, [dm.PublicKeyRepr, dm.Name]>
>

const accountsExecuteAll = await client.find.accounts().executeAll()
type test_accs_exec_all = Expect<Equal<typeof accountsExecuteAll, dm.Account[]>>

const findBlockHeaderHashes = client.find.blockHeaders({ selector: dm.BlockHeaderProjectionSelector.Hash.Atom })
type test_block_header_hashes = Expect<Equal<QueryHandleOutput<typeof findBlockHeaderHashes>, dm.HashRepr>>

const findDomainsMetadata = client.find.domains({ selector: dm.DomainProjectionSelector.Metadata.Atom })
const findAccountsMetadata = client.find.accounts({
  select: dm.DomainProjectionSelector.Metadata.Atom,
  filter: '',
  predicate: dm.CompoundPredicate.Atom(dm.AccountProjectionPredicate.Id.Domain.Name.Atom.Contains('test')),
})

const testExtraFields = client.find.accounts({
  predicate: dm.CompoundPredicate.Atom(dm.AccountProjectionPredicate.Id.Domain.Name.Atom.EndsWith('test')),
  filter: '',
  select: 12,
})
