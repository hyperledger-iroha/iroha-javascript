use alloc::string::{String, ToString};
use alloc::vec::Vec;
use core::fmt::Display;

use wasm_bindgen::prelude::*;

pub trait JsErrorResultExt<T> {
    fn wrap_js_error(self) -> Result<T, JsError>;
}

impl<T, E: Display> JsErrorResultExt<T> for Result<T, E> {
    fn wrap_js_error(self) -> Result<T, JsError> {
        self.map_err(|e| JsError::new(&e.to_string()))
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Bytes")]
    pub type BytesJs;
}

#[wasm_bindgen(typescript_custom_section)]
const TS_BYTES: &str = r#"
export type Bytes =
    | { t: 'array', c: Uint8Array }
    | { t: 'hex', c: string }
"#;

impl TryFrom<BytesJs> for Vec<u8> {
    type Error = JsError;

    fn try_from(value: BytesJs) -> Result<Self, Self::Error> {
        #[derive(serde::Deserialize)]
        #[serde(tag = "t", content = "c", rename_all = "lowercase")]
        enum Repr {
            Array(Vec<u8>),
            Hex(String),
        }

        let structured: Repr = serde_wasm_bindgen::from_value(value.obj)?;
        let vec = match structured {
            Repr::Array(vec) => vec,
            Repr::Hex(hexstr) => hex::decode(hexstr).wrap_js_error()?,
        };

        Ok(vec)
    }
}
