import * as types from '@iroha/core/data-model'

export const DOMAIN: types.DomainId = new types.Name('wonderland')

export const ACCOUNT_KEY_PAIR = types.KeyPair.fromParts(
  types.PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E'),
  types.PrivateKey.fromMultihash('802620E28031CC65994ADE240E32FCFD0405DF30A47BDD6ABAF76C8C3C5A4F3DE96F75'),
)

export const GENESIS_KEY_PAIR = types.KeyPair.fromParts(
  types.PublicKey.fromMultihash('ed01204164BF554923ECE1FD412D241036D863A6AE430476C898248B8237D77534CFC4'),
  types.PrivateKey.fromMultihash('80262082B3BDE54AEBECA4146257DA0DE8D59D8E46D5FE34887DCD8072866792FCB3AD'),
)

export const CHAIN = '00000000-0000-0000-0000-000000000000'

export const PEER_CONFIG_BASE = {
  chain: CHAIN,
  genesis: {
    public_key: GENESIS_KEY_PAIR.publicKey().multihash(),
  },
} as const
