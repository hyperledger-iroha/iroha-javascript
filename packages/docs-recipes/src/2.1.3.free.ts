import { Bytes, FREE_HEAP, freeScope } from '@iroha2/crypto-core'
import { crypto } from '@iroha2/crypto-target-node'

const _keyPair = freeScope((scope) => {
  const kp = crypto.KeyPair.deriveFromSeed(Bytes.hex('0102'))

  console.log(FREE_HEAP.size) // => 2 (key gen configuration and key pair)

  scope.forget(kp)

  return kp
})

console.log(FREE_HEAP.size) // => 1 (only key pair)
