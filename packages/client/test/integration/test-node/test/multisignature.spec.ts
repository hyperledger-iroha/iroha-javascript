/* eslint-disable max-nested-callbacks */

import {
  Signer,
  Torii,
  computeTransactionHash,
  getCryptoAnyway,
  makeQueryPayload,
  makeSignedQuery,
  makeSignedTransaction,
  makeTransactionPayload,
} from '@iroha2/client'
import { Bytes, freeScope } from '@iroha2/crypto-core'
import { datamodel, sugar } from '@iroha2/data-model'
import { pipe } from 'fp-ts/function'
import { produce } from 'immer'
import { describe, expect, test } from 'vitest'
import { clientFactory, freeOnTestFinished, setupPeerTestsLifecycle } from './util'

setupPeerTestsLifecycle()

describe('MST (Multi-Signature Transaction)', () => {
  test('e2e scenario works as expected', async () => {
    const crypto = getCryptoAnyway()
    const { client: clientAdmin, pre, getBlocksListener } = clientFactory()
    const blocks = await getBlocksListener()

    const MAD_HATTER = sugar.accountId('mad_hatter', 'wonderland')
    const CASOMILE_DEFINITION_ID = sugar.assetDefinitionId('casomile', 'wonderland')

    // Generating two key pairs

    const KEYS = freeScope((scope) => {
      const keys = [
        crypto.KeyPair.deriveFromSeed(Bytes.hex('001122')),
        crypto.KeyPair.deriveFromSeed(Bytes.hex('332211')),
      ] as const

      for (const x of keys) scope.forget(x)

      return keys
    }).map(freeOnTestFinished)

    // these signers will be useful later
    const signer1 = new Signer(MAD_HATTER, KEYS[0])
    const signer2 = new Signer(MAD_HATTER, KEYS[1])

    // Registering the account, the asset definition and the signature check condition
    {
      const registerAccount = pipe(
        sugar.identifiable.newAccount(
          MAD_HATTER,
          // Using only the first key
          [freeScope(() => KEYS[0].publicKey().toDataModel())],
        ),
        sugar.instruction.register,
      )

      const registerAssetDefinition = pipe(
        sugar.identifiable.newAssetDefinition(CASOMILE_DEFINITION_ID, datamodel.AssetValueType('Quantity'), {
          mintable: datamodel.Mintable('Infinitely'),
        }),
        sugar.instruction.register,
      )

      const setSignatureCondition = sugar.instruction.mint(
        datamodel.Value(
          'SignatureCheckCondition',
          datamodel.SignatureCheckCondition(
            'AllAccountSignaturesAnd',
            datamodel.VecPublicKey(freeScope(() => KEYS.map((keypair) => keypair.publicKey().toDataModel()))),
          ),
        ),
        datamodel.IdBox('AccountId', MAD_HATTER),
      )

      // register Mad Hatter with the admin account

      await blocks.wait(async () => {
        await clientAdmin.submitExecutable(pre, sugar.executable.instructions(registerAccount))
      })

      // Register the asset definition with the Mad Hatter's account
      await blocks.wait(async () => {
        await Torii.submit(
          pre,
          pipe(
            sugar.executable.instructions([registerAssetDefinition, setSignatureCondition]),
            (executable) => makeTransactionPayload({ executable, accountId: MAD_HATTER }),
            (x) => makeSignedTransaction(x, signer1),
          ),
        )
      })
    }

    // Preparing MST transaction payload

    const MINTED = 42

    const mintTransactionPayload = makeTransactionPayload({
      executable: pipe(
        sugar.instruction.mint(
          sugar.value.numericU32(MINTED),
          datamodel.IdBox('AssetId', sugar.assetId(MAD_HATTER, CASOMILE_DEFINITION_ID)),
        ),
        sugar.executable.instructions,
      ),
      accountId: MAD_HATTER,
    })

    const txHash = computeTransactionHash(mintTransactionPayload)

    // 1st transaction, signed only with the first key

    const tx1 = datamodel.SignedTransaction(
      'V1',
      datamodel.SignedTransactionV1({
        payload: mintTransactionPayload,
        signatures: datamodel.SortedVecSignature([signer1.sign(Bytes.array(txHash))]),
      }),
    )

    await Torii.submit(pre, tx1)
    // we don't wait for block commit here, because the tx should be signed completely first

    // Check that the asset is not minted

    // we will use this function twice - now and after the second transaction
    async function findAsset(): Promise<datamodel.Asset | null> {
      const result = await Torii.request(
        pre,
        pipe(
          sugar.find.assetsByAccountId(MAD_HATTER),
          (query) => makeQueryPayload({ query, accountId: MAD_HATTER }),
          (payload) => makeSignedQuery(payload, signer1),
        ),
      )

      const asset = result
        .as('Ok')
        .batch.enum.as('Vec')
        .map((x) => x.enum.as('Identifiable').enum.as('Asset'))
        .find((x) => x.id.definition_id.name === CASOMILE_DEFINITION_ID.name)

      return asset ?? null
    }

    {
      const asset = await findAsset()
      expect(asset).toBeNull()
    }

    // 2nd transaction, signed with both keys

    const tx2 =
      // we use `produce` from `immer` library
      // it allows us to produce a new value from `tx1` without touching it in a declarative way
      produce(tx1, (draft) => {
        draft.enum.content.signatures.push(signer2.sign(Bytes.array(txHash)))
      })

    await blocks.wait(async () => {
      await Torii.submit(pre, tx2)
    })

    // Checking results after the second transaction

    {
      const asset = await findAsset()
      expect(asset).not.toBeNull()
      expect(asset!.value.enum.as('Quantity')).toEqual(MINTED)
    }
  })
})
