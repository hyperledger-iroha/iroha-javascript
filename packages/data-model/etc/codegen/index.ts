import { Schema } from '@iroha2/data-model-schema'
import { P, match } from 'ts-pattern'
import invariant from 'tiny-invariant'
import { camelCase } from 'change-case'

export function generate(schema: Schema): string {
  const transformed = transform(schema)
  transformed.sort((a, b) => (a.id < b.id ? -1 : a.id === b.id ? 0 : 1))

  return [`import * as lib from './generated-prelude'`, ...transformed.map((x) => generateSingleEntry(x))].join('\n')
}

/**
 * Apply a number of transformations to the schema:
 *
 * - Remove useless aliases (e.g. `bool` -> `bool`, void types, etc),
 * - Expand some "newtype"-aliases to structs with a named field
 * - Remove integer definitions
 * - De-monomorphisation of generic containers
 * - Simplify `GenericPredicateBox` to just `PredicateBox`
 * - Replace `HashOf<T>` with `Hash`
 * - Replace `SignatureOf<T>` with `Signature`
 * - Make `BlockSubscriptionRequest` a struct, not an alias
 * - Make `Duration` a struct, not a tuple
 * - Handle stringified array definitions
 * - Expand some types to _special_ ones, such as `JsonString` and `NonZero` integers
 * - Fix `Compact<T>` to just `Compact`
 */
