import { Bytes, KeyPair } from '@iroha/core/crypto'
import * as dm from '@iroha/core/data-model'
import { Client } from '@iroha/client'

import { onTestFinished } from 'vitest'
import uniquePort from 'get-port'
import { ACCOUNT_KEY_PAIR, CHAIN, DOMAIN } from '@iroha/test-configuration'
import { createGenesis } from '@iroha/test-configuration/node'
import * as TestPeer from '@iroha/test-peer'

async function uniquePortsPair() {
  return {
    api: await uniquePort(),
    p2p: await uniquePort(),
  }
}

export type SeedParams = {
  seed?: Uint8Array | string
}

export async function usePeer(params?: SeedParams): Promise<{ client: Client }> {
  const {
    peers: [peer],
  } = await useNetwork({ peers: 1, ...params })

  return peer
}

export async function useNetwork(
  params: {
    peers: number
  } & SeedParams,
): Promise<{ peers: { client: Client; keypair: KeyPair; ports: { api: number; p2p: number } }[] }> {
  const configs = await Promise.all(
    Array.from({ length: params.peers }, async (_v, i) => {
      const seed = params.seed
        ? typeof params.seed === 'string' ? new TextEncoder().encode(params.seed) : [...params.seed]
        : []
      const key = params.seed
        ? KeyPair.deriveFromSeed(Bytes.array(new Uint8Array([...seed, i, i, i])))
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
        toriiBaseURL: new URL(`http://localhost:${ports.api}`),
        authority: new dm.AccountId(ACCOUNT_KEY_PAIR.publicKey(), DOMAIN),
        authorityPrivateKey: ACCOUNT_KEY_PAIR.privateKey(),
        chain: CHAIN,
      })

      return { keypair: key, ports, client }
    }),
  )

  return {
    peers,
  }
}
