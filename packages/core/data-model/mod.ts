/**
 * Iroha data model - types and codecs.
 *
 * It is based on the `schema.json` generated by Iroha. The schema itself is also available,
 * see the {@linkcode [data-model/schema]} and {@linkcode [data-model/schema-json]} modules.
 *
 * ## Encoding
 *
 * Each data model type has a codec to encode/decode it from [SCALE representation](https://docs.substrate.io/reference/scale-codec/)
 * (a simple binary format).
 *
 * For example, here is how to encode and decode a {@linkcode BlockStatus}:
 *
 * ```ts
 * import { getCodec } from '@iroha/core'
 * import * as types from '@iroha/core/data-model'
 * import { assertEquals } from '@std/assert/equals'
 * import { encodeHex } from '@std/encoding/hex'
 *
 * const value = types.BlockStatus.Rejected.ConsensusBlockRejection
 *
 * const encoded: Uint8Array = getCodec(types.BlockStatus).encode(value)
 * assertEquals(encodeHex(encoded), '0200')
 *
 * const decoded = getCodec(types.BlockStatus).decode(encoded)
 * assertEquals(decoded, value)
 * ```
 *
 * ## Enumerations
 *
 * The data model contains many enumeration (i.e. discriminated unions), represented either as {@linkcode Variant}
 * (`kind` + `value`) or {@linkcode VariantUnit} (just `kind`). An example of it is {@linkcode AssetType}:
 *
 * ```ts
 * import * as types from '@iroha/core/data-model'
 *
 * const repeats1: types.Repeats = { kind: 'Indefinitely' }
 * const repeats2: types.Repeats = { kind: 'Exactly', value: 5 }
 * ```
 *
 * Alternatively, enums could be constructed with pre-generated constructors, which makes it less verbose:
 *
 * ```ts
 * import * as types from '@iroha/core/data-model'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const repeats1 = types.Repeats.Indefinitely
 * const repeats2 = types.Repeats.Exactly(5)
 *
 * assertEquals(repeats1, { kind: 'Indefinitely' })
 * assertEquals(repeats2, { kind: 'Exactly', value: 5 })
 * ```
 *
 * Constructors approach is especially useful when it comes to enums nested into each other, e.g. {@link Parameter}:
 *
 * ```ts
 * import * as types from '@iroha/core/data-model'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const value = types.Parameter.Sumeragi.BlockTime(
 *   types.Duration.fromMillis(500)
 * )
 *
 * assertEquals(value, {
 *   kind: "Sumeragi",
 *   value: {
 *     kind: "BlockTime",
 *     value: types.Duration.fromMillis(500)
 *   }
 * })
 * ```
 *
 * @module
 */

export * from './primitives.ts'
export * from './compound.ts'
export * from './types.generated.ts'
export { Hash, KeyPair, PrivateKey, PublicKey, Signature } from '../crypto/mod.ts'
export type { Variant, VariantUnit } from '../util.ts'
