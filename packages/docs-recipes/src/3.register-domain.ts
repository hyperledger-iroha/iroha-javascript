// #region pre
import { Client, ToriiRequirementsForApiHttp } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'

// --snip--
declare const client: Client
declare const toriiRequirements: ToriiRequirementsForApiHttp
// #endregion pre

// #region do-reg
await client.submitExecutable(
  toriiRequirements,
  datamodel.Executable.Instructions([
    datamodel.InstructionBox.Register(
      datamodel.RegisterBox.Domain({
        object: {
          id: { name: 'looking_glass' },
          logo: datamodel.Option.None(),
          metadata: new Map(),
        },
      }),
    ),
  ]),
)
// #endregion do-reg

// #region ensure-fn
async function ensureDomainExistence(domainName: string) {
  // Query all domains
  const result = await client.requestWithQueryBox(
    toriiRequirements,
    datamodel.QueryBox.FindAllDomains,
  )

  // Display the request status
  console.log('%o', result)

  // Obtain the domain
  const domain = result
    .as('Ok')
    .batch.as('Vec')
    .map((x) => x.enum.as('Identifiable').enum.as('Domain'))
    .find((x) => x.id.name === domainName) // [!code hl]

  // Throw an error if the domain is unavailable
  if (!domain) throw new Error('Not found')
}
// #endregion ensure-fn

// #region do-ensure
await ensureDomainExistence('looking_glass')
// #endregion do-ensure
