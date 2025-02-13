/**
 * Utilities to interact with Iroha via HTTP and WebSocket APIs.
 *
 * @example
 * ```ts
 * import { MainAPI, HttpTransport } from '@iroha/client'
 * import { assertEquals } from '@std/assert/equals'
 *
 * const toriiURL = new URL('http://localhost:8080')
 * const transport = new HttpTransport(toriiURL)
 * const api = new MainAPI(transport)
 *
 * const result = await api.health()
 *
 * // Apparently, there is no running Iroha
 * assertEquals(result.kind, 'error')
 * ```
 *
 * @module
 */

export * from './api.ts'
export * from './api-ws.ts'
export * from './query.ts'
export * from './client.ts'
