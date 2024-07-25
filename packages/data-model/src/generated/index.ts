import { core, crypto, z } from './prelude'
export type Account = z.infer<typeof Account$schema>
export const Account = (input: z.input<typeof Account$schema>): Account => Account$schema.parse(input)
export const Account$schema = z.object({ id: z.lazy(() => AccountId$schema), metadata: z.lazy(() => Metadata$schema) })
export const Account$codec = core.structCodec<Account>([
  ['id', core.lazyCodec(() => AccountId$codec)],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type AccountEvent = z.infer<typeof AccountEvent$schema>
export const AccountEvent = (input: z.input<typeof AccountEvent$schema>): AccountEvent =>
  AccountEvent$schema.parse(input)
export const AccountEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => Account$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetEvent$schema) }),
  z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => AccountPermissionChanged$schema) }),
  z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => AccountPermissionChanged$schema) }),
  z.object({ t: z.literal('RoleGranted'), value: z.lazy(() => AccountRoleChanged$schema) }),
  z.object({ t: z.literal('RoleRevoked'), value: z.lazy(() => AccountRoleChanged$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AccountId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AccountId$schema))),
  }),
])
export const AccountEvent$codec: core.Codec<AccountEvent> = core
  .enumCodec<{
    Created: [Account]
    Deleted: [AccountId]
    Asset: [AssetEvent]
    PermissionAdded: [AccountPermissionChanged]
    PermissionRemoved: [AccountPermissionChanged]
    RoleGranted: [AccountRoleChanged]
    RoleRevoked: [AccountRoleChanged]
    MetadataInserted: [MetadataChanged<AccountId>]
    MetadataRemoved: [MetadataChanged<AccountId>]
  }>([
    [0, 'Created', core.lazyCodec(() => Account$codec)],
    [1, 'Deleted', core.lazyCodec(() => AccountId$codec)],
    [2, 'Asset', core.lazyCodec(() => AssetEvent$codec)],
    [3, 'PermissionAdded', core.lazyCodec(() => AccountPermissionChanged$codec)],
    [4, 'PermissionRemoved', core.lazyCodec(() => AccountPermissionChanged$codec)],
    [5, 'RoleGranted', core.lazyCodec(() => AccountRoleChanged$codec)],
    [6, 'RoleRevoked', core.lazyCodec(() => AccountRoleChanged$codec)],
    [7, 'MetadataInserted', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AccountId$codec)))],
    [8, 'MetadataRemoved', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AccountId$codec)))],
  ])
  .discriminated()
export type AccountEventFilter = z.infer<typeof AccountEventFilter$schema>
export const AccountEventFilter = (input: z.input<typeof AccountEventFilter$schema>): AccountEventFilter =>
  AccountEventFilter$schema.parse(input)
export const AccountEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AccountId$schema)),
  eventSet: z.lazy(() => AccountEventSet$schema),
})
export const AccountEventFilter$codec = core.structCodec<AccountEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => AccountId$codec))],
  ['eventSet', core.lazyCodec(() => AccountEventSet$codec)],
])
export type AccountEventSet = z.infer<typeof AccountEventSet$schema>
export const AccountEventSet = (input: z.input<typeof AccountEventSet$schema>): AccountEventSet =>
  AccountEventSet$schema.parse(input)
const AccountEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('AnyAsset'),
  z.literal('PermissionAdded'),
  z.literal('PermissionRemoved'),
  z.literal('RoleGranted'),
  z.literal('RoleRevoked'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
])
export const AccountEventSet$schema = z
  .set(AccountEventSet$literalSchema)
  .or(z.array(AccountEventSet$literalSchema).transform((arr) => new Set(arr)))
export const AccountEventSet$codec = core.bitmap<AccountEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  AnyAsset: 4,
  PermissionAdded: 8,
  PermissionRemoved: 16,
  RoleGranted: 32,
  RoleRevoked: 64,
  MetadataInserted: 128,
  MetadataRemoved: 256,
})
export type AccountId = z.infer<typeof AccountId$schema>
export const AccountId = (input: z.input<typeof AccountId$schema>): AccountId => AccountId$schema.parse(input)
export const AccountId$schema = z
  .string()
  .transform(core.parseAccountId)
  .pipe(z.object({ domain: z.lazy(() => DomainId$schema), signatory: z.lazy(() => PublicKey$schema) }))
  .or(z.object({ domain: z.lazy(() => DomainId$schema), signatory: z.lazy(() => PublicKey$schema) }))
export const AccountId$codec = core.structCodec<AccountId>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
  ['signatory', core.lazyCodec(() => PublicKey$codec)],
])
export type AccountPermissionChanged = z.infer<typeof AccountPermissionChanged$schema>
export const AccountPermissionChanged = (
  input: z.input<typeof AccountPermissionChanged$schema>,
): AccountPermissionChanged => AccountPermissionChanged$schema.parse(input)
export const AccountPermissionChanged$schema = z.object({
  account: z.lazy(() => AccountId$schema),
  permission: z.lazy(() => Permission$schema),
})
export const AccountPermissionChanged$codec = core.structCodec<AccountPermissionChanged>([
  ['account', core.lazyCodec(() => AccountId$codec)],
  ['permission', core.lazyCodec(() => Permission$codec)],
])
export type AccountRoleChanged = z.infer<typeof AccountRoleChanged$schema>
export const AccountRoleChanged = (input: z.input<typeof AccountRoleChanged$schema>): AccountRoleChanged =>
  AccountRoleChanged$schema.parse(input)
export const AccountRoleChanged$schema = z.object({
  account: z.lazy(() => AccountId$schema),
  role: z.lazy(() => RoleId$schema),
})
export const AccountRoleChanged$codec = core.structCodec<AccountRoleChanged>([
  ['account', core.lazyCodec(() => AccountId$codec)],
  ['role', core.lazyCodec(() => RoleId$codec)],
])
export type Action = z.infer<typeof Action$schema>
export const Action = (input: z.input<typeof Action$schema>): Action => Action$schema.parse(input)
export const Action$schema = z.object({
  executable: z.lazy(() => Executable$schema),
  repeats: z.lazy(() => Repeats$schema),
  authority: z.lazy(() => AccountId$schema),
  filter: z.lazy(() => TriggeringEventFilterBox$schema),
  metadata: z.lazy(() => Metadata$schema),
})
export const Action$codec = core.structCodec<Action>([
  ['executable', core.lazyCodec(() => Executable$codec)],
  ['repeats', core.lazyCodec(() => Repeats$codec)],
  ['authority', core.lazyCodec(() => AccountId$codec)],
  ['filter', core.lazyCodec(() => TriggeringEventFilterBox$codec)],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type Algorithm = z.infer<typeof Algorithm$schema>
export const Algorithm = (input: z.input<typeof Algorithm$schema>): Algorithm => Algorithm$schema.parse(input)
export const Algorithm$schema = z.union([
  z.literal('ed25519'),
  z.literal('secp256k1'),
  z.literal('bls_normal'),
  z.literal('bls_small'),
])
export const Algorithm$codec: core.Codec<Algorithm> = core
  .enumCodec<{ ed25519: []; secp256k1: []; bls_normal: []; bls_small: [] }>([
    [0, 'ed25519'],
    [1, 'secp256k1'],
    [2, 'bls_normal'],
    [3, 'bls_small'],
  ])
  .literalUnion()
export type Asset = z.infer<typeof Asset$schema>
export const Asset = (input: z.input<typeof Asset$schema>): Asset => Asset$schema.parse(input)
export const Asset$schema = z.object({ id: z.lazy(() => AssetId$schema), value: z.lazy(() => AssetValue$schema) })
export const Asset$codec = core.structCodec<Asset>([
  ['id', core.lazyCodec(() => AssetId$codec)],
  ['value', core.lazyCodec(() => AssetValue$codec)],
])
export type AssetChanged = z.infer<typeof AssetChanged$schema>
export const AssetChanged = (input: z.input<typeof AssetChanged$schema>): AssetChanged =>
  AssetChanged$schema.parse(input)
export const AssetChanged$schema = z.object({
  asset: z.lazy(() => AssetId$schema),
  amount: z.lazy(() => AssetValue$schema),
})
export const AssetChanged$codec = core.structCodec<AssetChanged>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
  ['amount', core.lazyCodec(() => AssetValue$codec)],
])
export type AssetDefinition = z.infer<typeof AssetDefinition$schema>
export const AssetDefinition = (input: z.input<typeof AssetDefinition$schema>): AssetDefinition =>
  AssetDefinition$schema.parse(input)
export const AssetDefinition$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  type: z.lazy(() => AssetType$schema),
  mintable: z.lazy(() => Mintable$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
  ownedBy: z.lazy(() => AccountId$schema),
})
export const AssetDefinition$codec = core.structCodec<AssetDefinition>([
  ['id', core.lazyCodec(() => AssetDefinitionId$codec)],
  ['type', core.lazyCodec(() => AssetType$codec)],
  ['mintable', core.lazyCodec(() => Mintable$codec)],
  ['logo', core.Option$codec(core.lazyCodec(() => IpfsPath$codec))],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
  ['ownedBy', core.lazyCodec(() => AccountId$codec)],
])
export type AssetDefinitionEvent = z.infer<typeof AssetDefinitionEvent$schema>
export const AssetDefinitionEvent = (input: z.input<typeof AssetDefinitionEvent$schema>): AssetDefinitionEvent =>
  AssetDefinitionEvent$schema.parse(input)
export const AssetDefinitionEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => AssetDefinition$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetDefinitionId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetDefinitionId$schema))),
  }),
  z.object({ t: z.literal('MintabilityChanged'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('TotalQuantityChanged'), value: z.lazy(() => AssetDefinitionTotalQuantityChanged$schema) }),
  z.object({ t: z.literal('OwnerChanged'), value: z.lazy(() => AssetDefinitionOwnerChanged$schema) }),
])
export const AssetDefinitionEvent$codec: core.Codec<AssetDefinitionEvent> = core
  .enumCodec<{
    Created: [AssetDefinition]
    Deleted: [AssetDefinitionId]
    MetadataInserted: [MetadataChanged<AssetDefinitionId>]
    MetadataRemoved: [MetadataChanged<AssetDefinitionId>]
    MintabilityChanged: [AssetDefinitionId]
    TotalQuantityChanged: [AssetDefinitionTotalQuantityChanged]
    OwnerChanged: [AssetDefinitionOwnerChanged]
  }>([
    [0, 'Created', core.lazyCodec(() => AssetDefinition$codec)],
    [1, 'Deleted', core.lazyCodec(() => AssetDefinitionId$codec)],
    [2, 'MetadataInserted', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AssetDefinitionId$codec)))],
    [3, 'MetadataRemoved', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AssetDefinitionId$codec)))],
    [4, 'MintabilityChanged', core.lazyCodec(() => AssetDefinitionId$codec)],
    [5, 'TotalQuantityChanged', core.lazyCodec(() => AssetDefinitionTotalQuantityChanged$codec)],
    [6, 'OwnerChanged', core.lazyCodec(() => AssetDefinitionOwnerChanged$codec)],
  ])
  .discriminated()
export type AssetDefinitionEventFilter = z.infer<typeof AssetDefinitionEventFilter$schema>
export const AssetDefinitionEventFilter = (
  input: z.input<typeof AssetDefinitionEventFilter$schema>,
): AssetDefinitionEventFilter => AssetDefinitionEventFilter$schema.parse(input)
export const AssetDefinitionEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AssetDefinitionId$schema)),
  eventSet: z.lazy(() => AssetDefinitionEventSet$schema),
})
export const AssetDefinitionEventFilter$codec = core.structCodec<AssetDefinitionEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => AssetDefinitionId$codec))],
  ['eventSet', core.lazyCodec(() => AssetDefinitionEventSet$codec)],
])
export type AssetDefinitionEventSet = z.infer<typeof AssetDefinitionEventSet$schema>
export const AssetDefinitionEventSet = (
  input: z.input<typeof AssetDefinitionEventSet$schema>,
): AssetDefinitionEventSet => AssetDefinitionEventSet$schema.parse(input)
const AssetDefinitionEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
  z.literal('MintabilityChanged'),
  z.literal('TotalQuantityChanged'),
  z.literal('OwnerChanged'),
])
export const AssetDefinitionEventSet$schema = z
  .set(AssetDefinitionEventSet$literalSchema)
  .or(z.array(AssetDefinitionEventSet$literalSchema).transform((arr) => new Set(arr)))
export const AssetDefinitionEventSet$codec = core.bitmap<AssetDefinitionEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  MetadataInserted: 4,
  MetadataRemoved: 8,
  MintabilityChanged: 16,
  TotalQuantityChanged: 32,
  OwnerChanged: 64,
})
export type AssetDefinitionId = z.infer<typeof AssetDefinitionId$schema>
export const AssetDefinitionId = (input: z.input<typeof AssetDefinitionId$schema>): AssetDefinitionId =>
  AssetDefinitionId$schema.parse(input)
export const AssetDefinitionId$schema = z
  .string()
  .transform(core.parseAssetDefinitionId)
  .pipe(z.object({ domain: z.lazy(() => DomainId$schema), name: core.Name$schema }))
  .or(z.object({ domain: z.lazy(() => DomainId$schema), name: core.Name$schema }))
export const AssetDefinitionId$codec = core.structCodec<AssetDefinitionId>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
  ['name', core.Name$codec],
])
export type AssetDefinitionOwnerChanged = z.infer<typeof AssetDefinitionOwnerChanged$schema>
export const AssetDefinitionOwnerChanged = (
  input: z.input<typeof AssetDefinitionOwnerChanged$schema>,
): AssetDefinitionOwnerChanged => AssetDefinitionOwnerChanged$schema.parse(input)
export const AssetDefinitionOwnerChanged$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
  newOwner: z.lazy(() => AccountId$schema),
})
export const AssetDefinitionOwnerChanged$codec = core.structCodec<AssetDefinitionOwnerChanged>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
  ['newOwner', core.lazyCodec(() => AccountId$codec)],
])
export type AssetDefinitionTotalQuantityChanged = z.infer<typeof AssetDefinitionTotalQuantityChanged$schema>
export const AssetDefinitionTotalQuantityChanged = (
  input: z.input<typeof AssetDefinitionTotalQuantityChanged$schema>,
): AssetDefinitionTotalQuantityChanged => AssetDefinitionTotalQuantityChanged$schema.parse(input)
export const AssetDefinitionTotalQuantityChanged$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
  totalAmount: z.lazy(() => Numeric$schema),
})
export const AssetDefinitionTotalQuantityChanged$codec = core.structCodec<AssetDefinitionTotalQuantityChanged>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
  ['totalAmount', core.lazyCodec(() => Numeric$codec)],
])
export type AssetEvent = z.infer<typeof AssetEvent$schema>
export const AssetEvent = (input: z.input<typeof AssetEvent$schema>): AssetEvent => AssetEvent$schema.parse(input)
export const AssetEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => Asset$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => AssetId$schema) }),
  z.object({ t: z.literal('Added'), value: z.lazy(() => AssetChanged$schema) }),
  z.object({ t: z.literal('Removed'), value: z.lazy(() => AssetChanged$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetId$schema))),
  }),
])
export const AssetEvent$codec: core.Codec<AssetEvent> = core
  .enumCodec<{
    Created: [Asset]
    Deleted: [AssetId]
    Added: [AssetChanged]
    Removed: [AssetChanged]
    MetadataInserted: [MetadataChanged<AssetId>]
    MetadataRemoved: [MetadataChanged<AssetId>]
  }>([
    [0, 'Created', core.lazyCodec(() => Asset$codec)],
    [1, 'Deleted', core.lazyCodec(() => AssetId$codec)],
    [2, 'Added', core.lazyCodec(() => AssetChanged$codec)],
    [3, 'Removed', core.lazyCodec(() => AssetChanged$codec)],
    [4, 'MetadataInserted', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AssetId$codec)))],
    [5, 'MetadataRemoved', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => AssetId$codec)))],
  ])
  .discriminated()
export type AssetEventFilter = z.infer<typeof AssetEventFilter$schema>
export const AssetEventFilter = (input: z.input<typeof AssetEventFilter$schema>): AssetEventFilter =>
  AssetEventFilter$schema.parse(input)
export const AssetEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AssetId$schema)),
  eventSet: z.lazy(() => AssetEventSet$schema),
})
export const AssetEventFilter$codec = core.structCodec<AssetEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => AssetId$codec))],
  ['eventSet', core.lazyCodec(() => AssetEventSet$codec)],
])
export type AssetEventSet = z.infer<typeof AssetEventSet$schema>
export const AssetEventSet = (input: z.input<typeof AssetEventSet$schema>): AssetEventSet =>
  AssetEventSet$schema.parse(input)
const AssetEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('Added'),
  z.literal('Removed'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
])
export const AssetEventSet$schema = z
  .set(AssetEventSet$literalSchema)
  .or(z.array(AssetEventSet$literalSchema).transform((arr) => new Set(arr)))
export const AssetEventSet$codec = core.bitmap<AssetEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  Added: 4,
  Removed: 8,
  MetadataInserted: 16,
  MetadataRemoved: 32,
})
export type AssetId = z.infer<typeof AssetId$schema>
export const AssetId = (input: z.input<typeof AssetId$schema>): AssetId => AssetId$schema.parse(input)
export const AssetId$schema = z
  .string()
  .transform(core.parseAssetId)
  .pipe(z.object({ account: z.lazy(() => AccountId$schema), definition: z.lazy(() => AssetDefinitionId$schema) }))
  .or(z.object({ account: z.lazy(() => AccountId$schema), definition: z.lazy(() => AssetDefinitionId$schema) }))
export const AssetId$codec = core.structCodec<AssetId>([
  ['account', core.lazyCodec(() => AccountId$codec)],
  ['definition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type AssetTransferBox = z.infer<typeof AssetTransferBox$schema>
export const AssetTransferBox = (input: z.input<typeof AssetTransferBox$schema>): AssetTransferBox =>
  AssetTransferBox$schema.parse(input)
export const AssetTransferBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Numeric'),
    value: z.lazy(() =>
      Transfer$schema(
        z.lazy(() => AssetId$schema),
        z.lazy(() => Numeric$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('Store'),
    value: z.lazy(() =>
      Transfer$schema(
        z.lazy(() => AssetId$schema),
        z.lazy(() => Metadata$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
])
export const AssetTransferBox$codec: core.Codec<AssetTransferBox> = core
  .enumCodec<{ Numeric: [Transfer<AssetId, Numeric, AccountId>]; Store: [Transfer<AssetId, Metadata, AccountId>] }>([
    [
      0,
      'Numeric',
      core.lazyCodec(() =>
        Transfer$codec(
          core.lazyCodec(() => AssetId$codec),
          core.lazyCodec(() => Numeric$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      1,
      'Store',
      core.lazyCodec(() =>
        Transfer$codec(
          core.lazyCodec(() => AssetId$codec),
          core.lazyCodec(() => Metadata$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
  ])
  .discriminated()
export type AssetType = z.infer<typeof AssetType$schema>
export const AssetType = (input: z.input<typeof AssetType$schema>): AssetType => AssetType$schema.parse(input)
export const AssetType$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => NumericSpec$schema) }),
  z.object({ t: z.literal('Store') }),
])
export const AssetType$codec: core.Codec<AssetType> = core
  .enumCodec<{ Numeric: [NumericSpec]; Store: [] }>([
    [0, 'Numeric', core.lazyCodec(() => NumericSpec$codec)],
    [1, 'Store'],
  ])
  .discriminated()
export type AssetTypeMismatch = z.infer<typeof AssetTypeMismatch$schema>
export const AssetTypeMismatch = (input: z.input<typeof AssetTypeMismatch$schema>): AssetTypeMismatch =>
  AssetTypeMismatch$schema.parse(input)
export const AssetTypeMismatch$schema = z.object({
  expected: z.lazy(() => AssetType$schema),
  actual: z.lazy(() => AssetType$schema),
})
export const AssetTypeMismatch$codec = core.structCodec<AssetTypeMismatch>([
  ['expected', core.lazyCodec(() => AssetType$codec)],
  ['actual', core.lazyCodec(() => AssetType$codec)],
])
export type AssetValue = z.infer<typeof AssetValue$schema>
export const AssetValue = (input: z.input<typeof AssetValue$schema>): AssetValue => AssetValue$schema.parse(input)
export const AssetValue$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
  z.object({ t: z.literal('Store'), value: z.lazy(() => Metadata$schema) }),
])
export const AssetValue$codec: core.Codec<AssetValue> = core
  .enumCodec<{ Numeric: [Numeric]; Store: [Metadata] }>([
    [0, 'Numeric', core.lazyCodec(() => Numeric$codec)],
    [1, 'Store', core.lazyCodec(() => Metadata$codec)],
  ])
  .discriminated()
export type AtIndex = z.infer<typeof AtIndex$schema>
export const AtIndex = (input: z.input<typeof AtIndex$schema>): AtIndex => AtIndex$schema.parse(input)
export const AtIndex$schema = z.object({ index: core.U32$schema, predicate: z.lazy(() => QueryOutputPredicate$schema) })
export const AtIndex$codec = core.structCodec<AtIndex>([
  ['index', core.U32$codec],
  ['predicate', core.lazyCodec(() => QueryOutputPredicate$codec)],
])
export type BatchedResponse = z.infer<typeof BatchedResponse$schema>
export const BatchedResponse = (input: z.input<typeof BatchedResponse$schema>): BatchedResponse =>
  BatchedResponse$schema.parse(input)
export const BatchedResponse$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => BatchedResponseV1$schema) }),
])
export const BatchedResponse$codec: core.Codec<BatchedResponse> = core
  .enumCodec<{ V1: [BatchedResponseV1] }>([[1, 'V1', core.lazyCodec(() => BatchedResponseV1$codec)]])
  .discriminated()
export type BatchedResponseV1 = z.infer<typeof BatchedResponseV1$schema>
export const BatchedResponseV1 = (input: z.input<typeof BatchedResponseV1$schema>): BatchedResponseV1 =>
  BatchedResponseV1$schema.parse(input)
export const BatchedResponseV1$schema = z.object({
  batch: z.lazy(() => QueryOutputBox$schema),
  cursor: z.lazy(() => ForwardCursor$schema),
})
export const BatchedResponseV1$codec = core.structCodec<BatchedResponseV1>([
  ['batch', core.lazyCodec(() => QueryOutputBox$codec)],
  ['cursor', core.lazyCodec(() => ForwardCursor$codec)],
])
export type BlockEvent = z.infer<typeof BlockEvent$schema>
export const BlockEvent = (input: z.input<typeof BlockEvent$schema>): BlockEvent => BlockEvent$schema.parse(input)
export const BlockEvent$schema = z.object({
  header: z.lazy(() => BlockHeader$schema),
  hash: z.lazy(() => Hash$schema),
  status: z.lazy(() => BlockStatus$schema),
})
export const BlockEvent$codec = core.structCodec<BlockEvent>([
  ['header', core.lazyCodec(() => BlockHeader$codec)],
  ['hash', core.lazyCodec(() => Hash$codec)],
  ['status', core.lazyCodec(() => BlockStatus$codec)],
])
export type BlockEventFilter = z.infer<typeof BlockEventFilter$schema>
export const BlockEventFilter = (input: z.input<typeof BlockEventFilter$schema>): BlockEventFilter =>
  BlockEventFilter$schema.parse(input)
export const BlockEventFilter$schema = z.object({
  height: core.Option$schema(core.NonZero$schema(core.U64$schema)),
  status: core.Option$schema(z.lazy(() => BlockStatus$schema)),
})
export const BlockEventFilter$codec = core.structCodec<BlockEventFilter>([
  ['height', core.Option$codec(core.NonZero$codec(core.U64$codec))],
  ['status', core.Option$codec(core.lazyCodec(() => BlockStatus$codec))],
])
export type BlockHeader = z.infer<typeof BlockHeader$schema>
export const BlockHeader = (input: z.input<typeof BlockHeader$schema>): BlockHeader => BlockHeader$schema.parse(input)
export const BlockHeader$schema = z.object({
  height: core.NonZero$schema(core.U64$schema),
  prevBlockHash: core.Option$schema(z.lazy(() => Hash$schema)),
  transactionsHash: z.lazy(() => Hash$schema),
  creationTime: core.Timestamp$schema,
  viewChangeIndex: core.U32$schema,
  consensusEstimation: core.Duration$schema,
})
export const BlockHeader$codec = core.structCodec<BlockHeader>([
  ['height', core.NonZero$codec(core.U64$codec)],
  ['prevBlockHash', core.Option$codec(core.lazyCodec(() => Hash$codec))],
  ['transactionsHash', core.lazyCodec(() => Hash$codec)],
  ['creationTime', core.Timestamp$codec],
  ['viewChangeIndex', core.U32$codec],
  ['consensusEstimation', core.Duration$codec],
])
export type BlockParameter = z.infer<typeof BlockParameter$schema>
export const BlockParameter = (input: z.input<typeof BlockParameter$schema>): BlockParameter =>
  BlockParameter$schema.parse(input)
export const BlockParameter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('MaxTransactions'), value: core.NonZero$schema(core.U64$schema) }),
])
export const BlockParameter$codec: core.Codec<BlockParameter> = core
  .enumCodec<{
    MaxTransactions: [core.NonZero<core.U64>]
  }>([[0, 'MaxTransactions', core.NonZero$codec(core.U64$codec)]])
  .discriminated()
