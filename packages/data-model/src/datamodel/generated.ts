import { lib, z } from './generated-prelude'

export type Account = z.infer<typeof Account$schema>
export const Account = (input: z.input<typeof Account$schema>): Account => Account$schema.parse(input)
export const Account$schema = z.object({ id: lib.AccountId$schema, metadata: z.lazy(() => Metadata$schema) })
export const Account$codec = lib.structCodec<Account>([['id', lib.AccountId$codec], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type AccountEvent = z.infer<typeof AccountEvent$schema>
export const AccountEvent = (input: z.input<typeof AccountEvent$schema>): AccountEvent => AccountEvent$schema.parse(input)
export const AccountEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => Account$schema) }), z.object({ t: z.literal('Deleted'), value: lib.AccountId$schema }), z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetEvent$schema) }), z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => AccountPermissionChanged$schema) }), z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => AccountPermissionChanged$schema) }), z.object({ t: z.literal('RoleGranted'), value: z.lazy(() => AccountRoleChanged$schema) }), z.object({ t: z.literal('RoleRevoked'), value: z.lazy(() => AccountRoleChanged$schema) }), z.object({ t: z.literal('MetadataInserted'), value: z.lazy(() => MetadataChanged$schema(lib.AccountId$schema)) }), z.object({ t: z.literal('MetadataRemoved'), value: z.lazy(() => MetadataChanged$schema(lib.AccountId$schema)) })])
export const AccountEvent$codec: lib.Codec<AccountEvent> = lib.enumCodec<{ Created: [Account], Deleted: [lib.AccountId], Asset: [AssetEvent], PermissionAdded: [AccountPermissionChanged], PermissionRemoved: [AccountPermissionChanged], RoleGranted: [AccountRoleChanged], RoleRevoked: [AccountRoleChanged], MetadataInserted: [MetadataChanged<lib.AccountId>], MetadataRemoved: [MetadataChanged<lib.AccountId>] }>([[0, 'Created', lib.lazyCodec(() => Account$codec)], [1, 'Deleted', lib.AccountId$codec], [2, 'Asset', lib.lazyCodec(() => AssetEvent$codec)], [3, 'PermissionAdded', lib.lazyCodec(() => AccountPermissionChanged$codec)], [4, 'PermissionRemoved', lib.lazyCodec(() => AccountPermissionChanged$codec)], [5, 'RoleGranted', lib.lazyCodec(() => AccountRoleChanged$codec)], [6, 'RoleRevoked', lib.lazyCodec(() => AccountRoleChanged$codec)], [7, 'MetadataInserted', lib.lazyCodec(() => MetadataChanged$codec(lib.AccountId$codec))], [8, 'MetadataRemoved', lib.lazyCodec(() => MetadataChanged$codec(lib.AccountId$codec))]]).discriminated()

export type AccountEventFilter = z.infer<typeof AccountEventFilter$schema>
export const AccountEventFilter = (input: z.input<typeof AccountEventFilter$schema>): AccountEventFilter => AccountEventFilter$schema.parse(input)
export const AccountEventFilter$schema = z.object({ idMatcher: lib.Option$schema(lib.AccountId$schema), eventSet: z.lazy(() => AccountEventSet$schema) })
export const AccountEventFilter$codec = lib.structCodec<AccountEventFilter>([['idMatcher', lib.Option$codec(lib.AccountId$codec)], ['eventSet', lib.lazyCodec(() => AccountEventSet$codec)]])

export type AccountEventSet = z.infer<typeof AccountEventSet$schema>
export const AccountEventSet = (input: z.input<typeof AccountEventSet$schema>): AccountEventSet => AccountEventSet$schema.parse(input)
const AccountEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('AnyAsset'), z.literal('PermissionAdded'), z.literal('PermissionRemoved'), z.literal('RoleGranted'), z.literal('RoleRevoked'), z.literal('MetadataInserted'), z.literal('MetadataRemoved')])
export const AccountEventSet$schema = z.set(AccountEventSet$literalSchema).or(z.array(AccountEventSet$literalSchema).transform(arr => new Set(arr)))
export const AccountEventSet$codec = lib.bitmap<AccountEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, AnyAsset: 4, PermissionAdded: 8, PermissionRemoved: 16, RoleGranted: 32, RoleRevoked: 64, MetadataInserted: 128, MetadataRemoved: 256 })

export type AccountIdPredicateBox = z.infer<typeof AccountIdPredicateBox$schema>
export const AccountIdPredicateBox = (input: z.input<typeof AccountIdPredicateBox$schema>): AccountIdPredicateBox => AccountIdPredicateBox$schema.parse(input)
export const AccountIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.AccountId$schema }), z.object({ t: z.literal('DomainId'), value: z.lazy(() => DomainIdPredicateBox$schema) }), z.object({ t: z.literal('Signatory'), value: z.lazy(() => PublicKeyPredicateBox$schema) })])
export const AccountIdPredicateBox$codec: lib.Codec<AccountIdPredicateBox> = lib.enumCodec<{ Equals: [lib.AccountId], DomainId: [DomainIdPredicateBox], Signatory: [PublicKeyPredicateBox] }>([[0, 'Equals', lib.AccountId$codec], [1, 'DomainId', lib.lazyCodec(() => DomainIdPredicateBox$codec)], [2, 'Signatory', lib.lazyCodec(() => PublicKeyPredicateBox$codec)]]).discriminated()

export type AccountPermissionChanged = z.infer<typeof AccountPermissionChanged$schema>
export const AccountPermissionChanged = (input: z.input<typeof AccountPermissionChanged$schema>): AccountPermissionChanged => AccountPermissionChanged$schema.parse(input)
export const AccountPermissionChanged$schema = z.object({ account: lib.AccountId$schema, permission: z.lazy(() => Permission$schema) })
export const AccountPermissionChanged$codec = lib.structCodec<AccountPermissionChanged>([['account', lib.AccountId$codec], ['permission', lib.lazyCodec(() => Permission$codec)]])

export type AccountPredicateBox = z.infer<typeof AccountPredicateBox$schema>
export const AccountPredicateBox = (input: z.input<typeof AccountPredicateBox$schema>): AccountPredicateBox => AccountPredicateBox$schema.parse(input)
export const AccountPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => AccountIdPredicateBox$schema) }), z.object({ t: z.literal('Metadata'), value: z.lazy(() => MetadataPredicateBox$schema) })])
export const AccountPredicateBox$codec: lib.Codec<AccountPredicateBox> = lib.enumCodec<{ Id: [AccountIdPredicateBox], Metadata: [MetadataPredicateBox] }>([[0, 'Id', lib.lazyCodec(() => AccountIdPredicateBox$codec)], [1, 'Metadata', lib.lazyCodec(() => MetadataPredicateBox$codec)]]).discriminated()

export type AccountRoleChanged = z.infer<typeof AccountRoleChanged$schema>
export const AccountRoleChanged = (input: z.input<typeof AccountRoleChanged$schema>): AccountRoleChanged => AccountRoleChanged$schema.parse(input)
export const AccountRoleChanged$schema = z.object({ account: lib.AccountId$schema, role: z.lazy(() => RoleId$schema) })
export const AccountRoleChanged$codec = lib.structCodec<AccountRoleChanged>([['account', lib.AccountId$codec], ['role', lib.lazyCodec(() => RoleId$codec)]])

export type Action = z.infer<typeof Action$schema>
export const Action = (input: z.input<typeof Action$schema>): Action => Action$schema.parse(input)
export const Action$schema = z.object({ executable: z.lazy(() => Executable$schema), repeats: z.lazy(() => Repeats$schema), authority: lib.AccountId$schema, filter: z.lazy(() => EventFilterBox$schema), metadata: z.lazy(() => Metadata$schema) })
export const Action$codec = lib.structCodec<Action>([['executable', lib.lazyCodec(() => Executable$codec)], ['repeats', lib.lazyCodec(() => Repeats$codec)], ['authority', lib.AccountId$codec], ['filter', lib.lazyCodec(() => EventFilterBox$codec)], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type Asset = z.infer<typeof Asset$schema>
export const Asset = (input: z.input<typeof Asset$schema>): Asset => Asset$schema.parse(input)
export const Asset$schema = z.object({ id: lib.AssetId$schema, value: z.lazy(() => AssetValue$schema) })
export const Asset$codec = lib.structCodec<Asset>([['id', lib.AssetId$codec], ['value', lib.lazyCodec(() => AssetValue$codec)]])

export type AssetChanged = z.infer<typeof AssetChanged$schema>
export const AssetChanged = (input: z.input<typeof AssetChanged$schema>): AssetChanged => AssetChanged$schema.parse(input)
export const AssetChanged$schema = z.object({ asset: lib.AssetId$schema, amount: z.lazy(() => AssetValue$schema) })
export const AssetChanged$codec = lib.structCodec<AssetChanged>([['asset', lib.AssetId$codec], ['amount', lib.lazyCodec(() => AssetValue$codec)]])

export type AssetDefinition = z.infer<typeof AssetDefinition$schema>
export const AssetDefinition = (input: z.input<typeof AssetDefinition$schema>): AssetDefinition => AssetDefinition$schema.parse(input)
export const AssetDefinition$schema = z.object({ id: lib.AssetDefinitionId$schema, type: z.lazy(() => AssetType$schema), mintable: z.lazy(() => Mintable$schema), logo: lib.Option$schema(z.lazy(() => IpfsPath$schema)), metadata: z.lazy(() => Metadata$schema), ownedBy: lib.AccountId$schema, totalQuantity: z.lazy(() => Numeric$schema) })
export const AssetDefinition$codec = lib.structCodec<AssetDefinition>([['id', lib.AssetDefinitionId$codec], ['type', lib.lazyCodec(() => AssetType$codec)], ['mintable', lib.lazyCodec(() => Mintable$codec)], ['logo', lib.Option$codec(lib.lazyCodec(() => IpfsPath$codec))], ['metadata', lib.lazyCodec(() => Metadata$codec)], ['ownedBy', lib.AccountId$codec], ['totalQuantity', lib.lazyCodec(() => Numeric$codec)]])

export type AssetDefinitionEvent = z.infer<typeof AssetDefinitionEvent$schema>
export const AssetDefinitionEvent = (input: z.input<typeof AssetDefinitionEvent$schema>): AssetDefinitionEvent => AssetDefinitionEvent$schema.parse(input)
export const AssetDefinitionEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => AssetDefinition$schema) }), z.object({ t: z.literal('Deleted'), value: lib.AssetDefinitionId$schema }), z.object({ t: z.literal('MetadataInserted'), value: z.lazy(() => MetadataChanged$schema(lib.AssetDefinitionId$schema)) }), z.object({ t: z.literal('MetadataRemoved'), value: z.lazy(() => MetadataChanged$schema(lib.AssetDefinitionId$schema)) }), z.object({ t: z.literal('MintabilityChanged'), value: lib.AssetDefinitionId$schema }), z.object({ t: z.literal('TotalQuantityChanged'), value: z.lazy(() => AssetDefinitionTotalQuantityChanged$schema) }), z.object({ t: z.literal('OwnerChanged'), value: z.lazy(() => AssetDefinitionOwnerChanged$schema) })])
export const AssetDefinitionEvent$codec: lib.Codec<AssetDefinitionEvent> = lib.enumCodec<{ Created: [AssetDefinition], Deleted: [lib.AssetDefinitionId], MetadataInserted: [MetadataChanged<lib.AssetDefinitionId>], MetadataRemoved: [MetadataChanged<lib.AssetDefinitionId>], MintabilityChanged: [lib.AssetDefinitionId], TotalQuantityChanged: [AssetDefinitionTotalQuantityChanged], OwnerChanged: [AssetDefinitionOwnerChanged] }>([[0, 'Created', lib.lazyCodec(() => AssetDefinition$codec)], [1, 'Deleted', lib.AssetDefinitionId$codec], [2, 'MetadataInserted', lib.lazyCodec(() => MetadataChanged$codec(lib.AssetDefinitionId$codec))], [3, 'MetadataRemoved', lib.lazyCodec(() => MetadataChanged$codec(lib.AssetDefinitionId$codec))], [4, 'MintabilityChanged', lib.AssetDefinitionId$codec], [5, 'TotalQuantityChanged', lib.lazyCodec(() => AssetDefinitionTotalQuantityChanged$codec)], [6, 'OwnerChanged', lib.lazyCodec(() => AssetDefinitionOwnerChanged$codec)]]).discriminated()

export type AssetDefinitionEventFilter = z.infer<typeof AssetDefinitionEventFilter$schema>
export const AssetDefinitionEventFilter = (input: z.input<typeof AssetDefinitionEventFilter$schema>): AssetDefinitionEventFilter => AssetDefinitionEventFilter$schema.parse(input)
export const AssetDefinitionEventFilter$schema = z.object({ idMatcher: lib.Option$schema(lib.AssetDefinitionId$schema), eventSet: z.lazy(() => AssetDefinitionEventSet$schema) })
export const AssetDefinitionEventFilter$codec = lib.structCodec<AssetDefinitionEventFilter>([['idMatcher', lib.Option$codec(lib.AssetDefinitionId$codec)], ['eventSet', lib.lazyCodec(() => AssetDefinitionEventSet$codec)]])

export type AssetDefinitionEventSet = z.infer<typeof AssetDefinitionEventSet$schema>
export const AssetDefinitionEventSet = (input: z.input<typeof AssetDefinitionEventSet$schema>): AssetDefinitionEventSet => AssetDefinitionEventSet$schema.parse(input)
const AssetDefinitionEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('MetadataInserted'), z.literal('MetadataRemoved'), z.literal('MintabilityChanged'), z.literal('TotalQuantityChanged'), z.literal('OwnerChanged')])
export const AssetDefinitionEventSet$schema = z.set(AssetDefinitionEventSet$literalSchema).or(z.array(AssetDefinitionEventSet$literalSchema).transform(arr => new Set(arr)))
export const AssetDefinitionEventSet$codec = lib.bitmap<AssetDefinitionEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, MetadataInserted: 4, MetadataRemoved: 8, MintabilityChanged: 16, TotalQuantityChanged: 32, OwnerChanged: 64 })

export type AssetDefinitionIdPredicateBox = z.infer<typeof AssetDefinitionIdPredicateBox$schema>
export const AssetDefinitionIdPredicateBox = (input: z.input<typeof AssetDefinitionIdPredicateBox$schema>): AssetDefinitionIdPredicateBox => AssetDefinitionIdPredicateBox$schema.parse(input)
export const AssetDefinitionIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.AssetDefinitionId$schema }), z.object({ t: z.literal('DomainId'), value: z.lazy(() => DomainIdPredicateBox$schema) }), z.object({ t: z.literal('Name'), value: z.lazy(() => StringPredicateBox$schema) })])
export const AssetDefinitionIdPredicateBox$codec: lib.Codec<AssetDefinitionIdPredicateBox> = lib.enumCodec<{ Equals: [lib.AssetDefinitionId], DomainId: [DomainIdPredicateBox], Name: [StringPredicateBox] }>([[0, 'Equals', lib.AssetDefinitionId$codec], [1, 'DomainId', lib.lazyCodec(() => DomainIdPredicateBox$codec)], [2, 'Name', lib.lazyCodec(() => StringPredicateBox$codec)]]).discriminated()

export type AssetDefinitionOwnerChanged = z.infer<typeof AssetDefinitionOwnerChanged$schema>
export const AssetDefinitionOwnerChanged = (input: z.input<typeof AssetDefinitionOwnerChanged$schema>): AssetDefinitionOwnerChanged => AssetDefinitionOwnerChanged$schema.parse(input)
export const AssetDefinitionOwnerChanged$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema, newOwner: lib.AccountId$schema })
export const AssetDefinitionOwnerChanged$codec = lib.structCodec<AssetDefinitionOwnerChanged>([['assetDefinition', lib.AssetDefinitionId$codec], ['newOwner', lib.AccountId$codec]])

export type AssetDefinitionPredicateBox = z.infer<typeof AssetDefinitionPredicateBox$schema>
export const AssetDefinitionPredicateBox = (input: z.input<typeof AssetDefinitionPredicateBox$schema>): AssetDefinitionPredicateBox => AssetDefinitionPredicateBox$schema.parse(input)
export const AssetDefinitionPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => AssetDefinitionIdPredicateBox$schema) }), z.object({ t: z.literal('Metadata'), value: z.lazy(() => MetadataPredicateBox$schema) }), z.object({ t: z.literal('OwnedBy'), value: z.lazy(() => AccountIdPredicateBox$schema) })])
export const AssetDefinitionPredicateBox$codec: lib.Codec<AssetDefinitionPredicateBox> = lib.enumCodec<{ Id: [AssetDefinitionIdPredicateBox], Metadata: [MetadataPredicateBox], OwnedBy: [AccountIdPredicateBox] }>([[0, 'Id', lib.lazyCodec(() => AssetDefinitionIdPredicateBox$codec)], [1, 'Metadata', lib.lazyCodec(() => MetadataPredicateBox$codec)], [2, 'OwnedBy', lib.lazyCodec(() => AccountIdPredicateBox$codec)]]).discriminated()

export type AssetDefinitionTotalQuantityChanged = z.infer<typeof AssetDefinitionTotalQuantityChanged$schema>
export const AssetDefinitionTotalQuantityChanged = (input: z.input<typeof AssetDefinitionTotalQuantityChanged$schema>): AssetDefinitionTotalQuantityChanged => AssetDefinitionTotalQuantityChanged$schema.parse(input)
export const AssetDefinitionTotalQuantityChanged$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema, totalAmount: z.lazy(() => Numeric$schema) })
export const AssetDefinitionTotalQuantityChanged$codec = lib.structCodec<AssetDefinitionTotalQuantityChanged>([['assetDefinition', lib.AssetDefinitionId$codec], ['totalAmount', lib.lazyCodec(() => Numeric$codec)]])

export type AssetEvent = z.infer<typeof AssetEvent$schema>
export const AssetEvent = (input: z.input<typeof AssetEvent$schema>): AssetEvent => AssetEvent$schema.parse(input)
export const AssetEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => Asset$schema) }), z.object({ t: z.literal('Deleted'), value: lib.AssetId$schema }), z.object({ t: z.literal('Added'), value: z.lazy(() => AssetChanged$schema) }), z.object({ t: z.literal('Removed'), value: z.lazy(() => AssetChanged$schema) }), z.object({ t: z.literal('MetadataInserted'), value: z.lazy(() => MetadataChanged$schema(lib.AssetId$schema)) }), z.object({ t: z.literal('MetadataRemoved'), value: z.lazy(() => MetadataChanged$schema(lib.AssetId$schema)) })])
export const AssetEvent$codec: lib.Codec<AssetEvent> = lib.enumCodec<{ Created: [Asset], Deleted: [lib.AssetId], Added: [AssetChanged], Removed: [AssetChanged], MetadataInserted: [MetadataChanged<lib.AssetId>], MetadataRemoved: [MetadataChanged<lib.AssetId>] }>([[0, 'Created', lib.lazyCodec(() => Asset$codec)], [1, 'Deleted', lib.AssetId$codec], [2, 'Added', lib.lazyCodec(() => AssetChanged$codec)], [3, 'Removed', lib.lazyCodec(() => AssetChanged$codec)], [4, 'MetadataInserted', lib.lazyCodec(() => MetadataChanged$codec(lib.AssetId$codec))], [5, 'MetadataRemoved', lib.lazyCodec(() => MetadataChanged$codec(lib.AssetId$codec))]]).discriminated()

export type AssetEventFilter = z.infer<typeof AssetEventFilter$schema>
export const AssetEventFilter = (input: z.input<typeof AssetEventFilter$schema>): AssetEventFilter => AssetEventFilter$schema.parse(input)
export const AssetEventFilter$schema = z.object({ idMatcher: lib.Option$schema(lib.AssetId$schema), eventSet: z.lazy(() => AssetEventSet$schema) })
export const AssetEventFilter$codec = lib.structCodec<AssetEventFilter>([['idMatcher', lib.Option$codec(lib.AssetId$codec)], ['eventSet', lib.lazyCodec(() => AssetEventSet$codec)]])

export type AssetEventSet = z.infer<typeof AssetEventSet$schema>
export const AssetEventSet = (input: z.input<typeof AssetEventSet$schema>): AssetEventSet => AssetEventSet$schema.parse(input)
const AssetEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('Added'), z.literal('Removed'), z.literal('MetadataInserted'), z.literal('MetadataRemoved')])
export const AssetEventSet$schema = z.set(AssetEventSet$literalSchema).or(z.array(AssetEventSet$literalSchema).transform(arr => new Set(arr)))
export const AssetEventSet$codec = lib.bitmap<AssetEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, Added: 4, Removed: 8, MetadataInserted: 16, MetadataRemoved: 32 })

export type AssetIdPredicateBox = z.infer<typeof AssetIdPredicateBox$schema>
export const AssetIdPredicateBox = (input: z.input<typeof AssetIdPredicateBox$schema>): AssetIdPredicateBox => AssetIdPredicateBox$schema.parse(input)
export const AssetIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.AssetId$schema }), z.object({ t: z.literal('DefinitionId'), value: z.lazy(() => AssetDefinitionIdPredicateBox$schema) }), z.object({ t: z.literal('AccountId'), value: z.lazy(() => AccountIdPredicateBox$schema) })])
export const AssetIdPredicateBox$codec: lib.Codec<AssetIdPredicateBox> = lib.enumCodec<{ Equals: [lib.AssetId], DefinitionId: [AssetDefinitionIdPredicateBox], AccountId: [AccountIdPredicateBox] }>([[0, 'Equals', lib.AssetId$codec], [1, 'DefinitionId', lib.lazyCodec(() => AssetDefinitionIdPredicateBox$codec)], [2, 'AccountId', lib.lazyCodec(() => AccountIdPredicateBox$codec)]]).discriminated()

export type AssetPredicateBox = z.infer<typeof AssetPredicateBox$schema>
export const AssetPredicateBox = (input: z.input<typeof AssetPredicateBox$schema>): AssetPredicateBox => AssetPredicateBox$schema.parse(input)
export const AssetPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => AssetIdPredicateBox$schema) }), z.object({ t: z.literal('Value'), value: z.lazy(() => AssetValuePredicateBox$schema) })])
export const AssetPredicateBox$codec: lib.Codec<AssetPredicateBox> = lib.enumCodec<{ Id: [AssetIdPredicateBox], Value: [AssetValuePredicateBox] }>([[0, 'Id', lib.lazyCodec(() => AssetIdPredicateBox$codec)], [1, 'Value', lib.lazyCodec(() => AssetValuePredicateBox$codec)]]).discriminated()

export type AssetTransferBox = z.infer<typeof AssetTransferBox$schema>
export const AssetTransferBox = (input: z.input<typeof AssetTransferBox$schema>): AssetTransferBox => AssetTransferBox$schema.parse(input)
export const AssetTransferBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Numeric'), value: z.lazy(() => Transfer$schema(lib.AssetId$schema, z.lazy(() => Numeric$schema), lib.AccountId$schema)) }), z.object({ t: z.literal('Store'), value: z.lazy(() => Transfer$schema(lib.AssetId$schema, z.lazy(() => Metadata$schema), lib.AccountId$schema)) })])
export const AssetTransferBox$codec: lib.Codec<AssetTransferBox> = lib.enumCodec<{ Numeric: [Transfer<lib.AssetId, Numeric, lib.AccountId>], Store: [Transfer<lib.AssetId, Metadata, lib.AccountId>] }>([[0, 'Numeric', lib.lazyCodec(() => Transfer$codec(lib.AssetId$codec, lib.lazyCodec(() => Numeric$codec), lib.AccountId$codec))], [1, 'Store', lib.lazyCodec(() => Transfer$codec(lib.AssetId$codec, lib.lazyCodec(() => Metadata$codec), lib.AccountId$codec))]]).discriminated()

export type AssetType = z.infer<typeof AssetType$schema>
export const AssetType = (input: z.input<typeof AssetType$schema>): AssetType => AssetType$schema.parse(input)
export const AssetType$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Numeric'), value: z.lazy(() => NumericSpec$schema) }), z.object({ t: z.literal('Store') })])
export const AssetType$codec: lib.Codec<AssetType> = lib.enumCodec<{ Numeric: [NumericSpec], Store: [] }>([[0, 'Numeric', lib.lazyCodec(() => NumericSpec$codec)], [1, 'Store']]).discriminated()

