import * as scale from '@scale-codec/core'
import {
  Codec,
  type CodecProvider,
  CodecSymbol,
  codecOf,
  CodecSymbol as codecSymbol,
  enumCodec,
  lazyCodec,
  structCodec,
} from '../codec'
import type { JsonValue } from 'type-fest'
import {
  hexDecode,
  type SumTypeKind,
  type SumTypeKindValue,
  // type BRAND,
  type Define,
  type Parse,
  hexEncode,
} from '../util'
import * as crypto from '@iroha2/crypto-core'

export type U8 = number
export const U8: CodecProvider<U8> = {
  [codecSymbol]: new Codec({ encode: scale.encodeU8, decode: scale.decodeU8 }),
}

export type U16 = number
export const U16: CodecProvider<U16> = {
  [codecSymbol]: new Codec({ encode: scale.encodeU16, decode: scale.decodeU16 }),
}

export type U32 = number
export const U32: CodecProvider<U32> = {
  [codecSymbol]: new Codec({ encode: scale.encodeU32, decode: scale.decodeU32 }),
}

export type U64 = bigint
export const U64: CodecProvider<U64> = {
  [codecSymbol]: new Codec({ encode: scale.encodeU64, decode: scale.decodeU64 }),
}

export type U128 = bigint
export const U128: CodecProvider<U128> = {
  [codecSymbol]: new Codec({ encode: scale.encodeU128, decode: scale.decodeU128 }),
}

export type BytesVec = Uint8Array

export const BytesVec: CodecProvider<BytesVec> = {
  [codecSymbol]: new Codec({ encode: scale.encodeUint8Vec, decode: scale.decodeUint8Vec }),
}

export type Bool = boolean

export const Bool: CodecProvider<Bool> = {
  [codecSymbol]: new Codec({ encode: scale.encodeBool, decode: scale.decodeBool }),
}

export type String = string

export const String: CodecProvider<string> = {
  [codecSymbol]: new Codec({ encode: scale.encodeStr, decode: scale.decodeStr }),
}

export type Compact = bigint

export const Compact: CodecProvider<bigint> = {
  [codecSymbol]: new Codec<bigint>({ encode: scale.encodeCompact, decode: scale.decodeCompact }),
}

export type NonZero<T extends number | bigint> = T

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
    toBase: (x) => x.asMillis(),
    fromBase: (x) => Timestamp.fromMillis(x),
  })

  public static fromDate(value: Date): Timestamp {
    return new Timestamp(BigInt(value.getTime()))
  }

  public static fromMillis(value: number | bigint | U64): Timestamp {
    return new Timestamp(BigInt(value))
  }

  private _ms: U64

  public constructor(milliseconds: U64) {
    this._ms = milliseconds
  }

  public asDate(): Date {
    // TODO check correct bounds
    return new Date(Number(this._ms))
  }

  public asMillis(): U64 {
    return this._ms
  }
}

export { Timestamp as TimestampU128 }

export class Duration {
  public static [codecSymbol]: Codec<Duration> = U64[codecSymbol].wrap({
    fromBase: (x) => Duration.fromMillis(x),
    toBase: (y) => y.asMillis(),
  })

  public static fromMillis(ms: number | bigint): Duration {
    return new Duration(BigInt(ms))
  }

  _ms: bigint

  private constructor(ms: bigint) {
    this._ms = ms
  }

  public asMillis(): bigint {
    return this._ms
  }
}

export type CompoundPredicate<Atom> =
  | SumTypeKindValue<'Atom', Atom>
  | SumTypeKindValue<'Not', CompoundPredicate<Atom>>
  | SumTypeKindValue<'And' | 'Or', CompoundPredicate<Atom>[]>

export const CompoundPredicate = {
  // TODO: freeze `value: []` too?
  /**
   * Predicate that always passes.
   *
   * It is simply the `And` variant with no predicates, which is always True (same logic as for {@link Array.prototype.every}).
   */
  PASS: Object.freeze({ kind: 'And', value: [] }),
  /**
   * Predicate that always fails.
   *
   * It is sipmly the `Or` variant with no predicates, which is always False (same logic as for {@link Array.prototype.some}).
   */
  FAIL: Object.freeze({ kind: 'Or', value: [] }),

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
    toBase: (higher) => higher.asRaw(),
  })

  public static fromHex(hex: string): HashWrap {
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

  public asRaw(): Uint8Array {
    if (!this._raw) {
      this._raw = new Uint8Array(hexDecode(this._hex!))
    }
    return this._raw
  }

  public asHex(): string {
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

  public static fromHex(hex: string): PublicKeyWrap {
    try {
      const checked = crypto.PublicKey.fromMultihash(hex)
      return new PublicKeyWrap(null, hex, checked)
    } catch (err) {
      throw new SyntaxError(`Bad PublicKey syntax in "${hex}": ${err.message}`)
    }
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

  public asCrypto(): crypto.PublicKey {
    if (!this._crypto) {
      if (this._hex) this._crypto = crypto.PublicKey.fromMultihash(this._hex)
      else this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
    }
    return this._crypto
  }

  public asHex() {
    if (!this._hex) {
      if (!this._crypto)
        this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
      this._hex = this._crypto.toMultihash()
    }
    return this._hex
    // return crypto.PublicKey.fromBytes(this.algorithm.kind, crypto.Bytes.array(this.payload)).toMultihash()
  }

  public toJSON() {
    return this.asHex()
  }
}

export class SignatureWrap {
  public static [codecSymbol]: Codec<SignatureWrap> = codecOf(BytesVec).wrap<SignatureWrap>({
    toBase: (higher) => higher.asRaw(),
    fromBase: (lower) => SignatureWrap.fromRaw(lower),
  })

  public static fromHex(hex: string): SignatureWrap {
    const raw = Uint8Array.from(hexDecode(hex))
    return new SignatureWrap(hex, raw, null)
  }

  public static fromRaw(bytes: Uint8Array): SignatureWrap {
    return new SignatureWrap(null, bytes, null)
  }

  public static fromCrypto(signature: crypto.Signature): SignatureWrap {
    return new SignatureWrap(null, null, signature)
  }

  private _hex: null | string
  private _raw: null | Uint8Array
  private _crypto: null | crypto.Signature

  private constructor(hex: null | string, raw: null | Uint8Array, crypto: null | crypto.Signature) {
    this._hex = hex
    this._raw = raw
    this._crypto = crypto
  }

  public asCrypto(): crypto.Signature {
    if (!this._crypto) {
      if (this._raw) this._crypto = crypto.Signature.fromBytes(crypto.Bytes.array(this._raw))
      else this._crypto = crypto.Signature.fromBytes(crypto.Bytes.hex(this._hex!))
    }
    return this._crypto
  }

  public asHex(): string {
    if (!this._hex) {
      if (this._raw) this._hex = hexEncode(this._raw)
      else this._hex = this._crypto!.payload('hex')
    }
    return this._hex
  }

  public asRaw(): Uint8Array {
    if (!this._raw) {
      // only if created from crypto
      this._raw = this._crypto!.payload()
    }
    return this._raw
  }

  public toJSON(): string {
    return this.asHex()
  }
}

export type Name = string

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

export type DomainId = Name

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
    return `${this.signatory.asHex()}@${this.domain}`
  }
}

function accountIdFromObj({ signatory, domain }: { signatory: string; domain: string }): AccountId {
  return new AccountId(PublicKeyWrap.fromHex(signatory), DomainId.parse(domain))
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
    throw new SyntaxError(
      `AssetDefinitionId should have format '⟨name⟩#⟨domain⟩, e.g. 'rose#wonderland', got '${input}'`,
    )
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
