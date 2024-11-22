import type { Client } from '@iroha2/client'
import { asyncIterAll } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'
import { SCHEMA } from '@iroha2/data-model-schema'
import { describe, expect, test } from 'vitest'
import { Bytes } from '@iroha2/crypto-core'
import { match } from 'ts-pattern'
import { KeyPair } from '@iroha2/crypto-core'

import { usePeer } from './util'

export const SAMPLE_ACCOUNT_ID = `${KeyPair.random().publicKey().toMultihash()}@badland`

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
    const bob = KeyPair.deriveFromSeed(Bytes.hex('bbbb'))
    const bobAcc = `${bob.publicKey().toMultihash()}@based`
    const bobPub = bob.publicKey().toMultihash()

    const madHatter = KeyPair.deriveFromSeed(Bytes.hex('aaaa'))

    const multitudeOfDomains = Array.from({ length: 25 }, (_v, i) =>
      datamodel.InstructionBox({
        t: 'Register',
        value: { t: 'Domain', value: { object: { id: `domains-multitude-${i}` } } },
      }),
    )

    await client.submit(
      {
        t: 'Instructions',
        value: [
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'certainty' } } } },
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'based' } } } },
          { t: 'Register', value: { t: 'Domain', value: { object: { id: 'wherever' } } } },
          ...multitudeOfDomains,
          {
            t: 'Register',
            value: {
              t: 'Account',
              value: { object: { id: bobAcc, metadata: new Map([['alias', 'Bob']]) } },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'Account',
              value: {
                object: {
                  id: { signatory: madHatter.publicKey(), domain: 'certainty' },
                  metadata: new Map([['alias', 'Mad Hatter']]),
                },
              },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'AssetDefinition',
              value: {
                object: {
                  id: 'time#certainty',
                  type: { t: 'Numeric', value: { scale: { Some: 4 } } },
                  mintable: 'Infinitely',
                },
              },
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
                destination: `gator_coin#certainty#${bobPub}@based`,
                object: { scale: 0n, mantissa: 551_231n },
              },
            },
          },
          {
            t: 'SetKeyValue',
            value: {
              t: 'Asset',
              value: {
                object: `neko_coin#wherever#${bobAcc}`,
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
                object: `base_coin#based#${madHatter.publicKey().toMultihash()}@certainty`,
                key: 'hey',
                value: [1, 2, 3],
              },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'Trigger',
              value: {
                object: {
                  id: 'mewo_maker',
                  action: {
                    filter: datamodel.EventFilterBox({
                      t: 'Data',
                      value: {
                        t: 'Asset',
                        value: {
                          // TODO: report design issue - unlike in queries, it isn't possible to specify some flexible predicate
                          //       for id. I just want to specify asset definition name, but have to specify a full asset id
                          // idMatcher,
                          eventSet: ['MetadataInserted', 'MetadataRemoved', 'Created', 'Deleted', 'Added', 'Removed'],
                        },
                      },
                    }),
                    executable: {
                      t: 'Instructions',
                      value: [{ t: 'Log', value: { level: 'WARN', msg: 'MEWO!' } }],
                    },
                    repeats: { t: 'Indefinitely' },
                    authority: bobAcc,
                  },
                },
              },
            },
          },
          {
            t: 'Register',
            value: {
              t: 'Trigger',
              value: {
                object: {
                  id: 'make_havoc_every_300_ms',
                  action: {
                    filter: {
                      t: 'Time',
                      value: { t: 'Schedule', value: { start: new Date(), period: { Some: 300 } } },
                    },
                    repeats: { t: 'Indefinitely' },
                    authority: bobAcc,
                    executable: {
                      t: 'Instructions',
                      value: [
                        {
                          t: 'Mint',
                          value: {
                            t: 'Asset',
                            value: { destination: `time#certainty#${bobAcc}`, object: { mantissa: 30n, scale: 2n } },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
          // TODO: more triggers
        ],
      },
      { verify: true },
    )

    return { bob, madHatter }
  }

  test('Fetch accounts with OR predicate', async () => {
    const { client } = await usePeer()
    const { bob } = await prelude(client)

    const data = await asyncIterAll(
      client.request('FindAccounts', {
        predicate: {
          t: 'Or',
          value: [
            {
              t: 'Atom',
              value: {
                t: 'Id',
                value: { t: 'DomainId', value: { t: 'Name', value: { t: 'Contains', value: 'cert' } } },
              },
            },
            {
              t: 'Atom',
              value: { t: 'Id', value: { t: 'Signatory', value: { t: 'Equals', value: bob.publicKey() } } },
            },
          ],
        },
      }),
    )

    expect(data.map((x) => x.metadata)).toMatchInlineSnapshot(`
      [
        Map {
          "alias" => "Bob",
        },
        Map {
          "alias" => "Mad Hatter",
        },
      ]
    `)
  })

  test('Find accounts with assets', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const data = await asyncIterAll(
      client.request('FindAccountsWithAsset', { query: { assetDefinition: 'neko_coin#wherever' } }),
    )

    expect(data.map((x) => x.metadata)).toMatchInlineSnapshot(`
      [
        Map {
          "alias" => "Bob",
        },
      ]
    `)
  })

  test('Find blocks and block headers', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const blocks = await asyncIterAll(client.request('FindBlocks'))
    const headers = await asyncIterAll(client.request('FindBlockHeaders'))

    expect(blocks.map((x) => x.value.payload.header)).toEqual(headers)
  })

  test('Find transactions', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const txs = await asyncIterAll(client.request('FindTransactions'))

    expect(txs).toHaveLength(4)
    expect(
      txs.flatMap((x) =>
        match(x.value.value.payload.instructions)
          .with({ t: 'Instructions' }, ({ value }) => value)
          .otherwise(() => []),
      ).length,
    ).toMatchInlineSnapshot(`48`)
  })

  test('Find triggers', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const triggers = await asyncIterAll(client.request('FindTriggers'))
    const activeOnes = await asyncIterAll(client.request('FindActiveTriggerIds'))

    expect(triggers.map((x) => x.id)).toEqual(activeOnes)
    expect(activeOnes).toMatchInlineSnapshot(`
      [
        "make_havoc_every_300_ms",
        "mewo_maker",
      ]
    `)
  })

  test('Filter assets by the ending of its definition name', async () => {
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

  test('Paginate domains', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const domains = await asyncIterAll(client.request('FindDomains', { pagination: { offset: 5, limit: { Some: 3 } } }))

    expect(domains.map((x) => x.id)).toMatchInlineSnapshot(`
      [
        "domains-multitude-11",
        "domains-multitude-12",
        "domains-multitude-13",
      ]
    `)
  })

  test('Fetch domains in batches with specified fetch size', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const stream = client.request('FindDomains', { fetchSize: { Some: 5 } })

    // TODO: include information about remaining items into the stream return value
    let batch = await stream.next()
    expect(batch.value.map((x) => x.id)).toMatchInlineSnapshot(`
      [
        "based",
        "certainty",
        "domains-multitude-0",
        "domains-multitude-1",
        "domains-multitude-10",
      ]
    `)
    expect(batch.done).toBe(false)

    batch = await stream.next()
    expect(batch.value.map((x) => x.id)).toMatchInlineSnapshot(`
      [
        "domains-multitude-11",
        "domains-multitude-12",
        "domains-multitude-13",
        "domains-multitude-14",
        "domains-multitude-15",
      ]
    `)
    expect(batch.done).toBe(false)
  })

  test('Alternate sorting', async () => {
    const { client } = await usePeer()
    await prelude(client)

    const getValue = (x: datamodel.Asset) => x.id.definition.name

    const unsorted = await asyncIterAll(
      client.request('FindAssets', { sorting: { sortByMetadataKey: { Some: 'hey' } } }),
    ).then((x) => x.map(getValue))
    const sorted = await asyncIterAll(
      client.request('FindAssets', { sorting: { sortByMetadataKey: { Some: 'mewo?' } } }),
    ).then((x) => x.map(getValue))

    expect(unsorted).toMatchInlineSnapshot(`
      [
        "base_coin",
        "gator_coin",
        "time",
        "neko_coin",
      ]
    `)
    expect(sorted).toMatchInlineSnapshot(`
      [
        "neko_coin",
        "gator_coin",
        "time",
        "base_coin",
      ]
    `)
    expect(unsorted).not.toEqual(sorted)
  })

  test('Fetch parameters and data model (singular queries)', async () => {
    const { client } = await usePeer()

    const parameters = await client.request('FindParameters')

    expect(parameters).toMatchInlineSnapshot(`
      {
        "block": {
          "maxTransactions": 512n,
        },
        "custom": Map {},
        "executor": {
          "fuel": 55000000n,
          "memory": 55000000n,
        },
        "smartContract": {
          "fuel": 55000000n,
          "memory": 55000000n,
        },
        "sumeragi": {
          "blockTime": 0n,
          "commitTime": 0n,
          "maxClockDriftMs": 1000n,
        },
        "transaction": {
          "maxInstructions": 4096n,
          "smartContractSize": 4194304n,
        },
      }
    `)
  })

  // TODO: move to a separate test, try to set a custom parameter as well
  test('Find executor data model', async () => {
    const { client } = await usePeer()

    const dm = await client.request('FindExecutorDataModel')

    // TODO: check something in the schema?
    expect(dm.parameters).toMatchInlineSnapshot(`Map {}`)
    expect(dm.instructions).toMatchInlineSnapshot(`[]`)
  })
})

test('Iroha schema matches data model schema', async () => {
  const { client } = await usePeer()

  const schema = await client.getSchema()

  expect(schema).toEqual(SCHEMA)
})
