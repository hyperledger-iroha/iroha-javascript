import * as scale from '@scale-codec/core'
import {
  Codec,
  type CodecProvider,
  CodecSymbol as codecSymbol,
  codecOf,
  enumCodec,
  lazyCodec,
  structCodec,
  CodecSymbol,
} from '../codec'
import type { JsonValue } from 'type-fest'
import {
  hexDecode,
  type SumTypeKind,
  type SumTypeKindValue,
  type BRAND,
  type Define,
  type Parse,
  hexEncode,
} from '../util'
import * as crypto from '@iroha2/crypto-core'

interface IntType<T extends number | bigint, Name extends string>
  extends CodecProvider<T & BRAND<Name>>,
    Define<T, T & BRAND<Name>> {}

function defineInt<T extends number | bigint, Name extends string>(codec: Codec<T>): IntType<T, Name> {
  const ret: IntType<T, Name> = {
    [codecSymbol]: codec.wrap<T & BRAND<Name>>({
      toBase: (x) => x,
      fromBase: (x) => ret.define(x),
    }),
    define: (x) => x as T & BRAND<Name>,
  }
  return ret
}

export type U8 = number & BRAND<'U8'>
export const U8: IntType<number, 'U8'> = defineInt<number, 'U8'>(
  new Codec({ encode: scale.encodeU8, decode: scale.decodeU8 }),
)

export type U16 = number & BRAND<'U16'>
export const U16: IntType<number, 'U16'> = defineInt<number, 'U16'>(
  new Codec({ encode: scale.encodeU16, decode: scale.decodeU16 }),
)

export type U32 = number & BRAND<'U32'>
export const U32: IntType<number, 'U32'> = defineInt<number, 'U32'>(
  new Codec({ encode: scale.encodeU32, decode: scale.decodeU32 }),
)

export type U64 = bigint & BRAND<'U64'>
export const U64: IntType<bigint, 'U64'> = defineInt<bigint, 'U64'>(
  new Codec({ encode: scale.encodeU64, decode: scale.decodeU64 }),
)

export type U128 = bigint & BRAND<'U128'>
export const U128: IntType<bigint, 'U128'> = defineInt<bigint, 'U128'>(
  new Codec({ encode: scale.encodeU128, decode: scale.decodeU128 }),
)

export type BytesVec = Uint8Array

export const BytesVec: CodecProvider<BytesVec> = {
  [codecSymbol]: new Codec({ encode: scale.encodeUint8Vec, decode: scale.decodeUint8Vec }),
}

// export type U8Array = Uint8Array
// export const U8Array = {
//   withLen: (len: number): CodecProvider<U8Array> => ({
//     [CodecSymbol]: new Codec({ encode: scale.createUint8ArrayEncoder(len), decode: scale.createUint8ArrayDecoder(len)})
//   })
// }

export type Bool = boolean

export const Bool: CodecProvider<Bool> = {
  [codecSymbol]: new Codec({ encode: scale.encodeBool, decode: scale.decodeBool }),
}

export type String = string

export const String: CodecProvider<string> = {
  [codecSymbol]: new Codec({ encode: scale.encodeStr, decode: scale.decodeStr }),
}

export type Compact = bigint & BRAND<'Compact'>

export const Compact: IntType<bigint, 'Compact'> = defineInt<bigint, 'Compact'>(
  new Codec<bigint>({ encode: scale.encodeCompact, decode: scale.decodeCompact }),
)

export type NonZero<T extends number | bigint> = T & BRAND<'NonZero'>

export const NonZero = {
  parse: <T extends number | bigint>(value: T): NonZero<T> => {
    if (value === 0) throw new Error(`zero value passed to NonZero-integer`)
    return value as NonZero<T>
  },
  with: <T extends number | bigint>(int: Codec<T>): CodecProvider<NonZero<T>> => ({
    [codecSymbol]: int as Codec<NonZero<T>>,
  }),
}

export type Option<T> = null | T

export const Option = {
  with: <T>(value: Codec<T>): CodecProvider<Option<T>> => ({
    [codecSymbol]: new Codec({
      encode: scale.createOptionEncoder(value.raw.encode),
      decode: scale.createOptionDecoder(value.raw.decode),
    }).wrap<Option<T>>({
      fromBase: (base) => (base.tag === 'None' ? null : base.as('Some')),
      toBase: (higher) => (higher === null ? scale.variant('None') : scale.variant('Some', higher)),
    }),
  }),
}
export type Map<K, V> = globalThis.Map<K, V>

export const Map = {
  with: <K, V>(key: Codec<K>, value: Codec<V>): CodecProvider<Map<K, V>> => ({
    [codecSymbol]: new Codec({
      encode: scale.createMapEncoder(key.raw.encode, value.raw.encode),
      decode: scale.createMapDecoder(key.raw.decode, value.raw.decode),
    }),
  }),
}

