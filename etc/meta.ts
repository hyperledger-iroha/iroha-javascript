import path from 'path'
import type { PackageJson } from 'type-fest'
import { Set } from 'immutable'
import * as metaCrypto from './meta-crypto'
import { P, match } from 'ts-pattern'
import type { SetEntry } from './util'
import { resolve } from './util'

function predicateStartsWith<S extends string>(prefix: S): (x: string) => x is `${S}${string}` {
  return (x): x is `${S}` => x.startsWith(prefix)
}

function trimPrefixTypeSafe<Prefix extends string, T extends `${Prefix}${string}`>(
  value: T,
  prefix: Prefix,
): T extends `${Prefix}${infer V}` ? V : never {
  return value.slice(prefix.length) as any
}

export function packageRoot(pkg: PackageAny, kind: 'root' | 'ts-build' | 'dist' = 'root'): string {
  const root = match(pkg)
    .with('client', 'data-model', 'data-model-schema', 'i64-fixnum', (a) => resolve('packages', a))
    .with(P.when(predicateStartsWith('crypto-')), (a) =>
      resolve('packages/crypto/packages', trimPrefixTypeSafe(a, 'crypto-')),
    )
    .exhaustive()

  return match(kind)
    .with('root', () => root)
    .with('ts-build', () => path.join(root, 'dist-tsc'))
    .with('dist', () => path.join(root, 'dist'))
    .exhaustive()
}

export function packageEntry(pkg: Exclude<PackageAny, 'client'>, kind: 'dts' | 'js'): string {
  const root = packageRoot(pkg, 'ts-build')
  return path.join(root, 'lib' + ({ dts: '.d.ts', js: '.js' } as const)[kind])
}

/**
 * This function implements the important convention: production dependencies of the package, written in `package.json`,
 * are also its Rollup externals. It allows to avoid mismatch between dev and deploy (NPM-published) environment.
 */
export async function loadProductionDependencies(pkg: PackageToRollup): Promise<Set<string>> {
  const pathToPackageJson: string = path.join(packageRoot(pkg), 'package.json')
  const {
    default: { dependencies, peerDependencies },
  }: { default: PackageJson } = await import(pathToPackageJson, { with: { type: 'json' } })
  return Set(Object.keys({ ...dependencies, ...peerDependencies }))
}

export type PackageToRollup = SetEntry<typeof PACKAGES_TO_ROLLUP>

export const PACKAGES_TO_ROLLUP = metaCrypto.PACKAGES.merge(Set(['client', 'data-model', 'i64-fixnum'] as const))

export const PACKAGES_TO_BUILD_WITH_TSC = metaCrypto.PACKAGES.merge(PACKAGES_TO_ROLLUP)

export type PackageToBuildWithTsc = SetEntry<typeof PACKAGES_TO_BUILD_WITH_TSC>

export type PackageToPublish = SetEntry<typeof PACKAGES_TO_PUBLISH>

export const PACKAGES_TO_PUBLISH = PACKAGES_TO_ROLLUP.merge(Set(['data-model-schema'] as const))

export type PackageAny = PackageToRollup | PackageToPublish | metaCrypto.Package

export function scopePackage<T extends PackageAny>(name: T) {
  return `@iroha2/${name}` as const
}

export function artifactsToClean(): string[] {
  return ['**/dist', '**/dist-tsc']
}
