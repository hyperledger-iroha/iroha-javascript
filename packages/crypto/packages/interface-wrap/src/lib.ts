import { wasmPkg } from '@iroha2/crypto-interface-wrap/~wasm-pack-proxy'
import { Bytes, Free, FreeGuard, FreeScope, GetInnerTrackObject, freeScope } from '@iroha2/crypto-util'
import { datamodel } from '@iroha2/data-model'

export type Algorithm = wasmPkg.Algorithm
export type PrivateKeyJson = wasmPkg.PrivateKeyJson
export type KeyPairJson = wasmPkg.KeyPairJson
export type SignatureJson = wasmPkg.SignatureJson
export type VerifyResult = wasmPkg.VerifyResult

export const Algorithm = {
  default: (): Algorithm => wasmPkg.algorithm_default(),
  toDataModel: (algorithm: Algorithm): datamodel.Algorithm => {
    switch (algorithm) {
      case 'ed25519':
        return datamodel.Algorithm.Ed25519
      case 'secp256k1':
        return datamodel.Algorithm.Secp256k1
      case 'bls_small':
        return datamodel.Algorithm.BlsSmall
      case 'bls_normal':
        return datamodel.Algorithm.BlsNormal
    }
  },
  fromDataModel: (algorithm: datamodel.Algorithm): Algorithm => {
    switch (algorithm.tag) {
      case 'Ed25519':
        return 'ed25519'
      case 'Secp256k1':
        return 'secp256k1'
      case 'BlsSmall':
        return 'bls_small'
      case 'BlsNormal':
        return 'bls_normal'
    }
  },
}

class SingleFreeWrap<T extends Free> implements Free, GetInnerTrackObject {
  /**
   * We don't use `#guard` or `private guard`, because it breaks assignability checks with
   * non-direct implementations
   * @private
   */
  public __guard: FreeGuard<T>