function transform(schema: Schema): ActualCodegenSchema {
  const items: ActualCodegenSchema = [
    ...['Register', 'Unregister'].map(
      (id): CodegenEntry => ({
        t: 'struct-gen',
        id,
        genericsCount: 1,
        fields: [{ name: 'object', type: { t: 'gen', genericIndex: 0 } }],
      }),
    ),
    ...['SetKeyValue', 'RemoveKeyValue'].map(
      (id): CodegenEntry => ({
        t: 'struct-gen',
        id,
        genericsCount: 1,
        fields: [
          { name: 'object', type: { t: 'gen', genericIndex: 0 } },
          { name: 'key', type: { t: 'lib', id: 'codecs.String' } },
          { name: 'value', type: { t: 'ref', id: 'MetadataValueBox' } },
        ],
      }),
    ),
    ...['Mint', 'Burn', 'Grant', 'Revoke'].map(
      (id): CodegenEntry => ({
        t: 'struct-gen',
        id,
        genericsCount: 2,
        fields: [
          { name: 'object', type: { t: 'gen', genericIndex: 0 } },
          { name: 'destination', type: { t: 'gen', genericIndex: 1 } },
        ],
      }),
    ),
    {
      t: 'struct-gen',
      id: 'Transfer',
      genericsCount: 3,
      fields: [
        { name: 'source', type: { t: 'gen', genericIndex: 0 } },
        { name: 'object', type: { t: 'gen', genericIndex: 1 } },
        { name: 'destination', type: { t: 'gen', genericIndex: 2 } },
      ],
    },
    {
      t: 'struct-gen',
      id: 'MetadataChanged',
      genericsCount: 1,
      fields: [
        { name: 'target', type: { t: 'gen', genericIndex: 0 } },
        { name: 'key', type: { t: 'lib', id: 'codecs.String' } },
        { name: 'value', type: { t: 'ref', id: 'MetadataValueBox' } },
      ],
    },
    {
      t: 'struct',
      id: 'BlockSignature',
      fields: [
        { name: 'peer_topology_index', type: { t: 'lib', id: 'codecs.U64' } },
        { name: 'payload', type: { t: 'ref', id: 'BlockPayload' } },
      ],
    },
    {
      t: 'struct',
      id: 'BlockSubscriptionRequest',
      fields: [
        {
          name: 'from_block_height',
          type: transformIdent('NonZero<u64>'),
        },
      ],
    },
    {
      t: 'struct',
      id: 'Duration',
      fields: [
        // TODO: check if correct
        {
          name: 'secs',
          type: { t: 'lib', id: 'codecs.U64' },
        },
        {
          name: 'nanos',
          type: { t: 'lib', id: 'codecs.U32' },
        },
      ],
    },
    {
      t: 'struct',
      id: 'EventSubscriptionRequest',
      fields: [{ name: 'filters', type: transformIdent('Vec<EventFilterBox>') }],
    },
    {
      t: 'struct',
      id: 'AssetValueTypeMismatch',
      fields: [
        { name: 'expexted', type: { t: 'ref', id: 'AssetValueType' } },
        { name: 'actual', type: { t: 'ref', id: 'AssetValueType' } },
      ],
    },
    {
      t: 'struct-gen',
      id: 'SemiInterval',
      genericsCount: 1,
      fields: [
        { name: 'start', type: { t: 'gen', genericIndex: 0 } },
        { name: 'limit', type: { t: 'gen', genericIndex: 0 } },
      ],
    },
    {
      t: 'alias',
      id: 'Metadata',
      to: transformIdent('Map<Name, MetadataValueBox>'),
    },
  ]

  const NULL_TYPES = new Set(
    Object.entries(schema)
      .filter(([_, right]) => right === null)
      .map(([id]) => id),
  )

  const IGNORE = new Set([
    ...NULL_TYPES,

    // already redefined types
    ...items.map((x) => x.id),

    'TransactionSignature',
    'MerkleTree',
    'Array',
    'BlockMessage',
    'BlockSubscriptionRequest',
    'Vec',
    'Duration',
    'JsonString',
    'ChainId',
    'Compact',
    'EventMessage',
    'EventSubscriptionRequest',
    'SortedVec',
    'HashOf',
    'SignatureOf',
    'Name',
    'NonZero',
    'Option',
    'QuerySignature',
    'SemiInterval',
    'SortedMap',
    'String',
    'TimeEventFilter',
    'bool',
    'u128',
    'u64',
    'u32',
    'u16',
    'u8',
    'JsonString',

    // replaced with a single `AssetValueTypeMismatch`
    'Mismatch',
  ])

  for (const [key, value] of Object.entries(schema)) {
    const keyParsed = parseIdent(key)

    match([keyParsed, value])
      .with([{ id: P.when((x) => IGNORE.has(x)) }, P._], () => {
        // ignoring
      })
      .with([{ id: 'NonTrivial', items: [P._] }, 'Vec<GenericPredicateBox<QueryOutputPredicate>>'], () => {
        items.push({
          t: 'alias',
          id: 'NonTrivial',
          to: transformIdent('Vec<PredicateBox>'),
        })
      })
      .with([{ id: 'WasmSmartContract', items: [] }, 'Vec<u8>'], ([{ id }]) => {
        items.push({ t: 'struct', id, fields: [{ name: 'blob', type: { t: 'lib', id: 'codecs.BytesVec' } }] })
      })
      .with([{ id: 'IpfsPath', items: [] }, 'String'], ([{ id }]) => {
        items.push({ t: 'struct', id, fields: [{ name: 'path', type: { t: 'lib', id: 'codecs.String' } }] })
      })
      .with([{ id: 'BatchedResponse', items: [{ id: 'QueryOutputBox' }] }, P._], () => {
        // TODO just to BatchedResponseV1
      })
      .with([{ id: 'BatchedResponseV1', items: [{ id: 'QueryOutputBox' }] }, P._], () => {
        // TODO just struct as struct, without content change
      })
      // arrays
      .with(
        [{ items: [] }, P.string.and(P.when((rawStr: string) => !!tryParseArray(rawStr)))],
        ([{ id }, rawArray]) => {
          // match()
          const { item, len } = tryParseArray(rawArray)!
          match(item)

          items.push({
            t: 'array',
            id,
            item: transformIdent(item),
            len,
          })
        },
      )
      .with([{ items: [] }, { Struct: P._ }], ([{ id }, { Struct: fields }]) => {
        items.push({
          t: 'struct',
          id,
          fields: fields.map((x) => ({
            name: x.name,
            type: transformIdent(x.type),
          })),
        })
      })
      .with(
        [P.union({ items: [] }, { id: 'GenericPredicateBox' }), { Enum: P._ }],
        ([{ id: idRaw }, { Enum: variants }]) => {
          const { id, box } = match(idRaw)
            .with('GenericPredicateBox', () => ({ id: 'PredicateBox', box: true }))
            .with(P.union('QueryOutputPredicate', 'QueryOutputBox', 'MetadataValueBox', 'InstructionBox'), (id) => ({
              id,
              box: true,
            }))
            .otherwise((id) => ({ id, box: false }))

          items.push({
            t: 'enum',
            id,
            box,
            variants: variants.map((x) =>
              match(x)
                .returnType<CodegenEnumVariant>()
                .with({ type: P.when((x) => x && NULL_TYPES.has(x)) }, ({ discriminant, tag }) => ({
                  t: 'unit',
                  discriminant,
                  tag,
                }))
                .with({ type: P.string }, ({ type, discriminant, tag }) => ({
                  t: 'with-type',
                  type: transformIdent(type),
                  tag,
                  discriminant,
                }))
                .otherwise(({ discriminant, tag }) => ({
                  t: 'unit',
                  discriminant,
                  tag,
                })),
            ),
          })
        },
      )
      .with(
        [{ items: [] }, { Bitmap: { repr: 'u32' } }],
        ([
          { id },
          {
            Bitmap: { masks },
          },
        ]) => {
          items.push({
            t: 'bitmap',
            id,
            repr: 'u32',
            masks,
          })
        },
      )
      .otherwise(() => {
        throw new Error(`unexpected format of type "${key}"`)
      })
  }

  return items
}

