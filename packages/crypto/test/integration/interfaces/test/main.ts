/* eslint-disable no-lone-blocks */
import type { WasmPkg } from '@iroha2/crypto-core'
import type { wasmPkg as wasmWeb, init as initWeb } from '@iroha2/crypto-target-web'
import type { wasmPkg as wasmNode } from '@iroha2/crypto-target-node'
import type { wasmPkg as wasmBundler } from '@iroha2/crypto-target-bundler'

{
  /**
   * We can't check for a strict equality for a some reason (maybe because
   * namespaces with classes could not be identical in any way?). So, just
   * to *extend* the core interface is enough.
   */
  type ExpectToExtendCoreInterface<T extends WasmPkg> = T

  type _test1 = ExpectToExtendCoreInterface<typeof wasmWeb>
  type _test2 = ExpectToExtendCoreInterface<typeof wasmNode>
  type _test3 = ExpectToExtendCoreInterface<typeof wasmBundler>
}

{
  type ExpectToReturnPromise<T extends () => Promise<any>> = T

  type _test1 = ExpectToReturnPromise<typeof initWeb>
}
