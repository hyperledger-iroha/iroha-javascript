# Contributing to Iroha JavaScript

This document explains how this repo works, and how to work with it.

## Pull Requests

1. [Install the Deno CLI](https://docs.deno.com/runtime/manual/getting_started/installation).
2. [Install Node.js v22+](https://nodejs.org/en/download).
   - And enable Corepack by `corepack enable` (making `pnpm` available).
3. Install [the Rust toolchain](https://rustup.rs/) and [`wasm-pack`](https://rustwasm.github.io/wasm-pack/installer/).
   - Also make sure to install components: `rustup component add rust-src --target wasm32-unknown-unknown`.
4. Clone & fork this repository.
5. Link Iroha repository (see [below](#linking--building-iroha)).
6. Create a new branch for your changes.
7. Make your changes to the repo and ensure `deno task ok` passes successfully.
8. Commit your changes with clear messages, preferably following [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
9. Submit a pull request.



## Linking & Building Iroha

For this project to function, you must link Iroha repository. There are two ways to do so.

**Clone Iroha repository:**

```sh
deno task prep:iroha --git https://github.com/hyperledger-iroha/iroha.git --git-rev v2.0.0-rc.1.0
```

**Symlink to a local path:**

```sh
deno task prep:iroha --path /path/to/local/iroha/clone
```

## Making Releases

[`@deno/bump-workspaces`](https://github.com/denoland/bump-workspaces) could be of help:

```shell
deno run -A jsr:@deno/bump-workspaces@0.1.22/cli --dry-run
```

Guideline:

1. Bump versions using the tool.
2. Submit a PR with the changes of the versions and `Releases.md`.
3. Merge, tag the commit in format `release-2025-02-20`, and push it.
4. Create a release on GitHub at this tag, using the new piece of `Releases.md` as a description and date (e.g. "2025.02.20") as a title.

## Setting Up Commit Hooks _(optional)_

You can add this to `.git/hooks/pre-commit`:

```shell
#!/bin/sh
deno task ok
```