export type BlockParameters = z.infer<typeof BlockParameters$schema>
export const BlockParameters = (input: z.input<typeof BlockParameters$schema>): BlockParameters =>
  BlockParameters$schema.parse(input)
export const BlockParameters$schema = z.object({ maxTransactions: core.NonZero$schema(core.U64$schema) })
export const BlockParameters$codec = core.structCodec<BlockParameters>([
  ['maxTransactions', core.NonZero$codec(core.U64$codec)],
])
export type BlockPayload = z.infer<typeof BlockPayload$schema>
export const BlockPayload = (input: z.input<typeof BlockPayload$schema>): BlockPayload =>
  BlockPayload$schema.parse(input)
export const BlockPayload$schema = z.object({
  header: z.lazy(() => BlockHeader$schema),
  commitTopology: core.Vec$schema(z.lazy(() => PeerId$schema)),
  transactions: core.Vec$schema(z.lazy(() => CommittedTransaction$schema)),
  eventRecommendations: core.Vec$schema(z.lazy(() => EventBox$schema)),
})
export const BlockPayload$codec = core.structCodec<BlockPayload>([
  ['header', core.lazyCodec(() => BlockHeader$codec)],
  ['commitTopology', core.Vec$codec(core.lazyCodec(() => PeerId$codec))],
  ['transactions', core.Vec$codec(core.lazyCodec(() => CommittedTransaction$codec))],
  ['eventRecommendations', core.Vec$codec(core.lazyCodec(() => EventBox$codec))],
])
export type BlockRejectionReason = z.infer<typeof BlockRejectionReason$schema>
export const BlockRejectionReason = (input: z.input<typeof BlockRejectionReason$schema>): BlockRejectionReason =>
  BlockRejectionReason$schema.parse(input)
export const BlockRejectionReason$schema = z.literal('ConsensusBlockRejection')
export const BlockRejectionReason$codec: core.Codec<BlockRejectionReason> = core
  .enumCodec<{ ConsensusBlockRejection: [] }>([[0, 'ConsensusBlockRejection']])
  .literalUnion()
export type BlockSignature = z.infer<typeof BlockSignature$schema>
export const BlockSignature = (input: z.input<typeof BlockSignature$schema>): BlockSignature =>
  BlockSignature$schema.parse(input)
export const BlockSignature$schema = z.object({
  peerTopologyIndex: core.U64$schema,
  signature: z.lazy(() => Signature$schema),
})
export const BlockSignature$codec = core.structCodec<BlockSignature>([
  ['peerTopologyIndex', core.U64$codec],
  ['signature', core.lazyCodec(() => Signature$codec)],
])
export type BlockStatus = z.infer<typeof BlockStatus$schema>
export const BlockStatus = (input: z.input<typeof BlockStatus$schema>): BlockStatus => BlockStatus$schema.parse(input)
export const BlockStatus$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Approved') }),
  z.object({ t: z.literal('Rejected'), value: z.lazy(() => BlockRejectionReason$schema) }),
  z.object({ t: z.literal('Committed') }),
  z.object({ t: z.literal('Applied') }),
])
export const BlockStatus$codec: core.Codec<BlockStatus> = core
  .enumCodec<{ Approved: []; Rejected: [BlockRejectionReason]; Committed: []; Applied: [] }>([
    [0, 'Approved'],
    [1, 'Rejected', core.lazyCodec(() => BlockRejectionReason$codec)],
    [2, 'Committed'],
    [3, 'Applied'],
  ])
  .discriminated()
export type BlockSubscriptionRequest = z.infer<typeof BlockSubscriptionRequest$schema>
export const BlockSubscriptionRequest = (
  input: z.input<typeof BlockSubscriptionRequest$schema>,
): BlockSubscriptionRequest => BlockSubscriptionRequest$schema.parse(input)
export const BlockSubscriptionRequest$schema = z.object({ fromBlockHeight: core.NonZero$schema(core.U64$schema) })
export const BlockSubscriptionRequest$codec = core.structCodec<BlockSubscriptionRequest>([
  ['fromBlockHeight', core.NonZero$codec(core.U64$codec)],
])
export interface Burn<T0, T1> {
  object: T0
  destination: T1
}
export const Burn$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Burn$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.structCodec([
    ['object', t0],
    ['destination', t1],
  ])
export type BurnBox = z.infer<typeof BurnBox$schema>
export const BurnBox = (input: z.input<typeof BurnBox$schema>): BurnBox => BurnBox$schema.parse(input)
export const BurnBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Asset'),
    value: z.lazy(() =>
      Burn$schema(
        z.lazy(() => Numeric$schema),
        z.lazy(() => AssetId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('TriggerRepetitions'),
    value: z.lazy(() =>
      Burn$schema(
        core.U32$schema,
        z.lazy(() => TriggerId$schema),
      ),
    ),
  }),
])
export const BurnBox$codec: core.Codec<BurnBox> = core
  .enumCodec<{ Asset: [Burn<Numeric, AssetId>]; TriggerRepetitions: [Burn<core.U32, TriggerId>] }>([
    [
      0,
      'Asset',
      core.lazyCodec(() =>
        Burn$codec(
          core.lazyCodec(() => Numeric$codec),
          core.lazyCodec(() => AssetId$codec),
        ),
      ),
    ],
    [
      1,
      'TriggerRepetitions',
      core.lazyCodec(() =>
        Burn$codec(
          core.U32$codec,
          core.lazyCodec(() => TriggerId$codec),
        ),
      ),
    ],
  ])
  .discriminated()
export type CanBurnAssetWithDefinition = z.infer<typeof CanBurnAssetWithDefinition$schema>
export const CanBurnAssetWithDefinition = (
  input: z.input<typeof CanBurnAssetWithDefinition$schema>,
): CanBurnAssetWithDefinition => CanBurnAssetWithDefinition$schema.parse(input)
export const CanBurnAssetWithDefinition$schema = z.object({ assetDefinition: z.lazy(() => AssetDefinitionId$schema) })
export const CanBurnAssetWithDefinition$codec = core.structCodec<CanBurnAssetWithDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanBurnUserAsset = z.infer<typeof CanBurnUserAsset$schema>
export const CanBurnUserAsset = (input: z.input<typeof CanBurnUserAsset$schema>): CanBurnUserAsset =>
  CanBurnUserAsset$schema.parse(input)
export const CanBurnUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanBurnUserAsset$codec = core.structCodec<CanBurnUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanBurnUserTrigger = z.infer<typeof CanBurnUserTrigger$schema>
export const CanBurnUserTrigger = (input: z.input<typeof CanBurnUserTrigger$schema>): CanBurnUserTrigger =>
  CanBurnUserTrigger$schema.parse(input)
export const CanBurnUserTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanBurnUserTrigger$codec = core.structCodec<CanBurnUserTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
])
export type CanExecuteUserTrigger = z.infer<typeof CanExecuteUserTrigger$schema>
export const CanExecuteUserTrigger = (input: z.input<typeof CanExecuteUserTrigger$schema>): CanExecuteUserTrigger =>
  CanExecuteUserTrigger$schema.parse(input)
export const CanExecuteUserTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanExecuteUserTrigger$codec = core.structCodec<CanExecuteUserTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
])
export type CanMintAssetWithDefinition = z.infer<typeof CanMintAssetWithDefinition$schema>
export const CanMintAssetWithDefinition = (
  input: z.input<typeof CanMintAssetWithDefinition$schema>,
): CanMintAssetWithDefinition => CanMintAssetWithDefinition$schema.parse(input)
export const CanMintAssetWithDefinition$schema = z.object({ assetDefinition: z.lazy(() => AssetDefinitionId$schema) })
export const CanMintAssetWithDefinition$codec = core.structCodec<CanMintAssetWithDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanMintUserAsset = z.infer<typeof CanMintUserAsset$schema>
export const CanMintUserAsset = (input: z.input<typeof CanMintUserAsset$schema>): CanMintUserAsset =>
  CanMintUserAsset$schema.parse(input)
export const CanMintUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanMintUserAsset$codec = core.structCodec<CanMintUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanMintUserTrigger = z.infer<typeof CanMintUserTrigger$schema>
export const CanMintUserTrigger = (input: z.input<typeof CanMintUserTrigger$schema>): CanMintUserTrigger =>
  CanMintUserTrigger$schema.parse(input)
export const CanMintUserTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanMintUserTrigger$codec = core.structCodec<CanMintUserTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
])
export type CanRegisterAccountInDomain = z.infer<typeof CanRegisterAccountInDomain$schema>
export const CanRegisterAccountInDomain = (
  input: z.input<typeof CanRegisterAccountInDomain$schema>,
): CanRegisterAccountInDomain => CanRegisterAccountInDomain$schema.parse(input)
export const CanRegisterAccountInDomain$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const CanRegisterAccountInDomain$codec = core.structCodec<CanRegisterAccountInDomain>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type CanRegisterAssetDefinitionInDomain = z.infer<typeof CanRegisterAssetDefinitionInDomain$schema>
export const CanRegisterAssetDefinitionInDomain = (
  input: z.input<typeof CanRegisterAssetDefinitionInDomain$schema>,
): CanRegisterAssetDefinitionInDomain => CanRegisterAssetDefinitionInDomain$schema.parse(input)
export const CanRegisterAssetDefinitionInDomain$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const CanRegisterAssetDefinitionInDomain$codec = core.structCodec<CanRegisterAssetDefinitionInDomain>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type CanRegisterAssetWithDefinition = z.infer<typeof CanRegisterAssetWithDefinition$schema>
export const CanRegisterAssetWithDefinition = (
  input: z.input<typeof CanRegisterAssetWithDefinition$schema>,
): CanRegisterAssetWithDefinition => CanRegisterAssetWithDefinition$schema.parse(input)
export const CanRegisterAssetWithDefinition$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const CanRegisterAssetWithDefinition$codec = core.structCodec<CanRegisterAssetWithDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanRegisterUserTrigger = z.infer<typeof CanRegisterUserTrigger$schema>
export const CanRegisterUserTrigger = (input: z.input<typeof CanRegisterUserTrigger$schema>): CanRegisterUserTrigger =>
  CanRegisterUserTrigger$schema.parse(input)
export const CanRegisterUserTrigger$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const CanRegisterUserTrigger$codec = core.structCodec<CanRegisterUserTrigger>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type CanRemoveKeyValueInAccount = z.infer<typeof CanRemoveKeyValueInAccount$schema>
export const CanRemoveKeyValueInAccount = (
  input: z.input<typeof CanRemoveKeyValueInAccount$schema>,
): CanRemoveKeyValueInAccount => CanRemoveKeyValueInAccount$schema.parse(input)
export const CanRemoveKeyValueInAccount$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const CanRemoveKeyValueInAccount$codec = core.structCodec<CanRemoveKeyValueInAccount>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type CanRemoveKeyValueInAssetDefinition = z.infer<typeof CanRemoveKeyValueInAssetDefinition$schema>
export const CanRemoveKeyValueInAssetDefinition = (
  input: z.input<typeof CanRemoveKeyValueInAssetDefinition$schema>,
): CanRemoveKeyValueInAssetDefinition => CanRemoveKeyValueInAssetDefinition$schema.parse(input)
export const CanRemoveKeyValueInAssetDefinition$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const CanRemoveKeyValueInAssetDefinition$codec = core.structCodec<CanRemoveKeyValueInAssetDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanRemoveKeyValueInDomain = z.infer<typeof CanRemoveKeyValueInDomain$schema>
export const CanRemoveKeyValueInDomain = (
  input: z.input<typeof CanRemoveKeyValueInDomain$schema>,
): CanRemoveKeyValueInDomain => CanRemoveKeyValueInDomain$schema.parse(input)
export const CanRemoveKeyValueInDomain$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const CanRemoveKeyValueInDomain$codec = core.structCodec<CanRemoveKeyValueInDomain>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type CanRemoveKeyValueInTrigger = z.infer<typeof CanRemoveKeyValueInTrigger$schema>
export const CanRemoveKeyValueInTrigger = (
  input: z.input<typeof CanRemoveKeyValueInTrigger$schema>,
): CanRemoveKeyValueInTrigger => CanRemoveKeyValueInTrigger$schema.parse(input)
export const CanRemoveKeyValueInTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanRemoveKeyValueInTrigger$codec = core.structCodec<CanRemoveKeyValueInTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
])
export type CanRemoveKeyValueInUserAsset = z.infer<typeof CanRemoveKeyValueInUserAsset$schema>
export const CanRemoveKeyValueInUserAsset = (
  input: z.input<typeof CanRemoveKeyValueInUserAsset$schema>,
): CanRemoveKeyValueInUserAsset => CanRemoveKeyValueInUserAsset$schema.parse(input)
export const CanRemoveKeyValueInUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanRemoveKeyValueInUserAsset$codec = core.structCodec<CanRemoveKeyValueInUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanSetKeyValueInAccount = z.infer<typeof CanSetKeyValueInAccount$schema>
export const CanSetKeyValueInAccount = (
  input: z.input<typeof CanSetKeyValueInAccount$schema>,
): CanSetKeyValueInAccount => CanSetKeyValueInAccount$schema.parse(input)
export const CanSetKeyValueInAccount$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const CanSetKeyValueInAccount$codec = core.structCodec<CanSetKeyValueInAccount>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type CanSetKeyValueInAssetDefinition = z.infer<typeof CanSetKeyValueInAssetDefinition$schema>
export const CanSetKeyValueInAssetDefinition = (
  input: z.input<typeof CanSetKeyValueInAssetDefinition$schema>,
): CanSetKeyValueInAssetDefinition => CanSetKeyValueInAssetDefinition$schema.parse(input)
export const CanSetKeyValueInAssetDefinition$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const CanSetKeyValueInAssetDefinition$codec = core.structCodec<CanSetKeyValueInAssetDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanSetKeyValueInDomain = z.infer<typeof CanSetKeyValueInDomain$schema>
export const CanSetKeyValueInDomain = (input: z.input<typeof CanSetKeyValueInDomain$schema>): CanSetKeyValueInDomain =>
  CanSetKeyValueInDomain$schema.parse(input)
export const CanSetKeyValueInDomain$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const CanSetKeyValueInDomain$codec = core.structCodec<CanSetKeyValueInDomain>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type CanSetKeyValueInTrigger = z.infer<typeof CanSetKeyValueInTrigger$schema>
export const CanSetKeyValueInTrigger = (
  input: z.input<typeof CanSetKeyValueInTrigger$schema>,
): CanSetKeyValueInTrigger => CanSetKeyValueInTrigger$schema.parse(input)
export const CanSetKeyValueInTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanSetKeyValueInTrigger$codec = core.structCodec<CanSetKeyValueInTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
])
export type CanSetKeyValueInUserAsset = z.infer<typeof CanSetKeyValueInUserAsset$schema>
export const CanSetKeyValueInUserAsset = (
  input: z.input<typeof CanSetKeyValueInUserAsset$schema>,
): CanSetKeyValueInUserAsset => CanSetKeyValueInUserAsset$schema.parse(input)
export const CanSetKeyValueInUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanSetKeyValueInUserAsset$codec = core.structCodec<CanSetKeyValueInUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanTransferAssetWithDefinition = z.infer<typeof CanTransferAssetWithDefinition$schema>
export const CanTransferAssetWithDefinition = (
  input: z.input<typeof CanTransferAssetWithDefinition$schema>,
): CanTransferAssetWithDefinition => CanTransferAssetWithDefinition$schema.parse(input)
export const CanTransferAssetWithDefinition$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const CanTransferAssetWithDefinition$codec = core.structCodec<CanTransferAssetWithDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanTransferUserAsset = z.infer<typeof CanTransferUserAsset$schema>
export const CanTransferUserAsset = (input: z.input<typeof CanTransferUserAsset$schema>): CanTransferUserAsset =>
  CanTransferUserAsset$schema.parse(input)
export const CanTransferUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanTransferUserAsset$codec = core.structCodec<CanTransferUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanUnregisterAccount = z.infer<typeof CanUnregisterAccount$schema>
export const CanUnregisterAccount = (input: z.input<typeof CanUnregisterAccount$schema>): CanUnregisterAccount =>
  CanUnregisterAccount$schema.parse(input)
export const CanUnregisterAccount$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const CanUnregisterAccount$codec = core.structCodec<CanUnregisterAccount>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type CanUnregisterAssetDefinition = z.infer<typeof CanUnregisterAssetDefinition$schema>
export const CanUnregisterAssetDefinition = (
  input: z.input<typeof CanUnregisterAssetDefinition$schema>,
): CanUnregisterAssetDefinition => CanUnregisterAssetDefinition$schema.parse(input)
export const CanUnregisterAssetDefinition$schema = z.object({ assetDefinition: z.lazy(() => AssetDefinitionId$schema) })
export const CanUnregisterAssetDefinition$codec = core.structCodec<CanUnregisterAssetDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanUnregisterAssetWithDefinition = z.infer<typeof CanUnregisterAssetWithDefinition$schema>
export const CanUnregisterAssetWithDefinition = (
  input: z.input<typeof CanUnregisterAssetWithDefinition$schema>,
): CanUnregisterAssetWithDefinition => CanUnregisterAssetWithDefinition$schema.parse(input)
export const CanUnregisterAssetWithDefinition$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const CanUnregisterAssetWithDefinition$codec = core.structCodec<CanUnregisterAssetWithDefinition>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type CanUnregisterDomain = z.infer<typeof CanUnregisterDomain$schema>
export const CanUnregisterDomain = (input: z.input<typeof CanUnregisterDomain$schema>): CanUnregisterDomain =>
  CanUnregisterDomain$schema.parse(input)
export const CanUnregisterDomain$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const CanUnregisterDomain$codec = core.structCodec<CanUnregisterDomain>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type CanUnregisterUserAsset = z.infer<typeof CanUnregisterUserAsset$schema>
export const CanUnregisterUserAsset = (input: z.input<typeof CanUnregisterUserAsset$schema>): CanUnregisterUserAsset =>
  CanUnregisterUserAsset$schema.parse(input)
export const CanUnregisterUserAsset$schema = z.object({ asset: z.lazy(() => AssetId$schema) })
export const CanUnregisterUserAsset$codec = core.structCodec<CanUnregisterUserAsset>([
  ['asset', core.lazyCodec(() => AssetId$codec)],
])
export type CanUnregisterUserTrigger = z.infer<typeof CanUnregisterUserTrigger$schema>
export const CanUnregisterUserTrigger = (
  input: z.input<typeof CanUnregisterUserTrigger$schema>,
): CanUnregisterUserTrigger => CanUnregisterUserTrigger$schema.parse(input)
export const CanUnregisterUserTrigger$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const CanUnregisterUserTrigger$codec = core.structCodec<CanUnregisterUserTrigger>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type ChainId = z.infer<typeof ChainId$schema>
export const ChainId = (input: z.input<typeof ChainId$schema>): ChainId => ChainId$schema.parse(input)
export const ChainId$schema = z.string().brand<'ChainId'>()
export const ChainId$codec = core.String$codec as core.Codec<ChainId>
export type ClientQueryPayload = z.infer<typeof ClientQueryPayload$schema>
export const ClientQueryPayload = (input: z.input<typeof ClientQueryPayload$schema>): ClientQueryPayload =>
  ClientQueryPayload$schema.parse(input)
export const ClientQueryPayload$schema = z.object({
  authority: z.lazy(() => AccountId$schema),
  query: z.lazy(() => QueryBox$schema),
  filter: z.lazy(() => PredicateBox$schema),
  sorting: z.lazy(() => Sorting$schema),
  pagination: z.lazy(() => Pagination$schema),
  fetchSize: z.lazy(() => FetchSize$schema),
})
export const ClientQueryPayload$codec = core.structCodec<ClientQueryPayload>([
  ['authority', core.lazyCodec(() => AccountId$codec)],
  ['query', core.lazyCodec(() => QueryBox$codec)],
  ['filter', core.lazyCodec(() => PredicateBox$codec)],
  ['sorting', core.lazyCodec(() => Sorting$codec)],
  ['pagination', core.lazyCodec(() => Pagination$codec)],
  ['fetchSize', core.lazyCodec(() => FetchSize$codec)],
])
export type CommittedTransaction = z.infer<typeof CommittedTransaction$schema>
export const CommittedTransaction = (input: z.input<typeof CommittedTransaction$schema>): CommittedTransaction =>
  CommittedTransaction$schema.parse(input)
export const CommittedTransaction$schema = z.object({
  value: z.lazy(() => SignedTransaction$schema),
  error: core.Option$schema(z.lazy(() => TransactionRejectionReason$schema)),
})
export const CommittedTransaction$codec = core.structCodec<CommittedTransaction>([
  ['value', core.lazyCodec(() => SignedTransaction$codec)],
  ['error', core.Option$codec(core.lazyCodec(() => TransactionRejectionReason$codec))],
])
export type ConfigurationEvent = z.infer<typeof ConfigurationEvent$schema>
export const ConfigurationEvent = (input: z.input<typeof ConfigurationEvent$schema>): ConfigurationEvent =>
  ConfigurationEvent$schema.parse(input)
export const ConfigurationEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Changed'), value: z.lazy(() => ParameterChanged$schema) }),
])
export const ConfigurationEvent$codec: core.Codec<ConfigurationEvent> = core
  .enumCodec<{ Changed: [ParameterChanged] }>([[0, 'Changed', core.lazyCodec(() => ParameterChanged$codec)]])
  .discriminated()
export type ConfigurationEventFilter = z.infer<typeof ConfigurationEventFilter$schema>
export const ConfigurationEventFilter = (
  input: z.input<typeof ConfigurationEventFilter$schema>,
): ConfigurationEventFilter => ConfigurationEventFilter$schema.parse(input)
export const ConfigurationEventFilter$schema = z.object({ eventSet: z.lazy(() => ConfigurationEventSet$schema) })
export const ConfigurationEventFilter$codec = core.structCodec<ConfigurationEventFilter>([
  ['eventSet', core.lazyCodec(() => ConfigurationEventSet$codec)],
])
export type ConfigurationEventSet = z.infer<typeof ConfigurationEventSet$schema>
export const ConfigurationEventSet = (input: z.input<typeof ConfigurationEventSet$schema>): ConfigurationEventSet =>
  ConfigurationEventSet$schema.parse(input)
const ConfigurationEventSet$literalSchema = z.literal('Changed')
export const ConfigurationEventSet$schema = z
  .set(ConfigurationEventSet$literalSchema)
  .or(z.array(ConfigurationEventSet$literalSchema).transform((arr) => new Set(arr)))
export const ConfigurationEventSet$codec = core.bitmap<ConfigurationEventSet extends Set<infer T> ? T : never>({
  Changed: 1,
})
export type Container = z.infer<typeof Container$schema>
export const Container = (input: z.input<typeof Container$schema>): Container => Container$schema.parse(input)
export const Container$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Any'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  z.object({ t: z.literal('All'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  z.object({ t: z.literal('AtIndex'), value: z.lazy(() => AtIndex$schema) }),
])
export const Container$codec: core.Codec<Container> = core
  .enumCodec<{ Any: [QueryOutputPredicate]; All: [QueryOutputPredicate]; AtIndex: [AtIndex] }>([
    [0, 'Any', core.lazyCodec(() => QueryOutputPredicate$codec)],
    [1, 'All', core.lazyCodec(() => QueryOutputPredicate$codec)],
    [2, 'AtIndex', core.lazyCodec(() => AtIndex$codec)],
  ])
  .discriminated()
