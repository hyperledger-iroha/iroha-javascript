import { types, extractQueryOutput, extractSingularQueryOutput } from '@iroha2/data-model'
import { expect, test } from 'vitest'
import { SAMPLE_ACCOUNT_ID } from './util'

test('Extract a batch of AssetDefinitions', () => {
  const definitions = [
    {
      id: types.AssetDefinitionId.parse('rose#wonderland'),
      type: types.AssetType.Numeric({ scale: null }),
      mintable: types.Mintable.Not,
      ownedBy: SAMPLE_ACCOUNT_ID,
      totalQuantity: { mantissa: 42n as types.Compact, scale: 0n as types.Compact },
      logo: null,
      metadata: new Map(),
    } satisfies types.AssetDefinition,
  ]
  const response = types.QueryResponse.Iterable({
    batch: { kind: 'AssetDefinition', value: definitions },
    remainingItems: 4n as types.U64,
    continueCursor: null,
  })
  expect(extractQueryOutput('FindAssetsDefinitions', response)).toEqual(definitions)
})

test('Extract singular domain metadata', () => {
  const metadata = { foo: 'bar', baz: [1, 2, 3] }
  const response = types.QueryResponse.Singular.Json(types.Json.fromValue(metadata))
  expect(extractSingularQueryOutput('FindDomainMetadata', response).asValue()).toEqual(metadata)
})