function tryParseArray(id: string): null | { item: Ident; len: number } {
  return match(parseIdent(id))
    .with({ id: 'Array', items: [P.select('item'), { id: P.select('len'), items: [] }] }, ({ item, len: lenStr }) => {
      const len = Number(lenStr)
      invariant(!Number.isNaN(len))
      return { item, len }
    })
    .otherwise(() => null)
}

/**
 * Single transform logic for all type names
 */
function transformIdent(id: string | Ident): TypeIdent {
  return match(typeof id === 'string' ? parseIdent(id) : id)
    .returnType<TypeIdent>()
    .with({ id: 'HashOf', items: [P.any] }, () => ({ t: 'ref', id: 'Hash' }))
    .with(
      P.union(
        { id: 'TransactionSignature', items: [] },
        { id: 'QuerySignature', items: [] },
        { id: 'SignatureOf', items: [P.any] },
      ),
      () => ({
        t: 'ref',
        id: 'Signature',
      }),
    )
    .with({ id: 'NonTrivial', items: [P._] }, () => ({ t: 'ref', id: 'NonTrivial' }))
    .with({ id: 'MerkleTree', items: [{ id: 'SignedTransaction', items: [] }] }, () => transformIdent('Vec<Hash>'))
    .with({ id: 'BlockMessage', items: [] }, () => ({ t: 'ref', id: 'SignedBlock' }))
    .with({ id: P.union('SortedMap', 'Map'), items: [P._, P._] }, ({ items: [key, value] }) => ({
      t: 'lib',
      id: 'codecs.Map',
      generics: [transformIdent(key), transformIdent(value)],
    }))
    .with({ id: 'NonZero', items: [{ id: P.union('u32', 'u64').select() }] }, (kind) => ({
      t: 'lib',
      id: 'codecs.NonZero',
      generics: [{ t: 'lib', id: `codecs.${upcase(kind)}` }],
    }))
    .with({ id: 'Vec', items: [{ id: 'u8', items: [] }] }, () => ({ t: 'lib', id: 'codecs.BytesVec' }))
    .with({ id: P.union('SortedVec', 'Vec'), items: [P.select()] }, (item) => ({
      t: 'lib',
      id: 'codecs.Vec',
      generics: [transformIdent(item)],
    }))
    .with({ id: 'Option', items: [P.select()] }, (some) => ({
      t: 'lib',
      id: 'codecs.Option',
      generics: [transformIdent(some)],
    }))
    .with({ id: 'TimeEventFilter', items: [] }, () => ({ t: 'ref', id: 'ExecutionTime' }))
    .with({ id: 'Mismatch', items: [{ id: 'AssetValueType' }] }, () => ({ t: 'ref', id: 'AssetValueTypeMismatch' }))
    .with(
      { id: 'Transfer', items: [{ items: [] }, { items: [] }, { items: [] }] },
      ({ items: [{ id: source }, { id: object }, { id: destination }] }) => ({
        t: 'ref',
        id: 'Transfer',
        generics: [source + 'Id', object, destination + 'Id'].map((id) => transformIdent(id)),
      }),
    )
    .with(
      {
        id: P.union('Mint', 'Burn', 'Grant', 'Revoke').select('isi'),
        items: [
          { items: [], id: P.select('object') },
          { items: [], id: P.select('destination') },
        ],
      },
      ({ isi, object, destination }) => ({
        t: 'ref',
        id: isi,
        generics: [object, destination + 'Id'].map((id) => transformIdent(id)),
      }),
    )
    .with({ id: 'MetadataChanged', items: [{ id: P.select(), items: [] }] }, (id) => ({
      t: 'ref',
      id: 'MetadataChanged',
      generics: [{ t: 'ref', id }],
    }))
    .with(
      { id: P.union('SetKeyValue', 'RemoveKeyValue').select('isi'), items: [{ items: [], id: P.select('id') }] },
      ({ isi, id }) => ({
        t: 'ref',
        id: isi,
        generics: [{ t: 'ref', id }],
      }),
    )
    .with(
      { id: P.union('Register', 'Unregister').select('isi'), items: [{ id: P.select('id'), items: [] }] },
      ({ isi, id }) => ({
        t: 'ref',
        id: isi,
        generics: [
          {
            t: 'ref',
            id: match(isi)
              .with('Unregister', () => `${id}Id`)
              .otherwise(() => id),
          },
        ],
      }),
    )
    .with({ id: 'SemiInterval', items: [P._] }, ({ items: [item] }) => ({
      t: 'ref',
      id: 'SemiInterval',
      generics: [transformIdent(item)],
    }))
    .with({ id: 'GenericPredicateBox', items: [{ id: 'QueryOutputPredicate', items: [] }] }, () => ({
      t: 'ref',
      id: 'PredicateBox',
    }))
    .with({ id: 'EventMessage', items: [] }, () => ({ t: 'ref', id: 'EventBox' }))
    .with({ id: 'Compact' }, () => ({ t: 'lib', id: 'codecs.Compact' }))
    .with({ id: 'bool' }, () => ({ t: 'lib', id: 'codecs.Bool' }))
    .with({ id: P.union('Name', 'ChainId', 'String'), items: [] }, () => ({ t: 'lib', id: 'codecs.String' }))
    .with({ id: P.union('u8', 'u16', 'u32', 'u64', 'u128') }, ({ id }) => ({
      t: 'lib',
      id: `codecs.${id.toUpperCase() as Uppercase<typeof id>}`,
    }))
    .with({ id: 'JsonString', items: [] }, () => ({ t: 'lib', id: 'codecs.Json' }))
    .with({ id: P.select(), items: [] }, (id) => ({ t: 'ref', id }))
    .otherwise(() => {
      throw new Error(`unexpected type identifier: ${id}`)
    })
}

