import { describe, test } from '@std/testing/bdd'
import { expect } from '@std/expect'
import { Algorithm, Bytes, Hash, KeyPair, PrivateKey, PublicKey, Signature } from '@iroha/core/crypto'
import { getCodec } from '../codec.ts'
import { decodeHex } from '@std/encoding/hex'

const { hex: bytesHex } = Bytes

describe('Hash', () => {
  const SAMPLES = [
    {
      'input': '',
      'output': '0E5751C026E543B2E8AB2EB06099DAA1D1E5DF47778F7787FAAB45CDF12FE3A9',
    },
    {
      'input': 'ab',
      'output': '9AC3628F6C9087CC04C77A07A06DC41AA7AA8FF8439B43354754CB41D2803437',
    },
    {
      'input': '010203',
      'output': '11C0E79B71C3976CCD0C02D1310E2516C08EDC9D8B6F57CCD680D63A4D8E72DB',
    },
    {
      'input': 'deadbeef',
      'output': 'F3E925002FED7CC0DED46842569EB5C90C910C091D8D04A1BDF96E0DB719FD91',
    },
    {
      'input': 'babe',
      'output': '5AFBADBA90C494E037C1FED6E6365EC3C723DF6C76435B78B814BFC5CC31C937',
    },
  ]

  for (const sample of SAMPLES) {
    test(`hash "${sample.input}"`, () => {
      expect(Hash.hash(Bytes.hex(sample.input)).payload.hex().toLowerCase()).toEqual(sample.output.toLowerCase())
      expect(Hash.hash(Bytes.array(decodeHex(sample.input))).payload.hex().toLowerCase()).toEqual(
        sample.output.toLowerCase(),
      )
    })
  }
})

describe('KeyPair', () => {
  test('deriveFromSeed()', () => {
    const SEED_BYTES = [49, 50, 51, 52]

    const kp = KeyPair.deriveFromSeed(Bytes.array(Uint8Array.from(SEED_BYTES)))

    expect(JSON.parse(JSON.stringify(kp))).toEqual(
      {
        'privateKey': '80262001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763',
        'publicKey': 'ed0120F149BB4B59FEB0ACE3074F10C65E179880EA2C4FE4E0D6022B1E82C33C3278C7',
      },
    )
  })

  test('deriveFromPrivateKey()', () => {
    const SAMPLE = '802620418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B0'

    const kp = KeyPair.deriveFromPrivateKey(PrivateKey.fromMultihash(SAMPLE))

    expect(JSON.parse(JSON.stringify(kp))).toEqual(
      {
        'privateKey': '802620418A3712F4841FFE7A90B14E90BF76A6EF2A2546AC8DBBB1F442FFB8250426B0',
        'publicKey': 'ed012082528CCC8727333530C8F6F19F70C23882DEB1BF2BA3BE4A6654C7E8A91A7731',
      },
    )
  })

  test('.random() does not throw', () => {
    expect(() => KeyPair.random()).not.toThrow()
  })
})

