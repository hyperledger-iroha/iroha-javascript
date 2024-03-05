//! This module contains structures and implementations related to the cryptographic parts of the Iroha.
//! But in WebAssembly-compatible manner.
#![cfg(target_arch = "wasm32")]
#![allow(clippy::must_use_candidate)]

extern crate alloc;

mod utils;

use alloc::string::ToString;
use alloc::{format, string::String, vec::Vec};
use core::str::FromStr;

use crate::utils::{BytesJs, JsErrorResultExt};

use wasm_bindgen::prelude::*;

type JsResult<T> = Result<T, JsError>;

// FIXME generate some pieces with a proc macro?
// Note: it is moved separately from TS_TYPES for tests
#[wasm_bindgen(typescript_custom_section)]
const TS_SECTION_ALGORITHM: &str = r"
export type Algorithm =
    | 'ed25519'
    | 'secp256k1'
    | 'bls_normal'
    | 'bls_small'
";

#[wasm_bindgen(typescript_custom_section)]
const TS_TYPES: &str = r#"    
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
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Algorithm")]
    pub type AlgorithmJsStr;
}

impl TryFrom<AlgorithmJsStr> for iroha_crypto::Algorithm {
    type Error = JsError;

    fn try_from(value: AlgorithmJsStr) -> Result<Self, Self::Error> {
        let value = Self::from_str(
            &value
                .as_string()
                .ok_or_else(|| JsError::new("Passed value is not a string"))?,
        )
        .wrap_js_error()?;
        Ok(value)
    }
}

impl From<iroha_crypto::Algorithm> for AlgorithmJsStr {
    fn from(value: iroha_crypto::Algorithm) -> Self {
        AlgorithmJsStr {
            obj: value.to_string().into(),
        }
    }
}

#[wasm_bindgen]
pub fn algorithm_default() -> AlgorithmJsStr {
    iroha_crypto::Algorithm::default().into()
}

#[wasm_bindgen]
pub struct Hash(iroha_crypto::Hash);

#[wasm_bindgen]
impl Hash {
    /// Construct zeroed hash
    pub fn zeroed() -> Self {
        Self(iroha_crypto::Hash::prehashed(
            [0; iroha_crypto::Hash::LENGTH],
        ))
    }

    /// Hash the given bytes.
    ///
    /// # Errors
    /// If failed to parse bytes input
    #[wasm_bindgen(constructor)]
    pub fn new(payload: BytesJs) -> JsResult<Hash> {
        let bytes: Vec<_> = payload.try_into()?;
        let hash = iroha_crypto::Hash::new(bytes);
        Ok(Self(hash))
    }

    pub fn bytes(&self) -> Vec<u8> {
        self.0.as_ref().into()
    }

    pub fn bytes_hex(&self) -> String {
        hex::encode(self.bytes())
    }
}

/// Public Key used in signatures.
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct PublicKey(pub(crate) iroha_crypto::PublicKey);

#[wasm_bindgen]
impl PublicKey {
    /// # Errors
    /// Fails if multihash parsing fails
    pub fn from_multihash_hex(multihash: &str) -> JsResult<PublicKey> {
        let inner = iroha_crypto::PublicKey::from_str(multihash).wrap_js_error()?;
        Ok(Self(inner))
    }

    /// # Errors
    /// Fails if parsing of algorithm or payload byte input fails
    pub fn from_raw(algorithm: AlgorithmJsStr, payload: BytesJs) -> JsResult<PublicKey> {
        let payload: Vec<u8> = payload.try_into()?;
        let inner =
            iroha_crypto::PublicKey::from_raw(algorithm.try_into()?, &payload).wrap_js_error()?;
        Ok(Self(inner))
    }

    pub fn from_private_key(key: &PrivateKey) -> PublicKey {
        let inner = iroha_crypto::PublicKey::from(key.0.clone());
        Self(inner)
    }

    pub fn to_multihash_hex(&self) -> String {
        format!("{}", self.0)
    }

    /// Equivalent to [`Self::to_multihash_hex`]
    pub fn to_json(&self) -> String {
        todo!()
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.0.algorithm().into()
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.to_raw().1
    }

