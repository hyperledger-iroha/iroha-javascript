// import chalk from 'chalk'
// import consola from 'consola'
import { fs, path } from 'zx'
import { IROHA_DIR } from './meta.ts'
import { match } from 'ts-pattern'
import type SCHEMA from '@iroha/core/data-model/schema-json'
import type { JsonValue } from 'type-fest'
import { assert } from '@std/assert'
import * as colors from '@std/fmt/colors'
import * as R from 'remeda'
import { spawn } from 'node:child_process'
import { Buffer } from 'node:buffer'

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
        `Make sure to run "deno task prep:iroha:build"`,
    )
  }
  return { path: binaryPath }
}

export async function buildBinaries(bin: Binary[]): Promise<void> {
  console.info(
    `Building binaries: ${bin.map((x) => R.pipe(x, colors.bold, colors.magenta)).join(', ')}...`,
  )
  await runCargoBuild(bin)
  console.info(`Binaries are built`)
}

export const EXECUTOR_WASM_PATH: string = path.join(
  IROHA_DIR,
  'defaults/executor.wasm',
)

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
  const packages = crates.flatMap((x) => ['-p', x])
  const child = spawn('cargo', ['build', '--release', ...packages], {
    cwd: IROHA_DIR,
    stdio: ['ignore', 'inherit', 'inherit'],
  })
  await new Promise<void>((resolve, reject) => {
    child.on('close', (code) => {
      assert(code === 0, 'non-zero cargo exit code')
      resolve()
    })
    child.on('error', (reason) => {
      reject(reason)
    })
  })
}

async function isAccessible(path: string, mode?: number): Promise<boolean> {
  try {
    await fs
      .access(path, mode)
    return true
  } catch {
    return false
  }
}

export async function irohaCodecToScale(
  type: keyof typeof SCHEMA,
  json: JsonValue,
): Promise<Uint8Array> {
  const tool = await resolveBinary('iroha_codec')
  const input = JSON.stringify(json, undefined, 2)

  return new Promise((resolve, reject) => {
    const child = spawn(tool.path, ['json-to-scale', '--type', type], {
      stdio: ['pipe', 'pipe', 'inherit'],
    })

    const chunks: Uint8Array[] = []

    child.stdout.on('data', (chunk) => {
      chunks.push(chunk)
    })

    child.on('close', (code) => {
      if (code !== 0) reject(new Error('non-zero exit code of iroha_codec'))
      resolve(Uint8Array.from(Buffer.concat(chunks)))
    })

    child.stdin.write(new TextEncoder().encode(input))
    child.stdin.end()
  })
}

export async function irohaCodecToJson(
  type: keyof typeof SCHEMA,
  scale: Uint8Array,
): Promise<JsonValue> {
  const tool = await resolveBinary('iroha_codec')

  return new Promise<JsonValue>((resolve, reject) => {
    const child = spawn(tool.path, ['scale-to-json', '--type', type], {
      stdio: ['pipe', 'pipe', 'inherit'],
    })

    const chunks: Uint8Array[] = []
    child.stdout.on('data', (chunk) => {
      chunks.push(chunk)
    })

    child.on('close', (code) => {
      if (code !== 0) reject(new Error(`non-zero exit code: ${code}`))
      const text = new TextDecoder().decode(Buffer.concat(chunks))
      resolve(JSON.parse(text))
    })

    child.stdin.write(scale)
    child.stdin.end()
  })
}
