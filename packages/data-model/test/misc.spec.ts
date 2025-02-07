import { KeyPair, PublicKey } from '@iroha2/crypto'
import * as dm from '../src/data-model.ts'
import { getCodec} from '../src/traits.ts'
import { describe, expect, test } from 'vitest'
import { fromHexWithSpaces, SAMPLE_ACCOUNT_ID, toHex } from './util.ts'

describe('JSON/string serialisation', () => {
  test('AccountId', () => {
    const SIGNATORY = `ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E`
    const DOMAIN = 'badland'
    const ID = `${SIGNATORY}@${DOMAIN}`

    expect(dm.AccountId.parse(ID).toJSON()).toEqual(ID)
    expect(new dm.AccountId(dm.PublicKeyRepr.fromHex(SIGNATORY), new dm.Name(DOMAIN)).toJSON()).toEqual(ID)
  })

  test('AccountId (after being decoded)', () => {
    const pk = KeyPair.random().publicKey()
    const decoded = 
      getCodec(dm.AccountId)
      .decode(getCodec(dm.AccountId).encode(new dm.AccountId(dm.PublicKeyRepr.fromCrypto(pk), new dm.Name('test'))))

    expect(decoded.toJSON()).toEqual(`${pk.toMultihash()}@test`)
  })

  test('AssetId - different domains', () => {
    const id = dm.AssetId.parse(`test#wonderland#${SAMPLE_ACCOUNT_ID.toString()}`)

    expect(id).toMatchInlineSnapshot(
      `"test#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland"`,
    )
  })

  test('AssetId - same domains', () => {
    const id = dm.AssetId.parse(`test#badland#${SAMPLE_ACCOUNT_ID.toString()}`)

    expect(id).toMatchInlineSnapshot(
      `"test##ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland"`,
    )
  })

  test('NonZero serializes as its value', () => {
    expect({ nonZero: new dm.NonZero(51) }).toMatchInlineSnapshot(`
      {
        "nonZero": 51,
      }
    `)
  })

  test('Duration serializes as { ms: <value> }', () => {
    expect({ duration: dm.Duration.fromMillis(51123) }).toMatchInlineSnapshot(`
      {
        "duration": {
          "ms": 51123n,
        },
      }
    `)
  })

  test('Timestamp serialises as ISO string', () => {
    expect({ timestamp: dm.Timestamp.fromDate(new Date(1022, 10, 10)) }).toMatchInlineSnapshot(`
      {
        "timestamp": "1022-11-09T14:41:01.000Z",
      }
    `)
  })
})

describe('Validation', () => {
  test('Empty JSON string', () => {
    expect(() => dm.Json.fromJsonString('')).toThrowErrorMatchingInlineSnapshot(`[Error: JSON string cannot be empty]`)
  })

  test.each(['  alice  ', 'ali ce', 'ali@ce', '', 'ali#ce'])('Name validation fails for %o', (sample) => {
    expect(() => new dm.Name(sample)).toThrowError()
  })
})

test('Parse AssetId with different domains', () => {
  const parsed = dm.AssetId.parse(
    'rose#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
  )

  expect(parsed.definition.name.value).toEqual('rose')
  expect(parsed.definition.domain.value).toEqual('wonderland')
  expect(parsed.account.signatory.algorithm.kind).toEqual('ed25519')
  expect(toHex(parsed.account.signatory.payload)).toEqual(
    'b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e',
  )
  expect(parsed.account.domain.value).toEqual('badland')
})

test('Fails to parse invalid account id with bad signatory', () => {
  expect(() => console.log(dm.AccountId.parse('test@test'))).toThrowErrorMatchingInlineSnapshot(
    `[SyntaxError: Cannot parse PublicKey from "test": Error: Invalid character 't' at position 0]`,
  )
})

test('Fails to parse account id with multiple @', () => {
  expect(() => dm.AccountId.parse('a@b@c')).toThrowErrorMatchingInlineSnapshot(
    `[SyntaxError: AccountId should have format '⟨signatory⟩@⟨domain⟩, got: 'a@b@c']`,
  )
})

describe('Status', () => {
  test('Documented example at https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status', () => {
    const STATUS: dm.Status = {
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

    expect(getCodec(dm.Status).encode(STATUS)).toEqual(fromHexWithSpaces(ENCODED))
    expect(getCodec(dm.Status).decode(fromHexWithSpaces(ENCODED))).toEqual(STATUS)
  })

  test('From zeros', () => {
    expect(getCodec(dm.Status).decode(fromHexWithSpaces('00 00 00 00 00 00 00 00 00 00 00'))).toMatchInlineSnapshot(`
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

describe('construct pub key wrap', () => {
  function assertMatches(key: dm.PublicKeyRepr) {
    expect(key.algorithm.kind).toEqual('ed25519')
    expect(toHex(key.payload)).toEqual('b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e')
  }

  test('from hex', () => {
    const key = dm.PublicKeyRepr.fromHex('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')

    assertMatches(key)
  })

  test('from crypto', () => {
    const key = dm.PublicKeyRepr.fromCrypto(
      PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'),
    )

    assertMatches(key)
  })

  test('by decoding', () => {
    const key = dm.PublicKeyRepr.fromHex('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')
    const bytes = getCodec(dm.PublicKeyRepr).encode(key)
    const key2 = getCodec(dm.PublicKeyRepr).decode(bytes)

    assertMatches(key2)
  })
})

// describe('SortedMap', () => {
//   // test.todo('')
// })
