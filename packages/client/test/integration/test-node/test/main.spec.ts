import { Torii, computeSignedTransactionHash, executableIntoSignedTransaction } from '@iroha2/client'
import { type RustResult, datamodel, sugar, variant } from '@iroha2/data-model'
import { CLIENT_CONFIG } from '@iroha2/test-configuration'
import { pipe } from 'fp-ts/function'
import { Seq } from 'immutable'
import { beforeEach, describe, expect, test } from 'vitest'
import { clientFactory, setupPeerTestsLifecycle } from './util'

setupPeerTestsLifecycle()

// Actually, it is already tested within `@iroha2/test-peer`
test('Peer is healthy', async () => {
  const { pre } = clientFactory()

  expect(await Torii.getHealth(pre)).toEqual(variant('Ok', null) as RustResult<null, any>)
})

test('AddAsset instruction with name length more than limit is not committed', async () => {
  const { client, pre, getBlocksListener } = clientFactory()
  const blocks = await getBlocksListener()

  const normalAssetDefinitionId = sugar.assetDefinitionId('xor', 'wonderland')

  const tooLongAssetName = '0'.repeat(2 ** 14)
  const invalidAssetDefinitionId = sugar.assetDefinitionId(tooLongAssetName, 'wonderland')

  await blocks.wait(async () => {
    await Promise.all(
      // we should register these assets as separate transactions, because the invalid
      // one will be rejected
      [normalAssetDefinitionId, invalidAssetDefinitionId].map(async (id) => {
        await client.submitExecutable(
          pre,

          pipe(
            sugar.identifiable.newAssetDefinition(id, datamodel.AssetValueType('BigQuantity')),
            sugar.instruction.register,
            sugar.executable.instructions,
          ),
        )
      }),
    )
  })

  const queryResult = await client.requestWithQueryBox(pre, sugar.find.allAssetsDefinitions())

  const existingDefinitions: datamodel.AssetDefinitionId[] = queryResult
    .as('Ok')
    .batch.enum.as('Vec')
    .map((val) => val.enum.as('Identifiable').enum.as('AssetDefinition').id)

  expect(existingDefinitions).toContainEqual(normalAssetDefinitionId)
  expect(existingDefinitions).not.toContainEqual(invalidAssetDefinitionId)
})

test('AddAccount instruction with name length more than limit is not committed', async () => {
  const { client, pre, getBlocksListener } = clientFactory()
  const blocks = await getBlocksListener()

  const normal = sugar.accountId('bob', 'wonderland')
  const incorrect = sugar.accountId('0'.repeat(2 ** 14), 'wonderland')

  await blocks.wait(async () => {
    await client.submitExecutable(
      pre,
      pipe(
        [normal, incorrect].map((id) => pipe(sugar.identifiable.newAccount(id, []), sugar.instruction.register)),
        sugar.executable.instructions,
      ),
    )
  })

  const queryResult = await client.requestWithQueryBox(pre, sugar.find.allAccounts())

  const existingAccounts: datamodel.AccountId[] = queryResult
    .as('Ok')
    .batch.enum.as('Vec')
    .map((val) => val.enum.as('Identifiable').enum.as('Account').id)

  expect(existingAccounts).toContainEqual(normal)
  expect(existingAccounts).not.toContainEqual(incorrect)
})

test('Ensure properly handling of Fixed type - adding Fixed asset and querying for it later', async () => {
  const { client, pre, getBlocksListener } = clientFactory()
  const blocks = await getBlocksListener()

  // Creating asset by definition
  const ASSET_DEFINITION_ID = sugar.assetDefinitionId('xor', 'wonderland')

  const registerAsset = pipe(
    sugar.identifiable.newAssetDefinition(ASSET_DEFINITION_ID, datamodel.AssetValueType('Fixed'), {
      mintable: datamodel.Mintable('Infinitely'),
    }),
    sugar.instruction.register,
  )

  const DECIMAL = '512.5881'
  const mintAsset = sugar.instruction.mint(
    sugar.value.numericFixed(datamodel.FixedPointI64(DECIMAL)),
    datamodel.IdBox('AssetId', sugar.assetId(CLIENT_CONFIG.accountId, ASSET_DEFINITION_ID)),
  )

  await blocks.wait(async () => {
    await client.submitExecutable(pre, pipe([registerAsset, mintAsset], sugar.executable.instructions))
  })

  // Checking added asset via query
  const result = await client.requestWithQueryBox(pre, sugar.find.assetsByAccountId(CLIENT_CONFIG.accountId))

  // Assert
  const asset = Seq(result.as('Ok').batch.enum.as('Vec'))
    .map((x) => x.enum.as('Identifiable').enum.as('Asset'))
    .find((x) => x.id.definition_id.name === ASSET_DEFINITION_ID.name)

  expect(asset?.value).toEqual(datamodel.AssetValue('Fixed', datamodel.FixedPointI64(DECIMAL)))
})

