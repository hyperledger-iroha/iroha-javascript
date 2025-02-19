### 2025.02.19

#### @iroha/client 0.2.0 (major)

- bump version to update @iroha/core dependency
- docs(core, client): extend docs, link modules (#226)

#### @iroha/core 0.2.1 (patch)

- docs(core, client): extend docs, link modules (#226)

### 2025.02.18

#### @iroha/core 0.2.0 (major)

- fix(core)!: unified .wasm import (close #209, #221) (#222)

**Migration:** there is no need to use `@iroha/crypto-target-*` or `setWASM()` anymore. Just use `@iroha/core` and it
should work.

#### @iroha/crypto-target-*

These packages are removed.