export type AssetTypeMismatch = z.infer<typeof AssetTypeMismatch$schema>
export const AssetTypeMismatch = (input: z.input<typeof AssetTypeMismatch$schema>): AssetTypeMismatch => AssetTypeMismatch$schema.parse(input)
export const AssetTypeMismatch$schema = z.object({ expected: z.lazy(() => AssetType$schema), actual: z.lazy(() => AssetType$schema) })
export const AssetTypeMismatch$codec = lib.structCodec<AssetTypeMismatch>([['expected', lib.lazyCodec(() => AssetType$codec)], ['actual', lib.lazyCodec(() => AssetType$codec)]])

export type AssetValue = z.infer<typeof AssetValue$schema>
export const AssetValue = (input: z.input<typeof AssetValue$schema>): AssetValue => AssetValue$schema.parse(input)
export const AssetValue$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }), z.object({ t: z.literal('Store'), value: z.lazy(() => Metadata$schema) })])
export const AssetValue$codec: lib.Codec<AssetValue> = lib.enumCodec<{ Numeric: [Numeric], Store: [Metadata] }>([[0, 'Numeric', lib.lazyCodec(() => Numeric$codec)], [1, 'Store', lib.lazyCodec(() => Metadata$codec)]]).discriminated()

export type AssetValuePredicateBox = never
export const AssetValuePredicateBox$schema = z.never()
export const AssetValuePredicateBox$codec = lib.neverCodec

export type BlockEvent = z.infer<typeof BlockEvent$schema>
export const BlockEvent = (input: z.input<typeof BlockEvent$schema>): BlockEvent => BlockEvent$schema.parse(input)
export const BlockEvent$schema = z.object({ header: z.lazy(() => BlockHeader$schema), status: z.lazy(() => BlockStatus$schema) })
export const BlockEvent$codec = lib.structCodec<BlockEvent>([['header', lib.lazyCodec(() => BlockHeader$codec)], ['status', lib.lazyCodec(() => BlockStatus$codec)]])

export type BlockEventFilter = z.infer<typeof BlockEventFilter$schema>
export const BlockEventFilter = (input: z.input<typeof BlockEventFilter$schema>): BlockEventFilter => BlockEventFilter$schema.parse(input)
export const BlockEventFilter$schema = z.object({ height: lib.Option$schema(lib.NonZero$schema(lib.U64$schema)), status: lib.Option$schema(z.lazy(() => BlockStatus$schema)) })
export const BlockEventFilter$codec = lib.structCodec<BlockEventFilter>([['height', lib.Option$codec(lib.NonZero$codec(lib.U64$codec))], ['status', lib.Option$codec(lib.lazyCodec(() => BlockStatus$codec))]])

export type BlockHashPredicateBox = z.infer<typeof BlockHashPredicateBox$schema>
export const BlockHashPredicateBox = (input: z.input<typeof BlockHashPredicateBox$schema>): BlockHashPredicateBox => BlockHashPredicateBox$schema.parse(input)
export const BlockHashPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.Hash$schema })])
export const BlockHashPredicateBox$codec: lib.Codec<BlockHashPredicateBox> = lib.enumCodec<{ Equals: [lib.Hash] }>([[0, 'Equals', lib.Hash$codec]]).discriminated()

export type BlockHeader = z.infer<typeof BlockHeader$schema>
export const BlockHeader = (input: z.input<typeof BlockHeader$schema>): BlockHeader => BlockHeader$schema.parse(input)
export const BlockHeader$schema = z.object({ height: lib.NonZero$schema(lib.U64$schema), prevBlockHash: lib.Option$schema(lib.Hash$schema), transactionsHash: lib.Hash$schema, creationTime: lib.Timestamp$schema, viewChangeIndex: lib.U32$schema })
export const BlockHeader$codec = lib.structCodec<BlockHeader>([['height', lib.NonZero$codec(lib.U64$codec)], ['prevBlockHash', lib.Option$codec(lib.Hash$codec)], ['transactionsHash', lib.Hash$codec], ['creationTime', lib.Timestamp$codec], ['viewChangeIndex', lib.U32$codec]])

export type BlockHeaderPredicateBox = z.infer<typeof BlockHeaderPredicateBox$schema>
export const BlockHeaderPredicateBox = (input: z.input<typeof BlockHeaderPredicateBox$schema>): BlockHeaderPredicateBox => BlockHeaderPredicateBox$schema.parse(input)
export const BlockHeaderPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Hash'), value: z.lazy(() => BlockHashPredicateBox$schema) })])
export const BlockHeaderPredicateBox$codec: lib.Codec<BlockHeaderPredicateBox> = lib.enumCodec<{ Hash: [BlockHashPredicateBox] }>([[0, 'Hash', lib.lazyCodec(() => BlockHashPredicateBox$codec)]]).discriminated()

export type BlockParameter = z.infer<typeof BlockParameter$schema>
export const BlockParameter = (input: z.input<typeof BlockParameter$schema>): BlockParameter => BlockParameter$schema.parse(input)
export const BlockParameter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('MaxTransactions'), value: lib.NonZero$schema(lib.U64$schema) })])
export const BlockParameter$codec: lib.Codec<BlockParameter> = lib.enumCodec<{ MaxTransactions: [lib.NonZero<lib.U64>] }>([[0, 'MaxTransactions', lib.NonZero$codec(lib.U64$codec)]]).discriminated()

export type BlockParameters = z.infer<typeof BlockParameters$schema>
export const BlockParameters = (input: z.input<typeof BlockParameters$schema>): BlockParameters => BlockParameters$schema.parse(input)
export const BlockParameters$schema = z.object({ maxTransactions: lib.NonZero$schema(lib.U64$schema) })
export const BlockParameters$codec = lib.structCodec<BlockParameters>([['maxTransactions', lib.NonZero$codec(lib.U64$codec)]])

export type BlockPayload = z.infer<typeof BlockPayload$schema>
export const BlockPayload = (input: z.input<typeof BlockPayload$schema>): BlockPayload => BlockPayload$schema.parse(input)
export const BlockPayload$schema = z.object({ header: z.lazy(() => BlockHeader$schema), transactions: lib.Vec$schema(z.lazy(() => SignedTransaction$schema)) })
export const BlockPayload$codec = lib.structCodec<BlockPayload>([['header', lib.lazyCodec(() => BlockHeader$codec)], ['transactions', lib.Vec$codec(lib.lazyCodec(() => SignedTransaction$codec))]])

export type BlockRejectionReason = z.infer<typeof BlockRejectionReason$schema>
export const BlockRejectionReason = (input: z.input<typeof BlockRejectionReason$schema>): BlockRejectionReason => BlockRejectionReason$schema.parse(input)
export const BlockRejectionReason$schema = z.literal('ConsensusBlockRejection')
export const BlockRejectionReason$codec: lib.Codec<BlockRejectionReason> = lib.enumCodec<{ ConsensusBlockRejection: [] }>([[0, 'ConsensusBlockRejection']]).literalUnion()

export type BlockSignature = z.infer<typeof BlockSignature$schema>
export const BlockSignature = (input: z.input<typeof BlockSignature$schema>): BlockSignature => BlockSignature$schema.parse(input)
export const BlockSignature$schema = z.object({ peerTopologyIndex: lib.U64$schema, signature: lib.Signature$schema })
export const BlockSignature$codec = lib.structCodec<BlockSignature>([['peerTopologyIndex', lib.U64$codec], ['signature', lib.Signature$codec]])

export type BlockStatus = z.infer<typeof BlockStatus$schema>
export const BlockStatus = (input: z.input<typeof BlockStatus$schema>): BlockStatus => BlockStatus$schema.parse(input)
export const BlockStatus$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created') }), z.object({ t: z.literal('Approved') }), z.object({ t: z.literal('Rejected'), value: z.lazy(() => BlockRejectionReason$schema) }), z.object({ t: z.literal('Committed') }), z.object({ t: z.literal('Applied') })])
export const BlockStatus$codec: lib.Codec<BlockStatus> = lib.enumCodec<{ Created: [], Approved: [], Rejected: [BlockRejectionReason], Committed: [], Applied: [] }>([[0, 'Created'], [1, 'Approved'], [2, 'Rejected', lib.lazyCodec(() => BlockRejectionReason$codec)], [3, 'Committed'], [4, 'Applied']]).discriminated()

export type BlockSubscriptionRequest = z.infer<typeof BlockSubscriptionRequest$schema>
export const BlockSubscriptionRequest = (input: z.input<typeof BlockSubscriptionRequest$schema>): BlockSubscriptionRequest => BlockSubscriptionRequest$schema.parse(input)
export const BlockSubscriptionRequest$schema = z.object({ fromBlockHeight: lib.NonZero$schema(lib.U64$schema) })
export const BlockSubscriptionRequest$codec = lib.structCodec<BlockSubscriptionRequest>([['fromBlockHeight', lib.NonZero$codec(lib.U64$codec)]])

export interface Burn<T0, T1> { object: T0, destination: T1 }
export const Burn$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) => z.object({ object: t0, destination: t1 })
export const Burn$codec = <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>) => lib.structCodec([['object', t0], ['destination', t1]])

export type BurnBox = z.infer<typeof BurnBox$schema>
export const BurnBox = (input: z.input<typeof BurnBox$schema>): BurnBox => BurnBox$schema.parse(input)
export const BurnBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Asset'), value: z.lazy(() => Burn$schema(z.lazy(() => Numeric$schema), lib.AssetId$schema)) }), z.object({ t: z.literal('TriggerRepetitions'), value: z.lazy(() => Burn$schema(lib.U32$schema, z.lazy(() => TriggerId$schema))) })])
export const BurnBox$codec: lib.Codec<BurnBox> = lib.enumCodec<{ Asset: [Burn<Numeric, lib.AssetId>], TriggerRepetitions: [Burn<lib.U32, TriggerId>] }>([[0, 'Asset', lib.lazyCodec(() => Burn$codec(lib.lazyCodec(() => Numeric$codec), lib.AssetId$codec))], [1, 'TriggerRepetitions', lib.lazyCodec(() => Burn$codec(lib.U32$codec, lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type CanBurnAsset = z.infer<typeof CanBurnAsset$schema>
export const CanBurnAsset = (input: z.input<typeof CanBurnAsset$schema>): CanBurnAsset => CanBurnAsset$schema.parse(input)
export const CanBurnAsset$schema = z.object({ asset: lib.AssetId$schema })
export const CanBurnAsset$codec = lib.structCodec<CanBurnAsset>([['asset', lib.AssetId$codec]])

export type CanExecuteTrigger = z.infer<typeof CanExecuteTrigger$schema>
export const CanExecuteTrigger = (input: z.input<typeof CanExecuteTrigger$schema>): CanExecuteTrigger => CanExecuteTrigger$schema.parse(input)
export const CanExecuteTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanExecuteTrigger$codec = lib.structCodec<CanExecuteTrigger>([['trigger', lib.lazyCodec(() => TriggerId$codec)]])

export type CanMintAsset = z.infer<typeof CanMintAsset$schema>
export const CanMintAsset = (input: z.input<typeof CanMintAsset$schema>): CanMintAsset => CanMintAsset$schema.parse(input)
export const CanMintAsset$schema = z.object({ asset: lib.AssetId$schema })
export const CanMintAsset$codec = lib.structCodec<CanMintAsset>([['asset', lib.AssetId$codec]])

export type CanModifyAccountMetadata = z.infer<typeof CanModifyAccountMetadata$schema>
export const CanModifyAccountMetadata = (input: z.input<typeof CanModifyAccountMetadata$schema>): CanModifyAccountMetadata => CanModifyAccountMetadata$schema.parse(input)
export const CanModifyAccountMetadata$schema = z.object({ account: lib.AccountId$schema })
export const CanModifyAccountMetadata$codec = lib.structCodec<CanModifyAccountMetadata>([['account', lib.AccountId$codec]])

export type CanModifyAssetDefinitionMetadata = z.infer<typeof CanModifyAssetDefinitionMetadata$schema>
export const CanModifyAssetDefinitionMetadata = (input: z.input<typeof CanModifyAssetDefinitionMetadata$schema>): CanModifyAssetDefinitionMetadata => CanModifyAssetDefinitionMetadata$schema.parse(input)
export const CanModifyAssetDefinitionMetadata$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const CanModifyAssetDefinitionMetadata$codec = lib.structCodec<CanModifyAssetDefinitionMetadata>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type CanModifyAssetMetadata = z.infer<typeof CanModifyAssetMetadata$schema>
export const CanModifyAssetMetadata = (input: z.input<typeof CanModifyAssetMetadata$schema>): CanModifyAssetMetadata => CanModifyAssetMetadata$schema.parse(input)
export const CanModifyAssetMetadata$schema = z.object({ asset: lib.AssetId$schema })
export const CanModifyAssetMetadata$codec = lib.structCodec<CanModifyAssetMetadata>([['asset', lib.AssetId$codec]])

export type CanModifyDomainMetadata = z.infer<typeof CanModifyDomainMetadata$schema>
export const CanModifyDomainMetadata = (input: z.input<typeof CanModifyDomainMetadata$schema>): CanModifyDomainMetadata => CanModifyDomainMetadata$schema.parse(input)
export const CanModifyDomainMetadata$schema = z.object({ domain: lib.DomainId$schema })
export const CanModifyDomainMetadata$codec = lib.structCodec<CanModifyDomainMetadata>([['domain', lib.DomainId$codec]])

export type CanModifyTrigger = z.infer<typeof CanModifyTrigger$schema>
export const CanModifyTrigger = (input: z.input<typeof CanModifyTrigger$schema>): CanModifyTrigger => CanModifyTrigger$schema.parse(input)
export const CanModifyTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanModifyTrigger$codec = lib.structCodec<CanModifyTrigger>([['trigger', lib.lazyCodec(() => TriggerId$codec)]])

export type CanModifyTriggerMetadata = z.infer<typeof CanModifyTriggerMetadata$schema>
export const CanModifyTriggerMetadata = (input: z.input<typeof CanModifyTriggerMetadata$schema>): CanModifyTriggerMetadata => CanModifyTriggerMetadata$schema.parse(input)
export const CanModifyTriggerMetadata$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanModifyTriggerMetadata$codec = lib.structCodec<CanModifyTriggerMetadata>([['trigger', lib.lazyCodec(() => TriggerId$codec)]])

export type CanRegisterAccount = z.infer<typeof CanRegisterAccount$schema>
export const CanRegisterAccount = (input: z.input<typeof CanRegisterAccount$schema>): CanRegisterAccount => CanRegisterAccount$schema.parse(input)
export const CanRegisterAccount$schema = z.object({ domain: lib.DomainId$schema })
export const CanRegisterAccount$codec = lib.structCodec<CanRegisterAccount>([['domain', lib.DomainId$codec]])

export type CanRegisterAsset = z.infer<typeof CanRegisterAsset$schema>
export const CanRegisterAsset = (input: z.input<typeof CanRegisterAsset$schema>): CanRegisterAsset => CanRegisterAsset$schema.parse(input)
export const CanRegisterAsset$schema = z.object({ owner: lib.AccountId$schema })
export const CanRegisterAsset$codec = lib.structCodec<CanRegisterAsset>([['owner', lib.AccountId$codec]])

export type CanRegisterAssetDefinition = z.infer<typeof CanRegisterAssetDefinition$schema>
export const CanRegisterAssetDefinition = (input: z.input<typeof CanRegisterAssetDefinition$schema>): CanRegisterAssetDefinition => CanRegisterAssetDefinition$schema.parse(input)
export const CanRegisterAssetDefinition$schema = z.object({ domain: lib.DomainId$schema })
export const CanRegisterAssetDefinition$codec = lib.structCodec<CanRegisterAssetDefinition>([['domain', lib.DomainId$codec]])

export type CanRegisterAssetWithDefinition = z.infer<typeof CanRegisterAssetWithDefinition$schema>
export const CanRegisterAssetWithDefinition = (input: z.input<typeof CanRegisterAssetWithDefinition$schema>): CanRegisterAssetWithDefinition => CanRegisterAssetWithDefinition$schema.parse(input)
export const CanRegisterAssetWithDefinition$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const CanRegisterAssetWithDefinition$codec = lib.structCodec<CanRegisterAssetWithDefinition>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type CanRegisterTrigger = z.infer<typeof CanRegisterTrigger$schema>
export const CanRegisterTrigger = (input: z.input<typeof CanRegisterTrigger$schema>): CanRegisterTrigger => CanRegisterTrigger$schema.parse(input)
export const CanRegisterTrigger$schema = z.object({ authority: lib.AccountId$schema })
export const CanRegisterTrigger$codec = lib.structCodec<CanRegisterTrigger>([['authority', lib.AccountId$codec]])

export type CanTransferAsset = z.infer<typeof CanTransferAsset$schema>
export const CanTransferAsset = (input: z.input<typeof CanTransferAsset$schema>): CanTransferAsset => CanTransferAsset$schema.parse(input)
export const CanTransferAsset$schema = z.object({ asset: lib.AssetId$schema })
export const CanTransferAsset$codec = lib.structCodec<CanTransferAsset>([['asset', lib.AssetId$codec]])

export type CanTransferAssetWithDefinition = z.infer<typeof CanTransferAssetWithDefinition$schema>
export const CanTransferAssetWithDefinition = (input: z.input<typeof CanTransferAssetWithDefinition$schema>): CanTransferAssetWithDefinition => CanTransferAssetWithDefinition$schema.parse(input)
export const CanTransferAssetWithDefinition$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const CanTransferAssetWithDefinition$codec = lib.structCodec<CanTransferAssetWithDefinition>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type CanUnregisterAccount = z.infer<typeof CanUnregisterAccount$schema>
export const CanUnregisterAccount = (input: z.input<typeof CanUnregisterAccount$schema>): CanUnregisterAccount => CanUnregisterAccount$schema.parse(input)
export const CanUnregisterAccount$schema = z.object({ account: lib.AccountId$schema })
export const CanUnregisterAccount$codec = lib.structCodec<CanUnregisterAccount>([['account', lib.AccountId$codec]])

export type CanUnregisterAsset = z.infer<typeof CanUnregisterAsset$schema>
export const CanUnregisterAsset = (input: z.input<typeof CanUnregisterAsset$schema>): CanUnregisterAsset => CanUnregisterAsset$schema.parse(input)
export const CanUnregisterAsset$schema = z.object({ asset: lib.AssetId$schema })
export const CanUnregisterAsset$codec = lib.structCodec<CanUnregisterAsset>([['asset', lib.AssetId$codec]])

export type CanUnregisterAssetDefinition = z.infer<typeof CanUnregisterAssetDefinition$schema>
export const CanUnregisterAssetDefinition = (input: z.input<typeof CanUnregisterAssetDefinition$schema>): CanUnregisterAssetDefinition => CanUnregisterAssetDefinition$schema.parse(input)
export const CanUnregisterAssetDefinition$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const CanUnregisterAssetDefinition$codec = lib.structCodec<CanUnregisterAssetDefinition>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type CanUnregisterAssetWithDefinition = z.infer<typeof CanUnregisterAssetWithDefinition$schema>
export const CanUnregisterAssetWithDefinition = (input: z.input<typeof CanUnregisterAssetWithDefinition$schema>): CanUnregisterAssetWithDefinition => CanUnregisterAssetWithDefinition$schema.parse(input)
export const CanUnregisterAssetWithDefinition$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const CanUnregisterAssetWithDefinition$codec = lib.structCodec<CanUnregisterAssetWithDefinition>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type CanUnregisterDomain = z.infer<typeof CanUnregisterDomain$schema>
export const CanUnregisterDomain = (input: z.input<typeof CanUnregisterDomain$schema>): CanUnregisterDomain => CanUnregisterDomain$schema.parse(input)
export const CanUnregisterDomain$schema = z.object({ domain: lib.DomainId$schema })
export const CanUnregisterDomain$codec = lib.structCodec<CanUnregisterDomain>([['domain', lib.DomainId$codec]])

export type CanUnregisterTrigger = z.infer<typeof CanUnregisterTrigger$schema>
export const CanUnregisterTrigger = (input: z.input<typeof CanUnregisterTrigger$schema>): CanUnregisterTrigger => CanUnregisterTrigger$schema.parse(input)
export const CanUnregisterTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema) })
export const CanUnregisterTrigger$codec = lib.structCodec<CanUnregisterTrigger>([['trigger', lib.lazyCodec(() => TriggerId$codec)]])

export type ChainId = z.infer<typeof ChainId$schema>
export const ChainId = (input: z.input<typeof ChainId$schema>): ChainId => ChainId$schema.parse(input)
export const ChainId$schema = z.string().brand<'ChainId'>()
export const ChainId$codec = lib.String$codec as lib.Codec<ChainId>

export type CommittedTransaction = z.infer<typeof CommittedTransaction$schema>
export const CommittedTransaction = (input: z.input<typeof CommittedTransaction$schema>): CommittedTransaction => CommittedTransaction$schema.parse(input)
export const CommittedTransaction$schema = z.object({ blockHash: lib.Hash$schema, value: z.lazy(() => SignedTransaction$schema), error: lib.Option$schema(z.lazy(() => TransactionRejectionReason$schema)) })
export const CommittedTransaction$codec = lib.structCodec<CommittedTransaction>([['blockHash', lib.Hash$codec], ['value', lib.lazyCodec(() => SignedTransaction$codec)], ['error', lib.Option$codec(lib.lazyCodec(() => TransactionRejectionReason$codec))]])

export type CommittedTransactionPredicateBox = z.infer<typeof CommittedTransactionPredicateBox$schema>
export const CommittedTransactionPredicateBox = (input: z.input<typeof CommittedTransactionPredicateBox$schema>): CommittedTransactionPredicateBox => CommittedTransactionPredicateBox$schema.parse(input)
export const CommittedTransactionPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('BlockHash'), value: z.lazy(() => BlockHashPredicateBox$schema) }), z.object({ t: z.literal('Value'), value: z.lazy(() => SignedTransactionPredicateBox$schema) }), z.object({ t: z.literal('Error'), value: z.lazy(() => TransactionErrorPredicateBox$schema) })])
export const CommittedTransactionPredicateBox$codec: lib.Codec<CommittedTransactionPredicateBox> = lib.enumCodec<{ BlockHash: [BlockHashPredicateBox], Value: [SignedTransactionPredicateBox], Error: [TransactionErrorPredicateBox] }>([[0, 'BlockHash', lib.lazyCodec(() => BlockHashPredicateBox$codec)], [1, 'Value', lib.lazyCodec(() => SignedTransactionPredicateBox$codec)], [2, 'Error', lib.lazyCodec(() => TransactionErrorPredicateBox$codec)]]).discriminated()

export type ConfigurationEvent = z.infer<typeof ConfigurationEvent$schema>
export const ConfigurationEvent = (input: z.input<typeof ConfigurationEvent$schema>): ConfigurationEvent => ConfigurationEvent$schema.parse(input)
export const ConfigurationEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Changed'), value: z.lazy(() => ParameterChanged$schema) })])
export const ConfigurationEvent$codec: lib.Codec<ConfigurationEvent> = lib.enumCodec<{ Changed: [ParameterChanged] }>([[0, 'Changed', lib.lazyCodec(() => ParameterChanged$codec)]]).discriminated()

export type ConfigurationEventFilter = z.infer<typeof ConfigurationEventFilter$schema>
export const ConfigurationEventFilter = (input: z.input<typeof ConfigurationEventFilter$schema>): ConfigurationEventFilter => ConfigurationEventFilter$schema.parse(input)
export const ConfigurationEventFilter$schema = z.object({ eventSet: z.lazy(() => ConfigurationEventSet$schema) })
export const ConfigurationEventFilter$codec = lib.structCodec<ConfigurationEventFilter>([['eventSet', lib.lazyCodec(() => ConfigurationEventSet$codec)]])

export type ConfigurationEventSet = z.infer<typeof ConfigurationEventSet$schema>
export const ConfigurationEventSet = (input: z.input<typeof ConfigurationEventSet$schema>): ConfigurationEventSet => ConfigurationEventSet$schema.parse(input)
const ConfigurationEventSet$literalSchema = z.literal('Changed')
export const ConfigurationEventSet$schema = z.set(ConfigurationEventSet$literalSchema).or(z.array(ConfigurationEventSet$literalSchema).transform(arr => new Set(arr)))
export const ConfigurationEventSet$codec = lib.bitmap<ConfigurationEventSet extends Set<infer T> ? T : never>({ Changed: 1 })

