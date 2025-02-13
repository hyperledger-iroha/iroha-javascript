/**
 * @module @iroha/crypto
 */
export * from './types.ts'
export * from './singleton.ts'
export * from './util.ts'

import { Bytes } from './util.ts'
import { getWASM } from './singleton.ts'
import type { wasmPkg } from './types.ts'
import { type CodecContainer, defineCodec, getCodec, type Ord, ordCompare, SYMBOL_CODEC } from '../traits.ts'
import type { VariantUnit } from '../util.ts'
import { enumCodec, GenCodec, structCodec } from '../codec.ts'
import * as scale from '@scale-codec/core'
import type { decodeHex } from '@std/encoding/hex'
import { assert } from '@std/assert/assert'
import { BytesVec } from '../data-model/primitives.ts'

export type VerifyResult = wasmPkg.VerifyResult

/**
 * Crypto alrogithms supported by Iroha.
 */
export type Algorithm = wasmPkg.Algorithm

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

export const Algorithm = {
  ed25519: 'ed25519' as const,
  secp256k1: 'secp256k1' as const,
  bls_normal: 'bls_normal' as const,
  bls_small: 'bls_small' as const,
  default: (): Algorithm => getWASM(true).algorithm_default(),
  ...AlgorithmCodec,
} satisfies Record<Algorithm, Algorithm> & { default: () => Algorithm } & CodecContainer<Algorithm>

export interface HasAlgorithm {
  readonly algorithm: Algorithm
}

export interface HasPayload {
  readonly payload: Bytes
  // readonly payload: {
  //   (): Uint8Array
  //   (kind: 'hex'): string
  // }
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
    return new Hash(getWASM(true).Hash.zeroed(), null)
  }

  /**
   * Create by hashing the input.
   * @param input the input to hash
   * @returns the resulting hash
   */
  public static hash(input: Bytes): Hash {
    return new Hash(new (getWASM(true).Hash)(input.asWasmFormat), null)
  }

  public static fromRaw(payload: Bytes): Hash {
    return new Hash(null, payload)
  }

  #wasm: null | wasmPkg.Hash
  #bytes: null | Bytes

  private constructor(wasm: null | wasmPkg.Hash, bytes: Bytes | null) {
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
      getWASM(true).PrivateKey.from_multihash_hex(multihash),
    )
  }

  public static fromKeyPair(pair: KeyPair): PrivateKey {
    return new PrivateKey(pair.wasm.private_key())
  }

  public static fromParts(algorithm: Algorithm, payload: Bytes): PrivateKey {
    return new PrivateKey(getWASM(true).PrivateKey.from_bytes(algorithm, payload.asWasmFormat))
  }

  #wasm: wasmPkg.PrivateKey

  private constructor(wasm: wasmPkg.PrivateKey) {
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
  public get wasm(): wasmPkg.PrivateKey {
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
    const key = getWASM(true).PublicKey.from_multihash_hex(multihash)
    return new PublicKey(key)
  }

  public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
    const key = getWASM(true).PublicKey.from_private_key(privateKey.wasm)
    return new PublicKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PublicKey {
    return new PublicKey(pair.wasm.public_key())
  }

  public static fromParts(algorithm: Algorithm, payload: Bytes): PublicKey {
    return new PublicKey(getWASM(true).PublicKey.from_bytes(algorithm, payload.asWasmFormat))
  }

  #wasm: wasmPkg.PublicKey

  private constructor(wasm: wasmPkg.PublicKey) {
    this.#wasm = wasm
  }

  public get algorithm(): Algorithm {
    return this.#wasm.algorithm
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }

  public get wasm(): wasmPkg.PublicKey {
    return this.#wasm
  }

  public multihash(): string {
    return this.#wasm.to_multihash_hex()
  }

  public verifySignature(signature: Signature, message: Bytes): wasmPkg.VerifyResult {
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
    const pair = getWASM(true).KeyPair.random(options?.algorithm)
    return new KeyPair(pair)
  }

  /**
   * Derive the key pair from a given seed.
   * @param seed some binary data.
   * @param options key generation options
   */
  public static deriveFromSeed(seed: Bytes, options?: KeyGenOptions): KeyPair {
    const pair = getWASM(true).KeyPair.derive_from_seed(seed.asWasmFormat, options?.algorithm)
    return new KeyPair(pair)
  }

  public static deriveFromPrivateKey(private_key: PrivateKey): KeyPair {
    const pair = getWASM(true).KeyPair.derive_from_private_key(private_key.wasm)
    return new KeyPair(pair)
  }

  public static fromParts(publicKey: PublicKey, privateKey: PrivateKey): KeyPair {
    return new KeyPair(getWASM(true).KeyPair.from_parts(publicKey.wasm, privateKey.wasm))
  }

  #wasm: wasmPkg.KeyPair

  private constructor(wasm: wasmPkg.KeyPair) {
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
  public get wasm(): wasmPkg.KeyPair {
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
    return new Signature(getWASM(true).Signature.from_bytes(payload.asWasmFormat))
  }

  /**
   * Creates an actual signature, signing the payload with the given private key
   */
  public static create(privateKey: PrivateKey, payload: Bytes): Signature {
    const value = new (getWASM(true).Signature)(privateKey.wasm, payload.asWasmFormat)
    return new Signature(value)
  }

  #wasm: wasmPkg.Signature

  private constructor(wasm: wasmPkg.Signature) {
    this.#wasm = wasm
  }

  /**
   * Verify that this signature is produced for the given payload by the given key (its public part)
   */
  public verify(publicKey: PublicKey, payload: Bytes): wasmPkg.VerifyResult {
    return this.#wasm.verify(publicKey.wasm, payload.asWasmFormat)
  }

  public get payload(): Bytes {
    return Bytes.array(this.#wasm.payload())
  }
}
