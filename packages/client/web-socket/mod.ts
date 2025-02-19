/**
 * Types and native implementation of a WebSocket transport.
 *
 * [The WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
 * is not natively available everywhere. For when it is available, the built-in {@linkcode nativeWS}
 * transport is used. For when it is not, consider using
 * {@linkcode https://jsr.io/@iroha/client-web-socket-node|@iroha/client-web-socket-node} adapter or providing a custom
 * one.
 *
 * A custom adapter could be passed to the {@linkcode [default].WebSocketAPI | WebSocketAPI} as well as to the
 * {@linkcode [default].CreateClientParams | Client}.
 *
 * ### Note on Bun
 *
 * Although Bun provides "native" `WebSocket`, it's implementation is not spec-compliant (specifically, it uses Node's `Buffer`).
 * Using `@iroha/client-web-socket-node` would work in this case.
 *
 * @example Using Node.js adapter
 * ```ts
 * import { WebSocketAPI } from '@iroha/client'
 * import ws from '@iroha/client-web-socket-node'
 *
 * const api = new WebSocketAPI(new URL('http://localhost:8080'), ws)
 * ```
 *
 * @module
 */

export * from './types.ts'
export { default as nativeWS } from './native.ts'