export type Vec<T> = globalThis.Array<T>

export const Vec = {
  with: <T>(item: Codec<T>): CodecProvider<Vec<T>> => ({
    [codecSymbol]: new Codec({
      encode: scale.createVecEncoder(item.raw.encode),
      decode: scale.createVecDecoder(item.raw.decode),
    }),
  }),
}

// TODO document that parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> {
  public static [codecSymbol]: Codec<Json<JsonValue>> = codecOf(String).wrap({
    toBase: (x) => x.asJsonString(),
    fromBase: (str) => Json.fromJsonString(str),
  })

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

export class Timestamp {
  public static [codecSymbol]: Codec<Timestamp> = codecOf(U64).wrap({
    toBase: (x) => x.asMilliseconds(),
    fromBase: (x) => Timestamp.fromMilliseconds(x),
  })

  public static fromDate(value: Date): Timestamp {
    return new Timestamp(U64.define(BigInt(value.getTime())))
  }

  public static fromMilliseconds(value: number | bigint | U64): Timestamp {
    return new Timestamp(U64.define(BigInt(value)))
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

export { Timestamp as TimestampU128 }

export type Duration = U64 & BRAND<'DurationMilliseconds'>

export const Duration: IntType<U64, 'DurationMilliseconds'> = defineInt<U64, 'DurationMilliseconds'>(codecOf(U64))

export type CompoundPredicate<Atom> =
  | SumTypeKindValue<'Atom', Atom>
  | SumTypeKindValue<'Not', CompoundPredicate<Atom>>
  | SumTypeKindValue<'And' | 'Or', CompoundPredicate<Atom>[]>

export const CompoundPredicate = {
  // TODO: freeze `value: []` too?
  /**
   * Predicate that always passes.
   *
   * It is simply the `And` variant with empty list of predicates (same logic as for {@link Array.prototype.every}).
   */
  PASS: Object.freeze<CompoundPredicate<never>>({ kind: 'And', value: [] }),
  /**
   * Predicate that always fails.
   *
   * It is sipmly the `Or` variant with empty list of predicates (same logic as for {@link Array.prototype.some}).
   */
  FAIL: Object.freeze<CompoundPredicate<never>>({ kind: 'Or', value: [] }),

  Atom: <T>(value: T): CompoundPredicate<T> => ({ kind: 'Atom', value }),
  Not: <T>(predicate: CompoundPredicate<T>): CompoundPredicate<T> => ({ kind: 'Not', value: predicate }),
  And: <T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T> => ({ kind: 'And', value: predicates }),
  Or: <T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T> => ({ kind: 'Or', value: predicates }),

  with: <Atom>(atom: Codec<Atom>): CodecProvider<CompoundPredicate<Atom>> => {
    const lazySelf = lazyCodec(() => codec)

    const codec: Codec<CompoundPredicate<Atom>> = enumCodec<{
      Atom: [Atom]
      Not: [CompoundPredicate<Atom>]
      And: [CompoundPredicate<Atom>[]]
      Or: [CompoundPredicate<Atom>[]]
    }>([
      // magic discriminants from schema
      [0, 'Atom', atom],
      [1, 'Not', lazySelf],
      [2, 'And', codecOf(Vec.with(lazySelf))],
      [3, 'Or', codecOf(Vec.with(lazySelf))],
    ]).discriminated()

    return { [codecSymbol]: codec }
  },
}

// Crypto specials
export type Algorithm = SumTypeKind<crypto.Algorithm>

export const Algorithm = {
  Ed25519: Object.freeze<Algorithm>({ kind: 'ed25519' }),
  Secp256k1: Object.freeze<Algorithm>({ kind: 'secp256k1' }),
  BlsNormal: Object.freeze<Algorithm>({ kind: 'bls_normal' }),
  BlsSmall: Object.freeze<Algorithm>({ kind: 'bls_small' }),
  [codecSymbol]: enumCodec<{
    ed25519: []
    secp256k1: []
    bls_normal: []
    bls_small: []
  }>([
    [0, 'ed25519'],
    [1, 'secp256k1'],
    [2, 'bls_normal'],
    [3, 'bls_small'],
  ]).discriminated() satisfies Codec<Algorithm>,
}

const HASH_ARR_LEN = 32

export class HashWrap {
  public static [codecSymbol]: Codec<HashWrap> = new Codec({
    encode: scale.createUint8ArrayEncoder(HASH_ARR_LEN),
    decode: scale.createUint8ArrayDecoder(HASH_ARR_LEN),
  }).wrap<HashWrap>({
    fromBase: (lower) => HashWrap.fromRaw(lower),
    toBase: (higher) => higher.toRaw(),
  })

  public static fromString(hex: string): HashWrap {
    return new HashWrap(hex, null)
  }

  public static fromRaw(raw: Uint8Array): HashWrap {
    return new HashWrap(null, raw)
  }

  public static fromCrypto(hash: crypto.Hash): HashWrap {
    return new HashWrap(null, hash.payload())
  }

  private _hex: string | null = null
  private _raw: null | Uint8Array = null

  private constructor(hex: null | string, raw: null | Uint8Array) {
    this._hex = hex
    this._raw = raw
  }

  public toRaw(): Uint8Array {
    if (!this._raw) {
      this._raw = new Uint8Array(hexDecode(this._hex!))
    }
    return this._raw
  }

  public toString(): string {
    if (!this._hex) {
      this._hex = hexEncode(this._raw!)
    }
    return this._hex
  }

  public toJSON(): string {
    return this.toString()
  }
}

interface PubKeyObj {
  algorithm: Algorithm
  payload: BytesVec
}

export class PublicKeyWrap {
  public static [codecSymbol]: Codec<PublicKeyWrap> = structCodec(['algorithm', 'payload'], {
    algorithm: codecOf(Algorithm),
    payload: codecOf(BytesVec),
  }).wrap({
    toBase: (higher) => higher,
    fromBase: (x) => new PublicKeyWrap(x, null, null),
  })

  public static fromString(hex: string): PublicKeyWrap {
    return new PublicKeyWrap(null, hex, null)
  }

  public static fromCrypto(pubkey: crypto.PublicKey): PublicKeyWrap {
    return new PublicKeyWrap(null, null, pubkey)
  }

  private _obj: null | PubKeyObj
  private _hex: null | string = null
  private _crypto: null | crypto.PublicKey = null

  private constructor(obj: null | PubKeyObj, hex: null | string, crypto: null | crypto.PublicKey) {
    this._obj = obj
    this._hex = hex
    this._crypto = crypto
  }

  private getOrCreateObj(): PubKeyObj {
    if (!this._obj) {
      if (!this._crypto) this._crypto = crypto.PublicKey.fromMultihash(this._hex!)
      this._obj = { algorithm: { kind: this._crypto.algorithm }, payload: this._crypto.payload() }
    }
    return this._obj
  }

  public get algorithm(): Algorithm {
    return this.getOrCreateObj().algorithm
  }

  public get payload(): BytesVec {
    return this.getOrCreateObj().payload
  }

  public toCrypto(): crypto.PublicKey {
    if (!this._crypto) {
      if (this._hex) this._crypto = crypto.PublicKey.fromMultihash(this._hex)
      else this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
    }
    return this._crypto
  }

  public toString() {
    if (!this._hex) {
      if (!this._crypto)
        this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
      this._hex = this._crypto.toMultihash()
    }
    return this._hex
    // return crypto.PublicKey.fromBytes(this.algorithm.kind, crypto.Bytes.array(this.payload)).toMultihash()
  }

  public toJSON() {
    return this.toString()
  }
}

export class SignatureWrap {
  public static [codecSymbol]: Codec<SignatureWrap> = codecOf(BytesVec).wrap<SignatureWrap>({
    toBase: (higher) => higher.toRaw(),
    fromBase: (lower) => SignatureWrap.fromRaw(lower),
  })

  public static fromString(hex: string): SignatureWrap {
    return new SignatureWrap(hex, null, null)
  }

  public static fromRaw(bytes: Uint8Array): SignatureWrap {
    return new SignatureWrap(null, bytes, null)
  }

  public static fromCrypto(signature: crypto.Signature): SignatureWrap {
    return new SignatureWrap(null, null, signature)
  }

  private constructor(hex: null | string, raw: null | Uint8Array, crypto: null | crypto.Signature) {
    // TODO
  }

  public toCrypto(): crypto.Signature {}

  public toString(): string {}

  public toJSON(): string {
    return this.toString()
  }

  public toRaw(): Uint8Array {}
}

export type Name = string & BRAND<'Name'>

export const Name: CodecProvider<Name> & Parse<string, Name> = {
  [codecSymbol]: codecOf(String).wrap<Name>({ toBase: (x) => x, fromBase: (x) => x as Name }),
  parse: (unchecked: string) => {
    if (!unchecked.length) throw new SyntaxError(`Name should not be empty`)
    if (/[\s#@]/.test(unchecked))
      throw new SyntaxError(
        'Name should not contain whitespace characters, ' +
          `'@' (reserved for '⟨account⟩@⟨domain⟩' constructs, e.g. 'alice@wonderland'), ` +
          `and '#' (reserved for '⟨asset⟩#⟨domain⟩' constructs, e.g. 'rose#wonderland')`,
      )
    return unchecked as Name
  },
}

export type DomainId = Name & BRAND<'DomainId'>

export const DomainId = Name as CodecProvider<DomainId> & Parse<string, DomainId>

export class AccountId {
  public static [codecSymbol]: Codec<AccountId> = structCodec<{ signatory: PublicKeyWrap; domain: DomainId }>(
    ['domain', 'signatory'],
    {
      domain: codecOf(DomainId),
      signatory: codecOf(PublicKeyWrap),
    },
  ).wrap<AccountId>({ fromBase: (x) => new AccountId(x.signatory, x.domain), toBase: (x) => x })

  public static parse(str: string): AccountId {
    return accountIdFromStr(str)
  }

  public readonly signatory: PublicKeyWrap
  public readonly domain: DomainId

  public constructor(signatory: PublicKeyWrap, domain: DomainId) {
    this.signatory = signatory
    this.domain = domain
  }

  public toJSON() {
    return this.toString()
  }

  public toString(): string {
    return `${this.signatory.toString()}@${this.domain}`
  }
}

function accountIdFromObj({ signatory, domain }: { signatory: string; domain: string }): AccountId {
  return new AccountId(PublicKeyWrap.fromString(signatory), DomainId.parse(domain))
}

function accountIdFromStr(str: string): AccountId {
  const parts = str.split('@')
  if (parts.length !== 2) {
    throw new SyntaxError(`AccountId should have format '⟨signatory⟩@⟨domain⟩, got: '${str}'`)
  }
  const [signatory, domain] = parts
  return accountIdFromObj({ signatory, domain })
}

export class AssetDefinitionId {
  public static [codecSymbol]: Codec<AssetDefinitionId> = structCodec<{
    name: Name
    domain: DomainId
  }>(['domain', 'name'], {
    domain: codecOf(DomainId),
    name: codecOf(Name),
  }).wrap<AssetDefinitionId>({
    toBase: (higher) => higher,
    fromBase: (lower) => new AssetDefinitionId(lower.name, lower.domain),
  })

  public static parse(str: string): AssetDefinitionId {
    return assetDefIdFromStr(str)
  }

  public readonly name: Name
  public readonly domain: DomainId

  public constructor(name: Name, domain: DomainId) {
    this.name = name
    this.domain = domain
  }

  public toString(): string {
    return `${this.name}#${this.domain}`
  }

  public toJSON(): string {
    return this.toString()
  }
}

function assetDefIdFromObj({ name, domain }: { name: string; domain: string }) {
  return new AssetDefinitionId(Name.parse(name), DomainId.parse(domain))
}

function assetDefIdFromStr(input: string) {
  const parts = input.split('#')
  if (parts.length !== 2) {
    throw new SyntaxError(`AssetDefinitionId should have format '⟨name⟩#⟨domain⟩, e.g. 'rose#wonderland', got '${input}'`)
  }
  const [name, domain] = parts
  return assetDefIdFromObj({ name, domain })
}

export class AssetId {
  public static [codecSymbol]: Codec<AssetId> = structCodec<{ account: AccountId; definition: AssetDefinitionId }>(
    ['account', 'definition'],
    { account: codecOf(AccountId), definition: codecOf(AssetDefinitionId) },
  ).wrap<AssetId>({ toBase: (higher) => higher, fromBase: (lower) => new AssetId(lower.account, lower.definition) })

  /**
   * Parses a stringified ID in a form of either
   *
   * - `asset#domain#account@domain`
   * - `asset##account@domain`
   */
  public static parse(str: string): AssetId {
    return assetIdFromStr(str)
  }

  public readonly account: AccountId
  public readonly definition: AssetDefinitionId

  public constructor(account: AccountId, definition: AssetDefinitionId) {
    this.account = account
    this.definition = definition
  }

  /**
   * Produce a stringified ID, see {@link parse}.
   */
  public toString(): string {
    return this.account.domain === this.definition.domain
      ? `${this.definition.name}##${this.account.toString()}`
      : `${this.definition.toString()}#${this.account.toString()}`
  }
}

function assetIdFromStr(input: string) {
  const match = input.match(/^(.+)#(.+)?#(.+)@(.+)$/)
  if (!match) {
    throw new SyntaxError(
      `AssetId should have format '⟨name⟩#⟨asset domain⟩#⟨account signatory⟩@⟨account domain⟩' ` +
        `or '⟨name⟩##⟨account signatory⟩@⟨account domain⟩' (when asset and account domains are the same), got '${input}'`,
    )
  }
  const [, asset, domain1, account, domain2] = match
  return new AssetId(
    accountIdFromObj({ signatory: account, domain: domain2 }),
    assetDefIdFromObj({ name: asset, domain: domain1 ?? domain2 }),
  )
}
