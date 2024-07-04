import { core, z } from './prelude'
export type Account = z.infer<typeof Account$schema>
export const Account$schema = z.object({
  id: z.lazy(() => AccountId$schema),
  assets: core.Map$schema(
    z.lazy(() => AssetDefinitionId$schema),
    z.lazy(() => Asset$schema),
  ),
  metadata: z.lazy(() => Metadata$schema),
})
export const Account$codec = core.struct([
  ['id', core.lazy(() => AccountId$codec)],
  [
    'assets',
    core.Map$codec(
      core.lazy(() => AssetDefinitionId$codec),
      core.lazy(() => Asset$codec),
    ),
  ],
  ['metadata', core.lazy(() => Metadata$codec)],
])
export type AccountEvent = z.infer<typeof AccountEvent$schema>
export const AccountEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetEvent$schema) }),
  z.object({ t: z.literal('Created'), value: z.lazy(() => Account$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('AuthenticationAdded'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('AuthenticationRemoved'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => AccountPermissionChanged$schema) }),
  z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => AccountPermissionChanged$schema) }),
  z.object({ t: z.literal('RoleRevoked'), value: z.lazy(() => AccountRoleChanged$schema) }),
  z.object({ t: z.literal('RoleGranted'), value: z.lazy(() => AccountRoleChanged$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AccountId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AccountId$schema))),
  }),
])
export const AccountEvent$codec: core.Codec<AccountEvent> = core.enumeration([
  [0, 'Asset', core.lazy(() => AssetEvent$codec)],
  [1, 'Created', core.lazy(() => Account$codec)],
  [2, 'Deleted', core.lazy(() => AccountId$codec)],
  [3, 'AuthenticationAdded', core.lazy(() => AccountId$codec)],
  [4, 'AuthenticationRemoved', core.lazy(() => AccountId$codec)],
  [5, 'PermissionAdded', core.lazy(() => AccountPermissionChanged$codec)],
  [6, 'PermissionRemoved', core.lazy(() => AccountPermissionChanged$codec)],
  [7, 'RoleRevoked', core.lazy(() => AccountRoleChanged$codec)],
  [8, 'RoleGranted', core.lazy(() => AccountRoleChanged$codec)],
  [9, 'MetadataInserted', core.lazy(() => MetadataChanged$codec(core.lazy(() => AccountId$codec)))],
  [10, 'MetadataRemoved', core.lazy(() => MetadataChanged$codec(core.lazy(() => AccountId$codec)))],
])
export type AccountEventFilter = z.infer<typeof AccountEventFilter$schema>
export const AccountEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AccountId$schema)),
  eventSet: z.lazy(() => AccountEventSet$schema),
})
export const AccountEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => AccountId$codec))],
  ['eventSet', core.lazy(() => AccountEventSet$codec)],
])
export type AccountEventSet = z.infer<typeof AccountEventSet$schema>
const AccountEventSet$literalSchema = z.union([
  z.literal('AnyAsset'),
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('AuthenticationAdded'),
  z.literal('AuthenticationRemoved'),
  z.literal('PermissionAdded'),
  z.literal('PermissionRemoved'),
  z.literal('RoleRevoked'),
  z.literal('RoleGranted'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
])
export const AccountEventSet$schema = z
  .set(AccountEventSet$literalSchema)
  .or(z.array(AccountEventSet$literalSchema).transform((arr) => new Set(arr)))
export const AccountEventSet$codec = core.bitmap<AccountEventSet extends Set<infer T> ? T : never>({
  AnyAsset: 1,
  Created: 2,
  Deleted: 4,
  AuthenticationAdded: 8,
  AuthenticationRemoved: 16,
  PermissionAdded: 32,
  PermissionRemoved: 64,
  RoleRevoked: 128,
  RoleGranted: 256,
  MetadataInserted: 512,
  MetadataRemoved: 1024,
})
export type AccountId = z.infer<typeof AccountId$schema>
export const AccountId$schema = z.object({
  domain: z.lazy(() => DomainId$schema),
  signatory: z.lazy(() => PublicKey$schema),
})
export const AccountId$codec = core.struct([
  ['domain', core.lazy(() => DomainId$codec)],
  ['signatory', core.lazy(() => PublicKey$codec)],
])
export type AccountPermissionChanged = z.infer<typeof AccountPermissionChanged$schema>
export const AccountPermissionChanged$schema = z.object({
  account: z.lazy(() => AccountId$schema),
  permission: z.lazy(() => PermissionId$schema),
})
export const AccountPermissionChanged$codec = core.struct([
  ['account', core.lazy(() => AccountId$codec)],
  ['permission', core.lazy(() => PermissionId$codec)],
])
export type AccountRoleChanged = z.infer<typeof AccountRoleChanged$schema>
export const AccountRoleChanged$schema = z.object({
  account: z.lazy(() => AccountId$schema),
  role: z.lazy(() => RoleId$schema),
})
export const AccountRoleChanged$codec = core.struct([
  ['account', core.lazy(() => AccountId$codec)],
  ['role', core.lazy(() => RoleId$codec)],
])
export type Action = z.infer<typeof Action$schema>
export const Action$schema = z.object({
  executable: z.lazy(() => Executable$schema),
  repeats: z.lazy(() => Repeats$schema),
  authority: z.lazy(() => AccountId$schema),
  filter: z.lazy(() => TriggeringEventFilterBox$schema),
  metadata: z.lazy(() => Metadata$schema),
})
export const Action$codec = core.struct([
  ['executable', core.lazy(() => Executable$codec)],
  ['repeats', core.lazy(() => Repeats$codec)],
  ['authority', core.lazy(() => AccountId$codec)],
  ['filter', core.lazy(() => TriggeringEventFilterBox$codec)],
  ['metadata', core.lazy(() => Metadata$codec)],
])
export type Algorithm = z.infer<typeof Algorithm$schema>
export const Algorithm$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Ed25519') }),
  z.object({ t: z.literal('Secp256k1') }),
  z.object({ t: z.literal('BlsNormal') }),
  z.object({ t: z.literal('BlsSmall') }),
])
export const Algorithm$codec: core.Codec<Algorithm> = core.enumeration([
  [0, 'Ed25519'],
  [1, 'Secp256k1'],
  [2, 'BlsNormal'],
  [3, 'BlsSmall'],
])
export type Asset = z.infer<typeof Asset$schema>
export const Asset$schema = z.object({ id: z.lazy(() => AssetId$schema), value: z.lazy(() => AssetValue$schema) })
export const Asset$codec = core.struct([
  ['id', core.lazy(() => AssetId$codec)],
  ['value', core.lazy(() => AssetValue$codec)],
])
export type AssetChanged = z.infer<typeof AssetChanged$schema>
export const AssetChanged$schema = z.object({
  asset: z.lazy(() => AssetId$schema),
  amount: z.lazy(() => AssetValue$schema),
})
export const AssetChanged$codec = core.struct([
  ['asset', core.lazy(() => AssetId$codec)],
  ['amount', core.lazy(() => AssetValue$codec)],
])
export type AssetDefinition = z.infer<typeof AssetDefinition$schema>
export const AssetDefinition$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  valueType: z.lazy(() => AssetValueType$schema),
  mintable: z.lazy(() => Mintable$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
  ownedBy: z.lazy(() => AccountId$schema),
})
export const AssetDefinition$codec = core.struct([
  ['id', core.lazy(() => AssetDefinitionId$codec)],
  ['valueType', core.lazy(() => AssetValueType$codec)],
  ['mintable', core.lazy(() => Mintable$codec)],
  ['logo', core.Option$codec(core.lazy(() => IpfsPath$codec))],
  ['metadata', core.lazy(() => Metadata$codec)],
  ['ownedBy', core.lazy(() => AccountId$codec)],
])
export type AssetDefinitionEvent = z.infer<typeof AssetDefinitionEvent$schema>
export const AssetDefinitionEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => AssetDefinition$schema) }),
  z.object({ t: z.literal('MintabilityChanged'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('OwnerChanged'), value: z.lazy(() => AssetDefinitionOwnerChanged$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({
    t: z.literal('MetadataInserted'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetDefinitionId$schema))),
  }),
  z.object({
    t: z.literal('MetadataRemoved'),
    value: z.lazy(() => MetadataChanged$schema(z.lazy(() => AssetDefinitionId$schema))),
  }),
  z.object({ t: z.literal('TotalQuantityChanged'), value: z.lazy(() => AssetDefinitionTotalQuantityChanged$schema) }),
])
export const AssetDefinitionEvent$codec: core.Codec<AssetDefinitionEvent> = core.enumeration([
  [0, 'Created', core.lazy(() => AssetDefinition$codec)],
  [1, 'MintabilityChanged', core.lazy(() => AssetDefinitionId$codec)],
  [2, 'OwnerChanged', core.lazy(() => AssetDefinitionOwnerChanged$codec)],
  [3, 'Deleted', core.lazy(() => AssetDefinitionId$codec)],
  [4, 'MetadataInserted', core.lazy(() => MetadataChanged$codec(core.lazy(() => AssetDefinitionId$codec)))],
  [5, 'MetadataRemoved', core.lazy(() => MetadataChanged$codec(core.lazy(() => AssetDefinitionId$codec)))],
  [6, 'TotalQuantityChanged', core.lazy(() => AssetDefinitionTotalQuantityChanged$codec)],
])
export type AssetDefinitionEventFilter = z.infer<typeof AssetDefinitionEventFilter$schema>
export const AssetDefinitionEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AssetDefinitionId$schema)),
  eventSet: z.lazy(() => AssetDefinitionEventSet$schema),
})
export const AssetDefinitionEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => AssetDefinitionId$codec))],
  ['eventSet', core.lazy(() => AssetDefinitionEventSet$codec)],
])
export type AssetDefinitionEventSet = z.infer<typeof AssetDefinitionEventSet$schema>
const AssetDefinitionEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('MintabilityChanged'),
  z.literal('OwnerChanged'),
  z.literal('Deleted'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
  z.literal('TotalQuantityChanged'),
])
export const AssetDefinitionEventSet$schema = z
  .set(AssetDefinitionEventSet$literalSchema)
  .or(z.array(AssetDefinitionEventSet$literalSchema).transform((arr) => new Set(arr)))
