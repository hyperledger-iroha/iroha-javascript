import { KeyPair, PublicKey } from '@iroha2/crypto-core'
import { types } from '@iroha2/data-model'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import type { z } from 'zod'
import { hexDecode } from '../src/util'
import { SAMPLE_ACCOUNT_ID, fromHexWithSpaces, toHex } from './util'

describe('JSON serialisation', () => {
  test('AccountId', () => {
    const SIGNATORY = `ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E`
    const DOMAIN = 'badland'
    const ID = `${SIGNATORY}@${DOMAIN}`

    expect(types.AccountId.parse(ID).toJSON()).toEqual(ID)
    expect(types.AccountId.parse({ signatory: SIGNATORY, domain: DOMAIN }).toJSON()).toEqual(ID)
  })

  test('AccountId (after being decoded)', () => {
    const pk = KeyPair.random().publicKey()
    const decoded = types.AccountId$codec.decode(
      types.AccountId$codec.encode(types.AccountId.parse({ signatory: pk, domain: 'test' })),
    )

    expect(decoded.toJSON()).toEqual(`${pk.toMultihash()}@test`)
  })
})

describe('Validation', () => {
  test('Empty JSON string', () => {
    expect(() => types.Json.fromJsonString('')).toThrowErrorMatchingInlineSnapshot(
      `[Error: JSON string cannot be empty]`,
    )
  })

  test.each(['  alice  ', 'ali ce', 'ali@ce', '', 'ali#ce'])('Name validation fails for %o', (sample) => {
    expect(() => types.Name(sample)).toThrowError()
  })
})

test('Parse AssetId with different domains', () => {
  const parsed = types.AssetId$schema.parse(
    'rose#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
  )

  expect(parsed.definition.name).toEqual('rose')
  expect(parsed.definition.domain).toEqual('wonderland')
  expect(parsed.account.signatory.algorithm).toEqual('ed25519')
  expect(toHex(parsed.account.signatory.payload)).toEqual(
    'b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e',
  )
  expect(parsed.account.domain).toEqual('badland')
})

test('Fails to parse invalid account id with bad signatory', () => {
  expect(() => types.AccountId$schema.parse('test@test')).toThrowErrorMatchingInlineSnapshot(`
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
  expect(() => types.AccountId$schema.parse('a@b@c')).toThrowErrorMatchingInlineSnapshot(`
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

  const txPayload = types.TransactionPayload({
    chain: 'whatever',
    authority: SAMPLE_ACCOUNT_ID,
    instructions: { t: 'Instructions' },
  })

  expect(txPayload.creationTime.asDate().getTime()).toEqual(DATE.getTime())
})

describe('Status', () => {
  test('Documented example at https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status', () => {
    const STATUS: types.Status = {
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

    expect(types.Status$codec.encode(STATUS)).toEqual(fromHexWithSpaces(ENCODED))
    expect(types.Status$codec.decode(fromHexWithSpaces(ENCODED))).toEqual(STATUS)
  })

  test('From zeros', () => {
    expect(types.Status$codec.decode(fromHexWithSpaces('00 00 00 00 00 00 00 00 00 00 00'))).toMatchInlineSnapshot(`
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
    payload: Uint8Array.from(hexDecode('B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')),
  },
] satisfies z.input<typeof types.PublicKey$schema>[])('Parse public key from %o', (input) => {
  const value = types.PublicKey$schema.parse(input)
  expect(value.algorithm).toEqual('ed25519')
  expect(toHex(value.payload)).toEqual('B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'.toLowerCase())
})
