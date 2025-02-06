import { SCHEMA, type Schema } from './lib.ts'
import { expectTypeOf, test } from 'vitest'

test('Ensure that JSON schema matches with types', () => {
  expectTypeOf(SCHEMA).toMatchTypeOf<Schema>()
})