export const AssetDefinitionEventSet$codec = core.bitmap<AssetDefinitionEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  MintabilityChanged: 2,
  OwnerChanged: 4,
  Deleted: 8,
  MetadataInserted: 16,
  MetadataRemoved: 32,
  TotalQuantityChanged: 64,
})
export type AssetDefinitionId = z.infer<typeof AssetDefinitionId$schema>
export const AssetDefinitionId$schema = z.object({ domain: z.lazy(() => DomainId$schema), name: z.string() })
export const AssetDefinitionId$codec = core.struct([
  ['domain', core.lazy(() => DomainId$codec)],
  ['name', core.String$codec],
])
export type AssetDefinitionOwnerChanged = z.infer<typeof AssetDefinitionOwnerChanged$schema>
export const AssetDefinitionOwnerChanged$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
  newOwner: z.lazy(() => AccountId$schema),
})
export const AssetDefinitionOwnerChanged$codec = core.struct([
  ['assetDefinition', core.lazy(() => AssetDefinitionId$codec)],
  ['newOwner', core.lazy(() => AccountId$codec)],
])
export type AssetDefinitionTotalQuantityChanged = z.infer<typeof AssetDefinitionTotalQuantityChanged$schema>
export const AssetDefinitionTotalQuantityChanged$schema = z.object({
  assetDefinition: z.lazy(() => AssetDefinitionId$schema),
  totalAmount: z.lazy(() => Numeric$schema),
})
export const AssetDefinitionTotalQuantityChanged$codec = core.struct([
  ['assetDefinition', core.lazy(() => AssetDefinitionId$codec)],
  ['totalAmount', core.lazy(() => Numeric$codec)],
])
export type AssetEvent = z.infer<typeof AssetEvent$schema>
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
export const AssetEvent$codec: core.Codec<AssetEvent> = core.enumeration([
  [0, 'Created', core.lazy(() => Asset$codec)],
  [1, 'Deleted', core.lazy(() => AssetId$codec)],
  [2, 'Added', core.lazy(() => AssetChanged$codec)],
  [3, 'Removed', core.lazy(() => AssetChanged$codec)],
  [4, 'MetadataInserted', core.lazy(() => MetadataChanged$codec(core.lazy(() => AssetId$codec)))],
  [5, 'MetadataRemoved', core.lazy(() => MetadataChanged$codec(core.lazy(() => AssetId$codec)))],
])
export type AssetEventFilter = z.infer<typeof AssetEventFilter$schema>
export const AssetEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => AssetId$schema)),
  eventSet: z.lazy(() => AssetEventSet$schema),
})
export const AssetEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => AssetId$codec))],
  ['eventSet', core.lazy(() => AssetEventSet$codec)],
])
export type AssetEventSet = z.infer<typeof AssetEventSet$schema>
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
export const AssetId$schema = z.object({
  definition: z.lazy(() => AssetDefinitionId$schema),
  account: z.lazy(() => AccountId$schema),
})
export const AssetId$codec = core.struct([
  ['definition', core.lazy(() => AssetDefinitionId$codec)],
  ['account', core.lazy(() => AccountId$codec)],
])
export type AssetTransferBox = z.infer<typeof AssetTransferBox$schema>
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
export const AssetTransferBox$codec: core.Codec<AssetTransferBox> = core.enumeration([
  [
    0,
    'Numeric',
    core.lazy(() =>
      Transfer$codec(
        core.lazy(() => AssetId$codec),
        core.lazy(() => Numeric$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    1,
    'Store',
    core.lazy(() =>
      Transfer$codec(
        core.lazy(() => AssetId$codec),
        core.lazy(() => Metadata$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
])
export type AssetValue = z.infer<typeof AssetValue$schema>
export const AssetValue$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
  z.object({ t: z.literal('Store'), value: z.lazy(() => Metadata$schema) }),
])
export const AssetValue$codec: core.Codec<AssetValue> = core.enumeration([
  [0, 'Numeric', core.lazy(() => Numeric$codec)],
  [1, 'Store', core.lazy(() => Metadata$codec)],
])
export type AssetValueType = z.infer<typeof AssetValueType$schema>
export const AssetValueType$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => NumericSpec$schema) }),
  z.object({ t: z.literal('Store') }),
])
export const AssetValueType$codec: core.Codec<AssetValueType> = core.enumeration([
  [0, 'Numeric', core.lazy(() => NumericSpec$codec)],
  [1, 'Store'],
])
export type AssetValueTypeMismatch = z.infer<typeof AssetValueTypeMismatch$schema>
export const AssetValueTypeMismatch$schema = z.object({
  expected: z.lazy(() => AssetValueType$schema),
  actual: z.lazy(() => AssetValueType$schema),
})
export const AssetValueTypeMismatch$codec = core.struct([
  ['expected', core.lazy(() => AssetValueType$codec)],
  ['actual', core.lazy(() => AssetValueType$codec)],
])
export type AtIndex = z.infer<typeof AtIndex$schema>
export const AtIndex$schema = z.object({ index: core.U32$schema, predicate: z.lazy(() => QueryOutputPredicate$schema) })
export const AtIndex$codec = core.struct([
  ['index', core.U32$codec],
  ['predicate', core.lazy(() => QueryOutputPredicate$codec)],
])
export type BatchedResponse = z.infer<typeof BatchedResponse$schema>
export const BatchedResponse$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => BatchedResponseV1$schema) }),
])
export const BatchedResponse$codec: core.Codec<BatchedResponse> = core.enumeration([
  [1, 'V1', core.lazy(() => BatchedResponseV1$codec)],
])
export type BatchedResponseV1 = z.infer<typeof BatchedResponseV1$schema>
export const BatchedResponseV1$schema = z.object({
  batch: z.lazy(() => QueryOutputBox$schema),
  cursor: z.lazy(() => ForwardCursor$schema),
})
export const BatchedResponseV1$codec = core.struct([
  ['batch', core.lazy(() => QueryOutputBox$codec)],
  ['cursor', core.lazy(() => ForwardCursor$codec)],
])
export type BlockEvent = z.infer<typeof BlockEvent$schema>
export const BlockEvent$schema = z.object({
  header: z.lazy(() => BlockHeader$schema),
  hash: z.lazy(() => Hash$schema),
  status: z.lazy(() => BlockStatus$schema),
})
export const BlockEvent$codec = core.struct([
  ['header', core.lazy(() => BlockHeader$codec)],
  ['hash', core.lazy(() => Hash$codec)],
  ['status', core.lazy(() => BlockStatus$codec)],
])
export type BlockEventFilter = z.infer<typeof BlockEventFilter$schema>
export const BlockEventFilter$schema = z.object({
  height: core.Option$schema(core.U64$schema),
  status: core.Option$schema(z.lazy(() => BlockStatus$schema)),
})
export const BlockEventFilter$codec = core.struct([
  ['height', core.Option$codec(core.U64$codec)],
  ['status', core.Option$codec(core.lazy(() => BlockStatus$codec))],
])
export type BlockHeader = z.infer<typeof BlockHeader$schema>
export const BlockHeader$schema = z.object({
  height: core.U64$schema,
  prevBlockHash: core.Option$schema(z.lazy(() => Hash$schema)),
  transactionsHash: z.lazy(() => Hash$schema),
  timestampMs: core.U64$schema,
  viewChangeIndex: core.U32$schema,
  consensusEstimationMs: core.U64$schema,
})
export const BlockHeader$codec = core.struct([
  ['height', core.U64$codec],
  ['prevBlockHash', core.Option$codec(core.lazy(() => Hash$codec))],
  ['transactionsHash', core.lazy(() => Hash$codec)],
  ['timestampMs', core.U64$codec],
  ['viewChangeIndex', core.U32$codec],
  ['consensusEstimationMs', core.U64$codec],
])
export type BlockPayload = z.infer<typeof BlockPayload$schema>
export const BlockPayload$schema = z.object({
  header: z.lazy(() => BlockHeader$schema),
  commitTopology: core.Vec$schema(z.lazy(() => PeerId$schema)),
  transactions: core.Vec$schema(z.lazy(() => CommittedTransaction$schema)),
  eventRecommendations: core.Vec$schema(z.lazy(() => EventBox$schema)),
})
export const BlockPayload$codec = core.struct([
  ['header', core.lazy(() => BlockHeader$codec)],
  ['commitTopology', core.Vec$codec(core.lazy(() => PeerId$codec))],
  ['transactions', core.Vec$codec(core.lazy(() => CommittedTransaction$codec))],
  ['eventRecommendations', core.Vec$codec(core.lazy(() => EventBox$codec))],
])
export type BlockRejectionReason = z.infer<typeof BlockRejectionReason$schema>
export const BlockRejectionReason$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('ConsensusBlockRejection') }),
])
export const BlockRejectionReason$codec: core.Codec<BlockRejectionReason> = core.enumeration([
  [0, 'ConsensusBlockRejection'],
])
export type BlockSignature = z.infer<typeof BlockSignature$schema>
export const BlockSignature$schema = z.object({
  peerTopologyIndex: core.U64$schema,
  payload: z.lazy(() => Signature$schema),
})
export const BlockSignature$codec = core.struct([
  ['peerTopologyIndex', core.U64$codec],
  ['payload', core.lazy(() => Signature$codec)],
])
export type BlockStatus = z.infer<typeof BlockStatus$schema>
export const BlockStatus$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Approved') }),
  z.object({ t: z.literal('Rejected'), value: z.lazy(() => BlockRejectionReason$schema) }),
  z.object({ t: z.literal('Committed') }),
  z.object({ t: z.literal('Applied') }),
])
export const BlockStatus$codec: core.Codec<BlockStatus> = core.enumeration([
  [0, 'Approved'],
  [1, 'Rejected', core.lazy(() => BlockRejectionReason$codec)],
  [2, 'Committed'],
  [3, 'Applied'],
])
export type BlockSubscriptionRequest = z.infer<typeof BlockSubscriptionRequest$schema>
export const BlockSubscriptionRequest$schema = z.object({ fromBlockHeight: core.NonZero$schema(core.U64$schema) })
export const BlockSubscriptionRequest$codec = core.struct([['fromBlockHeight', core.NonZero$codec(core.U64$codec)]])
export interface Burn<T0, T1> {
  object: T0
  destination: T1
}
export const Burn$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Burn$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.struct([
    ['object', t0],
    ['destination', t1],
  ])
export type BurnBox = z.infer<typeof BurnBox$schema>
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
export const BurnBox$codec: core.Codec<BurnBox> = core.enumeration([
  [
    0,
    'Asset',
    core.lazy(() =>
      Burn$codec(
        core.lazy(() => Numeric$codec),
        core.lazy(() => AssetId$codec),
      ),
    ),
  ],
  [
    1,
    'TriggerRepetitions',
    core.lazy(() =>
      Burn$codec(
        core.U32$codec,
        core.lazy(() => TriggerId$codec),
      ),
    ),
  ],
])
export type ClientQueryPayload = z.infer<typeof ClientQueryPayload$schema>
export const ClientQueryPayload$schema = z.object({
  authority: z.lazy(() => AccountId$schema),
  query: z.lazy(() => QueryBox$schema),
  filter: z.lazy(() => PredicateBox$schema),
  sorting: z.lazy(() => Sorting$schema),
  pagination: z.lazy(() => Pagination$schema),
  fetchSize: z.lazy(() => FetchSize$schema),
})
export const ClientQueryPayload$codec = core.struct([
  ['authority', core.lazy(() => AccountId$codec)],
  ['query', core.lazy(() => QueryBox$codec)],
  ['filter', core.lazy(() => PredicateBox$codec)],
  ['sorting', core.lazy(() => Sorting$codec)],
  ['pagination', core.lazy(() => Pagination$codec)],
  ['fetchSize', core.lazy(() => FetchSize$codec)],
])
export type CommittedTransaction = z.infer<typeof CommittedTransaction$schema>
export const CommittedTransaction$schema = z.object({
  value: z.lazy(() => SignedTransaction$schema),
  error: core.Option$schema(z.lazy(() => TransactionRejectionReason$schema)),
})
export const CommittedTransaction$codec = core.struct([
  ['value', core.lazy(() => SignedTransaction$codec)],
  ['error', core.Option$codec(core.lazy(() => TransactionRejectionReason$codec))],
])
export type ConfigurationEvent = z.infer<typeof ConfigurationEvent$schema>
export const ConfigurationEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Changed'), value: z.lazy(() => ParameterId$schema) }),
  z.object({ t: z.literal('Created'), value: z.lazy(() => ParameterId$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => ParameterId$schema) }),
])
export const ConfigurationEvent$codec: core.Codec<ConfigurationEvent> = core.enumeration([
  [0, 'Changed', core.lazy(() => ParameterId$codec)],
  [1, 'Created', core.lazy(() => ParameterId$codec)],
  [2, 'Deleted', core.lazy(() => ParameterId$codec)],
])
export type ConfigurationEventFilter = z.infer<typeof ConfigurationEventFilter$schema>
export const ConfigurationEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => ParameterId$schema)),
  eventSet: z.lazy(() => ConfigurationEventSet$schema),
})
export const ConfigurationEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => ParameterId$codec))],
  ['eventSet', core.lazy(() => ConfigurationEventSet$codec)],
])
export type ConfigurationEventSet = z.infer<typeof ConfigurationEventSet$schema>
const ConfigurationEventSet$literalSchema = z.union([z.literal('Changed'), z.literal('Created'), z.literal('Deleted')])
export const ConfigurationEventSet$schema = z
  .set(ConfigurationEventSet$literalSchema)
  .or(z.array(ConfigurationEventSet$literalSchema).transform((arr) => new Set(arr)))
export const ConfigurationEventSet$codec = core.bitmap<ConfigurationEventSet extends Set<infer T> ? T : never>({
  Changed: 1,
  Created: 2,
  Deleted: 4,
})
export type Container = z.infer<typeof Container$schema>
export const Container$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Any'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  z.object({ t: z.literal('All'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  z.object({ t: z.literal('AtIndex'), value: z.lazy(() => AtIndex$schema) }),
])
export const Container$codec: core.Codec<Container> = core.enumeration([
  [0, 'Any', core.lazy(() => QueryOutputPredicate$codec)],
  [1, 'All', core.lazy(() => QueryOutputPredicate$codec)],
  [2, 'AtIndex', core.lazy(() => AtIndex$codec)],
])
export type Custom = z.infer<typeof Custom$schema>
export const Custom$schema = z.object({ payload: core.Json$schema })
export const Custom$codec = core.struct([['payload', core.Json$codec]])
export type DataEvent = z.infer<typeof DataEvent$schema>
export const DataEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerEvent$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainEvent$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerEvent$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => RoleEvent$schema) }),
  z.object({ t: z.literal('Configuration'), value: z.lazy(() => ConfigurationEvent$schema) }),
  z.object({ t: z.literal('Executor'), value: z.lazy(() => ExecutorEvent$schema) }),
])
export const DataEvent$codec: core.Codec<DataEvent> = core.enumeration([
  [0, 'Peer', core.lazy(() => PeerEvent$codec)],
  [1, 'Domain', core.lazy(() => DomainEvent$codec)],
  [2, 'Trigger', core.lazy(() => TriggerEvent$codec)],
  [3, 'Role', core.lazy(() => RoleEvent$codec)],
  [4, 'Configuration', core.lazy(() => ConfigurationEvent$codec)],
  [5, 'Executor', core.lazy(() => ExecutorEvent$codec)],
])
export type DataEventFilter = z.infer<typeof DataEventFilter$schema>
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
export const DataEventFilter$codec: core.Codec<DataEventFilter> = core.enumeration([
  [0, 'Any'],
  [1, 'Peer', core.lazy(() => PeerEventFilter$codec)],
  [2, 'Domain', core.lazy(() => DomainEventFilter$codec)],
  [3, 'Account', core.lazy(() => AccountEventFilter$codec)],
  [4, 'Asset', core.lazy(() => AssetEventFilter$codec)],
  [5, 'AssetDefinition', core.lazy(() => AssetDefinitionEventFilter$codec)],
  [6, 'Trigger', core.lazy(() => TriggerEventFilter$codec)],
  [7, 'Role', core.lazy(() => RoleEventFilter$codec)],
  [8, 'Configuration', core.lazy(() => ConfigurationEventFilter$codec)],
  [9, 'Executor', core.lazy(() => ExecutorEventFilter$codec)],
])
export type Domain = z.infer<typeof Domain$schema>
export const Domain$schema = z.object({
  id: z.lazy(() => DomainId$schema),
  assetDefinitions: core.Map$schema(
    z.lazy(() => AssetDefinitionId$schema),
    z.lazy(() => AssetDefinition$schema),
  ),
  assetTotalQuantities: core.Map$schema(
    z.lazy(() => AssetDefinitionId$schema),
    z.lazy(() => Numeric$schema),
  ),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
  ownedBy: z.lazy(() => AccountId$schema),
})
export const Domain$codec = core.struct([
  ['id', core.lazy(() => DomainId$codec)],
  [
    'assetDefinitions',
    core.Map$codec(
      core.lazy(() => AssetDefinitionId$codec),
      core.lazy(() => AssetDefinition$codec),
    ),
  ],
  [
    'assetTotalQuantities',
    core.Map$codec(
      core.lazy(() => AssetDefinitionId$codec),
      core.lazy(() => Numeric$codec),
    ),
  ],
  ['logo', core.Option$codec(core.lazy(() => IpfsPath$codec))],
  ['metadata', core.lazy(() => Metadata$codec)],
  ['ownedBy', core.lazy(() => AccountId$codec)],
])
export type DomainEvent = z.infer<typeof DomainEvent$schema>
export const DomainEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Account'), value: z.lazy(() => AccountEvent$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionEvent$schema) }),
  z.object({ t: z.literal('Created'), value: z.lazy(() => Domain$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => DomainId$schema) }),
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
export const DomainEvent$codec: core.Codec<DomainEvent> = core.enumeration([
  [0, 'Account', core.lazy(() => AccountEvent$codec)],
  [1, 'AssetDefinition', core.lazy(() => AssetDefinitionEvent$codec)],
  [2, 'Created', core.lazy(() => Domain$codec)],
  [3, 'Deleted', core.lazy(() => DomainId$codec)],
  [4, 'MetadataInserted', core.lazy(() => MetadataChanged$codec(core.lazy(() => DomainId$codec)))],
  [5, 'MetadataRemoved', core.lazy(() => MetadataChanged$codec(core.lazy(() => DomainId$codec)))],
  [6, 'OwnerChanged', core.lazy(() => DomainOwnerChanged$codec)],
])
export type DomainEventFilter = z.infer<typeof DomainEventFilter$schema>
export const DomainEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => DomainId$schema)),
  eventSet: z.lazy(() => DomainEventSet$schema),
})
export const DomainEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => DomainId$codec))],
  ['eventSet', core.lazy(() => DomainEventSet$codec)],
])
export type DomainEventSet = z.infer<typeof DomainEventSet$schema>
const DomainEventSet$literalSchema = z.union([
  z.literal('AnyAccount'),
  z.literal('AnyAssetDefinition'),
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('MetadataInserted'),
  z.literal('MetadataRemoved'),
  z.literal('OwnerChanged'),
])
export const DomainEventSet$schema = z
  .set(DomainEventSet$literalSchema)
  .or(z.array(DomainEventSet$literalSchema).transform((arr) => new Set(arr)))