  protected constructor(object: T) {
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

export interface ToDataModel<T> {
  toDataModel: () => T
}

export interface ToJSON<T> {
  toJSON: () => T
}

export class Hash extends SingleFreeWrap<wasmPkg.Hash> {
  public static zeroed(): Hash {
    return new Hash(wasmPkg.Hash.zeroed())
  }

  public static hash(payload: Bytes): Hash {
    return new Hash(new wasmPkg.Hash(payload.wasm))
  }

  public bytes(): Uint8Array
  public bytes(mode: 'hex'): string
  public bytes(mode?: 'hex'): Uint8Array | string {
    return mode === 'hex' ? this.inner.bytes_hex() : this.inner.bytes()
  }
}

export class PrivateKey
  extends SingleFreeWrap<wasmPkg.PrivateKey>
  implements HasAlgorithm, HasPayload, ToJSON<wasmPkg.PrivateKeyJson>
{
  public static fromJSON(value: wasmPkg.PrivateKeyJson): PrivateKey {
    const key = wasmPkg.PrivateKey.from_json(value)
    return new PrivateKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PrivateKey {
    return new PrivateKey(pair.inner.private_key())
  }

  public static fromBytes(algorithm: Algorithm, payload: Bytes): PrivateKey {
    return new PrivateKey(wasmPkg.PrivateKey.from_bytes(algorithm, payload.wasm))
  }

  public get algorithm(): Algorithm {
    return this.inner.algorithm
  }

  public payload(): Uint8Array
  public payload(kind: 'hex'): string
  public payload(kind?: 'hex'): string | Uint8Array {
    return kind === 'hex' ? this.inner.payload_hex() : this.inner.payload()
  }

  public toJSON(): wasmPkg.PrivateKeyJson {
    return this.inner.to_json()
  }
}

export class PublicKey
  extends SingleFreeWrap<wasmPkg.PublicKey>
  implements HasAlgorithm, HasPayload, ToDataModel<datamodel.PublicKey>, ToJSON<string>
{
  public static fromMultihash(hex: string): PublicKey {
    const key = wasmPkg.PublicKey.from_multihash_hex(hex)
    return new PublicKey(key)
  }

  /**
   * Same as {@fromMultihash}
   */
  public static fromJSON(hex: string): PublicKey {
    return PublicKey.fromMultihash(hex)
  }

  public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
    const key = wasmPkg.PublicKey.from_private_key(privateKey.inner)
    return new PublicKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PublicKey {
    return new PublicKey(pair.inner.public_key())
  }

  public static fromRaw(algorithm: Algorithm, payload: Bytes): PublicKey {
    return new PublicKey(wasmPkg.PublicKey.from_bytes(algorithm, payload.wasm))
  }

  public static fromDataModel(publicKey: datamodel.PublicKey): PublicKey {
    return PublicKey.fromRaw(Algorithm.fromDataModel(publicKey.algorithm), Bytes.array(publicKey.payload))
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

  /**
   * Equal to {@link toMultihash} in `'hex'` mode
   */
  public toJSON(): string {
    return this.toMultihash()
  }

  public toDataModel(): datamodel.PublicKey {
    return {
      algorithm: Algorithm.toDataModel(this.algorithm),
      payload: this.payload(),
    }
  }
}

export interface WithAlgorithm {
  /**
   * @default 'ed25519'
   */
  algorithm?: Algorithm
}

export class KeyPair extends SingleFreeWrap<wasmPkg.KeyPair> implements HasAlgorithm, ToJSON<wasmPkg.KeyPairJson> {
  public static fromJSON(value: wasmPkg.KeyPairJson): KeyPair {
    const pair = wasmPkg.KeyPair.from_json(value)
    return new KeyPair(pair)
  }

  public static random(options?: WithAlgorithm): KeyPair {
    const pair = wasmPkg.KeyPair.random(options?.algorithm)
    return new KeyPair(pair)
  }

  public static deriveFromSeed(seed: Bytes, options?: WithAlgorithm): KeyPair {
    const pair = wasmPkg.KeyPair.derive_from_seed(seed.wasm, options?.algorithm)
    return new KeyPair(pair)
  }

  public static deriveFromPrivateKey(private_key: PrivateKey): KeyPair {
    const pair = wasmPkg.KeyPair.derive_from_private_key(private_key.inner)
    return new KeyPair(pair)
  }

  public static fromParts(publicKey: PublicKey, privateKey: PrivateKey): KeyPair {
    return new KeyPair(wasmPkg.KeyPair.from_parts(publicKey.inner, privateKey.inner))
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

  public sign(payload: Bytes): Signature {
    return Signature.create(this, payload)
  }

  public toJSON(): wasmPkg.KeyPairJson {
    return this.inner.to_json()
  }
}

export class Signature
  extends SingleFreeWrap<wasmPkg.Signature>
  implements HasPayload, ToDataModel<datamodel.Signature>
{
  /**
   * Create a signature from its payload and public key. This function **does not sign the payload**.
   */
  public static fromBytes(publicKey: PublicKey, payload: Bytes): Signature {
    return new Signature(wasmPkg.Signature.from_bytes(publicKey.inner, payload.wasm))
  }

  public static fromJSON(json: wasmPkg.SignatureJson): Signature {
    return new Signature(wasmPkg.Signature.from_json(json))
  }

  public static fromDataModel(signature: datamodel.Signature): Signature {
    return freeScope((scope) => {
      // TODO patch wasm first
      const publicKey = PublicKey.fromDataModel(signature.public_key)
      const result = Signature.fromBytes(publicKey, Bytes.array(signature.payload))
      scope.forget(result)
      return result
    })
  }

  /**
   * Creates an actual signature, signing the payload
   */
  public static create(keyPair: KeyPair, payload: Bytes) {
    let value = new wasmPkg.Signature(keyPair.inner, payload.wasm)
    return new Signature(value)
  }

  public verify(message: Bytes): wasmPkg.VerifyResult {
    return this.inner.verify(message.wasm)
  }

  public publicKey(): PublicKey {
    return new PublicKey(this.inner.public_key())
  }

  public payload(): Uint8Array
  public payload(mode: 'hex'): string
  public payload(mode?: 'hex'): string | Uint8Array {
    return mode === 'hex' ? this.inner.payload_hex() : this.inner.payload()
  }

  public toDataModel(): datamodel.Signature {
    return {
      payload: this.payload(),
    }
  }

  public toJSON(): wasmPkg.SignatureJson {
    return this.inner.to_json()
  }
}
