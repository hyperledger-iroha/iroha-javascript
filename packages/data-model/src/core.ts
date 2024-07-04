import * as scale from '@scale-codec/core'
import type { z } from 'zod'
import { type U32, U32$codec, U32$schema } from './core-datamodel'

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

// export class CodecHighLevel<T extends z.ZodType> {
//   public codec: Codec<z.infer<T>>
//   public schema: T

//   public constructor(schema: T, codec: Codec<z.infer<T>>) {
//     this.schema = schema
//     this.codec = codec
//   }

//   public encodeParsed(value: z.output<T>): Uint8Array {
//     return scale.WalkerImpl.encode(value, this.codec.encode)
//   }

//   public encode(value: z.input<T>): Uint8Array {
//     return scale.WalkerImpl.encode(value, this.codec.encode)
//   }

//   public decode(source: ArrayBufferView): z.output<T> {
//     const decoded = scale.WalkerImpl.decode(source, this.codec.decode)
//     return this.schema.parse(decoded)
//   }
// }

export function encode<T>(value: T, codec: Codec<T>): Uint8Array {
  return scale.WalkerImpl.encode(value, codec.encode)
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