export const DomainEventSet$codec = core.bitmap<DomainEventSet extends Set<infer T> ? T : never>({
  AnyAccount: 1,
  AnyAssetDefinition: 2,
  Created: 4,
  Deleted: 8,
  MetadataInserted: 16,
  MetadataRemoved: 32,
  OwnerChanged: 64,
})
export type DomainId = z.infer<typeof DomainId$schema>
export const DomainId$schema = z.object({ name: z.string() })
export const DomainId$codec = core.struct([['name', core.String$codec]])
export type DomainOwnerChanged = z.infer<typeof DomainOwnerChanged$schema>
export const DomainOwnerChanged$schema = z.object({
  domain: z.lazy(() => DomainId$schema),
  newOwner: z.lazy(() => AccountId$schema),
})
export const DomainOwnerChanged$codec = core.struct([
  ['domain', core.lazy(() => DomainId$codec)],
  ['newOwner', core.lazy(() => AccountId$codec)],
])
export type Duration = z.infer<typeof Duration$schema>
export const Duration$schema = z.object({ secs: core.U64$schema, nanos: core.U32$schema })
export const Duration$codec = core.struct([
  ['secs', core.U64$codec],
  ['nanos', core.U32$codec],
])
export type EventBox = z.infer<typeof EventBox$schema>
export const EventBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEvent$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => TimeEvent$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEvent$schema) }),
  z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEvent$schema) }),
])
export const EventBox$codec: core.Codec<EventBox> = core.enumeration([
  [0, 'Pipeline', core.lazy(() => PipelineEventBox$codec)],
  [1, 'Data', core.lazy(() => DataEvent$codec)],
  [2, 'Time', core.lazy(() => TimeEvent$codec)],
  [3, 'ExecuteTrigger', core.lazy(() => ExecuteTriggerEvent$codec)],
  [4, 'TriggerCompleted', core.lazy(() => TriggerCompletedEvent$codec)],
])
export type EventFilterBox = z.infer<typeof EventFilterBox$schema>
export const EventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventFilterBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEventFilter$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => ExecutionTime$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEventFilter$schema) }),
  z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEventFilter$schema) }),
])
export const EventFilterBox$codec: core.Codec<EventFilterBox> = core.enumeration([
  [0, 'Pipeline', core.lazy(() => PipelineEventFilterBox$codec)],
  [1, 'Data', core.lazy(() => DataEventFilter$codec)],
  [2, 'Time', core.lazy(() => ExecutionTime$codec)],
  [3, 'ExecuteTrigger', core.lazy(() => ExecuteTriggerEventFilter$codec)],
  [4, 'TriggerCompleted', core.lazy(() => TriggerCompletedEventFilter$codec)],
])
export type EventSubscriptionRequest = z.infer<typeof EventSubscriptionRequest$schema>
export const EventSubscriptionRequest$schema = z.object({
  filters: core.Vec$schema(z.lazy(() => EventFilterBox$schema)),
})
export const EventSubscriptionRequest$codec = core.struct([
  ['filters', core.Vec$codec(core.lazy(() => EventFilterBox$codec))],
])
export type Executable = z.infer<typeof Executable$schema>
export const Executable$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Instructions'), value: core.Vec$schema(z.lazy(() => InstructionBox$schema)) }),
  z.object({ t: z.literal('Wasm'), value: z.lazy(() => WasmSmartContract$schema) }),
])
export const Executable$codec: core.Codec<Executable> = core.enumeration([
  [0, 'Instructions', core.Vec$codec(core.lazy(() => InstructionBox$codec))],
  [1, 'Wasm', core.lazy(() => WasmSmartContract$codec)],
])
export type ExecuteTrigger = z.infer<typeof ExecuteTrigger$schema>
export const ExecuteTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const ExecuteTrigger$codec = core.struct([['trigger', core.lazy(() => TriggerId$codec)]])
export type ExecuteTriggerEvent = z.infer<typeof ExecuteTriggerEvent$schema>
export const ExecuteTriggerEvent$schema = z.object({
  triggerId: z.lazy(() => TriggerId$schema),
  authority: z.lazy(() => AccountId$schema),
})
export const ExecuteTriggerEvent$codec = core.struct([
  ['triggerId', core.lazy(() => TriggerId$codec)],
  ['authority', core.lazy(() => AccountId$codec)],
])
export type ExecuteTriggerEventFilter = z.infer<typeof ExecuteTriggerEventFilter$schema>
export const ExecuteTriggerEventFilter$schema = z.object({
  triggerId: core.Option$schema(z.lazy(() => TriggerId$schema)),
  authority: core.Option$schema(z.lazy(() => AccountId$schema)),
})
export const ExecuteTriggerEventFilter$codec = core.struct([
  ['triggerId', core.Option$codec(core.lazy(() => TriggerId$codec))],
  ['authority', core.Option$codec(core.lazy(() => AccountId$codec))],
])
export type ExecutionTime = z.infer<typeof ExecutionTime$schema>
export const ExecutionTime$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('PreCommit') }),
  z.object({ t: z.literal('Schedule'), value: z.lazy(() => Schedule$schema) }),
])
export const ExecutionTime$codec: core.Codec<ExecutionTime> = core.enumeration([
  [0, 'PreCommit'],
  [1, 'Schedule', core.lazy(() => Schedule$codec)],
])
export type Executor = z.infer<typeof Executor$schema>
export const Executor$schema = z.object({ wasm: z.lazy(() => WasmSmartContract$schema) })
export const Executor$codec = core.struct([['wasm', core.lazy(() => WasmSmartContract$codec)]])
export type ExecutorDataModel = z.infer<typeof ExecutorDataModel$schema>
export const ExecutorDataModel$schema = z.object({
  permissions: core.Vec$schema(z.lazy(() => PermissionId$schema)),
  customInstruction: core.Option$schema(z.string()),
  schema: core.Json$schema,
})
export const ExecutorDataModel$codec = core.struct([
  ['permissions', core.Vec$codec(core.lazy(() => PermissionId$codec))],
  ['customInstruction', core.Option$codec(core.String$codec)],
  ['schema', core.Json$codec],
])
export type ExecutorEvent = z.infer<typeof ExecutorEvent$schema>
export const ExecutorEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Upgraded'), value: z.lazy(() => ExecutorUpgrade$schema) }),
])
export const ExecutorEvent$codec: core.Codec<ExecutorEvent> = core.enumeration([
  [0, 'Upgraded', core.lazy(() => ExecutorUpgrade$codec)],
])
export type ExecutorEventFilter = z.infer<typeof ExecutorEventFilter$schema>
export const ExecutorEventFilter$schema = z.object({ eventSet: z.lazy(() => ExecutorEventSet$schema) })
export const ExecutorEventFilter$codec = core.struct([['eventSet', core.lazy(() => ExecutorEventSet$codec)]])
export type ExecutorEventSet = z.infer<typeof ExecutorEventSet$schema>
const ExecutorEventSet$literalSchema = z.literal('Upgraded')
export const ExecutorEventSet$schema = z
  .set(ExecutorEventSet$literalSchema)
  .or(z.array(ExecutorEventSet$literalSchema).transform((arr) => new Set(arr)))
export const ExecutorEventSet$codec = core.bitmap<ExecutorEventSet extends Set<infer T> ? T : never>({ Upgraded: 1 })
export type ExecutorUpgrade = z.infer<typeof ExecutorUpgrade$schema>
export const ExecutorUpgrade$schema = z.object({ newDataModel: z.lazy(() => ExecutorDataModel$schema) })
export const ExecutorUpgrade$codec = core.struct([['newDataModel', core.lazy(() => ExecutorDataModel$codec)]])
export type Fail = z.infer<typeof Fail$schema>
export const Fail$schema = z.object({ message: z.string() })
export const Fail$codec = core.struct([['message', core.String$codec]])
export type FetchSize = z.infer<typeof FetchSize$schema>
export const FetchSize$schema = z.object({ fetchSize: core.Option$schema(core.NonZero$schema(core.U32$schema)) })
export const FetchSize$codec = core.struct([['fetchSize', core.Option$codec(core.NonZero$codec(core.U32$codec))]])
export type FindAccountById = z.infer<typeof FindAccountById$schema>
export const FindAccountById$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindAccountById$codec = core.struct([['id', core.lazy(() => AccountId$codec)]])
export type FindAccountKeyValueByIdAndKey = z.infer<typeof FindAccountKeyValueByIdAndKey$schema>
export const FindAccountKeyValueByIdAndKey$schema = z.object({ id: z.lazy(() => AccountId$schema), key: z.string() })
export const FindAccountKeyValueByIdAndKey$codec = core.struct([
  ['id', core.lazy(() => AccountId$codec)],
  ['key', core.String$codec],
])
export type FindAccountsByDomainId = z.infer<typeof FindAccountsByDomainId$schema>
export const FindAccountsByDomainId$schema = z.object({ domainId: z.lazy(() => DomainId$schema) })
export const FindAccountsByDomainId$codec = core.struct([['domainId', core.lazy(() => DomainId$codec)]])
export type FindAccountsWithAsset = z.infer<typeof FindAccountsWithAsset$schema>
export const FindAccountsWithAsset$schema = z.object({ assetDefinitionId: z.lazy(() => AssetDefinitionId$schema) })
export const FindAccountsWithAsset$codec = core.struct([
  ['assetDefinitionId', core.lazy(() => AssetDefinitionId$codec)],
])
export type FindAssetById = z.infer<typeof FindAssetById$schema>
export const FindAssetById$schema = z.object({ id: z.lazy(() => AssetId$schema) })
export const FindAssetById$codec = core.struct([['id', core.lazy(() => AssetId$codec)]])
export type FindAssetDefinitionById = z.infer<typeof FindAssetDefinitionById$schema>
export const FindAssetDefinitionById$schema = z.object({ id: z.lazy(() => AssetDefinitionId$schema) })
export const FindAssetDefinitionById$codec = core.struct([['id', core.lazy(() => AssetDefinitionId$codec)]])
export type FindAssetDefinitionKeyValueByIdAndKey = z.infer<typeof FindAssetDefinitionKeyValueByIdAndKey$schema>
export const FindAssetDefinitionKeyValueByIdAndKey$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  key: z.string(),
})
export const FindAssetDefinitionKeyValueByIdAndKey$codec = core.struct([
  ['id', core.lazy(() => AssetDefinitionId$codec)],
  ['key', core.String$codec],
])
export type FindAssetKeyValueByIdAndKey = z.infer<typeof FindAssetKeyValueByIdAndKey$schema>
export const FindAssetKeyValueByIdAndKey$schema = z.object({ id: z.lazy(() => AssetId$schema), key: z.string() })
export const FindAssetKeyValueByIdAndKey$codec = core.struct([
  ['id', core.lazy(() => AssetId$codec)],
  ['key', core.String$codec],
])
export type FindAssetQuantityById = z.infer<typeof FindAssetQuantityById$schema>
export const FindAssetQuantityById$schema = z.object({ id: z.lazy(() => AssetId$schema) })
export const FindAssetQuantityById$codec = core.struct([['id', core.lazy(() => AssetId$codec)]])
export type FindAssetsByAccountId = z.infer<typeof FindAssetsByAccountId$schema>
export const FindAssetsByAccountId$schema = z.object({ accountId: z.lazy(() => AccountId$schema) })
export const FindAssetsByAccountId$codec = core.struct([['accountId', core.lazy(() => AccountId$codec)]])
export type FindAssetsByAssetDefinitionId = z.infer<typeof FindAssetsByAssetDefinitionId$schema>
export const FindAssetsByAssetDefinitionId$schema = z.object({
  assetDefinitionId: z.lazy(() => AssetDefinitionId$schema),
})
export const FindAssetsByAssetDefinitionId$codec = core.struct([
  ['assetDefinitionId', core.lazy(() => AssetDefinitionId$codec)],
])
export type FindAssetsByDomainId = z.infer<typeof FindAssetsByDomainId$schema>
export const FindAssetsByDomainId$schema = z.object({ domainId: z.lazy(() => DomainId$schema) })
export const FindAssetsByDomainId$codec = core.struct([['domainId', core.lazy(() => DomainId$codec)]])
export type FindAssetsByDomainIdAndAssetDefinitionId = z.infer<typeof FindAssetsByDomainIdAndAssetDefinitionId$schema>
export const FindAssetsByDomainIdAndAssetDefinitionId$schema = z.object({
  domainId: z.lazy(() => DomainId$schema),
  assetDefinitionId: z.lazy(() => AssetDefinitionId$schema),
})
export const FindAssetsByDomainIdAndAssetDefinitionId$codec = core.struct([
  ['domainId', core.lazy(() => DomainId$codec)],
  ['assetDefinitionId', core.lazy(() => AssetDefinitionId$codec)],
])
export type FindAssetsByName = z.infer<typeof FindAssetsByName$schema>
export const FindAssetsByName$schema = z.object({ name: z.string() })
export const FindAssetsByName$codec = core.struct([['name', core.String$codec]])
export type FindBlockHeaderByHash = z.infer<typeof FindBlockHeaderByHash$schema>
export const FindBlockHeaderByHash$schema = z.object({ hash: z.lazy(() => Hash$schema) })
export const FindBlockHeaderByHash$codec = core.struct([['hash', core.lazy(() => Hash$codec)]])
export type FindDomainById = z.infer<typeof FindDomainById$schema>
export const FindDomainById$schema = z.object({ id: z.lazy(() => DomainId$schema) })
export const FindDomainById$codec = core.struct([['id', core.lazy(() => DomainId$codec)]])
export type FindDomainKeyValueByIdAndKey = z.infer<typeof FindDomainKeyValueByIdAndKey$schema>
export const FindDomainKeyValueByIdAndKey$schema = z.object({ id: z.lazy(() => DomainId$schema), key: z.string() })
export const FindDomainKeyValueByIdAndKey$codec = core.struct([
  ['id', core.lazy(() => DomainId$codec)],
  ['key', core.String$codec],
])
export type FindError = z.infer<typeof FindError$schema>
export const FindError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetId$schema) }),
  z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('Account'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainId$schema) }),
  z.object({ t: z.literal('MetadataKey'), value: z.string() }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => Hash$schema) }),
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => Hash$schema) }),
  z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('Role'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('Permission'), value: z.lazy(() => PermissionId$schema) }),
  z.object({ t: z.literal('Parameter'), value: z.lazy(() => ParameterId$schema) }),
  z.object({ t: z.literal('PublicKey'), value: z.lazy(() => PublicKey$schema) }),
])
export const FindError$codec: core.Codec<FindError> = core.enumeration([
  [0, 'Asset', core.lazy(() => AssetId$codec)],
  [1, 'AssetDefinition', core.lazy(() => AssetDefinitionId$codec)],
  [2, 'Account', core.lazy(() => AccountId$codec)],
  [3, 'Domain', core.lazy(() => DomainId$codec)],
  [4, 'MetadataKey', core.String$codec],
  [5, 'Block', core.lazy(() => Hash$codec)],
  [6, 'Transaction', core.lazy(() => Hash$codec)],
  [7, 'Peer', core.lazy(() => PeerId$codec)],
  [8, 'Trigger', core.lazy(() => TriggerId$codec)],
  [9, 'Role', core.lazy(() => RoleId$codec)],
  [10, 'Permission', core.lazy(() => PermissionId$codec)],
  [11, 'Parameter', core.lazy(() => ParameterId$codec)],
  [12, 'PublicKey', core.lazy(() => PublicKey$codec)],
])
export type FindPermissionsByAccountId = z.infer<typeof FindPermissionsByAccountId$schema>
export const FindPermissionsByAccountId$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindPermissionsByAccountId$codec = core.struct([['id', core.lazy(() => AccountId$codec)]])
export type FindRoleByRoleId = z.infer<typeof FindRoleByRoleId$schema>
export const FindRoleByRoleId$schema = z.object({ id: z.lazy(() => RoleId$schema) })
export const FindRoleByRoleId$codec = core.struct([['id', core.lazy(() => RoleId$codec)]])
export type FindRolesByAccountId = z.infer<typeof FindRolesByAccountId$schema>
export const FindRolesByAccountId$schema = z.object({ id: z.lazy(() => AccountId$schema) })
export const FindRolesByAccountId$codec = core.struct([['id', core.lazy(() => AccountId$codec)]])
export type FindTotalAssetQuantityByAssetDefinitionId = z.infer<typeof FindTotalAssetQuantityByAssetDefinitionId$schema>
export const FindTotalAssetQuantityByAssetDefinitionId$schema = z.object({ id: z.lazy(() => AssetDefinitionId$schema) })
export const FindTotalAssetQuantityByAssetDefinitionId$codec = core.struct([
  ['id', core.lazy(() => AssetDefinitionId$codec)],
])
export type FindTransactionByHash = z.infer<typeof FindTransactionByHash$schema>
export const FindTransactionByHash$schema = z.object({ hash: z.lazy(() => Hash$schema) })
export const FindTransactionByHash$codec = core.struct([['hash', core.lazy(() => Hash$codec)]])
export type FindTransactionsByAccountId = z.infer<typeof FindTransactionsByAccountId$schema>
export const FindTransactionsByAccountId$schema = z.object({ accountId: z.lazy(() => AccountId$schema) })
export const FindTransactionsByAccountId$codec = core.struct([['accountId', core.lazy(() => AccountId$codec)]])
export type FindTriggerById = z.infer<typeof FindTriggerById$schema>
export const FindTriggerById$schema = z.object({ id: z.lazy(() => TriggerId$schema) })
export const FindTriggerById$codec = core.struct([['id', core.lazy(() => TriggerId$codec)]])
export type FindTriggerKeyValueByIdAndKey = z.infer<typeof FindTriggerKeyValueByIdAndKey$schema>
export const FindTriggerKeyValueByIdAndKey$schema = z.object({ id: z.lazy(() => TriggerId$schema), key: z.string() })
export const FindTriggerKeyValueByIdAndKey$codec = core.struct([
  ['id', core.lazy(() => TriggerId$codec)],
  ['key', core.String$codec],
])
export type FindTriggersByAuthorityDomainId = z.infer<typeof FindTriggersByAuthorityDomainId$schema>
export const FindTriggersByAuthorityDomainId$schema = z.object({ domainId: z.lazy(() => DomainId$schema) })
export const FindTriggersByAuthorityDomainId$codec = core.struct([['domainId', core.lazy(() => DomainId$codec)]])
export type FindTriggersByAuthorityId = z.infer<typeof FindTriggersByAuthorityId$schema>
export const FindTriggersByAuthorityId$schema = z.object({ accountId: z.lazy(() => AccountId$schema) })
export const FindTriggersByAuthorityId$codec = core.struct([['accountId', core.lazy(() => AccountId$codec)]])
export type ForwardCursor = z.infer<typeof ForwardCursor$schema>
export const ForwardCursor$schema = z.object({
  queryId: core.Option$schema(z.string()),
  cursor: core.Option$schema(core.NonZero$schema(core.U64$schema)),
})
export const ForwardCursor$codec = core.struct([
  ['queryId', core.Option$codec(core.String$codec)],
  ['cursor', core.Option$codec(core.NonZero$codec(core.U64$codec))],
])
export interface Grant<T0, T1> {
  object: T0
  destination: T1
}
export const Grant$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Grant$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.struct([
    ['object', t0],
    ['destination', t1],
  ])
