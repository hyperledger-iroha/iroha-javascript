// we want to ensure that the Node target package works in CJS mode

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { wasmPkg } = require('@iroha2/crypto-target-node')
const { Bytes, setWASM, Hash } = require('@iroha2/crypto-core')

setWASM(wasmPkg)

const hash = Hash.hash(Bytes.hex('deadbeef')).bytes('hex')
console.log('Sample hash:', hash)
