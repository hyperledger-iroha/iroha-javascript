# Client Node Integration Tests

This project is a collection of integration tests running from Node.js with actual Iroha peer.

## SDK Compatibility Matrix

Tests for [compatibility matrix](https://hyperledger.github.io/iroha-2-docs/reference/compatibility-matrix.html)
are defined at [`compatibility` directory](./test/compatibility).

The easiest way to run tests:

```shell
# run these commands anywhere in the repo

# install packages, once
pnpm i

# prepare artifacts for tests, once
pnpm jake test:prepare-client-integration

# run tests
pnpm --filter client-test-node test
```

Allure reports are stored after tests run at `./allure-results` directory.
**Note:** these reports contain _all_ tests, not only compatibility tests results.
So, be sure to filter the results by their metadata before submitting them to TestOps.
