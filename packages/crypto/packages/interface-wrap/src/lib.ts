import { wasmPkg } from '@iroha2/crypto-interface-wrap/~wasm-pack-proxy'
import { Free, FreeGuard, FreeScope, GetInnerTrackObject, freeScope } from '@iroha2/crypto-util'
import { datamodel } from '@iroha2/data-model'

export type Algorithm = wasmPkg.Algorithm

export const Algorithm = {
  default: (): Algorithm => wasmPkg.algorithm_default(),
  toDataModel: (algorithm: Algorithm): datamodel.Algorithm => {
    switch (algorithm) {
      case 'ed25519':
        return datamodel.Algorithm('Ed25519')
      case 'secp256k1':
        return datamodel.Algorithm('Secp256k1')
      case 'bls_small':
        return datamodel.Algorithm('BlsSmall')
      case 'bls_normal':
        return datamodel.Algorithm('BlsNormal')
    }
  },
  fromDataModel: (algorithm: datamodel.Algorithm): Algorithm => {
    switch (algorithm.enum.tag) {
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
  public get underlying(): T {
    return this.__guard.object
  }

  public underlyingMove(fn: (object: T) => T): void {
    const moved = fn(this.underlying)
    this.__guard.forget()
    this.__guard = new FreeGuard(moved)
  }

  public free() {
    this.__guard.free()
  }

  public [FreeScope.getInnerTrackObject]() {
    return this.__guard
  }
}

export type BytesInputTuple = [kind: 'array', array: Uint8Array] | [kind: 'hex', hex: string]

function bytesInputTupleToEnum(tuple: BytesInputTuple): wasmPkg.BytesInput {
  return tuple[0] === 'array' ? { t: 'Array', c: tuple[1] } : { t: 'Hex', c: tuple[1] }
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

export interface SignMessage {
  sign: (...message: BytesInputTuple) => Signature
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

  public static hash(...payload: BytesInputTuple): Hash {
    return new Hash(wasmPkg.Hash.hash(bytesInputTupleToEnum(payload)))
  }

  public bytes(): Uint8Array
  public bytes(mode: 'hex'): string
  public bytes(mode?: 'hex'): Uint8Array | string {
    return mode === 'hex' ? this.underlying.bytes_hex() : this.underlying.bytes()
  }
}

export class PrivateKey
  extends SingleFreeWrap<wasmPkg.PrivateKey>
  implements HasAlgorithm, HasPayload, SignMessage, ToJSON<wasmPkg.PrivateKeyJson>
{
  public static fromJSON(value: wasmPkg.PrivateKeyJson): PrivateKey {
    const key = wasmPkg.PrivateKey.from_json(value)
    return new PrivateKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PrivateKey {
    return new PrivateKey(pair.underlying.private_key())
  }

  public static reproduce(digestFunction: Algorithm, ...payload: BytesInputTuple): PrivateKey {
    return new PrivateKey(wasmPkg.PrivateKey.reproduce(digestFunction, bytesInputTupleToEnum(payload)))
  }

  public get algorithm(): Algorithm {
    return this.underlying.digest_function
  }

  public payload(): Uint8Array
  public payload(kind: 'hex'): string
  public payload(kind?: 'hex'): string | Uint8Array {
    return kind === 'hex' ? this.underlying.payload_hex() : this.underlying.payload()
  }

  public sign(...message: BytesInputTuple): Signature {
    return Signature.signWithPrivateKey(this, ...message)
  }

  public toKeyPair(): KeyPair {
    return KeyPair.fromPrivateKey(this)
  }

  public toJSON(): wasmPkg.PrivateKeyJson {
    return this.underlying.to_json()
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

  public static fromPrivateKey(privateKey: PrivateKey): PublicKey {
    const key = wasmPkg.PublicKey.from_private_key(privateKey.underlying)
    return new PublicKey(key)
  }

  public static fromKeyPair(pair: KeyPair): PublicKey {
    return new PublicKey(pair.underlying.public_key())
  }

  public static fromRaw(algorithm: Algorithm, ...payload: BytesInputTuple): PublicKey {
    return new PublicKey(wasmPkg.PublicKey.reproduce(algorithm, bytesInputTupleToEnum(payload)))
  }

  public static fromDataModel(publicKey: datamodel.PublicKey): PublicKey {
    return PublicKey.fromRaw(Algorithm.fromDataModel(publicKey.digest_function), 'array', publicKey.payload)
  }

  public toMultihash(): string {
    return this.underlying.to_multihash_hex()
  }

  public get algorithm(): Algorithm {
    return this.underlying.digest_function
  }

  public payload(): Uint8Array
  public payload(kind: 'hex'): string
  public payload(kind?: 'hex'): string | Uint8Array {
    return kind === 'hex' ? this.underlying.payload_hex() : this.underlying.payload()
  }

  /**
   * Equal to {@link toMultihash} in `'hex'` mode
   */
  public toJSON(): string {
    return this.toMultihash()
  }

  public toDataModel(): datamodel.PublicKey {
    return datamodel.PublicKey({
      digest_function: Algorithm.toDataModel(this.algorithm),
      payload: this.payload(),
    })
  }
}

export class KeyGenConfiguration extends SingleFreeWrap<wasmPkg.KeyGenConfiguration> {
  public static default(): KeyGenConfiguration {
    return new KeyGenConfiguration(wasmPkg.KeyGenConfiguration._default())
  }

  public static withAlgorithm(algorithm: Algorithm): KeyGenConfiguration {
    return new KeyGenConfiguration(wasmPkg.KeyGenConfiguration.create_with_algorithm(algorithm))
  }

  public withAlgorithm(algorithm: Algorithm): KeyGenConfiguration {
    this.underlyingMove((cfg) => cfg.with_algorithm(algorithm))
    return this
  }

  public usePrivateKey(privateKey: PrivateKey): KeyGenConfiguration {
    this.underlyingMove((cfg) => cfg.use_private_key(privateKey.underlying))
    return this
  }

  public useSeed(...seed: BytesInputTuple): KeyGenConfiguration {
    this.underlyingMove((cfg) => cfg.use_seed(bytesInputTupleToEnum(seed)))
    return this
  }

  public generate(): KeyPair {
    return KeyPair.generate(this)
  }
}

export class KeyPair
  extends SingleFreeWrap<wasmPkg.KeyPair>
  implements HasAlgorithm, SignMessage, ToJSON<wasmPkg.KeyPairJson>
{
  public static fromJSON(value: wasmPkg.KeyPairJson): KeyPair {
    const pair = wasmPkg.KeyPair.from_json(value)
    return new KeyPair(pair)
  }

  public static generate(configuration?: KeyGenConfiguration): KeyPair {
    const pair = configuration
      ? wasmPkg.KeyPair.generate_with_configuration(configuration.underlying)
      : wasmPkg.KeyPair.generate()
    return new KeyPair(pair)
  }

  public static fromPrivateKey(key: PrivateKey): KeyPair {
    const pair = wasmPkg.KeyPair.from_private_key(key.underlying)
    return new KeyPair(pair)
  }

  public static fromRaw(publicKey: PublicKey, privateKey: PrivateKey): KeyPair {
    const pair = wasmPkg.KeyPair.reproduce(publicKey.underlying, privateKey.underlying)
    return new KeyPair(pair)
  }

  public get algorithm(): Algorithm {
    return this.underlying.digest_function
  }

  public privateKey(): PrivateKey {
    return PrivateKey.fromKeyPair(this)
  }

  public publicKey(): PublicKey {
    return PublicKey.fromKeyPair(this)
  }

  public sign(...message: BytesInputTuple): Signature {
    return Signature.signWithKeyPair(this, ...message)
  }

  public toJSON(): wasmPkg.KeyPairJson {
    return this.underlying.to_json()
  }
}

export class Signature
  extends SingleFreeWrap<wasmPkg.Signature>
  implements HasPayload, ToDataModel<datamodel.Signature>
{
  public static signWithKeyPair(keyPair: KeyPair, ...message: BytesInputTuple): Signature {
    return new Signature(wasmPkg.Signature.sign_with_key_pair(keyPair.underlying, bytesInputTupleToEnum(message)))
  }

  public static signWithPrivateKey(privateKey: PrivateKey, ...message: BytesInputTuple): Signature {
    return new Signature(wasmPkg.Signature.sign_with_private_key(privateKey.underlying, bytesInputTupleToEnum(message)))
  }

  /**
   * Create a signature from its payload and public key. This function **does not sign the payload**.
   */
  public static fromRaw(publicKey: PublicKey, ...payload: BytesInputTuple): Signature {
    return new Signature(wasmPkg.Signature.reproduce(publicKey.underlying, bytesInputTupleToEnum(payload)))
  }

  public static fromDataModel(signature: datamodel.Signature): Signature {
    return freeScope((scope) => {
      const publicKey = PublicKey.fromDataModel(signature.public_key)
      const result = Signature.fromRaw(publicKey, 'array', signature.payload)
      scope.forget(result)
      return result
    })
  }

  public verify(...message: BytesInputTuple): wasmPkg.VerifyResult {
    return this.underlying.verify(bytesInputTupleToEnum(message))
  }

  public publicKey(): PublicKey {
    return new PublicKey(this.underlying.public_key())
  }

  public payload(): Uint8Array
  public payload(mode: 'hex'): string
  public payload(mode?: 'hex'): string | Uint8Array {
    return mode === 'hex' ? this.underlying.payload_hex() : this.underlying.payload()
  }

  public toDataModel(): datamodel.Signature {
    return freeScope(() =>
      datamodel.Signature({
        public_key: this.publicKey().toDataModel(),
        payload: this.payload(),
      }),
    )
  }
}
