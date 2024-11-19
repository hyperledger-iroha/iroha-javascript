import * as scale from '@scale-codec/core'
import { z } from 'zod'
import { type Codec, EnumCodec, codec, enumCodec, lazyCodec, structCodec } from '../core'
import type { JsonValue } from 'type-fest'
import { parseHex } from '../util'
import * as crypto from '@iroha2/crypto-core'

export type U8 = z.infer<typeof U8$schema>

export const U8 = (int: z.input<typeof U8$schema>) => U8$schema.parse(int)

export const U8$schema = z
  .number()
  .min(0)
  .max(2 ** 8)
  .brand('U8')

export const U8$codec: Codec<U8> = codec(scale.encodeU8 as scale.Encode<U8>, scale.decodeU8 as scale.Decode<U8>)

export type U16 = z.infer<typeof U16$schema>

export const U16 = (int: z.input<typeof U16$schema>) => U16$schema.parse(int)

export const U16$schema = z
  .number()
  .min(0)
  .max(2 ** 16)
  .brand('U16')

export const U16$codec: Codec<U16> = codec(scale.encodeU16 as scale.Encode<U16>, scale.decodeU16 as scale.Decode<U16>)

export type U32 = z.infer<typeof U32$schema>

export const U32 = (int: z.input<typeof U32$schema>) => U32$schema.parse(int)

export const U32$schema = z
  .number()
  .min(0)
  .max(2 ** 32)
  .brand('U32')

export const U32$codec: Codec<U32> = codec(scale.encodeU32 as scale.Encode<U32>, scale.decodeU32 as scale.Decode<U32>)

export type U64 = z.infer<typeof U64$schema>

export const U64 = (int: z.input<typeof U64$schema>) => U64$schema.parse(int)

export const U64$schema = z
  .bigint()
  .or(z.number().pipe(z.coerce.bigint()))
  .pipe(
    z
      .bigint()
      .min(0n)
      .max(2n ** 64n),
  )
  .brand('U64')

export const U64$codec: Codec<U64> = codec(scale.encodeU64 as scale.Encode<U64>, scale.decodeU64 as scale.Decode<U64>)

export type U128 = z.infer<typeof U128$schema>

export const U128 = (int: z.input<typeof U128$schema>) => U128$schema.parse(int)

export const U128$schema = z
  .bigint()
  .or(z.number().pipe(z.coerce.bigint()))
  .pipe(
    z
      .bigint()
      .min(0n)
      .max(2n ** 128n),
  )
  .brand('U128')

export const U128$codec: Codec<U128> = codec(
  scale.encodeU128 as scale.Encode<U128>,
  scale.decodeU128 as scale.Decode<U128>,
)

export const hex$schema = z.string().transform((hex) => Uint8Array.from(parseHex(hex)))

export type BytesVec = Uint8Array

export const BytesVec = (input: z.input<typeof BytesVec$schema>): BytesVec => BytesVec$schema.parse(input)

export const BytesVec$schema = z.instanceof(Uint8Array).or(hex$schema)

export const BytesVec$codec: Codec<BytesVec> = codec(scale.encodeUint8Vec, scale.decodeUint8Vec)

export type Bool = boolean

export const Bool$codec = codec(scale.encodeBool, scale.decodeBool)

export type String = string

export const String$codec: Codec<string> = codec(scale.encodeStr, scale.decodeStr)

export type Compact = z.infer<typeof Compact$schema>

export const Compact = (input: z.input<typeof Compact$schema>): Compact => Compact$schema.parse(input)

// TODO: specify max?
export const Compact$schema = z.bigint().min(0n).brand('Compact')

export const Compact$codec: Codec<Compact> = codec(
  scale.encodeCompact as scale.Encode<Compact>,
  scale.decodeCompact as scale.Decode<Compact>,
)

export type NonZero<T extends number | bigint> = T & z.BRAND<'NonZero'>

export const NonZero$schema = <T extends z.ZodType<number | bigint>>(int: T) => {
  return int.brand<'NonZero'>()
}

NonZero$schema(U32$schema)
NonZero$schema(U64$schema)

export const NonZero$codec = <T extends number | bigint>(int: Codec<T>): Codec<NonZero<T>> => {
  return int as Codec<NonZero<T>>
}

export type Option<T> = null | { Some: T }

export const Option$schema = <T extends z.ZodType>(some: T) =>
  z
    .null()
    .or(z.object({ Some: some }))
    .default(null)

