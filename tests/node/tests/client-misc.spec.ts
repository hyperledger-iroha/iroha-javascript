import { describe, expect, test } from 'vitest'

import { Bytes, KeyPair } from '@iroha/core/crypto'
import { blockHash } from '@iroha/core'
import * as dm from '@iroha/core/data-model'
import type { Client } from '@iroha/client'
import { usePeer } from './util.ts'
import { ACCOUNT_KEY_PAIR, DOMAIN } from '@iroha/test-configuration'

/**
 * TODO: describe structure, re-shape it
 */
async function submitTestData(client: Client) {
  const bob = KeyPair.deriveFromSeed(Bytes.hex('bbbb'))
  const bobAcc = new dm.AccountId(bob.publicKey(), new dm.DomainId('based'))
  const bobPub = bob.publicKey().multihash()

  const madHatter = KeyPair.deriveFromSeed(Bytes.hex('aaaa'))
  const madHatterAcc = new dm.AccountId(madHatter.publicKey(), new dm.Name('certainty'))

  const EMPTY_LOGO_META = { logo: null, metadata: [] } satisfies Pick<dm.NewDomain, 'logo' | 'metadata'>

  const multitudeOfDomains = Array.from({ length: 25 }, (_v, i) =>
    dm.InstructionBox.Register.Domain({
      id: new dm.Name(`domains-multitude-${i}`),
      ...EMPTY_LOGO_META,
    }))

  const ALL_ISI = [
    dm.InstructionBox.Register.Domain({ id: new dm.Name('certainty'), ...EMPTY_LOGO_META }),
    dm.InstructionBox.Register.Domain({ id: new dm.Name('based'), ...EMPTY_LOGO_META }),
    dm.InstructionBox.Register.Domain({ id: new dm.Name('wherever'), ...EMPTY_LOGO_META }),
    ...multitudeOfDomains,
    dm.InstructionBox.Register.Account({
      id: bobAcc,
      metadata: [{ key: new dm.Name('alias'), value: dm.Json.fromValue('Bob') }],
    }),
    dm.InstructionBox.Register.Account({
      id: madHatterAcc,
      metadata: [{ key: new dm.Name('alias'), value: dm.Json.fromValue('Mad Hatter') }],
    }),
    dm.InstructionBox.Register.Nft({
      id: dm.NftId.parse('base_coin$based'),
      content: [],
    }),
    dm.InstructionBox.Register.Nft({
      id: dm.NftId.parse('neko_coin$wherever'),
      content: [{ key: new dm.Name('foo'), value: dm.Json.fromValue(['bar', false]) }],
    }),
    dm.InstructionBox.Register.AssetDefinition({
      id: dm.AssetDefinitionId.parse('gator_coin#certainty'),
      spec: { scale: null },
      mintable: dm.Mintable.Infinitely,
      ...EMPTY_LOGO_META,
    }),

    dm.InstructionBox.Mint.Asset({
      object: { scale: 0n, mantissa: 551_231n },
      destination: dm.AssetId.parse(`gator_coin#certainty#${bobPub}@based`),
    }),
    dm.InstructionBox.Burn.Asset({
      object: { scale: 3n, mantissa: 1_000n },
      destination: dm.AssetId.parse(`gator_coin#certainty#${bobPub}@based`),
    }),
    dm.InstructionBox.Mint.Asset({
      object: { scale: 2n, mantissa: 1904n },
      destination: dm.AssetId.parse(`gator_coin##${madHatter.publicKey().multihash()}@certainty`),
    }),

    dm.InstructionBox.SetKeyValue.Nft({
      object: dm.NftId.parse(`neko_coin$wherever`),
      key: new dm.Name('mewo?'),
      value: dm.Json.fromValue({ me: 'wo' }),
    }),
    dm.InstructionBox.Transfer.Nft({
      object: dm.NftId.parse('neko_coin$wherever'),
      source: client.authority,
      destination: bobAcc,
    }),
    dm.InstructionBox.SetKeyValue.Nft({
      object: dm.NftId.parse(`base_coin$based`),
      key: new dm.Name('hey'),
      value: dm.Json.fromValue([1, 2, 3]),
    }),
    dm.InstructionBox.Transfer.Nft({
      object: dm.NftId.parse('base_coin$based'),
      source: client.authority,
      destination: madHatterAcc,
    }),
    dm.InstructionBox.Register.Trigger({
      // TODO: make just Name
      id: new dm.Name('mewo_maker'),
      action: {
        filter: dm.EventFilterBox.Data.Asset({
          idMatcher: null,
          eventSet: new Set(['Created', 'Deleted', 'Added', 'Removed']),
        }),
        executable: dm.Executable.Instructions([dm.InstructionBox.Log({ level: { kind: 'WARN' }, msg: 'MEWO!' })]),
        repeats: dm.Repeats.Indefinitely,
        authority: bobAcc,
        metadata: [],
      },
    }),
    dm.InstructionBox.Register.Trigger({
      id: new dm.Name('make_havoc_every_300_ms'),
      action: {
        filter: dm.EventFilterBox.Time.Schedule({
          start: dm.Timestamp.now(),
          period: dm.Duration.fromMillis(300),
        }),
        repeats: dm.Repeats.Indefinitely,
        authority: bobAcc,
        executable: dm.Executable.Instructions([
          dm.InstructionBox.Mint.Asset({
            object: { mantissa: 30n, scale: 2n },
            destination: dm.AssetId.parse(`time#certainty#${bobAcc}`),
          }),
        ]),
        metadata: [],
      },
    }),
  ]

  await client.transaction(dm.Executable.Instructions(ALL_ISI)).submit({ verify: true })

  return { bob, madHatter }
}