export type CustomInstruction = z.infer<typeof CustomInstruction$schema>
export const CustomInstruction = (input: z.input<typeof CustomInstruction$schema>): CustomInstruction => CustomInstruction$schema.parse(input)
export const CustomInstruction$schema = z.object({ payload: lib.Json$schema })
export const CustomInstruction$codec = lib.structCodec<CustomInstruction>([['payload', lib.Json$codec]])

export type CustomParameter = z.infer<typeof CustomParameter$schema>
export const CustomParameter = (input: z.input<typeof CustomParameter$schema>): CustomParameter => CustomParameter$schema.parse(input)
export const CustomParameter$schema = z.object({ id: z.lazy(() => CustomParameterId$schema), payload: lib.Json$schema })
export const CustomParameter$codec = lib.structCodec<CustomParameter>([['id', lib.lazyCodec(() => CustomParameterId$codec)], ['payload', lib.Json$codec]])

export type CustomParameterId = lib.Name
export const CustomParameterId = (input: z.input<typeof CustomParameterId$schema>): CustomParameterId => CustomParameterId$schema.parse(input)
export const CustomParameterId$schema = lib.Name$schema
export const CustomParameterId$codec = lib.Name$codec

export type DataEvent = z.infer<typeof DataEvent$schema>
export const DataEvent = (input: z.input<typeof DataEvent$schema>): DataEvent => DataEvent$schema.parse(input)
export const DataEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerEvent$schema) }), z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainEvent$schema) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerEvent$schema) }), z.object({ t: z.literal('Role'), value: z.lazy(() => RoleEvent$schema) }), z.object({ t: z.literal('Configuration'), value: z.lazy(() => ConfigurationEvent$schema) }), z.object({ t: z.literal('Executor'), value: z.lazy(() => ExecutorEvent$schema) })])
export const DataEvent$codec: lib.Codec<DataEvent> = lib.enumCodec<{ Peer: [PeerEvent], Domain: [DomainEvent], Trigger: [TriggerEvent], Role: [RoleEvent], Configuration: [ConfigurationEvent], Executor: [ExecutorEvent] }>([[0, 'Peer', lib.lazyCodec(() => PeerEvent$codec)], [1, 'Domain', lib.lazyCodec(() => DomainEvent$codec)], [2, 'Trigger', lib.lazyCodec(() => TriggerEvent$codec)], [3, 'Role', lib.lazyCodec(() => RoleEvent$codec)], [4, 'Configuration', lib.lazyCodec(() => ConfigurationEvent$codec)], [5, 'Executor', lib.lazyCodec(() => ExecutorEvent$codec)]]).discriminated()

export type DataEventFilter = z.infer<typeof DataEventFilter$schema>
export const DataEventFilter = (input: z.input<typeof DataEventFilter$schema>): DataEventFilter => DataEventFilter$schema.parse(input)
export const DataEventFilter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Any') }), z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerEventFilter$schema) }), z.object({ t: z.literal('Domain'), value: z.lazy(() => DomainEventFilter$schema) }), z.object({ t: z.literal('Account'), value: z.lazy(() => AccountEventFilter$schema) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetEventFilter$schema) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionEventFilter$schema) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerEventFilter$schema) }), z.object({ t: z.literal('Role'), value: z.lazy(() => RoleEventFilter$schema) }), z.object({ t: z.literal('Configuration'), value: z.lazy(() => ConfigurationEventFilter$schema) }), z.object({ t: z.literal('Executor'), value: z.lazy(() => ExecutorEventFilter$schema) })])
export const DataEventFilter$codec: lib.Codec<DataEventFilter> = lib.enumCodec<{ Any: [], Peer: [PeerEventFilter], Domain: [DomainEventFilter], Account: [AccountEventFilter], Asset: [AssetEventFilter], AssetDefinition: [AssetDefinitionEventFilter], Trigger: [TriggerEventFilter], Role: [RoleEventFilter], Configuration: [ConfigurationEventFilter], Executor: [ExecutorEventFilter] }>([[0, 'Any'], [1, 'Peer', lib.lazyCodec(() => PeerEventFilter$codec)], [2, 'Domain', lib.lazyCodec(() => DomainEventFilter$codec)], [3, 'Account', lib.lazyCodec(() => AccountEventFilter$codec)], [4, 'Asset', lib.lazyCodec(() => AssetEventFilter$codec)], [5, 'AssetDefinition', lib.lazyCodec(() => AssetDefinitionEventFilter$codec)], [6, 'Trigger', lib.lazyCodec(() => TriggerEventFilter$codec)], [7, 'Role', lib.lazyCodec(() => RoleEventFilter$codec)], [8, 'Configuration', lib.lazyCodec(() => ConfigurationEventFilter$codec)], [9, 'Executor', lib.lazyCodec(() => ExecutorEventFilter$codec)]]).discriminated()

export type Domain = z.infer<typeof Domain$schema>
export const Domain = (input: z.input<typeof Domain$schema>): Domain => Domain$schema.parse(input)
export const Domain$schema = z.object({ id: lib.DomainId$schema, logo: lib.Option$schema(z.lazy(() => IpfsPath$schema)), metadata: z.lazy(() => Metadata$schema), ownedBy: lib.AccountId$schema })
export const Domain$codec = lib.structCodec<Domain>([['id', lib.DomainId$codec], ['logo', lib.Option$codec(lib.lazyCodec(() => IpfsPath$codec))], ['metadata', lib.lazyCodec(() => Metadata$codec)], ['ownedBy', lib.AccountId$codec]])

export type DomainEvent = z.infer<typeof DomainEvent$schema>
export const DomainEvent = (input: z.input<typeof DomainEvent$schema>): DomainEvent => DomainEvent$schema.parse(input)
export const DomainEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => Domain$schema) }), z.object({ t: z.literal('Deleted'), value: lib.DomainId$schema }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => AssetDefinitionEvent$schema) }), z.object({ t: z.literal('Account'), value: z.lazy(() => AccountEvent$schema) }), z.object({ t: z.literal('MetadataInserted'), value: z.lazy(() => MetadataChanged$schema(lib.DomainId$schema)) }), z.object({ t: z.literal('MetadataRemoved'), value: z.lazy(() => MetadataChanged$schema(lib.DomainId$schema)) }), z.object({ t: z.literal('OwnerChanged'), value: z.lazy(() => DomainOwnerChanged$schema) })])
export const DomainEvent$codec: lib.Codec<DomainEvent> = lib.enumCodec<{ Created: [Domain], Deleted: [lib.DomainId], AssetDefinition: [AssetDefinitionEvent], Account: [AccountEvent], MetadataInserted: [MetadataChanged<lib.DomainId>], MetadataRemoved: [MetadataChanged<lib.DomainId>], OwnerChanged: [DomainOwnerChanged] }>([[0, 'Created', lib.lazyCodec(() => Domain$codec)], [1, 'Deleted', lib.DomainId$codec], [2, 'AssetDefinition', lib.lazyCodec(() => AssetDefinitionEvent$codec)], [3, 'Account', lib.lazyCodec(() => AccountEvent$codec)], [4, 'MetadataInserted', lib.lazyCodec(() => MetadataChanged$codec(lib.DomainId$codec))], [5, 'MetadataRemoved', lib.lazyCodec(() => MetadataChanged$codec(lib.DomainId$codec))], [6, 'OwnerChanged', lib.lazyCodec(() => DomainOwnerChanged$codec)]]).discriminated()

export type DomainEventFilter = z.infer<typeof DomainEventFilter$schema>
export const DomainEventFilter = (input: z.input<typeof DomainEventFilter$schema>): DomainEventFilter => DomainEventFilter$schema.parse(input)
export const DomainEventFilter$schema = z.object({ idMatcher: lib.Option$schema(lib.DomainId$schema), eventSet: z.lazy(() => DomainEventSet$schema) })
export const DomainEventFilter$codec = lib.structCodec<DomainEventFilter>([['idMatcher', lib.Option$codec(lib.DomainId$codec)], ['eventSet', lib.lazyCodec(() => DomainEventSet$codec)]])

export type DomainEventSet = z.infer<typeof DomainEventSet$schema>
export const DomainEventSet = (input: z.input<typeof DomainEventSet$schema>): DomainEventSet => DomainEventSet$schema.parse(input)
const DomainEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('AnyAssetDefinition'), z.literal('AnyAccount'), z.literal('MetadataInserted'), z.literal('MetadataRemoved'), z.literal('OwnerChanged')])
export const DomainEventSet$schema = z.set(DomainEventSet$literalSchema).or(z.array(DomainEventSet$literalSchema).transform(arr => new Set(arr)))
export const DomainEventSet$codec = lib.bitmap<DomainEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, AnyAssetDefinition: 4, AnyAccount: 8, MetadataInserted: 16, MetadataRemoved: 32, OwnerChanged: 64 })

export type DomainIdPredicateBox = z.infer<typeof DomainIdPredicateBox$schema>
export const DomainIdPredicateBox = (input: z.input<typeof DomainIdPredicateBox$schema>): DomainIdPredicateBox => DomainIdPredicateBox$schema.parse(input)
export const DomainIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.DomainId$schema }), z.object({ t: z.literal('Name'), value: z.lazy(() => StringPredicateBox$schema) })])
export const DomainIdPredicateBox$codec: lib.Codec<DomainIdPredicateBox> = lib.enumCodec<{ Equals: [lib.DomainId], Name: [StringPredicateBox] }>([[0, 'Equals', lib.DomainId$codec], [1, 'Name', lib.lazyCodec(() => StringPredicateBox$codec)]]).discriminated()

export type DomainOwnerChanged = z.infer<typeof DomainOwnerChanged$schema>
export const DomainOwnerChanged = (input: z.input<typeof DomainOwnerChanged$schema>): DomainOwnerChanged => DomainOwnerChanged$schema.parse(input)
export const DomainOwnerChanged$schema = z.object({ domain: lib.DomainId$schema, newOwner: lib.AccountId$schema })
export const DomainOwnerChanged$codec = lib.structCodec<DomainOwnerChanged>([['domain', lib.DomainId$codec], ['newOwner', lib.AccountId$codec]])

export type DomainPredicateBox = z.infer<typeof DomainPredicateBox$schema>
export const DomainPredicateBox = (input: z.input<typeof DomainPredicateBox$schema>): DomainPredicateBox => DomainPredicateBox$schema.parse(input)
export const DomainPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => DomainIdPredicateBox$schema) }), z.object({ t: z.literal('Metadata'), value: z.lazy(() => MetadataPredicateBox$schema) })])
export const DomainPredicateBox$codec: lib.Codec<DomainPredicateBox> = lib.enumCodec<{ Id: [DomainIdPredicateBox], Metadata: [MetadataPredicateBox] }>([[0, 'Id', lib.lazyCodec(() => DomainIdPredicateBox$codec)], [1, 'Metadata', lib.lazyCodec(() => MetadataPredicateBox$codec)]]).discriminated()

export type EventBox = { t: 'Pipeline', value: PipelineEventBox } | { t: 'Data', value: DataEvent } | { t: 'Time', value: TimeEvent } | { t: 'ExecuteTrigger', value: ExecuteTriggerEvent } | { t: 'TriggerCompleted', value: TriggerCompletedEvent }
export const EventBox = (input: z.input<typeof EventBox$schema>): EventBox => EventBox$schema.parse(input)
type EventBox$input = { t: 'Pipeline', value: z.input<z.ZodLazy<typeof PipelineEventBox$schema>> } | { t: 'Data', value: z.input<z.ZodLazy<typeof DataEvent$schema>> } | { t: 'Time', value: z.input<z.ZodLazy<typeof TimeEvent$schema>> } | { t: 'ExecuteTrigger', value: z.input<z.ZodLazy<typeof ExecuteTriggerEvent$schema>> } | { t: 'TriggerCompleted', value: z.input<z.ZodLazy<typeof TriggerCompletedEvent$schema>> }
export const EventBox$schema: z.ZodType<EventBox, z.ZodTypeDef, EventBox$input> = z.discriminatedUnion('t', [z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventBox$schema) }), z.object({ t: z.literal('Data'), value: z.lazy(() => DataEvent$schema) }), z.object({ t: z.literal('Time'), value: z.lazy(() => TimeEvent$schema) }), z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEvent$schema) }), z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEvent$schema) })])
export const EventBox$codec: lib.Codec<EventBox> = lib.enumCodec<{ Pipeline: [PipelineEventBox], Data: [DataEvent], Time: [TimeEvent], ExecuteTrigger: [ExecuteTriggerEvent], TriggerCompleted: [TriggerCompletedEvent] }>([[0, 'Pipeline', lib.lazyCodec(() => PipelineEventBox$codec)], [1, 'Data', lib.lazyCodec(() => DataEvent$codec)], [2, 'Time', lib.lazyCodec(() => TimeEvent$codec)], [3, 'ExecuteTrigger', lib.lazyCodec(() => ExecuteTriggerEvent$codec)], [4, 'TriggerCompleted', lib.lazyCodec(() => TriggerCompletedEvent$codec)]]).discriminated()

export type EventFilterBox = z.infer<typeof EventFilterBox$schema>
export const EventFilterBox = (input: z.input<typeof EventFilterBox$schema>): EventFilterBox => EventFilterBox$schema.parse(input)
export const EventFilterBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Pipeline'), value: z.lazy(() => PipelineEventFilterBox$schema) }), z.object({ t: z.literal('Data'), value: z.lazy(() => DataEventFilter$schema) }), z.object({ t: z.literal('Time'), value: z.lazy(() => ExecutionTime$schema) }), z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTriggerEventFilter$schema) }), z.object({ t: z.literal('TriggerCompleted'), value: z.lazy(() => TriggerCompletedEventFilter$schema) })])
export const EventFilterBox$codec: lib.Codec<EventFilterBox> = lib.enumCodec<{ Pipeline: [PipelineEventFilterBox], Data: [DataEventFilter], Time: [ExecutionTime], ExecuteTrigger: [ExecuteTriggerEventFilter], TriggerCompleted: [TriggerCompletedEventFilter] }>([[0, 'Pipeline', lib.lazyCodec(() => PipelineEventFilterBox$codec)], [1, 'Data', lib.lazyCodec(() => DataEventFilter$codec)], [2, 'Time', lib.lazyCodec(() => ExecutionTime$codec)], [3, 'ExecuteTrigger', lib.lazyCodec(() => ExecuteTriggerEventFilter$codec)], [4, 'TriggerCompleted', lib.lazyCodec(() => TriggerCompletedEventFilter$codec)]]).discriminated()

export type EventSubscriptionRequest = z.infer<typeof EventSubscriptionRequest$schema>
export const EventSubscriptionRequest = (input: z.input<typeof EventSubscriptionRequest$schema>): EventSubscriptionRequest => EventSubscriptionRequest$schema.parse(input)
export const EventSubscriptionRequest$schema = z.object({ filters: lib.Vec$schema(z.lazy(() => EventFilterBox$schema)) })
export const EventSubscriptionRequest$codec = lib.structCodec<EventSubscriptionRequest>([['filters', lib.Vec$codec(lib.lazyCodec(() => EventFilterBox$codec))]])

export type Executable = z.infer<typeof Executable$schema>
export const Executable = (input: z.input<typeof Executable$schema>): Executable => Executable$schema.parse(input)
export const Executable$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Instructions'), value: lib.Vec$schema(z.lazy(() => InstructionBox$schema)) }), z.object({ t: z.literal('Wasm'), value: z.lazy(() => WasmSmartContract$schema) })])
export const Executable$codec: lib.Codec<Executable> = lib.enumCodec<{ Instructions: [lib.Vec<InstructionBox>], Wasm: [WasmSmartContract] }>([[0, 'Instructions', lib.Vec$codec(lib.lazyCodec(() => InstructionBox$codec))], [1, 'Wasm', lib.lazyCodec(() => WasmSmartContract$codec)]]).discriminated()

export type ExecuteTrigger = z.infer<typeof ExecuteTrigger$schema>
export const ExecuteTrigger = (input: z.input<typeof ExecuteTrigger$schema>): ExecuteTrigger => ExecuteTrigger$schema.parse(input)
export const ExecuteTrigger$schema = z.object({ trigger: z.lazy(() => TriggerId$schema), args: lib.Json$schema })
export const ExecuteTrigger$codec = lib.structCodec<ExecuteTrigger>([['trigger', lib.lazyCodec(() => TriggerId$codec)], ['args', lib.Json$codec]])

export type ExecuteTriggerEvent = z.infer<typeof ExecuteTriggerEvent$schema>
export const ExecuteTriggerEvent = (input: z.input<typeof ExecuteTriggerEvent$schema>): ExecuteTriggerEvent => ExecuteTriggerEvent$schema.parse(input)
export const ExecuteTriggerEvent$schema = z.object({ triggerId: z.lazy(() => TriggerId$schema), authority: lib.AccountId$schema, args: lib.Json$schema })
export const ExecuteTriggerEvent$codec = lib.structCodec<ExecuteTriggerEvent>([['triggerId', lib.lazyCodec(() => TriggerId$codec)], ['authority', lib.AccountId$codec], ['args', lib.Json$codec]])

export type ExecuteTriggerEventFilter = z.infer<typeof ExecuteTriggerEventFilter$schema>
export const ExecuteTriggerEventFilter = (input: z.input<typeof ExecuteTriggerEventFilter$schema>): ExecuteTriggerEventFilter => ExecuteTriggerEventFilter$schema.parse(input)
export const ExecuteTriggerEventFilter$schema = z.object({ triggerId: lib.Option$schema(z.lazy(() => TriggerId$schema)), authority: lib.Option$schema(lib.AccountId$schema) })
export const ExecuteTriggerEventFilter$codec = lib.structCodec<ExecuteTriggerEventFilter>([['triggerId', lib.Option$codec(lib.lazyCodec(() => TriggerId$codec))], ['authority', lib.Option$codec(lib.AccountId$codec)]])

export type ExecutionTime = z.infer<typeof ExecutionTime$schema>
export const ExecutionTime = (input: z.input<typeof ExecutionTime$schema>): ExecutionTime => ExecutionTime$schema.parse(input)
export const ExecutionTime$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('PreCommit') }), z.object({ t: z.literal('Schedule'), value: z.lazy(() => Schedule$schema) })])
export const ExecutionTime$codec: lib.Codec<ExecutionTime> = lib.enumCodec<{ PreCommit: [], Schedule: [Schedule] }>([[0, 'PreCommit'], [1, 'Schedule', lib.lazyCodec(() => Schedule$codec)]]).discriminated()

export type Executor = z.infer<typeof Executor$schema>
export const Executor = (input: z.input<typeof Executor$schema>): Executor => Executor$schema.parse(input)
export const Executor$schema = z.object({ wasm: z.lazy(() => WasmSmartContract$schema) })
export const Executor$codec = lib.structCodec<Executor>([['wasm', lib.lazyCodec(() => WasmSmartContract$codec)]])

export type ExecutorDataModel = z.infer<typeof ExecutorDataModel$schema>
export const ExecutorDataModel = (input: z.input<typeof ExecutorDataModel$schema>): ExecutorDataModel => ExecutorDataModel$schema.parse(input)
export const ExecutorDataModel$schema = z.object({ parameters: lib.Map$schema(z.lazy(() => CustomParameterId$schema), z.lazy(() => CustomParameter$schema)), instructions: lib.Vec$schema(z.string()), permissions: lib.Vec$schema(z.string()), schema: lib.Json$schema })
export const ExecutorDataModel$codec = lib.structCodec<ExecutorDataModel>([['parameters', lib.Map$codec(lib.lazyCodec(() => CustomParameterId$codec), lib.lazyCodec(() => CustomParameter$codec))], ['instructions', lib.Vec$codec(lib.String$codec)], ['permissions', lib.Vec$codec(lib.String$codec)], ['schema', lib.Json$codec]])

export type ExecutorEvent = z.infer<typeof ExecutorEvent$schema>
export const ExecutorEvent = (input: z.input<typeof ExecutorEvent$schema>): ExecutorEvent => ExecutorEvent$schema.parse(input)
export const ExecutorEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Upgraded'), value: z.lazy(() => ExecutorUpgrade$schema) })])
export const ExecutorEvent$codec: lib.Codec<ExecutorEvent> = lib.enumCodec<{ Upgraded: [ExecutorUpgrade] }>([[0, 'Upgraded', lib.lazyCodec(() => ExecutorUpgrade$codec)]]).discriminated()

export type ExecutorEventFilter = z.infer<typeof ExecutorEventFilter$schema>
export const ExecutorEventFilter = (input: z.input<typeof ExecutorEventFilter$schema>): ExecutorEventFilter => ExecutorEventFilter$schema.parse(input)
export const ExecutorEventFilter$schema = z.object({ eventSet: z.lazy(() => ExecutorEventSet$schema) })
export const ExecutorEventFilter$codec = lib.structCodec<ExecutorEventFilter>([['eventSet', lib.lazyCodec(() => ExecutorEventSet$codec)]])

export type ExecutorEventSet = z.infer<typeof ExecutorEventSet$schema>
export const ExecutorEventSet = (input: z.input<typeof ExecutorEventSet$schema>): ExecutorEventSet => ExecutorEventSet$schema.parse(input)
const ExecutorEventSet$literalSchema = z.literal('Upgraded')
export const ExecutorEventSet$schema = z.set(ExecutorEventSet$literalSchema).or(z.array(ExecutorEventSet$literalSchema).transform(arr => new Set(arr)))
export const ExecutorEventSet$codec = lib.bitmap<ExecutorEventSet extends Set<infer T> ? T : never>({ Upgraded: 1 })

export type ExecutorUpgrade = z.infer<typeof ExecutorUpgrade$schema>
export const ExecutorUpgrade = (input: z.input<typeof ExecutorUpgrade$schema>): ExecutorUpgrade => ExecutorUpgrade$schema.parse(input)
export const ExecutorUpgrade$schema = z.object({ newDataModel: z.lazy(() => ExecutorDataModel$schema) })
export const ExecutorUpgrade$codec = lib.structCodec<ExecutorUpgrade>([['newDataModel', lib.lazyCodec(() => ExecutorDataModel$codec)]])

export type FetchSize = lib.Option<lib.NonZero<lib.U64>>
export const FetchSize = (input: z.input<typeof FetchSize$schema>): FetchSize => FetchSize$schema.parse(input)
export const FetchSize$schema = lib.Option$schema(lib.NonZero$schema(lib.U64$schema))
export const FetchSize$codec = lib.Option$codec(lib.NonZero$codec(lib.U64$codec))

export type FindAccountMetadata = z.infer<typeof FindAccountMetadata$schema>
export const FindAccountMetadata = (input: z.input<typeof FindAccountMetadata$schema>): FindAccountMetadata => FindAccountMetadata$schema.parse(input)
export const FindAccountMetadata$schema = z.object({ id: lib.AccountId$schema, key: lib.Name$schema })
export const FindAccountMetadata$codec = lib.structCodec<FindAccountMetadata>([['id', lib.AccountId$codec], ['key', lib.Name$codec]])

export type FindAccountsWithAsset = z.infer<typeof FindAccountsWithAsset$schema>
export const FindAccountsWithAsset = (input: z.input<typeof FindAccountsWithAsset$schema>): FindAccountsWithAsset => FindAccountsWithAsset$schema.parse(input)
export const FindAccountsWithAsset$schema = z.object({ assetDefinition: lib.AssetDefinitionId$schema })
export const FindAccountsWithAsset$codec = lib.structCodec<FindAccountsWithAsset>([['assetDefinition', lib.AssetDefinitionId$codec]])

export type FindAssetDefinitionMetadata = z.infer<typeof FindAssetDefinitionMetadata$schema>
export const FindAssetDefinitionMetadata = (input: z.input<typeof FindAssetDefinitionMetadata$schema>): FindAssetDefinitionMetadata => FindAssetDefinitionMetadata$schema.parse(input)
export const FindAssetDefinitionMetadata$schema = z.object({ id: lib.AssetDefinitionId$schema, key: lib.Name$schema })
export const FindAssetDefinitionMetadata$codec = lib.structCodec<FindAssetDefinitionMetadata>([['id', lib.AssetDefinitionId$codec], ['key', lib.Name$codec]])

