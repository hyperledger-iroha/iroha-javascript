import { FREE_HEAP } from '@iroha2/crypto-core'
import { setCrypto } from '@iroha2/client'
import { crypto } from '@iroha2/crypto-target-node'
import { afterAll, expect } from 'vitest'

// For some reason, `crypto` resets each time between test files
setCrypto(crypto)

afterAll(() => {
  // Ensuring there are no leaks in crypto operations
  expect(FREE_HEAP.size).toEqual(0)
})
