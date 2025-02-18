import { parseArgs } from 'jsr:@std/cli'
import * as path from 'jsr:@std/path'
import $ from 'jsr:@david/dax'
import * as colors from '@std/fmt/colors'
import { pathRel, resolveFromRoot } from './util.ts'
import { copy, emptyDir } from 'jsr:@std/fs'

const PROJECT_DIR = resolveFromRoot('crypto-wasm')
const PREP_DIR = resolveFromRoot('prep/crypto-wasm')
console.log(PROJECT_DIR)
const CRATE_NAME = 'iroha_crypto_wasm'

async function buildWasm() {
  const outDir = PREP_DIR
  // TODO: empty dir?

  $.logStep(`Running @deno/wasmbuild...`)
  await $`deno run -A jsr:@deno/wasmbuild --out ${outDir}`.cwd(PROJECT_DIR)
  console.log(`  ${colors.yellow(`wasmbuild ready at ${pathRel(outDir)}`)}'`)
}

async function copyOutputs() {
  const targetDir = resolveFromRoot('packages/core/crypto/wasm')
  const files = [`${CRATE_NAME}.d.ts`, `${CRATE_NAME}.wasm`, `${CRATE_NAME}.internal.js`]

  await emptyDir(targetDir)

  for (const i of files) {
    const src = resolveFromRoot(PREP_DIR, i)
    const dest = path.join(targetDir, i)
    console.log(`  ${colors.yellow(`write ${pathRel(dest)}`)}`)
    try {
      await copy(src, dest)
    } catch (err) {
      $.logError(`Failed to copy. Is ${PREP_DIR} ready?`)
      throw err
    }
  }
}

const args = parseArgs(Deno.args, {
  boolean: ['copy'],
})

if (!args.copy) {
  await buildWasm()
}
await copyOutputs()
