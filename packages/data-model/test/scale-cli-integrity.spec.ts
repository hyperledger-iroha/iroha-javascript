import type { Except, JsonValue } from 'type-fest'
import { type Codec, datamodel } from '@iroha2/data-model'
import type { SCHEMA } from '@iroha2/data-model-schema'
import { resolveBinary } from '@iroha2/iroha-source'
import { execa } from 'execa'
import { expect, test } from 'vitest'
import type { z } from 'zod'
import { SAMPLE_ACCOUNT_ID } from './util'

async function encodeWithCLI(type: keyof typeof SCHEMA, data: JsonValue): Promise<Uint8Array> {
  const tool = await resolveBinary('parity_scale_cli')
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

interface Case<T extends z.ZodType> {
  type: keyof typeof SCHEMA
  json: JsonValue
  schema: T
  value: z.input<T>
  codec: Codec<z.infer<T>>
}

function defCase<T extends z.ZodType>(data: Case<T>) {
  return data
}

function* defMultipleValues<T extends z.ZodType>(data: Except<Case<T>, 'value'>, ...values: z.input<T>[]) {
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
    schema: datamodel.Hash$schema,
    codec: datamodel.Hash$codec,
    value: bytes,
  })
}

// checks durations & timestamps
function casesSchedule() {
  const base = { type: 'Schedule', codec: datamodel.Schedule$codec, schema: datamodel.Schedule$schema } as const
  const start = new Date('2024-07-24T04:26:38.736Z')
  return [
    defCase({ ...base, json: { start_ms: 400 }, value: { start: 400 } }),
    defCase({ ...base, json: { start_ms: start.getTime() }, value: { start } }),
    defCase({ ...base, json: { start_ms: 500 }, value: { start: 500n } }),
    defCase({ ...base, json: { start_ms: 400, period_ms: 100 }, value: { start: 400, period: { Some: 100 } } }),
  ]
}

// TODO: support strings as user inputs?
function casesAddrs() {
  const base = { type: 'SocketAddr', codec: datamodel.SocketAddr$codec, schema: datamodel.SocketAddr$schema } as const
  return [
    defCase({ ...base, json: '127.0.0.1:8080', value: { t: 'Ipv4', value: { ip: [127, 0, 0, 1], port: 8080 } } }),
    defCase({ ...base, json: 'localhost:8080', value: { t: 'Host', value: { host: 'localhost', port: 8080 } } }),
    defCase({
      ...base,
      json: '[84d5:51a0:9114:1855:4cfa:f2d7:1f12:7003]:4000',
      value: {
        t: 'Ipv6',
        value: { ip: [0x84d5, 0x51a0, 0x9114, 0x1855, 0x4cfa, 0xf2d7, 0x1f12, 0x7003], port: 4000 },
      },
    }),
  ]
}

function casesTxPayload() {
  const base = {
    type: 'TransactionPayload',
    codec: datamodel.TransactionPayload$codec,
    schema: datamodel.TransactionPayload$schema,
  } as const
  return [
    defCase({
      ...base,
      json: {
        chain: 'test',
        authority: SAMPLE_ACCOUNT_ID,
        instructions: { Instructions: [] },
        creation_time_ms: 505050,
        metadata: {},
      },
      value: {
        chain: 'test',
        authority: SAMPLE_ACCOUNT_ID,
        instructions: { t: 'Instructions' },
        creationTime: new Date(505050),
      },
    }),
  ]
}

function casesCompoundPredicates() {
  const base = {
    type: 'CompoundPredicate<AssetPredicateBox>',
    codec: datamodel.CompoundPredicate$codec(datamodel.AssetPredicateBox$codec),
    schema: datamodel.CompoundPredicate$schema(datamodel.AssetPredicateBox$schema),
  } as const
  const atom = defCase({
    ...base,
    json: { Atom: { Id: { AccountId: { DomainId: { Equals: 'wonderland' } } } } },
    value: {
      t: 'Atom',
      value: {
        t: 'Id',
        value: { t: 'AccountId', value: { t: 'DomainId', value: { t: 'Equals', value: 'wonderland' } } },
      },
    },
  } as const)
  return [
    atom,
    defCase({ ...base, json: { Not: atom.json }, value: { t: 'Not', value: atom.value } }),
    defCase({ ...base, json: { And: [atom.json, atom.json] }, value: { t: 'And', value: [atom.value, atom.value] } }),
    defCase({ ...base, json: { Or: [atom.json, atom.json] }, value: { t: 'Or', value: [atom.value, atom.value] } }),
  ]
}