    pub fn payload_hex(&self) -> String {
        hex::encode(self.payload())
    }
}

/// Private Key used in signatures.
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct PrivateKey(pub(crate) iroha_crypto::PrivateKey);

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "PrivateKeyJson")]
    pub type PrivateKeyJson;
}

impl TryFrom<PrivateKeyJson> for PrivateKey {
    type Error = JsError;

    fn try_from(value: PrivateKeyJson) -> Result<Self, Self::Error> {
        let inner: iroha_crypto::PrivateKey = serde_wasm_bindgen::from_value(value.obj)?;
        Ok(Self(inner))
    }
}

impl TryFrom<&PrivateKey> for PrivateKeyJson {
    type Error = JsError;

    fn try_from(value: &PrivateKey) -> Result<Self, Self::Error> {
        Ok(PrivateKeyJson {
            obj: serde_wasm_bindgen::to_value(&value.0)?,
        })
    }
}

#[wasm_bindgen]
impl PrivateKey {
    /// # Errors
    /// Fails if serialization fails
    pub fn from_json(value: PrivateKeyJson) -> JsResult<PrivateKey> {
        Self::try_from(value)
    }

    /// # Errors
    /// Fails if parsing of digest function or payload byte input fails
    pub fn from_raw(algorithm: AlgorithmJsStr, payload: BytesJs) -> JsResult<PrivateKey> {
        let payload: Vec<u8> = payload.try_into()?;
        let inner =
            iroha_crypto::PrivateKey::from_raw(algorithm.try_into()?, &payload).wrap_js_error()?;
        Ok(Self(inner))
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.0.algorithm().into()
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.to_raw().1
    }

    pub fn payload_hex(&self) -> String {
        hex::encode(self.payload())
    }

    /// # Errors
    /// Fails is serialization fails
    pub fn to_json(&self) -> JsResult<PrivateKeyJson> {
        self.try_into()
    }
}

/// Pair of Public and Private keys.
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct KeyPair(iroha_crypto::KeyPair);

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "KeyPairJson")]
    pub type KeyPairJson;
}

impl TryFrom<&KeyPair> for KeyPairJson {
    type Error = JsError;

    fn try_from(value: &KeyPair) -> Result<Self, Self::Error> {
        Ok(KeyPairJson {
            obj: serde_wasm_bindgen::to_value(&value.0)?,
        })
    }
}

impl TryFrom<KeyPairJson> for KeyPair {
    type Error = JsError;

    fn try_from(value: KeyPairJson) -> Result<Self, Self::Error> {
        let inner: iroha_crypto::KeyPair = serde_wasm_bindgen::from_value(value.obj)?;
        Ok(Self(inner))
    }
}

#[wasm_bindgen]
impl KeyPair {
    /// # Errors
    /// Fails if deserialization fails
    pub fn from_json(value: KeyPairJson) -> JsResult<KeyPair> {
        Self::try_from(value)
    }

    /// Construct a key pair from its components
    ///
    /// # Errors
    /// If public and private key don’t match, i.e. if they don’t make a pair
    pub fn from_raw(public_key: &PublicKey, private_key: &PrivateKey) -> JsResult<KeyPair> {
        let inner = iroha_crypto::KeyPair::new(public_key.0.clone(), private_key.0.clone())
            .wrap_js_error()?;
        Ok(Self(inner))
    }

    pub fn generate_from_seed(
        seed: BytesJs,
        algorithm: Option<AlgorithmJsStr>,
    ) -> JsResult<KeyPair> {
        let mut cfg = iroha_crypto::KeyGenConfiguration::from_seed(seed.try_into()?);
        if let Some(value) = algorithm {
            cfg = cfg.with_algorithm(value.try_into()?);
        }
        let inner = iroha_crypto::KeyPair::generate_with_configuration(cfg);
        Ok(Self(inner))
    }

    pub fn generate_from_private_key(
        key: &PrivateKey,
    ) -> JsResult<KeyPair> {
        let cfg = iroha_crypto::KeyGenConfiguration::from_private_key(key.0.clone());
        let inner = iroha_crypto::KeyPair::generate_with_configuration(cfg);
        Ok(Self(inner))
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.0.algorithm().into()
    }