export type CustomInstruction = z.infer<typeof CustomInstruction$schema>
export const CustomInstruction = (input: z.input<typeof CustomInstruction$schema>): CustomInstruction =>
  CustomInstruction$schema.parse(input)
export const CustomInstruction$schema = z.object({ payload: core.Json$schema })
export const CustomInstruction$codec = core.structCodec<CustomInstruction>([['payload', core.Json$codec]])
export type CustomParameter = z.infer<typeof CustomParameter$schema>
export const CustomParameter = (input: z.input<typeof CustomParameter$schema>): CustomParameter =>
  CustomParameter$schema.parse(input)
export const CustomParameter$schema = z.object({
  id: z.lazy(() => CustomParameterId$schema),
  payload: core.Json$schema,
})
export const CustomParameter$codec = core.structCodec<CustomParameter>([
  ['id', core.lazyCodec(() => CustomParameterId$codec)],
  ['payload', core.Json$codec],
])
export type CustomParameterId = core.Name
export const CustomParameterId = (input: z.input<typeof CustomParameterId$schema>): CustomParameterId =>
  CustomParameterId$schema.parse(input)
export const CustomParameterId$schema = core.Name$schema
export const CustomParameterId$codec = core.Name$codec
export type DataEvent = z.infer<typeof DataEvent$schema>
export const DataEvent = (input: z.input<typeof DataEvent$schema>): DataEvent => DataEvent$schema.parse(input)
export const DataEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerEvent$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainEvent$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerEvent$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => RoleEvent$schema) }),
  z.object({ t: z.literal('Configuration'), value: z.lazy(() => ConfigurationEvent$schema) }),
  z.object({ t: z.literal('Executor'), value: z.lazy(() => ExecutorEvent$schema) }),
])
export const DataEvent$codec: core.Codec<DataEvent> = core
  .enumCodec<{
    Peer: [PeerEvent]
    Domain: [DomainEvent]
    Trigger: [TriggerEvent]
    Role: [RoleEvent]
    Configuration: [ConfigurationEvent]
    Executor: [ExecutorEvent]
  }>([
    [0, 'Peer', core.lazyCodec(() => PeerEvent$codec)],
    [1, 'Domain', core.lazyCodec(() => DomainEvent$codec)],
    [2, 'Trigger', core.lazyCodec(() => TriggerEvent$codec)],
    [3, 'Role', core.lazyCodec(() => RoleEvent$codec)],
    [4, 'Configuration', core.lazyCodec(() => ConfigurationEvent$codec)],
    [5, 'Executor', core.lazyCodec(() => ExecutorEvent$codec)],
  ])
  .discriminated()
export type DataEventFilter = z.infer<typeof DataEventFilter$schema>
export const DataEventFilter = (input: z.input<typeof DataEventFilter$schema>): DataEventFilter =>
  DataEventFilter$schema.parse(input)
export const DataEventFilter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Any') }),
  z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerEventFilter$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainEventFilter$schema) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => AccountEventFilter$schema) }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetEventFilter$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionEventFilter$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerEventFilter$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => RoleEventFilter$schema) }),
  z.object({ t: z.literal('Configuration'), value: z.lazy(() => ConfigurationEventFilter$schema) }),
  z.object({ t: z.literal('Executor'), value: z.lazy(() => ExecutorEventFilter$schema) }),
])
export const DataEventFilter$codec: core.Codec<DataEventFilter> = core
  .enumCodec<{
    Any: []
    Peer: [PeerEventFilter]
    Domain: [DomainEventFilter]
    Account: [AccountEventFilter]
    Asset: [AssetEventFilter]
    AssetDefinition: [AssetDefinitionEventFilter]
    Trigger: [TriggerEventFilter]
    Role: [RoleEventFilter]
    Configuration: [ConfigurationEventFilter]
    Executor: [ExecutorEventFilter]
  }>([
    [0, 'Any'],
    [1, 'Peer', core.lazyCodec(() => PeerEventFilter$codec)],
    [2, 'Domain', core.lazyCodec(() => DomainEventFilter$codec)],
    [3, 'Account', core.lazyCodec(() => AccountEventFilter$codec)],
    [4, 'Asset', core.lazyCodec(() => AssetEventFilter$codec)],
    [5, 'AssetDefinition', core.lazyCodec(() => AssetDefinitionEventFilter$codec)],
    [6, 'Trigger', core.lazyCodec(() => TriggerEventFilter$codec)],
    [7, 'Role', core.lazyCodec(() => RoleEventFilter$codec)],
    [8, 'Configuration', core.lazyCodec(() => ConfigurationEventFilter$codec)],
    [9, 'Executor', core.lazyCodec(() => ExecutorEventFilter$codec)],
  ])
  .discriminated()
export type Domain = z.infer<typeof Domain$schema>
export const Domain = (input: z.input<typeof Domain$schema>): Domain => Domain$schema.parse(input)
export const Domain$schema = z.object({
  id: z.lazy(() => DomainId$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
  ownedBy: z.lazy(() => AccountId$schema),
})
export const Domain$codec = core.structCodec<Domain>([
  ['id', core.lazyCodec(() => DomainId$codec)],
  ['logo', core.Option$codec(core.lazyCodec(() => IpfsPath$codec))],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
  ['ownedBy', core.lazyCodec(() => AccountId$codec)],
])
export type DomainEvent = z.infer<typeof DomainEvent$schema>
export const DomainEvent = (input: z.input<typeof DomainEvent$schema>): DomainEvent => DomainEvent$schema.parse(input)
export const DomainEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => Domain$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => DomainId$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionEvent$schema) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => AccountEvent$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => DomainId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => DomainId$schema))),
  }),
  z.object({ t: z.literal('OwnerChanged'), value: z.lazy(() => DomainOwnerChanged$schema) }),
])
export const DomainEvent$codec: core.Codec<DomainEvent> = core
  .enumCodec<{
    Created: [Domain]
    Deleted: [DomainId]
    AssetDefinition: [AssetDefinitionEvent]
    Account: [AccountEvent]
    MetadataInserted: [MetadataChanged<DomainId>]
    MetadataRemoved: [MetadataChanged<DomainId>]
    OwnerChanged: [DomainOwnerChanged]
  }>([
    [0, 'Created', core.lazyCodec(() => Domain$codec)],
    [1, 'Deleted', core.lazyCodec(() => DomainId$codec)],
    [2, 'AssetDefinition', core.lazyCodec(() => AssetDefinitionEvent$codec)],
    [3, 'Account', core.lazyCodec(() => AccountEvent$codec)],
    [4, 'MetadataInserted', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => DomainId$codec)))],
    [5, 'MetadataRemoved', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => DomainId$codec)))],
    [6, 'OwnerChanged', core.lazyCodec(() => DomainOwnerChanged$codec)],
  ])
  .discriminated()
export type DomainEventFilter = z.infer<typeof DomainEventFilter$schema>
export const DomainEventFilter = (input: z.input<typeof DomainEventFilter$schema>): DomainEventFilter =>
  DomainEventFilter$schema.parse(input)
export const DomainEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => DomainId$schema)),
  eventSet: z.lazy(() => DomainEventSet$schema),
})
export const DomainEventFilter$codec = core.structCodec<DomainEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => DomainId$codec))],
  ['eventSet', core.lazyCodec(() => DomainEventSet$codec)],
])
export type DomainEventSet = z.infer<typeof DomainEventSet$schema>
export const DomainEventSet = (input: z.input<typeof DomainEventSet$schema>): DomainEventSet =>
  DomainEventSet$schema.parse(input)
const DomainEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('AnyAssetDefinition'),
  z.literal('AnyAccount'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
  z.literal('OwnerChanged'),
])
export const DomainEventSet$schema = z
  .set(DomainEventSet$literalSchema)
  .or(z.array(DomainEventSet$literalSchema).transform((arr) => new Set(arr)))
export const DomainEventSet$codec = core.bitmap<DomainEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  AnyAssetDefinition: 4,
  AnyAccount: 8,
  MetadataInserted: 16,
  MetadataRemoved: 32,
  OwnerChanged: 64,
})
export type DomainId = z.infer<typeof DomainId$schema>
export const DomainId = (input: z.input<typeof DomainId$schema>): DomainId => DomainId$schema.parse(input)
export const DomainId$schema = core.Name$schema.brand<'DomainId'>()
export const DomainId$codec = core.Name$codec as core.Codec<DomainId>
export type DomainOwnerChanged = z.infer<typeof DomainOwnerChanged$schema>
export const DomainOwnerChanged = (input: z.input<typeof DomainOwnerChanged$schema>): DomainOwnerChanged =>
  DomainOwnerChanged$schema.parse(input)
export const DomainOwnerChanged$schema = z.object({
  domain: z.lazy(() => DomainId$schema),
  newOwner: z.lazy(() => AccountId$schema),
})
export const DomainOwnerChanged$codec = core.structCodec<DomainOwnerChanged>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
  ['newOwner', core.lazyCodec(() => AccountId$codec)],
])
export type EventBox = z.infer<typeof EventBox$schema>
export const EventBox = (input: z.input<typeof EventBox$schema>): EventBox => EventBox$schema.parse(input)
export const EventBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEvent$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => TimeEvent$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEvent$schema) }),
  z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEvent$schema) }),
])
export const EventBox$codec: core.Codec<EventBox> = core
  .enumCodec<{
    Pipeline: [PipelineEventBox]
    Data: [DataEvent]
    Time: [TimeEvent]
    ExecuteTrigger: [ExecuteTriggerEvent]
    TriggerCompleted: [TriggerCompletedEvent]
  }>([
    [0, 'Pipeline', core.lazyCodec(() => PipelineEventBox$codec)],
    [1, 'Data', core.lazyCodec(() => DataEvent$codec)],
    [2, 'Time', core.lazyCodec(() => TimeEvent$codec)],
    [3, 'ExecuteTrigger', core.lazyCodec(() => ExecuteTriggerEvent$codec)],
    [4, 'TriggerCompleted', core.lazyCodec(() => TriggerCompletedEvent$codec)],
  ])
  .discriminated()
export type EventFilterBox = z.infer<typeof EventFilterBox$schema>
export const EventFilterBox = (input: z.input<typeof EventFilterBox$schema>): EventFilterBox =>
  EventFilterBox$schema.parse(input)
export const EventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventFilterBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEventFilter$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => ExecutionTime$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEventFilter$schema) }),
  z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEventFilter$schema) }),
])
export const EventFilterBox$codec: core.Codec<EventFilterBox> = core
  .enumCodec<{
    Pipeline: [PipelineEventFilterBox]
    Data: [DataEventFilter]
    Time: [ExecutionTime]
    ExecuteTrigger: [ExecuteTriggerEventFilter]
    TriggerCompleted: [TriggerCompletedEventFilter]
  }>([
    [0, 'Pipeline', core.lazyCodec(() => PipelineEventFilterBox$codec)],
    [1, 'Data', core.lazyCodec(() => DataEventFilter$codec)],
    [2, 'Time', core.lazyCodec(() => ExecutionTime$codec)],
    [3, 'ExecuteTrigger', core.lazyCodec(() => ExecuteTriggerEventFilter$codec)],
    [4, 'TriggerCompleted', core.lazyCodec(() => TriggerCompletedEventFilter$codec)],
  ])
  .discriminated()
export type EventSubscriptionRequest = z.infer<typeof EventSubscriptionRequest$schema>
export const EventSubscriptionRequest = (
  input: z.input<typeof EventSubscriptionRequest$schema>,
): EventSubscriptionRequest => EventSubscriptionRequest$schema.parse(input)
export const EventSubscriptionRequest$schema = z.object({
  filters: core.Vec$schema(z.lazy(() => EventFilterBox$schema)),
})
export const EventSubscriptionRequest$codec = core.structCodec<EventSubscriptionRequest>([
  ['filters', core.Vec$codec(core.lazyCodec(() => EventFilterBox$codec))],
])
export type Executable = z.infer<typeof Executable$schema>
export const Executable = (input: z.input<typeof Executable$schema>): Executable => Executable$schema.parse(input)
export const Executable$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Instructions'), value: core.Vec$schema(z.lazy(() => InstructionBox$schema)) }),
  z.object({ t: z.literal('Wasm'), value: z.lazy(() => WasmSmartContract$schema) }),
])
export const Executable$codec: core.Codec<Executable> = core
  .enumCodec<{ Instructions: [core.Vec<InstructionBox>]; Wasm: [WasmSmartContract] }>([
    [0, 'Instructions', core.Vec$codec(core.lazyCodec(() => InstructionBox$codec))],
    [1, 'Wasm', core.lazyCodec(() => WasmSmartContract$codec)],
  ])
  .discriminated()
export type ExecuteTrigger = z.infer<typeof ExecuteTrigger$schema>
export const ExecuteTrigger = (input: z.input<typeof ExecuteTrigger$schema>): ExecuteTrigger =>
  ExecuteTrigger$schema.parse(input)
export const ExecuteTrigger$schema = z.object({
  trigger: z.lazy(() => TriggerId$schema),
  args: core.Option$schema(core.Json$schema),
})
export const ExecuteTrigger$codec = core.structCodec<ExecuteTrigger>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
  ['args', core.Option$codec(core.Json$codec)],
])
export type ExecuteTriggerEvent = z.infer<typeof ExecuteTriggerEvent$schema>
export const ExecuteTriggerEvent = (input: z.input<typeof ExecuteTriggerEvent$schema>): ExecuteTriggerEvent =>
  ExecuteTriggerEvent$schema.parse(input)
export const ExecuteTriggerEvent$schema = z.object({
  triggerId: z.lazy(() => TriggerId$schema),
  authority: z.lazy(() => AccountId$schema),
  args: core.Option$schema(core.Json$schema),
})
export const ExecuteTriggerEvent$codec = core.structCodec<ExecuteTriggerEvent>([
  ['triggerId', core.lazyCodec(() => TriggerId$codec)],
  ['authority', core.lazyCodec(() => AccountId$codec)],
  ['args', core.Option$codec(core.Json$codec)],
])
export type ExecuteTriggerEventFilter = z.infer<typeof ExecuteTriggerEventFilter$schema>
export const ExecuteTriggerEventFilter = (
  input: z.input<typeof ExecuteTriggerEventFilter$schema>,
): ExecuteTriggerEventFilter => ExecuteTriggerEventFilter$schema.parse(input)
export const ExecuteTriggerEventFilter$schema = z.object({
  triggerId: core.Option$schema(z.lazy(() => TriggerId$schema)),
  authority: core.Option$schema(z.lazy(() => AccountId$schema)),
})
export const ExecuteTriggerEventFilter$codec = core.structCodec<ExecuteTriggerEventFilter>([
  ['triggerId', core.Option$codec(core.lazyCodec(() => TriggerId$codec))],
  ['authority', core.Option$codec(core.lazyCodec(() => AccountId$codec))],
])
export type ExecutionTime = z.infer<typeof ExecutionTime$schema>
export const ExecutionTime = (input: z.input<typeof ExecutionTime$schema>): ExecutionTime =>
  ExecutionTime$schema.parse(input)
export const ExecutionTime$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('PreCommit') }),
  z.object({ t: z.literal('Schedule'), value: z.lazy(() => Schedule$schema) }),
])
export const ExecutionTime$codec: core.Codec<ExecutionTime> = core
  .enumCodec<{ PreCommit: []; Schedule: [Schedule] }>([
    [0, 'PreCommit'],
    [1, 'Schedule', core.lazyCodec(() => Schedule$codec)],
  ])
  .discriminated()
export type Executor = z.infer<typeof Executor$schema>
export const Executor = (input: z.input<typeof Executor$schema>): Executor => Executor$schema.parse(input)
export const Executor$schema = z.object({ wasm: z.lazy(() => WasmSmartContract$schema) })
export const Executor$codec = core.structCodec<Executor>([['wasm', core.lazyCodec(() => WasmSmartContract$codec)]])
export type ExecutorDataModel = z.infer<typeof ExecutorDataModel$schema>
export const ExecutorDataModel = (input: z.input<typeof ExecutorDataModel$schema>): ExecutorDataModel =>
  ExecutorDataModel$schema.parse(input)
export const ExecutorDataModel$schema = z.object({
  parameters: core.Map$schema(
    z.lazy(() => CustomParameterId$schema),
    z.lazy(() => CustomParameter$schema),
  ),
  instructions: core.Vec$schema(z.string()),
  permissions: core.Vec$schema(z.string()),
  schema: core.Json$schema,
})
export const ExecutorDataModel$codec = core.structCodec<ExecutorDataModel>([
  [
    'parameters',
    core.Map$codec(
      core.lazyCodec(() => CustomParameterId$codec),
      core.lazyCodec(() => CustomParameter$codec),
    ),
  ],
  ['instructions', core.Vec$codec(core.String$codec)],
  ['permissions', core.Vec$codec(core.String$codec)],
  ['schema', core.Json$codec],
])
export type ExecutorEvent = z.infer<typeof ExecutorEvent$schema>
export const ExecutorEvent = (input: z.input<typeof ExecutorEvent$schema>): ExecutorEvent =>
  ExecutorEvent$schema.parse(input)
export const ExecutorEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Upgraded'), value: z.lazy(() => ExecutorUpgrade$schema) }),
])
export const ExecutorEvent$codec: core.Codec<ExecutorEvent> = core
  .enumCodec<{ Upgraded: [ExecutorUpgrade] }>([[0, 'Upgraded', core.lazyCodec(() => ExecutorUpgrade$codec)]])
  .discriminated()
export type ExecutorEventFilter = z.infer<typeof ExecutorEventFilter$schema>
export const ExecutorEventFilter = (input: z.input<typeof ExecutorEventFilter$schema>): ExecutorEventFilter =>
  ExecutorEventFilter$schema.parse(input)
export const ExecutorEventFilter$schema = z.object({ eventSet: z.lazy(() => ExecutorEventSet$schema) })
export const ExecutorEventFilter$codec = core.structCodec<ExecutorEventFilter>([
  ['eventSet', core.lazyCodec(() => ExecutorEventSet$codec)],
])
export type ExecutorEventSet = z.infer<typeof ExecutorEventSet$schema>
export const ExecutorEventSet = (input: z.input<typeof ExecutorEventSet$schema>): ExecutorEventSet =>
  ExecutorEventSet$schema.parse(input)
const ExecutorEventSet$literalSchema = z.literal('Upgraded')
export const ExecutorEventSet$schema = z
  .set(ExecutorEventSet$literalSchema)
  .or(z.array(ExecutorEventSet$literalSchema).transform((arr) => new Set(arr)))
export const ExecutorEventSet$codec = core.bitmap<ExecutorEventSet extends Set<infer T> ? T : never>({ Upgraded: 1 })
export type ExecutorUpgrade = z.infer<typeof ExecutorUpgrade$schema>
export const ExecutorUpgrade = (input: z.input<typeof ExecutorUpgrade$schema>): ExecutorUpgrade =>
  ExecutorUpgrade$schema.parse(input)
export const ExecutorUpgrade$schema = z.object({ newDataModel: z.lazy(() => ExecutorDataModel$schema) })
export const ExecutorUpgrade$codec = core.structCodec<ExecutorUpgrade>([
  ['newDataModel', core.lazyCodec(() => ExecutorDataModel$codec)],
])
export type FetchSize = core.Option<core.NonZero<core.U32>>
export const FetchSize = (input: z.input<typeof FetchSize$schema>): FetchSize => FetchSize$schema.parse(input)
export const FetchSize$schema = core.Option$schema(core.NonZero$schema(core.U32$schema))
export const FetchSize$codec = core.Option$codec(core.NonZero$codec(core.U32$codec))
export type FindAccountById = z.infer<typeof FindAccountById$schema>
export const FindAccountById = (input: z.input<typeof FindAccountById$schema>): FindAccountById =>
  FindAccountById$schema.parse(input)
export const FindAccountById$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindAccountById$codec = core.structCodec<FindAccountById>([['id', core.lazyCodec(() => AccountId$codec)]])
export type FindAccountKeyValueByIdAndKey = z.infer<typeof FindAccountKeyValueByIdAndKey$schema>
export const FindAccountKeyValueByIdAndKey = (
  input: z.input<typeof FindAccountKeyValueByIdAndKey$schema>,
): FindAccountKeyValueByIdAndKey => FindAccountKeyValueByIdAndKey$schema.parse(input)
export const FindAccountKeyValueByIdAndKey$schema = z.object({
  id: z.lazy(() => AccountId$schema),
  key: core.Name$schema,
})
export const FindAccountKeyValueByIdAndKey$codec = core.structCodec<FindAccountKeyValueByIdAndKey>([
  ['id', core.lazyCodec(() => AccountId$codec)],
  ['key', core.Name$codec],
])
export type FindAccountsByDomainId = z.infer<typeof FindAccountsByDomainId$schema>
export const FindAccountsByDomainId = (input: z.input<typeof FindAccountsByDomainId$schema>): FindAccountsByDomainId =>
  FindAccountsByDomainId$schema.parse(input)
export const FindAccountsByDomainId$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const FindAccountsByDomainId$codec = core.structCodec<FindAccountsByDomainId>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type FindAccountsWithAsset = z.infer<typeof FindAccountsWithAsset$schema>
export const FindAccountsWithAsset = (input: z.input<typeof FindAccountsWithAsset$schema>): FindAccountsWithAsset =>
  FindAccountsWithAsset$schema.parse(input)
export const FindAccountsWithAsset$schema = z.object({ assetDefinition: z.lazy(() => AssetDefinitionId$schema) })
export const FindAccountsWithAsset$codec = core.structCodec<FindAccountsWithAsset>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type FindAssetById = z.infer<typeof FindAssetById$schema>
export const FindAssetById = (input: z.input<typeof FindAssetById$schema>): FindAssetById =>
  FindAssetById$schema.parse(input)
