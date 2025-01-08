/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-nested-callbacks */
import type { Algorithm } from '@iroha2/crypto-core'
import type { EnumDefinition, NamedStructDefinition, Schema, SchemaTypeDefinition } from '@iroha2/data-model-schema'
import { camelCase } from 'change-case'
import { deepEqual } from 'fast-equals'
import invariant from 'tiny-invariant'
import { P, isMatching, match } from 'ts-pattern'

export function generate(schema: Schema, libModule: string): string {
  const resolver = new Resolver(schema)
  const emits = Object.keys(schema)
    .map<[string, TypeRefWithEmit]>((key) => [key, resolver.resolve(key)])
    .reduce((map, [originId, resolved]) => {
      if (resolved.t === 'local' && resolved.emit) {
        const prevEmit = map.get(resolved.id)
        const newEmit = resolved.emit()
        if (prevEmit) {
          invariant(
            deepEqual(newEmit, prevEmit),
            () => `Generic type emit differs for: ${resolved.id} (original id: ${originId})`,
          )
        } else {
          map.set(resolved.id, newEmit)
        }
      }
      return map
    }, new Map<string, EmitCode>())

  postprocessEmits(emits)

  const arranged = arrangeEmits(emits)

  return [`import * as lib from '${libModule}'`, ...arranged.map((id) => renderEmit(id, emits))].join('\n\n')
}

export type Ident = string

export type EmitsMap = Map<string, EmitCode>

export type EmitCode =
  | { t: 'enum'; variants: EmitEnumVariant[] }
  | { t: 'struct'; fields: EmitStructField[] }
  | { t: 'tuple'; elements: TypeRef[] }
  | { t: 'bitmap'; repr: LibType; masks: EmitBitmapMask[] }
  | { t: 'alias'; to: TypeRef }

export interface EmitStructField {
  name: string
  type: TypeRef
}

export interface EmitBitmapMask {
  name: string
  mask: number
}

export type TypeRefWithEmit = (TypeRef & { t: 'local'; emit?: () => EmitCode }) | Exclude<TypeRef, { t: 'local' }>

export interface EmitEnumVariant {
  tag: string
  discriminant: number
  /** "null" means an empty variant */
  type: TypeRef
}

export type TypeRef =
  | { t: 'local'; id: Ident; params?: TypeRef[]; lazy?: boolean }
  | { t: 'lib'; id: LibType; params?: TypeRef[] }
  | { t: 'lib-array'; len: number; type: TypeRef }
  | { t: 'param'; index: number }
  | { t: 'null' }

/**
 * Types available in the library
 */
export type LibType =
  | 'BytesVec'
  | 'String'
  | 'U8'
  | 'U16'
  | 'U32'
  | 'U64'
  | 'U128'
  | 'NonZero'
  | 'Option'
  | 'Compact'
  | 'Vec'
  | 'Map'
  | 'Json'
  | 'Bool'
  | 'Timestamp'
  | 'Duration'
  | 'Name'
  | 'CompoundPredicate'
  | 'DomainId'
  | `AccountId`
  | `AssetDefinitionId`
  | `AssetId`
  | 'Algorithm'
  | 'SignatureWrap'
  | 'HashWrap'
  | 'PublicKeyWrap'

export class Resolver {
  #schema: Schema
  #cache: Map<string, TypeRefWithEmit> = new Map()

  constructor(schema: Schema) {
    this.#schema = schema
  }

