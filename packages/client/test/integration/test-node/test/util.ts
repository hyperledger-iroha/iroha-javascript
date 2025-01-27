import { onTestFinished, inject } from 'vitest'

import getPort from 'get-port'

import { Client } from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/node'
import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha2/test-configuration'
import { type Free, KeyPair, PrivateKey, PublicKey } from '@iroha2/crypto-core'
import * as dm from '@iroha2/data-model'
import * as TestPeer from '@iroha2/test-peer'

import { delay } from '../../util'

export function freeOnTestFinished<T extends Free>(object: T): T {
  onTestFinished(() => object.free())
  return object
}

async function waitForGenesisCommitted(f: () => Promise<dm.Status>) {
  while (true) {
    const { blocks } = await f()
    if (blocks >= 1) return
    await delay(50)
  }
}

async function uniquePort() {
  return getPort()
}

export async function usePeer() {
  const { kill, toriiURL } = await TestPeer.startPeer({
    ports: {
      api: await uniquePort(),
      p2p: await uniquePort(),
    },
  })
  onTestFinished(kill)

  const accountPublicKey = freeOnTestFinished(PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey))
  const accountPrivateKey = freeOnTestFinished(PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey))
  const accountKeyPair = freeOnTestFinished(KeyPair.fromParts(accountPublicKey, accountPrivateKey))
  const client = new Client({
    toriiBaseURL: toriiURL,
    ws: WS,
    chain: CHAIN,
    accountDomain: DOMAIN,
    accountKeyPair,
  })

  await waitForGenesisCommitted(() => client.status())

  // TODO: export more?
  return { client }
}