export type FindAssetMetadata = z.infer<typeof FindAssetMetadata$schema>
export const FindAssetMetadata = (input: z.input<typeof FindAssetMetadata$schema>): FindAssetMetadata => FindAssetMetadata$schema.parse(input)
export const FindAssetMetadata$schema = z.object({ id: lib.AssetId$schema, key: lib.Name$schema })
export const FindAssetMetadata$codec = lib.structCodec<FindAssetMetadata>([['id', lib.AssetId$codec], ['key', lib.Name$codec]])

export type FindAssetQuantityById = z.infer<typeof FindAssetQuantityById$schema>
export const FindAssetQuantityById = (input: z.input<typeof FindAssetQuantityById$schema>): FindAssetQuantityById => FindAssetQuantityById$schema.parse(input)
export const FindAssetQuantityById$schema = z.object({ id: lib.AssetId$schema })
export const FindAssetQuantityById$codec = lib.structCodec<FindAssetQuantityById>([['id', lib.AssetId$codec]])

export type FindDomainMetadata = z.infer<typeof FindDomainMetadata$schema>
export const FindDomainMetadata = (input: z.input<typeof FindDomainMetadata$schema>): FindDomainMetadata => FindDomainMetadata$schema.parse(input)
export const FindDomainMetadata$schema = z.object({ id: lib.DomainId$schema, key: lib.Name$schema })
export const FindDomainMetadata$codec = lib.structCodec<FindDomainMetadata>([['id', lib.DomainId$codec], ['key', lib.Name$codec]])

export type FindError = z.infer<typeof FindError$schema>
export const FindError = (input: z.input<typeof FindError$schema>): FindError => FindError$schema.parse(input)
export const FindError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Asset'), value: lib.AssetId$schema }), z.object({ t: z.literal('AssetDefinition'), value: lib.AssetDefinitionId$schema }), z.object({ t: z.literal('Account'), value: lib.AccountId$schema }), z.object({ t: z.literal('Domain'), value: lib.DomainId$schema }), z.object({ t: z.literal('MetadataKey'), value: lib.Name$schema }), z.object({ t: z.literal('Block'), value: lib.Hash$schema }), z.object({ t: z.literal('Transaction'), value: lib.Hash$schema }), z.object({ t: z.literal('Peer'), value: z.lazy(() => PeerId$schema) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => TriggerId$schema) }), z.object({ t: z.literal('Role'), value: z.lazy(() => RoleId$schema) }), z.object({ t: z.literal('Permission'), value: z.lazy(() => Permission$schema) }), z.object({ t: z.literal('PublicKey'), value: lib.PublicKey$schema })])
export const FindError$codec: lib.Codec<FindError> = lib.enumCodec<{ Asset: [lib.AssetId], AssetDefinition: [lib.AssetDefinitionId], Account: [lib.AccountId], Domain: [lib.DomainId], MetadataKey: [lib.Name], Block: [lib.Hash], Transaction: [lib.Hash], Peer: [PeerId], Trigger: [TriggerId], Role: [RoleId], Permission: [Permission], PublicKey: [lib.PublicKey] }>([[0, 'Asset', lib.AssetId$codec], [1, 'AssetDefinition', lib.AssetDefinitionId$codec], [2, 'Account', lib.AccountId$codec], [3, 'Domain', lib.DomainId$codec], [4, 'MetadataKey', lib.Name$codec], [5, 'Block', lib.Hash$codec], [6, 'Transaction', lib.Hash$codec], [7, 'Peer', lib.lazyCodec(() => PeerId$codec)], [8, 'Trigger', lib.lazyCodec(() => TriggerId$codec)], [9, 'Role', lib.lazyCodec(() => RoleId$codec)], [10, 'Permission', lib.lazyCodec(() => Permission$codec)], [11, 'PublicKey', lib.PublicKey$codec]]).discriminated()

export type FindPermissionsByAccountId = z.infer<typeof FindPermissionsByAccountId$schema>
export const FindPermissionsByAccountId = (input: z.input<typeof FindPermissionsByAccountId$schema>): FindPermissionsByAccountId => FindPermissionsByAccountId$schema.parse(input)
export const FindPermissionsByAccountId$schema = z.object({ id: lib.AccountId$schema })
export const FindPermissionsByAccountId$codec = lib.structCodec<FindPermissionsByAccountId>([['id', lib.AccountId$codec]])

export type FindRolesByAccountId = z.infer<typeof FindRolesByAccountId$schema>
export const FindRolesByAccountId = (input: z.input<typeof FindRolesByAccountId$schema>): FindRolesByAccountId => FindRolesByAccountId$schema.parse(input)
export const FindRolesByAccountId$schema = z.object({ id: lib.AccountId$schema })
export const FindRolesByAccountId$codec = lib.structCodec<FindRolesByAccountId>([['id', lib.AccountId$codec]])

export type FindTriggerMetadata = z.infer<typeof FindTriggerMetadata$schema>
export const FindTriggerMetadata = (input: z.input<typeof FindTriggerMetadata$schema>): FindTriggerMetadata => FindTriggerMetadata$schema.parse(input)
export const FindTriggerMetadata$schema = z.object({ id: z.lazy(() => TriggerId$schema), key: lib.Name$schema })
export const FindTriggerMetadata$codec = lib.structCodec<FindTriggerMetadata>([['id', lib.lazyCodec(() => TriggerId$codec)], ['key', lib.Name$codec]])

export type ForwardCursor = z.infer<typeof ForwardCursor$schema>
export const ForwardCursor = (input: z.input<typeof ForwardCursor$schema>): ForwardCursor => ForwardCursor$schema.parse(input)
export const ForwardCursor$schema = z.object({ query: z.string(), cursor: lib.NonZero$schema(lib.U64$schema) })
export const ForwardCursor$codec = lib.structCodec<ForwardCursor>([['query', lib.String$codec], ['cursor', lib.NonZero$codec(lib.U64$codec)]])

export type GenesisWasmAction = z.infer<typeof GenesisWasmAction$schema>
export const GenesisWasmAction = (input: z.input<typeof GenesisWasmAction$schema>): GenesisWasmAction => GenesisWasmAction$schema.parse(input)
export const GenesisWasmAction$schema = z.object({ executable: z.string(), repeats: z.lazy(() => Repeats$schema), authority: lib.AccountId$schema, filter: z.lazy(() => EventFilterBox$schema) })
export const GenesisWasmAction$codec = lib.structCodec<GenesisWasmAction>([['executable', lib.String$codec], ['repeats', lib.lazyCodec(() => Repeats$codec)], ['authority', lib.AccountId$codec], ['filter', lib.lazyCodec(() => EventFilterBox$codec)]])

export type GenesisWasmTrigger = z.infer<typeof GenesisWasmTrigger$schema>
export const GenesisWasmTrigger = (input: z.input<typeof GenesisWasmTrigger$schema>): GenesisWasmTrigger => GenesisWasmTrigger$schema.parse(input)
export const GenesisWasmTrigger$schema = z.object({ id: z.lazy(() => TriggerId$schema), action: z.lazy(() => GenesisWasmAction$schema) })
export const GenesisWasmTrigger$codec = lib.structCodec<GenesisWasmTrigger>([['id', lib.lazyCodec(() => TriggerId$codec)], ['action', lib.lazyCodec(() => GenesisWasmAction$codec)]])

export interface Grant<T0, T1> { object: T0, destination: T1 }
export const Grant$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) => z.object({ object: t0, destination: t1 })
export const Grant$codec = <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>) => lib.structCodec([['object', t0], ['destination', t1]])

export type GrantBox = z.infer<typeof GrantBox$schema>
export const GrantBox = (input: z.input<typeof GrantBox$schema>): GrantBox => GrantBox$schema.parse(input)
export const GrantBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Permission'), value: z.lazy(() => Grant$schema(z.lazy(() => Permission$schema), lib.AccountId$schema)) }), z.object({ t: z.literal('Role'), value: z.lazy(() => Grant$schema(z.lazy(() => RoleId$schema), lib.AccountId$schema)) }), z.object({ t: z.literal('RolePermission'), value: z.lazy(() => Grant$schema(z.lazy(() => Permission$schema), z.lazy(() => RoleId$schema))) })])
export const GrantBox$codec: lib.Codec<GrantBox> = lib.enumCodec<{ Permission: [Grant<Permission, lib.AccountId>], Role: [Grant<RoleId, lib.AccountId>], RolePermission: [Grant<Permission, RoleId>] }>([[0, 'Permission', lib.lazyCodec(() => Grant$codec(lib.lazyCodec(() => Permission$codec), lib.AccountId$codec))], [1, 'Role', lib.lazyCodec(() => Grant$codec(lib.lazyCodec(() => RoleId$codec), lib.AccountId$codec))], [2, 'RolePermission', lib.lazyCodec(() => Grant$codec(lib.lazyCodec(() => Permission$codec), lib.lazyCodec(() => RoleId$codec)))]]).discriminated()

export type IdBox = z.infer<typeof IdBox$schema>
export const IdBox = (input: z.input<typeof IdBox$schema>): IdBox => IdBox$schema.parse(input)
export const IdBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('DomainId'), value: lib.DomainId$schema }), z.object({ t: z.literal('AccountId'), value: lib.AccountId$schema }), z.object({ t: z.literal('AssetDefinitionId'), value: lib.AssetDefinitionId$schema }), z.object({ t: z.literal('AssetId'), value: lib.AssetId$schema }), z.object({ t: z.literal('PeerId'), value: z.lazy(() => PeerId$schema) }), z.object({ t: z.literal('TriggerId'), value: z.lazy(() => TriggerId$schema) }), z.object({ t: z.literal('RoleId'), value: z.lazy(() => RoleId$schema) }), z.object({ t: z.literal('Permission'), value: z.lazy(() => Permission$schema) }), z.object({ t: z.literal('CustomParameterId'), value: z.lazy(() => CustomParameterId$schema) })])
export const IdBox$codec: lib.Codec<IdBox> = lib.enumCodec<{ DomainId: [lib.DomainId], AccountId: [lib.AccountId], AssetDefinitionId: [lib.AssetDefinitionId], AssetId: [lib.AssetId], PeerId: [PeerId], TriggerId: [TriggerId], RoleId: [RoleId], Permission: [Permission], CustomParameterId: [CustomParameterId] }>([[0, 'DomainId', lib.DomainId$codec], [1, 'AccountId', lib.AccountId$codec], [2, 'AssetDefinitionId', lib.AssetDefinitionId$codec], [3, 'AssetId', lib.AssetId$codec], [4, 'PeerId', lib.lazyCodec(() => PeerId$codec)], [5, 'TriggerId', lib.lazyCodec(() => TriggerId$codec)], [6, 'RoleId', lib.lazyCodec(() => RoleId$codec)], [7, 'Permission', lib.lazyCodec(() => Permission$codec)], [8, 'CustomParameterId', lib.lazyCodec(() => CustomParameterId$codec)]]).discriminated()

export type InstructionBox = { t: 'Register', value: RegisterBox } | { t: 'Unregister', value: UnregisterBox } | { t: 'Mint', value: MintBox } | { t: 'Burn', value: BurnBox } | { t: 'Transfer', value: TransferBox } | { t: 'SetKeyValue', value: SetKeyValueBox } | { t: 'RemoveKeyValue', value: RemoveKeyValueBox } | { t: 'Grant', value: GrantBox } | { t: 'Revoke', value: RevokeBox } | { t: 'ExecuteTrigger', value: ExecuteTrigger } | { t: 'SetParameter', value: SetParameter } | { t: 'Upgrade', value: Upgrade } | { t: 'Log', value: Log } | { t: 'Custom', value: CustomInstruction }
export const InstructionBox = (input: z.input<typeof InstructionBox$schema>): InstructionBox => InstructionBox$schema.parse(input)
type InstructionBox$input = { t: 'Register', value: z.input<z.ZodLazy<typeof RegisterBox$schema>> } | { t: 'Unregister', value: z.input<z.ZodLazy<typeof UnregisterBox$schema>> } | { t: 'Mint', value: z.input<z.ZodLazy<typeof MintBox$schema>> } | { t: 'Burn', value: z.input<z.ZodLazy<typeof BurnBox$schema>> } | { t: 'Transfer', value: z.input<z.ZodLazy<typeof TransferBox$schema>> } | { t: 'SetKeyValue', value: z.input<z.ZodLazy<typeof SetKeyValueBox$schema>> } | { t: 'RemoveKeyValue', value: z.input<z.ZodLazy<typeof RemoveKeyValueBox$schema>> } | { t: 'Grant', value: z.input<z.ZodLazy<typeof GrantBox$schema>> } | { t: 'Revoke', value: z.input<z.ZodLazy<typeof RevokeBox$schema>> } | { t: 'ExecuteTrigger', value: z.input<z.ZodLazy<typeof ExecuteTrigger$schema>> } | { t: 'SetParameter', value: z.input<z.ZodLazy<typeof SetParameter$schema>> } | { t: 'Upgrade', value: z.input<z.ZodLazy<typeof Upgrade$schema>> } | { t: 'Log', value: z.input<z.ZodLazy<typeof Log$schema>> } | { t: 'Custom', value: z.input<z.ZodLazy<typeof CustomInstruction$schema>> }
export const InstructionBox$schema: z.ZodType<InstructionBox, z.ZodTypeDef, InstructionBox$input> = z.discriminatedUnion('t', [z.object({ t: z.literal('Register'), value: z.lazy(() => RegisterBox$schema) }), z.object({ t: z.literal('Unregister'), value: z.lazy(() => UnregisterBox$schema) }), z.object({ t: z.literal('Mint'), value: z.lazy(() => MintBox$schema) }), z.object({ t: z.literal('Burn'), value: z.lazy(() => BurnBox$schema) }), z.object({ t: z.literal('Transfer'), value: z.lazy(() => TransferBox$schema) }), z.object({ t: z.literal('SetKeyValue'), value: z.lazy(() => SetKeyValueBox$schema) }), z.object({ t: z.literal('RemoveKeyValue'), value: z.lazy(() => RemoveKeyValueBox$schema) }), z.object({ t: z.literal('Grant'), value: z.lazy(() => GrantBox$schema) }), z.object({ t: z.literal('Revoke'), value: z.lazy(() => RevokeBox$schema) }), z.object({ t: z.literal('ExecuteTrigger'), value: z.lazy(() => ExecuteTrigger$schema) }), z.object({ t: z.literal('SetParameter'), value: z.lazy(() => SetParameter$schema) }), z.object({ t: z.literal('Upgrade'), value: z.lazy(() => Upgrade$schema) }), z.object({ t: z.literal('Log'), value: z.lazy(() => Log$schema) }), z.object({ t: z.literal('Custom'), value: z.lazy(() => CustomInstruction$schema) })])
export const InstructionBox$codec: lib.Codec<InstructionBox> = lib.enumCodec<{ Register: [RegisterBox], Unregister: [UnregisterBox], Mint: [MintBox], Burn: [BurnBox], Transfer: [TransferBox], SetKeyValue: [SetKeyValueBox], RemoveKeyValue: [RemoveKeyValueBox], Grant: [GrantBox], Revoke: [RevokeBox], ExecuteTrigger: [ExecuteTrigger], SetParameter: [SetParameter], Upgrade: [Upgrade], Log: [Log], Custom: [CustomInstruction] }>([[0, 'Register', lib.lazyCodec(() => RegisterBox$codec)], [1, 'Unregister', lib.lazyCodec(() => UnregisterBox$codec)], [2, 'Mint', lib.lazyCodec(() => MintBox$codec)], [3, 'Burn', lib.lazyCodec(() => BurnBox$codec)], [4, 'Transfer', lib.lazyCodec(() => TransferBox$codec)], [5, 'SetKeyValue', lib.lazyCodec(() => SetKeyValueBox$codec)], [6, 'RemoveKeyValue', lib.lazyCodec(() => RemoveKeyValueBox$codec)], [7, 'Grant', lib.lazyCodec(() => GrantBox$codec)], [8, 'Revoke', lib.lazyCodec(() => RevokeBox$codec)], [9, 'ExecuteTrigger', lib.lazyCodec(() => ExecuteTrigger$codec)], [10, 'SetParameter', lib.lazyCodec(() => SetParameter$codec)], [11, 'Upgrade', lib.lazyCodec(() => Upgrade$codec)], [12, 'Log', lib.lazyCodec(() => Log$codec)], [13, 'Custom', lib.lazyCodec(() => CustomInstruction$codec)]]).discriminated()

export type InstructionEvaluationError = z.infer<typeof InstructionEvaluationError$schema>
export const InstructionEvaluationError = (input: z.input<typeof InstructionEvaluationError$schema>): InstructionEvaluationError => InstructionEvaluationError$schema.parse(input)
export const InstructionEvaluationError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Unsupported'), value: z.lazy(() => InstructionType$schema) }), z.object({ t: z.literal('PermissionParameter'), value: z.string() }), z.object({ t: z.literal('Type'), value: z.lazy(() => TypeError$schema) })])
export const InstructionEvaluationError$codec: lib.Codec<InstructionEvaluationError> = lib.enumCodec<{ Unsupported: [InstructionType], PermissionParameter: [lib.String], Type: [TypeError] }>([[0, 'Unsupported', lib.lazyCodec(() => InstructionType$codec)], [1, 'PermissionParameter', lib.String$codec], [2, 'Type', lib.lazyCodec(() => TypeError$codec)]]).discriminated()

export type InstructionExecutionError = z.infer<typeof InstructionExecutionError$schema>
export const InstructionExecutionError = (input: z.input<typeof InstructionExecutionError$schema>): InstructionExecutionError => InstructionExecutionError$schema.parse(input)
export const InstructionExecutionError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Evaluate'), value: z.lazy(() => InstructionEvaluationError$schema) }), z.object({ t: z.literal('Query'), value: z.lazy(() => QueryExecutionFail$schema) }), z.object({ t: z.literal('Conversion'), value: z.string() }), z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }), z.object({ t: z.literal('Repetition'), value: z.lazy(() => RepetitionError$schema) }), z.object({ t: z.literal('Mintability'), value: z.lazy(() => MintabilityError$schema) }), z.object({ t: z.literal('Math'), value: z.lazy(() => MathError$schema) }), z.object({ t: z.literal('InvalidParameter'), value: z.lazy(() => InvalidParameterError$schema) }), z.object({ t: z.literal('InvariantViolation'), value: z.string() })])
export const InstructionExecutionError$codec: lib.Codec<InstructionExecutionError> = lib.enumCodec<{ Evaluate: [InstructionEvaluationError], Query: [QueryExecutionFail], Conversion: [lib.String], Find: [FindError], Repetition: [RepetitionError], Mintability: [MintabilityError], Math: [MathError], InvalidParameter: [InvalidParameterError], InvariantViolation: [lib.String] }>([[0, 'Evaluate', lib.lazyCodec(() => InstructionEvaluationError$codec)], [1, 'Query', lib.lazyCodec(() => QueryExecutionFail$codec)], [2, 'Conversion', lib.String$codec], [3, 'Find', lib.lazyCodec(() => FindError$codec)], [4, 'Repetition', lib.lazyCodec(() => RepetitionError$codec)], [5, 'Mintability', lib.lazyCodec(() => MintabilityError$codec)], [6, 'Math', lib.lazyCodec(() => MathError$codec)], [7, 'InvalidParameter', lib.lazyCodec(() => InvalidParameterError$codec)], [8, 'InvariantViolation', lib.String$codec]]).discriminated()

export type InstructionExecutionFail = z.infer<typeof InstructionExecutionFail$schema>
export const InstructionExecutionFail = (input: z.input<typeof InstructionExecutionFail$schema>): InstructionExecutionFail => InstructionExecutionFail$schema.parse(input)
export const InstructionExecutionFail$schema = z.object({ instruction: z.lazy(() => InstructionBox$schema), reason: z.string() })
export const InstructionExecutionFail$codec = lib.structCodec<InstructionExecutionFail>([['instruction', lib.lazyCodec(() => InstructionBox$codec)], ['reason', lib.String$codec]])

export type InstructionType = z.infer<typeof InstructionType$schema>
export const InstructionType = (input: z.input<typeof InstructionType$schema>): InstructionType => InstructionType$schema.parse(input)
export const InstructionType$schema = z.union([z.literal('Register'), z.literal('Unregister'), z.literal('Mint'), z.literal('Burn'), z.literal('Transfer'), z.literal('SetKeyValue'), z.literal('RemoveKeyValue'), z.literal('Grant'), z.literal('Revoke'), z.literal('ExecuteTrigger'), z.literal('SetParameter'), z.literal('Upgrade'), z.literal('Log'), z.literal('Custom')])
export const InstructionType$codec: lib.Codec<InstructionType> = lib.enumCodec<{ Register: [], Unregister: [], Mint: [], Burn: [], Transfer: [], SetKeyValue: [], RemoveKeyValue: [], Grant: [], Revoke: [], ExecuteTrigger: [], SetParameter: [], Upgrade: [], Log: [], Custom: [] }>([[0, 'Register'], [1, 'Unregister'], [2, 'Mint'], [3, 'Burn'], [4, 'Transfer'], [5, 'SetKeyValue'], [6, 'RemoveKeyValue'], [7, 'Grant'], [8, 'Revoke'], [9, 'ExecuteTrigger'], [10, 'SetParameter'], [11, 'Upgrade'], [12, 'Log'], [13, 'Custom']]).literalUnion()

export type InvalidParameterError = z.infer<typeof InvalidParameterError$schema>
export const InvalidParameterError = (input: z.input<typeof InvalidParameterError$schema>): InvalidParameterError => InvalidParameterError$schema.parse(input)
export const InvalidParameterError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Wasm'), value: z.string() }), z.object({ t: z.literal('TimeTriggerInThePast') })])
export const InvalidParameterError$codec: lib.Codec<InvalidParameterError> = lib.enumCodec<{ Wasm: [lib.String], TimeTriggerInThePast: [] }>([[0, 'Wasm', lib.String$codec], [1, 'TimeTriggerInThePast']]).discriminated()

export type IpfsPath = z.infer<typeof IpfsPath$schema>
export const IpfsPath = (input: z.input<typeof IpfsPath$schema>): IpfsPath => IpfsPath$schema.parse(input)
export const IpfsPath$schema = z.string().brand<'IpfsPath'>()
export const IpfsPath$codec = lib.String$codec as lib.Codec<IpfsPath>

export type Log = z.infer<typeof Log$schema>
export const Log = (input: z.input<typeof Log$schema>): Log => Log$schema.parse(input)
export const Log$schema = z.object({ level: z.lazy(() => LogLevel$schema), msg: z.string() })
export const Log$codec = lib.structCodec<Log>([['level', lib.lazyCodec(() => LogLevel$codec)], ['msg', lib.String$codec]])

export type LogLevel = z.infer<typeof LogLevel$schema>
export const LogLevel = (input: z.input<typeof LogLevel$schema>): LogLevel => LogLevel$schema.parse(input)
export const LogLevel$schema = z.union([z.literal('TRACE'), z.literal('DEBUG'), z.literal('INFO'), z.literal('WARN'), z.literal('ERROR')])
export const LogLevel$codec: lib.Codec<LogLevel> = lib.enumCodec<{ TRACE: [], DEBUG: [], INFO: [], WARN: [], ERROR: [] }>([[0, 'TRACE'], [1, 'DEBUG'], [2, 'INFO'], [3, 'WARN'], [4, 'ERROR']]).literalUnion()

export type MathError = z.infer<typeof MathError$schema>
export const MathError = (input: z.input<typeof MathError$schema>): MathError => MathError$schema.parse(input)
export const MathError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Overflow') }), z.object({ t: z.literal('NotEnoughQuantity') }), z.object({ t: z.literal('DivideByZero') }), z.object({ t: z.literal('NegativeValue') }), z.object({ t: z.literal('DomainViolation') }), z.object({ t: z.literal('Unknown') }), z.object({ t: z.literal('FixedPointConversion'), value: z.string() })])
export const MathError$codec: lib.Codec<MathError> = lib.enumCodec<{ Overflow: [], NotEnoughQuantity: [], DivideByZero: [], NegativeValue: [], DomainViolation: [], Unknown: [], FixedPointConversion: [lib.String] }>([[0, 'Overflow'], [1, 'NotEnoughQuantity'], [2, 'DivideByZero'], [3, 'NegativeValue'], [4, 'DomainViolation'], [5, 'Unknown'], [6, 'FixedPointConversion', lib.String$codec]]).discriminated()

