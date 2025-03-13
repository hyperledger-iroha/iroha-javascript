/**
 * Port of `iroha_crypto` into WebAssembly.
 *
 * ## Compatibility
 *
 * Compatible with all runtimes.
 *
 * Since `0.3.0`, the `.wasm` blob __is inlined__. Therefore, it is compatible with any
 * runtime that supports {@linkcode WebAssembly} (e.g. see
 * [compatibility on MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Instance/Instance#browser_compatibility)).
 *
 * This wasn't the case for `0.2.0`: it relied on `.wasm` ES Module Imports, which isn't widely supported (yet).
 *
 * @example Deriving a KeyPair from seed
 * ```ts
 * import { Bytes } from '@iroha/core/crypto'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const kp = KeyPair.deriveFromSeed(Bytes.hex('001122'))
 *
 * assertEquals(kp.privateKey().multihash(), '8026205720A4B3BFFA5C9BBD83D09C88CD1DB08CA3F0C302EC4C8C37A26BD734C37616')
 * ```
 *
 * @example Constructing a private key from a multihash
 * ```ts
 * import { assertEquals } from '@std/assert/equals'
 *
 * const pk = PrivateKey.fromMultihash('8026205720A4B3BFFA5C9BBD83D09C88CD1DB08CA3F0C302EC4C8C37A26BD734C37616')
 *
 * assertEquals(pk.algorithm, 'ed25519')
 * ```
 *
 * @module
 */

import { Bytes } from './util.ts'
import { type CodecContainer, defineCodec, getCodec, SYMBOL_CODEC } from '../codec.ts'
import { type Ord, ordCompare } from '../traits.ts'
import { enumCodec, GenCodec, structCodec } from '../codec.ts'
import * as scale from '@scale-codec/core'
import { BytesVec } from '../data-model/primitives.ts'
import * as wasm from './wasm/iroha_crypto_wasm.js'

export { Bytes }

/**
 * Crypto alrogithms supported by Iroha.
 */
export type Algorithm = wasm.Algorithm

const AlgorithmCodec: CodecContainer<Algorithm> = defineCodec(
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
  }).literalUnion(),
)

export const Algorithm: Record<Algorithm, Algorithm> & { default: () => Algorithm } & CodecContainer<Algorithm> = {
  ed25519: 'ed25519' as const,
  secp256k1: 'secp256k1' as const,
  bls_normal: 'bls_normal' as const,
  bls_small: 'bls_small' as const,
  default: (): Algorithm => wasm.algorithm_default(),
  ...AlgorithmCodec,
}

export interface HasAlgorithm {
  readonly algorithm: Algorithm
}

export interface HasPayload {
  readonly payload: Bytes
}

const HASH_ARR_LEN = 32

/**
 * Cryptographic hash used in Iroha.
 */
export class Hash {
  public static [SYMBOL_CODEC]: GenCodec<Hash> = new GenCodec({
    encode: scale.createUint8ArrayEncoder(HASH_ARR_LEN),
    decode: scale.createUint8ArrayDecoder(HASH_ARR_LEN),
  }).wrap<Hash>({
    fromBase: (lower) => Hash.fromRaw(Bytes.array(lower)),
    toBase: (higher) => higher.payload.array(),
  })

  /**
   * Create an hash filled with zeros.
   */
  public static zeroed(): Hash {
    return new Hash(wasm.Hash.zeroed(), null)
  }

  /**
   * Create by hashing the input.
   * @param input the input to hash
   * @returns the resulting hash
   */
  public static hash(input: Bytes): Hash {
    const repr = input.repr
    const inner = (repr.t === 'hex') ? wasm.Hash.hash_hex(repr.hex) : wasm.Hash.hash(repr.array)
    return new Hash(inner, input)
  }

  public static fromRaw(payload: Bytes): Hash {
    return new Hash(null, payload)
  }

  #wasm: null | wasm.Hash
  #bytes: null | Bytes

  private constructor(wasm: null | wasm.Hash, bytes: Bytes | null) {
    this.#wasm = wasm
    this.#bytes = bytes
  }

