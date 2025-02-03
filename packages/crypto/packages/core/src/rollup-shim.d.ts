declare module '@iroha2/crypto-core~rollup-wasm' {
  // we use `nodejs`, but we could you any other - they _must_ be intercompatible
  export * as wasmPkg from '@iroha2/~crypto-wasm-pkg/nodejs'
}
