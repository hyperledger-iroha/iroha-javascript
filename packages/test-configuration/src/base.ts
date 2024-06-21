import type { datamodel } from '@iroha2/data-model'

export const BLOCK_TIME_MS = 0
export const COMMIT_TIME_MS = 0
// TODO: add reference to iroha source code
export const PIPELINE_MS = BLOCK_TIME_MS + COMMIT_TIME_MS

export const DOMAIN: datamodel.DomainId = { name: 'wonderland' }

export const ACCOUNT_KEY_PAIR = {
  publicKey: 'ed0120CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03',
  privateKey:
    'ed0120802640CCF31D85E3B32A4BEA59987CE0C78E3B8E2DB93881468AB2435FE45D5C9DCD53CE7FA46C9DCE7EA4B125E2E36BDB63EA33073E7590AC92816AE1E861B7048B03',
} as const

export const GENESIS_KEY_PAIR = ACCOUNT_KEY_PAIR

export const PEER_KEY_PAIR = ACCOUNT_KEY_PAIR

export const CHAIN = '00000000-0000-0000-0000-000000000000'

/**
 * TODO: attach reference link
 */
export const PEER_CONFIG_BASE = {
  chain: CHAIN,
  public_key: PEER_KEY_PAIR.publicKey,
  private_key: PEER_KEY_PAIR.privateKey,
  genesis: {
    public_key: GENESIS_KEY_PAIR.publicKey,
  },
} as const
