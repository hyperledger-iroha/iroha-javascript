/* eslint-disable no-lone-blocks */
import type { IrohaCryptoInterface } from '@iroha2/crypto-core'
import type { crypto as cryptoWeb, init as initWeb } from '@iroha2/crypto-target-web'
import type { crypto as cryptoNode } from '@iroha2/crypto-target-node'
import type { crypto as cryptoBundler } from '@iroha2/crypto-target-bundler'

{
  /**
   * We can't check for a strict equality for a some reason (maybe because
   * namespaces with classes could not be identical in any way?). So, just
   * to *extend* the core interface is enough.
   */
  type ExpectToExtendCoreInterface<T extends IrohaCryptoInterface> = T

  type _test1 = ExpectToExtendCoreInterface<typeof cryptoNode>
  type _test2 = ExpectToExtendCoreInterface<typeof cryptoWeb>
  type _test3 = ExpectToExtendCoreInterface<typeof cryptoBundler>
}

{
  type ExpectToReturnPromise<T extends () => Promise<any>> = T

  type _test1 = ExpectToReturnPromise<typeof initWeb>
}
