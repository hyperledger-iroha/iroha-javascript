import { datamodel } from '@iroha2/data-model'
import type { Client, ToriiRequirementsForApiHttp } from '@iroha2/client'

// --snip--
declare const client: Client
declare const toriiRequirements: ToriiRequirementsForApiHttp
declare const aliceSignatory: datamodel.PublicKey
declare const mouseSignatory: datamodel.PublicKey

const domain: datamodel.DomainId = { name: 'wonderland' }
const assetDefinition: datamodel.AssetDefinitionId = { name: 'time', domain }
const amountToTransfer: datamodel.Numeric = { mantissa: 100n, scale: 0n }
const fromAccount: datamodel.AccountId = { domain, signatory: aliceSignatory }
const toAccount: datamodel.AccountId = { domain, signatory: mouseSignatory }

const transfer = datamodel.InstructionBox.Transfer(
  datamodel.TransferBox.Asset(
    datamodel.AssetTransferBox.Numeric({
      object: amountToTransfer,
      source: { account: fromAccount, definition: assetDefinition },
      destination: toAccount,
    }),
  ),
)

await client.submitExecutable(
  toriiRequirements,
  datamodel.Executable.Instructions([transfer]),
  { chain: '000-000' },
)
