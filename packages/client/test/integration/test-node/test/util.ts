import {
  Client,
  Signer,
  Torii,
  type ToriiRequirementsForApiHttp,
  type ToriiRequirementsForApiWebSocket,
} from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/node'
import { crypto } from '@iroha2/crypto-target-node'
import { ACCOUNT_KEY_PAIR, DOMAIN } from '@iroha2/test-configuration'
import type { Free } from '@iroha2/crypto-core'
import type { datamodel } from '@iroha2/data-model'
import { onTestFinished } from 'vitest'
import { delay } from '../../util'
import * as TestPeer from '@iroha2/test-peer'

export function freeOnTestFinished<T extends Free>(object: T): T {
  onTestFinished(() => object.free())
  return object
}

async function waitForGenesisCommitted(pre: ToriiRequirementsForApiHttp) {
  while (true) {
    const { blocks } = await Torii.getStatus(pre)
    if (blocks >= 1) return
    await delay(50)
  }
}

export interface UsePeerReturn {
  torii: ToriiRequirementsForApiHttp & ToriiRequirementsForApiWebSocket
  client: Client
  // nextBlock: () =>
}

export async function usePeer(): Promise<UsePeerReturn> {
  const { kill, toriiUrl } = await TestPeer.startPeer()
  onTestFinished(kill)

  const accountPublicKey = freeOnTestFinished(crypto.PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey))
  const accountPrivateKey = freeOnTestFinished(crypto.PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey))
  const accountKeyPair = freeOnTestFinished(crypto.KeyPair.fromParts(accountPublicKey, accountPrivateKey))
  const accountId: datamodel.AccountId = { signatory: accountPublicKey.toDataModel(), domain: DOMAIN }
  const signer = new Signer(accountId, accountKeyPair)
  const client = new Client({ signer })

  const torii = {
    apiURL: toriiUrl,
    ws: WS,
    fetch,
  } satisfies ToriiRequirementsForApiHttp & ToriiRequirementsForApiWebSocket

  await waitForGenesisCommitted(torii)

  // TODO: export more?
  return { torii, client }
}