export const Option$codec = <T>(some: Codec<T>): Codec<Option<T>> => {
  return new EnumCodec(scale.createOptionEncoder(some.rawEncode), scale.createOptionDecoder(some.rawDecode)).wrap(
    (value) => (value ? scale.variant('Some', value.Some) : scale.variant('None')),
    (value) => (value.tag === 'None' ? null : { Some: value.content }),
  )
}

export type Map<K, V> = globalThis.Map<K, V>

export const Map$schema = <K extends z.ZodType, V extends z.ZodType>(key: K, value: V) =>
  z.map(key, value).default(new globalThis.Map())

export const Map$codec = <K, V>(key: Codec<K>, value: Codec<V>): Codec<Map<K, V>> =>
  codec(scale.createMapEncoder(key.rawEncode, value.rawEncode), scale.createMapDecoder(key.rawDecode, value.rawDecode))

export type Vec<T> = globalThis.Array<T>

export const Vec$schema = <T extends z.ZodType>(item: T) => z.array(item).default(() => [])

export const Vec$codec = <T>(item: Codec<T>): Codec<T[]> =>
  codec(scale.createVecEncoder(item.rawEncode), scale.createVecDecoder(item.rawDecode))

export type U8Array<_T extends number> = globalThis.Uint8Array

export const U8Array$schema = (length: number) =>
  z
    .instanceof(Uint8Array)
    .refine((arr) => arr.length === length, { message: `Uint8Array length should be exactly ${length}` })

export const U8Array$codec = (length: number) =>
  codec(scale.createUint8ArrayEncoder(length), scale.createUint8ArrayDecoder(length))

// TODO document that parse/stringify json lazily when needed
export class Json<T extends JsonValue = JsonValue> {
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

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.union([z.string(), z.number(), z.boolean(), z.null()]),
    z.array(jsonValueSchema),
    z.record(jsonValueSchema),
  ]),
)

export const Json$schema = z.instanceof(Json).or(jsonValueSchema.transform((value) => Json.fromValue(value)))

export const Json$codec: Codec<Json> = String$codec.wrap(
  (json) => json.asJsonString(),
  (str) => Json.fromJsonString(str),
)

export class Timestamp {
  public static fromDate(value: Date): Timestamp {
    return new Timestamp(U64(value.getTime()))
  }

  public static fromMilliseconds(value: U64): Timestamp {
    return new Timestamp(value)
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

export const Timestamp$schema = z
  .instanceof(Timestamp)
  .or(z.date().transform((x) => Timestamp.fromDate(x)))
  .or(U64$schema.transform((x) => Timestamp.fromMilliseconds(x)))

export const Timestamp$codec = U64$codec.wrap<Timestamp>(
  (value) => value.asMilliseconds(),
  (value) => Timestamp.fromMilliseconds(value),
)

export { Timestamp as TimestampU128 }

export type Duration = z.infer<typeof Duration$schema>

export const Duration = (input: z.input<typeof Duration$schema>): Duration => Duration$schema.parse(input)

export const Duration$schema = U64$schema.brand('DurationMilliseconds')

export const Duration$codec = U64$codec.wrap<Duration>(
  (x) => x,
  (x) => Duration(x),
)

export type Name = z.infer<typeof Name$schema>
export const Name = (input: z.input<typeof Name$schema>): Name => Name$schema.parse(input)
export const Name$schema = z
  .string()
  .brand<'Name'>()
  .superRefine((value, ctx) => {
    if (!value.length) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'empty name is not allowed' })
    if (/[\s#@]/.test(value))
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'name should not contain whitespace characters, ' +
          '`@` (reserved for `account@domain` constructs), ' +
          'and `#` (reserved for `asset#domain` constructs)',
      })
  })
export const Name$codec = String$codec as Codec<Name>

export type CompoundPredicate<Atom> =
  | { t: 'Atom'; value: Atom }
  | { t: 'Not'; value: CompoundPredicate<Atom> }
  | { t: 'And' | 'Or'; value: CompoundPredicate<Atom>[] }

export type CompoundPredicate$input<Atom> =
  | { t: 'Atom'; value: Atom }
  | { t: 'Not'; value: CompoundPredicate<Atom> }
  | { t: 'And' | 'Or'; value: CompoundPredicate<Atom>[] }

