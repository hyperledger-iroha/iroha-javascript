import { describe, expect, test } from 'vitest'
import SAMPLES from '../../../data-model-rust-samples/samples.json'
import { type CodecOrWrap, datamodel, toCodec } from '../lib'
import { fromHex, toHex } from '@scale-codec/util'

const SAMPLE_SIGNATORY: datamodel.PublicKey = {
  algorithm: datamodel.Algorithm.Ed25519,
  payload: fromHex('72 33 BF C8 9D CB D6 8C 19 FD E6 CE 61 58 22 52 98 EC 11 31 B6 A1 30 D1 AE B4 54 C1 AB 51 83 C0'),
}

const SAMPLE_ACCOUNT_ID = { signatory: SAMPLE_SIGNATORY, domain: { name: 'wonderland' } } satisfies datamodel.AccountId

// eslint-disable-next-line max-params
function defineCase<T>(label: keyof typeof SAMPLES, codec: CodecOrWrap<T>, value: T) {
  const sample = SAMPLES[label]

  describe(label, () => {
    test('encode', () => {
      expect(toHex(toCodec(codec).encode(value))).toEqual(sample.encoded)
    })

    test('decode', () => {
      expect(toCodec(codec).decode(fromHex(sample.encoded))).toEqual(value)
    })
  })
}

defineCase('AccountId', datamodel.AccountId, SAMPLE_ACCOUNT_ID)

defineCase('DomainId', datamodel.DomainId, { name: 'Hey' })

defineCase('AssetDefinitionId', datamodel.AssetDefinitionId, {
  name: 'rose',
  domain: { name: 'wonderland' },
})

defineCase(
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

defineCase(
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

defineCase(
  'Metadata',
  datamodel.Metadata,
  new Map([
    // Test will fail if order is violated
    ['authentication', datamodel.MetadataValueBox.String('80252ad8c8546c687b2a7e2505cc')],
    ['email', datamodel.MetadataValueBox.String('user123@mail.com')],
    ['salt', datamodel.MetadataValueBox.String('ABCDEFG')],
  ]),
)

// TODO: add more tests, cover manually edited/added schema structs