    pub fn public_key(&self) -> PublicKey {
        let inner = self.0.public_key().clone();
        PublicKey(inner)
    }

    pub fn private_key(&self) -> PrivateKey {
        let inner = self.0.private_key().clone();
        PrivateKey(inner)
    }

    /// # Errors
    /// Fails if serialization fails
    pub fn to_json(&self) -> JsResult<KeyPairJson> {
        self.try_into()
    }
}

/// Represents signature of the data (`Block` or `Transaction` for example).
#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Signature(iroha_crypto::Signature);

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "SignatureJson")]
    pub type SignatureJson;
}


impl TryFrom<SignatureJson> for Signature {
    type Error = JsError;

    fn try_from(value: SignatureJson) -> Result<Self, Self::Error> {
        let inner: iroha_crypto::Signature = serde_wasm_bindgen::from_value(value.obj)?;
        Ok(Self(inner))
    }
}

impl TryFrom<&Signature> for SignatureJson {
    type Error = JsError;

    fn try_from(value: &Signature) -> Result<Self, Self::Error> {
        Ok(SignatureJson {
            obj: serde_wasm_bindgen::to_value(&value.0)?,
        })
    }
}

#[wasm_bindgen]
impl Signature {
    /// # Errors
    /// If failed to deserialize JSON
    pub fn from_json(value: SignatureJson) -> JsResult<Signature> {
        Self::try_from(value)
    }

    /// Construct the signature from raw components received from elsewhere
    ///
    /// # Errors
    /// - Invalid bytes input
    pub fn from_raw(public_key: &PublicKey, payload: BytesJs) -> JsResult<Signature> {
        let payload: Vec<u8> = payload.try_into()?;
        let inner = iroha_crypto::Signature::from_raw(public_key.0.clone(), &payload);
        Ok(Self(inner))
    }

    /// Creates new signature by signing the payload via the key pair's private key.
    ///
    /// # Errors
    /// If parsing bytes input fails
    #[wasm_bindgen(constructor)]
    pub fn new(key_pair: &KeyPair, payload: BytesJs) -> JsResult<Signature> {
        let payload: Vec<u8> = payload.try_into()?;
        let inner = iroha_crypto::Signature::new(&key_pair.0, &payload);
        Ok(Self(inner))
    }

    /// Verify `payload` using signed data and the signature's public key
    ///
    /// # Errors
    /// - If parsing of bytes input fails
    /// - If failed to construct verify error
    pub fn verify(&self, payload: BytesJs) -> JsResult<VerifyResultJs> {
        let payload: Vec<_> = payload.try_into()?;
        let result = self.0.verify(&payload).try_into()?;
        Ok(result)
    }

    pub fn public_key(&self) -> PublicKey {
        let inner = self.0.public_key().clone();
        PublicKey(inner)
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.payload().to_vec()
    }

    pub fn payload_hex(&self) -> String {
        hex::encode(self.0.payload())
    }

    /// # Errors
    /// If conversion fails
    pub fn to_json(&self) -> JsResult<SignatureJson> {
        self.try_into()
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "VerifyResult")]
    pub type VerifyResultJs;
}

impl TryFrom<Result<(), iroha_crypto::error::Error>> for VerifyResultJs {
    type Error = serde_wasm_bindgen::Error;

    fn try_from(value: Result<(), iroha_crypto::error::Error>) -> Result<Self, Self::Error> {
        #[derive(serde::Serialize)]
        #[serde(tag = "t")]
        enum VerifyResultSer {
            #[serde(rename(serialize = "ok"))]
            Ok,
            #[serde(rename(serialize = "err"))]
            Err { error: String },
        }

        let serializable = match value {
            Ok(()) => VerifyResultSer::Ok,
            Err(error) => VerifyResultSer::Err {
                error: error.to_string(),
            },
        };

        let js_value = serde_wasm_bindgen::to_value(&serializable)?;

        Ok(Self { obj: js_value })
    }
}

#[wasm_bindgen(start)]
pub fn main_js() {
    utils::set_panic_hook();
}
