# Iroha JavaScript

The JavaScript (TypeScript) SDK of [Iroha 2](https://github.com/hyperledger-iroha/iroha) for Node.js, Deno, Bun, and
Browsers.

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
import { Client } from '@iroha/client'
import * as types from '@iroha/core/data-model'

const kp = types.KeyPair.random()

const client = new Client({
  toriiBaseURL: new URL('http://localhost:8080'),
  chain: '000-000',
  authority: new types.AccountId(kp.publicKey(), new types.DomainId('wonderland')),
  authorityPrivateKey: kp.privateKey(),
})

async function test() {
  await client.transaction(types.Executable.Instructions([
    types.InstructionBox.Register.Domain({
      id: new types.Name('wonderland'),
      logo: null,
      metadata: [],
    }),
  ]))
    .submit({ verify: true })
}
```

## Iroha Compatibility

See the
["Compatibility" section in `@iroha/core` package documentation](https://jsr.io/@iroha/core#iroha-compatibility).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)
