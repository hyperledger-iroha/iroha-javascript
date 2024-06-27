import { wasmPkg, init } from '@iroha2/crypto-target-web'
import { PublicKey, PrivateKey, setWASM } from '@iroha2/crypto-core'

setWASM(wasmPkg)
await init()

interface Config {
  privateKey: string
}

const { privateKey } =
  // intercepted by Cypress
  await fetch('/api/config').then<Config>((x) => x.json())

const multihash = PublicKey.fromPrivateKey(PrivateKey.fromMultihash(privateKey)).toMultihash()

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `Public key multihash: ${multihash}`
