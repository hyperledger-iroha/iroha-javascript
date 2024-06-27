/* eslint-disable max-nested-callbacks */
import { afterAll, describe, expect, test } from 'vitest'
import { wasmPkg } from '@iroha2/crypto-target-node'
import { Bytes, FREE_HEAP, KeyPair, PrivateKey, PublicKey, Signature, freeScope, setWASM } from '@iroha2/crypto-core'

setWASM(wasmPkg)

const { hex: bytesHex } = Bytes

afterAll(() => {
  expect(FREE_HEAP.size).toEqual(0)
})

describe('KeyPair generation', () => {
  test('Derives from a seed as expected', () => {
    const SEED_BYTES = [49, 50, 51, 52]

    const parts = freeScope(() => {
      const kp = KeyPair.deriveFromSeed(Bytes.array(Uint8Array.from(SEED_BYTES)))
      return { publicKey: kp.publicKey().toMultihash(), privateKey: kp.privateKey().toMultihash() }
    })

    expect(parts).toMatchInlineSnapshot(`
      {
        "privateKey": "80264001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763F149BB4B59FEB0ACE3074F10C65E179880EA2C4FE4E0D6022B1E82C33C3278C7",
        "publicKey": "ed0120F149BB4B59FEB0ACE3074F10C65E179880EA2C4FE4E0D6022B1E82C33C3278C7",
      }
    `)
  })

  test('Derives from a private key as expected', () => {
    const SAMPLE =
      '802640418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B082528CCC8727333530C8F6F19F70C23882DEB1BF2BA3BE4A6654C7E8A91A7731'

    expect(
      freeScope(() => {
        const kp = KeyPair.deriveFromPrivateKey(PrivateKey.fromMultihash(SAMPLE))
        return {
          publicKey: kp.publicKey().toMultihash(),
          privateKey: kp.privateKey().toMultihash(),
        }
      }),
    ).toMatchInlineSnapshot(`
      {
        "privateKey": "802640418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B082528CCC8727333530C8F6F19F70C23882DEB1BF2BA3BE4A6654C7E8A91A7731",
        "publicKey": "ed012082528CCC8727333530C8F6F19F70C23882DEB1BF2BA3BE4A6654C7E8A91A7731",
      }
    `)
  })

  test('Generates randomly without an error', () => {
    expect(() => freeScope(() => KeyPair.random())).not.toThrow()
  })
})

describe('Given a multihash', () => {
  const MULTIHASH = 'ed0120797507786F9C6A4DE91B5462B8A6F7BF9AB21C22B853E9C992C2EF68DA5307F9'

  test('a public key could be constructed', () => {
    freeScope(() => {
      const key = PublicKey.fromMultihash(MULTIHASH)

      expect(key.algorithm).toMatchInlineSnapshot('"ed25519"')
      expect(key.payload('hex')).toMatchInlineSnapshot(
        '"797507786f9c6a4de91b5462b8a6f7bf9ab21c22b853e9c992c2ef68da5307f9"',
      )
      expect(key.toMultihash()).toBe(MULTIHASH)
    })
  })
})

describe('Signature verification', () => {
  function pairFactory() {
    return freeScope((scope) => {
      const pair = KeyPair.deriveFromSeed(Bytes.hex('aa1108'))
      scope.forget(pair)
      return pair
    })
  }

  test('result is ok', () => {
    const MESSAGE = 'deadbeef'

    const result = freeScope(() => {
      const pair = pairFactory()
      const signature = pair.privateKey().sign(bytesHex(MESSAGE))
      return pair.publicKey().verifySignature(signature, bytesHex(MESSAGE))
    })

    expect(result).toEqual({ t: 'ok' })
  })

  test('result is err', () => {
    const result = freeScope(() => {
      const pair = pairFactory()
      const signature = pair.privateKey().sign(bytesHex('deadbeef'))
      return pair.publicKey().verifySignature(signature, bytesHex('feedbabe'))
    })

    expect(result).toMatchInlineSnapshot(`
      {
        "error": "Signature verification failed",
        "t": "err",
      }
    `)
  })

  test('exception is thrown if input is invalid', () => {
    freeScope(() => {
      const signature = pairFactory().privateKey().sign(bytesHex('deadbeef'))

      expect(() =>
        signature.verify(pairFactory().publicKey(), bytesHex('not really a hex')),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: Invalid character 'n' at position 0]`)
    })
  })
})

describe('Raw conversion', () => {
  test('Construct PublicKey', () => {
    const multihash = freeScope(() =>
      PublicKey.fromRaw(
        'ed25519',
        bytesHex('A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016'),
      ).toMultihash(),
    )

    expect(multihash).toMatchInlineSnapshot('"ed0120A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016"')
  })

  test('Fail to construct PublicKey', () => {
    expect(() =>
      PublicKey.fromRaw('bls_normal', bytesHex('A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016')),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: the input buffer contained invalid data]`)
  })

  test('Construct PrivateKey', () => {
    const json = freeScope(() =>
      PrivateKey.fromBytes(
        'ed25519',
        bytesHex(
          '01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763f149bb4b59feb0ace3074f10c65e179880ea2c4fe4e0d6022b1e82c33c3278c7',
        ),
      ).toMultihash(),
    )

    expect(json).toMatchInlineSnapshot(
      `"80264001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763F149BB4B59FEB0ACE3074F10C65E179880EA2C4FE4E0D6022B1E82C33C3278C7"`,
    )
  })

  test('Fail to construct PrivateKey', () => {
    expect(() =>
      PrivateKey.fromBytes(
        'secp256k1',
        bytesHex(
          '01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763f149bb4b59feb0ace3074f10c65e179880ea2c4fe4e0d6022b1e82c33c3278c7',
        ),
      ),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: crypto error]`)
  })

  test('Fail to construct KeyPair', () => {
    expect(() =>
      freeScope(() => {
        const kp1 = KeyPair.deriveFromSeed(bytesHex('deadbeef'), { algorithm: 'bls_normal' })
        const kp2 = KeyPair.deriveFromSeed(bytesHex('beefdead'))

        // should fail here:
        KeyPair.fromParts(kp1.publicKey(), kp2.privateKey())
      }),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Key generation failed. Mismatch of key algorithms]`)
  })

  test('Construct Signature', () => {
    const SAMPLE_PAYLOAD =
      'd0fbac97dcc1c859c110dcf3c55ecff6c28dd49b6e5560e2175a7f308a2214d3d4666c37f0ebfbeb24341a15e606d71780f992f151652adba39fe87e831a2000'

    const actualPayload = freeScope(() => Signature.fromBytes(bytesHex(SAMPLE_PAYLOAD)).payload('hex'))

    expect(actualPayload).toEqual(SAMPLE_PAYLOAD)
  })

  // TODO
  test.todo('Failed to construct Signature... is it possible?')
})
