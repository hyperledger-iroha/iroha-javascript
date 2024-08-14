import * as scale from '@scale-codec/core'
import { z } from 'zod'
import { type Codec, EnumCodec, codec, enumCodec, lazyCodec } from '../core'
import type { JsonValue } from 'type-fest'
import { parseHex } from '../util'

export type U8 = z.infer<typeof U8$schema>

export const U8 = (int: z.input<typeof U8$schema>) => U8$schema.parse(int)

export const U8$schema = z
  .number()
  .min(0)
  .max(2 ** 8)
  .brand('U8')

export const U8$codec: Codec<U8> = codec(scale.encodeU8 as scale.Encode<U8>, scale.decodeU8 as scale.Decode<U8>)

export type U16 = z.infer<typeof U16$schema>

export const U16 = (int: z.input<typeof U16$schema>) => U16$schema.parse(int)

export const U16$schema = z
  .number()
  .min(0)
  .max(2 ** 16)
  .brand('U16')

export const U16$codec: Codec<U16> = codec(scale.encodeU16 as scale.Encode<U16>, scale.decodeU16 as scale.Decode<U16>)

export type U32 = z.infer<typeof U32$schema>

export const U32 = (int: z.input<typeof U32$schema>) => U32$schema.parse(int)

export const U32$schema = z
  .number()
  .min(0)
  .max(2 ** 32)
  .brand('U32')

export const U32$codec: Codec<U32> = codec(scale.encodeU32 as scale.Encode<U32>, scale.decodeU32 as scale.Decode<U32>)

export type U64 = z.infer<typeof U64$schema>

export const U64 = (int: z.input<typeof U64$schema>) => U64$schema.parse(int)

export const U64$schema = z
  .bigint()
  .or(z.number().pipe(z.coerce.bigint()))
  .pipe(
    z
      .bigint()
      .min(0n)
      .max(2n ** 64n),
  )
  .brand('U64')

export const U64$codec: Codec<U64> = codec(scale.encodeU64 as scale.Encode<U64>, scale.decodeU64 as scale.Decode<U64>)

export type U128 = z.infer<typeof U128$schema>

export const U128 = (int: z.input<typeof U128$schema>) => U128$schema.parse(int)

export const U128$schema = z
  .bigint()
  .or(z.number().pipe(z.coerce.bigint()))
  .pipe(
    z
      .bigint()
      .min(0n)
      .max(2n ** 128n),
  )
  .brand('U128')

export const U128$codec: Codec<U128> = codec(
  scale.encodeU128 as scale.Encode<U128>,
  scale.decodeU128 as scale.Decode<U128>,
)

export const hex$schema = z.string().transform((hex) => Uint8Array.from(parseHex(hex)))

export type BytesVec = Uint8Array

export const BytesVec = (input: z.input<typeof BytesVec$schema>): BytesVec => BytesVec$schema.parse(input)

export const BytesVec$schema = z.instanceof(Uint8Array).or(hex$schema)

export const BytesVec$codec: Codec<BytesVec> = codec(scale.encodeUint8Vec, scale.decodeUint8Vec)

export type Bool = boolean

export const Bool$codec = codec(scale.encodeBool, scale.decodeBool)

export type String = string

export const String$codec: Codec<string> = codec(scale.encodeStr, scale.decodeStr)

export type Compact = z.infer<typeof Compact$schema>

export const Compact = (input: z.input<typeof Compact$schema>): Compact => Compact$schema.parse(input)

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

export type Option<T> = null | { Some: T }

export const Option$schema = <T extends z.ZodType>(some: T) =>
  z
    .null()
    .or(z.object({ Some: some }))
    .default(null)

export const Option$codec = <T>(some: Codec<T>): Codec<Option<T>> => {
  return new EnumCodec(scale.createOptionEncoder(some.rawEncode), scale.createOptionDecoder(some.rawDecode)).wrap(
    (value) => (value ? scale.variant('Some', value.Some) : scale.variant('None')),
    (value) => (value.tag === 'None' ? null : { Some: value.content }),
  )
}

export type Map<K, V> = globalThis.Map<K, V>

export const Map$schema = <K extends z.ZodType, V extends z.ZodType>(key: K, value: V) =>
  z.map(key, value).default(new globalThis.Map())

export const Map$codec = <K, V>(key: Codec<K>, value: Codec<V>): Codec<Map<K, V>> =>
  codec(scale.createMapEncoder(key.rawEncode, value.rawEncode), scale.createMapDecoder(key.rawDecode, value.rawDecode))

export type Vec<T> = globalThis.Array<T>

export const Vec$schema = <T extends z.ZodType>(item: T) => z.array(item).default(() => [])

export const Vec$codec = <T>(item: Codec<T>): Codec<T[]> =>
  codec(scale.createVecEncoder(item.rawEncode), scale.createVecDecoder(item.rawDecode))

export type U8Array<_T extends number> = globalThis.Uint8Array

export const U8Array$schema = (length: number) =>
  z
    .instanceof(Uint8Array)
    .refine((arr) => arr.length === length, { message: `Uint8Array length should be exactly ${length}` })

