import { resolveBinary } from '@iroha2/iroha-source'
import { execa } from 'execa'
import path from 'path'
import { fs } from 'zx'
import { PEER_CONFIG_BASE, SIGNED_GENESIS } from '@iroha2/test-configuration'
import TOML from '@iarna/toml'
import { temporaryDirectory } from 'tempy'
import { type ToriiHttpParams, getHealth, getStatus } from '@iroha2/client'
import mergeDeep from '@tinkoff/utils/object/mergeDeep'
import readline from 'readline'

import Debug from 'debug'

const debug = Debug('@iroha2/test-peer')

const GENESIS_CHECK_TIMEOUT = 1_500
const GENESIS_CHECK_INTERVAL = 200

async function waitForGenesis(toriiURL: string, abort: AbortSignal) {
  const toriiHttp = { toriiURL, http: fetch } satisfies ToriiHttpParams

  let now = Date.now()
  const endAt = now + GENESIS_CHECK_TIMEOUT

  let aborted = false
  abort.addEventListener('abort', () => {
    aborted = true
  })

  while (true) {
    if (aborted) throw new Error('Aborted')

    now = Date.now()
    if (now > endAt) throw new Error(`Genesis is still not committed after ${GENESIS_CHECK_TIMEOUT}ms`)

    try {
      const { blocks } = await getStatus(toriiHttp)
      if (blocks === 1n) break
      throw `blocks: ${blocks}`
    } catch (error) {
      debug('genesis is not yet ready: %o', error)
    }

    await new Promise((r) => setTimeout(r, GENESIS_CHECK_INTERVAL))
  }
}

export interface KillPeerParams {
  /**
   * If set to `true`, then after killing all side effects will be cleared, e.g. saved blocks
   *
   * TODO remove not `blocks` dir, but dir, specified in kura config
   */
  cleanSideEffects?: boolean
}

export interface StartPeerReturn {
  /**
   * Kill peer's process
   */
  kill: () => Promise<void>

  /**
   * Check for alive status
   */
  isAlive: () => boolean

  toriiURL: string
}

export interface IrohaConfiguration {
  genesis: unknown
  config: unknown
}

/**
 * Start network with a single peer.
 *
 * **Note:** Iroha binary must be pre-built.
 */
export async function startPeer(params?: { port?: number }): Promise<StartPeerReturn> {
  const PORT = params?.port ?? 8080
  const API_ADDRESS = `127.0.0.1:${PORT}`
  const API_URL = `http://${API_ADDRESS}`
  const P2P_ADDRESS = '127.0.0.1:1337'
  const TMP_DIR = temporaryDirectory()
  debug('Peer temporary directory: %o | See configs, logs, artifacts there', TMP_DIR)

  await fs.writeFile(
    path.join(TMP_DIR, 'config.toml'),
    TOML.stringify(
      mergeDeep(PEER_CONFIG_BASE, {
        genesis: { signed_file: './genesis.scale' },
        kura: { store_dir: './storage' },
        torii: { address: API_ADDRESS },
        network: { address: P2P_ADDRESS },
        snapshot: { mode: 'disabled' },
      }),
    ),
  )
  await fs.writeFile(path.join(TMP_DIR, 'genesis.scale'), SIGNED_GENESIS.blob)

  const irohad = (await resolveBinary('irohad')).path

  // state
  let isAlive = false

  // starting peer
  const subprocess = execa(irohad, ['--config', './config.toml', '--submit-genesis'], {
    env: { LOG_FORMAT: 'json', LOG_LEVEL: 'DEBUG' },
    cwd: TMP_DIR,
  })

  subprocess.pipeStdout!(fs.createWriteStream(path.join(TMP_DIR, 'stdout.json')))
  subprocess.pipeStderr!(fs.createWriteStream(path.join(TMP_DIR, 'stderr')))
  readline.createInterface(subprocess.stderr!).on('line', (line) => {
    debug.extend('stderr')(line)
  })

  subprocess.once('spawn', () => {
    isAlive = true
    debug('Subprocess spawned')
  })

  subprocess.on('error', (err) => {
    debug('Subprocess error:', err)
  })

  const healthCheckAbort = new AbortController()

  const exitPromise = new Promise<void>((resolve) => {
    subprocess.once('exit', (...args) => {
      debug('Peer exited:', args)
      isAlive = false
      resolve()
    })
  })

  const kill = async function () {
    if (!isAlive) throw new Error('Already dead')
    debug('Killing peer...')
    subprocess.kill('SIGTERM')
    await exitPromise
    debug('Peer is killed')
  }

  await Promise.race([
    exitPromise.then(() => {
      healthCheckAbort.abort()
      throw new Error('Iroha has exited already, maybe something went wrong')
    }),
    waitForGenesis(API_URL, healthCheckAbort.signal),
  ])

  return {
    kill,
    isAlive: () => isAlive,
    toriiURL: API_URL,
  }
}
