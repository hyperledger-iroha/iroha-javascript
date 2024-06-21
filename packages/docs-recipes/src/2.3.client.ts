import type { Signer, ToriiRequirementsForApiHttp } from '@iroha2/client'
import { Client } from '@iroha2/client'
import type { datamodel } from '@iroha2/data-model'

// --snip--
declare const signer: Signer
declare const toriiRequirements: ToriiRequirementsForApiHttp

const client = new Client({ signer })

// `Client` will sign & wrap `Executable` into `VersionedSignedTransaction`
declare const exec: datamodel.Executable
await client.submitExecutable(toriiRequirements, exec, { chain: '000-000' })
