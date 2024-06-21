// #region pre
import { datamodel } from '@iroha2/data-model'
import type { Client, ToriiRequirementsForApiHttp } from '@iroha2/client'

// --snip--
declare const client: Client
declare const toriiRequirements: ToriiRequirementsForApiHttp
declare const accountPublicKey: datamodel.PublicKey

const timeDefinitionId: datamodel.AssetDefinitionId = {
  name: 'time',
  domain: { name: 'looking_glass' },
}
// #endregion pre

// #region register
await client.submitExecutable(
  toriiRequirements,
  datamodel.Executable.Instructions([
    datamodel.InstructionBox.Register(
      datamodel.RegisterBox.AssetDefinition({
        object: {
          id: timeDefinitionId,
          valueType: datamodel.AssetValueType.Numeric({ scale: datamodel.Option.None() }),
          mintable: datamodel.Mintable.Infinitely, // If only we could mint more time.
          metadata: new Map(),
          logo: datamodel.Option.None(),
        },
      }),
    ),
  ]),
  { chain: '000-000' },
)
// #endregion register

{
  // #region mint
  const mintValue: datamodel.Numeric = { mantissa: 32n, scale: 0n }

  await client.submitExecutable(
    toriiRequirements,
    datamodel.Executable.Instructions([
      datamodel.InstructionBox.Mint(
        datamodel.MintBox.Asset({
          destination: {
            account: { signatory: accountPublicKey, domain: { name: 'wonderland' } },
            definition: timeDefinitionId,
          },
          object: mintValue,
        }),
      ),
    ]),
    { chain: '000-000' },
  )
  // #endregion mint
}
