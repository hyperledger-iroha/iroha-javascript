import { describe, expect, test } from 'vitest'
import { datamodel } from '../lib'
import { toCodec } from '../core'

describe('Non zero integers in the data model', () => {
  for (const INVALID_VALUE of [-5, 0]) {
    test(`When NonZero<U32> is encoded with ${INVALID_VALUE}, it throws`, () => {
      expect(() =>
        datamodel.NonZero.with(toCodec(datamodel.U32)).encode(INVALID_VALUE as datamodel.NonZero<number>),
      ).toThrowError()
    })
  }
})