test('submit test data without errors', async () => {
  const { client } = await usePeer()

  await expect(submitTestData(client)).resolves.not.toThrow()
})

describe('Queries', () => {
  test('.executeSingle() throws when there are no results', async () => {
    const { client } = await usePeer()

    await expect(
      client.find
        .assets()
        .filterWith(() => dm.CompoundPredicate.FAIL)
        .executeSingle(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: Expected query to return exactly one element, got 0]`)
  })

  test('fetch accounts with OR predicate', async () => {
    const { client } = await usePeer()
    const { bob } = await submitTestData(client)

    const items = await client.find
      .accounts()
      .filterWith((account) =>
        dm.CompoundPredicate.Or(
          dm.CompoundPredicate.Atom(
            account.id.domain.name.contains('cert'),
          ),
          dm.CompoundPredicate.Atom(
            account.id.signatory.equals(bob.publicKey()),
          ),
        )
      )
      .selectWith((account) => account.metadata.key(new dm.Name('alias')))
      .executeAll()

    expect(items.map((x) => x.asValue())).toEqual(['Bob', 'Mad Hatter'])
  })

  test('find accounts with assets (query with payload)', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const items = await client.find
      .accountsWithAsset(
        {
          assetDefinition: dm.AssetDefinitionId.parse('gator_coin#certainty'),
        },
      ).selectWith((acc) => acc.metadata.key(new dm.Name('alias')))
      .executeAll()

    expect(items.map((x) => x.asValue())).toEqual(['Bob', 'Mad Hatter'])
  })

  test('find blocks and block headers', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const blocks: dm.BlockHeader[] = await client.find
      .blocks({ order: dm.Order.Descending })
      .selectWith((block) => block.header).executeAll()
    const headers: dm.BlockHeader[] = await client.find.blockHeaders({ order: dm.Order.Ascending }).executeAll()

    expect(blocks).toEqual(headers.toReversed())
  })

  test('find transactions', async () => {
    const { client } = await usePeer()

    const txs = await client.find.transactions().executeAll()
    const status = await client.api.telemetry.status()

    expect(txs).toHaveLength(Number(status.txsApproved + status.txsRejected))
  })

  test('find triggers', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const all: dm.Name[] = await client.find.triggers().selectWith((trigger) => trigger.id).executeAll()
    const activeOnes: dm.Name[] = await client.find.activeTriggerIds().executeAll()

    expect(all).toEqual(activeOnes)
    expect(activeOnes).toMatchInlineSnapshot(`
      [
        "make_havoc_every_300_ms",
        "mewo_maker",
      ]
    `)
  })

  test('filter nfts by containing string in its name', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const items: dm.Name = await client.find
      .nfts()
      .filterWith((nft) => dm.CompoundPredicate.Atom(nft.id.name.contains('neko')))
      .selectWith((nft) => nft.id.name)
      .executeSingle()

    expect(items.value).toEqual('neko_coin')
  })

  test('FAIL returns nothing, PASS returns all', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const domains = await client.find.domains().executeAll()
    expect(domains.length).toBeGreaterThan(0)

    const failed = await client.find.domains().filterWith(() => dm.CompoundPredicate.FAIL).executeAll()
    expect(failed).toHaveLength(0)

    const passed = await client.find.domains().filterWith(() => dm.CompoundPredicate.PASS).executeAll()
    expect(passed).toEqual(domains)
  })

  test('pagination works', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const ids: dm.Name[] = await client.find
      .domains({
        offset: 5,
        limit: new dm.NonZero(3),
      })
      .selectWith((x) => x.id.name)
      .executeAll()

    expect(ids).toMatchInlineSnapshot(`
      [
        "domains-multitude-11",
        "domains-multitude-12",
        "domains-multitude-13",
      ]
    `)
  })

  test('Fetch domains in batches with specified fetch size', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const stream = client.find
      .domains({
        fetchSize: new dm.NonZero(5),
      })
      .selectWith((x) => x.id.name)
      .batches() satisfies AsyncGenerator<dm.Name[]>

    // TODO: include information about remaining items into the stream return value
    let batch = await stream.next()
    expect(batch.value).toMatchInlineSnapshot(`
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
    expect(batch.value).toMatchInlineSnapshot(`
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

  test('sort by metadata key', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const unsorted = await client.find.nfts().executeAll()
    const sorted = await client.find.nfts({ sorting: { byMetadataKey: new dm.Name('mewo?') } })
      .executeAll()

    expect(new Set(sorted)).toEqual(new Set(unsorted))
    expect(sorted).not.toEqual(unsorted)

    expect(sorted).toMatchInlineSnapshot(`
      [
        {
          "content": [
            {
              "key": "foo",
              "value": [
                "bar",
                false,
              ],
            },
            {
              "key": "mewo?",
              "value": {
                "me": "wo",
              },
            },
          ],
          "id": "neko_coin$wherever",
          "ownedBy": "ed0120B6F3A798AA75B19102B0B2F5F675B1248D5DB7ADD770EB9684FE5ED19014F9F2@based",
        },
        {
          "content": [
            {
              "key": "hey",
              "value": [
                1,
                2,
                3,
              ],
            },
          ],
          "id": "base_coin$based",
          "ownedBy": "ed01205DEE97BBA67AE39F87D94D3C66E4E4701685D483BCFF2657B44DF40B06DBDA71@certainty",
        },
      ]
    `)
  })

  test('find block by hash', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const someBlock = (await client.find.blocks({ order: dm.Order.Ascending }, {
      // exclude genesis block with heavy wasm for debugging purposes
      offset: 1,
    }).executeAll()).at(1)!

    const found = await client.find
      .blocks({ order: dm.Order.Ascending }).filterWith((block) =>
        dm.CompoundPredicate.Atom(
          block.header.hash.equals(
            blockHash(someBlock.value.payload.header),
          ),
        )
      )
      .executeSingle()

    expect(found.value.payload.header).toEqual(someBlock.value.payload.header)
  })

  test('find asset definitions', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const _items = await client.find.assetsDefinitions().executeAll()

    // TODO: check what?
  })

  test('find assets: filter by definition id, select account and quantity', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const assets = await client.find
      .assets()
      .filterWith((asset) =>
        dm.CompoundPredicate.Atom(
          asset.id.definition.equals(dm.AssetDefinitionId.parse('gator_coin#certainty')),
        )
      )
      .selectWith((asset) => [asset.id.account, asset.value])
      .executeAll()

    expect(assets).toMatchInlineSnapshot(`
      [
        [
          "ed0120B6F3A798AA75B19102B0B2F5F675B1248D5DB7ADD770EB9684FE5ED19014F9F2@based",
          {
            "mantissa": 551230000n,
            "scale": 3n,
          },
        ],
        [
          "ed01205DEE97BBA67AE39F87D94D3C66E4E4701685D483BCFF2657B44DF40B06DBDA71@certainty",
          {
            "mantissa": 1904n,
            "scale": 2n,
          },
        ],
      ]
    `)
  })
})

describe('Singular queries', () => {
  test('find parameters', async () => {
    const { client } = await usePeer()

    const parameters = await client.find.parameters()

    expect(parameters).toMatchInlineSnapshot(`
      {
        "block": {
          "maxTransactions": 512n,
        },
        "custom": [],
        "executor": {
          "executionDepth": 3,
          "fuel": 55000000n,
          "memory": 55000000n,
        },
        "smartContract": {
          "executionDepth": 3,
          "fuel": 55000000n,
          "memory": 55000000n,
        },
        "sumeragi": {
          "blockTime": {
            "ms": 0n,
          },
          "commitTime": {
            "ms": 0n,
          },
          "maxClockDrift": {
            "ms": 1000n,
          },
        },
        "transaction": {
          "maxInstructions": 4096n,
          "smartContractSize": 4194304n,
        },
      }
    `)
  })

  test('Find executor data model', async () => {
    const { client } = await usePeer()

    const dataModel = await client.find.executorDataModel()

    // TODO: check something in the schema?
    expect(dataModel.parameters).toMatchInlineSnapshot(`[]`)
    expect(dataModel.instructions).toMatchInlineSnapshot(`[]`)
  })
})

describe('Transactions', () => {
  function randomAccountId() {
    return new dm.AccountId(KeyPair.random().publicKey(), new dm.Name('wonderland'))
  }

  test('fire a simple transaction', async () => {
    const { client } = await usePeer()

    await client.transaction(dm.Executable.Instructions([dm.InstructionBox.Log({ level: dm.Level.INFO, msg: 'test' })]))
      .submit()
  })

  test('invalid transaction with `verify: true` - throws', async () => {
    const { client } = await usePeer()

    // TODO: include detailed rejection reason into the error
    await expect(
      client
        .transaction(
          dm.Executable.Instructions([
            dm.InstructionBox.Transfer.Domain({
              object: new dm.Name('non-existing-domain'),
              destination: randomAccountId(),
              source: randomAccountId(),
            }),
          ]),
        )
        .submit({ verify: true }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[TransactionRejectedError]`)
  })

  test('invalid transaction without verification - no errors', async () => {
    const { client } = await usePeer()

    // TODO: include detailed rejection reason into the error
    await client
      .transaction(
        dm.Executable.Instructions([
          dm.InstructionBox.Transfer.Domain({
            object: new dm.Name('non-existing-domain'),
            destination: randomAccountId(),
            source: randomAccountId(),
          }),
        ]),
      )
      .submit({ verify: false })
  })

  test('find transaction using the provided `.hash()`', async () => {
    const { client } = await usePeer()

    const tx = client.transaction(
      dm.Executable.Instructions([dm.InstructionBox.Log({ level: dm.Level.INFO, msg: 'Hello' })]),
    )
    await tx.submit({ verify: true })

    const hash = tx.hash
    const _found = await client.find
      .transactions()
      .filterWith((tx) => dm.CompoundPredicate.Atom(tx.transactionEntrypointHash.equals(hash)))
      .executeSingle()

    // TODO:
    // expect(found.value).toEqual(tx.signedTransaction)
  })
})

// TODO for block stream and events stream support async generators
describe('Block Stream API', () => {
  test('Committing 3 blocks one after another', async () => {
    const { client } = await usePeer()

    const { stream, ee, stop } = await client.blocks({
      fromBlockHeight: new dm.NonZero(2),
    })
    const streamClosedPromise = ee.once('close')

    for (const domainName of ['looking_glass', 'breakdown', 'island']) {
      const blockPromise = stream.next()

      await client
        .transaction(
          dm.Executable.Instructions([
            dm.InstructionBox.Register.Domain({
              id: new dm.Name(domainName),
              logo: null,
              metadata: [],
            }),
          ]),
        )
        .submit()

      await Promise.race([
        blockPromise,
        streamClosedPromise.then(() => {
          throw new Error('The connection should not be closed within this loop')
        }),
      ])
    }

    await stop()
  })
})

describe('Custom parameters', () => {
  test('set & retrieve custom parameters', async () => {
    const { client } = await usePeer()

    let params = await client.find.parameters().then((x) => x.custom)
    expect(params).toEqual([])

    await client
      .transaction(
        dm.Executable.Instructions([
          dm.InstructionBox.SetParameter.Custom({
            id: new dm.Name('dededede'),
            payload: dm.Json.fromValue(['ha', { nya: 'nya' }, 'fu', 'wa']),
          }),
        ]),
      )
      .submit({ verify: true })

    params = await client.find.parameters().then((x) => x.custom)
    expect(params).toMatchInlineSnapshot(`
      [
        {
          "key": "dededede",
          "value": {
            "id": "dededede",
            "payload": [
              "ha",
              {
                "nya": "nya",
              },
              "fu",
              "wa",
            ],
          },
        },
      ]
    `)
  })
})

describe('Roles & Permission', () => {
  test('find account permissions from genesis', async () => {
    const { client } = await usePeer()

    const permissions = await client.find
      .permissionsByAccountId({
        id: new dm.AccountId(ACCOUNT_KEY_PAIR.publicKey(), DOMAIN),
      })
      .executeAll()

    // set in genesis block
    expect(permissions).toMatchInlineSnapshot(`
      [
        {
          "name": "CanRegisterDomain",
          "payload": null,
        },
        {
          "name": "CanSetParameters",
          "payload": null,
        },
      ]
    `)
  })

  test.todo('find roles by account id')
})
