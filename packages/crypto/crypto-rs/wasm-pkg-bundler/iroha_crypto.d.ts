/* tslint:disable */
/* eslint-disable */
/**
* @returns {Algorithm}
*/
export function algorithm_default(): Algorithm;
/**
*/
export function main_js(): void;

export type Algorithm =
    | 'ed25519'
    | 'secp256k1'
    | 'bls_normal'
    | 'bls_small'


    
export interface PrivateKeyJson {
    algorithm: string
    /** Hex-encoded bytes */
    payload: string
}

export interface KeyPairJson {
    public_key: string
    private_key: PrivateKeyJson
}

export interface SignatureJson {
    public_key: string
    /** Hex-encoded bytes */
    payload: string
}

export type VerifyResult =
    | { t: 'ok' }
    | { t: 'err', error: string }



export type Bytes =
    | { t: 'array', c: Uint8Array }
    | { t: 'hex', c: string }


/**
*/
export class Hash {
  free(): void;
/**
* Construct zeroed hash
* @returns {Hash}
*/
  static zeroed(): Hash;
/**
* Hash the given bytes.
*
* # Errors
* If failed to parse bytes input
* @param {Binary} payload
*/
  constructor(payload: Binary);
/**
* @returns {Uint8Array}
*/
  bytes(): Uint8Array;
/**
* @returns {string}
*/
  bytes_hex(): string;
}
/**
* Pair of Public and Private keys.
*/
export class KeyPair {
  free(): void;
/**
* # Errors
* Fails if deserialization fails
* @param {KeyPairJson} value
* @returns {KeyPair}
*/
  static from_json(value: KeyPairJson): KeyPair;
/**
* Generate a random key pair
*
* # Errors
* If passed algorithm is not valid.
* @param {Algorithm | undefined} [algorithm]
* @returns {KeyPair}
*/
  static random(algorithm?: Algorithm): KeyPair;
/**
* Construct a key pair from its components
*
* # Errors
* If public and private keys don’t match, i.e. if they don’t make a pair
* @param {PublicKey} public_key
* @param {PrivateKey} private_key
* @returns {KeyPair}
*/
  static from_parts(public_key: PublicKey, private_key: PrivateKey): KeyPair;
/**
* @param {Binary} seed
* @param {Algorithm | undefined} [algorithm]
* @returns {KeyPair}
*/
  static derive_from_seed(seed: Binary, algorithm?: Algorithm): KeyPair;
/**
* @param {PrivateKey} key
* @returns {KeyPair}
*/
  static derive_from_private_key(key: PrivateKey): KeyPair;
/**
* @returns {PublicKey}
*/
  public_key(): PublicKey;
/**
* @returns {PrivateKey}
*/
  private_key(): PrivateKey;
/**
* # Errors
* Fails if serialisation fails
* @returns {KeyPairJson}
*/
  to_json(): KeyPairJson;
/**
*/
  readonly algorithm: Algorithm;
}
/**
* Private Key used in signatures.
*/
export class PrivateKey {
  free(): void;
/**
* # Errors
* Fails if serialization fails
* @param {PrivateKeyJson} value
* @returns {PrivateKey}
*/
  static from_json(value: PrivateKeyJson): PrivateKey;
/**
* # Errors
* Fails if parsing of digest function or payload byte input fails
* @param {Algorithm} algorithm
* @param {Binary} payload
* @returns {PrivateKey}
*/
  static from_bytes(algorithm: Algorithm, payload: Binary): PrivateKey;
/**
* @returns {Uint8Array}
*/
  payload(): Uint8Array;
/**
* @returns {string}
*/
  payload_hex(): string;
/**
* # Errors
* Fails is serialisation fails
* @returns {PrivateKeyJson}
*/
  to_json(): PrivateKeyJson;
/**
*/
  readonly algorithm: Algorithm;
}
/**
* Public Key used in signatures.
*/
export class PublicKey {
  free(): void;
/**
* # Errors
* Fails if multihash parsing fails
* @param {string} multihash
* @returns {PublicKey}
*/
  static from_multihash_hex(multihash: string): PublicKey;
/**
* # Errors
* Fails if parsing of algorithm or payload byte input fails
* @param {Algorithm} algorithm
* @param {Binary} payload
* @returns {PublicKey}
*/
  static from_bytes(algorithm: Algorithm, payload: Binary): PublicKey;
/**
* @param {PrivateKey} key
* @returns {PublicKey}
*/
  static from_private_key(key: PrivateKey): PublicKey;
/**
* @returns {string}
*/
  to_multihash_hex(): string;
/**
* Equivalent to [`Self::to_multihash_hex`]
* @returns {string}
*/
  to_json(): string;
/**
* @returns {Uint8Array}
*/
  payload(): Uint8Array;
/**
* @returns {string}
*/
  payload_hex(): string;
/**
*/
  readonly algorithm: Algorithm;
}
/**
* Represents the signature of the data
*/
export class Signature {
  free(): void;
/**
* # Errors
* If failed to deserialise JSON
* @param {SignatureJson} value
* @returns {Signature}
*/
  static from_json(value: SignatureJson): Signature;
/**
* Construct the signature from raw components received from elsewhere
*
* # Errors
* - Invalid bytes input
* @param {Binary} payload
* @returns {Signature}
*/
  static from_bytes(payload: Binary): Signature;
/**
* Creates new signature by signing the payload via the key pair's private key.
*
* # Errors
* If parsing bytes input fails
* @param {PrivateKey} private_key
* @param {Binary} payload
*/
  constructor(private_key: PrivateKey, payload: Binary);
/**
* Verify that the signature is signed by the given public key
*
* # Errors
* - If parsing of bytes input fails
* - If failed to construct verify error
* @param {PublicKey} public_key
* @param {Binary} payload
* @returns {VerifyResult}
*/
  verify(public_key: PublicKey, payload: Binary): VerifyResult;
/**
* @returns {Uint8Array}
*/
  payload(): Uint8Array;
/**
* @returns {string}
*/
  payload_hex(): string;
/**
* # Errors
* If conversion fails
* @returns {SignatureJson}
*/
  to_json(): SignatureJson;
}
