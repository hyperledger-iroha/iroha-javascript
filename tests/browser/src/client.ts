import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha2/test-configuration'

import { Client } from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/native'

// it must resolve first, before using core crypto exports
import './setup-crypto.ts'

import { KeyPair, PrivateKey, PublicKey } from '@iroha2/crypto'

const keyPair = KeyPair.fromParts(
  PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey),
  PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey),
)

const HOST = globalThis.location.host

export const client = new Client({
  // proxified with vite
  toriiBaseURL: new URL(`http://${HOST}/torii`),

  ws: WS,
  chain: CHAIN,
  accountDomain: DOMAIN,
  accountKeyPair: keyPair,
})
