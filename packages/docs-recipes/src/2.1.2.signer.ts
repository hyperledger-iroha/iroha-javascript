import type { cryptoTypes } from '@iroha2/crypto-core'
import { freeScope } from '@iroha2/crypto-core'
import { Signer } from '@iroha2/client'
import type { datamodel } from '@iroha2/data-model'

// Key pair from the previous step
declare const keyPair: cryptoTypes.KeyPair

const accountId: datamodel.AccountId = {
  // Account public key
  signatory: freeScope(() => keyPair.publicKey().toDataModel()),
  // The domain where this account is registered
  domain: { name: 'wonderland' },
}

const signer = new Signer(accountId, keyPair)
