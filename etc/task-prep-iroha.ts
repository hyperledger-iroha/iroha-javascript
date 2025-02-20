import { parseArgs } from 'jsr:@std/cli/parse-args'
import { pathRel, resolveFromRoot } from './util.ts'
import * as path from 'jsr:@std/path'
import * as colors from 'jsr:@std/fmt/colors'
import $ from 'jsr:@david/dax'
import { assert, assertEquals } from '@std/assert'
import { copy, emptyDir } from 'jsr:@std/fs'

const IROHA_REPO_DIR = resolveFromRoot('.iroha')
const PREP_OUTPUT_DIR = resolveFromRoot('prep/iroha')

async function dirExists(dir: string) {
  try {
    await Deno.stat(dir)
    return true
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false
    } else throw err
  }
}

async function assertRepoIsReady() {
  if (await dirExists(IROHA_REPO_DIR)) return

  $.logError('Cannot find Iroha repository')
  const cmd = `deno task prep:iroha`
  console.log(`You shall link it first by either
  ${
    colors.magenta(
      cmd + colors.bold(` --git ${colors.gray('<git repo>')} --git-rev ${colors.gray('<tag/branch/revision>')}`),
    )
  }
or
  ${colors.magenta(cmd + colors.bold(` --path ${colors.gray('<path to local iroha clone>')}`))}`)

  Deno.exit(1)
}

async function clean() {
  console.log('  ' + colors.yellow(`remove ${pathRel(IROHA_REPO_DIR)}`))
  try {
    await Deno.remove(IROHA_REPO_DIR, { recursive: true })
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err
  }
}

async function linkPath(target: string) {
  await clean()

  const full = path.resolve(target)
  await Deno.symlink(full, IROHA_REPO_DIR)

  $.logStep(`Linked ${IROHA_REPO_DIR} -> ${full}`)
}

async function cloneRepo(repo: string, tagOrRevision: string) {
  await clean()

  $.logStep(`Cloning repo ${colors.blue(repo)} at revision ${colors.yellow(tagOrRevision)}`)
  await $`git init --quiet`.cwd(IROHA_REPO_DIR)
  await $`git remote add origin ${repo}`.cwd(IROHA_REPO_DIR)
  await $`git fetch origin ${tagOrRevision}`.cwd(IROHA_REPO_DIR)
  await $`git reset --hard FETCH_HEAD`.cwd(IROHA_REPO_DIR)

  $.logStep('Cloned repo')
}

async function buildBinaries() {
  const binaries = ['irohad', 'iroha_kagami', 'iroha_codec']
  $.logStep('Building binaries:', binaries)
  const args = binaries.map((x) => ['-p', x])
  await $`cargo build --release ${args}`.cwd(IROHA_REPO_DIR)
  $.logStep('Finished building binaries')
}

async function buildWasmLibs() {
  $.logStep('Building WASM libs')
  await $`/bin/bash ./scripts/build_wasm.sh libs`.cwd(IROHA_REPO_DIR)
  $.logStep('Finished WASM libs')
}

async function copySchemaJson() {
  const dest = resolveFromRoot('packages/core/data-model/schema/schema.json')
  console.log('  ' + colors.yellow(`write ${pathRel(dest)}`))
  await copy(path.join(PREP_OUTPUT_DIR, 'schema.json'), dest, { overwrite: true })
}

async function copyArtifacts() {
  console.log(`  ${colors.yellow(`empty ${pathRel(PREP_OUTPUT_DIR)}`)}`)
  await emptyDir(PREP_OUTPUT_DIR)

  for (
    const artifactPath of [
      'target/release/irohad',
      'target/release/iroha_codec',
      'target/release/kagami',
      'defaults/executor.wasm',
      'docs/source/references/schema.json',
    ]
  ) {
    const out = path.join(PREP_OUTPUT_DIR, '/', path.basename(artifactPath))
    console.log(`  ` + colors.yellow(`write ${pathRel(out)}`))
    await copy(path.join(IROHA_REPO_DIR, artifactPath), out)
  }

  await copySchemaJson()
}

async function artifactsReady(): Promise<boolean> {
  try {
    const files = new Set<string>()
    for await (const i of Deno.readDir(PREP_OUTPUT_DIR)) {
      assert(i.isFile)
      files.add(path.basename(i.name))
    }
    assertEquals(
      files,
      new Set(['irohad', 'iroha_codec', 'kagami', 'executor.wasm', 'schema.json']),
      'all artifacts must be present',
    )
    return true
  } catch (error) {
    $.logWarn('Error while checking artifacts:', error)
    return false
  }
}

const args = parseArgs(Deno.args, {
  string: ['git', 'git-rev', 'path'],
  boolean: ['force'],
})

if (args.git) {
  assert(args['git-rev'], '--git requires --git-rev')
  assert(!args.path, 'either --git or --path, not both')
  await cloneRepo(args.git, args['git-rev'])
} else if (args.path) {
  assert(!args.git && !args['git-rev'], `--path conflicts with --git and --git-rev`)
  await linkPath(args.path)
} else {
  await assertRepoIsReady()
}

if (!args.force && (await artifactsReady())) {
  $.logStep(`Skipping build step (override with ${colors.cyan('--force')})`)
} else {
  await buildBinaries()
  await buildWasmLibs()
}

await copyArtifacts()