export const FindAssetById$schema = z.object({ id: z.lazy(() => AssetId$schema) })
export const FindAssetById$codec = core.structCodec<FindAssetById>([['id', core.lazyCodec(() => AssetId$codec)]])
export type FindAssetDefinitionById = z.infer<typeof FindAssetDefinitionById$schema>
export const FindAssetDefinitionById = (
  input: z.input<typeof FindAssetDefinitionById$schema>,
): FindAssetDefinitionById => FindAssetDefinitionById$schema.parse(input)
export const FindAssetDefinitionById$schema = z.object({ id: z.lazy(() => AssetDefinitionId$schema) })
export const FindAssetDefinitionById$codec = core.structCodec<FindAssetDefinitionById>([
  ['id', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type FindAssetDefinitionKeyValueByIdAndKey = z.infer<typeof FindAssetDefinitionKeyValueByIdAndKey$schema>
export const FindAssetDefinitionKeyValueByIdAndKey = (
  input: z.input<typeof FindAssetDefinitionKeyValueByIdAndKey$schema>,
): FindAssetDefinitionKeyValueByIdAndKey => FindAssetDefinitionKeyValueByIdAndKey$schema.parse(input)
export const FindAssetDefinitionKeyValueByIdAndKey$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  key: core.Name$schema,
})
export const FindAssetDefinitionKeyValueByIdAndKey$codec = core.structCodec<FindAssetDefinitionKeyValueByIdAndKey>([
  ['id', core.lazyCodec(() => AssetDefinitionId$codec)],
  ['key', core.Name$codec],
])
export type FindAssetKeyValueByIdAndKey = z.infer<typeof FindAssetKeyValueByIdAndKey$schema>
export const FindAssetKeyValueByIdAndKey = (
  input: z.input<typeof FindAssetKeyValueByIdAndKey$schema>,
): FindAssetKeyValueByIdAndKey => FindAssetKeyValueByIdAndKey$schema.parse(input)
export const FindAssetKeyValueByIdAndKey$schema = z.object({ id: z.lazy(() => AssetId$schema), key: core.Name$schema })
export const FindAssetKeyValueByIdAndKey$codec = core.structCodec<FindAssetKeyValueByIdAndKey>([
  ['id', core.lazyCodec(() => AssetId$codec)],
  ['key', core.Name$codec],
])
export type FindAssetQuantityById = z.infer<typeof FindAssetQuantityById$schema>
export const FindAssetQuantityById = (input: z.input<typeof FindAssetQuantityById$schema>): FindAssetQuantityById =>
  FindAssetQuantityById$schema.parse(input)
export const FindAssetQuantityById$schema = z.object({ id: z.lazy(() => AssetId$schema) })
export const FindAssetQuantityById$codec = core.structCodec<FindAssetQuantityById>([
  ['id', core.lazyCodec(() => AssetId$codec)],
])
export type FindAssetsByAccountId = z.infer<typeof FindAssetsByAccountId$schema>
export const FindAssetsByAccountId = (input: z.input<typeof FindAssetsByAccountId$schema>): FindAssetsByAccountId =>
  FindAssetsByAccountId$schema.parse(input)
export const FindAssetsByAccountId$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const FindAssetsByAccountId$codec = core.structCodec<FindAssetsByAccountId>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type FindAssetsByAssetDefinitionId = z.infer<typeof FindAssetsByAssetDefinitionId$schema>
export const FindAssetsByAssetDefinitionId = (
  input: z.input<typeof FindAssetsByAssetDefinitionId$schema>,
): FindAssetsByAssetDefinitionId => FindAssetsByAssetDefinitionId$schema.parse(input)
export const FindAssetsByAssetDefinitionId$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const FindAssetsByAssetDefinitionId$codec = core.structCodec<FindAssetsByAssetDefinitionId>([
  ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
])
export type FindAssetsByDomainId = z.infer<typeof FindAssetsByDomainId$schema>
export const FindAssetsByDomainId = (input: z.input<typeof FindAssetsByDomainId$schema>): FindAssetsByDomainId =>
  FindAssetsByDomainId$schema.parse(input)
export const FindAssetsByDomainId$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const FindAssetsByDomainId$codec = core.structCodec<FindAssetsByDomainId>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type FindAssetsByDomainIdAndAssetDefinitionId = z.infer<typeof FindAssetsByDomainIdAndAssetDefinitionId$schema>
export const FindAssetsByDomainIdAndAssetDefinitionId = (
  input: z.input<typeof FindAssetsByDomainIdAndAssetDefinitionId$schema>,
): FindAssetsByDomainIdAndAssetDefinitionId => FindAssetsByDomainIdAndAssetDefinitionId$schema.parse(input)
export const FindAssetsByDomainIdAndAssetDefinitionId$schema = z.object({
  domain: z.lazy(() => DomainId$schema),
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
})
export const FindAssetsByDomainIdAndAssetDefinitionId$codec =
  core.structCodec<FindAssetsByDomainIdAndAssetDefinitionId>([
    ['domain', core.lazyCodec(() => DomainId$codec)],
    ['assetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
  ])
export type FindAssetsByName = z.infer<typeof FindAssetsByName$schema>
export const FindAssetsByName = (input: z.input<typeof FindAssetsByName$schema>): FindAssetsByName =>
  FindAssetsByName$schema.parse(input)
export const FindAssetsByName$schema = z.object({ name: core.Name$schema })
export const FindAssetsByName$codec = core.structCodec<FindAssetsByName>([['name', core.Name$codec]])
export type FindBlockHeaderByHash = z.infer<typeof FindBlockHeaderByHash$schema>
export const FindBlockHeaderByHash = (input: z.input<typeof FindBlockHeaderByHash$schema>): FindBlockHeaderByHash =>
  FindBlockHeaderByHash$schema.parse(input)
export const FindBlockHeaderByHash$schema = z.object({ hash: z.lazy(() => Hash$schema) })
export const FindBlockHeaderByHash$codec = core.structCodec<FindBlockHeaderByHash>([
  ['hash', core.lazyCodec(() => Hash$codec)],
])
export type FindDomainById = z.infer<typeof FindDomainById$schema>
export const FindDomainById = (input: z.input<typeof FindDomainById$schema>): FindDomainById =>
  FindDomainById$schema.parse(input)
export const FindDomainById$schema = z.object({ id: z.lazy(() => DomainId$schema) })
export const FindDomainById$codec = core.structCodec<FindDomainById>([['id', core.lazyCodec(() => DomainId$codec)]])
export type FindDomainKeyValueByIdAndKey = z.infer<typeof FindDomainKeyValueByIdAndKey$schema>
export const FindDomainKeyValueByIdAndKey = (
  input: z.input<typeof FindDomainKeyValueByIdAndKey$schema>,
): FindDomainKeyValueByIdAndKey => FindDomainKeyValueByIdAndKey$schema.parse(input)
export const FindDomainKeyValueByIdAndKey$schema = z.object({
  id: z.lazy(() => DomainId$schema),
  key: core.Name$schema,
})
export const FindDomainKeyValueByIdAndKey$codec = core.structCodec<FindDomainKeyValueByIdAndKey>([
  ['id', core.lazyCodec(() => DomainId$codec)],
  ['key', core.Name$codec],
])
export type FindError = z.infer<typeof FindError$schema>
export const FindError = (input: z.input<typeof FindError$schema>): FindError => FindError$schema.parse(input)
export const FindError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetId$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainId$schema) }),
  z.object({ t: z.literal('MetadataKey'), value: core.Name$schema }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => Hash$schema) }),
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => Hash$schema) }),
  z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('Permission'), value: z.lazy(() => Permission$schema) }),
  z.object({ t: z.literal('PublicKey'), value: z.lazy(() => PublicKey$schema) }),
])
export const FindError$codec: core.Codec<FindError> = core
  .enumCodec<{
    Asset: [AssetId]
    AssetDefinition: [AssetDefinitionId]
    Account: [AccountId]
    Domain: [DomainId]
    MetadataKey: [core.Name]
    Block: [Hash]
    Transaction: [Hash]
    Peer: [PeerId]
    Trigger: [TriggerId]
    Role: [RoleId]
    Permission: [Permission]
    PublicKey: [PublicKey]
  }>([
    [0, 'Asset', core.lazyCodec(() => AssetId$codec)],
    [1, 'AssetDefinition', core.lazyCodec(() => AssetDefinitionId$codec)],
    [2, 'Account', core.lazyCodec(() => AccountId$codec)],
    [3, 'Domain', core.lazyCodec(() => DomainId$codec)],
    [4, 'MetadataKey', core.Name$codec],
    [5, 'Block', core.lazyCodec(() => Hash$codec)],
    [6, 'Transaction', core.lazyCodec(() => Hash$codec)],
    [7, 'Peer', core.lazyCodec(() => PeerId$codec)],
    [8, 'Trigger', core.lazyCodec(() => TriggerId$codec)],
    [9, 'Role', core.lazyCodec(() => RoleId$codec)],
    [10, 'Permission', core.lazyCodec(() => Permission$codec)],
    [11, 'PublicKey', core.lazyCodec(() => PublicKey$codec)],
  ])
  .discriminated()
export type FindPermissionsByAccountId = z.infer<typeof FindPermissionsByAccountId$schema>
export const FindPermissionsByAccountId = (
  input: z.input<typeof FindPermissionsByAccountId$schema>,
): FindPermissionsByAccountId => FindPermissionsByAccountId$schema.parse(input)
export const FindPermissionsByAccountId$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindPermissionsByAccountId$codec = core.structCodec<FindPermissionsByAccountId>([
  ['id', core.lazyCodec(() => AccountId$codec)],
])
export type FindRoleByRoleId = z.infer<typeof FindRoleByRoleId$schema>
export const FindRoleByRoleId = (input: z.input<typeof FindRoleByRoleId$schema>): FindRoleByRoleId =>
  FindRoleByRoleId$schema.parse(input)
export const FindRoleByRoleId$schema = z.object({ id: z.lazy(() => RoleId$schema) })
export const FindRoleByRoleId$codec = core.structCodec<FindRoleByRoleId>([['id', core.lazyCodec(() => RoleId$codec)]])
export type FindRolesByAccountId = z.infer<typeof FindRolesByAccountId$schema>
export const FindRolesByAccountId = (input: z.input<typeof FindRolesByAccountId$schema>): FindRolesByAccountId =>
  FindRolesByAccountId$schema.parse(input)
export const FindRolesByAccountId$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindRolesByAccountId$codec = core.structCodec<FindRolesByAccountId>([
  ['id', core.lazyCodec(() => AccountId$codec)],
])
export type FindTotalAssetQuantityByAssetDefinitionId = z.infer<typeof FindTotalAssetQuantityByAssetDefinitionId$schema>
export const FindTotalAssetQuantityByAssetDefinitionId = (
  input: z.input<typeof FindTotalAssetQuantityByAssetDefinitionId$schema>,
): FindTotalAssetQuantityByAssetDefinitionId => FindTotalAssetQuantityByAssetDefinitionId$schema.parse(input)
export const FindTotalAssetQuantityByAssetDefinitionId$schema = z.object({ id: z.lazy(() => AssetDefinitionId$schema) })
export const FindTotalAssetQuantityByAssetDefinitionId$codec =
  core.structCodec<FindTotalAssetQuantityByAssetDefinitionId>([['id', core.lazyCodec(() => AssetDefinitionId$codec)]])
export type FindTransactionByHash = z.infer<typeof FindTransactionByHash$schema>
export const FindTransactionByHash = (input: z.input<typeof FindTransactionByHash$schema>): FindTransactionByHash =>
  FindTransactionByHash$schema.parse(input)
export const FindTransactionByHash$schema = z.object({ hash: z.lazy(() => Hash$schema) })
export const FindTransactionByHash$codec = core.structCodec<FindTransactionByHash>([
  ['hash', core.lazyCodec(() => Hash$codec)],
])
export type FindTransactionsByAccountId = z.infer<typeof FindTransactionsByAccountId$schema>
export const FindTransactionsByAccountId = (
  input: z.input<typeof FindTransactionsByAccountId$schema>,
): FindTransactionsByAccountId => FindTransactionsByAccountId$schema.parse(input)
export const FindTransactionsByAccountId$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const FindTransactionsByAccountId$codec = core.structCodec<FindTransactionsByAccountId>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type FindTriggerById = z.infer<typeof FindTriggerById$schema>
export const FindTriggerById = (input: z.input<typeof FindTriggerById$schema>): FindTriggerById =>
  FindTriggerById$schema.parse(input)
export const FindTriggerById$schema = z.object({ id: z.lazy(() => TriggerId$schema) })
export const FindTriggerById$codec = core.structCodec<FindTriggerById>([['id', core.lazyCodec(() => TriggerId$codec)]])
export type FindTriggerKeyValueByIdAndKey = z.infer<typeof FindTriggerKeyValueByIdAndKey$schema>
export const FindTriggerKeyValueByIdAndKey = (
  input: z.input<typeof FindTriggerKeyValueByIdAndKey$schema>,
): FindTriggerKeyValueByIdAndKey => FindTriggerKeyValueByIdAndKey$schema.parse(input)
export const FindTriggerKeyValueByIdAndKey$schema = z.object({
  id: z.lazy(() => TriggerId$schema),
  key: core.Name$schema,
})
export const FindTriggerKeyValueByIdAndKey$codec = core.structCodec<FindTriggerKeyValueByIdAndKey>([
  ['id', core.lazyCodec(() => TriggerId$codec)],
  ['key', core.Name$codec],
])
export type FindTriggersByAuthorityDomainId = z.infer<typeof FindTriggersByAuthorityDomainId$schema>
export const FindTriggersByAuthorityDomainId = (
  input: z.input<typeof FindTriggersByAuthorityDomainId$schema>,
): FindTriggersByAuthorityDomainId => FindTriggersByAuthorityDomainId$schema.parse(input)
export const FindTriggersByAuthorityDomainId$schema = z.object({ domain: z.lazy(() => DomainId$schema) })
export const FindTriggersByAuthorityDomainId$codec = core.structCodec<FindTriggersByAuthorityDomainId>([
  ['domain', core.lazyCodec(() => DomainId$codec)],
])
export type FindTriggersByAuthorityId = z.infer<typeof FindTriggersByAuthorityId$schema>
export const FindTriggersByAuthorityId = (
  input: z.input<typeof FindTriggersByAuthorityId$schema>,
): FindTriggersByAuthorityId => FindTriggersByAuthorityId$schema.parse(input)
export const FindTriggersByAuthorityId$schema = z.object({ account: z.lazy(() => AccountId$schema) })
export const FindTriggersByAuthorityId$codec = core.structCodec<FindTriggersByAuthorityId>([
  ['account', core.lazyCodec(() => AccountId$codec)],
])
export type ForwardCursor = z.infer<typeof ForwardCursor$schema>
export const ForwardCursor = (input: z.input<typeof ForwardCursor$schema>): ForwardCursor =>
  ForwardCursor$schema.parse(input)
export const ForwardCursor$schema = z.object({
  query: core.Option$schema(z.string()),
  cursor: core.Option$schema(core.NonZero$schema(core.U64$schema)),
})
export const ForwardCursor$codec = core.structCodec<ForwardCursor>([
  ['query', core.Option$codec(core.String$codec)],
  ['cursor', core.Option$codec(core.NonZero$codec(core.U64$codec))],
])
export interface Grant<T0, T1> {
  object: T0
  destination: T1
}
export const Grant$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Grant$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.structCodec([
    ['object', t0],
    ['destination', t1],
  ])
export type GrantBox = z.infer<typeof GrantBox$schema>
export const GrantBox = (input: z.input<typeof GrantBox$schema>): GrantBox => GrantBox$schema.parse(input)
export const GrantBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Permission'),
    value: z.lazy(() =>
      Grant$schema(
        z.lazy(() => Permission$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('Role'),
    value: z.lazy(() =>
      Grant$schema(
        z.lazy(() => RoleId$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('RolePermission'),
    value: z.lazy(() =>
      Grant$schema(
        z.lazy(() => Permission$schema),
        z.lazy(() => RoleId$schema),
      ),
    ),
  }),
])
export const GrantBox$codec: core.Codec<GrantBox> = core
  .enumCodec<{
    Permission: [Grant<Permission, AccountId>]
    Role: [Grant<RoleId, AccountId>]
    RolePermission: [Grant<Permission, RoleId>]
  }>([
    [
      0,
      'Permission',
      core.lazyCodec(() =>
        Grant$codec(
          core.lazyCodec(() => Permission$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      1,
      'Role',
      core.lazyCodec(() =>
        Grant$codec(
          core.lazyCodec(() => RoleId$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      2,
      'RolePermission',
      core.lazyCodec(() =>
        Grant$codec(
          core.lazyCodec(() => Permission$codec),
          core.lazyCodec(() => RoleId$codec),
        ),
      ),
    ],
  ])
  .discriminated()
export type Hash = z.infer<typeof Hash$schema>
export const Hash = (input: z.input<typeof Hash$schema>): Hash => Hash$schema.parse(input)
export const Hash$schema = core
  .U8Array$schema(32)
  .or(
    z
      .instanceof(crypto.Hash)
      .transform((x) => x.payload())
      .pipe(core.U8Array$schema(32)),
  )
  .or(core.hex$schema.pipe(core.U8Array$schema(32)))
  .brand<'Hash'>()
export const Hash$codec = core.U8Array$codec(32) as core.Codec<Hash>
export type IdBox = z.infer<typeof IdBox$schema>
export const IdBox = (input: z.input<typeof IdBox$schema>): IdBox => IdBox$schema.parse(input)
export const IdBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('DomainId'), value: z.lazy(() => DomainId$schema) }),
  z.object({ t: z.literal('AccountId'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('AssetDefinitionId'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('AssetId'), value: z.lazy(() => AssetId$schema) }),
  z.object({ t: z.literal('PeerId'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('TriggerId'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('RoleId'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('Permission'), value: z.lazy(() => Permission$schema) }),
  z.object({ t: z.literal('CustomParameterId'), value: z.lazy(() => CustomParameterId$schema) }),
])
export const IdBox$codec: core.Codec<IdBox> = core
  .enumCodec<{
    DomainId: [DomainId]
    AccountId: [AccountId]
    AssetDefinitionId: [AssetDefinitionId]
    AssetId: [AssetId]
    PeerId: [PeerId]
    TriggerId: [TriggerId]
    RoleId: [RoleId]
    Permission: [Permission]
    CustomParameterId: [CustomParameterId]
  }>([
    [0, 'DomainId', core.lazyCodec(() => DomainId$codec)],
    [1, 'AccountId', core.lazyCodec(() => AccountId$codec)],
    [2, 'AssetDefinitionId', core.lazyCodec(() => AssetDefinitionId$codec)],
    [3, 'AssetId', core.lazyCodec(() => AssetId$codec)],
    [4, 'PeerId', core.lazyCodec(() => PeerId$codec)],
    [5, 'TriggerId', core.lazyCodec(() => TriggerId$codec)],
    [6, 'RoleId', core.lazyCodec(() => RoleId$codec)],
    [7, 'Permission', core.lazyCodec(() => Permission$codec)],
    [8, 'CustomParameterId', core.lazyCodec(() => CustomParameterId$codec)],
  ])
  .discriminated()
export type IdentifiableBox = z.infer<typeof IdentifiableBox$schema>
export const IdentifiableBox = (input: z.input<typeof IdentifiableBox$schema>): IdentifiableBox =>
  IdentifiableBox$schema.parse(input)
export const IdentifiableBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('NewDomain'), value: z.lazy(() => NewDomain$schema) }),
  z.object({ t: z.literal('NewAccount'), value: z.lazy(() => NewAccount$schema) }),
  z.object({ t: z.literal('NewAssetDefinition'), value: z.lazy(() => NewAssetDefinition$schema) }),
  z.object({ t: z.literal('NewRole'), value: z.lazy(() => NewRole$schema) }),
  z.object({ t: z.literal('Peer'), value: z.lazy(() => Peer$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => Domain$schema) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => Account$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinition$schema) }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => Asset$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => Trigger$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => Role$schema) }),
  z.object({ t: z.literal('CustomParameter'), value: z.lazy(() => CustomParameter$schema) }),
])
export const IdentifiableBox$codec: core.Codec<IdentifiableBox> = core
  .enumCodec<{
    NewDomain: [NewDomain]
    NewAccount: [NewAccount]
    NewAssetDefinition: [NewAssetDefinition]
    NewRole: [NewRole]
    Peer: [Peer]
    Domain: [Domain]
    Account: [Account]
    AssetDefinition: [AssetDefinition]
    Asset: [Asset]
    Trigger: [Trigger]
    Role: [Role]
    CustomParameter: [CustomParameter]
  }>([
    [0, 'NewDomain', core.lazyCodec(() => NewDomain$codec)],
    [1, 'NewAccount', core.lazyCodec(() => NewAccount$codec)],
    [2, 'NewAssetDefinition', core.lazyCodec(() => NewAssetDefinition$codec)],
    [3, 'NewRole', core.lazyCodec(() => NewRole$codec)],
    [4, 'Peer', core.lazyCodec(() => Peer$codec)],
    [5, 'Domain', core.lazyCodec(() => Domain$codec)],
    [6, 'Account', core.lazyCodec(() => Account$codec)],
    [7, 'AssetDefinition', core.lazyCodec(() => AssetDefinition$codec)],
    [8, 'Asset', core.lazyCodec(() => Asset$codec)],
    [9, 'Trigger', core.lazyCodec(() => Trigger$codec)],
    [10, 'Role', core.lazyCodec(() => Role$codec)],
    [11, 'CustomParameter', core.lazyCodec(() => CustomParameter$codec)],
  ])
  .discriminated()
export type InstructionBox =
  | { t: 'Register'; value: RegisterBox }
  | { t: 'Unregister'; value: UnregisterBox }
  | { t: 'Mint'; value: MintBox }
  | { t: 'Burn'; value: BurnBox }
  | { t: 'Transfer'; value: TransferBox }
  | { t: 'SetKeyValue'; value: SetKeyValueBox }
  | { t: 'RemoveKeyValue'; value: RemoveKeyValueBox }
  | { t: 'Grant'; value: GrantBox }
  | { t: 'Revoke'; value: RevokeBox }
  | { t: 'ExecuteTrigger'; value: ExecuteTrigger }
  | { t: 'SetParameter'; value: SetParameter }
  | { t: 'Upgrade'; value: Upgrade }
  | { t: 'Log'; value: Log }
  | { t: 'Custom'; value: CustomInstruction }
export const InstructionBox = (input: z.input<typeof InstructionBox$schema>): InstructionBox =>
  InstructionBox$schema.parse(input)
type InstructionBox$input =
  | { t: 'Register'; value: z.input<typeof RegisterBox$schema> }
  | { t: 'Unregister'; value: z.input<typeof UnregisterBox$schema> }
  | { t: 'Mint'; value: z.input<typeof MintBox$schema> }
  | { t: 'Burn'; value: z.input<typeof BurnBox$schema> }
  | { t: 'Transfer'; value: z.input<typeof TransferBox$schema> }
  | { t: 'SetKeyValue'; value: z.input<typeof SetKeyValueBox$schema> }
  | { t: 'RemoveKeyValue'; value: z.input<typeof RemoveKeyValueBox$schema> }
  | { t: 'Grant'; value: z.input<typeof GrantBox$schema> }
  | { t: 'Revoke'; value: z.input<typeof RevokeBox$schema> }
  | { t: 'ExecuteTrigger'; value: z.input<typeof ExecuteTrigger$schema> }
  | { t: 'SetParameter'; value: z.input<typeof SetParameter$schema> }
  | { t: 'Upgrade'; value: z.input<typeof Upgrade$schema> }
  | { t: 'Log'; value: z.input<typeof Log$schema> }
  | { t: 'Custom'; value: z.input<typeof CustomInstruction$schema> }
export const InstructionBox$schema: z.ZodType<InstructionBox, z.ZodTypeDef, InstructionBox$input> =
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('Register'), value: z.lazy(() => RegisterBox$schema) }),
    z.object({ t: z.literal('Unregister'), value: z.lazy(() => UnregisterBox$schema) }),
    z.object({ t: z.literal('Mint'), value: z.lazy(() => MintBox$schema) }),
    z.object({ t: z.literal('Burn'), value: z.lazy(() => BurnBox$schema) }),
    z.object({ t: z.literal('Transfer'), value: z.lazy(() => TransferBox$schema) }),
    z.object({ t: z.literal('SetKeyValue'), value: z.lazy(() => SetKeyValueBox$schema) }),
    z.object({ t: z.literal('RemoveKeyValue'), value: z.lazy(() => RemoveKeyValueBox$schema) }),
    z.object({ t: z.literal('Grant'), value: z.lazy(() => GrantBox$schema) }),
    z.object({ t: z.literal('Revoke'), value: z.lazy(() => RevokeBox$schema) }),
    z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTrigger$schema) }),
    z.object({ t: z.literal('SetParameter'), value: z.lazy(() => SetParameter$schema) }),
    z.object({ t: z.literal('Upgrade'), value: z.lazy(() => Upgrade$schema) }),
    z.object({ t: z.literal('Log'), value: z.lazy(() => Log$schema) }),
    z.object({ t: z.literal('Custom'), value: z.lazy(() => CustomInstruction$schema) }),
  ])
export const InstructionBox$codec: core.Codec<InstructionBox> = core
  .enumCodec<{
    Register: [RegisterBox]
    Unregister: [UnregisterBox]
    Mint: [MintBox]
    Burn: [BurnBox]
    Transfer: [TransferBox]
    SetKeyValue: [SetKeyValueBox]
    RemoveKeyValue: [RemoveKeyValueBox]
    Grant: [GrantBox]
    Revoke: [RevokeBox]
    ExecuteTrigger: [ExecuteTrigger]
    SetParameter: [SetParameter]
    Upgrade: [Upgrade]
    Log: [Log]
    Custom: [CustomInstruction]
  }>([
    [0, 'Register', core.lazyCodec(() => RegisterBox$codec)],
    [1, 'Unregister', core.lazyCodec(() => UnregisterBox$codec)],
    [2, 'Mint', core.lazyCodec(() => MintBox$codec)],
    [3, 'Burn', core.lazyCodec(() => BurnBox$codec)],
    [4, 'Transfer', core.lazyCodec(() => TransferBox$codec)],
    [5, 'SetKeyValue', core.lazyCodec(() => SetKeyValueBox$codec)],
    [6, 'RemoveKeyValue', core.lazyCodec(() => RemoveKeyValueBox$codec)],
    [7, 'Grant', core.lazyCodec(() => GrantBox$codec)],
    [8, 'Revoke', core.lazyCodec(() => RevokeBox$codec)],
    [9, 'ExecuteTrigger', core.lazyCodec(() => ExecuteTrigger$codec)],
    [10, 'SetParameter', core.lazyCodec(() => SetParameter$codec)],
    [11, 'Upgrade', core.lazyCodec(() => Upgrade$codec)],
    [12, 'Log', core.lazyCodec(() => Log$codec)],
    [13, 'Custom', core.lazyCodec(() => CustomInstruction$codec)],
  ])
  .discriminated()
