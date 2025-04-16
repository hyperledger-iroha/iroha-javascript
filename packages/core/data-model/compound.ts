import * as crypto from '../crypto/mod.ts'
import type { JsonValue } from 'type-fest'
import { enumCodec, type GenCodec, getCodec, lazyCodec, structCodec, SYMBOL_CODEC } from '../codec.ts'
import { type IsZero, type Ord, ordCompare } from '../traits.ts'
import type { Variant } from '../util.ts'
import { Compact, String, U64, Vec } from './primitives.ts'

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

/**
 * Convenience wrapper around `u64` numbers representing durations.
 */
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

/**
 * Convenience wrapper around `Compact` integers representing durations.
 */
export class DurationCompact implements IsZero {
  public static [SYMBOL_CODEC]: GenCodec<DurationCompact> = getCodec(Compact).wrap({
    fromBase: (x) => DurationCompact.fromMillis(x),
    toBase: (y) => y.asMillis(),
  })

  public static fromMillis(ms: number | bigint): DurationCompact {
    return new DurationCompact(BigInt(ms))
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

/**
 * Name is a simple wrap around string that ensures that it
 * doesn't contain whitespaces characters, `@`, and `#`.
 *
 * @example
 * ```ts
 * import { assertEquals, assertThrows } from '@std/assert'
 *
 * const name1 = new Name('alice')
 * assertEquals(name1.value, 'alice')
 *
 * assertThrows(() => new Name('alice and bob')) // Error: whitespace characters.
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
          `"@" (reserved for "⟨signatory⟩@⟨domain⟩" constructs, e.g. "ed....@wonderland"), ` +
          `and "#" (reserved for "⟨asset⟩#⟨domain⟩" constructs, e.g. "rose#wonderland") `,
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
  private __brand!: 'AccountId'

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
    throw new SyntaxError(`AccountId should have format "⟨signatory⟩@⟨domain⟩", got: "${str}"`)
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
  private __brand!: 'AssetDefinitionId'

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
      `AssetDefinitionId should have format "⟨name⟩#⟨domain⟩", e.g. "rose#wonderland", got "${input}"`,
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
  private __brand!: 'AssetId'

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
      `AssetId should have format "⟨name⟩#⟨asset domain⟩#⟨account signatory⟩@⟨account domain⟩" ` +
        `or "⟨name⟩##⟨account signatory⟩@⟨account domain⟩" (when asset and account domains are the same), got "${input}"`,
    )
  }
  const [, asset, domain1, account, domain2] = match
  return new AssetId(
    accountIdFromObj({ signatory: account, domain: domain2 }),
    assetDefIdFromObj({ name: asset, domain: domain1 ?? domain2 }),
  )
}

/**
 * Identification of Non-Fungible Token (asset).
 */
export class NftId {
  public static [SYMBOL_CODEC]: GenCodec<NftId> = structCodec(['domain', 'name'], {
    domain: getCodec(DomainId),
    name: getCodec(Name),
  }).wrap<NftId>({ toBase: (x) => x, fromBase: (x) => new NftId(x.name, x.domain) })

  /**
   * Parse NFT ID from its string representation.
   *
   * @example
   * ```ts
   * import { assertEquals } from '@std/assert'
   *
   * const id = NftId.parse('nft$domain')
   *
   * assertEquals(id.name.value, 'nft')
   * assertEquals(id.domain.value, 'domain')
   * ```
   */
  public static parse(str: string): NftId {
    const parts = str.split('$')
    if (parts.length !== 2) {
      throw new SyntaxError(
        `NfdId should have format "⟨name⟩$⟨domain⟩", e.g. "nft$domain", got "${str}"`,
      )
    }
    const [name, domain] = parts
    return new NftId(new Name(name), new DomainId(domain))
  }

  public readonly domain: DomainId
  public readonly name: Name
  private __brand!: 'NftId'

  public constructor(name: Name, domain: DomainId) {
    this.domain = domain
    this.name = name
  }

  /**
   * Returns string representation of NFT ID.
   *
   * @example
   * ```ts
   * import { assertEquals } from '@std/assert'
   *
   * const id = new NftId(new Name('nft'), new DomainId('domain'))
   *
   * assertEquals(id.toString(), 'nft$domain')
   * ```
   */
  public toString(): string {
    return `${this.name.value}$${this.domain.value}`
  }

  public toJSON(): string {
    return this.toString()
  }
}
