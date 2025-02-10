import { resolveBinary } from '@iroha/iroha-source'
import path from 'node:path'
import { fs } from 'zx'
import { PEER_CONFIG_BASE } from '@iroha/test-configuration'
import * as TOML from '@std/toml'
import * as dm from '@iroha/core/data-model'
import { getCodec } from '@iroha/core'
import { temporaryDirectory } from 'tempy'
import { HttpTransport, MainAPI } from '@iroha/client'
import { mergeDeep } from 'remeda'
import { spawn } from 'node:child_process'

import Debug from 'debug'
import type { KeyPair } from '@iroha/crypto'
import { assert } from '@std/assert'

const debug = Debug('@iroha/test-peer')

const GENESIS_CHECK_TIMEOUT = 1_500
const GENESIS_CHECK_INTERVAL = 200

async function waitForGenesis(url: URL, abort: AbortSignal) {
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
      const { blocks } = await new MainAPI(new HttpTransport(url)).telemetry.status()
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
}

/**
 * Start network with a single peer.
 *
 * **Note:** Iroha binary must be pre-built.
 */
export async function startPeer(params: {
  ports: { api: number; p2p: number }
  keypair: KeyPair
  trustedPeers?: {
    address: string
    /** aka public key */
    id: string
  }[]
  genesis?: dm.SignedBlock
}): Promise<StartPeerReturn> {
  const PORT = params.ports.api
  const PORT_P2P = params.ports.p2p
  const API_ADDRESS = `127.0.0.1:${PORT}`
  const API_URL = new URL(`http://${API_ADDRESS}`)
  const P2P_ADDRESS = `127.0.0.1:${PORT_P2P}`
  const TMP_DIR = temporaryDirectory()
  const irohad = await resolveBinary('irohad')
  debug('Peer temporary directory: %o | See configs, logs, artifacts there', TMP_DIR)

  let configGenesisPart = {}
  if (params?.genesis) {
    await fs.writeFile(path.join(TMP_DIR, 'genesis.scale'), getCodec(dm.SignedBlock).encode(params.genesis))
    configGenesisPart = {
      genesis: {
        file: './genesis.scale',
      },
    }
  }

  await fs.writeFile(
    path.join(TMP_DIR, 'config.toml'),
    TOML.stringify(
      mergeDeep(PEER_CONFIG_BASE, {
        ...configGenesisPart,
        public_key: params.keypair.publicKey().toMultihash(),
        private_key: params.keypair.privateKey().toMultihash(),
        trusted_peers: params.trustedPeers?.map((x) => `${x.id}@${x.address}`) ?? [],
        kura: { store_dir: './storage' },
        torii: { address: API_ADDRESS },
        network: { address: P2P_ADDRESS, public_address: P2P_ADDRESS },
        snapshot: { mode: 'disabled' },
        logger: {
          format: 'json',
          level: 'DEBUG',
        },
      }),
    ),
  )

  const child = spawn(irohad.path, ['--config', './config.toml'], {
    cwd: TMP_DIR,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let isAlive = true

  // child.stdout.pipe
  child.stdout.pipe(fs.createWriteStream(path.join(TMP_DIR, 'stdout.json')))
  child.stderr.pipe(fs.createWriteStream(path.join(TMP_DIR, 'stderr')))

  const healthCheckAbort = new AbortController()

  const exitPromise = new Promise<{ code: number }>((resolve) => {
    child.on('close', (code) => {
      isAlive = false
      debug('Peer exited')
      assert(typeof code === 'number')
      resolve({ code })
    })
  })

  const kill = async function () {
    if (!isAlive) throw new Error('Already dead')
    debug('Killing peer...')
    child.kill('SIGTERM')
    await exitPromise
  }

  await Promise.race([
    exitPromise.then(({ code }) => {
      healthCheckAbort.abort()
      throw new Error(`Iroha exited with code ${code}, something went wrong`)
    }),
    waitForGenesis(API_URL, healthCheckAbort.signal),
  ])

  debug('Peer is alive and genesis is committed')

  return {
    kill,
    isAlive: () => isAlive,
  }
}