test('Registering domain', async () => {
  const { client, pre, getBlocksListener } = clientFactory()
  const blocks = await getBlocksListener()

  async function registerDomain(domainName: string) {
    await client.submitExecutable(
      pre,
      pipe(
        //
        sugar.identifiable.newDomain(domainName),
        sugar.instruction.register,
        sugar.executable.instructions,
      ),
    )
  }

  async function ensureDomainExistence(domainName: string) {
    const result = await client.requestWithQueryBox(pre, sugar.find.allDomains())

    const domain = result
      .as('Ok')
      .batch.enum.as('Vec')
      .map((x) => x.enum.as('Identifiable').enum.as('Domain'))
      .find((x) => x.id.name === domainName)

    if (!domain) throw new Error('Not found')
  }

  await blocks.wait(async () => {
    await registerDomain('test')
  })

  await ensureDomainExistence('test')
})

test('When querying for not existing domain, returns FindError', async () => {
  const { client, pre } = clientFactory()

  const result = await client.requestWithQueryBox(
    pre,
    pipe(
      sugar.assetId(sugar.accountId('alice', 'wonderland'), sugar.assetDefinitionId('XOR', 'wonderland')),
      sugar.find.assetById,
    ),
  )

  expect(result.tag === 'Err').toBe(true)
  expect(result.as('Err').enum.as('QueryFailed').enum.as('Find').enum.as('AssetDefinition').name).toBe('XOR')
})

describe('Events API', () => {
  test('transaction-committed event is triggered after AddAsset instruction has been committed', async () => {
    const { pre, client } = clientFactory()

    const filter = sugar.filter.pipeline({
      entityKind: 'Transaction',
      statusKind: 'Committed',
    })

    // Listening

    const { ee, stop } = await Torii.listenForEvents(pre, { filter })

    const committedPromise = new Promise<void>((resolve, reject) => {
      ee.on('event', (event) => {
        if (event.enum.tag === 'Pipeline') {
          const { entity_kind, status } = event.enum.as('Pipeline')
          if (entity_kind.enum.tag === 'Transaction' && status.enum.tag === 'Committed') {
            resolve()
          }
        }
      })

      ee.on('error', () => reject(new Error('Some error')))
      ee.on('close', () => reject(new Error('Closed')))
    })

    // Triggering transaction
    await client.submitExecutable(
      pre,
      pipe(
        sugar.assetDefinitionId('xor', 'wonderland'),
        (x) => sugar.identifiable.newAssetDefinition(x, datamodel.AssetValueType('BigQuantity')),
        sugar.instruction.register,
        sugar.executable.instructions,
      ),
    )

    // Waiting for resolving
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 1_000)
      committedPromise.then(() => resolve())
    })

    // unnecessary teardown
    await stop()
  })
})

describe('Setting configuration', () => {
  test('When setting correct peer configuration, there is no error', async () => {
    const { pre } = clientFactory()

    await Torii.setPeerConfig(pre, { LogLevel: 'TRACE' })
  })

  test('When setting incorrect peer log level, there is an error', async () => {
    const { pre } = clientFactory()

    await expect(Torii.setPeerConfig(pre, { LogLevel: 'TR' as any })).rejects.toThrow()
  })
})

