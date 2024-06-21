import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import consola from 'consola'
import { startPeer } from '../src/lib'

yargs(hideBin(process.argv))
  .command(
    'start',
    'Start peer',
    (y) => y,
    async () => {
      consola.info('Starting peer')
      await startPeer()
      consola.info('Started! Kill this process to kill the peer')
    },
  )
  .help()
  .parse()