export type InstructionEvaluationError = z.infer<typeof InstructionEvaluationError$schema>
export const InstructionEvaluationError = (
  input: z.input<typeof InstructionEvaluationError$schema>,
): InstructionEvaluationError => InstructionEvaluationError$schema.parse(input)
export const InstructionEvaluationError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Unsupported'), value: z.lazy(() => InstructionType$schema) }),
  z.object({ t: z.literal('PermissionParameter'), value: z.string() }),
  z.object({ t: z.literal('Type'), value: z.lazy(() => TypeError$schema) }),
])
export const InstructionEvaluationError$codec: core.Codec<InstructionEvaluationError> = core
  .enumCodec<{ Unsupported: [InstructionType]; PermissionParameter: [core.String]; Type: [TypeError] }>([
    [0, 'Unsupported', core.lazyCodec(() => InstructionType$codec)],
    [1, 'PermissionParameter', core.String$codec],
    [2, 'Type', core.lazyCodec(() => TypeError$codec)],
  ])
  .discriminated()
export type InstructionExecutionError = z.infer<typeof InstructionExecutionError$schema>
export const InstructionExecutionError = (
  input: z.input<typeof InstructionExecutionError$schema>,
): InstructionExecutionError => InstructionExecutionError$schema.parse(input)
export const InstructionExecutionError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Evaluate'), value: z.lazy(() => InstructionEvaluationError$schema) }),
  z.object({ t: z.literal('Query'), value: z.lazy(() => QueryExecutionFail$schema) }),
  z.object({ t: z.literal('Conversion'), value: z.string() }),
  z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('Repetition'), value: z.lazy(() => RepetitionError$schema) }),
  z.object({ t: z.literal('Mintability'), value: z.lazy(() => MintabilityError$schema) }),
  z.object({ t: z.literal('Math'), value: z.lazy(() => MathError$schema) }),
  z.object({ t: z.literal('InvalidParameter'), value: z.lazy(() => InvalidParameterError$schema) }),
  z.object({ t: z.literal('InvariantViolation'), value: z.string() }),
])
export const InstructionExecutionError$codec: core.Codec<InstructionExecutionError> = core
  .enumCodec<{
    Evaluate: [InstructionEvaluationError]
    Query: [QueryExecutionFail]
    Conversion: [core.String]
    Find: [FindError]
    Repetition: [RepetitionError]
    Mintability: [MintabilityError]
    Math: [MathError]
    InvalidParameter: [InvalidParameterError]
    InvariantViolation: [core.String]
  }>([
    [0, 'Evaluate', core.lazyCodec(() => InstructionEvaluationError$codec)],
    [1, 'Query', core.lazyCodec(() => QueryExecutionFail$codec)],
    [2, 'Conversion', core.String$codec],
    [3, 'Find', core.lazyCodec(() => FindError$codec)],
    [4, 'Repetition', core.lazyCodec(() => RepetitionError$codec)],
    [5, 'Mintability', core.lazyCodec(() => MintabilityError$codec)],
    [6, 'Math', core.lazyCodec(() => MathError$codec)],
    [7, 'InvalidParameter', core.lazyCodec(() => InvalidParameterError$codec)],
    [8, 'InvariantViolation', core.String$codec],
  ])
  .discriminated()
export type InstructionExecutionFail = z.infer<typeof InstructionExecutionFail$schema>
export const InstructionExecutionFail = (
  input: z.input<typeof InstructionExecutionFail$schema>,
): InstructionExecutionFail => InstructionExecutionFail$schema.parse(input)
export const InstructionExecutionFail$schema = z.object({
  instruction: z.lazy(() => InstructionBox$schema),
  reason: z.string(),
})
export const InstructionExecutionFail$codec = core.structCodec<InstructionExecutionFail>([
  ['instruction', core.lazyCodec(() => InstructionBox$codec)],
  ['reason', core.String$codec],
])
export type InstructionType = z.infer<typeof InstructionType$schema>
export const InstructionType = (input: z.input<typeof InstructionType$schema>): InstructionType =>
  InstructionType$schema.parse(input)
export const InstructionType$schema = z.union([
  z.literal('Register'),
  z.literal('Unregister'),
  z.literal('Mint'),
  z.literal('Burn'),
  z.literal('Transfer'),
  z.literal('SetKeyValue'),
  z.literal('RemoveKeyValue'),
  z.literal('Grant'),
  z.literal('Revoke'),
  z.literal('ExecuteTrigger'),
  z.literal('SetParameter'),
  z.literal('Upgrade'),
  z.literal('Log'),
  z.literal('Custom'),
])
export const InstructionType$codec: core.Codec<InstructionType> = core
  .enumCodec<{
    Register: []
    Unregister: []
    Mint: []
    Burn: []
    Transfer: []
    SetKeyValue: []
    RemoveKeyValue: []
    Grant: []
    Revoke: []
    ExecuteTrigger: []
    SetParameter: []
    Upgrade: []
    Log: []
    Custom: []
  }>([
    [0, 'Register'],
    [1, 'Unregister'],
    [2, 'Mint'],
    [3, 'Burn'],
    [4, 'Transfer'],
    [5, 'SetKeyValue'],
    [6, 'RemoveKeyValue'],
    [7, 'Grant'],
    [8, 'Revoke'],
    [9, 'ExecuteTrigger'],
    [10, 'SetParameter'],
    [11, 'Upgrade'],
    [12, 'Log'],
    [13, 'Custom'],
  ])
  .literalUnion()
export type InvalidParameterError = z.infer<typeof InvalidParameterError$schema>
export const InvalidParameterError = (input: z.input<typeof InvalidParameterError$schema>): InvalidParameterError =>
  InvalidParameterError$schema.parse(input)
export const InvalidParameterError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Wasm'), value: z.string() }),
  z.object({ t: z.literal('NameLength') }),
  z.object({ t: z.literal('TimeTriggerInThePast') }),
])
export const InvalidParameterError$codec: core.Codec<InvalidParameterError> = core
  .enumCodec<{ Wasm: [core.String]; NameLength: []; TimeTriggerInThePast: [] }>([
    [0, 'Wasm', core.String$codec],
    [1, 'NameLength'],
    [2, 'TimeTriggerInThePast'],
  ])
  .discriminated()
export type IpfsPath = z.infer<typeof IpfsPath$schema>
export const IpfsPath = (input: z.input<typeof IpfsPath$schema>): IpfsPath => IpfsPath$schema.parse(input)
export const IpfsPath$schema = z.string().brand<'IpfsPath'>()
export const IpfsPath$codec = core.String$codec as core.Codec<IpfsPath>
export type Ipv4Addr = z.infer<typeof Ipv4Addr$schema>
export const Ipv4Addr = (input: z.input<typeof Ipv4Addr$schema>): Ipv4Addr => Ipv4Addr$schema.parse(input)
export const Ipv4Addr$schema = z.tuple([core.U8$schema, core.U8$schema, core.U8$schema, core.U8$schema])
export const Ipv4Addr$codec: core.Codec<Ipv4Addr> = core.tupleCodec([
  core.U8$codec,
  core.U8$codec,
  core.U8$codec,
  core.U8$codec,
])
export type Ipv6Addr = z.infer<typeof Ipv6Addr$schema>
export const Ipv6Addr = (input: z.input<typeof Ipv6Addr$schema>): Ipv6Addr => Ipv6Addr$schema.parse(input)
export const Ipv6Addr$schema = z.tuple([
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
  core.U16$schema,
])
export const Ipv6Addr$codec: core.Codec<Ipv6Addr> = core.tupleCodec([
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
  core.U16$codec,
])
export type Log = z.infer<typeof Log$schema>
export const Log = (input: z.input<typeof Log$schema>): Log => Log$schema.parse(input)
export const Log$schema = z.object({ level: z.lazy(() => LogLevel$schema), msg: z.string() })
export const Log$codec = core.structCodec<Log>([
  ['level', core.lazyCodec(() => LogLevel$codec)],
  ['msg', core.String$codec],
])
export type LogLevel = z.infer<typeof LogLevel$schema>
export const LogLevel = (input: z.input<typeof LogLevel$schema>): LogLevel => LogLevel$schema.parse(input)
export const LogLevel$schema = z.union([
  z.literal('TRACE'),
  z.literal('DEBUG'),
  z.literal('INFO'),
  z.literal('WARN'),
  z.literal('ERROR'),
])
export const LogLevel$codec: core.Codec<LogLevel> = core
  .enumCodec<{ TRACE: []; DEBUG: []; INFO: []; WARN: []; ERROR: [] }>([
    [0, 'TRACE'],
    [1, 'DEBUG'],
    [2, 'INFO'],
    [3, 'WARN'],
    [4, 'ERROR'],
  ])
  .literalUnion()
export type MathError = z.infer<typeof MathError$schema>
export const MathError = (input: z.input<typeof MathError$schema>): MathError => MathError$schema.parse(input)
export const MathError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Overflow') }),
  z.object({ t: z.literal('NotEnoughQuantity') }),
  z.object({ t: z.literal('DivideByZero') }),
  z.object({ t: z.literal('NegativeValue') }),
  z.object({ t: z.literal('DomainViolation') }),
  z.object({ t: z.literal('Unknown') }),
  z.object({ t: z.literal('FixedPointConversion'), value: z.string() }),
])
export const MathError$codec: core.Codec<MathError> = core
  .enumCodec<{
    Overflow: []
    NotEnoughQuantity: []
    DivideByZero: []
    NegativeValue: []
    DomainViolation: []
    Unknown: []
    FixedPointConversion: [core.String]
  }>([
    [0, 'Overflow'],
    [1, 'NotEnoughQuantity'],
    [2, 'DivideByZero'],
    [3, 'NegativeValue'],
    [4, 'DomainViolation'],
    [5, 'Unknown'],
    [6, 'FixedPointConversion', core.String$codec],
  ])
  .discriminated()
export type Metadata = core.Map<core.Name, core.Json>
export const Metadata = (input: z.input<typeof Metadata$schema>): Metadata => Metadata$schema.parse(input)
export const Metadata$schema = core.Map$schema(core.Name$schema, core.Json$schema)
export const Metadata$codec = core.Map$codec(core.Name$codec, core.Json$codec)
export interface MetadataChanged<T0> {
  target: T0
  key: core.String
  value: core.Json
}
export const MetadataChanged$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ target: t0, key: z.string(), value: core.Json$schema })
export const MetadataChanged$codec = <T0,>(t0: core.Codec<T0>) =>
  core.structCodec([
    ['target', t0],
    ['key', core.String$codec],
    ['value', core.Json$codec],
  ])
export interface Mint<T0, T1> {
  object: T0
  destination: T1
}
export const Mint$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Mint$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.structCodec([
    ['object', t0],
    ['destination', t1],
  ])
export type MintBox = z.infer<typeof MintBox$schema>
export const MintBox = (input: z.input<typeof MintBox$schema>): MintBox => MintBox$schema.parse(input)
export const MintBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Asset'),
    value: z.lazy(() =>
      Mint$schema(
        z.lazy(() => Numeric$schema),
        z.lazy(() => AssetId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('TriggerRepetitions'),
    value: z.lazy(() =>
      Mint$schema(
        core.U32$schema,
        z.lazy(() => TriggerId$schema),
      ),
    ),
  }),
])
export const MintBox$codec: core.Codec<MintBox> = core
  .enumCodec<{ Asset: [Mint<Numeric, AssetId>]; TriggerRepetitions: [Mint<core.U32, TriggerId>] }>([
    [
      0,
      'Asset',
      core.lazyCodec(() =>
        Mint$codec(
          core.lazyCodec(() => Numeric$codec),
          core.lazyCodec(() => AssetId$codec),
        ),
      ),
    ],
    [
      1,
      'TriggerRepetitions',
      core.lazyCodec(() =>
        Mint$codec(
          core.U32$codec,
          core.lazyCodec(() => TriggerId$codec),
        ),
      ),
    ],
  ])
  .discriminated()
export type MintabilityError = z.infer<typeof MintabilityError$schema>
export const MintabilityError = (input: z.input<typeof MintabilityError$schema>): MintabilityError =>
  MintabilityError$schema.parse(input)
export const MintabilityError$schema = z.union([z.literal('MintUnmintable'), z.literal('ForbidMintOnMintable')])
export const MintabilityError$codec: core.Codec<MintabilityError> = core
  .enumCodec<{ MintUnmintable: []; ForbidMintOnMintable: [] }>([
    [0, 'MintUnmintable'],
    [1, 'ForbidMintOnMintable'],
  ])
  .literalUnion()
export type Mintable = z.infer<typeof Mintable$schema>
export const Mintable = (input: z.input<typeof Mintable$schema>): Mintable => Mintable$schema.parse(input)
export const Mintable$schema = z.union([z.literal('Infinitely'), z.literal('Once'), z.literal('Not')])
export const Mintable$codec: core.Codec<Mintable> = core
  .enumCodec<{ Infinitely: []; Once: []; Not: [] }>([
    [0, 'Infinitely'],
    [1, 'Once'],
    [2, 'Not'],
  ])
  .literalUnion()
export type NewAccount = z.infer<typeof NewAccount$schema>
export const NewAccount = (input: z.input<typeof NewAccount$schema>): NewAccount => NewAccount$schema.parse(input)
export const NewAccount$schema = z.object({
  id: z.lazy(() => AccountId$schema),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewAccount$codec = core.structCodec<NewAccount>([
  ['id', core.lazyCodec(() => AccountId$codec)],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type NewAssetDefinition = z.infer<typeof NewAssetDefinition$schema>
export const NewAssetDefinition = (input: z.input<typeof NewAssetDefinition$schema>): NewAssetDefinition =>
  NewAssetDefinition$schema.parse(input)
export const NewAssetDefinition$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  type: z.lazy(() => AssetType$schema),
  mintable: z.lazy(() => Mintable$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewAssetDefinition$codec = core.structCodec<NewAssetDefinition>([
  ['id', core.lazyCodec(() => AssetDefinitionId$codec)],
  ['type', core.lazyCodec(() => AssetType$codec)],
  ['mintable', core.lazyCodec(() => Mintable$codec)],
  ['logo', core.Option$codec(core.lazyCodec(() => IpfsPath$codec))],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type NewDomain = z.infer<typeof NewDomain$schema>
export const NewDomain = (input: z.input<typeof NewDomain$schema>): NewDomain => NewDomain$schema.parse(input)
export const NewDomain$schema = z.object({
  id: z.lazy(() => DomainId$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewDomain$codec = core.structCodec<NewDomain>([
  ['id', core.lazyCodec(() => DomainId$codec)],
  ['logo', core.Option$codec(core.lazyCodec(() => IpfsPath$codec))],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type NewRole = z.infer<typeof NewRole$schema>
export const NewRole = (input: z.input<typeof NewRole$schema>): NewRole => NewRole$schema.parse(input)
export const NewRole$schema = z.object({ inner: z.lazy(() => Role$schema) })
export const NewRole$codec = core.structCodec<NewRole>([['inner', core.lazyCodec(() => Role$codec)]])
export type Numeric = z.infer<typeof Numeric$schema>
export const Numeric = (input: z.input<typeof Numeric$schema>): Numeric => Numeric$schema.parse(input)
export const Numeric$schema = z.object({ mantissa: core.Compact$schema, scale: core.Compact$schema })
export const Numeric$codec = core.structCodec<Numeric>([
  ['mantissa', core.Compact$codec],
  ['scale', core.Compact$codec],
])
export type NumericSpec = z.infer<typeof NumericSpec$schema>
export const NumericSpec = (input: z.input<typeof NumericSpec$schema>): NumericSpec => NumericSpec$schema.parse(input)
export const NumericSpec$schema = z.object({ scale: core.Option$schema(core.U32$schema) })
export const NumericSpec$codec = core.structCodec<NumericSpec>([['scale', core.Option$codec(core.U32$codec)]])
export type Pagination = z.infer<typeof Pagination$schema>
export const Pagination = (input: z.input<typeof Pagination$schema>): Pagination => Pagination$schema.parse(input)
export const Pagination$schema = z
  .object({
    limit: core.Option$schema(core.NonZero$schema(core.U32$schema)),
    start: core.Option$schema(core.NonZero$schema(core.U64$schema)),
  })
  .default(() => ({}))
export const Pagination$codec = core.structCodec<Pagination>([
  ['limit', core.Option$codec(core.NonZero$codec(core.U32$codec))],
  ['start', core.Option$codec(core.NonZero$codec(core.U64$codec))],
])
export type Parameter = z.infer<typeof Parameter$schema>
export const Parameter = (input: z.input<typeof Parameter$schema>): Parameter => Parameter$schema.parse(input)
export const Parameter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Sumeragi'), value: z.lazy(() => SumeragiParameter$schema) }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => BlockParameter$schema) }),
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionParameter$schema) }),
  z.object({ t: z.literal('SmartContract'), value: z.lazy(() => SmartContractParameter$schema) }),
  z.object({ t: z.literal('Executor'), value: z.lazy(() => SmartContractParameter$schema) }),
  z.object({ t: z.literal('Custom'), value: z.lazy(() => CustomParameter$schema) }),
])
export const Parameter$codec: core.Codec<Parameter> = core
  .enumCodec<{
    Sumeragi: [SumeragiParameter]
    Block: [BlockParameter]
    Transaction: [TransactionParameter]
    SmartContract: [SmartContractParameter]
    Executor: [SmartContractParameter]
    Custom: [CustomParameter]
  }>([
    [0, 'Sumeragi', core.lazyCodec(() => SumeragiParameter$codec)],
    [1, 'Block', core.lazyCodec(() => BlockParameter$codec)],
    [2, 'Transaction', core.lazyCodec(() => TransactionParameter$codec)],
    [3, 'SmartContract', core.lazyCodec(() => SmartContractParameter$codec)],
    [4, 'Executor', core.lazyCodec(() => SmartContractParameter$codec)],
    [5, 'Custom', core.lazyCodec(() => CustomParameter$codec)],
  ])
  .discriminated()
export type ParameterChanged = z.infer<typeof ParameterChanged$schema>
export const ParameterChanged = (input: z.input<typeof ParameterChanged$schema>): ParameterChanged =>
  ParameterChanged$schema.parse(input)
export const ParameterChanged$schema = z.object({
  oldValue: z.lazy(() => Parameter$schema),
  newValue: z.lazy(() => Parameter$schema),
})
export const ParameterChanged$codec = core.structCodec<ParameterChanged>([
  ['oldValue', core.lazyCodec(() => Parameter$codec)],
  ['newValue', core.lazyCodec(() => Parameter$codec)],
])
export type Parameters = z.infer<typeof Parameters$schema>
export const Parameters = (input: z.input<typeof Parameters$schema>): Parameters => Parameters$schema.parse(input)
export const Parameters$schema = z.object({
  sumeragi: z.lazy(() => SumeragiParameters$schema),
  block: z.lazy(() => BlockParameters$schema),
  transaction: z.lazy(() => TransactionParameters$schema),
  executor: z.lazy(() => SmartContractParameters$schema),
  smartContract: z.lazy(() => SmartContractParameters$schema),
  custom: core.Map$schema(
    z.lazy(() => CustomParameterId$schema),
    z.lazy(() => CustomParameter$schema),
  ),
})
export const Parameters$codec = core.structCodec<Parameters>([
  ['sumeragi', core.lazyCodec(() => SumeragiParameters$codec)],
  ['block', core.lazyCodec(() => BlockParameters$codec)],
  ['transaction', core.lazyCodec(() => TransactionParameters$codec)],
  ['executor', core.lazyCodec(() => SmartContractParameters$codec)],
  ['smartContract', core.lazyCodec(() => SmartContractParameters$codec)],
  [
    'custom',
    core.Map$codec(
      core.lazyCodec(() => CustomParameterId$codec),
      core.lazyCodec(() => CustomParameter$codec),
    ),
  ],
])
export type Peer = z.infer<typeof Peer$schema>
export const Peer = (input: z.input<typeof Peer$schema>): Peer => Peer$schema.parse(input)
export const Peer$schema = z.object({ id: z.lazy(() => PeerId$schema) })
export const Peer$codec = core.structCodec<Peer>([['id', core.lazyCodec(() => PeerId$codec)]])
export type PeerEvent = z.infer<typeof PeerEvent$schema>
export const PeerEvent = (input: z.input<typeof PeerEvent$schema>): PeerEvent => PeerEvent$schema.parse(input)
export const PeerEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Added'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('Removed'), value: z.lazy(() => PeerId$schema) }),
])
export const PeerEvent$codec: core.Codec<PeerEvent> = core
  .enumCodec<{ Added: [PeerId]; Removed: [PeerId] }>([
    [0, 'Added', core.lazyCodec(() => PeerId$codec)],
    [1, 'Removed', core.lazyCodec(() => PeerId$codec)],
  ])
  .discriminated()
export type PeerEventFilter = z.infer<typeof PeerEventFilter$schema>
export const PeerEventFilter = (input: z.input<typeof PeerEventFilter$schema>): PeerEventFilter =>
  PeerEventFilter$schema.parse(input)
export const PeerEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => PeerId$schema)),
  eventSet: z.lazy(() => PeerEventSet$schema),
})
export const PeerEventFilter$codec = core.structCodec<PeerEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => PeerId$codec))],
  ['eventSet', core.lazyCodec(() => PeerEventSet$codec)],
])
export type PeerEventSet = z.infer<typeof PeerEventSet$schema>
export const PeerEventSet = (input: z.input<typeof PeerEventSet$schema>): PeerEventSet =>
  PeerEventSet$schema.parse(input)
const PeerEventSet$literalSchema = z.union([z.literal('Added'), z.literal('Removed')])
export const PeerEventSet$schema = z
  .set(PeerEventSet$literalSchema)
  .or(z.array(PeerEventSet$literalSchema).transform((arr) => new Set(arr)))
export const PeerEventSet$codec = core.bitmap<PeerEventSet extends Set<infer T> ? T : never>({ Added: 1, Removed: 2 })
export type PeerId = z.infer<typeof PeerId$schema>
export const PeerId = (input: z.input<typeof PeerId$schema>): PeerId => PeerId$schema.parse(input)
export const PeerId$schema = z.object({
  address: z.lazy(() => SocketAddr$schema),
  publicKey: z.lazy(() => PublicKey$schema),
})
export const PeerId$codec = core.structCodec<PeerId>([
  ['address', core.lazyCodec(() => SocketAddr$codec)],
  ['publicKey', core.lazyCodec(() => PublicKey$codec)],
])
export type Permission = z.infer<typeof Permission$schema>
export const Permission = (input: z.input<typeof Permission$schema>): Permission => Permission$schema.parse(input)
export const Permission$schema = z.object({ name: z.string(), payload: core.Json$schema })
export const Permission$codec = core.structCodec<Permission>([
  ['name', core.String$codec],
  ['payload', core.Json$codec],
])
export type PipelineEventBox = z.infer<typeof PipelineEventBox$schema>
export const PipelineEventBox = (input: z.input<typeof PipelineEventBox$schema>): PipelineEventBox =>
  PipelineEventBox$schema.parse(input)
export const PipelineEventBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEvent$schema) }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEvent$schema) }),
])
export const PipelineEventBox$codec: core.Codec<PipelineEventBox> = core
  .enumCodec<{ Transaction: [TransactionEvent]; Block: [BlockEvent] }>([
    [0, 'Transaction', core.lazyCodec(() => TransactionEvent$codec)],
    [1, 'Block', core.lazyCodec(() => BlockEvent$codec)],
  ])
  .discriminated()
export type PipelineEventFilterBox = z.infer<typeof PipelineEventFilterBox$schema>
export const PipelineEventFilterBox = (input: z.input<typeof PipelineEventFilterBox$schema>): PipelineEventFilterBox =>
  PipelineEventFilterBox$schema.parse(input)
export const PipelineEventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEventFilter$schema) }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEventFilter$schema) }),
])
export const PipelineEventFilterBox$codec: core.Codec<PipelineEventFilterBox> = core
  .enumCodec<{ Transaction: [TransactionEventFilter]; Block: [BlockEventFilter] }>([
    [0, 'Transaction', core.lazyCodec(() => TransactionEventFilter$codec)],
    [1, 'Block', core.lazyCodec(() => BlockEventFilter$codec)],
  ])
  .discriminated()
export type PredicateBox =
  | { t: 'And'; value: core.Vec<PredicateBox> }
  | { t: 'Or'; value: core.Vec<PredicateBox> }
  | { t: 'Not'; value: PredicateBox }
  | { t: 'Raw'; value: QueryOutputPredicate }
