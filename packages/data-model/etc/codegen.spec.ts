import { expect, test } from 'vitest'
import { SCHEMA } from '@iroha2/data-model-schema'
import { generate } from './codegen'

// convenient for development in watch mode
test('codegen snapshot', () => {
  expect(generate(SCHEMA)).toMatchFileSnapshot('../../src/__generated__.ts')
})