export type GrantBox = z.infer<typeof GrantBox$schema>
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
export const GrantBox$codec: core.Codec<GrantBox> = core.enumeration([
  [
    0,
    'Permission',
    core.lazy(() =>
      Grant$codec(
        core.lazy(() => Permission$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    1,
    'Role',
    core.lazy(() =>
      Grant$codec(
        core.lazy(() => RoleId$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    2,
    'RolePermission',
    core.lazy(() =>
      Grant$codec(
        core.lazy(() => Permission$codec),
        core.lazy(() => RoleId$codec),
      ),
    ),
  ],
])
export type Hash = core.U8Array<32>
export const Hash$schema = core.U8Array$schema(32)
export const Hash$codec = core.U8Array$codec(32)
export type IdBox = z.infer<typeof IdBox$schema>
export const IdBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('DomainId'), value: z.lazy(() => DomainId$schema) }),
  z.object({ t: z.literal('AccountId'), value: z.lazy(() => AccountId$schema) }),
  z.object({ t: z.literal('AssetDefinitionId'), value: z.lazy(() => AssetDefinitionId$schema) }),
  z.object({ t: z.literal('AssetId'), value: z.lazy(() => AssetId$schema) }),
  z.object({ t: z.literal('PeerId'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('TriggerId'), value: z.lazy(() => TriggerId$schema) }),
  z.object({ t: z.literal('RoleId'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('PermissionId'), value: z.lazy(() => PermissionId$schema) }),
  z.object({ t: z.literal('ParameterId'), value: z.lazy(() => ParameterId$schema) }),
])
export const IdBox$codec: core.Codec<IdBox> = core.enumeration([
  [0, 'DomainId', core.lazy(() => DomainId$codec)],
  [1, 'AccountId', core.lazy(() => AccountId$codec)],
  [2, 'AssetDefinitionId', core.lazy(() => AssetDefinitionId$codec)],
  [3, 'AssetId', core.lazy(() => AssetId$codec)],
  [4, 'PeerId', core.lazy(() => PeerId$codec)],
  [5, 'TriggerId', core.lazy(() => TriggerId$codec)],
  [6, 'RoleId', core.lazy(() => RoleId$codec)],
  [7, 'PermissionId', core.lazy(() => PermissionId$codec)],
  [8, 'ParameterId', core.lazy(() => ParameterId$codec)],
])
export type IdentifiableBox = z.infer<typeof IdentifiableBox$schema>
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
  z.object({ t: z.literal('Parameter'), value: z.lazy(() => Parameter$schema) }),
])
export const IdentifiableBox$codec: core.Codec<IdentifiableBox> = core.enumeration([
  [0, 'NewDomain', core.lazy(() => NewDomain$codec)],
  [1, 'NewAccount', core.lazy(() => NewAccount$codec)],
  [2, 'NewAssetDefinition', core.lazy(() => NewAssetDefinition$codec)],
  [3, 'NewRole', core.lazy(() => NewRole$codec)],
  [4, 'Peer', core.lazy(() => Peer$codec)],
  [5, 'Domain', core.lazy(() => Domain$codec)],
  [6, 'Account', core.lazy(() => Account$codec)],
  [7, 'AssetDefinition', core.lazy(() => AssetDefinition$codec)],
  [8, 'Asset', core.lazy(() => Asset$codec)],
  [9, 'Trigger', core.lazy(() => Trigger$codec)],
  [10, 'Role', core.lazy(() => Role$codec)],
  [11, 'Parameter', core.lazy(() => Parameter$codec)],
])
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
  | { t: 'NewParameter'; value: NewParameter }
  | { t: 'Upgrade'; value: Upgrade }
  | { t: 'Log'; value: Log }
  | { t: 'Custom'; value: Custom }
  | { t: 'Fail'; value: Fail }
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
  | { t: 'NewParameter'; value: z.input<typeof NewParameter$schema> }
  | { t: 'Upgrade'; value: z.input<typeof Upgrade$schema> }
  | { t: 'Log'; value: z.input<typeof Log$schema> }
  | { t: 'Custom'; value: z.input<typeof Custom$schema> }
  | { t: 'Fail'; value: z.input<typeof Fail$schema> }
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
    z.object({ t: z.literal('NewParameter'), value: z.lazy(() => NewParameter$schema) }),
    z.object({ t: z.literal('Upgrade'), value: z.lazy(() => Upgrade$schema) }),
    z.object({ t: z.literal('Log'), value: z.lazy(() => Log$schema) }),
    z.object({ t: z.literal('Custom'), value: z.lazy(() => Custom$schema) }),
    z.object({ t: z.literal('Fail'), value: z.lazy(() => Fail$schema) }),
  ])
export const InstructionBox$codec: core.Codec<InstructionBox> = core.enumeration([
  [0, 'Register', core.lazy(() => RegisterBox$codec)],
  [1, 'Unregister', core.lazy(() => UnregisterBox$codec)],
  [2, 'Mint', core.lazy(() => MintBox$codec)],
  [3, 'Burn', core.lazy(() => BurnBox$codec)],
  [4, 'Transfer', core.lazy(() => TransferBox$codec)],
  [5, 'SetKeyValue', core.lazy(() => SetKeyValueBox$codec)],
  [6, 'RemoveKeyValue', core.lazy(() => RemoveKeyValueBox$codec)],
  [7, 'Grant', core.lazy(() => GrantBox$codec)],
  [8, 'Revoke', core.lazy(() => RevokeBox$codec)],
  [9, 'ExecuteTrigger', core.lazy(() => ExecuteTrigger$codec)],
  [10, 'SetParameter', core.lazy(() => SetParameter$codec)],
  [11, 'NewParameter', core.lazy(() => NewParameter$codec)],
  [12, 'Upgrade', core.lazy(() => Upgrade$codec)],
  [13, 'Log', core.lazy(() => Log$codec)],
  [14, 'Custom', core.lazy(() => Custom$codec)],
  [15, 'Fail', core.lazy(() => Fail$codec)],
])
export type InstructionEvaluationError = z.infer<typeof InstructionEvaluationError$schema>
export const InstructionEvaluationError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Unsupported'), value: z.lazy(() => InstructionType$schema) }),
  z.object({ t: z.literal('PermissionParameter'), value: z.string() }),
  z.object({ t: z.literal('Type'), value: z.lazy(() => TypeError$schema) }),
])
export const InstructionEvaluationError$codec: core.Codec<InstructionEvaluationError> = core.enumeration([
  [0, 'Unsupported', core.lazy(() => InstructionType$codec)],
  [1, 'PermissionParameter', core.String$codec],
  [2, 'Type', core.lazy(() => TypeError$codec)],
])
export type InstructionExecutionError = z.infer<typeof InstructionExecutionError$schema>
export const InstructionExecutionError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Evaluate'), value: z.lazy(() => InstructionEvaluationError$schema) }),
  z.object({ t: z.literal('Query'), value: z.lazy(() => QueryExecutionFail$schema) }),
  z.object({ t: z.literal('Conversion'), value: z.string() }),
  z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('Repetition'), value: z.lazy(() => RepetitionError$schema) }),
  z.object({ t: z.literal('Mintability'), value: z.lazy(() => MintabilityError$schema) }),
  z.object({ t: z.literal('Math'), value: z.lazy(() => MathError$schema) }),
  z.object({ t: z.literal('Metadata'), value: z.lazy(() => MetadataError$schema) }),
  z.object({ t: z.literal('Fail'), value: z.string() }),
  z.object({ t: z.literal('InvalidParameter'), value: z.lazy(() => InvalidParameterError$schema) }),
  z.object({ t: z.literal('InvariantViolation'), value: z.string() }),
])
export const InstructionExecutionError$codec: core.Codec<InstructionExecutionError> = core.enumeration([
  [0, 'Evaluate', core.lazy(() => InstructionEvaluationError$codec)],
  [1, 'Query', core.lazy(() => QueryExecutionFail$codec)],
  [2, 'Conversion', core.String$codec],
  [3, 'Find', core.lazy(() => FindError$codec)],
  [4, 'Repetition', core.lazy(() => RepetitionError$codec)],
  [5, 'Mintability', core.lazy(() => MintabilityError$codec)],
  [6, 'Math', core.lazy(() => MathError$codec)],
  [7, 'Metadata', core.lazy(() => MetadataError$codec)],
  [8, 'Fail', core.String$codec],
  [9, 'InvalidParameter', core.lazy(() => InvalidParameterError$codec)],
  [10, 'InvariantViolation', core.String$codec],
])
export type InstructionExecutionFail = z.infer<typeof InstructionExecutionFail$schema>
export const InstructionExecutionFail$schema = z.object({
  instruction: z.lazy(() => InstructionBox$schema),
  reason: z.string(),
})
export const InstructionExecutionFail$codec = core.struct([
  ['instruction', core.lazy(() => InstructionBox$codec)],
  ['reason', core.String$codec],
])
export type InstructionType = z.infer<typeof InstructionType$schema>
export const InstructionType$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Register') }),
  z.object({ t: z.literal('Unregister') }),
  z.object({ t: z.literal('Mint') }),
  z.object({ t: z.literal('Burn') }),
  z.object({ t: z.literal('Transfer') }),
  z.object({ t: z.literal('SetKeyValue') }),
  z.object({ t: z.literal('RemoveKeyValue') }),
  z.object({ t: z.literal('Grant') }),
  z.object({ t: z.literal('Revoke') }),
  z.object({ t: z.literal('ExecuteTrigger') }),
  z.object({ t: z.literal('SetParameter') }),
  z.object({ t: z.literal('NewParameter') }),
  z.object({ t: z.literal('Upgrade') }),
  z.object({ t: z.literal('Log') }),
  z.object({ t: z.literal('Custom') }),
  z.object({ t: z.literal('Fail') }),
])
export const InstructionType$codec: core.Codec<InstructionType> = core.enumeration([
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
  [11, 'NewParameter'],
  [12, 'Upgrade'],
  [13, 'Log'],
  [14, 'Custom'],
  [15, 'Fail'],
])
export type InvalidParameterError = z.infer<typeof InvalidParameterError$schema>
export const InvalidParameterError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Wasm'), value: z.string() }),
  z.object({ t: z.literal('NameLength') }),
  z.object({ t: z.literal('TimeTriggerInThePast') }),
])
export const InvalidParameterError$codec: core.Codec<InvalidParameterError> = core.enumeration([
  [0, 'Wasm', core.String$codec],
  [1, 'NameLength'],
  [2, 'TimeTriggerInThePast'],
])
export type IpfsPath = z.infer<typeof IpfsPath$schema>
export const IpfsPath$schema = z.object({ path: z.string() })
export const IpfsPath$codec = core.struct([['path', core.String$codec]])
export type Ipv4Addr = core.U8Array<4>
export const Ipv4Addr$schema = core.U8Array$schema(4)
export const Ipv4Addr$codec = core.U8Array$codec(4)
export type Ipv6Addr = core.U16Array<8>
export const Ipv6Addr$schema = core.U16Array$schema(8)
export const Ipv6Addr$codec = core.U16Array$codec(8)
export type LengthLimits = z.infer<typeof LengthLimits$schema>
export const LengthLimits$schema = z.object({ min: core.U32$schema, max: core.U32$schema })
export const LengthLimits$codec = core.struct([
  ['min', core.U32$codec],
  ['max', core.U32$codec],
])
export type Level = z.infer<typeof Level$schema>
export const Level$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('TRACE') }),
  z.object({ t: z.literal('DEBUG') }),
  z.object({ t: z.literal('INFO') }),
  z.object({ t: z.literal('WARN') }),
  z.object({ t: z.literal('ERROR') }),
])
export const Level$codec: core.Codec<Level> = core.enumeration([
  [0, 'TRACE'],
  [1, 'DEBUG'],
  [2, 'INFO'],
  [3, 'WARN'],
  [4, 'ERROR'],
])
export type Limits = z.infer<typeof Limits$schema>
export const Limits$schema = z.object({ capacity: core.U32$schema, maxEntryLen: core.U32$schema })
export const Limits$codec = core.struct([
  ['capacity', core.U32$codec],
  ['maxEntryLen', core.U32$codec],
])
export type Log = z.infer<typeof Log$schema>
export const Log$schema = z.object({ level: z.lazy(() => Level$schema), msg: z.string() })
export const Log$codec = core.struct([
  ['level', core.lazy(() => Level$codec)],
  ['msg', core.String$codec],
])
export type MathError = z.infer<typeof MathError$schema>
export const MathError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Overflow') }),
  z.object({ t: z.literal('NotEnoughQuantity') }),
  z.object({ t: z.literal('DivideByZero') }),
  z.object({ t: z.literal('NegativeValue') }),
  z.object({ t: z.literal('DomainViolation') }),
  z.object({ t: z.literal('Unknown') }),
  z.object({ t: z.literal('FixedPointConversion'), value: z.string() }),
])
export const MathError$codec: core.Codec<MathError> = core.enumeration([
  [0, 'Overflow'],
  [1, 'NotEnoughQuantity'],
  [2, 'DivideByZero'],
  [3, 'NegativeValue'],
  [4, 'DomainViolation'],
  [5, 'Unknown'],
  [6, 'FixedPointConversion', core.String$codec],
])
export type Metadata = core.Map<core.String, MetadataValueBox>
export const Metadata$schema = core.Map$schema(
  z.string(),
  z.lazy(() => MetadataValueBox$schema),
)
export const Metadata$codec = core.Map$codec(
  core.String$codec,
  core.lazy(() => MetadataValueBox$codec),
)
export interface MetadataChanged<T0> {
  target: T0
  key: core.String
  value: MetadataValueBox
}
export const MetadataChanged$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ target: t0, key: z.string(), value: z.lazy(() => MetadataValueBox$schema) })
export const MetadataChanged$codec = <T0,>(t0: core.Codec<T0>) =>
  core.struct([
    ['target', t0],
    ['key', core.String$codec],
    ['value', core.lazy(() => MetadataValueBox$codec)],
  ])
