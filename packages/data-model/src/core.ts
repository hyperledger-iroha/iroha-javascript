import * as scale from '@scale-codec/core'
import type { JsonValue } from 'type-fest'
import { z } from 'zod'

export interface Codec<T> {
  encode: scale.Encode<T>
  decode: scale.Decode<T>
}

export function codec<T>(encode: scale.Encode<T>, decode: scale.Decode<T>): Codec<T> {
  return { encode, decode }
}

export function lazy<T>(f: () => Codec<T>): Codec<T> {
  return codec(
    scale.encodeFactory(
      (v, w) => f().encode(v, w),
      (v) => f().encode.sizeHint(v),
    ),
    (w) => f().decode(w),
  )
}

export class CodecHighLevel<T extends z.ZodType> {
  public codec: Codec<z.infer<T>>
  public schema: T

  public constructor(schema: T, codec: Codec<z.infer<T>>) {
    this.schema = schema
    this.codec = codec
  }

  public encodeParsed(value: z.output<T>): Uint8Array {
    return scale.WalkerImpl.encode(value, this.codec.encode)
  }

  public encode(value: z.input<T>): Uint8Array {
    return scale.WalkerImpl.encode(value, this.codec.encode)
  }

  public decode(source: ArrayBufferView): z.output<T> {
    const decoded = scale.WalkerImpl.decode(source, this.codec.decode)
    return this.schema.parse(decoded)
  }
}

export type EnumCodecSchema = [discriminant: number, tag: string, codec?: Codec<any>][]

export interface DatamodelZodEnumGeneric {
  t: string
  value?: unknown
}

function toScaleEnum({ t, value }: DatamodelZodEnumGeneric): scale.Enumerate<any> {
  return scale.variant(t, value)
}

function fromScaleEnum({ tag, content }: scale.Enumerate<any>): DatamodelZodEnumGeneric {
  return { t: tag, value: content }
}

export function enumeration<T extends DatamodelZodEnumGeneric>(schema: EnumCodecSchema): Codec<T> {
  const encoders: scale.EnumEncoders<any> = {} as any
  const decoders: scale.EnumDecoders<any> = {}

  for (const [dis, tag, codec] of schema) {
    ;(encoders as any)[tag] = codec
      ? [
          dis,
          scale.encodeFactory<T>(
            (value, walker) => {
              codec.encode(toScaleEnum(value), walker)
            },
            (value) => {
              return codec.encode.sizeHint(toScaleEnum(value))
            },
          ),
        ]
      : dis
    ;(decoders as any)[dis] = codec
      ? [
          tag,
          (walker: scale.Walker) => {
            return fromScaleEnum(codec.decode(walker))
          },
        ]
      : tag
  }

  return codec(scale.createEnumEncoder(encoders), scale.createEnumDecoder(decoders)) as any
}

/**
 * @internal
 */
export type EnumOptionInput<T extends string, Z extends z.ZodType> =
  z.input<Z> extends infer I ? (I extends undefined ? { t: T; value?: I } : { t: T; value: I }) : never

export declare type StructCodecsSchema<T> = {
  [K in keyof T]: [K, Codec<T[K]>]
}[keyof T][]

export function struct<T>(schema: StructCodecsSchema<T>): Codec<T> {
  const encoders: scale.StructEncoders<any> = []
  const decoders: scale.StructDecoders<any> = []

  for (const [field, codec] of schema as [string, Codec<any>][]) {
    encoders.push([field, codec.encode])
    decoders.push([field, codec.decode])
  }

  return codec(scale.createStructEncoder(encoders), scale.createStructDecoder(decoders))
}

export function bitmap<Name extends string>(masks: { [K in Name]: number }): Codec<Set<Name>> {
  const reprCodec = U32$codec
  const reprSchema = U32$schema
  const REPR_MAX = 2 ** 32 - 1

  const toMask = (set: Set<Name>) => {
    let num = 0
    for (const i of set) {
      num |= masks[i]
    }
    return reprSchema.parse(num)
  }

  const masksArray = (Object.entries(masks) as [Name, number][]).map(([k, v]) => ({ key: k, value: v }))
  const fromMask = (bitmask: U32): Set<Name> => {
    const set = new Set<Name>()
    let bitmaskMut: number = bitmask
    for (const mask of masksArray) {
      if ((mask.value & bitmaskMut) !== mask.value) continue
      set.add(mask.key)

      let maskEffectiveBits = 0
      for (let i = mask.value; i > 0; i >>= 1, maskEffectiveBits++);

      const fullNotMask = ((REPR_MAX >> maskEffectiveBits) << maskEffectiveBits) | ~mask.value
      bitmaskMut &= fullNotMask
    }
    if (bitmaskMut !== 0) {
      throw new Error(`Bitmask contains unknown flags: 0b${bitmaskMut.toString(2)}`)
    }
    return set
  }

  return codec(
    scale.encodeFactory(
      (value, walker) => reprCodec.encode(toMask(value), walker),
      (value) => reprCodec.encode.sizeHint(toMask(value)),
    ),
    (walker) => fromMask(reprCodec.decode(walker)),
  )
}

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
    .instanceof(Uint8Array)
    .refine((arr) => arr.length === length, { message: `Uint8Array length should be exactly ${length}` })

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
