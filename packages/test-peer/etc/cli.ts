import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import consola from 'consola'
import { startPeer } from '../src/lib'
import { KeyPair } from '@iroha2/crypto-core'
import { createGenesis } from '@iroha2/test-configuration/src/node'

yargs(hideBin(process.argv))
  .command(
    'start',
    'Start peer',
    (y) => y,
    async () => {
      consola.info('Starting peer')
      const keypair = KeyPair.random()
      const genesis = await createGenesis({ topology: [keypair.publicKey()] })
      await startPeer({ genesis, ports: { api: 8080, p2p: 1337 }, keypair })
      consola.info('Started! Kill this process to kill the peer')
    },
  )
  .help()
  .parse()