describe('Blocks Stream API', () => {
  test('When committing 3 blocks sequentially, nothing fails', async () => {
    const { pre, client } = clientFactory()

    const stream = await Torii.listenForBlocksStream(pre, { height: datamodel.NonZeroU64(2n) })
    const closePromise = stream.ee.once('close')

    for (const assetName of ['xor', 'val', 'vat']) {
      // listening for some block
      const blockPromise = stream.ee.once('block')

      // triggering block creation
      await client.submitExecutable(
        pre,
        pipe(
          sugar.assetDefinitionId(assetName, 'wonderland'),
          (x) => sugar.identifiable.newAssetDefinition(x, datamodel.AssetValueType('Quantity')),
          sugar.instruction.register,
          sugar.executable.instructions,
        ),
      )

      // waiting for it
      await new Promise<void>((resolve, reject) => {
        closePromise.then(() => reject(new Error('The connection should not be closed within this loop')))
        blockPromise.then(() => resolve())
      })
    }

    await stream.stop()
  })
})

describe('Metrics', () => {
  test('When getting metrics, everything is OK', async () => {
    const { pre } = clientFactory()

    const data = await Torii.getMetrics(pre)

    // just some line from Prometheus metrics
    expect(data).toMatch('block_height 1')
  })
})

test('status - peer uptime content check, not only type', async () => {
  const { pre } = clientFactory()

  const status = await Torii.getStatus(pre)

  expect(status).toEqual(
    expect.objectContaining({
      peers: expect.any(Number),
      blocks: expect.any(Number),
      txs_accepted: expect.any(Number),
      txs_rejected: expect.any(Number),
      uptime: expect.objectContaining({
        secs: expect.any(Number),
        nanos: expect.any(Number),
      }),
      view_changes: expect.any(Number),
    }),
  )
})

