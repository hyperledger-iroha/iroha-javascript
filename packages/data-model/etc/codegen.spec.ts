import { describe, expect, test } from 'vitest'
import { SCHEMA } from '@iroha2/data-model-schema'
import { enumShortcuts, type EmitCode, generate, renderShortcutsTree } from './codegen'
import { QUERY_IMPLS } from '@iroha2/iroha-source'
import { format } from 'prettier'
import PRETTIER_OPTIONS from '../../../.prettierrc.js'

/* TODO

- I   manually re-arrange structs (for shortcuts, + maybe to avoid extra lazy stuff)
- II  fix core types
- II  more object.freeze
- II  think about never-enums. Just generate as never? (with a note that these are stubs) Or eliminate entirely from the schema/shortcuts tree?
- III fix Action -> Executable -> Action recursion
- III fix type -> interface 
- III codecFromPair()?
- III Codec - differentiate input/output types?

*/

// convenient for development in watch mode
// works almost as if JavaScript supported comptime codegen
test('codegen snapshot', async () => {
  const code = generate(SCHEMA, QUERY_IMPLS, './generated-lib')
  const formatted = await format(code, { parser: 'typescript', ...PRETTIER_OPTIONS })
  expect(formatted).toMatchFileSnapshot('../src/items/generated.ts')
})

describe('enum shortcuts', () => {
  const SAMPLE = {
    A: {
      t: 'enum',
      variants: [
        { tag: 'Unit', discriminant: 0, type: { t: 'null' } },
        { tag: 'WithType', type: { t: 'local', id: 'Whichever' }, discriminant: 1 },
        { tag: 'Nested', type: { t: 'local', id: 'B' }, discriminant: 2 },
      ],
    },
    B: {
      t: 'enum',
      variants: [
        { tag: 'Bunit', discriminant: 0, type: { t: 'null' } },
        { discriminant: 1, tag: 'Bnested', type: { t: 'local', id: 'C' } },
      ],
    },
    C: {
      t: 'enum',
      variants: [
        { tag: 'CUnit', discriminant: 0, type: { t: 'null' } },
        { discriminant: 1, tag: 'Cfinal', type: { t: 'local', id: 'Whichever' } },
      ],
    },
    Whichever: { t: 'alias', to: { t: 'lib', id: 'AccountId' } },
  } satisfies Record<string, EmitCode>

  const SAMPLE_MAP = new Map(Object.entries(SAMPLE))

  test('build shortcuts tree', () => {
    const tree = enumShortcuts(SAMPLE.A.variants, SAMPLE_MAP)

    expect(tree).toMatchInlineSnapshot(`
      [
        {
          "name": "Unit",
          "t": "unit",
        },
        {
          "name": "WithType",
          "t": "value",
          "value_ty": {
            "id": "Whichever",
            "t": "local",
          },
        },
        {
          "name": "Nested",
          "t": "enum",
          "tree": {
            "id": "B",
            "variants": [
              {
                "name": "Bunit",
                "t": "unit",
              },
              {
                "name": "Bnested",
                "t": "enum",
                "tree": {
                  "id": "C",
                  "variants": [
                    {
                      "name": "CUnit",
                      "t": "unit",
                    },
                    {
                      "name": "Cfinal",
                      "t": "value",
                      "value_ty": {
                        "id": "Whichever",
                        "t": "local",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ]
    `)
  })

  test('generate shortcut tree', () => {
    const generated = renderShortcutsTree({ id: 'A', variants: enumShortcuts(SAMPLE.A.variants, SAMPLE_MAP) })

    expect(generated).toMatchInlineSnapshot(
      `"Unit: Object.freeze<A>({ kind: 'Unit' }), WithType: (value: Whichever): A => ({ kind: 'WithType', value }), Nested: { Bunit: Object.freeze<A>({ kind: 'Nested', value: B.Bunit }), Bnested: { CUnit: Object.freeze<A>({ kind: 'Nested', value: B.Bnested.CUnit }), Cfinal: (value: Whichever): A => ({ kind: 'Nested', value: B.Bnested.Cfinal(value) }) } }"`,
    )
  })
})
