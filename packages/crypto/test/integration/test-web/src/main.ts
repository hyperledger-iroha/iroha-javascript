import { crypto, init } from '@iroha2/crypto-target-web'

interface Config {
  privateKey: string
}

await init()
const { privateKey } =
  // intercepted by Cypress
  await fetch('/api/config').then<Config>((x) => x.json())

const multihash = crypto.PublicKey.fromPrivateKey(crypto.PrivateKey.fromMultihash(privateKey)).toMultihash()

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `Public key multihash: ${multihash}`
