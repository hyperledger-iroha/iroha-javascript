/**
 * Utilities to interact with Iroha via HTTP and WebSocket APIs.
 *
 * The primary functionality is exposed via the {@linkcode Client}.
 *
 * ## WebSocket Support
 *
 * Some APIs (e.g. {@linkcode Client#events}, {@linkcode Client#blocks}) require {@link WebSocket} support.
 *
 * WebSocket is not supported uniformly across environments, so adapters are used to provide a consistent interface.
 *
 * In Deno and browsers, no setup is needed - the adapter over the native {@link WebSocket} is used by default.
 * In Node and Bun, you **must** explicitly provide a compatible WebSocket adapter.
 *
 * You can also implement your own by conforming to the {@linkcode [web-socket].IsomorphicWebSocketAdapter} interface.
 *
 * In summary:
 *
 * | Environment | Adapter |
 * | - | - |
 * | Deno, Web (browsers) | Native adapter used by default ({@linkcode [web-socket].nativeWS}) |
 * | Node, Bun | Use [`@iroha/client-web-socket-node`](https://jsr.io/@iroha/client-web-socket-node) |
 * | Custom | Implement {@linkcode [web-socket].IsomorphicWebSocketAdapter} |
 *
 * ### Example: using `@iroha/client-web-socket-node`
 *
 * ```ts
 * import ws from '@iroha/client-web-socket-node'
 * import { Client, type CreateClientParams } from '@iroha/client'
 *
 * declare const params: CreateClientParams
 *
 * const client = new Client({
 *    ...params,
 *
 *    // provide WebSocket adapter here
 *    ws,
 * })
 * ```
 *
 * @example Construct a client with a random account
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * const kp = types.KeyPair.random()
 * const domain = new types.Name('wonderland')
 * const account = new types.AccountId(kp.publicKey(), domain)
 *
 * const client = new Client({
 *   chain: '000-000',
 *   toriiBaseURL: new URL('http://localhost:8080'),
 *   authority: account,
 *   authorityPrivateKey: kp.privateKey()
 * })
 * ```
 *
 * @example Construct a client from `iroha`'s TOML configuration
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 * import * as TOML from 'jsr:@std/toml'
 *
 * const configRaw = `
 * chain = "00000000-0000-0000-0000-000000000000"
 * torii_url = "http://127.0.0.1:8080/"
 *
 * [account]
 * domain = "wonderland"
 * public_key = "ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03"
 * private_key = "802620CCF31D85E3B32A4BEA59987CE0C78E3B8E2DB93881468AB2435FE45D5C9DCD53"
 * `;
 * const config = TOML.parse(configRaw) as Record<string, any>
 *
 * const client = new Client({
 *   chain: config.chain,
 *   toriiBaseURL: new URL(config.torii_url),
 *   authority: types.AccountId.parse(`${config.account.public_key}@${config.account.domain}`),
 *   authorityPrivateKey: types.PrivateKey.fromMultihash(config.account.private_key)
 * })
 * ```
 *
 * @example Register a new domain, account, and numeric asset
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function test(client: Client) {
 *   const newDomain: types.NewDomain = {
 *     id: new types.Name('test'),
 *     logo: null,
 *     metadata: []
 *   }
 *
 *   const newAccount: types.NewAccount = {
 *     id: new types.AccountId(types.KeyPair.random().publicKey(), newDomain.id),
 *     metadata: [],
 *   }
 *
 *   const newAsset: types.NewAssetDefinition = {
 *     id: new types.AssetDefinitionId(new types.Name('time'), newDomain.id),
 *     spec: { scale: 1 },
 *     mintable: types.Mintable.Infinitely,
 *     logo: null,
 *     metadata: [],
 *   }
 *
 *   await client.transaction(
 *     types.Executable.Instructions([
 *       types.InstructionBox.Register.Domain(newDomain),
 *       types.InstructionBox.Register.Account(newAccount),
 *       types.InstructionBox.Register.AssetDefinition(newAsset),
 *     ]),
 *   ).submit({ verify: true })
 * }
 * ```
 *
 * @example Mint an asset
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function mint100(client: Client, definition: types.AssetDefinitionId, account: types.AccountId) {
 *   await client.transaction(types.Executable.Instructions([
 *     types.InstructionBox.Mint.Asset({
 *       object: { scale: 0n, mantissa: 100n },
 *       destination: new types.AssetId(account, definition),
 *     }),
 *   ])).submit({ verify: true })
 * }
 * ```
 *
 * This function mints 100 of _something_ of the given asset `definition` to the given `account`.
 *
 * @example List domains, accounts, and assets
 *
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function list(client: Client) {
 *   for (const domain of await client.find.domains().executeAll()) {
 *     console.log('Domain with ID:', domain.id.value)
 *     // => Domain with ID: wonderland
 *     // => Domain with ID: looking_glass
 *     // ..
 *   }
 *
 *   for (const account of await client.find.accounts().executeAll()) {
 *     console.log('Account with signatory', account.id.signatory.multihash(), '@ domain', account.id.domain.value)
 *     // => Account with signatory ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03 @ domain wonderland
 *     // ..
 *   }
 *
 *   for (const asset of await client.find.assets().executeAll()) {
 *     console.log('Asset:', asset.id.toString())
 *     console.log('Asset value:', asset.value.mantissa, asset.value.scale)
 *     // => Asset: rose##ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03@wonderland
 *     // => Asset value: 42n 0n
 *     // ...
 *   }
 * }
 * ```
 *
 * @example Filter and paginate query results
 *
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function test(client: Client) {
 *   const accounts: types.Account[] = await client.find
 *     .accounts({
 *       offset: 10,
 *       limit: new types.NonZero(50),
 *     })
 *     .filterWith((account) =>
 *       types.CompoundPredicate.Atom(account.id.domain.name.endsWith('land'))
 *     )
 *     .executeAll()
 * }
 * ```
 *
 * This example finds all accounts whose domain name ends with `land`.
 *
 * @example Use query selectors
 *
 * ```ts
 * import { Client } from '@iroha/client'
 * import * as types from '@iroha/core/data-model'
 *
 * async function test(client: Client) {
 *    // use selectors and pagination
 *    const items: [types.Hash, types.AccountId][] = await client.find
 *      .transactions()
 *      .selectWith((tx) => [tx.blockHash, tx.value.authority])
 *      .executeAll()
 * }
 * ```
 *
 * This example finds all transactions and retrieves them as tuples of their block hash and authority id.
 *
 * Note that resulting types are inferred automatically based on the selectors you pass.
 *
 * @example Make lower-level API calls
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
 * This example shows that you don't need to use {@linkcode Client} to make such simple API calls.
 *
 * @module
 */

export * from './api.ts'
export * from './api-ws.ts'
export * from './query.ts'
export * from './client.ts'
