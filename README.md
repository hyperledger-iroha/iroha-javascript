
[![npm version](https://img.shields.io/npm/v/iroha-helpers.svg)](https://www.npmjs.com/package/iroha-helpers)
[![minified size](https://badgen.net/bundlephobia/min/iroha-helpers)](https://badgen.net/bundlephobia/min/iroha-helpers)
[![Iroha 1.3.0](https://img.shields.io/badge/Iroha-1.3.0-green)](https://github.com/hyperledger/iroha/tree/1.3.0)

# iroha-helpers

Some functions which will help you to interact with [Hyperledger Iroha](https://github.com/hyperledger/iroha) from your JS program.

## Trying an example

 1. Clone this repository
 2. Run Iroha http://iroha.readthedocs.io/en/main/getting_started/
 3. Run `grpc-web-proxy` for iroha https://gitlab.com/snippets/1713665
 4. `yarn build && npx ts-node example/index.ts`

## Installation
Using npm:
``` bash
$ npm i iroha-helpers
```
Using yarn:
``` bash
$ yarn add iroha-helpers
```

# Example
In an `example` directory you can find [`index.ts`](./example/index.ts) and [`chain.ts`](./example/chain.ts) files.
These files demonstrate main features of iroha-helpers. In the [`chain.ts`](./example/chain.ts) you can find how to build transaction with several commands and how to deal with batch. 

## Node.js
With node.js you should create connection to iroha by using `QueryService` and `CommandService` from `endpoint_grpc_pb`. Also you should provide grpc credentials as a second argument.

**IROHA_ADDRESS** - Address of iroha grpc (usually ends on 50051) Ex. `http://localhost:50051`

``` javascript
import grpc from '@grpc/grpc-js'
import {
  QueryService_v1Client as QueryService,
  CommandService_v1Client as CommandService
} from 'iroha-helpers/lib/proto/endpoint_grpc_pb'

const commandService = new CommandService(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)
```

## Browser
With browser you should create connection to iroha by using `QueryService` and `CommandService` from `endpoint_pb_service`.

**IROHA_ADDRESS** - Address of grpc-web-proxy (usually ends on 8081) Ex. `http://localhost:8081`

```javascript
import {
  CommandService_v1Client as CommandService,
  QueryService_v1Client as QueryService
} from 'iroha-helpers/lib/proto/endpoint_pb_service'

const commandService = new CommandService(IROHA_ADDRESS)
const queryService = new QueryService(IROHA_ADDRESS)
```

### Create transaction
To create transaction you can call command from list of commands or create your own from scratch or use transaction builder.

``` javascript
import { TxBuilder } from 'iroha-helpers/lib/chain'

new TxBuilder()
  .createAccount({
    accountName: 'user1',
    domainId: 'test',
    publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
  })
  .addMeta('admin@test', 1)
  .send(commandService)
  .then(res => console.log(res))
  .catch(err => console.error(res))
```

### Create batch
``` javascript
import { TxBuilder, BatchBuilder } from 'iroha-helpers/lib/chain'

const firstTx = new TxBuilder()
  .createAccount({
    accountName: 'user1',
    domainId: 'test',
    publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
  })
  .addMeta('admin@test', 1)
  .tx

const secondTx = new TxBuilder()
  .createAccount({
    accountName: 'user2',
    domainId: 'test',
    publicKey: '0000000000000000000000000000000000000000000000000000000000000000'
  })
  .addMeta('admin@test', 1)
  .tx

new BatchBuilder([
  firstTx,
  secondTx
])
  .setBatchMeta(0)
  .sign([adminPriv], 0)
  .sign([adminPriv], 1)
  .send(commandService)
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

## Commands
For usage of any command you need to provide `commandOptions` as a first argument.
``` javascript
const commandOptions = {
  privateKeys: [''], // Array of private keys in hex format
  creatorAccountId: '', // Account id, ex. admin@test
  quorum: 1,
  commandService: null,
  timeoutLimit: 5000 // Set timeout limit
}
```

- [x] [addAssetQuantity](https://iroha.readthedocs.io/en/main/develop/api/commands.html#add-asset-quantity)
- [x] [addPeer](https://iroha.readthedocs.io/en/main/develop/api/commands.html#add-peer)
- [x] [addSignatory](https://iroha.readthedocs.io/en/main/develop/api/commands.html#add-signatory)
- [x] [appendRole](https://iroha.readthedocs.io/en/main/develop/api/commands.html#append-role)
- [x] [createAccount](https://iroha.readthedocs.io/en/main/develop/api/commands.html#create-account)
- [x] [createAsset](https://iroha.readthedocs.io/en/main/develop/api/commands.html#create-asset)
- [x] [createDomain](https://iroha.readthedocs.io/en/main/develop/api/commands.html#create-domain)
- [x] [createRole](https://iroha.readthedocs.io/en/main/develop/api/commands.html#create-role)
- [x] [detachRole](https://iroha.readthedocs.io/en/main/develop/api/commands.html#detach-role)
- [x] [grantPermission](https://iroha.readthedocs.io/en/main/develop/api/commands.html#grant-permission)
- [x] [removeSignatory](https://iroha.readthedocs.io/en/main/develop/api/commands.html#remove-signatory)
- [x] [revokePermission](https://iroha.readthedocs.io/en/main/develop/api/commands.html#revoke-permission)
- [x] [setAccountDetail](https://iroha.readthedocs.io/en/main/develop/api/commands.html#set-account-detail)
- [x] [setAccountQuorum](https://iroha.readthedocs.io/en/main/develop/api/commands.html#set-account-quorum)
- [x] [subtractAssetQuantity](https://iroha.readthedocs.io/en/main/develop/api/commands.html#subtract-asset-quantity)
- [x] [transferAsset](https://iroha.readthedocs.io/en/main/develop/api/commands.html#transfer-asset)
- [x] [сompareAndSetAccountDetail](https://iroha.readthedocs.io/en/main/develop/api/commands.html#compare-and-set-account-detail)
- [x] [removePeer](https://iroha.readthedocs.io/en/main/develop/api/commands.html#remove-peer)

## Queries
For usage of any query you need to provide `queryOptions` as a first argument.
``` javascript
const queryOptions = {
  privateKey: '', // Private key in hex format
  creatorAccountId: '', // Account id, ex. admin@test
  queryService: null,
  timeoutLimit: 5000 // Set timeout limit
}
```

- [x] [getAccount](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-account)
- [x] [getBlock](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-block)
- [x] [getSignatories](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-signatories)
- [x] [getTransactions](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-transactions)
- [x] [getPendingTransactions](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-pending-transactions)
- [x] [getAccountTransactions](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-account-transactions)
- [x] [getAccountAssetTransactions](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-account-asset-transactions)
- [x] [getAccountAssets](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-account-assets)
- [x] [getAccountDetail](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-account-detail)
- [x] [getAssetInfo](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-asset-info)
- [x] [getRoles](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-roles)
- [x] [getRolePermissions](https://iroha.readthedocs.io/en/main/develop/api/queries.html#get-role-permissions)
- [x] [getPeers](https://iroha.readthedocs.io/en/main/develop/api/commands.html#remove-peer)
- [x] [fetchCommits](https://iroha.readthedocs.io/en/main/develop/api/queries.html#fetchcommits)

## Known issues
 - Please be careful: API might and WILL change.

## TODO
 - [ ] Add tests
 - [ ] Integration tests with Iroha
 - [ ] Add more documentation
