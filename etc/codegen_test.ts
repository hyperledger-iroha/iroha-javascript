import { assertSnapshot } from '@std/testing/snapshot'
import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'
import {
  type EmitCode,
  type EmitsMap,
  enumShortcuts,
  type EnumShortcutTreeVariant,
  generateClientFindAPI,
  generatePrototypes,
  renderShortcutsTree,
  Resolver,
} from './codegen.ts'
import SCHEMA from '@iroha/core/data-model/schema-json'

const resolver = new Resolver({ ...SCHEMA })

describe('generate prototypes', () => {
  test('prototypes snapshot', async (t) => {
    const output = generatePrototypes(resolver, 'prelude')
    await assertSnapshot(t, output)
  })

  test('find api snapshot', async (t) => {
    await assertSnapshot(t, generateClientFindAPI(resolver, 'prelude'))
  })
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

  test('build shortcuts tree', (t) => {
    const tree = enumShortcuts(SAMPLE.A.variants, SAMPLE_MAP)
    assertSnapshot(t, tree)
  })

  test('build: takes aliases into consideration', () => {
    const map: EmitsMap = new Map<string, EmitCode>([
      ['Foo', { t: 'alias', to: { t: 'local', id: 'Bar' } }],
      ['Bar', { t: 'enum', variants: [{ discriminant: 0, tag: 'Baz', type: { t: 'null' } }] }],
    ])

    const tree = enumShortcuts([{ discriminant: 0, tag: 'Bar', type: { t: 'local', id: 'Foo' } }], map)

    expect(tree).toEqual(
      [
        {
          'name': 'Bar',
          't': 'enum',
          'tree': {
            'id': 'Foo',
            'variants': [
              {
                'name': 'Baz',
                't': 'unit',
              },
            ],
          },
        },
      ],
    )
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

  test('generate shortcut tree', async (t) => {
    const TREE = { id: 'A', variants: enumShortcuts(SAMPLE.A.variants, SAMPLE_MAP) }
    const type = renderShortcutsTree(TREE, 'type')
    const value = renderShortcutsTree(TREE, 'value')

    const full = `
    type test = ${type}
    const test = ${value}
    `

    await assertSnapshot(t, full)
  })
})
