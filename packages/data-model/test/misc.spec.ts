import { describe, expect, test, vi } from 'vitest'
import { CodecImpl, toCodec, wrapCodec, type Codec, datamodel } from '../src/lib'
import { decodeUnit, encodeUnit } from '@scale-codec/core'
import { toHex, fromHex } from './util'

describe('toCodec', () => {
  const CODEC: Codec<null> = new CodecImpl(encodeUnit, decodeUnit)

  test('with plain codec', () => {
    expect(toCodec(CODEC)).toBe(CODEC)
  })

  test('with codec wrap', () => {
    expect(toCodec(wrapCodec(CODEC))).toBe(CODEC)
  })

  test('with plain codec getter', () => {
    const decodeSpy = vi.fn(decodeUnit)
    const codec = new CodecImpl(encodeUnit, decodeSpy)

    const proxy = toCodec(() => codec)

    expect(proxy.decode(new Uint8Array())).toBeNull()
    expect(decodeSpy).toBeCalled()
  })

  test('with codec wrap getter', () => {
    const decodeSpy = vi.fn(decodeUnit)
    const codec = new CodecImpl(encodeUnit, decodeSpy)
    const wrap = wrapCodec(codec)

    const proxy = toCodec(() => wrap)

    expect(proxy.decode(new Uint8Array())).toBeNull()
    expect(decodeSpy).toBeCalled()
  })
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

    expect(toHex(toCodec(datamodel.Status).encode(STATUS)).toUpperCase()).toEqual(ENCODED)
    expect(toCodec(datamodel.Status).decode(fromHex(ENCODED))).toEqual(STATUS)
  })

  test('From zeros', () => {
    expect(toCodec(datamodel.Status).decode(fromHex('00 00 00 00 00 00 00 00 00 00 00'))).toMatchInlineSnapshot(`
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

describe('NonZero', () => {
  for (const INVALID_VALUE of [-5, 0]) {
    test(`When NonZero<U32> is encoded with ${INVALID_VALUE}, it throws`, () => {
      expect(() =>
        datamodel.NonZero.with(toCodec(datamodel.U32)).encode(INVALID_VALUE as datamodel.NonZero<number>),
      ).toThrowError()
    })
  }
})

test('Decode SignedBlock without errors', () => {
  const SAMPLE = fromHex(`
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

  expect(() => toCodec(datamodel.SignedBlock).decode(SAMPLE)).not.toThrow()
})