export type MetadataError = z.infer<typeof MetadataError$schema>
export const MetadataError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('EmptyPath') }),
  z.object({ t: z.literal('EntryTooBig'), value: z.lazy(() => SizeError$schema) }),
  z.object({ t: z.literal('MaxCapacity'), value: z.lazy(() => SizeError$schema) }),
  z.object({ t: z.literal('MissingSegment'), value: z.string() }),
  z.object({ t: z.literal('InvalidSegment'), value: z.string() }),
])
export const MetadataError$codec: core.Codec<MetadataError> = core.enumeration([
  [0, 'EmptyPath'],
  [1, 'EntryTooBig', core.lazy(() => SizeError$codec)],
  [2, 'MaxCapacity', core.lazy(() => SizeError$codec)],
  [3, 'MissingSegment', core.String$codec],
  [4, 'InvalidSegment', core.String$codec],
])
export type MetadataValueBox =
  | { t: 'Bool'; value: core.Bool }
  | { t: 'String'; value: core.String }
  | { t: 'Name'; value: core.String }
  | { t: 'Bytes'; value: core.BytesVec }
  | { t: 'Numeric'; value: Numeric }
  | { t: 'LimitedMetadata'; value: Metadata }
  | { t: 'Vec'; value: core.Vec<MetadataValueBox> }
type MetadataValueBox$input =
  | { t: 'Bool'; value: z.input<z.ZodBoolean> }
  | { t: 'String'; value: z.input<z.ZodString> }
  | { t: 'Name'; value: z.input<z.ZodString> }
  | { t: 'Bytes'; value: z.input<typeof core.BytesVec$schema> }
  | { t: 'Numeric'; value: z.input<typeof Numeric$schema> }
  | { t: 'LimitedMetadata'; value: z.input<typeof Metadata$schema> }
  | { t: 'Vec'; value: z.input<ReturnType<typeof core.Vec$schema<typeof MetadataValueBox$schema>>> }
export const MetadataValueBox$schema: z.ZodType<MetadataValueBox, z.ZodTypeDef, MetadataValueBox$input> =
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('Bool'), value: z.boolean() }),
    z.object({ t: z.literal('String'), value: z.string() }),
    z.object({ t: z.literal('Name'), value: z.string() }),
    z.object({ t: z.literal('Bytes'), value: core.BytesVec$schema }),
    z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
    z.object({ t: z.literal('LimitedMetadata'), value: z.lazy(() => Metadata$schema) }),
    z.object({ t: z.literal('Vec'), value: core.Vec$schema(z.lazy(() => MetadataValueBox$schema)).removeDefault() }),
  ])
export const MetadataValueBox$codec: core.Codec<MetadataValueBox> = core.enumeration([
  [0, 'Bool', core.Bool$codec],
  [1, 'String', core.String$codec],
  [2, 'Name', core.String$codec],
  [3, 'Bytes', core.BytesVec$codec],
  [4, 'Numeric', core.lazy(() => Numeric$codec)],
  [5, 'LimitedMetadata', core.lazy(() => Metadata$codec)],
  [6, 'Vec', core.Vec$codec(core.lazy(() => MetadataValueBox$codec))],
])
export interface Mint<T0, T1> {
  object: T0
  destination: T1
}
export const Mint$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Mint$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.struct([
    ['object', t0],
    ['destination', t1],
  ])
export type MintBox = z.infer<typeof MintBox$schema>
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
export const MintBox$codec: core.Codec<MintBox> = core.enumeration([
  [
    0,
    'Asset',
    core.lazy(() =>
      Mint$codec(
        core.lazy(() => Numeric$codec),
        core.lazy(() => AssetId$codec),
      ),
    ),
  ],
  [
    1,
    'TriggerRepetitions',
    core.lazy(() =>
      Mint$codec(
        core.U32$codec,
        core.lazy(() => TriggerId$codec),
      ),
    ),
  ],
])
export type MintabilityError = z.infer<typeof MintabilityError$schema>
export const MintabilityError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('MintUnmintable') }),
  z.object({ t: z.literal('ForbidMintOnMintable') }),
])
export const MintabilityError$codec: core.Codec<MintabilityError> = core.enumeration([
  [0, 'MintUnmintable'],
  [1, 'ForbidMintOnMintable'],
])
export type Mintable = z.infer<typeof Mintable$schema>
export const Mintable$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Infinitely') }),
  z.object({ t: z.literal('Once') }),
  z.object({ t: z.literal('Not') }),
])
export const Mintable$codec: core.Codec<Mintable> = core.enumeration([
  [0, 'Infinitely'],
  [1, 'Once'],
  [2, 'Not'],
])
export type NewAccount = z.infer<typeof NewAccount$schema>
export const NewAccount$schema = z.object({
  id: z.lazy(() => AccountId$schema),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewAccount$codec = core.struct([
  ['id', core.lazy(() => AccountId$codec)],
  ['metadata', core.lazy(() => Metadata$codec)],
])
export type NewAssetDefinition = z.infer<typeof NewAssetDefinition$schema>
export const NewAssetDefinition$schema = z.object({
  id: z.lazy(() => AssetDefinitionId$schema),
  valueType: z.lazy(() => AssetValueType$schema),
  mintable: z.lazy(() => Mintable$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewAssetDefinition$codec = core.struct([
  ['id', core.lazy(() => AssetDefinitionId$codec)],
  ['valueType', core.lazy(() => AssetValueType$codec)],
  ['mintable', core.lazy(() => Mintable$codec)],
  ['logo', core.Option$codec(core.lazy(() => IpfsPath$codec))],
  ['metadata', core.lazy(() => Metadata$codec)],
])
export type NewDomain = z.infer<typeof NewDomain$schema>
export const NewDomain$schema = z.object({
  id: z.lazy(() => DomainId$schema),
  logo: core.Option$schema(z.lazy(() => IpfsPath$schema)),
  metadata: z.lazy(() => Metadata$schema),
})
export const NewDomain$codec = core.struct([
  ['id', core.lazy(() => DomainId$codec)],
  ['logo', core.Option$codec(core.lazy(() => IpfsPath$codec))],
  ['metadata', core.lazy(() => Metadata$codec)],
])
export type NewParameter = z.infer<typeof NewParameter$schema>
export const NewParameter$schema = z.object({ parameter: z.lazy(() => Parameter$schema) })
export const NewParameter$codec = core.struct([['parameter', core.lazy(() => Parameter$codec)]])
export type NewRole = z.infer<typeof NewRole$schema>
export const NewRole$schema = z.object({ inner: z.lazy(() => Role$schema) })
export const NewRole$codec = core.struct([['inner', core.lazy(() => Role$codec)]])
export type Numeric = z.infer<typeof Numeric$schema>
export const Numeric$schema = z.object({ mantissa: core.Compact$schema, scale: core.Compact$schema })
export const Numeric$codec = core.struct([
  ['mantissa', core.Compact$codec],
  ['scale', core.Compact$codec],
])
export type NumericSpec = z.infer<typeof NumericSpec$schema>
export const NumericSpec$schema = z.object({ scale: core.Option$schema(core.U32$schema) })
export const NumericSpec$codec = core.struct([['scale', core.Option$codec(core.U32$codec)]])
export type Pagination = z.infer<typeof Pagination$schema>
export const Pagination$schema = z.object({
  limit: core.Option$schema(core.NonZero$schema(core.U32$schema)),
  start: core.Option$schema(core.NonZero$schema(core.U64$schema)),
})
export const Pagination$codec = core.struct([
  ['limit', core.Option$codec(core.NonZero$codec(core.U32$codec))],
  ['start', core.Option$codec(core.NonZero$codec(core.U64$codec))],
])
export type Parameter = z.infer<typeof Parameter$schema>
export const Parameter$schema = z.object({
  id: z.lazy(() => ParameterId$schema),
  val: z.lazy(() => ParameterValueBox$schema),
})
export const Parameter$codec = core.struct([
  ['id', core.lazy(() => ParameterId$codec)],
  ['val', core.lazy(() => ParameterValueBox$codec)],
])
export type ParameterId = z.infer<typeof ParameterId$schema>
export const ParameterId$schema = z.object({ name: z.string() })
export const ParameterId$codec = core.struct([['name', core.String$codec]])
export type ParameterValueBox = z.infer<typeof ParameterValueBox$schema>
export const ParameterValueBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('TransactionLimits'), value: z.lazy(() => TransactionLimits$schema) }),
  z.object({ t: z.literal('MetadataLimits'), value: z.lazy(() => Limits$schema) }),
  z.object({ t: z.literal('LengthLimits'), value: z.lazy(() => LengthLimits$schema) }),
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
])
export const ParameterValueBox$codec: core.Codec<ParameterValueBox> = core.enumeration([
  [0, 'TransactionLimits', core.lazy(() => TransactionLimits$codec)],
  [1, 'MetadataLimits', core.lazy(() => Limits$codec)],
  [2, 'LengthLimits', core.lazy(() => LengthLimits$codec)],
  [3, 'Numeric', core.lazy(() => Numeric$codec)],
])
export type Peer = z.infer<typeof Peer$schema>
export const Peer$schema = z.object({ id: z.lazy(() => PeerId$schema) })
export const Peer$codec = core.struct([['id', core.lazy(() => PeerId$codec)]])
export type PeerEvent = z.infer<typeof PeerEvent$schema>
export const PeerEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Added'), value: z.lazy(() => PeerId$schema) }),
  z.object({ t: z.literal('Removed'), value: z.lazy(() => PeerId$schema) }),
])
export const PeerEvent$codec: core.Codec<PeerEvent> = core.enumeration([
  [0, 'Added', core.lazy(() => PeerId$codec)],
  [1, 'Removed', core.lazy(() => PeerId$codec)],
])
export type PeerEventFilter = z.infer<typeof PeerEventFilter$schema>
export const PeerEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => PeerId$schema)),
  eventSet: z.lazy(() => PeerEventSet$schema),
})
export const PeerEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => PeerId$codec))],
  ['eventSet', core.lazy(() => PeerEventSet$codec)],
])
export type PeerEventSet = z.infer<typeof PeerEventSet$schema>
const PeerEventSet$literalSchema = z.union([z.literal('Added'), z.literal('Removed')])
export const PeerEventSet$schema = z
  .set(PeerEventSet$literalSchema)
  .or(z.array(PeerEventSet$literalSchema).transform((arr) => new Set(arr)))
