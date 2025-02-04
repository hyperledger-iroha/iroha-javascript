/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable max-nested-callbacks */
import type { EnumDefinition, NamedStructDefinition, Schema, SchemaTypeDefinition } from '@iroha2/data-model-schema'
import { camelCase } from 'change-case'
import { deepEqual } from 'fast-equals'
import invariant from 'tiny-invariant'
import { P, match } from 'ts-pattern'

// TODO: return HashOf<..> ? Hard. Requires all hashable items to implement Hash on instances => why not all make all types as classes, finally...

export function generateDataModel(resolver: Resolver, libModule: string): string {
  const { emits } = resolver

  const arranged = arrangeEmits(emits)

  return [
    `import * as lib from '${libModule}'`,
    ...arranged.map((id) => renderEmit(id, emits)),
    ...generateQueryMaps(emits),
  ].join('\n\n')
}

function unreachable(message: string): never {
  throw new Error(`unreachable invariant: ${message}`)
}

export function generateClientFindAPI(resolver: Resolver, libClient: string): string {
  const queryBox = resolver.emits.get('QueryBox')
  invariant(queryBox && queryBox.t === 'enum')

  const iterableQueryMethods = queryBox.variants.map((x) => {
    const { payload, predicate, selector } = match(x.type)
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

    invariant(x.tag.startsWith('Find'))
    const methodName = camelCase(x.tag.slice('Find'.length))

    const payloadArg = payload ? `payload: dm.${payload}, ` : ''
    const payloadArgValue = payload ? `payload` : `null`

    return (
      `/**\n* Convenience method for \`${x.tag}\` query, a variant of {@link dm.QueryBox} enum.\n` +
      `* - Predicate type: {@link dm.${predicate}}\n` +
      `* - Selector type: {@link dm.${selector}}\n */\n` +
      `  public ${methodName}<const P extends dm.BuildQueryParams<'${x.tag}'>>(${payloadArg}params?: P): ` +
      `client.QueryHandle<dm.GetQueryOutput<'${x.tag}', P>> {` +
      `return client.buildQueryHandle(this._executor, '${x.tag}', ${payloadArgValue}, params) }\n`
    )
  })

  const singularQueryBox = resolver.emits.get('SingularQueryBox')
  invariant(singularQueryBox && singularQueryBox.t === 'enum')

  const singularQueryMethods = singularQueryBox.variants.map((x) => {
    invariant(x.tag.startsWith('Find'))
    const methodName = camelCase(x.tag.slice('Find'.length))

    // const predicateType =

    return (
      `\n/** Convenience method for \`${x.tag}\` query, a variant of {@link dm.SingularQueryBox} enum. */` +
      `  public ${methodName}(): Promise<dm.GetSingularQueryOutput<'${x.tag}'>> {` +
      `return client.executeSingularQuery(this._executor, '${x.tag}') }`
    )
  })

  return [
    `import * as client from '${libClient}'`,
    `import type * as dm from '@iroha2/data-model'`,
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
  | { t: 'lib-array'; len: number; type: TypeRef }
  | { t: 'lib-b-tree-set-with-cmp'; type: TypeRef; compareFn: string }
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
  | 'Name'
  | 'CompoundPredicate'
  | 'DomainId'
  | `AccountId`
  | `AssetDefinitionId`
  | `AssetId`
  | 'Algorithm'
  | 'SignatureRepr'
  | 'HashRepr'
  | 'PublicKeyRepr'

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
          invariant(
            deepEqual(newEmit, prevEmit),
            () => `Generic type emit differs for: ${resolved.id} (original id: ${originId})`,
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
    const [ref, refStr] =
      typeof refOrStr === 'string' ? [SchemaId.parse(refOrStr), refOrStr] : [refOrStr, refOrStr.toStr()]

    if (!this.#resolved.has(refStr)) {
      invariant(refStr in this.#schema, () => `Couldn't find schema for '${refStr}'`)
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
            invariant(bindings.refStr === bindings.tyNot)
            invariant(bindings.tyAnd === bindings.tyOr)
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
          () => ({ t: 'lib', id: 'SignatureRepr' }),
        )
        .with({ ref: { id: 'HashOf', items: [P._] }, schema: 'Hash' }, () => ({ t: 'lib', id: 'HashRepr' }))
        .with({ refStr: P.union('Hash', 'PublicKey', 'Signature').select() }, (id) => ({
          t: 'lib',
          id: `${id}Repr`,
        }))

        .with({ refStr: 'FetchSize', schema: { Struct: [{ name: 'fetch_size', type: P.select() }] } }, (type) =>
          this.resolve(type),
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
          invariant(filters.t === 'lib' && filters.id === 'Vec')

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
            invariant(int === int2)
            return {
              t: 'lib',
              id: 'NonZero',
              params: [this.resolve(int)],
            }
          },
        )

        // lightweight aliases
        .with({ ref: { id: P.select('id'), items: [] }, schema: P.string.select('target') }, ({ id, target }) => ({
          t: 'local',
          id,
          emit: (): EmitCode => ({
            t: 'alias',
            to: this.resolve(target),
          }),
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
          .otherwise(() => {
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
        invariant(x.type === 'u64')
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

function findEnum(map: EmitsMap, id: string): null | (EmitCode & { t: 'enum' }) {
  const type = map.get(id)
  invariant(type, 'must be in schema')
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
    .with({ t: 'lib', params: P.array() }, ({ id, params }) => {
      const typeGenerics = `<${params.map((x) => renderRef(x).type).join(', ')}>`
      const valueId = `lib.${id}.with(${params.map((x) => renderRef(x).codec).join(', ')})`

      return {
        type: `lib.${id}${typeGenerics}`,
        codec: valueId,
      }
    })
    .with({ t: 'lib' }, ({ id }) => {
      return {
        type: `lib.${id}`,
        codec: renderGetCodec(`lib.${id}`),
        valueId: `lib.${id}`,
      }
    })
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
  const genVariantFullChain = (state: State) => {
    const items = (function* () {
      yield state.head.id0
      yield state.head.var0
      for (const i of state.chain.slice(1)) yield i
    })()

    return [...items].join('.')
  }
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

        const { code, doc } = match(variant)
          .returnType<{ code: string; doc: string }>()
          .with({ t: 'unit' }, (variant) => ({
            code: match(state)
              .with(
                { chain: [] },
                ({ head }) => `Object.freeze<${genConcreteType(state, variant)}>({ kind: '${head.var0}' })`,
              )
              .otherwise(
                ({ head, chain }) =>
                  `Object.freeze<${genConcreteType(state, variant)}>({ kind: '${head.var0}', value: ${genChain(
                    chain,
                  )} })`,
              ),
            doc: renderJsDoc([`Value of variant \`${genVariantFullChain(state)}\``]),
          }))
          .with({ t: 'value' }, (variant) => ({
            code: match(state)
              .with(
                { chain: [] },
                ({ head }) =>
                  `<const T extends ${renderRef(variant.value_ty).type}>(value: T): ${genConcreteType(
                    state,
                    variant,
                  )} => ({ kind: '${head.var0}', value })`,
              )
              .otherwise(
                ({ head, chain }) =>
                  `<const T extends ${renderRef(variant.value_ty).type}>(value: T): ${genConcreteType(
                    state,
                    variant,
                  )} => ({ kind: '${head.var0}', value: ${genChain(chain)}(value) })`,
              ),
            doc: renderJsDoc([`Constructor of variant \`${genVariantFullChain(state)}\``]),
          }))
          .with({ t: 'enum' }, ({ tree }) => {
            const nested = iter(tree, state)
            return {
              code: `{ ${nested} }`,
              doc: renderJsDoc([`Constructors of nested enumerations under variant \`${genVariantFullChain(state)}\``]),
            }
          })
          .exhaustive()

        return `${doc} ${variant.name}: ${code}`
      })
      .join(', ')
  }

  return iter(root)
}

function renderJsDoc(lines: string[]): string {
  return `/**\n` + lines.map((x) => ` * ${x}\n`).join('') + ` */`
}

function renderEmit(id: string, map: EmitsMap): string {
  const emit = map.get(id)
  invariant(emit)
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
      `export const ${id} = lib.defineCodec(lib.neverCodec)`,
    ])
    .with({ t: 'enum' }, ({ variants }) => {
      const shortcuts = renderShortcutsTree({ id, variants: enumShortcuts(variants, map) })
      invariant(shortcuts, () => `no shortcuts for ${id} meaning this type could not be created and must be "never"`)

      const codec = renderBaseEnumCodec(variants) + `.discriminated()`

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
        `export const ${id} = { ${shortcuts}, ...lib.defineCodec(${codec}) }`,
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
      return [`export type ${id} = [${typeElements.join(', ')}]`, `export const ${id} = lib.defineCodec(${codec})`]
    })
    .with({ t: 'bitmap' }, ({ masks, repr }) => {
      invariant(repr === 'U32')

      const typeLiterals = masks.map((x) => `'${x.name}'`)
      const codecMasks = masks.map(({ name, mask }) => `${name}: ${mask}`)
      const codec = `lib.bitmapCodec<${id} extends Set<infer T> ? T : never>({ ${codecMasks.join(', ')} })`

      return [`export type ${id} = Set<${typeLiterals.join(' | ')}>`, `export const ${id} = lib.defineCodec(${codec})`]
    })
    .with({ t: 'alias' }, ({ to }) => {
      const rendered = renderRef(to)
      const value = rendered.valueId ?? `lib.defineCodec(${rendered.codec})`
      return [`export type ${id} = ${rendered.type}`, `export const ${id} = ${value}`]
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

function buildQuerySelectorMapEntries(emits: EmitsMap): { query: string; selector: string }[] {
  const schema = emits.get('QueryBox')
  invariant(schema && schema.t === 'enum')
  return schema.variants.map((variant) => {
    const selector = match(variant.type)
      .with(
        {
          t: 'local',
          id: 'QueryWithFilter',
          params: [P._, P._, { t: 'lib', id: 'Vec', params: [{ t: 'local', id: P.select() }] }],
        },
        (x) => takeSelectorTypeName(x),
      )
      .otherwise(() => {
        throw new Error('unexpected query box value')
      })

    invariant(selector)

    return {
      query: variant.tag,
      selector,
    }
  })
}

function expectNestedSelector(type: TypeRef) {
  invariant(type.t === 'local')
  const selector = takeSelectorTypeName(type.id)
  invariant(selector)
  if (selector === 'MetadataKey') return 'Json'
  return selector
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

function buildSelectorOutputMapEntries(
  emits: EmitsMap,
): { selector: string; entries: { name: string; value: string }[] }[] {
  return [...emits].reduce(
    (acc, [key, value]) => {
      const selector = takeSelectorTypeName(key)
      if (selector && selector !== 'MetadataKey') {
        invariant(value.t === 'enum', () => `not an enum: ${selector} (selector)`)
        acc.push({
          selector,
          entries: value.variants.map((variant) => ({
            name: variant.tag,
            value:
              variant.tag === 'Atom' ? resolveSelectorAtomOutputBoxTag(selector) : expectNestedSelector(variant.type),
          })),
        })
      }
      return acc
    },
    [] as ReturnType<typeof buildSelectorOutputMapEntries>,
  )
}

/**
 * Properties of the output to test:
 * - all values in query output map point to some key in the selector output map
 * - all `Atom` variants for each selector in selector output map point to some variant of
 *   query output batch box
 */
function generateQueryMaps(emits: EmitsMap): string[] {
  const querySelectorMap = buildQuerySelectorMapEntries(emits)
    .map((x) => `${x.query}: '${x.selector}'`)
    .join('; ')

  const selectorOutputMap = buildSelectorOutputMapEntries(emits)
    .map((x) => {
      const inner = x.entries.map((y) => `${y.name}: '${y.value}'`).join(';')
      return `${x.selector}: {\n${inner} }`
    })
    .join('; ')

  return [
    `export type QuerySelectorMap = { ${querySelectorMap} }`,
    `export type SelectorOutputMap = { ${selectorOutputMap} }`,
  ]
}
