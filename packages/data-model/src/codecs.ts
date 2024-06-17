import * as scale from '@scale-codec/core'
import * as core from './core'
import { JsonValue, Opaque } from 'type-fest'

export type U8 = number
export const U8 = core.wrapCodec<U8>(new core.CodecImpl(scale.encodeU8, scale.decodeU8))

export type U16 = number
export const U16 = core.wrapCodec<U16>(new core.CodecImpl(scale.encodeU16, scale.decodeU16))

export type U32 = number
export const U32 = core.wrapCodec<U32>(new core.CodecImpl(scale.encodeU32, scale.decodeU32))

export type U64 = bigint
export const U64 = core.wrapCodec<U64>(new core.CodecImpl(scale.encodeU64, scale.decodeU64))

export type U128 = bigint
export const U128 = core.wrapCodec<U128>(new core.CodecImpl(scale.encodeU128, scale.decodeU128))

export type BytesVec = Uint8Array
export const BytesVec: core.CodecWrap<BytesVec> = core.wrapCodec(
  new core.CodecImpl(scale.encodeUint8Vec, scale.decodeUint8Vec),
)

export type Bool = boolean
export const Bool = core.wrapCodec<boolean>(new core.CodecImpl(scale.encodeBool, scale.decodeBool))

export type String = string
export const String: core.CodecWrap<string> = core.wrapCodec(new core.CodecImpl(scale.encodeStr, scale.decodeStr))

export type Compact = bigint
export const Compact: core.CodecWrap<Compact> = core.wrapCodec(
  new core.CodecImpl<Compact>(scale.encodeCompact, scale.decodeCompact),
)

export type NonZero<T extends number | bigint> = Opaque<T, 'non-zero'>
export const NonZero = {
  with: <T extends number | bigint>(int: core.Codec<T>): core.Codec<NonZero<T>> => {
    // wrap and check on encode
    return null
  },
}

export type Option<T> = scale.RustOption<T>
export const Option = {
  with: <T>(some: core.Codec<T>): core.Codec<Option<T>> => {
    return null
  },
}

export type Map<K, V> = globalThis.Map<K, V>
export const Map = {
  with: <K, V>(key: core.Codec<K>, value: core.Codec<V>): core.Codec<Map<K, V>> => {
    return null
  },
}

export type Vec<T> = globalThis.Array<T>
export const Vec = {
  with: <T>(item: core.Codec<T>): core.Codec<T[]> => {
    return null
  },
}

export type Array<T> = globalThis.Array<T>
export const Array = {
  with: <T>(item: core.Codec<T>, len: number): core.Codec<T[]> => {
    return null
  },
}

// TODO parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> implements core.CodecWrap<Json> {
  public static fromValue<T extends JsonValue>(value: T): Json<T> {}

  public static fromJsonString<T extends JsonValue = JsonValue>(value: string): Json<T> {}

  [core.symbolCodec]: core.Codec<Json> = {}

  public toValue(): T {
    // TODO
  }
}

// export type Json = JsonValue
// export const Json = core.wrapCodec<Json>(new core.CodecImpl(
//     [core.symbolCodec]() {

//     }
// ))
