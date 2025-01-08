import { KeyPair, PublicKey } from '@iroha2/crypto-core'
import * as dm from '@iroha2/data-model'
import { describe, expect, onTestFinished, test, vi } from 'vitest'
import type { z } from 'zod'
import { hexDecode } from '../src/util'
import { SAMPLE_ACCOUNT_ID, fromHexWithSpaces, toHex } from './util'

describe('JSON serialisation', () => {
  test('AccountId', () => {
    const SIGNATORY = `ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E`
    const DOMAIN = 'badland'
    const ID = `${SIGNATORY}@${DOMAIN}`

    expect(dm.AccountId.parse(ID).toJSON()).toEqual(ID)
    expect(new dm.AccountId(dm.PublicKeyWrap.fromHex(SIGNATORY), dm.DomainId.parse(DOMAIN)).toJSON()).toEqual(ID)
  })

  test('AccountId (after being decoded)', () => {
    const pk = KeyPair.random().publicKey()
    const decoded = dm
      .codecOf(dm.AccountId)
      .decode(
        dm.codecOf(dm.AccountId).encode(new dm.AccountId(dm.PublicKeyWrap.fromCrypto(pk), dm.DomainId.parse('test'))),
      )

    expect(decoded.toJSON()).toEqual(`${pk.toMultihash()}@test`)
  })
})

describe('Validation', () => {
  test('Empty JSON string', () => {
    expect(() => dm.Json.fromJsonString('')).toThrowErrorMatchingInlineSnapshot(`[Error: JSON string cannot be empty]`)
  })

  test.each(['  alice  ', 'ali ce', 'ali@ce', '', 'ali#ce'])('Name validation fails for %o', (sample) => {
    expect(() => dm.Name.parse(sample)).toThrowError()
  })
})

test('Parse AssetId with different domains', () => {
  const parsed = dm.AssetId.parse(
    'rose#wonderland#ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland',
  )

  expect(parsed.definition.name).toEqual('rose')
  expect(parsed.definition.domain).toEqual('wonderland')
  expect(parsed.account.signatory.algorithm.kind).toEqual('ed25519')
  expect(toHex(parsed.account.signatory.payload)).toEqual(
    'b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e',
  )
  expect(parsed.account.domain).toEqual('badland')
})

test('Fails to parse invalid account id with bad signatory', () => {
  expect(() => console.log(dm.AccountId.parse('test@test'))).toThrowErrorMatchingInlineSnapshot(
    `[SyntaxError: Bad PublicKey syntax in "test": Invalid character 't' at position 0]`,
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

    expect(dm.codecOf(dm.Status).encode(STATUS)).toEqual(fromHexWithSpaces(ENCODED))
    expect(dm.codecOf(dm.Status).decode(fromHexWithSpaces(ENCODED))).toEqual(STATUS)
  })

  test('From zeros', () => {
    expect(dm.codecOf(dm.Status).decode(fromHexWithSpaces('00 00 00 00 00 00 00 00 00 00 00'))).toMatchInlineSnapshot(`
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
  function assertMatches(key: dm.PublicKeyWrap) {
    expect(key.algorithm.kind).toEqual('ed25519')
    expect(toHex(key.payload)).toEqual('b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e')
  }

  test('from hex', () => {
    const key = dm.PublicKeyWrap.fromHex('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')

    assertMatches(key)
  })

  test('from crypto', () => {
    const key = dm.PublicKeyWrap.fromCrypto(
      PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'),
    )

    assertMatches(key)
  })

  test('by decoding', () => {
    const key = dm.PublicKeyWrap.fromHex('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')
    const bytes = dm.codecOf(dm.PublicKeyWrap).encode(key)
    const key2 = dm.codecOf(dm.PublicKeyWrap).decode(bytes)

    assertMatches(key2)
  })
})
