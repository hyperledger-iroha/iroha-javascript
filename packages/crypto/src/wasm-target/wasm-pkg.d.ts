/* tslint:disable */
/* eslint-disable */
/**
 * @returns {Algorithm}
 */
export function algorithm_default(): Algorithm
/** */
export function main_js(): void

export type Algorithm =
  | 'ed25519'
  | 'secp256k1'
  | 'bls_normal'
  | 'bls_small'

export type VerifyResult =
  | { t: 'ok' }
  | { t: 'err'; error: string }

export type Bytes =
  | { t: 'array'; c: Uint8Array }
  | { t: 'hex'; c: string }

/** */
export class Hash {
  free(): void
  /**
   * Construct zeroed hash
   * @returns {Hash}
   */
  static zeroed(): Hash
  /**
   * Hash the given bytes.
   *
   * # Errors
   * If failed to parse bytes input
   * @param {Bytes} payload
   */
  constructor(payload: Bytes)
  /**
   * @returns {Uint8Array}
   */
  bytes(): Uint8Array
  /**
   * @returns {string}
   */
  bytes_hex(): string
}
/**
 * Pair of Public and Private keys.
 */
export class KeyPair {
  free(): void
  /**
   * Generate a random key pair
   *
   * # Errors
   * If passed algorithm is not valid.
   * @param {Algorithm | undefined} [algorithm]
   * @returns {KeyPair}
   */
  static random(algorithm?: Algorithm): KeyPair
  /**
   * Construct a key pair from its components
   *
   * # Errors
   * If public and private keys don’t match, i.e. if they don’t make a pair
   * @param {PublicKey} public_key
   * @param {PrivateKey} private_key
   * @returns {KeyPair}
   */
  static from_parts(public_key: PublicKey, private_key: PrivateKey): KeyPair
  /**
   * @param {Bytes} seed
   * @param {Algorithm | undefined} [algorithm]
   * @returns {KeyPair}
   */
  static derive_from_seed(seed: Bytes, algorithm?: Algorithm): KeyPair
  /**
   * @param {PrivateKey} key
   * @returns {KeyPair}
   */
  static derive_from_private_key(key: PrivateKey): KeyPair
  /**
   * @returns {PublicKey}
   */
  public_key(): PublicKey
  /**
   * @returns {PrivateKey}
   */
  private_key(): PrivateKey
  /** */
  readonly algorithm: Algorithm
}
/**
 * Private Key used in signatures.
 */
export class PrivateKey {
  free(): void
  /**
   * # Errors
   * Fails if multihash parsing fails
   * @param {string} multihash
   * @returns {PrivateKey}
   */
  static from_multihash_hex(multihash: string): PrivateKey
  /**
   * # Errors
   * Fails if parsing of digest function or payload byte input fails
   * @param {Algorithm} algorithm
   * @param {Bytes} payload
   * @returns {PrivateKey}
   */
  static from_bytes(algorithm: Algorithm, payload: Bytes): PrivateKey
  /**
   * @returns {Uint8Array}
   */
  payload(): Uint8Array
  /**
   * @returns {string}
   */
  payload_hex(): string
  /**
   * @returns {string}
   */
  to_multihash_hex(): string
  /** */
  readonly algorithm: Algorithm
}
/**
 * Public Key used in signatures.
 */
export class PublicKey {
  free(): void
  /**
   * # Errors
   * Fails if multihash parsing fails
   * @param {string} multihash
   * @returns {PublicKey}
   */
  static from_multihash_hex(multihash: string): PublicKey
  /**
   * # Errors
   * Fails if parsing of algorithm or payload byte input fails
   * @param {Algorithm} algorithm
   * @param {Bytes} payload
   * @returns {PublicKey}
   */
  static from_bytes(algorithm: Algorithm, payload: Bytes): PublicKey
  /**
   * @param {PrivateKey} key
   * @returns {PublicKey}
   */
  static from_private_key(key: PrivateKey): PublicKey
  /**
   * @returns {string}
   */
  to_multihash_hex(): string
  /**
   * @returns {Uint8Array}
   */
  payload(): Uint8Array
  /**
   * @returns {string}
   */
  payload_hex(): string
  /** */
  readonly algorithm: Algorithm
}
/**
 * Represents the signature of the data
 */
export class Signature {
  free(): void
  /**
   * Construct the signature from raw components received from elsewhere
   *
   * # Errors
   * - Invalid bytes input
   * @param {Bytes} payload
   * @returns {Signature}
   */
  static from_bytes(payload: Bytes): Signature
  /**
   * Creates new signature by signing the payload via the key pair's private key.
   *
   * # Errors
   * If parsing bytes input fails
   * @param {PrivateKey} private_key
   * @param {Bytes} payload
   */
  constructor(private_key: PrivateKey, payload: Bytes)
  /**
   * Verify that the signature is signed by the given public key
   *
   * # Errors
   * - If parsing of bytes input fails
   * - If failed to construct verify error
   * @param {PublicKey} public_key
   * @param {Bytes} payload
   * @returns {VerifyResult}
   */
  verify(public_key: PublicKey, payload: Bytes): VerifyResult
  /**
   * @returns {Uint8Array}
   */
  payload(): Uint8Array
  /**
   * @returns {string}
   */
  payload_hex(): string
}
