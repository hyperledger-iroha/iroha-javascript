import { EXECUTOR_WASM_PATH, resolveBinary } from '@iroha2/iroha-source'
import { temporaryFile } from 'tempy'
import { writeFile } from 'fs/promises'
import { execa } from 'execa'
import { ACCOUNT_KEY_PAIR, BLOCK_TIME_MS, CHAIN, COMMIT_TIME_MS, DOMAIN, GENESIS_KEY_PAIR } from './base'

const kagami = await resolveBinary('kagami')

const RAW_GENESIS_FOR_KAGAMI = {
  chain: CHAIN,
  executor: EXECUTOR_WASM_PATH,
  instructions: [
    { Register: { Domain: { id: DOMAIN.name, metadata: {} } } },
    { Register: { Account: { id: `${ACCOUNT_KEY_PAIR.publicKey}@${DOMAIN.name}`, metadata: {} } } },
    {
      Transfer: {
        Domain: {
          source: `${GENESIS_KEY_PAIR.publicKey}@genesis`,
          object: DOMAIN.name,
          destination: `${ACCOUNT_KEY_PAIR.publicKey}@${DOMAIN.name}`,
        },
      },
    },
    { NewParameter: `?BlockTime=${BLOCK_TIME_MS}` },
    { NewParameter: `?CommitTimeLimit=${COMMIT_TIME_MS}` },
  ],
  topology: [],
}

const genesisPathTmp = temporaryFile({ extension: 'json' })
await writeFile(genesisPathTmp, JSON.stringify(RAW_GENESIS_FOR_KAGAMI))

const { stdout } = await execa(
  kagami.path,
  [
    `genesis`,
    `sign`,
    genesisPathTmp,
    `--public-key`,
    GENESIS_KEY_PAIR.publicKey,
    `--private-key`,
    GENESIS_KEY_PAIR.privateKey,
  ],
  { encoding: 'buffer' },
)

export default { blob: new Uint8Array(stdout) }
