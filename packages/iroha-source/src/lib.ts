import chalk from 'chalk'
import consola from 'consola'
import { fs, path } from 'zx'
import { IROHA_DIR } from '../etc/meta'
import { execa } from 'execa'
export { default as QUERY_IMPLS, type QueryImpl } from './impl-query'

export type Binary = 'irohad' | 'kagami' | 'parity_scale_cli'

/**
 * Resolves path to the release build of the binary.
 *
 * If configuration is "git-clone" and the repo is not cloned or outdated,
 * it is re-created. If the binary is not yet built, builds it. These updates could be disabled with the flag.
 */
export async function resolveBinary(bin: Binary): Promise<{ path: string }> {
  const binaryPath = resolveBinaryPath(bin)
  if (!(await isAccessible(binaryPath))) {
    throw new Error(`Binary "${bin}" is not accessible on path "${binaryPath}". Ensure to call \`buildBinary()\` first`)
  }
  return { path: binaryPath }
}

export async function buildBinaries(bin: Binary[]): Promise<void> {
  consola.info(`Building binaries ${bin.map((x) => chalk.magenta.bold(x)).join(', ')}...`)
  await runCargoBuild(bin)
  consola.success(`Binaries are built`)
}

export const EXECUTOR_WASM_PATH = path.join(IROHA_DIR, 'configs/swarm/executor.wasm')

function resolveBinaryPath(bin: string): string {
  return path.join(IROHA_DIR, `target/release`, bin)
}

async function runCargoBuild(crates: string[]): Promise<void> {
  await execa('cargo', ['build', '--release', ...crates.flatMap((x) => ['-p', x])], {
    stdio: 'inherit',
    cwd: IROHA_DIR,
  })
}

async function isAccessible(path: string, mode?: number): Promise<boolean> {
  return fs
    .access(path, mode)
    .then(() => true)
    .catch(() => false)
}