export const PeerEventSet$codec = core.bitmap<PeerEventSet extends Set<infer T> ? T : never>({ Added: 1, Removed: 2 })
export type PeerId = z.infer<typeof PeerId$schema>
export const PeerId$schema = z.object({
  address: z.lazy(() => SocketAddr$schema),
  publicKey: z.lazy(() => PublicKey$schema),
})
export const PeerId$codec = core.struct([
  ['address', core.lazy(() => SocketAddr$codec)],
  ['publicKey', core.lazy(() => PublicKey$codec)],
])
export type Permission = z.infer<typeof Permission$schema>
export const Permission$schema = z.object({ id: z.lazy(() => PermissionId$schema), payload: core.Json$schema })
export const Permission$codec = core.struct([
  ['id', core.lazy(() => PermissionId$codec)],
  ['payload', core.Json$codec],
])
export type PermissionId = z.infer<typeof PermissionId$schema>
export const PermissionId$schema = z.object({ name: z.string() })
export const PermissionId$codec = core.struct([['name', core.String$codec]])
export type PipelineEventBox = z.infer<typeof PipelineEventBox$schema>
export const PipelineEventBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEvent$schema) }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEvent$schema) }),
])
export const PipelineEventBox$codec: core.Codec<PipelineEventBox> = core.enumeration([
  [0, 'Transaction', core.lazy(() => TransactionEvent$codec)],
  [1, 'Block', core.lazy(() => BlockEvent$codec)],
])
export type PipelineEventFilterBox = z.infer<typeof PipelineEventFilterBox$schema>
export const PipelineEventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEventFilter$schema) }),
  z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEventFilter$schema) }),
])
export const PipelineEventFilterBox$codec: core.Codec<PipelineEventFilterBox> = core.enumeration([
  [0, 'Transaction', core.lazy(() => TransactionEventFilter$codec)],
  [1, 'Block', core.lazy(() => BlockEventFilter$codec)],
])
export type PredicateBox =
  | { t: 'And'; value: core.Vec<PredicateBox> }
  | { t: 'Or'; value: core.Vec<PredicateBox> }
  | { t: 'Not'; value: PredicateBox }
  | { t: 'Raw'; value: QueryOutputPredicate }
type PredicateBox$input =
  | { t: 'And'; value: z.input<ReturnType<typeof core.Vec$schema<typeof PredicateBox$schema>>> }
  | { t: 'Or'; value: z.input<ReturnType<typeof core.Vec$schema<typeof PredicateBox$schema>>> }
  | { t: 'Not'; value: z.input<typeof PredicateBox$schema> }
  | { t: 'Raw'; value: z.input<typeof QueryOutputPredicate$schema> }
export const PredicateBox$schema: z.ZodType<PredicateBox, z.ZodTypeDef, PredicateBox$input> = z.discriminatedUnion(
  't',
  [
    z.object({ t: z.literal('And'), value: core.Vec$schema(z.lazy(() => PredicateBox$schema)).removeDefault() }),
    z.object({ t: z.literal('Or'), value: core.Vec$schema(z.lazy(() => PredicateBox$schema)).removeDefault() }),
    z.object({ t: z.literal('Not'), value: z.lazy(() => PredicateBox$schema) }),
    z.object({ t: z.literal('Raw'), value: z.lazy(() => QueryOutputPredicate$schema) }),
  ],
)
export const PredicateBox$codec: core.Codec<PredicateBox> = core.enumeration([
  [0, 'And', core.Vec$codec(core.lazy(() => PredicateBox$codec))],
  [1, 'Or', core.Vec$codec(core.lazy(() => PredicateBox$codec))],
  [2, 'Not', core.lazy(() => PredicateBox$codec)],
  [3, 'Raw', core.lazy(() => QueryOutputPredicate$codec)],
])
export type PublicKey = z.infer<typeof PublicKey$schema>
export const PublicKey$schema = z.object({ algorithm: z.lazy(() => Algorithm$schema), payload: core.BytesVec$schema })
export const PublicKey$codec = core.struct([
  ['algorithm', core.lazy(() => Algorithm$codec)],
  ['payload', core.BytesVec$codec],
])
export type QueryBox = z.infer<typeof QueryBox$schema>
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
export const QueryBox$codec: core.Codec<QueryBox> = core.enumeration([
  [0, 'FindAllAccounts'],
  [1, 'FindAccountById', core.lazy(() => FindAccountById$codec)],
  [2, 'FindAccountKeyValueByIdAndKey', core.lazy(() => FindAccountKeyValueByIdAndKey$codec)],
  [3, 'FindAccountsByDomainId', core.lazy(() => FindAccountsByDomainId$codec)],
  [4, 'FindAccountsWithAsset', core.lazy(() => FindAccountsWithAsset$codec)],
  [5, 'FindAllAssets'],
  [6, 'FindAllAssetsDefinitions'],
  [7, 'FindAssetById', core.lazy(() => FindAssetById$codec)],
  [8, 'FindAssetDefinitionById', core.lazy(() => FindAssetDefinitionById$codec)],
  [9, 'FindAssetsByName', core.lazy(() => FindAssetsByName$codec)],
  [10, 'FindAssetsByAccountId', core.lazy(() => FindAssetsByAccountId$codec)],
  [11, 'FindAssetsByAssetDefinitionId', core.lazy(() => FindAssetsByAssetDefinitionId$codec)],
  [12, 'FindAssetsByDomainId', core.lazy(() => FindAssetsByDomainId$codec)],
  [13, 'FindAssetsByDomainIdAndAssetDefinitionId', core.lazy(() => FindAssetsByDomainIdAndAssetDefinitionId$codec)],
  [14, 'FindAssetQuantityById', core.lazy(() => FindAssetQuantityById$codec)],
  [15, 'FindTotalAssetQuantityByAssetDefinitionId', core.lazy(() => FindTotalAssetQuantityByAssetDefinitionId$codec)],
  [16, 'FindAssetKeyValueByIdAndKey', core.lazy(() => FindAssetKeyValueByIdAndKey$codec)],
  [17, 'FindAssetDefinitionKeyValueByIdAndKey', core.lazy(() => FindAssetDefinitionKeyValueByIdAndKey$codec)],
  [18, 'FindAllDomains'],
  [19, 'FindDomainById', core.lazy(() => FindDomainById$codec)],
  [20, 'FindDomainKeyValueByIdAndKey', core.lazy(() => FindDomainKeyValueByIdAndKey$codec)],
  [21, 'FindAllPeers'],
  [22, 'FindAllBlocks'],
  [23, 'FindAllBlockHeaders'],
  [24, 'FindBlockHeaderByHash', core.lazy(() => FindBlockHeaderByHash$codec)],
  [25, 'FindAllTransactions'],
  [26, 'FindTransactionsByAccountId', core.lazy(() => FindTransactionsByAccountId$codec)],
  [27, 'FindTransactionByHash', core.lazy(() => FindTransactionByHash$codec)],
  [28, 'FindPermissionsByAccountId', core.lazy(() => FindPermissionsByAccountId$codec)],
  [29, 'FindExecutorDataModel'],
  [30, 'FindAllActiveTriggerIds'],
  [31, 'FindTriggerById', core.lazy(() => FindTriggerById$codec)],
  [32, 'FindTriggerKeyValueByIdAndKey', core.lazy(() => FindTriggerKeyValueByIdAndKey$codec)],
  [33, 'FindTriggersByAuthorityId', core.lazy(() => FindTriggersByAuthorityId$codec)],
  [34, 'FindTriggersByAuthorityDomainId', core.lazy(() => FindTriggersByAuthorityDomainId$codec)],
  [35, 'FindAllRoles'],
  [36, 'FindAllRoleIds'],
  [37, 'FindRoleByRoleId', core.lazy(() => FindRoleByRoleId$codec)],
  [38, 'FindRolesByAccountId', core.lazy(() => FindRolesByAccountId$codec)],
  [39, 'FindAllParameters'],
])
export type QueryExecutionFail = z.infer<typeof QueryExecutionFail$schema>
export const QueryExecutionFail$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('Conversion'), value: z.string() }),
  z.object({ t: z.literal('UnknownCursor') }),
  z.object({ t: z.literal('FetchSizeTooBig') }),
  z.object({ t: z.literal('InvalidSingularParameters') }),
])
export const QueryExecutionFail$codec: core.Codec<QueryExecutionFail> = core.enumeration([
  [0, 'Find', core.lazy(() => FindError$codec)],
  [1, 'Conversion', core.String$codec],
  [2, 'UnknownCursor'],
  [3, 'FetchSizeTooBig'],
  [4, 'InvalidSingularParameters'],
])
export type QueryOutputBox =
  | { t: 'Id'; value: IdBox }
  | { t: 'Identifiable'; value: IdentifiableBox }
  | { t: 'Transaction'; value: TransactionQueryOutput }
  | { t: 'Permission'; value: Permission }
  | { t: 'LimitedMetadata'; value: MetadataValueBox }
  | { t: 'Numeric'; value: Numeric }
  | { t: 'BlockHeader'; value: BlockHeader }
  | { t: 'Block'; value: SignedBlock }
  | { t: 'ExecutorDataModel'; value: ExecutorDataModel }
  | { t: 'Vec'; value: core.Vec<QueryOutputBox> }
type QueryOutputBox$input =
  | { t: 'Id'; value: z.input<typeof IdBox$schema> }
  | { t: 'Identifiable'; value: z.input<typeof IdentifiableBox$schema> }
  | { t: 'Transaction'; value: z.input<typeof TransactionQueryOutput$schema> }
  | { t: 'Permission'; value: z.input<typeof Permission$schema> }
  | { t: 'LimitedMetadata'; value: z.input<typeof MetadataValueBox$schema> }
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
    z.object({ t: z.literal('LimitedMetadata'), value: z.lazy(() => MetadataValueBox$schema) }),
    z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }),
    z.object({ t: z.literal('BlockHeader'), value: z.lazy(() => BlockHeader$schema) }),
    z.object({ t: z.literal('Block'), value: z.lazy(() => SignedBlock$schema) }),
    z.object({ t: z.literal('ExecutorDataModel'), value: z.lazy(() => ExecutorDataModel$schema) }),
    z.object({ t: z.literal('Vec'), value: core.Vec$schema(z.lazy(() => QueryOutputBox$schema)).removeDefault() }),
  ])
export const QueryOutputBox$codec: core.Codec<QueryOutputBox> = core.enumeration([
  [0, 'Id', core.lazy(() => IdBox$codec)],
  [1, 'Identifiable', core.lazy(() => IdentifiableBox$codec)],
  [2, 'Transaction', core.lazy(() => TransactionQueryOutput$codec)],
  [3, 'Permission', core.lazy(() => Permission$codec)],
  [4, 'LimitedMetadata', core.lazy(() => MetadataValueBox$codec)],
  [5, 'Numeric', core.lazy(() => Numeric$codec)],
  [6, 'BlockHeader', core.lazy(() => BlockHeader$codec)],
  [7, 'Block', core.lazy(() => SignedBlock$codec)],
  [8, 'ExecutorDataModel', core.lazy(() => ExecutorDataModel$codec)],
  [9, 'Vec', core.Vec$codec(core.lazy(() => QueryOutputBox$codec))],
])
export type QueryOutputPredicate =
  | { t: 'Identifiable'; value: StringPredicate }
  | { t: 'Container'; value: Container }
  | { t: 'Display'; value: StringPredicate }
  | { t: 'Numerical'; value: SemiRange }
  | { t: 'TimeStamp'; value: SemiInterval<core.U128> }
  | { t: 'Pass' }
type QueryOutputPredicate$input =
  | { t: 'Identifiable'; value: z.input<typeof StringPredicate$schema> }
  | { t: 'Container'; value: z.input<typeof Container$schema> }
  | { t: 'Display'; value: z.input<typeof StringPredicate$schema> }
  | { t: 'Numerical'; value: z.input<typeof SemiRange$schema> }
  | { t: 'TimeStamp'; value: z.input<ReturnType<typeof SemiInterval$schema<typeof core.U128$schema>>> }
  | { t: 'Pass' }
export const QueryOutputPredicate$schema: z.ZodType<QueryOutputPredicate, z.ZodTypeDef, QueryOutputPredicate$input> =
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('Identifiable'), value: z.lazy(() => StringPredicate$schema) }),
    z.object({ t: z.literal('Container'), value: z.lazy(() => Container$schema) }),
    z.object({ t: z.literal('Display'), value: z.lazy(() => StringPredicate$schema) }),
    z.object({ t: z.literal('Numerical'), value: z.lazy(() => SemiRange$schema) }),
    z.object({ t: z.literal('TimeStamp'), value: z.lazy(() => SemiInterval$schema(core.U128$schema)) }),
    z.object({ t: z.literal('Pass') }),
  ])
export const QueryOutputPredicate$codec: core.Codec<QueryOutputPredicate> = core.enumeration([
  [0, 'Identifiable', core.lazy(() => StringPredicate$codec)],
  [1, 'Container', core.lazy(() => Container$codec)],
  [2, 'Display', core.lazy(() => StringPredicate$codec)],
  [3, 'Numerical', core.lazy(() => SemiRange$codec)],
  [4, 'TimeStamp', core.lazy(() => SemiInterval$codec(core.U128$codec))],
  [5, 'Pass'],
])
export type RawGenesisTransaction = z.infer<typeof RawGenesisTransaction$schema>
export const RawGenesisTransaction$schema = z.object({
  chain: z.string(),
  executor: z.string(),
  instructions: core.Vec$schema(z.lazy(() => InstructionBox$schema)),
  topology: core.Vec$schema(z.lazy(() => PeerId$schema)),
})
export const RawGenesisTransaction$codec = core.struct([
  ['chain', core.String$codec],
  ['executor', core.String$codec],
  ['instructions', core.Vec$codec(core.lazy(() => InstructionBox$codec))],
  ['topology', core.Vec$codec(core.lazy(() => PeerId$codec))],
])
export interface Register<T0> {
  object: T0
}
export const Register$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Register$codec = <T0,>(t0: core.Codec<T0>) => core.struct([['object', t0]])
export type RegisterBox = z.infer<typeof RegisterBox$schema>
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
export const RegisterBox$codec: core.Codec<RegisterBox> = core.enumeration([
  [0, 'Peer', core.lazy(() => Register$codec(core.lazy(() => Peer$codec)))],
  [1, 'Domain', core.lazy(() => Register$codec(core.lazy(() => NewDomain$codec)))],
  [2, 'Account', core.lazy(() => Register$codec(core.lazy(() => NewAccount$codec)))],
  [3, 'AssetDefinition', core.lazy(() => Register$codec(core.lazy(() => NewAssetDefinition$codec)))],
  [4, 'Asset', core.lazy(() => Register$codec(core.lazy(() => Asset$codec)))],
  [5, 'Role', core.lazy(() => Register$codec(core.lazy(() => NewRole$codec)))],
  [6, 'Trigger', core.lazy(() => Register$codec(core.lazy(() => Trigger$codec)))],
])
export interface RemoveKeyValue<T0> {
  object: T0
  key: core.String
  value: MetadataValueBox
}
export const RemoveKeyValue$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ object: t0, key: z.string(), value: z.lazy(() => MetadataValueBox$schema) })
export const RemoveKeyValue$codec = <T0,>(t0: core.Codec<T0>) =>
  core.struct([
    ['object', t0],
    ['key', core.String$codec],
    ['value', core.lazy(() => MetadataValueBox$codec)],
  ])
