import type { IrohaCryptoInterface } from '@iroha2/crypto-core'

let __crypto: IrohaCryptoInterface | null = null

export function setCrypto(crypto: IrohaCryptoInterface | null) {
  __crypto = crypto
}

export function getCrypto(): null | IrohaCryptoInterface {
  return __crypto
}

export function getCryptoAnyway(): IrohaCryptoInterface {
  const crypto = getCrypto()
  if (!crypto)
    throw new Error(
      '"crypto" is not defined, but required for `@iroha2/client` to function. Have you set it with `setCrypto()`?',
    )
  return crypto
}
