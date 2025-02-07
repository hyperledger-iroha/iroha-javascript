# `@iroha2/client`

Client for Iroha 2, which is used to submit requests to Iroha peer.

## Target version

This version of package targets
[Iroha `2.0.0-pre-rc.20`](https://github.com/hyperledger/iroha/tree/51d687607fad067fc855e266edc684d4fb33e7de).

## Installation

The packages are published under the `@iroha2` scope into Iroha Nexus Registry. To install `client` with `npm`/`pnpm`:

1. Configure your package manager to fetch scoped packages from Nexus Registry.

   ```ini
   # FILE: .npmrc
   @iroha2:registry=https://nexus.iroha.tech/repository/npm-group/
   ```

2. Install the `client` package:

   ```shell
   npm i @iroha2/client
   ```

## Isomorphic transports

Iroha Client uses WebSocket and HTTP to communicate with an Iroha Peer. There is no way for Iroha Client to communicate
with a peer in an environment-agnostic way.

Previously, `@iroha2/client` used `@iroha2/client-isomorphic-ws` and `@iroha2/client-isomorphic-fetch` to seamlessly
switch between environment-specific transports. Due to Node.js moving towards ESM, the way isomorphism used to be
achieved is no longer applicable, and these packages are no longer in use.

Now the client provides additional entrypoints for isomorphic adapters, the same way it is done in
[isomorphic-git](https://github.com/isomorphic-git/isomorphic-git/tree/main#getting-started). You need to provide
`fetch`/`ws` yourself.

### WebSocket

For WebSocket, the client has two entrypoints: `@iroha2/client/web-socket/native` and `@iroha2/client/web-socket/node`.

1. Import adapters:

   Import `@iroha2/client/web-socket/native` for when the native `WebSocket` exists:

   ```ts
   import { adapter } from '@iroha2/client/web-socket/native'
   ```

   Import `@iroha2/client/web-socket/node` with the `ws` package (it is a peer dependency of the client package) for
   Node.js:

   ```bash
   // you need to install `ws` package first
   npm i ws @types/ws
   ```

   ```ts
   import { adapter } from '@iroha2/client/web-socket/node'
   ```

2. Use WebSocket adapter with Torii:

   ```ts
   import { Torii } from '@iroha2/client'

   Torii.listenForEvents({ adapter })
   ```

### Fetch

`fetch` could be provided in the same way. However, `@iroha2/client` does not provide it itself. There are `node-fetch`
and `undici` packages that provide the `fetch` implementation that could be injected into Iroha Client.

1. Import fetch from `node-fetch` **or** `undici` packages:

   ```ts
   import nodeFetch from 'node-fetch'
   import { fetch as undiciFetch } from 'undici'
   ```

2. Inject `fetch` into Iroha Client:

   ```ts
   import { Torii } from '@iroha2/client'

   Torii.getStatus({ fetch: nodeFetch as typeof fetch })
   ```

   In Browser:

   ```ts
   import { Torii } from '@iroha2/client'

   Torii.getStatus({ fetch: fetch.bind(window) })
   ```

   > **Note**: we make `fetch.bind(window)` to avoid
   > `TypeError: "'fetch' called on an object that does not implement interface Window."`.

## Client Configuration

Refer to Iroha 2 tutorial for instructions on how to
[configure the client](https://hyperledger.github.io/iroha-2-docs/guide/javascript.html#_2-client-configuration).
