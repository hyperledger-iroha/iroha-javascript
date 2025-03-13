use alloc::string::ToString;
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