export const PredicateBox = (input: z.input<typeof PredicateBox$schema>): PredicateBox =>
  PredicateBox$schema.parse(input)
type PredicateBox$input =
  | { t: 'And'; value: z.input<ReturnType<typeof core.Vec$schema<typeof PredicateBox$schema>>> }
  | { t: 'Or'; value: z.input<ReturnType<typeof core.Vec$schema<typeof PredicateBox$schema>>> }
  | { t: 'Not'; value: z.input<typeof PredicateBox$schema> }
  | { t: 'Raw'; value: z.input<typeof QueryOutputPredicate$schema> }
export const PredicateBox$schema: z.ZodDefault<z.ZodType<PredicateBox, z.ZodTypeDef, PredicateBox$input>> = z
  .discriminatedUnion('t', [
    z.object({ t: z.literal('And'), value: core.Vec$schema(z.lazy(() => PredicateBox$schema)).removeDefault() }),
    z.object({ t: z.literal('Or'), value: core.Vec$schema(z.lazy(() => PredicateBox$schema)).removeDefault() }),
    z.object({ t: z.literal('Not'), value: z.lazy(() => PredicateBox$schema.removeDefault()) }),
    z.object({ t: z.literal('Raw'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  ])
  .default(() => ({ t: 'Raw', value: { t: 'Pass' } }) as const)
export const PredicateBox$codec: core.Codec<PredicateBox> = core
  .enumCodec<{
    And: [core.Vec<PredicateBox>]
    Or: [core.Vec<PredicateBox>]
    Not: [PredicateBox]
    Raw: [QueryOutputPredicate]
  }>([
    [0, 'And', core.Vec$codec(core.lazyCodec(() => PredicateBox$codec))],
    [1, 'Or', core.Vec$codec(core.lazyCodec(() => PredicateBox$codec))],
    [2, 'Not', core.lazyCodec(() => PredicateBox$codec)],
    [3, 'Raw', core.lazyCodec(() => QueryOutputPredicate$codec)],
  ])
  .discriminated()
export type PublicKey = z.infer<typeof PublicKey$schema>
export const PublicKey = (input: z.input<typeof PublicKey$schema>): PublicKey => PublicKey$schema.parse(input)
export const PublicKey$schema = z
  .object({ algorithm: z.lazy(() => Algorithm$schema), payload: core.BytesVec$schema })
  .or(
    z
      .string()
      .transform(core.parseMultihashPublicKey)
      .or(z.instanceof(crypto.PublicKey).transform((x) => ({ algorithm: x.algorithm, payload: x.payload() })))
      .pipe(z.object({ algorithm: z.lazy(() => Algorithm$schema), payload: core.BytesVec$schema })),
  )
export const PublicKey$codec = core.structCodec<PublicKey>([
  ['algorithm', core.lazyCodec(() => Algorithm$codec)],
  ['payload', core.BytesVec$codec],
])
export type QueryBox = z.infer<typeof QueryBox$schema>
export const QueryBox = (input: z.input<typeof QueryBox$schema>): QueryBox => QueryBox$schema.parse(input)
export const QueryBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('FindAllAccounts') }),
  z.object({ t: z.literal('FindAccountById'), value: z.lazy(() => FindAccountById$schema) }),
  z.object({
    t: z.literal('FindAccountKeyValueByIdAndKey'),
    value: z.lazy(() => FindAccountKeyValueByIdAndKey$schema),
  }),
  z.object({ t: z.literal('FindAccountsByDomainId'), value: z.lazy(() => FindAccountsByDomainId$schema) }),
  z.object({ t: z.literal('FindAccountsWithAsset'), value: z.lazy(() => FindAccountsWithAsset$schema) }),
  z.object({ t: z.literal('FindAllAssets') }),
  z.object({ t: z.literal('FindAllAssetsDefinitions') }),
  z.object({ t: z.literal('FindAssetById'), value: z.lazy(() => FindAssetById$schema) }),
  z.object({ t: z.literal('FindAssetDefinitionById'), value: z.lazy(() => FindAssetDefinitionById$schema) }),
  z.object({ t: z.literal('FindAssetsByName'), value: z.lazy(() => FindAssetsByName$schema) }),
  z.object({ t: z.literal('FindAssetsByAccountId'), value: z.lazy(() => FindAssetsByAccountId$schema) }),
  z.object({
    t: z.literal('FindAssetsByAssetDefinitionId'),
    value: z.lazy(() => FindAssetsByAssetDefinitionId$schema),
  }),
  z.object({ t: z.literal('FindAssetsByDomainId'), value: z.lazy(() => FindAssetsByDomainId$schema) }),
  z.object({
    t: z.literal('FindAssetsByDomainIdAndAssetDefinitionId'),
    value: z.lazy(() => FindAssetsByDomainIdAndAssetDefinitionId$schema),
  }),
  z.object({ t: z.literal('FindAssetQuantityById'), value: z.lazy(() => FindAssetQuantityById$schema) }),
  z.object({
    t: z.literal('FindTotalAssetQuantityByAssetDefinitionId'),
    value: z.lazy(() => FindTotalAssetQuantityByAssetDefinitionId$schema),
  }),
  z.object({ t: z.literal('FindAssetKeyValueByIdAndKey'), value: z.lazy(() => FindAssetKeyValueByIdAndKey$schema) }),
  z.object({
    t: z.literal('FindAssetDefinitionKeyValueByIdAndKey'),
    value: z.lazy(() => FindAssetDefinitionKeyValueByIdAndKey$schema),
  }),
  z.object({ t: z.literal('FindAllDomains') }),
  z.object({ t: z.literal('FindDomainById'), value: z.lazy(() => FindDomainById$schema) }),
  z.object({ t: z.literal('FindDomainKeyValueByIdAndKey'), value: z.lazy(() => FindDomainKeyValueByIdAndKey$schema) }),
  z.object({ t: z.literal('FindAllPeers') }),
  z.object({ t: z.literal('FindAllBlocks') }),
  z.object({ t: z.literal('FindAllBlockHeaders') }),
  z.object({ t: z.literal('FindBlockHeaderByHash'), value: z.lazy(() => FindBlockHeaderByHash$schema) }),
  z.object({ t: z.literal('FindAllTransactions') }),
  z.object({ t: z.literal('FindTransactionsByAccountId'), value: z.lazy(() => FindTransactionsByAccountId$schema) }),
  z.object({ t: z.literal('FindTransactionByHash'), value: z.lazy(() => FindTransactionByHash$schema) }),
  z.object({ t: z.literal('FindPermissionsByAccountId'), value: z.lazy(() => FindPermissionsByAccountId$schema) }),
  z.object({ t: z.literal('FindExecutorDataModel') }),
  z.object({ t: z.literal('FindAllActiveTriggerIds') }),
  z.object({ t: z.literal('FindTriggerById'), value: z.lazy(() => FindTriggerById$schema) }),
  z.object({
    t: z.literal('FindTriggerKeyValueByIdAndKey'),
    value: z.lazy(() => FindTriggerKeyValueByIdAndKey$schema),
  }),
  z.object({ t: z.literal('FindTriggersByAuthorityId'), value: z.lazy(() => FindTriggersByAuthorityId$schema) }),
  z.object({
    t: z.literal('FindTriggersByAuthorityDomainId'),
    value: z.lazy(() => FindTriggersByAuthorityDomainId$schema),
  }),
  z.object({ t: z.literal('FindAllRoles') }),
  z.object({ t: z.literal('FindAllRoleIds') }),
  z.object({ t: z.literal('FindRoleByRoleId'), value: z.lazy(() => FindRoleByRoleId$schema) }),
  z.object({ t: z.literal('FindRolesByAccountId'), value: z.lazy(() => FindRolesByAccountId$schema) }),
  z.object({ t: z.literal('FindAllParameters') }),
])
export const QueryBox$codec: core.Codec<QueryBox> = core
  .enumCodec<{
    FindAllAccounts: []
    FindAccountById: [FindAccountById]
    FindAccountKeyValueByIdAndKey: [FindAccountKeyValueByIdAndKey]
    FindAccountsByDomainId: [FindAccountsByDomainId]
    FindAccountsWithAsset: [FindAccountsWithAsset]
    FindAllAssets: []
    FindAllAssetsDefinitions: []
    FindAssetById: [FindAssetById]
    FindAssetDefinitionById: [FindAssetDefinitionById]
    FindAssetsByName: [FindAssetsByName]
    FindAssetsByAccountId: [FindAssetsByAccountId]
    FindAssetsByAssetDefinitionId: [FindAssetsByAssetDefinitionId]
    FindAssetsByDomainId: [FindAssetsByDomainId]
    FindAssetsByDomainIdAndAssetDefinitionId: [FindAssetsByDomainIdAndAssetDefinitionId]
    FindAssetQuantityById: [FindAssetQuantityById]
    FindTotalAssetQuantityByAssetDefinitionId: [FindTotalAssetQuantityByAssetDefinitionId]
    FindAssetKeyValueByIdAndKey: [FindAssetKeyValueByIdAndKey]
    FindAssetDefinitionKeyValueByIdAndKey: [FindAssetDefinitionKeyValueByIdAndKey]
    FindAllDomains: []
    FindDomainById: [FindDomainById]
    FindDomainKeyValueByIdAndKey: [FindDomainKeyValueByIdAndKey]
    FindAllPeers: []
    FindAllBlocks: []
    FindAllBlockHeaders: []
    FindBlockHeaderByHash: [FindBlockHeaderByHash]
    FindAllTransactions: []
    FindTransactionsByAccountId: [FindTransactionsByAccountId]
    FindTransactionByHash: [FindTransactionByHash]
    FindPermissionsByAccountId: [FindPermissionsByAccountId]
    FindExecutorDataModel: []
    FindAllActiveTriggerIds: []
    FindTriggerById: [FindTriggerById]
    FindTriggerKeyValueByIdAndKey: [FindTriggerKeyValueByIdAndKey]
    FindTriggersByAuthorityId: [FindTriggersByAuthorityId]
    FindTriggersByAuthorityDomainId: [FindTriggersByAuthorityDomainId]
    FindAllRoles: []
    FindAllRoleIds: []
    FindRoleByRoleId: [FindRoleByRoleId]
    FindRolesByAccountId: [FindRolesByAccountId]
    FindAllParameters: []
  }>([
    [0, 'FindAllAccounts'],
    [1, 'FindAccountById', core.lazyCodec(() => FindAccountById$codec)],
    [2, 'FindAccountKeyValueByIdAndKey', core.lazyCodec(() => FindAccountKeyValueByIdAndKey$codec)],
    [3, 'FindAccountsByDomainId', core.lazyCodec(() => FindAccountsByDomainId$codec)],
    [4, 'FindAccountsWithAsset', core.lazyCodec(() => FindAccountsWithAsset$codec)],
    [5, 'FindAllAssets'],
    [6, 'FindAllAssetsDefinitions'],
    [7, 'FindAssetById', core.lazyCodec(() => FindAssetById$codec)],
    [8, 'FindAssetDefinitionById', core.lazyCodec(() => FindAssetDefinitionById$codec)],
    [9, 'FindAssetsByName', core.lazyCodec(() => FindAssetsByName$codec)],
    [10, 'FindAssetsByAccountId', core.lazyCodec(() => FindAssetsByAccountId$codec)],
    [11, 'FindAssetsByAssetDefinitionId', core.lazyCodec(() => FindAssetsByAssetDefinitionId$codec)],
    [12, 'FindAssetsByDomainId', core.lazyCodec(() => FindAssetsByDomainId$codec)],
    [
      13,
      'FindAssetsByDomainIdAndAssetDefinitionId',
      core.lazyCodec(() => FindAssetsByDomainIdAndAssetDefinitionId$codec),
    ],
    [14, 'FindAssetQuantityById', core.lazyCodec(() => FindAssetQuantityById$codec)],
    [
      15,
      'FindTotalAssetQuantityByAssetDefinitionId',
      core.lazyCodec(() => FindTotalAssetQuantityByAssetDefinitionId$codec),
    ],
    [16, 'FindAssetKeyValueByIdAndKey', core.lazyCodec(() => FindAssetKeyValueByIdAndKey$codec)],
    [17, 'FindAssetDefinitionKeyValueByIdAndKey', core.lazyCodec(() => FindAssetDefinitionKeyValueByIdAndKey$codec)],
    [18, 'FindAllDomains'],
    [19, 'FindDomainById', core.lazyCodec(() => FindDomainById$codec)],
    [20, 'FindDomainKeyValueByIdAndKey', core.lazyCodec(() => FindDomainKeyValueByIdAndKey$codec)],
    [21, 'FindAllPeers'],
    [22, 'FindAllBlocks'],
    [23, 'FindAllBlockHeaders'],
    [24, 'FindBlockHeaderByHash', core.lazyCodec(() => FindBlockHeaderByHash$codec)],
    [25, 'FindAllTransactions'],
    [26, 'FindTransactionsByAccountId', core.lazyCodec(() => FindTransactionsByAccountId$codec)],
    [27, 'FindTransactionByHash', core.lazyCodec(() => FindTransactionByHash$codec)],
    [28, 'FindPermissionsByAccountId', core.lazyCodec(() => FindPermissionsByAccountId$codec)],
    [29, 'FindExecutorDataModel'],
    [30, 'FindAllActiveTriggerIds'],
    [31, 'FindTriggerById', core.lazyCodec(() => FindTriggerById$codec)],
    [32, 'FindTriggerKeyValueByIdAndKey', core.lazyCodec(() => FindTriggerKeyValueByIdAndKey$codec)],
    [33, 'FindTriggersByAuthorityId', core.lazyCodec(() => FindTriggersByAuthorityId$codec)],
    [34, 'FindTriggersByAuthorityDomainId', core.lazyCodec(() => FindTriggersByAuthorityDomainId$codec)],
    [35, 'FindAllRoles'],
    [36, 'FindAllRoleIds'],
    [37, 'FindRoleByRoleId', core.lazyCodec(() => FindRoleByRoleId$codec)],
    [38, 'FindRolesByAccountId', core.lazyCodec(() => FindRolesByAccountId$codec)],
    [39, 'FindAllParameters'],
  ])
  .discriminated()
export type QueryExecutionFail = z.infer<typeof QueryExecutionFail$schema>
export const QueryExecutionFail = (input: z.input<typeof QueryExecutionFail$schema>): QueryExecutionFail =>
  QueryExecutionFail$schema.parse(input)
export const QueryExecutionFail$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('Conversion'), value: z.string() }),
  z.object({ t: z.literal('UnknownCursor') }),
  z.object({ t: z.literal('FetchSizeTooBig') }),
  z.object({ t: z.literal('InvalidSingularParameters') }),
])
export const QueryExecutionFail$codec: core.Codec<QueryExecutionFail> = core
  .enumCodec<{
    Find: [FindError]
    Conversion: [core.String]
    UnknownCursor: []
    FetchSizeTooBig: []
    InvalidSingularParameters: []
  }>([
    [0, 'Find', core.lazyCodec(() => FindError$codec)],
    [1, 'Conversion', core.String$codec],
    [2, 'UnknownCursor'],
    [3, 'FetchSizeTooBig'],
    [4, 'InvalidSingularParameters'],
  ])
  .discriminated()
export type QueryOutputBox =
  | { t: 'Id'; value: IdBox }
  | { t: 'Identifiable'; value: IdentifiableBox }
  | { t: 'Transaction'; value: TransactionQueryOutput }
  | { t: 'Permission'; value: Permission }
  | { t: 'Parameters'; value: Parameters }
  | { t: 'Metadata'; value: core.Json }
  | { t: 'Numeric'; value: Numeric }
  | { t: 'BlockHeader'; value: BlockHeader }
  | { t: 'Block'; value: SignedBlock }
  | { t: 'ExecutorDataModel'; value: ExecutorDataModel }
  | { t: 'Vec'; value: core.Vec<QueryOutputBox> }
export const QueryOutputBox = (input: z.input<typeof QueryOutputBox$schema>): QueryOutputBox =>
  QueryOutputBox$schema.parse(input)
type QueryOutputBox$input =
  | { t: 'Id'; value: z.input<typeof IdBox$schema> }
  | { t: 'Identifiable'; value: z.input<typeof IdentifiableBox$schema> }
  | { t: 'Transaction'; value: z.input<typeof TransactionQueryOutput$schema> }
  | { t: 'Permission'; value: z.input<typeof Permission$schema> }
  | { t: 'Parameters'; value: z.input<typeof Parameters$schema> }
  | { t: 'Metadata'; value: z.input<typeof core.Json$schema> }
  | { t: 'Numeric'; value: z.input<typeof Numeric$schema> }
  | { t: 'BlockHeader'; value: z.input<typeof BlockHeader$schema> }
  | { t: 'Block'; value: z.input<typeof SignedBlock$schema> }
  | { t: 'ExecutorDataModel'; value: z.input<typeof ExecutorDataModel$schema> }
  | { t: 'Vec'; value: z.input<ReturnType<typeof core.Vec$schema<typeof QueryOutputBox$schema>>> }
export const QueryOutputBox$schema: z.ZodType<QueryOutputBox, z.ZodTypeDef, QueryOutputBox$input> =
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('Id'), value: z.lazy(() => IdBox$schema) }),
    z.object({ t: z.literal('Identifiable'), value: z.lazy(() => IdentifiableBox$schema) }),
    z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionQueryOutput$schema) }),
    z.object({ t: z.literal('Permission'), value: z.lazy(() => Permission$schema) }),
    z.object({ t: z.literal('Parameters'), value: z.lazy(() => Parameters$schema) }),
    z.object({ t: z.literal('Metadata'), value: core.Json$schema }),
    z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
    z.object({ t: z.literal('BlockHeader'), value: z.lazy(() => BlockHeader$schema) }),
    z.object({ t: z.literal('Block'), value: z.lazy(() => SignedBlock$schema) }),
    z.object({ t: z.literal('ExecutorDataModel'), value: z.lazy(() => ExecutorDataModel$schema) }),
    z.object({ t: z.literal('Vec'), value: core.Vec$schema(z.lazy(() => QueryOutputBox$schema)).removeDefault() }),
  ])
export const QueryOutputBox$codec: core.Codec<QueryOutputBox> = core
  .enumCodec<{
    Id: [IdBox]
    Identifiable: [IdentifiableBox]
    Transaction: [TransactionQueryOutput]
    Permission: [Permission]
    Parameters: [Parameters]
    Metadata: [core.Json]
    Numeric: [Numeric]
    BlockHeader: [BlockHeader]
    Block: [SignedBlock]
    ExecutorDataModel: [ExecutorDataModel]
    Vec: [core.Vec<QueryOutputBox>]
  }>([
    [0, 'Id', core.lazyCodec(() => IdBox$codec)],
    [1, 'Identifiable', core.lazyCodec(() => IdentifiableBox$codec)],
    [2, 'Transaction', core.lazyCodec(() => TransactionQueryOutput$codec)],
    [3, 'Permission', core.lazyCodec(() => Permission$codec)],
    [4, 'Parameters', core.lazyCodec(() => Parameters$codec)],
    [5, 'Metadata', core.Json$codec],
    [6, 'Numeric', core.lazyCodec(() => Numeric$codec)],
    [7, 'BlockHeader', core.lazyCodec(() => BlockHeader$codec)],
    [8, 'Block', core.lazyCodec(() => SignedBlock$codec)],
    [9, 'ExecutorDataModel', core.lazyCodec(() => ExecutorDataModel$codec)],
    [10, 'Vec', core.Vec$codec(core.lazyCodec(() => QueryOutputBox$codec))],
  ])
  .discriminated()
export type QueryOutputPredicate =
  | { t: 'Identifiable'; value: StringPredicate }
  | { t: 'Container'; value: Container }
  | { t: 'Display'; value: StringPredicate }
  | { t: 'Numerical'; value: SemiRange }
  | { t: 'TimeStamp'; value: SemiInterval<core.TimestampU128> }
  | { t: 'Pass' }
export const QueryOutputPredicate = (input: z.input<typeof QueryOutputPredicate$schema>): QueryOutputPredicate =>
  QueryOutputPredicate$schema.parse(input)
type QueryOutputPredicate$input =
  | { t: 'Identifiable'; value: z.input<typeof StringPredicate$schema> }
  | { t: 'Container'; value: z.input<typeof Container$schema> }
  | { t: 'Display'; value: z.input<typeof StringPredicate$schema> }
  | { t: 'Numerical'; value: z.input<typeof SemiRange$schema> }
  | { t: 'TimeStamp'; value: z.input<ReturnType<typeof SemiInterval$schema<typeof core.TimestampU128$schema>>> }
  | { t: 'Pass' }
export const QueryOutputPredicate$schema: z.ZodType<QueryOutputPredicate, z.ZodTypeDef, QueryOutputPredicate$input> =
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('Identifiable'), value: z.lazy(() => StringPredicate$schema) }),
    z.object({ t: z.literal('Container'), value: z.lazy(() => Container$schema) }),
    z.object({ t: z.literal('Display'), value: z.lazy(() => StringPredicate$schema) }),
    z.object({ t: z.literal('Numerical'), value: z.lazy(() => SemiRange$schema) }),
    z.object({ t: z.literal('TimeStamp'), value: z.lazy(() => SemiInterval$schema(core.TimestampU128$schema)) }),
    z.object({ t: z.literal('Pass') }),
  ])
export const QueryOutputPredicate$codec: core.Codec<QueryOutputPredicate> = core
  .enumCodec<{
    Identifiable: [StringPredicate]
    Container: [Container]
    Display: [StringPredicate]
    Numerical: [SemiRange]
    TimeStamp: [SemiInterval<core.TimestampU128>]
    Pass: []
  }>([
    [0, 'Identifiable', core.lazyCodec(() => StringPredicate$codec)],
    [1, 'Container', core.lazyCodec(() => Container$codec)],
    [2, 'Display', core.lazyCodec(() => StringPredicate$codec)],
    [3, 'Numerical', core.lazyCodec(() => SemiRange$codec)],
    [4, 'TimeStamp', core.lazyCodec(() => SemiInterval$codec(core.TimestampU128$codec))],
    [5, 'Pass'],
  ])
  .discriminated()
export type RawGenesisTransaction = z.infer<typeof RawGenesisTransaction$schema>
export const RawGenesisTransaction = (input: z.input<typeof RawGenesisTransaction$schema>): RawGenesisTransaction =>
  RawGenesisTransaction$schema.parse(input)
export const RawGenesisTransaction$schema = z.object({
  chain: z.lazy(() => ChainId$schema),
  executor: z.string(),
  parameters: core.Vec$schema(z.lazy(() => Parameter$schema)),
  instructions: core.Vec$schema(z.lazy(() => InstructionBox$schema)),
  topology: core.Vec$schema(z.lazy(() => PeerId$schema)),
})
export const RawGenesisTransaction$codec = core.structCodec<RawGenesisTransaction>([
  ['chain', core.lazyCodec(() => ChainId$codec)],
  ['executor', core.String$codec],
  ['parameters', core.Vec$codec(core.lazyCodec(() => Parameter$codec))],
  ['instructions', core.Vec$codec(core.lazyCodec(() => InstructionBox$codec))],
  ['topology', core.Vec$codec(core.lazyCodec(() => PeerId$codec))],
])
export interface Register<T0> {
  object: T0
}
export const Register$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Register$codec = <T0,>(t0: core.Codec<T0>) => core.structCodec([['object', t0]])
export type RegisterBox = z.infer<typeof RegisterBox$schema>
export const RegisterBox = (input: z.input<typeof RegisterBox$schema>): RegisterBox => RegisterBox$schema.parse(input)
export const RegisterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Peer'), value: z.lazy(() => Register$schema(z.lazy(() => Peer$schema))) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => Register$schema(z.lazy(() => NewDomain$schema))) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => Register$schema(z.lazy(() => NewAccount$schema))) }),
  z.object({
    t: z.literal('AssetDefinition'),
    value: z.lazy(() => Register$schema(z.lazy(() => NewAssetDefinition$schema))),
  }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => Register$schema(z.lazy(() => Asset$schema))) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => Register$schema(z.lazy(() => NewRole$schema))) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => Register$schema(z.lazy(() => Trigger$schema))) }),
])
export const RegisterBox$codec: core.Codec<RegisterBox> = core
  .enumCodec<{
    Peer: [Register<Peer>]
    Domain: [Register<NewDomain>]
    Account: [Register<NewAccount>]
    AssetDefinition: [Register<NewAssetDefinition>]
    Asset: [Register<Asset>]
    Role: [Register<NewRole>]
    Trigger: [Register<Trigger>]
  }>([
    [0, 'Peer', core.lazyCodec(() => Register$codec(core.lazyCodec(() => Peer$codec)))],
    [1, 'Domain', core.lazyCodec(() => Register$codec(core.lazyCodec(() => NewDomain$codec)))],
    [2, 'Account', core.lazyCodec(() => Register$codec(core.lazyCodec(() => NewAccount$codec)))],
    [3, 'AssetDefinition', core.lazyCodec(() => Register$codec(core.lazyCodec(() => NewAssetDefinition$codec)))],
    [4, 'Asset', core.lazyCodec(() => Register$codec(core.lazyCodec(() => Asset$codec)))],
    [5, 'Role', core.lazyCodec(() => Register$codec(core.lazyCodec(() => NewRole$codec)))],
    [6, 'Trigger', core.lazyCodec(() => Register$codec(core.lazyCodec(() => Trigger$codec)))],
  ])
  .discriminated()
