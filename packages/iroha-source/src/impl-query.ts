import { fs, path } from 'zx'
import { IROHA_DIR } from '../etc/meta'
import invariant from 'tiny-invariant'

export interface QueryImpl {
  query: string
  t: 'iter' | 'singular'
  output: string
}

const RUST_CODE = await fs.readFile(path.join(IROHA_DIR, 'crates/iroha_data_model/src/query/mod.rs'), {
  encoding: 'utf-8',
})

function parseItems(raw: string, reg: RegExp) {
  const fragment = raw.match(reg)
  invariant(fragment, () => `failed to match ${reg}. Code: \n\n${raw}`)

  return fragment[1]
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => !!x)
    .map((x) => {
      const match = x.match(/^(\w+) => (.+),$/)
      invariant(match)
      const [, query, output] = match
      return { query, output }
    })
}

export default [
  ...parseItems(RUST_CODE, /^impl_iter_queries! {((?:.|\n)+?)}/m).map((x) => ({ ...x, t: 'iter' as const })),
  ...parseItems(RUST_CODE, /^impl_singular_queries! {((?:.|\n)+?)}/m).map((x) => ({
    ...x,
    t: 'singular' as const,
  })),
] satisfies QueryImpl[]