  public get payload(): Bytes {
    if (this.#bytes) return this.#bytes
    return Bytes.array(this.#wasm!.payload())
  }
}

/**
 * Private key used in Iroha.
 */
export class PrivateKey implements HasAlgorithm, HasPayload {
  /**
   * Create from a multihash string.
   */
  public static fromMultihash(multihash: string): PrivateKey {
    return new PrivateKey(
      wasm.PrivateKey.from_multihash_hex(multihash),
    )
  }

  public static fromKeyPair(pair: KeyPair): PrivateKey {
    return new PrivateKey(pair.wasm.private_key())
  }

  public static fromParts(algorithm: Algorithm, payload: Bytes): PrivateKey {
    const repr = payload.repr
    const inner = (repr.t === 'hex')
      ? wasm.PrivateKey.from_raw_hex(algorithm, repr.hex)
      : wasm.PrivateKey.from_raw(algorithm, repr.array)
    return new PrivateKey(inner)
  }

  #wasm: wasm.PrivateKey

  private constructor(wasm: wasm.PrivateKey) {
    this.#wasm = wasm
  }

  public get algorithm(): Algorithm {
    return this.#wasm.algorithm
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }

  public multihash(): string {
    return this.#wasm.to_multihash_hex()
  }

  public sign(message: Bytes): Signature {
    return Signature.create(this, message)
  }

  /**
   * @internal
   */
  public get wasm(): wasm.PrivateKey {
    return this.#wasm
  }
}

export class PublicKey implements HasAlgorithm, HasPayload, Ord<PublicKey> {
  public static [SYMBOL_CODEC]: GenCodec<PublicKey> = structCodec(['algorithm', 'payload'], {
    algorithm: getCodec(Algorithm),
    payload: getCodec(BytesVec).wrap<Bytes>({ toBase: (x) => x.array(), fromBase: (x) => Bytes.array(x) }),
  }).wrap<PublicKey>({
    toBase: (higher) => higher,
    fromBase: (x) => PublicKey.fromParts(x.algorithm, x.payload),
  })

  public static fromMultihash(multihash: string): PublicKey {
    const key = wasm.PublicKey.from_multihash_hex(multihash)
    return new PublicKey(key)
  }

  public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
    const key = wasm.PublicKey.from_private_key(privateKey.wasm)
    return new PublicKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PublicKey {
    return new PublicKey(pair.wasm.public_key())
  }

  public static fromParts(algorithm: Algorithm, payload: Bytes): PublicKey {
    const repr = payload.repr
    const inner = (repr.t === 'hex')
      ? wasm.PublicKey.from_raw_hex(algorithm, repr.hex)
      : wasm.PublicKey.from_raw(algorithm, repr.array)
    return new PublicKey(inner)
  }

  #wasm: wasm.PublicKey

  private constructor(wasm: wasm.PublicKey) {
    this.#wasm = wasm
  }

  public get algorithm(): Algorithm {
    return this.#wasm.algorithm
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }

  public get wasm(): wasm.PublicKey {
    return this.#wasm
  }

  public multihash(): string {
    return this.#wasm.to_multihash_hex()
  }

  public verifySignature(signature: Signature, message: Bytes) {
    signature.verify(this, message)
  }

  public compare(other: PublicKey): number {
    return ordCompare(this.multihash(), other.multihash())
  }
}

export interface KeyGenOptions {
  /**
   * Cryptographic algorithm to use in key pair generation.
   *
   * @default 'ed25519'
   */
  algorithm?: Algorithm
}

export class KeyPair implements HasAlgorithm {
  /**
   * Generate a random key pair.
   */
  public static random(options?: KeyGenOptions): KeyPair {
    const pair = wasm.KeyPair.random(options?.algorithm)
    return new KeyPair(pair)
  }

  /**
   * Derive the key pair from the given seed.
   * @param seed some binary data.
   * @param options key generation options
   */
  public static deriveFromSeed(seed: Bytes, options?: KeyGenOptions): KeyPair {
    const algorithm = options?.algorithm
    const repr = seed.repr
    const inner = (repr.t === 'hex')
      ? wasm.KeyPair.derive_from_seed_hex(repr.hex, algorithm)
      : wasm.KeyPair.derive_from_seed(repr.array, algorithm)
    return new KeyPair(inner)
  }

  public static deriveFromPrivateKey(private_key: PrivateKey): KeyPair {
    const pair = wasm.KeyPair.derive_from_private_key(private_key.wasm)
    return new KeyPair(pair)
  }

  public static fromParts(publicKey: PublicKey, privateKey: PrivateKey): KeyPair {
    return new KeyPair(wasm.KeyPair.from_parts(publicKey.wasm, privateKey.wasm))
  }

  #wasm: wasm.KeyPair

  private constructor(wasm: wasm.KeyPair) {
    this.#wasm = wasm
  }

  public get algorithm(): Algorithm {
    return this.#wasm.algorithm
  }

  public privateKey(): PrivateKey {
    return PrivateKey.fromKeyPair(this)
  }

  public publicKey(): PublicKey {
    return PublicKey.fromKeyPair(this)
  }

  /**
   * @internal
   */
  public get wasm(): wasm.KeyPair {
    return this.#wasm
  }
}

export class Signature implements HasPayload {
  public static [SYMBOL_CODEC]: GenCodec<Signature> = getCodec(BytesVec).wrap<Signature>({
    toBase: (higher) => higher.payload.array(),
    fromBase: (lower) => Signature.fromRaw(Bytes.array(lower)),
  })

  /**
   * Create a signature from its payload and public key. This function **does not sign the payload**.
   */
  public static fromRaw(payload: Bytes): Signature {
    const repr = payload.repr
    const inner = (repr.t === 'hex') ? wasm.Signature.from_raw_hex(repr.hex) : wasm.Signature.from_raw(repr.array)
    return new Signature(inner)
  }

  /**
   * Creates an actual signature, signing the payload with the given private key
   */
  public static create(privateKey: PrivateKey, payload: Bytes): Signature {
    const repr = payload.repr
    const inner = (repr.t === 'hex')
      ? wasm.Signature.sign_hex(privateKey.wasm, repr.hex)
      : wasm.Signature.sign(privateKey.wasm, repr.array)
    return new Signature(inner)
  }

  #wasm: wasm.Signature

  private constructor(wasm: wasm.Signature) {
    this.#wasm = wasm
  }

  /**
   * Verify that this signature is produced for the given payload by the given key (its public part)
   */
  public verify(publicKey: PublicKey, payload: Bytes) {
    const repr = payload.repr
    repr.t === 'hex' ? this.#wasm.verify_hex(publicKey.wasm, repr.hex) : this.#wasm.verify(publicKey.wasm, repr.array)
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }
}
