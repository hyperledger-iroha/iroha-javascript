import $ from '@david/dax'
import { delay, retry } from '@std/async'
import { PORT_PEER_API, PORT_PEER_P2P, PORT_PEER_SERVER, PORT_VITE } from './meta.ts'
import { assert } from '@std/assert'

async function spawnLinked(opts: {
  name: string
  cmd: Deno.Command
  check: () => Promise<void>
}): Promise<{
  kill: (signal?: Deno.Signal) => Promise<void>
}> {
  const child = opts.cmd.spawn()
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
  await retry(opts.check)
  assert(running, 'process must not exit until killed')

  return {
    kill: async (signal = 'SIGTERM') => {
      $.logStep(`Killing child: ${opts.name} (${signal})`)
      child.kill(signal)
      const output = await child.output()
      $.logStep(`Child exited: ${opts.name} (code: ${output.code})`)
    },
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
    {
      name: 'vite serve',
      cmd: new Deno.Command('node_modules/.bin/vite', {
        args: ['serve', '--port', String(PORT_VITE), '--strictPort'],
        stderr: 'inherit',
        stdout: 'inherit',
      }),
      check: () => assertPortBusy(PORT_VITE),
    },
  ),
  spawnLinked(
    {
      name: 'serve-peer',
      cmd: new Deno.Command('deno', {
        args: ['task', 'serve-peer'],
        stderr: 'inherit',
        stdout: 'inherit',
      }),
      check: () => assertPortBusy(PORT_PEER_SERVER),
    },
  ),
])
$.logStep('Started Vite and Peer server')

try {
  $.logStep('Running Cypress')
  await $`pnpm cypress run`
  $.logStep('Finished Cypress without errors')
} finally {
  await Promise.all(tasks.map((x) => x.kill()))
  $.logStep('Terminated Vite & Peer server')
}
