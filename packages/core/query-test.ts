import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { QueryBuilder } from './query.ts'
import { DomainProjectionSelector } from '@iroha/core/data-model'
import * as types from './data-model/mod.ts'
import type { PartialDeep } from 'type-fest'

describe('QueryBuilder', () => {
  test('default selector is [atom]', () => {
    const builder = new QueryBuilder('FindDomains')

    expect(builder.build().query.value.selector).toEqual([{ kind: 'Atom' }])
  })

  test('when single selector is passed, it is wrapped into an array', () => {
    const builder = new QueryBuilder('FindDomains').selectWith((domain) => domain.id)

    expect(builder.build().query.value.selector).toEqual([DomainProjectionSelector.Id.Atom])
  })

  test('when array selector is passed, it is preserved as-is', () => {
    const builder: QueryBuilder<'FindAccounts', [types.AccountId, types.Metadata, types.PublicKey, types.Json]> =
      new QueryBuilder('FindAccounts')
        .selectWith((proto) => [
          proto.id,
          proto.metadata,
          proto.id.signatory,
          proto.metadata.key(new types.Name('test')),
        ])

    expect(builder.build().query.value.selector).toEqual([
      types.AccountProjectionSelector.Id.Atom,
      types.AccountProjectionSelector.Metadata.Atom,
      types.AccountProjectionSelector.Id.Signatory.Atom,
      types.AccountProjectionSelector.Metadata.Key({ key: new types.Name('test'), projection: { kind: 'Atom' } }),
    ])
  })

  test('uses PASS predicate by default (orphan "and")', () => {
    const builder = new QueryBuilder('FindAssets')

    expect(builder.build().query.value.predicate).toEqual({ kind: 'And', value: [] })
  })

  test('accepts query with payload', () => {
    const payload = {
      assetDefinition: types.AssetDefinitionId.parse('test#time'),
    } as const

    const builder = new QueryBuilder('FindAccountsWithAsset', payload)

    expect(builder.build().query.value.query).toEqual(payload)
  })

  test('accepts query with payload and params', () => {
    const payload = {
      assetDefinition: types.AssetDefinitionId.parse('test#time'),
    } as const

    const builder = new QueryBuilder('FindAccountsWithAsset', payload, { fetchSize: new types.NonZero(5) })

    expect(builder.build().query.value.query).toEqual(payload)
    expect(builder.build().params).toMatchObject({ fetchSize: new types.NonZero(5n) })
  })

  test('accepts query without payload but with params', () => {
    const builder = new QueryBuilder('FindTransactions', { offset: 2, limit: new types.NonZero(5) })

    expect(builder.build().query.value.query).toEqual(null)
    expect(builder.build().params).toMatchObject(
      { pagination: { offset: 2n, limit: new types.NonZero(5n) } } satisfies PartialDeep<types.QueryParams>,
    )
  })
})
