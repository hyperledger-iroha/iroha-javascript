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
      const { client } = await usePeer({ seed: 'config-test' })

      let config = await client.api.getConfig()
      expect(config).toMatchInlineSnapshot(`
        {
          "logger": {
            "filter": null,
            "level": "DEBUG",
          },
          "network": {
            "blockGossipPeriod": {
              "ms": 10000n,
            },
            "blockGossipSize": 4,
            "transactionGossipPeriod": {
              "ms": 1000n,
            },
            "transactionGossipSize": 500,
          },
          "publicKey": "ed0120ADEF9FC53F7705DCD2C0059097470B15A961B16C94EA4A4D01AB0B7E5DD6F91B",
          "queue": {
            "capacity": 65536,
          },
        }
      `)

      await client.api.setConfig({ logger: { level: 'TRACE' } })

      config = await client.api.getConfig()
      expect(config.logger.level).toBe('TRACE')
    })

    test('throws an error when trying to set an invalid configuration', async () => {
      const { client } = await usePeer()

      await expect(client.api.setConfig({ logger: { level: 'TR' as any } })).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: 422 (Unprocessable Entity): Failed to deserialize the JSON body into the target type: logger.level: unknown variant \`TR\`, expected one of \`TRACE\`, \`DEBUG\`, \`INFO\`, \`WARN\`, \`ERROR\` at line 1 column 23]`,
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
    expect(metrics).toMatch('block_height 2')
  })

  test('status', async () => {
    const { client } = await usePeer()

    const { uptime, ...rest } = await client.api.telemetry.status()

    expect(rest).toMatchInlineSnapshot(`
      {
        "blocks": 2n,
        "blocksNonEmpty": 1n,
        "commitTime": {
          "ms": 0n,
        },
        "peers": 0n,
        "queueSize": 0n,
        "txsApproved": 3n,
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
