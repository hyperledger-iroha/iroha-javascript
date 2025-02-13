import { describe, expect, test } from 'vitest'

import SCHEMA from '@iroha/core/data-model/schema-json'
import { HttpTransport, MainAPI } from '@iroha/client'

import { useNetwork, usePeer } from './util.ts'
import { Buffer } from 'node:buffer'

describe('Various API methods', () => {
  test('health check passes', async () => {
    const { client } = await usePeer()

    await expect(client.api.health()).resolves.toEqual({ kind: 'healthy' })
  })

  test('health check catches an error when there is no peer started', async () => {
    const result = await new MainAPI(new HttpTransport(new URL('http://localhost:8482'))).health()

    expect(result.kind).toBe('error')
  })

  describe('configuration', () => {
    test('update and retrieve', async () => {
      const { client } = await usePeer()

      let config = await client.api.getConfig()
      expect(config.logger.level).toBe('debug')

      await client.api.setConfig({ logger: { level: 'TRACE' } })

      config = await client.api.getConfig()
      expect(config.logger.level).toBe('trace')
    })

    // FIXME: re-enable after fix of https://github.com/hyperledger-iroha/iroha/issues/5247
    test.skip('throws an error when trying to set an invalid configuration', async () => {
      const { client } = await usePeer()

      await expect(client.api.setConfig({ logger: { level: 'TR' as any } })).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: 400: Bad Request]`,
      )
    })
  })

  test('schema matches the schema of the data model', async () => {
    const { client } = await usePeer()

    const schema = await client.api.schema()

    expect(schema).toEqual(SCHEMA)
  })
})

describe('Telemetry API methods', () => {
  test('metrics', async () => {
    const { client } = await usePeer()

    const metrics = await client.api.telemetry.metrics()

    // just some line from Prometheus metrics
    expect(metrics).toMatch('block_height 1')
  })

  test('status', async () => {
    const { client } = await usePeer()

    const { uptime, ...rest } = await client.api.telemetry.status()

    expect(rest).toMatchInlineSnapshot(`
    {
      "blocks": 1n,
      "peers": 0n,
      "queueSize": 0n,
      "txsAccepted": 3n,
      "txsRejected": 0n,
      "viewChanges": 0n,
    }
  `)
    expect(uptime).toEqual(
      expect.objectContaining({
        nanos: expect.any(Number),
        secs: expect.any(BigInt),
      }),
    )
  })

  test('peers (network of 4)', async () => {
    const { peers } = await useNetwork({ peers: 4, seed: new Uint8Array(Buffer.from('deadbeef', 'hex')) })

    const peersData = await peers[0].client.api.telemetry.peers()

    expect(peersData.map((x) => x.id.multihash())).contain.all.members(
      peers.slice(1).map((x) => x.keypair.publicKey().multihash()),
    )
  })
})
