import type SCHEMA from '@iroha/core/data-model/schema-json'
import type { JsonValue } from 'type-fest'
import { spawn } from 'node:child_process'
import { Buffer } from 'node:buffer'
import { stat } from 'node:fs/promises'
import { fail } from '@std/assert/fail'
import * as path from 'node:path'

const resolvePrepIroha = (...paths: string[]) => {
  const pathname = new URL(import.meta.url).pathname
  let dirname: string
  // This weirdness happens in `@deno/vite-plugin`
  const matchDenoVitePlugin = pathname.match(/TypeScript::iroha-build-utils::(.+)$/)
  if (matchDenoVitePlugin) {
    dirname = path.dirname(matchDenoVitePlugin[1])
  } else dirname = path.dirname(pathname)
  return path.resolve(dirname, '../prep/iroha', ...paths)
}

export type Binary = 'irohad' | 'kagami'

export const BIN_PATHS: Record<Binary, string> = {
  irohad: resolvePrepIroha('irohad'),
  kagami: resolvePrepIroha('kagami'),
}

export const EXECUTOR_WASM_PATH: string = resolvePrepIroha('executor.wasm')

for (const filePath of [...Object.values(BIN_PATHS), EXECUTOR_WASM_PATH]) {
  try {
    await stat(filePath)
  } catch (err) {
    console.error(`${filePath} doesn't exist, is seems:`, err)
    fail()
  }
}

export async function kagamiCodecToScale(
  type: keyof typeof SCHEMA,
  json: JsonValue,
): Promise<Uint8Array> {
  const input = JSON.stringify(json, undefined, 2)

  return new Promise((resolve, reject) => {
    const child = spawn(BIN_PATHS.kagami, ['codec', 'json-to-scale', '--type', type], {
      stdio: ['pipe', 'pipe', 'inherit'],
    })

    const chunks: Uint8Array[] = []

    child.stdout.on('data', (chunk) => {
      chunks.push(chunk)
    })

    child.on('close', (code) => {
      if (code !== 0) reject(new Error('non-zero exit code of kagami'))
      resolve(Uint8Array.from(Buffer.concat(chunks)))
    })

    child.stdin.write(new TextEncoder().encode(input))
    child.stdin.end()
  })
}

export async function kagamiCodecToJson(
  type: keyof typeof SCHEMA,
  scale: Uint8Array,
): Promise<JsonValue> {
  return new Promise<JsonValue>((resolve, reject) => {
    const child = spawn(BIN_PATHS.kagami, ['codec', 'scale-to-json', '--type', type], {
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
