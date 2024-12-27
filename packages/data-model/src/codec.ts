import * as scale from '@scale-codec/core'
import { hexDecode } from './util'
import type { SumTypeKind, SumTypeKindValue } from './util'

export interface RawScaleCodec<T> {
  encode: scale.Encode<T>
  decode: scale.Decode<T>
}

/**
 * Symbol used {@link CodecProvider}
 */
export const CodecSymbol = Symbol('codec')

/**
 * Marks an object that provides a codec over some data type.
 *
 * Use {@link codecOf} to get the codec from the provider.
 */
export interface CodecProvider<T> {
  [CodecSymbol]: Codec<T>
}

/**
 * Get underlying {@link Codec} from the {@link CodecProvider}
 */
export function codecOf<T>(provider: CodecProvider<T>): Codec<T> {
  return provider[CodecSymbol]
}

/**
 * Generic codec.
 *
 * Unlike {@link RawScaleCodec}, provides higher-level encode/decode functions, as well as some composition utilities.
 */
export class Codec<T> {
  /**
   * Create a lazy codec, by only having a getter to the actual codec.
   *
   * The getter is called for each codec access and is not cached.
   */
  public static lazy<T>(f: () => Codec<T>): Codec<T> {
    return new Codec({
      encode: scale.encodeFactory(
        (v, w) => f().raw.encode(v, w),
        (v) => f().raw.encode.sizeHint(v),
      ),
      decode: (w) => f().raw.decode(w),
    })
  }

  /**
   * Access lower-level SCALE codec
   */
  public readonly raw: RawScaleCodec<T>

  public constructor(raw: RawScaleCodec<T>) {
    this.raw = raw
  }

  public encode(value: T): Uint8Array {
    return scale.WalkerImpl.encode(value, this.raw.encode)
  }

  public decode(data: string | ArrayBufferView): T {
    const parsed = ArrayBuffer.isView(data) ? data : Uint8Array.from(hexDecode(data))
    return scale.WalkerImpl.decode(parsed, this.raw.decode)
  }

  public wrap<U>({ toBase, fromBase }: { toBase: (value: U) => T; fromBase: (value: T) => U }): Codec<U> {
    return new Codec({
      encode: scale.encodeFactory(
        (v, w) => this.raw.encode(toBase(v), w),
        (v) => this.raw.encode.sizeHint(toBase(v)),
      ),
      decode: (w) => fromBase(this.raw.decode(w)),
    })
  }
}

export class EnumCodec<E extends scale.EnumRecord> extends Codec<scale.Enumerate<E>> {
  public discriminated<
    T extends {
      [Tag in keyof E]: E[Tag] extends []
        ? SumTypeKind<Tag>
        : E[Tag] extends [infer Value]
          ? SumTypeKindValue<Tag, Value>
          : never
    }[keyof E],
  >(): Codec<T> {
    return this.wrap<{ t: string; value?: any }>({
      toBase: (value) => {
        if (value.value !== undefined) return scale.variant<any>(value.t, value.value)
        return scale.variant<any>(value.t)
      },
      fromBase: (value) => ({ t: value.tag, value: value.content }),
    }) as any
  }

  public literalUnion(): {
    [Tag in keyof E]: E[Tag] extends [] ? Codec<Tag> : never
  }[keyof E] {
    return this.wrap<string>({
      toBase: (literal) => scale.variant<any>(literal),
      fromBase: (variant) => variant.tag,
    }) as any
  }
}

export function lazyCodec<T>(f: () => Codec<T>): Codec<T> {
  return Codec.lazy(f)
}

export type EnumCodecSchema = [discriminant: number, tag: string, codec?: Codec<any>][]

export function enumCodec<E extends scale.EnumRecord>(schema: EnumCodecSchema): EnumCodec<E> {
  const encoders: scale.EnumEncoders<any> = {} as any
  const decoders: scale.EnumDecoders<any> = {}

  for (const [dis, tag, codec] of schema) {
    ;(encoders as any)[tag] = codec ? [dis, codec.rawEncode] : dis
    ;(decoders as any)[dis] = codec ? [tag, codec.rawDecode] : tag
  }

  return new EnumCodec(scale.createEnumEncoder<any>(encoders), scale.createEnumDecoder<any>(decoders))
}

type TupleFromCodecs<T> = T extends [Codec<infer Head>, ...infer Tail]
  ? [Head, ...TupleFromCodecs<Tail>]
  : T extends []
    ? []
    : never

export function tupleCodec<T extends [Codec<any>, ...Codec<any>[]]>(codecs: T): Codec<TupleFromCodecs<T>> {
  return codec(
    scale.createTupleEncoder(codecs.map((x) => x.rawEncode) as any),
    scale.createTupleDecoder(codecs.map((x) => x.rawDecode) as any),
  )
}

/**
 * @internal
 */
export type EnumOptionInput<T extends string, Z extends z.ZodType> =
  z.input<Z> extends infer I ? (I extends undefined ? { t: T; value?: I } : { t: T; value: I }) : never

export declare type StructCodecsSchema<T> = {
  [K in keyof T]: [K, Codec<T[K]>]
}[keyof T][]

export function structCodec<T>(order: (keyof T)[], schema: { [K in keyof T]: Codec<T[K]> }): Codec<T> {
  const encoders: scale.StructEncoders<any> = []
  const decoders: scale.StructDecoders<any> = []

  for (const [field, codec] of schema as [string, Codec<any>][]) {
    encoders.push([field, codec.rawEncode])
    decoders.push([field, codec.rawDecode])
  }

  return codec(scale.createStructEncoder(encoders), scale.createStructDecoder(decoders))
}

const thisCodecShouldNeverBeCalled = () => {
  throw new Error('This value could never be encoded')
}
export const neverCodec: Codec<never> = new Codec({
  encode: scale.encodeFactory(thisCodecShouldNeverBeCalled, thisCodecShouldNeverBeCalled),
  decode: thisCodecShouldNeverBeCalled,
})

export const nullCodec: Codec<null> = new Codec(scale.encodeUnit, scale.decodeUnit)

export function bitmapCodec<Name extends string>(masks: { [K in Name]: number }): Codec<Set<Name>> {
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
