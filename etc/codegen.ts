import type { EnumDefinition, NamedStructDefinition, Schema, SchemaTypeDefinition } from '@iroha/core/data-model/schema'
import { toCamelCase as camelCase, toKebabCase } from '@std/text'
import { deepEqual } from 'fast-equals'
import { assert, assertEquals, assertObjectMatch, fail } from '@std/assert'
import { match, P } from 'ts-pattern'

// TODO: return HashOf<..> ? Hard. Requires all hashable items to implement Hash on instances => why not all make all types as classes, finally...

export function generateDataModel(resolver: Resolver, libModule: string): string {
  const { emits } = resolver

  const arranged = arrangeEmits(emits)

  return [
    `import * as lib from '${libModule}'`,
    ...arranged.map((id) => renderEmit(id, emits)),
  ].join('\n\n')
}

function unreachable(message: string): never {
  throw new Error(`unreachable invariant: ${message}`)
}

export function generateClientFindAPI(resolver: Resolver, libClient: string): string {
  const queryBox = resolver.emits.get('QueryBox')
  assert(queryBox && queryBox.t === 'enum')

  const iterableQueryMethods = queryBox.variants.map((x) => {
    const { payload } = match(x.type)
      .with(
        {
          t: 'local',
          id: 'QueryWithFilter',
          params: [
            P.select('payload'),
            { t: 'lib', id: 'CompoundPredicate', params: [{ t: 'local', id: P.select('predicate') }] },
            { t: 'lib', id: 'Vec', params: [{ t: 'local', id: P.select('selector') }] },
          ],
        },
        (bindings) => ({
          ...bindings,
          payload: match(bindings.payload)
            .with({ t: 'null' }, () => null)
            .with({ t: P.union('lib', 'local'), id: P.select() }, (id) => id)
            .otherwise(() => unreachable('unexpected payload type')),
        }),
      )
      .otherwise(() => unreachable('unexpected query box variant'))

    assert(x.tag.startsWith('Find'))
    const methodName = camelCase(x.tag.slice('Find'.length))

    const payloadArg = payload ? `payload: types.${payload}, ` : ''
    const payloadArgValue = payload ? `payload, ` : ``

    return (
      `  /** Convenience method for \`${x.tag}\` query, a variant of {@linkcode types.QueryBox} enum. */\n` +
      `  public ${methodName}(${payloadArg}params?: core.QueryBuilderParams): ` +
      `client.QueryBuilder<'${x.tag}'> {\n` +
      `    return new client.QueryBuilder(this._executor, '${x.tag}', ${payloadArgValue}params)\n  }\n`
    )
  })

  const singularQueryBox = resolver.emits.get('SingularQueryBox')
  assert(singularQueryBox && singularQueryBox.t === 'enum')

  const singularQueryMethods = singularQueryBox.variants.map((x) => {
    assert(x.tag.startsWith('Find'))
    const methodName = camelCase(x.tag.slice('Find'.length))

    // const predicateType =

    return (
      `  /** Convenience method for \`${x.tag}\` query, a variant of {@linkcode types.SingularQueryBox} enum. */\n` +
      `  public ${methodName}(): Promise<core.GetSingularQueryOutput<'${x.tag}'>> {\n` +
      `    return client.executeSingularQuery(this._executor, '${x.tag}')\n  }\n`
    )
  })

  return [
    `import * as client from '${libClient}'`,
    `import type * as core from '@iroha/core'`,
    `import type * as types from '@iroha/core/data-model'`,
    `export class FindAPI {`,
    `  private _executor: client.QueryExecutor`,
    `  public constructor(executor: client.QueryExecutor) { this._executor = executor; }`,
    ...iterableQueryMethods,
    ...singularQueryMethods,
    `}`,
  ].join('\n')
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
  | { t: 'lib-any'; id: Ident; params?: TypeRef[] }
  | { t: 'lib-array'; len: number; type: TypeRef }
  | { t: 'lib-b-tree-set-with-cmp'; type: TypeRef; compareFn: string }
  | { t: 'result'; ok: TypeRef; err: TypeRef }
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
  | 'BTreeSet'
  | 'BTreeMap'
  | 'Json'
  | 'Bool'
  | 'Timestamp'
  | 'Duration'
  | 'DurationCompact'
  | 'Name'
  | 'CompoundPredicate'
  | 'DomainId'
  | `AccountId`
  | `AssetDefinitionId`
  | `AssetId`
  | 'NftId'
  | 'Algorithm'
  | 'Signature'
  | 'Hash'
  | 'PublicKey'
  | 'BlockSignature'

export class Resolver {
  #schema: Schema
  #resolved: Map<string, TypeRefWithEmit> = new Map()
  #emits: EmitsMap = new Map()

  constructor(schema: Schema) {
    this.#schema = schema

    this.resolveAll()
    this.fillEmits()
    this.processNeverEnums()
  }

  private resolveAll() {
    for (const key of Object.keys(this.#schema)) {
      this.resolve(key)
    }
  }

  private fillEmits() {
    for (const [originId, resolved] of this.#resolved) {
      if (resolved.t === 'local' && resolved.emit) {
        const prevEmit = this.#emits.get(resolved.id)
        const newEmit = resolved.emit()
        if (prevEmit) {
          assert(
            deepEqual(newEmit, prevEmit),
            `Generic type emit differs for: ${resolved.id} (original id: ${originId})`,
          )
        } else {
          this.#emits.set(resolved.id, newEmit)
        }
      }
    }
  }

  private processNeverEnums() {
    for (const [id, emit] of this.#emits) {
      if (emit.t === 'enum') {
        const tree = enumShortcuts(emit.variants, this.#emits)
        if (!tree.length) {
          // never type
          this.#emits.set(id, { t: 'enum', variants: [] })
        }
      }
    }
  }

  public get emits() {
    return this.#emits
  }

  private resolve(refOrStr: string | SchemaId): TypeRefWithEmit {
    const [ref, refStr] = typeof refOrStr === 'string'
      ? [SchemaId.parse(refOrStr), refOrStr]
      : [refOrStr, refOrStr.toStr()]

    if (!this.#resolved.has(refStr)) {
      assert(refStr in this.#schema, `Couldn't find schema for '${refStr}'`)
      const schema = this.#schema[refStr]
      const resolved = this.resolveInner(ref, refStr, schema)

      if (resolved.t === 'local' && CYCLE_BREAK_POINTS.has(resolved.id)) resolved.lazy = true

      this.#resolved.set(refStr, resolved)
      return resolved
    }

    return this.#resolved.get(refStr)!
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
                'NftId',
                'AssetDefinitionId',
                'Compact',
                'Algorithm',
                'BlockSignature',
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
          { refStr: 'Uptime', schema: { Tuple: ['Compact<u64>', 'u32'] } },
          ({ refStr }) => ({
            t: 'local',
            id: refStr,
            // TODO: merge with duration? change Status in schema?
            emit: () => ({
              t: 'struct',
              fields: [{ name: 'secs', type: { t: 'lib', id: 'Compact' } }, {
                name: 'nanos',
                type: { t: 'lib', id: 'U32' },
              }],
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
            assert(generic.toStr() === fields[0].type)
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
            assert(bindings.refStr === bindings.tyNot)
            assert(bindings.tyAnd === bindings.tyOr)
            assert(deepEqual(SchemaId.parse(bindings.tyAnd), new SchemaId('Vec', [bindings.ref])))
            return { t: 'lib', id: 'CompoundPredicate', params: [this.resolve(bindings.tyAtom)] }
          },
        )
        .with(
          {
            ref: { id: 'Mismatch', items: [P._] },
            schema: { Struct: P.select('fields', [{ name: 'expected' }, { name: 'actual' }]) },
          },
          ({ fields }) => {
            assert(fields[0].type === fields[1].type)
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
          () => ({ t: 'lib', id: 'Signature' }),
        )
        .with({ ref: { id: 'HashOf', items: [P._] }, schema: 'Hash' }, () => ({ t: 'lib', id: 'Hash' }))
        .with(
          {
            ref: { id: 'MerkleProof', items: [P._] },
            schema: {
              Struct: [P._, P._],
            },
          },
          ({ schema }) => ({
            t: 'local',
            id: 'MerkleProof',
            emit: (): EmitCode => ({ t: 'struct', fields: this.mapFields(schema.Struct) }),
          }),
        )
        .with({ refStr: P.union('Hash', 'PublicKey', 'Signature').select() }, (id) => ({
          t: 'lib',
          id,
        }))
        .with(
          { refStr: 'FetchSize', schema: { Struct: [{ name: 'fetch_size', type: P.select() }] } },
          (type) => this.resolve(type),
        )
        .with({ refStr: 'BlockSubscriptionRequest', schema: 'NonZero<u64>' }, ({ refStr, schema }) => ({
          t: 'local',
          id: refStr,
          emit: (): EmitCode => ({
            t: 'struct',
            fields: [{ name: 'from_block_height', type: this.resolve(schema) }],
          }),
        }))
        .with({ refStr: 'EventSubscriptionRequest', schema: P.string }, ({ refStr, schema }) => {
          const filters = this.resolve(schema)
          assert(filters.t === 'lib' && filters.id === 'Vec')

          return {
            t: 'local',
            id: refStr,
            emit: (): EmitCode => ({
              t: 'struct',
              fields: [{ name: 'filters', type: filters }],
            }),
          }
        })
        .with(
          {
            refStr: P.select('id', 'QueryOutputBatchBoxTuple'),
            schema: { Struct: [{ name: 'tuple', type: P.select('alias') }] },
          },
          ({ id, alias }) => ({
            t: 'local',
            id,
            emit: (): EmitCode => ({ t: 'alias', to: this.resolve(alias) }),
          }),
        )
        .with(
          {
            ref: { id: P.select('id'), items: [] },
            schema: { Struct: [{ name: 'name', type: 'Name' }] },
          },
          ({ id }) => ({ t: 'local', id, emit: () => ({ t: 'alias', to: { t: 'lib', id: 'Name' } }) }),
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
        .with({ ref: { id: 'SortedVec', items: [{ id: 'Permission' }] } }, () => ({
          t: 'local',
          id: 'PermissionsSet',
          emit: () => ({
            t: 'alias',
            to: {
              t: 'lib-b-tree-set-with-cmp',
              type: this.resolve('Permission'),
              compareFn: `(a, b) => {  
                const names = lib.ordCompare(a.name, b.name)
                if (names !== 0) return names
                return lib.ordCompare(a.payload, b.payload)
              }`,
            },
          }),
        }))
        .with({ ref: { id: 'Vec', items: [{ id: 'u8' }] } }, () => ({
          t: 'lib',
          id: 'BytesVec',
        }))
        .with(
          {
            ref: { id: P.union('Vec', 'SortedVec').select('id'), items: [P._] },
            schema: { Vec: P.string.select('type') },
          },
          ({ id, type }): TypeRef => ({
            t: 'lib',
            id: id === 'SortedVec' ? 'BTreeSet' : id,
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
            id: 'BTreeMap',
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
        .with(
          { ref: { id: 'NonZero', items: [{ id: P.select('int'), items: [] }] }, schema: P.string.select('int2') },
          ({ int, int2 }) => {
            assert(int === int2)
            return {
              t: 'lib',
              id: 'NonZero',
              params: [this.resolve(int)],
            }
          },
        )
        // results
        .with(
          { schema: { Result: { ok: P.select('ok'), err: P.select('err') } } },
          (selected) => ({ t: 'result', ok: this.resolve(selected.ok), err: this.resolve(selected.err) }),
        )
        // lightweight aliases
        .with({ ref: { id: P.select('id'), items: [] }, schema: P.string.select('target') }, ({ id, target }) => ({
          t: 'local',
          id,
          emit: (): EmitCode => {
            const resolved = this.resolve(target)
            if (resolved.t === 'result') {
              return {
                t: 'enum',
                variants: [
                  { tag: 'Ok', discriminant: 0, type: resolved.ok },
                  { tag: 'Err', discriminant: 1, type: resolved.err },
                ],
              }
            }
            return {
              t: 'alias',
              to: this.resolve(target),
            }
          },
        }))
        // null types - useless?
        .with({ schema: null }, () => ({ t: 'null' }))
        .otherwise(({ refStr }) => {
          throw new Error(`Could not resolve "${refStr}"`)
        })
    )
  }

  private produceType<T extends TypeRefWithEmit & { t: 'local' }>(ref: T): T {
    this.#resolved.set(ref.id, ref)
    return ref
  }

  private mapFields(items: NamedStructDefinition['Struct']): EmitStructField[] {
    return items.map((x): EmitStructField => {
      if (x.name.endsWith('_ms')) {
        const rewriteWith = match(x.name)
          .returnType<LibType>()
          .with(
            P.union('start_ms', 'creation_time_ms', 'since_ms', 'proposed_at_ms', 'expires_at_ms'),
            () => 'Timestamp',
          )
          .otherwise(() => 'Duration')

        const type = match([rewriteWith, this.resolve(x.type)])
          .returnType<TypeRef>()
          .with([P._, { t: 'lib', id: 'U64' }], () => ({ t: 'lib', id: rewriteWith }))
          .with(['Timestamp', { t: 'lib', id: 'NonZero', params: [{ t: 'lib', id: 'U64' }] }], () => {
            // FIXME
            console.warn(
              `Field that seems to be a timestamp is declared as NonZero<u64>: "${x.name}".\n` +
                `That is an issue in the schema. Rewriting it as just Timestamp.\n` +
                `Remove this code when the schema fixed.`,
            )
            return {
              t: 'lib',
              id: rewriteWith,
            }
          })
          .with(
            [P._, { t: 'lib', id: P.union('Option', 'NonZero').select(), params: [{ t: 'lib', id: 'U64' }] }],
            (base) => ({
              t: 'lib',
              id: base,
              params: [{ t: 'lib', id: rewriteWith }],
            }),
          )
          .with(
            [
              'Duration',
              { t: 'lib', id: 'Option', params: [{ t: 'lib', id: 'NonZero', params: [{ t: 'lib', id: 'U64' }] }] },
            ],
            () => ({
              t: 'lib',
              id: 'Option',
              params: [{ t: 'lib', id: 'NonZero', params: [{ t: 'lib', id: rewriteWith }] }],
            }),
          )
          .with(
            [
              'Duration',
              { t: 'lib', id: 'Compact' },
            ],
            () => ({
              t: 'lib',
              id: 'DurationCompact',
            }),
          )
          .otherwise(() => {
            console.debug(this.resolve(x.type))
            throw new Error(`Unexpected type of a field with _ms suffix: ${x.type}`)
          })
        return { name: x.name.slice(0, -3), type }
      }
      return match(x)
        .returnType<EmitStructField>()
        .with({ name: 'errors', type: P.when((y) => y.includes('TransactionRejectionReason')) }, (errorsField) => {
          return match(this.resolve(errorsField.type))
            .returnType<EmitStructField>()
            .with(
              {
                t: 'lib',
                id: 'BTreeMap',
                params: [
                  P.select('index', { t: 'lib', id: 'U64' }),
                  P.select('error', { t: 'local', id: 'TransactionRejectionReason' }),
                ],
              },
              ({ index, error }): EmitStructField => {
                const errWithIndex = this.produceType({
                  t: 'local',
                  id: 'TransactionErrorWithIndex',
                  emit: () => ({
                    t: 'struct',
                    fields: [
                      { name: 'index', type: index },
                      { name: 'error', type: error },
                    ],
                  }),
                })
                const map = this.produceType({
                  t: 'local',
                  id: 'TransactionErrors',
                  emit: () => ({
                    t: 'alias',
                    to: {
                      t: 'lib-b-tree-set-with-cmp',
                      type: errWithIndex,
                      compareFn: `(a, b) => lib.ordCompare(a.index, b.index)`,
                    },
                  }),
                })
                return {
                  name: x.name,
                  type: map,
                }
              },
            )
            .otherwise(() => {
              throw new Error(`unexpected errors shape: ${errorsField.type}`)
            })
        })
        .otherwise(() => ({ name: x.name, type: this.resolve(x.type) }))
    })
  }

  private mapVariants(items: EnumDefinition['Enum']): EmitEnumVariant[] {
    return items.map((x) => {
      if (x.tag.endsWith('Ms')) {
        assert(x.type === 'u64')
        return { ...x, tag: x.tag.slice(0, -2), type: { t: 'lib', id: 'Duration' } }
      }

      const type = match(x)
        .returnType<TypeRef>()
        .with({ type: P.string }, ({ type }) => this.resolve(type))
        .otherwise(() => ({ t: 'null' }))
      return { ...x, type }
    })
  }
}

export class SchemaId {
  // TODO: remove path check?
  static parse(src: string): null | SchemaId {
    const stack: SchemaId[] = [new SchemaId('__root__')]

    for (const [token] of src.matchAll(/(<|>|(?:[\w_]+|::)+)/gi)) {
      if (token === '<') {
        const lastItem = stack.at(-1)?.items.at(-1)
        assert(lastItem, 'should be')
        stack.push(lastItem)
      } else if (token === '>') {
        assert(stack.pop(), 'should be')
      } else {
        const head = stack.at(-1)
        assert(head, 'should be')
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

export type EnumShortcutTreeVariant =
  & { name: string }
  & (
    | { t: 'unit' }
    | { t: 'value'; value_ty: TypeRef }
    | { t: 'enum'; tree: EnumShortcutsTree }
  )

function findEnum(map: EmitsMap, id: string): null | (EmitCode & { t: 'enum' }) {
  const type = map.get(id)
  assert(type, 'must be in schema')
  if (type.t === 'enum') return type
  if (type.t === 'alias' && type.to.t === 'local') return findEnum(map, type.to.id)
  return null
}

export function enumShortcuts(variants: EmitEnumVariant[], types: EmitsMap): EnumShortcutTreeVariant[] {
  return variants.flatMap((variant): (EnumShortcutTreeVariant & { name: string })[] => {
    if (variant.type.t === 'null') return [{ name: variant.tag, t: 'unit' }]
    if (variant.type.t === 'local') {
      const found = findEnum(types, variant.type.id)
      if (found) {
        const variants = enumShortcuts(found.variants, types)
        // there are some "never" enums, and we don't need shortcuts for them
        if (!variants.length) return []
        return [
          {
            t: 'enum',
            name: variant.tag,
            tree: { id: variant.type.id, variants },
          },
        ]
      }
    }
    return [{ t: 'value', value_ty: variant.type, name: variant.tag }]
  })
}

/**
 * Yields each {@link TypeRef} inside a given one (and including it)
 */
function* visitRefs(ref: TypeRef): Generator<TypeRef> {
  yield ref
  if ((ref.t === 'lib' || ref.t === 'local') && ref.params) {
    for (const param of ref.params) {
      yield* visitRefs(param)
    }
  } else if (ref.t === 'lib-b-tree-set-with-cmp') {
    yield ref.type
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
      if (ident.t === 'local') {
        if (CYCLE_BREAK_POINTS.has(ident.id)) assert(ident.lazy, `reference from ${key} to ${ident.id} must be lazy`)
        else refs.add(ident.id)
      }
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

  assert(sorted.length === map.size)
  return sorted
}

interface RefRender {
  /** type-layer, `T` */
  type: string
  /** expression of type `Codec<T>` */
  codec: string
  /** runtime-layer ID (e.g. for direct aliasing) when possible */
  valueId?: string
}

function renderGetCodec(x: string) {
  return `lib.getCodec(${x})`
}

function renderRef(ref: TypeRef): RefRender {
  return match(ref)
    .returnType<RefRender>()
    .with({ t: 'local', params: P.array() }, ({ id, params }) => {
      const valueId = `${id}.with(${params.map((x) => renderRef(x).codec).join(', ')})`
      return {
        type: id + `<${params.map((x) => renderRef(x).type).join(', ')}>`,
        codec: valueId,
        valueId,
      }
    })
    .with({ t: 'local' }, ({ id, lazy }) => {
      const codec = renderGetCodec(id)
      return {
        type: id,
        codec: lazy ? `lib.lazyCodec(() => ${codec})` : codec,
        valueId: lazy ? undefined : id,
      }
    })
    .with(
      { t: P.union('lib', 'lib-any') },
      ({ id, params }) => {
        if (params?.length) {
          const typeGenerics = `<${params.map((x) => renderRef(x).type).join(', ')}>`
          const valueId = `lib.${id}.with(${params.map((x) => renderRef(x).codec).join(', ')})`

          return {
            type: `lib.${id}${typeGenerics}`,
            codec: valueId,
          }
        }
        return {
          type: `lib.${id}`,
          codec: renderGetCodec(`lib.${id}`),
          valueId: `lib.${id}`,
        }
      },
    )
    .with({ t: 'lib-array' }, () => {
      throw new Error('This type of reference exists on pre-render stage only, really')
    })
    .with({ t: 'lib-b-tree-set-with-cmp' }, ({ compareFn, type }) => {
      return {
        type: `lib.BTreeSet<${renderRef(type).type}>`,
        codec: `lib.BTreeSet.withCmp(${renderRef(type).codec}, ${compareFn})`,
      }
    })
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
    .with({ t: 'result' }, () => unreachable('results must always be unwrapped in aliases'))
    .exhaustive()
}

function renderBaseEnumCodec(variants: EmitEnumVariant[]): string {
  const types = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag }) => `${tag}: []`)
      .otherwise(({ tag, type }) => `${tag}: [${renderRef(type).type}]`)
  )
  const options = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag, discriminant }) => `${tag}: [${discriminant}]`)
      .otherwise(({ tag, discriminant, type }) => `${tag}: [${discriminant}, ${renderRef(type).codec}]`)
  )
  return `lib.enumCodec<{ ${types.join(', ')} }>({ ${options.join(', ')} })`
}

function renderSumTypes(variants: EmitEnumVariant[]) {
  const mapped = variants.map((variant) =>
    match(variant)
      .with({ type: { t: 'null' } }, ({ tag }) => `lib.VariantUnit<'${tag}'>`)
      .otherwise(({ tag, type }) => `lib.Variant<'${tag}', ${renderRef(type).type}>`)
  )

  return mapped.join(' | ')
}

export function renderShortcutsTree(root: EnumShortcutsTree, kind: 'type' | 'value'): string {
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
    const items = tree.variants
      .map((variant): string => {
        const state = nextState(stateIn, tree, variant)

        const { type, value } = match(variant)
          .returnType<{ type: string; value: string }>()
          .with({ t: 'unit' }, (variant) =>
            match(state)
              .with(
                { chain: [] },
                ({ head }) => ({
                  value: `${variant.name}: Object.freeze({ kind: '${head.var0}' })`,
                  type: `${variant.name}: ` + genConcreteType(state, variant),
                }),
              )
              .otherwise(
                ({ head, chain }) => ({
                  value: `${variant.name}: Object.freeze<${
                    genConcreteType(state, variant)
                  }>({ kind: '${head.var0}', value: ${
                    genChain(
                      chain,
                    )
                  } })`,
                  type: `${variant.name}: ` + genConcreteType(state, variant),
                }),
              ))
          .with({ t: 'value' }, (variant) => {
            const valueFnBody = match(state)
              .with({ chain: [] }, ({ head }) => `({ kind: '${head.var0}', value })`)
              .otherwise(({ head, chain }) => `({ kind: '${head.var0}', value: ${genChain(chain)}(value) })`)

            const valueTy = renderRef(variant.value_ty).type
            const returnTy = genConcreteType(
              state,
              variant,
            )

            const type = `${variant.name}: <const T extends ${valueTy}>(value: T) => ${returnTy}`
            const value = `${variant.name}: <const T extends ${valueTy}>(value: T): ${returnTy} => ${valueFnBody}`

            return { type, value }
          })
          .with({ t: 'enum' }, ({ tree }) => {
            const nested = iter(tree, state)
            const type = `${variant.name}: ${nested}`
            return {
              type,
              value: type,
            }
          })
          .exhaustive()

        return kind === 'type' ? type : value
      })

    return `{ ${items.join(', ')} }`
  }

  return iter(root)
}

function renderJsDoc(lines: string[]): string {
  return `/**\n` + lines.map((x) => ` * ${x}\n`).join('') + ` */`
}

function renderEmit(id: string, map: EmitsMap): string {
  const emit = map.get(id)
  assert(emit)
  return match(emit)
    .returnType<string[]>()
    .with({ t: 'enum', variants: [] }, () => [
      renderJsDoc([
        `This type could not be constructed.`,
        ``,
        `It is a enumeration without any variants that could be created _at this time_. However,`,
        `in future it is possible that this type will be extended with actual constructable variants.`,
      ]),
      `export type ${id} = never`,
      renderJsDoc([
        `Codec for {@link ${id}}. `,
        ``,
        `Since the type is \`never\`, this codec does nothing and throws an error if actually called.`,
      ]),
      `export const ${id}: lib.CodecContainer<never> = lib.defineCodec(lib.neverCodec)`,
    ])
    .with({ t: 'enum' }, ({ variants }) => {
      const tree = { id, variants: enumShortcuts(variants, map) }
      const shortcutsValue = renderShortcutsTree(tree, 'value')
      const shortcutsType = renderShortcutsTree(tree, 'type')

      const codec = renderBaseEnumCodec(variants) + `.discriminated()`

      const explicitType = `lib.CodecContainer<${id}> & ${shortcutsType}`

      return [
        renderJsDoc([
          `Enumeration (discriminated union). Represented as one of the following variants:`,
          ``,
          ...variants.map((x) => `- \`${x.tag}\``),
          '',
          `TODO how to construct, how to use`,
        ]),
        `export type ${id} = ${renderSumTypes(variants)}`,
        renderJsDoc([`Codec and constructors for enumeration {@link ${id}}.`]),
        `export const ${id}: ${explicitType} = { ...${shortcutsValue}, ...lib.defineCodec(${codec}) }`,
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
      const codecFieldsMap = '{' + fields.map((x) => `${camelCase(x.name)}: ${renderRef(x.type).codec}`).join(', ') +
        '}'
      const codec = (codecTy: string) => `lib.structCodec<${codecTy}>(${codecFieldsOrder}, ${codecFieldsMap})`

      if (maxGenericsIndex >= 0) {
        const generics = Array.from({ length: maxGenericsIndex + 1 }, (_v, i) => renderRef({ t: 'param', index: i }))

        const genericTypes = generics.map((x) => x.type).join(', ')
        const withArgs = generics.map((x) => `${x.codec}: lib.GenCodec<${x.type}>`).join(', ')
        const withRet = codec(`${id}<${genericTypes}>`)

        return [
          renderJsDoc([`Structure with named fields and generic parameters.`]),
          `export interface ${id}<${genericTypes}> { ${typeFields} }`,
          renderJsDoc([`Codec constructor for the structure with generic parameters.`]),
          `export const ${id} = { ` + renderJsDoc([`Create a codec with the actual codecs for generic parameters.`]),
          `with: <${genericTypes}>(${withArgs}): lib.GenCodec<${id}<${genericTypes}>> => ${withRet} }`,
        ]
      } else {
        return [
          renderJsDoc([`Structure with named fields.`]),
          `export interface ${id} { ${typeFields} }`,
          renderJsDoc([`Codec of the structure.`]),
          `export const ${id}: lib.CodecContainer<${id}> = lib.defineCodec(${codec(id)})`,
        ]
      }
    })
    .with({ t: 'tuple' }, ({ elements }) => {
      const typeElements = elements.map((x) => renderRef(x).type)
      const codecElements = elements.map((x) => renderRef(x).codec)
      const codec = `lib.tupleCodec([${codecElements.join(', ')}])`
      return [
        `export type ${id} = [${typeElements.join(', ')}]`,
        `export const ${id}: lib.CodecContainer<${id}> = lib.defineCodec(${codec})`,
      ]
    })
    .with({ t: 'bitmap' }, ({ masks, repr }) => {
      assert(repr === 'U32')

      const typeLiterals = masks.map((x) => `'${x.name}'`)
      const codecMasks = masks.map(({ name, mask }) => `${name}: ${mask}`)
      const codec = `lib.bitmapCodec<${id} extends Set<infer T> ? T : never>({ ${codecMasks.join(', ')} })`

      return [
        `export type ${id} = Set<${typeLiterals.join(' | ')}>`,
        `export const ${id}: lib.CodecContainer<${id}> = lib.defineCodec(${codec})`,
      ]
    })
    .with({ t: 'alias' }, ({ to }) => {
      const rendered = renderRef(to)
      const value = rendered.valueId ?? `lib.defineCodec(${rendered.codec})`
      const explicitType = rendered.valueId ? `` : `: lib.CodecContainer<${id}>`
      return [`export type ${id} = ${rendered.type}`, `export const ${id}${explicitType} = ${value}`]
    })
    .exhaustive()
    .join('\n')
}

function upcase<S extends string>(s: S): Uppercase<S> {
  return s.toUpperCase() as Uppercase<S>
}

function takeSelectorTypeName(selector: string): string | null {
  const SELECTOR_SUFFIX = 'ProjectionSelector'
  if (!selector.endsWith(SELECTOR_SUFFIX)) return null
  return selector.slice(0, -SELECTOR_SUFFIX.length)
}

/**
 * _Most_ of the selectors match directly with the variant in `QueryOutputBatchBox`.
 * For example, `AccountProjectionSelector` (selector = `Account`) matches directly with
 * `QueryOutputBatchBox::Account` (variant = `Account`).
 *
 * However, there are some mismatches, e.g. `PeerId` selector will in fact return `Peer`.
 *
 * This function resolves these exceptions
 */
function resolveSelectorAtomOutputBoxTag(selector: string) {
  return match(selector)
    .returnType<string>()
    .with('PeerId', () => 'Peer')
    .with('SignedBlock', () => 'Block')
    .with('TransactionError', () => 'TransactionRejectionReason')
    .otherwise(() => selector)
}

type PredicateTreeEntry = {
  t: 'nested'
  nested: PredicateTree
} | {
  t: 'fn'
  args: { name: string; type: TypeRef }[]
  out: { t: 'nested'; tree: PredicateTree } | { t: 'final'; ref: TypeRef }
}

type PredicateTree = Map<string, PredicateTreeEntry>

function buildPredicateTree(emits: EmitsMap, id: string, start: string = id): PredicateTree {
  const emit = emits.get(id)
  assert(emit?.t === 'enum', `${id} is not a enum?`)

  function* expandFinal(atom: TypeRef): Generator<[string, PredicateTreeEntry]> {
    assert(atom.t === 'local')
    const emit = emits.get(atom.id)
    assert(emit?.t === 'enum')
    for (const i of emit.variants) {
      const tagCamel = camelCase(i.tag)
      const args = i.type.t === 'null' ? [] : [{ name: 'value', type: localRefToLibRef(i.type) }]
      yield [tagCamel, { t: 'fn', args, out: { t: 'final', ref: { t: 'lib-any', id: start } } }]
    }
  }

  function* mapVariants(): Generator<[string, PredicateTreeEntry]> {
    assert(emit?.t === 'enum')
    if (!emit.variants.length) return
    const [atom, ...delegates] = emit.variants
    assert(atom.tag === 'Atom')
    yield* expandFinal(atom.type)
    for (const { tag, type } of delegates) {
      const tagCamel = camelCase(tag)
      assert(type.t === 'local')
      if (type.id.startsWith('MetadataKeyProjection')) {
        const emit = emits.get(type.id)
        assert(emit?.t === 'struct')
        const [key, projection] = emit.fields
        assert(projection?.type?.t === 'local')
        const tree = buildPredicateTree(emits, projection.type.id, start)
        yield [tagCamel, { t: 'fn', args: [key], out: { t: 'nested', tree } }]
        return
      }

      yield [tagCamel, { t: 'nested', nested: buildPredicateTree(emits, type.id, start) }]
    }
  }

  return new Map(mapVariants())
}

type BuildTreeAcc = { root: string; tags: string[] }

const BuildTreeAcc = {
  create: (root: string): BuildTreeAcc => {
    const ty = takeSelectorTypeName(root)
    assert(ty)
    return { root: ty, tags: [] }
  },
  push: (acc: BuildTreeAcc, tag: string): BuildTreeAcc => {
    return { ...acc, tags: [...acc.tags, tag] }
  },
  selectorId: (acc: BuildTreeAcc): string => {
    const chain = [acc.root, ...acc.tags]
    return chain.map((x) => toKebabCase(x)).join('-')
  },
}

type SelectorTreeChild = { t: 'plain'; field: string; tree: SelectorTree } | {
  t: 'fn'
  field: string
  args: { name: string; type: TypeRef }[]
  tree: SelectorTree
}

type SelectorTree = { id: string; output: TypeRef; children: SelectorTreeChild[] }

function localRefToLibRef(ref: TypeRef): TypeRef {
  function mapParams(params?: TypeRef[]) {
    return (params ?? []).map((x) => localRefToLibRef(x))
  }

  if (ref.t === 'local') return { ...ref, t: 'lib-any', params: mapParams(ref.params) }
  if (ref.t === 'lib') return { ...ref, params: mapParams(ref.params) }
  // cover more if needed
  return ref
}

function buildSelectorTree(emits: EmitsMap, id: string, acc: BuildTreeAcc): SelectorTree {
  const emit = emits.get(id)

  return match(emit)
    .with({ t: 'enum' }, ({ variants }): SelectorTree => {
      assertObjectMatch(variants[0], { tag: 'Atom', type: { t: 'null' } })
      const children = variants.slice(1).map(({ tag, type }): SelectorTreeChild => {
        const tagCamel = camelCase(tag)
        assert(type.t === 'local')

        if (type.id.startsWith('MetadataKeyProjection')) {
          const emit = emits.get(type.id)
          assert(emit?.t === 'struct')
          const [key, projection] = emit.fields
          assert(projection?.type?.t === 'local')
          const tree = buildSelectorTree(emits, projection.type.id, BuildTreeAcc.push(acc, 'key'))
          return { t: 'fn', field: tagCamel, args: [key], tree }
        }

        return { t: 'plain', field: tagCamel, tree: buildSelectorTree(emits, type.id, BuildTreeAcc.push(acc, tag)) }
      })
      const selectorType = takeSelectorTypeName(id)
      assert(selectorType)

      const outputTag = resolveSelectorAtomOutputBoxTag(selectorType)
      const outputBox = emits.get('QueryOutputBatchBox')
      assert(outputBox?.t === 'enum')
      const outputVar = outputBox.variants.find((x) => x.tag === outputTag)
      assert(outputVar)
      const outputVec = outputVar.type
      assert(outputVec.t === 'lib' && outputVec?.params)
      const output = localRefToLibRef(outputVec.params[0])

      return {
        id: BuildTreeAcc.selectorId(acc),
        output,
        children,
      }
    })
    .otherwise((other) => {
      fail(`Could not match ${id}: ${Deno.inspect(other)}`)
    })
}

function collectSelectorTreeIds(tree: SelectorTree): Set<string> {
  function* visit(tree: SelectorTree): Generator<string> {
    yield tree.id
    for (const i of tree.children) {
      yield* visit(i.tree)
    }
  }

  return new Set(visit(tree))
}

function collectSelectorOutputs(tree: SelectorTree): Map<string, TypeRef> {
  function* visit(tree: SelectorTree): Generator<[id: string, output: TypeRef]> {
    yield [tree.id, tree.output]
    for (const i of tree.children) {
      yield* visit(i.tree)
    }
  }

  return new Map(visit(tree))
}

function renderSelectorTree(tree: SelectorTree, indent: string): string {
  const children = tree.children.map((child) => {
    if (child.t === 'plain') return `${indent}  ${child.field}: ${renderSelectorTree(child.tree, indent + '  ')}\n`
    const args = child.args.map((x) => `${x.name}: ${renderRef(x.type).type}`).join(', ')
    return `${indent}  ${child.field}(${args}): ${renderSelectorTree(child.tree, indent + '  ')}\n`
  }).join('')

  return `{\n${indent}  __selector: '${tree.id}',\n${children}${indent}}`
}

function renderPredicateTree(tree: PredicateTree, indent: string): string {
  if (!tree.size) return 'never'

  function* iter() {
    for (const [id, entry] of tree) {
      if (entry.t === 'nested') {
        yield `${id}: ${renderPredicateTree(entry.nested, indent + '  ')}`
      } else {
        const output = entry.out.t === 'nested'
          ? renderPredicateTree(entry.out.tree, indent + '  ')
          : renderRef(entry.out.ref).type
        const args = entry.args.map((x) => `${x.name}: ${renderRef(x.type).type}`).join(', ')
        yield `${id}: (${args}) => ${output}`
      }
    }
  }

  const items = [...iter()].map((x) => `${indent}  ${x}`).join('\n')
  return `{\n${items}\n${indent}}`
}

export function generatePrototypes(resolver: Resolver, lib: string) {
  const box = resolver.emits.get('QueryBox')
  assert(box && box.t === 'enum')

  const projections = box.variants.reduce(
    (acc, variant) => {
      const query = variant.tag
      assert(variant.type.t === 'local' && variant.type.id === 'QueryWithFilter' && variant.type.params)
      const [_payload, compound, selectorTuple] = variant.type.params
      assert(compound.t === 'lib' && compound.id === 'CompoundPredicate' && compound.params?.length === 1)
      const predicate = compound.params[0]
      assert(selectorTuple.t === 'lib' && selectorTuple.id === 'Vec' && selectorTuple.params?.length === 1)
      const selector = selectorTuple.params[0]
      assert(selector.t === 'local' && predicate.t === 'local')

      const selectorTree = buildSelectorTree(resolver.emits, selector.id, BuildTreeAcc.create(selector.id))
      const selectorIds = collectSelectorTreeIds(selectorTree)
      const selectorOutputs = collectSelectorOutputs(selectorTree)

      const predicateTree = buildPredicateTree(resolver.emits, predicate.id)

      acc.push({ query, predicate: predicateTree, selector: selectorTree, selectorIds, selectorOutputs })

      return acc
    },
    [] as {
      query: string
      predicate: PredicateTree
      selector: SelectorTree
      selectorIds: Set<string>
      selectorOutputs: Map<string, TypeRef>
    }[],
  )

  const compatEntries = projections.map((x) => `  ${x.query}: ${[...x.selectorIds].map((y) => `'${y}'`).join(' | ')}`)
    .join('\n')
  const querySelectorCompat = `export type QueryCompatibleSelectors = {\n${compatEntries}\n}`

  const outputEntries = [
    ...projections.flatMap((x) => [...x.selectorOutputs])
      .reduce((acc, [id, output]) => {
        if (acc.has(id)) assertEquals(acc.get(id), output)
        else acc.set(id, output)
        return acc
      }, new Map<string, TypeRef>()),
  ]
    .map(([id, output]) => `  '${id}': ${renderRef(output).type}`)
    .join('\n')
  const querySelectorOutput = `export type SelectorIdToOutput = {\n${outputEntries}\n}`

  const selectorsEntries = projections.map((x) => `  ${x.query}: ${renderSelectorTree(x.selector, '  ')}`).join('\n')
  const selectors = `export type QuerySelectors = {\n${selectorsEntries}\n}`

  const predicatesEntries = projections.map((x) => `  ${x.query}: ${renderPredicateTree(x.predicate, '  ')}`).join('\n')
  const predicates = `export type QueryPredicates = {\n${predicatesEntries}\n}`

  return [
    `import type * as lib from '${lib}'`,
    querySelectorCompat,
    querySelectorOutput,
    selectors,
    predicates,
  ].join('\n\n')
}
