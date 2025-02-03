declare module '@iroha2/crypto-target-web~rollup-wasm' {
  export * as wasmPkg from '../../../crypto-rs/wasm-pkg-web/iroha_crypto'
  export { default as init } from '../../../crypto-rs/wasm-pkg-web/iroha_crypto'
}
