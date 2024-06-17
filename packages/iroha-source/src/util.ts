import chalk from 'chalk'
import consola from 'consola'
import del from 'del'
import { type Options as ExecaOptions, execa } from 'execa'
import makeDir from 'make-dir'
import { fs, path } from 'zx'
import url from 'url'
import { CLONE_DIR, IROHA_DIR, IROHA_DIR_CLONE_META_DIR_FILE } from '../etc/meta'
import { RawGitCloneConfiguration, ResolvedConfig, ResolvedConfigGitClone } from './types'

export async function clone(config: RawGitCloneConfiguration): Promise<void> {
  consola.info(
    `Cloning Git repo with origin ${chalk.green.bold(config.origin)} ` +
      `at revision ${chalk.magenta.bold(config.rev)} into ${chalk.blue.bold(CLONE_DIR)}`,
  )

  await del(CLONE_DIR, { force: true })
  await makeDir(CLONE_DIR)
  const EXECA_OPTS: ExecaOptions = { cwd: CLONE_DIR, stdio: 'inherit' }
  await execa('git', ['init', '--quiet'], EXECA_OPTS)
  await execa('git', ['remote', 'add', 'origin', config.origin], EXECA_OPTS)
  await execa('git', ['fetch', 'origin', config.rev], EXECA_OPTS)
  await execa('git', ['reset', '--hard', 'FETCH_HEAD'], EXECA_OPTS)

  const META_FILE_DIR = path.dirname(IROHA_DIR_CLONE_META_DIR_FILE)
  await makeDir(META_FILE_DIR)
  await fs.writeFile(path.join(META_FILE_DIR, '.gitignore'), '*\n')
  await fs.writeFile(IROHA_DIR_CLONE_META_DIR_FILE, JSON.stringify(config))

  consola.success('Iroha Git repo is cloned')
}

export async function isCloneUpToDate(config: RawGitCloneConfiguration): Promise<boolean> {
  try {
    const meta: RawGitCloneConfiguration = await import(IROHA_DIR_CLONE_META_DIR_FILE)
    if (meta.origin === config.origin && meta.rev === config.rev) return true
    consola.debug('Iroha repo clone exists, but is not up-to-date')
    return false
  } catch (err) {
    consola.debug(
      `Error while reading the metadata of the cloned repo. Assuming the clone as not up-to-date.` +
        `\nActual error: ${String(err)}`,
    )
    return false
  }
}

export function resolveBinaryPath(bin: string): string {
  return path.join(IROHA_DIR, `target/release`, bin)
}

export async function runCargoBuild(crate: string): Promise<void> {
  const process = execa('cargo', ['build', '--release', '--package', crate], {
    stdio: 'inherit',
    cwd: IROHA_DIR,
    env: {
      // Temporary workaround until https://github.com/hyperledger/iroha/pull/4015
      // is not backported into `iroha2-stable`
      RUSTFLAGS: '-A missing-docs -A unused',
    },
  })
  consola.debug(`Spawn %o`, process.spawnargs)
  await process
}

export async function isAccessible(path: string, mode?: number): Promise<boolean> {
  return fs
    .access(path, mode)
    .then(() => true)
    .catch(() => false)
}

async function readlink(path: string): Promise<{ t: 'ok'; target: string } | { t: 'err' }> {
  return fs
    .readlink(path, { encoding: 'utf-8' })
    .then((target) => {
      if (typeof target !== 'string') throw new Error('expected a string')
      return { t: 'ok', target } as const
    })
    .catch(() => ({ t: 'err' }))
}

export function assertConfigurationIsGitClone(cfg: ResolvedConfig): asserts cfg is ResolvedConfigGitClone {
  if (cfg.t !== 'git-clone')
    throw new Error(`Expected to work with git-clone configuration, but got cfg with type of "${cfg.t}"`)
}

export async function syncIrohaSymlink(config: ResolvedConfig) {
  const symlinkDir = IROHA_DIR
  const symlinkDirRelative = path.relative(url.fileURLToPath(new URL('../', import.meta.url)), symlinkDir)
  const target = config.t === 'git-clone' ? CLONE_DIR : config.absolutePath
  const existingLink = await readlink(symlinkDir)
  if (!(existingLink.t === 'ok' && existingLink.target === target)) {
    await del(symlinkDir, { force: true })
    consola.debug(chalk`Removed existing {blue ${symlinkDirRelative}}`)
    await fs.symlink(target, symlinkDir)
    consola.debug(chalk`Created symlink {blue ${symlinkDirRelative}} -> {blue ${target}}`)
  }
}

export async function syncSourceRepo(config: ResolvedConfig) {
  if (config.t === 'git-clone' && !(await isCloneUpToDate(config))) await clone(config)
    await syncIrohaSymlink(config);
}
