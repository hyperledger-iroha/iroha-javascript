import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import fs from 'node:fs/promises'
import path from 'node:path'
import { temporaryDirectory } from 'tempy'
import { BIN_PATHS, EXECUTOR_WASM_PATH, irohaCodecToJson } from 'iroha-build-utils'
import type { PublicKey } from '@iroha/core/crypto'
import { ACCOUNT_KEY_PAIR, CHAIN, GENESIS_KEY_PAIR } from './mod.ts'
import { spawn } from 'node:child_process'
import { Buffer } from 'node:buffer'

const BLOCK_TIME_MS = 0
const COMMIT_TIME_MS = 0

export const DOMAIN: dm.DomainId = new dm.Name('wonderland')

export async function createGenesis(params: {
  /**
   * A list of peers' public keys. Must be at least one.
   */
  topology: PublicKey[]
}): Promise<dm.SignedBlock> {
  const alice = dm.AccountId.parse(`${ACCOUNT_KEY_PAIR.publicKey}@${DOMAIN.value}`)
  const genesis = dm.AccountId.parse(`${GENESIS_KEY_PAIR.publicKey}@genesis`)

  const instructionsJson = await irohaCodecToJson(
    'Vec<InstructionBox>',
    dm.Vec.with(getCodec(dm.InstructionBox)).encode([
      dm.InstructionBox.Register.Domain({ id: DOMAIN, metadata: [], logo: null }),
      dm.InstructionBox.Register.Account({ id: alice, metadata: [] }),
      dm.InstructionBox.Transfer.Domain({ source: genesis, object: DOMAIN, destination: alice }),
      dm.InstructionBox.SetParameter.Sumeragi.BlockTime(dm.Duration.fromMillis(BLOCK_TIME_MS)),
      dm.InstructionBox.SetParameter.Sumeragi.CommitTime(dm.Duration.fromMillis(COMMIT_TIME_MS)),
      ...[
        { name: 'CanSetParameters', payload: dm.Json.fromValue(null) },
        { name: 'CanRegisterDomain', payload: dm.Json.fromValue(null) },
      ].map((object) => dm.InstructionBox.Grant.Permission({ object, destination: alice })),
    ]),
  )

  // FIXME: produce SignedBlock directly, without Kagami.
  const kagami_input = {
    chain: CHAIN,
    executor: EXECUTOR_WASM_PATH,
    instructions: instructionsJson,
    topology: params.topology.map((x) => x.multihash()),
    // FIXME: migrate to direct building of `SignedBlock`, without `genesis.json`.
    //        And note that I don't use any WASMs and these fields are extra for my case.
    wasm_dir: 'why the hell do you require wasm_dir at all times?',
    wasm_triggers: [],
  }

  return signGenesisWithKagami(kagami_input)
}

async function signGenesisWithKagami(json: unknown): Promise<dm.SignedBlock> {
  const dir = temporaryDirectory()
  await fs.writeFile(path.join(dir, 'genesis.json'), JSON.stringify(json))

  const encoded = await new Promise<Buffer>((resolve, reject) => {
    const child = spawn(BIN_PATHS.kagami, [
      `genesis`,
      `sign`,
      path.join(dir, 'genesis.json'),
      `--public-key`,
      GENESIS_KEY_PAIR.publicKey,
      `--private-key`,
      GENESIS_KEY_PAIR.privateKey,
      // '--out-file',
      // path.join(dir, 'genesis.scale'),
    ], { stdio: ['ignore', 'pipe', 'inherit'] })

    const outputChunks: Uint8Array[] = []
    child.stdout.on('data', (chunk) => outputChunks.push(chunk))

    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`non-zero exit code: ${code}`))
      resolve(Buffer.concat(outputChunks))
    })
  })

  return getCodec(dm.SignedBlock).decode(encoded)
}
