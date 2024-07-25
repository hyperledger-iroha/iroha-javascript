import 'jake'
import del from 'del'
import { $, cd } from 'zx'
import path from 'path'
import { ROOT, preserveCwd, reportDeleted } from './util'
import { PACKAGES_TO_BUILD_WITH_TSC, PACKAGES_TO_PUBLISH, artifactsToClean, packageRoot, scopePackage } from './meta'
import { WASM_PACK_CRATE_DIR, WASM_PACK_OUT_NAME, WASM_PACK_TARGETS, wasmPackOutDirForTarget } from './meta-crypto'

desc('Clean all build artifacts')
task('clean', async () => {
  const deleted = await del(artifactsToClean())
  reportDeleted(deleted)
})

namespace('crypto-wasm', () => {
  task('clean-wasm-pkgs', async () => {
    const deleted = await del(WASM_PACK_TARGETS.map((a) => wasmPackOutDirForTarget(a)).toArray())
    reportDeleted(deleted)
  })

  task('cargo-test', async () => {
    await preserveCwd(async () => {
      cd(WASM_PACK_CRATE_DIR)
      await $`cargo test`
    })
  })

  task('build-targets', async () => {
    await preserveCwd(async () => {
      cd(WASM_PACK_CRATE_DIR)

      for (const target of WASM_PACK_TARGETS) {
        const outDir = wasmPackOutDirForTarget(target)
        await $`wasm-pack build --target ${target} --out-dir ${outDir} --out-name ${WASM_PACK_OUT_NAME}`
      }
    })
  })

  task('keep-only-necessary', async () => {
    function* patterns() {
      for (const target of WASM_PACK_TARGETS) {
        const root = wasmPackOutDirForTarget(target)
        yield path.join(root, '*')
        yield path.join(root, '.*') // hidden files
        yield '!' + path.join(root, WASM_PACK_OUT_NAME + '{.js,.d.ts,_bg.wasm,_bg.js,_bg.wasm.d.ts}')
      }
    }

    const deleted = await del([...patterns()])
    reportDeleted(deleted)
  })

  desc('Rebuild')
  task('rebuild', ['clean-wasm-pkgs', 'cargo-test', 'build-targets', 'keep-only-necessary'])
})

namespace('build', () => {
  desc('Build TypeScript of the whole project and put corresponding artifacts near the packages')
  task('tsc', ['clean', 'prepare:all'], async () => {
    await $`pnpm tsc`

    for (const pkg of PACKAGES_TO_BUILD_WITH_TSC) {
      const root = path.relative(ROOT, packageRoot(pkg))
      const tsEmitRoot = path.join('dist-tsc', root)

      await $`mv ${path.join(tsEmitRoot, 'src')} ${path.join(root, 'dist-tsc')}`
    }
  })

  desc('Rollup')
  task('rollup', ['build:tsc'], async () => {
    await $`pnpm rollup`
  })

  desc('Run TypeScript Compiler and Rollup')
  task('all', ['build:rollup'])
})

namespace('test', () => {
  task('unit', ['prepare:all'], async () => {
    await $`pnpm vitest run`
  })

  task('crypto', ['build:all'], async () => {
    await $`pnpm --filter monorepo-crypto test:integration`
  })

  task('prepare-client-integration', ['build:all'])

  task('client-integration', ['prepare-client-integration'], async () => {
    await $`pnpm --filter client test:integration`
  })

  desc('Run all tests')
  task('all', ['test:unit', 'test:crypto', 'test:client-integration'])
})

desc('Perform type checking in the whole repo')
task('type-check', ['prepare:all'], async () => {
  await $`pnpm tsc --noEmit`
})

task('lint', async () => {
  await $`pnpm lint`
})

desc('Performs all kinds of checks from artifacts compilation and linting to end-2-end tests')
task('run-all-checks', ['lint', 'build:all', 'test:all'])

desc('Publish all public packages')
task('publish-all', ['run-all-checks', 'build:all'], async () => {
  const filters = PACKAGES_TO_PUBLISH.toSeq()
    .map(scopePackage)
    .flatMap((x) => [`--filter`, x])
    .toArray()

  await $`pnpm ${filters} publish`
})
