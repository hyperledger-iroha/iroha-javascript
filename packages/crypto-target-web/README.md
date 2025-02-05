# `@iroha2/crypto-target-web`

The `@iroha2/crypto-target-web` contains a crypto WASM compiled for the `web` target.
This package provides crypto interface for native Web (ESM).

## Usage

```ts
import { crypto, init } from '@iroha2/crypto-target-web'

init().then(() => {
  // use crypto
})
```

> Due to a known [issue](https://github.com/hyperledger/iroha-javascript/issues/104) with [Vite](https://vitejs.dev/), you need to initialise WASM this way:
>
> ```ts
> import { crypto, init } from '@iroha2/crypto-target-web'
> import wasmUrl from '@iroha2/crypto-target-web/wasm-pkg/iroha_crypto_bg.wasm?url'
>
> await init(wasmUrl)
> ```

See [`@iroha2/crypto-core`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/core) package for details.
