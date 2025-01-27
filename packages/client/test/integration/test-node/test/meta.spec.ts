import { describe, expect, test } from 'vitest'

import { SCHEMA } from '@iroha2/data-model-schema'
import { Client, getHealth } from '@iroha2/client'

import { usePeer } from './util'

describe('meta methods', () => {
  test('health check passes', async () => {
    const { client } = await usePeer()

    await expect(client.health()).resolves.toEqual({ kind: 'healthy' })
  })

  test('health check fails when there is no peer started', async () => {
    const result = await getHealth({ fetch, toriiBaseURL: 'http://localhost:8482' })

    expect(result).toMatchInlineSnapshot(`
      {
        "kind": "error",
        "value": [TypeError: fetch failed],
      }
    `)
  })

  test('metrics', async () => {
    const { client } = await usePeer()

    const metrics = await client.metrics()

    // just some line from Prometheus metrics
    expect(metrics).toMatch('block_height 1')
  })

  test('status', async () => {
    const { client } = await usePeer()

    const { uptime, ...rest } = await client.status()

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

  describe('configuration', () => {
    test('Can set and fetch configuration', async () => {
      const { client } = await usePeer()

      // FIXME: 202 accepted is fine
      await client.setPeerConfig({ logger: { level: 'TRACE' } })
    })

    // FIXME: re-enable after fix of https://github.com/hyperledger-iroha/iroha/issues/5247
    test.skip('Throws an error when trying to set an invalid configuration', async () => {
      const { client } = await usePeer()

      await expect(client.setPeerConfig({ logger: { level: 'TR' as any } })).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: 400: Bad Request]`,
      )
    })
  })

  test.todo('Peers endpoint')
})

test('Iroha schema matches data model schema', async () => {
  const { client } = await usePeer()

  const schema = await client.schema()

  expect(schema).toEqual(SCHEMA)
})

test.todo('all kinds of IDs - consistent with each other, name wraps')
