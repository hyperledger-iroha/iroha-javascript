import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import { EXECUTOR_WASM_PATH, kagamiCodecToJson } from 'iroha-build-utils'
import type { PublicKey } from '@iroha/core/crypto'
import { ACCOUNT_KEY_PAIR, CHAIN } from './mod.ts'

const BLOCK_TIME_MS = 0
const COMMIT_TIME_MS = 0

export const DOMAIN: dm.DomainId = new dm.Name('wonderland')

export async function createGenesis(params: {
  /**
   * A list of peers' public keys. Must be at least one.
   */
  topology: PublicKey[]
}): Promise<unknown> {
  const alice = dm.AccountId.parse(`${ACCOUNT_KEY_PAIR.publicKey().multihash()}@${DOMAIN.value}`)

  const instructionsJson = await kagamiCodecToJson(
    'Vec<InstructionBox>',
    dm.Vec.with(getCodec(dm.InstructionBox)).encode([
      dm.InstructionBox.Register.Domain({ id: DOMAIN, metadata: [], logo: null }),
      dm.InstructionBox.Register.Account({ id: alice, metadata: [] }),
      dm.InstructionBox.SetParameter.Sumeragi.BlockTime(dm.Duration.fromMillis(BLOCK_TIME_MS)),
      dm.InstructionBox.SetParameter.Sumeragi.CommitTime(dm.Duration.fromMillis(COMMIT_TIME_MS)),
      ...[
        { name: 'CanSetParameters', payload: dm.Json.fromValue(null) },
        { name: 'CanRegisterDomain', payload: dm.Json.fromValue(null) },
      ].map((object) => dm.InstructionBox.Grant.Permission({ object, destination: alice })),
    ]),
  )

  // TODO: have strict typing
  const genesisSpec = {
    creation_time: new Date().toISOString(),
    chain: CHAIN,
    executor: EXECUTOR_WASM_PATH,
    instructions: instructionsJson,
    topology: params.topology.map((x) => x.multihash()),
    wasm_dir: '🤞 ignore me please 🤞',
    wasm_triggers: [],
  }

  return genesisSpec
}
