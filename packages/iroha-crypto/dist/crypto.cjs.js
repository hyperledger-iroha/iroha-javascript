"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports[Symbol.toStringTag]="Module";Symbol.toStringTag;let e=new("undefined"==typeof TextDecoder?(0,module.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});e.decode();let t=null;function r(){return null!==t&&void 0===t.buffer||(t=new Uint8Array(void 0)),t}let o=0;function n(e,t){const n=t(1*e.length);return r().set(e,n/1),o=e.length,n}let i=null;function d(){return null!==i&&void 0===i.buffer||(i=new Int32Array(void 0)),i}function u(e,t){return r().subarray(e/1,e/1+t)}exports.__wbindgen_throw=function(t,o){throw new Error((n=t,i=o,e.decode(r().subarray(n,n+i))));var n,i},exports.create_blake2b_32_hash=function(e){try{const l=(void 0)(-16);(void 0)(l,n(e,void 0),o);var t=d()[l/4+0],r=d()[l/4+1],i=u(t,r).slice();return(void 0)(t,1*r),i}finally{(void 0)(16)}},exports.sign_with_ed25519_sha512=function(e,t){try{const a=(void 0)(-16);(void 0)(a,n(e,void 0),o,n(t,void 0),o);var r=d()[a/4+0],i=d()[a/4+1],l=u(r,i).slice();return(void 0)(r,1*i),l}finally{(void 0)(16)}};
