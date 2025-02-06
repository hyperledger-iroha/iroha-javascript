import 'jake'
import { deleteAsync as del } from 'del'
import { $, cd } from 'zx'
import path from 'node:path'
import { preserveCwd, reportDeleted, resolve, ROOT } from './util.ts'
import { artifactsToClean, packageRoot, PACKAGES_TO_BUILD_WITH_TSC, PACKAGES_TO_PUBLISH, scopePackage } from './meta.ts'
import {
  IROHA_CRYPTO_TARGETS,
  IrohaCryptoTarget,
  WASM_PACK_CRATE_DIR,
  WASM_PACK_OUT_NAME,
  WASM_PACK_TARGETS,
} from './meta-crypto.ts'
// import fs from 'node:fs/promises'

desc('Clean all build artifacts')
task('clean', async () => {
  const deleted = await del(artifactsToClean())
  reportDeleted(deleted)
})

desc('Necessary preparations before most of the tasks')
task('build-iroha-binaries', async () => {
  await $`pnpm --filter iroha-source build-all-binaries`
})

namespace('crypto-wasm', () => {
  // // task('clean-wasm-pkgs', async () => {
  // //   const deleted = await del(WASM_PACK_TARGETS.map((a) => wasmPackOutDirForTarget(a)).toArray())
  // //   reportDeleted(deleted)
  // })

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
        const outDir = resolve(`crypto-wasm/target/pkg-${target}`)
        // const outDir = wasmPackOutDirForTarget(target)
        await $`wasm-pack build --target ${target} --out-dir ${outDir} --out-name ${WASM_PACK_OUT_NAME}`
      }
    })
  })

  task('copy-targets', async () => {
    for (const target of IROHA_CRYPTO_TARGETS) {
      const wasmTarget = IrohaCryptoTarget.toWasmPackTarget(target)
      const wasmOutDir = resolve(`crypto-wasm/target/pkg-${wasmTarget}`)
      const packageOutDir = resolve(
        `packages/crypto-target-${target}/src/wasm-target/`,
      )

      await Deno.mkdir(packageOutDir, { recursive: true })
      await $`cp ${wasmOutDir}/iroha_crypto* ${packageOutDir}`
      if (wasmTarget === 'nodejs') {
        // to make it work in Deno, need to add `commonjs` type
        await Deno.writeTextFile(
          path.join(packageOutDir, 'package.json'),
          JSON.stringify({ type: 'commonjs' }),
        )
      }
    }

    await Deno.mkdir(resolve('packages/crypto-core/src/wasm-target'), {
      recursive: true,
    })
    const wasmPkgDeclaration = resolve(
      'crypto-wasm/target/pkg-nodejs/iroha_crypto.d.ts',
    )
    await $`cp ${wasmPkgDeclaration} ${resolve(`packages/crypto/src/wasm-target/wasm-pkg.d.ts`)}`
  })

  desc('Build')
  task('build', [
    'clean',
    // "cargo-test",
    'build-targets',
    'copy-targets',
  ])
})

namespace('build', () => {
  desc(
    'Build TypeScript of the whole project and put corresponding artifacts near the packages',
  )
  task('tsc', ['clean'], async () => {
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
  task('unit', ['build-iroha-binaries'], async () => {
    await $`pnpm vitest run`
  })

  // task('crypto', ['build:all'], async () => {
  //   await $`pnpm --filter monorepo-crypto test:integration`
  // })

  task('prepare-client-integration', ['build-iroha-binaries', 'build:all'])

  task('client-integration', ['prepare-client-integration'], async () => {
    await $`pnpm --filter client test:integration`
  })

  desc('Run all tests')
  task('all', ['test:unit', 'test:crypto', 'test:client-integration'])
})

task('lint', async () => {
  await $`pnpm lint`
})

desc(
  'Performs all kinds of checks from artifacts compilation and linting to end-2-end tests',
)
task('run-all-checks', ['lint', 'build:all', 'test:all'])

desc('Publish all public packages')
task('publish-all', ['run-all-checks', 'build:all'], async () => {
  const filters = PACKAGES_TO_PUBLISH.toSeq()
    .map(scopePackage)
    .flatMap((x) => [`--filter`, x])
    .toArray()

  await $`pnpm ${filters} publish --no-git-checks`
})
