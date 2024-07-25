// import { Torii } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'
import { describe, expect, test } from 'vitest'
import { usePeer } from './util'
import { DOMAIN } from '@iroha2/test-configuration'
import { match, P } from 'ts-pattern'

test('Peer is healthy', async () => {
  const { client } = await usePeer()

  expect(await client.getHealth()).toMatchInlineSnapshot(`
    {
      "t": "ok",
    }
  `)
})

test.only('Register domain', async () => {
  const DOMAIN = 'test'
  const { client } = await usePeer()

  await client.submit(
    { t: 'Instructions', value: [{ t: 'Register', value: { t: 'Domain', value: { object: { id: DOMAIN } } } }] },
    { verify: true },
  )

  // FIXME: too much to handle for clients!
  const domains = match(await client.query({ t: 'FindAllDomains' }))
    .with(
      {
        t: 'V1',
        value: { batch: { t: 'Vec', value: P.select() } },
      },
      (items) =>
        items.map((x) =>
          match(x)
            .with({ t: 'Identifiable', value: { t: 'Domain', value: { id: P.select() } } }, (id) => id)
            .otherwise(() => {
              throw new Error('unreachable')
            }),
        ),
    )
    .otherwise(() => {
      throw new Error('unreachable')
    })

  expect(domains).toContain(DOMAIN)
})

test('AddAsset instruction with name length more than limit is not committed', async () => {
  const { client } = await usePeer()
  const newAsset = (id: datamodel.AssetDefinitionId): datamodel.NewAssetDefinition => {
    return {
      id,
      valueType: datamodel.AssetValueType.Numeric({ scale: datamodel.Option.None() }),
      mintable: datamodel.Mintable.Once,
      logo: datamodel.Option.None(),
      metadata: new Map(),
    }
  }

  const validAsset = { domain: DOMAIN, name: 'rose' }
  await client.submit(
    datamodel.Executable.Instructions([
      datamodel.InstructionBox.Register(
        datamodel.RegisterBox.AssetDefinition({
          object: newAsset(validAsset),
        }),
      ),
    ]),
    { verify: true },
  )

  const invalidAsset = { domain: DOMAIN, name: '0'.repeat(2 ** 14) }
  await expect(
    client.submit(
      datamodel.Executable.Instructions([
        datamodel.InstructionBox.Register(
          datamodel.RegisterBox.AssetDefinition({
            object: newAsset(invalidAsset),
          }),
        ),
      ]),
      { verify: true },
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Transaction rejected]`)

  const definitions: datamodel.AssetDefinitionId[] = (await client.query(datamodel.QueryBox.FindAllAssetsDefinitions))
    .as('V1')
    .batch.enum.as('Vec')
    .map((val) => val.enum.as('Identifiable').as('AssetDefinition').id)
  expect(definitions).toContainEqual(validAsset)
  expect(definitions).not.toContainEqual(invalidAsset)
})

test('When querying for a non-existing domain, returns FindError', async () => {
  const { client } = await usePeer()

  await expect(
    client.query(datamodel.QueryBox.FindDomainById({ id: { name: 'non-existing' } })),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Query validation failed]`)
})

describe('Setting configuration', () => {
  test('Can set and fetch configuration', async () => {
    const { client } = await usePeer()

    // FIXME: 202 accepted is fine
    await client.setPeerConfig({ logger: { level: 'TRACE' } })
  })

  test('Throws an error when trying to set an invalid configuration', async () => {
    const { client } = await usePeer()

    await expect(client.setPeerConfig({ logger: { level: 'TR' as any } })).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: 400: Bad Request]`,
    )
  })
})

describe('Blocks Stream API', () => {
  test('Committing 3 blocks one after another', async () => {
    const { client } = await usePeer()

    const stream = await client.blocksStream({ fromBlockHeight: datamodel.NonZero.define(2n) })
    const streamClosedPromise = stream.ee.once('close')

    for (const assetName of ['xor', 'val', 'vat']) {
      const blockPromise = stream.ee.once('block')

      await client.submit(
        datamodel.Executable.Instructions([
          datamodel.InstructionBox.Register(
            datamodel.RegisterBox.AssetDefinition({
              object: {
                id: { name: assetName, domain: { name: 'wonderland' } },
                valueType: datamodel.AssetValueType.Store,
                mintable: datamodel.Mintable.Not,
                logo: datamodel.Option.None(),
                metadata: new Map(),
              },
            }),
          ),
        ]),
      )

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
      "txsAccepted": 1n,
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
