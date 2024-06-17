# Iroha2 JavaScript

JavaScript SDK for [Iroha 2](https://github.com/hyperledger/iroha/tree/iroha2/).

The Iroha 2 JavaScript library includes the following packages:

- [`@iroha2/client`](./packages/client/) submits requests to the Iroha peer
- [`@iroha2/crypto-*`](./packages/crypto/):
  - [`@iroha2/crypto-core`](./packages/crypto/packages/core/) provides unified crypto interface for Iroha 2
  - [`@iroha2/crypto-target-node`](./packages/crypto/packages/target-node/) provides compiled crypto WASM for the Node.js environment
  - [`@iroha2/crypto-target-web`](./packages/crypto/packages/target-web/) provides compiled crypto WASM for native Web (ESM)
  - [`@iroha2/crypto-target-bundler`](./packages/crypto/packages/target-bundler/) provides compiled crypto WASM to use with bundlers such as Webpack
- [`@iroha2/data-model`](./packages/data-model/) provides SCALE codecs for Iroha 2 data model

Other packages you can find in this repository:

- [`@iroha2/docs-recipes`](./packages/docs-recipes/) contains code samples used in documentation
- [`@iroha2/data-model-schema`](./packages/data-model-schema/) contains Iroha 2 Schema
- [`@iroha2/i64-fixnum`](./packages/i64-fixnum/) handles operations with fixed-point numbers

## Installation

The packages are published under the `@iroha2` scope into Iroha Nexus Registry. To install them using `npm`/`pnpm`, follow these steps:

1. Configure your package manager to fetch scoped packages from Nexus Registry:

   ```ini
   # FILE: .npmrc
   @iroha2:registry=https://nexus.iroha.tech/repository/npm-group/
   ```

2. Install these packages as any other NPM package:

   ```shell
   npm i @iroha2/client
   yarn add @iroha2/data-model
   pnpm add @iroha2/crypto-target-web
   ```

## Get Started

Check out [Hyperledger Iroha 2 Tutorial](https://hyperledger.github.io/iroha-2-docs/) that introduces you to Iroha 2 concepts and features and provides you with a step-by-step guide for JavaScript/TypeScript.

## Maintenance

Make sure you have installed **Node.js v16.17 or v18**. As for a package manager, this project uses [PNPM](https://pnpm.io/).

Also make sure you have installed the following version of **Rust toolchain**:

```bash
rustup default nightly-2023-06-25
```

Before working with the repository, install the necessary packages:

```bash
pnpm install
```

### Scripts

Most tasks are defined via [Jake](https://github.com/jakejs/jake), a JavaScript build tool. To explore available tasks, run:

```bash
pnpm jake -t
```

However, some tasks are defined directly in `package.json` and could be run with `pnpm run`:

- Check or fix lint errors:

  ```bash
  pnpm lint
  pnpm lint --fix
  ```

- Fix formatting:

  ```bash
  pnpm format:fix
  ```

Each monorepo package might have its own scripts and tasks. You can find the package details in a README for that package.

### Manually update reference Iroha version

1. Update `packages/iroha-source/config.js`:

   ```js
   export default {
     origin: 'https://github.com/hyperledger/iroha.git',
     rev: '52dc18cd81bdc1d1906ffeecb666dd9b2eb27955',
   }
   ```

2. Perform full-featured repo check, running:

   ```bash
   pnpm jake run-all-checks
   ```

3. If something is broken, fix it!

4. If you are going to publish updated SDK, update `packages/client/README.md` and `packages/data-model/README.md`. In the beginning they have the following note:

   > This package targets `hyperledger/iroha` at current `iroha2-lts` branch, which has a hash `b783f10fa7de26ed1fdd4c526bd162f8636f1a65`.

   Put here new Iroha 2 reference commit information.

### SDK Compatibility Matrix Tests

There are certain integration tests
that are part of the [Compatibility Matrix](https://hyperledger.github.io/iroha-2-docs/reference/compatibility-matrix.html) endeavour.
To read more about it, follow the [client Node integration tests](./packages/client/test/integration/test-node).