describe('Signature', () => {
  function pairFactory() {
    return KeyPair.deriveFromSeed(Bytes.hex('aa1108'))
  }

  test('verify passes', () => {
    const MESSAGE = 'deadbeef'

    const pair = pairFactory()
    const signature = pair.privateKey().sign(bytesHex(MESSAGE))

    expect(() => pair.publicKey().verify(signature, bytesHex(MESSAGE))).not.toThrow()
  })

  test('verify fails', () => {
    const pair = pairFactory()
    const signature = pair.privateKey().sign(bytesHex('deadbeef'))

    expect(() => pair.publicKey().verify(signature, bytesHex('feedbabe'))).toThrow(
      'Signature verification failed',
    )
  })

  test('throws if input is invalid', () => {
    const signature = pairFactory().privateKey().sign(bytesHex('deadbeef'))

    expect(() => signature.verify(pairFactory().publicKey(), bytesHex('not really a hex')))
      .toThrow(`Invalid character 'n' at position 0`)
  })

  const SAMPLE_SEED = 'babe'
  const SAMPLE_PAYLOAD = 'deadbeef'
  const SAMPLES = [
    {
      'algorithm': 'bls_small',
      'private_key': '8a2620037935BD3A279009F82DD4527B5295AC54D3C95E87DFE1928DE982FE9CAEE60C',
      'signature': 'b0ff15863d4a70defd4c9a90cca5e53d1c1a9d57a4d38362302b1eb53c0bfb6e9206e416fe89523dafc6f381a8b1bb82',
    },
    {
      'algorithm': 'bls_normal',
      'private_key': '892620037935BD3A279009F82DD4527B5295AC54D3C95E87DFE1928DE982FE9CAEE60C',
      'signature':
        'a2902b4196a130a847657dcad571aa065a9eb7e82aeff236f8ecd346f81de84a5b45960525345a45c7a4f93af105f2bf0cc528f98a5580676ce57952177ec01b2ad450aa030dc359e6d3126c1ee011839c4be9fbb98747349daa95be8984710e',
    },
    {
      'algorithm': 'ed25519',
      'private_key': '8026205B2523645A5D025E67C482E64A4117CDE9A1BE5F128458970491D9774596D2DD',
      'signature':
        'acbb3232c53e7a4e8192d498b77b3269b426f117aac0d7849d9d40d6dca18108138b5a2a5348ea7898a918aad5823f0bc8c84483aeb8d2bfa75aff08ce8f320c',
    },
    {
      'algorithm': 'secp256k1',
      'private_key': '8126205B2523645A5D025E67C482E64A4117CDE9A1BE5F128458970491D9774596D2DD',
      'signature':
        '1dc8173611939edb08ee7daed5349d9b57cdc516ecdb00b20984340bcfa88bca080870c1228d6813ce1f4e0047e35bcc82a1e5cd66335a33aece184fa5b7962b',
    },
  ] satisfies { algorithm: Algorithm; private_key: string; signature: string }[]

  for (const sample of SAMPLES) {
    test(`match ${sample.algorithm} signature`, () => {
      const kp = KeyPair.deriveFromSeed(Bytes.hex(SAMPLE_SEED), { algorithm: sample.algorithm })
      const privateKey = kp.privateKey()

      expect(privateKey.multihash()).toEqual(sample.private_key)

      const signatureFromHex = privateKey
        .sign(Bytes.hex(SAMPLE_PAYLOAD))
        .payload.hex()
      expect(signatureFromHex).toEqual(sample.signature)

      const signatureFromArray = privateKey
        .sign(Bytes.array(decodeHex(SAMPLE_PAYLOAD)))
        .payload.hex()
      expect(signatureFromArray).toEqual(sample.signature)
    })
  }
})

describe('Raw conversion', () => {
  test('Construct PublicKey', () => {
    const multihash = PublicKey.fromParts(
      Algorithm.ed25519,
      bytesHex('A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016'),
    ).multihash()

    expect(multihash).toEqual('ed0120A88D1B0D23BC1ADC564DE57CEDBF8FD7D045D0D698EF27E5D9C1807C1041E016')
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
      .toThrow(`unreachable`)
  })

  test('Construct PrivateKey', () => {
    const json = PrivateKey.fromParts(
      Algorithm.ed25519,
      bytesHex('01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763'),
    ).multihash()

    expect(json).toEqual(`80262001F2DB2416255E79DB67D5AC807E55459ED8754F07586864948AEA00F6F81763`)
  })

  test('Fail to construct PrivateKey', () => {
    expect(() =>
      PrivateKey.fromParts(
        Algorithm.secp256k1,
        bytesHex(
          '01f2db2416255e79db67d5ac807e55459ed8754f07586864948aea00f6f81763f149bb4b59feb0ace3074f10c65e179880ea2c4fe4e0d6022b1e82c33c3278c7',
        ),
      )
    ).toThrow(`crypto error`)
  })

  test('Fail to construct KeyPair', () => {
    const kp1 = KeyPair.deriveFromSeed(bytesHex('deadbeef'), { algorithm: Algorithm.bls_normal })
    const kp2 = KeyPair.deriveFromSeed(bytesHex('beefdead'))

    expect(() => KeyPair.fromParts(kp1.publicKey(), kp2.privateKey())).toThrow(
      `Key generation failed. Mismatch of key algorithms`,
    )
  })

  test('Construct Signature', () => {
    const SAMPLE_PAYLOAD =
      'd0fbac97dcc1c859c110dcf3c55ecff6c28dd49b6e5560e2175a7f308a2214d3d4666c37f0ebfbeb24341a15e606d71780f992f151652adba39fe87e831a2000'

    const actualPayload = Signature.fromRaw(bytesHex(SAMPLE_PAYLOAD)).payload.hex()

    expect(actualPayload).toEqual(SAMPLE_PAYLOAD)
  })
})

describe('PublicKey', () => {
  function assertMatches(key: PublicKey) {
    expect(key.algorithm).toEqual('ed25519')
    expect(key.payload.hex()).toEqual('b23e14f659b91736aab980b6addce4b1db8a138ab0267e049c082a744471714e')
  }

  test('fromMultihash()', () => {
    const key = PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')

    assertMatches(key)
    expect(key.multihash()).toBe('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')
  })

  test('fromMultihash() + encoding round', () => {
    const key = PublicKey.fromMultihash('ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E')
    const bytes = getCodec(PublicKey).encode(key)
    const key2 = getCodec(PublicKey).decode(bytes)

    assertMatches(key2)
  })
})
