import { crypto } from '@iroha2/crypto-target-node'
import { Bytes } from '@iroha2/crypto-core'

const keyPair1 = crypto.KeyPair.fromParts(
  crypto.PublicKey.fromMultihash(
    'ed0120e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3',
  ),
  crypto.PrivateKey.fromMultihash(
    'ed0120de757bcb79f4c63e8fa0795edc26f86dfdba189b846e903d0b732bb644607720e555d194e8822da35ac541ce9eec8b45058f4d294d9426ef97ba92698766f7d3',
  ),
)

const keyPair2 = crypto.KeyPair.deriveFromSeed(Bytes.hex('001122'))

const keyPair3 = crypto.KeyPair.deriveFromPrivateKey(keyPair2.privateKey())

const keyPair4 = crypto.KeyPair.random()
