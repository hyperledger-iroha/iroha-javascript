// #region intro
import type { Client, ToriiRequirementsForApiHttp } from '@iroha2/client'
import { datamodel } from '@iroha2/data-model'

declare const client: Client
declare const toriiRequirements: ToriiRequirementsForApiHttp
// #endregion intro

{
  // #region domains
  const result = await client.requestWithQueryBox(
    toriiRequirements,
    datamodel.QueryBox.FindAllDomains,
  )

  const domains = result
    .as('Ok')
    .as('V1')
    .batch.enum.as('Vec')
    .map((x) => x.enum.as('Identifiable').as('Domain'))

  for (const domain of domains) {
    console.log(
      `Domain "${domain.id.name}" has ${domain.accounts.size} accounts` +
        ` and ${domain.assetDefinitions.size} asset definitions`,
    )
    // => Domain "wonderland" has 5 accounts and 3 asset definitions
  }
  // #endregion domains
}

{
  // #region accounts
  const result = await client.requestWithQueryBox(
    toriiRequirements,
    datamodel.QueryBox.FindAllAccounts,
  )

  const accounts = result
    .as('Ok')
    .as('V1')
    .batch.enum.as('Vec')
    .map((x) => x.enum.as('Identifiable').as('Account'))

  for (const account of accounts) {
    console.log(
      `Account "${account.id}@${account.id.domain.name}" ` +
        `has ${account.assets.size} assets`,
    )
    // => Account "alice@wonderland" has 3 assets
  }
  // #endregion accounts
}

{
  // #region assets
  const result = await client.requestWithQueryBox(
    toriiRequirements,
    datamodel.QueryBox.FindAllAssets,
  )

  const assets = result
    .as('Ok')
    .as('V1')
    .batch.enum.as('Vec')
    .map((x) => x.enum.as('Identifiable').as('Asset'))

  for (const asset of assets) {
    console.log(
      `Asset "${asset.id.definition.name}#${asset.id.definition.domain.name}" ` +
        `at account "${asset.id.account}@${asset.id.account.domain.name}" ` +
        `has type "${asset.value.tag}"`,
    )
    // => Asset "rose#wonderland" at account "alice@wonderland" has type "Quantity"
  }
  // #endregion assets
}
