import $ from 'jsr:@david/dax'
import { delay, retry } from '@std/async'
import { PORT_PEER_API, PORT_PEER_P2P, PORT_PEER_SERVER, PORT_VITE } from './meta.ts'
import { assert } from '@std/assert'

async function spawnLinked(
  cmd: Deno.Command,
  check: () => Promise<void>,
): Promise<{
  kill: () => Promise<void>
  // isRunning: () => boolean
}> {
  const child = cmd.spawn()
  child.ref()

  for (const signal of (['SIGINT', 'SIGTERM', 'SIGQUIT'] satisfies Deno.Signal[])) {
    Deno.addSignalListener(signal, () => {
      $.logLight('Unexpected Deno termination, killing children')
      child.kill()
    })
  }

  let running = true
  child.output().finally(() => {
    running = false
  })

  await delay(1000)
  await retry(check)
  assert(running, 'process must not exit until killed')

  // window.addEventListener('')

  return {
    kill: async () => {
      child.kill()
      await child.output()
    },
    // isRunning: () => running,
  }
}

async function isPortBusy(port: number) {
  const url = new URL(`http://localhost:${port}`)
  try {
    await fetch(url)
    $.logLight(`Port ${port}: busy`)
    return true
  } catch (_err) {
    $.logLight(`Port ${port}: free`)
    return false
  }
}

async function assertPortBusy(port: number) {
  assert(await isPortBusy(port))
}

$.logStep('Ensuring ports are available for Iroha')
await retry(async () => {
  if ((await Promise.all([isPortBusy(PORT_PEER_API), isPortBusy(PORT_PEER_P2P)])).every((x) => !x)) return
  throw new Error('still busy')
})

$.logStep('Running peer server and vite preview in parallel')
const tasks = await Promise.all([
  spawnLinked(
    new Deno.Command('pnpm', {
      // TODO: replace with `vite build` & `vite preview` once resolved
      // https://github.com/Menci/vite-plugin-wasm/issues/57
      args: ['vite', 'dev', '--port', String(PORT_VITE), '--strictPort'],
      stderr: 'inherit',
      'stdout': 'inherit',
    }),
    () => assertPortBusy(PORT_VITE),
  ),
  spawnLinked(
    new Deno.Command('deno', {
      args: ['task', 'serve-peer'],
      stderr: 'inherit',
      'stdout': 'inherit',
    }),
    () => assertPortBusy(PORT_PEER_SERVER),
  ),
])
$.logStep('Started Vite and Peer server')

try {
  $.logStep('Running Cypress')
  await $`pnpm cypress run`
  $.logStep('Finished Cypress withot errors')
} finally {
  await Promise.all(tasks.map((x) => x.kill()))
  $.logStep('Terminated Vite & Peer server')
}
