import { fs, path } from 'zx'
import { IROHA_DIR } from '../etc/meta'
import invariant from 'tiny-invariant'

export interface QueryImpl {
  query: string
  t: 'iter' | 'singular'
  output: string
}

const RUST_CODE = await fs.readFile(path.join(IROHA_DIR, 'data_model/src/query/mod.rs'), { encoding: 'utf-8' })

function parseItems(raw: string) {
  return raw
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
  ...parseItems(RUST_CODE.match(/^impl_iter_queries! {((?:.|\n)+?)}/m)![1]).map((x) => ({ ...x, t: 'iter' as const })),
  ...parseItems(RUST_CODE.match(/^impl_singular_queries! {((?:.|\n)+?)}/m)![1]).map((x) => ({
    ...x,
    t: 'singular' as const,
  })),
] satisfies QueryImpl[]
