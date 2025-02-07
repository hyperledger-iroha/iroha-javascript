# `@iroha2/crypto-core`

The core package primary contains types, so you can base your code on them instead of relying on a particular target
implementation. Compiled implementations for each target (`node`, `web`, `bundler`) are in their own packages:

- [`@iroha2/crypto-target-node`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-node)
- [`@iroha2/crypto-target-web`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-web)
- [`@iroha2/crypto-target-bundler`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/target-bundler)

You can learn more about targets in the
[`wasm-bindgen` documentation](https://rustwasm.github.io/docs/wasm-bindgen/reference/deployment.html).

Also, this package re-exports everything from
[`@iroha2/crypto-util` package](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/util).

## Installation

The packages are published under the `@iroha2` scope into Iroha Nexus Registry. To install the necessary packages with
`npm`/`pnpm`:

1. Configure your package manager to fetch scoped packages from Nexus Registry.

   ```ini
   # FILE: .npmrc
   @iroha2:registry=https://nexus.iroha.tech/repository/npm-group/
   ```

2. Install the packages you need:

   ```shell
   pnpm add @iroha2/crypto-core @iroha2/crypto-target-node
   ```

## Guide

### Use target implementation

Each target exports the same `crypto` namespace containing all the types and classes to work with hashes, keys, and
signatures:

```ts
import { crypto } from '@iroha2/crypto-target-node'

const hex = crypto.Hash.hash('hex', '0011ff').bytes('hex')

const signature: crypto.Signature = crypto.KeyGenConfiguration.default()
  .generate()
  .sign('array', new Uint8Array([1, 1, 2, 3]))
```

### Write target-agnostic logic

`cryptoTypes` namespace export in `@iroha2/crypto-core` contains all the **types** you may find in `crypto` namespace
export from `@iroha2/crypto-target-*`:

```ts
import { cryptoTypes } from '@iroha2/crypto-core'

function hashAsHex(hash: cryptoTypes.Hash): string {
  return hash.bytes('hex')
}
```

`IrohaCryptoInterface` type represents the type of `crypto` itself:

```ts
import { IrohaCryptoInterface } from '@iroha2/crypto-core'

function printHexHash(data: Uint8Array, crypto: IrohaCryptoInterface) {
  const hex = crypto.Hash.hash('array', data).bytes('hex')
  console.log({ hex })
}
```

### Avoid memory leaks

WASM objects are deallocated automatically on platforms with
[Weak References support](https://rustwasm.github.io/docs/wasm-bindgen/reference/weak-references.html).

However, on platforms with no support for this feature, all WASM objects must be deallocated manually with `.free()`
method. For example:

```ts
import { crypto } from '@iroha2/crypto-target-node'

const hash = crypto.Hash.hash('hex', '0011ff')
const conf = crypto.KeyGenConfiguration.default().useSeed('array', hash.bytes())
const keypair = conf.generate()

for (const x of [hash, conf]) {
  x.free()
}
```

Fortunately, all such objects are wrapped and tracked so this process can be automated. The previous example can be
re-written in a more _robust_ way that ensures every object is freed:

```ts
// re-export from `@iroha2/crypto-util`
import { freeScope } from '@iroha2/crypto-core'

import { crypto } from '@iroha2/crypto-target-node'

const keypair = freeScope((scope) => {
  const seed = crypto.Hash.hash('hex', '00aa11').bytes()
  const keypair = crypto.KeyGenConfiguration.default().useSeed('array', seed).generate()
  scope.forget(keypair)
  return keypair
})
```

Please refer to
[`@iroha2/crypto-util`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/util)
package documentation for more details.
