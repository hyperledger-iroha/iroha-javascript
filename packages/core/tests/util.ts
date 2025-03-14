import * as dm from '@iroha/core/data-model'
import { Bytes } from '@iroha/core/crypto'

function* hexes(hex: string): Generator<number> {
  for (let i = 0; i < hex.length;) {
    if (/^[0-9a-fA-F]{2}/.test(hex.slice(i))) {
      yield Number.parseInt(hex.slice(i, i + 2), 0x10)
      i += 2
    } else i += 1
  }
}

export function fromHexWithSpaces(hex: string): Uint8Array {
  return new Uint8Array(hexes(hex))
}

export const SAMPLE_KEY_PAIR = dm.KeyPair.deriveFromSeed(Bytes.hex('deadbeef'))

export const SAMPLE_ACCOUNT_ID = dm.AccountId.parse(
  `${SAMPLE_KEY_PAIR.publicKey().multihash()}@badland`,
)
