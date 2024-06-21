import path from 'path'
import { Set } from 'immutable'
import type { SetEntry } from './util'
import { resolve } from './util'

export const CRYPTO_MONOREPO_ROOT = resolve('packages/crypto')
const resolveRelativeToCryptoMonorepoRoot = (...paths: string[]) => path.resolve(CRYPTO_MONOREPO_ROOT, ...paths)

export const IROHA_CRYPTO_TARGETS = Set(['web', 'node', 'bundler'] as const)

export type IrohaCryptoTarget = SetEntry<typeof IROHA_CRYPTO_TARGETS>

export const IrohaCryptoTarget = {
  toWasmPackTarget(target: IrohaCryptoTarget): WasmPackTarget {
    if (target === 'node') return 'nodejs'
    return target
  },
}

export const WASM_PACK_TARGETS = Set(['web', 'nodejs', 'bundler'] as const)

export type WasmPackTarget = SetEntry<typeof WASM_PACK_TARGETS>

export const PACKAGES_TO_ROLLUP = Set(['core', 'util'] as const)
  .merge(IROHA_CRYPTO_TARGETS.map((a) => `target-${a}` as const))
  .map((a) => `crypto-${a}` as const)

export type PackageToRollup = SetEntry<typeof PACKAGES_TO_ROLLUP>

export const PACKAGES_TO_BUILD_WITH_TSC = PACKAGES_TO_ROLLUP.merge(Set(['crypto-interface-wrap'] as const))

export type PackageToBuildWithTsc = SetEntry<typeof PACKAGES_TO_BUILD_WITH_TSC>

export const WASM_PACK_CRATE_DIR = resolveRelativeToCryptoMonorepoRoot('crypto-rs')

export function wasmPackOutDirForTarget(target: WasmPackTarget): string {
  return path.resolve(WASM_PACK_CRATE_DIR, `wasm-pkg-${target}`)
}

export const WASM_PACK_OUT_NAME = 'iroha_crypto'

export const WASM_PKG_ROLLUP_ID = `@iroha2/crypto/~wasm-pkg`

export function wasmPkgWithTargetRollupId(target: WasmPackTarget) {
  return `${WASM_PKG_ROLLUP_ID}/${target}` as const
}

export const INTERFACE_WRAP_PROXY_TO_WASM_PKG_ROLLUP_ID = '@iroha2/crypto-interface-wrap/~wasm-pack-proxy'
