# Contributing to Iroha JavaScript

This document explains how this repo works, and how to work with it.

Steps, in short:

1. Install Rust and `wasm-pack`.
2. Install Deno v2 and Node.js v22
3. Link Iroha repository
4. Explore `tasks` in the root `deno.json`
5. Work with the code

TODO: setting up commit hooks

## Installing Rust and `wasm-pack`

```sh
# install rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# add necessary components
rustup component add rust-src --target wasm32-unknown-unknown

# install wasm-pack
curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
```

## Installing Deno & Node.js

This must be pretty straightforward. A few notes though:

- While this project is mostly driven by Deno, there are some Node.js parts, unfortunately. Specifically,
  `tests/browser` is a `pnpm` project, because otherwise it's hard to make Cypress work.
- Thus, run `corepack enable` (or install `npm i -g pnpm`) so that `pnpm` is also available.

## Linking & building Iroha

For this project to function, you must link Iroha repository. There are two ways to do so:

```sh
# symlink to the local path
deno task prep:iroha --path /path/to/local/iroha/clone
```

```sh
# clone the repo
deno task prep:iroha --git https://github.com/hyperledger-iroha/iroha.git --rev v2.0.0-rc.1.0
```

After Iroha is linked, you need to prepare some artifacts from it (binaries such as `irohad`, `kagami`, `iroha_codec`;
`executor.wasm`; `schema.json`):

```sh
deno task prep:iroha:build
```

## Running tests

Please explore `tasks` in the root `deno.jsonc`.

```sh
# run them all
deno task test

# unit, non-integration tests
deno run npm:vitest
# or
pnpm dlx vitest
```

Tests are mostly written in Vitest (except the doctests), and it doesn't work very well with Deno (considering
migration). To improve development experience, consider running Vitest via `pnpm dlx` or similar.
