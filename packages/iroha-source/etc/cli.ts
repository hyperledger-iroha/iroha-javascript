import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { buildBinary } from '../src/lib'

yargs(hideBin(process.argv))
  .command(
    'build <binary>',
    'Build specified binary',
    (yargs) => yargs.positional('binary', { choices: ['irohad', 'kagami'] as const, demandOption: true }),
    async (args) => {
      await buildBinary(args.binary)
    },
  )
  // TODO: add command to setup `.iroha` clone/path symlink
  .help()
  .alias('h', 'help')
  .parse()