type ActualCodegenSchema = CodegenEntry[]

type CodegenEntry = { id: string } & (
  | {
      t: 'enum'
      /**
       * Whether this enum should be "boxed" in order to workaround circular
       * reference issues in TypeScript in the generated code
       */
      box: boolean
      variants: CodegenEnumVariant[]
    }
  | { t: 'struct'; fields: { name: string; type: TypeIdent }[] }
  | { t: 'struct-gen'; genericsCount: number; fields: { name: string; type: GenericTypeIdent }[] }
  | { t: 'array'; item: TypeIdent; len: number }
  | { t: 'bitmap'; repr: 'u32'; masks: { name: string; mask: number }[] }
  | { t: 'alias'; to: TypeIdent }
)

type CodegenEnumVariant =
  | { t: 'unit'; tag: string; discriminant: number }
  | { t: 'with-type'; tag: string; discriminant: number; type: TypeIdent }

/**
 * Identifier of a type, either a local one or from the "library"
 */
type TypeIdent = { t: 'ref'; id: string; generics?: TypeIdent[] } | { t: 'lib'; id: LibCodec; generics?: TypeIdent[] }

type GenericTypeIdent = TypeIdent | { t: 'gen'; genericIndex: number }

function generateType(ident: TypeIdent): {
  /** type-layer, `T` */
  type: string
  /** value that has type `Codec<T>` */
  codec: string
} {
  return match(ident)
    .returnType<{ type: string; codec: string }>()
    .with({ t: 'ref', generics: P.not(P.nullish) }, ({ id, generics }) => {
      return {
        type: id + `<${generics.map((x) => generateType(x).type).join(', ')}>`,
        codec: libItem('toCodec') + `(() => ${id}.with(${generics.map((x) => generateType(x).codec).join(', ')}))`,
      }
    })
    .with({ t: 'ref' }, ({ id }) => ({
      type: id,
      codec: `${libItem('toCodec')}(() => ${id})`,
    }))
    .with({ t: 'lib', generics: P.not(P.nullish) }, ({ id, generics }) => {
      return {
        type: libItem(id) + `<${generics.map((x) => generateType(x).type).join(', ')}>`,
        codec: libItem(id) + `.with(${generics.map((x) => generateType(x).codec).join(', ')})`,
      }
    })
    .with({ t: 'lib' }, ({ id }) => ({
      type: libItem(id),
      codec: libItem('toCodec') + `(${libItem(id)})`,
    }))
    .exhaustive()
}

