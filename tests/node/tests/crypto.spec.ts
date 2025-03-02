import { describe, expect, test } from 'vitest'
import { Algorithm, Bytes, KeyPair, PrivateKey, PublicKey, Signature } from '@iroha/core/crypto'

const { hex: bytesHex } = Bytes

describe('KeyPair generation', () => {
  test('Derives from a seed as expected', () => {
    const SEED_BYTES = [49, 50, 51, 52]

    const kp = KeyPair.deriveFromSeed(Bytes.array(Uint8Array.from(SEED_BYTES)))
    const parts = { publicKey: kp.publicKey().multihash(), privateKey: kp.privateKey().multihash() }

    expect(parts).toMatchInlineSnapshot(`
      {
        "privateKey": "80262001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763",
        "publicKey": "ed0120F149BB4B59FEB0ACE3074F10C65E179880EA2C4FE4E0D6022B1E82C33C3278C7",
      }
    `)
  })

  test('Derives from a private key as expected', () => {
    const SAMPLE = '802620418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B0'

    const kp = KeyPair.deriveFromPrivateKey(PrivateKey.fromMultihash(SAMPLE))

    expect({
      publicKey: kp.publicKey().multihash(),
      privateKey: kp.privateKey().multihash(),
    }).toMatchInlineSnapshot(`
      {
        "privateKey": "802620418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B0",
        "publicKey": "ed012082528CCC8727333530C8F6F19F70C23882DEB1BF2BA3BE4A6654C7E8A91A7731",
      }
    `)
  })

  test('Generates randomly without an error', () => {
    expect(() => KeyPair.random()).not.toThrow()
  })
})

describe('Given a multihash', () => {
  const MULTIHASH = 'ed0120797507786F9C6A4DE91B5462B8A6F7BF9AB21C22B853E9C992C2EF68DA5307F9'

  test('a public key could be constructed', () => {
    const key = PublicKey.fromMultihash(MULTIHASH)

    expect(key.algorithm).toMatchInlineSnapshot('"ed25519"')
    expect(key.payload.hex()).toMatchInlineSnapshot(
      '"797507786f9c6a4de91b5462b8a6f7bf9ab21c22b853e9c992c2ef68da5307f9"',
    )
    expect(key.multihash()).toBe(MULTIHASH)
  })
})

describe('Signature verification', () => {
  function pairFactory() {
    return KeyPair.deriveFromSeed(Bytes.hex('aa1108'))
  }

  test('result is ok', () => {
    const MESSAGE = 'deadbeef'

    const pair = pairFactory()
    const signature = pair.privateKey().sign(bytesHex(MESSAGE))
    const result = pair.publicKey().verifySignature(signature, bytesHex(MESSAGE))

    expect(result).toEqual({ t: 'ok' })
  })

  test('result is err', () => {
    const pair = pairFactory()
    const signature = pair.privateKey().sign(bytesHex('deadbeef'))
    const result = pair.publicKey().verifySignature(signature, bytesHex('feedbabe'))

    expect(result).toMatchInlineSnapshot(`
      {
        "error": "Signature verification failed",
        "t": "err",
      }
    `)
  })

  test('exception is thrown if input is invalid', () => {
    const signature = pairFactory().privateKey().sign(bytesHex('deadbeef'))

    expect(() => signature.verify(pairFactory().publicKey(), bytesHex('not really a hex')))
      .toThrowErrorMatchingInlineSnapshot(`[Error: Invalid character 'n' at position 0]`)
  })
})

describe('Raw conversion', () => {
  test('Construct PublicKey', () => {
    const multihash = PublicKey.fromParts(
      Algorithm.ed25519,
      bytesHex('A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016'),
    ).multihash()

    expect(multihash).toMatchInlineSnapshot('"ed0120A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016"')
  })

  // TODO: find a better way to test pub key parsing directly
  test('Error when constructing an invalid PublicKey', () => {
    const kp = KeyPair.random()
    const signature = kp.privateKey().sign(Bytes.hex('deadbeef'))

    // it is parsed lazily in WASM: https://github.com/hyperledger-iroha/iroha/pull/5048
    const badPubKey = PublicKey.fromParts(
      Algorithm.bls_normal,
      // this payload is not valid for this algorithm
      bytesHex('A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016'),
    )

    expect(() => signature.verify(badPubKey, Bytes.hex('deadbeef')))
      // FIXME: not a good error. This should probably be reported to Iroha
      .toThrowErrorMatchingInlineSnapshot(`[RuntimeError: unreachable]`)
  })

  test('Construct PrivateKey', () => {
    const json = PrivateKey.fromParts(
      Algorithm.ed25519,
      bytesHex('01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763'),
    ).multihash()

    expect(json).toMatchInlineSnapshot(`"80262001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763"`)
  })

  test('Fail to construct PrivateKey', () => {
    expect(() =>
      PrivateKey.fromParts(
        Algorithm.secp256k1,
        bytesHex(
          '01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763f149bb4b59feb0ace3074f10c65e179880ea2c4fe4e0d6022b1e82c33c3278c7',
        ),
      )
    ).toThrowErrorMatchingInlineSnapshot(`[Error: crypto error]`)
  })

  test('Fail to construct KeyPair', () => {
    const kp1 = KeyPair.deriveFromSeed(bytesHex('deadbeef'), { algorithm: Algorithm.bls_normal })
    const kp2 = KeyPair.deriveFromSeed(bytesHex('beefdead'))

    expect(() => KeyPair.fromParts(kp1.publicKey(), kp2.privateKey())).toThrowErrorMatchingInlineSnapshot(
      `[Error: Key generation failed. Mismatch of key algorithms]`,
    )
  })

  test('Construct Signature', () => {
    const SAMPLE_PAYLOAD =
      'd0fbac97dcc1c859c110dcf3c55ecff6c28dd49b6e5560e2175a7f308a2214d3d4666c37f0ebfbeb24341a15e606d71780f992f151652adba39fe87e831a2000'

    const actualPayload = Signature.fromRaw(bytesHex(SAMPLE_PAYLOAD)).payload.hex()

    expect(actualPayload).toEqual(SAMPLE_PAYLOAD)
  })

  // TODO
  // test.todo('Failed to construct Signature... is it possible?')
})

test('BlsSmall signature', () => {
  const SEED = 'babe'
  const PAYLOAD = 'deadbeef'
  const EXPECTED_SIGNATURE =
    '81ed6a74bb04f2a9d2007dcf7f39ae186019abc8ba46316a751c405a509fed2470443b60f82188102ed6bf3bf61d593a'

  const actual = KeyPair.deriveFromSeed(Bytes.hex(SEED), { algorithm: 'bls_small' })
    .privateKey()
    .sign(Bytes.hex(PAYLOAD))
    .payload.hex()

  expect(actual).toBe(EXPECTED_SIGNATURE)
})
