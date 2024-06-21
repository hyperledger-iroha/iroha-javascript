import { resolveBinary, EXECUTOR_WASM_PATH } from '@iroha2/iroha-source'
import { temporaryFile } from 'tempy'
import { writeFile } from 'fs/promises'
import { execa } from 'execa'
import { GENESIS_KEY_PAIR, DOMAIN, ACCOUNT_KEY_PAIR, BLOCK_TIME_MS, COMMIT_TIME_MS, CHAIN } from './base'

const kagami = await resolveBinary('kagami')

const RAW_GENESIS_FOR_KAGAMI = {
  instructions: [
    { Register: { Domain: { id: DOMAIN.name } } },
    { Register: { Account: { id: `${ACCOUNT_KEY_PAIR.publicKey}@wonderland` } } },
    { NewParameter: `?BlockTime=${BLOCK_TIME_MS}` },
    { NewParameter: `?CommitTimeLimit=${COMMIT_TIME_MS}` },
  ],
  executor: EXECUTOR_WASM_PATH,
  chain: CHAIN,
}

const genesisPathTmp = temporaryFile({ extension: 'json' })
await writeFile(genesisPathTmp, JSON.stringify(RAW_GENESIS_FOR_KAGAMI))

const { stdout } = await execa(
  kagami.path,
  [
    `genesis`,
    `sign`,
    `--genesis-file`,
    genesisPathTmp,
    `--public-key`,
    GENESIS_KEY_PAIR.publicKey,
    `--private-key`,
    GENESIS_KEY_PAIR.privateKey,
  ],
  { encoding: 'buffer' },
)

export default { blob: new Uint8Array(stdout) }
