import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { type Binary, buildBinaries } from '../src/lib'

const BINARIES: Binary[] = ['irohad', 'kagami', 'parity_scale_cli']

yargs(hideBin(process.argv))
  .command(
    'build <binary>',
    'Build specified binary',
    (yargs) => yargs.positional('binary', { choices: BINARIES, demandOption: true }),
    async (args) => {
      await buildBinaries([args.binary])
    },
  )
  .command(
    'build-all',
    'Build all binaries',
    (y) => y,
    () => buildBinaries(BINARIES),
  )
  // TODO: add command to setup `.iroha` clone/path symlink
  .help()
  .alias('h', 'help')
  .parse()