  resolve(refOrStr: string | SchemaId): TypeRefWithEmit {
    const [ref, refStr] =
      typeof refOrStr === 'string' ? [SchemaId.parse(refOrStr), refOrStr] : [refOrStr, refOrStr.toStr()]

    if (!this.#cache.has(refStr)) {
      invariant(refStr in this.#schema, () => `Couldn't find schema for '${refStr}'`)
      const schema = this.#schema[refStr]
      const resolved = this.resolveInner(ref, refStr, schema)

      if (resolved.t === 'local' && CYCLE_BREAK_POINTS.has(resolved.id)) resolved.lazy = true

      this.#cache.set(refStr, resolved)
      return resolved
    }

    return this.#cache.get(refStr)!
  }

  private resolveInner(ref: null | SchemaId, refStr: string, schema: SchemaTypeDefinition): TypeRefWithEmit {
    return (
      match({ ref, refStr, schema })
        .returnType<TypeRefWithEmit>()
        .with({ refStr: '()' }, () => ({ t: 'null' }))

        // redundant unused type
        .with({ ref: { id: 'MerkleTree', items: [P._] } }, () => ({ t: 'null' }))

        .with({ refStr: 'bool' }, () => ({ t: 'lib', id: 'Bool' }))
        .with(
          {
            ref: {
              id: P.union(
                'String',
                'Json',
                'Name',
                'DomainId',
                'AccountId',
                'AssetId',
                'AssetDefinitionId',
                'Compact',
                'Algorithm',
              ).select(),
            },
          },
          (id) => ({ t: 'lib', id }),
        )
        .with(
          { refStr: P.union('u8', 'u16', 'u32', 'u64', 'u128').select('int'), schema: { Int: 'FixedWidth' } },
          ({ int }) => ({
            t: 'lib',
            id: upcase(int),
          }),
        )

        .with(
          { refStr: 'BlockSignature', schema: { Tuple: [P.select('index').and('u64'), P.select('signature')] } },
          ({ index, signature }) => ({
            t: 'local',
            id: 'BlockSignature',
            emit: () => ({
              t: 'struct',
              fields: [
                { name: 'peer_topology_index', type: this.resolve(index) },
                { name: 'signature', type: this.resolve(signature) },
              ],
            }),
          }),
        )
        .with(
          {
            ref: { id: P.union('Register', 'Unregister'), items: [P._] },
            schema: { Struct: [{ name: 'object', type: P.select('object') }] },
          },
          ({ object }) => this.resolve(object),
        )
        .with(
          {
            ref: { id: P.select('id').and('SetKeyValue'), items: [P._] },
            schema: { Struct: [{ name: 'object', type: P.select('obj') }, P.select('key'), P.select('value')] },
          },
          ({ id, obj, key, value }) => ({
            t: 'local',
            id,
            params: [this.resolve(obj)],
            emit: () => ({
              t: 'struct',
              fields: [
                { name: 'object', type: { t: 'param', index: 0 } },
                ...[key, value].map((x) => ({ name: x.name, type: this.resolve(x.type) })),
              ],
            }),
          }),
        )
        .with(
          {
            ref: { id: P.select('id').and('RemoveKeyValue'), items: [P._] },
            schema: { Struct: [{ name: 'object', type: P.select('obj') }, P.select('key')] },
          },
          ({ id, obj, key }) => ({
            t: 'local',
            id,
            params: [this.resolve(obj)],
            emit: () => ({
              t: 'struct',
              fields: [
                { name: 'object', type: { t: 'param', index: 0 } },
                { name: key.name, type: this.resolve(key.type) },
              ],
            }),
          }),
        )
        .with(
          {
            ref: { id: P.union('Mint', 'Burn', 'Grant', 'Revoke').select('id'), items: [P._, P._] },
            schema: {
              Struct: [
                { name: 'object', type: P.select('obj') },
                { name: 'destination', type: P.select('dest') },
              ],
            },
          },
          ({ id, obj, dest }) => ({
            t: 'local',
            id,
            params: [obj, dest].map((x) => this.resolve(x)),
            emit: () => ({
              t: 'struct',
              fields: [
                { name: 'object', type: { t: 'param', index: 0 } },
                { name: 'destination', type: { t: 'param', index: 1 } },
              ],
            }),
          }),
        )
        .with(
          {
            ref: { id: 'Transfer', items: [P._, P._, P._] },
            schema: { Struct: P.select('fields', [{ name: 'source' }, { name: 'object' }, { name: 'destination' }]) },
          },
          ({ fields }) => ({
            t: 'local',
            id: 'Transfer',
            params: fields.map((x) => this.resolve(x.type)),
            emit: () => ({
              t: 'struct',
              fields: fields.map((x, i): EmitStructField => ({ ...x, type: { t: 'param', index: i } })),
            }),
          }),
        )
        .with(
          {
            ref: { id: P.select('id', 'QueryWithFilter'), items: [P.select('generic')] },
            schema: {
              Struct: P.select('fields', [{ name: 'query' }, { name: 'predicate' }, { name: 'selector' }]),
            },
          },
          ({ id, generic, fields }): TypeRefWithEmit => {
            invariant(generic.toStr() === fields[0].type)
            return {
              t: 'local',
              id,
              params: fields.map((x) => this.resolve(x.type)),
              emit: () => ({
                t: 'struct',
                fields: fields.map((x, i) => ({ name: x.name, type: { t: 'param', index: i } })),
              }),
            }
          },
        )
        .with(
          {
            ref: {
              id: P.select('id'),
              items: [{ id: P.union('PredicateMarker', 'SelectorMarker').select('marker'), items: [] }],
            },
            schema: P.select('schema'),
          },
          ({ id, marker, schema }) => ({
            t: 'local',
            id: id + marker.slice(0, -'Marker'.length),
            emit: (): EmitCode =>
              match(schema)
                .with({ Struct: P.select() }, (fields): EmitCode => ({ t: 'struct', fields: this.mapFields(fields) }))
                .with(
                  { Enum: P.select() },
                  (variants): EmitCode => ({ t: 'enum', variants: this.mapVariants(variants) }),
                )
                .otherwise(() => {
                  throw new Error(`Unexpected predicate/selector shape: ${id}`)
                }),
          }),
        )
        .with(
          {
            ref: { id: 'MetadataChanged', items: [P._] },
            schema: {
              Struct: [
                { name: 'target', type: P.select('target') },
                P.select('key').and({ name: 'key' }),
                P.select('value').and({ name: 'value' }),
              ],
            },
          },
          ({ target, key, value }) => ({
            t: 'local',
            id: 'MetadataChanged',
            params: [this.resolve(target)],
            emit: (): EmitCode => ({
              t: 'struct',
              fields: [{ name: 'target', type: { t: 'param', index: 0 } }, ...this.mapFields([key, value])],
            }),
          }),
        )
        .with(
          {
            ref: { id: 'SelectorTuple', items: [P._] },
            schema: P.string.select(),
          },
          (target) => this.resolve(target),
        )
        .with(
          {
            ref: P.select('ref', { id: 'CompoundPredicate', items: [P._] }),
            refStr: P.select('refStr'),
            schema: {
              Enum: [
                { tag: 'Atom', type: P.string.select('tyAtom') },
                { tag: 'Not', type: P.string.select('tyNot') },
                { tag: 'And', type: P.string.select('tyAnd') },
                { tag: 'Or', type: P.select('tyOr') },
              ],
            },
          },
          (bindings): TypeRef => {
            invariant(bindings.refStr === bindings.tyNot), invariant(bindings.tyAnd === bindings.tyOr)
            invariant(deepEqual(SchemaId.parse(bindings.tyAnd), new SchemaId('Vec', [bindings.ref])))
            return { t: 'lib', id: 'CompoundPredicate', params: [this.resolve(bindings.tyAtom)] }
          },
        )
        .with(
          {
            ref: { id: 'Mismatch', items: [P._] },
            schema: { Struct: P.select('fields', [{ name: 'expected' }, { name: 'actual' }]) },
          },
          ({ fields }) => {
            invariant(fields[0].type === fields[1].type)
            return {
              t: 'local',
              id: 'Mismatch',
              params: [this.resolve(fields[0].type)],
              emit: () => ({
                t: 'struct',
                fields: fields.map((x) => ({ ...x, type: { t: 'param', index: 0 } })),
              }),
            }
          },
        )
        .with(
          {
            ref: { id: P.union('Ipv4Addr', 'Ipv6Addr').select('ip'), items: [] },
            schema: P.string.select('arr'),
          },
          ({ ip, arr }) => {
            const { len, type } = match(this.resolve(arr))
              .with(
                { t: 'lib-array', len: P.union(4, 8), type: { t: 'lib', id: P.union('U8', 'U16') } },
                ({ len, type }) => ({ len, type }),
              )
              .otherwise(() => {
                throw new Error(`Unexpected type for ${ip}`)
              })

            return {
              t: 'local',
              id: ip,
              emit: () => ({
                t: 'tuple',
                elements: Array.from({ length: len }, () => type),
              }),
            }
          },
        )
        .with(
          P.union(
            { ref: { id: 'SignatureOf', items: [P._] }, schema: 'Signature' },
            { refStr: P.union('TransactionSignature', 'QuerySignature') },
          ),
          () => ({ t: 'lib', id: 'SignatureWrap' }),
        )
        .with({ ref: { id: 'HashOf', items: [P._] }, schema: 'Hash' }, () => ({ t: 'lib', id: 'HashWrap' }))
        .with({ refStr: P.union('Hash', 'PublicKey', 'Signature').select() }, (id) => ({
          t: 'lib',
          id: `${id}Wrap`,
        }))

        .with({ refStr: 'FetchSize', schema: { Struct: [{ name: 'fetch_size', type: P.select() }] } }, (type) =>
          this.resolve(type),
        )

        .with(
          { ref: { id: P.select('id'), items: [] }, schema: { Bitmap: { repr: 'u32', masks: P.select('masks') } } },
          ({ id, masks }) => ({
            t: 'local',
            id,
            emit: () => ({
              t: 'bitmap',
              masks,
              repr: 'U32',
            }),
          }),
        )

        .with(
          { ref: { id: 'Option', items: [P._] }, schema: { Option: P.string.select() } },
          (type): TypeRef => ({ t: 'lib', id: 'Option', params: [this.resolve(type)] }),
        )

        .with(
          { ref: { id: P.union('Vec', 'SortedVec'), items: [P._] }, schema: { Vec: P.string.select() } },
          (type): TypeRef => ({
            t: 'lib',
            id: 'Vec',
            params: [this.resolve(type)],
          }),
        )

        .with(
          {
            ref: { id: 'Array', items: [P._, P._] },
            schema: { Array: { len: P.select('len'), type: P.select('type') } },
          },
          ({ len, type }) => ({
            t: 'lib-array',
            len: Number(len),
            type: this.resolve(type),
          }),
        )

        // maps
        .with(
          {
            ref: { id: 'SortedMap', items: [P._, P._] },
            schema: { Map: { key: P.select('key'), value: P.select('value') } },
          },
          ({ key, value }) => ({
            t: 'lib',
            id: 'Map',
            params: [key, value].map((x) => this.resolve(x)),
          }),
        )

        // non-specific structures without generics
        .with(
          { ref: { id: P.select('id'), items: [] }, schema: { Struct: P.select('fields') } },
          ({ id, fields }): TypeRefWithEmit => ({
            t: 'local',
            id,
            emit: () => ({
              t: 'struct',
              fields: this.mapFields(fields),
            }),
          }),
        )

        // non-specific enums without generics
        .with(
          { ref: { id: P.select('id'), items: [] }, schema: { Enum: P.select('variants') } },
          ({ id, variants }): TypeRefWithEmit => ({
            t: 'local',
            id,
            emit: () => ({
              t: 'enum',
              variants: this.mapVariants(variants),
            }),
          }),
        )

        // redundant aliases
        .with({ schema: P.string.select() }, (target) => this.resolve(target))

        // null types - useless?
        .with({ schema: null }, () => ({ t: 'null' }))

        .otherwise(({ refStr }) => {
          throw new Error(`Could not resolve "${refStr}"`)
        })
    )
  }

  private mapFields(items: NamedStructDefinition['Struct']): EmitStructField[] {
    return items.map((x) => ({ name: x.name, type: this.resolve(x.type) }))
  }

  private mapVariants(items: EnumDefinition['Enum']): EmitEnumVariant[] {
    return items.map((x) => {
      const type = match(x)
        .returnType<TypeRef>()
        .with({ type: P.string }, ({ type }) => this.resolve(type))
        .otherwise(() => ({ t: 'null' }))
      return { ...x, type }
    })
  }

  resolveAll(): TypeRefWithEmit[] {
    return Object.keys(this.#schema).map((key) => this.resolve(key))
  }
}

export class SchemaId {
  // TODO: remove path check?
  static parse(src: string): null | SchemaId {
    const stack: SchemaId[] = [new SchemaId('__root__')]

    for (const [token] of src.matchAll(/(<|>|(?:[\w_]+|::)+)/gi)) {
      if (token === '<') {
        const lastItem = stack.at(-1)?.items.at(-1)
        invariant(lastItem, 'should be')
        stack.push(lastItem)
      } else if (token === '>') {
        invariant(stack.pop(), 'should be')
      } else {
        const head = stack.at(-1)
        invariant(head, 'should be')
        const idWithPath = token.split('::')
        const id = idWithPath.at(-1)!
        // const path = idWithPath.length > 1 ? idWithPath.slice(0, -1) : undefined
        head.items.push(new SchemaId(id))
      }
    }

    return match(stack)
      .with([{ id: '__root__', items: [P.select()] }], (trueRoot) => trueRoot)
      .otherwise(() => null)
  }

  id: string
  items: SchemaId[]

  constructor(id: string, items: SchemaId[] = []) {
    this.id = id
    this.items = items
  }

  eq(other: SchemaId): boolean {
    return (
      this.id === other.id &&
      this.items.length === other.items.length &&
      this.items.every((child, i) => child.eq(other.items[i]))
    )
  }

  toStr(): string {
    return this.id + (this.items.length ? '<' + this.items.map((x) => x.toStr()).join(', ') + '>' : '')
  }
}

export interface EnumShortcutsTree {
  id: string
  variants: EnumShortcutTreeVariant[]
}

export type EnumShortcutTreeVariant = { name: string } & (
  | { t: 'unit' }
  | { t: 'value'; value_ty: TypeRef }
  | { t: 'enum'; tree: EnumShortcutsTree }
)

export function enumShortcuts(variants: EmitEnumVariant[], types: EmitsMap): EnumShortcutTreeVariant[] {
  return variants.map((variant): EnumShortcutTreeVariant & { name: string } => {
    if (variant.type.t === 'null') return { name: variant.tag, t: 'unit' }
    if (variant.type.t === 'local') {
      const type = types.get(variant.type.id)
      invariant(type, 'must be in schema')
      if (type.t === 'enum') {
        return {
          t: 'enum',
          name: variant.tag,
          tree: { id: variant.type.id, variants: enumShortcuts(type.variants, types) },
        }
      }
    }
    return { t: 'value', value_ty: variant.type, name: variant.tag }
  })
}

function postprocessEmits(emits: EmitsMap) {
  function replace(id: string, f: (emit: EmitCode) => EmitCode) {
    invariant(emits.has(id))
    emits.set(id, f(emits.get(id)!))
  }

  replace('TransactionPayload', (emit) => {
    invariant(emit.t === 'struct')

    const creationTime = emit.fields.find((x) =>
      isMatching({ name: 'creation_time_ms', type: { t: 'lib', id: 'U64' } }, x),
    )
    invariant(creationTime)
    creationTime.name = 'creation_time'
    creationTime.type = { t: 'lib', id: 'Timestamp' }

    const ttl = emit.fields.find((x) =>
      isMatching({ name: 'time_to_live_ms', type: { t: 'lib', id: 'Option', params: [{ t: 'lib', id: 'U64' }] } }, x),
    )
    invariant(ttl)
    ttl.name = 'time_to_live'
    ttl.type = { t: 'lib', id: 'Option', params: [{ t: 'lib', id: 'Duration' }] }

    return emit
  })

  replace('TimeInterval', (emit) => {
    invariant(
      isMatching(
        {
          fields: [
            { name: 'since_ms', type: { t: 'lib', id: 'U64' } },
            { name: 'length_ms', type: { t: 'lib', id: 'U64' } },
          ],
        },
        emit,
      ),
    )
    return {
      ...emit,
      fields: [
        { name: 'since', type: { t: 'lib', id: 'Timestamp' } },
        { name: 'length', type: { t: 'lib', id: 'Duration' } },
      ],
    }
  })

  replace('Schedule', (emit) => {
    invariant(
      isMatching(
        {
          fields: [
            { name: 'start_ms', type: { t: 'lib', id: 'U64' } },
            { name: 'period_ms', type: { t: 'lib', id: 'Option', params: [{ t: 'lib', id: 'U64' }] } },
          ],
        },
        emit,
      ),
    )
    return {
      ...emit,
      fields: [
        { name: 'start', type: { t: 'lib', id: 'Timestamp' } },
        { name: 'period', type: { t: 'lib', id: 'Option', params: [{ t: 'lib', id: 'Duration' }] } },
      ],
    }
  })
}

const CRYPTO_ALGORITHMS: Algorithm[] = ['ed25519', 'secp256k1', 'bls_normal', 'bls_small']

/**
 * Yields each {@link TypeRef} inside a given one (and including it)
 */
function* visitRefs(ref: TypeRef): Generator<TypeRef> {
  yield ref
  if ((ref.t === 'lib' || ref.t === 'local') && ref.params) {
    for (const param of ref.params) {
      yield* visitRefs(param)
    }
  }
}

function* visitEmitRefs(emit: EmitCode): Generator<TypeRef> {
  switch (emit.t) {
    case 'enum': {
      for (const i of emit.variants) yield* visitRefs(i.type)
      break
    }
    case 'struct': {
      for (const i of emit.fields) yield* visitRefs(i.type)
      break
    }
    case 'tuple': {
      for (const i of emit.elements) yield* visitRefs(i)
      break
    }
    case 'alias': {
      yield* visitRefs(emit.to)
      break
    }
  }
}

/**
 * See {@link arrangeEmits}
 */
const CYCLE_BREAK_POINTS = new Set(['InstructionBox'])

/**
 * Arranges entries in a _topological order_ using [depth-first search](https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search).
 *
 * The algorithm is designed for DAGs (directed **acyclic** graphs).
 * However, the schema has _one_ cycle, with `InstructionBox` type.
 * To resolve this, the algorithm pretends as if no one refers to `InstructionBox`.
 * For this reason, **all** references to `InstructionBox` in the emitted code **must be lazy**.
 */
function arrangeEmits(map: EmitsMap): string[] {
  const graph = new Map<string, Set<string>>()
  for (const [key, emit] of map) {
    const refs = new Set<string>()
    for (const ident of visitEmitRefs(emit)) {
      if (ident.t === 'local')
        if (CYCLE_BREAK_POINTS.has(ident.id)) invariant(ident.lazy, `reference from ${key} to ${ident.id} must be lazy`)
        else refs.add(ident.id)
    }
    graph.set(key, refs)
  }

  const temporary = new Set<string>()
  const permanent = new Set<string>()
  const sorted = new Array<string>()

  function visit(n: string) {
    if (permanent.has(n)) return
    if (temporary.has(n)) throw new Error(`cycle: ${n}`)

    temporary.add(n)
    for (const m of graph.get(n)!) visit(m)

    temporary.delete(n)
    permanent.add(n)
    sorted.push(n)
  }

  for (const n of graph.keys()) {
    visit(n)
  }

  invariant(sorted.length === map.size)
  return sorted
}

interface RefRender {
  /** type-layer, `T` */
  type: string
  /** expression of type `Codec<T>` */
  codec: string
}

function renderRef(ref: TypeRef): RefRender {
  return match(ref)
    .returnType<RefRender>()
    .with({ t: 'local', params: P.array() }, ({ id, params }) => {
      return {
        type: id + `<${params.map((x) => renderRef(x).type).join(', ')}>`,
        codec: `lib.codecOf(${id}.with(${params.map((x) => renderRef(x).codec).join(', ')}))`,
      }
    })
    .with({ t: 'local' }, ({ id, lazy }) => {
      const codec = `lib.codecOf(${id})`
      return {
        type: id,
        codec: lazy ? `lib.lazyCodec(() => ${codec})` : codec,
      }
    })
    .with({ t: 'lib', params: P.array() }, ({ id, params }) => {
      const typeGenerics = `<${params.map((x) => renderRef(x).type).join(', ')}>`

      return {
        type: `lib.${id}${typeGenerics}`,
        codec: `lib.codecOf(lib.${id}.with(${params.map((x) => renderRef(x).codec).join(', ')}))`,
      }
    })
    .with({ t: 'lib' }, ({ id }) => {
      return {
        type: `lib.${id}`,
        codec: `lib.codecOf(lib.${id})`,
      }
    })
    .with({ t: 'lib-array' }, ({ len }) => ({
      type: String(len),
      codec: String(len),
    }))
    .with({ t: 'param' }, ({ index }) => {
      return {
        type: `T${index}`,
        codec: `t${index}`,
      }
    })
    .with({ t: 'null' }, () => ({
      type: 'null',
      codec: 'lib.nullCodec',
    }))
    .exhaustive()
}

function renderBaseEnumCodec(variants: EmitEnumVariant[]): string {
  const types = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag }) => `${tag}: []`)
      .otherwise(({ tag, type }) => `${tag}: [${renderRef(type).type}]`),
  )
  const options = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag, discriminant }) => `[${discriminant}, '${tag}']`)
      .otherwise(({ tag, discriminant, type }) => `[${discriminant}, '${tag}', ${renderRef(type).codec}]`),
  )
  return `lib.enumCodec<{ ${types.join(', ')} }>([${options.join(', ')}])`
}