test.each([
  defCase({
    type: 'SocketAddr',
    json: 'localhost:8080',
    schema: datamodel.SocketAddr$schema,
    codec: datamodel.SocketAddr$codec,
    value: { t: 'Host', value: { host: 'localhost', port: 8080 } },
  }),
  caseHash(),
  defCase({
    type: 'Ipv4Addr',
    json: '127.0.0.1',
    schema: datamodel.Ipv4Addr$schema,
    codec: datamodel.Ipv4Addr$codec,
    value: [127, 0, 0, 1],
  }),
  ...defMultipleValues(
    {
      type: 'AccountEventSet',
      json: ['Deleted', 'Created'],
      schema: datamodel.AccountEventSet$schema,
      codec: datamodel.AccountEventSet$codec,
    },
    ['Created', 'Deleted'],
    ['Deleted', 'Created'],
    new Set(['Deleted', 'Created'] as const),
  ),
  defCase({
    type: 'Level',
    json: 'INFO',
    schema: datamodel.LogLevel$schema,
    codec: datamodel.LogLevel$codec,
    value: 'INFO',
  }),
  ...defMultipleValues(
    {
      type: 'JsonString',
      json: { whatever: ['foo', 'bar'] },
      schema: datamodel.Json$schema,
      codec: datamodel.Json$codec,
    },
    { whatever: ['foo', 'bar'] },
    datamodel.Json.fromJsonString(`{"whatever":["foo","bar"]}`),
  ),
  ...defMultipleValues(
    {
      type: 'AccountId',
      json: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
      schema: datamodel.AccountId$schema,
      codec: datamodel.AccountId$codec,
    },
    {
      domain: 'badland',
      signatory: {
        algorithm: 'ed25519',
        payload: 'B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
      },
    },
    'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
  ),
  ...defMultipleValues(
    {
      type: 'AssetDefinitionId',
      json: 'rose#badland',
      schema: datamodel.AssetDefinitionId$schema,
      codec: datamodel.AssetDefinitionId$codec,
    },
    { domain: 'badland', name: 'rose' },
    'rose#badland',
  ),
  ...defMultipleValues(
    {
      type: 'AssetId',
      json: 'rose##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
      schema: datamodel.AssetId$schema,
      codec: datamodel.AssetId$codec,
    },
    'rose##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
    'rose#badland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
    {
      account: {
        signatory: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
        domain: 'badland',
      },
      definition: {
        name: 'rose',
        domain: 'badland',
      },
    },
  ),
  ...casesSchedule(),
  ...casesAddrs(),
  defCase({
    type: 'EventBox',
    json: { Time: { interval: { since_ms: 15_000, length_ms: 18_000 } } },
    codec: datamodel.EventBox$codec,
    schema: datamodel.EventBox$schema,
    value: { t: 'Time', value: { interval: { since: 15_000, length: 18_000 } } },
  }),
  ...casesTxPayload(),
  defCase({
    type: 'QueryRequestWithAuthority',
    json: {
      authority: SAMPLE_ACCOUNT_ID,
      request: {
        Start: {
          query: { FindAccounts: { query: null, predicate: { And: [] } } },
        },
      },
    },
    codec: datamodel.QueryRequestWithAuthority$codec,
    schema: datamodel.QueryRequestWithAuthority$schema,
    value: {
      authority: SAMPLE_ACCOUNT_ID,
      request: {
        t: 'Start',
        value: { query: { t: 'FindAccounts', value: { predicate: { t: 'And', value: [] } } } },
      },
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
        signature: {
          payload:
            '4B3842C4CDB0E6364396A1019F303CE81CE4F01E56AF0FA9312AA070B88D405E831115112E5B23D76A30C6D81B85AB707FBDE0DE879D2ABA096D0CBEDB7BF30F',
        },
      },
    },
    codec: datamodel.SignedTransaction$codec,
    schema: datamodel.SignedTransaction$schema,
    value: {
      t: 'V1',
      value: {
        payload: {
          chain: '0',
          authority: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@wonderland',
          creationTime: new Date(1723592746838),
          instructions: {
            t: 'Instructions',
            value: [
              {
                t: 'Register',
                value: {
                  t: 'Domain',
                  value: {
                    object: {
                      id: 'roses',
                    },
                  },
                },
              },
            ],
          },
        },
        signature:
          '4B3842C4CDB0E6364396A1019F303CE81CE4F01E56AF0FA9312AA070B88D405E831115112E5B23D76A30C6D81B85AB707FBDE0DE879D2ABA096D0CBEDB7BF30F',
      },
    },
  }),
  // TODO: add SignedBlock
])(`Ensure correct parsing & encoding of $type: $value`, async (data: Case<any>) => {
  const parsed = data.schema.parse(data.value)
  const referenceEncoded = await encodeWithCLI(data.type, data.json)
  const actualEncoded = data.codec.encode(parsed)
  expect(toHex(actualEncoded)).toEqual(toHex(referenceEncoded))
})
