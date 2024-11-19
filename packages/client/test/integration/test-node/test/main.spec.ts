import type { Client } from '@iroha2/client'
import { asyncIterAll } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'
import { describe, expect, test } from 'vitest'
import { usePeer } from './util'
import { KeyPair } from '@iroha2/crypto-core'
import { freeScope } from '@iroha2/crypto-core'

export const SAMPLE_ACCOUNT_ID = freeScope(() => {
  const kp = KeyPair.random()
  return `${kp.publicKey().toMultihash()}@badland`
})

test('Peer is healthy', async () => {
  const { client } = await usePeer()

  expect(await client.getHealth()).toMatchInlineSnapshot(`
    {
      "t": "ok",
    }
  `)
})

test('Register domain', async () => {
  const DOMAIN = 'test'
  const { client } = await usePeer()

  await client.submit(
    { t: 'Instructions', value: [{ t: 'Register', value: { t: 'Domain', value: { object: { id: DOMAIN } } } }] },
    { verify: true },
  )
  const domains = await asyncIterAll(client.request('FindDomains'))

  expect(domains.map((x) => x.id)).toContain(DOMAIN)
})

test('When querying for a non-existing asset with a singular query, returns FindError', async () => {
  const { client } = await usePeer()

  await expect(
    client.request('FindAssetQuantityById', { query: { id: `time##${SAMPLE_ACCOUNT_ID}` } }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Query execution fail]`)
})

describe('Setting configuration', () => {
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

describe('Blocks Stream API', () => {
  test('Committing 3 blocks one after another', async () => {
    const { client } = await usePeer()

    const stream = await client.blocksStream({
      fromBlockHeight: datamodel.NonZero$schema(datamodel.U64$schema).parse(2n),
    })
    const streamClosedPromise = stream.ee.once('close')

    for (const domainName of ['looking_glass', 'breakdown', 'island']) {
      const blockPromise = stream.ee.once('block')

      await client.submit({
        t: 'Instructions',
        value: [{ t: 'Register', value: { t: 'Domain', value: { object: { id: domainName } } } }],
      })

      await Promise.race([
        blockPromise,
        streamClosedPromise.then(() => {
          throw new Error('The connection should not be closed within this loop')
        }),
      ])
    }

    await stream.stop()
  })
})

test('Fetching metrics', async () => {
  const { client } = await usePeer()

  const metrics = await client.getMetrics()

  // just some line from Prometheus metrics
  expect(metrics).toMatch('block_height 1')
})

test('Fetching status', async () => {
  const { client } = await usePeer()

  const { uptime, ...rest } = await client.getStatus()

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

test.todo('Peers endpoint')

describe('Queries', () => {
  async function prelude(client: Client) {
    const bobPub = freeScope(() => KeyPair.random().publicKey().toMultihash())

    await client.submit(
      {
        t: 'Instructions',
        value: [
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'certainty' } } } },
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'based' } } } },
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'wherever' } } } },
          { t: 'Register', value: { t: 'Account', value: { object: { id: `${bobPub}@certainty` } } } },
          {
            t: 'Register',
            value: {
              t: 'AssetDefinition',
              value: { object: { id: 'time#certainty', type: { t: 'Numeric', value: {} }, mintable: 'Not' } },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'AssetDefinition',
              value: { object: { id: 'base_coin#based', type: { t: 'Store' }, mintable: 'Not' } },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'AssetDefinition',
              value: {
                object: {
                  id: 'neko_coin#wherever',
                  type: { t: 'Store' },
                  mintable: 'Not',
                  metadata: new Map([['foo', ['bar', false]]]),
                },
              },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'AssetDefinition',
              value: {
                object: { id: 'gator_coin#certainty', type: { t: 'Numeric', value: {} }, mintable: 'Infinitely' },
              },
            },
          },
          // FIXME: if I change to Mint.Domain, there is no error about this combination being invalid
          {
            t: 'Mint',
            value: {
              t: 'Asset',
              value: {
                destination: `gator_coin##${bobPub}@certainty`,
                object: { scale: 0n, mantissa: 551_231n },
              },
            },
          },
          {
            t: 'SetKeyValue',
            value: {
              t: 'Asset',
              value: {
                object: `neko_coin#wherever#${bobPub}@certainty`,
                key: 'mewo?',
                value: { me: 'wo' },
              },
            },
          },
          {
            t: 'SetKeyValue',
            value: {
              t: 'Asset',
              value: {
                object: `base_coin#based#${bobPub}@certainty`,
                key: 'hey',
                value: [1, 2, 3],
              },
            },
          },
        ],
      },
      { verify: true },
    )
  }

  test.todo('Fetch domains, accounts, asset definitions')

  test('Filter assets by ...', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const assets = await asyncIterAll(
      client.request('FindAssets', {
        predicate: {
          t: 'Atom',
          value: {
            t: 'Id',
            value: { t: 'DefinitionId', value: { t: 'Name', value: { t: 'EndsWith', value: '_coin' } } },
          },
        },
      }),
    )

    expect(new Set(assets.map((x) => x.id.definition.name))).toEqual(new Set(['base_coin', 'neko_coin', 'gator_coin']))
  })

  test('Filter with empty OR predicate returns nothing', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const domains = await asyncIterAll(client.request('FindDomains'))
    expect(domains.length).toBeGreaterThan(0)

    const domainsFiltered = await asyncIterAll(client.request('FindDomains', { predicate: { t: 'Or', value: [] } }))
    expect(domainsFiltered.length).toBe(0)
  })

  test.todo('Fetch domains in batches with specified fetch size')

  test.todo('Alternate sorting')

  test.todo('Fetch parameters and data model')
})
