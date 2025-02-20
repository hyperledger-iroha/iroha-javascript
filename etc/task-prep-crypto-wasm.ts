import { parseArgs } from 'jsr:@std/cli'
import * as path from 'jsr:@std/path'
import $ from 'jsr:@david/dax'
import * as colors from '@std/fmt/colors'
import { pathRel, resolveFromRoot } from './util.ts'
import { copy, emptyDir } from 'jsr:@std/fs'
import { assert } from '@std/assert/assert'
import { assertEquals } from '@std/assert/equals'

const PROJECT_DIR = resolveFromRoot('crypto-wasm')
const PREP_DIR = resolveFromRoot('prep/crypto-wasm')
console.log(PROJECT_DIR)
const CRATE_NAME = 'iroha_crypto_wasm'

async function buildWasm() {
  const outDir = PREP_DIR
  console.log('  ' + colors.yellow(`empty ${pathRel(PREP_DIR)}`))
  await emptyDir(PREP_DIR)

  $.logStep(`Building with @deno/wasmbuild...`)
  await $`deno run -A jsr:@deno/wasmbuild --out ${outDir}`.cwd(PROJECT_DIR)
  console.log(`  ${colors.yellow(`write ${pathRel(outDir)}`)}`)
}

async function checkBuildReady() {
  try {
    const files = new Set<string>()
    for await (const i of Deno.readDir(PREP_DIR)) {
      assert(i.isFile)
      files.add(i.name)
    }
    assertEquals(files, new Set([`.d.ts`, '.internal.js', '.js', '.wasm'].map((x) => `${CRATE_NAME}${x}`)))
    return true
  } catch (err) {
    $.logWarn('Error whiule checking build artifacts:', err)
    return false
  }
}

async function copyOutputs() {
  const targetDir = resolveFromRoot('packages/core/crypto/wasm')
  const files = [`${CRATE_NAME}.d.ts`, `${CRATE_NAME}.wasm`, `${CRATE_NAME}.internal.js`]

  console.log('  ' + colors.yellow(`empty ${pathRel(targetDir)}`))
  await emptyDir(targetDir)

  for (const i of files) {
    const src = resolveFromRoot(PREP_DIR, i)
    const dest = path.join(targetDir, i)
    console.log(`  ${colors.yellow(`write ${pathRel(dest)}`)}`)
    await copy(src, dest)
  }
}

const args = parseArgs(Deno.args, {
  boolean: ['force'],
})

if (!args.force && (await checkBuildReady())) {
  $.logStep(`Skipping build step (override with ${colors.cyan('--force')})`)
} else {
  await buildWasm()
}
await copyOutputs()
