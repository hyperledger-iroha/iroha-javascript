import * as cryptoPrev from 'jsr:@iroha/core@0.3.1/crypto'
import * as crypto from './mod.ts'

Deno.bench({
  group: 'hash',
  name: 'from hex',
  fn() {
    crypto.Hash.hash(crypto.Bytes.hex('121212'))
  },
})

Deno.bench({
  group: 'hash',
  name: 'from hex (prev)',
  fn() {
    cryptoPrev.Hash.hash(cryptoPrev.Bytes.hex('121212'))
  },
})

Deno.bench({
  group: 'hash',
  name: 'from array',
  fn() {
    crypto.Hash.hash(crypto.Bytes.array(new Uint8Array([1, 2, 3])))
  },
})

Deno.bench({
  group: 'hash',
  name: 'from array (prev)',
  fn() {
    cryptoPrev.Hash.hash(cryptoPrev.Bytes.array(new Uint8Array([1, 2, 3])))
  },
})

Deno.bench({
  group: 'kp-copy',
  name: 'new',
  fn(b) {
    const kp = crypto.KeyPair.random()

    b.start()
    for (let i = 0; i < 10000; i++) {
      kp.publicKey()
      kp.privateKey()
    }
    b.end()
  },
})

Deno.bench({
  group: 'kp-copy',
  name: 'prev',
  fn(b) {
    const kp = cryptoPrev.KeyPair.random()

    b.start()
    for (let i = 0; i < 10000; i++) {
      kp.publicKey()
      kp.privateKey()
    }
    b.end()
  },
})

Deno.bench({
  group: 'sign',
  name: 'new',
  fn() {
    const kp = crypto.KeyPair.random()
    const payload = crypto.Bytes.hex('0011')
    const sign = kp.privateKey().sign(payload)
    sign.verify(kp.publicKey(), payload)
  },
})

Deno.bench({
  group: 'sign',
  name: 'prev',
  fn() {
    const kp = cryptoPrev.KeyPair.random()
    const payload = cryptoPrev.Bytes.hex('0011')
    const sign = kp.privateKey().sign(payload)
    sign.verify(kp.publicKey(), payload)
  },
})
