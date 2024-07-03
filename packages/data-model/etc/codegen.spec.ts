import { expect, test } from 'vitest'
import { SCHEMA } from '@iroha2/data-model-schema'
import { generate } from './codegen'
import { format } from 'prettier'
import prettierrc from '../../../.prettierrc'

// convenient for development in watch mode
test('codegen snapshot', async () => {
  const code = generate(SCHEMA)
  const formatted = await format(code, { parser: 'typescript', ...prettierrc })
  expect(formatted).toMatchFileSnapshot('../src/generated/index.ts')
})
