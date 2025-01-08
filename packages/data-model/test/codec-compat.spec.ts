import type { Except, JsonValue } from 'type-fest'
import * as dm from '@iroha2/data-model'
import type { SCHEMA } from '@iroha2/data-model-schema'
import { resolveBinary } from '@iroha2/iroha-source'
import { execa } from 'execa'
import { describe, expect, test } from 'vitest'
import { SAMPLE_ACCOUNT_ID } from './util'

async function encodeWithCLI(type: keyof typeof SCHEMA, data: JsonValue): Promise<Uint8Array> {
  const tool = await resolveBinary('iroha_codec')
  const input = JSON.stringify(data, undefined, 2)
  try {
    const result = await execa(tool.path, ['json-to-scale', '--type', type], {
      input,
      encoding: null,
    })
    return new Uint8Array(result.stdout)
  } catch (err) {
    console.error(input)
    throw err
  }
}

function toHex(bytes: Uint8Array) {
  return [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('')
}

interface Case<T> {
  type: keyof typeof SCHEMA
  codec: dm.CodecProvider<T>
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
    codec: dm.HashWrap,
    value: dm.HashWrap.fromRaw(bytes),
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
      value: { start: dm.Timestamp.fromMillis(400), period: dm.Duration.fromMillis(100) },
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
        metadata: new Map(),
      },
    }),
  ]
}

function casesCompoundPredicates() {
  const base = {
    type: 'CompoundPredicate<Asset>',
    codec: dm.CompoundPredicate.with(dm.codecOf(dm.AssetProjectionPredicate)),
  } as const
  const atom = defCase({
    ...base,
    json: { Atom: { Id: { Account: { Domain: { Name: { Atom: { Equals: 'wonderland' } } } } } } },
    value: dm.CompoundPredicate.Atom<dm.AssetProjectionPredicate>(
      dm.AssetProjectionPredicate.Id.Account.Domain.Name.Atom.Equals(dm.DomainId.parse('wonderland')),
    ),
  } as const)
  return [
    atom,
    defCase({ ...base, json: { Not: atom.json }, value: dm.CompoundPredicate.Not(atom.value) }),
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
    value: new Set(['Created', 'Deleted']),
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
    dm.AccountId.parse('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'),
    new dm.AccountId(
      dm.PublicKeyWrap.fromHex('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'),
      dm.DomainId.parse('badland'),
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
    dm.AssetId.parse('rose##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'),
    dm.AssetId.parse('rose#badland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'),
  ),
  ...casesSchedule(),
  defCase({
    type: 'EventBox',
    json: { Time: { interval: { since_ms: 15_000, length_ms: 18_000 } } },
    codec: dm.EventBox,
    value: dm.EventBox.Time({
      interval: { since: dm.Timestamp.fromMillis(15_000), length: dm.Duration.fromMillis(18_000) },
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
          instructions: { Instructions: [{ Register: { Domain: { id: 'roses', metadata: {} } } }] },
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
          dm.InstructionBox.Register.Domain({ id: dm.DomainId.parse('roses'), metadata: new Map(), logo: null }),
        ]),
        timeToLive: null,
        nonce: null,
        metadata: new Map(),
      },
      signature: dm.SignatureWrap.fromHex(
        '4B3842C4CDB0E6364396A1019F303CE81CE4F01E56AF0FA9312AA070B88D405E831115112E5B23D76A30C6D81B85AB707FBDE0DE879D2ABA096D0CBEDB7BF30F',
      ),
    }),
  }),
  // TODO: add SignedBlock
])(`Check encoding against iroha_codec of type $type: $value`, async <T>(data: Case<T>) => {
  const referenceEncoded = await encodeWithCLI(data.type, data.json)
  const actualEncoded = dm.codecOf(data.codec).encode(data.value)
  expect(toHex(actualEncoded)).toEqual(toHex(referenceEncoded))
})
