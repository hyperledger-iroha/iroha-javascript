import { expect, test } from 'vitest'
import { SCHEMA } from '@iroha2/data-model-schema'
import { generate, parseIdent } from './codegen'
import { QUERY_IMPLS } from '@iroha2/iroha-source'

// convenient for development in watch mode
// works almost as if JavaScript supported comptime codegen
test('codegen snapshot', async () => {
  const code = generate(SCHEMA, QUERY_IMPLS)
  expect(code).toMatchFileSnapshot('../src/datamodel/generated.ts')
})

test('parse ident Vec<crate::role::Role>', () => {
  expect(parseIdent('Vec<crate::role::Role>')).toMatchInlineSnapshot(`
      {
        "id": "Vec",
        "items": [
          {
            "id": "Role",
            "items": [],
            "path": [
              "crate",
              "role",
            ],
          },
        ],
        "path": undefined,
      }
    `)
})
