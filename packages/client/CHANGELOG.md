# @iroha2/client

## 7.1.0

### Minor Changes

- a780a96: **feat:** add full support of Query API, soft-deprecating previous improper implementation

  The new implementation is available via `Client.query`, `Torii.queryWithParams`, and `doQuery` functions.

- 787a198: **refactor:** handle the major update of `@iroha2/crypto-core`
- a780a96: **feat:** soft-deprecate `computeTransactionHash`; add `computeTransactionPayloadHash` & `computeSignedTransactionHash` instead, with descriptions which one to use and when

### Patch Changes

- Updated dependencies [787a198]
  - @iroha2/crypto-core@2.0.0
  - @iroha2/data-model@7.1.0

## 7.0.0

### Major Changes

- e0459fa: **Target [Iroha `2.0.0-pre-rc.20`](https://github.com/hyperledger/iroha/tree/51d687607fad067fc855e266edc684d4fb33e7de)**

### Patch Changes

- e0459fa: refactor: follow the update of the data model
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
- Updated dependencies [e0459fa]
  - @iroha2/data-model@7.0.0
  - @iroha2/crypto-core@1.1.1

## 6.0.0

### Major Changes

- 40516f1: Updated according to Iroha `2.0.0-pre-rc.14` (internal release, reference hash: `726f5eabf65a79ea618b4fce62a09cee7a5b13d1`)

  Notable changes:

  - Renamed structure: ~~`QueryError`~~ `QueryExecutionFailure`
  - Introduced new enum struct, `Algorithm`. Changed `digest_function: string` field in `PublicKey` and `PrivateKey` to `digest_function: Algorithm`:
    ```ts
    PublicKey({
      digest_function: Algorithm('Ed25519'),
      // ...
    })
    ```

### Patch Changes

- Updated dependencies [40516f1]
- Updated dependencies [40516f1]
  - @iroha2/data-model@6.0.0
  - @iroha2/crypto-core@1.1.0

## 5.0.0

### Major Changes

- d1e5f68: **chore!**: remove deprecated `makeSignedTransaction` and `makeSignedQuery` helpers
- d1e5f68: **refactor!**: remove `accepted` socket event due to the change in how WebSocket communication is now happening

### Patch Changes

- 3ff768d: **docs**: update target Iroha version (`c4af68c4f7959b154eb5380aa93c894e2e63fe4e`)
- Updated dependencies [d1e5f68]
- Updated dependencies [3ff768d]
- Updated dependencies [d1e5f68]
  - @iroha2/data-model@5.0.0
  - @iroha2/crypto-core@1.0.1

## 4.1.0

### Minor Changes

- 650cdb0: **chore**: update `ws` version; move `ws` and `@types/ws` to peer dependencies
- ddfeeac: **refactor**: target new major version of `@iroha2/crypto-core`

### Patch Changes

- 650cdb0: **docs**: update README
- Updated dependencies [ddfeeac]
  - @iroha2/crypto-core@1.0.0
  - @iroha2/data-model@4.1.0

## 4.0.0

### Major Changes

- e27467e: Update client library after data-model update in Iroha 2.
- bd757cf: **refactor!**: make `Torii` stateless; force prerequisites to be passed for each method.

  ##### What is the change

  Previously, `Torii` was a class, and its constructor accepted all prerequisites at once:

  ```ts
  const torii = new Torii({ apiURL, telemetryURL, fetch, ws })

  torii.submit(transaction)
  torii.getStatus()
  torii.listenForEvents({ filter })
  ```

  Now, `Torii` is a compendium of different methods. Each method has its own prerequisites:

  ```ts
  Torii.submit({ apiURL, fetch }, transaction)

  Torii.getStatus({ telemetryURL, fetch })

  Torii.listenForEvents({ apiURL, ws }, { filter })
  ```

  ##### Why the change was made

  This change was introduced to allow you to only provide the prerequisites each method actually needs. For example, you no longer need to provide `ws` when all you want to do is submit a transaction. Only `fetch` and `apiURL` are needed for transaction to be submitted.

  ##### How to update your code

  You should pass the necessary prerequisites for each `Torii` method invocation.

  Previously, you had to create a single `Torii` instance:

  ```ts
  const torii = new Torii({ apiURL, telemetryURL, fetch, ws })
  ```

  You no longer need a single `Torii` instance. Instead, you create an object with necessary prerequisites:

  ```ts
  const pre = { apiURL, fetch }
  ```

  Then pass the prerequisites when you need to call this method:

  ```ts
  Torii.submit(pre, transaction)
  ```

### Minor Changes

- e27467e: Some functions were renamed:

  - `makeSignedTransaction` → `makeVersionedSignedTransaction`
  - `makeSignedQuery` → `makeVersionedSignedQuery`

  Old names are still accessible. They are marked as `deprecated` and will be removed in future major releases.

- bd757cf: **feat**: expose `keyPair` as a `public readonly` field from `Signer`

### Patch Changes

- Updated dependencies [e27467e]
  - @iroha2/data-model@4.0.0

## 3.0.0

### Major Changes

- 3b0db98: **refactor!**: split the library functionality into `Torii`, `Signer` and `Client` entities.

  ##### What is the change

  Previously, the `Client` class did everything: constructed transaction payloads, signed and submitted them, submitted queries, and so on. Now some of this functionality is handled by other classes.

  `Torii` does everything related to HTTP/WebSocket communication with Iroha Peer. `Signer` makes signatures. `Client` only wraps `Torii` and `Signer` and combines them together to create convenient methods. Utilities (e.g. making payloads, signing them, wrapping into final containers) are exported from the library as separate functions.

  ##### Why the change

  This change is based on a request to extend library functionality and make codebase more scalable. Separating crypto and transport functionality is a common practice for blockchain SDKs (e.g. take a look at [`ethers` project](https://docs.ethers.io/v5/)).

  ##### How to update your code

  The changes you need to make to the code are rather straightforward. Here we provide a couple of examples for you to compare the code before and after this breaking change. You can refer to `Torii`, `Signer` and `Client` type definitions for details.

  `Client` used to be initialized like this:

  ```ts
  import { Client } from '@iroha2/client'

  const client = new Client({
    torii: {
      apiURL: 'http://127.0.0.1:8080',
      telemetryURL: 'http://127.0.0.1:8081',
    },
    accountId,
    keyPair,
    fetch,
    ws,
  })
  ```

  Now you need to initialize `Signer` and `Torii` separately before `Client` initialization:

  ```ts
  import { Client, Torii, Signer } from '@iroha2/client'

  const signer = new Signer(accountId, keyPair)

  const torii = new Torii({
    apiURL: 'http://127.0.0.1:8080',
    telemetryURL: 'http://127.0.0.1:8081',
    fetch,
    ws,
  })

  const client = new Client({ torii, signer })
  ```

  As for `Client` methods, they used to be called like this:

  ```ts
  client.submit(executable)
  client.request(queryBox)
  client.getHealth()
  client.listenForEvents({ filter })
  ```

  Now some methods are called directly via `Client` instance, while others are called via nested `Torii` instance:

  ```ts
  client.submitExecutable(executable)
  client.requestWithQueryBox(queryBox)
  client.torii.getHealth()
  client.torii.listenForEvents({ filter })
  ```

### Minor Changes

- 3b0db98: **feat**: export utility functions to deal with Transaction/Query payload building, hashing and signing.

  For transactions:

  - `makeTransactionPayload()`
  - `computeTransactionHash()`
  - `signTransaction()`
  - `makeSignedTransaction()`
  - `executableIntoSignedTransaction()`

  For queries:

  - `makeQueryPayload()`
  - `computeQueryHash()`
  - `signQuery()`
  - `makeSignedQuery()`
  - `queryBoxIntoSignedQuery()`

### Patch Changes

- Updated dependencies [3b0db98]
  - @iroha2/data-model@3.0.0

## 2.0.2

### Patch Changes

- fbe19e9: **chore**: fix typo
- fbe19e9: **docs**: update versions table in README, chores
- Updated dependencies [fbe19e9]
  - @iroha2/data-model@2.0.2

## 2.0.1

### Patch Changes

- ff266d3: Import `json-bigint/lib/parse.js` directly - thus Node.js in ESM mode doesn't fail
- ff266d3: Update `@scale-codec/*` version that uses correct `.mjs` ext for ESM bundles
- Updated dependencies [ff266d3]
  - @iroha2/data-model@2.0.1

## 2.0.0

### Major Changes

- a99d219: **feat!**: move isomorphic http/ws adapters out of `Client` internals; expose `@iroha2/client/web-socket/native` and `@iroha2/client/web-socket/node` adapters

  ##### Why the change

  Previously, `@iroha2/client` used `@iroha2/client-isomorphic-ws` and `@iroha2/client-isomorphic-fetch` to seamlessly switch between environment-specific transports.

  The switching was done by `module` and `main` fields in `package.json` files due to how they work in CommonJS (CJS) and ESM contexts. In Node.js it was supposed to always be CJS context, and ESM was for browser context with its native APIs.

  However, Node.js is moving towards ESM, and our way to achieve isomorphism no longer works in this case. In ESM, our hack tries to use a browser's native `fetch` and `WebSocket`, which aren't available in Node.js. So we needed to find some other way.

  ##### What is the change

  We looked at how [`isomorphic-git`](https://github.com/isomorphic-git/isomorphic-git/tree/main#getting-started) solves the same problem and decided to force the end users to inject `fetch` and `ws` by themselves.

  Note that `fetch` injection is optional in the environment where Fetch API is available (i.e. in Browser or in Node > 17.5). Also, `@iroha2/client` exposes prepared adapters for WebSockets based on native `WebSocket` and on [`ws`](https://www.npmjs.com/package/ws) library.

  ##### How to migrate

  Provide `fetch`/`ws` by yourself. Follow the instruction in [`client` README](./README.md#isomorphic-transports).

### Minor Changes

- a99d219: **fix!**: define `exports` field; use `*.cjs` extension for `require()` imports and `*.mjs` for `import`

### Patch Changes

- Updated dependencies [a99d219]
  - @iroha2/data-model@2.0.0

## 1.4.0

### Patch Changes

- Updated dependencies [5439042]
  - @iroha2/data-model@1.4.0

## 1.3.0

### Minor Changes

- bdddf78: **breaking**: update and data-model accordingly to Iroha 2 RC 5 (`43be45fc7fb7b0bd73f87b4fef167d61680c8e1e`)
- bdddf78: **feat**: `client.request()` now accepts optional filter as `PredicateBox`

### Patch Changes

- 7ca19df: **feat**: `client.getHealth()` catches fetch errors and wraps them into `Result::Err` variant
- Updated dependencies [bdddf78]
  - @iroha2/data-model@1.3.0

## 1.2.1

### Patch Changes

- 49c8451: chore: include only necessary files into `files` field in the `package.json`
- Updated dependencies [49c8451]
- Updated dependencies [49c8451]
  - @iroha2/crypto-core@0.1.1
  - @iroha2/data-model@1.2.1
  - @iroha2/client-isomorphic-fetch@0.2.0

## 1.2.0

### Minor Changes

- update client according to updated data-model for RC4 (`d00e0a9172d2a887a97f504796db5f2e05939c10`)

### Patch Changes

- Updated dependencies
  - @iroha2/data-model@1.2.0

## 1.1.0

### Minor Changes

- e34f8a5: update client according to Iroha 2 RC 3 (`8d83a3eff33f29b49004a0a5efe643b10f0f256e`)

### Patch Changes

- Updated dependencies [a453fcd]
- Updated dependencies [a453fcd]
- Updated dependencies [e34f8a5]
  - @iroha2/data-model@1.1.0

## 1.0.0

### Major Changes

- b86aa76: Target Iroha: `iroha v2.0.0-pre-rc.2` (`920e4d12754b0f3bf08cbaa5221d91c27863fcdc`)

  - Using updated Data Model
  - Completely refactor client methods, extend them with new APIs - `setPeerConfig()`, `getMetrics()`, `listenForBlocksStream()`
  - New client configuration accepts account id and key pair
  - `Client.create()` -> `new Client()`

### Patch Changes

- Updated dependencies [b86aa76]
- Updated dependencies [b86aa76]
  - @iroha2/data-model@1.0.0
  - @iroha2/client-isomorphic-ws@0.2.0

## 0.4.1

### Patch Changes

- 81f5a88: **fix**: use isomorphic implementations of Fetch API and WebSocket API

## 0.4.0

### Minor Changes

- 98d3638: **breaking**: remove `*` re-export from `@iroha2/data-model`
- 98d3638: **feat**: add `status` endpoint implementation
- 98d3638: **breaking**: update configuration format

  - Now both Torii API URl & Torii Status URL are optional, so it is possible to use client partially, e.g. if you only need to check status.
  - `crypto` injection is excluded from the config. Now it should be set globally with `setCrypto()` function.

### Patch Changes

- 92c5a9a: Add library top-level short documentation
- 92c5a9a: Export `SetupEventsParams` type
- Updated dependencies [92c5a9a]
- Updated dependencies [98d3638]
  - @iroha2/data-model@0.5.0

## 0.3.0

### Minor Changes

- c59c85b: **Breaking:** update data model generation approach & usage with updated SCALE codec kit

### Patch Changes

- Updated dependencies [c59c85b]
  - @iroha2/data-model@0.4.0

## 0.2.4

### Patch Changes

- 0a583c2: deps: update code accordingly to changes in data-model pkg
- Updated dependencies [0a583c2]
- Updated dependencies [0a583c2]
  - @iroha2/data-model@0.3.0

## 0.2.3

### Patch Changes

- 1833de7: Update due to bump of `@iroha2/data-model` pkg
- Updated dependencies [1833de7]
  - @iroha2/data-model@0.2.1