export interface RemoveKeyValue<T0> {
  object: T0
  key: core.String
  value: core.Json
}
export const RemoveKeyValue$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ object: t0, key: z.string(), value: core.Json$schema })
export const RemoveKeyValue$codec = <T0,>(t0: core.Codec<T0>) =>
  core.structCodec([
    ['object', t0],
    ['key', core.String$codec],
    ['value', core.Json$codec],
  ])
export type RemoveKeyValueBox = z.infer<typeof RemoveKeyValueBox$schema>
export const RemoveKeyValueBox = (input: z.input<typeof RemoveKeyValueBox$schema>): RemoveKeyValueBox =>
  RemoveKeyValueBox$schema.parse(input)
export const RemoveKeyValueBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Domain'), value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => Domain$schema))) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => Account$schema))) }),
  z.object({
    t: z.literal('AssetDefinition'),
    value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => AssetDefinition$schema))),
  }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => Asset$schema))) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => Trigger$schema))) }),
])
export const RemoveKeyValueBox$codec: core.Codec<RemoveKeyValueBox> = core
  .enumCodec<{
    Domain: [RemoveKeyValue<Domain>]
    Account: [RemoveKeyValue<Account>]
    AssetDefinition: [RemoveKeyValue<AssetDefinition>]
    Asset: [RemoveKeyValue<Asset>]
    Trigger: [RemoveKeyValue<Trigger>]
  }>([
    [0, 'Domain', core.lazyCodec(() => RemoveKeyValue$codec(core.lazyCodec(() => Domain$codec)))],
    [1, 'Account', core.lazyCodec(() => RemoveKeyValue$codec(core.lazyCodec(() => Account$codec)))],
    [2, 'AssetDefinition', core.lazyCodec(() => RemoveKeyValue$codec(core.lazyCodec(() => AssetDefinition$codec)))],
    [3, 'Asset', core.lazyCodec(() => RemoveKeyValue$codec(core.lazyCodec(() => Asset$codec)))],
    [4, 'Trigger', core.lazyCodec(() => RemoveKeyValue$codec(core.lazyCodec(() => Trigger$codec)))],
  ])
  .discriminated()
export type Repeats = z.infer<typeof Repeats$schema>
export const Repeats = (input: z.input<typeof Repeats$schema>): Repeats => Repeats$schema.parse(input)
export const Repeats$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Indefinitely') }),
  z.object({ t: z.literal('Exactly'), value: core.U32$schema }),
])
export const Repeats$codec: core.Codec<Repeats> = core
  .enumCodec<{ Indefinitely: []; Exactly: [core.U32] }>([
    [0, 'Indefinitely'],
    [1, 'Exactly', core.U32$codec],
  ])
  .discriminated()
export type RepetitionError = z.infer<typeof RepetitionError$schema>
export const RepetitionError = (input: z.input<typeof RepetitionError$schema>): RepetitionError =>
  RepetitionError$schema.parse(input)
export const RepetitionError$schema = z.object({
  instruction: z.lazy(() => InstructionType$schema),
  id: z.lazy(() => IdBox$schema),
})
export const RepetitionError$codec = core.structCodec<RepetitionError>([
  ['instruction', core.lazyCodec(() => InstructionType$codec)],
  ['id', core.lazyCodec(() => IdBox$codec)],
])
export interface Revoke<T0, T1> {
  object: T0
  destination: T1
}
export const Revoke$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Revoke$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.structCodec([
    ['object', t0],
    ['destination', t1],
  ])
export type RevokeBox = z.infer<typeof RevokeBox$schema>
export const RevokeBox = (input: z.input<typeof RevokeBox$schema>): RevokeBox => RevokeBox$schema.parse(input)
export const RevokeBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Permission'),
    value: z.lazy(() =>
      Revoke$schema(
        z.lazy(() => Permission$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('Role'),
    value: z.lazy(() =>
      Revoke$schema(
        z.lazy(() => RoleId$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('RolePermission'),
    value: z.lazy(() =>
      Revoke$schema(
        z.lazy(() => Permission$schema),
        z.lazy(() => RoleId$schema),
      ),
    ),
  }),
])
export const RevokeBox$codec: core.Codec<RevokeBox> = core
  .enumCodec<{
    Permission: [Revoke<Permission, AccountId>]
    Role: [Revoke<RoleId, AccountId>]
    RolePermission: [Revoke<Permission, RoleId>]
  }>([
    [
      0,
      'Permission',
      core.lazyCodec(() =>
        Revoke$codec(
          core.lazyCodec(() => Permission$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      1,
      'Role',
      core.lazyCodec(() =>
        Revoke$codec(
          core.lazyCodec(() => RoleId$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      2,
      'RolePermission',
      core.lazyCodec(() =>
        Revoke$codec(
          core.lazyCodec(() => Permission$codec),
          core.lazyCodec(() => RoleId$codec),
        ),
      ),
    ],
  ])
  .discriminated()
export type Role = z.infer<typeof Role$schema>
export const Role = (input: z.input<typeof Role$schema>): Role => Role$schema.parse(input)
export const Role$schema = z.object({
  id: z.lazy(() => RoleId$schema),
  permissions: core.Vec$schema(z.lazy(() => Permission$schema)),
})
export const Role$codec = core.structCodec<Role>([
  ['id', core.lazyCodec(() => RoleId$codec)],
  ['permissions', core.Vec$codec(core.lazyCodec(() => Permission$codec))],
])
export type RoleEvent = z.infer<typeof RoleEvent$schema>
export const RoleEvent = (input: z.input<typeof RoleEvent$schema>): RoleEvent => RoleEvent$schema.parse(input)
export const RoleEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => Role$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => RolePermissionChanged$schema) }),
  z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => RolePermissionChanged$schema) }),
])
export const RoleEvent$codec: core.Codec<RoleEvent> = core
  .enumCodec<{
    Created: [Role]
    Deleted: [RoleId]
    PermissionAdded: [RolePermissionChanged]
    PermissionRemoved: [RolePermissionChanged]
  }>([
    [0, 'Created', core.lazyCodec(() => Role$codec)],
    [1, 'Deleted', core.lazyCodec(() => RoleId$codec)],
    [2, 'PermissionAdded', core.lazyCodec(() => RolePermissionChanged$codec)],
    [3, 'PermissionRemoved', core.lazyCodec(() => RolePermissionChanged$codec)],
  ])
  .discriminated()
export type RoleEventFilter = z.infer<typeof RoleEventFilter$schema>
export const RoleEventFilter = (input: z.input<typeof RoleEventFilter$schema>): RoleEventFilter =>
  RoleEventFilter$schema.parse(input)
export const RoleEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => RoleId$schema)),
  eventSet: z.lazy(() => RoleEventSet$schema),
})
export const RoleEventFilter$codec = core.structCodec<RoleEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => RoleId$codec))],
  ['eventSet', core.lazyCodec(() => RoleEventSet$codec)],
])
export type RoleEventSet = z.infer<typeof RoleEventSet$schema>
export const RoleEventSet = (input: z.input<typeof RoleEventSet$schema>): RoleEventSet =>
  RoleEventSet$schema.parse(input)
const RoleEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('PermissionAdded'),
  z.literal('PermissionRemoved'),
])
export const RoleEventSet$schema = z
  .set(RoleEventSet$literalSchema)
  .or(z.array(RoleEventSet$literalSchema).transform((arr) => new Set(arr)))
export const RoleEventSet$codec = core.bitmap<RoleEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  PermissionAdded: 4,
  PermissionRemoved: 8,
})
export type RoleId = z.infer<typeof RoleId$schema>
export const RoleId = (input: z.input<typeof RoleId$schema>): RoleId => RoleId$schema.parse(input)
export const RoleId$schema = core.Name$schema.brand<'RoleId'>()
export const RoleId$codec = core.Name$codec as core.Codec<RoleId>
export type RolePermissionChanged = z.infer<typeof RolePermissionChanged$schema>
export const RolePermissionChanged = (input: z.input<typeof RolePermissionChanged$schema>): RolePermissionChanged =>
  RolePermissionChanged$schema.parse(input)
export const RolePermissionChanged$schema = z.object({
  role: z.lazy(() => RoleId$schema),
  permission: z.lazy(() => Permission$schema),
})
export const RolePermissionChanged$codec = core.structCodec<RolePermissionChanged>([
  ['role', core.lazyCodec(() => RoleId$codec)],
  ['permission', core.lazyCodec(() => Permission$codec)],
])
export type Schedule = z.infer<typeof Schedule$schema>
export const Schedule = (input: z.input<typeof Schedule$schema>): Schedule => Schedule$schema.parse(input)
export const Schedule$schema = z.object({
  start: core.Timestamp$schema,
  period: core.Option$schema(core.Duration$schema),
})
export const Schedule$codec = core.structCodec<Schedule>([
  ['start', core.Timestamp$codec],
  ['period', core.Option$codec(core.Duration$codec)],
])
export interface SemiInterval<T0> {
  start: T0
  limit: T0
}
export const SemiInterval$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ start: t0, limit: t0 })
export const SemiInterval$codec = <T0,>(t0: core.Codec<T0>) =>
  core.structCodec([
    ['start', t0],
    ['limit', t0],
  ])
export type SemiRange = z.infer<typeof SemiRange$schema>
export const SemiRange = (input: z.input<typeof SemiRange$schema>): SemiRange => SemiRange$schema.parse(input)
export const SemiRange$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => SemiInterval$schema(z.lazy(() => Numeric$schema))) }),
])
export const SemiRange$codec: core.Codec<SemiRange> = core
  .enumCodec<{
    Numeric: [SemiInterval<Numeric>]
  }>([[0, 'Numeric', core.lazyCodec(() => SemiInterval$codec(core.lazyCodec(() => Numeric$codec)))]])
  .discriminated()
export interface SetKeyValue<T0> {
  object: T0
  key: core.String
  value: core.Json
}
export const SetKeyValue$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ object: t0, key: z.string(), value: core.Json$schema })
export const SetKeyValue$codec = <T0,>(t0: core.Codec<T0>) =>
  core.structCodec([
    ['object', t0],
    ['key', core.String$codec],
    ['value', core.Json$codec],
  ])
export type SetKeyValueBox = z.infer<typeof SetKeyValueBox$schema>
export const SetKeyValueBox = (input: z.input<typeof SetKeyValueBox$schema>): SetKeyValueBox =>
  SetKeyValueBox$schema.parse(input)
export const SetKeyValueBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Domain'), value: z.lazy(() => SetKeyValue$schema(z.lazy(() => Domain$schema))) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => SetKeyValue$schema(z.lazy(() => Account$schema))) }),
  z.object({
    t: z.literal('AssetDefinition'),
    value: z.lazy(() => SetKeyValue$schema(z.lazy(() => AssetDefinition$schema))),
  }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => SetKeyValue$schema(z.lazy(() => Asset$schema))) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => SetKeyValue$schema(z.lazy(() => Trigger$schema))) }),
])
export const SetKeyValueBox$codec: core.Codec<SetKeyValueBox> = core
  .enumCodec<{
    Domain: [SetKeyValue<Domain>]
    Account: [SetKeyValue<Account>]
    AssetDefinition: [SetKeyValue<AssetDefinition>]
    Asset: [SetKeyValue<Asset>]
    Trigger: [SetKeyValue<Trigger>]
  }>([
    [0, 'Domain', core.lazyCodec(() => SetKeyValue$codec(core.lazyCodec(() => Domain$codec)))],
    [1, 'Account', core.lazyCodec(() => SetKeyValue$codec(core.lazyCodec(() => Account$codec)))],
    [2, 'AssetDefinition', core.lazyCodec(() => SetKeyValue$codec(core.lazyCodec(() => AssetDefinition$codec)))],
    [3, 'Asset', core.lazyCodec(() => SetKeyValue$codec(core.lazyCodec(() => Asset$codec)))],
    [4, 'Trigger', core.lazyCodec(() => SetKeyValue$codec(core.lazyCodec(() => Trigger$codec)))],
  ])
  .discriminated()
export type SetParameter = Parameter
export const SetParameter = (input: z.input<typeof SetParameter$schema>): SetParameter =>
  SetParameter$schema.parse(input)
export const SetParameter$schema = z.lazy(() => Parameter$schema)
export const SetParameter$codec = core.lazyCodec(() => Parameter$codec)
export type Signature = z.infer<typeof Signature$schema>
export const Signature = (input: z.input<typeof Signature$schema>): Signature => Signature$schema.parse(input)
export const Signature$schema = core.BytesVec$schema.or(
  z
    .instanceof(crypto.Signature)
    .transform((x) => x.payload())
    .pipe(core.BytesVec$schema),
).brand<'Signature'>()
export const Signature$codec = core.BytesVec$codec as core.Codec<Signature>
export type SignedBlock = z.infer<typeof SignedBlock$schema>
export const SignedBlock = (input: z.input<typeof SignedBlock$schema>): SignedBlock => SignedBlock$schema.parse(input)
export const SignedBlock$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedBlockV1$schema) }),
])
export const SignedBlock$codec: core.Codec<SignedBlock> = core
  .enumCodec<{ V1: [SignedBlockV1] }>([[1, 'V1', core.lazyCodec(() => SignedBlockV1$codec)]])
  .discriminated()
export type SignedBlockV1 = z.infer<typeof SignedBlockV1$schema>
export const SignedBlockV1 = (input: z.input<typeof SignedBlockV1$schema>): SignedBlockV1 =>
  SignedBlockV1$schema.parse(input)
export const SignedBlockV1$schema = z.object({
  signatures: core.Vec$schema(z.lazy(() => BlockSignature$schema)),
  payload: z.lazy(() => BlockPayload$schema),
})
export const SignedBlockV1$codec = core.structCodec<SignedBlockV1>([
  ['signatures', core.Vec$codec(core.lazyCodec(() => BlockSignature$codec))],
  ['payload', core.lazyCodec(() => BlockPayload$codec)],
])
export type SignedQuery = z.infer<typeof SignedQuery$schema>
export const SignedQuery = (input: z.input<typeof SignedQuery$schema>): SignedQuery => SignedQuery$schema.parse(input)
export const SignedQuery$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedQueryV1$schema) }),
])
export const SignedQuery$codec: core.Codec<SignedQuery> = core
  .enumCodec<{ V1: [SignedQueryV1] }>([[1, 'V1', core.lazyCodec(() => SignedQueryV1$codec)]])
  .discriminated()
export type SignedQueryV1 = z.infer<typeof SignedQueryV1$schema>
export const SignedQueryV1 = (input: z.input<typeof SignedQueryV1$schema>): SignedQueryV1 =>
  SignedQueryV1$schema.parse(input)
export const SignedQueryV1$schema = z.object({
  signature: z.lazy(() => Signature$schema),
  payload: z.lazy(() => ClientQueryPayload$schema),
})
export const SignedQueryV1$codec = core.structCodec<SignedQueryV1>([
  ['signature', core.lazyCodec(() => Signature$codec)],
  ['payload', core.lazyCodec(() => ClientQueryPayload$codec)],
])
export type SignedTransaction = z.infer<typeof SignedTransaction$schema>
export const SignedTransaction = (input: z.input<typeof SignedTransaction$schema>): SignedTransaction =>
  SignedTransaction$schema.parse(input)
export const SignedTransaction$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedTransactionV1$schema) }),
])
export const SignedTransaction$codec: core.Codec<SignedTransaction> = core
  .enumCodec<{ V1: [SignedTransactionV1] }>([[1, 'V1', core.lazyCodec(() => SignedTransactionV1$codec)]])
  .discriminated()
export type SignedTransactionV1 = z.infer<typeof SignedTransactionV1$schema>
export const SignedTransactionV1 = (input: z.input<typeof SignedTransactionV1$schema>): SignedTransactionV1 =>
  SignedTransactionV1$schema.parse(input)
export const SignedTransactionV1$schema = z.object({
  signature: z.lazy(() => Signature$schema),
  payload: z.lazy(() => TransactionPayload$schema),
})
export const SignedTransactionV1$codec = core.structCodec<SignedTransactionV1>([
  ['signature', core.lazyCodec(() => Signature$codec)],
  ['payload', core.lazyCodec(() => TransactionPayload$codec)],
])
export type SmartContractParameter = z.infer<typeof SmartContractParameter$schema>
export const SmartContractParameter = (input: z.input<typeof SmartContractParameter$schema>): SmartContractParameter =>
  SmartContractParameter$schema.parse(input)
export const SmartContractParameter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Fuel'), value: core.NonZero$schema(core.U64$schema) }),
  z.object({ t: z.literal('Memory'), value: core.NonZero$schema(core.U64$schema) }),
])
export const SmartContractParameter$codec: core.Codec<SmartContractParameter> = core
  .enumCodec<{ Fuel: [core.NonZero<core.U64>]; Memory: [core.NonZero<core.U64>] }>([
    [0, 'Fuel', core.NonZero$codec(core.U64$codec)],
    [1, 'Memory', core.NonZero$codec(core.U64$codec)],
  ])
  .discriminated()
export type SmartContractParameters = z.infer<typeof SmartContractParameters$schema>
export const SmartContractParameters = (
  input: z.input<typeof SmartContractParameters$schema>,
): SmartContractParameters => SmartContractParameters$schema.parse(input)
export const SmartContractParameters$schema = z.object({
  fuel: core.NonZero$schema(core.U64$schema),
  memory: core.NonZero$schema(core.U64$schema),
})
export const SmartContractParameters$codec = core.structCodec<SmartContractParameters>([
  ['fuel', core.NonZero$codec(core.U64$codec)],
  ['memory', core.NonZero$codec(core.U64$codec)],
])
export type SocketAddr = z.infer<typeof SocketAddr$schema>
export const SocketAddr = (input: z.input<typeof SocketAddr$schema>): SocketAddr => SocketAddr$schema.parse(input)
export const SocketAddr$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Ipv4'), value: z.lazy(() => SocketAddrV4$schema) }),
  z.object({ t: z.literal('Ipv6'), value: z.lazy(() => SocketAddrV6$schema) }),
  z.object({ t: z.literal('Host'), value: z.lazy(() => SocketAddrHost$schema) }),
])
export const SocketAddr$codec: core.Codec<SocketAddr> = core
  .enumCodec<{ Ipv4: [SocketAddrV4]; Ipv6: [SocketAddrV6]; Host: [SocketAddrHost] }>([
    [0, 'Ipv4', core.lazyCodec(() => SocketAddrV4$codec)],
    [1, 'Ipv6', core.lazyCodec(() => SocketAddrV6$codec)],
    [2, 'Host', core.lazyCodec(() => SocketAddrHost$codec)],
  ])
  .discriminated()
export type SocketAddrHost = z.infer<typeof SocketAddrHost$schema>
export const SocketAddrHost = (input: z.input<typeof SocketAddrHost$schema>): SocketAddrHost =>
  SocketAddrHost$schema.parse(input)
export const SocketAddrHost$schema = z.object({ host: z.string(), port: core.U16$schema })
export const SocketAddrHost$codec = core.structCodec<SocketAddrHost>([
  ['host', core.String$codec],
  ['port', core.U16$codec],
])
export type SocketAddrV4 = z.infer<typeof SocketAddrV4$schema>
export const SocketAddrV4 = (input: z.input<typeof SocketAddrV4$schema>): SocketAddrV4 =>
  SocketAddrV4$schema.parse(input)
export const SocketAddrV4$schema = z.object({ ip: z.lazy(() => Ipv4Addr$schema), port: core.U16$schema })
export const SocketAddrV4$codec = core.structCodec<SocketAddrV4>([
  ['ip', core.lazyCodec(() => Ipv4Addr$codec)],
  ['port', core.U16$codec],
])
export type SocketAddrV6 = z.infer<typeof SocketAddrV6$schema>
export const SocketAddrV6 = (input: z.input<typeof SocketAddrV6$schema>): SocketAddrV6 =>
  SocketAddrV6$schema.parse(input)
export const SocketAddrV6$schema = z.object({ ip: z.lazy(() => Ipv6Addr$schema), port: core.U16$schema })
export const SocketAddrV6$codec = core.structCodec<SocketAddrV6>([
  ['ip', core.lazyCodec(() => Ipv6Addr$codec)],
  ['port', core.U16$codec],
])
export type Sorting = z.infer<typeof Sorting$schema>
export const Sorting = (input: z.input<typeof Sorting$schema>): Sorting => Sorting$schema.parse(input)
export const Sorting$schema = z.object({ sortByMetadataKey: core.Option$schema(core.Name$schema) }).default(() => ({}))
export const Sorting$codec = core.structCodec<Sorting>([['sortByMetadataKey', core.Option$codec(core.Name$codec)]])
export type StringPredicate = z.infer<typeof StringPredicate$schema>
export const StringPredicate = (input: z.input<typeof StringPredicate$schema>): StringPredicate =>
  StringPredicate$schema.parse(input)
export const StringPredicate$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Contains'), value: z.string() }),
  z.object({ t: z.literal('StartsWith'), value: z.string() }),
  z.object({ t: z.literal('EndsWith'), value: z.string() }),
  z.object({ t: z.literal('Is'), value: z.string() }),
])
export const StringPredicate$codec: core.Codec<StringPredicate> = core
  .enumCodec<{ Contains: [core.String]; StartsWith: [core.String]; EndsWith: [core.String]; Is: [core.String] }>([
    [0, 'Contains', core.String$codec],
    [1, 'StartsWith', core.String$codec],
    [2, 'EndsWith', core.String$codec],
    [3, 'Is', core.String$codec],
  ])
  .discriminated()
export type SumeragiParameter = z.infer<typeof SumeragiParameter$schema>
export const SumeragiParameter = (input: z.input<typeof SumeragiParameter$schema>): SumeragiParameter =>
  SumeragiParameter$schema.parse(input)
export const SumeragiParameter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('BlockTime'), value: core.Duration$schema }),
  z.object({ t: z.literal('CommitTime'), value: core.Duration$schema }),
])
export const SumeragiParameter$codec: core.Codec<SumeragiParameter> = core
  .enumCodec<{ BlockTime: [core.Duration]; CommitTime: [core.Duration] }>([
    [0, 'BlockTime', core.Duration$codec],
    [1, 'CommitTime', core.Duration$codec],
  ])
  .discriminated()
export type SumeragiParameters = z.infer<typeof SumeragiParameters$schema>
export const SumeragiParameters = (input: z.input<typeof SumeragiParameters$schema>): SumeragiParameters =>
  SumeragiParameters$schema.parse(input)
export const SumeragiParameters$schema = z.object({ blockTime: core.Duration$schema, commitTime: core.Duration$schema })
export const SumeragiParameters$codec = core.structCodec<SumeragiParameters>([
  ['blockTime', core.Duration$codec],
  ['commitTime', core.Duration$codec],
])
export type TimeEvent = z.infer<typeof TimeEvent$schema>
export const TimeEvent = (input: z.input<typeof TimeEvent$schema>): TimeEvent => TimeEvent$schema.parse(input)
export const TimeEvent$schema = z.object({
  prevInterval: core.Option$schema(z.lazy(() => TimeInterval$schema)),
  interval: z.lazy(() => TimeInterval$schema),
})
export const TimeEvent$codec = core.structCodec<TimeEvent>([
  ['prevInterval', core.Option$codec(core.lazyCodec(() => TimeInterval$codec))],
  ['interval', core.lazyCodec(() => TimeInterval$codec)],
])
export type TimeInterval = z.infer<typeof TimeInterval$schema>
export const TimeInterval = (input: z.input<typeof TimeInterval$schema>): TimeInterval =>
  TimeInterval$schema.parse(input)
