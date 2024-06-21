import { describe, expect, test, vi } from 'vitest'
import type { Codec } from '../core'
import { CodecImpl, toCodec, wrapCodec } from '../core'
import { decodeUnit, encodeUnit } from '@scale-codec/core'
import { datamodel } from '../lib'
import { fromHex, toHex } from '@scale-codec/util'

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

test('Status according to the example from https://hyperledger.github.io/iroha-2-docs/reference/torii-endpoints.html#status', () => {
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

test('Status from zeros', () => {
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
