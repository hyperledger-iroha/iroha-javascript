import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha/test-configuration'
import { Client } from '@iroha/client'
import { KeyPair, PrivateKey, PublicKey } from '@iroha/core/crypto'

const keyPair = KeyPair.fromParts(
  PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey),
  PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey),
)

const HOST = globalThis.location.host

export const client = new Client({
  // proxified with vite
  toriiBaseURL: new URL(`http://${HOST}/torii`),

  chain: CHAIN,
  accountDomain: DOMAIN,
  accountKeyPair: keyPair,
})
