/**
 * [SCALE](https://docs.polkadot.com/polkadot-protocol/basics/data-encoding) codec utilities.
 *
 * These are mostly used internally, but you can use it in case you need to extend codec functionality.
 *
 * This module is mostly based on the [`@scale-codec/core`](https://www.npmjs.com/package/@scale-codec/core) package.
 *
 * @module
 */

import * as scale from '@scale-codec/core'
import { decodeHex } from '@std/encoding'
import type { Variant, VariantUnit } from './util.ts'

export const SYMBOL_CODEC = '$codec'

/**
 * Extracts codec from its container.
 */
export function getCodec<T>(type: CodecContainer<T>): GenCodec<T> {
  return type[SYMBOL_CODEC]
}

/**
 * Wraps a codec into {@link CodecContainer}.
 */
export function defineCodec<T>(codec: GenCodec<T>): CodecContainer<T> {
  return { [SYMBOL_CODEC]: codec }
}

/**
 * A value that contains a codec under a "special" key ({@link SYMBOL_CODEC}).
 */
export interface CodecContainer<T> {
  [SYMBOL_CODEC]: GenCodec<T>
}

export interface RawScaleCodec<T> {
  encode: scale.Encode<T>
  decode: scale.Decode<T>
}

/**
 * Generic codec.
 *
 * Unlike {@link RawScaleCodec}, provides higher-level encode/decode functions, as well as some composition utilities.
 */
export class GenCodec<T> {
  /**
   * Create a lazy codec, by only having a getter to the actual codec.
   *
   * The getter is called for each codec access and is not cached.
   */
  public static lazy<T>(f: () => GenCodec<T>): GenCodec<T> {
    return new GenCodec({
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
    const parsed = ArrayBuffer.isView(data) ? data : decodeHex(data)
    return scale.WalkerImpl.decode(parsed, this.raw.decode)
  }

  public wrap<U>({ toBase, fromBase }: { toBase: (value: U) => T; fromBase: (value: T) => U }): GenCodec<U> {
    return new GenCodec({
      encode: scale.encodeFactory(
        (v, w) => this.raw.encode(toBase(v), w),
        (v) => this.raw.encode.sizeHint(toBase(v)),
      ),
      decode: (w) => fromBase(this.raw.decode(w)),
    })
  }
}

export class EnumCodec<E extends scale.EnumRecord> extends GenCodec<scale.Enumerate<E>> {
  public discriminated<
    T extends {
      [Tag in keyof E]: E[Tag] extends [] ? VariantUnit<Tag>
        : E[Tag] extends [infer Value] ? Variant<Tag, Value>
        : never
    }[keyof E],
  >(): GenCodec<T> {
    return this.wrap<{ kind: string; value?: any }>({
      toBase: (value) => {
        if (value.value !== undefined) return scale.variant<any>(value.kind, value.value)
        return scale.variant<any>(value.kind)
      },
      fromBase: (value) => (value.unit ? { kind: value.tag } : { kind: value.tag, value: value.content }),
    }) as any
  }

  public literalUnion(): GenCodec<
    {
      [Tag in keyof E]: E[Tag] extends [] ? Tag : never
    }[keyof E]
  > {
    return this.wrap<string>({
      toBase: (literal) => scale.variant<any>(literal),
      fromBase: (variant) => variant.tag,
    }) as any
  }
}

export function lazyCodec<T>(f: () => GenCodec<T>): GenCodec<T> {
  return GenCodec.lazy(f)
}

export type EnumCodecSchema<E extends scale.EnumRecord> = {
  [K in keyof E]: E[K] extends [infer V] ? [discriminant: number, codec: GenCodec<V>] : [discriminant: number]
}

export function enumCodec<E extends scale.EnumRecord>(schema: EnumCodecSchema<E>): EnumCodec<E> {
  const encoders: scale.EnumEncoders<any> = {} as any
  const decoders: scale.EnumDecoders<any> = {}

  for (const [tag, [dis, maybeCodec]] of Object.entries(schema) as [string, [number, GenCodec<any>?]][]) {
    ;(encoders as any)[tag] = maybeCodec ? [dis, maybeCodec.raw.encode] : dis
    ;(decoders as any)[dis] = maybeCodec ? [tag, maybeCodec.raw.decode] : tag
  }

  return new EnumCodec({
    encode: scale.createEnumEncoder<any>(encoders),
    decode: scale.createEnumDecoder<any>(decoders),
  })
}

type TupleFromCodecs<T> = T extends [GenCodec<infer Head>, ...infer Tail] ? [Head, ...TupleFromCodecs<Tail>]
  : T extends [] ? []
  : never

export function tupleCodec<T extends [GenCodec<any>, ...GenCodec<any>[]]>(codecs: T): GenCodec<TupleFromCodecs<T>> {
  return new GenCodec({
    encode: scale.createTupleEncoder(codecs.map((x) => x.raw.encode) as any),
    decode: scale.createTupleDecoder(codecs.map((x) => x.raw.decode) as any),
  })
}

export declare type StructCodecsSchema<T> = {
  [K in keyof T]: [K, GenCodec<T[K]>]
}[keyof T][]

export function structCodec<T>(order: (keyof T & string)[], schema: { [K in keyof T]: GenCodec<T[K]> }): GenCodec<T> {
  const encoders: scale.StructEncoders<any> = []
  const decoders: scale.StructDecoders<any> = []

  for (const field of order) {
    encoders.push([field, schema[field].raw.encode])
    decoders.push([field, schema[field].raw.decode])
  }

  return new GenCodec({ encode: scale.createStructEncoder(encoders), decode: scale.createStructDecoder(decoders) })
}

const thisCodecShouldNeverBeCalled = () => {
  throw new Error('This value could never be encoded')
}
export const neverCodec: GenCodec<never> = new GenCodec({
  encode: scale.encodeFactory(thisCodecShouldNeverBeCalled, thisCodecShouldNeverBeCalled),
  decode: thisCodecShouldNeverBeCalled,
})

export const nullCodec: GenCodec<null> = new GenCodec({ encode: scale.encodeUnit, decode: scale.decodeUnit })

export function bitmapCodec<Name extends string>(masks: { [K in Name]: number }): GenCodec<Set<Name>> {
  const REPR_MAX = 2 ** 32 - 1

  const toMask = (set: Set<Name>): number => {
    let num = 0
    for (const i of set) {
      num |= masks[i]
    }
    return num
  }

  const masksArray = (Object.entries(masks) as [Name, number][]).map(([k, v]) => ({ key: k, value: v }))
  const fromMask = (bitmask: number): Set<Name> => {
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

  return new GenCodec({ encode: scale.encodeU32, decode: scale.decodeU32 }).wrap({ toBase: toMask, fromBase: fromMask })
}
