import type { Except, JsonValue } from 'type-fest'
import { type CodecContainer, defineCodec, getCodec } from '@iroha/core'
import * as dm from '@iroha/core/data-model'
import type SCHEMA from '@iroha/core/data-model/schema-json'
import { irohaCodecToScale } from '@iroha/iroha-source'
import { describe, expect, test } from 'vitest'
import { Bytes, KeyPair } from '@iroha/crypto'

export const SAMPLE_ACCOUNT_ID = dm.AccountId.parse(
  'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
)

function toHex(bytes: Uint8Array) {
  return [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('')
}

interface Case<T> {
  type: keyof typeof SCHEMA
  codec: CodecContainer<T>
  value: T
  json: JsonValue
}

function defCase<T>(data: Case<T>) {
  return data
}

function* defMultipleValues<T>(data: Except<Case<T>, 'value'>, ...values: T[]) {
  for (const value of values) {
    yield { ...data, value }
  }
}

function caseHash() {
  const bytes = Uint8Array.from({ length: 32 }, (_v, i) => i)
  const hex = toHex(bytes)
  return defCase({
    type: 'Hash',
    json: hex,
    codec: dm.HashRepr,
    value: dm.HashRepr.fromRaw(bytes),
  })
}

// checks durations & timestamps
function casesSchedule() {
  const base = { type: 'Schedule', codec: dm.Schedule } as const
  const start = new Date('2024-07-24T04:26:38.736Z')
  return [
    defCase({
      ...base,
      json: { start_ms: 400 },
      value: { start: dm.Timestamp.fromMillis(400), period: null },
    }),
    defCase({
      ...base,
      json: { start_ms: 500 },
      value: { start: dm.Timestamp.fromMillis(500n), period: null },
    }),
    defCase({
      ...base,
      json: { start_ms: start.getTime() },
      value: { start: dm.Timestamp.fromDate(start), period: null },
    }),
    defCase({
      ...base,
      json: { start_ms: 400, period_ms: 100 },
      value: {
        start: dm.Timestamp.fromMillis(400),
        period: dm.Duration.fromMillis(100),
      },
    }),
  ]
}

function casesTxPayload() {
  const base = {
    type: 'TransactionPayload',
    codec: dm.TransactionPayload,
  } as const
  return [
    defCase({
      ...base,
      json: {
        chain: 'test',
        authority: SAMPLE_ACCOUNT_ID.toJSON(),
        instructions: { Instructions: [] },
        creation_time_ms: 505050,
        metadata: {},
      },
      value: {
        chain: 'test',
        authority: SAMPLE_ACCOUNT_ID,
        instructions: dm.Executable.Instructions([]),
        creationTime: dm.Timestamp.fromDate(new Date(505050)),
        timeToLive: null,
        nonce: null,
        metadata: [],
      },
    }),
  ]
}

function casesCompoundPredicates() {
  const base = {
    type: 'CompoundPredicate<Asset>',
    codec: defineCodec(
      dm.CompoundPredicate.with(getCodec(dm.AssetProjectionPredicate)),
    ),
  } as const
  const atom = defCase(
    {
      ...base,
      json: {
        Atom: {
          Id: {
            Account: { Domain: { Name: { Atom: { Equals: 'wonderland' } } } },
          },
        },
      },
      value: dm.CompoundPredicate.Atom<dm.AssetProjectionPredicate>(
        dm.AssetProjectionPredicate.Id.Account.Domain.Name.Atom.Equals(
          'wonderland',
        ),
      ),
    } as const,
  )
  return [
    atom,
    defCase({
      ...base,
      json: { Not: atom.json },
      value: dm.CompoundPredicate.Not(atom.value),
    }),
    defCase({
      ...base,
      json: { And: [atom.json, atom.json] },
      value: dm.CompoundPredicate.And(atom.value, atom.value),
    }),
    defCase({
      ...base,
      json: { Or: [atom.json, atom.json] },
      value: dm.CompoundPredicate.Or(atom.value, atom.value),
    }),
  ]
}
test.each([
  caseHash(),
  defCase({
    type: 'AccountEventSet',
    json: ['Deleted', 'Created'],
    codec: dm.AccountEventSet,
    value: new Set(['Created', 'Deleted'] as const),
  }),
  // defCase({
  //   type: 'Level',
  //   json: 'INFO',
  //   codec: dm.LogLevel,
  //   value: dm.LogLevel.INFO,
  // }),
  ...defMultipleValues(
    {
      type: 'Json',
      json: { whatever: ['foo', 'bar'] },
      codec: dm.Json,
    },
    dm.Json.fromValue({ whatever: ['foo', 'bar'] }),
    dm.Json.fromJsonString(`{"whatever":["foo","bar"]}`),
  ),
  ...defMultipleValues(
    {
      type: 'AccountId',
      json: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
      codec: dm.AccountId,
    },
    dm.AccountId.parse(
      'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
    ),
    new dm.AccountId(
      dm.PublicKeyRepr.fromHex(
        'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
      ),
      new dm.Name('badland'),
    ),
  ),
  ...defMultipleValues(
    {
      type: 'AssetDefinitionId',
      json: 'rose#badland',
      codec: dm.AssetDefinitionId,
    },
    dm.AssetDefinitionId.parse('rose#badland'),
  ),
  ...defMultipleValues(
    {
      type: 'AssetId',
      json: 'rose##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
      codec: dm.AssetId,
    },
    dm.AssetId.parse(
      'rose##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
    ),
    dm.AssetId.parse(
      'rose#badland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
    ),
  ),
  ...casesSchedule(),
  defCase({
    type: 'EventBox',
    json: { Time: { interval: { since_ms: 15_000, length_ms: 18_000 } } },
    codec: dm.EventBox,
    value: dm.EventBox.Time({
      interval: {
        since: dm.Timestamp.fromMillis(15_000),
        length: dm.Duration.fromMillis(18_000),
      },
    }),
  }),
  ...casesTxPayload(),
  defCase({
    type: 'QueryRequestWithAuthority',
    json: {
      authority: SAMPLE_ACCOUNT_ID.toJSON(),
      request: {
        Start: {
          query: { FindAccounts: { query: null, predicate: { And: [] } } },
        },
      },
    },
    codec: dm.QueryRequestWithAuthority,
    value: {
      authority: SAMPLE_ACCOUNT_ID,
      request: dm.QueryRequest.Start({
        query: dm.QueryBox.FindAccounts({
          predicate: dm.CompoundPredicate.PASS,
          query: null,
          selector: [dm.AccountProjectionSelector.Atom],
        }),
        params: {
          pagination: { offset: 0n, limit: null },
          sorting: { sortByMetadataKey: null },
          fetchSize: null,
        },
      }),
    },
  }),
  ...casesCompoundPredicates(),
  defCase({
    type: 'SignedTransaction',
    json: {
      version: '1',
      content: {
        payload: {
          chain: '0',
          authority: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@wonderland',
          creation_time_ms: 1723592746838,
          instructions: {
            Instructions: [{
              Register: { Domain: { id: 'roses', metadata: {} } },
            }],
          },
          metadata: {},
        },
        signature:
          '4B3842C4CDB0E6364396A1019F303CE81CE4F01E56AF0FA9312AA070B88D405E831115112E5B23D76A30C6D81B85AB707FBDE0DE879D2ABA096D0CBEDB7BF30F',
      },
    },
    codec: dm.SignedTransaction,
    value: dm.SignedTransaction.V1({
      payload: {
        chain: '0',
        authority: dm.AccountId.parse(
          'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@wonderland',
        ),
        creationTime: dm.Timestamp.fromDate(new Date(1723592746838)),
        instructions: dm.Executable.Instructions([
          dm.InstructionBox.Register.Domain({
            id: new dm.Name('roses'),
            metadata: [],
            logo: null,
          }),
        ]),
        timeToLive: null,
        nonce: null,
        metadata: [],
      },
      signature: dm.SignatureRepr.fromHex(
        '4B3842C4CDB0E6364396A1019F303CE81CE4F01E56AF0FA9312AA070B88D405E831115112E5B23D76A30C6D81B85AB707FBDE0DE879D2ABA096D0CBEDB7BF30F',
      ),
    }),
  }),
  defCase({
    type: 'SortedMap<u64, TransactionRejectionReason>',
    json: { 1: { WasmExecution: 'whichever' }, 0: { LimitCheck: 'mewo' } },
    codec: dm.TransactionErrors,
    value: [
      {
        index: 1n,
        error: dm.TransactionRejectionReason.WasmExecution({
          reason: 'whichever',
        }),
      },
      {
        index: 0n,
        error: dm.TransactionRejectionReason.LimitCheck({ reason: 'mewo' }),
      },
    ],
  }),
  // TODO: add SignedBlock
] as Case<unknown>[])(
  `Check encoding against iroha_codec of type $type: $value`,
  async <T>(data: Case<T>) => {
    const referenceEncoded = await irohaCodecToScale(data.type, data.json)
    const actualEncoded = getCodec(data.codec).encode(data.value)
    expect(toHex(actualEncoded)).toEqual(toHex(referenceEncoded))
  },
)

describe('BTree{Set/Map}', () => {
  test('Metadata encoding matches with iroha_codec', async () => {
    const CODEC = getCodec(dm.Metadata)
    const reference = await irohaCodecToScale('Metadata', {
      foo: 'bar',
      bar: [1, 2, 3],
      '1': 2,
      12: 1,
      2: false,
    })

    const value: dm.Metadata = [
      { key: new dm.Name('foo'), value: dm.Json.fromValue('bar') },
      { key: new dm.Name('bar'), value: dm.Json.fromValue([1, 2, 3]) },
      { key: new dm.Name('1'), value: dm.Json.fromValue(2) },
      { key: new dm.Name('12'), value: dm.Json.fromValue(1) },
      { key: new dm.Name('2'), value: dm.Json.fromValue(false) },
    ]

    expect(CODEC.decode(reference)).toEqual(CODEC.decode(CODEC.encode(value)))
    expect(CODEC.encode(value)).toEqual(reference)
  })

  test('Metadata encoding is the same with and without duplicate entries', () => {
    const CODEC = getCodec(dm.Metadata)

    const withDuplicate: dm.Metadata = [
      { key: new dm.Name('foo'), value: dm.Json.fromValue('bar') },
      { key: new dm.Name('foo'), value: dm.Json.fromValue([1, 2, 3]) },
    ]
    const without: dm.Metadata = [{
      key: new dm.Name('foo'),
      value: dm.Json.fromValue([1, 2, 3]),
    }]

    expect(CODEC.encode(withDuplicate)).toEqual(CODEC.encode(without))
  })

  test('BTreeSet<AccountId> - encoding matches with mixed keys and mixed domains', async () => {
    const keys = Array.from(
      { length: 7 },
      (_v, i) =>
        dm.PublicKeyRepr.fromCrypto(
          KeyPair.deriveFromSeed(Bytes.array(new Uint8Array([0, 1, 2, i])))
            .publicKey(),
        ),
    )

    const domains = Array.from(
      { length: 5 },
      (_v, i) => new dm.DomainId(`domain-${i}`),
    )

    const ids = keys.flatMap((key) =>
      domains.flatMap((
        domain,
      ) => [new dm.AccountId(key, domain), new dm.AccountId(key, domain)])
    )

    const reference = await irohaCodecToScale(
      'SortedVec<AccountId>',
      ids.map((x) => x.toJSON()),
    )

    expect(dm.BTreeSet.with(getCodec(dm.AccountId)).encode(ids)).toEqual(
      reference,
    )
  })

  test('BTreeSet<Permission> - encoding matches', async () => {
    const codec = getCodec(dm.PermissionsSet)
    const reference = await irohaCodecToScale('SortedVec<Permission>', [
      { name: 'foo', payload: [1, 2, 3] },
      { name: 'foo', payload: [3, 2, 1] },
      { name: 'bar', payload: false },
    ])

    const js: dm.PermissionsSet = [
      { name: 'foo', payload: dm.Json.fromValue([3, 2, 1]) },
      { name: 'foo', payload: dm.Json.fromValue([1, 2, 3]) },
      // this must be deduped
      { name: 'foo', payload: dm.Json.fromValue([1, 2, 3]) },
      { name: 'bar', payload: dm.Json.fromValue(false) },
    ]

    const encoded = codec.encode(js)
    expect(encoded).toEqual(reference)

    const decoded = codec.decode(encoded)
    expect(decoded).toEqual(codec.decode(reference))
    expect(decoded).toMatchInlineSnapshot(`
      [
        {
          "name": "bar",
          "payload": false,
        },
        {
          "name": "foo",
          "payload": [
            1,
            2,
            3,
          ],
        },
        {
          "name": "foo",
          "payload": [
            3,
            2,
            1,
          ],
        },
      ]
    `)
  })
})
