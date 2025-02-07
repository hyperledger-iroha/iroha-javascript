import * as scale from '@scale-codec/core'
import * as crypto from '@iroha2/crypto'
import { enumCodec, GenCodec, lazyCodec, structCodec } from './codec.ts'
import type { JsonValue } from 'type-fest'
import type { CompareFn } from './util.ts'
import { hexDecode, hexEncode, toSortedSet, type Variant, type VariantUnit } from './util.ts'
import * as traits from './traits.ts'

export type U8 = number
export const U8: traits.CodecContainer<U8> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeU8, decode: scale.decodeU8 }),
)

export type U16 = number
export const U16: traits.CodecContainer<U16> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeU16, decode: scale.decodeU16 }),
)

export type U32 = number
export const U32: traits.CodecContainer<U32> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeU32, decode: scale.decodeU32 }),
)

export type U64 = bigint
export const U64: traits.CodecContainer<U64> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeU64, decode: scale.decodeU64 }),
)

export type U128 = bigint
export const U128: traits.CodecContainer<U128> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeU128, decode: scale.decodeU128 }),
)

export type BytesVec = Uint8Array
export const BytesVec: traits.CodecContainer<BytesVec> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeUint8Vec, decode: scale.decodeUint8Vec }),
)

export type Bool = boolean
export const Bool: traits.CodecContainer<Bool> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeBool, decode: scale.decodeBool }),
)

export type String = string
export const String: traits.CodecContainer<string> = traits.defineCodec(
  new GenCodec({ encode: scale.encodeStr, decode: scale.decodeStr }),
)

export type Compact = bigint

export const Compact: traits.CodecContainer<bigint> = traits.defineCodec(
  new GenCodec<bigint>({ encode: scale.encodeCompact, decode: scale.decodeCompact }),
)

export class NonZero<T extends number | bigint | traits.IsZero> {
  public static with<T extends number | bigint | traits.IsZero>(codec: GenCodec<T>): GenCodec<NonZero<T>> {
    return codec.wrap<NonZero<T>>({
      toBase: (x) => x.value,
      fromBase: (x) => new NonZero(x),
    })
  }

  private _value: T
  private __brand!: 'non-zero something'

  public constructor(value: T) {
    const isZero = typeof value === 'number' || typeof value === 'bigint' ? value === 0 : value.isZero()
    if (isZero) throw new TypeError(`Zero is passed to the NonZero constructor (${globalThis.String(value)})`)
    this._value = value
  }

  public get value(): T {
    return this._value
  }

  public map<U extends number | bigint | traits.IsZero>(fun: (value: T) => U): NonZero<U> {
    return new NonZero(fun(this.value))
  }

  public toJSON(): T {
    return this.value
  }
}

export type Option<T> = null | T

export const Option = {
  with: <T>(value: GenCodec<T>): GenCodec<Option<T>> =>
    new GenCodec({
      encode: scale.createOptionEncoder(value.raw.encode),
      decode: scale.createOptionDecoder(value.raw.decode),
    }).wrap<Option<T>>({
      fromBase: (base) => (base.tag === 'None' ? null : base.as('Some')),
      toBase: (higher) => (higher === null ? scale.variant('None') : scale.variant('Some', higher)),
    }),
}

export type Vec<T> = globalThis.Array<T>

export const Vec = {
  with: <T>(item: GenCodec<T>): GenCodec<Vec<T>> => {
    return new GenCodec({
      encode: scale.createVecEncoder(item.raw.encode),
      decode: scale.createVecDecoder(item.raw.decode),
    })
  },
}

export type BTreeSet<T> = Vec<T>

export const BTreeSet = {
  with<T extends traits.Ord<T> | string>(type: GenCodec<T>): GenCodec<BTreeSet<T>> {
    return BTreeSet.withCmp(type, traits.ordCompare)
  },
  withCmp<T>(codec: GenCodec<T>, compare: CompareFn<T>): GenCodec<BTreeSet<T>> {
    return Vec.with(codec).wrap<BTreeSet<T>>({
      toBase: (x) => toSortedSet(x, compare),
      fromBase: (x) => x,
    })
  },
}

export interface MapEntry<K, V> {
  key: K
  value: V
}

