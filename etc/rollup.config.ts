import type { InputOption, OutputOptions, Plugin, RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import PluginDtsBase from 'rollup-plugin-dts'
import PluginReplace from '@rollup/plugin-replace'
import { glob } from 'zx'
import { match } from 'ts-pattern'
import path from 'path'
import fs from 'fs/promises'
import { pipe } from 'fp-ts/function'
import type { PackageAny } from './meta'
import { PACKAGES_TO_ROLLUP, loadProductionDependencies, packageEntry, packageRoot, scopePackage } from './meta'
import type { WasmPackTarget } from './meta-crypto'
import {
  INTERFACE_WRAP_PROXY_TO_WASM_PKG_ROLLUP_ID,
  IrohaCryptoTarget,
  WASM_PACK_OUT_NAME,
  WASM_PKG_ROLLUP_ID,
  wasmPackOutDirForTarget,
  wasmPkgWithTargetRollupId,
} from './meta-crypto'
import type { SetOptional } from 'type-fest'

function PluginDts() {
  return PluginDtsBase({ respectExternal: true })
}

function PluginReplaceVitest() {
  return PluginReplace({
    preventAssignment: true,
    values: {
      'import.meta.vitest': 'undefined',
    },
  })
}

function commonJsPlugins(): Plugin[] {
  return [PluginReplaceVitest()]
}

function output<T extends SetOptional<OutputOptions, 'format' | 'entryFileNames'>>(
  format: 'esm' | 'cjs' | 'types',
  dir: string,
  extension?: T,
) {
  const base = (
    format === 'types'
      ? { format: 'esm', dir }
      : { format, dir, entryFileNames: '[name].' + ({ esm: 'mjs', cjs: 'cjs' } as const)[format] }
  ) satisfies OutputOptions

  return {
    ...base,
    ...extension,
  }
}

function input(pkg: Exclude<PackageAny, 'client'>, kind: 'js' | 'dts'): InputOption {
  return {
    lib: packageEntry(pkg, kind),
  }
}

async function readWasmPkgAssets(target: WasmPackTarget): Promise<{ fileName: string; content: Buffer }[]> {
  return glob(path.join(wasmPackOutDirForTarget(target), '*')).then((files) =>
    Promise.all(
      files.map(async (fullFileName) => {
        const content = await fs.readFile(fullFileName)
        return {
          fileName: path.basename(fullFileName),
          content,
        }
      }),
    ),
  )
}

function PluginWasmPkg(target: WasmPackTarget, mode: 'types' | 'esm-reexport' | 'cjs-in-esm'): Plugin {
  const WASM_PKG_TARGET_ROLLUP_ID = wasmPkgWithTargetRollupId(target)
  const WASM_PKG_ASSETS_DIR = `wasm-pkg`
  const WASM_PKG_COPIED_ENTRY_EXTERNAL = `./${WASM_PKG_ASSETS_DIR}/${WASM_PACK_OUT_NAME}`

  return {
    name: `resolve-wasm-pkg-as-${mode}`,
    resolveId(id, importer) {
      if (id === INTERFACE_WRAP_PROXY_TO_WASM_PKG_ROLLUP_ID) return id
      if (id === WASM_PKG_ROLLUP_ID) return WASM_PKG_TARGET_ROLLUP_ID
      if (id === WASM_PKG_TARGET_ROLLUP_ID) return id
      if (id === WASM_PKG_COPIED_ENTRY_EXTERNAL && importer === WASM_PKG_TARGET_ROLLUP_ID) return { id, external: true }
      // in this mode, we import it to do `createRequire()`
      if (id === 'module' && mode === 'cjs-in-esm') return { id, external: true }
    },
    async load(id) {
      if (id === INTERFACE_WRAP_PROXY_TO_WASM_PKG_ROLLUP_ID) {
        return match(mode)
          .with('cjs-in-esm', () => `export { namespaceAsNamedExport as wasmPkg } from '${WASM_PKG_TARGET_ROLLUP_ID}'`)
          .with(
            'esm-reexport',
            'types',
            () => `import * as wasmPkg from '${WASM_PKG_TARGET_ROLLUP_ID}'\nexport { wasmPkg }`,
          )
          .exhaustive()
      }
      if (id === WASM_PKG_TARGET_ROLLUP_ID) {
        return match(mode)
          .with('types', () => {
            const id = path.join(wasmPackOutDirForTarget(target), WASM_PACK_OUT_NAME + `.d.ts`)
            let source = `export * from '${id}'\n`
            if (target === 'web') source += `export { default } from '${id}'\n`
            return source
          })
          .with('esm-reexport', 'cjs-in-esm', async (mode): Promise<string> => {
            const assets = await readWasmPkgAssets(target)

            for (const { fileName, content } of assets) {
              this.emitFile({
                type: 'asset',
                fileName: path.join(WASM_PKG_ASSETS_DIR, fileName),
                source: content,
              })
            }

            return match(mode)
              .with('esm-reexport', () => {
                let source = `export * from '${WASM_PKG_COPIED_ENTRY_EXTERNAL}'\n`
                if (target === 'web') source += `export { default } from '${WASM_PKG_COPIED_ENTRY_EXTERNAL}'\n`
                return source
              })
              .with(
                'cjs-in-esm',
                () =>
                  `import { createRequire } from 'module'\n` +
                  `const wasmPkg = createRequire(import.meta.url)('${WASM_PKG_COPIED_ENTRY_EXTERNAL}')\n` +
                  `export { wasmPkg as namespaceAsNamedExport }`,
              )
              .exhaustive()
          })
          .exhaustive()
      }
    },
  }
}

/**
 * Rollup plugin to redirect imports from `@iroha2/crypto-util` to `@iroha2/crypto-core`, since the core package
 * re-exports everything from the util one.
 */
function PluginRedirectCryptoUtilToCore(): Plugin {
  return {
    name: 'redirect-from-crypto-util-to-crypto-core',
    resolveId(id) {
      if (id === '@iroha2/crypto-util') return '@iroha2/crypto-core'
    },
  }
}

/**
 * By default, imports of `@iroha2/crypto-interface-wrap` will resolve to `src/main.ts`,
 * which is especially bad for types - declarations will contain actual TS code instead
 * of pure types.
 *
 * For consistency TS-compiled JavaScript is imported too
 */
function PluginResolveCryptoInterfaceWrapEntry(entry: 'types' | 'js'): Plugin {
  const PKG = 'crypto-interface-wrap' as const
  const resolveTo = packageEntry(PKG, ({ types: 'dts', js: 'js' } as const)[entry])
  const pkgFull = scopePackage(PKG)

  return {
    name: 'resolve-crypto-interface-wrap-entry',
    resolveId: (id) => {
      if (id === pkgFull) return resolveTo
    },
  }
}

async function* rollupCryptoTarget(
  target: IrohaCryptoTarget,
  ...formats: ('types' | 'esm' | 'cjs')[]
): AsyncGenerator<RollupOptions> {
  const pkg = `crypto-target-${target}` as const
  const dist = packageRoot(pkg, 'dist')
  const external = (await loadProductionDependencies(pkg)).toArray()

  for (const format of formats) {
    yield match(format)
      .with('types', (): RollupOptions => {
        return {
          input: input(pkg, 'dts'),
          external,
          plugins: [
            PluginResolveCryptoInterfaceWrapEntry('types'),
            PluginRedirectCryptoUtilToCore(),
            PluginWasmPkg(IrohaCryptoTarget.toWasmPackTarget(target), 'types'),
            PluginDts(),
          ],
          output: output('types', dist),
        }
      })
      .with('esm', 'cjs', (format): RollupOptions => {
        const isNodeEsm = target === 'node' && format === 'esm'

        return {
          input: input(pkg, 'js'),
          external,
          plugins: [
            PluginResolveCryptoInterfaceWrapEntry('js'),
            PluginRedirectCryptoUtilToCore(),
            PluginWasmPkg(IrohaCryptoTarget.toWasmPackTarget(target), isNodeEsm ? 'cjs-in-esm' : 'esm-reexport'),
            ...commonJsPlugins(),
          ],
          output: output(format, dist),
        }
      })
      .exhaustive()
  }
}

async function* generateRolls(): AsyncGenerator<RollupOptions> {
  for (const pkg of PACKAGES_TO_ROLLUP.toList().sort()) {
    yield* match<typeof pkg, AsyncGenerator<RollupOptions>>(pkg)
      .with('client', async function* (pkg) {
        const rootTsBuild = packageRoot(pkg, 'ts-build')
        const dist = packageRoot(pkg, 'dist')
        const external = (await loadProductionDependencies(pkg))
          .remove('json-bigint')
          .add('json-bigint/lib/parse.js')
          .add(scopePackage(pkg))
          .toArray()

        const ENTRIES = ['lib', 'web-socket/native', 'web-socket/node'] as const

        const entryInput = (entry: (typeof ENTRIES)[number], ext: 'js' | 'd.ts'): string =>
          path.join(rootTsBuild, `${entry}.${ext}`)

        yield {
          input: pipe(
            ENTRIES.map((x) => [x, entryInput(x, 'js')] as const),
            Object.fromEntries,
          ),
          external,
          plugins: commonJsPlugins(),
          output: [output('esm', dist), output('cjs', dist)],
        }

        yield {
          input: pipe(
            ENTRIES.map((x) => [x, entryInput(x, 'd.ts')] as const),
            Object.fromEntries,
          ),
          external,
          plugins: [PluginDts()],
          output: output('types', dist),
        }
      })
      .with('data-model', async function* (pkg) {
        const dist = packageRoot(pkg, 'dist')
        const external = (await loadProductionDependencies(pkg)).toArray()

        const preserveModulesOpts = { preserveModules: true, preserveModulesRoot: packageRoot(pkg, 'ts-build') }

        yield {
          input: input(pkg, 'js'),
          external,
          plugins: commonJsPlugins(),
          output: [output('esm', path.join(dist, 'esm'), preserveModulesOpts), output('cjs', path.join(dist, 'cjs'))],
        }

        yield {
          input: input(pkg, 'dts'),
          external,
          plugins: [PluginDts()],
          output: output('types', path.join(dist, 'types'), preserveModulesOpts),
        }
      })
      .with('i64-fixnum', 'crypto-util', async function* (pkg) {
        const dist = packageRoot(pkg, 'dist')
        const external = (await loadProductionDependencies(pkg)).toArray()

        yield {
          input: input(pkg, 'js'),
          external,
          plugins: commonJsPlugins(),
          output: [output('esm', dist), output('cjs', dist)],
        }

        yield {
          input: input(pkg, 'dts'),
          external,
          plugins: [PluginDts()],
          output: output('types', dist),
        }
      })
      .with('crypto-target-node', () => rollupCryptoTarget('node', 'types', 'esm', 'cjs'))
      .with('crypto-target-web', () => rollupCryptoTarget('web', 'types', 'esm'))
      .with('crypto-target-bundler', () => rollupCryptoTarget('bundler', 'types', 'esm'))
      .with('crypto-core', async function* (pkg) {
        const dist = packageRoot(pkg, 'dist')
        const external = (await loadProductionDependencies(pkg)).toArray()

        yield {
          input: input('crypto-core', 'js'),
          external,
          plugins: [PluginResolveCryptoInterfaceWrapEntry('js'), ...commonJsPlugins()],
          output: [output('esm', dist), output('cjs', dist)],
        }

        yield {
          input: input('crypto-core', 'dts'),
          external,
          plugins: [PluginResolveCryptoInterfaceWrapEntry('types'), PluginWasmPkg('nodejs', 'types'), PluginDts()],
          output: output('types', dist),
        }
      })
      .exhaustive()
  }
}

async function rolls(): Promise<RollupOptions[]> {
  const rolls = new Array<RollupOptions>()
  for await (const x of generateRolls()) rolls.push(x)
  return rolls
}

export default defineConfig(rolls)
