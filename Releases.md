### 2025.10.08

#### @iroha/client 0.5.0-alpha (prerelease)

- feat!: support post-`2.0.0-rc.2.0` Iroha (#263)

#### @iroha/client-web-socket-node 0.5.0-alpha (prerelease)

- bump version to be compabible with `@iroha/client@^0.4.0`

#### @iroha/core 0.5.0-alpha (prerelease)

- feat!: support post-`2.0.0-rc.2.0` Iroha (#263)

### 2025.05.09

#### @iroha/client 0.4.0 (minor)

- feat(core, client): include `commitTime` into `Status` (#258)
- refactor(client): move `.peers()` method from TelemetryAPI to MainAPI (#259)

#### @iroha/client-web-socket-node 0.4.0 (minor)

- bump version to be compabible with `@iroha/client@^0.4.0`

#### @iroha/core 0.4.0 (minor)

- feat(core, client): include `commitTime` into `Status` (#258)

### 2025.04.16

#### @iroha/client 0.4.0-beta.1 (prerelease)

- refactor(client)!: updated config endpoints (#251)
- docs(client): remove redundant note about selectors design (#247)

#### @iroha/core 0.4.0-beta.1 (prerelease)

- refactor(core)!: support of wip `rc.2` (NFTs & empty blocks) (#251)
- perf(core)!: optimise interop with crypto wasm, change some crypto apis (#248)

### 2025.03.13a

#### @iroha/core 0.3.1 (patch)

- docs(core): update compatibility info

### 2025.03.13

#### @iroha/client 0.3.0 (minor)

- feat(core, client)!: prototype-based selectors and predicates (#235)
- refactor(client)!: rename structs and params, extend docs #130 (#231)
- chore(core, client): exclude extra files from publishing #211 (#232)

#### @iroha/core 0.3.0 (minor)

- feat(core, client)!: prototype-based selectors and predicates (#235)
- fix(core): inline .wasm (#243)
- chore(core, client): exclude extra files from publishing #211 (#232)

### 2025.02.19

#### @iroha/client 0.2.0 (minor)

- bump version to update @iroha/core dependency
- docs(core, client): extend docs, link modules (#226)

#### @iroha/core 0.2.1 (patch)

- docs(core, client): extend docs, link modules (#226)

### 2025.02.18

#### @iroha/core 0.2.0 (minor)

- fix(core)!: unified .wasm import (close #209, #221) (#222)

**Migration:** there is no need to use `@iroha/crypto-target-*` or `setWASM()` anymore. Just use `@iroha/core` and it
should work.

#### @iroha/crypto-target-*

These packages are removed.
