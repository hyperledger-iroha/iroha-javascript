import type { Except, JsonValue } from 'type-fest'
import { Codec, datamodel } from '../src/lib'
import { resolveBinary } from '@iroha2/iroha-source'
import { execa } from 'execa'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import type { SCHEMA } from '@iroha2/data-model-schema'
import { z } from 'zod'
import { fromHexWithSpaces, toHex } from './util'
import { PublicKey } from '@iroha2/crypto-core'
import { parseHex } from '../src/util'

const SAMPLE_ACCOUNT_ID = 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'

async function encodeWithTool(type: keyof typeof SCHEMA, data: JsonValue): Promise<Uint8Array> {
  const tool = await resolveBinary('parity_scale_cli')
  const result = await execa(tool.path, ['json-to-scale', '--type', type], {
    input: JSON.stringify(data),
    encoding: null,
  })
  return new Uint8Array(result.stdout)
}

describe('Conversion', () => {
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
      type: 'QueryOutputPredicate',
      json: { TimeStamp: { start: 15_000, limit: 18_000 } },
      codec: datamodel.QueryOutputPredicate$codec,
      schema: datamodel.QueryOutputPredicate$schema,
      value: { t: 'TimeStamp', value: { start: 15_000, limit: 18_000 } },
    }),
    ...casesTxPayload(),
    defCase({
      type: 'ClientQueryPayload',
      json: {
        authority: SAMPLE_ACCOUNT_ID,
        query: { FindAllAccounts: null },
        filter: { Raw: 'Pass' },
        sorting: {},
        pagination: {},
        fetch_size: { fetch_size: null },
      },
      codec: datamodel.ClientQueryPayload$codec,
      schema: datamodel.ClientQueryPayload$schema,
      value: {
        authority: SAMPLE_ACCOUNT_ID,
        query: { t: 'FindAllAccounts' },
      },
    }),
  ])(`Convert $type: $value`, async (data: Case<any>) => {
    const parsed = data.schema.parse(data.value)
    const referenceEncoded = await encodeWithTool(data.type, data.json)
    const actualEncoded = data.codec.encode(parsed)
    expect(actualEncoded).toEqual(referenceEncoded)
  })
})

describe('Validation', () => {
  test('Ipv4', () => {
    expect(() => datamodel.Ipv4Addr([-1, 0, 0, 1])).toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "code": "too_small",
          "minimum": 0,
          "type": "number",
          "inclusive": true,
          "exact": false,
          "message": "Number must be greater than or equal to 0",
          "path": [
            0
          ]
        }
      ]]
    `)
  })

  test('Empty JSON string', () => {
    expect(() => datamodel.Json.fromJsonString('')).toThrowErrorMatchingInlineSnapshot(
      `[Error: JSON string cannot be empty]`,
    )
  })

  test.each(['  alice  ', 'ali ce', 'ali@ce', '', 'ali#ce'])('Name validation fails for %o', (sample) => {
    expect(() => datamodel.Name(sample)).toThrowError()
  })
})

test('Parse AssetId with different domains', () => {
  expect(
    datamodel.AssetId('rose#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'),
  ).toMatchInlineSnapshot(`
    {
      "account": {
        "domain": "badland",
        "signatory": {
          "algorithm": "ed25519",
          "payload": Uint8Array [
            178,
            62,
            20,
            246,
            89,
            185,
            23,
            54,
            170,
            185,
            128,
            182,
            173,
            220,
            228,
            177,
            219,
            138,
            19,
            138,
            176,
            38,
            126,
            4,
            156,
            8,
            42,
            116,
            68,
            113,
            113,
            78,
          ],
        },
      },
      "definition": {
        "domain": "wonderland",
        "name": "rose",
      },
    }
  `)
})

test('Fails to parse invalid account id with bad signatory', () => {
  expect(() => datamodel.AccountId('test@test')).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "Failed to parse PublicKey from a multihash hex: Error: Invalid character 't' at position 0\\n\\n invalid input: \\"test\\"",
        "path": [
          "signatory"
        ]
      }
    ]]
  `)
})

