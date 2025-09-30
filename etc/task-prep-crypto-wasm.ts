import { parseArgs } from '@std/cli'
import * as path from '@std/path'
import $ from '@david/dax'
import * as colors from '@std/fmt/colors'
import { pathRel, resolveFromRoot } from './util.ts'
import { copy, emptyDir } from '@std/fs'
import { assert } from '@std/assert/assert'
import { assertEquals } from '@std/assert/equals'

const PROJECT_DIR = resolveFromRoot('crypto-wasm')
const PREP_DIR = resolveFromRoot('prep/crypto-wasm')
console.log(PROJECT_DIR)
const CRATE_NAME = 'iroha_crypto_wasm'

const GENERATED_FILES = new Set([`.d.ts`, '.internal.js', '.js'].map((x) => `${CRATE_NAME}${x}`))

async function buildWasm() {
  const outDir = PREP_DIR
  console.log('  ' + colors.yellow(`empty ${pathRel(PREP_DIR)}`))
  await emptyDir(PREP_DIR)

  $.logStep(`Building with @deno/wasmbuild...`)
  await $`deno run -A jsr:@deno/wasmbuild@0.19.1 --out ${outDir} --inline`.cwd(PROJECT_DIR)
  console.log(`  ${colors.yellow(`write ${pathRel(outDir)}`)}`)
}

async function checkBuildReady() {
  try {
    const files = new Set<string>()
    for await (const i of Deno.readDir(PREP_DIR)) {
      assert(i.isFile)
      files.add(i.name)
    }
    assertEquals(files, GENERATED_FILES)
    return true
  } catch (err) {
    $.logWarn('Error while checking build artifacts:', err)
    return false
  }
}

function patchWasmJsWrapCode(code: string): string {
  return code.replace(/(__wbg_set_wasm\(wasm.exports\))/, '$1\nwasm.exports.__wbindgen_start()')
}

async function patchWasmJsWrap(file: string) {
  const content = await Deno.readTextFile(file)
  const patched = patchWasmJsWrapCode(content)
  await Deno.writeTextFile(file, patched)
}

async function copyOutputs() {
  const targetDir = resolveFromRoot('packages/core/crypto/wasm')

  console.log('  ' + colors.yellow(`empty ${pathRel(targetDir)}`))
  await emptyDir(targetDir)

  for (const i of GENERATED_FILES) {
    const src = resolveFromRoot(PREP_DIR, i)
    const dest = path.join(targetDir, i)
    console.log(`  ${colors.yellow(`write ${pathRel(dest)}`)}`)
    await copy(src, dest)
  }

  // https://github.com/denoland/wasmbuild/issues/156
  await patchWasmJsWrap(path.join(targetDir, `${CRATE_NAME}.js`))
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
