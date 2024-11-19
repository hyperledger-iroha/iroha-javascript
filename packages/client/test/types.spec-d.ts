// import { query, ToriiHttpParams } from '@iroha2/client'
// import { datamodel } from '@iroha2/data-model'
// import { expectTypeOf, test } from 'vitest'

// declare const torii: ToriiHttpParams

// test('query typings', async () => {
//   // TODO: make fetch size just a number
//   const t1 = await query(torii, 'FindAccounts', {
//     params: { fetchSize: { Some: 1 } },
//   })

//   // TODO: make params optional
//   const t2 = await query(torii, 'FindAccounts', {})

//   const t3 = await query(torii, 'FindPermissionsByAccountId', {
//     query: { id: 'account-id' },
//   })

//   const t4 = await query(torii, 'FindExecutorDataModel', {})

//   const t5 = await query(torii, 'FindTransactionByHash', {
//     query: {},
//   })
// })
