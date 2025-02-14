# Iroha JavaScript

The JavaScript (TypeScript) SDK for Iroha 2.

Works in Deno, Node.js, and the Browser. (TODO: check in Bun and Cloudflare Workers).

Packages and documentation are available on JSR: https://jsr.io/@iroha

## Usage

### Installation

```shell
# deno
deno add jsr:@iroha/core

# npm (one of the below, depending on your package manager)
npx jsr add @iroha/core
yarn dlx jsr add @iroha/core
pnpm dlx jsr add @iroha/core
bunx jsr add @iroha/core
```

### Quick Example

```ts
import '@iroha/crypto-target-node/install'
import { Client } from '@iroha/client'
import * as types from '@iroha/core/data-model'

const kp = types.KeyPair.random()

const client = new Client({
  toriiBaseURL: new URL('http://localhost:8080'),
  chain: '000-000',
  accountDomain: new types.Name('wonderland'),
  accountKeyPair: kp,
})

async function test() {
  const { blocks } = await client.api.telemetry.status()
  console.log(blocks) // => 3
}
```

This example assumes running in Deno/Node.js.

## Iroha Compatibility

See the ["Compatibility" secion in `@iroha/core` package documentation](https://jsr.io/@iroha/core#iroha-compatibility).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
