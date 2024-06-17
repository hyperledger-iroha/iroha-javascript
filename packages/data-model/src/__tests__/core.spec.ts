import { describe, expect, test, vi } from 'vitest'
import { Codec, CodecImpl, toCodec, wrapCodec } from '../core'
import { decodeUnit, encodeUnit } from '@scale-codec/core'

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
