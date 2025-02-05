import { describe, expect, test } from 'vitest'

import { Bytes, KeyPair } from '@iroha2/crypto'
import * as dm from '@iroha2/data-model'
import { QueryValidationError, type Client } from '@iroha2/client'
import { usePeer } from './util'
import { P, match } from 'ts-pattern'
import { ACCOUNT_KEY_PAIR, DOMAIN } from '@iroha2/test-configuration'

async function submitTestData(client: Client) {
  const bob = KeyPair.deriveFromSeed(Bytes.hex('bbbb'))
  const bobAcc = new dm.AccountId(dm.PublicKeyRepr.fromCrypto(bob.publicKey()), new dm.DomainId('based'))
  const bobPub = bob.publicKey().toMultihash()

  const madHatter = KeyPair.deriveFromSeed(Bytes.hex('aaaa'))

  const EMPTY_LOGO_META = { logo: null, metadata: [] } satisfies Pick<dm.NewDomain, 'logo' | 'metadata'>

  const multitudeOfDomains = Array.from({ length: 25 }, (_v, i) =>
    dm.InstructionBox.Register.Domain({
      id: new dm.Name(`domains-multitude-${i}`),
      ...EMPTY_LOGO_META,
    }),
  )

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
      id: new dm.AccountId(dm.PublicKeyRepr.fromCrypto(madHatter.publicKey()), new dm.Name('certainty')),
      metadata: [{ key: new dm.Name('alias'), value: dm.Json.fromValue('Mad Hatter') }],
    }),
    dm.InstructionBox.Register.AssetDefinition({
      id: dm.AssetDefinitionId.parse('base_coin#based'),
      type: dm.AssetType.Store,
      mintable: dm.Mintable.Not,
      ...EMPTY_LOGO_META,
    }),
    dm.InstructionBox.Register.AssetDefinition({
      id: dm.AssetDefinitionId.parse('neko_coin#wherever'),
      type: dm.AssetType.Store,
      mintable: dm.Mintable.Not,
      logo: null,
      metadata: [{ key: new dm.Name('foo'), value: dm.Json.fromValue(['bar', false]) }],
    }),
    dm.InstructionBox.Register.AssetDefinition({
      id: dm.AssetDefinitionId.parse('gator_coin#certainty'),
      type: dm.AssetType.Numeric({ scale: null }),
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
      destination: dm.AssetId.parse(`gator_coin##${madHatter.publicKey().toMultihash()}@certainty`),
    }),

    dm.InstructionBox.SetKeyValue.Asset({
      object: dm.AssetId.parse(`neko_coin#wherever#${bobAcc}`),
      key: new dm.Name('mewo?'),
      value: dm.Json.fromValue({ me: 'wo' }),
    }),
    dm.InstructionBox.SetKeyValue.Asset({
      object: dm.AssetId.parse(`base_coin#based#${madHatter.publicKey().toMultihash()}@certainty`),
      key: new dm.Name('hey'),
      value: dm.Json.fromValue([1, 2, 3]),
    }),
    dm.InstructionBox.Register.Trigger({
      // TODO: make just Name
      id: new dm.Name('mewo_maker'),
      action: {
        filter: dm.EventFilterBox.Data.Asset({
          idMatcher: null,
          eventSet: new Set(['MetadataInserted', 'MetadataRemoved', 'Created', 'Deleted', 'Added', 'Removed']),
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

test('Test data is valid', async () => {
  const { client } = await usePeer()

  await expect(submitTestData(client)).resolves.not.toThrow()
})

describe('Queries', () => {
  test('.executeSingle() throws when there are no results', async () => {
    const { client } = await usePeer()

    await expect(
      client.find
        .assets({
          predicate: dm.CompoundPredicate.FAIL,
        })
        .executeSingle(),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`[TypeError: Expected query to return exactly one element, got 0]`)
  })

  test('fetch accounts with OR predicate', async () => {
    const { client } = await usePeer()
    const { bob } = await submitTestData(client)

    const items = await client.find
      .accounts({
        predicate: dm.CompoundPredicate.Or<dm.AccountProjectionPredicate>(
          dm.CompoundPredicate.Atom(dm.AccountProjectionPredicate.Id.Domain.Name.Atom.Contains('cert')),
          dm.CompoundPredicate.Atom(
            dm.AccountProjectionPredicate.Id.Signatory.Atom.Equals(dm.PublicKeyRepr.fromCrypto(bob.publicKey())),
          ),
        ),
        selector: dm.AccountProjectionSelector.Metadata.Key({
          key: new dm.Name('alias'),
          projection: { kind: 'Atom' },
        }),
      })
      .executeAll()

    expect(items.map((x) => x.asValue())).toEqual(['Bob', 'Mad Hatter'])
  })

  test('find accounts with assets (query with payload)', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const items = await client.find
      .accountsWithAsset(
        {
          assetDefinition: dm.AssetDefinitionId.parse('neko_coin#wherever'),
        },
        {
          selector: dm.AccountProjectionSelector.Metadata.Key({
            key: new dm.Name('alias'),
            projection: { kind: 'Atom' },
          }),
        },
      )
      .executeAll()

    expect(items.map((x) => x.asValue())).toEqual(['Bob'])
  })

  test('find blocks and block headers', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const blocks = await client.find.blocks({ selector: dm.SignedBlockProjectionSelector.Header.Atom }).executeAll()
    const headers = await client.find.blockHeaders().executeAll()

    expect(blocks).toEqual(headers)
  })

  test('find transactions', async () => {
    const { client } = await usePeer()

    const txs = await client.find.transactions().executeAll()
    const status = await client.api.telemetry.status()

    expect(txs).toHaveLength(Number(status.txsAccepted))
  })

  test('find triggers', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const all = await client.find.triggers({ selector: dm.TriggerProjectionSelector.Id.Atom }).executeAll()
    const activeOnes = await client.find.activeTriggerIds().executeAll()

    expect(all).toEqual(activeOnes)
    expect(activeOnes).toMatchInlineSnapshot(`
      [
        "make_havoc_every_300_ms",
        "mewo_maker",
      ]
    `)
  })

  test('filter assets by the ending of its definition name', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const items = await client.find
      .assets({
        predicate: dm.CompoundPredicate.Atom(dm.AssetProjectionPredicate.Id.Definition.Name.Atom.EndsWith('_coin')),
        selector: dm.AssetProjectionSelector.Id.Definition.Name.Atom,
      })
      .executeAll()

    expect(items.map((x) => x.value)).contain.all.members(['base_coin', 'neko_coin', 'gator_coin'])
  })

  test('FAIL returns nothing, PASS returns all', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const domains = await client.find.domains().executeAll()
    expect(domains.length).toBeGreaterThan(0)

    const failed = await client.find.domains({ predicate: dm.CompoundPredicate.FAIL }).executeAll()
    expect(failed).toHaveLength(0)

    const passed = await client.find.domains({ predicate: dm.CompoundPredicate.PASS }).executeAll()
    expect(passed).toEqual(domains)
  })

  test('pagination works', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const ids = await client.find
      .domains({
        offset: 5,
        limit: new dm.NonZero(3),
        selector: dm.DomainProjectionSelector.Id.Name.Atom,
      })
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
        selector: dm.DomainProjectionSelector.Id.Name.Atom,
      })
      .batches()

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

    const unsorted = await client.find.assets().executeAll()
    const sorted = await client.find.assets({ sorting: { byMetadataKey: new dm.Name('mewo?') } }).executeAll()

    expect(new Set(sorted)).toEqual(new Set(unsorted))
    expect(sorted).not.toEqual(unsorted)

    expect(
      sorted.map((asset) =>
        match(asset)
          .with(
            { value: { kind: 'Store', value: P.array({ key: { value: 'mewo?' }, value: P.select() }) } },
            ([val]) => val,
          )
          .otherwise(() => null),
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "me": "wo",
        },
        null,
        null,
        null,
      ]
    `)
  })

  test('find block by hash', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    const someBlock = (await client.find.blocks().executeAll()).at(1)!

    const found = await client.find
      .blocks({
        predicate: dm.CompoundPredicate.Atom(
          dm.SignedBlockProjectionPredicate.Header.Hash.Atom.Equals(
            dm.HashRepr.fromCrypto(dm.blockHash(someBlock.value.payload.header)),
          ),
        ),
      })
      .executeSingle()

    expect(found).toEqual(someBlock)
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
      .assets({
        predicate: dm.CompoundPredicate.Atom(
          dm.AssetProjectionPredicate.Id.Definition.Atom.Equals(dm.AssetDefinitionId.parse('gator_coin#certainty')),
        ),
        selector: [dm.AssetProjectionSelector.Id.Account.Atom, dm.AssetProjectionSelector.Value.Numeric.Atom],
      })
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

  test('when numeric assets filtered, but store is selected, validation error happens and passed', async () => {
    const { client } = await usePeer()
    await submitTestData(client)

    await expect(
      client.find
        .assets({
          predicate: dm.CompoundPredicate.Atom(dm.AssetProjectionPredicate.Value.Atom.IsNumeric),
          selector: [dm.AssetProjectionSelector.Value.Store.Atom],
        })
        .executeAll(),
    ).rejects.toEqual(
      new QueryValidationError(dm.ValidationFail.QueryFailed.Conversion('Expected store value, got numeric')),
    )
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
          "fuel": 55000000n,
          "memory": 55000000n,
        },
        "smartContract": {
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
  test('invalid transaction with `verify: true` - throws', async () => {
    const { client } = await usePeer()

    function randomAccountId() {
      return new dm.AccountId(dm.PublicKeyRepr.fromCrypto(KeyPair.random().publicKey()), new dm.Name('wonderland'))
    }

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

    function randomAccountId() {
      return new dm.AccountId(dm.PublicKeyRepr.fromCrypto(KeyPair.random().publicKey()), new dm.Name('wonderland'))
    }

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
      .transactions({
        predicate: dm.CompoundPredicate.Atom(dm.CommittedTransactionProjectionPredicate.Value.Hash.Atom.Equals(hash)),
      })
      .executeSingle()

    // TODO:
    // expect(found.value).toEqual(tx.signedTransaction)
  })
})

// TODO for block stream and events stream support async generators
describe('Block Stream API', () => {
  test('Committing 3 blocks one after another', async () => {
    const { client } = await usePeer()

    const stream = await client.blocks({
      fromBlockHeight: new dm.NonZero(2),
    })
    const streamClosedPromise = stream.ee.once('close')

    for (const domainName of ['looking_glass', 'breakdown', 'island']) {
      const blockPromise = stream.ee.once('block')

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

    await stream.stop()
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
        id: new dm.AccountId(dm.PublicKeyRepr.fromHex(ACCOUNT_KEY_PAIR.publicKey), DOMAIN),
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
