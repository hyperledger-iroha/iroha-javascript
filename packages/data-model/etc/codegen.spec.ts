import { describe, expect, test } from 'vitest'
import type { Schema } from '@iroha2/data-model-schema'
import { SCHEMA } from '@iroha2/data-model-schema'
import {
  type EmitCode,
  EmitsMap,
  enumShortcuts,
  generateClientFindAPI,
  generateDataModel,
  renderShortcutsTree,
  Resolver,
} from './codegen'

import * as dprint from 'dprint-node'

async function formatTS(code: string): Promise<string> {
    // return code
  return dprint.format('whichever.ts', code, { semiColons: 'asi', quoteStyle: 'preferSingle'})
}

// import { format } from 'prettier'
// import PRETTIER_OPTIONS from '../../../.prettierrc.js'

/**
 * There are not included into the schema for some reason, but are useful to generate code for.
 */
const EXTENSION: Schema = {
  Status: {
    Struct: [
      { name: 'peers', type: 'Compact<u128>' },
      { name: 'blocks', type: 'Compact<u128>' },
      { name: 'txs_accepted', type: 'Compact<u128>' },
      { name: 'txs_rejected', type: 'Compact<u128>' },
      { name: 'uptime', type: 'Uptime' },
      { name: 'view_changes', type: 'Compact<u128>' },
      { name: 'queue_size', type: 'Compact<u128>' },
    ],
  },
  Uptime: {
    Struct: [
      { name: 'secs', type: 'Compact<u128>' },
      { name: 'nanos', type: 'u32' },
    ],
  },
}

/* TODO

- II  fix core types
- II  more object.freeze
- III codecFromPair()?
- III Codec - differentiate input/output types?

*/

// function prettierFormat(code: string): Promise<string> {
//   return format(code, { parser: 'typescript', ...PRETTIER_OPTIONS })
// }

// convenient for development in watch mode
// works almost as if JavaScript supported comptime codegen
test('codegen snapshots', async () => {
  expect(SCHEMA).not.contain.keys(Object.keys(EXTENSION))

  const resolver = new Resolver({ ...SCHEMA, ...EXTENSION })

  await expect(await formatTS(generateDataModel(resolver, './generated-lib'))).toMatchFileSnapshot(
    '../src/items/generated.ts',
  )

  await expect(await formatTS(generateClientFindAPI(resolver, '../find-api-internal'))).toMatchFileSnapshot(
    '../../client/src/generated/find-api.ts',
  )
})

// test("codegen")

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

  test('build: takes aliases into consideration', () => {
    const map: EmitsMap = new Map<string, EmitCode>([
      ['Foo', { t: 'alias', to: { t: 'local', id: 'Bar' } }],
      ['Bar', { t: 'enum', variants: [{ discriminant: 0, tag: 'Baz', type: { t: 'null' } }] }],
    ])

    const tree = enumShortcuts([{ discriminant: 0, tag: 'Bar', type: { t: 'local', id: 'Foo' } }], map)

    expect(tree).toMatchInlineSnapshot(`
      [
        {
          "name": "Bar",
          "t": "enum",
          "tree": {
            "id": "Foo",
            "variants": [
              {
                "name": "Baz",
                "t": "unit",
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
      `"Unit: Object.freeze<lib.VariantUnit<'Unit'>>({ kind: 'Unit' }), WithType: <const T extends Whichever>(value: T): lib.Variant<'WithType', T> => ({ kind: 'WithType', value }), Nested: { Bunit: Object.freeze<lib.Variant<'Nested', lib.VariantUnit<'Bunit'>>>({ kind: 'Nested', value: B.Bunit }), Bnested: { CUnit: Object.freeze<lib.Variant<'Nested', lib.Variant<'Bnested', lib.VariantUnit<'CUnit'>>>>({ kind: 'Nested', value: B.Bnested.CUnit }), Cfinal: <const T extends Whichever>(value: T): lib.Variant<'Nested', lib.Variant<'Bnested', lib.Variant<'Cfinal', T>>> => ({ kind: 'Nested', value: B.Bnested.Cfinal(value) }) } }"`,
    )
  })
})