export type RemoveKeyValueBox = z.infer<typeof RemoveKeyValueBox$schema>
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
export const RemoveKeyValueBox$codec: core.Codec<RemoveKeyValueBox> = core.enumeration([
  [0, 'Domain', core.lazy(() => RemoveKeyValue$codec(core.lazy(() => Domain$codec)))],
  [1, 'Account', core.lazy(() => RemoveKeyValue$codec(core.lazy(() => Account$codec)))],
  [2, 'AssetDefinition', core.lazy(() => RemoveKeyValue$codec(core.lazy(() => AssetDefinition$codec)))],
  [3, 'Asset', core.lazy(() => RemoveKeyValue$codec(core.lazy(() => Asset$codec)))],
  [4, 'Trigger', core.lazy(() => RemoveKeyValue$codec(core.lazy(() => Trigger$codec)))],
])
export type Repeats = z.infer<typeof Repeats$schema>
export const Repeats$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Indefinitely') }),
  z.object({ t: z.literal('Exactly'), value: core.U32$schema }),
])
export const Repeats$codec: core.Codec<Repeats> = core.enumeration([
  [0, 'Indefinitely'],
  [1, 'Exactly', core.U32$codec],
])
export type RepetitionError = z.infer<typeof RepetitionError$schema>
export const RepetitionError$schema = z.object({
  instructionType: z.lazy(() => InstructionType$schema),
  id: z.lazy(() => IdBox$schema),
})
export const RepetitionError$codec = core.struct([
  ['instructionType', core.lazy(() => InstructionType$codec)],
  ['id', core.lazy(() => IdBox$codec)],
])
export interface Revoke<T0, T1> {
  object: T0
  destination: T1
}
export const Revoke$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) =>
  z.object({ object: t0, destination: t1 })
export const Revoke$codec = <T0, T1>(t0: core.Codec<T0>, t1: core.Codec<T1>) =>
  core.struct([
    ['object', t0],
    ['destination', t1],
  ])
export type RevokeBox = z.infer<typeof RevokeBox$schema>
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
export const RevokeBox$codec: core.Codec<RevokeBox> = core.enumeration([
  [
    0,
    'Permission',
    core.lazy(() =>
      Revoke$codec(
        core.lazy(() => Permission$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    1,
    'Role',
    core.lazy(() =>
      Revoke$codec(
        core.lazy(() => RoleId$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    2,
    'RolePermission',
    core.lazy(() =>
      Revoke$codec(
        core.lazy(() => Permission$codec),
        core.lazy(() => RoleId$codec),
      ),
    ),
  ],
])
export type Role = z.infer<typeof Role$schema>
export const Role$schema = z.object({
  id: z.lazy(() => RoleId$schema),
  permissions: core.Vec$schema(z.lazy(() => Permission$schema)),
})
export const Role$codec = core.struct([
  ['id', core.lazy(() => RoleId$codec)],
  ['permissions', core.Vec$codec(core.lazy(() => Permission$codec))],
])
export type RoleEvent = z.infer<typeof RoleEvent$schema>
export const RoleEvent$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Created'), value: z.lazy(() => Role$schema) }),
  z.object({ t: z.literal('Deleted'), value: z.lazy(() => RoleId$schema) }),
  z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => RolePermissionChanged$schema) }),
  z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => RolePermissionChanged$schema) }),
])
export const RoleEvent$codec: core.Codec<RoleEvent> = core.enumeration([
  [0, 'Created', core.lazy(() => Role$codec)],
  [1, 'Deleted', core.lazy(() => RoleId$codec)],
  [2, 'PermissionRemoved', core.lazy(() => RolePermissionChanged$codec)],
  [3, 'PermissionAdded', core.lazy(() => RolePermissionChanged$codec)],
])
export type RoleEventFilter = z.infer<typeof RoleEventFilter$schema>
export const RoleEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => RoleId$schema)),
  eventSet: z.lazy(() => RoleEventSet$schema),
})
export const RoleEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => RoleId$codec))],
  ['eventSet', core.lazy(() => RoleEventSet$codec)],
])
export type RoleEventSet = z.infer<typeof RoleEventSet$schema>
const RoleEventSet$literalSchema = z.union([
  z.literal('Created'),
  z.literal('Deleted'),
  z.literal('PermissionRemoved'),
  z.literal('PermissionAdded'),
])
export const RoleEventSet$schema = z
  .set(RoleEventSet$literalSchema)
  .or(z.array(RoleEventSet$literalSchema).transform((arr) => new Set(arr)))
export const RoleEventSet$codec = core.bitmap<RoleEventSet extends Set<infer T> ? T : never>({
  Created: 1,
  Deleted: 2,
  PermissionRemoved: 4,
  PermissionAdded: 8,
})
export type RoleId = z.infer<typeof RoleId$schema>
export const RoleId$schema = z.object({ name: z.string() })
export const RoleId$codec = core.struct([['name', core.String$codec]])
export type RolePermissionChanged = z.infer<typeof RolePermissionChanged$schema>
export const RolePermissionChanged$schema = z.object({
  role: z.lazy(() => RoleId$schema),
  permission: z.lazy(() => PermissionId$schema),
})
export const RolePermissionChanged$codec = core.struct([
  ['role', core.lazy(() => RoleId$codec)],
  ['permission', core.lazy(() => PermissionId$codec)],
])
export type Schedule = z.infer<typeof Schedule$schema>
export const Schedule$schema = z.object({
  start: z.lazy(() => Duration$schema),
  period: core.Option$schema(z.lazy(() => Duration$schema)),
})
export const Schedule$codec = core.struct([
  ['start', core.lazy(() => Duration$codec)],
  ['period', core.Option$codec(core.lazy(() => Duration$codec))],
])
export interface SemiInterval<T0> {
  start: T0
  limit: T0
}
export const SemiInterval$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ start: t0, limit: t0 })
export const SemiInterval$codec = <T0,>(t0: core.Codec<T0>) =>
  core.struct([
    ['start', t0],
    ['limit', t0],
  ])
export type SemiRange = z.infer<typeof SemiRange$schema>
export const SemiRange$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Numeric'), value: z.lazy(() => SemiInterval$schema(z.lazy(() => Numeric$schema))) }),
])
export const SemiRange$codec: core.Codec<SemiRange> = core.enumeration([
  [0, 'Numeric', core.lazy(() => SemiInterval$codec(core.lazy(() => Numeric$codec)))],
])
export interface SetKeyValue<T0> {
  object: T0
  key: core.String
  value: MetadataValueBox
}
export const SetKeyValue$schema = <T0 extends z.ZodType>(t0: T0) =>
  z.object({ object: t0, key: z.string(), value: z.lazy(() => MetadataValueBox$schema) })
export const SetKeyValue$codec = <T0,>(t0: core.Codec<T0>) =>
  core.struct([
    ['object', t0],
    ['key', core.String$codec],
    ['value', core.lazy(() => MetadataValueBox$codec)],
  ])
export type SetKeyValueBox = z.infer<typeof SetKeyValueBox$schema>
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
export const SetKeyValueBox$codec: core.Codec<SetKeyValueBox> = core.enumeration([
  [0, 'Domain', core.lazy(() => SetKeyValue$codec(core.lazy(() => Domain$codec)))],
  [1, 'Account', core.lazy(() => SetKeyValue$codec(core.lazy(() => Account$codec)))],
  [2, 'AssetDefinition', core.lazy(() => SetKeyValue$codec(core.lazy(() => AssetDefinition$codec)))],
  [3, 'Asset', core.lazy(() => SetKeyValue$codec(core.lazy(() => Asset$codec)))],
  [4, 'Trigger', core.lazy(() => SetKeyValue$codec(core.lazy(() => Trigger$codec)))],
])
export type SetParameter = z.infer<typeof SetParameter$schema>
export const SetParameter$schema = z.object({ parameter: z.lazy(() => Parameter$schema) })
export const SetParameter$codec = core.struct([['parameter', core.lazy(() => Parameter$codec)]])
export type Signature = z.infer<typeof Signature$schema>
export const Signature$schema = z.object({ payload: core.BytesVec$schema })
export const Signature$codec = core.struct([['payload', core.BytesVec$codec]])
export type SignedBlock = z.infer<typeof SignedBlock$schema>
export const SignedBlock$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedBlockV1$schema) }),
])
export const SignedBlock$codec: core.Codec<SignedBlock> = core.enumeration([
  [1, 'V1', core.lazy(() => SignedBlockV1$codec)],
])
export type SignedBlockV1 = z.infer<typeof SignedBlockV1$schema>
export const SignedBlockV1$schema = z.object({
  signatures: core.Vec$schema(z.lazy(() => BlockSignature$schema)),
  payload: z.lazy(() => BlockPayload$schema),
})
export const SignedBlockV1$codec = core.struct([
  ['signatures', core.Vec$codec(core.lazy(() => BlockSignature$codec))],
  ['payload', core.lazy(() => BlockPayload$codec)],
])
export type SignedQuery = z.infer<typeof SignedQuery$schema>
export const SignedQuery$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedQueryV1$schema) }),
])
export const SignedQuery$codec: core.Codec<SignedQuery> = core.enumeration([
  [1, 'V1', core.lazy(() => SignedQueryV1$codec)],
])
export type SignedQueryV1 = z.infer<typeof SignedQueryV1$schema>
export const SignedQueryV1$schema = z.object({
  signature: z.lazy(() => Signature$schema),
  payload: z.lazy(() => ClientQueryPayload$schema),
})
export const SignedQueryV1$codec = core.struct([
  ['signature', core.lazy(() => Signature$codec)],
  ['payload', core.lazy(() => ClientQueryPayload$codec)],
])
export type SignedTransaction = z.infer<typeof SignedTransaction$schema>
export const SignedTransaction$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('V1'), value: z.lazy(() => SignedTransactionV1$schema) }),
])
export const SignedTransaction$codec: core.Codec<SignedTransaction> = core.enumeration([
  [1, 'V1', core.lazy(() => SignedTransactionV1$codec)],
])
export type SignedTransactionV1 = z.infer<typeof SignedTransactionV1$schema>
export const SignedTransactionV1$schema = z.object({
  signature: z.lazy(() => Signature$schema),
  payload: z.lazy(() => TransactionPayload$schema),
})
export const SignedTransactionV1$codec = core.struct([
  ['signature', core.lazy(() => Signature$codec)],
  ['payload', core.lazy(() => TransactionPayload$codec)],
])
export type SizeError = z.infer<typeof SizeError$schema>
export const SizeError$schema = z.object({ limits: z.lazy(() => Limits$schema), actual: core.U64$schema })
export const SizeError$codec = core.struct([
  ['limits', core.lazy(() => Limits$codec)],
  ['actual', core.U64$codec],
])
export type SocketAddr = z.infer<typeof SocketAddr$schema>
export const SocketAddr$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Ipv4'), value: z.lazy(() => SocketAddrV4$schema) }),
  z.object({ t: z.literal('Ipv6'), value: z.lazy(() => SocketAddrV6$schema) }),
  z.object({ t: z.literal('Host'), value: z.lazy(() => SocketAddrHost$schema) }),
])
export const SocketAddr$codec: core.Codec<SocketAddr> = core.enumeration([
  [0, 'Ipv4', core.lazy(() => SocketAddrV4$codec)],
  [1, 'Ipv6', core.lazy(() => SocketAddrV6$codec)],
  [2, 'Host', core.lazy(() => SocketAddrHost$codec)],
])
export type SocketAddrHost = z.infer<typeof SocketAddrHost$schema>
export const SocketAddrHost$schema = z.object({ host: z.string(), port: core.U16$schema })
export const SocketAddrHost$codec = core.struct([
  ['host', core.String$codec],
  ['port', core.U16$codec],
])
export type SocketAddrV4 = z.infer<typeof SocketAddrV4$schema>
export const SocketAddrV4$schema = z.object({ ip: z.lazy(() => Ipv4Addr$schema), port: core.U16$schema })
export const SocketAddrV4$codec = core.struct([
  ['ip', core.lazy(() => Ipv4Addr$codec)],
  ['port', core.U16$codec],
])
export type SocketAddrV6 = z.infer<typeof SocketAddrV6$schema>
export const SocketAddrV6$schema = z.object({ ip: z.lazy(() => Ipv6Addr$schema), port: core.U16$schema })
export const SocketAddrV6$codec = core.struct([
  ['ip', core.lazy(() => Ipv6Addr$codec)],
  ['port', core.U16$codec],
])
export type Sorting = z.infer<typeof Sorting$schema>
export const Sorting$schema = z.object({ sortByMetadataKey: core.Option$schema(z.string()) })
export const Sorting$codec = core.struct([['sortByMetadataKey', core.Option$codec(core.String$codec)]])
export type StringPredicate = z.infer<typeof StringPredicate$schema>
export const StringPredicate$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Contains'), value: z.string() }),
  z.object({ t: z.literal('StartsWith'), value: z.string() }),
  z.object({ t: z.literal('EndsWith'), value: z.string() }),
  z.object({ t: z.literal('Is'), value: z.string() }),
])
export const StringPredicate$codec: core.Codec<StringPredicate> = core.enumeration([
  [0, 'Contains', core.String$codec],
  [1, 'StartsWith', core.String$codec],
  [2, 'EndsWith', core.String$codec],
  [3, 'Is', core.String$codec],
])
export type TimeEvent = z.infer<typeof TimeEvent$schema>
export const TimeEvent$schema = z.object({
  prevInterval: core.Option$schema(z.lazy(() => TimeInterval$schema)),
  interval: z.lazy(() => TimeInterval$schema),
})
export const TimeEvent$codec = core.struct([
  ['prevInterval', core.Option$codec(core.lazy(() => TimeInterval$codec))],
  ['interval', core.lazy(() => TimeInterval$codec)],
])
export type TimeInterval = z.infer<typeof TimeInterval$schema>
export const TimeInterval$schema = z.object({
  since: z.lazy(() => Duration$schema),
  length: z.lazy(() => Duration$schema),
})
export const TimeInterval$codec = core.struct([
  ['since', core.lazy(() => Duration$codec)],
  ['length', core.lazy(() => Duration$codec)],
])
export type TransactionEvent = z.infer<typeof TransactionEvent$schema>
export const TransactionEvent$schema = z.object({
  hash: z.lazy(() => Hash$schema),
  blockHeight: core.Option$schema(core.U64$schema),
  status: z.lazy(() => TransactionStatus$schema),
})
export const TransactionEvent$codec = core.struct([
  ['hash', core.lazy(() => Hash$codec)],
  ['blockHeight', core.Option$codec(core.U64$codec)],
  ['status', core.lazy(() => TransactionStatus$codec)],
])
export type TransactionEventFilter = z.infer<typeof TransactionEventFilter$schema>
export const TransactionEventFilter$schema = z.object({
  hash: core.Option$schema(z.lazy(() => Hash$schema)),
  blockHeight: core.Option$schema(core.Option$schema(core.U64$schema)),
  status: core.Option$schema(z.lazy(() => TransactionStatus$schema)),
})
export const TransactionEventFilter$codec = core.struct([
  ['hash', core.Option$codec(core.lazy(() => Hash$codec))],
  ['blockHeight', core.Option$codec(core.Option$codec(core.U64$codec))],
  ['status', core.Option$codec(core.lazy(() => TransactionStatus$codec))],
])
export type TransactionLimitError = z.infer<typeof TransactionLimitError$schema>
export const TransactionLimitError$schema = z.object({ reason: z.string() })
export const TransactionLimitError$codec = core.struct([['reason', core.String$codec]])
export type TransactionLimits = z.infer<typeof TransactionLimits$schema>
export const TransactionLimits$schema = z.object({
  maxInstructionNumber: core.U64$schema,
  maxWasmSizeBytes: core.U64$schema,
})
export const TransactionLimits$codec = core.struct([
  ['maxInstructionNumber', core.U64$codec],
  ['maxWasmSizeBytes', core.U64$codec],
])
export type TransactionPayload = z.infer<typeof TransactionPayload$schema>
export const TransactionPayload$schema = z.object({
  chain: z.string(),
  authority: z.lazy(() => AccountId$schema),
  creationTimeMs: core.U64$schema,
  instructions: z.lazy(() => Executable$schema),
  timeToLiveMs: core.Option$schema(core.NonZero$schema(core.U64$schema)),
  nonce: core.Option$schema(core.NonZero$schema(core.U32$schema)),
  metadata: core.Map$schema(
    z.string(),
    z.lazy(() => MetadataValueBox$schema),
  ),
})
export const TransactionPayload$codec = core.struct([
  ['chain', core.String$codec],
  ['authority', core.lazy(() => AccountId$codec)],
  ['creationTimeMs', core.U64$codec],
  ['instructions', core.lazy(() => Executable$codec)],
  ['timeToLiveMs', core.Option$codec(core.NonZero$codec(core.U64$codec))],
  ['nonce', core.Option$codec(core.NonZero$codec(core.U32$codec))],
  [
    'metadata',
    core.Map$codec(
      core.String$codec,
      core.lazy(() => MetadataValueBox$codec),
    ),
  ],
])
export type TransactionQueryOutput = z.infer<typeof TransactionQueryOutput$schema>
export const TransactionQueryOutput$schema = z.object({
  blockHash: z.lazy(() => Hash$schema),
  transaction: z.lazy(() => CommittedTransaction$schema),
})
export const TransactionQueryOutput$codec = core.struct([
  ['blockHash', core.lazy(() => Hash$codec)],
  ['transaction', core.lazy(() => CommittedTransaction$codec)],
])
export type TransactionRejectionReason = z.infer<typeof TransactionRejectionReason$schema>
export const TransactionRejectionReason$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('AccountDoesNotExist'), value: z.lazy(() => FindError$schema) }),
  z.object({ t: z.literal('LimitCheck'), value: z.lazy(() => TransactionLimitError$schema) }),
  z.object({ t: z.literal('Validation'), value: z.lazy(() => ValidationFail$schema) }),
  z.object({ t: z.literal('InstructionExecution'), value: z.lazy(() => InstructionExecutionFail$schema) }),
  z.object({ t: z.literal('WasmExecution'), value: z.lazy(() => WasmExecutionFail$schema) }),
])
export const TransactionRejectionReason$codec: core.Codec<TransactionRejectionReason> = core.enumeration([
  [0, 'AccountDoesNotExist', core.lazy(() => FindError$codec)],
  [1, 'LimitCheck', core.lazy(() => TransactionLimitError$codec)],
  [2, 'Validation', core.lazy(() => ValidationFail$codec)],
  [3, 'InstructionExecution', core.lazy(() => InstructionExecutionFail$codec)],
  [4, 'WasmExecution', core.lazy(() => WasmExecutionFail$codec)],
])
export type TransactionStatus = z.infer<typeof TransactionStatus$schema>
export const TransactionStatus$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Queued') }),
  z.object({ t: z.literal('Expired') }),
  z.object({ t: z.literal('Approved') }),
  z.object({ t: z.literal('Rejected'), value: z.lazy(() => TransactionRejectionReason$schema) }),
])
export const TransactionStatus$codec: core.Codec<TransactionStatus> = core.enumeration([
  [0, 'Queued'],
  [1, 'Expired'],
  [2, 'Approved'],
  [3, 'Rejected', core.lazy(() => TransactionRejectionReason$codec)],
])
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
  core.struct([
    ['source', t0],
    ['object', t1],
    ['destination', t2],
  ])