export const CompoundPredicate$schema = <Atom extends z.ZodType>(
  atom: Atom,
): z.ZodType<CompoundPredicate<z.output<Atom>>, z.ZodTypeDef, CompoundPredicate$input<z.input<Atom>>> => {
  return z.discriminatedUnion('t', [
    z.object({ t: z.literal('Atom'), value: atom }),
    z.object({ t: z.literal('Not'), value: z.lazy(() => CompoundPredicate$schema(atom)) }),
    z.object({ t: z.literal('And'), value: z.array(z.lazy(() => CompoundPredicate$schema(atom))) }),
    z.object({ t: z.literal('Or'), value: z.array(z.lazy(() => CompoundPredicate$schema(atom))) }),
  ]) as any
}

export const CompoundPredicate$codec = <Atom>(atom: Codec<Atom>): Codec<CompoundPredicate<Atom>> => {
  const self: Codec<CompoundPredicate<Atom>> = enumCodec<{
    Atom: [Atom]
    Not: [CompoundPredicate<Atom>]
    And: [CompoundPredicate<Atom>[]]
    Or: [CompoundPredicate<Atom>[]]
  }>([
    [0, 'Atom', atom],
    [1, 'Not', lazyCodec(() => self)],
    [2, 'And', Vec$codec(lazyCodec(() => self))],
    [3, 'Or', Vec$codec(lazyCodec(() => self))],
  ]).discriminated()

  return self
}

// Crypto specials

// TODO: make first-class integration with crypto

export function parseMultihashPublicKey(hex: string, ctx: z.RefinementCtx) {
  let key: crypto.PublicKey
  try {
    key = crypto.PublicKey.fromMultihash(hex)
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Failed to parse PublicKey from a multihash hex: ${err}\n\n invalid input: "${hex}"`,
    })
    return z.NEVER
  }
  const result = { algorithm: key.algorithm, payload: key.payload() }
  key.free()
  return result
}

export type Algorithm = z.infer<typeof Algorithm$schema>
export const Algorithm = (input: z.input<typeof Algorithm$schema>): Algorithm => Algorithm$schema.parse(input)
export const Algorithm$schema = z.union([
  z.literal('ed25519'),
  z.literal('secp256k1'),
  z.literal('bls_normal'),
  z.literal('bls_small'),
])
export const Algorithm$codec: Codec<Algorithm> = enumCodec<{
  ed25519: []
  secp256k1: []
  bls_normal: []
  bls_small: []
}>([
  [0, 'ed25519'],
  [1, 'secp256k1'],
  [2, 'bls_normal'],
  [3, 'bls_small'],
]).literalUnion()

export type Hash = Uint8Array

export const Hash$schema = z
  .instanceof(crypto.Hash)
  .transform((x) => x.payload())
  .or(U8Array$schema(32).or(hex$schema))

export const Hash$codec = U8Array$codec(32)

// export class PublicKey {
//   public readonly algorithm
// }
export class PublicKey {
  public readonly algorithm: Algorithm
  public readonly payload: BytesVec

  public constructor(algorithm: Algorithm, payload: BytesVec) {
    this.algorithm = algorithm
    this.payload = payload
  }

  public toMultihash() {
    return crypto.freeScope(() =>
      crypto.PublicKey.fromRaw(this.algorithm, crypto.Bytes.array(this.payload)).toMultihash(),
    )
  }

  public toJSON() {
    return this.toMultihash
  }
}

const pubKeyObj = z
  .object({ algorithm: Algorithm$schema, payload: BytesVec$schema })
  .transform((x) => new PublicKey(x.algorithm, x.payload))
export const PublicKey$schema = pubKeyObj
  .or(z.string().transform(parseMultihashPublicKey).pipe(pubKeyObj))
  .or(z.instanceof(crypto.PublicKey).transform((x) => new PublicKey(x.algorithm, x.payload())))

export const PublicKey$codec = structCodec<PublicKey>([
  ['algorithm', lazyCodec(() => Algorithm$codec)],
  ['payload', BytesVec$codec],
])

export type Signature = z.infer<typeof Signature$schema>
export const Signature$schema = BytesVec$schema.or(
  z
    .instanceof(crypto.Signature)
    .transform((x) => x.payload())
    .pipe(BytesVec$schema),
).brand<'Signature'>()
export const Signature$codec = BytesVec$codec as Codec<Signature>

// higher-level types for IDs

function parseAccountId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('@')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'account id should have format `signatory@domain`' })
    return z.NEVER
  }
  const [signatory, domain] = parts
  return { signatory, domain }
}

function parseAssetDefinitionId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('#')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'asset definition id should have format `name#domain`' })
    return z.NEVER
  }
  const [name, domain] = parts
  return { name, domain }
}

