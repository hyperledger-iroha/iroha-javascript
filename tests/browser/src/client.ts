import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha/test-configuration'
import { Client } from '@iroha/client'
import * as types from '@iroha/core/data-model'

const HOST = globalThis.location.host

export const client = new Client({
  // proxified with vite
  toriiBaseURL: new URL(`http://${HOST}/torii`),

  chain: CHAIN,
  authority: new types.AccountId(ACCOUNT_KEY_PAIR.publicKey(), DOMAIN),
  authorityPrivateKey: ACCOUNT_KEY_PAIR.privateKey(),
})
