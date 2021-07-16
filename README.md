# iroha2-dev

Here is the monorepo with Iroha 2 JavaScript client (includes SCALE codec implementation, Iroha Data Model and Crypto).

### Package manager

Monorepository is controlled via `pnpm`.

### Build all for usage

You should pre-build the following packages:

- @iroha/crypto
- @iroha/scale-codec-legacy

You can find specific instruction in the READMEs of each package.

### Problems

Questions:

- How to solve wasm-universality problem? I want to have universal `@iroha/crypto` api, without async `init` function on web.
- Should be some packages to be published on NPM registry? They are really draft and will be heavily refactored in the future, may be without saving of their structure and name.
