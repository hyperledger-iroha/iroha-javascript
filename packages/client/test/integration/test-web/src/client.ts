import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha2/test-configuration/src/base'

import { Client } from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/native'

// it must resolve first, before using core crypto exports
import './setup-crypto'

import { KeyPair, PrivateKey, PublicKey } from '@iroha2/crypto-core'

const keyPair = KeyPair.fromParts(
  PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey),
  PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey),
)

const HOST = window.location.host

export const client = new Client({
  // proxified with vite
  toriiURL: `http://${HOST}/torii`,
  ws: WS,
  http: fetch.bind(window),
  chain: CHAIN,
  accountDomain: DOMAIN.name,
  accountKeyPair: keyPair,
})
