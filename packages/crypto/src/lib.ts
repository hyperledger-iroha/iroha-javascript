/**
 * @module @iroha2/crypto
 */
export * from './types.ts'
export * from './singleton.ts'
export * from './util.ts'
export * from './free.ts'

import type { Bytes } from './util.ts'
import { type Free, FreeGuard, FreeScope, type GetInnerTrackObject } from './free.ts'
import { getWASM } from './singleton.ts'
import type { wasmPkg } from './types.ts'

/**
 * Crypto alrogithms supported by Iroha.
 */
export type Algorithm = wasmPkg.Algorithm
export type VerifyResult = wasmPkg.VerifyResult

export const Algorithm = {
  default: (): Algorithm => getWASM(true).algorithm_default(),
}

class SingleFreeWrap<T extends Free> implements Free, GetInnerTrackObject {
  /**
   * We don't use `#guard` or `private guard`, because it breaks assignability checks with
   * non-direct implementations
   * @private
   */
  public __guard: FreeGuard<T>

  public constructor(object: T) {
    this.__guard = new FreeGuard(object)
  }

  /**
   * Get access to the underlying free-able object. For internal use.
   * @internal
   */
  public get inner(): T {
    return this.__guard.object
  }

  public free() {
    this.__guard.free()
  }

  public [FreeScope.getInnerTrackObject]() {
    return this.__guard
  }
}

export interface HasAlgorithm {
  readonly algorithm: Algorithm
}

export interface HasPayload {
  readonly payload: {
    (): Uint8Array
    (kind: 'hex'): string
  }
}

/**
 * Cryptographic hash used in Iroha.
 */
export class Hash extends SingleFreeWrap<wasmPkg.Hash> {
  /**
   * Create an hash filled with zeros.
   */
  public static zeroed(): Hash {
    return new Hash(getWASM(true).Hash.zeroed())
  }

  /**
   * Create by hashing the input.
   * @param input the input to hash
   * @returns the resulting hash
   */
  public static hash(input: Bytes): Hash {
    return new Hash(new (getWASM(true).Hash)(input.wasm))
  }

  public payload(): Uint8Array
  public payload(mode: 'hex'): string
  public payload(mode?: 'hex'): Uint8Array | string {
    // TODO: rename `bytes` to `payload` in wasm
    return mode === 'hex' ? this.inner.bytes_hex() : this.inner.bytes()
  }
}

/**
 * Private key used in Iroha.
 */
export class PrivateKey extends SingleFreeWrap<wasmPkg.PrivateKey> implements HasAlgorithm, HasPayload {
  /**
   * Create from a multihash string.
   */
  public static fromMultihash(hex: string): PrivateKey {
    return new PrivateKey(getWASM(true).PrivateKey.from_multihash_hex(hex))
  }

  public static fromKeyPair(pair: KeyPair): PrivateKey {
    return new PrivateKey(pair.inner.private_key())
  }

  public static fromBytes(algorithm: Algorithm, payload: Bytes): PrivateKey {
    return new PrivateKey(getWASM(true).PrivateKey.from_bytes(algorithm, payload.wasm))
  }

  public get algorithm(): Algorithm {
    return this.inner.algorithm
  }

  public payload(): Uint8Array
  public payload(kind: 'hex'): string
  public payload(kind?: 'hex'): string | Uint8Array {
    return kind === 'hex' ? this.inner.payload_hex() : this.inner.payload()
  }

  public toMultihash(): string {
    return this.inner.to_multihash_hex()
  }

  public sign(message: Bytes): Signature {
    return Signature.create(this, message)
  }
}

export class PublicKey extends SingleFreeWrap<wasmPkg.PublicKey> implements HasAlgorithm, HasPayload {
  public static fromMultihash(hex: string): PublicKey {
    const key = getWASM(true).PublicKey.from_multihash_hex(hex)
    return new PublicKey(key)
  }

  public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
    const key = getWASM(true).PublicKey.from_private_key(privateKey.inner)
    return new PublicKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PublicKey {
    return new PublicKey(pair.inner.public_key())
  }

  public static fromBytes(algorithm: Algorithm, payload: Bytes): PublicKey {
    return new PublicKey(getWASM(true).PublicKey.from_bytes(algorithm, payload.wasm))
  }

  public toMultihash(): string {
    return this.inner.to_multihash_hex()
  }

  public get algorithm(): Algorithm {
    return this.inner.algorithm
  }

  public payload(): Uint8Array
  public payload(kind: 'hex'): string
  public payload(kind?: 'hex'): string | Uint8Array {
    return kind === 'hex' ? this.inner.payload_hex() : this.inner.payload()
  }

  public verifySignature(signature: Signature, message: Bytes): wasmPkg.VerifyResult {
    return signature.verify(this, message)
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

export class KeyPair extends SingleFreeWrap<wasmPkg.KeyPair> implements HasAlgorithm {
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
    const pair = getWASM(true).KeyPair.derive_from_seed(seed.wasm, options?.algorithm)
    return new KeyPair(pair)
  }

  public static deriveFromPrivateKey(private_key: PrivateKey): KeyPair {
    const pair = getWASM(true).KeyPair.derive_from_private_key(private_key.inner)
    return new KeyPair(pair)
  }

  public static fromParts(publicKey: PublicKey, privateKey: PrivateKey): KeyPair {
    return new KeyPair(getWASM(true).KeyPair.from_parts(publicKey.inner, privateKey.inner))
  }

  public get algorithm(): Algorithm {
    return this.inner.algorithm
  }

  public privateKey(): PrivateKey {
    return PrivateKey.fromKeyPair(this)
  }

  public publicKey(): PublicKey {
    return PublicKey.fromKeyPair(this)
  }
}

export class Signature extends SingleFreeWrap<wasmPkg.Signature> implements HasPayload {
  /**
   * Create a signature from its payload and public key. This function **does not sign the payload**.
   */
  public static fromBytes(payload: Bytes): Signature {
    return new Signature(getWASM(true).Signature.from_bytes(payload.wasm))
  }

  /**
   * Creates an actual signature, signing the payload with the given private key
   */
  public static create(privateKey: PrivateKey, payload: Bytes) {
    const value = new (getWASM(true).Signature)(privateKey.inner, payload.wasm)
    return new Signature(value)
  }

  /**
   * Verify that this signature is produced for the given payload by the given key (its public part)
   */
  public verify(publicKey: PublicKey, payload: Bytes): wasmPkg.VerifyResult {
    return this.inner.verify(publicKey.inner, payload.wasm)
  }

  /**
   * Access the signature payload
   */
  public payload(): Uint8Array
  public payload(mode: 'hex'): string
  public payload(mode?: 'hex'): string | Uint8Array {
    return mode === 'hex' ? this.inner.payload_hex() : this.inner.payload()
  }
}
