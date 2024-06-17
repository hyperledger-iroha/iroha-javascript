import * as scale from '@scale-codec/core'
import { EnumCodecSchema, createEnumCodec } from '@scale-codec/definition-runtime'
import { Opaque } from 'type-fest'

const symbolCodec = Symbol('codec')

type Decode<T> = (source: ArrayBufferView) => T
type Encode<T> = (value: T) => Uint8Array

interface CodecContainer<T> {
  [symbolCodec]: Codec<T>
}

interface Codec<T> {
  encode: Encode<T>
  encodeRaw: scale.Encode<T>
  decode: Decode<T>
  decodeRaw: scale.Decode<T>
}

class CodecImpl<T> implements Codec<T> {
  public encodeRaw: scale.Encode<T>
  public decodeRaw: scale.Decode<T>

  public constructor(encodeRaw: scale.Encode<T>, decodeRaw: scale.Decode<T>) {
    this.encodeRaw = encodeRaw
    this.decodeRaw = decodeRaw
  }

  encode(value: T): Uint8Array {
    return scale.WalkerImpl.encode(value, this.encodeRaw)
  }

  decode(source: ArrayBufferView): T {
    return scale.WalkerImpl.decode(source, this.decodeRaw)
  }
}

function codecContainer<T>(codec: Codec<T>): CodecContainer<T> {}

function enumBox<T>(impl: CodecContainer<T>): CodecContainer<{ enum: T }> {}

// function defineEnumBoxCodec<T>(encodeRaw: scale.)

type CodecImplValue<T extends CodecContainer<any>> = T extends CodecContainer<infer U> ? U : never

function toCodec<T>(
  source: T,
): T extends CodecContainer<infer U>
  ? Codec<U>
  : T extends () => CodecContainer<infer U>
  ? Codec<U>
  : T extends () => Codec<infer U>
  ? Codec<U>
  : never {
  if (typeof source === 'function') {
    const result = source()
    if (symbolCodec in result) return result[symbolCodec]
    return result
  }
  return (source as any)[symbolCodec]
}

// function codecOf<T extends CodecContainer<any>, U extends CodecImplValue<T> = CodecImplValue<T>>(
//   container: T | (() => T),
// ): Codec<U> {
//   return container[symbolCodec]
// }

// function codecContainerFromGetter<T extends CodecContainer<any>>(f: () => T): T {}

interface Account {
  id: AccountId
  assets: Map<AssetDefinitionId, Asset>
  metadata: Metadata
}

interface AccountId {
  domain: DomainId
  signatory: PublicKey
}

type PublicKey = string

type DomainId = string

type RoleEventSet = Opaque<number, 'RoleEventSet'>

const RoleEventSet = {
  /** `Created` event bitmask. Use `|` to combine with other {@link RoleEventSet} bitmasks. */
  Created: 1 as RoleEventSet,
  Deleted: 2 as RoleEventSet,
  or(...items: RoleEventSet[]): RoleEventSet {
return 0 as RoleEventSet
  }
  ...codecContainer<RoleEventSet>(scale.encodeU32, scale.decodeU32),
} as const

function eventSetOr<T extends number>(...variants: T[]): T {
  return 0 as T
}

const InstructionBox = {}

type Repeats = scale.Enumerate<{
  Indefinitely: []
  Exactly: [number]
}>

const Repeats = {
  /**
   * `Repeats::Indefinitely` enum variant
   */
  Indefinitely: scale.variant<Repeats>('Indefinitely'),
  Exactly: (value: number): Repeats => scale.variant('Exactly', value),
} as const

type MetadataValueBox = {
  enum: scale.Enumerate<{
    Bool: [boolean]
    String: [string]
    Name: [Name]
    Bytes: [Uint8Array]
    Numeric: [Numeric]
    LimitedMetadata: [LimitedMetadata]
    Vec: [MetadataValueBox[]]
  }>
}

