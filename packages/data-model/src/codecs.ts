import * as scale from '@scale-codec/core'
import * as core from './core'
import type { JsonValue, Opaque } from 'type-fest'

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
  define: <T extends number | bigint>(int: T): NonZero<T> => {
    if (int === 0) throw new Error(`zero integer is not allowed`)
    return int as NonZero<T>
  },
  with: <T extends number | bigint>(int: core.CodecOrWrap<T>): core.Codec<NonZero<T>> => {
    const intCodec = core.toCodec(int)
    return new core.CodecImpl(
      scale.encodeFactory(
        (value, walker) => {
          if (value === 0) throw new Error('Got zero at `NonZero` codec')
          intCodec.encodeRaw(value, walker)
        },
        (value) => {
          return intCodec.encodeRaw.sizeHint(value)
        },
      ),
      intCodec.decodeRaw as scale.Decode<NonZero<T>>,
    )
  },
}

export type Option<T> = scale.RustOption<T>
export const Option = {
  None: <T>(): Option<T> => scale.variant('None'),
  Some: <T>(some: T): Option<T> => scale.variant('Some', some),
  with: <T>(some: core.Codec<T>): core.Codec<Option<T>> => {
    return new core.CodecImpl(scale.createOptionEncoder(some.encodeRaw), scale.createOptionDecoder(some.decodeRaw))
  },
}

export type Map<K, V> = globalThis.Map<K, V>
export const Map = {
  with: <K, V>(key: core.Codec<K>, value: core.Codec<V>): core.Codec<Map<K, V>> => {
    return new core.CodecImpl(
      scale.createMapEncoder(key.encodeRaw, value.encodeRaw),
      scale.createMapDecoder(key.decodeRaw, value.decodeRaw),
    )
  },
}

export type Vec<T> = globalThis.Array<T>
export const Vec = {
  with: <T>(item: core.Codec<T>): core.Codec<T[]> => {
    return new core.CodecImpl(scale.createVecEncoder(item.encodeRaw), scale.createVecDecoder(item.decodeRaw))
  },
}

export type Array<T> = globalThis.Array<T>
export const Array = {
  with: <T>(item: core.Codec<T>, len: number): core.Codec<T[]> => {
    return new core.CodecImpl(
      scale.createArrayEncoder(item.encodeRaw, len),
      scale.createArrayDecoder(item.decodeRaw, len),
    )
  },
}

// TODO parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> implements core.CodecWrap<Json> {
  public static fromValue<T extends JsonValue>(value: T): Json<T> {
    return new Json({ some: value }, null)
  }

  public static fromJsonString<T extends JsonValue = JsonValue>(value: string): Json<T> {
    return new Json(null, value)
  }

  public [core.symbolCodec]: core.Codec<Json> = new core.CodecImpl(
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

  #value: null | { some: T }
  #str: null | string

  private constructor(asValue: null | { some: T }, asString: string | null) {
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
