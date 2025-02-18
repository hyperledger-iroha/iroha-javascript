import $ from 'jsr:@david/dax'
import { resolveFromRoot } from './util.ts'

const PATHS = [
  'packages/core',
  'packages/client',
  'packages/client-web-socket-node',
].map(
  (x) => resolveFromRoot(x),
)

for (const pkg of PATHS) {
  $.logStep('Publishing', pkg)
  await $`deno publish ${Deno.args}`.cwd(pkg)
  $.logStep('Published package')
}