test('Fails to parse account id with multiple @', () => {
  expect(() => datamodel.AccountId('a@b@c')).toThrowErrorMatchingInlineSnapshot(`
    [ZodError: [
      {
        "code": "custom",
        "message": "account id should have format \`signatory@domain\`",
        "path": []
      }
    ]]
  `)
})

test('tx payload default creation time', () => {
  const DATE = new Date()
  vi.setSystemTime(DATE)
  onTestFinished(() => {
    vi.useRealTimers()
  })

  const txPayload = datamodel.TransactionPayload({
    chain: 'whatever',
    authority: SAMPLE_ACCOUNT_ID,
    instructions: { t: 'Instructions' },
  })

  expect(txPayload.creationTime.asDate().getTime()).toEqual(DATE.getTime())
})

describe('Status', () => {
  test('Documented example at https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status', () => {
    const STATUS: datamodel.Status = {
      peers: 4n,
      blocks: 5n,
      txsAccepted: 31n,
      txsRejected: 3n,
      uptime: {
        secs: 5n,
        nanos: 937000000,
      },
      viewChanges: 2n,
      queueSize: 18n,
    }
    const ENCODED = '10 14 7C 0C 14 40 7C D9 37 08 48'

    expect(datamodel.Status$codec.encode(STATUS)).toEqual(fromHexWithSpaces(ENCODED))
    expect(datamodel.Status$codec.decode(fromHexWithSpaces(ENCODED))).toEqual(STATUS)
  })

  test('From zeros', () => {
    expect(datamodel.Status$codec.decode(fromHexWithSpaces('00 00 00 00 00 00 00 00 00 00 00'))).toMatchInlineSnapshot(`
      {
        "blocks": 0n,
        "peers": 0n,
        "queueSize": 0n,
        "txsAccepted": 0n,
        "txsRejected": 0n,
        "uptime": {
          "nanos": 0,
          "secs": 0n,
        },
        "viewChanges": 0n,
      }
    `)
  })
})

test('Decode SignedBlock without errors', () => {
  const SAMPLE = fromHexWithSpaces(`
    0104000000000000000001018645b497f22d59d681254535acb76f1e3f9e
    7f33fe036d5777db64534068bedbc8b42d7def59354eb424fc47843edcde
    03a5fb2e6a5711bd585770bb9e9a7f03020000000000000001b543d34198
    f886408d49017660889aa943486701164b85606cf68a010d4ca2bbca6427
    cdf7b62212441236961692b1674bd3a3dfa1587435f822c7616dfdd9236d
    f13d499001000000000000000000000000000004007f00000139050080b2
    3e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a74447171
    4e04010101055a96ed446b8b364ef45944e80de7b9e1db0bc2b638b88835
    8620d5f82cff73a87c64e45ec25cff3bc2bb596bfe13ef86c65eaa2a8ffb
    1a1f5a988ed8058b079030303030303030302d303030302d303030302d30
    3030302d30303030303030303030303028776f6e6465726c616e640080b2
    3e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a74447171
    4e64f13d49900100000004000328776f6e6465726c616e640c786f720000
    010000000000010200110143616e27742072656769737465722061737365
    7420646566696e6974696f6e20696e206120646f6d61696e206f776e6564
    20627920616e6f74686572206163636f756e7400
  `)

  expect(() => datamodel.SignedBlock$codec.decode(SAMPLE)).not.toThrow()
})

test.each([
  'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
  PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'),
  { algorithm: 'ed25519', payload: 'B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E' },
  {
    algorithm: 'ed25519',
    payload: Uint8Array.from(parseHex('B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')),
  },
] satisfies z.input<typeof datamodel.PublicKey$schema>[])('Parse public key from %o', (input) => {
  const value = datamodel.PublicKey(input)
  expect(value.algorithm).toEqual('ed25519')
  expect(toHex(value.payload)).toEqual('B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'.toLowerCase())
})
