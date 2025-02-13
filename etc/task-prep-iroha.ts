import { parseArgs } from 'jsr:@std/cli/parse-args'
import { resolveFromRoot } from './util.ts'
import { match, P } from 'ts-pattern'
import * as path from 'jsr:@std/path'
import * as colors from 'jsr:@std/fmt/colors'
import $ from 'jsr:@david/dax'
import { assert } from '@std/assert'
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
  assert(await dirExists(IROHA_REPO_DIR), 'Iroha repo is not ready; make sure to run "deno task prep:iroha" first.')
}

async function clean() {
  await emptyDir(IROHA_REPO_DIR)
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

  $.logStep('Finished cloning repo')
}

async function buildBinaries() {
  await assertRepoIsReady()
  const binaries = ['irohad', 'iroha_kagami', 'iroha_codec']
  $.logStep('Building binaries:', binaries)
  const args = binaries.map((x) => ['-p', x])
  await $`cargo build --release ${args}`.cwd(IROHA_REPO_DIR)
  $.logStep('Finished building binaries')
}

async function buildWasms() {
  await assertRepoIsReady()
  $.logStep('Building lib wasms')
  await $`/bin/bash ./scripts/build_wasm.sh libs`.cwd(IROHA_REPO_DIR)
  $.logStep('Finished building WASMs')
}

async function copyArtifacts() {
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
    await copy(path.join(IROHA_REPO_DIR, artifactPath), path.join(PREP_OUTPUT_DIR, '/', path.basename(artifactPath)))
  }
  $.logStep(`Finished copying artifacts to ${colors.bold(colors.cyan(PREP_OUTPUT_DIR))}`)
}

async function copySchemaJson() {
  const dest = resolveFromRoot('packages/core/data-model/schema/schema.json')

  try {
    await Deno.remove(dest)
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) {
      throw err
    }
  }

  await copy(path.join(PREP_OUTPUT_DIR, 'schema.json'), dest)
  $.logStep('Copied', dest)
}

const args = parseArgs(Deno.args, {
  string: ['git', 'git-rev', 'path'],
  boolean: ['check', 'build'],
})

await match(args)
  .with(
    { git: P.string, 'git-rev': P.string },
    async ({ git: repo, 'git-rev': tagOrRevision }) => {
      await cloneRepo(repo, tagOrRevision)
    },
  )
  .with({ path: P.string }, async ({ path }) => {
    await linkPath(path)
  })
  .with({ check: true }, async () => {
    if (await dirExists(PREP_OUTPUT_DIR)) {
      $.logStep(`Checked that ${colors.cyan(PREP_OUTPUT_DIR)} exists`)
      await copySchemaJson()
    } else {
      $.logError(
        `Error: ${PREP_OUTPUT_DIR} doesn't exist. Make sure to run ${
          colors.bold(colors.magenta('deno task prep:iroha:build'))
        } first`,
      )
      Deno.exit(1)
    }
  })
  .with({ build: true }, async () => {
    await buildBinaries()
    await buildWasms()
    await copyArtifacts()
  })
  .otherwise(() => {
    $.logError('Bad CLI args')
    Deno.exit(1)
  })
