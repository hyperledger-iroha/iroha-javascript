import type { InputOption, OutputOptions, Plugin, PluginContext, RollupOptions } from 'rollup'
import { defineConfig } from 'rollup'
import PluginDtsBase from 'rollup-plugin-dts'
import PluginReplace from '@rollup/plugin-replace'
import { glob } from 'zx'
import { P, match } from 'ts-pattern'
import path from 'path'
import fs from 'fs/promises'
import { pipe } from 'fp-ts/function'
import type { PackageAny } from './meta'
import { PACKAGES_TO_ROLLUP, loadProductionDependencies, packageEntry, packageRoot, scopePackage } from './meta'
import type { WasmPackTarget } from './meta-crypto'
import {
  IrohaCryptoTarget,
  WASM_PACK_OUT_NAME,
  wasmPackOutDirForTarget,
  type Package as CryptoPackage,
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

/**
 * Virtual `@iroha2/crypto-{...}/~rollup-wasm` import
 * @param target
 * @param mode
 * @returns
 */
function PluginRollupCryptoWasm(
  params:
    | { importer: 'core'; format: 'types' }
    | ({ importer: 'target' } & (
        | { target: 'node'; format: 'cjs' }
        | { target: IrohaCryptoTarget; format: 'esm' | 'types' }
      )),
): Plugin {
  const packageName = match(params)
    .returnType<CryptoPackage>()
    .with({ importer: 'core' }, () => `crypto-core`)
    .with({ importer: 'target' }, ({ target }) => `crypto-target-${target}`)
    .exhaustive()
  const MODULE_NAME = `@iroha2/${packageName}/~rollup-wasm`
  const WASM_PKG_ASSETS_DIR = `wasm-pkg`
  const WASM_PKG_COPIED_ENTRY_EXTERNAL = `./${WASM_PKG_ASSETS_DIR}/${WASM_PACK_OUT_NAME}`

  async function emitWasmAssets(ctx: PluginContext, target: WasmPackTarget) {
    const assets = await readWasmPkgAssets(target)

    for (const { fileName, content } of assets) {
      ctx.emitFile({
        type: 'asset',
        fileName: path.join(WASM_PKG_ASSETS_DIR, fileName),
        source: content,
      })
    }
  }

  return match(params)
    .returnType<Plugin>()
    .with({ format: 'types' }, (params) => {
      const typesSourceTarget = match(params)
        .returnType<WasmPackTarget>()
        .with({ importer: 'core' }, () => 'nodejs')
        .otherwise(({ target }) => IrohaCryptoTarget.toWasmPackTarget(target))
      const typesSource = path.join(wasmPackOutDirForTarget(typesSourceTarget), WASM_PACK_OUT_NAME + `.d.ts`)
      const reexportDefault: boolean = params.importer === 'target' && params.target === 'web'

      const loadedModule =
        `export * as wasmPkg from '${typesSource}'\n` +
        (reexportDefault ? `export { default as init } from '${typesSource}'` : '')

      return {
        name:
          'resolve-wasm-types-for-' +
          match(params)
            .with({ importer: 'core' }, () => `core`)
            .otherwise(({ target }) => `target-${target}`),
        resolveId(id) {
          if (id === MODULE_NAME) return id
        },
        load(id) {
          if (id === MODULE_NAME) return loadedModule
        },
      }
    })
    .with({ format: 'esm', target: 'node' }, () => {
      const loadedModule =
        `import { createRequire } from 'module'\n` +
        `export const wasmPkg = createRequire(import.meta.url)('${WASM_PKG_COPIED_ENTRY_EXTERNAL}')`

      return {
        name: `resolve-wasm-cjs-to-esm-for-node`,
        resolveId(id, importer) {
          if (MODULE_NAME === id) return id
          if (MODULE_NAME === importer && WASM_PKG_COPIED_ENTRY_EXTERNAL === id) return { id, external: true }
          if (id === 'module') return { id, external: true }
        },
        async load(id) {
          if (id === MODULE_NAME) {
            await emitWasmAssets(this, 'nodejs')
            return loadedModule
          }
        },
      }
    })
    .with({ format: P.union('esm', 'cjs') }, ({ target }) => {
      return {
        name: `resolve-wasm-uni-for-${target}`,
        resolveId(id, importer) {
          if (MODULE_NAME === id) return id
          if (MODULE_NAME === importer && WASM_PKG_COPIED_ENTRY_EXTERNAL === id) return { id, external: true }
        },
        async load(id) {
          if (id === MODULE_NAME) {
            await emitWasmAssets(this, IrohaCryptoTarget.toWasmPackTarget(target))
            return (
              `export * as wasmPkg from '${WASM_PKG_COPIED_ENTRY_EXTERNAL}'\n` +
              (target === 'web' ? `export { default as init } from '${WASM_PKG_COPIED_ENTRY_EXTERNAL}'` : '')
            )
          }
        },
      }
    })
    .exhaustive()
}

async function rollupCryptoTarget(
  params: { target: 'node'; format: 'cjs' } | { target: IrohaCryptoTarget; format: 'esm' | 'types' },
): Promise<RollupOptions> {
  const pkg = `crypto-target-${params.target}` as const
  const dist = packageRoot(pkg, 'dist')
  const external = (await loadProductionDependencies(pkg)).toArray()

  return match(params.format)
    .with('types', (): RollupOptions => {
      return {
        input: input(pkg, 'dts'),
        external,
        plugins: [PluginRollupCryptoWasm({ importer: 'target', target: params.target, format: 'types' }), PluginDts()],
        output: output('types', dist),
      }
    })
    .with('esm', 'cjs', (format): RollupOptions => {
      return {
        input: input(pkg, 'js'),
        external,
        plugins: [PluginRollupCryptoWasm({ importer: 'target', ...params }), ...commonJsPlugins()],
        output: output(format, dist),
      }
    })
    .exhaustive()
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
      .with('crypto-target-node', async function* () {
        yield rollupCryptoTarget({ target: 'node', format: 'cjs' })
        yield rollupCryptoTarget({ target: 'node', format: 'esm' })
        yield rollupCryptoTarget({ target: 'node', format: 'types' })
      })
      .with('crypto-target-web', async function* () {
        yield rollupCryptoTarget({ target: 'web', format: 'esm' })
        yield rollupCryptoTarget({ target: 'web', format: 'types' })
      })
      .with('crypto-target-bundler', async function* () {
        yield rollupCryptoTarget({ target: 'bundler', format: 'esm' })
        yield rollupCryptoTarget({ target: 'bundler', format: 'types' })
      })
      .with('crypto-core', async function* (pkg) {
        const dist = packageRoot(pkg, 'dist')
        const external = (await loadProductionDependencies(pkg)).toArray()

        yield {
          input: input('crypto-core', 'js'),
          external,
          plugins: commonJsPlugins(),
          output: [output('esm', dist), output('cjs', dist)],
        }

        yield {
          input: input('crypto-core', 'dts'),
          external,
          plugins: [PluginRollupCryptoWasm({ importer: 'core', format: 'types' }), PluginDts()],
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