function renderSumTypes(variants: EmitEnumVariant[]) {
  const mapped = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag }) => `lib.VariantUnit<'${tag}'>`)
      .otherwise(({ tag, type }) => `lib.Variant<'${tag}', ${renderRef(type).type}>`),
  )

  return mapped.join(' | ')
}

export function renderShortcutsTree(root: EnumShortcutsTree): string {
  interface State {
    head: { id0: string; var0: string }
    chain: string[]
  }

  const nextState = (stateIn: State | null, tree: EnumShortcutsTree, variant: EnumShortcutTreeVariant): State =>
    match(stateIn)
      .returnType<State>()
      .with(null, () => ({ head: { id0: tree.id, var0: variant.name }, chain: [] }))
      .with({ chain: [] }, ({ head }) => ({ head, chain: [tree.id, variant.name] }))
      .otherwise(({ head, chain }) => ({ head, chain: [...chain, variant.name] }))

  const genChain = (chain: string[]) => chain.join('.')
  const genConcreteType = (
    state: State,
    variant: Pick<Exclude<EnumShortcutTreeVariant, { t: 'enum' }>, 't' | 'name'>,
  ): string => {
    const last = match(variant)
      .with({ t: 'unit' }, ({ name }) => `lib.VariantUnit<'${name}'>`)
      .with({ t: 'value' }, ({ name }) => `lib.Variant<'${name}', T>`)
      .exhaustive()

    const first = match(state)
      .returnType<string[]>()
      .with({ chain: [] }, () => [])
      .otherwise(({ head: { var0 }, chain: [_head, ...tail] }) => [var0, ...tail.slice(0, -1)])
    first.reverse()

    return first.reduce((acc, item) => `lib.Variant<'${item}', ${acc}>`, last)
  }

  function iter(tree: EnumShortcutsTree, stateIn: State | null = null) {
    return tree.variants
      .map((variant): string => {
        const state = nextState(stateIn, tree, variant)

        const right = match(variant)
          .returnType<string>()
          .with({ t: 'unit' }, (variant) =>
            match(state)
              .with(
                { chain: [] },
                ({ head }) => `Object.freeze<${genConcreteType(state, variant)}>({ kind: '${head.var0}' })`,
              )
              .otherwise(
                ({ head, chain }) =>
                  `Object.freeze<${genConcreteType(state, variant)}>({ kind: '${head.var0}', value: ${genChain(chain)} })`,
              ),
          )
          .with({ t: 'value' }, (variant) =>
            match(state)
              .with(
                { chain: [] },
                ({ head }) =>
                  `<const T extends ${renderRef(variant.value_ty).type}>(value: T): ${genConcreteType(state, variant)} => ({ kind: '${head.var0}', value })`,
              )
              .otherwise(
                ({ head, chain }) =>
                  `<const T extends ${renderRef(variant.value_ty).type}>(value: T): ${genConcreteType(state, variant)} => ({ kind: '${head.var0}', value: ${genChain(chain)}(value) })`,
              ),
          )
          .with({ t: 'enum' }, ({ tree }) => {
            const nested = iter(tree, state)
            return `{ ${nested} }`
          })
          .exhaustive()

        return `${variant.name}: ${right}`
      })
      .join(', ')
  }

  return iter(root)
}
const CODEC_SYMBOL = `[lib.CodecSymbol]`

