import * as scale from '@scale-codec/core'
import { trackDecode } from '@scale-codec/definition-runtime'

export const symbolCodec = Symbol('codec')

// TODO: maybe use to hide "raw" encode/decode
// const symbolCoreCodec = Symbol('codec-core')

export type Decode<T> = (source: ArrayBufferView) => T
export type Encode<T> = (value: T) => Uint8Array

export interface Codec<T> {
  encode: Encode<T>
  encodeRaw: scale.Encode<T>
  decode: Decode<T>
  decodeRaw: scale.Decode<T>
}

export interface CodecWrap<T> {
  [symbolCodec]: Codec<T>
}

export type CodecOrWrap<T> = Codec<T> | CodecWrap<T>

export class CodecImpl<T> implements Codec<T> {
  public encodeRaw: scale.Encode<T>
  public decodeRaw: scale.Decode<T>

  public constructor(encodeRaw: scale.Encode<T>, decodeRaw: scale.Decode<T>) {
    this.encodeRaw = encodeRaw
    this.decodeRaw = decodeRaw
  }

  public encode(value: T): Uint8Array {
    return scale.WalkerImpl.encode(value, this.encodeRaw)
  }

  public decode(source: ArrayBufferView): T {
    return scale.WalkerImpl.decode(source, this.decodeRaw)
  }
}

export function wrapCodec<T>(codec: Codec<T>): CodecWrap<T> {
  return { [symbolCodec]: codec }
}

export function boxEnumCodec<T>(codec: Codec<T>): Codec<{ enum: T }> {
  return new CodecImpl(
    scale.encodeFactory(
      (value, walker) => codec.encodeRaw(value.enum, walker),
      (value) => codec.encodeRaw.sizeHint(value.enum),
    ),
    (walker) => ({ enum: codec.decodeRaw(walker) }),
  )
}

export function toCodec<T>(
  source: T,
): T extends Codec<infer U>
  ? Codec<U>
  : T extends CodecWrap<infer U>
    ? Codec<U>
    : T extends () => CodecWrap<infer U>
      ? Codec<U>
      : T extends () => Codec<infer U>
        ? Codec<U>
        : never {
  if (typeof source === 'function') {
    return new CodecImpl(
      scale.encodeFactory(
        (value, walker) => {
          return unwrapContainerOrCodec(source()).encodeRaw(value, walker)
        },
        (value) => {
          return unwrapContainerOrCodec(source()).encodeRaw.sizeHint(value)
        },
      ),
      (walker) => {
        return unwrapContainerOrCodec(source()).decodeRaw(walker)
      },
    ) as any
  }
  if (symbolCodec in (source as any)) {
    return (source as any)[symbolCodec]
  }
  // console.log('hey', source[symbolCodec])
  return source as any
}

function unwrapContainerOrCodec<T>(value: CodecWrap<T> | Codec<T>) {
  if (symbolCodec in value) return value[symbolCodec]
  return value
}

export type EnumCodecSchema = [discriminant: number, tag: string, codec?: Codec<any>][]

export function enumCodec<T>(schema: EnumCodecSchema): Codec<T> {
  const encoders: scale.EnumEncoders<any> = {} as any
  const decoders: scale.EnumDecoders<any> = {}

  for (const [dis, tag, codec] of schema) {
    ;(encoders as any)[tag] = codec ? [dis, codec.encodeRaw] : dis
    ;(decoders as any)[dis] = codec
      ? [tag, (walker: scale.Walker) => trackDecode(`<enum>::${tag}`, walker, codec.decodeRaw)]
      : tag
  }

  return new CodecImpl(scale.createEnumEncoder(encoders), scale.createEnumDecoder(decoders)) as any
}

/**
 * Needed to explicitly define generated enum boxes so that TypeScript
 * doesn't fail while trying to resolve type of a circular definition
 */
export type EnumBoxValue<T> = T extends { enum: scale.Enumerate<infer E> }
  ? CodecWrap<T> & {
      [K in keyof E]: E[K] extends [infer Content] ? (value: Content) => T : T
    }
  : never

export declare type StructCodecsSchema<T> = {
  [K in keyof T]: [K, Codec<T[K]>]
}[keyof T][]

export function structCodec<T>(schema: StructCodecsSchema<T>): Codec<T> {
  const encoders: scale.StructEncoders<any> = []
  const decoders: scale.StructDecoders<any> = []

  for (const [field, codec] of schema as [string, Codec<any>][]) {
    encoders.push([field, codec.encodeRaw])
    decoders.push([field, (walker) => trackDecode(`<struct>.${field}`, walker, codec.decodeRaw)])
  }

  return new CodecImpl(scale.createStructEncoder(encoders), scale.createStructDecoder(decoders))
}
