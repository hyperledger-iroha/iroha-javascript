// we want to ensure that the Node target package works in ESM mode

import { wasmPkg } from '@iroha2/crypto-target-node'
import { Bytes, Hash, setWASM } from '@iroha2/crypto-core'

setWASM(wasmPkg)

const hash = Hash.hash(Bytes.hex('deadbeef')).bytes('hex')
console.log('Sample hash:', hash)
