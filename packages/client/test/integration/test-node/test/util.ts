import { CLIENT_CONFIG } from '@iroha2/test-configuration'
import { Client, Signer, Torii, type ToriiRequirementsForApiHttp } from '@iroha2/client'
import { adapter as WS } from '@iroha2/client/web-socket/node'
import { crypto } from '@iroha2/crypto-target-node'
import type { Free } from '@iroha2/crypto-core'
import { datamodel } from '@iroha2/data-model'
import { afterEach, beforeAll, beforeEach, onTestFinished } from 'vitest'
import { delay } from '../../util'
import * as TestPeer from '@iroha2/test-peer'

export function freeOnTestFinished<T extends Free>(object: T): T {
  onTestFinished(() => object.free())
  return object
}

/**
 * Sets up Vitest hooks to run a clean Iroha peer
 * for each test.
 */
export function setupPeerTestsLifecycle() {
  let startedPeer: TestPeer.StartPeerReturn | null = null

  async function killStartedPeer() {
    await startedPeer?.kill()
    startedPeer = null
  }

  async function waitForGenesisCommitted(pre: ToriiRequirementsForApiHttp) {
    while (true) {
      const { blocks } = await Torii.getStatus(pre)
      if (blocks >= 1) return
      await delay(50)
    }
  }

  beforeAll(async () => {
    await TestPeer.clearAll()
    await TestPeer.prepareConfiguration()
  })

  beforeEach(async () => {
    await TestPeer.clearPeerStorage()
    startedPeer = await TestPeer.startPeer()
    await waitForGenesisCommitted(clientFactory().pre)
  })

  afterEach(async () => {
    await killStartedPeer()
  })
}

/**
 * Expected to be called within a test suite
 */
export function clientFactory() {
  const keyPair = freeOnTestFinished(crypto.KeyPair.fromJSON(CLIENT_CONFIG.keyPair))

  const { accountId } = CLIENT_CONFIG

  const signer = new Signer(accountId, keyPair)

  const pre = { ...CLIENT_CONFIG.torii, ws: WS, fetch }

  const client = new Client({ signer })

  const getBlocksListener = async () => {
    const stream = await Torii.listenForBlocksStream(pre, {
      // 1 is genesis block, which is committed before each test
      height: datamodel.NonZeroU64(2n),
    })

    return {
      /**
       * Do an operation that should trigger a block commit, and wait until the block
       * is emitted
       */
      async wait(fn: () => Promise<void>) {
        await Promise.all([stream.ee.once('block'), fn()])
      },
    }
  }

  return { signer, pre, client, accountId, keyPair, getBlocksListener }
}