export type TransferBox = z.infer<typeof TransferBox$schema>
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
export const TransferBox$codec: core.Codec<TransferBox> = core.enumeration([
  [
    0,
    'Domain',
    core.lazy(() =>
      Transfer$codec(
        core.lazy(() => AccountId$codec),
        core.lazy(() => DomainId$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [
    1,
    'AssetDefinition',
    core.lazy(() =>
      Transfer$codec(
        core.lazy(() => AccountId$codec),
        core.lazy(() => AssetDefinitionId$codec),
        core.lazy(() => AccountId$codec),
      ),
    ),
  ],
  [2, 'Asset', core.lazy(() => AssetTransferBox$codec)],
])
export type Trigger = z.infer<typeof Trigger$schema>
export const Trigger$schema = z.object({ id: z.lazy(() => TriggerId$schema), action: z.lazy(() => Action$schema) })
export const Trigger$codec = core.struct([
  ['id', core.lazy(() => TriggerId$codec)],
  ['action', core.lazy(() => Action$codec)],
])
export type TriggerCompletedEvent = z.infer<typeof TriggerCompletedEvent$schema>
export const TriggerCompletedEvent$schema = z.object({
  triggerId: z.lazy(() => TriggerId$schema),
  outcome: z.lazy(() => TriggerCompletedOutcome$schema),
})
export const TriggerCompletedEvent$codec = core.struct([
  ['triggerId', core.lazy(() => TriggerId$codec)],
  ['outcome', core.lazy(() => TriggerCompletedOutcome$codec)],
])
export type TriggerCompletedEventFilter = z.infer<typeof TriggerCompletedEventFilter$schema>
export const TriggerCompletedEventFilter$schema = z.object({
  triggerId: core.Option$schema(z.lazy(() => TriggerId$schema)),
  outcomeType: core.Option$schema(z.lazy(() => TriggerCompletedOutcomeType$schema)),
})
export const TriggerCompletedEventFilter$codec = core.struct([
  ['triggerId', core.Option$codec(core.lazy(() => TriggerId$codec))],
  ['outcomeType', core.Option$codec(core.lazy(() => TriggerCompletedOutcomeType$codec))],
])
export type TriggerCompletedOutcome = z.infer<typeof TriggerCompletedOutcome$schema>
export const TriggerCompletedOutcome$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Success') }),
  z.object({ t: z.literal('Failure'), value: z.string() }),
])
export const TriggerCompletedOutcome$codec: core.Codec<TriggerCompletedOutcome> = core.enumeration([
  [0, 'Success'],
  [1, 'Failure', core.String$codec],
])
export type TriggerCompletedOutcomeType = z.infer<typeof TriggerCompletedOutcomeType$schema>
export const TriggerCompletedOutcomeType$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Success') }),
  z.object({ t: z.literal('Failure') }),
])
export const TriggerCompletedOutcomeType$codec: core.Codec<TriggerCompletedOutcomeType> = core.enumeration([
  [0, 'Success'],
  [1, 'Failure'],
])
export type TriggerEvent = z.infer<typeof TriggerEvent$schema>
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
export const TriggerEvent$codec: core.Codec<TriggerEvent> = core.enumeration([
  [0, 'Created', core.lazy(() => TriggerId$codec)],
  [1, 'Deleted', core.lazy(() => TriggerId$codec)],
  [2, 'Extended', core.lazy(() => TriggerNumberOfExecutionsChanged$codec)],
  [3, 'Shortened', core.lazy(() => TriggerNumberOfExecutionsChanged$codec)],
  [4, 'MetadataInserted', core.lazy(() => MetadataChanged$codec(core.lazy(() => TriggerId$codec)))],
  [5, 'MetadataRemoved', core.lazy(() => MetadataChanged$codec(core.lazy(() => TriggerId$codec)))],
])
export type TriggerEventFilter = z.infer<typeof TriggerEventFilter$schema>
export const TriggerEventFilter$schema = z.object({
  idMatcher: core.Option$schema(z.lazy(() => TriggerId$schema)),
  eventSet: z.lazy(() => TriggerEventSet$schema),
})
export const TriggerEventFilter$codec = core.struct([
  ['idMatcher', core.Option$codec(core.lazy(() => TriggerId$codec))],
  ['eventSet', core.lazy(() => TriggerEventSet$codec)],
])
export type TriggerEventSet = z.infer<typeof TriggerEventSet$schema>
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
export const TriggerId$schema = z.object({ name: z.string() })
export const TriggerId$codec = core.struct([['name', core.String$codec]])
export type TriggerNumberOfExecutionsChanged = z.infer<typeof TriggerNumberOfExecutionsChanged$schema>
export const TriggerNumberOfExecutionsChanged$schema = z.object({
  trigger: z.lazy(() => TriggerId$schema),
  by: core.U32$schema,
})
export const TriggerNumberOfExecutionsChanged$codec = core.struct([
  ['trigger', core.lazy(() => TriggerId$codec)],
  ['by', core.U32$codec],
])
export type TriggeringEventFilterBox = z.infer<typeof TriggeringEventFilterBox$schema>
export const TriggeringEventFilterBox$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventFilterBox$schema) }),
  z.object({ t: z.literal('Data'), value: z.lazy(() => DataEventFilter$schema) }),
  z.object({ t: z.literal('Time'), value: z.lazy(() => ExecutionTime$schema) }),
  z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEventFilter$schema) }),
])
export const TriggeringEventFilterBox$codec: core.Codec<TriggeringEventFilterBox> = core.enumeration([
  [0, 'Pipeline', core.lazy(() => PipelineEventFilterBox$codec)],
  [1, 'Data', core.lazy(() => DataEventFilter$codec)],
  [2, 'Time', core.lazy(() => ExecutionTime$codec)],
  [3, 'ExecuteTrigger', core.lazy(() => ExecuteTriggerEventFilter$codec)],
])
export type TypeError = z.infer<typeof TypeError$schema>
export const TypeError$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('AssetValueType'), value: z.lazy(() => AssetValueTypeMismatch$schema) }),
  z.object({ t: z.literal('NumericAssetValueTypeExpected'), value: z.lazy(() => AssetValueType$schema) }),
  z.object({ t: z.literal('StoreAssetValueTypeExpected'), value: z.lazy(() => AssetValueType$schema) }),
])
export const TypeError$codec: core.Codec<TypeError> = core.enumeration([
  [0, 'AssetValueType', core.lazy(() => AssetValueTypeMismatch$codec)],
  [1, 'NumericAssetValueTypeExpected', core.lazy(() => AssetValueType$codec)],
  [2, 'StoreAssetValueTypeExpected', core.lazy(() => AssetValueType$codec)],
])
export interface Unregister<T0> {
  object: T0
}
export const Unregister$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Unregister$codec = <T0,>(t0: core.Codec<T0>) => core.struct([['object', t0]])
export type UnregisterBox = z.infer<typeof UnregisterBox$schema>
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
export const UnregisterBox$codec: core.Codec<UnregisterBox> = core.enumeration([
  [0, 'Peer', core.lazy(() => Unregister$codec(core.lazy(() => PeerId$codec)))],
  [1, 'Domain', core.lazy(() => Unregister$codec(core.lazy(() => DomainId$codec)))],
  [2, 'Account', core.lazy(() => Unregister$codec(core.lazy(() => AccountId$codec)))],
  [3, 'AssetDefinition', core.lazy(() => Unregister$codec(core.lazy(() => AssetDefinitionId$codec)))],
  [4, 'Asset', core.lazy(() => Unregister$codec(core.lazy(() => AssetId$codec)))],
  [5, 'Role', core.lazy(() => Unregister$codec(core.lazy(() => RoleId$codec)))],
  [6, 'Trigger', core.lazy(() => Unregister$codec(core.lazy(() => TriggerId$codec)))],
])
export type Upgrade = z.infer<typeof Upgrade$schema>
export const Upgrade$schema = z.object({ executor: z.lazy(() => Executor$schema) })
export const Upgrade$codec = core.struct([['executor', core.lazy(() => Executor$codec)]])
export type ValidationFail = z.infer<typeof ValidationFail$schema>
export const ValidationFail$schema = z.discriminatedUnion('t', [
  z.object({ t: z.literal('NotPermitted'), value: z.string() }),
  z.object({ t: z.literal('InstructionFailed'), value: z.lazy(() => InstructionExecutionError$schema) }),
  z.object({ t: z.literal('QueryFailed'), value: z.lazy(() => QueryExecutionFail$schema) }),
  z.object({ t: z.literal('TooComplex') }),
  z.object({ t: z.literal('InternalError') }),
])
export const ValidationFail$codec: core.Codec<ValidationFail> = core.enumeration([
  [0, 'NotPermitted', core.String$codec],
  [1, 'InstructionFailed', core.lazy(() => InstructionExecutionError$codec)],
  [2, 'QueryFailed', core.lazy(() => QueryExecutionFail$codec)],
  [3, 'TooComplex'],
  [4, 'InternalError'],
])
export type WasmExecutionFail = z.infer<typeof WasmExecutionFail$schema>
export const WasmExecutionFail$schema = z.object({ reason: z.string() })
export const WasmExecutionFail$codec = core.struct([['reason', core.String$codec]])
export type WasmSmartContract = z.infer<typeof WasmSmartContract$schema>
export const WasmSmartContract$schema = z.object({ blob: core.BytesVec$schema })
export const WasmSmartContract$codec = core.struct([['blob', core.BytesVec$codec]])
