import $ from 'jsr:@david/dax'
import { resolveFromRoot } from './util.ts'

const PATHS = [
  'packages/core',
  'packages/crypto-target-node',
  'packages/crypto-target-web',
  'packages/client',
].map(
  (x) => resolveFromRoot(x),
)

for (const pkg of PATHS) {
  $.logStep('Publishing', pkg)
  await $`deno publish ${Deno.args}`.cwd(pkg)
  $.logStep('Published package')
}
