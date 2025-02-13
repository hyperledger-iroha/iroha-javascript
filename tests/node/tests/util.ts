import { onTestFinished } from 'vitest'
import uniquePort from 'get-port'
import { Client } from '../../../packages/client/mod.ts'
import WS from '@iroha/client-web-socket-node'
import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha/test-configuration'
import { createGenesis } from '@iroha/test-configuration/node'
import { Bytes, KeyPair, PrivateKey, PublicKey } from '@iroha/core/crypto'
import type * as dm from '@iroha/core/data-model'
import * as TestPeer from '@iroha/test-peer'
import { delay } from '@std/async'

async function waitForGenesisCommitted(f: () => Promise<dm.Status>) {
  while (true) {
    const { blocks } = await f()
    if (blocks >= 1) return
    await delay(50)
  }
}

function getAccountKeyPair() {
  const accountPublicKey = PublicKey.fromMultihash(ACCOUNT_KEY_PAIR.publicKey)
  const accountPrivateKey = PrivateKey.fromMultihash(ACCOUNT_KEY_PAIR.privateKey)
  const accountKeyPair = KeyPair.fromParts(accountPublicKey, accountPrivateKey)
  return accountKeyPair
}

async function uniquePortsPair() {
  return {
    api: await uniquePort(),
    p2p: await uniquePort(),
  }
}

export async function usePeer(): Promise<{ client: Client }> {
  const {
    peers: [peer],
  } = await useNetwork({ peers: 1 })

  return peer
}

export async function useNetwork(params: {
  peers: number
  seed?: Uint8Array
}): Promise<{ peers: { client: Client; keypair: KeyPair; ports: { api: number; p2p: number } }[] }> {
  const configs = await Promise.all(
    Array.from({ length: params.peers }, async (_v, i) => {
      const key = params.seed
        ? KeyPair.deriveFromSeed(Bytes.array(new Uint8Array([...params.seed, i, i, i])))
        : KeyPair.random()
      return { key, ports: await uniquePortsPair() }
    }),
  )
  const topology = configs.map(({ key }) => key.publicKey())
  const genesis = await createGenesis({ topology })

  const trustedPeers = (peerIndex: number) =>
    configs
      .filter((_x, i) => i !== peerIndex)
      .map(({ key, ports }) => ({ id: key.publicKey().multihash(), address: `localhost:${ports.p2p}` }))

  const peers = await Promise.all(
    configs.map(async ({ key, ports }, i) => {
      const { kill } = await TestPeer.startPeer({
        keypair: key,
        ports,
        genesis: i === 0 ? genesis : undefined,
        trustedPeers: trustedPeers(i),
      })
      onTestFinished(kill)

      const client = new Client({
        ws: WS,
        toriiBaseURL: new URL(`http://localhost:${ports.api}`),
        accountKeyPair: getAccountKeyPair(),
        accountDomain: DOMAIN,
        chain: CHAIN,
      })

      await waitForGenesisCommitted(() => client.api.telemetry.status())

      return { keypair: key, ports, client }
    }),
  )

  return {
    peers,
  }
}
