#![cfg(target_arch = "wasm32")]
#![allow(clippy::must_use_candidate)]

extern crate alloc;

extern crate wee_alloc;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

mod utils;

use alloc::rc::Rc;
use alloc::string::ToString;
use alloc::{format, string::String, vec::Vec};
use core::str::FromStr;

use crate::utils::JsErrorResultExt;

use wasm_bindgen::prelude::*;

type JsResult<T> = Result<T, JsError>;

#[wasm_bindgen(typescript_custom_section)]
const TS_SECTION_ALGORITHM: &str = r"
export type Algorithm =
    | 'ed25519'
    | 'secp256k1'
    | 'bls_normal'
    | 'bls_small'
";

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
    pub fn zeroed() -> Self {
        Self(iroha_crypto::Hash::prehashed(
            [0; iroha_crypto::Hash::LENGTH],
        ))
    }

    pub fn hash(payload: &[u8]) -> Hash {
        let hash = iroha_crypto::Hash::new(payload);
        Self(hash)
    }

    pub fn hash_hex(hex: String) -> JsResult<Hash> {
        let payload = hex::decode(&hex).wrap_js_error()?;
        let hash = iroha_crypto::Hash::new(&payload);
        Ok(Self(hash))
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.as_ref().into()
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct PublicKey(Rc<iroha_crypto::PublicKey>);

#[wasm_bindgen]
impl PublicKey {
    pub fn from_multihash_hex(multihash: &str) -> JsResult<PublicKey> {
        let inner = iroha_crypto::PublicKey::from_str(multihash).wrap_js_error()?;
        Ok(Self(Rc::new(inner)))
    }

    pub fn from_raw(algorithm: AlgorithmJsStr, payload: &[u8]) -> JsResult<PublicKey> {
        let inner =
            iroha_crypto::PublicKey::from_bytes(algorithm.try_into()?, payload).wrap_js_error()?;
        Ok(Self(Rc::new(inner)))
    }

    pub fn from_raw_hex(algorithm: AlgorithmJsStr, hex: String) -> JsResult<PublicKey> {
        Self::from_raw(algorithm, &hex::decode(&hex).wrap_js_error()?)
    }

    pub fn from_private_key(key: &PrivateKey) -> PublicKey {
        let inner = iroha_crypto::PublicKey::from((*key.0).clone());
        Self(Rc::new(inner))
    }

    pub fn to_multihash_hex(&self) -> String {
        format!("{}", self.0)
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.0.algorithm().into()
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.to_bytes().1
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct PrivateKey(Rc<iroha_crypto::PrivateKey>);

#[wasm_bindgen]
impl PrivateKey {
    pub fn from_multihash_hex(multihash: &str) -> JsResult<PrivateKey> {
        let inner = iroha_crypto::PrivateKey::from_str(multihash).wrap_js_error()?;
        Ok(Self(Rc::new(inner)))
    }

    pub fn from_raw(algorithm: AlgorithmJsStr, payload: &[u8]) -> JsResult<PrivateKey> {
        let inner =
            iroha_crypto::PrivateKey::from_bytes(algorithm.try_into()?, payload).wrap_js_error()?;
        Ok(Self(Rc::new(inner)))
    }

    pub fn from_raw_hex(algorithm: AlgorithmJsStr, hex: String) -> JsResult<PrivateKey> {
        Self::from_raw(algorithm, &hex::decode(&hex).wrap_js_error()?)
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.0.algorithm().into()
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.to_bytes().1
    }

    pub fn to_multihash_hex(&self) -> String {
        format!("{}", iroha_crypto::ExposedPrivateKey((*self.0).clone()))
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct KeyPair {
    inner: iroha_crypto::KeyPair,
    public_key: Option<PublicKey>,
    private_key: Option<PrivateKey>,
}

#[wasm_bindgen]
impl KeyPair {
    pub fn random(algorithm: Option<AlgorithmJsStr>) -> JsResult<KeyPair> {
        let algorithm = algorithm
            .map(iroha_crypto::Algorithm::try_from)
            .transpose()?
            .unwrap_or_default();
        let inner = iroha_crypto::KeyPair::random_with_algorithm(algorithm);
        Ok(Self {
            inner,
            public_key: None,
            private_key: None,
        })
    }

    pub fn from_parts(public_key: &PublicKey, private_key: &PrivateKey) -> JsResult<KeyPair> {
        let inner = iroha_crypto::KeyPair::new((*public_key.0).clone(), (*private_key.0).clone())
            .wrap_js_error()?;
        Ok(Self {
            inner,
            public_key: Some(public_key.clone()),
            private_key: Some(private_key.clone()),
        })
    }

    pub fn derive_from_seed(seed: &[u8], algorithm: Option<AlgorithmJsStr>) -> JsResult<KeyPair> {
        let algorithm = algorithm
            .map(iroha_crypto::Algorithm::try_from)
            .transpose()?
            .unwrap_or_default();
        let inner = iroha_crypto::KeyPair::from_seed(seed.try_into()?, algorithm);
        Ok(Self {
            inner,
            public_key: None,
            private_key: None,
        })
    }

    pub fn derive_from_seed_hex(
        seed: String,
        algorithm: Option<AlgorithmJsStr>,
    ) -> JsResult<KeyPair> {
        Self::derive_from_seed(&hex::decode(&seed).wrap_js_error()?, algorithm)
    }

    pub fn derive_from_private_key(key: &PrivateKey) -> JsResult<KeyPair> {
        let inner = iroha_crypto::KeyPair::from((*key.0).clone());
        Ok(Self {
            inner,
            public_key: None,
            private_key: Some(key.clone()),
        })
    }

    #[wasm_bindgen(getter)]
    pub fn algorithm(&self) -> AlgorithmJsStr {
        self.inner.algorithm().into()
    }

    pub fn public_key(&mut self) -> PublicKey {
        self.public_key
            .get_or_insert_with(|| {
                let inner = self.inner.public_key().clone();
                PublicKey(Rc::new(inner))
            })
            .clone()
    }

    pub fn private_key(&mut self) -> PrivateKey {
        self.private_key
            .get_or_insert_with(|| {
                let inner = self.inner.private_key().clone();
                PrivateKey(Rc::new(inner))
            })
            .clone()
    }
}

#[derive(Debug, Clone)]
#[wasm_bindgen]
pub struct Signature(iroha_crypto::Signature);

#[wasm_bindgen]
impl Signature {
    pub fn from_raw(payload: &[u8]) -> Signature {
        let inner = iroha_crypto::Signature::from_bytes(payload);
        Self(inner)
    }

    pub fn from_raw_hex(hex: String) -> JsResult<Signature> {
        Ok(Self::from_raw(&hex::decode(&hex).wrap_js_error()?))
    }

    pub fn sign(private_key: &PrivateKey, payload: &[u8]) -> Signature {
        let inner = iroha_crypto::Signature::new(&private_key.0, payload);
        Self(inner)
    }

    pub fn sign_hex(private_key: &PrivateKey, hex: String) -> JsResult<Signature> {
        Ok(Self::sign(private_key, &hex::decode(&hex).wrap_js_error()?))
    }

    pub fn verify(&self, public_key: &PublicKey, payload: &[u8]) -> JsResult<()> {
        self.0.verify(&public_key.0, payload).wrap_js_error()
    }

    pub fn verify_hex(&self, public_key: &PublicKey, hex: String) -> JsResult<()> {
        self.verify(public_key, &hex::decode(&hex).wrap_js_error()?)
    }

    pub fn payload(&self) -> Vec<u8> {
        self.0.payload().to_vec()
    }
}
