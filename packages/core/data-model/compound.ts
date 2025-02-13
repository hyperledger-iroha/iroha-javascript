import * as crypto from '../crypto/mod.ts'
import type { JsonValue } from 'type-fest'
import { enumCodec, type GenCodec, lazyCodec, structCodec } from '../codec.ts'
import { getCodec, type IsZero, type Ord, ordCompare, SYMBOL_CODEC } from '../traits.ts'
import type { Variant } from '../util.ts'
import { String, U64, Vec } from './primitives.ts'

// TODO document that parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> implements Ord<Json> {
  public static [SYMBOL_CODEC]: GenCodec<Json<JsonValue>> = getCodec(String).wrap({
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
    return ordCompare(this.asJsonString(), that.asJsonString())
  }
}

export class Timestamp {
  public static [SYMBOL_CODEC]: GenCodec<Timestamp> = getCodec(U64).wrap({
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

  public toJSON(): string {
    return this.asDate().toISOString()
  }
}

export { Timestamp as TimestampU128 }

export class Duration implements IsZero {
  public static [SYMBOL_CODEC]: GenCodec<Duration> = getCodec(U64).wrap({
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

  public toJSON(): { ms: bigint } {
    return { ms: this._ms }
  }
}

export type CompoundPredicate<Atom> =
  | Variant<'Atom', Atom>
  | Variant<'Not', CompoundPredicate<Atom>>
  | Variant<'And' | 'Or', CompoundPredicate<Atom>[]>

export const CompoundPredicate: {
  with<T>(atom: GenCodec<T>): GenCodec<CompoundPredicate<T>>
  /**
   * Predicate that always passes.
   *
   * It is simply the `And` variant with no predicates, which is always True (same logic as for {@link Array.prototype.every}).
   */
  PASS: Variant<'And', never[]>
  /**
   * Predicate that always fails.
   *
   * It is simply the `Or` variant with no predicates, which is always False (same logic as for {@link Array.prototype.some}).
   */
  FAIL: Variant<'Or', never[]>
  Atom<T>(value: T): CompoundPredicate<T>
  Not<T>(predicate: CompoundPredicate<T>): CompoundPredicate<T>
  And<T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T>
  Or<T>(...predicates: CompoundPredicate<T>[]): CompoundPredicate<T>
} = {
  // TODO: freeze `value: []` too?
  PASS: Object.freeze({ kind: 'And', value: [] }),
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

// // Crypto specials
// export type Algorithm = VariantUnit<crypto.Algorithm>

// export const Algorithm: { [K in crypto.Algorithm]: VariantUnit<K> } & CodecContainer<Algorithm> = {
//   ed25519: Object.freeze({ kind: 'ed25519' }),
//   secp256k1: Object.freeze({ kind: 'secp256k1' }),
//   bls_normal: Object.freeze({ kind: 'bls_normal' }),
//   bls_small: Object.freeze({ kind: 'bls_small' }),
//   ...defineCodec(
//     enumCodec<{
//       ed25519: []
//       secp256k1: []
//       bls_normal: []
//       bls_small: []
//     }>({
//       ed25519: [0],
//       secp256k1: [1],
//       bls_normal: [2],
//       bls_small: [3],
//     }).discriminated() satisfies GenCodec<Algorithm>,
//   ),
// }

// const HASH_ARR_LEN = 32

// export class HashRepr {
//   public static [SYMBOL_CODEC]: GenCodec<HashRepr> = new GenCodec({
//     encode: scale.createUint8ArrayEncoder(HASH_ARR_LEN),
//     decode: scale.createUint8ArrayDecoder(HASH_ARR_LEN),
//   }).wrap<HashRepr>({
//     fromBase: (lower) => HashRepr.fromRaw(lower),
//     toBase: (higher) => higher.asRaw(),
//   })

//   public static fromHex(hex: string): HashRepr {
//     return new HashRepr(hex, null)
//   }

//   public static fromRaw(raw: Uint8Array): HashRepr {
//     return new HashRepr(null, raw)
//   }

//   public static fromCrypto(hash: crypto.Hash): HashRepr {
//     return new HashRepr(null, hash.payload())
//   }

//   private _hex: string | null = null
//   private _raw: null | Uint8Array = null

//   private constructor(hex: null | string, raw: null | Uint8Array) {
//     this._hex = hex
//     this._raw = raw
//   }

//   public asRaw(): Uint8Array {
//     if (!this._raw) {
//       this._raw = decodeHex(this._hex!)
//     }
//     return this._raw!
//   }

//   public asHex(): string {
//     if (!this._hex) {
//       this._hex = encodeHex(this._raw!)
//     }
//     return this._hex
//   }

//   public toJSON(): string {
//     return this.toString()
//   }
// }

// interface PubKeyObj {
//   algorithm: Algorithm
//   payload: BytesVec
// }

// /**
//  * {@link crypto.PublicKey} representation in the data model.
//  *
//  * It could be created from any representation and transformed into another.
//  *
//  * Note that transformations are lazy, thus the validity of input data is not immediately validated
//  * (unless {@link crypto.PublicKey} is passed).
//  */
// export class PublicKeyRepr implements Ord<PublicKeyRepr> {
//   public static [SYMBOL_CODEC]: GenCodec<PublicKeyRepr> = structCodec(['algorithm', 'payload'], {
//     algorithm: getCodec(Algorithm),
//     payload: getCodec(BytesVec),
//   }).wrap({
//     toBase: (higher) => higher,
//     fromBase: (x) => new PublicKeyRepr(x, null, null),
//   })

//   /**
//    * Create from hex-encoded bytes.
//    *
//    * Throws if the input is not a valid hex or not a valid public key.
//    */
//   public static fromHex(hex: string): PublicKeyRepr {
//     try {
//       const checked = crypto.PublicKey.fromMultihash(hex)
//       return new PublicKeyRepr(null, hex, checked)
//     } catch (err) {
//       throw new SyntaxError(`Cannot parse PublicKey from "${hex}": ${globalThis.String(err)}`)
//     }
//   }

//   /**
//    * Create from an instance of {@link crypto.PublicKey}
//    */
//   public static fromCrypto(pubkey: crypto.PublicKey): PublicKeyRepr {
//     return new PublicKeyRepr(null, null, pubkey)
//   }

//   /**
//    * Create from an algorithm and payload.
//    *
//    * Throws if the algorithm and payload don't form a valid public key.
//    */
//   public static fromParts(algorithm: Algorithm, payload: BytesVec): PublicKeyRepr {
//     const asCrypto = crypto.PublicKey.fromBytes(algorithm.kind, crypto.Bytes.array(payload))
//     return new PublicKeyRepr({ algorithm, payload }, null, asCrypto)
//   }

//   private _obj: null | PubKeyObj
//   private _hex: null | string = null
//   private _crypto: null | crypto.PublicKey = null

//   private constructor(obj: null | PubKeyObj, hex: null | string, crypto: null | crypto.PublicKey) {
//     this._obj = obj
//     this._hex = hex
//     this._crypto = crypto
//   }

//   public get algorithm(): Algorithm {
//     return this.getOrCreateObj().algorithm
//   }

//   public get payload(): BytesVec {
//     return this.getOrCreateObj().payload
//   }

//   /**
//    * Get as {@link crypto.PublicKey}
//    */
//   public asCrypto(): crypto.PublicKey {
//     if (!this._crypto) {
//       if (this._hex) this._crypto = crypto.PublicKey.fromMultihash(this._hex)
//       else this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
//     }
//     return this._crypto
//   }

//   /**
//    * Get as a public key multihash, i.e. by {@link crypto.PublicKey.toMultihash}
//    */
//   public asHex(): string {
//     if (!this._hex) {
//       if (!this._crypto) {
//         this._crypto = crypto.PublicKey.fromBytes(this._obj!.algorithm.kind, crypto.Bytes.array(this._obj!.payload))
//       }
//       this._hex = this._crypto.toMultihash()
//     }
//     return this._hex
//   }

//   public toJSON(): string {
//     return this.asHex()
//   }

//   public compare(other: PublicKeyRepr): number {
//     return ordCompare(this.asHex(), other.asHex())
//   }

//   private getOrCreateObj(): PubKeyObj {
//     if (!this._obj) {
//       if (!this._crypto) this._crypto = crypto.PublicKey.fromMultihash(this._hex!)
//       this._obj = { algorithm: { kind: this._crypto.algorithm }, payload: this._crypto.payload() }
//     }
//     return this._obj
//   }
// }

// /**
//  * {@link crypto.Signature} representation in the data model.
//  *
//  * It could be created from any representation and transformed into another:
//  *
//  * ```ts
//  * const hex = '01019292afafaaff' // some hex, not real
//  *
//  * const wrap = SignatureWrap.fromHex(hex)
//  * const actualSignature = wrap.asCrypto()
//  * ```
//  */
// export class SignatureRepr {
//   public static [SYMBOL_CODEC]: GenCodec<SignatureRepr> = getCodec(BytesVec).wrap<SignatureRepr>({
//     toBase: (higher) => higher.asRaw(),
//     fromBase: (lower) => SignatureRepr.fromRaw(lower),
//   })

//   /**
//    * Create from a hex string.
//    *
//    * Throws if input is not a valid hex.
//    */
//   public static fromHex(hex: string): SignatureRepr {
//     const raw = decodeHex(hex)
//     return new SignatureRepr(hex, raw, null)
//   }

//   /**
//    * Create from an instance of {@link crypto.Signature}.
//    */
//   public static fromCrypto(signature: crypto.Signature): SignatureRepr {
//     return new SignatureRepr(null, null, signature)
//   }

//   /**
//    * Create from an array of bytes.
//    */
//   private static fromRaw(bytes: Uint8Array): SignatureRepr {
//     return new SignatureRepr(null, bytes, null)
//   }

//   private _hex: null | string
//   private _raw: null | Uint8Array
//   private _crypto: null | crypto.Signature

//   private constructor(hex: null | string, raw: null | Uint8Array, crypto: null | crypto.Signature) {
//     this._hex = hex
//     this._raw = raw
//     this._crypto = crypto
//   }

//   /**
//    * Representation as {@link crypto.Signature}.
//    */
//   public asCrypto(): crypto.Signature {
//     if (!this._crypto) {
//       if (this._raw) this._crypto = crypto.Signature.fromRaw(crypto.Bytes.array(this._raw))
//       else this._crypto = crypto.Signature.fromRaw(crypto.Bytes.hex(this._hex!))
//     }
//     return this._crypto
//   }

//   /**
//    * Representation as a hex string.
//    */
//   public asHex(): string {
//     if (!this._hex) {
//       if (this._raw) this._hex = encodeHex(this._raw)
//       else this._hex = this._crypto!.payload('hex')
//     }
//     return this._hex
//   }

//   public toJSON(): string {
//     return this.asHex()
//   }

//   /**
//    * Representation as raw bytes.
//    */
//   private asRaw(): Uint8Array {
//     if (!this._raw) {
//       // only if created from crypto
//       this._raw = this._crypto!.payload()
//     }
//     return this._raw
//   }
// }

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
export class Name implements Ord<Name> {
  public static [SYMBOL_CODEC]: GenCodec<Name> = getCodec(String)
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

  public toJSON(): string {
    return this.value
  }

  public compare(other: Name): number {
    return this.value > other.value ? 1 : this.value < other.value ? -1 : 0
  }
}

export type DomainId = Name
export const DomainId = Name

export class AccountId implements Ord<AccountId> {
  public static [SYMBOL_CODEC]: GenCodec<AccountId> = structCodec<{
    signatory: crypto.PublicKey
    domain: DomainId
  }>(['domain', 'signatory'], {
    domain: getCodec(DomainId),
    signatory: getCodec(crypto.PublicKey),
  }).wrap<AccountId>({ fromBase: (x) => new AccountId(x.signatory, x.domain), toBase: (x) => x })

  /**
   * Parses account id from a string in a form of `<signature>@<domain>`.
   *
   * Throws an error if the string is not a valid account id.
   */
  public static parse(str: string): AccountId {
    return accountIdFromStr(str)
  }

  public readonly signatory: crypto.PublicKey
  public readonly domain: DomainId

  public constructor(signatory: crypto.PublicKey, domain: DomainId) {
    this.signatory = signatory
    this.domain = domain
  }

  public toJSON(): string {
    return this.toString()
  }

  /**
   * String representation of an account id, as described in {@link AccountId.parse}.
   */
  public toString(): string {
    return `${this.signatory.multihash()}@${this.domain.value satisfies string}`
  }

  public compare(that: AccountId): number {
    const domains = ordCompare(this.domain, that.domain)
    if (domains !== 0) return domains
    return ordCompare(this.signatory, that.signatory)
  }
}

function accountIdFromObj({ signatory, domain }: { signatory: string; domain: string }): AccountId {
  return new AccountId(crypto.PublicKey.fromMultihash(signatory), new Name(domain))
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
  public static [SYMBOL_CODEC]: GenCodec<AssetDefinitionId> = structCodec<{
    name: Name
    domain: DomainId
  }>(['domain', 'name'], {
    domain: getCodec(DomainId),
    name: getCodec(Name),
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
  public static [SYMBOL_CODEC]: GenCodec<AssetId> = structCodec<{
    account: AccountId
    definition: AssetDefinitionId
  }>(['account', 'definition'], {
    account: getCodec(AccountId),
    definition: getCodec(AssetDefinitionId),
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

  public toJSON(): string {
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