/**
 * Parses either `asset##account@domain` or `asset#domain1#account@domain2`
 */
function parseAssetId(str: string, ctx: z.RefinementCtx) {
  const match = str.match(/^(.+)#(.+)?#(.+)@(.+)$/)
  if (!match) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'asset id should have format `asset#asset_domain#account@account_domain` ' +
        'or `asset##account@domain` (when asset & account domain are the same)',
    })
    return z.NEVER
  }
  const [, asset, domain1, account, domain2] = match
  // TODO
  return {
    account: { signatory: account, domain: domain2 },
    definition: { domain: domain1 ?? domain2, name: asset },
  }
}

export type DomainId = z.infer<typeof DomainId$schema>
export const DomainId = (input: z.input<typeof DomainId$schema>): DomainId => DomainId$schema.parse(input)
export const DomainId$schema = Name$schema.brand<'DomainId'>()
export const DomainId$codec = Name$codec as Codec<DomainId>

export class AccountId {
  public static parse(raw: z.input<typeof AccountId$schema>): AccountId {
    return AccountId$schema.parse(raw)
  }

  public readonly signatory: PublicKey
  public readonly domain: DomainId

  public constructor(signatory: PublicKey, domain: DomainId) {
    this.signatory = signatory
    this.domain = domain
  }

  public toJSON() {
    // const multihash = freeScope(() => crypto.PublicKey.fromRaw(this.signatory.))
    return `${this.signatory.toMultihash()}@${this.domain}`
  }

  // public toString(): string {}
}

const accountIdObject = z
  .object({
    signatory: PublicKey$schema,
    domain: DomainId$schema,
  })
  .transform(({ signatory, domain }) => new AccountId(signatory, domain))

export const AccountId$schema = accountIdObject.or(
  z
    .string()
    .transform((str, ctx) => parseAccountId(str, ctx))
    .pipe(accountIdObject),
)

export const AccountId$codec = structCodec<{ signatory: PublicKey; domain: DomainId }>([
  ['domain', DomainId$codec],
  ['signatory', PublicKey$codec],
]).wrap<AccountId>(
  (higher) => higher,
  (lower) => new AccountId(lower.signatory, lower.domain),
)

export class AssetDefinitionId {
  public static parse(input: z.input<typeof AssetDefinitionId$schema>): AssetDefinitionId {
    return AssetDefinitionId$schema.parse(input)
  }

  public readonly name: Name
  public readonly domain: DomainId

  public constructor(name: Name, domain: DomainId) {
    this.name = name
    this.domain = domain
  }

  // public toString(): string {}
}

const assetDefinitionObject = z
  .object({
    name: Name$schema,
    domain: DomainId$schema,
  })
  .transform(({ name, domain }) => new AssetDefinitionId(name, domain))

export const AssetDefinitionId$schema = assetDefinitionObject.or(
  z
    .string()
    .transform((str, ctx) => parseAssetDefinitionId(str, ctx))
    .pipe(assetDefinitionObject),
)

export const AssetDefinitionId$codec = structCodec<{ name: Name; domain: DomainId }>([
  ['domain', DomainId$codec],
  ['name', Name$codec],
]).wrap<AssetDefinitionId>(
  (higher) => higher,
  (lower) => new AssetDefinitionId(lower.name, lower.domain),
)

export class AssetId {
  // /**
  //  * Parses a stringified ID in a form of either
  //  *
  //  * - `asset#domain#account@domain`
  //  * - `asset##account@domain`
  //  */
  // public static parse(id: string): {
  //   return
  // }

  public readonly account: AccountId
  public readonly definition: AssetDefinitionId

  public constructor(account: AccountId, definition: AssetDefinitionId) {
    this.account = account
    this.definition = definition
  }

  // /**
  //  * Produce a stringified ID, see {@link parse}.
  //  */
  // public toString(): string {}
}

const assetIdObject = z
  .object({
    account: AccountId$schema,
    definition: AssetDefinitionId$schema,
  })
  .transform((lower) => new AssetId(lower.account, lower.definition))

export const AssetId$schema = assetIdObject.or(
  z
    .string()
    .transform((str, ctx) => parseAssetId(str, ctx))
    .pipe(assetIdObject),
)

export const AssetId$codec = structCodec<{ account: AccountId; definition: AssetDefinitionId }>([
  ['account', AccountId$codec],
  ['definition', AssetDefinitionId$codec],
]).wrap<AssetId>(
  (higher) => higher,
  (lower) => new AssetId(lower.account, lower.definition),
)
