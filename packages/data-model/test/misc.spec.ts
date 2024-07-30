import { PublicKey } from '@iroha2/crypto-core'
import { datamodel } from '@iroha2/data-model'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import type { z } from 'zod'
import { parseHex } from '../src/util'
import { SAMPLE_ACCOUNT_ID, fromHexWithSpaces, toHex } from './util'

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
