import { parseArgs } from 'jsr:@std/cli'
import * as path from 'jsr:@std/path'
import $ from 'jsr:@david/dax'
import * as colors from '@std/fmt/colors'
import { glob, resolveFromRoot } from './util.ts'

function wasmPackOutDir(target: 'node' | 'web') {
  return resolveFromRoot(`crypto-wasm/target/pkg-${target}`)
}

async function buildCryptoWasm(opts?: { wasmPack?: boolean }) {
  const wasmPackOutName = 'iroha_crypto'

  if (opts?.wasmPack ?? true) {
    for (const target of ['node', 'web'] as const) {
      const wasmPackTarget = target === 'node' ? 'nodejs' : 'web'

      $.logStep(`Running wasm-pack (could be disabled with ${colors.bold('--wasm-pack=false')})`)
      await $`wasm-pack build --target ${wasmPackTarget} --out-dir ${
        wasmPackOutDir(target)
      } --out-name ${wasmPackOutName}`.cwd(
        resolveFromRoot('crypto-wasm'),
      )
    }
  }

  for (const target of ['node', 'web'] as const) {
    const copyToDir = resolveFromRoot(`packages/crypto-target-${target}/src/wasm-target`)
    await Deno.remove(copyToDir, { recursive: true })
    await Deno.mkdir(copyToDir)
    const copyGlob = await glob(path.join(wasmPackOutDir(target), `${wasmPackOutName}*`))
    await $`cp ${copyGlob} ${copyToDir}`
    if (target === 'node') {
      await Deno.writeTextFile(
        path.join(copyToDir, 'package.json'),
        JSON.stringify({ type: 'commonjs' }),
      )
    }
  }

  const copyToDir = resolveFromRoot(`packages/crypto/src/wasm-target`)
  await Deno.remove(copyToDir, { recursive: true })
  await Deno.mkdir(copyToDir)
  const dts = path.join(wasmPackOutDir('node'), `${wasmPackOutName}.d.ts`)
  await $`cp ${dts} ${copyToDir}/wasm-pkg.d.ts`
  $.logStep('Copied artifacts to @iroha2/crypto* packages')
}

const args = parseArgs(Deno.args, {
  boolean: ['wasm-pack'],
  default: { 'wasm-pack': true },
})

await buildCryptoWasm({ wasmPack: args['wasm-pack'] })