function renderCodecKeyValue(id: string, content: string): string {
  return `${CODEC_SYMBOL}: ${content} satisfies lib.Codec<${id}>`
}

function renderEmit(id: string, map: EmitsMap): string {
  const emit = map.get(id)
  invariant(emit)
  return match(emit)
    .returnType<string[]>()
    .with({ t: 'enum', variants: [] }, () => [
      `export type ${id} = never`,
      `export const ${id} = { ${CODEC_SYMBOL}: lib.neverCodec }`,
    ])
    .with({ t: 'enum' }, ({ variants }) => {
      const shortcuts = renderShortcutsTree({ id, variants: enumShortcuts(variants, map) })
      const codec = renderBaseEnumCodec(variants) + `.discriminated()`

      return [
        // `/** */`,
        `export type ${id} = ${renderSumTypes(variants)}`,
        `export const ${id} = { ${shortcuts}, ${CODEC_SYMBOL}: ${codec} }`,
      ]
    })
    .with({ t: 'struct' }, ({ fields }) => {
      let maxGenericsIndex = -1
      for (const field of fields) {
        for (const ty of visitRefs(field.type)) {
          if (ty.t === 'param') maxGenericsIndex = Math.max(maxGenericsIndex, ty.index)
        }
      }

      const typeFields = fields.map((x) => `${camelCase(x.name)}: ${renderRef(x.type).type}`).join(', ')
      const codecFieldsOrder = '[' + fields.map((x) => `'${camelCase(x.name)}'`).join(', ') + ']'
      const codecFieldsMap =
        '{' + fields.map((x) => `${camelCase(x.name)}: ${renderRef(x.type).codec}`).join(', ') + '}'
      const codec = (codecTy: string) => `lib.structCodec<${codecTy}>(${codecFieldsOrder}, ${codecFieldsMap})`

      if (maxGenericsIndex >= 0) {
        const generics = Array.from({ length: maxGenericsIndex + 1 }, (_v, i) => renderRef({ t: 'param', index: i }))

        const genericTypes = generics.map((x) => x.type).join(', ')
        const withArgs = generics.map((x) => `${x.codec}: lib.Codec<${x.type}>`).join(', ')
        const withRet = `({ ${CODEC_SYMBOL}: ${codec(`${id}<${genericTypes}>`)} })`

        return [
          `export interface ${id}<${genericTypes}> { ${typeFields} }`,
          `export const ${id} = { ` +
            `with: <${genericTypes}>(${withArgs}): lib.CodecProvider<${id}<${genericTypes}>> => ${withRet} }`,
        ]
      } else {
        return [
          `export interface ${id} { ${typeFields} }`,
          `export const ${id}: lib.CodecProvider<${id}> = { ${CODEC_SYMBOL}: ${codec(id)} }`,
        ]
      }
    })
    .with({ t: 'tuple' }, ({ elements }) => {
      const typeElements = elements.map((x) => renderRef(x).type)
      const codecElements = elements.map((x) => renderRef(x).codec)
      const codec = `lib.tupleCodec([${codecElements.join(', ')}])`
      return [
        `export type ${id} = [${typeElements.join(', ')}]`,
        `export const ${id} = { ${renderCodecKeyValue(id, codec)} }`,
      ]
    })
    .with({ t: 'bitmap' }, ({ masks, repr }) => {
      invariant(repr === 'U32')

      const typeLiterals = masks.map((x) => `'${x.name}'`)
      const codecMasks = masks.map(({ name, mask }) => `${name}: ${mask}`)
      const codec = `lib.bitmapCodec<${id} extends Set<infer T> ? T : never>({ ${codecMasks.join(', ')} })`

      return [
        `export type ${id} = Set<${typeLiterals.join(' | ')}>`,
        `export const ${id} = { ${renderCodecKeyValue(id, codec)} }`,
      ]
    })
    .with({ t: 'alias' }, ({ to }) => {
      return [
        `export type ${id} = ${renderRef(to).type}`,
        `export const ${id} = { ${CODEC_SYMBOL}: ${renderRef(to).codec} }`,
      ]
    })
    .exhaustive()
    .join('\n')
}

function upcase<S extends string>(s: S): Uppercase<S> {
  return s.toUpperCase() as Uppercase<S>
}
