/**
 * Core components of the [Iroha](https://github.com/hyperledger-iroha/iroha) JavaScript SDK.
 *
 * It includes Iroha Data Model types and codecs, WebAssembly port of `iroha_crypto`, and
 * utilities such as building/signing transactions/queries.
 *
 * This package consists of the following modules:
 *
 * - {@linkcode [data-model]} - the data model
 * - {@linkcode [crypto]} - cryptographic utilities
 * - {@linkcode [codec]} - lower-level utilities to work with the codec
 *
 * > [!IMPORTANT]
 * > This package includes a WebAssembly module to perform cryptographic operations in a way consistent with Iroha.
 * > It is a bit tricky to initialise uniformly across different environments, and **there could be compatibility issues**.
 * > See the {@linkcode [crypto]} module for more details.
 *
 * ### Iroha Compatibility
 *
 * Versions compatibility between Iroha and this package:
 *
 * | Iroha | `@iroha/core` |
 * | --: | :-- |
 * | `2.0.0-rc.1.x` | `0.2.0`, ~~`0.1.0`~~ ([broken](https://github.com/hyperledger-iroha/iroha-javascript/issues/210#issuecomment-2662231135)) |
 * | `2.0.0-pre-rc.20.x` and before | the Legacy SDK* |
 *
 * **The Legacy SDK** is the previous iteration on SDK that is no longer maintained.
 * It is still available on [Iroha Nexus NPM registry](https://nexus.iroha.tech/repository/npm-group/).
 * Its source code could be found on the [`iroha-2-pre-rc`](https://github.com/hyperledger-iroha/iroha-javascript/tree/iroha-2-pre-rc) branch.
 *
 * @example Building and signing a transaction
 * ```ts
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