export type Metadata = lib.Map<lib.Name, lib.Json>
export const Metadata = (input: z.input<typeof Metadata$schema>): Metadata => Metadata$schema.parse(input)
export const Metadata$schema = lib.Map$schema(lib.Name$schema, lib.Json$schema)
export const Metadata$codec = lib.Map$codec(lib.Name$codec, lib.Json$codec)

export interface MetadataChanged<T0> { target: T0, key: lib.String, value: lib.Json }
export const MetadataChanged$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ target: t0, key: z.string(), value: lib.Json$schema })
export const MetadataChanged$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['target', t0], ['key', lib.String$codec], ['value', lib.Json$codec]])

export type MetadataPredicateBox = never
export const MetadataPredicateBox$schema = z.never()
export const MetadataPredicateBox$codec = lib.neverCodec

export interface Mint<T0, T1> { object: T0, destination: T1 }
export const Mint$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) => z.object({ object: t0, destination: t1 })
export const Mint$codec = <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>) => lib.structCodec([['object', t0], ['destination', t1]])

export type MintBox = z.infer<typeof MintBox$schema>
export const MintBox = (input: z.input<typeof MintBox$schema>): MintBox => MintBox$schema.parse(input)
export const MintBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Asset'), value: z.lazy(() => Mint$schema(z.lazy(() => Numeric$schema), lib.AssetId$schema)) }), z.object({ t: z.literal('TriggerRepetitions'), value: z.lazy(() => Mint$schema(lib.U32$schema, z.lazy(() => TriggerId$schema))) })])
export const MintBox$codec: lib.Codec<MintBox> = lib.enumCodec<{ Asset: [Mint<Numeric, lib.AssetId>], TriggerRepetitions: [Mint<lib.U32, TriggerId>] }>([[0, 'Asset', lib.lazyCodec(() => Mint$codec(lib.lazyCodec(() => Numeric$codec), lib.AssetId$codec))], [1, 'TriggerRepetitions', lib.lazyCodec(() => Mint$codec(lib.U32$codec, lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type MintabilityError = z.infer<typeof MintabilityError$schema>
export const MintabilityError = (input: z.input<typeof MintabilityError$schema>): MintabilityError => MintabilityError$schema.parse(input)
export const MintabilityError$schema = z.union([z.literal('MintUnmintable'), z.literal('ForbidMintOnMintable')])
export const MintabilityError$codec: lib.Codec<MintabilityError> = lib.enumCodec<{ MintUnmintable: [], ForbidMintOnMintable: [] }>([[0, 'MintUnmintable'], [1, 'ForbidMintOnMintable']]).literalUnion()

export type Mintable = z.infer<typeof Mintable$schema>
export const Mintable = (input: z.input<typeof Mintable$schema>): Mintable => Mintable$schema.parse(input)
export const Mintable$schema = z.union([z.literal('Infinitely'), z.literal('Once'), z.literal('Not')])
export const Mintable$codec: lib.Codec<Mintable> = lib.enumCodec<{ Infinitely: [], Once: [], Not: [] }>([[0, 'Infinitely'], [1, 'Once'], [2, 'Not']]).literalUnion()

export type MultisigAccountArgs = z.infer<typeof MultisigAccountArgs$schema>
export const MultisigAccountArgs = (input: z.input<typeof MultisigAccountArgs$schema>): MultisigAccountArgs => MultisigAccountArgs$schema.parse(input)
export const MultisigAccountArgs$schema = z.object({ account: lib.PublicKey$schema, signatories: lib.Map$schema(lib.AccountId$schema, lib.U8$schema), quorum: lib.U16$schema, transactionTtlMs: lib.U64$schema })
export const MultisigAccountArgs$codec = lib.structCodec<MultisigAccountArgs>([['account', lib.PublicKey$codec], ['signatories', lib.Map$codec(lib.AccountId$codec, lib.U8$codec)], ['quorum', lib.U16$codec], ['transactionTtlMs', lib.U64$codec]])

export type MultisigTransactionArgs = z.infer<typeof MultisigTransactionArgs$schema>
export const MultisigTransactionArgs = (input: z.input<typeof MultisigTransactionArgs$schema>): MultisigTransactionArgs => MultisigTransactionArgs$schema.parse(input)
export const MultisigTransactionArgs$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Propose'), value: lib.Vec$schema(z.lazy(() => InstructionBox$schema)) }), z.object({ t: z.literal('Approve'), value: lib.Hash$schema })])
export const MultisigTransactionArgs$codec: lib.Codec<MultisigTransactionArgs> = lib.enumCodec<{ Propose: [lib.Vec<InstructionBox>], Approve: [lib.Hash] }>([[0, 'Propose', lib.Vec$codec(lib.lazyCodec(() => InstructionBox$codec))], [1, 'Approve', lib.Hash$codec]]).discriminated()

export type NewAccount = z.infer<typeof NewAccount$schema>
export const NewAccount = (input: z.input<typeof NewAccount$schema>): NewAccount => NewAccount$schema.parse(input)
export const NewAccount$schema = z.object({ id: lib.AccountId$schema, metadata: z.lazy(() => Metadata$schema) })
export const NewAccount$codec = lib.structCodec<NewAccount>([['id', lib.AccountId$codec], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type NewAssetDefinition = z.infer<typeof NewAssetDefinition$schema>
export const NewAssetDefinition = (input: z.input<typeof NewAssetDefinition$schema>): NewAssetDefinition => NewAssetDefinition$schema.parse(input)
export const NewAssetDefinition$schema = z.object({ id: lib.AssetDefinitionId$schema, type: z.lazy(() => AssetType$schema), mintable: z.lazy(() => Mintable$schema), logo: lib.Option$schema(z.lazy(() => IpfsPath$schema)), metadata: z.lazy(() => Metadata$schema) })
export const NewAssetDefinition$codec = lib.structCodec<NewAssetDefinition>([['id', lib.AssetDefinitionId$codec], ['type', lib.lazyCodec(() => AssetType$codec)], ['mintable', lib.lazyCodec(() => Mintable$codec)], ['logo', lib.Option$codec(lib.lazyCodec(() => IpfsPath$codec))], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type NewDomain = z.infer<typeof NewDomain$schema>
export const NewDomain = (input: z.input<typeof NewDomain$schema>): NewDomain => NewDomain$schema.parse(input)
export const NewDomain$schema = z.object({ id: lib.DomainId$schema, logo: lib.Option$schema(z.lazy(() => IpfsPath$schema)), metadata: z.lazy(() => Metadata$schema) })
export const NewDomain$codec = lib.structCodec<NewDomain>([['id', lib.DomainId$codec], ['logo', lib.Option$codec(lib.lazyCodec(() => IpfsPath$codec))], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type NewRole = z.infer<typeof NewRole$schema>
export const NewRole = (input: z.input<typeof NewRole$schema>): NewRole => NewRole$schema.parse(input)
export const NewRole$schema = z.object({ inner: z.lazy(() => Role$schema), grantTo: lib.AccountId$schema })
export const NewRole$codec = lib.structCodec<NewRole>([['inner', lib.lazyCodec(() => Role$codec)], ['grantTo', lib.AccountId$codec]])

export type Numeric = z.infer<typeof Numeric$schema>
export const Numeric = (input: z.input<typeof Numeric$schema>): Numeric => Numeric$schema.parse(input)
export const Numeric$schema = z.object({ mantissa: lib.Compact$schema, scale: lib.Compact$schema })
export const Numeric$codec = lib.structCodec<Numeric>([['mantissa', lib.Compact$codec], ['scale', lib.Compact$codec]])

export type NumericSpec = z.infer<typeof NumericSpec$schema>
export const NumericSpec = (input: z.input<typeof NumericSpec$schema>): NumericSpec => NumericSpec$schema.parse(input)
export const NumericSpec$schema = z.object({ scale: lib.Option$schema(lib.U32$schema) })
export const NumericSpec$codec = lib.structCodec<NumericSpec>([['scale', lib.Option$codec(lib.U32$codec)]])

export type Pagination = z.infer<typeof Pagination$schema>
export const Pagination = (input: z.input<typeof Pagination$schema>): Pagination => Pagination$schema.parse(input)
export const Pagination$schema = z.object({ limit: lib.Option$schema(lib.NonZero$schema(lib.U64$schema)), offset: lib.U64$schema }).default(() => ({ offset: 0 }))
export const Pagination$codec = lib.structCodec<Pagination>([['limit', lib.Option$codec(lib.NonZero$codec(lib.U64$codec))], ['offset', lib.U64$codec]])

export type Parameter = z.infer<typeof Parameter$schema>
export const Parameter = (input: z.input<typeof Parameter$schema>): Parameter => Parameter$schema.parse(input)
export const Parameter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Sumeragi'), value: z.lazy(() => SumeragiParameter$schema) }), z.object({ t: z.literal('Block'), value: z.lazy(() => BlockParameter$schema) }), z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionParameter$schema) }), z.object({ t: z.literal('SmartContract'), value: z.lazy(() => SmartContractParameter$schema) }), z.object({ t: z.literal('Executor'), value: z.lazy(() => SmartContractParameter$schema) }), z.object({ t: z.literal('Custom'), value: z.lazy(() => CustomParameter$schema) })])
export const Parameter$codec: lib.Codec<Parameter> = lib.enumCodec<{ Sumeragi: [SumeragiParameter], Block: [BlockParameter], Transaction: [TransactionParameter], SmartContract: [SmartContractParameter], Executor: [SmartContractParameter], Custom: [CustomParameter] }>([[0, 'Sumeragi', lib.lazyCodec(() => SumeragiParameter$codec)], [1, 'Block', lib.lazyCodec(() => BlockParameter$codec)], [2, 'Transaction', lib.lazyCodec(() => TransactionParameter$codec)], [3, 'SmartContract', lib.lazyCodec(() => SmartContractParameter$codec)], [4, 'Executor', lib.lazyCodec(() => SmartContractParameter$codec)], [5, 'Custom', lib.lazyCodec(() => CustomParameter$codec)]]).discriminated()

export type ParameterChanged = z.infer<typeof ParameterChanged$schema>
export const ParameterChanged = (input: z.input<typeof ParameterChanged$schema>): ParameterChanged => ParameterChanged$schema.parse(input)
export const ParameterChanged$schema = z.object({ oldValue: z.lazy(() => Parameter$schema), newValue: z.lazy(() => Parameter$schema) })
export const ParameterChanged$codec = lib.structCodec<ParameterChanged>([['oldValue', lib.lazyCodec(() => Parameter$codec)], ['newValue', lib.lazyCodec(() => Parameter$codec)]])

export type Parameters = z.infer<typeof Parameters$schema>
export const Parameters = (input: z.input<typeof Parameters$schema>): Parameters => Parameters$schema.parse(input)
export const Parameters$schema = z.object({ sumeragi: z.lazy(() => SumeragiParameters$schema), block: z.lazy(() => BlockParameters$schema), transaction: z.lazy(() => TransactionParameters$schema), executor: z.lazy(() => SmartContractParameters$schema), smartContract: z.lazy(() => SmartContractParameters$schema), custom: lib.Map$schema(z.lazy(() => CustomParameterId$schema), z.lazy(() => CustomParameter$schema)) })
export const Parameters$codec = lib.structCodec<Parameters>([['sumeragi', lib.lazyCodec(() => SumeragiParameters$codec)], ['block', lib.lazyCodec(() => BlockParameters$codec)], ['transaction', lib.lazyCodec(() => TransactionParameters$codec)], ['executor', lib.lazyCodec(() => SmartContractParameters$codec)], ['smartContract', lib.lazyCodec(() => SmartContractParameters$codec)], ['custom', lib.Map$codec(lib.lazyCodec(() => CustomParameterId$codec), lib.lazyCodec(() => CustomParameter$codec))]])

export type PeerEvent = z.infer<typeof PeerEvent$schema>
export const PeerEvent = (input: z.input<typeof PeerEvent$schema>): PeerEvent => PeerEvent$schema.parse(input)
export const PeerEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Added'), value: z.lazy(() => PeerId$schema) }), z.object({ t: z.literal('Removed'), value: z.lazy(() => PeerId$schema) })])
export const PeerEvent$codec: lib.Codec<PeerEvent> = lib.enumCodec<{ Added: [PeerId], Removed: [PeerId] }>([[0, 'Added', lib.lazyCodec(() => PeerId$codec)], [1, 'Removed', lib.lazyCodec(() => PeerId$codec)]]).discriminated()

export type PeerEventFilter = z.infer<typeof PeerEventFilter$schema>
export const PeerEventFilter = (input: z.input<typeof PeerEventFilter$schema>): PeerEventFilter => PeerEventFilter$schema.parse(input)
export const PeerEventFilter$schema = z.object({ idMatcher: lib.Option$schema(z.lazy(() => PeerId$schema)), eventSet: z.lazy(() => PeerEventSet$schema) })
export const PeerEventFilter$codec = lib.structCodec<PeerEventFilter>([['idMatcher', lib.Option$codec(lib.lazyCodec(() => PeerId$codec))], ['eventSet', lib.lazyCodec(() => PeerEventSet$codec)]])

export type PeerEventSet = z.infer<typeof PeerEventSet$schema>
export const PeerEventSet = (input: z.input<typeof PeerEventSet$schema>): PeerEventSet => PeerEventSet$schema.parse(input)
const PeerEventSet$literalSchema = z.union([z.literal('Added'), z.literal('Removed')])
export const PeerEventSet$schema = z.set(PeerEventSet$literalSchema).or(z.array(PeerEventSet$literalSchema).transform(arr => new Set(arr)))
export const PeerEventSet$codec = lib.bitmap<PeerEventSet extends Set<infer T> ? T : never>({ Added: 1, Removed: 2 })

export type PeerId = z.infer<typeof PeerId$schema>
export const PeerId = (input: z.input<typeof PeerId$schema>): PeerId => PeerId$schema.parse(input)
export const PeerId$schema = z.object({ publicKey: lib.PublicKey$schema })
export const PeerId$codec = lib.structCodec<PeerId>([['publicKey', lib.PublicKey$codec]])

export type PeerPredicateBox = never
export const PeerPredicateBox$schema = z.never()
export const PeerPredicateBox$codec = lib.neverCodec

export type Permission = z.infer<typeof Permission$schema>
export const Permission = (input: z.input<typeof Permission$schema>): Permission => Permission$schema.parse(input)
export const Permission$schema = z.object({ name: z.string(), payload: lib.Json$schema })
export const Permission$codec = lib.structCodec<Permission>([['name', lib.String$codec], ['payload', lib.Json$codec]])

export type PermissionPredicateBox = never
export const PermissionPredicateBox$schema = z.never()
export const PermissionPredicateBox$codec = lib.neverCodec

export type PipelineEventBox = z.infer<typeof PipelineEventBox$schema>
export const PipelineEventBox = (input: z.input<typeof PipelineEventBox$schema>): PipelineEventBox => PipelineEventBox$schema.parse(input)
export const PipelineEventBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEvent$schema) }), z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEvent$schema) })])
export const PipelineEventBox$codec: lib.Codec<PipelineEventBox> = lib.enumCodec<{ Transaction: [TransactionEvent], Block: [BlockEvent] }>([[0, 'Transaction', lib.lazyCodec(() => TransactionEvent$codec)], [1, 'Block', lib.lazyCodec(() => BlockEvent$codec)]]).discriminated()

export type PipelineEventFilterBox = z.infer<typeof PipelineEventFilterBox$schema>
export const PipelineEventFilterBox = (input: z.input<typeof PipelineEventFilterBox$schema>): PipelineEventFilterBox => PipelineEventFilterBox$schema.parse(input)
export const PipelineEventFilterBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Transaction'), value: z.lazy(() => TransactionEventFilter$schema) }), z.object({ t: z.literal('Block'), value: z.lazy(() => BlockEventFilter$schema) })])
export const PipelineEventFilterBox$codec: lib.Codec<PipelineEventFilterBox> = lib.enumCodec<{ Transaction: [TransactionEventFilter], Block: [BlockEventFilter] }>([[0, 'Transaction', lib.lazyCodec(() => TransactionEventFilter$codec)], [1, 'Block', lib.lazyCodec(() => BlockEventFilter$codec)]]).discriminated()

export type PublicKeyPredicateBox = z.infer<typeof PublicKeyPredicateBox$schema>
export const PublicKeyPredicateBox = (input: z.input<typeof PublicKeyPredicateBox$schema>): PublicKeyPredicateBox => PublicKeyPredicateBox$schema.parse(input)
export const PublicKeyPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.PublicKey$schema })])
export const PublicKeyPredicateBox$codec: lib.Codec<PublicKeyPredicateBox> = lib.enumCodec<{ Equals: [lib.PublicKey] }>([[0, 'Equals', lib.PublicKey$codec]]).discriminated()

export type QueryBox = { t: 'FindDomains', value: QueryWithFilter<null, DomainPredicateBox> } | { t: 'FindAccounts', value: QueryWithFilter<null, AccountPredicateBox> } | { t: 'FindAssets', value: QueryWithFilter<null, AssetPredicateBox> } | { t: 'FindAssetsDefinitions', value: QueryWithFilter<null, AssetDefinitionPredicateBox> } | { t: 'FindRoles', value: QueryWithFilter<null, RolePredicateBox> } | { t: 'FindRoleIds', value: QueryWithFilter<null, RoleIdPredicateBox> } | { t: 'FindPermissionsByAccountId', value: QueryWithFilter<FindPermissionsByAccountId, PermissionPredicateBox> } | { t: 'FindRolesByAccountId', value: QueryWithFilter<FindRolesByAccountId, RoleIdPredicateBox> } | { t: 'FindAccountsWithAsset', value: QueryWithFilter<FindAccountsWithAsset, AccountPredicateBox> } | { t: 'FindPeers', value: QueryWithFilter<null, PeerPredicateBox> } | { t: 'FindActiveTriggerIds', value: QueryWithFilter<null, TriggerIdPredicateBox> } | { t: 'FindTriggers', value: QueryWithFilter<null, TriggerPredicateBox> } | { t: 'FindTransactions', value: QueryWithFilter<null, CommittedTransactionPredicateBox> } | { t: 'FindBlocks', value: QueryWithFilter<null, SignedBlockPredicateBox> } | { t: 'FindBlockHeaders', value: QueryWithFilter<null, BlockHeaderPredicateBox> }
export const QueryBox = (input: z.input<typeof QueryBox$schema>): QueryBox => QueryBox$schema.parse(input)
type QueryBox$input = { t: 'FindDomains', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof DomainPredicateBox$schema>>>> } | { t: 'FindAccounts', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof AccountPredicateBox$schema>>>> } | { t: 'FindAssets', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof AssetPredicateBox$schema>>>> } | { t: 'FindAssetsDefinitions', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof AssetDefinitionPredicateBox$schema>>>> } | { t: 'FindRoles', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof RolePredicateBox$schema>>>> } | { t: 'FindRoleIds', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof RoleIdPredicateBox$schema>>>> } | { t: 'FindPermissionsByAccountId', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodLazy<typeof FindPermissionsByAccountId$schema>, z.ZodLazy<typeof PermissionPredicateBox$schema>>>> } | { t: 'FindRolesByAccountId', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodLazy<typeof FindRolesByAccountId$schema>, z.ZodLazy<typeof RoleIdPredicateBox$schema>>>> } | { t: 'FindAccountsWithAsset', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodLazy<typeof FindAccountsWithAsset$schema>, z.ZodLazy<typeof AccountPredicateBox$schema>>>> } | { t: 'FindPeers', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof PeerPredicateBox$schema>>>> } | { t: 'FindActiveTriggerIds', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof TriggerIdPredicateBox$schema>>>> } | { t: 'FindTriggers', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof TriggerPredicateBox$schema>>>> } | { t: 'FindTransactions', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof CommittedTransactionPredicateBox$schema>>>> } | { t: 'FindBlocks', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof SignedBlockPredicateBox$schema>>>> } | { t: 'FindBlockHeaders', value: z.input<ReturnType<typeof QueryWithFilter$schema<z.ZodDefault<z.ZodNull>, z.ZodLazy<typeof BlockHeaderPredicateBox$schema>>>> }
export const QueryBox$schema: z.ZodType<QueryBox, z.ZodTypeDef, QueryBox$input> = z.discriminatedUnion('t', [z.object({ t: z.literal('FindDomains'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => DomainPredicateBox$schema))) }), z.object({ t: z.literal('FindAccounts'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => AccountPredicateBox$schema))) }), z.object({ t: z.literal('FindAssets'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => AssetPredicateBox$schema))) }), z.object({ t: z.literal('FindAssetsDefinitions'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => AssetDefinitionPredicateBox$schema))) }), z.object({ t: z.literal('FindRoles'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => RolePredicateBox$schema))) }), z.object({ t: z.literal('FindRoleIds'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => RoleIdPredicateBox$schema))) }), z.object({ t: z.literal('FindPermissionsByAccountId'), value: z.lazy(() => QueryWithFilter$schema(z.lazy(() => FindPermissionsByAccountId$schema), z.lazy(() => PermissionPredicateBox$schema))) }), z.object({ t: z.literal('FindRolesByAccountId'), value: z.lazy(() => QueryWithFilter$schema(z.lazy(() => FindRolesByAccountId$schema), z.lazy(() => RoleIdPredicateBox$schema))) }), z.object({ t: z.literal('FindAccountsWithAsset'), value: z.lazy(() => QueryWithFilter$schema(z.lazy(() => FindAccountsWithAsset$schema), z.lazy(() => AccountPredicateBox$schema))) }), z.object({ t: z.literal('FindPeers'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => PeerPredicateBox$schema))) }), z.object({ t: z.literal('FindActiveTriggerIds'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => TriggerIdPredicateBox$schema))) }), z.object({ t: z.literal('FindTriggers'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => TriggerPredicateBox$schema))) }), z.object({ t: z.literal('FindTransactions'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => CommittedTransactionPredicateBox$schema))) }), z.object({ t: z.literal('FindBlocks'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => SignedBlockPredicateBox$schema))) }), z.object({ t: z.literal('FindBlockHeaders'), value: z.lazy(() => QueryWithFilter$schema(z.null().default(null), z.lazy(() => BlockHeaderPredicateBox$schema))) })])
export const QueryBox$codec: lib.Codec<QueryBox> = lib.enumCodec<{ FindDomains: [QueryWithFilter<null, DomainPredicateBox>], FindAccounts: [QueryWithFilter<null, AccountPredicateBox>], FindAssets: [QueryWithFilter<null, AssetPredicateBox>], FindAssetsDefinitions: [QueryWithFilter<null, AssetDefinitionPredicateBox>], FindRoles: [QueryWithFilter<null, RolePredicateBox>], FindRoleIds: [QueryWithFilter<null, RoleIdPredicateBox>], FindPermissionsByAccountId: [QueryWithFilter<FindPermissionsByAccountId, PermissionPredicateBox>], FindRolesByAccountId: [QueryWithFilter<FindRolesByAccountId, RoleIdPredicateBox>], FindAccountsWithAsset: [QueryWithFilter<FindAccountsWithAsset, AccountPredicateBox>], FindPeers: [QueryWithFilter<null, PeerPredicateBox>], FindActiveTriggerIds: [QueryWithFilter<null, TriggerIdPredicateBox>], FindTriggers: [QueryWithFilter<null, TriggerPredicateBox>], FindTransactions: [QueryWithFilter<null, CommittedTransactionPredicateBox>], FindBlocks: [QueryWithFilter<null, SignedBlockPredicateBox>], FindBlockHeaders: [QueryWithFilter<null, BlockHeaderPredicateBox>] }>([[0, 'FindDomains', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => DomainPredicateBox$codec)))], [1, 'FindAccounts', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => AccountPredicateBox$codec)))], [2, 'FindAssets', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => AssetPredicateBox$codec)))], [3, 'FindAssetsDefinitions', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => AssetDefinitionPredicateBox$codec)))], [4, 'FindRoles', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => RolePredicateBox$codec)))], [5, 'FindRoleIds', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => RoleIdPredicateBox$codec)))], [6, 'FindPermissionsByAccountId', lib.lazyCodec(() => QueryWithFilter$codec(lib.lazyCodec(() => FindPermissionsByAccountId$codec), lib.lazyCodec(() => PermissionPredicateBox$codec)))], [7, 'FindRolesByAccountId', lib.lazyCodec(() => QueryWithFilter$codec(lib.lazyCodec(() => FindRolesByAccountId$codec), lib.lazyCodec(() => RoleIdPredicateBox$codec)))], [8, 'FindAccountsWithAsset', lib.lazyCodec(() => QueryWithFilter$codec(lib.lazyCodec(() => FindAccountsWithAsset$codec), lib.lazyCodec(() => AccountPredicateBox$codec)))], [9, 'FindPeers', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => PeerPredicateBox$codec)))], [10, 'FindActiveTriggerIds', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => TriggerIdPredicateBox$codec)))], [11, 'FindTriggers', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => TriggerPredicateBox$codec)))], [12, 'FindTransactions', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => CommittedTransactionPredicateBox$codec)))], [13, 'FindBlocks', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => SignedBlockPredicateBox$codec)))], [14, 'FindBlockHeaders', lib.lazyCodec(() => QueryWithFilter$codec(lib.nullCodec, lib.lazyCodec(() => BlockHeaderPredicateBox$codec)))]]).discriminated()

