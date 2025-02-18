/**
 * Port of `iroha_crypto` Rust crate via WebAssembly.
 *
 * ### Compatibility
 *
 * This package uses native `.wasm` ES Module imports, **which isn't widely supported yet**.
 * However, there are some tricks in play to increase the compatibility.
 *
 * | Platform | Support | Version | Notes |
 * | - | - | - | - |
 * | Deno | ✅ | 2.1+ or 2.1.5+ | See [notes in `@deno/wasmbuild`](https://github.com/denoland/wasmbuild?tab=readme-ov-file#browser-nodejs-or-older-deno-support). |
 * | Node.js | ✅ | v24.0+, v22.0+, v20.0+ | Uses `import('node:fs')` to make it work. |
 * | Bun | ✅ ❓ | v1.2.2 | Checked only with `v1.2.2` |
 * | Bundlers | ✅ 🚧 | | Requires plugins to support importing `.wasm` (e.g. [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm)). |
 * | Natively in the browser  | ✅ |  | Checked with https://esm.sh |
 * | Cloudflare Workers | ❓ | | Not checked |
 *
 * An example of how this could be used in browser:
 *
 * ```html
 * <script type="module">
 *   import * as types from 'https://esm.sh/jsr/@iroha/core@0.2.0/data-model'
 *   console.log(types.KeyPair.random().publicKey().multihash())
 * </script>
 * ```
 *
 * Useful links:
 *
 * - [Proposal - WebAssembly/ES Module Integration](https://github.com/WebAssembly/esm-integration/tree/main/proposals/esm-integration?rgh-link-date=2025-02-17T23%3A57%3A24.000Z)
 * - [Vite - WebAssembly](https://vite.dev/guide/features#webassembly)
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
import { assert } from '@std/assert/assert'
import { BytesVec } from '../data-model/primitives.ts'
import * as wasm from './wasm.js'

export { Bytes }
export type VerifyResult = wasm.VerifyResult
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
    return new Hash(new (wasm.Hash)(input.asWasmFormat), null)
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
    assert
    return Bytes.hex(this.#wasm!.bytes_hex())
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
    return new PrivateKey(wasm.PrivateKey.from_bytes(algorithm, payload.asWasmFormat))
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
    return new PublicKey(wasm.PublicKey.from_bytes(algorithm, payload.asWasmFormat))
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

  public verifySignature(signature: Signature, message: Bytes): wasm.VerifyResult {
    return signature.verify(this, message)
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
    const pair = wasm.KeyPair.derive_from_seed(seed.asWasmFormat, options?.algorithm)
    return new KeyPair(pair)
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
    return new Signature(wasm.Signature.from_bytes(payload.asWasmFormat))
  }

  /**
   * Creates an actual signature, signing the payload with the given private key
   */
  public static create(privateKey: PrivateKey, payload: Bytes): Signature {
    const value = new (wasm.Signature)(privateKey.wasm, payload.asWasmFormat)
    return new Signature(value)
  }

  #wasm: wasm.Signature

  private constructor(wasm: wasm.Signature) {
    this.#wasm = wasm
  }

  /**
   * Verify that this signature is produced for the given payload by the given key (its public part)
   */
  public verify(publicKey: PublicKey, payload: Bytes): wasm.VerifyResult {
    return this.#wasm.verify(publicKey.wasm, payload.asWasmFormat)
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }
}
