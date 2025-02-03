import chalk from 'chalk'
import consola from 'consola'
import { fs, path } from 'zx'
import { IROHA_DIR } from '../etc/meta'
import { execa } from 'execa'
import { match } from 'ts-pattern'
import type { SCHEMA } from '@iroha2/data-model-schema'
import type { JsonValue } from 'type-fest'

export type Binary = 'irohad' | 'iroha_kagami' | 'iroha_codec'

/**
 * Resolves path to the release build of the binary.
 *
 * If configuration is "git-clone" and the repo is not cloned or outdated,
 * it is re-created. If the binary is not yet built, builds it. These updates could be disabled with the flag.
 */
export async function resolveBinary(bin: Binary): Promise<{ path: string }> {
  const binaryPath = resolveBinaryPath(bin)
  if (!(await isAccessible(binaryPath))) {
    throw new Error(
      `Binary "${bin}" is not accessible on path "${binaryPath}".\n` +
        `Make sure to call "buildBinary('${bin}')" first, or run in terminal:\n\n` +
        `  pnpm --filter iroha-source cli build ${bin}`,
    )
  }
  return { path: binaryPath }
}

export async function buildBinaries(bin: Binary[]): Promise<void> {
  consola.info(`Building binaries ${bin.map((x) => chalk.magenta.bold(x)).join(', ')}...`)
  await runCargoBuild(bin)
  consola.success(`Binaries are built`)
}

export const EXECUTOR_WASM_PATH = path.join(IROHA_DIR, 'defaults/executor.wasm')

function resolveBinaryPath(bin: Binary): string {
  return path.join(
    IROHA_DIR,
    `target/release`,
    match(bin)
      .with('iroha_kagami', () => 'kagami')
      .otherwise((x) => x),
  )
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

export async function irohaCodecToScale(type: keyof typeof SCHEMA, json: JsonValue): Promise<Uint8Array> {
  const tool = await resolveBinary('iroha_codec')
  const input = JSON.stringify(json, undefined, 2)
  try {
    const result = await execa(tool.path, ['json-to-scale', '--type', type], {
      input,
      encoding: null,
    })
    return new Uint8Array(result.stdout)
  } catch (err) {
    console.error(input)
    throw err
  }
}

export async function irohaCodecToJson(type: keyof typeof SCHEMA, scale: Uint8Array): Promise<JsonValue> {
  const tool = await resolveBinary('iroha_codec')
  const result = await execa(tool.path, ['scale-to-json', '--type', type], {
    input: Buffer.from(scale),
    encoding: 'utf8',
  })
  return JSON.parse(result.stdout)
}
