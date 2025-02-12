import { describe, expect, test } from 'vitest'
import {
  type EmitCode,
  type EmitsMap,
  enumShortcuts,
  type EnumShortcutTreeVariant,
  renderShortcutsTree,
} from './codegen.ts'
import * as dprint from 'dprint-node'

async function formatTS(code: string): Promise<string> {
  return dprint.format('whichever.ts', code, { semiColons: 'asi', quoteStyle: 'preferSingle' })
}

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

  test('build: omits enums without variants', () => {
    const map: EmitsMap = new Map<string, EmitCode>([
      ['Foo', { t: 'enum', variants: [] }],
      [
        'Bar',
        {
          t: 'enum',
          variants: [
            { discriminant: 0, tag: 'Baz', type: { t: 'null' } },
            { discriminant: 1, tag: 'Foo', type: { t: 'local', id: 'Foo' } },
          ],
        },
      ],
      // nested void
      ['Void0', { t: 'enum', variants: [{ discriminant: 0, tag: 'Void1', type: { t: 'local', id: 'Void1' } }] }],
      ['Void1', { t: 'enum', variants: [{ discriminant: 0, tag: 'Foo', type: { t: 'local', id: 'Foo' } }] }],
    ])

    const tree = enumShortcuts(
      [
        { discriminant: 0, tag: 'foo', type: { t: 'local', id: 'Foo' } },
        { discriminant: 1, tag: 'bar', type: { t: 'local', id: 'Bar' } },
        { discriminant: 2, tag: 'void', type: { t: 'local', id: 'Void0' } },
      ],
      map,
    )

    expect(tree).toEqual(
      [
        {
          name: 'bar',
          t: 'enum',
          tree: {
            id: 'Bar',
            variants: [{ name: 'Baz', t: 'unit' }],
          },
        },
      ] satisfies EnumShortcutTreeVariant[],
    )
  })

  test('generate shortcut tree', async () => {
    const TREE = { id: 'A', variants: enumShortcuts(SAMPLE.A.variants, SAMPLE_MAP) }
    const type = renderShortcutsTree(TREE, 'type')
    const value = renderShortcutsTree(TREE, 'value')

    const full = `
    type test = ${type}
    const test = ${value}
    `

    expect(await formatTS(full)).toMatchInlineSnapshot(
      `
      "type test = {
        Unit: lib.VariantUnit<'Unit'>
        WithType: <const T extends Whichever>(value: T) => lib.Variant<'WithType', T>
        Nested: {
          Bunit: lib.Variant<'Nested', lib.VariantUnit<'Bunit'>>
          Bnested: {
            CUnit: lib.Variant<
              'Nested',
              lib.Variant<'Bnested', lib.VariantUnit<'CUnit'>>
            >
            Cfinal: <const T extends Whichever>(
              value: T,
            ) => lib.Variant<
              'Nested',
              lib.Variant<'Bnested', lib.Variant<'Cfinal', T>>
            >
          }
        }
      }
      const test = {
        Unit: Object.freeze({ kind: 'Unit' }),
        WithType: <const T extends Whichever>(
          value: T,
        ): lib.Variant<'WithType', T> => ({ kind: 'WithType', value }),
        Nested: {
          Bunit: Object.freeze<lib.Variant<'Nested', lib.VariantUnit<'Bunit'>>>({
            kind: 'Nested',
            value: B.Bunit,
          }),
          Bnested: {
            CUnit: Object.freeze<
              lib.Variant<'Nested', lib.Variant<'Bnested', lib.VariantUnit<'CUnit'>>>
            >({ kind: 'Nested', value: B.Bnested.CUnit }),
            Cfinal: <const T extends Whichever>(
              value: T,
            ): lib.Variant<
              'Nested',
              lib.Variant<'Bnested', lib.Variant<'Cfinal', T>>
            > => ({ kind: 'Nested', value: B.Bnested.Cfinal(value) }),
          },
        },
      }
      "
    `,
    )
  })
})
