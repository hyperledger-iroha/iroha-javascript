import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { getActualSelector, predicateProto, selectorProto } from './query-internal.ts'
import * as dm from './data-model/mod.ts'
import { Bytes } from './crypto/util.ts'

describe('predicateProto()', () => {
  function compare<T>(actual: T, expected: T) {
    expect(actual).toEqual(expected)
  }

  const SAMPLE_ACC = new dm.AccountId(dm.KeyPair.random().publicKey(), new dm.Name('www'))

  test('FindDomains', () => {
    const proto = predicateProto<'FindDomains'>()

    compare(
      predicateProto<'FindDomains'>().id.name.endsWith('test'),
      dm.DomainProjectionPredicate.Id.Name.Atom.EndsWith('test'),
    )

    compare(
      proto.id.equals(new dm.Name('test')),
      dm.DomainProjectionPredicate.Id.Atom.Equals(new dm.Name('test')),
    )

    compare(
      proto.metadata.key(new dm.Name('4412')).equals(dm.Json.fromValue([1, 2, 3])),
      dm.DomainProjectionPredicate.Metadata.Key({
        key: new dm.Name('4412'),
        projection: dm.JsonProjectionPredicate.Atom.Equals(dm.Json.fromValue([1, 2, 3])),
      }),
    )
  })

  test('FindBlocks', () => {
    const proto = predicateProto<'FindBlocks'>()

    compare(
      proto.header.hash.equals(dm.Hash.zeroed()),
      dm.SignedBlockProjectionPredicate.Header.Hash.Atom.Equals(dm.Hash.zeroed()),
    )
  })

  test('FindAssets', () => {
    const proto = predicateProto<'FindAssets'>()

    compare(
      proto.id.account.equals(SAMPLE_ACC),
      dm.AssetProjectionPredicate.Id.Account.Atom.Equals(SAMPLE_ACC),
    )

    compare(
      proto.id.account.signatory.equals(SAMPLE_ACC.signatory),
      dm.AssetProjectionPredicate.Id.Account.Signatory.Atom.Equals(SAMPLE_ACC.signatory),
    )
  })

  test('FindTransactions', () => {
    const proto = predicateProto<'FindTransactions'>()

    compare(
      proto.transactionResult.isOk(),
      dm.CommittedTransactionProjectionPredicate.TransactionResult.Atom.IsOk,
    )

    compare(
      proto.transactionResult.containsDataTrigger(new dm.TriggerId('trig')),
      dm.CommittedTransactionProjectionPredicate.TransactionResult.Atom.ContainsDataTrigger(new dm.TriggerId('trig')),
    )

    compare(
      proto.transactionResultHash.equals(dm.Hash.hash(Bytes.hex('aacc'))),
      dm.CommittedTransactionProjectionPredicate.TransactionResultHash.Atom.Equals(dm.Hash.hash(Bytes.hex('aacc'))),
    )

    compare(
      proto.blockHash.equals(dm.Hash.zeroed()),
      dm.CommittedTransactionProjectionPredicate.BlockHash.Atom.Equals(dm.Hash.zeroed()),
    )

    compare(
      proto.transactionEntrypoint.authority.domain.name.contains('wuw'),
      dm.CommittedTransactionProjectionPredicate.TransactionEntrypoint.Authority.Domain.Name.Atom.Contains('wuw'),
    )
  })

  test('metadata in different queries', () => {
    compare(
      predicateProto<'FindTriggers'>().action.metadata.key(new dm.Name('aaa')).equals(dm.Json.fromValue(false)),
      dm.TriggerProjectionPredicate.Action.Metadata.Key({
        key: new dm.Name('aaa'),
        projection: dm.JsonProjectionPredicate.Atom.Equals(dm.Json.fromValue(false)),
      }),
    )

    compare(
      predicateProto<'FindAccounts'>().metadata.key(new dm.Name('aaa')).equals(dm.Json.fromValue(false)),
      dm.AccountProjectionPredicate.Metadata.Key({
        key: new dm.Name('aaa'),
        projection: dm.JsonProjectionPredicate.Atom.Equals(dm.Json.fromValue(false)),
      }),
    )
  })
})

describe('selectorProto()', () => {
  function compare<S extends { __selector: string }>(selector: S, actual: unknown) {
    expect(getActualSelector(selector)).toEqual(actual)
  }

  test('FindDomains', () => {
    const proto = selectorProto<'FindDomains'>()

    compare(proto, dm.DomainProjectionSelector.Atom)
    compare(proto.id, dm.DomainProjectionSelector.Id.Atom)
    compare(proto.id.name, dm.DomainProjectionSelector.Id.Name.Atom)
    compare(proto.metadata, dm.DomainProjectionSelector.Metadata.Atom)
    compare(
      proto.metadata.key(new dm.Name('bbb')),
      dm.DomainProjectionSelector.Metadata.Key({ key: new dm.Name('bbb'), projection: dm.JsonProjectionSelector.Atom }),
    )
  })

  test('FindTransactions', () => {
    const proto = selectorProto<'FindTransactions'>()

    compare(proto, dm.CommittedTransactionProjectionSelector.Atom)
    compare(proto.transactionResult, dm.CommittedTransactionProjectionSelector.TransactionResult.Atom)
    compare(
      proto.transactionEntrypoint.authority.domain.name,
      dm.CommittedTransactionProjectionSelector.TransactionEntrypoint.Authority.Domain.Name.Atom,
    )
    compare(proto.blockHash, dm.CommittedTransactionProjectionSelector.BlockHash.Atom)
  })

  test('errors when trying to get an actual selector from wrong value', () => {
    expect(() => getActualSelector('whichever data')).toThrow('Expected a magical selector')
  })
})