const MetadataValueBox = {
  /**
   * Produce `MetadataValueBox::Bool` variant
   */
  Bool: (value: boolean): MetadataValueBox => ({ enum: scale.variant('Bool', value) }),
  // variants...
  ...enumBox(
    codecContainer<MetadataValueBox['enum']>(
      scale.createEnumEncoder({
        Bool: [0, scale.encodeBool],
        String: [1, scale.encodeStr],
        Name: [2, toCodec(() => Name).encodeRaw],
      }),
      scale.createEnumDecoder({
        0: ['Bool', scale.decodeBool],
      }),
    ),
  ),
} as const

scale.createArrayEncoder()

type Metadata = Map<Name, MetadataValueBox>

const Metadata = {
  ...codecContainer<Metadata>(
    scale.createMapEncoder(toCodec(() => Name).encodeRaw, toCodec(() => MetadataValueBox).encodeRaw),
    scale.createMapDecoder(toCodec(() => Name).decodeRaw, toCodec(() => MetadataValueBox).decodeRaw),
  ),
}

type Name = string

const Name = {
  ...codecContainer<string>(scale.encodeStr, scale.decodeStr),
}

type AssetId = string

const AssetId = {
  ...codecContainer<AssetId>(scale.encodeStr, scale.decodeStr),
}

type MetadataChanged<T> = {
  target: T
  key: Name
  value: MetadataValueBox
}

const MetadataChanged = {
  codecWith: <T>(codec0: Codec<T>): Codec<MetadataChanged<T>> => {
    return structCodec([
      ['target', codec0],
      ['key', toCodec(Name)],
      ['value', toCodec(MetadataValueBox)],
    ])
  },
}

type AssetEvent = scale.Enumerate<{
  MetadataInserted: [MetadataChanged<AssetId>]
}>

const AssetEvent = {
  MetadataInserted: (value: MetadataChanged<AssetId>): AssetEvent => scale.variant('MetadataInserted', value),
  ...codecContainer<AssetEvent>(
    scale.createEnumEncoder({
      MetadataInserted: [0, toCodec(() => MetadataChanged.codecWith(toCodec(() => AssetId))).encodeRaw],
    }),
    scale.createEnumDecoder({}),
  ),
}

function mapCodec<K, V>(key: Codec<K>, value: Codec<V>): Codec<Map<K, V>> {
  return new CodecImpl(
    scale.createMapEncoder(key.encodeRaw, value.encodeRaw),
    scale.createMapDecoder(key.decodeRaw, value.decodeRaw),
  )
}

function structCodec<T>(schema: { [K in keyof T]: [K, Codec<T[K]>] }[keyof T][]): Codec<T> {}

function optionCodec<T>(value: Codec<T>): Codec<scale.RustOption<T>> {
  return new CodecImpl(scale.createOptionEncoder(value.encodeRaw), scale.createOptionDecoder(value.decodeRaw))
}

function enumCodec<T>(schema: EnumCodecSchema): Codec<T> {
schema.map(([dis, tag, codec]) => {
//     if (codec) 
//         return [{ }]
// })

    return new CodecImpl(

    )
}

// const MapCodec = {
//   with: <K, V>(key: Codec<K>, value: Codec<V>): Codec<Map<K, V>> => {
//     return defineCodec(
//       scale.createMapEncoder(key.encodeRaw, value.encodeRaw),
//       scale.createMapDecoder(key.decodeRaw, value.decodeRaw),
//     )[symbolCodec]
//   },
// }

// ---

toCodec(RoleEventSet).encode(RoleEventSet.Created | RoleEventSet.Deleted)

const account: Account = {
  id: { domain: 'wonderland', signatory: 'fasfs' },
  assets: new Map(),
  metadata: new Map(),
}

toCodec(MetadataValueBox).encode(MetadataValueBox.Bool(false))

mapCodec(toCodec(Name), toCodec(Metadata))
