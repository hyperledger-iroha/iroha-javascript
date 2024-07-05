import * as scale from '@scale-codec/core'
import type { z } from 'zod'
import { type U32, U32$codec, U32$schema } from './core-datamodel'

export interface RawScaleCodec<T> {
  encode: scale.Encode<T>
  decode: scale.Decode<T>
}

export class Codec<T> {
  public static lazy<T>(f: () => Codec<T>): Codec<T> {
    return new Codec(
      scale.encodeFactory(
        (v, w) => f().rawEncode(v, w),
        (v) => f().rawEncode.sizeHint(v),
      ),
      (w) => f().rawDecode(w),
    )
  }

  public rawEncode: scale.Encode<T>
  public rawDecode: scale.Decode<T>

  public constructor(encode: scale.Encode<T>, decode: scale.Decode<T>) {
    this.rawEncode = encode
    this.rawDecode = decode
  }

  public encode(value: T): Uint8Array {
    return scale.WalkerImpl.encode(value, this.rawEncode)
  }

  public decode(data: ArrayBufferView): T {
    return scale.WalkerImpl.decode(data, this.rawDecode)
  }

  public wrap<U>(toBase: (value: U) => T, fromBase: (value: T) => U): Codec<U> {
    return new Codec(
      scale.encodeFactory(
        (v, w) => this.rawEncode(toBase(v), w),
        (v) => this.rawEncode.sizeHint(toBase(v)),
      ),
      (w) => fromBase(this.rawDecode(w)),
    )
  }
}

export class EnumCodec<E extends scale.EnumRecord> extends Codec<scale.Enumerate<E>> {
  public discriminated<
    T extends {
      [Tag in keyof E]: E[Tag] extends [] ? { t: Tag } : E[Tag] extends [infer Value] ? { t: Tag; value: Value } : never
    }[keyof E],
  >(): Codec<T> {
    return this.wrap<{ t: string; value?: any }>(
      (value) => scale.variant<any>(value.t, value.value),
      (value) => ({ t: value.tag, value: value.content }),
    ) as any
  }

  public literalUnion(): {
    [Tag in keyof E]: E[Tag] extends [] ? Codec<Tag> : never
  }[keyof E] {
    return this.wrap<string>(
      (literal) => scale.variant<any>(literal),
      (variant) => variant.tag,
    ) as any
  }
}

export function codec<T>(encode: scale.Encode<T>, decode: scale.Decode<T>): Codec<T> {
  return new Codec(encode, decode)
}

export function lazyCodec<T>(f: () => Codec<T>): Codec<T> {
  return Codec.lazy(f)
}

export type EnumCodecSchema = [discriminant: number, tag: string, codec?: Codec<any>][]

export interface DatamodelZodEnumGeneric {
  t: string
  value?: unknown
}

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

export function structCodec<T>(schema: StructCodecsSchema<T>): Codec<T> {
  const encoders: scale.StructEncoders<any> = []
  const decoders: scale.StructDecoders<any> = []

  for (const [field, codec] of schema as [string, Codec<any>][]) {
    encoders.push([field, codec.rawEncode])
    decoders.push([field, codec.rawDecode])
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

  return reprCodec.wrap(toMask, fromMask)
}
