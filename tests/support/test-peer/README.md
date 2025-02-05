# `@iroha2/test-peer`

The `@iroha2/test-peer` package is a wrapper around the `iroha_cli` crate binary that provides an easy-to-use interface for working with the Iroha peer. The package is useful for tests and is used by `@iroha2/client` for its e2e-tests.

## Installation

**Note**: The `@iroha2/test-peer` package requires Rust toolchain and Cargo to be installed on the working machine.

The package initializes on `postinstall` hook. If you have installed workspace packages, then it should be ready to use. If not, you could manually run `pnpm postinstall` script in this package.

## Peer logs

**Tip**: Explore underlying peer logs. Use [`DEBUG` convention](https://github.com/visionmedia/debug#usage).

For example:

```shell
DEBUG=* pnpm cli -- start
```
