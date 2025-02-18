/**
 * Utilities to interact with Iroha via HTTP and WebSocket APIs.
 *
 * The primary functionality is exposed via the {@linkcode Client}.
 *
 * @example Constructing the client
 * ```ts
 * import ws from '@iroha/client-web-socket-node'
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * const kp = types.KeyPair.random()
 *
 * const client = new Client({
 *   toriiBaseURL: new URL('http://localhost:8080'),
 *   chain: '000-000',
 *   accountDomain: new types.Name('wonderland'),
 *   accountKeyPair: kp,
 *   // This is necessary in Node.js, which doesn't support WebSocket API natively
 *   // Remove this if you are using Deno/Browser
 *   ws
 * })
 * ```
 *
 * @example Querying data
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function test(client: Client) {
 *   // fetch all assets
 *   const assets: types.Asset[] = await client.find.assets().executeAll();
 *
 *   // find all accounts in a domain ending with `land`
 *   const accounts: types.Account[] = await client.find
 *     .accounts({
 *       predicate: types.CompoundPredicate.Atom(
 *         types.AccountProjectionPredicate.Id.Domain.Name.Atom.EndsWith('land')
 *       )
 *     })
 *     .executeAll()
 *
 *    // use selectors and pagination
 *    const items: [types.Hash, types.AccountId][] = await client.find
 *      .transactions({
 *        selector: [
 *          types.CommittedTransactionProjectionSelector.BlockHash.Atom,
 *          types.CommittedTransactionProjectionSelector.Value.Authority.Atom,
 *        ],
 *        offset: 10,
 *        limit: new types.NonZero(50),
 *      })
 *      .executeAll()
 * }
 * ```
 *
 * Note that resulting types are inferred based on the selectors you pass.
 *
 * @example Submitting a transaction
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function test(client: Client) {
 *   const txHandle = client.transaction(
 *     types.Executable.Instructions([
 *       types.InstructionBox.Register.Domain({
 *         id: new types.Name('test'),
 *         logo: null,
 *         metadata: [],
 *       }),
 *     ]),
 *   )
 *
 *   // could be used to watch for events
 *   const hash: types.Hash = txHandle.hash;
 *
 *   // submit and wait until the transaction is committed
 *   await txHandle.submit({ verify: true })
 * }
 * ```
 *
 * @example Using lower-level API utilitites
 * ```ts
 * import { MainAPI, HttpTransport } from '@iroha/client'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const toriiURL = new URL('http://localhost:8080')
 * const transport = new HttpTransport(toriiURL)
 * const api = new MainAPI(transport)
 *
 * async function test() {
 *   const result = await api.health()
 *
 *   assertEquals(result.kind, 'ok')
 * }
 * ```
 *
 * @module
 */

export * from './api.ts'
export * from './api-ws.ts'
export * from './query.ts'
export * from './client.ts'
