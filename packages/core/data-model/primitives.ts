import * as scale from '@scale-codec/core'
import { type CodecContainer, defineCodec, GenCodec, structCodec } from '../codec.ts'
import { type IsZero, type Ord, ordCompare, type OrdKnown } from '../traits.ts'
import { type CompareFn, toSortedSet } from '../util.ts'

export type U8 = number
export const U8: CodecContainer<U8> = defineCodec(
  new GenCodec({ encode: scale.encodeU8, decode: scale.decodeU8 }),
)

export type U16 = number
export const U16: CodecContainer<U16> = defineCodec(
  new GenCodec({ encode: scale.encodeU16, decode: scale.decodeU16 }),
)

export type U32 = number
export const U32: CodecContainer<U32> = defineCodec(
  new GenCodec({ encode: scale.encodeU32, decode: scale.decodeU32 }),
)

export type U64 = bigint
export const U64: CodecContainer<U64> = defineCodec(
  new GenCodec({ encode: scale.encodeU64, decode: scale.decodeU64 }),
)

export type U128 = bigint
export const U128: CodecContainer<U128> = defineCodec(
  new GenCodec({ encode: scale.encodeU128, decode: scale.decodeU128 }),
)

export type BytesVec = Uint8Array
export const BytesVec: CodecContainer<BytesVec> = defineCodec(
  new GenCodec({ encode: scale.encodeUint8Vec, decode: scale.decodeUint8Vec }),
)

export type Bool = boolean
export const Bool: CodecContainer<Bool> = defineCodec(
  new GenCodec({ encode: scale.encodeBool, decode: scale.decodeBool }),
)

export type String = string
export const String: CodecContainer<string> = defineCodec(
  new GenCodec({ encode: scale.encodeStr, decode: scale.decodeStr }),
)

export type Compact = bigint

export const Compact: CodecContainer<bigint> = defineCodec(
  new GenCodec<bigint>({ encode: scale.encodeCompact, decode: scale.decodeCompact }),
)

export class NonZero<T extends number | bigint | IsZero> {
  public static with<T extends number | bigint | IsZero>(codec: GenCodec<T>): GenCodec<NonZero<T>> {
    return codec.wrap<NonZero<T>>({
      toBase: (x) => x.value,
      fromBase: (x) => new NonZero(x),
    })
  }

  private _value: T
  private __brand!: 'non-zero something'

  public constructor(value: T) {
    const isZero = typeof value === 'number' || typeof value === 'bigint' ? value === 0 : value.isZero()
    if (isZero) throw new TypeError(`Zero is passed to the NonZero constructor (${globalThis.String(value)})`)
    this._value = value
  }

  public get value(): T {
    return this._value
  }

  public map<U extends number | bigint | IsZero>(fun: (value: T) => U): NonZero<U> {
    return new NonZero(fun(this.value))
  }

  public toJSON(): T {
    return this.value
  }
}

export type Option<T> = null | T

export const Option = {
  with: <T>(value: GenCodec<T>): GenCodec<Option<T>> =>
    new GenCodec({
      encode: scale.createOptionEncoder(value.raw.encode),
      decode: scale.createOptionDecoder(value.raw.decode),
    }).wrap<Option<T>>({
      fromBase: (base) => (base.tag === 'None' ? null : base.as('Some')),
      toBase: (higher) => (higher === null ? scale.variant('None') : scale.variant('Some', higher)),
    }),
}

export type Vec<T> = globalThis.Array<T>

export const Vec: {
  with<T>(item: GenCodec<T>): GenCodec<Vec<T>>
} = {
  with: <T>(item: GenCodec<T>): GenCodec<Vec<T>> => {
    return new GenCodec({
      encode: scale.createVecEncoder(item.raw.encode),
      decode: scale.createVecDecoder(item.raw.decode),
    })
  },
}

/**
 * "Sorted vector".
 *
 * Represented as a plain array. The codec ensures that the entries are encoded in a deterministic manner,
 * by sorting and deduplicating items.
 */
export type BTreeSet<T> = Vec<T>

/**
 * Codec factories for {@link BTreeSet:type}
 */
export const BTreeSet: {
  with<T extends Ord<T> | string>(type: GenCodec<T>): GenCodec<BTreeSet<T>>
  withCmp<T>(codec: GenCodec<T>, compare: CompareFn<T>): GenCodec<BTreeSet<T>>
} = {
  with<T extends Ord<T> | string>(type: GenCodec<T>): GenCodec<BTreeSet<T>> {
    return BTreeSet.withCmp(type, ordCompare)
  },
  withCmp<T>(codec: GenCodec<T>, compare: CompareFn<T>): GenCodec<BTreeSet<T>> {
    return Vec.with(codec).wrap<BTreeSet<T>>({
      toBase: (x) => toSortedSet(x, compare),
      fromBase: (x) => x,
    })
  },
}

export interface MapEntry<K, V> {
  key: K
  value: V
}

/**
 * "Sorted map".
 *
 * Represented as a plain array. The codec ensures that the entries are encoded in a deterministic manner, by sorting and deduplicating items.
 *
 * Items comparison is based on their keys.
 *
 * @example
 * ```ts
 * import { getCodec } from '../codec.ts'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const map1: BTreeMap<string, number> = [
 *   { key: 'a', value: 5 },
 *   { key: 'c', value: 2 },
 *   { key: 'b', value: 3 }
 * ]
 *
 * const map2: BTreeMap<string, number> = [
 *   { key: 'c', value: 2 },
 *   { key: 'a', value: 2 },
 *   { key: 'a', value: 5 },
 *   { key: 'b', value: 3 }
 * ]
 *
 * const codec = BTreeMap.with(getCodec(String), getCodec(U8))
 *
 * assertEquals(codec.encode(map1), codec.encode(map2))
 * assertEquals(codec.decode(codec.encode(map1)), [
 *   { key: 'a', value: 5 },
 *   { key: 'b', value: 3 },
 *   { key: 'c', value: 2 }
 * ])
 * ```
 */
export type BTreeMap<K, V> = Array<MapEntry<K, V>>

export const BTreeMap = {
  with: <K extends Ord<K> | OrdKnown, V>(key: GenCodec<K>, value: GenCodec<V>): GenCodec<BTreeMap<K, V>> => {
    return BTreeMap.withCmp(key, value, (a, b) => ordCompare(a.key, b.key))
  },
  withCmp: <K, V>(
    key: GenCodec<K>,
    value: GenCodec<V>,
    compareFn: CompareFn<MapEntry<K, V>>,
  ): GenCodec<BTreeMap<K, V>> => {
    const entry = structCodec<MapEntry<K, V>>(['key', 'value'], { key, value })
    return BTreeSet.withCmp(entry, (a, b) => compareFn(a, b))
  },
}
