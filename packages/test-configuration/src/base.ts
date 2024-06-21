import type { datamodel } from '@iroha2/data-model'

export const BLOCK_TIME_MS = 0
export const COMMIT_TIME_MS = 0
// TODO: add reference to iroha source code
export const PIPELINE_MS = BLOCK_TIME_MS + COMMIT_TIME_MS

export const DOMAIN: datamodel.DomainId = { name: 'wonderland' }

export const ACCOUNT_KEY_PAIR = {
  publicKey: 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
  privateKey:
    '802640E28031CC65994ADE240E32FCFD0405DF30A47BDD6ABAF76C8C3C5A4F3DE96F75B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E',
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
