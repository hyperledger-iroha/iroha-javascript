# @iroha2/crypto-target-web

## 2.0.0

### Major Changes

- 787a198: **Breaking:** Complete rewrite of crypto WASM, and major update of the surrounding API.

  - Now WASM is made from the original `iroha_crypto` from Iroha 2 repo. As one of the outcomes, binary blob size is
    reduced from 2mb to 600kb.
  - Remove `KeyGenConfiguration`. Use `KeyPair.deriveFromSeed`, `KeyPair.deriveFromPrivateKey`, and `KeyPair.random`
    instead.
  - Normalise API across `PublicKey`, `PrivateKey`, `KeyPair`, and `Signature` classes (JSON methods, raw conversion
    methods etc.)
  - Introduce `Bytes` utility to accept binary input either as `Bytes.array([1, 2, 3])` or `Bytes.hex('001122')`
  - Export more types¡

  See the [issue](https://github.com/hyperledger/iroha-javascript/issues/186) for related context.

### Patch Changes

- Updated dependencies [787a198]
  - @iroha2/crypto-core@2.0.0
  - @iroha2/data-model@7.1.0

## 1.1.1

### Patch Changes

- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
  - @iroha2/data-model@7.0.0
  - @iroha2/crypto-core@1.1.1

## 1.1.0

### Minor Changes

- 40516f1: **refactor**: combine new `Algorithm` type and codec from `data-model` with the crypto's `Algorithm` type,
  which is simply a string. Add `Algorithm.toDataModel` and `Algorithm.fromDataModel` methods.

### Patch Changes

- Updated dependencies [40516f1]
- Updated dependencies [40516f1]
  - @iroha2/data-model@6.0.0
  - @iroha2/crypto-core@1.1.0

## 1.0.1

### Patch Changes

- Updated dependencies [d1e5f68]
- Updated dependencies [3ff768d]
- Updated dependencies [d1e5f68]
  - @iroha2/data-model@5.0.0
  - @iroha2/crypto-core@1.0.1

## 1.0.0

### Major Changes

- ddfeeac: **feature**: re-write WASM and provide high-level wrappers around it.

  #### What the braking change is

  Each target now provides high-level wrappers around raw `wasm-pack` artifacts. These wrappers provide a
  better-designed interface with features like global `.free()`-objects tracking and integration with
  `@iroha2/data-model`.

  Moreover, the WASM itself is re-written and now provides more flexibility, such as working with JSON and HEX
  representations out of the box.

  Here you can see how `@iroha2/crypto-core` and `@iroha2/crypto-target-*` are connected:

  ```ts
  import { cryptoTypes, IrohaCryptoInterface } from '@iroha2/crypto-core'
  import { crypto } from '@iroha2/crypto-target-node'

  // each target exports `crypto`, which is the `IrohaCryptoInterface` type from
  // the core library
  const cryptoAsserted: IrohaCryptoInterface = crypto

  // the core library exports `cryptoTypes` namespace which contains all the types
  // used in crypto you might need
  const hash: cryptoTypes.Hash = crypto.Hash.hash('hex', '00ff')
  ```

  `@iroha2/crypto-core` re-exports `@iroha2/crypto-util`, a new library which contains (for now) only utilities to work
  with `.free()` tracking:

  ```ts
  import { FREE_HEAP, freeScope } from '@iroha2/crypto-util'
  import { crypto } from '@iroha2/crypto-target-web'

  const keyPair = freeScope((scope) => {
    const pair = crypto.KeyGenConfiguration
      // Create a configuration object that you can later `.free()` manually.
      // It is automatically attached to the scope it is created within,
      // so when the scope is over, everything attached to it will be freed.
      .default()
      .useSeed('hex', 'ff')
      // Create a new `.free()` object: a key pair
      .generate()

    // to use the key pair (and nothing else) out of scope,
    // you need to "untrack" it
    scope.forget(pair)

    return pair
  })

  // inspect the heap in order to determine if there are memory leaks
  if (FREE_HEAP.size > 1) {
    console.log('Something went wrong, I guess?')
  }
  ```

  #### Why the change was made

  Codegen of `wasm_bindgen` is very limited. This change is made to provide a better quality and safer API over crypto
  WASM.

  #### How a consumer should update their code

  Unfortunately, the code should be updated completely. Here are some major points you should note.

  `IrohaCryptoInterface` type from the core package is still the same as `crypto` export from target packages, but the
  content of the type is completely different.

  Previously, types such as `Hash`, `Signature`, `PublicKey` were separate exports from the core library. Now they are
  contained within the `cryptoTypes` namespace:

  ```ts
  // doesn't work anymore
  // import { Hash } from '@iroha2/crypto-core'

  import { cryptoTypes } from '@iroha2/crypto-core'

  type Hash = cryptoTypes.Hash
  ```

### Patch Changes

- Updated dependencies [ddfeeac]
  - @iroha2/crypto-core@1.0.0
  - @iroha2/data-model@4.1.0

## 0.4.0

## 0.3.0

### Minor Changes

- a99d219: **fix!**: define `exports` field; use `*.cjs` extension for `require()` imports and `*.mjs` for `import`

### Patch Changes

- 09f04df: **fix**: move `@iroha2/crypto-core` to direct dependencies

## 0.2.0

### Minor Changes

- 6f6163f: **BREAKING:**

  - Package contents are moved to `dist` directory;
  - Compiled WASM is moved to `dist/wasm` directory.
  - Compiled WASM is renamed to `crypto` (from `wasm_pack_output`)

  **How to migrate:**

  - If you have imported WASMs like this:

    ```ts
    import rawWasm from '@iroha2/crypto-target-*/wasm_pack_output_bg.wasm'
    ```

    then now you should change import path:

    ```ts
    import rawWasm from '@iroha2/crypto-target-*/dist/wasm/crypto_bg.wasm'
    ```

### Patch Changes

- 49c8451: fix: make `@iroha2/crypto-core` a prod dependency, not a dev
- 6f6163f: rebuild WASM
- 49c8451: chore: include only necessary files into `files` field in the `package.json`

## 0.1.1

### Patch Changes

- 98d3638: recompile wasms
