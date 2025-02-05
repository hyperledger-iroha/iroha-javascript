import { install } from '@iroha2/crypto-target-node'

// For some reason, WASM resets each time between test files
install()