export const TimeInterval$schema = z.object({ since: core.Timestamp$schema, length: core.Duration$schema })
export const TimeInterval$codec = core.structCodec<TimeInterval>([
  ['since', core.Timestamp$codec],
  ['length', core.Duration$codec],
])
export type TransactionEvent = z.infer<typeof TransactionEvent$schema>
export const TransactionEvent = (input: z.input<typeof TransactionEvent$schema>): TransactionEvent =>
  TransactionEvent$schema.parse(input)
export const TransactionEvent$schema = z.object({
  hash: z.lazy(() => Hash$schema),
  blockHeight: core.Option$schema(core.NonZero$schema(core.U64$schema)),
  status: z.lazy(() => TransactionStatus$schema),
})
export const TransactionEvent$codec = core.structCodec<TransactionEvent>([
  ['hash', core.lazyCodec(() => Hash$codec)],
  ['blockHeight', core.Option$codec(core.NonZero$codec(core.U64$codec))],
  ['status', core.lazyCodec(() => TransactionStatus$codec)],
])
export type TransactionEventFilter = z.infer<typeof TransactionEventFilter$schema>
export const TransactionEventFilter = (input: z.input<typeof TransactionEventFilter$schema>): TransactionEventFilter =>
  TransactionEventFilter$schema.parse(input)
export const TransactionEventFilter$schema = z.object({
  hash: core.Option$schema(z.lazy(() => Hash$schema)),
  blockHeight: core.Option$schema(core.Option$schema(core.NonZero$schema(core.U64$schema))),
  status: core.Option$schema(z.lazy(() => TransactionStatus$schema)),
})
export const TransactionEventFilter$codec = core.structCodec<TransactionEventFilter>([
  ['hash', core.Option$codec(core.lazyCodec(() => Hash$codec))],
  ['blockHeight', core.Option$codec(core.Option$codec(core.NonZero$codec(core.U64$codec)))],
  ['status', core.Option$codec(core.lazyCodec(() => TransactionStatus$codec))],
])
export type TransactionLimitError = z.infer<typeof TransactionLimitError$schema>
export const TransactionLimitError = (input: z.input<typeof TransactionLimitError$schema>): TransactionLimitError =>
  TransactionLimitError$schema.parse(input)
export const TransactionLimitError$schema = z.object({ reason: z.string() })
export const TransactionLimitError$codec = core.structCodec<TransactionLimitError>([['reason', core.String$codec]])
export type TransactionParameter = z.infer<typeof TransactionParameter$schema>
export const TransactionParameter = (input: z.input<typeof TransactionParameter$schema>): TransactionParameter =>
  TransactionParameter$schema.parse(input)
export const TransactionParameter$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('MaxInstructions'), value: core.NonZero$schema(core.U64$schema) }),
  z.object({ t: z.literal('SmartContractSize'), value: core.NonZero$schema(core.U64$schema) }),
])
export const TransactionParameter$codec: core.Codec<TransactionParameter> = core
  .enumCodec<{ MaxInstructions: [core.NonZero<core.U64>]; SmartContractSize: [core.NonZero<core.U64>] }>([
    [0, 'MaxInstructions', core.NonZero$codec(core.U64$codec)],
    [1, 'SmartContractSize', core.NonZero$codec(core.U64$codec)],
  ])
  .discriminated()
export type TransactionParameters = z.infer<typeof TransactionParameters$schema>
export const TransactionParameters = (input: z.input<typeof TransactionParameters$schema>): TransactionParameters =>
  TransactionParameters$schema.parse(input)
export const TransactionParameters$schema = z.object({
  maxInstructions: core.NonZero$schema(core.U64$schema),
  smartContractSize: core.NonZero$schema(core.U64$schema),
})
export const TransactionParameters$codec = core.structCodec<TransactionParameters>([
  ['maxInstructions', core.NonZero$codec(core.U64$codec)],
  ['smartContractSize', core.NonZero$codec(core.U64$codec)],
])
export type TransactionPayload = z.infer<typeof TransactionPayload$schema>
export const TransactionPayload = (input: z.input<typeof TransactionPayload$schema>): TransactionPayload =>
  TransactionPayload$schema.parse(input)
export const TransactionPayload$schema = z.object({
  chain: z.lazy(() => ChainId$schema),
  authority: z.lazy(() => AccountId$schema),
  creationTime: core.Timestamp$schema.default(() => new Date()),
  instructions: z.lazy(() => Executable$schema),
  timeToLive: core.Option$schema(core.NonZero$schema(core.Duration$schema)),
  nonce: core.Option$schema(core.NonZero$schema(core.U32$schema)),
  metadata: z.lazy(() => Metadata$schema),
})
export const TransactionPayload$codec = core.structCodec<TransactionPayload>([
  ['chain', core.lazyCodec(() => ChainId$codec)],
  ['authority', core.lazyCodec(() => AccountId$codec)],
  ['creationTime', core.Timestamp$codec],
  ['instructions', core.lazyCodec(() => Executable$codec)],
  ['timeToLive', core.Option$codec(core.NonZero$codec(core.Duration$codec))],
  ['nonce', core.Option$codec(core.NonZero$codec(core.U32$codec))],
  ['metadata', core.lazyCodec(() => Metadata$codec)],
])
export type TransactionQueryOutput = z.infer<typeof TransactionQueryOutput$schema>
export const TransactionQueryOutput = (input: z.input<typeof TransactionQueryOutput$schema>): TransactionQueryOutput =>
  TransactionQueryOutput$schema.parse(input)
export const TransactionQueryOutput$schema = z.object({
  blockHash: z.lazy(() => Hash$schema),
  transaction: z.lazy(() => CommittedTransaction$schema),
})
export const TransactionQueryOutput$codec = core.structCodec<TransactionQueryOutput>([
  ['blockHash', core.lazyCodec(() => Hash$codec)],
  ['transaction', core.lazyCodec(() => CommittedTransaction$codec)],
])
export type TransactionRejectionReason = z.infer<typeof TransactionRejectionReason$schema>
export const TransactionRejectionReason = (
  input: z.input<typeof TransactionRejectionReason$schema>,
): TransactionRejectionReason => TransactionRejectionReason$schema.parse(input)
export const TransactionRejectionReason$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('AccountDoesNotExist'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('LimitCheck'), value: z.lazy(() => TransactionLimitError$schema) }),
  z.object({ t: z.literal('Validation'), value: z.lazy(() => ValidationFail$schema) }),
  z.object({ t: z.literal('InstructionExecution'), value: z.lazy(() => InstructionExecutionFail$schema) }),
  z.object({ t: z.literal('WasmExecution'), value: z.lazy(() => WasmExecutionFail$schema) }),
])
export const TransactionRejectionReason$codec: core.Codec<TransactionRejectionReason> = core
  .enumCodec<{
    AccountDoesNotExist: [FindError]
    LimitCheck: [TransactionLimitError]
    Validation: [ValidationFail]
    InstructionExecution: [InstructionExecutionFail]
    WasmExecution: [WasmExecutionFail]
  }>([
    [0, 'AccountDoesNotExist', core.lazyCodec(() => FindError$codec)],
    [1, 'LimitCheck', core.lazyCodec(() => TransactionLimitError$codec)],
    [2, 'Validation', core.lazyCodec(() => ValidationFail$codec)],
    [3, 'InstructionExecution', core.lazyCodec(() => InstructionExecutionFail$codec)],
    [4, 'WasmExecution', core.lazyCodec(() => WasmExecutionFail$codec)],
  ])
  .discriminated()
export type TransactionStatus = z.infer<typeof TransactionStatus$schema>
export const TransactionStatus = (input: z.input<typeof TransactionStatus$schema>): TransactionStatus =>
  TransactionStatus$schema.parse(input)
export const TransactionStatus$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Queued') }),
  z.object({ t: z.literal('Expired') }),
  z.object({ t: z.literal('Approved') }),
  z.object({ t: z.literal('Rejected'), value: z.lazy(() => TransactionRejectionReason$schema) }),
])
export const TransactionStatus$codec: core.Codec<TransactionStatus> = core
  .enumCodec<{ Queued: []; Expired: []; Approved: []; Rejected: [TransactionRejectionReason] }>([
    [0, 'Queued'],
    [1, 'Expired'],
    [2, 'Approved'],
    [3, 'Rejected', core.lazyCodec(() => TransactionRejectionReason$codec)],
  ])
  .discriminated()
export interface Transfer<T0, T1, T2> {
  source: T0
  object: T1
  destination: T2
}
export const Transfer$schema = <T0 extends z.ZodType, T1 extends z.ZodType, T2 extends z.ZodType>(
  t0: T0,
  t1: T1,
  t2: T2,
) => z.object({ source: t0, object: t1, destination: t2 })
export const Transfer$codec = <T0, T1, T2>(t0: core.Codec<T0>, t1: core.Codec<T1>, t2: core.Codec<T2>) =>
  core.structCodec([
    ['source', t0],
    ['object', t1],
    ['destination', t2],
  ])
export type TransferBox = z.infer<typeof TransferBox$schema>
export const TransferBox = (input: z.input<typeof TransferBox$schema>): TransferBox => TransferBox$schema.parse(input)
export const TransferBox$schema = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('Domain'),
    value: z.lazy(() =>
      Transfer$schema(
        z.lazy(() => AccountId$schema),
        z.lazy(() => DomainId$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({
    t: z.literal('AssetDefinition'),
    value: z.lazy(() =>
      Transfer$schema(
        z.lazy(() => AccountId$schema),
        z.lazy(() => AssetDefinitionId$schema),
        z.lazy(() => AccountId$schema),
      ),
    ),
  }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetTransferBox$schema) }),
])
export const TransferBox$codec: core.Codec<TransferBox> = core
  .enumCodec<{
    Domain: [Transfer<AccountId, DomainId, AccountId>]
    AssetDefinition: [Transfer<AccountId, AssetDefinitionId, AccountId>]
    Asset: [AssetTransferBox]
  }>([
    [
      0,
      'Domain',
      core.lazyCodec(() =>
        Transfer$codec(
          core.lazyCodec(() => AccountId$codec),
          core.lazyCodec(() => DomainId$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [
      1,
      'AssetDefinition',
      core.lazyCodec(() =>
        Transfer$codec(
          core.lazyCodec(() => AccountId$codec),
          core.lazyCodec(() => AssetDefinitionId$codec),
          core.lazyCodec(() => AccountId$codec),
        ),
      ),
    ],
    [2, 'Asset', core.lazyCodec(() => AssetTransferBox$codec)],
  ])
  .discriminated()
export type Trigger = z.infer<typeof Trigger$schema>
export const Trigger = (input: z.input<typeof Trigger$schema>): Trigger => Trigger$schema.parse(input)
export const Trigger$schema = z.object({ id: z.lazy(() => TriggerId$schema), action: z.lazy(() => Action$schema) })
export const Trigger$codec = core.structCodec<Trigger>([
  ['id', core.lazyCodec(() => TriggerId$codec)],
  ['action', core.lazyCodec(() => Action$codec)],
])
export type TriggerCompletedEvent = z.infer<typeof TriggerCompletedEvent$schema>
export const TriggerCompletedEvent = (input: z.input<typeof TriggerCompletedEvent$schema>): TriggerCompletedEvent =>
  TriggerCompletedEvent$schema.parse(input)
export const TriggerCompletedEvent$schema = z.object({
  triggerId: z.lazy(() => TriggerId$schema),
  outcome: z.lazy(() => TriggerCompletedOutcome$schema),
})
export const TriggerCompletedEvent$codec = core.structCodec<TriggerCompletedEvent>([
  ['triggerId', core.lazyCodec(() => TriggerId$codec)],
  ['outcome', core.lazyCodec(() => TriggerCompletedOutcome$codec)],
])
export type TriggerCompletedEventFilter = z.infer<typeof TriggerCompletedEventFilter$schema>
export const TriggerCompletedEventFilter = (
  input: z.input<typeof TriggerCompletedEventFilter$schema>,
): TriggerCompletedEventFilter => TriggerCompletedEventFilter$schema.parse(input)
export const TriggerCompletedEventFilter$schema = z.object({
  triggerId: core.Option$schema(z.lazy(() => TriggerId$schema)),
  outcomeType: core.Option$schema(z.lazy(() => TriggerCompletedOutcomeType$schema)),
})
export const TriggerCompletedEventFilter$codec = core.structCodec<TriggerCompletedEventFilter>([
  ['triggerId', core.Option$codec(core.lazyCodec(() => TriggerId$codec))],
  ['outcomeType', core.Option$codec(core.lazyCodec(() => TriggerCompletedOutcomeType$codec))],
])
export type TriggerCompletedOutcome = z.infer<typeof TriggerCompletedOutcome$schema>
export const TriggerCompletedOutcome = (
  input: z.input<typeof TriggerCompletedOutcome$schema>,
): TriggerCompletedOutcome => TriggerCompletedOutcome$schema.parse(input)
export const TriggerCompletedOutcome$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Success') }),
  z.object({ t: z.literal('Failure'), value: z.string() }),
])
export const TriggerCompletedOutcome$codec: core.Codec<TriggerCompletedOutcome> = core
  .enumCodec<{ Success: []; Failure: [core.String] }>([
    [0, 'Success'],
    [1, 'Failure', core.String$codec],
  ])
  .discriminated()
export type TriggerCompletedOutcomeType = z.infer<typeof TriggerCompletedOutcomeType$schema>
export const TriggerCompletedOutcomeType = (
  input: z.input<typeof TriggerCompletedOutcomeType$schema>,
): TriggerCompletedOutcomeType => TriggerCompletedOutcomeType$schema.parse(input)
export const TriggerCompletedOutcomeType$schema = z.union([z.literal('Success'), z.literal('Failure')])
export const TriggerCompletedOutcomeType$codec: core.Codec<TriggerCompletedOutcomeType> = core
  .enumCodec<{ Success: []; Failure: [] }>([
    [0, 'Success'],
    [1, 'Failure'],
  ])
  .literalUnion()
export type TriggerEvent = z.infer<typeof TriggerEvent$schema>
export const TriggerEvent = (input: z.input<typeof TriggerEvent$schema>): TriggerEvent =>
  TriggerEvent$schema.parse(input)
export const TriggerEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('Extended'), value: z.lazy(() => TriggerNumberOfExecutionsChanged$schema) }),
  z.object({ t: z.literal('Shortened'), value: z.lazy(() => TriggerNumberOfExecutionsChanged$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => TriggerId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => TriggerId$schema))),
  }),
])
export const TriggerEvent$codec: core.Codec<TriggerEvent> = core
  .enumCodec<{
    Created: [TriggerId]
    Deleted: [TriggerId]
    Extended: [TriggerNumberOfExecutionsChanged]
    Shortened: [TriggerNumberOfExecutionsChanged]
    MetadataInserted: [MetadataChanged<TriggerId>]
    MetadataRemoved: [MetadataChanged<TriggerId>]
  }>([
    [0, 'Created', core.lazyCodec(() => TriggerId$codec)],
    [1, 'Deleted', core.lazyCodec(() => TriggerId$codec)],
    [2, 'Extended', core.lazyCodec(() => TriggerNumberOfExecutionsChanged$codec)],
    [3, 'Shortened', core.lazyCodec(() => TriggerNumberOfExecutionsChanged$codec)],
    [4, 'MetadataInserted', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => TriggerId$codec)))],
    [5, 'MetadataRemoved', core.lazyCodec(() => MetadataChanged$codec(core.lazyCodec(() => TriggerId$codec)))],
  ])
  .discriminated()
export type TriggerEventFilter = z.infer<typeof TriggerEventFilter$schema>
export const TriggerEventFilter = (input: z.input<typeof TriggerEventFilter$schema>): TriggerEventFilter =>
  TriggerEventFilter$schema.parse(input)
export const TriggerEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => TriggerId$schema)),
  eventSet: z.lazy(() => TriggerEventSet$schema),
})
export const TriggerEventFilter$codec = core.structCodec<TriggerEventFilter>([
  ['idMatcher', core.Option$codec(core.lazyCodec(() => TriggerId$codec))],
  ['eventSet', core.lazyCodec(() => TriggerEventSet$codec)],
])
export type TriggerEventSet = z.infer<typeof TriggerEventSet$schema>
export const TriggerEventSet = (input: z.input<typeof TriggerEventSet$schema>): TriggerEventSet =>
  TriggerEventSet$schema.parse(input)
const TriggerEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('Extended'),
  z.literal('Shortened'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
])
export const TriggerEventSet$schema = z
  .set(TriggerEventSet$literalSchema)
  .or(z.array(TriggerEventSet$literalSchema).transform((arr) => new Set(arr)))
export const TriggerEventSet$codec = core.bitmap<TriggerEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  Extended: 4,
  Shortened: 8,
  MetadataInserted: 16,
  MetadataRemoved: 32,
})
export type TriggerId = z.infer<typeof TriggerId$schema>
export const TriggerId = (input: z.input<typeof TriggerId$schema>): TriggerId => TriggerId$schema.parse(input)
export const TriggerId$schema = core.Name$schema.brand<'TriggerId'>()
export const TriggerId$codec = core.Name$codec as core.Codec<TriggerId>
export type TriggerNumberOfExecutionsChanged = z.infer<typeof TriggerNumberOfExecutionsChanged$schema>
export const TriggerNumberOfExecutionsChanged = (
  input: z.input<typeof TriggerNumberOfExecutionsChanged$schema>,
): TriggerNumberOfExecutionsChanged => TriggerNumberOfExecutionsChanged$schema.parse(input)
export const TriggerNumberOfExecutionsChanged$schema = z.object({
  trigger: z.lazy(() => TriggerId$schema),
  by: core.U32$schema,
})
export const TriggerNumberOfExecutionsChanged$codec = core.structCodec<TriggerNumberOfExecutionsChanged>([
  ['trigger', core.lazyCodec(() => TriggerId$codec)],
  ['by', core.U32$codec],
])
export type TriggeringEventFilterBox = z.infer<typeof TriggeringEventFilterBox$schema>
export const TriggeringEventFilterBox = (
  input: z.input<typeof TriggeringEventFilterBox$schema>,
): TriggeringEventFilterBox => TriggeringEventFilterBox$schema.parse(input)
export const TriggeringEventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventFilterBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEventFilter$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => ExecutionTime$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEventFilter$schema) }),
])
export const TriggeringEventFilterBox$codec: core.Codec<TriggeringEventFilterBox> = core
  .enumCodec<{
    Pipeline: [PipelineEventFilterBox]
    Data: [DataEventFilter]
    Time: [ExecutionTime]
    ExecuteTrigger: [ExecuteTriggerEventFilter]
  }>([
    [0, 'Pipeline', core.lazyCodec(() => PipelineEventFilterBox$codec)],
    [1, 'Data', core.lazyCodec(() => DataEventFilter$codec)],
    [2, 'Time', core.lazyCodec(() => ExecutionTime$codec)],
    [3, 'ExecuteTrigger', core.lazyCodec(() => ExecuteTriggerEventFilter$codec)],
  ])
  .discriminated()
export type TypeError = z.infer<typeof TypeError$schema>
export const TypeError = (input: z.input<typeof TypeError$schema>): TypeError => TypeError$schema.parse(input)
export const TypeError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('AssetType'), value: z.lazy(() => AssetTypeMismatch$schema) }),
  z.object({ t: z.literal('NumericAssetTypeExpected'), value: z.lazy(() => AssetType$schema) }),
])
export const TypeError$codec: core.Codec<TypeError> = core
  .enumCodec<{ AssetType: [AssetTypeMismatch]; NumericAssetTypeExpected: [AssetType] }>([
    [0, 'AssetType', core.lazyCodec(() => AssetTypeMismatch$codec)],
    [1, 'NumericAssetTypeExpected', core.lazyCodec(() => AssetType$codec)],
  ])
  .discriminated()
export interface Unregister<T0> {
  object: T0
}
export const Unregister$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Unregister$codec = <T0,>(t0: core.Codec<T0>) => core.structCodec([['object', t0]])
export type UnregisterBox = z.infer<typeof UnregisterBox$schema>
export const UnregisterBox = (input: z.input<typeof UnregisterBox$schema>): UnregisterBox =>
  UnregisterBox$schema.parse(input)
export const UnregisterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Peer'), value: z.lazy(() => Unregister$schema(z.lazy(() => PeerId$schema))) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => Unregister$schema(z.lazy(() => DomainId$schema))) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => Unregister$schema(z.lazy(() => AccountId$schema))) }),
  z.object({
    t: z.literal('AssetDefinition'),
    value: z.lazy(() => Unregister$schema(z.lazy(() => AssetDefinitionId$schema))),
  }),
  z.object({ t: z.literal('Asset'), value: z.lazy(() => Unregister$schema(z.lazy(() => AssetId$schema))) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => Unregister$schema(z.lazy(() => RoleId$schema))) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => Unregister$schema(z.lazy(() => TriggerId$schema))) }),
])
export const UnregisterBox$codec: core.Codec<UnregisterBox> = core
  .enumCodec<{
    Peer: [Unregister<PeerId>]
    Domain: [Unregister<DomainId>]
    Account: [Unregister<AccountId>]
    AssetDefinition: [Unregister<AssetDefinitionId>]
    Asset: [Unregister<AssetId>]
    Role: [Unregister<RoleId>]
    Trigger: [Unregister<TriggerId>]
  }>([
    [0, 'Peer', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => PeerId$codec)))],
    [1, 'Domain', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => DomainId$codec)))],
    [2, 'Account', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => AccountId$codec)))],
    [3, 'AssetDefinition', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => AssetDefinitionId$codec)))],
    [4, 'Asset', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => AssetId$codec)))],
    [5, 'Role', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => RoleId$codec)))],
    [6, 'Trigger', core.lazyCodec(() => Unregister$codec(core.lazyCodec(() => TriggerId$codec)))],
  ])
  .discriminated()
export type Upgrade = z.infer<typeof Upgrade$schema>
export const Upgrade = (input: z.input<typeof Upgrade$schema>): Upgrade => Upgrade$schema.parse(input)
export const Upgrade$schema = z.object({ executor: z.lazy(() => Executor$schema) })
export const Upgrade$codec = core.structCodec<Upgrade>([['executor', core.lazyCodec(() => Executor$codec)]])
export type ValidationFail = z.infer<typeof ValidationFail$schema>
export const ValidationFail = (input: z.input<typeof ValidationFail$schema>): ValidationFail =>
  ValidationFail$schema.parse(input)
export const ValidationFail$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('NotPermitted'), value: z.string() }),
  z.object({ t: z.literal('InstructionFailed'), value: z.lazy(() => InstructionExecutionError$schema) }),
  z.object({ t: z.literal('QueryFailed'), value: z.lazy(() => QueryExecutionFail$schema) }),
  z.object({ t: z.literal('TooComplex') }),
  z.object({ t: z.literal('InternalError') }),
])
export const ValidationFail$codec: core.Codec<ValidationFail> = core
  .enumCodec<{
    NotPermitted: [core.String]
    InstructionFailed: [InstructionExecutionError]
    QueryFailed: [QueryExecutionFail]
    TooComplex: []
    InternalError: []
  }>([
    [0, 'NotPermitted', core.String$codec],
    [1, 'InstructionFailed', core.lazyCodec(() => InstructionExecutionError$codec)],
    [2, 'QueryFailed', core.lazyCodec(() => QueryExecutionFail$codec)],
    [3, 'TooComplex'],
    [4, 'InternalError'],
  ])
  .discriminated()
export type WasmExecutionFail = z.infer<typeof WasmExecutionFail$schema>
export const WasmExecutionFail = (input: z.input<typeof WasmExecutionFail$schema>): WasmExecutionFail =>
  WasmExecutionFail$schema.parse(input)
export const WasmExecutionFail$schema = z.object({ reason: z.string() })
export const WasmExecutionFail$codec = core.structCodec<WasmExecutionFail>([['reason', core.String$codec]])
export type WasmSmartContract = z.infer<typeof WasmSmartContract$schema>
export const WasmSmartContract = (input: z.input<typeof WasmSmartContract$schema>): WasmSmartContract =>
  WasmSmartContract$schema.parse(input)
export const WasmSmartContract$schema = z.object({ blob: core.BytesVec$schema })
export const WasmSmartContract$codec = core.structCodec<WasmSmartContract>([['blob', core.BytesVec$codec]])
