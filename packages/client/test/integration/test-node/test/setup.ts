import { FREE_HEAP, setWASM } from '@iroha2/crypto-core'
import { wasmPkg } from '@iroha2/crypto-target-node'
import { afterAll, expect } from 'vitest'

// For some reason, WASM resets each time between test files
setWASM(wasmPkg)

afterAll(() => {
  // Ensuring there are no leaks in crypto operations
  expect(FREE_HEAP.size).toEqual(0)
})