export type QueryExecutionFail = z.infer<typeof QueryExecutionFail$schema>
export const QueryExecutionFail = (input: z.input<typeof QueryExecutionFail$schema>): QueryExecutionFail => QueryExecutionFail$schema.parse(input)
export const QueryExecutionFail$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Find'), value: z.lazy(() => FindError$schema) }), z.object({ t: z.literal('Conversion'), value: z.string() }), z.object({ t: z.literal('NotFound') }), z.object({ t: z.literal('CursorMismatch') }), z.object({ t: z.literal('CursorDone') }), z.object({ t: z.literal('FetchSizeTooBig') }), z.object({ t: z.literal('InvalidSingularParameters') }), z.object({ t: z.literal('CapacityLimit') })])
export const QueryExecutionFail$codec: lib.Codec<QueryExecutionFail> = lib.enumCodec<{ Find: [FindError], Conversion: [lib.String], NotFound: [], CursorMismatch: [], CursorDone: [], FetchSizeTooBig: [], InvalidSingularParameters: [], CapacityLimit: [] }>([[0, 'Find', lib.lazyCodec(() => FindError$codec)], [1, 'Conversion', lib.String$codec], [2, 'NotFound'], [3, 'CursorMismatch'], [4, 'CursorDone'], [5, 'FetchSizeTooBig'], [6, 'InvalidSingularParameters'], [7, 'CapacityLimit']]).discriminated()

export type QueryOutput = z.infer<typeof QueryOutput$schema>
export const QueryOutput = (input: z.input<typeof QueryOutput$schema>): QueryOutput => QueryOutput$schema.parse(input)
export const QueryOutput$schema = z.object({ batch: z.lazy(() => QueryOutputBatchBox$schema), remainingItems: lib.U64$schema, continueCursor: lib.Option$schema(z.lazy(() => ForwardCursor$schema)) })
export const QueryOutput$codec = lib.structCodec<QueryOutput>([['batch', lib.lazyCodec(() => QueryOutputBatchBox$codec)], ['remainingItems', lib.U64$codec], ['continueCursor', lib.Option$codec(lib.lazyCodec(() => ForwardCursor$codec))]])

export type QueryOutputBatchBox = { t: 'Domain', value: lib.Vec<Domain> } | { t: 'Account', value: lib.Vec<Account> } | { t: 'Asset', value: lib.Vec<Asset> } | { t: 'AssetDefinition', value: lib.Vec<AssetDefinition> } | { t: 'Role', value: lib.Vec<Role> } | { t: 'Parameter', value: lib.Vec<Parameter> } | { t: 'Permission', value: lib.Vec<Permission> } | { t: 'Transaction', value: lib.Vec<CommittedTransaction> } | { t: 'Peer', value: lib.Vec<PeerId> } | { t: 'RoleId', value: lib.Vec<RoleId> } | { t: 'TriggerId', value: lib.Vec<TriggerId> } | { t: 'Trigger', value: lib.Vec<Trigger> } | { t: 'Block', value: lib.Vec<SignedBlock> } | { t: 'BlockHeader', value: lib.Vec<BlockHeader> }
export const QueryOutputBatchBox = (input: z.input<typeof QueryOutputBatchBox$schema>): QueryOutputBatchBox => QueryOutputBatchBox$schema.parse(input)
type QueryOutputBatchBox$input = { t: 'Domain', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Domain$schema>>>> } | { t: 'Account', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Account$schema>>>> } | { t: 'Asset', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Asset$schema>>>> } | { t: 'AssetDefinition', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof AssetDefinition$schema>>>> } | { t: 'Role', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Role$schema>>>> } | { t: 'Parameter', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Parameter$schema>>>> } | { t: 'Permission', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Permission$schema>>>> } | { t: 'Transaction', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof CommittedTransaction$schema>>>> } | { t: 'Peer', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof PeerId$schema>>>> } | { t: 'RoleId', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof RoleId$schema>>>> } | { t: 'TriggerId', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof TriggerId$schema>>>> } | { t: 'Trigger', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof Trigger$schema>>>> } | { t: 'Block', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof SignedBlock$schema>>>> } | { t: 'BlockHeader', value: z.input<ReturnType<typeof lib.Vec$schema<z.ZodLazy<typeof BlockHeader$schema>>>> }
export const QueryOutputBatchBox$schema: z.ZodType<QueryOutputBatchBox, z.ZodTypeDef, QueryOutputBatchBox$input> = z.discriminatedUnion('t', [z.object({ t: z.literal('Domain'), value: lib.Vec$schema(z.lazy(() => Domain$schema)).removeDefault() }), z.object({ t: z.literal('Account'), value: lib.Vec$schema(z.lazy(() => Account$schema)).removeDefault() }), z.object({ t: z.literal('Asset'), value: lib.Vec$schema(z.lazy(() => Asset$schema)).removeDefault() }), z.object({ t: z.literal('AssetDefinition'), value: lib.Vec$schema(z.lazy(() => AssetDefinition$schema)).removeDefault() }), z.object({ t: z.literal('Role'), value: lib.Vec$schema(z.lazy(() => Role$schema)).removeDefault() }), z.object({ t: z.literal('Parameter'), value: lib.Vec$schema(z.lazy(() => Parameter$schema)).removeDefault() }), z.object({ t: z.literal('Permission'), value: lib.Vec$schema(z.lazy(() => Permission$schema)).removeDefault() }), z.object({ t: z.literal('Transaction'), value: lib.Vec$schema(z.lazy(() => CommittedTransaction$schema)).removeDefault() }), z.object({ t: z.literal('Peer'), value: lib.Vec$schema(z.lazy(() => PeerId$schema)).removeDefault() }), z.object({ t: z.literal('RoleId'), value: lib.Vec$schema(z.lazy(() => RoleId$schema)).removeDefault() }), z.object({ t: z.literal('TriggerId'), value: lib.Vec$schema(z.lazy(() => TriggerId$schema)).removeDefault() }), z.object({ t: z.literal('Trigger'), value: lib.Vec$schema(z.lazy(() => Trigger$schema)).removeDefault() }), z.object({ t: z.literal('Block'), value: lib.Vec$schema(z.lazy(() => SignedBlock$schema)).removeDefault() }), z.object({ t: z.literal('BlockHeader'), value: lib.Vec$schema(z.lazy(() => BlockHeader$schema)).removeDefault() })])
export const QueryOutputBatchBox$codec: lib.Codec<QueryOutputBatchBox> = lib.enumCodec<{ Domain: [lib.Vec<Domain>], Account: [lib.Vec<Account>], Asset: [lib.Vec<Asset>], AssetDefinition: [lib.Vec<AssetDefinition>], Role: [lib.Vec<Role>], Parameter: [lib.Vec<Parameter>], Permission: [lib.Vec<Permission>], Transaction: [lib.Vec<CommittedTransaction>], Peer: [lib.Vec<PeerId>], RoleId: [lib.Vec<RoleId>], TriggerId: [lib.Vec<TriggerId>], Trigger: [lib.Vec<Trigger>], Block: [lib.Vec<SignedBlock>], BlockHeader: [lib.Vec<BlockHeader>] }>([[0, 'Domain', lib.Vec$codec(lib.lazyCodec(() => Domain$codec))], [1, 'Account', lib.Vec$codec(lib.lazyCodec(() => Account$codec))], [2, 'Asset', lib.Vec$codec(lib.lazyCodec(() => Asset$codec))], [3, 'AssetDefinition', lib.Vec$codec(lib.lazyCodec(() => AssetDefinition$codec))], [4, 'Role', lib.Vec$codec(lib.lazyCodec(() => Role$codec))], [5, 'Parameter', lib.Vec$codec(lib.lazyCodec(() => Parameter$codec))], [6, 'Permission', lib.Vec$codec(lib.lazyCodec(() => Permission$codec))], [7, 'Transaction', lib.Vec$codec(lib.lazyCodec(() => CommittedTransaction$codec))], [8, 'Peer', lib.Vec$codec(lib.lazyCodec(() => PeerId$codec))], [9, 'RoleId', lib.Vec$codec(lib.lazyCodec(() => RoleId$codec))], [10, 'TriggerId', lib.Vec$codec(lib.lazyCodec(() => TriggerId$codec))], [11, 'Trigger', lib.Vec$codec(lib.lazyCodec(() => Trigger$codec))], [12, 'Block', lib.Vec$codec(lib.lazyCodec(() => SignedBlock$codec))], [13, 'BlockHeader', lib.Vec$codec(lib.lazyCodec(() => BlockHeader$codec))]]).discriminated()

export type QueryParams = z.infer<typeof QueryParams$schema>
export const QueryParams = (input: z.input<typeof QueryParams$schema>): QueryParams => QueryParams$schema.parse(input)
export const QueryParams$schema = z.object({ pagination: z.lazy(() => Pagination$schema), sorting: z.lazy(() => Sorting$schema), fetchSize: z.lazy(() => FetchSize$schema) }).default(() => ({}))
export const QueryParams$codec = lib.structCodec<QueryParams>([['pagination', lib.lazyCodec(() => Pagination$codec)], ['sorting', lib.lazyCodec(() => Sorting$codec)], ['fetchSize', lib.lazyCodec(() => FetchSize$codec)]])

export type QueryRequest = z.infer<typeof QueryRequest$schema>
export const QueryRequest = (input: z.input<typeof QueryRequest$schema>): QueryRequest => QueryRequest$schema.parse(input)
export const QueryRequest$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Singular'), value: z.lazy(() => SingularQueryBox$schema) }), z.object({ t: z.literal('Start'), value: z.lazy(() => QueryWithParams$schema) }), z.object({ t: z.literal('Continue'), value: z.lazy(() => ForwardCursor$schema) })])
export const QueryRequest$codec: lib.Codec<QueryRequest> = lib.enumCodec<{ Singular: [SingularQueryBox], Start: [QueryWithParams], Continue: [ForwardCursor] }>([[0, 'Singular', lib.lazyCodec(() => SingularQueryBox$codec)], [1, 'Start', lib.lazyCodec(() => QueryWithParams$codec)], [2, 'Continue', lib.lazyCodec(() => ForwardCursor$codec)]]).discriminated()

export type QueryRequestWithAuthority = z.infer<typeof QueryRequestWithAuthority$schema>
export const QueryRequestWithAuthority = (input: z.input<typeof QueryRequestWithAuthority$schema>): QueryRequestWithAuthority => QueryRequestWithAuthority$schema.parse(input)
export const QueryRequestWithAuthority$schema = z.object({ authority: lib.AccountId$schema, request: z.lazy(() => QueryRequest$schema) })
export const QueryRequestWithAuthority$codec = lib.structCodec<QueryRequestWithAuthority>([['authority', lib.AccountId$codec], ['request', lib.lazyCodec(() => QueryRequest$codec)]])

export type QueryResponse = z.infer<typeof QueryResponse$schema>
export const QueryResponse = (input: z.input<typeof QueryResponse$schema>): QueryResponse => QueryResponse$schema.parse(input)
export const QueryResponse$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Singular'), value: z.lazy(() => SingularQueryOutputBox$schema) }), z.object({ t: z.literal('Iterable'), value: z.lazy(() => QueryOutput$schema) })])
export const QueryResponse$codec: lib.Codec<QueryResponse> = lib.enumCodec<{ Singular: [SingularQueryOutputBox], Iterable: [QueryOutput] }>([[0, 'Singular', lib.lazyCodec(() => SingularQueryOutputBox$codec)], [1, 'Iterable', lib.lazyCodec(() => QueryOutput$codec)]]).discriminated()

export interface QueryWithFilter<T0, T1> { query: T0, predicate: lib.CompoundPredicate<T1> }
export const QueryWithFilter$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) => z.object({ query: t0, predicate: lib.CompoundPredicate$schema(t1) })
export const QueryWithFilter$codec = <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>) => lib.structCodec([['query', t0], ['predicate', lib.CompoundPredicate$codec(t1)]])

export type QueryWithParams = z.infer<typeof QueryWithParams$schema>
export const QueryWithParams = (input: z.input<typeof QueryWithParams$schema>): QueryWithParams => QueryWithParams$schema.parse(input)
export const QueryWithParams$schema = z.object({ query: z.lazy(() => QueryBox$schema), params: z.lazy(() => QueryParams$schema) })
export const QueryWithParams$codec = lib.structCodec<QueryWithParams>([['query', lib.lazyCodec(() => QueryBox$codec)], ['params', lib.lazyCodec(() => QueryParams$codec)]])

export type RawGenesisTransaction = z.infer<typeof RawGenesisTransaction$schema>
export const RawGenesisTransaction = (input: z.input<typeof RawGenesisTransaction$schema>): RawGenesisTransaction => RawGenesisTransaction$schema.parse(input)
export const RawGenesisTransaction$schema = z.object({ chain: z.lazy(() => ChainId$schema), executor: z.string(), parameters: lib.Option$schema(z.lazy(() => Parameters$schema)), instructions: lib.Vec$schema(z.lazy(() => InstructionBox$schema)), wasmDir: z.string(), wasmTriggers: lib.Vec$schema(z.lazy(() => GenesisWasmTrigger$schema)), topology: lib.Vec$schema(z.lazy(() => PeerId$schema)) })
export const RawGenesisTransaction$codec = lib.structCodec<RawGenesisTransaction>([['chain', lib.lazyCodec(() => ChainId$codec)], ['executor', lib.String$codec], ['parameters', lib.Option$codec(lib.lazyCodec(() => Parameters$codec))], ['instructions', lib.Vec$codec(lib.lazyCodec(() => InstructionBox$codec))], ['wasmDir', lib.String$codec], ['wasmTriggers', lib.Vec$codec(lib.lazyCodec(() => GenesisWasmTrigger$codec))], ['topology', lib.Vec$codec(lib.lazyCodec(() => PeerId$codec))]])

export interface Register<T0> { object: T0 }
export const Register$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Register$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['object', t0]])

export type RegisterBox = z.infer<typeof RegisterBox$schema>
export const RegisterBox = (input: z.input<typeof RegisterBox$schema>): RegisterBox => RegisterBox$schema.parse(input)
export const RegisterBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Peer'), value: z.lazy(() => Register$schema(z.lazy(() => PeerId$schema))) }), z.object({ t: z.literal('Domain'), value: z.lazy(() => Register$schema(z.lazy(() => NewDomain$schema))) }), z.object({ t: z.literal('Account'), value: z.lazy(() => Register$schema(z.lazy(() => NewAccount$schema))) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => Register$schema(z.lazy(() => NewAssetDefinition$schema))) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => Register$schema(z.lazy(() => Asset$schema))) }), z.object({ t: z.literal('Role'), value: z.lazy(() => Register$schema(z.lazy(() => Role$schema))) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => Register$schema(z.lazy(() => Trigger$schema))) })])
export const RegisterBox$codec: lib.Codec<RegisterBox> = lib.enumCodec<{ Peer: [Register<PeerId>], Domain: [Register<NewDomain>], Account: [Register<NewAccount>], AssetDefinition: [Register<NewAssetDefinition>], Asset: [Register<Asset>], Role: [Register<Role>], Trigger: [Register<Trigger>] }>([[0, 'Peer', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => PeerId$codec)))], [1, 'Domain', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => NewDomain$codec)))], [2, 'Account', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => NewAccount$codec)))], [3, 'AssetDefinition', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => NewAssetDefinition$codec)))], [4, 'Asset', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => Asset$codec)))], [5, 'Role', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => Role$codec)))], [6, 'Trigger', lib.lazyCodec(() => Register$codec(lib.lazyCodec(() => Trigger$codec)))]]).discriminated()

export interface RemoveKeyValue<T0> { object: T0, key: lib.String, value: lib.Json }
export const RemoveKeyValue$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0, key: z.string(), value: lib.Json$schema })
export const RemoveKeyValue$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['object', t0], ['key', lib.String$codec], ['value', lib.Json$codec]])

export type RemoveKeyValueBox = z.infer<typeof RemoveKeyValueBox$schema>
export const RemoveKeyValueBox = (input: z.input<typeof RemoveKeyValueBox$schema>): RemoveKeyValueBox => RemoveKeyValueBox$schema.parse(input)
export const RemoveKeyValueBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Domain'), value: z.lazy(() => RemoveKeyValue$schema(lib.DomainId$schema)) }), z.object({ t: z.literal('Account'), value: z.lazy(() => RemoveKeyValue$schema(lib.AccountId$schema)) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => RemoveKeyValue$schema(lib.AssetDefinitionId$schema)) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => RemoveKeyValue$schema(lib.AssetId$schema)) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => RemoveKeyValue$schema(z.lazy(() => TriggerId$schema))) })])
export const RemoveKeyValueBox$codec: lib.Codec<RemoveKeyValueBox> = lib.enumCodec<{ Domain: [RemoveKeyValue<lib.DomainId>], Account: [RemoveKeyValue<lib.AccountId>], AssetDefinition: [RemoveKeyValue<lib.AssetDefinitionId>], Asset: [RemoveKeyValue<lib.AssetId>], Trigger: [RemoveKeyValue<TriggerId>] }>([[0, 'Domain', lib.lazyCodec(() => RemoveKeyValue$codec(lib.DomainId$codec))], [1, 'Account', lib.lazyCodec(() => RemoveKeyValue$codec(lib.AccountId$codec))], [2, 'AssetDefinition', lib.lazyCodec(() => RemoveKeyValue$codec(lib.AssetDefinitionId$codec))], [3, 'Asset', lib.lazyCodec(() => RemoveKeyValue$codec(lib.AssetId$codec))], [4, 'Trigger', lib.lazyCodec(() => RemoveKeyValue$codec(lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type Repeats = z.infer<typeof Repeats$schema>
export const Repeats = (input: z.input<typeof Repeats$schema>): Repeats => Repeats$schema.parse(input)
export const Repeats$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Indefinitely') }), z.object({ t: z.literal('Exactly'), value: lib.U32$schema })])
export const Repeats$codec: lib.Codec<Repeats> = lib.enumCodec<{ Indefinitely: [], Exactly: [lib.U32] }>([[0, 'Indefinitely'], [1, 'Exactly', lib.U32$codec]]).discriminated()

export type RepetitionError = z.infer<typeof RepetitionError$schema>
export const RepetitionError = (input: z.input<typeof RepetitionError$schema>): RepetitionError => RepetitionError$schema.parse(input)
export const RepetitionError$schema = z.object({ instruction: z.lazy(() => InstructionType$schema), id: z.lazy(() => IdBox$schema) })
export const RepetitionError$codec = lib.structCodec<RepetitionError>([['instruction', lib.lazyCodec(() => InstructionType$codec)], ['id', lib.lazyCodec(() => IdBox$codec)]])

export interface Revoke<T0, T1> { object: T0, destination: T1 }
export const Revoke$schema = <T0 extends z.ZodType, T1 extends z.ZodType>(t0: T0, t1: T1) => z.object({ object: t0, destination: t1 })
export const Revoke$codec = <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>) => lib.structCodec([['object', t0], ['destination', t1]])

export type RevokeBox = z.infer<typeof RevokeBox$schema>
export const RevokeBox = (input: z.input<typeof RevokeBox$schema>): RevokeBox => RevokeBox$schema.parse(input)
export const RevokeBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Permission'), value: z.lazy(() => Revoke$schema(z.lazy(() => Permission$schema), lib.AccountId$schema)) }), z.object({ t: z.literal('Role'), value: z.lazy(() => Revoke$schema(z.lazy(() => RoleId$schema), lib.AccountId$schema)) }), z.object({ t: z.literal('RolePermission'), value: z.lazy(() => Revoke$schema(z.lazy(() => Permission$schema), z.lazy(() => RoleId$schema))) })])
export const RevokeBox$codec: lib.Codec<RevokeBox> = lib.enumCodec<{ Permission: [Revoke<Permission, lib.AccountId>], Role: [Revoke<RoleId, lib.AccountId>], RolePermission: [Revoke<Permission, RoleId>] }>([[0, 'Permission', lib.lazyCodec(() => Revoke$codec(lib.lazyCodec(() => Permission$codec), lib.AccountId$codec))], [1, 'Role', lib.lazyCodec(() => Revoke$codec(lib.lazyCodec(() => RoleId$codec), lib.AccountId$codec))], [2, 'RolePermission', lib.lazyCodec(() => Revoke$codec(lib.lazyCodec(() => Permission$codec), lib.lazyCodec(() => RoleId$codec)))]]).discriminated()

export type Role = z.infer<typeof Role$schema>
export const Role = (input: z.input<typeof Role$schema>): Role => Role$schema.parse(input)
export const Role$schema = z.object({ id: z.lazy(() => RoleId$schema), permissions: lib.Vec$schema(z.lazy(() => Permission$schema)) })
export const Role$codec = lib.structCodec<Role>([['id', lib.lazyCodec(() => RoleId$codec)], ['permissions', lib.Vec$codec(lib.lazyCodec(() => Permission$codec))]])

export type RoleEvent = z.infer<typeof RoleEvent$schema>
export const RoleEvent = (input: z.input<typeof RoleEvent$schema>): RoleEvent => RoleEvent$schema.parse(input)
export const RoleEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => Role$schema) }), z.object({ t: z.literal('Deleted'), value: z.lazy(() => RoleId$schema) }), z.object({ t: z.literal('PermissionAdded'), value: z.lazy(() => RolePermissionChanged$schema) }), z.object({ t: z.literal('PermissionRemoved'), value: z.lazy(() => RolePermissionChanged$schema) })])
export const RoleEvent$codec: lib.Codec<RoleEvent> = lib.enumCodec<{ Created: [Role], Deleted: [RoleId], PermissionAdded: [RolePermissionChanged], PermissionRemoved: [RolePermissionChanged] }>([[0, 'Created', lib.lazyCodec(() => Role$codec)], [1, 'Deleted', lib.lazyCodec(() => RoleId$codec)], [2, 'PermissionAdded', lib.lazyCodec(() => RolePermissionChanged$codec)], [3, 'PermissionRemoved', lib.lazyCodec(() => RolePermissionChanged$codec)]]).discriminated()

export type RoleEventFilter = z.infer<typeof RoleEventFilter$schema>
export const RoleEventFilter = (input: z.input<typeof RoleEventFilter$schema>): RoleEventFilter => RoleEventFilter$schema.parse(input)
export const RoleEventFilter$schema = z.object({ idMatcher: lib.Option$schema(z.lazy(() => RoleId$schema)), eventSet: z.lazy(() => RoleEventSet$schema) })
export const RoleEventFilter$codec = lib.structCodec<RoleEventFilter>([['idMatcher', lib.Option$codec(lib.lazyCodec(() => RoleId$codec))], ['eventSet', lib.lazyCodec(() => RoleEventSet$codec)]])