function generateSingleEntry(item: CodegenEntry): string {
  return match(item)
    .returnType<string[]>()
    .with({ t: 'enum' }, ({ variants, box: isEnumBox }) => {
      const actualEnumType = isEnumBox ? `${item.id}['enum']` : item.id

      const parsed = variants.map((variant) =>
        match(variant)
          .with({ t: 'with-type' }, ({ tag, type, discriminant }) => {
            const typeGen = generateType(type)
            const inTypeDef = `${tag}: [${typeGen.type}]`
            const doc = `Produce \`${tag}\` enum variant`
            const createVariant = `${libItem('variant')}('${tag}', value)`
            const asConstructor =
              `/** ${doc} */ ` +
              `${tag}: (value: ${typeGen.type}): ${item.id} => ` +
              (isEnumBox ? `({ enum: ${createVariant} })` : createVariant)
            const codec = `[${discriminant}, '${tag}', ${typeGen.codec}]`
            return { inTypeDef, asConstructor, codec }
          })
          .otherwise(({ tag, discriminant }) => {
            const inTypeDef = `${tag}: []`
            const doc = `\`${tag}\` enum variant`
            const createVariant = `${libItem('variant')}<${actualEnumType}>('${tag}')`
            const asConstructor = `/** ${doc} */ ${tag}: ` + (isEnumBox ? `{ enum: ${createVariant} }` : createVariant)
            const codec = `[${discriminant}, '${tag}']`
            return { inTypeDef, asConstructor, codec }
          }),
      )

      const constructors = parsed.map((x) => x.asConstructor).join(', ')

      const codec = `${libItem('enumCodec')}<${actualEnumType}>([${parsed.map((x) => x.codec).join(', ')}])`
      const codecMaybeBoxed = isEnumBox ? libItem('boxEnumCodec') + `(${codec})` : codec

      const typeEnumerate = libItem('Enumerate') + `<{ ${parsed.map((x) => x.inTypeDef).join(', ')} }>`
      const type = isEnumBox ? `{ enum: ${typeEnumerate} }` : typeEnumerate
      const maybeValueType = isEnumBox ? `: ${libItem('EnumBoxValue')}<${item.id}>` : ''

      return [
        `export type ${item.id} = ${type}`,
        `export const ${item.id}${maybeValueType} = { ${constructors}, [${libItem('symbolCodec')}]: ${codecMaybeBoxed} }`,
      ]
    })
    .with({ t: 'struct' }, ({ fields }) => {
      const typeFields = fields.map((x) => `${camelCase(x.name)}: ${generateType(x.type).type};`).join(' ')
      const codecFieldsSeparate = fields.map((x) => `['${camelCase(x.name)}', ${generateType(x.type).codec}]`)
      const codecFields = `[${codecFieldsSeparate.join(', ')}]`

      return [
        `export type ${item.id} = { ${typeFields} }`,
        `export const ${item.id} = ` +
          libItem('wrapCodec') +
          `<${item.id}>(` +
          libItem('structCodec') +
          `(${codecFields}))`,
      ]
    })
    .with({ t: 'bitmap', repr: 'u32' }, ({ id, masks }) => {
      const repr = generateType({ t: 'lib', id: 'codecs.U32' })

      const namedMasks = masks
        .map(({ name, mask }) => {
          const doc = `\`${name}\` event bitmask. Use \`|\` to combine with other {@link ${id}} bitmasks.`
          return `/** ${doc} */ ${name}: ${mask}`
        })
        .join(', ')

      return [
        // TODO: make opaque?
        `export type ${id} = ${repr.type}`,
        `export const ${id} = { ${namedMasks}, [${libItem('symbolCodec')}]: ${repr.codec} }`,
      ]
    })
    .with({ t: 'struct-gen' }, ({ genericsCount, fields }) => {
      const genericsTypes = Array.from({ length: genericsCount }, (v, i) => `T${i}`).join(', ')
      const genericsPart = `<${genericsTypes}>`
      const typeFields = fields
        .map(({ name, type }) => {
          return (
            `${camelCase(name)}: ` +
            match(type)
              .with({ t: 'gen' }, ({ genericIndex }) => `T${genericIndex}`)
              .otherwise((type) => generateType(type).type)
          )
        })
        .join(', ')

      const schemaItems = fields.map(({ name, type }) => {
        const codec = match(type)
          .with({ t: 'gen' }, ({ genericIndex: i }) => `codec${i}`)
          .otherwise((x) => generateType(x).codec)
        return `['${camelCase(name)}', ${codec}]`
      })
      const withFnBody = `return ${libItem('structCodec')}([${schemaItems.join(', ')}])`

      const withFnArgs = Array.from({ length: genericsCount }, (v, i) => `codec${i}: ${libItem('Codec')}<T${i}>`)

      const withFn = `${genericsPart}(${withFnArgs}): ${libItem('Codec')}<${
        item.id
      }${genericsPart}> => { ${withFnBody} }`

      return [
        `export type ${item.id}${genericsPart} = { ${typeFields} }`,
        `export const ${item.id} = { with: ${withFn} }`,
      ]
    })
    .with({ t: 'array' }, ({ id, item, len }) => {
      const { type, codec } = generateType(item)

      return [
        `export type ${id} = ${type}[]`,
        `export const ${id} = ${libItem('wrapCodec')}<${id}>(${libItem('codecs.Array')}.with(${codec}, ${len}))`,
      ]
    })
    .with({ t: 'alias' }, ({ id, to }) => {
      return [
        `export type ${id} = ${generateType(to).type}`,
        `export const ${id} = ${libItem('wrapCodec')}<${id}>(${generateType(to).codec})`,
      ]
    })
    .exhaustive()
    .join('\n')
}

