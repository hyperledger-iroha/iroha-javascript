import { parseArgs } from 'jsr:@std/cli/parse-args'
import { resolveFromRoot } from './util.ts'
import { match, P } from 'ts-pattern'
import * as path from 'jsr:@std/path'
import * as colors from 'jsr:@std/fmt/colors'
import $ from 'jsr:@david/dax'
import { assert } from '@std/assert'
import { emptyDir } from 'jsr:@std/fs'

const TARGET_DIR = resolveFromRoot('.iroha')

async function isDirReady() {
  try {
    await Deno.stat(TARGET_DIR)
    return true
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false
    } else throw err
  }
}

async function assertDirIsReady() {
  assert(await isDirReady(), 'Iroha is not ready; make sure tu run "deno task prep:iroha" first.')
}

async function clean() {
  await emptyDir(TARGET_DIR)
}

async function linkPath(target: string) {
  await clean()

  const full = path.resolve(target)
  await Deno.symlink(full, TARGET_DIR)

  $.logStep(`Linked ${TARGET_DIR} -> ${full}`)
}

async function cloneRepo(repo: string, tagOrRevision: string) {
  await clean()

  $.logStep(`Cloning repo ${colors.blue(repo)} at revision ${colors.yellow(tagOrRevision)}`)
  await $`git init --quiet`.cwd(TARGET_DIR)
  await $`git remote add origin ${repo}`.cwd(TARGET_DIR)
  await $`git fetch origin ${tagOrRevision}`.cwd(TARGET_DIR)
  await $`git reset --hard FETCH_HEAD`.cwd(TARGET_DIR)

  $.logStep('Finished cloning repo')
}

async function buildBinaries() {
  await assertDirIsReady()
  const binaries = ['irohad', 'iroha_kagami', 'iroha_codec']
  $.logStep('Building binaries:', binaries)
  const args = binaries.map((x) => ['-p', x])
  await $`cargo build --release ${args}`.cwd(TARGET_DIR)
  $.logStep('Finished building binaries')
}

async function buildWasms() {
  await assertDirIsReady()
  $.logStep('Building lib wasms')
  await $`/bin/bash ./scripts/build_wasm.sh libs`.cwd(TARGET_DIR)
  $.logStep('Finished building WASMs')
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
    if (await isDirReady()) {
      $.logStep(`${TARGET_DIR} exists`)
    } else {
      $.logError(
        `${TARGET_DIR} doesn't exist. Make sure to run ${colors.bold(colors.cyan('deno task prep:iroha'))} first`,
      )
      Deno.exit(1)
    }
  })
  .with({ build: true }, async () => {
    await buildBinaries()
    await buildWasms()
  })
  .otherwise(() => {
    $.logError('Bad CLI args')
    Deno.exit(1)
  })