describe('Queries', () => {
  const TRANSACTIONS = 40
  const TXS_BEFORE = 2
  const DEFAULT_FETCH_SIZE = 10

  beforeEach(async () => {
    const { pre, signer, client } = clientFactory()

    function regDomainWithMetadata(name: string, metadata: Map<string, datamodel.Value>) {
      return datamodel.InstructionExpr(
        'Register',
        datamodel.RegisterExpr({
          object: datamodel.Expression(
            'Raw',
            datamodel.Value(
              'Identifiable',
              datamodel.IdentifiableBox(
                'NewDomain',
                datamodel.NewDomain({
                  id: datamodel.DomainId({ name }),
                  logo: datamodel.OptionIpfsPath('None'),
                  metadata: datamodel.Metadata({
                    map: datamodel.SortedMapNameValue(metadata),
                  }),
                }),
              ),
            ),
          ),
        }),
      )
    }

    const stream = await Torii.listenForEvents(pre, {
      filter: datamodel.FilterBox(
        'Pipeline',
        datamodel.PipelineEventFilter({
          entity_kind: datamodel.OptionPipelineEntityKind('Some', datamodel.PipelineEntityKind('Transaction')),
          status_kind: datamodel.OptionPipelineStatusKind('Some', datamodel.PipelineStatusKind('Committed')),
          hash: datamodel.OptionHash('None'),
        }),
      ),
    })
    const allCommitted = new Promise((resolve) => {
      let counter = 0
      stream.ee.on('event', () => {
        if (++counter >= TRANSACTIONS) resolve(null)
      })
    })

    const date = new Date()
    await Promise.all([
      ...Array.from({ length: TRANSACTIONS - 1 }, async (_v, i) => {
        await Torii.submit(
          pre,
          executableIntoSignedTransaction({
            signer,
            executable: datamodel.Executable(
              'Instructions',
              datamodel.VecInstructionExpr([
                datamodel.InstructionExpr(
                  'Log',
                  datamodel.LogExpr({
                    level: datamodel.Expression('Raw', datamodel.Value('LogLevel', datamodel.Level('DEBUG'))),
                    msg: datamodel.Expression('Raw', datamodel.Value('String', 'Hey')),
                  }),
                ),
              ]),
            ),
            payloadParams: {
              creationTime: BigInt(date.getTime() + i),
            },
          }),
        )
      }),
      client.submitExecutable(
        pre,
        datamodel.Executable(
          'Instructions',
          datamodel.VecInstructionExpr([
            regDomainWithMetadata('dom-1', new Map([['test', datamodel.Value('String', 'foo')]])),
            regDomainWithMetadata('dom-2', new Map([['test', datamodel.Value('String', 'bar')]])),
            regDomainWithMetadata(
              'dom-3',
              new Map([['test', datamodel.Value('Numeric', datamodel.NumericValue('U32', 10))]]),
            ),
            regDomainWithMetadata(
              'dom-4',
              new Map([['test', datamodel.Value('Numeric', datamodel.NumericValue('U32', 5))]]),
            ),
            regDomainWithMetadata('dom-5', new Map([['test', datamodel.Value('Bool', true)]])),
            regDomainWithMetadata('dom-6', new Map([['test', datamodel.Value('Bool', false)]])),
          ]),
        ),
      ),
    ])

    await allCommitted
  })

  test('all transactions as batches', async () => {
    const { pre, client } = clientFactory()

    const items = []
    for await (const batch of await client.query(pre, datamodel.QueryBox('FindAllTransactions')).then((resp) => {
      const iter = resp.as('Iter')
      expect(iter.first).toHaveLength(DEFAULT_FETCH_SIZE)
      items.push(...iter.first)
      return iter.next
    })) {
      expect(batch).toHaveLength(items.length < TRANSACTIONS ? DEFAULT_FETCH_SIZE : TXS_BEFORE)
      items.push(...batch)
    }

    expect(items).toHaveLength(TRANSACTIONS + TXS_BEFORE)
  })

  test('setting start & limit reflects the subset of data properly', async () => {
    const { pre, client } = clientFactory()

    const all = await client.query(pre, datamodel.QueryBox('FindAllTransactions')).then((x) => x.as('Iter').all())

    const limited = await client
      .query(pre, datamodel.QueryBox('FindAllTransactions'), {
        start: 5,
        limit: 25,
      })
      .then((x) => x.as('Iter').all())

    expect(limited).toHaveLength(25)
    expect(all.slice(5, 5 + 25)).toEqual(limited)
  })

  test('sort by metadata key', async () => {
    const { pre, client } = clientFactory()

    const unsorted = await client
      //
      .query(pre, datamodel.QueryBox('FindAllDomains'))
      .then((resp) => resp.as('Iter').all())

    const sorted = await client
      .query(pre, datamodel.QueryBox('FindAllDomains'), { sortByMetadataKey: 'test' })
      .then((resp) => resp.as('Iter').all())

    const map = (items: datamodel.Value[]) => items.map((x) => x.enum.as('Identifiable').enum.as('Domain').id.name)

    expect(unsorted).toHaveLength(sorted.length)
    expect(map(unsorted)).toMatchInlineSnapshot(`
      [
        "genesis",
        "wonderland",
        "garden_of_live_flowers",
        "dom-1",
        "dom-2",
        "dom-3",
        "dom-4",
        "dom-5",
        "dom-6",
      ]
    `)
    expect(map(sorted)).toMatchInlineSnapshot(`
      [
        "dom-6",
        "dom-5",
        "dom-2",
        "dom-1",
        "dom-4",
        "dom-3",
        "genesis",
        "wonderland",
        "garden_of_live_flowers",
      ]
    `)
  })

  test('Find transaction by hash', async () => {
    const { pre, client } = clientFactory()

    const all = await client.query(pre, datamodel.QueryBox('FindAllTransactions')).then((resp) => resp.as('Iter').all())

    const someTx = all.at(4)!.enum.as('TransactionQueryOutput').transaction.value
    const hash = computeSignedTransactionHash(someTx)

    const foundByHash = await client
      .query(
        pre,
        datamodel.QueryBox(
          'FindTransactionByHash',
          datamodel.FindTransactionByHash({
            hash: datamodel.Expression('Raw', datamodel.Value('Hash', datamodel.HashValue('Transaction', hash))),
          }),
        ),
      )
      .then((resp) => resp.as('Value').enum.as('TransactionQueryOutput').transaction)

    expect(foundByHash.value).toEqual(someTx)
  })
})