/**
 * Being represented as a plain array, its codec ensures that
 * the entries are encoded in a deterministic manner, sorting and deduplicating items.
 */
export type BTreeMap<K, V> = Array<MapEntry<K, V>>

export const BTreeMap = {
  with: <K extends traits.Ord<K>, V>(key: GenCodec<K>, value: GenCodec<V>): GenCodec<BTreeMap<K, V>> => {
    return BTreeMap.withCmp(key, value, (a, b) => traits.ordCompare(a.key, b.key))
  },
  withCmp: <K, V>(
    key: GenCodec<K>,
    value: GenCodec<V>,
    compareFn: CompareFn<MapEntry<K, V>>,
  ): GenCodec<BTreeMap<K, V>> => {
    const entry = structCodec<MapEntry<K, V>>(['key', 'value'], { key, value })
    return BTreeSet.withCmp(entry, (a, b) => compareFn(a, b))
  },
}

// TODO document that parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> implements traits.Ord<Json> {
  public static [traits.SYMBOL_CODEC]: GenCodec<Json<JsonValue>> = traits.getCodec(String).wrap({
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

  public compare(that: Json): number {
    return traits.ordCompare(this.asJsonString(), that.asJsonString())
  }
}

export class Timestamp {
  public static [traits.SYMBOL_CODEC]: GenCodec<Timestamp> = traits.getCodec(U64).wrap({
    toBase: (x) => x.asMillis(),
    fromBase: (x) => Timestamp.fromMillis(x),
  })

  public static fromDate(value: Date): Timestamp {
    return new Timestamp(BigInt(value.getTime()))
  }

  public static fromMillis(value: number | bigint | U64): Timestamp {
    return new Timestamp(BigInt(value))
  }

  public static now(): Timestamp {
    return new Timestamp(BigInt(Date.now()))
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

  public toJSON() {
    return this.asDate().toISOString()
  }
}

export { Timestamp as TimestampU128 }

export class Duration implements traits.IsZero {
  public static [traits.SYMBOL_CODEC]: GenCodec<Duration> = traits.getCodec(U64).wrap({
    fromBase: (x) => Duration.fromMillis(x),
    toBase: (y) => y.asMillis(),
  })

  public static fromMillis(ms: number | bigint): Duration {
    return new Duration(BigInt(ms))
  }

  private readonly _ms: bigint

  protected constructor(ms: bigint) {
    if (ms < 0n) throw new TypeError(`Duration could not be negative, got: ${ms}`)
    this._ms = ms
  }

  public asMillis(): bigint {
    return this._ms
  }

  public isZero(): boolean {
    return this._ms === 0n
  }

  public toJSON() {
    return { ms: this._ms }
  }
}

export type CompoundPredicate<Atom> =
  | Variant<'Atom', Atom>
  | Variant<'Not', CompoundPredicate<Atom>>
  | Variant<'And' | 'Or', CompoundPredicate<Atom>[]>

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
   * It is simply the `Or` variant with no predicates, which is always False (same logic as for {@link Array.prototype.some}).
   */
  FAIL: Object.freeze({ kind: 'Or', value: [] }),

  Atom: <T>(value: T): CompoundPredicate<T> => ({ kind: 'Atom', value }),
  Not: <T>(predicate: CompoundPredicate<T>): CompoundPredicate<T> => ({ kind: 'Not', value: predicate }),
  And: <T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T> => ({ kind: 'And', value: predicates }),
  Or: <T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T> => ({ kind: 'Or', value: predicates }),

  with: <Atom>(atomType: GenCodec<Atom>): GenCodec<CompoundPredicate<Atom>> => {
    const lazySelf = lazyCodec(() => codec)

    const codec: GenCodec<CompoundPredicate<Atom>> = enumCodec<{
      Atom: [Atom]
      Not: [CompoundPredicate<Atom>]
      And: [CompoundPredicate<Atom>[]]
      Or: [CompoundPredicate<Atom>[]]
    }>(
      {
        // magic discriminants from schema
        Atom: [0, atomType],
        Not: [1, lazySelf],
        And: [2, Vec.with(lazySelf)],
        Or: [3, Vec.with(lazySelf)],
      },
    ).discriminated()

    return codec
  },
}

// Crypto specials
export type Algorithm = VariantUnit<crypto.Algorithm>

export const Algorithm = {
  Ed25519: Object.freeze<Algorithm>({ kind: 'ed25519' }),
  Secp256k1: Object.freeze<Algorithm>({ kind: 'secp256k1' }),
  BlsNormal: Object.freeze<Algorithm>({ kind: 'bls_normal' }),
  BlsSmall: Object.freeze<Algorithm>({ kind: 'bls_small' }),
  ...traits.defineCodec(
    enumCodec<{
      ed25519: []
      secp256k1: []
      bls_normal: []
      bls_small: []
    }>({
      ed25519: [0],
      secp256k1: [1],
      bls_normal: [2],
      bls_small: [3],
    }).discriminated() satisfies GenCodec<Algorithm>,
  ),
}

const HASH_ARR_LEN = 32

export class HashRepr {
  public static [traits.SYMBOL_CODEC]: GenCodec<HashRepr> = new GenCodec({
    encode: scale.createUint8ArrayEncoder(HASH_ARR_LEN),
    decode: scale.createUint8ArrayDecoder(HASH_ARR_LEN),
  }).wrap<HashRepr>({
    fromBase: (lower) => HashRepr.fromRaw(lower),
    toBase: (higher) => higher.asRaw(),
  })

  public static fromHex(hex: string): HashRepr {
    return new HashRepr(hex, null)
  }

  public static fromRaw(raw: Uint8Array): HashRepr {
    return new HashRepr(null, raw)
  }

  public static fromCrypto(hash: crypto.Hash): HashRepr {
    return new HashRepr(null, hash.payload())
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

/**
 * {@link crypto.PublicKey} representation in the data model.
 *
 * It could be created from any representation and transformed into another.
 *
 * Note that transformations are lazy, thus the validity of input data is not immediately validated
 * (unless {@link crypto.PublicKey} is passed).
 */
export class PublicKeyRepr implements traits.Ord<PublicKeyRepr> {
  public static [traits.SYMBOL_CODEC]: GenCodec<PublicKeyRepr> = structCodec(['algorithm', 'payload'], {
    algorithm: traits.getCodec(Algorithm),
    payload: traits.getCodec(BytesVec),
  }).wrap({
    toBase: (higher) => higher,
    fromBase: (x) => new PublicKeyRepr(x, null, null),
  })

  /**
   * Create from hex-encoded bytes.
   *
   * Throws if the input is not a valid hex or not a valid public key.
   */
  public static fromHex(hex: string): PublicKeyRepr {
    try {
      const checked = crypto.PublicKey.fromMultihash(hex)
      return new PublicKeyRepr(null, hex, checked)
    } catch (err) {
      throw new SyntaxError(`Cannot parse PublicKey from "${hex}": ${globalThis.String(err)}`)
    }
  }

  /**
   * Create from an instance of {@link crypto.PublicKey}
   */
  public static fromCrypto(pubkey: crypto.PublicKey): PublicKeyRepr {
    return new PublicKeyRepr(null, null, pubkey)
  }

  /**
   * Create from an algorithm and payload.
   *
   * Throws if the algorithm and payload don't form a valid public key.
   */
  public static fromParts(algorithm: Algorithm, payload: BytesVec): PublicKeyRepr {
    const asCrypto = crypto.PublicKey.fromBytes(algorithm.kind, crypto.Bytes.array(payload))
    return new PublicKeyRepr({ algorithm, payload }, null, asCrypto)
  }

  private _obj: null | PubKeyObj
  private _hex: null | string = null
  private _crypto: null | crypto.PublicKey = null

  private constructor(obj: null | PubKeyObj, hex: null | string, crypto: null | crypto.PublicKey) {
    this._obj = obj
    this._hex = hex
    this._crypto = crypto
  }

  public get algorithm(): Algorithm {
    return this.getOrCreateObj().algorithm
  }

  public get payload(): BytesVec {
    return this.getOrCreateObj().payload
  }

  /**
   * Get as {@link crypto.PublicKey}
   */
  public asCrypto(): crypto.PublicKey {
    if (!this._crypto) {
      if (this._hex) this._crypto = crypto.PublicKey.fromMultihash(this._hex)
      else this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
    }
    return this._crypto
  }

  /**
   * Get as a public key multihash, i.e. by {@link crypto.PublicKey.toMultihash}
   */
  public asHex() {
    if (!this._hex) {
      if (!this._crypto) {
        this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
      }
      this._hex = this._crypto.toMultihash()
    }
    return this._hex
  }

  public toJSON() {
    return this.asHex()
  }

  public compare(other: PublicKeyRepr): number {
    return traits.ordCompare(this.asHex(), other.asHex())
  }

  private getOrCreateObj(): PubKeyObj {
    if (!this._obj) {
      if (!this._crypto) this._crypto = crypto.PublicKey.fromMultihash(this._hex!)
      this._obj = { algorithm: { kind: this._crypto.algorithm }, payload: this._crypto.payload() }
    }
    return this._obj
  }
}

/**
 * {@link crypto.Signature} representation in the data model.
 *
 * It could be created from any representation and transformed into another:
 *
 * ```ts
 * const hex = '01019292afafaaff' // some hex, not real
 *
 * const wrap = SignatureWrap.fromHex(hex)
 * const actualSignature = wrap.asCrypto()
 * ```
 */
export class SignatureRepr {
  public static [traits.SYMBOL_CODEC]: GenCodec<SignatureRepr> = traits.getCodec(BytesVec).wrap<SignatureRepr>({
    toBase: (higher) => higher.asRaw(),
    fromBase: (lower) => SignatureRepr.fromRaw(lower),
  })

  /**
   * Create from a hex string.
   *
   * Throws if input is not a valid hex.
   */
  public static fromHex(hex: string): SignatureRepr {
    const raw = Uint8Array.from(hexDecode(hex))
    return new SignatureRepr(hex, raw, null)
  }

  /**
   * Create from an instance of {@link crypto.Signature}.
   */
  public static fromCrypto(signature: crypto.Signature): SignatureRepr {
    return new SignatureRepr(null, null, signature)
  }

  /**
   * Create from an array of bytes.
   */
  private static fromRaw(bytes: Uint8Array): SignatureRepr {
    return new SignatureRepr(null, bytes, null)
  }

  private _hex: null | string
  private _raw: null | Uint8Array
  private _crypto: null | crypto.Signature

  private constructor(hex: null | string, raw: null | Uint8Array, crypto: null | crypto.Signature) {
    this._hex = hex
    this._raw = raw
    this._crypto = crypto
  }

  /**
   * Representation as {@link crypto.Signature}.
   */
  public asCrypto(): crypto.Signature {
    if (!this._crypto) {
      if (this._raw) this._crypto = crypto.Signature.fromBytes(crypto.Bytes.array(this._raw))
      else this._crypto = crypto.Signature.fromBytes(crypto.Bytes.hex(this._hex!))
    }
    return this._crypto
  }

  /**
   * Representation as a hex string.
   */
  public asHex(): string {
    if (!this._hex) {
      if (this._raw) this._hex = hexEncode(this._raw)
      else this._hex = this._crypto!.payload('hex')
    }
    return this._hex
  }

  public toJSON(): string {
    return this.asHex()
  }

  /**
   * Representation as raw bytes.
   */
  private asRaw(): Uint8Array {
    if (!this._raw) {
      // only if created from crypto
      this._raw = this._crypto!.payload()
    }
    return this._raw
  }
}

/**
 * Name is a simple wrap around string that ensures that it
 * doesn't contain whitespaces characters, `@`, and `#`.
 *
 * @example
 * ```ts
 * const name1 = new Name('alice')
 * console.log(name1.value) // => alice
 *
 * new Name('alice and bob') // Error: whitespace characters.
 * ```
 */
export class Name implements traits.Ord<Name> {
  public static [traits.SYMBOL_CODEC] = traits
    .getCodec(String)
    .wrap<Name>({ toBase: (x) => x.value, fromBase: (x) => new Name(x) })

  private _brand!: 'Name'
  private _value: string

  public constructor(name: string) {
    if (!name.length) throw new SyntaxError(`Name should not be empty`)
    if (/[\s#@]/.test(name)) {
      throw new SyntaxError(
        `Invalid name: "${name}". Name should not contain whitespace characters, ` +
          `'@' (reserved for '⟨signatory⟩@⟨domain⟩' constructs, e.g. 'ed....@wonderland'), ` +
          `and '#' (reserved for '⟨asset⟩#⟨domain⟩' constructs, e.g. 'rose#wonderland') `,
      )
    }

    this._value = name
  }

  public get value(): string {
    return this._value
  }

  public toJSON() {
    return this.value
  }

  public compare(other: Name): number {
    return this.value > other.value ? 1 : this.value < other.value ? -1 : 0
  }
}

export type DomainId = Name
export const DomainId = Name

export class AccountId implements traits.Ord<AccountId> {
  public static [traits.SYMBOL_CODEC]: GenCodec<AccountId> = structCodec<{
    signatory: PublicKeyRepr
    domain: DomainId
  }>(['domain', 'signatory'], {
    domain: traits.getCodec(DomainId),
    signatory: traits.getCodec(PublicKeyRepr),
  }).wrap<AccountId>({ fromBase: (x) => new AccountId(x.signatory, x.domain), toBase: (x) => x })

  /**
   * Parses account id from a string in a form of `<signature>@<domain>`.
   *
   * Throws an error if the string is not a valid account id.
   */
  public static parse(str: string): AccountId {
    return accountIdFromStr(str)
  }

  public readonly signatory: PublicKeyRepr
  public readonly domain: DomainId

  public constructor(signatory: PublicKeyRepr, domain: DomainId) {
    this.signatory = signatory
    this.domain = domain
  }

  public toJSON() {
    return this.toString()
  }

  /**
   * String representation of an account id, as described in {@link AccountId.parse}.
   */
  public toString(): string {
    return `${this.signatory.asHex() satisfies string}@${this.domain.value satisfies string}`
  }

  public compare(that: AccountId): number {
    const domains = traits.ordCompare(this.domain, that.domain)
    if (domains !== 0) return domains
    return traits.ordCompare(this.signatory, that.signatory)
  }
}

function accountIdFromObj({ signatory, domain }: { signatory: string; domain: string }): AccountId {
  return new AccountId(PublicKeyRepr.fromHex(signatory), new Name(domain))
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
  public static [traits.SYMBOL_CODEC]: GenCodec<AssetDefinitionId> = structCodec<{
    name: Name
    domain: DomainId
  }>(['domain', 'name'], {
    domain: traits.getCodec(DomainId),
    name: traits.getCodec(Name),
  }).wrap<AssetDefinitionId>({
    toBase: (higher) => higher,
    fromBase: (lower) => new AssetDefinitionId(lower.name, lower.domain),
  })

  /**
   * Parse an asset definition id from a string representation in a form of `<name>@<domain>`.
   *
   * Throws an error if the string is invalid asset definition id.
   */
  public static parse(str: string): AssetDefinitionId {
    return assetDefIdFromStr(str)
  }

  public readonly name: Name
  public readonly domain: DomainId

  public constructor(name: Name, domain: DomainId) {
    this.name = name
    this.domain = domain
  }

  /**
   * String representation, as described in {@link AssetDefinitionId.parse}
   */
  public toString(): string {
    return `${this.name.value satisfies string}#${this.domain.value satisfies string}`
  }

  public toJSON(): string {
    return this.toString()
  }
}

function assetDefIdFromObj({ name, domain }: { name: string; domain: string }) {
  return new AssetDefinitionId(new Name(name), new Name(domain))
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
  public static [traits.SYMBOL_CODEC]: GenCodec<AssetId> = structCodec<{
    account: AccountId
    definition: AssetDefinitionId
  }>(['account', 'definition'], {
    account: traits.getCodec(AccountId),
    definition: traits.getCodec(AssetDefinitionId),
  }).wrap<AssetId>({
    toBase: (higher) => higher,
    fromBase: (lower) => new AssetId(lower.account, lower.definition),
  })

  /**
   * Parses an asset id from its string representation in a form of either
   *
   * - `<asset>#<domain>#<signatory>@<domain>`
   * - `<asset>##<signatory>@<domain>` (when domains are the same)
   *
   * Throws an error if the string is invalid asset id.
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
    return this.account.domain.value === this.definition.domain.value
      ? `${this.definition.name.value satisfies string}##${this.account.toString()}`
      : `${this.definition.toString()}#${this.account.toString()}`
  }

  public toJSON() {
    return this.toString()
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
