// we want to ensure that the Node target package works in ESM mode

import { crypto } from '@iroha2/crypto-target-node'
import { Bytes } from '@iroha2/crypto-core'

const hash = crypto.Hash.hash(Bytes.hex('deadbeef')).bytes('hex')
console.log('Sample hash:', hash)