type LibItem =
  | 'boxEnumCodec'
  | 'wrapCodec'
  | 'Enumerate'
  | 'variant'
  | `${'enum' | 'struct'}Codec`
  | 'toCodec'
  | `codecs.${'BytesVec' | 'String' | 'U8' | 'U16' | 'U32' | 'U64' | 'U128' | 'NonZero' | 'Option' | 'Compact' | 'Vec' | 'Map' | 'Array' | 'Json' | 'Bool'}`
  | 'Codec'
  | 'symbolCodec'
  | 'EnumBoxValue'

type LibCodec = LibItem & `codecs.${string}`

function libItem<T extends LibItem>(item: T): string {
  return `lib.${item}`
}

function upcase<S extends string>(s: S): Uppercase<S> {
  return s.toUpperCase() as Uppercase<S>
}

/**
 * Structured model of an identifier, e.g. `Map<Key, Option<T>>`
 */
interface Ident {
  id: string
  items: Ident[]
}

function parseIdent(src: string): Ident {
  const ROOT = '__root__'
  const stack: Ident[] = [{ id: ROOT, items: [] }]

  for (const [token] of src.matchAll(/(<|>|[\w_]+)/gi)) {
    if (token === '<') {
      const lastItem = stack.at(-1)?.items.at(-1)
      invariant(lastItem, 'should be')
      stack.push(lastItem)
    } else if (token === '>') {
      invariant(stack.pop(), 'should be')
    } else {
      const head = stack.at(-1)
      invariant(head, 'should be')
      head.items.push({ id: token, items: [] })
    }
  }

  return match(stack)
    .with([{ id: ROOT, items: [P.select()] }], (trueRoot) => trueRoot)
    .otherwise((x) => {
      console.error('bad state:', x)
      throw new Error('Bad state')
    })
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest

  test('parse ident of `Map<Key, Option<T>>`', () => {
    expect(parseIdent(`Map<Key, Option<T>>`)).toMatchInlineSnapshot(`
      {
        "id": "Map",
        "items": [
          {
            "id": "Key",
            "items": [],
          },
          {
            "id": "Option",
            "items": [
              {
                "id": "T",
                "items": [],
              },
            ],
          },
        ],
      }
    `)
  })
}
