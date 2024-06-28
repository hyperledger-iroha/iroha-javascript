import { Client } from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/node'
import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha2/test-configuration'
import { type Free, PublicKey, PrivateKey, KeyPair } from '@iroha2/crypto-core'
import type { datamodel } from '@iroha2/data-model'
import { onTestFinished } from 'vitest'
import { delay } from '../../util'
import * as TestPeer from '@iroha2/test-peer'

export function freeOnTestFinished<T extends Free>(object: T): T {
  onTestFinished(() => object.free())
  return object
}

async function waitForGenesisCommitted(f: () => Promise<datamodel.Status>) {
  while (true) {
    const { blocks } = await f()
    if (blocks >= 1) return
    await delay(50)
  }
}

export async function usePeer() {
  const { kill, toriiURL } = await TestPeer.startPeer()
  onTestFinished(kill)

  const accountPublicKey = freeOnTestFinished(PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey))
  const accountPrivateKey = freeOnTestFinished(PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey))
  const accountKeyPair = freeOnTestFinished(KeyPair.fromParts(accountPublicKey, accountPrivateKey))
  const client = new Client({
    toriiURL,
    http: fetch,
    ws: WS,
    chain: CHAIN,
    accountDomain: DOMAIN.name,
    accountKeyPair,
  })

  await waitForGenesisCommitted(() => client.getStatus())

  // TODO: export more?
  return { client }
}
