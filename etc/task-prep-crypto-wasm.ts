import { parseArgs } from 'jsr:@std/cli'
import * as path from 'jsr:@std/path'
import $ from 'jsr:@david/dax'
import * as colors from '@std/fmt/colors'
import { glob, hashsum, resolveFromRoot } from './util.ts'
import { copy, emptyDir } from 'jsr:@std/fs'
import { assert } from '@std/assert/assert'

const WASM_PACK_OUT_NAME = 'iroha_crypto'
const PROJECT_DIR = resolveFromRoot('crypto-wasm')

function wasmPackOutDir(target: 'node' | 'web') {
  return resolveFromRoot(`prep/crypto-wasm/pkg-${target}`)
}

async function runCargoBuild(): Promise<{ hash: string }> {
  const target = 'wasm32-unknown-unknown'
  $.logStep('Running cargo build')
  await $`cargo build --release --target ${target}`.cwd(PROJECT_DIR)
  const hash = await hashsum(path.join(PROJECT_DIR, 'target', target, 'release/iroha_crypto_wasm.wasm'))
  $.logStep(`Finished cargo build, output hash: ${colors.yellow(hash)}`)
  return { hash }
}

async function tryReadWasmPkgCacheKey(target: 'node' | 'web'): Promise<null | string> {
  const file = path.join(wasmPackOutDir(target), 'cache-key')
  try {
    const contents = await Deno.readTextFile(file)
    return contents
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return null
    throw err
  }
}

async function writeWasmPkgCacheKey(target: 'node' | 'web', key: string) {
  const file = path.join(wasmPackOutDir(target), 'cache-key')
  await Deno.writeTextFile(file, key)
}

async function findPackagesCacheKey(): Promise<null | string> {
  const keys = await Promise.all([tryReadWasmPkgCacheKey('node'), tryReadWasmPkgCacheKey('web')]).then((x) =>
    new Set(x)
  )
  if (keys.size === 1) {
    const [key] = keys
    return key
  }
  return null
}

async function runWasmPack(opts: { key: string }) {
  for (const target of ['node', 'web'] as const) {
    const wasmPackTarget = target === 'node' ? 'nodejs' : 'web'

    $.logStep(`Running wasm-pack for ${target}`)
    await $`wasm-pack build --target ${wasmPackTarget} --out-dir ${
      wasmPackOutDir(target)
    } --out-name ${WASM_PACK_OUT_NAME}`.cwd(
      PROJECT_DIR,
    )

    await writeWasmPkgCacheKey(target, opts.key)
  }
}

async function buildWasmPackages(opts: { force: boolean }) {
  const { hash } = await runCargoBuild()
  const prevKey = await findPackagesCacheKey()
  if (!opts.force && hash === prevKey) {
    $.logStep(`Skipping wasm-pack as it is up to date (override with ${colors.red('--force')})`)
    return
  }
  await runWasmPack({ key: hash })
}

async function buildCryptoWasm(opts: { force: boolean; onlyCopy: boolean }) {
  if (opts.onlyCopy) {
    $.logStep('Skipping wasm build')
  } else {
    await buildWasmPackages(opts)
  }
  await copyTargets()
}

async function copyTargets() {
  for (const target of ['node', 'web'] as const) {
    const copyToDir = resolveFromRoot(`packages/crypto-target-${target}/wasm-target`)
    await emptyDir(copyToDir)
    const copyGlob = await glob(path.join(wasmPackOutDir(target), `${WASM_PACK_OUT_NAME}*`))
    assert(copyGlob.length, 'nothing to copy. is prep/crypto-wasm ready?')
    for (const pathFrom of copyGlob) {
      await copy(pathFrom, path.join(copyToDir, path.basename(pathFrom)))
    }
    if (target === 'node') {
      await Deno.writeTextFile(
        path.join(copyToDir, 'package.json'),
        JSON.stringify({ type: 'commonjs' }),
      )
    }
    $.logStep('Ready', copyToDir)
  }

  const copyToDir = resolveFromRoot(`packages/crypto/wasm-target`)
  await emptyDir(copyToDir)
  const dts = path.join(wasmPackOutDir('node'), `${WASM_PACK_OUT_NAME}.d.ts`)
  await copy(dts, path.join(copyToDir, 'wasm-pkg.d.ts'))
  $.logStep('Ready', copyToDir)
}

const args = parseArgs(Deno.args, {
  boolean: ['force', 'onlyCopy'],
  default: { 'force': false, onlyCopy: false },
})

await buildCryptoWasm(args)
