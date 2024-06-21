import { Client, ToriiRequirementsForApiHttp, getCryptoAnyway } from '@iroha2/client'
import { Bytes, freeScope } from '@iroha2/crypto-core'
import { datamodel } from '@iroha2/data-model'

// --snip--
declare const client: Client
declare const toriiRequirements: ToriiRequirementsForApiHttp

const crypto = getCryptoAnyway()

// generating the key pair
const accountKeyPair = freeScope((scope) => {
  const pair = crypto.KeyPair.deriveFromSeed(Bytes.hex('abcd1122'))
  scope.forget(pair)
  return pair
})

// extracting the public key
const publicKey = freeScope(() => accountKeyPair.publicKey().toDataModel())

await client.submitExecutable(
  toriiRequirements,
  datamodel.Executable.Instructions([
    datamodel.InstructionBox.Register(
      datamodel.RegisterBox.Account({
        object: {
          id: {
            domain: { name: 'looking_glass' },
            signatory: publicKey,
          },
          metadata: new Map(),
        },
      }),
    ),
  ]),
  { chain: '000-000' },
)
