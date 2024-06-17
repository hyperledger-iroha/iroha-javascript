export * as codecs from './codecs'
export {
  enumCodec,
  structCodec,
  boxEnumCodec,
  toCodec,
  type Codec,
  type CodecWrap,
  type EnumBoxValue,
  wrapCodec,

  // typescript won't compile without it
  symbolCodec,
} from './core'
export { type Enumerate, variant } from '@scale-codec/core'
