import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'

import { KeyPair } from '@iroha/core/crypto'
import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import { fromHexWithSpaces, SAMPLE_ACCOUNT_ID } from './util.ts'

describe('JSON/string serialisation', () => {
  test('AccountId', () => {
    const SIGNATORY = `ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E`
    const DOMAIN = 'badland'
    const ID = `${SIGNATORY}@${DOMAIN}`

    expect(dm.AccountId.parse(ID).toJSON()).toEqual(ID)
    expect(new dm.AccountId(dm.PublicKey.fromMultihash(SIGNATORY), new dm.Name(DOMAIN)).toJSON()).toEqual(ID)
  })

  test('AccountId (after being decoded)', () => {
    const pk = KeyPair.random().publicKey()
    const decoded = getCodec(dm.AccountId)
      .decode(getCodec(dm.AccountId).encode(new dm.AccountId(pk, new dm.Name('test'))))

    expect(decoded.toJSON()).toEqual(`${pk.multihash()}@test`)
  })

  test('AssetId - different domains', () => {
    const str = `test#wonderland#${SAMPLE_ACCOUNT_ID.toString()}`
    const id = dm.AssetId.parse(str)

    expect(id.toString()).toEqual(str)
  })

  test('AssetId - same domains', () => {
    const str = `test#badland#${SAMPLE_ACCOUNT_ID.toString()}`
    const strExpected = `test##${SAMPLE_ACCOUNT_ID.toString()}`
    const id = dm.AssetId.parse(str)

    expect(id.toString()).toEqual(strExpected)
  })

  test('NonZero serializes as its value', () => {
    expect(new dm.NonZero(51).toJSON()).toEqual(51)
  })

  test('Duration serializes as { ms: <value> }', () => {
    expect(dm.Duration.fromMillis(51123).toJSON()).toEqual({ ms: 51123n })
  })

  test('Timestamp serialises as ISO string', () => {
    expect(dm.Timestamp.fromDate(new Date(-41234040100)).toJSON()).toBe('1968-09-10T18:05:59.900Z')
  })
})

describe('Validation', () => {
  test('Empty JSON string', () => {
    expect(() => dm.Json.fromJsonString('')).toThrow(`JSON string cannot be empty`)
  })

  // test.each(['  alice  ', 'ali ce', 'ali@ce', '', 'ali#ce'])('Name validation fails for %o', (sample) => {
  //   expect(() => new dm.Name(sample)).toThrowError()
  // })
})

test('Parse AssetId with different domains', () => {
  const parsed = dm.AssetId.parse(
    'rose#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
  )

  expect(parsed.definition.name.value).toEqual('rose')
  expect(parsed.definition.domain.value).toEqual('wonderland')
  expect(parsed.account.signatory.algorithm).toEqual('ed25519')
  expect(parsed.account.signatory.payload.hex()).toEqual(
    'b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e',
  )
  expect(parsed.account.domain.value).toEqual('badland')
})

test('Fails to parse invalid account id with bad signatory', () => {
  expect(() => console.log(dm.AccountId.parse('test@test'))).toThrow(
    `Invalid character 't' at position 0`,
  )
})

test('Fails to parse account id with multiple @', () => {
  expect(() => dm.AccountId.parse('a@b@c')).toThrow(
    new SyntaxError(
      `AccountId should have format '⟨signatory⟩@⟨domain⟩, got: 'a@b@c'`,
    ),
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
    expect(getCodec(dm.Status).decode(fromHexWithSpaces('00 00 00 00 00 00 00 00 00 00 00'))).toEqual(
      {
        'blocks': 0n,
        'peers': 0n,
        'queueSize': 0n,
        'txsAccepted': 0n,
        'txsRejected': 0n,
        'uptime': {
          'nanos': 0,
          'secs': 0n,
        },
        'viewChanges': 0n,
      },
    )
  })
})

describe('construct pub key', () => {
  function assertMatches(key: dm.PublicKey) {
    expect(key.algorithm).toEqual('ed25519')
    expect(key.payload.hex()).toEqual('b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e')
  }

  test('from multihash', () => {
    const key = dm.PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')

    assertMatches(key)
  })

  test('by decoding', () => {
    const key = dm.PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')
    const bytes = getCodec(dm.PublicKey).encode(key)
    const key2 = getCodec(dm.PublicKey).decode(bytes)

    assertMatches(key2)
  })
})