export const U8Array$codec = (length: number) =>
  codec(scale.createUint8ArrayEncoder(length), scale.createUint8ArrayDecoder(length))

// TODO docs parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> {
  public static fromValue<T extends JsonValue>(value: T): Json<T> {
    return new Json({ some: value }, null)
  }

  public static fromJsonString<T extends JsonValue = JsonValue>(value: string): Json<T> {
    if (!value) throw new Error('JSON string cannot be empty')
    return new Json(null, value)
  }

  private _value: null | { some: T }
  private _str: null | string

  public constructor(asValue: null | { some: T }, asString: string | null) {
    this._value = asValue
    this._str = asString
  }

  public asValue(): T {
    if (!this._value) {
      this._value = { some: JSON.parse(this._str!) }
    }
    return this._value.some
  }

  public asJsonString(): string {
    if (typeof this._str !== 'string') {
      this._str = JSON.stringify(this._value!.some)
    }
    return this._str
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

export const Json$codec: Codec<Json> = String$codec.wrap(
  (json) => json.asJsonString(),
  (str) => Json.fromJsonString(str),
)

export class Timestamp {
  public static fromDate(value: Date): Timestamp {
    return new Timestamp(U64(value.getTime()))
  }

  public static fromMilliseconds(value: U64): Timestamp {
    return new Timestamp(value)
  }

  private _ms: U64

  public constructor(milliseconds: U64) {
    this._ms = milliseconds
  }

  public asDate(): Date {
    // TODO check correct bounds
    return new Date(Number(this._ms))
  }

  public asMilliseconds(): U64 {
    return this._ms
  }
}

export const Timestamp$schema = z
  .instanceof(Timestamp)
  .or(z.date().transform((x) => Timestamp.fromDate(x)))
  .or(U64$schema.transform((x) => Timestamp.fromMilliseconds(x)))

export const Timestamp$codec = U64$codec.wrap<Timestamp>(
  (value) => value.asMilliseconds(),
  (value) => Timestamp.fromMilliseconds(value),
)

export { Timestamp as TimestampU128 }

export type Duration = z.infer<typeof Duration$schema>

export const Duration = (input: z.input<typeof Duration$schema>): Duration => Duration$schema.parse(input)

export const Duration$schema = U64$schema.brand('DurationMilliseconds')

export const Duration$codec = U64$codec.wrap<Duration>(
  (x) => x,
  (x) => Duration(x),
)

export type Name = z.infer<typeof Name$schema>
export const Name = (input: z.input<typeof Name$schema>): Name => Name$schema.parse(input)
export const Name$schema = z
  .string()
  .brand<'Name'>()
  .superRefine((value, ctx) => {
    if (!value.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'empty name is not allowed' })
    if (/[\s#@]/.test(value))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'name should not contain whitespace characters, ' +
          '`@` (reserved for `account@domain` constructs), ' +
          'and `#` (reserved for `asset#domain` constructs)',
      })
  })
export const Name$codec = String$codec as Codec<Name>

export type CompoundPredicate<Atom> =
  | { t: 'Atom'; value: Atom }
  | { t: 'Not'; value: CompoundPredicate<Atom> }
  | { t: 'And' | 'Or'; value: CompoundPredicate<Atom>[] }

export type CompoundPredicate$input<Atom> =
  | { t: 'Atom'; value: Atom }
  | { t: 'Not'; value: CompoundPredicate<Atom> }
  | { t: 'And' | 'Or'; value: CompoundPredicate<Atom>[] }

export const CompoundPredicate$schema = <Atom extends z.ZodType>(
  atom: Atom,
): z.ZodType<CompoundPredicate<z.output<Atom>>, z.ZodTypeDef, CompoundPredicate$input<z.input<Atom>>> => {
  return z.discriminatedUnion('t', [
    z.object({ t: z.literal('Atom'), value: atom }),
    z.object({ t: z.literal('Not'), value: z.lazy(() => CompoundPredicate$schema(atom)) }),
    z.object({ t: z.literal('And'), value: z.array(z.lazy(() => CompoundPredicate$schema(atom))) }),
    z.object({ t: z.literal('Or'), value: z.array(z.lazy(() => CompoundPredicate$schema(atom))) }),
  ]) as any
}

export const CompoundPredicate$codec = <Atom>(atom: Codec<Atom>): Codec<CompoundPredicate<Atom>> => {
  const self: Codec<CompoundPredicate<Atom>> = enumCodec<{
    Atom: [Atom]
    Not: [CompoundPredicate<Atom>]
    And: [CompoundPredicate<Atom>[]]
    Or: [CompoundPredicate<Atom>[]]
  }>([
    [0, 'Atom', atom],
    [1, 'Not', lazyCodec(() => self)],
    [2, 'And', Vec$codec(lazyCodec(() => self))],
    [3, 'Or', Vec$codec(lazyCodec(() => self))],
  ]).discriminated()

  return self
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

  return reprCodec.wrap(toMask, fromMask)
}