export type RoleEventSet = z.infer<typeof RoleEventSet$schema>
export const RoleEventSet = (input: z.input<typeof RoleEventSet$schema>): RoleEventSet => RoleEventSet$schema.parse(input)
const RoleEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('PermissionAdded'), z.literal('PermissionRemoved')])
export const RoleEventSet$schema = z.set(RoleEventSet$literalSchema).or(z.array(RoleEventSet$literalSchema).transform(arr => new Set(arr)))
export const RoleEventSet$codec = lib.bitmap<RoleEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, PermissionAdded: 4, PermissionRemoved: 8 })

export type RoleId = z.infer<typeof RoleId$schema>
export const RoleId = (input: z.input<typeof RoleId$schema>): RoleId => RoleId$schema.parse(input)
export const RoleId$schema = lib.Name$schema.brand<'RoleId'>()
export const RoleId$codec = lib.Name$codec as lib.Codec<RoleId>

export type RoleIdPredicateBox = z.infer<typeof RoleIdPredicateBox$schema>
export const RoleIdPredicateBox = (input: z.input<typeof RoleIdPredicateBox$schema>): RoleIdPredicateBox => RoleIdPredicateBox$schema.parse(input)
export const RoleIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: z.lazy(() => RoleId$schema) }), z.object({ t: z.literal('Name'), value: z.lazy(() => StringPredicateBox$schema) })])
export const RoleIdPredicateBox$codec: lib.Codec<RoleIdPredicateBox> = lib.enumCodec<{ Equals: [RoleId], Name: [StringPredicateBox] }>([[0, 'Equals', lib.lazyCodec(() => RoleId$codec)], [1, 'Name', lib.lazyCodec(() => StringPredicateBox$codec)]]).discriminated()

export type RolePermissionChanged = z.infer<typeof RolePermissionChanged$schema>
export const RolePermissionChanged = (input: z.input<typeof RolePermissionChanged$schema>): RolePermissionChanged => RolePermissionChanged$schema.parse(input)
export const RolePermissionChanged$schema = z.object({ role: z.lazy(() => RoleId$schema), permission: z.lazy(() => Permission$schema) })
export const RolePermissionChanged$codec = lib.structCodec<RolePermissionChanged>([['role', lib.lazyCodec(() => RoleId$codec)], ['permission', lib.lazyCodec(() => Permission$codec)]])

export type RolePredicateBox = z.infer<typeof RolePredicateBox$schema>
export const RolePredicateBox = (input: z.input<typeof RolePredicateBox$schema>): RolePredicateBox => RolePredicateBox$schema.parse(input)
export const RolePredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => RoleIdPredicateBox$schema) })])
export const RolePredicateBox$codec: lib.Codec<RolePredicateBox> = lib.enumCodec<{ Id: [RoleIdPredicateBox] }>([[0, 'Id', lib.lazyCodec(() => RoleIdPredicateBox$codec)]]).discriminated()

export type Schedule = z.infer<typeof Schedule$schema>
export const Schedule = (input: z.input<typeof Schedule$schema>): Schedule => Schedule$schema.parse(input)
export const Schedule$schema = z.object({ start: lib.Timestamp$schema, period: lib.Option$schema(lib.Duration$schema) })
export const Schedule$codec = lib.structCodec<Schedule>([['start', lib.Timestamp$codec], ['period', lib.Option$codec(lib.Duration$codec)]])

export interface SemiInterval<T0> { start: T0, limit: T0 }
export const SemiInterval$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ start: t0, limit: t0 })
export const SemiInterval$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['start', t0], ['limit', t0]])

export interface SetKeyValue<T0> { object: T0, key: lib.String, value: lib.Json }
export const SetKeyValue$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0, key: z.string(), value: lib.Json$schema })
export const SetKeyValue$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['object', t0], ['key', lib.String$codec], ['value', lib.Json$codec]])

export type SetKeyValueBox = z.infer<typeof SetKeyValueBox$schema>
export const SetKeyValueBox = (input: z.input<typeof SetKeyValueBox$schema>): SetKeyValueBox => SetKeyValueBox$schema.parse(input)
export const SetKeyValueBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Domain'), value: z.lazy(() => SetKeyValue$schema(lib.DomainId$schema)) }), z.object({ t: z.literal('Account'), value: z.lazy(() => SetKeyValue$schema(lib.AccountId$schema)) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => SetKeyValue$schema(lib.AssetDefinitionId$schema)) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => SetKeyValue$schema(lib.AssetId$schema)) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => SetKeyValue$schema(z.lazy(() => TriggerId$schema))) })])
export const SetKeyValueBox$codec: lib.Codec<SetKeyValueBox> = lib.enumCodec<{ Domain: [SetKeyValue<lib.DomainId>], Account: [SetKeyValue<lib.AccountId>], AssetDefinition: [SetKeyValue<lib.AssetDefinitionId>], Asset: [SetKeyValue<lib.AssetId>], Trigger: [SetKeyValue<TriggerId>] }>([[0, 'Domain', lib.lazyCodec(() => SetKeyValue$codec(lib.DomainId$codec))], [1, 'Account', lib.lazyCodec(() => SetKeyValue$codec(lib.AccountId$codec))], [2, 'AssetDefinition', lib.lazyCodec(() => SetKeyValue$codec(lib.AssetDefinitionId$codec))], [3, 'Asset', lib.lazyCodec(() => SetKeyValue$codec(lib.AssetId$codec))], [4, 'Trigger', lib.lazyCodec(() => SetKeyValue$codec(lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type SetParameter = Parameter
export const SetParameter = (input: z.input<typeof SetParameter$schema>): SetParameter => SetParameter$schema.parse(input)
export const SetParameter$schema = z.lazy(() => Parameter$schema)
export const SetParameter$codec = lib.lazyCodec(() => Parameter$codec)

export type SignedBlock = z.infer<typeof SignedBlock$schema>
export const SignedBlock = (input: z.input<typeof SignedBlock$schema>): SignedBlock => SignedBlock$schema.parse(input)
export const SignedBlock$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('V1'), value: z.lazy(() => SignedBlockV1$schema) })])
export const SignedBlock$codec: lib.Codec<SignedBlock> = lib.enumCodec<{ V1: [SignedBlockV1] }>([[1, 'V1', lib.lazyCodec(() => SignedBlockV1$codec)]]).discriminated()

export type SignedBlockPredicateBox = z.infer<typeof SignedBlockPredicateBox$schema>
export const SignedBlockPredicateBox = (input: z.input<typeof SignedBlockPredicateBox$schema>): SignedBlockPredicateBox => SignedBlockPredicateBox$schema.parse(input)
export const SignedBlockPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Header'), value: z.lazy(() => BlockHeaderPredicateBox$schema) })])
export const SignedBlockPredicateBox$codec: lib.Codec<SignedBlockPredicateBox> = lib.enumCodec<{ Header: [BlockHeaderPredicateBox] }>([[0, 'Header', lib.lazyCodec(() => BlockHeaderPredicateBox$codec)]]).discriminated()

export type SignedBlockV1 = z.infer<typeof SignedBlockV1$schema>
export const SignedBlockV1 = (input: z.input<typeof SignedBlockV1$schema>): SignedBlockV1 => SignedBlockV1$schema.parse(input)
export const SignedBlockV1$schema = z.object({ signatures: lib.Vec$schema(z.lazy(() => BlockSignature$schema)), payload: z.lazy(() => BlockPayload$schema), errors: lib.Map$schema(lib.U64$schema, z.lazy(() => TransactionRejectionReason$schema)) })
export const SignedBlockV1$codec = lib.structCodec<SignedBlockV1>([['signatures', lib.Vec$codec(lib.lazyCodec(() => BlockSignature$codec))], ['payload', lib.lazyCodec(() => BlockPayload$codec)], ['errors', lib.Map$codec(lib.U64$codec, lib.lazyCodec(() => TransactionRejectionReason$codec))]])

export type SignedQuery = z.infer<typeof SignedQuery$schema>
export const SignedQuery = (input: z.input<typeof SignedQuery$schema>): SignedQuery => SignedQuery$schema.parse(input)
export const SignedQuery$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('V1'), value: z.lazy(() => SignedQueryV1$schema) })])
export const SignedQuery$codec: lib.Codec<SignedQuery> = lib.enumCodec<{ V1: [SignedQueryV1] }>([[1, 'V1', lib.lazyCodec(() => SignedQueryV1$codec)]]).discriminated()

export type SignedQueryV1 = z.infer<typeof SignedQueryV1$schema>
export const SignedQueryV1 = (input: z.input<typeof SignedQueryV1$schema>): SignedQueryV1 => SignedQueryV1$schema.parse(input)
export const SignedQueryV1$schema = z.object({ signature: lib.Signature$schema, payload: z.lazy(() => QueryRequestWithAuthority$schema) })
export const SignedQueryV1$codec = lib.structCodec<SignedQueryV1>([['signature', lib.Signature$codec], ['payload', lib.lazyCodec(() => QueryRequestWithAuthority$codec)]])

export type SignedTransaction = z.infer<typeof SignedTransaction$schema>
export const SignedTransaction = (input: z.input<typeof SignedTransaction$schema>): SignedTransaction => SignedTransaction$schema.parse(input)
export const SignedTransaction$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('V1'), value: z.lazy(() => SignedTransactionV1$schema) })])
export const SignedTransaction$codec: lib.Codec<SignedTransaction> = lib.enumCodec<{ V1: [SignedTransactionV1] }>([[1, 'V1', lib.lazyCodec(() => SignedTransactionV1$codec)]]).discriminated()

export type SignedTransactionPredicateBox = z.infer<typeof SignedTransactionPredicateBox$schema>
export const SignedTransactionPredicateBox = (input: z.input<typeof SignedTransactionPredicateBox$schema>): SignedTransactionPredicateBox => SignedTransactionPredicateBox$schema.parse(input)
export const SignedTransactionPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Hash'), value: z.lazy(() => TransactionHashPredicateBox$schema) }), z.object({ t: z.literal('Authority'), value: z.lazy(() => AccountIdPredicateBox$schema) })])
export const SignedTransactionPredicateBox$codec: lib.Codec<SignedTransactionPredicateBox> = lib.enumCodec<{ Hash: [TransactionHashPredicateBox], Authority: [AccountIdPredicateBox] }>([[0, 'Hash', lib.lazyCodec(() => TransactionHashPredicateBox$codec)], [1, 'Authority', lib.lazyCodec(() => AccountIdPredicateBox$codec)]]).discriminated()

export type SignedTransactionV1 = z.infer<typeof SignedTransactionV1$schema>
export const SignedTransactionV1 = (input: z.input<typeof SignedTransactionV1$schema>): SignedTransactionV1 => SignedTransactionV1$schema.parse(input)
export const SignedTransactionV1$schema = z.object({ signature: lib.Signature$schema, payload: z.lazy(() => TransactionPayload$schema) })
export const SignedTransactionV1$codec = lib.structCodec<SignedTransactionV1>([['signature', lib.Signature$codec], ['payload', lib.lazyCodec(() => TransactionPayload$codec)]])

export type SingularQueryBox = z.infer<typeof SingularQueryBox$schema>
export const SingularQueryBox = (input: z.input<typeof SingularQueryBox$schema>): SingularQueryBox => SingularQueryBox$schema.parse(input)
export const SingularQueryBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('FindAssetQuantityById'), value: z.lazy(() => FindAssetQuantityById$schema) }), z.object({ t: z.literal('FindExecutorDataModel') }), z.object({ t: z.literal('FindParameters') }), z.object({ t: z.literal('FindDomainMetadata'), value: z.lazy(() => FindDomainMetadata$schema) }), z.object({ t: z.literal('FindAccountMetadata'), value: z.lazy(() => FindAccountMetadata$schema) }), z.object({ t: z.literal('FindAssetMetadata'), value: z.lazy(() => FindAssetMetadata$schema) }), z.object({ t: z.literal('FindAssetDefinitionMetadata'), value: z.lazy(() => FindAssetDefinitionMetadata$schema) }), z.object({ t: z.literal('FindTriggerMetadata'), value: z.lazy(() => FindTriggerMetadata$schema) })])
export const SingularQueryBox$codec: lib.Codec<SingularQueryBox> = lib.enumCodec<{ FindAssetQuantityById: [FindAssetQuantityById], FindExecutorDataModel: [], FindParameters: [], FindDomainMetadata: [FindDomainMetadata], FindAccountMetadata: [FindAccountMetadata], FindAssetMetadata: [FindAssetMetadata], FindAssetDefinitionMetadata: [FindAssetDefinitionMetadata], FindTriggerMetadata: [FindTriggerMetadata] }>([[0, 'FindAssetQuantityById', lib.lazyCodec(() => FindAssetQuantityById$codec)], [1, 'FindExecutorDataModel'], [2, 'FindParameters'], [3, 'FindDomainMetadata', lib.lazyCodec(() => FindDomainMetadata$codec)], [4, 'FindAccountMetadata', lib.lazyCodec(() => FindAccountMetadata$codec)], [5, 'FindAssetMetadata', lib.lazyCodec(() => FindAssetMetadata$codec)], [6, 'FindAssetDefinitionMetadata', lib.lazyCodec(() => FindAssetDefinitionMetadata$codec)], [7, 'FindTriggerMetadata', lib.lazyCodec(() => FindTriggerMetadata$codec)]]).discriminated()

export type SingularQueryOutputBox = { t: 'Numeric', value: Numeric } | { t: 'ExecutorDataModel', value: ExecutorDataModel } | { t: 'Json', value: lib.Json } | { t: 'Trigger', value: Trigger } | { t: 'Parameters', value: Parameters } | { t: 'Transaction', value: CommittedTransaction } | { t: 'BlockHeader', value: BlockHeader }
export const SingularQueryOutputBox = (input: z.input<typeof SingularQueryOutputBox$schema>): SingularQueryOutputBox => SingularQueryOutputBox$schema.parse(input)
type SingularQueryOutputBox$input = { t: 'Numeric', value: z.input<z.ZodLazy<typeof Numeric$schema>> } | { t: 'ExecutorDataModel', value: z.input<z.ZodLazy<typeof ExecutorDataModel$schema>> } | { t: 'Json', value: z.input<typeof lib.Json$schema> } | { t: 'Trigger', value: z.input<z.ZodLazy<typeof Trigger$schema>> } | { t: 'Parameters', value: z.input<z.ZodLazy<typeof Parameters$schema>> } | { t: 'Transaction', value: z.input<z.ZodLazy<typeof CommittedTransaction$schema>> } | { t: 'BlockHeader', value: z.input<z.ZodLazy<typeof BlockHeader$schema>> }
export const SingularQueryOutputBox$schema: z.ZodType<SingularQueryOutputBox, z.ZodTypeDef, SingularQueryOutputBox$input> = z.discriminatedUnion('t', [z.object({ t: z.literal('Numeric'), value: z.lazy(() => Numeric$schema) }), z.object({ t: z.literal('ExecutorDataModel'), value: z.lazy(() => ExecutorDataModel$schema) }), z.object({ t: z.literal('Json'), value: lib.Json$schema }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => Trigger$schema) }), z.object({ t: z.literal('Parameters'), value: z.lazy(() => Parameters$schema) }), z.object({ t: z.literal('Transaction'), value: z.lazy(() => CommittedTransaction$schema) }), z.object({ t: z.literal('BlockHeader'), value: z.lazy(() => BlockHeader$schema) })])
export const SingularQueryOutputBox$codec: lib.Codec<SingularQueryOutputBox> = lib.enumCodec<{ Numeric: [Numeric], ExecutorDataModel: [ExecutorDataModel], Json: [lib.Json], Trigger: [Trigger], Parameters: [Parameters], Transaction: [CommittedTransaction], BlockHeader: [BlockHeader] }>([[0, 'Numeric', lib.lazyCodec(() => Numeric$codec)], [1, 'ExecutorDataModel', lib.lazyCodec(() => ExecutorDataModel$codec)], [2, 'Json', lib.Json$codec], [3, 'Trigger', lib.lazyCodec(() => Trigger$codec)], [4, 'Parameters', lib.lazyCodec(() => Parameters$codec)], [5, 'Transaction', lib.lazyCodec(() => CommittedTransaction$codec)], [6, 'BlockHeader', lib.lazyCodec(() => BlockHeader$codec)]]).discriminated()

export type SmartContractParameter = z.infer<typeof SmartContractParameter$schema>
export const SmartContractParameter = (input: z.input<typeof SmartContractParameter$schema>): SmartContractParameter => SmartContractParameter$schema.parse(input)
export const SmartContractParameter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Fuel'), value: lib.NonZero$schema(lib.U64$schema) }), z.object({ t: z.literal('Memory'), value: lib.NonZero$schema(lib.U64$schema) })])
export const SmartContractParameter$codec: lib.Codec<SmartContractParameter> = lib.enumCodec<{ Fuel: [lib.NonZero<lib.U64>], Memory: [lib.NonZero<lib.U64>] }>([[0, 'Fuel', lib.NonZero$codec(lib.U64$codec)], [1, 'Memory', lib.NonZero$codec(lib.U64$codec)]]).discriminated()

export type SmartContractParameters = z.infer<typeof SmartContractParameters$schema>
export const SmartContractParameters = (input: z.input<typeof SmartContractParameters$schema>): SmartContractParameters => SmartContractParameters$schema.parse(input)
export const SmartContractParameters$schema = z.object({ fuel: lib.NonZero$schema(lib.U64$schema), memory: lib.NonZero$schema(lib.U64$schema) })
export const SmartContractParameters$codec = lib.structCodec<SmartContractParameters>([['fuel', lib.NonZero$codec(lib.U64$codec)], ['memory', lib.NonZero$codec(lib.U64$codec)]])

export type Sorting = z.infer<typeof Sorting$schema>
export const Sorting = (input: z.input<typeof Sorting$schema>): Sorting => Sorting$schema.parse(input)
export const Sorting$schema = z.object({ sortByMetadataKey: lib.Option$schema(lib.Name$schema) }).default(() => ({}))
export const Sorting$codec = lib.structCodec<Sorting>([['sortByMetadataKey', lib.Option$codec(lib.Name$codec)]])

export type StringPredicateBox = z.infer<typeof StringPredicateBox$schema>
export const StringPredicateBox = (input: z.input<typeof StringPredicateBox$schema>): StringPredicateBox => StringPredicateBox$schema.parse(input)
export const StringPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: z.string() }), z.object({ t: z.literal('Contains'), value: z.string() }), z.object({ t: z.literal('StartsWith'), value: z.string() }), z.object({ t: z.literal('EndsWith'), value: z.string() })])
export const StringPredicateBox$codec: lib.Codec<StringPredicateBox> = lib.enumCodec<{ Equals: [lib.String], Contains: [lib.String], StartsWith: [lib.String], EndsWith: [lib.String] }>([[0, 'Equals', lib.String$codec], [1, 'Contains', lib.String$codec], [2, 'StartsWith', lib.String$codec], [3, 'EndsWith', lib.String$codec]]).discriminated()

export type SumeragiParameter = z.infer<typeof SumeragiParameter$schema>
export const SumeragiParameter = (input: z.input<typeof SumeragiParameter$schema>): SumeragiParameter => SumeragiParameter$schema.parse(input)
export const SumeragiParameter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('BlockTime'), value: lib.Duration$schema }), z.object({ t: z.literal('CommitTime'), value: lib.Duration$schema }), z.object({ t: z.literal('MaxClockDriftMs'), value: lib.U64$schema })])
export const SumeragiParameter$codec: lib.Codec<SumeragiParameter> = lib.enumCodec<{ BlockTime: [lib.Duration], CommitTime: [lib.Duration], MaxClockDriftMs: [lib.U64] }>([[0, 'BlockTime', lib.Duration$codec], [1, 'CommitTime', lib.Duration$codec], [2, 'MaxClockDriftMs', lib.U64$codec]]).discriminated()

export type SumeragiParameters = z.infer<typeof SumeragiParameters$schema>
export const SumeragiParameters = (input: z.input<typeof SumeragiParameters$schema>): SumeragiParameters => SumeragiParameters$schema.parse(input)
export const SumeragiParameters$schema = z.object({ blockTime: lib.Duration$schema, commitTime: lib.Duration$schema, maxClockDriftMs: lib.U64$schema })
export const SumeragiParameters$codec = lib.structCodec<SumeragiParameters>([['blockTime', lib.Duration$codec], ['commitTime', lib.Duration$codec], ['maxClockDriftMs', lib.U64$codec]])

export type TimeEvent = z.infer<typeof TimeEvent$schema>
export const TimeEvent = (input: z.input<typeof TimeEvent$schema>): TimeEvent => TimeEvent$schema.parse(input)
export const TimeEvent$schema = z.object({ interval: z.lazy(() => TimeInterval$schema) })
export const TimeEvent$codec = lib.structCodec<TimeEvent>([['interval', lib.lazyCodec(() => TimeInterval$codec)]])

export type TimeInterval = z.infer<typeof TimeInterval$schema>
export const TimeInterval = (input: z.input<typeof TimeInterval$schema>): TimeInterval => TimeInterval$schema.parse(input)
export const TimeInterval$schema = z.object({ since: lib.Timestamp$schema, length: lib.Duration$schema })
export const TimeInterval$codec = lib.structCodec<TimeInterval>([['since', lib.Timestamp$codec], ['length', lib.Duration$codec]])

export type TransactionErrorPredicateBox = z.infer<typeof TransactionErrorPredicateBox$schema>
export const TransactionErrorPredicateBox = (input: z.input<typeof TransactionErrorPredicateBox$schema>): TransactionErrorPredicateBox => TransactionErrorPredicateBox$schema.parse(input)
export const TransactionErrorPredicateBox$schema = z.literal('IsSome')
export const TransactionErrorPredicateBox$codec: lib.Codec<TransactionErrorPredicateBox> = lib.enumCodec<{ IsSome: [] }>([[0, 'IsSome']]).literalUnion()

export type TransactionEvent = z.infer<typeof TransactionEvent$schema>
export const TransactionEvent = (input: z.input<typeof TransactionEvent$schema>): TransactionEvent => TransactionEvent$schema.parse(input)
export const TransactionEvent$schema = z.object({ hash: lib.Hash$schema, blockHeight: lib.Option$schema(lib.NonZero$schema(lib.U64$schema)), status: z.lazy(() => TransactionStatus$schema) })
export const TransactionEvent$codec = lib.structCodec<TransactionEvent>([['hash', lib.Hash$codec], ['blockHeight', lib.Option$codec(lib.NonZero$codec(lib.U64$codec))], ['status', lib.lazyCodec(() => TransactionStatus$codec)]])

export type TransactionEventFilter = z.infer<typeof TransactionEventFilter$schema>
export const TransactionEventFilter = (input: z.input<typeof TransactionEventFilter$schema>): TransactionEventFilter => TransactionEventFilter$schema.parse(input)
export const TransactionEventFilter$schema = z.object({ hash: lib.Option$schema(lib.Hash$schema), blockHeight: lib.Option$schema(lib.Option$schema(lib.NonZero$schema(lib.U64$schema))), status: lib.Option$schema(z.lazy(() => TransactionStatus$schema)) })
export const TransactionEventFilter$codec = lib.structCodec<TransactionEventFilter>([['hash', lib.Option$codec(lib.Hash$codec)], ['blockHeight', lib.Option$codec(lib.Option$codec(lib.NonZero$codec(lib.U64$codec)))], ['status', lib.Option$codec(lib.lazyCodec(() => TransactionStatus$codec))]])

export type TransactionHashPredicateBox = z.infer<typeof TransactionHashPredicateBox$schema>
export const TransactionHashPredicateBox = (input: z.input<typeof TransactionHashPredicateBox$schema>): TransactionHashPredicateBox => TransactionHashPredicateBox$schema.parse(input)
export const TransactionHashPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: lib.Hash$schema })])
export const TransactionHashPredicateBox$codec: lib.Codec<TransactionHashPredicateBox> = lib.enumCodec<{ Equals: [lib.Hash] }>([[0, 'Equals', lib.Hash$codec]]).discriminated()

export type TransactionLimitError = z.infer<typeof TransactionLimitError$schema>
export const TransactionLimitError = (input: z.input<typeof TransactionLimitError$schema>): TransactionLimitError => TransactionLimitError$schema.parse(input)
export const TransactionLimitError$schema = z.object({ reason: z.string() })
export const TransactionLimitError$codec = lib.structCodec<TransactionLimitError>([['reason', lib.String$codec]])

