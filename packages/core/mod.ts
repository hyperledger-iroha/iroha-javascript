/**
 * Core components of the Iroha JavaScript SDK.
 *
 * It includes Iroha Data Model types and codecs, `iroha_crypto` WASM interface, and
 * utilities such as building/signing transactions/queries.
 *
 * It consists of the following modules:
 *
 * - `@iroha/core` - shared utilities
 * - `@iroha/core/data-model` - the data model
 * - `@iroha/core/crypto` - `iroha_crypto` WASM interface
 * - `@iroha/core/codec` - lower-level utilities to work with the codec
 *
 * ### Install `iroha_crypto` WASM
 *
 * > [!IMPORTANT]
 * > Make sure to install the `iroha_crypto` WASM **before using utilities that are dependant on it**.
 * >
 * > The simplest way to do so in Deno/Node.js is the following:
 * >
 * > ```ts ignore
 * > import '@iroha/crypto-target-node/install'
 * > ```
 * >
 * > See the `@iroha/core/crypto` module for details.
 *
 * ### Iroha Compatibility
 *
 * Versions compatibility between this package and Iroha:
 *
 * | Iroha version | `@iroha/core` version |
 * | --: | :-- |
 * | `2.0.0-rc.1.x` | `0.1.0` |
 * | `2.0.0-pre-rc.20.x` and before | the legacy SDK |
 *
 * The legacy SDK is the previous iteration on SDK that is no longer maintained.
 * It is still available on Iroha Nexus NPM registry (https://nexus.iroha.tech/repository/npm-group/).
 * Its source code could be found on the [`iroha-2-pre-rc`](https://github.com/hyperledger-iroha/iroha-javascript/tree/iroha-2-pre-rc) branch.
 *
 * @example Building and signing a transaction
 * ```ts
 * import '@iroha/crypto-target-node/install'
 *
 * import * as types from '@iroha/core/data-model'
 * import { buildTransactionPayload, signTransaction } from '@iroha/core'
 *
 * const kp = types.KeyPair.random()
 *
 * const account = new types.AccountId(kp.publicKey(), new types.Name('wonderland'))
 *
 * const payload = buildTransactionPayload(
 *   types.Executable.Instructions([
 *     types.InstructionBox.SetKeyValue.Domain({
 *       object: new types.Name('wonderland'),
 *       key: new types.Name('foo'),
 *       value: types.Json.fromValue(['bar', 'baz']),
 *     }),
 *   ]),
 *   {
 *     chain: '000-000',
 *     authority: account,
 *   },
 * )
 *
 * const signed: types.SignedTransaction = signTransaction(payload, kp.privateKey())
 * ```
 *
 * @example Parsing & encoding an asset definition id
 * ```ts
 * import { getCodec } from '@iroha/core'
 * import * as types from '@iroha/core/data-model'
 * import { encodeHex } from '@std/encoding/hex'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const asset = types.AssetDefinitionId.parse("rose#wonderland")
 * assertEquals(asset.name.value, 'rose')
 * assertEquals(asset.domain.value, 'wonderland')
 * assertEquals(asset.toString(), 'rose#wonderland')
 *
 * const encoded: Uint8Array = getCodec(types.AssetDefinitionId).encode(asset)
 * assertEquals(encodeHex(encoded), '28776f6e6465726c616e6410726f7365')
 * ```
 *
 * @example Parsing an account id
 * ```ts
 * import '@iroha/crypto-target-node/install'
 * import { getCodec } from '@iroha/core'
 * import * as types from '@iroha/core/data-model'
 * import { encodeHex } from '@std/encoding/hex'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const raw = "ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@wonderland"
 *
 * const account = types.AccountId.parse(raw)
 * assertEquals(account.signatory.algorithm, 'ed25519')
 * assertEquals(account.domain.value, 'wonderland')
 * assertEquals(account.toString(), raw)
 * ```
 *
 * Note that this example requires WASM installation, because account id contains a public key.
 *
 * @module
 */

import * as crypto from './crypto/mod.ts'
import { getCodec } from './codec.ts'
import * as types from './data-model/mod.ts'

export * from './query.ts'
export * from './transaction.ts'
export * from './util.ts'
export * from './traits.ts'
export { getCodec }

/**
 * The one that is used for e.g. {@link types.TransactionEventFilter}
 */
export function transactionHash(tx: types.SignedTransaction): crypto.Hash {
  const bytes = getCodec(types.SignedTransaction).encode(tx)
  return crypto.Hash.hash(crypto.Bytes.array(bytes))
}

export function signQuery(payload: types.QueryRequestWithAuthority, privateKey: crypto.PrivateKey): types.SignedQuery {
  const payloadBytes = getCodec(types.QueryRequestWithAuthority).encode(payload)
  const signature = privateKey.sign(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload)
  return {
    kind: 'V1',
    value: {
      payload,
      signature,
    },
  }
}

export function signTransaction(
  payload: types.TransactionPayload,
  privateKey: crypto.PrivateKey,
): types.SignedTransaction {
  const payloadBytes = getCodec(types.TransactionPayload).encode(payload)
  const signature = privateKey.sign(crypto.Hash.hash(crypto.Bytes.array(payloadBytes)).payload)
  return {
    kind: 'V1',
    value: {
      payload,
      signature,
    },
  }
}

// TODO test
export function blockHash(header: types.BlockHeader): crypto.Hash {
  const encoded = getCodec(types.BlockHeader).encode(header)
  return crypto.Hash.hash(crypto.Bytes.array(encoded))
}
