import { install } from '@iroha/crypto-target-node'

// For some reason, WASM resets each time between test files
install()
