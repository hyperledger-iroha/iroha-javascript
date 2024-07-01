import { describe, expect, test } from 'vitest'
// TODO: possibly, make an async module which will invoke `cargo run` and parse json on the fly
import SAMPLES from '../../data-model-rust-samples/samples.json'
import {
  type CodecOrWrap,
  datamodel,
  defineTxPayload,
  publicKeyFromCrypto,
  signTransaction,
  toCodec,
  transactionHash,
} from '../src/lib'
import { fromHex } from './util'
import { Bytes, KeyPair, setWASM } from '@iroha2/crypto-core'
import { wasmPkg } from '@iroha2/crypto-target-node'

setWASM(wasmPkg)

const SAMPLE_SIGNATORY: datamodel.PublicKey = {
  algorithm: datamodel.Algorithm.Ed25519,
  payload: fromHex('72 33 BF C8 9D CB D6 8C 19 FD E6 CE 61 58 22 52 98 EC 11 31 B6 A1 30 D1 AE B4 54 C1 AB 51 83 C0'),
}

const SAMPLE_ACCOUNT_ID = { signatory: SAMPLE_SIGNATORY, domain: { name: 'wonderland' } } satisfies datamodel.AccountId

function testEncodeDecodeOfSample<T>(sampleName: keyof typeof SAMPLES, codec: CodecOrWrap<T>, value: T) {
  const sample = SAMPLES[sampleName]

  describe(sampleName, () => {
    test('encode', () => {
      expect(toCodec(codec).encode(value)).toEqual(fromHex(sample.encoded))
    })

    test('decode', () => {
      expect(toCodec(codec).decode(fromHex(sample.encoded))).toEqual(value)
    })
  })
}

testEncodeDecodeOfSample('AccountId', datamodel.AccountId, SAMPLE_ACCOUNT_ID)

testEncodeDecodeOfSample('DomainId', datamodel.DomainId, { name: 'Hey' })

testEncodeDecodeOfSample('AssetDefinitionId', datamodel.AssetDefinitionId, {
  name: 'rose',
  domain: { name: 'wonderland' },
})

testEncodeDecodeOfSample(
  'Register time trigger',
  datamodel.InstructionBox,
  datamodel.InstructionBox.Register(
    datamodel.RegisterBox.Trigger({
      object: {
        id: { name: 'mint_rose' },
        action: {
          authority: SAMPLE_ACCOUNT_ID,
          repeats: datamodel.Repeats.Indefinitely,
          executable: datamodel.Executable.Instructions([
            datamodel.InstructionBox.Mint(
              datamodel.MintBox.Asset({
                object: { scale: 0n, mantissa: 1123n },
                destination: {
                  account: SAMPLE_ACCOUNT_ID,
                  definition: { name: 'rose', domain: { name: 'wonderland' } },
                },
              }),
            ),
          ]),
          filter: datamodel.TriggeringEventFilterBox.Time(
            datamodel.ExecutionTime.Schedule({
              start: { secs: 500n, nanos: 0 },
              period: datamodel.Option.Some({ secs: 3n, nanos: 0 }),
            }),
          ),
          metadata: new Map(),
        },
      },
    }),
  ),
)

testEncodeDecodeOfSample(
  'Register data trigger',
  datamodel.InstructionBox,
  datamodel.InstructionBox.Register(
    datamodel.RegisterBox.Trigger({
      object: {
        id: { name: 'mint_rose' },
        action: {
          authority: SAMPLE_ACCOUNT_ID,
          repeats: datamodel.Repeats.Indefinitely,
          executable: datamodel.Executable.Instructions([
            datamodel.InstructionBox.Mint(
              datamodel.MintBox.Asset({
                object: { scale: 2n, mantissa: 1_441_234n },
                destination: {
                  account: SAMPLE_ACCOUNT_ID,
                  definition: { name: 'rose', domain: { name: 'wonderland' } },
                },
              }),
            ),
          ]),
          filter: datamodel.TriggeringEventFilterBox.Data(
            datamodel.DataEventFilter.AssetDefinition({
              idMatcher: datamodel.Option.Some({ name: 'rose', domain: { name: 'wonderland' } }),
              eventSet: datamodel.AssetDefinitionEventSet.Created | datamodel.AssetDefinitionEventSet.OwnerChanged,
            }),
          ),
          metadata: new Map(),
        },
      },
    }),
  ),
)

testEncodeDecodeOfSample(
  'Metadata',
  datamodel.Metadata,
  new Map([
    // Test will fail if order is violated
    ['authentication', datamodel.MetadataValueBox.String('80252ad8c8546c687b2a7e2505cc')],
    ['email', datamodel.MetadataValueBox.String('user123@mail.com')],
    ['salt', datamodel.MetadataValueBox.String('ABCDEFG')],
  ]),
)

describe('SignedTransaction and its hash', () => {
  // TODO: clean garbage
  const kp = KeyPair.deriveFromSeed(Bytes.array(new Uint8Array([1, 4, 2, 4, 1])), { algorithm: 'bls_small' })
  const publicKey = kp.publicKey()
  const privateKey = kp.privateKey()

  const payload = defineTxPayload({
    chain: '00000',
    authority: {
      domain: { name: 'looking_glass' },
      signatory: publicKeyFromCrypto(publicKey),
    },
    executable: datamodel.Executable.Instructions([]),
    creationTime: 100402000n,
    metadata: new Map([['foo', datamodel.MetadataValueBox.String('bar')]]),
  })

  const tx = signTransaction(payload, privateKey)
  const hash = transactionHash(tx)

  test('transaction encode/decode roundtrip', () => {
    expect(toCodec(datamodel.SignedTransaction).decode(fromHex(SAMPLES['SignedTransaction'].encoded))).toEqual(tx)
    expect(toCodec(datamodel.SignedTransaction).encode(tx)).toEqual(fromHex(SAMPLES['SignedTransaction'].encoded))
  })

  test('transaction hash is as expected', () => {
    expect(hash.bytes()).toEqual(fromHex(SAMPLES['SignedTransaction (hash)'].encoded))
  })
})

// TODO: add more tests, cover manually edited/added schema structs
