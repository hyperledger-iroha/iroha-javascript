import { describe, expect, test } from 'vitest'
import { enumCodec } from './codec.ts'

describe('EnumCodec', () => {
  test('.discriminated(): when decodes a unit variant, does produce only `kind`, not `value`', () => {
    const codec = enumCodec<{ Test: [] }>({ Test: [0] }).discriminated()

    const decoded = codec.decode(codec.encode({ kind: 'Test' }))

    expect(decoded).toEqual({ kind: 'Test' })
    expect('value' in decoded).toBe(false)
  })
})
