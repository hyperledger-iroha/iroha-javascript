import * as scale from '@scale-codec/core'
import { z } from 'zod'
import { type Codec, codec, enumeration } from './core'
import type { JsonValue } from 'type-fest'

export type U8 = z.infer<typeof U8$schema>

export const U8$schema = z
  .number()
  .min(0)
  .max(2 ** 8)
  .brand('U8')

export const U8$codec: Codec<U8> = codec(scale.encodeU8 as scale.Encode<U8>, scale.decodeU8 as scale.Decode<U8>)

export type U16 = z.infer<typeof U16$schema>

export const U16$schema = z
  .number()
  .min(0)
  .max(2 ** 16)
  .brand('U16')

export const U16$codec: Codec<U16> = codec(scale.encodeU16 as scale.Encode<U16>, scale.decodeU16 as scale.Decode<U16>)

export type U32 = z.infer<typeof U32$schema>

export const U32$schema = z
  .number()
  .min(0)
  .max(2 ** 32)
  .brand('U32')

export const U32$codec: Codec<U32> = codec(scale.encodeU32 as scale.Encode<U32>, scale.decodeU32 as scale.Decode<U32>)

export type U64 = z.infer<typeof U64$schema>

export const U64$schema = z
  .bigint()
  .min(0n)
  .max(2n ** 64n)
  .brand('U64')

export const U64$codec: Codec<U64> = codec(scale.encodeU64 as scale.Encode<U64>, scale.decodeU64 as scale.Decode<U64>)

export type U128 = z.infer<typeof U128$schema>

export const U128$schema = z
  .bigint()
  .min(0n)
  .max(2n ** 128n)
  .brand('U128')

export const U128$codec: Codec<U128> = codec(
  scale.encodeU128 as scale.Encode<U128>,
  scale.decodeU128 as scale.Decode<U128>,
)

export type BytesVec = Uint8Array

export const BytesVec$schema = z.instanceof(Uint8Array)

export const BytesVec$codec = codec(scale.encodeUint8Vec, scale.decodeUint8Vec)

export type Bool = boolean

// export const Bool$schema = z.boolean()

export const Bool$codec = codec(scale.encodeBool, scale.decodeBool)

export type String = string

// export const String$schema = z.string()

export const String$codec: Codec<string> = codec(scale.encodeStr, scale.decodeStr)

export type Compact = z.infer<typeof Compact$schema>

// TODO: specify max?
export const Compact$schema = z.bigint().min(0n).brand('Compact')

export const Compact$codec: Codec<Compact> = codec(
  scale.encodeCompact as scale.Encode<Compact>,
  scale.decodeCompact as scale.Decode<Compact>,
)

export type NonZero<T extends number | bigint> = T & z.BRAND<'NonZero'>

export const NonZero$schema = <T extends z.ZodType<number | bigint>>(int: T) => {
  return int.brand<'NonZero'>()
}

NonZero$schema(U32$schema)
NonZero$schema(U64$schema)

export const NonZero$codec = <T extends number | bigint>(int: Codec<T>): Codec<NonZero<T>> => {
  return int as Codec<NonZero<T>>
}

export type Option<T> = { t: 'None' } | { t: 'Some'; value: T }

export const Option$schema = <T extends z.ZodType>(some: T) => {
  return z
    .discriminatedUnion('t', [z.object({ t: z.literal('None') }), z.object({ t: z.literal('Some'), value: some })])
    .default({ t: 'None' })
}

export const Option$codec = <T>(some: Codec<T>): Codec<Option<T>> => {
  return enumeration([
    [0, 'None'],
    [1, 'Some', some],
  ])
}

export type Map<K, V> = globalThis.Map<K, V>

export const Map$schema = <K extends z.ZodType, V extends z.ZodType>(key: K, value: V) => {
  return z.map(key, value).default(new globalThis.Map())
}

export const Map$codec = <K, V>(key: Codec<K>, value: Codec<V>): Codec<Map<K, V>> => {
  return codec(scale.createMapEncoder(key.encode, value.encode), scale.createMapDecoder(key.decode, value.decode))
}

export type Vec<T> = globalThis.Array<T>

export const Vec$schema = <T extends z.ZodType>(item: T) => z.array(item).default(() => [])

export const Vec$codec = <T>(item: Codec<T>): Codec<T[]> => {
  return codec(scale.createVecEncoder(item.encode), scale.createVecDecoder(item.decode))
}

export type U8Array<_T extends number> = globalThis.Uint8Array

export const U8Array$schema = (length: number) =>
  z
    .instanceof(Uint8Array)
    .refine((arr) => arr.length === length, { message: `Uint8Array length should be exactly ${length}` })

export const U8Array$codec = (length: number) =>
  codec(scale.createUint8ArrayEncoder(length), scale.createUint8ArrayDecoder(length))

export type U16Array<_T extends number> = globalThis.Uint16Array

export const U16Array$schema = (length: number) =>
  z
    .instanceof(Uint16Array)
    .refine((arr) => arr.length === length, { message: `Uint16Array length should be exactly ${length}` })

// FIXME
export const U16Array$codec = (length: number) =>
  codec(scale.createUint8ArrayEncoder(length), scale.createUint8ArrayDecoder(length))

// TODO docs parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> {
  public static fromValue<T extends JsonValue>(value: T): Json<T> {
    return new Json({ some: value }, null)
  }

  public static fromJsonString<T extends JsonValue = JsonValue>(value: string): Json<T> {
    return new Json(null, value)
  }

  #value: null | { some: T }
  #str: null | string

  public constructor(asValue: null | { some: T }, asString: string | null) {
    this.#value = asValue
    this.#str = asString
  }

  public asValue(): T {
    if (!this.#value) {
      this.#value = { some: JSON.parse(this.#str!) }
    }
    return this.#value.some
  }

  public asJsonString(): string {
    if (!this.#str) {
      this.#str = JSON.stringify(this.#value!.some)
    }
    return this.#str
  }

  /**
   * For {@link JSON} integration
   */
  public toJSON(): T {
    return this.asValue()
  }
}

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
)

export const Json$schema = z.instanceof(Json).or(jsonValueSchema.transform((value) => Json.fromValue(value)))

export const Json$codec: Codec<Json> = codec(
  scale.encodeFactory(
    (value, walker) => {
      return scale.encodeStr(value.asJsonString(), walker)
    },
    (value) => {
      return scale.encodeStr.sizeHint(value.asJsonString())
    },
  ),
  (walker) => {
    const str = scale.decodeStr(walker)
    return Json.fromJsonString(str)
  },
)
