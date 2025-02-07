# @iroha2/data-model

## 7.1.0

## 7.0.0

### Major Changes

- e0459fa: **Target
  [Iroha `2.0.0-pre-rc.20`](https://github.com/hyperledger/iroha/tree/51d687607fad067fc855e266edc684d4fb33e7de)**
- e0459fa: **feat!**: enhance schema transformation.

  - Support new schema format
  - Remove null aliases. Mostly, it simplifies `QueryBox` enum, e.g. instead of `QueryBox('FindAllAccounts', null)` it
    is now enough to write `QueryBox('FindAllAccounts')`
  - Filter several single-field structures in order to avoid extra nesting. This includes:
    - `EvaluatesTo<..>`
    - `SignaturesOf<..>`
  - Simplify `HashOf<..>` to `Hash`
  - Handle `NonZero<..>` integers properly

- e0459fa: **refactor!**: join all data-model types as `datamodel` namespace export

  ##### What is the change

  Previously, all data-model types were imported directly from the package:

  ```ts
  import { AccountId, DomainId } from '@iroha2/data-model'

  const acc = AccountId({
    name: 'alice',
    domain_id: DomainId({
      name: 'wonderland',
    }),
  })
  ```

  Now all data-model types are joined into a single `datamodel` namespace:

  ```ts
  import { datamodel } from '@iroha2/data-model'

  const acc = datamodel.AccountId({
    name: 'alice',
    domain_id: datamodel.DomainId({
      name: 'wonderland',
    }),
  })
  ```

  ##### Why the change was made

  - To make it easier to distinguish data-model related exports from other utilities as there used to be too many
    root-level package exports, not always related to each other.
  - To make data model more compatible with how it is presented in Java SDK

  ##### How the consumer should update their code

  The consumer should replace all data-model imports with `datamodel.*`.

### Minor Changes

- e0459fa: **build**: preserve modules for ESM and types target; update `exports` mapping in `package.json`
- e0459fa: **feat**: introduce `sugar` namespace to do common data-model operations more conveniently (wip)

## 6.0.0

### Major Changes

- 40516f1: Updated according to Iroha `2.0.0-pre-rc.14` (internal release, reference hash:
  `726f5eabf65a79ea618b4fce62a09cee7a5b13d1`)

  Notable changes:

  - Renamed structure: ~~`QueryError`~~ `QueryExecutionFailure`
  - Introduced new enum struct, `Algorithm`. Changed `digest_function: string` field in `PublicKey` and `PrivateKey` to
    `digest_function: Algorithm`:
    ```ts
    PublicKey({
      digest_function: Algorithm('Ed25519'),
      // ...
    })
    ```

## 5.0.0

### Major Changes

- d1e5f68: **refactor!**: introduce new `NonZeroU8` codec; make it and `FixedPointI64P9` opaque factories
- d1e5f68: **refactor!**: update major version of `@scale-codec/*` - new wrapped enums and stronger types

  The change in short is the following:

  ```ts
  import { Value } from '@iroha2/data-model'

  const value = Value('U32', 42)

  // - Accessing the enum itself with `.enum`
  // - `.tag === 'U32'` instead of `.is('U32')`
  if (value.enum.tag === 'U32') {
    // Accessing enum content directly, with type narrowing
    const num1: number = value.enum.content

    // Also works
    const num2: number = value.enum.as('U32')
    const _: never = value.enum.as('U128')
  }
  ```

  Please consider the following changelogs for in-detail explanations:

  - [`@scale-codec/enum@2.0.0`](https://github.com/soramitsu/scale-codec-js-library/blob/master/packages/enum/CHANGELOG.md#200)
  - [`@scale-codec/definition-compiler@4.0.0`](https://github.com/soramitsu/scale-codec-js-library/blob/master/packages/definition-compiler/CHANGELOG.md#400)

### Patch Changes

- 3ff768d: **docs**: update target Iroha version (`c4af68c4f7959b154eb5380aa93c894e2e63fe4e`)

## 4.1.0

## 4.0.0

### Major Changes

- e27467e: Update data model to align it with the updated model in the upcoming Iroha 2 LTS.

  Notable changes:

  - `Transaction` → `SignedTransaction`
  - `VersionedTransaction` → `VersionedSignedTransaction`

## 3.0.0

### Patch Changes

- 3b0db98: **chore**: bump `@scale-codec/*` version
- Updated dependencies [3b0db98]
  - @iroha2/i64-fixnum@0.4.2

## 2.0.2

### Patch Changes

- fbe19e9: **docs**: update versions table in README, chores

## 2.0.1

### Patch Changes

- ff266d3: Update `@scale-codec/*` version that uses correct `.mjs` ext for ESM bundles
- Updated dependencies [ff266d3]
  - @iroha2/i64-fixnum@0.4.1

## 2.0.0

### Minor Changes

- a99d219: **fix!**: define `exports` field; use `*.cjs` extension for `require()` imports and `*.mjs` for `import`

### Patch Changes

- Updated dependencies [a99d219]
  - @iroha2/i64-fixnum@0.4.0

## 1.4.0

### Minor Changes

- 5439042: **feat**: update data model according to Iroha `2.0.0-pre-rc.6-lts`
  (`75da907f66d5270f407a50e06bc76cec41d3d409`)

## 1.3.0

### Minor Changes

- bdddf78: **breaking**: update and data-model accordingly to Iroha 2 RC 5 (`43be45fc7fb7b0bd73f87b4fef167d61680c8e1e`)

## 1.2.1

### Patch Changes

- 49c8451: chore: include only necessary files into `files` field in the `package.json`
- Updated dependencies [49c8451]
  - @iroha2/i64-fixnum@0.3.1

## 1.2.0

### Minor Changes

- update data model according to Iroha 2 RC 4 (`d00e0a9172d2a887a97f504796db5f2e05939c10`)

## 1.1.0

### Minor Changes

- a453fcd: update data model according to Iroha 2 RC 3 (`8d83a3eff33f29b49004a0a5efe643b10f0f256e`)
- a453fcd: **BREAKING** - change schema names normalization and align it more to `iroha_data_model::prelude` namespace
  normalization.

  List of changes:

  | Before                    | After                      |
  | ------------------------- | -------------------------- |
  | `DefinitionId`            | `AssetDefinitionId`        |
  | `Id`                      | `DomainId`                 |
  | `EntityType`              | `PipelineEntityType`       |
  | ...and `OptionEntityType` | `OptionPipelineEntityType` |
  | `Status`                  | `PipelineStatus`           |
  | `ExpressionIf`            | `IfExpression`             |
  | `IsiIf`                   | `IfInstruction`            |

  ...and some others.

- e34f8a5: **BREAKING**: `BTreeSet` now is not an `Array`, but a `Set`

## 1.0.0

### Major Changes

- b86aa76: **feat**: compile Iroha Data Model accordingly to `iroha v2.0.0-pre-rc.2`
  (`920e4d12754b0f3bf08cbaa5221d91c27863fcdc`)

## 0.5.0

### Minor Changes

- 98d3638: update data model & bump scale runtime version

### Patch Changes

- 92c5a9a: Add library top-level short documentation
- Updated dependencies [33a58c5]
- Updated dependencies [92c5a9a]
- Updated dependencies [92c5a9a]
  - @iroha2/i64-fixnum@0.3.0

## 0.4.0

### Minor Changes

- c59c85b: **Breaking:** update data model generation approach & usage with updated SCALE codec kit

### Patch Changes

- Updated dependencies [c59c85b]
  - @iroha2/i64-fixnum@0.2.0

## 0.3.0

### Minor Changes

- 0a583c2: breaking: re-generate data model with some optimizations and updated compiler
- 0a583c2: deps: update `@scale-codec/*` deps

### Patch Changes

- Updated dependencies [0a583c2]
  - @iroha2/i64-fixnum@0.1.3

## 0.2.1

### Patch Changes

- 1833de7: Fix package.json, bump version of definition runtime with correct export of `jsbi` stuff
- Updated dependencies [1833de7]
  - @iroha2/i64-fixnum@0.1.2
