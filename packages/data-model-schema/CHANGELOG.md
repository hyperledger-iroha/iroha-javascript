# @iroha2/data-model-schema

## 7.1.0

## 7.0.0

### Major Changes

- e0459fa: **Target [Iroha `2.0.0-pre-rc.20`](https://github.com/hyperledger/iroha/tree/51d687607fad067fc855e266edc684d4fb33e7de)**
- e0459fa: **refactor!**: move schema-transform code back to `@iroha2/data-model` internal utilities
- e0459fa: **feat!**: update schema and its types; update type names

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

## 5.0.0

### Major Changes

- d1e5f68: **refactor!**: don't include fixed points into the transformed schema anymore; instead, return them as a separate collection
- d1e5f68: **feature**: transform `GenericPredicateBox<...::Predicate>` into just `PredicateBox`

### Patch Changes

- 7880c14: **feature**: cache transformed refs; print them to `debug`

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

## 2.0.2

## 2.0.1

### Patch Changes

- ff266d3: Update `@scale-codec/*` version that uses correct `.mjs` ext for ESM bundles

## 2.0.0

## 1.4.0

### Minor Changes

- 5439042: **feat**: update data model according to Iroha `2.0.0-pre-rc.6-lts` (`75da907f66d5270f407a50e06bc76cec41d3d409`)