export type TransactionParameter = z.infer<typeof TransactionParameter$schema>
export const TransactionParameter = (input: z.input<typeof TransactionParameter$schema>): TransactionParameter => TransactionParameter$schema.parse(input)
export const TransactionParameter$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('MaxInstructions'), value: lib.NonZero$schema(lib.U64$schema) }), z.object({ t: z.literal('SmartContractSize'), value: lib.NonZero$schema(lib.U64$schema) })])
export const TransactionParameter$codec: lib.Codec<TransactionParameter> = lib.enumCodec<{ MaxInstructions: [lib.NonZero<lib.U64>], SmartContractSize: [lib.NonZero<lib.U64>] }>([[0, 'MaxInstructions', lib.NonZero$codec(lib.U64$codec)], [1, 'SmartContractSize', lib.NonZero$codec(lib.U64$codec)]]).discriminated()

export type TransactionParameters = z.infer<typeof TransactionParameters$schema>
export const TransactionParameters = (input: z.input<typeof TransactionParameters$schema>): TransactionParameters => TransactionParameters$schema.parse(input)
export const TransactionParameters$schema = z.object({ maxInstructions: lib.NonZero$schema(lib.U64$schema), smartContractSize: lib.NonZero$schema(lib.U64$schema) })
export const TransactionParameters$codec = lib.structCodec<TransactionParameters>([['maxInstructions', lib.NonZero$codec(lib.U64$codec)], ['smartContractSize', lib.NonZero$codec(lib.U64$codec)]])

export type TransactionPayload = z.infer<typeof TransactionPayload$schema>
export const TransactionPayload = (input: z.input<typeof TransactionPayload$schema>): TransactionPayload => TransactionPayload$schema.parse(input)
export const TransactionPayload$schema = z.object({ chain: z.lazy(() => ChainId$schema), authority: lib.AccountId$schema, creationTime: lib.Timestamp$schema.default(() => new Date()), instructions: z.lazy(() => Executable$schema), timeToLive: lib.Option$schema(lib.NonZero$schema(lib.Duration$schema)), nonce: lib.Option$schema(lib.NonZero$schema(lib.U32$schema)), metadata: z.lazy(() => Metadata$schema) })
export const TransactionPayload$codec = lib.structCodec<TransactionPayload>([['chain', lib.lazyCodec(() => ChainId$codec)], ['authority', lib.AccountId$codec], ['creationTime', lib.Timestamp$codec], ['instructions', lib.lazyCodec(() => Executable$codec)], ['timeToLive', lib.Option$codec(lib.NonZero$codec(lib.Duration$codec))], ['nonce', lib.Option$codec(lib.NonZero$codec(lib.U32$codec))], ['metadata', lib.lazyCodec(() => Metadata$codec)]])

export type TransactionRejectionReason = z.infer<typeof TransactionRejectionReason$schema>
export const TransactionRejectionReason = (input: z.input<typeof TransactionRejectionReason$schema>): TransactionRejectionReason => TransactionRejectionReason$schema.parse(input)
export const TransactionRejectionReason$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('AccountDoesNotExist'), value: z.lazy(() => FindError$schema) }), z.object({ t: z.literal('LimitCheck'), value: z.lazy(() => TransactionLimitError$schema) }), z.object({ t: z.literal('Validation'), value: z.lazy(() => ValidationFail$schema) }), z.object({ t: z.literal('InstructionExecution'), value: z.lazy(() => InstructionExecutionFail$schema) }), z.object({ t: z.literal('WasmExecution'), value: z.lazy(() => WasmExecutionFail$schema) })])
export const TransactionRejectionReason$codec: lib.Codec<TransactionRejectionReason> = lib.enumCodec<{ AccountDoesNotExist: [FindError], LimitCheck: [TransactionLimitError], Validation: [ValidationFail], InstructionExecution: [InstructionExecutionFail], WasmExecution: [WasmExecutionFail] }>([[0, 'AccountDoesNotExist', lib.lazyCodec(() => FindError$codec)], [1, 'LimitCheck', lib.lazyCodec(() => TransactionLimitError$codec)], [2, 'Validation', lib.lazyCodec(() => ValidationFail$codec)], [3, 'InstructionExecution', lib.lazyCodec(() => InstructionExecutionFail$codec)], [4, 'WasmExecution', lib.lazyCodec(() => WasmExecutionFail$codec)]]).discriminated()

export type TransactionStatus = z.infer<typeof TransactionStatus$schema>
export const TransactionStatus = (input: z.input<typeof TransactionStatus$schema>): TransactionStatus => TransactionStatus$schema.parse(input)
export const TransactionStatus$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Queued') }), z.object({ t: z.literal('Expired') }), z.object({ t: z.literal('Approved') }), z.object({ t: z.literal('Rejected'), value: z.lazy(() => TransactionRejectionReason$schema) })])
export const TransactionStatus$codec: lib.Codec<TransactionStatus> = lib.enumCodec<{ Queued: [], Expired: [], Approved: [], Rejected: [TransactionRejectionReason] }>([[0, 'Queued'], [1, 'Expired'], [2, 'Approved'], [3, 'Rejected', lib.lazyCodec(() => TransactionRejectionReason$codec)]]).discriminated()

export interface Transfer<T0, T1, T2> { source: T0, object: T1, destination: T2 }
export const Transfer$schema = <T0 extends z.ZodType, T1 extends z.ZodType, T2 extends z.ZodType>(t0: T0, t1: T1, t2: T2) => z.object({ source: t0, object: t1, destination: t2 })
export const Transfer$codec = <T0, T1, T2>(t0: lib.Codec<T0>, t1: lib.Codec<T1>, t2: lib.Codec<T2>) => lib.structCodec([['source', t0], ['object', t1], ['destination', t2]])

export type TransferBox = z.infer<typeof TransferBox$schema>
export const TransferBox = (input: z.input<typeof TransferBox$schema>): TransferBox => TransferBox$schema.parse(input)
export const TransferBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Domain'), value: z.lazy(() => Transfer$schema(lib.AccountId$schema, lib.DomainId$schema, lib.AccountId$schema)) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => Transfer$schema(lib.AccountId$schema, lib.AssetDefinitionId$schema, lib.AccountId$schema)) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => AssetTransferBox$schema) })])
export const TransferBox$codec: lib.Codec<TransferBox> = lib.enumCodec<{ Domain: [Transfer<lib.AccountId, lib.DomainId, lib.AccountId>], AssetDefinition: [Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>], Asset: [AssetTransferBox] }>([[0, 'Domain', lib.lazyCodec(() => Transfer$codec(lib.AccountId$codec, lib.DomainId$codec, lib.AccountId$codec))], [1, 'AssetDefinition', lib.lazyCodec(() => Transfer$codec(lib.AccountId$codec, lib.AssetDefinitionId$codec, lib.AccountId$codec))], [2, 'Asset', lib.lazyCodec(() => AssetTransferBox$codec)]]).discriminated()

export type Trigger = z.infer<typeof Trigger$schema>
export const Trigger = (input: z.input<typeof Trigger$schema>): Trigger => Trigger$schema.parse(input)
export const Trigger$schema = z.object({ id: z.lazy(() => TriggerId$schema), action: z.lazy(() => Action$schema) })
export const Trigger$codec = lib.structCodec<Trigger>([['id', lib.lazyCodec(() => TriggerId$codec)], ['action', lib.lazyCodec(() => Action$codec)]])

export type TriggerCompletedEvent = z.infer<typeof TriggerCompletedEvent$schema>
export const TriggerCompletedEvent = (input: z.input<typeof TriggerCompletedEvent$schema>): TriggerCompletedEvent => TriggerCompletedEvent$schema.parse(input)
export const TriggerCompletedEvent$schema = z.object({ triggerId: z.lazy(() => TriggerId$schema), outcome: z.lazy(() => TriggerCompletedOutcome$schema) })
export const TriggerCompletedEvent$codec = lib.structCodec<TriggerCompletedEvent>([['triggerId', lib.lazyCodec(() => TriggerId$codec)], ['outcome', lib.lazyCodec(() => TriggerCompletedOutcome$codec)]])

export type TriggerCompletedEventFilter = z.infer<typeof TriggerCompletedEventFilter$schema>
export const TriggerCompletedEventFilter = (input: z.input<typeof TriggerCompletedEventFilter$schema>): TriggerCompletedEventFilter => TriggerCompletedEventFilter$schema.parse(input)
export const TriggerCompletedEventFilter$schema = z.object({ triggerId: lib.Option$schema(z.lazy(() => TriggerId$schema)), outcomeType: lib.Option$schema(z.lazy(() => TriggerCompletedOutcomeType$schema)) })
export const TriggerCompletedEventFilter$codec = lib.structCodec<TriggerCompletedEventFilter>([['triggerId', lib.Option$codec(lib.lazyCodec(() => TriggerId$codec))], ['outcomeType', lib.Option$codec(lib.lazyCodec(() => TriggerCompletedOutcomeType$codec))]])

export type TriggerCompletedOutcome = z.infer<typeof TriggerCompletedOutcome$schema>
export const TriggerCompletedOutcome = (input: z.input<typeof TriggerCompletedOutcome$schema>): TriggerCompletedOutcome => TriggerCompletedOutcome$schema.parse(input)
export const TriggerCompletedOutcome$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Success') }), z.object({ t: z.literal('Failure'), value: z.string() })])
export const TriggerCompletedOutcome$codec: lib.Codec<TriggerCompletedOutcome> = lib.enumCodec<{ Success: [], Failure: [lib.String] }>([[0, 'Success'], [1, 'Failure', lib.String$codec]]).discriminated()

export type TriggerCompletedOutcomeType = z.infer<typeof TriggerCompletedOutcomeType$schema>
export const TriggerCompletedOutcomeType = (input: z.input<typeof TriggerCompletedOutcomeType$schema>): TriggerCompletedOutcomeType => TriggerCompletedOutcomeType$schema.parse(input)
export const TriggerCompletedOutcomeType$schema = z.union([z.literal('Success'), z.literal('Failure')])
export const TriggerCompletedOutcomeType$codec: lib.Codec<TriggerCompletedOutcomeType> = lib.enumCodec<{ Success: [], Failure: [] }>([[0, 'Success'], [1, 'Failure']]).literalUnion()

export type TriggerEvent = z.infer<typeof TriggerEvent$schema>
export const TriggerEvent = (input: z.input<typeof TriggerEvent$schema>): TriggerEvent => TriggerEvent$schema.parse(input)
export const TriggerEvent$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Created'), value: z.lazy(() => TriggerId$schema) }), z.object({ t: z.literal('Deleted'), value: z.lazy(() => TriggerId$schema) }), z.object({ t: z.literal('Extended'), value: z.lazy(() => TriggerNumberOfExecutionsChanged$schema) }), z.object({ t: z.literal('Shortened'), value: z.lazy(() => TriggerNumberOfExecutionsChanged$schema) }), z.object({ t: z.literal('MetadataInserted'), value: z.lazy(() => MetadataChanged$schema(z.lazy(() => TriggerId$schema))) }), z.object({ t: z.literal('MetadataRemoved'), value: z.lazy(() => MetadataChanged$schema(z.lazy(() => TriggerId$schema))) })])
export const TriggerEvent$codec: lib.Codec<TriggerEvent> = lib.enumCodec<{ Created: [TriggerId], Deleted: [TriggerId], Extended: [TriggerNumberOfExecutionsChanged], Shortened: [TriggerNumberOfExecutionsChanged], MetadataInserted: [MetadataChanged<TriggerId>], MetadataRemoved: [MetadataChanged<TriggerId>] }>([[0, 'Created', lib.lazyCodec(() => TriggerId$codec)], [1, 'Deleted', lib.lazyCodec(() => TriggerId$codec)], [2, 'Extended', lib.lazyCodec(() => TriggerNumberOfExecutionsChanged$codec)], [3, 'Shortened', lib.lazyCodec(() => TriggerNumberOfExecutionsChanged$codec)], [4, 'MetadataInserted', lib.lazyCodec(() => MetadataChanged$codec(lib.lazyCodec(() => TriggerId$codec)))], [5, 'MetadataRemoved', lib.lazyCodec(() => MetadataChanged$codec(lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type TriggerEventFilter = z.infer<typeof TriggerEventFilter$schema>
export const TriggerEventFilter = (input: z.input<typeof TriggerEventFilter$schema>): TriggerEventFilter => TriggerEventFilter$schema.parse(input)
export const TriggerEventFilter$schema = z.object({ idMatcher: lib.Option$schema(z.lazy(() => TriggerId$schema)), eventSet: z.lazy(() => TriggerEventSet$schema) })
export const TriggerEventFilter$codec = lib.structCodec<TriggerEventFilter>([['idMatcher', lib.Option$codec(lib.lazyCodec(() => TriggerId$codec))], ['eventSet', lib.lazyCodec(() => TriggerEventSet$codec)]])

export type TriggerEventSet = z.infer<typeof TriggerEventSet$schema>
export const TriggerEventSet = (input: z.input<typeof TriggerEventSet$schema>): TriggerEventSet => TriggerEventSet$schema.parse(input)
const TriggerEventSet$literalSchema = z.union([z.literal('Created'), z.literal('Deleted'), z.literal('Extended'), z.literal('Shortened'), z.literal('MetadataInserted'), z.literal('MetadataRemoved')])
export const TriggerEventSet$schema = z.set(TriggerEventSet$literalSchema).or(z.array(TriggerEventSet$literalSchema).transform(arr => new Set(arr)))
export const TriggerEventSet$codec = lib.bitmap<TriggerEventSet extends Set<infer T> ? T : never>({ Created: 1, Deleted: 2, Extended: 4, Shortened: 8, MetadataInserted: 16, MetadataRemoved: 32 })

export type TriggerId = z.infer<typeof TriggerId$schema>
export const TriggerId = (input: z.input<typeof TriggerId$schema>): TriggerId => TriggerId$schema.parse(input)
export const TriggerId$schema = lib.Name$schema.brand<'TriggerId'>()
export const TriggerId$codec = lib.Name$codec as lib.Codec<TriggerId>

export type TriggerIdPredicateBox = z.infer<typeof TriggerIdPredicateBox$schema>
export const TriggerIdPredicateBox = (input: z.input<typeof TriggerIdPredicateBox$schema>): TriggerIdPredicateBox => TriggerIdPredicateBox$schema.parse(input)
export const TriggerIdPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Equals'), value: z.lazy(() => TriggerId$schema) }), z.object({ t: z.literal('Name'), value: z.lazy(() => StringPredicateBox$schema) })])
export const TriggerIdPredicateBox$codec: lib.Codec<TriggerIdPredicateBox> = lib.enumCodec<{ Equals: [TriggerId], Name: [StringPredicateBox] }>([[0, 'Equals', lib.lazyCodec(() => TriggerId$codec)], [1, 'Name', lib.lazyCodec(() => StringPredicateBox$codec)]]).discriminated()

export type TriggerNumberOfExecutionsChanged = z.infer<typeof TriggerNumberOfExecutionsChanged$schema>
export const TriggerNumberOfExecutionsChanged = (input: z.input<typeof TriggerNumberOfExecutionsChanged$schema>): TriggerNumberOfExecutionsChanged => TriggerNumberOfExecutionsChanged$schema.parse(input)
export const TriggerNumberOfExecutionsChanged$schema = z.object({ trigger: z.lazy(() => TriggerId$schema), by: lib.U32$schema })
export const TriggerNumberOfExecutionsChanged$codec = lib.structCodec<TriggerNumberOfExecutionsChanged>([['trigger', lib.lazyCodec(() => TriggerId$codec)], ['by', lib.U32$codec]])

export type TriggerPredicateBox = z.infer<typeof TriggerPredicateBox$schema>
export const TriggerPredicateBox = (input: z.input<typeof TriggerPredicateBox$schema>): TriggerPredicateBox => TriggerPredicateBox$schema.parse(input)
export const TriggerPredicateBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Id'), value: z.lazy(() => TriggerIdPredicateBox$schema) })])
export const TriggerPredicateBox$codec: lib.Codec<TriggerPredicateBox> = lib.enumCodec<{ Id: [TriggerIdPredicateBox] }>([[0, 'Id', lib.lazyCodec(() => TriggerIdPredicateBox$codec)]]).discriminated()

export type TypeError = z.infer<typeof TypeError$schema>
export const TypeError = (input: z.input<typeof TypeError$schema>): TypeError => TypeError$schema.parse(input)
export const TypeError$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('AssetType'), value: z.lazy(() => AssetTypeMismatch$schema) }), z.object({ t: z.literal('NumericAssetTypeExpected'), value: z.lazy(() => AssetType$schema) })])
export const TypeError$codec: lib.Codec<TypeError> = lib.enumCodec<{ AssetType: [AssetTypeMismatch], NumericAssetTypeExpected: [AssetType] }>([[0, 'AssetType', lib.lazyCodec(() => AssetTypeMismatch$codec)], [1, 'NumericAssetTypeExpected', lib.lazyCodec(() => AssetType$codec)]]).discriminated()

export interface Unregister<T0> { object: T0 }
export const Unregister$schema = <T0 extends z.ZodType>(t0: T0) => z.object({ object: t0 })
export const Unregister$codec = <T0>(t0: lib.Codec<T0>) => lib.structCodec([['object', t0]])

export type UnregisterBox = z.infer<typeof UnregisterBox$schema>
export const UnregisterBox = (input: z.input<typeof UnregisterBox$schema>): UnregisterBox => UnregisterBox$schema.parse(input)
export const UnregisterBox$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('Peer'), value: z.lazy(() => Unregister$schema(z.lazy(() => PeerId$schema))) }), z.object({ t: z.literal('Domain'), value: z.lazy(() => Unregister$schema(lib.DomainId$schema)) }), z.object({ t: z.literal('Account'), value: z.lazy(() => Unregister$schema(lib.AccountId$schema)) }), z.object({ t: z.literal('AssetDefinition'), value: z.lazy(() => Unregister$schema(lib.AssetDefinitionId$schema)) }), z.object({ t: z.literal('Asset'), value: z.lazy(() => Unregister$schema(lib.AssetId$schema)) }), z.object({ t: z.literal('Role'), value: z.lazy(() => Unregister$schema(z.lazy(() => RoleId$schema))) }), z.object({ t: z.literal('Trigger'), value: z.lazy(() => Unregister$schema(z.lazy(() => TriggerId$schema))) })])
export const UnregisterBox$codec: lib.Codec<UnregisterBox> = lib.enumCodec<{ Peer: [Unregister<PeerId>], Domain: [Unregister<lib.DomainId>], Account: [Unregister<lib.AccountId>], AssetDefinition: [Unregister<lib.AssetDefinitionId>], Asset: [Unregister<lib.AssetId>], Role: [Unregister<RoleId>], Trigger: [Unregister<TriggerId>] }>([[0, 'Peer', lib.lazyCodec(() => Unregister$codec(lib.lazyCodec(() => PeerId$codec)))], [1, 'Domain', lib.lazyCodec(() => Unregister$codec(lib.DomainId$codec))], [2, 'Account', lib.lazyCodec(() => Unregister$codec(lib.AccountId$codec))], [3, 'AssetDefinition', lib.lazyCodec(() => Unregister$codec(lib.AssetDefinitionId$codec))], [4, 'Asset', lib.lazyCodec(() => Unregister$codec(lib.AssetId$codec))], [5, 'Role', lib.lazyCodec(() => Unregister$codec(lib.lazyCodec(() => RoleId$codec)))], [6, 'Trigger', lib.lazyCodec(() => Unregister$codec(lib.lazyCodec(() => TriggerId$codec)))]]).discriminated()

export type Upgrade = z.infer<typeof Upgrade$schema>
export const Upgrade = (input: z.input<typeof Upgrade$schema>): Upgrade => Upgrade$schema.parse(input)
export const Upgrade$schema = z.object({ executor: z.lazy(() => Executor$schema) })
export const Upgrade$codec = lib.structCodec<Upgrade>([['executor', lib.lazyCodec(() => Executor$codec)]])

export type ValidationFail = z.infer<typeof ValidationFail$schema>
export const ValidationFail = (input: z.input<typeof ValidationFail$schema>): ValidationFail => ValidationFail$schema.parse(input)
export const ValidationFail$schema  = z.discriminatedUnion('t', [z.object({ t: z.literal('NotPermitted'), value: z.string() }), z.object({ t: z.literal('InstructionFailed'), value: z.lazy(() => InstructionExecutionError$schema) }), z.object({ t: z.literal('QueryFailed'), value: z.lazy(() => QueryExecutionFail$schema) }), z.object({ t: z.literal('TooComplex') }), z.object({ t: z.literal('InternalError') })])
export const ValidationFail$codec: lib.Codec<ValidationFail> = lib.enumCodec<{ NotPermitted: [lib.String], InstructionFailed: [InstructionExecutionError], QueryFailed: [QueryExecutionFail], TooComplex: [], InternalError: [] }>([[0, 'NotPermitted', lib.String$codec], [1, 'InstructionFailed', lib.lazyCodec(() => InstructionExecutionError$codec)], [2, 'QueryFailed', lib.lazyCodec(() => QueryExecutionFail$codec)], [3, 'TooComplex'], [4, 'InternalError']]).discriminated()

export type WasmExecutionFail = z.infer<typeof WasmExecutionFail$schema>
export const WasmExecutionFail = (input: z.input<typeof WasmExecutionFail$schema>): WasmExecutionFail => WasmExecutionFail$schema.parse(input)
export const WasmExecutionFail$schema = z.object({ reason: z.string() })
export const WasmExecutionFail$codec = lib.structCodec<WasmExecutionFail>([['reason', lib.String$codec]])

export type WasmSmartContract = z.infer<typeof WasmSmartContract$schema>
export const WasmSmartContract = (input: z.input<typeof WasmSmartContract$schema>): WasmSmartContract => WasmSmartContract$schema.parse(input)
export const WasmSmartContract$schema = z.object({ blob: lib.BytesVec$schema })
export const WasmSmartContract$codec = lib.structCodec<WasmSmartContract>([['blob', lib.BytesVec$codec]])

export type QueryOutputMap = {
  FindRoles: lib.Vec<Role>
  FindRoleIds: lib.Vec<RoleId>
  FindRolesByAccountId: lib.Vec<RoleId>
  FindPermissionsByAccountId: lib.Vec<Permission>
  FindAccounts: lib.Vec<Account>
  FindAssets: lib.Vec<Asset>
  FindAssetsDefinitions: lib.Vec<AssetDefinition>
  FindDomains: lib.Vec<Domain>
  FindPeers: lib.Vec<PeerId>
  FindActiveTriggerIds: lib.Vec<TriggerId>
  FindTriggers: lib.Vec<Trigger>
  FindTransactions: lib.Vec<CommittedTransaction>
  FindAccountsWithAsset: lib.Vec<Account>
  FindBlockHeaders: lib.Vec<BlockHeader>
  FindBlocks: lib.Vec<SignedBlock>
}
export const QueryOutputKindMap = {
  FindRoles: 'Role',
  FindRoleIds: 'RoleId',
  FindRolesByAccountId: 'RoleId',
  FindPermissionsByAccountId: 'Permission',
  FindAccounts: 'Account',
  FindAssets: 'Asset',
  FindAssetsDefinitions: 'AssetDefinition',
  FindDomains: 'Domain',
  FindPeers: 'Peer',
  FindActiveTriggerIds: 'TriggerId',
  FindTriggers: 'Trigger',
  FindTransactions: 'Transaction',
  FindAccountsWithAsset: 'Account',
  FindBlockHeaders: 'BlockHeader',
  FindBlocks: 'Block',
} as const
export type SingularQueryOutputMap = {
  FindAccountMetadata: lib.Json
  FindAssetQuantityById: Numeric
  FindAssetMetadata: lib.Json
  FindAssetDefinitionMetadata: lib.Json
  FindDomainMetadata: lib.Json
  FindParameters: Parameters
  FindTriggerMetadata: lib.Json
  FindExecutorDataModel: ExecutorDataModel
}
export const SingularQueryOutputKindMap = {
  FindAccountMetadata: 'Json',
  FindAssetQuantityById: 'Numeric',
  FindAssetMetadata: 'Json',
  FindAssetDefinitionMetadata: 'Json',
  FindDomainMetadata: 'Json',
  FindParameters: 'Parameters',
  FindTriggerMetadata: 'Json',
  FindExecutorDataModel: 'ExecutorDataModel',
} as const