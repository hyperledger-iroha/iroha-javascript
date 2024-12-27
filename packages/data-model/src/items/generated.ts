import * as lib from './generated-lib'

export interface Account {
  id: lib.AccountId
  metadata: lib.Map<lib.Name, lib.Json>
}
export const Account: lib.CodecProvider<Account> = {
  [lib.CodecSymbol]: lib.structCodec<Account>(['id', 'metadata'], {
    id: lib.codecOf(lib.AccountId),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
  }),
}

export interface Numeric {
  mantissa: lib.Compact
  scale: lib.Compact
}
export const Numeric: lib.CodecProvider<Numeric> = {
  [lib.CodecSymbol]: lib.structCodec<Numeric>(['mantissa', 'scale'], {
    mantissa: lib.codecOf(lib.Compact),
    scale: lib.codecOf(lib.Compact),
  }),
}

export type AssetValue =
  | lib.SumTypeKindValue<'Numeric', Numeric>
  | lib.SumTypeKindValue<'Store', lib.Map<lib.Name, lib.Json>>
export const AssetValue = {
  Numeric: (value: Numeric): AssetValue => ({ kind: 'Numeric', value }),
  Store: (value: lib.Map<lib.Name, lib.Json>): AssetValue => ({ kind: 'Store', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Numeric: [Numeric]; Store: [lib.Map<lib.Name, lib.Json>] }>([
      [0, 'Numeric', lib.codecOf(Numeric)],
      [1, 'Store', lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json)))],
    ])
    .discriminated(),
}

export interface Asset {
  id: lib.AssetId
  value: AssetValue
}
export const Asset: lib.CodecProvider<Asset> = {
  [lib.CodecSymbol]: lib.structCodec<Asset>(['id', 'value'], {
    id: lib.codecOf(lib.AssetId),
    value: lib.codecOf(AssetValue),
  }),
}

export interface AssetChanged {
  asset: lib.AssetId
  amount: AssetValue
}
export const AssetChanged: lib.CodecProvider<AssetChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetChanged>(['asset', 'amount'], {
    asset: lib.codecOf(lib.AssetId),
    amount: lib.codecOf(AssetValue),
  }),
}

export interface MetadataChanged<T0> {
  target: T0
  key: lib.Name
  value: lib.Json
}
export const MetadataChanged = {
  with: <T0,>(t0: lib.Codec<T0>): lib.CodecProvider<MetadataChanged<T0>> => ({
    [lib.CodecSymbol]: lib.structCodec<MetadataChanged<T0>>(['target', 'key', 'value'], {
      target: t0,
      key: lib.codecOf(lib.Name),
      value: lib.codecOf(lib.Json),
    }),
  }),
}

export type AssetEvent =
  | lib.SumTypeKindValue<'Created', Asset>
  | lib.SumTypeKindValue<'Deleted', lib.AssetId>
  | lib.SumTypeKindValue<'Added', AssetChanged>
  | lib.SumTypeKindValue<'Removed', AssetChanged>
  | lib.SumTypeKindValue<'MetadataInserted', MetadataChanged<lib.AssetId>>
  | lib.SumTypeKindValue<'MetadataRemoved', MetadataChanged<lib.AssetId>>
export const AssetEvent = {
  Created: (value: Asset): AssetEvent => ({ kind: 'Created', value }),
  Deleted: (value: lib.AssetId): AssetEvent => ({ kind: 'Deleted', value }),
  Added: (value: AssetChanged): AssetEvent => ({ kind: 'Added', value }),
  Removed: (value: AssetChanged): AssetEvent => ({ kind: 'Removed', value }),
  MetadataInserted: (value: MetadataChanged<lib.AssetId>): AssetEvent => ({ kind: 'MetadataInserted', value }),
  MetadataRemoved: (value: MetadataChanged<lib.AssetId>): AssetEvent => ({ kind: 'MetadataRemoved', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Asset]
      Deleted: [lib.AssetId]
      Added: [AssetChanged]
      Removed: [AssetChanged]
      MetadataInserted: [MetadataChanged<lib.AssetId>]
      MetadataRemoved: [MetadataChanged<lib.AssetId>]
    }>([
      [0, 'Created', lib.codecOf(Asset)],
      [1, 'Deleted', lib.codecOf(lib.AssetId)],
      [2, 'Added', lib.codecOf(AssetChanged)],
      [3, 'Removed', lib.codecOf(AssetChanged)],
      [4, 'MetadataInserted', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AssetId)))],
      [5, 'MetadataRemoved', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AssetId)))],
    ])
    .discriminated(),
}

export interface Permission {
  name: lib.String
  payload: lib.Json
}
export const Permission: lib.CodecProvider<Permission> = {
  [lib.CodecSymbol]: lib.structCodec<Permission>(['name', 'payload'], {
    name: lib.codecOf(lib.String),
    payload: lib.codecOf(lib.Json),
  }),
}

export interface AccountPermissionChanged {
  account: lib.AccountId
  permission: Permission
}
export const AccountPermissionChanged: lib.CodecProvider<AccountPermissionChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AccountPermissionChanged>(['account', 'permission'], {
    account: lib.codecOf(lib.AccountId),
    permission: lib.codecOf(Permission),
  }),
}

export interface RoleId {
  name: lib.Name
}
export const RoleId: lib.CodecProvider<RoleId> = {
  [lib.CodecSymbol]: lib.structCodec<RoleId>(['name'], { name: lib.codecOf(lib.Name) }),
}

export interface AccountRoleChanged {
  account: lib.AccountId
  role: RoleId
}
export const AccountRoleChanged: lib.CodecProvider<AccountRoleChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AccountRoleChanged>(['account', 'role'], {
    account: lib.codecOf(lib.AccountId),
    role: lib.codecOf(RoleId),
  }),
}

export type AccountEvent =
  | lib.SumTypeKindValue<'Created', Account>
  | lib.SumTypeKindValue<'Deleted', lib.AccountId>
  | lib.SumTypeKindValue<'Asset', AssetEvent>
  | lib.SumTypeKindValue<'PermissionAdded', AccountPermissionChanged>
  | lib.SumTypeKindValue<'PermissionRemoved', AccountPermissionChanged>
  | lib.SumTypeKindValue<'RoleGranted', AccountRoleChanged>
  | lib.SumTypeKindValue<'RoleRevoked', AccountRoleChanged>
  | lib.SumTypeKindValue<'MetadataInserted', MetadataChanged<lib.AccountId>>
  | lib.SumTypeKindValue<'MetadataRemoved', MetadataChanged<lib.AccountId>>
export const AccountEvent = {
  Created: (value: Account): AccountEvent => ({ kind: 'Created', value }),
  Deleted: (value: lib.AccountId): AccountEvent => ({ kind: 'Deleted', value }),
  Asset: {
    Created: (value: Asset): AccountEvent => ({ kind: 'Asset', value: AssetEvent.Created(value) }),
    Deleted: (value: lib.AssetId): AccountEvent => ({ kind: 'Asset', value: AssetEvent.Deleted(value) }),
    Added: (value: AssetChanged): AccountEvent => ({ kind: 'Asset', value: AssetEvent.Added(value) }),
    Removed: (value: AssetChanged): AccountEvent => ({ kind: 'Asset', value: AssetEvent.Removed(value) }),
    MetadataInserted: (value: MetadataChanged<lib.AssetId>): AccountEvent => ({
      kind: 'Asset',
      value: AssetEvent.MetadataInserted(value),
    }),
    MetadataRemoved: (value: MetadataChanged<lib.AssetId>): AccountEvent => ({
      kind: 'Asset',
      value: AssetEvent.MetadataRemoved(value),
    }),
  },
  PermissionAdded: (value: AccountPermissionChanged): AccountEvent => ({ kind: 'PermissionAdded', value }),
  PermissionRemoved: (value: AccountPermissionChanged): AccountEvent => ({ kind: 'PermissionRemoved', value }),
  RoleGranted: (value: AccountRoleChanged): AccountEvent => ({ kind: 'RoleGranted', value }),
  RoleRevoked: (value: AccountRoleChanged): AccountEvent => ({ kind: 'RoleRevoked', value }),
  MetadataInserted: (value: MetadataChanged<lib.AccountId>): AccountEvent => ({ kind: 'MetadataInserted', value }),
  MetadataRemoved: (value: MetadataChanged<lib.AccountId>): AccountEvent => ({ kind: 'MetadataRemoved', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Account]
      Deleted: [lib.AccountId]
      Asset: [AssetEvent]
      PermissionAdded: [AccountPermissionChanged]
      PermissionRemoved: [AccountPermissionChanged]
      RoleGranted: [AccountRoleChanged]
      RoleRevoked: [AccountRoleChanged]
      MetadataInserted: [MetadataChanged<lib.AccountId>]
      MetadataRemoved: [MetadataChanged<lib.AccountId>]
    }>([
      [0, 'Created', lib.codecOf(Account)],
      [1, 'Deleted', lib.codecOf(lib.AccountId)],
      [2, 'Asset', lib.codecOf(AssetEvent)],
      [3, 'PermissionAdded', lib.codecOf(AccountPermissionChanged)],
      [4, 'PermissionRemoved', lib.codecOf(AccountPermissionChanged)],
      [5, 'RoleGranted', lib.codecOf(AccountRoleChanged)],
      [6, 'RoleRevoked', lib.codecOf(AccountRoleChanged)],
      [7, 'MetadataInserted', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AccountId)))],
      [8, 'MetadataRemoved', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AccountId)))],
    ])
    .discriminated(),
}

export type AccountEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'AnyAsset'
  | 'PermissionAdded'
  | 'PermissionRemoved'
  | 'RoleGranted'
  | 'RoleRevoked'
  | 'MetadataInserted'
  | 'MetadataRemoved'
>
export const AccountEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<AccountEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    AnyAsset: 4,
    PermissionAdded: 8,
    PermissionRemoved: 16,
    RoleGranted: 32,
    RoleRevoked: 64,
    MetadataInserted: 128,
    MetadataRemoved: 256,
  }) satisfies lib.Codec<AccountEventSet>,
}

export interface AccountEventFilter {
  idMatcher: lib.Option<lib.AccountId>
  eventSet: AccountEventSet
}
export const AccountEventFilter: lib.CodecProvider<AccountEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<AccountEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(lib.AccountId))),
    eventSet: lib.codecOf(AccountEventSet),
  }),
}

export type AccountIdPredicateAtom = lib.SumTypeKindValue<'Equals', lib.AccountId>
export const AccountIdPredicateAtom = {
  Equals: (value: lib.AccountId): AccountIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AccountId] }>([[0, 'Equals', lib.codecOf(lib.AccountId)]])
    .discriminated(),
}

export type DomainIdPredicateAtom = lib.SumTypeKindValue<'Equals', lib.DomainId>
export const DomainIdPredicateAtom = {
  Equals: (value: lib.DomainId): DomainIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.DomainId] }>([[0, 'Equals', lib.codecOf(lib.DomainId)]])
    .discriminated(),
}

export type StringPredicateAtom =
  | lib.SumTypeKindValue<'Equals', lib.String>
  | lib.SumTypeKindValue<'Contains', lib.String>
  | lib.SumTypeKindValue<'StartsWith', lib.String>
  | lib.SumTypeKindValue<'EndsWith', lib.String>
export const StringPredicateAtom = {
  Equals: (value: lib.String): StringPredicateAtom => ({ kind: 'Equals', value }),
  Contains: (value: lib.String): StringPredicateAtom => ({ kind: 'Contains', value }),
  StartsWith: (value: lib.String): StringPredicateAtom => ({ kind: 'StartsWith', value }),
  EndsWith: (value: lib.String): StringPredicateAtom => ({ kind: 'EndsWith', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.String]; Contains: [lib.String]; StartsWith: [lib.String]; EndsWith: [lib.String] }>([
      [0, 'Equals', lib.codecOf(lib.String)],
      [1, 'Contains', lib.codecOf(lib.String)],
      [2, 'StartsWith', lib.codecOf(lib.String)],
      [3, 'EndsWith', lib.codecOf(lib.String)],
    ])
    .discriminated(),
}

export type NameProjectionPredicate = lib.SumTypeKindValue<'Atom', StringPredicateAtom>
export const NameProjectionPredicate = {
  Atom: {
    Equals: (value: lib.String): NameProjectionPredicate => ({
      kind: 'Atom',
      value: StringPredicateAtom.Equals(value),
    }),
    Contains: (value: lib.String): NameProjectionPredicate => ({
      kind: 'Atom',
      value: StringPredicateAtom.Contains(value),
    }),
    StartsWith: (value: lib.String): NameProjectionPredicate => ({
      kind: 'Atom',
      value: StringPredicateAtom.StartsWith(value),
    }),
    EndsWith: (value: lib.String): NameProjectionPredicate => ({
      kind: 'Atom',
      value: StringPredicateAtom.EndsWith(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [StringPredicateAtom] }>([[0, 'Atom', lib.codecOf(StringPredicateAtom)]])
    .discriminated(),
}

export type DomainIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', DomainIdPredicateAtom>
  | lib.SumTypeKindValue<'Name', NameProjectionPredicate>
export const DomainIdProjectionPredicate = {
  Atom: {
    Equals: (value: lib.DomainId): DomainIdProjectionPredicate => ({
      kind: 'Atom',
      value: DomainIdPredicateAtom.Equals(value),
    }),
  },
  Name: {
    Atom: {
      Equals: (value: lib.String): DomainIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: (value: lib.String): DomainIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: (value: lib.String): DomainIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: (value: lib.String): DomainIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [DomainIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(DomainIdPredicateAtom)],
      [1, 'Name', lib.codecOf(NameProjectionPredicate)],
    ])
    .discriminated(),
}

export type PublicKeyPredicateAtom = lib.SumTypeKindValue<'Equals', lib.PublicKeyWrap>
export const PublicKeyPredicateAtom = {
  Equals: (value: lib.PublicKeyWrap): PublicKeyPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.PublicKeyWrap] }>([[0, 'Equals', lib.codecOf(lib.PublicKeyWrap)]])
    .discriminated(),
}

export type PublicKeyProjectionPredicate = lib.SumTypeKindValue<'Atom', PublicKeyPredicateAtom>
export const PublicKeyProjectionPredicate = {
  Atom: {
    Equals: (value: lib.PublicKeyWrap): PublicKeyProjectionPredicate => ({
      kind: 'Atom',
      value: PublicKeyPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PublicKeyPredicateAtom] }>([[0, 'Atom', lib.codecOf(PublicKeyPredicateAtom)]])
    .discriminated(),
}

export type AccountIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AccountIdPredicateAtom>
  | lib.SumTypeKindValue<'Domain', DomainIdProjectionPredicate>
  | lib.SumTypeKindValue<'Signatory', PublicKeyProjectionPredicate>
export const AccountIdProjectionPredicate = {
  Atom: {
    Equals: (value: lib.AccountId): AccountIdProjectionPredicate => ({
      kind: 'Atom',
      value: AccountIdPredicateAtom.Equals(value),
    }),
  },
  Domain: {
    Atom: {
      Equals: (value: lib.DomainId): AccountIdProjectionPredicate => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): AccountIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): AccountIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): AccountIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): AccountIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Signatory: {
    Atom: {
      Equals: (value: lib.PublicKeyWrap): AccountIdProjectionPredicate => ({
        kind: 'Signatory',
        value: PublicKeyProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AccountIdPredicateAtom]
      Domain: [DomainIdProjectionPredicate]
      Signatory: [PublicKeyProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AccountIdPredicateAtom)],
      [1, 'Domain', lib.codecOf(DomainIdProjectionPredicate)],
      [2, 'Signatory', lib.codecOf(PublicKeyProjectionPredicate)],
    ])
    .discriminated(),
}

export type NameProjectionSelector = lib.SumTypeKind<'Atom'>
export const NameProjectionSelector = {
  Atom: Object.freeze<NameProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type DomainIdProjectionSelector = lib.SumTypeKind<'Atom'> | lib.SumTypeKindValue<'Name', NameProjectionSelector>
export const DomainIdProjectionSelector = {
  Atom: Object.freeze<DomainIdProjectionSelector>({ kind: 'Atom' }),
  Name: { Atom: Object.freeze<DomainIdProjectionSelector>({ kind: 'Name', value: NameProjectionSelector.Atom }) },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', lib.codecOf(NameProjectionSelector)],
    ])
    .discriminated(),
}

export type PublicKeyProjectionSelector = lib.SumTypeKind<'Atom'>
export const PublicKeyProjectionSelector = {
  Atom: Object.freeze<PublicKeyProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type AccountIdProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Domain', DomainIdProjectionSelector>
  | lib.SumTypeKindValue<'Signatory', PublicKeyProjectionSelector>
export const AccountIdProjectionSelector = {
  Atom: Object.freeze<AccountIdProjectionSelector>({ kind: 'Atom' }),
  Domain: {
    Atom: Object.freeze<AccountIdProjectionSelector>({ kind: 'Domain', value: DomainIdProjectionSelector.Atom }),
    Name: {
      Atom: Object.freeze<AccountIdProjectionSelector>({ kind: 'Domain', value: DomainIdProjectionSelector.Name.Atom }),
    },
  },
  Signatory: {
    Atom: Object.freeze<AccountIdProjectionSelector>({ kind: 'Signatory', value: PublicKeyProjectionSelector.Atom }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Domain: [DomainIdProjectionSelector]; Signatory: [PublicKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Domain', lib.codecOf(DomainIdProjectionSelector)],
      [2, 'Signatory', lib.codecOf(PublicKeyProjectionSelector)],
    ])
    .discriminated(),
}

export type AccountPredicateAtom = never
export const AccountPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type MetadataPredicateAtom = never
export const MetadataPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type JsonPredicateAtom = lib.SumTypeKindValue<'Equals', lib.Json>
export const JsonPredicateAtom = {
  Equals: (value: lib.Json): JsonPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ Equals: [lib.Json] }>([[0, 'Equals', lib.codecOf(lib.Json)]]).discriminated(),
}

export type JsonProjectionPredicate = lib.SumTypeKindValue<'Atom', JsonPredicateAtom>
export const JsonProjectionPredicate = {
  Atom: {
    Equals: (value: lib.Json): JsonProjectionPredicate => ({ kind: 'Atom', value: JsonPredicateAtom.Equals(value) }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [JsonPredicateAtom] }>([[0, 'Atom', lib.codecOf(JsonPredicateAtom)]])
    .discriminated(),
}

export interface MetadataKeyProjectionPredicate {
  key: lib.Name
  projection: JsonProjectionPredicate
}
export const MetadataKeyProjectionPredicate: lib.CodecProvider<MetadataKeyProjectionPredicate> = {
  [lib.CodecSymbol]: lib.structCodec<MetadataKeyProjectionPredicate>(['key', 'projection'], {
    key: lib.codecOf(lib.Name),
    projection: lib.codecOf(JsonProjectionPredicate),
  }),
}

export type MetadataProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', MetadataPredicateAtom>
  | lib.SumTypeKindValue<'Key', MetadataKeyProjectionPredicate>
export const MetadataProjectionPredicate = {
  Atom: {},
  Key: (value: MetadataKeyProjectionPredicate): MetadataProjectionPredicate => ({ kind: 'Key', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [MetadataPredicateAtom]; Key: [MetadataKeyProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(MetadataPredicateAtom)],
      [1, 'Key', lib.codecOf(MetadataKeyProjectionPredicate)],
    ])
    .discriminated(),
}

export type AccountProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AccountPredicateAtom>
  | lib.SumTypeKindValue<'Id', AccountIdProjectionPredicate>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionPredicate>
export const AccountProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: lib.AccountId): AccountProjectionPredicate => ({
        kind: 'Id',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: (value: lib.DomainId): AccountProjectionPredicate => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): AccountProjectionPredicate => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): AccountProjectionPredicate => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): AccountProjectionPredicate => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): AccountProjectionPredicate => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: (value: lib.PublicKeyWrap): AccountProjectionPredicate => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: (value: MetadataKeyProjectionPredicate): AccountProjectionPredicate => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AccountPredicateAtom]
      Id: [AccountIdProjectionPredicate]
      Metadata: [MetadataProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AccountPredicateAtom)],
      [1, 'Id', lib.codecOf(AccountIdProjectionPredicate)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionPredicate)],
    ])
    .discriminated(),
}

export type JsonProjectionSelector = lib.SumTypeKind<'Atom'>
export const JsonProjectionSelector = {
  Atom: Object.freeze<JsonProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export interface MetadataKeyProjectionSelector {
  key: lib.Name
  projection: JsonProjectionSelector
}
export const MetadataKeyProjectionSelector: lib.CodecProvider<MetadataKeyProjectionSelector> = {
  [lib.CodecSymbol]: lib.structCodec<MetadataKeyProjectionSelector>(['key', 'projection'], {
    key: lib.codecOf(lib.Name),
    projection: lib.codecOf(JsonProjectionSelector),
  }),
}

export type MetadataProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Key', MetadataKeyProjectionSelector>
export const MetadataProjectionSelector = {
  Atom: Object.freeze<MetadataProjectionSelector>({ kind: 'Atom' }),
  Key: (value: MetadataKeyProjectionSelector): MetadataProjectionSelector => ({ kind: 'Key', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Key: [MetadataKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Key', lib.codecOf(MetadataKeyProjectionSelector)],
    ])
    .discriminated(),
}

export type AccountProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Id', AccountIdProjectionSelector>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionSelector>
export const AccountProjectionSelector = {
  Atom: Object.freeze<AccountProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<AccountProjectionSelector>({ kind: 'Id', value: AccountIdProjectionSelector.Atom }),
    Domain: {
      Atom: Object.freeze<AccountProjectionSelector>({ kind: 'Id', value: AccountIdProjectionSelector.Domain.Atom }),
      Name: {
        Atom: Object.freeze<AccountProjectionSelector>({
          kind: 'Id',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Signatory: {
      Atom: Object.freeze<AccountProjectionSelector>({ kind: 'Id', value: AccountIdProjectionSelector.Signatory.Atom }),
    },
  },
  Metadata: {
    Atom: Object.freeze<AccountProjectionSelector>({ kind: 'Metadata', value: MetadataProjectionSelector.Atom }),
    Key: (value: MetadataKeyProjectionSelector): AccountProjectionSelector => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AccountIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(AccountIdProjectionSelector)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionSelector)],
    ])
    .discriminated(),
}

export type Executable =
  | lib.SumTypeKindValue<'Instructions', lib.Vec<InstructionBox>>
  | lib.SumTypeKindValue<'Wasm', lib.Vec<lib.U8>>
export const Executable = {
  Instructions: (value: lib.Vec<InstructionBox>): Executable => ({ kind: 'Instructions', value }),
  Wasm: (value: lib.Vec<lib.U8>): Executable => ({ kind: 'Wasm', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Instructions: [lib.Vec<InstructionBox>]; Wasm: [lib.Vec<lib.U8>] }>([
      [0, 'Instructions', lib.codecOf(lib.Vec.with(lib.lazyCodec(() => lib.codecOf(InstructionBox))))],
      [1, 'Wasm', lib.codecOf(lib.Vec.with(lib.codecOf(lib.U8)))],
    ])
    .discriminated(),
}

export type Repeats = lib.SumTypeKind<'Indefinitely'> | lib.SumTypeKindValue<'Exactly', lib.U32>
export const Repeats = {
  Indefinitely: Object.freeze<Repeats>({ kind: 'Indefinitely' }),
  Exactly: (value: lib.U32): Repeats => ({ kind: 'Exactly', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Indefinitely: []; Exactly: [lib.U32] }>([
      [0, 'Indefinitely'],
      [1, 'Exactly', lib.codecOf(lib.U32)],
    ])
    .discriminated(),
}

export interface PeerId {
  publicKey: lib.PublicKeyWrap
}
export const PeerId: lib.CodecProvider<PeerId> = {
  [lib.CodecSymbol]: lib.structCodec<PeerId>(['publicKey'], { publicKey: lib.codecOf(lib.PublicKeyWrap) }),
}

export interface TriggerId {
  name: lib.Name
}
export const TriggerId: lib.CodecProvider<TriggerId> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerId>(['name'], { name: lib.codecOf(lib.Name) }),
}

export type FindError =
  | lib.SumTypeKindValue<'Asset', lib.AssetId>
  | lib.SumTypeKindValue<'AssetDefinition', lib.AssetDefinitionId>
  | lib.SumTypeKindValue<'Account', lib.AccountId>
  | lib.SumTypeKindValue<'Domain', lib.DomainId>
  | lib.SumTypeKindValue<'MetadataKey', lib.Name>
  | lib.SumTypeKindValue<'Block', lib.HashWrap>
  | lib.SumTypeKindValue<'Transaction', lib.HashWrap>
  | lib.SumTypeKindValue<'Peer', PeerId>
  | lib.SumTypeKindValue<'Trigger', TriggerId>
  | lib.SumTypeKindValue<'Role', RoleId>
  | lib.SumTypeKindValue<'Permission', Permission>
  | lib.SumTypeKindValue<'PublicKey', lib.PublicKeyWrap>
export const FindError = {
  Asset: (value: lib.AssetId): FindError => ({ kind: 'Asset', value }),
  AssetDefinition: (value: lib.AssetDefinitionId): FindError => ({ kind: 'AssetDefinition', value }),
  Account: (value: lib.AccountId): FindError => ({ kind: 'Account', value }),
  Domain: (value: lib.DomainId): FindError => ({ kind: 'Domain', value }),
  MetadataKey: (value: lib.Name): FindError => ({ kind: 'MetadataKey', value }),
  Block: (value: lib.HashWrap): FindError => ({ kind: 'Block', value }),
  Transaction: (value: lib.HashWrap): FindError => ({ kind: 'Transaction', value }),
  Peer: (value: PeerId): FindError => ({ kind: 'Peer', value }),
  Trigger: (value: TriggerId): FindError => ({ kind: 'Trigger', value }),
  Role: (value: RoleId): FindError => ({ kind: 'Role', value }),
  Permission: (value: Permission): FindError => ({ kind: 'Permission', value }),
  PublicKey: (value: lib.PublicKeyWrap): FindError => ({ kind: 'PublicKey', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Asset: [lib.AssetId]
      AssetDefinition: [lib.AssetDefinitionId]
      Account: [lib.AccountId]
      Domain: [lib.DomainId]
      MetadataKey: [lib.Name]
      Block: [lib.HashWrap]
      Transaction: [lib.HashWrap]
      Peer: [PeerId]
      Trigger: [TriggerId]
      Role: [RoleId]
      Permission: [Permission]
      PublicKey: [lib.PublicKeyWrap]
    }>([
      [0, 'Asset', lib.codecOf(lib.AssetId)],
      [1, 'AssetDefinition', lib.codecOf(lib.AssetDefinitionId)],
      [2, 'Account', lib.codecOf(lib.AccountId)],
      [3, 'Domain', lib.codecOf(lib.DomainId)],
      [4, 'MetadataKey', lib.codecOf(lib.Name)],
      [5, 'Block', lib.codecOf(lib.HashWrap)],
      [6, 'Transaction', lib.codecOf(lib.HashWrap)],
      [7, 'Peer', lib.codecOf(PeerId)],
      [8, 'Trigger', lib.codecOf(TriggerId)],
      [9, 'Role', lib.codecOf(RoleId)],
      [10, 'Permission', lib.codecOf(Permission)],
      [11, 'PublicKey', lib.codecOf(lib.PublicKeyWrap)],
    ])
    .discriminated(),
}

export interface TransactionLimitError {
  reason: lib.String
}
export const TransactionLimitError: lib.CodecProvider<TransactionLimitError> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionLimitError>(['reason'], { reason: lib.codecOf(lib.String) }),
}

export type InstructionType =
  | lib.SumTypeKind<'Register'>
  | lib.SumTypeKind<'Unregister'>
  | lib.SumTypeKind<'Mint'>
  | lib.SumTypeKind<'Burn'>
  | lib.SumTypeKind<'Transfer'>
  | lib.SumTypeKind<'SetKeyValue'>
  | lib.SumTypeKind<'RemoveKeyValue'>
  | lib.SumTypeKind<'Grant'>
  | lib.SumTypeKind<'Revoke'>
  | lib.SumTypeKind<'ExecuteTrigger'>
  | lib.SumTypeKind<'SetParameter'>
  | lib.SumTypeKind<'Upgrade'>
  | lib.SumTypeKind<'Log'>
  | lib.SumTypeKind<'Custom'>
export const InstructionType = {
  Register: Object.freeze<InstructionType>({ kind: 'Register' }),
  Unregister: Object.freeze<InstructionType>({ kind: 'Unregister' }),
  Mint: Object.freeze<InstructionType>({ kind: 'Mint' }),
  Burn: Object.freeze<InstructionType>({ kind: 'Burn' }),
  Transfer: Object.freeze<InstructionType>({ kind: 'Transfer' }),
  SetKeyValue: Object.freeze<InstructionType>({ kind: 'SetKeyValue' }),
  RemoveKeyValue: Object.freeze<InstructionType>({ kind: 'RemoveKeyValue' }),
  Grant: Object.freeze<InstructionType>({ kind: 'Grant' }),
  Revoke: Object.freeze<InstructionType>({ kind: 'Revoke' }),
  ExecuteTrigger: Object.freeze<InstructionType>({ kind: 'ExecuteTrigger' }),
  SetParameter: Object.freeze<InstructionType>({ kind: 'SetParameter' }),
  Upgrade: Object.freeze<InstructionType>({ kind: 'Upgrade' }),
  Log: Object.freeze<InstructionType>({ kind: 'Log' }),
  Custom: Object.freeze<InstructionType>({ kind: 'Custom' }),
  [lib.CodecSymbol]: lib
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
    .discriminated(),
}

export interface Mismatch<T0> {
  expected: T0
  actual: T0
}
export const Mismatch = {
  with: <T0,>(t0: lib.Codec<T0>): lib.CodecProvider<Mismatch<T0>> => ({
    [lib.CodecSymbol]: lib.structCodec<Mismatch<T0>>(['expected', 'actual'], { expected: t0, actual: t0 }),
  }),
}

export interface NumericSpec {
  scale: lib.Option<lib.U32>
}
export const NumericSpec: lib.CodecProvider<NumericSpec> = {
  [lib.CodecSymbol]: lib.structCodec<NumericSpec>(['scale'], {
    scale: lib.codecOf(lib.Option.with(lib.codecOf(lib.U32))),
  }),
}

export type AssetType = lib.SumTypeKindValue<'Numeric', NumericSpec> | lib.SumTypeKind<'Store'>
export const AssetType = {
  Numeric: (value: NumericSpec): AssetType => ({ kind: 'Numeric', value }),
  Store: Object.freeze<AssetType>({ kind: 'Store' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Numeric: [NumericSpec]; Store: [] }>([
      [0, 'Numeric', lib.codecOf(NumericSpec)],
      [1, 'Store'],
    ])
    .discriminated(),
}

export type TypeError =
  | lib.SumTypeKindValue<'AssetType', Mismatch<AssetType>>
  | lib.SumTypeKindValue<'NumericAssetTypeExpected', AssetType>
export const TypeError = {
  AssetType: (value: Mismatch<AssetType>): TypeError => ({ kind: 'AssetType', value }),
  NumericAssetTypeExpected: {
    Numeric: (value: NumericSpec): TypeError => ({ kind: 'NumericAssetTypeExpected', value: AssetType.Numeric(value) }),
    Store: Object.freeze<TypeError>({ kind: 'NumericAssetTypeExpected', value: AssetType.Store }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ AssetType: [Mismatch<AssetType>]; NumericAssetTypeExpected: [AssetType] }>([
      [0, 'AssetType', lib.codecOf(Mismatch.with(lib.codecOf(AssetType)))],
      [1, 'NumericAssetTypeExpected', lib.codecOf(AssetType)],
    ])
    .discriminated(),
}

export type InstructionEvaluationError =
  | lib.SumTypeKindValue<'Unsupported', InstructionType>
  | lib.SumTypeKindValue<'PermissionParameter', lib.String>
  | lib.SumTypeKindValue<'Type', TypeError>
export const InstructionEvaluationError = {
  Unsupported: {
    Register: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Register }),
    Unregister: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Unregister }),
    Mint: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Mint }),
    Burn: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Burn }),
    Transfer: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Transfer }),
    SetKeyValue: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.SetKeyValue }),
    RemoveKeyValue: Object.freeze<InstructionEvaluationError>({
      kind: 'Unsupported',
      value: InstructionType.RemoveKeyValue,
    }),
    Grant: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Grant }),
    Revoke: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Revoke }),
    ExecuteTrigger: Object.freeze<InstructionEvaluationError>({
      kind: 'Unsupported',
      value: InstructionType.ExecuteTrigger,
    }),
    SetParameter: Object.freeze<InstructionEvaluationError>({
      kind: 'Unsupported',
      value: InstructionType.SetParameter,
    }),
    Upgrade: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Upgrade }),
    Log: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Log }),
    Custom: Object.freeze<InstructionEvaluationError>({ kind: 'Unsupported', value: InstructionType.Custom }),
  },
  PermissionParameter: (value: lib.String): InstructionEvaluationError => ({ kind: 'PermissionParameter', value }),
  Type: {
    AssetType: (value: Mismatch<AssetType>): InstructionEvaluationError => ({
      kind: 'Type',
      value: TypeError.AssetType(value),
    }),
    NumericAssetTypeExpected: {
      Numeric: (value: NumericSpec): InstructionEvaluationError => ({
        kind: 'Type',
        value: TypeError.NumericAssetTypeExpected.Numeric(value),
      }),
      Store: Object.freeze<InstructionEvaluationError>({
        kind: 'Type',
        value: TypeError.NumericAssetTypeExpected.Store,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Unsupported: [InstructionType]; PermissionParameter: [lib.String]; Type: [TypeError] }>([
      [0, 'Unsupported', lib.codecOf(InstructionType)],
      [1, 'PermissionParameter', lib.codecOf(lib.String)],
      [2, 'Type', lib.codecOf(TypeError)],
    ])
    .discriminated(),
}

export type QueryExecutionFail =
  | lib.SumTypeKindValue<'Find', FindError>
  | lib.SumTypeKindValue<'Conversion', lib.String>
  | lib.SumTypeKind<'NotFound'>
  | lib.SumTypeKind<'CursorMismatch'>
  | lib.SumTypeKind<'CursorDone'>
  | lib.SumTypeKind<'FetchSizeTooBig'>
  | lib.SumTypeKind<'InvalidSingularParameters'>
  | lib.SumTypeKind<'CapacityLimit'>
export const QueryExecutionFail = {
  Find: {
    Asset: (value: lib.AssetId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Asset(value) }),
    AssetDefinition: (value: lib.AssetDefinitionId): QueryExecutionFail => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }),
    Account: (value: lib.AccountId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Account(value) }),
    Domain: (value: lib.DomainId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Domain(value) }),
    MetadataKey: (value: lib.Name): QueryExecutionFail => ({ kind: 'Find', value: FindError.MetadataKey(value) }),
    Block: (value: lib.HashWrap): QueryExecutionFail => ({ kind: 'Find', value: FindError.Block(value) }),
    Transaction: (value: lib.HashWrap): QueryExecutionFail => ({ kind: 'Find', value: FindError.Transaction(value) }),
    Peer: (value: PeerId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Peer(value) }),
    Trigger: (value: TriggerId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Trigger(value) }),
    Role: (value: RoleId): QueryExecutionFail => ({ kind: 'Find', value: FindError.Role(value) }),
    Permission: (value: Permission): QueryExecutionFail => ({ kind: 'Find', value: FindError.Permission(value) }),
    PublicKey: (value: lib.PublicKeyWrap): QueryExecutionFail => ({ kind: 'Find', value: FindError.PublicKey(value) }),
  },
  Conversion: (value: lib.String): QueryExecutionFail => ({ kind: 'Conversion', value }),
  NotFound: Object.freeze<QueryExecutionFail>({ kind: 'NotFound' }),
  CursorMismatch: Object.freeze<QueryExecutionFail>({ kind: 'CursorMismatch' }),
  CursorDone: Object.freeze<QueryExecutionFail>({ kind: 'CursorDone' }),
  FetchSizeTooBig: Object.freeze<QueryExecutionFail>({ kind: 'FetchSizeTooBig' }),
  InvalidSingularParameters: Object.freeze<QueryExecutionFail>({ kind: 'InvalidSingularParameters' }),
  CapacityLimit: Object.freeze<QueryExecutionFail>({ kind: 'CapacityLimit' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Find: [FindError]
      Conversion: [lib.String]
      NotFound: []
      CursorMismatch: []
      CursorDone: []
      FetchSizeTooBig: []
      InvalidSingularParameters: []
      CapacityLimit: []
    }>([
      [0, 'Find', lib.codecOf(FindError)],
      [1, 'Conversion', lib.codecOf(lib.String)],
      [2, 'NotFound'],
      [3, 'CursorMismatch'],
      [4, 'CursorDone'],
      [5, 'FetchSizeTooBig'],
      [6, 'InvalidSingularParameters'],
      [7, 'CapacityLimit'],
    ])
    .discriminated(),
}

export type IdBox =
  | lib.SumTypeKindValue<'DomainId', lib.DomainId>
  | lib.SumTypeKindValue<'AccountId', lib.AccountId>
  | lib.SumTypeKindValue<'AssetDefinitionId', lib.AssetDefinitionId>
  | lib.SumTypeKindValue<'AssetId', lib.AssetId>
  | lib.SumTypeKindValue<'PeerId', PeerId>
  | lib.SumTypeKindValue<'TriggerId', TriggerId>
  | lib.SumTypeKindValue<'RoleId', RoleId>
  | lib.SumTypeKindValue<'Permission', Permission>
  | lib.SumTypeKindValue<'CustomParameterId', lib.Name>
export const IdBox = {
  DomainId: (value: lib.DomainId): IdBox => ({ kind: 'DomainId', value }),
  AccountId: (value: lib.AccountId): IdBox => ({ kind: 'AccountId', value }),
  AssetDefinitionId: (value: lib.AssetDefinitionId): IdBox => ({ kind: 'AssetDefinitionId', value }),
  AssetId: (value: lib.AssetId): IdBox => ({ kind: 'AssetId', value }),
  PeerId: (value: PeerId): IdBox => ({ kind: 'PeerId', value }),
  TriggerId: (value: TriggerId): IdBox => ({ kind: 'TriggerId', value }),
  RoleId: (value: RoleId): IdBox => ({ kind: 'RoleId', value }),
  Permission: (value: Permission): IdBox => ({ kind: 'Permission', value }),
  CustomParameterId: (value: lib.Name): IdBox => ({ kind: 'CustomParameterId', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      DomainId: [lib.DomainId]
      AccountId: [lib.AccountId]
      AssetDefinitionId: [lib.AssetDefinitionId]
      AssetId: [lib.AssetId]
      PeerId: [PeerId]
      TriggerId: [TriggerId]
      RoleId: [RoleId]
      Permission: [Permission]
      CustomParameterId: [lib.Name]
    }>([
      [0, 'DomainId', lib.codecOf(lib.DomainId)],
      [1, 'AccountId', lib.codecOf(lib.AccountId)],
      [2, 'AssetDefinitionId', lib.codecOf(lib.AssetDefinitionId)],
      [3, 'AssetId', lib.codecOf(lib.AssetId)],
      [4, 'PeerId', lib.codecOf(PeerId)],
      [5, 'TriggerId', lib.codecOf(TriggerId)],
      [6, 'RoleId', lib.codecOf(RoleId)],
      [7, 'Permission', lib.codecOf(Permission)],
      [8, 'CustomParameterId', lib.codecOf(lib.Name)],
    ])
    .discriminated(),
}

export interface RepetitionError {
  instruction: InstructionType
  id: IdBox
}
export const RepetitionError: lib.CodecProvider<RepetitionError> = {
  [lib.CodecSymbol]: lib.structCodec<RepetitionError>(['instruction', 'id'], {
    instruction: lib.codecOf(InstructionType),
    id: lib.codecOf(IdBox),
  }),
}

export type MintabilityError = lib.SumTypeKind<'MintUnmintable'> | lib.SumTypeKind<'ForbidMintOnMintable'>
export const MintabilityError = {
  MintUnmintable: Object.freeze<MintabilityError>({ kind: 'MintUnmintable' }),
  ForbidMintOnMintable: Object.freeze<MintabilityError>({ kind: 'ForbidMintOnMintable' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ MintUnmintable: []; ForbidMintOnMintable: [] }>([
      [0, 'MintUnmintable'],
      [1, 'ForbidMintOnMintable'],
    ])
    .discriminated(),
}

export type MathError =
  | lib.SumTypeKind<'Overflow'>
  | lib.SumTypeKind<'NotEnoughQuantity'>
  | lib.SumTypeKind<'DivideByZero'>
  | lib.SumTypeKind<'NegativeValue'>
  | lib.SumTypeKind<'DomainViolation'>
  | lib.SumTypeKind<'Unknown'>
  | lib.SumTypeKindValue<'FixedPointConversion', lib.String>
export const MathError = {
  Overflow: Object.freeze<MathError>({ kind: 'Overflow' }),
  NotEnoughQuantity: Object.freeze<MathError>({ kind: 'NotEnoughQuantity' }),
  DivideByZero: Object.freeze<MathError>({ kind: 'DivideByZero' }),
  NegativeValue: Object.freeze<MathError>({ kind: 'NegativeValue' }),
  DomainViolation: Object.freeze<MathError>({ kind: 'DomainViolation' }),
  Unknown: Object.freeze<MathError>({ kind: 'Unknown' }),
  FixedPointConversion: (value: lib.String): MathError => ({ kind: 'FixedPointConversion', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Overflow: []
      NotEnoughQuantity: []
      DivideByZero: []
      NegativeValue: []
      DomainViolation: []
      Unknown: []
      FixedPointConversion: [lib.String]
    }>([
      [0, 'Overflow'],
      [1, 'NotEnoughQuantity'],
      [2, 'DivideByZero'],
      [3, 'NegativeValue'],
      [4, 'DomainViolation'],
      [5, 'Unknown'],
      [6, 'FixedPointConversion', lib.codecOf(lib.String)],
    ])
    .discriminated(),
}

export type InvalidParameterError = lib.SumTypeKindValue<'Wasm', lib.String> | lib.SumTypeKind<'TimeTriggerInThePast'>
export const InvalidParameterError = {
  Wasm: (value: lib.String): InvalidParameterError => ({ kind: 'Wasm', value }),
  TimeTriggerInThePast: Object.freeze<InvalidParameterError>({ kind: 'TimeTriggerInThePast' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Wasm: [lib.String]; TimeTriggerInThePast: [] }>([
      [0, 'Wasm', lib.codecOf(lib.String)],
      [1, 'TimeTriggerInThePast'],
    ])
    .discriminated(),
}

export type InstructionExecutionError =
  | lib.SumTypeKindValue<'Evaluate', InstructionEvaluationError>
  | lib.SumTypeKindValue<'Query', QueryExecutionFail>
  | lib.SumTypeKindValue<'Conversion', lib.String>
  | lib.SumTypeKindValue<'Find', FindError>
  | lib.SumTypeKindValue<'Repetition', RepetitionError>
  | lib.SumTypeKindValue<'Mintability', MintabilityError>
  | lib.SumTypeKindValue<'Math', MathError>
  | lib.SumTypeKindValue<'InvalidParameter', InvalidParameterError>
  | lib.SumTypeKindValue<'InvariantViolation', lib.String>
export const InstructionExecutionError = {
  Evaluate: {
    Unsupported: {
      Register: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Register,
      }),
      Unregister: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Unregister,
      }),
      Mint: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Mint,
      }),
      Burn: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Burn,
      }),
      Transfer: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Transfer,
      }),
      SetKeyValue: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.SetKeyValue,
      }),
      RemoveKeyValue: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.RemoveKeyValue,
      }),
      Grant: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Grant,
      }),
      Revoke: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Revoke,
      }),
      ExecuteTrigger: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.ExecuteTrigger,
      }),
      SetParameter: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.SetParameter,
      }),
      Upgrade: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Upgrade,
      }),
      Log: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Log,
      }),
      Custom: Object.freeze<InstructionExecutionError>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Custom,
      }),
    },
    PermissionParameter: (value: lib.String): InstructionExecutionError => ({
      kind: 'Evaluate',
      value: InstructionEvaluationError.PermissionParameter(value),
    }),
    Type: {
      AssetType: (value: Mismatch<AssetType>): InstructionExecutionError => ({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Type.AssetType(value),
      }),
      NumericAssetTypeExpected: {
        Numeric: (value: NumericSpec): InstructionExecutionError => ({
          kind: 'Evaluate',
          value: InstructionEvaluationError.Type.NumericAssetTypeExpected.Numeric(value),
        }),
        Store: Object.freeze<InstructionExecutionError>({
          kind: 'Evaluate',
          value: InstructionEvaluationError.Type.NumericAssetTypeExpected.Store,
        }),
      },
    },
  },
  Query: {
    Find: {
      Asset: (value: lib.AssetId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Asset(value),
      }),
      AssetDefinition: (value: lib.AssetDefinitionId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }),
      Account: (value: lib.AccountId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Account(value),
      }),
      Domain: (value: lib.DomainId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Domain(value),
      }),
      MetadataKey: (value: lib.Name): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }),
      Block: (value: lib.HashWrap): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Block(value),
      }),
      Transaction: (value: lib.HashWrap): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Transaction(value),
      }),
      Peer: (value: PeerId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Peer(value),
      }),
      Trigger: (value: TriggerId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Trigger(value),
      }),
      Role: (value: RoleId): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Role(value),
      }),
      Permission: (value: Permission): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Permission(value),
      }),
      PublicKey: (value: lib.PublicKeyWrap): InstructionExecutionError => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.PublicKey(value),
      }),
    },
    Conversion: (value: lib.String): InstructionExecutionError => ({
      kind: 'Query',
      value: QueryExecutionFail.Conversion(value),
    }),
    NotFound: Object.freeze<InstructionExecutionError>({ kind: 'Query', value: QueryExecutionFail.NotFound }),
    CursorMismatch: Object.freeze<InstructionExecutionError>({
      kind: 'Query',
      value: QueryExecutionFail.CursorMismatch,
    }),
    CursorDone: Object.freeze<InstructionExecutionError>({ kind: 'Query', value: QueryExecutionFail.CursorDone }),
    FetchSizeTooBig: Object.freeze<InstructionExecutionError>({
      kind: 'Query',
      value: QueryExecutionFail.FetchSizeTooBig,
    }),
    InvalidSingularParameters: Object.freeze<InstructionExecutionError>({
      kind: 'Query',
      value: QueryExecutionFail.InvalidSingularParameters,
    }),
    CapacityLimit: Object.freeze<InstructionExecutionError>({ kind: 'Query', value: QueryExecutionFail.CapacityLimit }),
  },
  Conversion: (value: lib.String): InstructionExecutionError => ({ kind: 'Conversion', value }),
  Find: {
    Asset: (value: lib.AssetId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Asset(value) }),
    AssetDefinition: (value: lib.AssetDefinitionId): InstructionExecutionError => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }),
    Account: (value: lib.AccountId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Account(value) }),
    Domain: (value: lib.DomainId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Domain(value) }),
    MetadataKey: (value: lib.Name): InstructionExecutionError => ({
      kind: 'Find',
      value: FindError.MetadataKey(value),
    }),
    Block: (value: lib.HashWrap): InstructionExecutionError => ({ kind: 'Find', value: FindError.Block(value) }),
    Transaction: (value: lib.HashWrap): InstructionExecutionError => ({
      kind: 'Find',
      value: FindError.Transaction(value),
    }),
    Peer: (value: PeerId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Peer(value) }),
    Trigger: (value: TriggerId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Trigger(value) }),
    Role: (value: RoleId): InstructionExecutionError => ({ kind: 'Find', value: FindError.Role(value) }),
    Permission: (value: Permission): InstructionExecutionError => ({
      kind: 'Find',
      value: FindError.Permission(value),
    }),
    PublicKey: (value: lib.PublicKeyWrap): InstructionExecutionError => ({
      kind: 'Find',
      value: FindError.PublicKey(value),
    }),
  },
  Repetition: (value: RepetitionError): InstructionExecutionError => ({ kind: 'Repetition', value }),
  Mintability: {
    MintUnmintable: Object.freeze<InstructionExecutionError>({
      kind: 'Mintability',
      value: MintabilityError.MintUnmintable,
    }),
    ForbidMintOnMintable: Object.freeze<InstructionExecutionError>({
      kind: 'Mintability',
      value: MintabilityError.ForbidMintOnMintable,
    }),
  },
  Math: {
    Overflow: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.Overflow }),
    NotEnoughQuantity: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.NotEnoughQuantity }),
    DivideByZero: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.DivideByZero }),
    NegativeValue: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.NegativeValue }),
    DomainViolation: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.DomainViolation }),
    Unknown: Object.freeze<InstructionExecutionError>({ kind: 'Math', value: MathError.Unknown }),
    FixedPointConversion: (value: lib.String): InstructionExecutionError => ({
      kind: 'Math',
      value: MathError.FixedPointConversion(value),
    }),
  },
  InvalidParameter: {
    Wasm: (value: lib.String): InstructionExecutionError => ({
      kind: 'InvalidParameter',
      value: InvalidParameterError.Wasm(value),
    }),
    TimeTriggerInThePast: Object.freeze<InstructionExecutionError>({
      kind: 'InvalidParameter',
      value: InvalidParameterError.TimeTriggerInThePast,
    }),
  },
  InvariantViolation: (value: lib.String): InstructionExecutionError => ({ kind: 'InvariantViolation', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Evaluate: [InstructionEvaluationError]
      Query: [QueryExecutionFail]
      Conversion: [lib.String]
      Find: [FindError]
      Repetition: [RepetitionError]
      Mintability: [MintabilityError]
      Math: [MathError]
      InvalidParameter: [InvalidParameterError]
      InvariantViolation: [lib.String]
    }>([
      [0, 'Evaluate', lib.codecOf(InstructionEvaluationError)],
      [1, 'Query', lib.codecOf(QueryExecutionFail)],
      [2, 'Conversion', lib.codecOf(lib.String)],
      [3, 'Find', lib.codecOf(FindError)],
      [4, 'Repetition', lib.codecOf(RepetitionError)],
      [5, 'Mintability', lib.codecOf(MintabilityError)],
      [6, 'Math', lib.codecOf(MathError)],
      [7, 'InvalidParameter', lib.codecOf(InvalidParameterError)],
      [8, 'InvariantViolation', lib.codecOf(lib.String)],
    ])
    .discriminated(),
}

export type ValidationFail =
  | lib.SumTypeKindValue<'NotPermitted', lib.String>
  | lib.SumTypeKindValue<'InstructionFailed', InstructionExecutionError>
  | lib.SumTypeKindValue<'QueryFailed', QueryExecutionFail>
  | lib.SumTypeKind<'TooComplex'>
  | lib.SumTypeKind<'InternalError'>
export const ValidationFail = {
  NotPermitted: (value: lib.String): ValidationFail => ({ kind: 'NotPermitted', value }),
  InstructionFailed: {
    Evaluate: {
      Unsupported: {
        Register: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Register,
        }),
        Unregister: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Unregister,
        }),
        Mint: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Mint,
        }),
        Burn: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Burn,
        }),
        Transfer: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Transfer,
        }),
        SetKeyValue: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.SetKeyValue,
        }),
        RemoveKeyValue: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.RemoveKeyValue,
        }),
        Grant: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Grant,
        }),
        Revoke: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Revoke,
        }),
        ExecuteTrigger: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.ExecuteTrigger,
        }),
        SetParameter: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.SetParameter,
        }),
        Upgrade: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Upgrade,
        }),
        Log: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Log,
        }),
        Custom: Object.freeze<ValidationFail>({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Custom,
        }),
      },
      PermissionParameter: (value: lib.String): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Evaluate.PermissionParameter(value),
      }),
      Type: {
        AssetType: (value: Mismatch<AssetType>): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Type.AssetType(value),
        }),
        NumericAssetTypeExpected: {
          Numeric: (value: NumericSpec): ValidationFail => ({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Numeric(value),
          }),
          Store: Object.freeze<ValidationFail>({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Store,
          }),
        },
      },
    },
    Query: {
      Find: {
        Asset: (value: lib.AssetId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Asset(value),
        }),
        AssetDefinition: (value: lib.AssetDefinitionId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.AssetDefinition(value),
        }),
        Account: (value: lib.AccountId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Account(value),
        }),
        Domain: (value: lib.DomainId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Domain(value),
        }),
        MetadataKey: (value: lib.Name): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.MetadataKey(value),
        }),
        Block: (value: lib.HashWrap): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Block(value),
        }),
        Transaction: (value: lib.HashWrap): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Transaction(value),
        }),
        Peer: (value: PeerId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Peer(value),
        }),
        Trigger: (value: TriggerId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Trigger(value),
        }),
        Role: (value: RoleId): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Role(value),
        }),
        Permission: (value: Permission): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Permission(value),
        }),
        PublicKey: (value: lib.PublicKeyWrap): ValidationFail => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.PublicKey(value),
        }),
      },
      Conversion: (value: lib.String): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.Conversion(value),
      }),
      NotFound: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.NotFound,
      }),
      CursorMismatch: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CursorMismatch,
      }),
      CursorDone: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CursorDone,
      }),
      FetchSizeTooBig: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.FetchSizeTooBig,
      }),
      InvalidSingularParameters: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.InvalidSingularParameters,
      }),
      CapacityLimit: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CapacityLimit,
      }),
    },
    Conversion: (value: lib.String): ValidationFail => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Conversion(value),
    }),
    Find: {
      Asset: (value: lib.AssetId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Asset(value),
      }),
      AssetDefinition: (value: lib.AssetDefinitionId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.AssetDefinition(value),
      }),
      Account: (value: lib.AccountId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Account(value),
      }),
      Domain: (value: lib.DomainId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Domain(value),
      }),
      MetadataKey: (value: lib.Name): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.MetadataKey(value),
      }),
      Block: (value: lib.HashWrap): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Block(value),
      }),
      Transaction: (value: lib.HashWrap): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Transaction(value),
      }),
      Peer: (value: PeerId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Peer(value),
      }),
      Trigger: (value: TriggerId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Trigger(value),
      }),
      Role: (value: RoleId): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Role(value),
      }),
      Permission: (value: Permission): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Permission(value),
      }),
      PublicKey: (value: lib.PublicKeyWrap): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.PublicKey(value),
      }),
    },
    Repetition: (value: RepetitionError): ValidationFail => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Repetition(value),
    }),
    Mintability: {
      MintUnmintable: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Mintability.MintUnmintable,
      }),
      ForbidMintOnMintable: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Mintability.ForbidMintOnMintable,
      }),
    },
    Math: {
      Overflow: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Overflow,
      }),
      NotEnoughQuantity: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.NotEnoughQuantity,
      }),
      DivideByZero: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.DivideByZero,
      }),
      NegativeValue: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.NegativeValue,
      }),
      DomainViolation: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.DomainViolation,
      }),
      Unknown: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Unknown,
      }),
      FixedPointConversion: (value: lib.String): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.FixedPointConversion(value),
      }),
    },
    InvalidParameter: {
      Wasm: (value: lib.String): ValidationFail => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.InvalidParameter.Wasm(value),
      }),
      TimeTriggerInThePast: Object.freeze<ValidationFail>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.InvalidParameter.TimeTriggerInThePast,
      }),
    },
    InvariantViolation: (value: lib.String): ValidationFail => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.InvariantViolation(value),
    }),
  },
  QueryFailed: {
    Find: {
      Asset: (value: lib.AssetId): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Asset(value),
      }),
      AssetDefinition: (value: lib.AssetDefinitionId): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }),
      Account: (value: lib.AccountId): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Account(value),
      }),
      Domain: (value: lib.DomainId): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Domain(value),
      }),
      MetadataKey: (value: lib.Name): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }),
      Block: (value: lib.HashWrap): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Block(value),
      }),
      Transaction: (value: lib.HashWrap): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Transaction(value),
      }),
      Peer: (value: PeerId): ValidationFail => ({ kind: 'QueryFailed', value: QueryExecutionFail.Find.Peer(value) }),
      Trigger: (value: TriggerId): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Trigger(value),
      }),
      Role: (value: RoleId): ValidationFail => ({ kind: 'QueryFailed', value: QueryExecutionFail.Find.Role(value) }),
      Permission: (value: Permission): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Permission(value),
      }),
      PublicKey: (value: lib.PublicKeyWrap): ValidationFail => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.PublicKey(value),
      }),
    },
    Conversion: (value: lib.String): ValidationFail => ({
      kind: 'QueryFailed',
      value: QueryExecutionFail.Conversion(value),
    }),
    NotFound: Object.freeze<ValidationFail>({ kind: 'QueryFailed', value: QueryExecutionFail.NotFound }),
    CursorMismatch: Object.freeze<ValidationFail>({ kind: 'QueryFailed', value: QueryExecutionFail.CursorMismatch }),
    CursorDone: Object.freeze<ValidationFail>({ kind: 'QueryFailed', value: QueryExecutionFail.CursorDone }),
    FetchSizeTooBig: Object.freeze<ValidationFail>({ kind: 'QueryFailed', value: QueryExecutionFail.FetchSizeTooBig }),
    InvalidSingularParameters: Object.freeze<ValidationFail>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.InvalidSingularParameters,
    }),
    CapacityLimit: Object.freeze<ValidationFail>({ kind: 'QueryFailed', value: QueryExecutionFail.CapacityLimit }),
  },
  TooComplex: Object.freeze<ValidationFail>({ kind: 'TooComplex' }),
  InternalError: Object.freeze<ValidationFail>({ kind: 'InternalError' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      NotPermitted: [lib.String]
      InstructionFailed: [InstructionExecutionError]
      QueryFailed: [QueryExecutionFail]
      TooComplex: []
      InternalError: []
    }>([
      [0, 'NotPermitted', lib.codecOf(lib.String)],
      [1, 'InstructionFailed', lib.codecOf(InstructionExecutionError)],
      [2, 'QueryFailed', lib.codecOf(QueryExecutionFail)],
      [3, 'TooComplex'],
      [4, 'InternalError'],
    ])
    .discriminated(),
}

export interface InstructionExecutionFail {
  instruction: InstructionBox
  reason: lib.String
}
export const InstructionExecutionFail: lib.CodecProvider<InstructionExecutionFail> = {
  [lib.CodecSymbol]: lib.structCodec<InstructionExecutionFail>(['instruction', 'reason'], {
    instruction: lib.lazyCodec(() => lib.codecOf(InstructionBox)),
    reason: lib.codecOf(lib.String),
  }),
}

export interface WasmExecutionFail {
  reason: lib.String
}
export const WasmExecutionFail: lib.CodecProvider<WasmExecutionFail> = {
  [lib.CodecSymbol]: lib.structCodec<WasmExecutionFail>(['reason'], { reason: lib.codecOf(lib.String) }),
}

export type TransactionRejectionReason =
  | lib.SumTypeKindValue<'AccountDoesNotExist', FindError>
  | lib.SumTypeKindValue<'LimitCheck', TransactionLimitError>
  | lib.SumTypeKindValue<'Validation', ValidationFail>
  | lib.SumTypeKindValue<'InstructionExecution', InstructionExecutionFail>
  | lib.SumTypeKindValue<'WasmExecution', WasmExecutionFail>
export const TransactionRejectionReason = {
  AccountDoesNotExist: {
    Asset: (value: lib.AssetId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Asset(value),
    }),
    AssetDefinition: (value: lib.AssetDefinitionId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.AssetDefinition(value),
    }),
    Account: (value: lib.AccountId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Account(value),
    }),
    Domain: (value: lib.DomainId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Domain(value),
    }),
    MetadataKey: (value: lib.Name): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.MetadataKey(value),
    }),
    Block: (value: lib.HashWrap): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Block(value),
    }),
    Transaction: (value: lib.HashWrap): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Transaction(value),
    }),
    Peer: (value: PeerId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Peer(value),
    }),
    Trigger: (value: TriggerId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Trigger(value),
    }),
    Role: (value: RoleId): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Role(value),
    }),
    Permission: (value: Permission): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Permission(value),
    }),
    PublicKey: (value: lib.PublicKeyWrap): TransactionRejectionReason => ({
      kind: 'AccountDoesNotExist',
      value: FindError.PublicKey(value),
    }),
  },
  LimitCheck: (value: TransactionLimitError): TransactionRejectionReason => ({ kind: 'LimitCheck', value }),
  Validation: {
    NotPermitted: (value: lib.String): TransactionRejectionReason => ({
      kind: 'Validation',
      value: ValidationFail.NotPermitted(value),
    }),
    InstructionFailed: {
      Evaluate: {
        Unsupported: {
          Register: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Register,
          }),
          Unregister: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Unregister,
          }),
          Mint: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Mint,
          }),
          Burn: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Burn,
          }),
          Transfer: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Transfer,
          }),
          SetKeyValue: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.SetKeyValue,
          }),
          RemoveKeyValue: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue,
          }),
          Grant: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Grant,
          }),
          Revoke: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Revoke,
          }),
          ExecuteTrigger: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger,
          }),
          SetParameter: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.SetParameter,
          }),
          Upgrade: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Upgrade,
          }),
          Log: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Log,
          }),
          Custom: Object.freeze<TransactionRejectionReason>({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Custom,
          }),
        },
        PermissionParameter: (value: lib.String): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Evaluate.PermissionParameter(value),
        }),
        Type: {
          AssetType: (value: Mismatch<AssetType>): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Type.AssetType(value),
          }),
          NumericAssetTypeExpected: {
            Numeric: (value: NumericSpec): TransactionRejectionReason => ({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric(value),
            }),
            Store: Object.freeze<TransactionRejectionReason>({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store,
            }),
          },
        },
      },
      Query: {
        Find: {
          Asset: (value: lib.AssetId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Asset(value),
          }),
          AssetDefinition: (value: lib.AssetDefinitionId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.AssetDefinition(value),
          }),
          Account: (value: lib.AccountId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Account(value),
          }),
          Domain: (value: lib.DomainId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Domain(value),
          }),
          MetadataKey: (value: lib.Name): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.MetadataKey(value),
          }),
          Block: (value: lib.HashWrap): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Block(value),
          }),
          Transaction: (value: lib.HashWrap): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Transaction(value),
          }),
          Peer: (value: PeerId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Peer(value),
          }),
          Trigger: (value: TriggerId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Trigger(value),
          }),
          Role: (value: RoleId): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Role(value),
          }),
          Permission: (value: Permission): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Permission(value),
          }),
          PublicKey: (value: lib.PublicKeyWrap): TransactionRejectionReason => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.PublicKey(value),
          }),
        },
        Conversion: (value: lib.String): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.Conversion(value),
        }),
        NotFound: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.NotFound,
        }),
        CursorMismatch: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CursorMismatch,
        }),
        CursorDone: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CursorDone,
        }),
        FetchSizeTooBig: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.FetchSizeTooBig,
        }),
        InvalidSingularParameters: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.InvalidSingularParameters,
        }),
        CapacityLimit: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CapacityLimit,
        }),
      },
      Conversion: (value: lib.String): TransactionRejectionReason => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Conversion(value),
      }),
      Find: {
        Asset: (value: lib.AssetId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Asset(value),
        }),
        AssetDefinition: (value: lib.AssetDefinitionId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.AssetDefinition(value),
        }),
        Account: (value: lib.AccountId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Account(value),
        }),
        Domain: (value: lib.DomainId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Domain(value),
        }),
        MetadataKey: (value: lib.Name): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.MetadataKey(value),
        }),
        Block: (value: lib.HashWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Block(value),
        }),
        Transaction: (value: lib.HashWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Transaction(value),
        }),
        Peer: (value: PeerId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Peer(value),
        }),
        Trigger: (value: TriggerId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Trigger(value),
        }),
        Role: (value: RoleId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Role(value),
        }),
        Permission: (value: Permission): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Permission(value),
        }),
        PublicKey: (value: lib.PublicKeyWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.PublicKey(value),
        }),
      },
      Repetition: (value: RepetitionError): TransactionRejectionReason => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Repetition(value),
      }),
      Mintability: {
        MintUnmintable: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Mintability.MintUnmintable,
        }),
        ForbidMintOnMintable: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Mintability.ForbidMintOnMintable,
        }),
      },
      Math: {
        Overflow: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.Overflow,
        }),
        NotEnoughQuantity: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.NotEnoughQuantity,
        }),
        DivideByZero: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.DivideByZero,
        }),
        NegativeValue: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.NegativeValue,
        }),
        DomainViolation: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.DomainViolation,
        }),
        Unknown: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.Unknown,
        }),
        FixedPointConversion: (value: lib.String): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.FixedPointConversion(value),
        }),
      },
      InvalidParameter: {
        Wasm: (value: lib.String): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.InvalidParameter.Wasm(value),
        }),
        TimeTriggerInThePast: Object.freeze<TransactionRejectionReason>({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.InvalidParameter.TimeTriggerInThePast,
        }),
      },
      InvariantViolation: (value: lib.String): TransactionRejectionReason => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.InvariantViolation(value),
      }),
    },
    QueryFailed: {
      Find: {
        Asset: (value: lib.AssetId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Asset(value),
        }),
        AssetDefinition: (value: lib.AssetDefinitionId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.AssetDefinition(value),
        }),
        Account: (value: lib.AccountId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Account(value),
        }),
        Domain: (value: lib.DomainId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Domain(value),
        }),
        MetadataKey: (value: lib.Name): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.MetadataKey(value),
        }),
        Block: (value: lib.HashWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Block(value),
        }),
        Transaction: (value: lib.HashWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Transaction(value),
        }),
        Peer: (value: PeerId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Peer(value),
        }),
        Trigger: (value: TriggerId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Trigger(value),
        }),
        Role: (value: RoleId): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Role(value),
        }),
        Permission: (value: Permission): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Permission(value),
        }),
        PublicKey: (value: lib.PublicKeyWrap): TransactionRejectionReason => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.PublicKey(value),
        }),
      },
      Conversion: (value: lib.String): TransactionRejectionReason => ({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.Conversion(value),
      }),
      NotFound: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.NotFound,
      }),
      CursorMismatch: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CursorMismatch,
      }),
      CursorDone: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CursorDone,
      }),
      FetchSizeTooBig: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.FetchSizeTooBig,
      }),
      InvalidSingularParameters: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.InvalidSingularParameters,
      }),
      CapacityLimit: Object.freeze<TransactionRejectionReason>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CapacityLimit,
      }),
    },
    TooComplex: Object.freeze<TransactionRejectionReason>({ kind: 'Validation', value: ValidationFail.TooComplex }),
    InternalError: Object.freeze<TransactionRejectionReason>({
      kind: 'Validation',
      value: ValidationFail.InternalError,
    }),
  },
  InstructionExecution: (value: InstructionExecutionFail): TransactionRejectionReason => ({
    kind: 'InstructionExecution',
    value,
  }),
  WasmExecution: (value: WasmExecutionFail): TransactionRejectionReason => ({ kind: 'WasmExecution', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      AccountDoesNotExist: [FindError]
      LimitCheck: [TransactionLimitError]
      Validation: [ValidationFail]
      InstructionExecution: [InstructionExecutionFail]
      WasmExecution: [WasmExecutionFail]
    }>([
      [0, 'AccountDoesNotExist', lib.codecOf(FindError)],
      [1, 'LimitCheck', lib.codecOf(TransactionLimitError)],
      [2, 'Validation', lib.codecOf(ValidationFail)],
      [3, 'InstructionExecution', lib.codecOf(InstructionExecutionFail)],
      [4, 'WasmExecution', lib.codecOf(WasmExecutionFail)],
    ])
    .discriminated(),
}

export type TransactionStatus =
  | lib.SumTypeKind<'Queued'>
  | lib.SumTypeKind<'Expired'>
  | lib.SumTypeKind<'Approved'>
  | lib.SumTypeKindValue<'Rejected', TransactionRejectionReason>
export const TransactionStatus = {
  Queued: Object.freeze<TransactionStatus>({ kind: 'Queued' }),
  Expired: Object.freeze<TransactionStatus>({ kind: 'Expired' }),
  Approved: Object.freeze<TransactionStatus>({ kind: 'Approved' }),
  Rejected: {
    AccountDoesNotExist: {
      Asset: (value: lib.AssetId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Asset(value),
      }),
      AssetDefinition: (value: lib.AssetDefinitionId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.AssetDefinition(value),
      }),
      Account: (value: lib.AccountId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Account(value),
      }),
      Domain: (value: lib.DomainId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Domain(value),
      }),
      MetadataKey: (value: lib.Name): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.MetadataKey(value),
      }),
      Block: (value: lib.HashWrap): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Block(value),
      }),
      Transaction: (value: lib.HashWrap): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Transaction(value),
      }),
      Peer: (value: PeerId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Peer(value),
      }),
      Trigger: (value: TriggerId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Trigger(value),
      }),
      Role: (value: RoleId): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Role(value),
      }),
      Permission: (value: Permission): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Permission(value),
      }),
      PublicKey: (value: lib.PublicKeyWrap): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.PublicKey(value),
      }),
    },
    LimitCheck: (value: TransactionLimitError): TransactionStatus => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.LimitCheck(value),
    }),
    Validation: {
      NotPermitted: (value: lib.String): TransactionStatus => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.NotPermitted(value),
      }),
      InstructionFailed: {
        Evaluate: {
          Unsupported: {
            Register: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Register,
            }),
            Unregister: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Unregister,
            }),
            Mint: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Mint,
            }),
            Burn: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Burn,
            }),
            Transfer: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Transfer,
            }),
            SetKeyValue: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetKeyValue,
            }),
            RemoveKeyValue: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue,
            }),
            Grant: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Grant,
            }),
            Revoke: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Revoke,
            }),
            ExecuteTrigger: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger,
            }),
            SetParameter: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetParameter,
            }),
            Upgrade: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Upgrade,
            }),
            Log: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Log,
            }),
            Custom: Object.freeze<TransactionStatus>({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Custom,
            }),
          },
          PermissionParameter: (value: lib.String): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.PermissionParameter(value),
          }),
          Type: {
            AssetType: (value: Mismatch<AssetType>): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.AssetType(value),
            }),
            NumericAssetTypeExpected: {
              Numeric: (value: NumericSpec): TransactionStatus => ({
                kind: 'Rejected',
                value:
                  TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric(
                    value,
                  ),
              }),
              Store: Object.freeze<TransactionStatus>({
                kind: 'Rejected',
                value:
                  TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store,
              }),
            },
          },
        },
        Query: {
          Find: {
            Asset: (value: lib.AssetId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Asset(value),
            }),
            AssetDefinition: (value: lib.AssetDefinitionId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.AssetDefinition(value),
            }),
            Account: (value: lib.AccountId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Account(value),
            }),
            Domain: (value: lib.DomainId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Domain(value),
            }),
            MetadataKey: (value: lib.Name): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.MetadataKey(value),
            }),
            Block: (value: lib.HashWrap): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Block(value),
            }),
            Transaction: (value: lib.HashWrap): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Transaction(value),
            }),
            Peer: (value: PeerId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Peer(value),
            }),
            Trigger: (value: TriggerId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Trigger(value),
            }),
            Role: (value: RoleId): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Role(value),
            }),
            Permission: (value: Permission): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Permission(value),
            }),
            PublicKey: (value: lib.PublicKeyWrap): TransactionStatus => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.PublicKey(value),
            }),
          },
          Conversion: (value: lib.String): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.Conversion(value),
          }),
          NotFound: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.NotFound,
          }),
          CursorMismatch: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.CursorMismatch,
          }),
          CursorDone: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.CursorDone,
          }),
          FetchSizeTooBig: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.FetchSizeTooBig,
          }),
          InvalidSingularParameters: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.InvalidSingularParameters,
          }),
          CapacityLimit: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.CapacityLimit,
          }),
        },
        Conversion: (value: lib.String): TransactionStatus => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed.Conversion(value),
        }),
        Find: {
          Asset: (value: lib.AssetId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Asset(value),
          }),
          AssetDefinition: (value: lib.AssetDefinitionId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.AssetDefinition(value),
          }),
          Account: (value: lib.AccountId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Account(value),
          }),
          Domain: (value: lib.DomainId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Domain(value),
          }),
          MetadataKey: (value: lib.Name): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.MetadataKey(value),
          }),
          Block: (value: lib.HashWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Block(value),
          }),
          Transaction: (value: lib.HashWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Transaction(value),
          }),
          Peer: (value: PeerId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Peer(value),
          }),
          Trigger: (value: TriggerId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Trigger(value),
          }),
          Role: (value: RoleId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Role(value),
          }),
          Permission: (value: Permission): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Permission(value),
          }),
          PublicKey: (value: lib.PublicKeyWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.PublicKey(value),
          }),
        },
        Repetition: (value: RepetitionError): TransactionStatus => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed.Repetition(value),
        }),
        Mintability: {
          MintUnmintable: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Mintability.MintUnmintable,
          }),
          ForbidMintOnMintable: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Mintability.ForbidMintOnMintable,
          }),
        },
        Math: {
          Overflow: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.Overflow,
          }),
          NotEnoughQuantity: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.NotEnoughQuantity,
          }),
          DivideByZero: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.DivideByZero,
          }),
          NegativeValue: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.NegativeValue,
          }),
          DomainViolation: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.DomainViolation,
          }),
          Unknown: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.Unknown,
          }),
          FixedPointConversion: (value: lib.String): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.FixedPointConversion(value),
          }),
        },
        InvalidParameter: {
          Wasm: (value: lib.String): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.Wasm(value),
          }),
          TimeTriggerInThePast: Object.freeze<TransactionStatus>({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.TimeTriggerInThePast,
          }),
        },
        InvariantViolation: (value: lib.String): TransactionStatus => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed.InvariantViolation(value),
        }),
      },
      QueryFailed: {
        Find: {
          Asset: (value: lib.AssetId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Asset(value),
          }),
          AssetDefinition: (value: lib.AssetDefinitionId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.AssetDefinition(value),
          }),
          Account: (value: lib.AccountId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Account(value),
          }),
          Domain: (value: lib.DomainId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Domain(value),
          }),
          MetadataKey: (value: lib.Name): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.MetadataKey(value),
          }),
          Block: (value: lib.HashWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Block(value),
          }),
          Transaction: (value: lib.HashWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Transaction(value),
          }),
          Peer: (value: PeerId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Peer(value),
          }),
          Trigger: (value: TriggerId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Trigger(value),
          }),
          Role: (value: RoleId): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Role(value),
          }),
          Permission: (value: Permission): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Permission(value),
          }),
          PublicKey: (value: lib.PublicKeyWrap): TransactionStatus => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.PublicKey(value),
          }),
        },
        Conversion: (value: lib.String): TransactionStatus => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.Conversion(value),
        }),
        NotFound: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.NotFound,
        }),
        CursorMismatch: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CursorMismatch,
        }),
        CursorDone: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CursorDone,
        }),
        FetchSizeTooBig: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.FetchSizeTooBig,
        }),
        InvalidSingularParameters: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.InvalidSingularParameters,
        }),
        CapacityLimit: Object.freeze<TransactionStatus>({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CapacityLimit,
        }),
      },
      TooComplex: Object.freeze<TransactionStatus>({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.TooComplex,
      }),
      InternalError: Object.freeze<TransactionStatus>({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.InternalError,
      }),
    },
    InstructionExecution: (value: InstructionExecutionFail): TransactionStatus => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.InstructionExecution(value),
    }),
    WasmExecution: (value: WasmExecutionFail): TransactionStatus => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.WasmExecution(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Queued: []; Expired: []; Approved: []; Rejected: [TransactionRejectionReason] }>([
      [0, 'Queued'],
      [1, 'Expired'],
      [2, 'Approved'],
      [3, 'Rejected', lib.codecOf(TransactionRejectionReason)],
    ])
    .discriminated(),
}

export interface TransactionEventFilter {
  hash: lib.Option<lib.HashWrap>
  blockHeight: lib.Option<lib.Option<lib.U64>>
  status: lib.Option<TransactionStatus>
}
export const TransactionEventFilter: lib.CodecProvider<TransactionEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionEventFilter>(['hash', 'blockHeight', 'status'], {
    hash: lib.codecOf(lib.Option.with(lib.codecOf(lib.HashWrap))),
    blockHeight: lib.codecOf(lib.Option.with(lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))))),
    status: lib.codecOf(lib.Option.with(lib.codecOf(TransactionStatus))),
  }),
}

export type BlockRejectionReason = lib.SumTypeKind<'ConsensusBlockRejection'>
export const BlockRejectionReason = {
  ConsensusBlockRejection: Object.freeze<BlockRejectionReason>({ kind: 'ConsensusBlockRejection' }),
  [lib.CodecSymbol]: lib.enumCodec<{ ConsensusBlockRejection: [] }>([[0, 'ConsensusBlockRejection']]).discriminated(),
}

export type BlockStatus =
  | lib.SumTypeKind<'Created'>
  | lib.SumTypeKind<'Approved'>
  | lib.SumTypeKindValue<'Rejected', BlockRejectionReason>
  | lib.SumTypeKind<'Committed'>
  | lib.SumTypeKind<'Applied'>
export const BlockStatus = {
  Created: Object.freeze<BlockStatus>({ kind: 'Created' }),
  Approved: Object.freeze<BlockStatus>({ kind: 'Approved' }),
  Rejected: {
    ConsensusBlockRejection: Object.freeze<BlockStatus>({
      kind: 'Rejected',
      value: BlockRejectionReason.ConsensusBlockRejection,
    }),
  },
  Committed: Object.freeze<BlockStatus>({ kind: 'Committed' }),
  Applied: Object.freeze<BlockStatus>({ kind: 'Applied' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Created: []; Approved: []; Rejected: [BlockRejectionReason]; Committed: []; Applied: [] }>([
      [0, 'Created'],
      [1, 'Approved'],
      [2, 'Rejected', lib.codecOf(BlockRejectionReason)],
      [3, 'Committed'],
      [4, 'Applied'],
    ])
    .discriminated(),
}

export interface BlockEventFilter {
  height: lib.Option<lib.U64>
  status: lib.Option<BlockStatus>
}
export const BlockEventFilter: lib.CodecProvider<BlockEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<BlockEventFilter>(['height', 'status'], {
    height: lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))),
    status: lib.codecOf(lib.Option.with(lib.codecOf(BlockStatus))),
  }),
}

export type PipelineEventFilterBox =
  | lib.SumTypeKindValue<'Transaction', TransactionEventFilter>
  | lib.SumTypeKindValue<'Block', BlockEventFilter>
export const PipelineEventFilterBox = {
  Transaction: (value: TransactionEventFilter): PipelineEventFilterBox => ({ kind: 'Transaction', value }),
  Block: (value: BlockEventFilter): PipelineEventFilterBox => ({ kind: 'Block', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Transaction: [TransactionEventFilter]; Block: [BlockEventFilter] }>([
      [0, 'Transaction', lib.codecOf(TransactionEventFilter)],
      [1, 'Block', lib.codecOf(BlockEventFilter)],
    ])
    .discriminated(),
}

export type PeerEventSet = Set<'Added' | 'Removed'>
export const PeerEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<PeerEventSet extends Set<infer T> ? T : never>({
    Added: 1,
    Removed: 2,
  }) satisfies lib.Codec<PeerEventSet>,
}

export interface PeerEventFilter {
  idMatcher: lib.Option<PeerId>
  eventSet: PeerEventSet
}
export const PeerEventFilter: lib.CodecProvider<PeerEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<PeerEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(PeerId))),
    eventSet: lib.codecOf(PeerEventSet),
  }),
}

export type DomainEventSet = Set<
  'Created' | 'Deleted' | 'AnyAssetDefinition' | 'AnyAccount' | 'MetadataInserted' | 'MetadataRemoved' | 'OwnerChanged'
>
export const DomainEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<DomainEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    AnyAssetDefinition: 4,
    AnyAccount: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
    OwnerChanged: 64,
  }) satisfies lib.Codec<DomainEventSet>,
}

export interface DomainEventFilter {
  idMatcher: lib.Option<lib.DomainId>
  eventSet: DomainEventSet
}
export const DomainEventFilter: lib.CodecProvider<DomainEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<DomainEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(lib.DomainId))),
    eventSet: lib.codecOf(DomainEventSet),
  }),
}

export type AssetEventSet = Set<'Created' | 'Deleted' | 'Added' | 'Removed' | 'MetadataInserted' | 'MetadataRemoved'>
export const AssetEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<AssetEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    Added: 4,
    Removed: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
  }) satisfies lib.Codec<AssetEventSet>,
}

export interface AssetEventFilter {
  idMatcher: lib.Option<lib.AssetId>
  eventSet: AssetEventSet
}
export const AssetEventFilter: lib.CodecProvider<AssetEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<AssetEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(lib.AssetId))),
    eventSet: lib.codecOf(AssetEventSet),
  }),
}

export type AssetDefinitionEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'MetadataInserted'
  | 'MetadataRemoved'
  | 'MintabilityChanged'
  | 'TotalQuantityChanged'
  | 'OwnerChanged'
>
export const AssetDefinitionEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<AssetDefinitionEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    MetadataInserted: 4,
    MetadataRemoved: 8,
    MintabilityChanged: 16,
    TotalQuantityChanged: 32,
    OwnerChanged: 64,
  }) satisfies lib.Codec<AssetDefinitionEventSet>,
}

export interface AssetDefinitionEventFilter {
  idMatcher: lib.Option<lib.AssetDefinitionId>
  eventSet: AssetDefinitionEventSet
}
export const AssetDefinitionEventFilter: lib.CodecProvider<AssetDefinitionEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinitionEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(lib.AssetDefinitionId))),
    eventSet: lib.codecOf(AssetDefinitionEventSet),
  }),
}

export type TriggerEventSet = Set<
  'Created' | 'Deleted' | 'Extended' | 'Shortened' | 'MetadataInserted' | 'MetadataRemoved'
>
export const TriggerEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<TriggerEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    Extended: 4,
    Shortened: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
  }) satisfies lib.Codec<TriggerEventSet>,
}

export interface TriggerEventFilter {
  idMatcher: lib.Option<TriggerId>
  eventSet: TriggerEventSet
}
export const TriggerEventFilter: lib.CodecProvider<TriggerEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(TriggerId))),
    eventSet: lib.codecOf(TriggerEventSet),
  }),
}

export type RoleEventSet = Set<'Created' | 'Deleted' | 'PermissionAdded' | 'PermissionRemoved'>
export const RoleEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<RoleEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    PermissionAdded: 4,
    PermissionRemoved: 8,
  }) satisfies lib.Codec<RoleEventSet>,
}

export interface RoleEventFilter {
  idMatcher: lib.Option<RoleId>
  eventSet: RoleEventSet
}
export const RoleEventFilter: lib.CodecProvider<RoleEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<RoleEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.codecOf(lib.Option.with(lib.codecOf(RoleId))),
    eventSet: lib.codecOf(RoleEventSet),
  }),
}

export type ConfigurationEventSet = Set<'Changed'>
export const ConfigurationEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<ConfigurationEventSet extends Set<infer T> ? T : never>({
    Changed: 1,
  }) satisfies lib.Codec<ConfigurationEventSet>,
}

export interface ConfigurationEventFilter {
  eventSet: ConfigurationEventSet
}
export const ConfigurationEventFilter: lib.CodecProvider<ConfigurationEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<ConfigurationEventFilter>(['eventSet'], {
    eventSet: lib.codecOf(ConfigurationEventSet),
  }),
}

export type ExecutorEventSet = Set<'Upgraded'>
export const ExecutorEventSet = {
  [lib.CodecSymbol]: lib.bitmapCodec<ExecutorEventSet extends Set<infer T> ? T : never>({
    Upgraded: 1,
  }) satisfies lib.Codec<ExecutorEventSet>,
}

export interface ExecutorEventFilter {
  eventSet: ExecutorEventSet
}
export const ExecutorEventFilter: lib.CodecProvider<ExecutorEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<ExecutorEventFilter>(['eventSet'], { eventSet: lib.codecOf(ExecutorEventSet) }),
}

export type DataEventFilter =
  | lib.SumTypeKind<'Any'>
  | lib.SumTypeKindValue<'Peer', PeerEventFilter>
  | lib.SumTypeKindValue<'Domain', DomainEventFilter>
  | lib.SumTypeKindValue<'Account', AccountEventFilter>
  | lib.SumTypeKindValue<'Asset', AssetEventFilter>
  | lib.SumTypeKindValue<'AssetDefinition', AssetDefinitionEventFilter>
  | lib.SumTypeKindValue<'Trigger', TriggerEventFilter>
  | lib.SumTypeKindValue<'Role', RoleEventFilter>
  | lib.SumTypeKindValue<'Configuration', ConfigurationEventFilter>
  | lib.SumTypeKindValue<'Executor', ExecutorEventFilter>
export const DataEventFilter = {
  Any: Object.freeze<DataEventFilter>({ kind: 'Any' }),
  Peer: (value: PeerEventFilter): DataEventFilter => ({ kind: 'Peer', value }),
  Domain: (value: DomainEventFilter): DataEventFilter => ({ kind: 'Domain', value }),
  Account: (value: AccountEventFilter): DataEventFilter => ({ kind: 'Account', value }),
  Asset: (value: AssetEventFilter): DataEventFilter => ({ kind: 'Asset', value }),
  AssetDefinition: (value: AssetDefinitionEventFilter): DataEventFilter => ({ kind: 'AssetDefinition', value }),
  Trigger: (value: TriggerEventFilter): DataEventFilter => ({ kind: 'Trigger', value }),
  Role: (value: RoleEventFilter): DataEventFilter => ({ kind: 'Role', value }),
  Configuration: (value: ConfigurationEventFilter): DataEventFilter => ({ kind: 'Configuration', value }),
  Executor: (value: ExecutorEventFilter): DataEventFilter => ({ kind: 'Executor', value }),
  [lib.CodecSymbol]: lib
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
      [1, 'Peer', lib.codecOf(PeerEventFilter)],
      [2, 'Domain', lib.codecOf(DomainEventFilter)],
      [3, 'Account', lib.codecOf(AccountEventFilter)],
      [4, 'Asset', lib.codecOf(AssetEventFilter)],
      [5, 'AssetDefinition', lib.codecOf(AssetDefinitionEventFilter)],
      [6, 'Trigger', lib.codecOf(TriggerEventFilter)],
      [7, 'Role', lib.codecOf(RoleEventFilter)],
      [8, 'Configuration', lib.codecOf(ConfigurationEventFilter)],
      [9, 'Executor', lib.codecOf(ExecutorEventFilter)],
    ])
    .discriminated(),
}

export interface Schedule {
  start: lib.Timestamp
  period: lib.Option<lib.Duration>
}
export const Schedule: lib.CodecProvider<Schedule> = {
  [lib.CodecSymbol]: lib.structCodec<Schedule>(['start', 'period'], {
    start: lib.codecOf(lib.Timestamp),
    period: lib.codecOf(lib.Option.with(lib.codecOf(lib.Duration))),
  }),
}

export type ExecutionTime = lib.SumTypeKind<'PreCommit'> | lib.SumTypeKindValue<'Schedule', Schedule>
export const ExecutionTime = {
  PreCommit: Object.freeze<ExecutionTime>({ kind: 'PreCommit' }),
  Schedule: (value: Schedule): ExecutionTime => ({ kind: 'Schedule', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ PreCommit: []; Schedule: [Schedule] }>([
      [0, 'PreCommit'],
      [1, 'Schedule', lib.codecOf(Schedule)],
    ])
    .discriminated(),
}

export interface ExecuteTriggerEventFilter {
  triggerId: lib.Option<TriggerId>
  authority: lib.Option<lib.AccountId>
}
export const ExecuteTriggerEventFilter: lib.CodecProvider<ExecuteTriggerEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTriggerEventFilter>(['triggerId', 'authority'], {
    triggerId: lib.codecOf(lib.Option.with(lib.codecOf(TriggerId))),
    authority: lib.codecOf(lib.Option.with(lib.codecOf(lib.AccountId))),
  }),
}

export type TriggerCompletedOutcomeType = lib.SumTypeKind<'Success'> | lib.SumTypeKind<'Failure'>
export const TriggerCompletedOutcomeType = {
  Success: Object.freeze<TriggerCompletedOutcomeType>({ kind: 'Success' }),
  Failure: Object.freeze<TriggerCompletedOutcomeType>({ kind: 'Failure' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Success: []; Failure: [] }>([
      [0, 'Success'],
      [1, 'Failure'],
    ])
    .discriminated(),
}

export interface TriggerCompletedEventFilter {
  triggerId: lib.Option<TriggerId>
  outcomeType: lib.Option<TriggerCompletedOutcomeType>
}
export const TriggerCompletedEventFilter: lib.CodecProvider<TriggerCompletedEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerCompletedEventFilter>(['triggerId', 'outcomeType'], {
    triggerId: lib.codecOf(lib.Option.with(lib.codecOf(TriggerId))),
    outcomeType: lib.codecOf(lib.Option.with(lib.codecOf(TriggerCompletedOutcomeType))),
  }),
}

export type EventFilterBox =
  | lib.SumTypeKindValue<'Pipeline', PipelineEventFilterBox>
  | lib.SumTypeKindValue<'Data', DataEventFilter>
  | lib.SumTypeKindValue<'Time', ExecutionTime>
  | lib.SumTypeKindValue<'ExecuteTrigger', ExecuteTriggerEventFilter>
  | lib.SumTypeKindValue<'TriggerCompleted', TriggerCompletedEventFilter>
export const EventFilterBox = {
  Pipeline: {
    Transaction: (value: TransactionEventFilter): EventFilterBox => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Transaction(value),
    }),
    Block: (value: BlockEventFilter): EventFilterBox => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Block(value),
    }),
  },
  Data: {
    Any: Object.freeze<EventFilterBox>({ kind: 'Data', value: DataEventFilter.Any }),
    Peer: (value: PeerEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Peer(value) }),
    Domain: (value: DomainEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Domain(value) }),
    Account: (value: AccountEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Account(value) }),
    Asset: (value: AssetEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Asset(value) }),
    AssetDefinition: (value: AssetDefinitionEventFilter): EventFilterBox => ({
      kind: 'Data',
      value: DataEventFilter.AssetDefinition(value),
    }),
    Trigger: (value: TriggerEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Trigger(value) }),
    Role: (value: RoleEventFilter): EventFilterBox => ({ kind: 'Data', value: DataEventFilter.Role(value) }),
    Configuration: (value: ConfigurationEventFilter): EventFilterBox => ({
      kind: 'Data',
      value: DataEventFilter.Configuration(value),
    }),
    Executor: (value: ExecutorEventFilter): EventFilterBox => ({
      kind: 'Data',
      value: DataEventFilter.Executor(value),
    }),
  },
  Time: {
    PreCommit: Object.freeze<EventFilterBox>({ kind: 'Time', value: ExecutionTime.PreCommit }),
    Schedule: (value: Schedule): EventFilterBox => ({ kind: 'Time', value: ExecutionTime.Schedule(value) }),
  },
  ExecuteTrigger: (value: ExecuteTriggerEventFilter): EventFilterBox => ({ kind: 'ExecuteTrigger', value }),
  TriggerCompleted: (value: TriggerCompletedEventFilter): EventFilterBox => ({ kind: 'TriggerCompleted', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Pipeline: [PipelineEventFilterBox]
      Data: [DataEventFilter]
      Time: [ExecutionTime]
      ExecuteTrigger: [ExecuteTriggerEventFilter]
      TriggerCompleted: [TriggerCompletedEventFilter]
    }>([
      [0, 'Pipeline', lib.codecOf(PipelineEventFilterBox)],
      [1, 'Data', lib.codecOf(DataEventFilter)],
      [2, 'Time', lib.codecOf(ExecutionTime)],
      [3, 'ExecuteTrigger', lib.codecOf(ExecuteTriggerEventFilter)],
      [4, 'TriggerCompleted', lib.codecOf(TriggerCompletedEventFilter)],
    ])
    .discriminated(),
}

export interface Action {
  executable: Executable
  repeats: Repeats
  authority: lib.AccountId
  filter: EventFilterBox
  metadata: lib.Map<lib.Name, lib.Json>
}
export const Action: lib.CodecProvider<Action> = {
  [lib.CodecSymbol]: lib.structCodec<Action>(['executable', 'repeats', 'authority', 'filter', 'metadata'], {
    executable: lib.codecOf(Executable),
    repeats: lib.codecOf(Repeats),
    authority: lib.codecOf(lib.AccountId),
    filter: lib.codecOf(EventFilterBox),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
  }),
}

export type ActionPredicateAtom = never
export const ActionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type ActionProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', ActionPredicateAtom>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionPredicate>
export const ActionProjectionPredicate = {
  Atom: {},
  Metadata: {
    Atom: {},
    Key: (value: MetadataKeyProjectionPredicate): ActionProjectionPredicate => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [ActionPredicateAtom]; Metadata: [MetadataProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(ActionPredicateAtom)],
      [1, 'Metadata', lib.codecOf(MetadataProjectionPredicate)],
    ])
    .discriminated(),
}

export type ActionProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionSelector>
export const ActionProjectionSelector = {
  Atom: Object.freeze<ActionProjectionSelector>({ kind: 'Atom' }),
  Metadata: {
    Atom: Object.freeze<ActionProjectionSelector>({ kind: 'Metadata', value: MetadataProjectionSelector.Atom }),
    Key: (value: MetadataKeyProjectionSelector): ActionProjectionSelector => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Metadata', lib.codecOf(MetadataProjectionSelector)],
    ])
    .discriminated(),
}

export type Mintable = lib.SumTypeKind<'Infinitely'> | lib.SumTypeKind<'Once'> | lib.SumTypeKind<'Not'>
export const Mintable = {
  Infinitely: Object.freeze<Mintable>({ kind: 'Infinitely' }),
  Once: Object.freeze<Mintable>({ kind: 'Once' }),
  Not: Object.freeze<Mintable>({ kind: 'Not' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Infinitely: []; Once: []; Not: [] }>([
      [0, 'Infinitely'],
      [1, 'Once'],
      [2, 'Not'],
    ])
    .discriminated(),
}

export interface AssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<lib.String>
  metadata: lib.Map<lib.Name, lib.Json>
  ownedBy: lib.AccountId
  totalQuantity: Numeric
}
export const AssetDefinition: lib.CodecProvider<AssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinition>(
    ['id', 'type', 'mintable', 'logo', 'metadata', 'ownedBy', 'totalQuantity'],
    {
      id: lib.codecOf(lib.AssetDefinitionId),
      type: lib.codecOf(AssetType),
      mintable: lib.codecOf(Mintable),
      logo: lib.codecOf(lib.Option.with(lib.codecOf(lib.String))),
      metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
      ownedBy: lib.codecOf(lib.AccountId),
      totalQuantity: lib.codecOf(Numeric),
    },
  ),
}

export interface AssetDefinitionTotalQuantityChanged {
  assetDefinition: lib.AssetDefinitionId
  totalAmount: Numeric
}
export const AssetDefinitionTotalQuantityChanged: lib.CodecProvider<AssetDefinitionTotalQuantityChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinitionTotalQuantityChanged>(['assetDefinition', 'totalAmount'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
    totalAmount: lib.codecOf(Numeric),
  }),
}

export interface AssetDefinitionOwnerChanged {
  assetDefinition: lib.AssetDefinitionId
  newOwner: lib.AccountId
}
export const AssetDefinitionOwnerChanged: lib.CodecProvider<AssetDefinitionOwnerChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinitionOwnerChanged>(['assetDefinition', 'newOwner'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
    newOwner: lib.codecOf(lib.AccountId),
  }),
}

export type AssetDefinitionEvent =
  | lib.SumTypeKindValue<'Created', AssetDefinition>
  | lib.SumTypeKindValue<'Deleted', lib.AssetDefinitionId>
  | lib.SumTypeKindValue<'MetadataInserted', MetadataChanged<lib.AssetDefinitionId>>
  | lib.SumTypeKindValue<'MetadataRemoved', MetadataChanged<lib.AssetDefinitionId>>
  | lib.SumTypeKindValue<'MintabilityChanged', lib.AssetDefinitionId>
  | lib.SumTypeKindValue<'TotalQuantityChanged', AssetDefinitionTotalQuantityChanged>
  | lib.SumTypeKindValue<'OwnerChanged', AssetDefinitionOwnerChanged>
export const AssetDefinitionEvent = {
  Created: (value: AssetDefinition): AssetDefinitionEvent => ({ kind: 'Created', value }),
  Deleted: (value: lib.AssetDefinitionId): AssetDefinitionEvent => ({ kind: 'Deleted', value }),
  MetadataInserted: (value: MetadataChanged<lib.AssetDefinitionId>): AssetDefinitionEvent => ({
    kind: 'MetadataInserted',
    value,
  }),
  MetadataRemoved: (value: MetadataChanged<lib.AssetDefinitionId>): AssetDefinitionEvent => ({
    kind: 'MetadataRemoved',
    value,
  }),
  MintabilityChanged: (value: lib.AssetDefinitionId): AssetDefinitionEvent => ({ kind: 'MintabilityChanged', value }),
  TotalQuantityChanged: (value: AssetDefinitionTotalQuantityChanged): AssetDefinitionEvent => ({
    kind: 'TotalQuantityChanged',
    value,
  }),
  OwnerChanged: (value: AssetDefinitionOwnerChanged): AssetDefinitionEvent => ({ kind: 'OwnerChanged', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [AssetDefinition]
      Deleted: [lib.AssetDefinitionId]
      MetadataInserted: [MetadataChanged<lib.AssetDefinitionId>]
      MetadataRemoved: [MetadataChanged<lib.AssetDefinitionId>]
      MintabilityChanged: [lib.AssetDefinitionId]
      TotalQuantityChanged: [AssetDefinitionTotalQuantityChanged]
      OwnerChanged: [AssetDefinitionOwnerChanged]
    }>([
      [0, 'Created', lib.codecOf(AssetDefinition)],
      [1, 'Deleted', lib.codecOf(lib.AssetDefinitionId)],
      [2, 'MetadataInserted', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AssetDefinitionId)))],
      [3, 'MetadataRemoved', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.AssetDefinitionId)))],
      [4, 'MintabilityChanged', lib.codecOf(lib.AssetDefinitionId)],
      [5, 'TotalQuantityChanged', lib.codecOf(AssetDefinitionTotalQuantityChanged)],
      [6, 'OwnerChanged', lib.codecOf(AssetDefinitionOwnerChanged)],
    ])
    .discriminated(),
}

export type AssetDefinitionIdPredicateAtom = lib.SumTypeKindValue<'Equals', lib.AssetDefinitionId>
export const AssetDefinitionIdPredicateAtom = {
  Equals: (value: lib.AssetDefinitionId): AssetDefinitionIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AssetDefinitionId] }>([[0, 'Equals', lib.codecOf(lib.AssetDefinitionId)]])
    .discriminated(),
}

export type AssetDefinitionIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AssetDefinitionIdPredicateAtom>
  | lib.SumTypeKindValue<'Domain', DomainIdProjectionPredicate>
  | lib.SumTypeKindValue<'Name', NameProjectionPredicate>
export const AssetDefinitionIdProjectionPredicate = {
  Atom: {
    Equals: (value: lib.AssetDefinitionId): AssetDefinitionIdProjectionPredicate => ({
      kind: 'Atom',
      value: AssetDefinitionIdPredicateAtom.Equals(value),
    }),
  },
  Domain: {
    Atom: {
      Equals: (value: lib.DomainId): AssetDefinitionIdProjectionPredicate => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Name: {
    Atom: {
      Equals: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: (value: lib.String): AssetDefinitionIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AssetDefinitionIdPredicateAtom]
      Domain: [DomainIdProjectionPredicate]
      Name: [NameProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AssetDefinitionIdPredicateAtom)],
      [1, 'Domain', lib.codecOf(DomainIdProjectionPredicate)],
      [2, 'Name', lib.codecOf(NameProjectionPredicate)],
    ])
    .discriminated(),
}

export type AssetDefinitionIdProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Domain', DomainIdProjectionSelector>
  | lib.SumTypeKindValue<'Name', NameProjectionSelector>
export const AssetDefinitionIdProjectionSelector = {
  Atom: Object.freeze<AssetDefinitionIdProjectionSelector>({ kind: 'Atom' }),
  Domain: {
    Atom: Object.freeze<AssetDefinitionIdProjectionSelector>({
      kind: 'Domain',
      value: DomainIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<AssetDefinitionIdProjectionSelector>({
        kind: 'Domain',
        value: DomainIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Name: {
    Atom: Object.freeze<AssetDefinitionIdProjectionSelector>({ kind: 'Name', value: NameProjectionSelector.Atom }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Domain: [DomainIdProjectionSelector]; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Domain', lib.codecOf(DomainIdProjectionSelector)],
      [2, 'Name', lib.codecOf(NameProjectionSelector)],
    ])
    .discriminated(),
}

export type AssetDefinitionPredicateAtom = never
export const AssetDefinitionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type AssetDefinitionProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AssetDefinitionPredicateAtom>
  | lib.SumTypeKindValue<'Id', AssetDefinitionIdProjectionPredicate>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionPredicate>
export const AssetDefinitionProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: lib.AssetDefinitionId): AssetDefinitionProjectionPredicate => ({
        kind: 'Id',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: (value: lib.DomainId): AssetDefinitionProjectionPredicate => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): AssetDefinitionProjectionPredicate => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): AssetDefinitionProjectionPredicate => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): AssetDefinitionProjectionPredicate => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): AssetDefinitionProjectionPredicate => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): AssetDefinitionProjectionPredicate => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): AssetDefinitionProjectionPredicate => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): AssetDefinitionProjectionPredicate => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): AssetDefinitionProjectionPredicate => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: (value: MetadataKeyProjectionPredicate): AssetDefinitionProjectionPredicate => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AssetDefinitionPredicateAtom]
      Id: [AssetDefinitionIdProjectionPredicate]
      Metadata: [MetadataProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AssetDefinitionPredicateAtom)],
      [1, 'Id', lib.codecOf(AssetDefinitionIdProjectionPredicate)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionPredicate)],
    ])
    .discriminated(),
}

export type AssetDefinitionProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Id', AssetDefinitionIdProjectionSelector>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionSelector>
export const AssetDefinitionProjectionSelector = {
  Atom: Object.freeze<AssetDefinitionProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<AssetDefinitionProjectionSelector>({
      kind: 'Id',
      value: AssetDefinitionIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<AssetDefinitionProjectionSelector>({
        kind: 'Id',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<AssetDefinitionProjectionSelector>({
          kind: 'Id',
          value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Name: {
      Atom: Object.freeze<AssetDefinitionProjectionSelector>({
        kind: 'Id',
        value: AssetDefinitionIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Metadata: {
    Atom: Object.freeze<AssetDefinitionProjectionSelector>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: (value: MetadataKeyProjectionSelector): AssetDefinitionProjectionSelector => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AssetDefinitionIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(AssetDefinitionIdProjectionSelector)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionSelector)],
    ])
    .discriminated(),
}

export type AssetIdPredicateAtom = lib.SumTypeKindValue<'Equals', lib.AssetId>
export const AssetIdPredicateAtom = {
  Equals: (value: lib.AssetId): AssetIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AssetId] }>([[0, 'Equals', lib.codecOf(lib.AssetId)]])
    .discriminated(),
}

export type AssetIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AssetIdPredicateAtom>
  | lib.SumTypeKindValue<'Account', AccountIdProjectionPredicate>
  | lib.SumTypeKindValue<'Definition', AssetDefinitionIdProjectionPredicate>
export const AssetIdProjectionPredicate = {
  Atom: {
    Equals: (value: lib.AssetId): AssetIdProjectionPredicate => ({
      kind: 'Atom',
      value: AssetIdPredicateAtom.Equals(value),
    }),
  },
  Account: {
    Atom: {
      Equals: (value: lib.AccountId): AssetIdProjectionPredicate => ({
        kind: 'Account',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: (value: lib.DomainId): AssetIdProjectionPredicate => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: (value: lib.PublicKeyWrap): AssetIdProjectionPredicate => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  Definition: {
    Atom: {
      Equals: (value: lib.AssetDefinitionId): AssetIdProjectionPredicate => ({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: (value: lib.DomainId): AssetIdProjectionPredicate => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): AssetIdProjectionPredicate => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): AssetIdProjectionPredicate => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): AssetIdProjectionPredicate => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): AssetIdProjectionPredicate => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): AssetIdProjectionPredicate => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AssetIdPredicateAtom]
      Account: [AccountIdProjectionPredicate]
      Definition: [AssetDefinitionIdProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AssetIdPredicateAtom)],
      [1, 'Account', lib.codecOf(AccountIdProjectionPredicate)],
      [2, 'Definition', lib.codecOf(AssetDefinitionIdProjectionPredicate)],
    ])
    .discriminated(),
}

export type AssetIdProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Account', AccountIdProjectionSelector>
  | lib.SumTypeKindValue<'Definition', AssetDefinitionIdProjectionSelector>
export const AssetIdProjectionSelector = {
  Atom: Object.freeze<AssetIdProjectionSelector>({ kind: 'Atom' }),
  Account: {
    Atom: Object.freeze<AssetIdProjectionSelector>({ kind: 'Account', value: AccountIdProjectionSelector.Atom }),
    Domain: {
      Atom: Object.freeze<AssetIdProjectionSelector>({
        kind: 'Account',
        value: AccountIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<AssetIdProjectionSelector>({
          kind: 'Account',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Signatory: {
      Atom: Object.freeze<AssetIdProjectionSelector>({
        kind: 'Account',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  Definition: {
    Atom: Object.freeze<AssetIdProjectionSelector>({
      kind: 'Definition',
      value: AssetDefinitionIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<AssetIdProjectionSelector>({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<AssetIdProjectionSelector>({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Name: {
      Atom: Object.freeze<AssetIdProjectionSelector>({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Name.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Account: [AccountIdProjectionSelector]; Definition: [AssetDefinitionIdProjectionSelector] }>(
      [
        [0, 'Atom'],
        [1, 'Account', lib.codecOf(AccountIdProjectionSelector)],
        [2, 'Definition', lib.codecOf(AssetDefinitionIdProjectionSelector)],
      ],
    )
    .discriminated(),
}

export type AssetPredicateAtom = never
export const AssetPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type AssetValuePredicateAtom = lib.SumTypeKind<'IsNumeric'> | lib.SumTypeKind<'IsStore'>
export const AssetValuePredicateAtom = {
  IsNumeric: Object.freeze<AssetValuePredicateAtom>({ kind: 'IsNumeric' }),
  IsStore: Object.freeze<AssetValuePredicateAtom>({ kind: 'IsStore' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ IsNumeric: []; IsStore: [] }>([
      [0, 'IsNumeric'],
      [1, 'IsStore'],
    ])
    .discriminated(),
}

export type NumericPredicateAtom = never
export const NumericPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type NumericProjectionPredicate = lib.SumTypeKindValue<'Atom', NumericPredicateAtom>
export const NumericProjectionPredicate = {
  Atom: {},
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [NumericPredicateAtom] }>([[0, 'Atom', lib.codecOf(NumericPredicateAtom)]])
    .discriminated(),
}

export type AssetValueProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AssetValuePredicateAtom>
  | lib.SumTypeKindValue<'Numeric', NumericProjectionPredicate>
  | lib.SumTypeKindValue<'Store', MetadataProjectionPredicate>
export const AssetValueProjectionPredicate = {
  Atom: {
    IsNumeric: Object.freeze<AssetValueProjectionPredicate>({ kind: 'Atom', value: AssetValuePredicateAtom.IsNumeric }),
    IsStore: Object.freeze<AssetValueProjectionPredicate>({ kind: 'Atom', value: AssetValuePredicateAtom.IsStore }),
  },
  Numeric: { Atom: {} },
  Store: {
    Atom: {},
    Key: (value: MetadataKeyProjectionPredicate): AssetValueProjectionPredicate => ({
      kind: 'Store',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AssetValuePredicateAtom]
      Numeric: [NumericProjectionPredicate]
      Store: [MetadataProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AssetValuePredicateAtom)],
      [1, 'Numeric', lib.codecOf(NumericProjectionPredicate)],
      [2, 'Store', lib.codecOf(MetadataProjectionPredicate)],
    ])
    .discriminated(),
}

export type AssetProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', AssetPredicateAtom>
  | lib.SumTypeKindValue<'Id', AssetIdProjectionPredicate>
  | lib.SumTypeKindValue<'Value', AssetValueProjectionPredicate>
export const AssetProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: lib.AssetId): AssetProjectionPredicate => ({
        kind: 'Id',
        value: AssetIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Account: {
      Atom: {
        Equals: (value: lib.AccountId): AssetProjectionPredicate => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Account.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: (value: lib.DomainId): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Account.Domain.Atom.Equals(value),
          }),
        },
        Name: {
          Atom: {
            Equals: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.Equals(value),
            }),
            Contains: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.Contains(value),
            }),
            StartsWith: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.StartsWith(value),
            }),
            EndsWith: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.EndsWith(value),
            }),
          },
        },
      },
      Signatory: {
        Atom: {
          Equals: (value: lib.PublicKeyWrap): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Account.Signatory.Atom.Equals(value),
          }),
        },
      },
    },
    Definition: {
      Atom: {
        Equals: (value: lib.AssetDefinitionId): AssetProjectionPredicate => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Definition.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: (value: lib.DomainId): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Domain.Atom.Equals(value),
          }),
        },
        Name: {
          Atom: {
            Equals: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Equals(value),
            }),
            Contains: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Contains(value),
            }),
            StartsWith: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.StartsWith(value),
            }),
            EndsWith: (value: lib.String): AssetProjectionPredicate => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.EndsWith(value),
            }),
          },
        },
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): AssetProjectionPredicate => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
  },
  Value: {
    Atom: {
      IsNumeric: Object.freeze<AssetProjectionPredicate>({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Atom.IsNumeric,
      }),
      IsStore: Object.freeze<AssetProjectionPredicate>({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Atom.IsStore,
      }),
    },
    Numeric: { Atom: {} },
    Store: {
      Atom: {},
      Key: (value: MetadataKeyProjectionPredicate): AssetProjectionPredicate => ({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Store.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [AssetPredicateAtom]
      Id: [AssetIdProjectionPredicate]
      Value: [AssetValueProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(AssetPredicateAtom)],
      [1, 'Id', lib.codecOf(AssetIdProjectionPredicate)],
      [2, 'Value', lib.codecOf(AssetValueProjectionPredicate)],
    ])
    .discriminated(),
}

export type NumericProjectionSelector = lib.SumTypeKind<'Atom'>
export const NumericProjectionSelector = {
  Atom: Object.freeze<NumericProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type AssetValueProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Numeric', NumericProjectionSelector>
  | lib.SumTypeKindValue<'Store', MetadataProjectionSelector>
export const AssetValueProjectionSelector = {
  Atom: Object.freeze<AssetValueProjectionSelector>({ kind: 'Atom' }),
  Numeric: {
    Atom: Object.freeze<AssetValueProjectionSelector>({ kind: 'Numeric', value: NumericProjectionSelector.Atom }),
  },
  Store: {
    Atom: Object.freeze<AssetValueProjectionSelector>({ kind: 'Store', value: MetadataProjectionSelector.Atom }),
    Key: (value: MetadataKeyProjectionSelector): AssetValueProjectionSelector => ({
      kind: 'Store',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Numeric: [NumericProjectionSelector]; Store: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Numeric', lib.codecOf(NumericProjectionSelector)],
      [2, 'Store', lib.codecOf(MetadataProjectionSelector)],
    ])
    .discriminated(),
}

export type AssetProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Id', AssetIdProjectionSelector>
  | lib.SumTypeKindValue<'Value', AssetValueProjectionSelector>
export const AssetProjectionSelector = {
  Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Id', value: AssetIdProjectionSelector.Atom }),
    Account: {
      Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Id', value: AssetIdProjectionSelector.Account.Atom }),
      Domain: {
        Atom: Object.freeze<AssetProjectionSelector>({
          kind: 'Id',
          value: AssetIdProjectionSelector.Account.Domain.Atom,
        }),
        Name: {
          Atom: Object.freeze<AssetProjectionSelector>({
            kind: 'Id',
            value: AssetIdProjectionSelector.Account.Domain.Name.Atom,
          }),
        },
      },
      Signatory: {
        Atom: Object.freeze<AssetProjectionSelector>({
          kind: 'Id',
          value: AssetIdProjectionSelector.Account.Signatory.Atom,
        }),
      },
    },
    Definition: {
      Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Id', value: AssetIdProjectionSelector.Definition.Atom }),
      Domain: {
        Atom: Object.freeze<AssetProjectionSelector>({
          kind: 'Id',
          value: AssetIdProjectionSelector.Definition.Domain.Atom,
        }),
        Name: {
          Atom: Object.freeze<AssetProjectionSelector>({
            kind: 'Id',
            value: AssetIdProjectionSelector.Definition.Domain.Name.Atom,
          }),
        },
      },
      Name: {
        Atom: Object.freeze<AssetProjectionSelector>({
          kind: 'Id',
          value: AssetIdProjectionSelector.Definition.Name.Atom,
        }),
      },
    },
  },
  Value: {
    Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Value', value: AssetValueProjectionSelector.Atom }),
    Numeric: {
      Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Value', value: AssetValueProjectionSelector.Numeric.Atom }),
    },
    Store: {
      Atom: Object.freeze<AssetProjectionSelector>({ kind: 'Value', value: AssetValueProjectionSelector.Store.Atom }),
      Key: (value: MetadataKeyProjectionSelector): AssetProjectionSelector => ({
        kind: 'Value',
        value: AssetValueProjectionSelector.Store.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AssetIdProjectionSelector]; Value: [AssetValueProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(AssetIdProjectionSelector)],
      [2, 'Value', lib.codecOf(AssetValueProjectionSelector)],
    ])
    .discriminated(),
}

export interface Transfer<T0, T1, T2> {
  source: T0
  object: T1
  destination: T2
}
export const Transfer = {
  with: <T0, T1, T2>(
    t0: lib.Codec<T0>,
    t1: lib.Codec<T1>,
    t2: lib.Codec<T2>,
  ): lib.CodecProvider<Transfer<T0, T1, T2>> => ({
    [lib.CodecSymbol]: lib.structCodec<Transfer<T0, T1, T2>>(['source', 'object', 'destination'], {
      source: t0,
      object: t1,
      destination: t2,
    }),
  }),
}

export type AssetTransferBox =
  | lib.SumTypeKindValue<'Numeric', Transfer<lib.AssetId, Numeric, lib.AccountId>>
  | lib.SumTypeKindValue<'Store', Transfer<lib.AssetId, lib.Map<lib.Name, lib.Json>, lib.AccountId>>
export const AssetTransferBox = {
  Numeric: (value: Transfer<lib.AssetId, Numeric, lib.AccountId>): AssetTransferBox => ({ kind: 'Numeric', value }),
  Store: (value: Transfer<lib.AssetId, lib.Map<lib.Name, lib.Json>, lib.AccountId>): AssetTransferBox => ({
    kind: 'Store',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Numeric: [Transfer<lib.AssetId, Numeric, lib.AccountId>]
      Store: [Transfer<lib.AssetId, lib.Map<lib.Name, lib.Json>, lib.AccountId>]
    }>([
      [
        0,
        'Numeric',
        lib.codecOf(Transfer.with(lib.codecOf(lib.AssetId), lib.codecOf(Numeric), lib.codecOf(lib.AccountId))),
      ],
      [
        1,
        'Store',
        lib.codecOf(
          Transfer.with(
            lib.codecOf(lib.AssetId),
            lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
            lib.codecOf(lib.AccountId),
          ),
        ),
      ],
    ])
    .discriminated(),
}

export interface BlockHeader {
  height: lib.U64
  prevBlockHash: lib.Option<lib.HashWrap>
  transactionsHash: lib.HashWrap
  creationTimeMs: lib.U64
  viewChangeIndex: lib.U32
}
export const BlockHeader: lib.CodecProvider<BlockHeader> = {
  [lib.CodecSymbol]: lib.structCodec<BlockHeader>(
    ['height', 'prevBlockHash', 'transactionsHash', 'creationTimeMs', 'viewChangeIndex'],
    {
      height: lib.codecOf(lib.U64),
      prevBlockHash: lib.codecOf(lib.Option.with(lib.codecOf(lib.HashWrap))),
      transactionsHash: lib.codecOf(lib.HashWrap),
      creationTimeMs: lib.codecOf(lib.U64),
      viewChangeIndex: lib.codecOf(lib.U32),
    },
  ),
}

export interface BlockEvent {
  header: BlockHeader
  status: BlockStatus
}
export const BlockEvent: lib.CodecProvider<BlockEvent> = {
  [lib.CodecSymbol]: lib.structCodec<BlockEvent>(['header', 'status'], {
    header: lib.codecOf(BlockHeader),
    status: lib.codecOf(BlockStatus),
  }),
}

export type BlockHeaderHashPredicateAtom = lib.SumTypeKindValue<'Equals', lib.HashWrap>
export const BlockHeaderHashPredicateAtom = {
  Equals: (value: lib.HashWrap): BlockHeaderHashPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.HashWrap] }>([[0, 'Equals', lib.codecOf(lib.HashWrap)]])
    .discriminated(),
}

export type BlockHeaderHashProjectionPredicate = lib.SumTypeKindValue<'Atom', BlockHeaderHashPredicateAtom>
export const BlockHeaderHashProjectionPredicate = {
  Atom: {
    Equals: (value: lib.HashWrap): BlockHeaderHashProjectionPredicate => ({
      kind: 'Atom',
      value: BlockHeaderHashPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [BlockHeaderHashPredicateAtom] }>([[0, 'Atom', lib.codecOf(BlockHeaderHashPredicateAtom)]])
    .discriminated(),
}

export type BlockHeaderHashProjectionSelector = lib.SumTypeKind<'Atom'>
export const BlockHeaderHashProjectionSelector = {
  Atom: Object.freeze<BlockHeaderHashProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type BlockHeaderPredicateAtom = never
export const BlockHeaderPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type BlockHeaderProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', BlockHeaderPredicateAtom>
  | lib.SumTypeKindValue<'Hash', BlockHeaderHashProjectionPredicate>
export const BlockHeaderProjectionPredicate = {
  Atom: {},
  Hash: {
    Atom: {
      Equals: (value: lib.HashWrap): BlockHeaderProjectionPredicate => ({
        kind: 'Hash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [BlockHeaderPredicateAtom]; Hash: [BlockHeaderHashProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(BlockHeaderPredicateAtom)],
      [1, 'Hash', lib.codecOf(BlockHeaderHashProjectionPredicate)],
    ])
    .discriminated(),
}

export type BlockHeaderProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Hash', BlockHeaderHashProjectionSelector>
export const BlockHeaderProjectionSelector = {
  Atom: Object.freeze<BlockHeaderProjectionSelector>({ kind: 'Atom' }),
  Hash: {
    Atom: Object.freeze<BlockHeaderProjectionSelector>({ kind: 'Hash', value: BlockHeaderHashProjectionSelector.Atom }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Hash: [BlockHeaderHashProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Hash', lib.codecOf(BlockHeaderHashProjectionSelector)],
    ])
    .discriminated(),
}

export interface BlockSignature {
  peerTopologyIndex: lib.U64
  signature: lib.SignatureWrap
}
export const BlockSignature: lib.CodecProvider<BlockSignature> = {
  [lib.CodecSymbol]: lib.structCodec<BlockSignature>(['peerTopologyIndex', 'signature'], {
    peerTopologyIndex: lib.codecOf(lib.U64),
    signature: lib.codecOf(lib.SignatureWrap),
  }),
}

export interface TransactionPayload {
  chain: lib.String
  authority: lib.AccountId
  creationTime: lib.Timestamp
  instructions: Executable
  timeToLive: lib.Option<lib.Duration>
  nonce: lib.Option<lib.U32>
  metadata: lib.Map<lib.Name, lib.Json>
}
export const TransactionPayload: lib.CodecProvider<TransactionPayload> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionPayload>(
    ['chain', 'authority', 'creationTime', 'instructions', 'timeToLive', 'nonce', 'metadata'],
    {
      chain: lib.codecOf(lib.String),
      authority: lib.codecOf(lib.AccountId),
      creationTime: lib.codecOf(lib.Timestamp),
      instructions: lib.codecOf(Executable),
      timeToLive: lib.codecOf(lib.Option.with(lib.codecOf(lib.Duration))),
      nonce: lib.codecOf(lib.Option.with(lib.codecOf(lib.U32))),
      metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
    },
  ),
}

export interface SignedTransactionV1 {
  signature: lib.SignatureWrap
  payload: TransactionPayload
}
export const SignedTransactionV1: lib.CodecProvider<SignedTransactionV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedTransactionV1>(['signature', 'payload'], {
    signature: lib.codecOf(lib.SignatureWrap),
    payload: lib.codecOf(TransactionPayload),
  }),
}

export type SignedTransaction = lib.SumTypeKindValue<'V1', SignedTransactionV1>
export const SignedTransaction = {
  V1: (value: SignedTransactionV1): SignedTransaction => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ V1: [SignedTransactionV1] }>([[1, 'V1', lib.codecOf(SignedTransactionV1)]])
    .discriminated(),
}

export interface BlockPayload {
  header: BlockHeader
  transactions: lib.Vec<SignedTransaction>
}
export const BlockPayload: lib.CodecProvider<BlockPayload> = {
  [lib.CodecSymbol]: lib.structCodec<BlockPayload>(['header', 'transactions'], {
    header: lib.codecOf(BlockHeader),
    transactions: lib.codecOf(lib.Vec.with(lib.codecOf(SignedTransaction))),
  }),
}

export interface SignedBlockV1 {
  signatures: lib.Vec<BlockSignature>
  payload: BlockPayload
  errors: lib.Map<lib.U64, TransactionRejectionReason>
}
export const SignedBlockV1: lib.CodecProvider<SignedBlockV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedBlockV1>(['signatures', 'payload', 'errors'], {
    signatures: lib.codecOf(lib.Vec.with(lib.codecOf(BlockSignature))),
    payload: lib.codecOf(BlockPayload),
    errors: lib.codecOf(lib.Map.with(lib.codecOf(lib.U64), lib.codecOf(TransactionRejectionReason))),
  }),
}

export type SignedBlock = lib.SumTypeKindValue<'V1', SignedBlockV1>
export const SignedBlock = {
  V1: (value: SignedBlockV1): SignedBlock => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ V1: [SignedBlockV1] }>([[1, 'V1', lib.codecOf(SignedBlockV1)]]).discriminated(),
}

export type BlockParameter = lib.SumTypeKindValue<'MaxTransactions', lib.U64>
export const BlockParameter = {
  MaxTransactions: (value: lib.U64): BlockParameter => ({ kind: 'MaxTransactions', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ MaxTransactions: [lib.U64] }>([[0, 'MaxTransactions', lib.codecOf(lib.U64)]])
    .discriminated(),
}

export interface BlockParameters {
  maxTransactions: lib.U64
}
export const BlockParameters: lib.CodecProvider<BlockParameters> = {
  [lib.CodecSymbol]: lib.structCodec<BlockParameters>(['maxTransactions'], { maxTransactions: lib.codecOf(lib.U64) }),
}

export interface Burn<T0, T1> {
  object: T0
  destination: T1
}
export const Burn = {
  with: <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>): lib.CodecProvider<Burn<T0, T1>> => ({
    [lib.CodecSymbol]: lib.structCodec<Burn<T0, T1>>(['object', 'destination'], { object: t0, destination: t1 }),
  }),
}

export type BurnBox =
  | lib.SumTypeKindValue<'Asset', Burn<Numeric, lib.AssetId>>
  | lib.SumTypeKindValue<'TriggerRepetitions', Burn<lib.U32, TriggerId>>
export const BurnBox = {
  Asset: (value: Burn<Numeric, lib.AssetId>): BurnBox => ({ kind: 'Asset', value }),
  TriggerRepetitions: (value: Burn<lib.U32, TriggerId>): BurnBox => ({ kind: 'TriggerRepetitions', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Asset: [Burn<Numeric, lib.AssetId>]; TriggerRepetitions: [Burn<lib.U32, TriggerId>] }>([
      [0, 'Asset', lib.codecOf(Burn.with(lib.codecOf(Numeric), lib.codecOf(lib.AssetId)))],
      [1, 'TriggerRepetitions', lib.codecOf(Burn.with(lib.codecOf(lib.U32), lib.codecOf(TriggerId)))],
    ])
    .discriminated(),
}

export interface CanBurnAsset {
  asset: lib.AssetId
}
export const CanBurnAsset: lib.CodecProvider<CanBurnAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanBurnAsset>(['asset'], { asset: lib.codecOf(lib.AssetId) }),
}

export interface CanBurnAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanBurnAssetWithDefinition: lib.CodecProvider<CanBurnAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanBurnAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanExecuteTrigger {
  trigger: TriggerId
}
export const CanExecuteTrigger: lib.CodecProvider<CanExecuteTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanExecuteTrigger>(['trigger'], { trigger: lib.codecOf(TriggerId) }),
}

export interface CanMintAsset {
  asset: lib.AssetId
}
export const CanMintAsset: lib.CodecProvider<CanMintAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanMintAsset>(['asset'], { asset: lib.codecOf(lib.AssetId) }),
}

export interface CanMintAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanMintAssetWithDefinition: lib.CodecProvider<CanMintAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanMintAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanModifyAccountMetadata {
  account: lib.AccountId
}
export const CanModifyAccountMetadata: lib.CodecProvider<CanModifyAccountMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAccountMetadata>(['account'], { account: lib.codecOf(lib.AccountId) }),
}

export interface CanModifyAssetDefinitionMetadata {
  assetDefinition: lib.AssetDefinitionId
}
export const CanModifyAssetDefinitionMetadata: lib.CodecProvider<CanModifyAssetDefinitionMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAssetDefinitionMetadata>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanModifyAssetMetadata {
  asset: lib.AssetId
}
export const CanModifyAssetMetadata: lib.CodecProvider<CanModifyAssetMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAssetMetadata>(['asset'], { asset: lib.codecOf(lib.AssetId) }),
}

export interface CanModifyDomainMetadata {
  domain: lib.DomainId
}
export const CanModifyDomainMetadata: lib.CodecProvider<CanModifyDomainMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyDomainMetadata>(['domain'], { domain: lib.codecOf(lib.DomainId) }),
}

export interface CanModifyTrigger {
  trigger: TriggerId
}
export const CanModifyTrigger: lib.CodecProvider<CanModifyTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyTrigger>(['trigger'], { trigger: lib.codecOf(TriggerId) }),
}

export interface CanModifyTriggerMetadata {
  trigger: TriggerId
}
export const CanModifyTriggerMetadata: lib.CodecProvider<CanModifyTriggerMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyTriggerMetadata>(['trigger'], { trigger: lib.codecOf(TriggerId) }),
}

export interface CanRegisterAccount {
  domain: lib.DomainId
}
export const CanRegisterAccount: lib.CodecProvider<CanRegisterAccount> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAccount>(['domain'], { domain: lib.codecOf(lib.DomainId) }),
}

export interface CanRegisterAsset {
  owner: lib.AccountId
}
export const CanRegisterAsset: lib.CodecProvider<CanRegisterAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAsset>(['owner'], { owner: lib.codecOf(lib.AccountId) }),
}

export interface CanRegisterAssetDefinition {
  domain: lib.DomainId
}
export const CanRegisterAssetDefinition: lib.CodecProvider<CanRegisterAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAssetDefinition>(['domain'], { domain: lib.codecOf(lib.DomainId) }),
}

export interface CanRegisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanRegisterAssetWithDefinition: lib.CodecProvider<CanRegisterAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanRegisterTrigger {
  authority: lib.AccountId
}
export const CanRegisterTrigger: lib.CodecProvider<CanRegisterTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterTrigger>(['authority'], { authority: lib.codecOf(lib.AccountId) }),
}

export interface CanTransferAsset {
  asset: lib.AssetId
}
export const CanTransferAsset: lib.CodecProvider<CanTransferAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanTransferAsset>(['asset'], { asset: lib.codecOf(lib.AssetId) }),
}

export interface CanTransferAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanTransferAssetWithDefinition: lib.CodecProvider<CanTransferAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanTransferAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanUnregisterAccount {
  account: lib.AccountId
}
export const CanUnregisterAccount: lib.CodecProvider<CanUnregisterAccount> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAccount>(['account'], { account: lib.codecOf(lib.AccountId) }),
}

export interface CanUnregisterAsset {
  asset: lib.AssetId
}
export const CanUnregisterAsset: lib.CodecProvider<CanUnregisterAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAsset>(['asset'], { asset: lib.codecOf(lib.AssetId) }),
}

export interface CanUnregisterAssetDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanUnregisterAssetDefinition: lib.CodecProvider<CanUnregisterAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAssetDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanUnregisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanUnregisterAssetWithDefinition: lib.CodecProvider<CanUnregisterAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface CanUnregisterDomain {
  domain: lib.DomainId
}
export const CanUnregisterDomain: lib.CodecProvider<CanUnregisterDomain> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterDomain>(['domain'], { domain: lib.codecOf(lib.DomainId) }),
}

export interface CanUnregisterTrigger {
  trigger: TriggerId
}
export const CanUnregisterTrigger: lib.CodecProvider<CanUnregisterTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterTrigger>(['trigger'], { trigger: lib.codecOf(TriggerId) }),
}

export interface CommittedTransaction {
  blockHash: lib.HashWrap
  value: SignedTransaction
  error: lib.Option<TransactionRejectionReason>
}
export const CommittedTransaction: lib.CodecProvider<CommittedTransaction> = {
  [lib.CodecSymbol]: lib.structCodec<CommittedTransaction>(['blockHash', 'value', 'error'], {
    blockHash: lib.codecOf(lib.HashWrap),
    value: lib.codecOf(SignedTransaction),
    error: lib.codecOf(lib.Option.with(lib.codecOf(TransactionRejectionReason))),
  }),
}

export type CommittedTransactionPredicateAtom = never
export const CommittedTransactionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type SignedTransactionPredicateAtom = never
export const SignedTransactionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type TransactionHashPredicateAtom = lib.SumTypeKindValue<'Equals', lib.HashWrap>
export const TransactionHashPredicateAtom = {
  Equals: (value: lib.HashWrap): TransactionHashPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.HashWrap] }>([[0, 'Equals', lib.codecOf(lib.HashWrap)]])
    .discriminated(),
}

export type TransactionHashProjectionPredicate = lib.SumTypeKindValue<'Atom', TransactionHashPredicateAtom>
export const TransactionHashProjectionPredicate = {
  Atom: {
    Equals: (value: lib.HashWrap): TransactionHashProjectionPredicate => ({
      kind: 'Atom',
      value: TransactionHashPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TransactionHashPredicateAtom] }>([[0, 'Atom', lib.codecOf(TransactionHashPredicateAtom)]])
    .discriminated(),
}

export type SignedTransactionProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', SignedTransactionPredicateAtom>
  | lib.SumTypeKindValue<'Hash', TransactionHashProjectionPredicate>
  | lib.SumTypeKindValue<'Authority', AccountIdProjectionPredicate>
export const SignedTransactionProjectionPredicate = {
  Atom: {},
  Hash: {
    Atom: {
      Equals: (value: lib.HashWrap): SignedTransactionProjectionPredicate => ({
        kind: 'Hash',
        value: TransactionHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  Authority: {
    Atom: {
      Equals: (value: lib.AccountId): SignedTransactionProjectionPredicate => ({
        kind: 'Authority',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: (value: lib.DomainId): SignedTransactionProjectionPredicate => ({
          kind: 'Authority',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: (value: lib.String): SignedTransactionProjectionPredicate => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }),
          Contains: (value: lib.String): SignedTransactionProjectionPredicate => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value),
          }),
          StartsWith: (value: lib.String): SignedTransactionProjectionPredicate => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value),
          }),
          EndsWith: (value: lib.String): SignedTransactionProjectionPredicate => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value),
          }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: (value: lib.PublicKeyWrap): SignedTransactionProjectionPredicate => ({
          kind: 'Authority',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [SignedTransactionPredicateAtom]
      Hash: [TransactionHashProjectionPredicate]
      Authority: [AccountIdProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(SignedTransactionPredicateAtom)],
      [1, 'Hash', lib.codecOf(TransactionHashProjectionPredicate)],
      [2, 'Authority', lib.codecOf(AccountIdProjectionPredicate)],
    ])
    .discriminated(),
}

export type TransactionErrorPredicateAtom = lib.SumTypeKind<'IsSome'>
export const TransactionErrorPredicateAtom = {
  IsSome: Object.freeze<TransactionErrorPredicateAtom>({ kind: 'IsSome' }),
  [lib.CodecSymbol]: lib.enumCodec<{ IsSome: [] }>([[0, 'IsSome']]).discriminated(),
}

export type TransactionErrorProjectionPredicate = lib.SumTypeKindValue<'Atom', TransactionErrorPredicateAtom>
export const TransactionErrorProjectionPredicate = {
  Atom: {
    IsSome: Object.freeze<TransactionErrorProjectionPredicate>({
      kind: 'Atom',
      value: TransactionErrorPredicateAtom.IsSome,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TransactionErrorPredicateAtom] }>([[0, 'Atom', lib.codecOf(TransactionErrorPredicateAtom)]])
    .discriminated(),
}

export type CommittedTransactionProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', CommittedTransactionPredicateAtom>
  | lib.SumTypeKindValue<'BlockHash', BlockHeaderHashProjectionPredicate>
  | lib.SumTypeKindValue<'Value', SignedTransactionProjectionPredicate>
  | lib.SumTypeKindValue<'Error', TransactionErrorProjectionPredicate>
export const CommittedTransactionProjectionPredicate = {
  Atom: {},
  BlockHash: {
    Atom: {
      Equals: (value: lib.HashWrap): CommittedTransactionProjectionPredicate => ({
        kind: 'BlockHash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  Value: {
    Atom: {},
    Hash: {
      Atom: {
        Equals: (value: lib.HashWrap): CommittedTransactionProjectionPredicate => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    },
    Authority: {
      Atom: {
        Equals: (value: lib.AccountId): CommittedTransactionProjectionPredicate => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Authority.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: (value: lib.DomainId): CommittedTransactionProjectionPredicate => ({
            kind: 'Value',
            value: SignedTransactionProjectionPredicate.Authority.Domain.Atom.Equals(value),
          }),
        },
        Name: {
          Atom: {
            Equals: (value: lib.String): CommittedTransactionProjectionPredicate => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Equals(value),
            }),
            Contains: (value: lib.String): CommittedTransactionProjectionPredicate => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Contains(value),
            }),
            StartsWith: (value: lib.String): CommittedTransactionProjectionPredicate => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.StartsWith(value),
            }),
            EndsWith: (value: lib.String): CommittedTransactionProjectionPredicate => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.EndsWith(value),
            }),
          },
        },
      },
      Signatory: {
        Atom: {
          Equals: (value: lib.PublicKeyWrap): CommittedTransactionProjectionPredicate => ({
            kind: 'Value',
            value: SignedTransactionProjectionPredicate.Authority.Signatory.Atom.Equals(value),
          }),
        },
      },
    },
  },
  Error: {
    Atom: {
      IsSome: Object.freeze<CommittedTransactionProjectionPredicate>({
        kind: 'Error',
        value: TransactionErrorProjectionPredicate.Atom.IsSome,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [CommittedTransactionPredicateAtom]
      BlockHash: [BlockHeaderHashProjectionPredicate]
      Value: [SignedTransactionProjectionPredicate]
      Error: [TransactionErrorProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(CommittedTransactionPredicateAtom)],
      [1, 'BlockHash', lib.codecOf(BlockHeaderHashProjectionPredicate)],
      [2, 'Value', lib.codecOf(SignedTransactionProjectionPredicate)],
      [3, 'Error', lib.codecOf(TransactionErrorProjectionPredicate)],
    ])
    .discriminated(),
}

export type TransactionHashProjectionSelector = lib.SumTypeKind<'Atom'>
export const TransactionHashProjectionSelector = {
  Atom: Object.freeze<TransactionHashProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type SignedTransactionProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Hash', TransactionHashProjectionSelector>
  | lib.SumTypeKindValue<'Authority', AccountIdProjectionSelector>
export const SignedTransactionProjectionSelector = {
  Atom: Object.freeze<SignedTransactionProjectionSelector>({ kind: 'Atom' }),
  Hash: {
    Atom: Object.freeze<SignedTransactionProjectionSelector>({
      kind: 'Hash',
      value: TransactionHashProjectionSelector.Atom,
    }),
  },
  Authority: {
    Atom: Object.freeze<SignedTransactionProjectionSelector>({
      kind: 'Authority',
      value: AccountIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<SignedTransactionProjectionSelector>({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<SignedTransactionProjectionSelector>({
          kind: 'Authority',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Signatory: {
      Atom: Object.freeze<SignedTransactionProjectionSelector>({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Hash: [TransactionHashProjectionSelector]; Authority: [AccountIdProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Hash', lib.codecOf(TransactionHashProjectionSelector)],
      [2, 'Authority', lib.codecOf(AccountIdProjectionSelector)],
    ])
    .discriminated(),
}

export type TransactionErrorProjectionSelector = lib.SumTypeKind<'Atom'>
export const TransactionErrorProjectionSelector = {
  Atom: Object.freeze<TransactionErrorProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type CommittedTransactionProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'BlockHash', BlockHeaderHashProjectionSelector>
  | lib.SumTypeKindValue<'Value', SignedTransactionProjectionSelector>
  | lib.SumTypeKindValue<'Error', TransactionErrorProjectionSelector>
export const CommittedTransactionProjectionSelector = {
  Atom: Object.freeze<CommittedTransactionProjectionSelector>({ kind: 'Atom' }),
  BlockHash: {
    Atom: Object.freeze<CommittedTransactionProjectionSelector>({
      kind: 'BlockHash',
      value: BlockHeaderHashProjectionSelector.Atom,
    }),
  },
  Value: {
    Atom: Object.freeze<CommittedTransactionProjectionSelector>({
      kind: 'Value',
      value: SignedTransactionProjectionSelector.Atom,
    }),
    Hash: {
      Atom: Object.freeze<CommittedTransactionProjectionSelector>({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Hash.Atom,
      }),
    },
    Authority: {
      Atom: Object.freeze<CommittedTransactionProjectionSelector>({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Authority.Atom,
      }),
      Domain: {
        Atom: Object.freeze<CommittedTransactionProjectionSelector>({
          kind: 'Value',
          value: SignedTransactionProjectionSelector.Authority.Domain.Atom,
        }),
        Name: {
          Atom: Object.freeze<CommittedTransactionProjectionSelector>({
            kind: 'Value',
            value: SignedTransactionProjectionSelector.Authority.Domain.Name.Atom,
          }),
        },
      },
      Signatory: {
        Atom: Object.freeze<CommittedTransactionProjectionSelector>({
          kind: 'Value',
          value: SignedTransactionProjectionSelector.Authority.Signatory.Atom,
        }),
      },
    },
  },
  Error: {
    Atom: Object.freeze<CommittedTransactionProjectionSelector>({
      kind: 'Error',
      value: TransactionErrorProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: []
      BlockHash: [BlockHeaderHashProjectionSelector]
      Value: [SignedTransactionProjectionSelector]
      Error: [TransactionErrorProjectionSelector]
    }>([
      [0, 'Atom'],
      [1, 'BlockHash', lib.codecOf(BlockHeaderHashProjectionSelector)],
      [2, 'Value', lib.codecOf(SignedTransactionProjectionSelector)],
      [3, 'Error', lib.codecOf(TransactionErrorProjectionSelector)],
    ])
    .discriminated(),
}

export type SumeragiParameter =
  | lib.SumTypeKindValue<'BlockTimeMs', lib.U64>
  | lib.SumTypeKindValue<'CommitTimeMs', lib.U64>
  | lib.SumTypeKindValue<'MaxClockDriftMs', lib.U64>
export const SumeragiParameter = {
  BlockTimeMs: (value: lib.U64): SumeragiParameter => ({ kind: 'BlockTimeMs', value }),
  CommitTimeMs: (value: lib.U64): SumeragiParameter => ({ kind: 'CommitTimeMs', value }),
  MaxClockDriftMs: (value: lib.U64): SumeragiParameter => ({ kind: 'MaxClockDriftMs', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ BlockTimeMs: [lib.U64]; CommitTimeMs: [lib.U64]; MaxClockDriftMs: [lib.U64] }>([
      [0, 'BlockTimeMs', lib.codecOf(lib.U64)],
      [1, 'CommitTimeMs', lib.codecOf(lib.U64)],
      [2, 'MaxClockDriftMs', lib.codecOf(lib.U64)],
    ])
    .discriminated(),
}

export type TransactionParameter =
  | lib.SumTypeKindValue<'MaxInstructions', lib.U64>
  | lib.SumTypeKindValue<'SmartContractSize', lib.U64>
export const TransactionParameter = {
  MaxInstructions: (value: lib.U64): TransactionParameter => ({ kind: 'MaxInstructions', value }),
  SmartContractSize: (value: lib.U64): TransactionParameter => ({ kind: 'SmartContractSize', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ MaxInstructions: [lib.U64]; SmartContractSize: [lib.U64] }>([
      [0, 'MaxInstructions', lib.codecOf(lib.U64)],
      [1, 'SmartContractSize', lib.codecOf(lib.U64)],
    ])
    .discriminated(),
}

export type SmartContractParameter = lib.SumTypeKindValue<'Fuel', lib.U64> | lib.SumTypeKindValue<'Memory', lib.U64>
export const SmartContractParameter = {
  Fuel: (value: lib.U64): SmartContractParameter => ({ kind: 'Fuel', value }),
  Memory: (value: lib.U64): SmartContractParameter => ({ kind: 'Memory', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Fuel: [lib.U64]; Memory: [lib.U64] }>([
      [0, 'Fuel', lib.codecOf(lib.U64)],
      [1, 'Memory', lib.codecOf(lib.U64)],
    ])
    .discriminated(),
}

export interface CustomParameter {
  id: lib.Name
  payload: lib.Json
}
export const CustomParameter: lib.CodecProvider<CustomParameter> = {
  [lib.CodecSymbol]: lib.structCodec<CustomParameter>(['id', 'payload'], {
    id: lib.codecOf(lib.Name),
    payload: lib.codecOf(lib.Json),
  }),
}

export type Parameter =
  | lib.SumTypeKindValue<'Sumeragi', SumeragiParameter>
  | lib.SumTypeKindValue<'Block', BlockParameter>
  | lib.SumTypeKindValue<'Transaction', TransactionParameter>
  | lib.SumTypeKindValue<'SmartContract', SmartContractParameter>
  | lib.SumTypeKindValue<'Executor', SmartContractParameter>
  | lib.SumTypeKindValue<'Custom', CustomParameter>
export const Parameter = {
  Sumeragi: {
    BlockTimeMs: (value: lib.U64): Parameter => ({ kind: 'Sumeragi', value: SumeragiParameter.BlockTimeMs(value) }),
    CommitTimeMs: (value: lib.U64): Parameter => ({ kind: 'Sumeragi', value: SumeragiParameter.CommitTimeMs(value) }),
    MaxClockDriftMs: (value: lib.U64): Parameter => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.MaxClockDriftMs(value),
    }),
  },
  Block: {
    MaxTransactions: (value: lib.U64): Parameter => ({ kind: 'Block', value: BlockParameter.MaxTransactions(value) }),
  },
  Transaction: {
    MaxInstructions: (value: lib.U64): Parameter => ({
      kind: 'Transaction',
      value: TransactionParameter.MaxInstructions(value),
    }),
    SmartContractSize: (value: lib.U64): Parameter => ({
      kind: 'Transaction',
      value: TransactionParameter.SmartContractSize(value),
    }),
  },
  SmartContract: {
    Fuel: (value: lib.U64): Parameter => ({ kind: 'SmartContract', value: SmartContractParameter.Fuel(value) }),
    Memory: (value: lib.U64): Parameter => ({ kind: 'SmartContract', value: SmartContractParameter.Memory(value) }),
  },
  Executor: {
    Fuel: (value: lib.U64): Parameter => ({ kind: 'Executor', value: SmartContractParameter.Fuel(value) }),
    Memory: (value: lib.U64): Parameter => ({ kind: 'Executor', value: SmartContractParameter.Memory(value) }),
  },
  Custom: (value: CustomParameter): Parameter => ({ kind: 'Custom', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Sumeragi: [SumeragiParameter]
      Block: [BlockParameter]
      Transaction: [TransactionParameter]
      SmartContract: [SmartContractParameter]
      Executor: [SmartContractParameter]
      Custom: [CustomParameter]
    }>([
      [0, 'Sumeragi', lib.codecOf(SumeragiParameter)],
      [1, 'Block', lib.codecOf(BlockParameter)],
      [2, 'Transaction', lib.codecOf(TransactionParameter)],
      [3, 'SmartContract', lib.codecOf(SmartContractParameter)],
      [4, 'Executor', lib.codecOf(SmartContractParameter)],
      [5, 'Custom', lib.codecOf(CustomParameter)],
    ])
    .discriminated(),
}

export interface ParameterChanged {
  oldValue: Parameter
  newValue: Parameter
}
export const ParameterChanged: lib.CodecProvider<ParameterChanged> = {
  [lib.CodecSymbol]: lib.structCodec<ParameterChanged>(['oldValue', 'newValue'], {
    oldValue: lib.codecOf(Parameter),
    newValue: lib.codecOf(Parameter),
  }),
}

export type ConfigurationEvent = lib.SumTypeKindValue<'Changed', ParameterChanged>
export const ConfigurationEvent = {
  Changed: (value: ParameterChanged): ConfigurationEvent => ({ kind: 'Changed', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Changed: [ParameterChanged] }>([[0, 'Changed', lib.codecOf(ParameterChanged)]])
    .discriminated(),
}

export interface CustomInstruction {
  payload: lib.Json
}
export const CustomInstruction: lib.CodecProvider<CustomInstruction> = {
  [lib.CodecSymbol]: lib.structCodec<CustomInstruction>(['payload'], { payload: lib.codecOf(lib.Json) }),
}

export type PeerEvent = lib.SumTypeKindValue<'Added', PeerId> | lib.SumTypeKindValue<'Removed', PeerId>
export const PeerEvent = {
  Added: (value: PeerId): PeerEvent => ({ kind: 'Added', value }),
  Removed: (value: PeerId): PeerEvent => ({ kind: 'Removed', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Added: [PeerId]; Removed: [PeerId] }>([
      [0, 'Added', lib.codecOf(PeerId)],
      [1, 'Removed', lib.codecOf(PeerId)],
    ])
    .discriminated(),
}

export interface Domain {
  id: lib.DomainId
  logo: lib.Option<lib.String>
  metadata: lib.Map<lib.Name, lib.Json>
  ownedBy: lib.AccountId
}
export const Domain: lib.CodecProvider<Domain> = {
  [lib.CodecSymbol]: lib.structCodec<Domain>(['id', 'logo', 'metadata', 'ownedBy'], {
    id: lib.codecOf(lib.DomainId),
    logo: lib.codecOf(lib.Option.with(lib.codecOf(lib.String))),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
    ownedBy: lib.codecOf(lib.AccountId),
  }),
}

export interface DomainOwnerChanged {
  domain: lib.DomainId
  newOwner: lib.AccountId
}
export const DomainOwnerChanged: lib.CodecProvider<DomainOwnerChanged> = {
  [lib.CodecSymbol]: lib.structCodec<DomainOwnerChanged>(['domain', 'newOwner'], {
    domain: lib.codecOf(lib.DomainId),
    newOwner: lib.codecOf(lib.AccountId),
  }),
}

export type DomainEvent =
  | lib.SumTypeKindValue<'Created', Domain>
  | lib.SumTypeKindValue<'Deleted', lib.DomainId>
  | lib.SumTypeKindValue<'AssetDefinition', AssetDefinitionEvent>
  | lib.SumTypeKindValue<'Account', AccountEvent>
  | lib.SumTypeKindValue<'MetadataInserted', MetadataChanged<lib.DomainId>>
  | lib.SumTypeKindValue<'MetadataRemoved', MetadataChanged<lib.DomainId>>
  | lib.SumTypeKindValue<'OwnerChanged', DomainOwnerChanged>
export const DomainEvent = {
  Created: (value: Domain): DomainEvent => ({ kind: 'Created', value }),
  Deleted: (value: lib.DomainId): DomainEvent => ({ kind: 'Deleted', value }),
  AssetDefinition: {
    Created: (value: AssetDefinition): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Created(value),
    }),
    Deleted: (value: lib.AssetDefinitionId): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Deleted(value),
    }),
    MetadataInserted: (value: MetadataChanged<lib.AssetDefinitionId>): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataInserted(value),
    }),
    MetadataRemoved: (value: MetadataChanged<lib.AssetDefinitionId>): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataRemoved(value),
    }),
    MintabilityChanged: (value: lib.AssetDefinitionId): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MintabilityChanged(value),
    }),
    TotalQuantityChanged: (value: AssetDefinitionTotalQuantityChanged): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.TotalQuantityChanged(value),
    }),
    OwnerChanged: (value: AssetDefinitionOwnerChanged): DomainEvent => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.OwnerChanged(value),
    }),
  },
  Account: {
    Created: (value: Account): DomainEvent => ({ kind: 'Account', value: AccountEvent.Created(value) }),
    Deleted: (value: lib.AccountId): DomainEvent => ({ kind: 'Account', value: AccountEvent.Deleted(value) }),
    Asset: {
      Created: (value: Asset): DomainEvent => ({ kind: 'Account', value: AccountEvent.Asset.Created(value) }),
      Deleted: (value: lib.AssetId): DomainEvent => ({ kind: 'Account', value: AccountEvent.Asset.Deleted(value) }),
      Added: (value: AssetChanged): DomainEvent => ({ kind: 'Account', value: AccountEvent.Asset.Added(value) }),
      Removed: (value: AssetChanged): DomainEvent => ({ kind: 'Account', value: AccountEvent.Asset.Removed(value) }),
      MetadataInserted: (value: MetadataChanged<lib.AssetId>): DomainEvent => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataInserted(value),
      }),
      MetadataRemoved: (value: MetadataChanged<lib.AssetId>): DomainEvent => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataRemoved(value),
      }),
    },
    PermissionAdded: (value: AccountPermissionChanged): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.PermissionAdded(value),
    }),
    PermissionRemoved: (value: AccountPermissionChanged): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.PermissionRemoved(value),
    }),
    RoleGranted: (value: AccountRoleChanged): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.RoleGranted(value),
    }),
    RoleRevoked: (value: AccountRoleChanged): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.RoleRevoked(value),
    }),
    MetadataInserted: (value: MetadataChanged<lib.AccountId>): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.MetadataInserted(value),
    }),
    MetadataRemoved: (value: MetadataChanged<lib.AccountId>): DomainEvent => ({
      kind: 'Account',
      value: AccountEvent.MetadataRemoved(value),
    }),
  },
  MetadataInserted: (value: MetadataChanged<lib.DomainId>): DomainEvent => ({ kind: 'MetadataInserted', value }),
  MetadataRemoved: (value: MetadataChanged<lib.DomainId>): DomainEvent => ({ kind: 'MetadataRemoved', value }),
  OwnerChanged: (value: DomainOwnerChanged): DomainEvent => ({ kind: 'OwnerChanged', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Domain]
      Deleted: [lib.DomainId]
      AssetDefinition: [AssetDefinitionEvent]
      Account: [AccountEvent]
      MetadataInserted: [MetadataChanged<lib.DomainId>]
      MetadataRemoved: [MetadataChanged<lib.DomainId>]
      OwnerChanged: [DomainOwnerChanged]
    }>([
      [0, 'Created', lib.codecOf(Domain)],
      [1, 'Deleted', lib.codecOf(lib.DomainId)],
      [2, 'AssetDefinition', lib.codecOf(AssetDefinitionEvent)],
      [3, 'Account', lib.codecOf(AccountEvent)],
      [4, 'MetadataInserted', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.DomainId)))],
      [5, 'MetadataRemoved', lib.codecOf(MetadataChanged.with(lib.codecOf(lib.DomainId)))],
      [6, 'OwnerChanged', lib.codecOf(DomainOwnerChanged)],
    ])
    .discriminated(),
}

export interface TriggerNumberOfExecutionsChanged {
  trigger: TriggerId
  by: lib.U32
}
export const TriggerNumberOfExecutionsChanged: lib.CodecProvider<TriggerNumberOfExecutionsChanged> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerNumberOfExecutionsChanged>(['trigger', 'by'], {
    trigger: lib.codecOf(TriggerId),
    by: lib.codecOf(lib.U32),
  }),
}

export type TriggerEvent =
  | lib.SumTypeKindValue<'Created', TriggerId>
  | lib.SumTypeKindValue<'Deleted', TriggerId>
  | lib.SumTypeKindValue<'Extended', TriggerNumberOfExecutionsChanged>
  | lib.SumTypeKindValue<'Shortened', TriggerNumberOfExecutionsChanged>
  | lib.SumTypeKindValue<'MetadataInserted', MetadataChanged<TriggerId>>
  | lib.SumTypeKindValue<'MetadataRemoved', MetadataChanged<TriggerId>>
export const TriggerEvent = {
  Created: (value: TriggerId): TriggerEvent => ({ kind: 'Created', value }),
  Deleted: (value: TriggerId): TriggerEvent => ({ kind: 'Deleted', value }),
  Extended: (value: TriggerNumberOfExecutionsChanged): TriggerEvent => ({ kind: 'Extended', value }),
  Shortened: (value: TriggerNumberOfExecutionsChanged): TriggerEvent => ({ kind: 'Shortened', value }),
  MetadataInserted: (value: MetadataChanged<TriggerId>): TriggerEvent => ({ kind: 'MetadataInserted', value }),
  MetadataRemoved: (value: MetadataChanged<TriggerId>): TriggerEvent => ({ kind: 'MetadataRemoved', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [TriggerId]
      Deleted: [TriggerId]
      Extended: [TriggerNumberOfExecutionsChanged]
      Shortened: [TriggerNumberOfExecutionsChanged]
      MetadataInserted: [MetadataChanged<TriggerId>]
      MetadataRemoved: [MetadataChanged<TriggerId>]
    }>([
      [0, 'Created', lib.codecOf(TriggerId)],
      [1, 'Deleted', lib.codecOf(TriggerId)],
      [2, 'Extended', lib.codecOf(TriggerNumberOfExecutionsChanged)],
      [3, 'Shortened', lib.codecOf(TriggerNumberOfExecutionsChanged)],
      [4, 'MetadataInserted', lib.codecOf(MetadataChanged.with(lib.codecOf(TriggerId)))],
      [5, 'MetadataRemoved', lib.codecOf(MetadataChanged.with(lib.codecOf(TriggerId)))],
    ])
    .discriminated(),
}

export interface Role {
  id: RoleId
  permissions: lib.Vec<Permission>
}
export const Role: lib.CodecProvider<Role> = {
  [lib.CodecSymbol]: lib.structCodec<Role>(['id', 'permissions'], {
    id: lib.codecOf(RoleId),
    permissions: lib.codecOf(lib.Vec.with(lib.codecOf(Permission))),
  }),
}

export interface RolePermissionChanged {
  role: RoleId
  permission: Permission
}
export const RolePermissionChanged: lib.CodecProvider<RolePermissionChanged> = {
  [lib.CodecSymbol]: lib.structCodec<RolePermissionChanged>(['role', 'permission'], {
    role: lib.codecOf(RoleId),
    permission: lib.codecOf(Permission),
  }),
}

export type RoleEvent =
  | lib.SumTypeKindValue<'Created', Role>
  | lib.SumTypeKindValue<'Deleted', RoleId>
  | lib.SumTypeKindValue<'PermissionAdded', RolePermissionChanged>
  | lib.SumTypeKindValue<'PermissionRemoved', RolePermissionChanged>
export const RoleEvent = {
  Created: (value: Role): RoleEvent => ({ kind: 'Created', value }),
  Deleted: (value: RoleId): RoleEvent => ({ kind: 'Deleted', value }),
  PermissionAdded: (value: RolePermissionChanged): RoleEvent => ({ kind: 'PermissionAdded', value }),
  PermissionRemoved: (value: RolePermissionChanged): RoleEvent => ({ kind: 'PermissionRemoved', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Role]
      Deleted: [RoleId]
      PermissionAdded: [RolePermissionChanged]
      PermissionRemoved: [RolePermissionChanged]
    }>([
      [0, 'Created', lib.codecOf(Role)],
      [1, 'Deleted', lib.codecOf(RoleId)],
      [2, 'PermissionAdded', lib.codecOf(RolePermissionChanged)],
      [3, 'PermissionRemoved', lib.codecOf(RolePermissionChanged)],
    ])
    .discriminated(),
}

export interface ExecutorDataModel {
  parameters: lib.Map<lib.Name, CustomParameter>
  instructions: lib.Vec<lib.String>
  permissions: lib.Vec<lib.String>
  schema: lib.Json
}
export const ExecutorDataModel: lib.CodecProvider<ExecutorDataModel> = {
  [lib.CodecSymbol]: lib.structCodec<ExecutorDataModel>(['parameters', 'instructions', 'permissions', 'schema'], {
    parameters: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(CustomParameter))),
    instructions: lib.codecOf(lib.Vec.with(lib.codecOf(lib.String))),
    permissions: lib.codecOf(lib.Vec.with(lib.codecOf(lib.String))),
    schema: lib.codecOf(lib.Json),
  }),
}

export interface ExecutorUpgrade {
  newDataModel: ExecutorDataModel
}
export const ExecutorUpgrade: lib.CodecProvider<ExecutorUpgrade> = {
  [lib.CodecSymbol]: lib.structCodec<ExecutorUpgrade>(['newDataModel'], {
    newDataModel: lib.codecOf(ExecutorDataModel),
  }),
}

export type ExecutorEvent = lib.SumTypeKindValue<'Upgraded', ExecutorUpgrade>
export const ExecutorEvent = {
  Upgraded: (value: ExecutorUpgrade): ExecutorEvent => ({ kind: 'Upgraded', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Upgraded: [ExecutorUpgrade] }>([[0, 'Upgraded', lib.codecOf(ExecutorUpgrade)]])
    .discriminated(),
}

export type DataEvent =
  | lib.SumTypeKindValue<'Peer', PeerEvent>
  | lib.SumTypeKindValue<'Domain', DomainEvent>
  | lib.SumTypeKindValue<'Trigger', TriggerEvent>
  | lib.SumTypeKindValue<'Role', RoleEvent>
  | lib.SumTypeKindValue<'Configuration', ConfigurationEvent>
  | lib.SumTypeKindValue<'Executor', ExecutorEvent>
export const DataEvent = {
  Peer: {
    Added: (value: PeerId): DataEvent => ({ kind: 'Peer', value: PeerEvent.Added(value) }),
    Removed: (value: PeerId): DataEvent => ({ kind: 'Peer', value: PeerEvent.Removed(value) }),
  },
  Domain: {
    Created: (value: Domain): DataEvent => ({ kind: 'Domain', value: DomainEvent.Created(value) }),
    Deleted: (value: lib.DomainId): DataEvent => ({ kind: 'Domain', value: DomainEvent.Deleted(value) }),
    AssetDefinition: {
      Created: (value: AssetDefinition): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Created(value),
      }),
      Deleted: (value: lib.AssetDefinitionId): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Deleted(value),
      }),
      MetadataInserted: (value: MetadataChanged<lib.AssetDefinitionId>): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataInserted(value),
      }),
      MetadataRemoved: (value: MetadataChanged<lib.AssetDefinitionId>): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataRemoved(value),
      }),
      MintabilityChanged: (value: lib.AssetDefinitionId): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MintabilityChanged(value),
      }),
      TotalQuantityChanged: (value: AssetDefinitionTotalQuantityChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.TotalQuantityChanged(value),
      }),
      OwnerChanged: (value: AssetDefinitionOwnerChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.OwnerChanged(value),
      }),
    },
    Account: {
      Created: (value: Account): DataEvent => ({ kind: 'Domain', value: DomainEvent.Account.Created(value) }),
      Deleted: (value: lib.AccountId): DataEvent => ({ kind: 'Domain', value: DomainEvent.Account.Deleted(value) }),
      Asset: {
        Created: (value: Asset): DataEvent => ({ kind: 'Domain', value: DomainEvent.Account.Asset.Created(value) }),
        Deleted: (value: lib.AssetId): DataEvent => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Deleted(value),
        }),
        Added: (value: AssetChanged): DataEvent => ({ kind: 'Domain', value: DomainEvent.Account.Asset.Added(value) }),
        Removed: (value: AssetChanged): DataEvent => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Removed(value),
        }),
        MetadataInserted: (value: MetadataChanged<lib.AssetId>): DataEvent => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataInserted(value),
        }),
        MetadataRemoved: (value: MetadataChanged<lib.AssetId>): DataEvent => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataRemoved(value),
        }),
      },
      PermissionAdded: (value: AccountPermissionChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionAdded(value),
      }),
      PermissionRemoved: (value: AccountPermissionChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionRemoved(value),
      }),
      RoleGranted: (value: AccountRoleChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleGranted(value),
      }),
      RoleRevoked: (value: AccountRoleChanged): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleRevoked(value),
      }),
      MetadataInserted: (value: MetadataChanged<lib.AccountId>): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataInserted(value),
      }),
      MetadataRemoved: (value: MetadataChanged<lib.AccountId>): DataEvent => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataRemoved(value),
      }),
    },
    MetadataInserted: (value: MetadataChanged<lib.DomainId>): DataEvent => ({
      kind: 'Domain',
      value: DomainEvent.MetadataInserted(value),
    }),
    MetadataRemoved: (value: MetadataChanged<lib.DomainId>): DataEvent => ({
      kind: 'Domain',
      value: DomainEvent.MetadataRemoved(value),
    }),
    OwnerChanged: (value: DomainOwnerChanged): DataEvent => ({
      kind: 'Domain',
      value: DomainEvent.OwnerChanged(value),
    }),
  },
  Trigger: {
    Created: (value: TriggerId): DataEvent => ({ kind: 'Trigger', value: TriggerEvent.Created(value) }),
    Deleted: (value: TriggerId): DataEvent => ({ kind: 'Trigger', value: TriggerEvent.Deleted(value) }),
    Extended: (value: TriggerNumberOfExecutionsChanged): DataEvent => ({
      kind: 'Trigger',
      value: TriggerEvent.Extended(value),
    }),
    Shortened: (value: TriggerNumberOfExecutionsChanged): DataEvent => ({
      kind: 'Trigger',
      value: TriggerEvent.Shortened(value),
    }),
    MetadataInserted: (value: MetadataChanged<TriggerId>): DataEvent => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataInserted(value),
    }),
    MetadataRemoved: (value: MetadataChanged<TriggerId>): DataEvent => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataRemoved(value),
    }),
  },
  Role: {
    Created: (value: Role): DataEvent => ({ kind: 'Role', value: RoleEvent.Created(value) }),
    Deleted: (value: RoleId): DataEvent => ({ kind: 'Role', value: RoleEvent.Deleted(value) }),
    PermissionAdded: (value: RolePermissionChanged): DataEvent => ({
      kind: 'Role',
      value: RoleEvent.PermissionAdded(value),
    }),
    PermissionRemoved: (value: RolePermissionChanged): DataEvent => ({
      kind: 'Role',
      value: RoleEvent.PermissionRemoved(value),
    }),
  },
  Configuration: {
    Changed: (value: ParameterChanged): DataEvent => ({
      kind: 'Configuration',
      value: ConfigurationEvent.Changed(value),
    }),
  },
  Executor: {
    Upgraded: (value: ExecutorUpgrade): DataEvent => ({ kind: 'Executor', value: ExecutorEvent.Upgraded(value) }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Peer: [PeerEvent]
      Domain: [DomainEvent]
      Trigger: [TriggerEvent]
      Role: [RoleEvent]
      Configuration: [ConfigurationEvent]
      Executor: [ExecutorEvent]
    }>([
      [0, 'Peer', lib.codecOf(PeerEvent)],
      [1, 'Domain', lib.codecOf(DomainEvent)],
      [2, 'Trigger', lib.codecOf(TriggerEvent)],
      [3, 'Role', lib.codecOf(RoleEvent)],
      [4, 'Configuration', lib.codecOf(ConfigurationEvent)],
      [5, 'Executor', lib.codecOf(ExecutorEvent)],
    ])
    .discriminated(),
}

export type DomainPredicateAtom = never
export const DomainPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type DomainProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', DomainPredicateAtom>
  | lib.SumTypeKindValue<'Id', DomainIdProjectionPredicate>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionPredicate>
export const DomainProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: lib.DomainId): DomainProjectionPredicate => ({
        kind: 'Id',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): DomainProjectionPredicate => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): DomainProjectionPredicate => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): DomainProjectionPredicate => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): DomainProjectionPredicate => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: (value: MetadataKeyProjectionPredicate): DomainProjectionPredicate => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [DomainPredicateAtom]
      Id: [DomainIdProjectionPredicate]
      Metadata: [MetadataProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(DomainPredicateAtom)],
      [1, 'Id', lib.codecOf(DomainIdProjectionPredicate)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionPredicate)],
    ])
    .discriminated(),
}

export type DomainProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Id', DomainIdProjectionSelector>
  | lib.SumTypeKindValue<'Metadata', MetadataProjectionSelector>
export const DomainProjectionSelector = {
  Atom: Object.freeze<DomainProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<DomainProjectionSelector>({ kind: 'Id', value: DomainIdProjectionSelector.Atom }),
    Name: {
      Atom: Object.freeze<DomainProjectionSelector>({ kind: 'Id', value: DomainIdProjectionSelector.Name.Atom }),
    },
  },
  Metadata: {
    Atom: Object.freeze<DomainProjectionSelector>({ kind: 'Metadata', value: MetadataProjectionSelector.Atom }),
    Key: (value: MetadataKeyProjectionSelector): DomainProjectionSelector => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [DomainIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(DomainIdProjectionSelector)],
      [2, 'Metadata', lib.codecOf(MetadataProjectionSelector)],
    ])
    .discriminated(),
}

export interface TransactionEvent {
  hash: lib.HashWrap
  blockHeight: lib.Option<lib.U64>
  status: TransactionStatus
}
export const TransactionEvent: lib.CodecProvider<TransactionEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionEvent>(['hash', 'blockHeight', 'status'], {
    hash: lib.codecOf(lib.HashWrap),
    blockHeight: lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))),
    status: lib.codecOf(TransactionStatus),
  }),
}

export type PipelineEventBox =
  | lib.SumTypeKindValue<'Transaction', TransactionEvent>
  | lib.SumTypeKindValue<'Block', BlockEvent>
export const PipelineEventBox = {
  Transaction: (value: TransactionEvent): PipelineEventBox => ({ kind: 'Transaction', value }),
  Block: (value: BlockEvent): PipelineEventBox => ({ kind: 'Block', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Transaction: [TransactionEvent]; Block: [BlockEvent] }>([
      [0, 'Transaction', lib.codecOf(TransactionEvent)],
      [1, 'Block', lib.codecOf(BlockEvent)],
    ])
    .discriminated(),
}

export interface TimeInterval {
  since: lib.Timestamp
  length: lib.Duration
}
export const TimeInterval: lib.CodecProvider<TimeInterval> = {
  [lib.CodecSymbol]: lib.structCodec<TimeInterval>(['since', 'length'], {
    since: lib.codecOf(lib.Timestamp),
    length: lib.codecOf(lib.Duration),
  }),
}

export interface TimeEvent {
  interval: TimeInterval
}
export const TimeEvent: lib.CodecProvider<TimeEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TimeEvent>(['interval'], { interval: lib.codecOf(TimeInterval) }),
}

export interface ExecuteTriggerEvent {
  triggerId: TriggerId
  authority: lib.AccountId
  args: lib.Json
}
export const ExecuteTriggerEvent: lib.CodecProvider<ExecuteTriggerEvent> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTriggerEvent>(['triggerId', 'authority', 'args'], {
    triggerId: lib.codecOf(TriggerId),
    authority: lib.codecOf(lib.AccountId),
    args: lib.codecOf(lib.Json),
  }),
}

export type TriggerCompletedOutcome = lib.SumTypeKind<'Success'> | lib.SumTypeKindValue<'Failure', lib.String>
export const TriggerCompletedOutcome = {
  Success: Object.freeze<TriggerCompletedOutcome>({ kind: 'Success' }),
  Failure: (value: lib.String): TriggerCompletedOutcome => ({ kind: 'Failure', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Success: []; Failure: [lib.String] }>([
      [0, 'Success'],
      [1, 'Failure', lib.codecOf(lib.String)],
    ])
    .discriminated(),
}

export interface TriggerCompletedEvent {
  triggerId: TriggerId
  outcome: TriggerCompletedOutcome
}
export const TriggerCompletedEvent: lib.CodecProvider<TriggerCompletedEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerCompletedEvent>(['triggerId', 'outcome'], {
    triggerId: lib.codecOf(TriggerId),
    outcome: lib.codecOf(TriggerCompletedOutcome),
  }),
}

export type EventBox =
  | lib.SumTypeKindValue<'Pipeline', PipelineEventBox>
  | lib.SumTypeKindValue<'Data', DataEvent>
  | lib.SumTypeKindValue<'Time', TimeEvent>
  | lib.SumTypeKindValue<'ExecuteTrigger', ExecuteTriggerEvent>
  | lib.SumTypeKindValue<'TriggerCompleted', TriggerCompletedEvent>
export const EventBox = {
  Pipeline: {
    Transaction: (value: TransactionEvent): EventBox => ({
      kind: 'Pipeline',
      value: PipelineEventBox.Transaction(value),
    }),
    Block: (value: BlockEvent): EventBox => ({ kind: 'Pipeline', value: PipelineEventBox.Block(value) }),
  },
  Data: {
    Peer: {
      Added: (value: PeerId): EventBox => ({ kind: 'Data', value: DataEvent.Peer.Added(value) }),
      Removed: (value: PeerId): EventBox => ({ kind: 'Data', value: DataEvent.Peer.Removed(value) }),
    },
    Domain: {
      Created: (value: Domain): EventBox => ({ kind: 'Data', value: DataEvent.Domain.Created(value) }),
      Deleted: (value: lib.DomainId): EventBox => ({ kind: 'Data', value: DataEvent.Domain.Deleted(value) }),
      AssetDefinition: {
        Created: (value: AssetDefinition): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Created(value),
        }),
        Deleted: (value: lib.AssetDefinitionId): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Deleted(value),
        }),
        MetadataInserted: (value: MetadataChanged<lib.AssetDefinitionId>): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MetadataInserted(value),
        }),
        MetadataRemoved: (value: MetadataChanged<lib.AssetDefinitionId>): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MetadataRemoved(value),
        }),
        MintabilityChanged: (value: lib.AssetDefinitionId): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MintabilityChanged(value),
        }),
        TotalQuantityChanged: (value: AssetDefinitionTotalQuantityChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.TotalQuantityChanged(value),
        }),
        OwnerChanged: (value: AssetDefinitionOwnerChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.OwnerChanged(value),
        }),
      },
      Account: {
        Created: (value: Account): EventBox => ({ kind: 'Data', value: DataEvent.Domain.Account.Created(value) }),
        Deleted: (value: lib.AccountId): EventBox => ({ kind: 'Data', value: DataEvent.Domain.Account.Deleted(value) }),
        Asset: {
          Created: (value: Asset): EventBox => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.Created(value) }),
          Deleted: (value: lib.AssetId): EventBox => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Deleted(value),
          }),
          Added: (value: AssetChanged): EventBox => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Added(value),
          }),
          Removed: (value: AssetChanged): EventBox => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Removed(value),
          }),
          MetadataInserted: (value: MetadataChanged<lib.AssetId>): EventBox => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.MetadataInserted(value),
          }),
          MetadataRemoved: (value: MetadataChanged<lib.AssetId>): EventBox => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.MetadataRemoved(value),
          }),
        },
        PermissionAdded: (value: AccountPermissionChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionAdded(value),
        }),
        PermissionRemoved: (value: AccountPermissionChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionRemoved(value),
        }),
        RoleGranted: (value: AccountRoleChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleGranted(value),
        }),
        RoleRevoked: (value: AccountRoleChanged): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleRevoked(value),
        }),
        MetadataInserted: (value: MetadataChanged<lib.AccountId>): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataInserted(value),
        }),
        MetadataRemoved: (value: MetadataChanged<lib.AccountId>): EventBox => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataRemoved(value),
        }),
      },
      MetadataInserted: (value: MetadataChanged<lib.DomainId>): EventBox => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataInserted(value),
      }),
      MetadataRemoved: (value: MetadataChanged<lib.DomainId>): EventBox => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataRemoved(value),
      }),
      OwnerChanged: (value: DomainOwnerChanged): EventBox => ({
        kind: 'Data',
        value: DataEvent.Domain.OwnerChanged(value),
      }),
    },
    Trigger: {
      Created: (value: TriggerId): EventBox => ({ kind: 'Data', value: DataEvent.Trigger.Created(value) }),
      Deleted: (value: TriggerId): EventBox => ({ kind: 'Data', value: DataEvent.Trigger.Deleted(value) }),
      Extended: (value: TriggerNumberOfExecutionsChanged): EventBox => ({
        kind: 'Data',
        value: DataEvent.Trigger.Extended(value),
      }),
      Shortened: (value: TriggerNumberOfExecutionsChanged): EventBox => ({
        kind: 'Data',
        value: DataEvent.Trigger.Shortened(value),
      }),
      MetadataInserted: (value: MetadataChanged<TriggerId>): EventBox => ({
        kind: 'Data',
        value: DataEvent.Trigger.MetadataInserted(value),
      }),
      MetadataRemoved: (value: MetadataChanged<TriggerId>): EventBox => ({
        kind: 'Data',
        value: DataEvent.Trigger.MetadataRemoved(value),
      }),
    },
    Role: {
      Created: (value: Role): EventBox => ({ kind: 'Data', value: DataEvent.Role.Created(value) }),
      Deleted: (value: RoleId): EventBox => ({ kind: 'Data', value: DataEvent.Role.Deleted(value) }),
      PermissionAdded: (value: RolePermissionChanged): EventBox => ({
        kind: 'Data',
        value: DataEvent.Role.PermissionAdded(value),
      }),
      PermissionRemoved: (value: RolePermissionChanged): EventBox => ({
        kind: 'Data',
        value: DataEvent.Role.PermissionRemoved(value),
      }),
    },
    Configuration: {
      Changed: (value: ParameterChanged): EventBox => ({ kind: 'Data', value: DataEvent.Configuration.Changed(value) }),
    },
    Executor: {
      Upgraded: (value: ExecutorUpgrade): EventBox => ({ kind: 'Data', value: DataEvent.Executor.Upgraded(value) }),
    },
  },
  Time: (value: TimeEvent): EventBox => ({ kind: 'Time', value }),
  ExecuteTrigger: (value: ExecuteTriggerEvent): EventBox => ({ kind: 'ExecuteTrigger', value }),
  TriggerCompleted: (value: TriggerCompletedEvent): EventBox => ({ kind: 'TriggerCompleted', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Pipeline: [PipelineEventBox]
      Data: [DataEvent]
      Time: [TimeEvent]
      ExecuteTrigger: [ExecuteTriggerEvent]
      TriggerCompleted: [TriggerCompletedEvent]
    }>([
      [0, 'Pipeline', lib.codecOf(PipelineEventBox)],
      [1, 'Data', lib.codecOf(DataEvent)],
      [2, 'Time', lib.codecOf(TimeEvent)],
      [3, 'ExecuteTrigger', lib.codecOf(ExecuteTriggerEvent)],
      [4, 'TriggerCompleted', lib.codecOf(TriggerCompletedEvent)],
    ])
    .discriminated(),
}

export interface ExecuteTrigger {
  trigger: TriggerId
  args: lib.Json
}
export const ExecuteTrigger: lib.CodecProvider<ExecuteTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTrigger>(['trigger', 'args'], {
    trigger: lib.codecOf(TriggerId),
    args: lib.codecOf(lib.Json),
  }),
}

export interface Executor {
  wasm: lib.Vec<lib.U8>
}
export const Executor: lib.CodecProvider<Executor> = {
  [lib.CodecSymbol]: lib.structCodec<Executor>(['wasm'], { wasm: lib.codecOf(lib.Vec.with(lib.codecOf(lib.U8))) }),
}

export interface FindAccountsWithAsset {
  assetDefinition: lib.AssetDefinitionId
}
export const FindAccountsWithAsset: lib.CodecProvider<FindAccountsWithAsset> = {
  [lib.CodecSymbol]: lib.structCodec<FindAccountsWithAsset>(['assetDefinition'], {
    assetDefinition: lib.codecOf(lib.AssetDefinitionId),
  }),
}

export interface FindPermissionsByAccountId {
  id: lib.AccountId
}
export const FindPermissionsByAccountId: lib.CodecProvider<FindPermissionsByAccountId> = {
  [lib.CodecSymbol]: lib.structCodec<FindPermissionsByAccountId>(['id'], { id: lib.codecOf(lib.AccountId) }),
}

export interface FindRolesByAccountId {
  id: lib.AccountId
}
export const FindRolesByAccountId: lib.CodecProvider<FindRolesByAccountId> = {
  [lib.CodecSymbol]: lib.structCodec<FindRolesByAccountId>(['id'], { id: lib.codecOf(lib.AccountId) }),
}

export interface ForwardCursor {
  query: lib.String
  cursor: lib.U64
}
export const ForwardCursor: lib.CodecProvider<ForwardCursor> = {
  [lib.CodecSymbol]: lib.structCodec<ForwardCursor>(['query', 'cursor'], {
    query: lib.codecOf(lib.String),
    cursor: lib.codecOf(lib.U64),
  }),
}

export interface GenesisWasmAction {
  executable: lib.String
  repeats: Repeats
  authority: lib.AccountId
  filter: EventFilterBox
}
export const GenesisWasmAction: lib.CodecProvider<GenesisWasmAction> = {
  [lib.CodecSymbol]: lib.structCodec<GenesisWasmAction>(['executable', 'repeats', 'authority', 'filter'], {
    executable: lib.codecOf(lib.String),
    repeats: lib.codecOf(Repeats),
    authority: lib.codecOf(lib.AccountId),
    filter: lib.codecOf(EventFilterBox),
  }),
}

export interface GenesisWasmTrigger {
  id: TriggerId
  action: GenesisWasmAction
}
export const GenesisWasmTrigger: lib.CodecProvider<GenesisWasmTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<GenesisWasmTrigger>(['id', 'action'], {
    id: lib.codecOf(TriggerId),
    action: lib.codecOf(GenesisWasmAction),
  }),
}

export interface Grant<T0, T1> {
  object: T0
  destination: T1
}
export const Grant = {
  with: <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>): lib.CodecProvider<Grant<T0, T1>> => ({
    [lib.CodecSymbol]: lib.structCodec<Grant<T0, T1>>(['object', 'destination'], { object: t0, destination: t1 }),
  }),
}

export type GrantBox =
  | lib.SumTypeKindValue<'Permission', Grant<Permission, lib.AccountId>>
  | lib.SumTypeKindValue<'Role', Grant<RoleId, lib.AccountId>>
  | lib.SumTypeKindValue<'RolePermission', Grant<Permission, RoleId>>
export const GrantBox = {
  Permission: (value: Grant<Permission, lib.AccountId>): GrantBox => ({ kind: 'Permission', value }),
  Role: (value: Grant<RoleId, lib.AccountId>): GrantBox => ({ kind: 'Role', value }),
  RolePermission: (value: Grant<Permission, RoleId>): GrantBox => ({ kind: 'RolePermission', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Permission: [Grant<Permission, lib.AccountId>]
      Role: [Grant<RoleId, lib.AccountId>]
      RolePermission: [Grant<Permission, RoleId>]
    }>([
      [0, 'Permission', lib.codecOf(Grant.with(lib.codecOf(Permission), lib.codecOf(lib.AccountId)))],
      [1, 'Role', lib.codecOf(Grant.with(lib.codecOf(RoleId), lib.codecOf(lib.AccountId)))],
      [2, 'RolePermission', lib.codecOf(Grant.with(lib.codecOf(Permission), lib.codecOf(RoleId)))],
    ])
    .discriminated(),
}

export interface NewDomain {
  id: lib.DomainId
  logo: lib.Option<lib.String>
  metadata: lib.Map<lib.Name, lib.Json>
}
export const NewDomain: lib.CodecProvider<NewDomain> = {
  [lib.CodecSymbol]: lib.structCodec<NewDomain>(['id', 'logo', 'metadata'], {
    id: lib.codecOf(lib.DomainId),
    logo: lib.codecOf(lib.Option.with(lib.codecOf(lib.String))),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
  }),
}

export interface NewAccount {
  id: lib.AccountId
  metadata: lib.Map<lib.Name, lib.Json>
}
export const NewAccount: lib.CodecProvider<NewAccount> = {
  [lib.CodecSymbol]: lib.structCodec<NewAccount>(['id', 'metadata'], {
    id: lib.codecOf(lib.AccountId),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
  }),
}

export interface NewAssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<lib.String>
  metadata: lib.Map<lib.Name, lib.Json>
}
export const NewAssetDefinition: lib.CodecProvider<NewAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<NewAssetDefinition>(['id', 'type', 'mintable', 'logo', 'metadata'], {
    id: lib.codecOf(lib.AssetDefinitionId),
    type: lib.codecOf(AssetType),
    mintable: lib.codecOf(Mintable),
    logo: lib.codecOf(lib.Option.with(lib.codecOf(lib.String))),
    metadata: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))),
  }),
}

export interface NewRole {
  inner: Role
  grantTo: lib.AccountId
}
export const NewRole: lib.CodecProvider<NewRole> = {
  [lib.CodecSymbol]: lib.structCodec<NewRole>(['inner', 'grantTo'], {
    inner: lib.codecOf(Role),
    grantTo: lib.codecOf(lib.AccountId),
  }),
}

export interface Trigger {
  id: TriggerId
  action: Action
}
export const Trigger: lib.CodecProvider<Trigger> = {
  [lib.CodecSymbol]: lib.structCodec<Trigger>(['id', 'action'], {
    id: lib.codecOf(TriggerId),
    action: lib.codecOf(Action),
  }),
}

export type RegisterBox =
  | lib.SumTypeKindValue<'Peer', PeerId>
  | lib.SumTypeKindValue<'Domain', NewDomain>
  | lib.SumTypeKindValue<'Account', NewAccount>
  | lib.SumTypeKindValue<'AssetDefinition', NewAssetDefinition>
  | lib.SumTypeKindValue<'Asset', Asset>
  | lib.SumTypeKindValue<'Role', NewRole>
  | lib.SumTypeKindValue<'Trigger', Trigger>
export const RegisterBox = {
  Peer: (value: PeerId): RegisterBox => ({ kind: 'Peer', value }),
  Domain: (value: NewDomain): RegisterBox => ({ kind: 'Domain', value }),
  Account: (value: NewAccount): RegisterBox => ({ kind: 'Account', value }),
  AssetDefinition: (value: NewAssetDefinition): RegisterBox => ({ kind: 'AssetDefinition', value }),
  Asset: (value: Asset): RegisterBox => ({ kind: 'Asset', value }),
  Role: (value: NewRole): RegisterBox => ({ kind: 'Role', value }),
  Trigger: (value: Trigger): RegisterBox => ({ kind: 'Trigger', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Peer: [PeerId]
      Domain: [NewDomain]
      Account: [NewAccount]
      AssetDefinition: [NewAssetDefinition]
      Asset: [Asset]
      Role: [NewRole]
      Trigger: [Trigger]
    }>([
      [0, 'Peer', lib.codecOf(PeerId)],
      [1, 'Domain', lib.codecOf(NewDomain)],
      [2, 'Account', lib.codecOf(NewAccount)],
      [3, 'AssetDefinition', lib.codecOf(NewAssetDefinition)],
      [4, 'Asset', lib.codecOf(Asset)],
      [5, 'Role', lib.codecOf(NewRole)],
      [6, 'Trigger', lib.codecOf(Trigger)],
    ])
    .discriminated(),
}

export type UnregisterBox =
  | lib.SumTypeKindValue<'Peer', PeerId>
  | lib.SumTypeKindValue<'Domain', lib.DomainId>
  | lib.SumTypeKindValue<'Account', lib.AccountId>
  | lib.SumTypeKindValue<'AssetDefinition', lib.AssetDefinitionId>
  | lib.SumTypeKindValue<'Asset', lib.AssetId>
  | lib.SumTypeKindValue<'Role', RoleId>
  | lib.SumTypeKindValue<'Trigger', TriggerId>
export const UnregisterBox = {
  Peer: (value: PeerId): UnregisterBox => ({ kind: 'Peer', value }),
  Domain: (value: lib.DomainId): UnregisterBox => ({ kind: 'Domain', value }),
  Account: (value: lib.AccountId): UnregisterBox => ({ kind: 'Account', value }),
  AssetDefinition: (value: lib.AssetDefinitionId): UnregisterBox => ({ kind: 'AssetDefinition', value }),
  Asset: (value: lib.AssetId): UnregisterBox => ({ kind: 'Asset', value }),
  Role: (value: RoleId): UnregisterBox => ({ kind: 'Role', value }),
  Trigger: (value: TriggerId): UnregisterBox => ({ kind: 'Trigger', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Peer: [PeerId]
      Domain: [lib.DomainId]
      Account: [lib.AccountId]
      AssetDefinition: [lib.AssetDefinitionId]
      Asset: [lib.AssetId]
      Role: [RoleId]
      Trigger: [TriggerId]
    }>([
      [0, 'Peer', lib.codecOf(PeerId)],
      [1, 'Domain', lib.codecOf(lib.DomainId)],
      [2, 'Account', lib.codecOf(lib.AccountId)],
      [3, 'AssetDefinition', lib.codecOf(lib.AssetDefinitionId)],
      [4, 'Asset', lib.codecOf(lib.AssetId)],
      [5, 'Role', lib.codecOf(RoleId)],
      [6, 'Trigger', lib.codecOf(TriggerId)],
    ])
    .discriminated(),
}

export interface Mint<T0, T1> {
  object: T0
  destination: T1
}
export const Mint = {
  with: <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>): lib.CodecProvider<Mint<T0, T1>> => ({
    [lib.CodecSymbol]: lib.structCodec<Mint<T0, T1>>(['object', 'destination'], { object: t0, destination: t1 }),
  }),
}

export type MintBox =
  | lib.SumTypeKindValue<'Asset', Mint<Numeric, lib.AssetId>>
  | lib.SumTypeKindValue<'TriggerRepetitions', Mint<lib.U32, TriggerId>>
export const MintBox = {
  Asset: (value: Mint<Numeric, lib.AssetId>): MintBox => ({ kind: 'Asset', value }),
  TriggerRepetitions: (value: Mint<lib.U32, TriggerId>): MintBox => ({ kind: 'TriggerRepetitions', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Asset: [Mint<Numeric, lib.AssetId>]; TriggerRepetitions: [Mint<lib.U32, TriggerId>] }>([
      [0, 'Asset', lib.codecOf(Mint.with(lib.codecOf(Numeric), lib.codecOf(lib.AssetId)))],
      [1, 'TriggerRepetitions', lib.codecOf(Mint.with(lib.codecOf(lib.U32), lib.codecOf(TriggerId)))],
    ])
    .discriminated(),
}

export type TransferBox =
  | lib.SumTypeKindValue<'Domain', Transfer<lib.AccountId, lib.DomainId, lib.AccountId>>
  | lib.SumTypeKindValue<'AssetDefinition', Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>>
  | lib.SumTypeKindValue<'Asset', AssetTransferBox>
export const TransferBox = {
  Domain: (value: Transfer<lib.AccountId, lib.DomainId, lib.AccountId>): TransferBox => ({ kind: 'Domain', value }),
  AssetDefinition: (value: Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>): TransferBox => ({
    kind: 'AssetDefinition',
    value,
  }),
  Asset: {
    Numeric: (value: Transfer<lib.AssetId, Numeric, lib.AccountId>): TransferBox => ({
      kind: 'Asset',
      value: AssetTransferBox.Numeric(value),
    }),
    Store: (value: Transfer<lib.AssetId, lib.Map<lib.Name, lib.Json>, lib.AccountId>): TransferBox => ({
      kind: 'Asset',
      value: AssetTransferBox.Store(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Domain: [Transfer<lib.AccountId, lib.DomainId, lib.AccountId>]
      AssetDefinition: [Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>]
      Asset: [AssetTransferBox]
    }>([
      [
        0,
        'Domain',
        lib.codecOf(Transfer.with(lib.codecOf(lib.AccountId), lib.codecOf(lib.DomainId), lib.codecOf(lib.AccountId))),
      ],
      [
        1,
        'AssetDefinition',
        lib.codecOf(
          Transfer.with(lib.codecOf(lib.AccountId), lib.codecOf(lib.AssetDefinitionId), lib.codecOf(lib.AccountId)),
        ),
      ],
      [2, 'Asset', lib.codecOf(AssetTransferBox)],
    ])
    .discriminated(),
}

export interface SetKeyValue<T0> {
  object: T0
  key: lib.Name
  value: lib.Json
}
export const SetKeyValue = {
  with: <T0,>(t0: lib.Codec<T0>): lib.CodecProvider<SetKeyValue<T0>> => ({
    [lib.CodecSymbol]: lib.structCodec<SetKeyValue<T0>>(['object', 'key', 'value'], {
      object: t0,
      key: lib.codecOf(lib.Name),
      value: lib.codecOf(lib.Json),
    }),
  }),
}

export type SetKeyValueBox =
  | lib.SumTypeKindValue<'Domain', SetKeyValue<lib.DomainId>>
  | lib.SumTypeKindValue<'Account', SetKeyValue<lib.AccountId>>
  | lib.SumTypeKindValue<'AssetDefinition', SetKeyValue<lib.AssetDefinitionId>>
  | lib.SumTypeKindValue<'Asset', SetKeyValue<lib.AssetId>>
  | lib.SumTypeKindValue<'Trigger', SetKeyValue<TriggerId>>
export const SetKeyValueBox = {
  Domain: (value: SetKeyValue<lib.DomainId>): SetKeyValueBox => ({ kind: 'Domain', value }),
  Account: (value: SetKeyValue<lib.AccountId>): SetKeyValueBox => ({ kind: 'Account', value }),
  AssetDefinition: (value: SetKeyValue<lib.AssetDefinitionId>): SetKeyValueBox => ({ kind: 'AssetDefinition', value }),
  Asset: (value: SetKeyValue<lib.AssetId>): SetKeyValueBox => ({ kind: 'Asset', value }),
  Trigger: (value: SetKeyValue<TriggerId>): SetKeyValueBox => ({ kind: 'Trigger', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Domain: [SetKeyValue<lib.DomainId>]
      Account: [SetKeyValue<lib.AccountId>]
      AssetDefinition: [SetKeyValue<lib.AssetDefinitionId>]
      Asset: [SetKeyValue<lib.AssetId>]
      Trigger: [SetKeyValue<TriggerId>]
    }>([
      [0, 'Domain', lib.codecOf(SetKeyValue.with(lib.codecOf(lib.DomainId)))],
      [1, 'Account', lib.codecOf(SetKeyValue.with(lib.codecOf(lib.AccountId)))],
      [2, 'AssetDefinition', lib.codecOf(SetKeyValue.with(lib.codecOf(lib.AssetDefinitionId)))],
      [3, 'Asset', lib.codecOf(SetKeyValue.with(lib.codecOf(lib.AssetId)))],
      [4, 'Trigger', lib.codecOf(SetKeyValue.with(lib.codecOf(TriggerId)))],
    ])
    .discriminated(),
}

export interface RemoveKeyValue<T0> {
  object: T0
  key: lib.Name
}
export const RemoveKeyValue = {
  with: <T0,>(t0: lib.Codec<T0>): lib.CodecProvider<RemoveKeyValue<T0>> => ({
    [lib.CodecSymbol]: lib.structCodec<RemoveKeyValue<T0>>(['object', 'key'], {
      object: t0,
      key: lib.codecOf(lib.Name),
    }),
  }),
}

export type RemoveKeyValueBox =
  | lib.SumTypeKindValue<'Domain', RemoveKeyValue<lib.DomainId>>
  | lib.SumTypeKindValue<'Account', RemoveKeyValue<lib.AccountId>>
  | lib.SumTypeKindValue<'AssetDefinition', RemoveKeyValue<lib.AssetDefinitionId>>
  | lib.SumTypeKindValue<'Asset', RemoveKeyValue<lib.AssetId>>
  | lib.SumTypeKindValue<'Trigger', RemoveKeyValue<TriggerId>>
export const RemoveKeyValueBox = {
  Domain: (value: RemoveKeyValue<lib.DomainId>): RemoveKeyValueBox => ({ kind: 'Domain', value }),
  Account: (value: RemoveKeyValue<lib.AccountId>): RemoveKeyValueBox => ({ kind: 'Account', value }),
  AssetDefinition: (value: RemoveKeyValue<lib.AssetDefinitionId>): RemoveKeyValueBox => ({
    kind: 'AssetDefinition',
    value,
  }),
  Asset: (value: RemoveKeyValue<lib.AssetId>): RemoveKeyValueBox => ({ kind: 'Asset', value }),
  Trigger: (value: RemoveKeyValue<TriggerId>): RemoveKeyValueBox => ({ kind: 'Trigger', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Domain: [RemoveKeyValue<lib.DomainId>]
      Account: [RemoveKeyValue<lib.AccountId>]
      AssetDefinition: [RemoveKeyValue<lib.AssetDefinitionId>]
      Asset: [RemoveKeyValue<lib.AssetId>]
      Trigger: [RemoveKeyValue<TriggerId>]
    }>([
      [0, 'Domain', lib.codecOf(RemoveKeyValue.with(lib.codecOf(lib.DomainId)))],
      [1, 'Account', lib.codecOf(RemoveKeyValue.with(lib.codecOf(lib.AccountId)))],
      [2, 'AssetDefinition', lib.codecOf(RemoveKeyValue.with(lib.codecOf(lib.AssetDefinitionId)))],
      [3, 'Asset', lib.codecOf(RemoveKeyValue.with(lib.codecOf(lib.AssetId)))],
      [4, 'Trigger', lib.codecOf(RemoveKeyValue.with(lib.codecOf(TriggerId)))],
    ])
    .discriminated(),
}

export interface Revoke<T0, T1> {
  object: T0
  destination: T1
}
export const Revoke = {
  with: <T0, T1>(t0: lib.Codec<T0>, t1: lib.Codec<T1>): lib.CodecProvider<Revoke<T0, T1>> => ({
    [lib.CodecSymbol]: lib.structCodec<Revoke<T0, T1>>(['object', 'destination'], { object: t0, destination: t1 }),
  }),
}

export type RevokeBox =
  | lib.SumTypeKindValue<'Permission', Revoke<Permission, lib.AccountId>>
  | lib.SumTypeKindValue<'Role', Revoke<RoleId, lib.AccountId>>
  | lib.SumTypeKindValue<'RolePermission', Revoke<Permission, RoleId>>
export const RevokeBox = {
  Permission: (value: Revoke<Permission, lib.AccountId>): RevokeBox => ({ kind: 'Permission', value }),
  Role: (value: Revoke<RoleId, lib.AccountId>): RevokeBox => ({ kind: 'Role', value }),
  RolePermission: (value: Revoke<Permission, RoleId>): RevokeBox => ({ kind: 'RolePermission', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Permission: [Revoke<Permission, lib.AccountId>]
      Role: [Revoke<RoleId, lib.AccountId>]
      RolePermission: [Revoke<Permission, RoleId>]
    }>([
      [0, 'Permission', lib.codecOf(Revoke.with(lib.codecOf(Permission), lib.codecOf(lib.AccountId)))],
      [1, 'Role', lib.codecOf(Revoke.with(lib.codecOf(RoleId), lib.codecOf(lib.AccountId)))],
      [2, 'RolePermission', lib.codecOf(Revoke.with(lib.codecOf(Permission), lib.codecOf(RoleId)))],
    ])
    .discriminated(),
}

export interface Upgrade {
  executor: Executor
}
export const Upgrade: lib.CodecProvider<Upgrade> = {
  [lib.CodecSymbol]: lib.structCodec<Upgrade>(['executor'], { executor: lib.codecOf(Executor) }),
}

export type Level =
  | lib.SumTypeKind<'TRACE'>
  | lib.SumTypeKind<'DEBUG'>
  | lib.SumTypeKind<'INFO'>
  | lib.SumTypeKind<'WARN'>
  | lib.SumTypeKind<'ERROR'>
export const Level = {
  TRACE: Object.freeze<Level>({ kind: 'TRACE' }),
  DEBUG: Object.freeze<Level>({ kind: 'DEBUG' }),
  INFO: Object.freeze<Level>({ kind: 'INFO' }),
  WARN: Object.freeze<Level>({ kind: 'WARN' }),
  ERROR: Object.freeze<Level>({ kind: 'ERROR' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ TRACE: []; DEBUG: []; INFO: []; WARN: []; ERROR: [] }>([
      [0, 'TRACE'],
      [1, 'DEBUG'],
      [2, 'INFO'],
      [3, 'WARN'],
      [4, 'ERROR'],
    ])
    .discriminated(),
}

export interface Log {
  level: Level
  msg: lib.String
}
export const Log: lib.CodecProvider<Log> = {
  [lib.CodecSymbol]: lib.structCodec<Log>(['level', 'msg'], {
    level: lib.codecOf(Level),
    msg: lib.codecOf(lib.String),
  }),
}

export type InstructionBox =
  | lib.SumTypeKindValue<'Register', RegisterBox>
  | lib.SumTypeKindValue<'Unregister', UnregisterBox>
  | lib.SumTypeKindValue<'Mint', MintBox>
  | lib.SumTypeKindValue<'Burn', BurnBox>
  | lib.SumTypeKindValue<'Transfer', TransferBox>
  | lib.SumTypeKindValue<'SetKeyValue', SetKeyValueBox>
  | lib.SumTypeKindValue<'RemoveKeyValue', RemoveKeyValueBox>
  | lib.SumTypeKindValue<'Grant', GrantBox>
  | lib.SumTypeKindValue<'Revoke', RevokeBox>
  | lib.SumTypeKindValue<'ExecuteTrigger', ExecuteTrigger>
  | lib.SumTypeKindValue<'SetParameter', Parameter>
  | lib.SumTypeKindValue<'Upgrade', Upgrade>
  | lib.SumTypeKindValue<'Log', Log>
  | lib.SumTypeKindValue<'Custom', CustomInstruction>
export const InstructionBox = {
  Register: {
    Peer: (value: PeerId): InstructionBox => ({ kind: 'Register', value: RegisterBox.Peer(value) }),
    Domain: (value: NewDomain): InstructionBox => ({ kind: 'Register', value: RegisterBox.Domain(value) }),
    Account: (value: NewAccount): InstructionBox => ({ kind: 'Register', value: RegisterBox.Account(value) }),
    AssetDefinition: (value: NewAssetDefinition): InstructionBox => ({
      kind: 'Register',
      value: RegisterBox.AssetDefinition(value),
    }),
    Asset: (value: Asset): InstructionBox => ({ kind: 'Register', value: RegisterBox.Asset(value) }),
    Role: (value: NewRole): InstructionBox => ({ kind: 'Register', value: RegisterBox.Role(value) }),
    Trigger: (value: Trigger): InstructionBox => ({ kind: 'Register', value: RegisterBox.Trigger(value) }),
  },
  Unregister: {
    Peer: (value: PeerId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Peer(value) }),
    Domain: (value: lib.DomainId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Domain(value) }),
    Account: (value: lib.AccountId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Account(value) }),
    AssetDefinition: (value: lib.AssetDefinitionId): InstructionBox => ({
      kind: 'Unregister',
      value: UnregisterBox.AssetDefinition(value),
    }),
    Asset: (value: lib.AssetId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Asset(value) }),
    Role: (value: RoleId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Role(value) }),
    Trigger: (value: TriggerId): InstructionBox => ({ kind: 'Unregister', value: UnregisterBox.Trigger(value) }),
  },
  Mint: {
    Asset: (value: Mint<Numeric, lib.AssetId>): InstructionBox => ({ kind: 'Mint', value: MintBox.Asset(value) }),
    TriggerRepetitions: (value: Mint<lib.U32, TriggerId>): InstructionBox => ({
      kind: 'Mint',
      value: MintBox.TriggerRepetitions(value),
    }),
  },
  Burn: {
    Asset: (value: Burn<Numeric, lib.AssetId>): InstructionBox => ({ kind: 'Burn', value: BurnBox.Asset(value) }),
    TriggerRepetitions: (value: Burn<lib.U32, TriggerId>): InstructionBox => ({
      kind: 'Burn',
      value: BurnBox.TriggerRepetitions(value),
    }),
  },
  Transfer: {
    Domain: (value: Transfer<lib.AccountId, lib.DomainId, lib.AccountId>): InstructionBox => ({
      kind: 'Transfer',
      value: TransferBox.Domain(value),
    }),
    AssetDefinition: (value: Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>): InstructionBox => ({
      kind: 'Transfer',
      value: TransferBox.AssetDefinition(value),
    }),
    Asset: {
      Numeric: (value: Transfer<lib.AssetId, Numeric, lib.AccountId>): InstructionBox => ({
        kind: 'Transfer',
        value: TransferBox.Asset.Numeric(value),
      }),
      Store: (value: Transfer<lib.AssetId, lib.Map<lib.Name, lib.Json>, lib.AccountId>): InstructionBox => ({
        kind: 'Transfer',
        value: TransferBox.Asset.Store(value),
      }),
    },
  },
  SetKeyValue: {
    Domain: (value: SetKeyValue<lib.DomainId>): InstructionBox => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Domain(value),
    }),
    Account: (value: SetKeyValue<lib.AccountId>): InstructionBox => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Account(value),
    }),
    AssetDefinition: (value: SetKeyValue<lib.AssetDefinitionId>): InstructionBox => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.AssetDefinition(value),
    }),
    Asset: (value: SetKeyValue<lib.AssetId>): InstructionBox => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Asset(value),
    }),
    Trigger: (value: SetKeyValue<TriggerId>): InstructionBox => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Trigger(value),
    }),
  },
  RemoveKeyValue: {
    Domain: (value: RemoveKeyValue<lib.DomainId>): InstructionBox => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Domain(value),
    }),
    Account: (value: RemoveKeyValue<lib.AccountId>): InstructionBox => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Account(value),
    }),
    AssetDefinition: (value: RemoveKeyValue<lib.AssetDefinitionId>): InstructionBox => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.AssetDefinition(value),
    }),
    Asset: (value: RemoveKeyValue<lib.AssetId>): InstructionBox => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Asset(value),
    }),
    Trigger: (value: RemoveKeyValue<TriggerId>): InstructionBox => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Trigger(value),
    }),
  },
  Grant: {
    Permission: (value: Grant<Permission, lib.AccountId>): InstructionBox => ({
      kind: 'Grant',
      value: GrantBox.Permission(value),
    }),
    Role: (value: Grant<RoleId, lib.AccountId>): InstructionBox => ({ kind: 'Grant', value: GrantBox.Role(value) }),
    RolePermission: (value: Grant<Permission, RoleId>): InstructionBox => ({
      kind: 'Grant',
      value: GrantBox.RolePermission(value),
    }),
  },
  Revoke: {
    Permission: (value: Revoke<Permission, lib.AccountId>): InstructionBox => ({
      kind: 'Revoke',
      value: RevokeBox.Permission(value),
    }),
    Role: (value: Revoke<RoleId, lib.AccountId>): InstructionBox => ({ kind: 'Revoke', value: RevokeBox.Role(value) }),
    RolePermission: (value: Revoke<Permission, RoleId>): InstructionBox => ({
      kind: 'Revoke',
      value: RevokeBox.RolePermission(value),
    }),
  },
  ExecuteTrigger: (value: ExecuteTrigger): InstructionBox => ({ kind: 'ExecuteTrigger', value }),
  SetParameter: {
    Sumeragi: {
      BlockTimeMs: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Sumeragi.BlockTimeMs(value),
      }),
      CommitTimeMs: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Sumeragi.CommitTimeMs(value),
      }),
      MaxClockDriftMs: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Sumeragi.MaxClockDriftMs(value),
      }),
    },
    Block: {
      MaxTransactions: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Block.MaxTransactions(value),
      }),
    },
    Transaction: {
      MaxInstructions: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Transaction.MaxInstructions(value),
      }),
      SmartContractSize: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.Transaction.SmartContractSize(value),
      }),
    },
    SmartContract: {
      Fuel: (value: lib.U64): InstructionBox => ({ kind: 'SetParameter', value: Parameter.SmartContract.Fuel(value) }),
      Memory: (value: lib.U64): InstructionBox => ({
        kind: 'SetParameter',
        value: Parameter.SmartContract.Memory(value),
      }),
    },
    Executor: {
      Fuel: (value: lib.U64): InstructionBox => ({ kind: 'SetParameter', value: Parameter.Executor.Fuel(value) }),
      Memory: (value: lib.U64): InstructionBox => ({ kind: 'SetParameter', value: Parameter.Executor.Memory(value) }),
    },
    Custom: (value: CustomParameter): InstructionBox => ({ kind: 'SetParameter', value: Parameter.Custom(value) }),
  },
  Upgrade: (value: Upgrade): InstructionBox => ({ kind: 'Upgrade', value }),
  Log: (value: Log): InstructionBox => ({ kind: 'Log', value }),
  Custom: (value: CustomInstruction): InstructionBox => ({ kind: 'Custom', value }),
  [lib.CodecSymbol]: lib
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
      SetParameter: [Parameter]
      Upgrade: [Upgrade]
      Log: [Log]
      Custom: [CustomInstruction]
    }>([
      [0, 'Register', lib.codecOf(RegisterBox)],
      [1, 'Unregister', lib.codecOf(UnregisterBox)],
      [2, 'Mint', lib.codecOf(MintBox)],
      [3, 'Burn', lib.codecOf(BurnBox)],
      [4, 'Transfer', lib.codecOf(TransferBox)],
      [5, 'SetKeyValue', lib.codecOf(SetKeyValueBox)],
      [6, 'RemoveKeyValue', lib.codecOf(RemoveKeyValueBox)],
      [7, 'Grant', lib.codecOf(GrantBox)],
      [8, 'Revoke', lib.codecOf(RevokeBox)],
      [9, 'ExecuteTrigger', lib.codecOf(ExecuteTrigger)],
      [10, 'SetParameter', lib.codecOf(Parameter)],
      [11, 'Upgrade', lib.codecOf(Upgrade)],
      [12, 'Log', lib.codecOf(Log)],
      [13, 'Custom', lib.codecOf(CustomInstruction)],
    ])
    .discriminated(),
}

export type Ipv4Addr = [lib.U8, lib.U8, lib.U8, lib.U8]
export const Ipv4Addr = {
  [lib.CodecSymbol]: lib.tupleCodec([
    lib.codecOf(lib.U8),
    lib.codecOf(lib.U8),
    lib.codecOf(lib.U8),
    lib.codecOf(lib.U8),
  ]) satisfies lib.Codec<Ipv4Addr>,
}

export type Ipv6Addr = [lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16]
export const Ipv6Addr = {
  [lib.CodecSymbol]: lib.tupleCodec([
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
    lib.codecOf(lib.U16),
  ]) satisfies lib.Codec<Ipv6Addr>,
}

export interface MultisigApprove {
  account: lib.AccountId
  instructionsHash: lib.HashWrap
}
export const MultisigApprove: lib.CodecProvider<MultisigApprove> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigApprove>(['account', 'instructionsHash'], {
    account: lib.codecOf(lib.AccountId),
    instructionsHash: lib.codecOf(lib.HashWrap),
  }),
}

export interface MultisigSpec {
  signatories: lib.Map<lib.AccountId, lib.U8>
  quorum: lib.U16
  transactionTtlMs: lib.U64
}
export const MultisigSpec: lib.CodecProvider<MultisigSpec> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigSpec>(['signatories', 'quorum', 'transactionTtlMs'], {
    signatories: lib.codecOf(lib.Map.with(lib.codecOf(lib.AccountId), lib.codecOf(lib.U8))),
    quorum: lib.codecOf(lib.U16),
    transactionTtlMs: lib.codecOf(lib.U64),
  }),
}

export interface MultisigRegister {
  account: lib.AccountId
  spec: MultisigSpec
}
export const MultisigRegister: lib.CodecProvider<MultisigRegister> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigRegister>(['account', 'spec'], {
    account: lib.codecOf(lib.AccountId),
    spec: lib.codecOf(MultisigSpec),
  }),
}

export interface MultisigPropose {
  account: lib.AccountId
  instructions: lib.Vec<InstructionBox>
  transactionTtlMs: lib.Option<lib.U64>
}
export const MultisigPropose: lib.CodecProvider<MultisigPropose> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigPropose>(['account', 'instructions', 'transactionTtlMs'], {
    account: lib.codecOf(lib.AccountId),
    instructions: lib.codecOf(lib.Vec.with(lib.lazyCodec(() => lib.codecOf(InstructionBox)))),
    transactionTtlMs: lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))),
  }),
}

export type MultisigInstructionBox =
  | lib.SumTypeKindValue<'Register', MultisigRegister>
  | lib.SumTypeKindValue<'Propose', MultisigPropose>
  | lib.SumTypeKindValue<'Approve', MultisigApprove>
export const MultisigInstructionBox = {
  Register: (value: MultisigRegister): MultisigInstructionBox => ({ kind: 'Register', value }),
  Propose: (value: MultisigPropose): MultisigInstructionBox => ({ kind: 'Propose', value }),
  Approve: (value: MultisigApprove): MultisigInstructionBox => ({ kind: 'Approve', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Register: [MultisigRegister]; Propose: [MultisigPropose]; Approve: [MultisigApprove] }>([
      [0, 'Register', lib.codecOf(MultisigRegister)],
      [1, 'Propose', lib.codecOf(MultisigPropose)],
      [2, 'Approve', lib.codecOf(MultisigApprove)],
    ])
    .discriminated(),
}

export interface MultisigProposalValue {
  instructions: lib.Vec<InstructionBox>
  proposedAtMs: lib.U64
  expiresAtMs: lib.U64
  approvals: lib.Vec<lib.AccountId>
  isRelayed: lib.Option<lib.Bool>
}
export const MultisigProposalValue: lib.CodecProvider<MultisigProposalValue> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigProposalValue>(
    ['instructions', 'proposedAtMs', 'expiresAtMs', 'approvals', 'isRelayed'],
    {
      instructions: lib.codecOf(lib.Vec.with(lib.lazyCodec(() => lib.codecOf(InstructionBox)))),
      proposedAtMs: lib.codecOf(lib.U64),
      expiresAtMs: lib.codecOf(lib.U64),
      approvals: lib.codecOf(lib.Vec.with(lib.codecOf(lib.AccountId))),
      isRelayed: lib.codecOf(lib.Option.with(lib.codecOf(lib.Bool))),
    },
  ),
}

export interface Pagination {
  limit: lib.Option<lib.U64>
  offset: lib.U64
}
export const Pagination: lib.CodecProvider<Pagination> = {
  [lib.CodecSymbol]: lib.structCodec<Pagination>(['limit', 'offset'], {
    limit: lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))),
    offset: lib.codecOf(lib.U64),
  }),
}

export interface SumeragiParameters {
  blockTimeMs: lib.U64
  commitTimeMs: lib.U64
  maxClockDriftMs: lib.U64
}
export const SumeragiParameters: lib.CodecProvider<SumeragiParameters> = {
  [lib.CodecSymbol]: lib.structCodec<SumeragiParameters>(['blockTimeMs', 'commitTimeMs', 'maxClockDriftMs'], {
    blockTimeMs: lib.codecOf(lib.U64),
    commitTimeMs: lib.codecOf(lib.U64),
    maxClockDriftMs: lib.codecOf(lib.U64),
  }),
}

export interface TransactionParameters {
  maxInstructions: lib.U64
  smartContractSize: lib.U64
}
export const TransactionParameters: lib.CodecProvider<TransactionParameters> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionParameters>(['maxInstructions', 'smartContractSize'], {
    maxInstructions: lib.codecOf(lib.U64),
    smartContractSize: lib.codecOf(lib.U64),
  }),
}

export interface SmartContractParameters {
  fuel: lib.U64
  memory: lib.U64
}
export const SmartContractParameters: lib.CodecProvider<SmartContractParameters> = {
  [lib.CodecSymbol]: lib.structCodec<SmartContractParameters>(['fuel', 'memory'], {
    fuel: lib.codecOf(lib.U64),
    memory: lib.codecOf(lib.U64),
  }),
}

export interface Parameters {
  sumeragi: SumeragiParameters
  block: BlockParameters
  transaction: TransactionParameters
  executor: SmartContractParameters
  smartContract: SmartContractParameters
  custom: lib.Map<lib.Name, CustomParameter>
}
export const Parameters: lib.CodecProvider<Parameters> = {
  [lib.CodecSymbol]: lib.structCodec<Parameters>(
    ['sumeragi', 'block', 'transaction', 'executor', 'smartContract', 'custom'],
    {
      sumeragi: lib.codecOf(SumeragiParameters),
      block: lib.codecOf(BlockParameters),
      transaction: lib.codecOf(TransactionParameters),
      executor: lib.codecOf(SmartContractParameters),
      smartContract: lib.codecOf(SmartContractParameters),
      custom: lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(CustomParameter))),
    },
  ),
}

export interface SocketAddrV4 {
  ip: Ipv4Addr
  port: lib.U16
}
export const SocketAddrV4: lib.CodecProvider<SocketAddrV4> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrV4>(['ip', 'port'], {
    ip: lib.codecOf(Ipv4Addr),
    port: lib.codecOf(lib.U16),
  }),
}

export interface SocketAddrV6 {
  ip: Ipv6Addr
  port: lib.U16
}
export const SocketAddrV6: lib.CodecProvider<SocketAddrV6> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrV6>(['ip', 'port'], {
    ip: lib.codecOf(Ipv6Addr),
    port: lib.codecOf(lib.U16),
  }),
}

export interface SocketAddrHost {
  host: lib.String
  port: lib.U16
}
export const SocketAddrHost: lib.CodecProvider<SocketAddrHost> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrHost>(['host', 'port'], {
    host: lib.codecOf(lib.String),
    port: lib.codecOf(lib.U16),
  }),
}

export type SocketAddr =
  | lib.SumTypeKindValue<'Ipv4', SocketAddrV4>
  | lib.SumTypeKindValue<'Ipv6', SocketAddrV6>
  | lib.SumTypeKindValue<'Host', SocketAddrHost>
export const SocketAddr = {
  Ipv4: (value: SocketAddrV4): SocketAddr => ({ kind: 'Ipv4', value }),
  Ipv6: (value: SocketAddrV6): SocketAddr => ({ kind: 'Ipv6', value }),
  Host: (value: SocketAddrHost): SocketAddr => ({ kind: 'Host', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Ipv4: [SocketAddrV4]; Ipv6: [SocketAddrV6]; Host: [SocketAddrHost] }>([
      [0, 'Ipv4', lib.codecOf(SocketAddrV4)],
      [1, 'Ipv6', lib.codecOf(SocketAddrV6)],
      [2, 'Host', lib.codecOf(SocketAddrHost)],
    ])
    .discriminated(),
}

export interface Peer {
  address: SocketAddr
  id: PeerId
}
export const Peer: lib.CodecProvider<Peer> = {
  [lib.CodecSymbol]: lib.structCodec<Peer>(['address', 'id'], {
    address: lib.codecOf(SocketAddr),
    id: lib.codecOf(PeerId),
  }),
}

export type PeerIdPredicateAtom = never
export const PeerIdPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type PeerIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', PeerIdPredicateAtom>
  | lib.SumTypeKindValue<'PublicKey', PublicKeyProjectionPredicate>
export const PeerIdProjectionPredicate = {
  Atom: {},
  PublicKey: {
    Atom: {
      Equals: (value: lib.PublicKeyWrap): PeerIdProjectionPredicate => ({
        kind: 'PublicKey',
        value: PublicKeyProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PeerIdPredicateAtom]; PublicKey: [PublicKeyProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(PeerIdPredicateAtom)],
      [1, 'PublicKey', lib.codecOf(PublicKeyProjectionPredicate)],
    ])
    .discriminated(),
}

export type PeerIdProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'PublicKey', PublicKeyProjectionSelector>
export const PeerIdProjectionSelector = {
  Atom: Object.freeze<PeerIdProjectionSelector>({ kind: 'Atom' }),
  PublicKey: {
    Atom: Object.freeze<PeerIdProjectionSelector>({ kind: 'PublicKey', value: PublicKeyProjectionSelector.Atom }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; PublicKey: [PublicKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'PublicKey', lib.codecOf(PublicKeyProjectionSelector)],
    ])
    .discriminated(),
}

export type PermissionPredicateAtom = never
export const PermissionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type PermissionProjectionPredicate = lib.SumTypeKindValue<'Atom', PermissionPredicateAtom>
export const PermissionProjectionPredicate = {
  Atom: {},
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PermissionPredicateAtom] }>([[0, 'Atom', lib.codecOf(PermissionPredicateAtom)]])
    .discriminated(),
}

export type PermissionProjectionSelector = lib.SumTypeKind<'Atom'>
export const PermissionProjectionSelector = {
  Atom: Object.freeze<PermissionProjectionSelector>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export interface QueryWithFilter<T0, T1, T2> {
  query: T0
  predicate: T1
  selector: T2
}
export const QueryWithFilter = {
  with: <T0, T1, T2>(
    t0: lib.Codec<T0>,
    t1: lib.Codec<T1>,
    t2: lib.Codec<T2>,
  ): lib.CodecProvider<QueryWithFilter<T0, T1, T2>> => ({
    [lib.CodecSymbol]: lib.structCodec<QueryWithFilter<T0, T1, T2>>(['query', 'predicate', 'selector'], {
      query: t0,
      predicate: t1,
      selector: t2,
    }),
  }),
}

export type RolePredicateAtom = never
export const RolePredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type RoleIdPredicateAtom = lib.SumTypeKindValue<'Equals', RoleId>
export const RoleIdPredicateAtom = {
  Equals: (value: RoleId): RoleIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ Equals: [RoleId] }>([[0, 'Equals', lib.codecOf(RoleId)]]).discriminated(),
}

export type RoleIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', RoleIdPredicateAtom>
  | lib.SumTypeKindValue<'Name', NameProjectionPredicate>
export const RoleIdProjectionPredicate = {
  Atom: {
    Equals: (value: RoleId): RoleIdProjectionPredicate => ({ kind: 'Atom', value: RoleIdPredicateAtom.Equals(value) }),
  },
  Name: {
    Atom: {
      Equals: (value: lib.String): RoleIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: (value: lib.String): RoleIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: (value: lib.String): RoleIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: (value: lib.String): RoleIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [RoleIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(RoleIdPredicateAtom)],
      [1, 'Name', lib.codecOf(NameProjectionPredicate)],
    ])
    .discriminated(),
}

export type RoleProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', RolePredicateAtom>
  | lib.SumTypeKindValue<'Id', RoleIdProjectionPredicate>
export const RoleProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: RoleId): RoleProjectionPredicate => ({
        kind: 'Id',
        value: RoleIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): RoleProjectionPredicate => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): RoleProjectionPredicate => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): RoleProjectionPredicate => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): RoleProjectionPredicate => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [RolePredicateAtom]; Id: [RoleIdProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(RolePredicateAtom)],
      [1, 'Id', lib.codecOf(RoleIdProjectionPredicate)],
    ])
    .discriminated(),
}

export type RoleIdProjectionSelector = lib.SumTypeKind<'Atom'> | lib.SumTypeKindValue<'Name', NameProjectionSelector>
export const RoleIdProjectionSelector = {
  Atom: Object.freeze<RoleIdProjectionSelector>({ kind: 'Atom' }),
  Name: { Atom: Object.freeze<RoleIdProjectionSelector>({ kind: 'Name', value: NameProjectionSelector.Atom }) },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', lib.codecOf(NameProjectionSelector)],
    ])
    .discriminated(),
}

export type RoleProjectionSelector = lib.SumTypeKind<'Atom'> | lib.SumTypeKindValue<'Id', RoleIdProjectionSelector>
export const RoleProjectionSelector = {
  Atom: Object.freeze<RoleProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<RoleProjectionSelector>({ kind: 'Id', value: RoleIdProjectionSelector.Atom }),
    Name: { Atom: Object.freeze<RoleProjectionSelector>({ kind: 'Id', value: RoleIdProjectionSelector.Name.Atom }) },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [RoleIdProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(RoleIdProjectionSelector)],
    ])
    .discriminated(),
}

export type TriggerIdPredicateAtom = lib.SumTypeKindValue<'Equals', TriggerId>
export const TriggerIdPredicateAtom = {
  Equals: (value: TriggerId): TriggerIdPredicateAtom => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ Equals: [TriggerId] }>([[0, 'Equals', lib.codecOf(TriggerId)]]).discriminated(),
}

export type TriggerIdProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', TriggerIdPredicateAtom>
  | lib.SumTypeKindValue<'Name', NameProjectionPredicate>
export const TriggerIdProjectionPredicate = {
  Atom: {
    Equals: (value: TriggerId): TriggerIdProjectionPredicate => ({
      kind: 'Atom',
      value: TriggerIdPredicateAtom.Equals(value),
    }),
  },
  Name: {
    Atom: {
      Equals: (value: lib.String): TriggerIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: (value: lib.String): TriggerIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: (value: lib.String): TriggerIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: (value: lib.String): TriggerIdProjectionPredicate => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TriggerIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(TriggerIdPredicateAtom)],
      [1, 'Name', lib.codecOf(NameProjectionPredicate)],
    ])
    .discriminated(),
}

export type TriggerIdProjectionSelector = lib.SumTypeKind<'Atom'> | lib.SumTypeKindValue<'Name', NameProjectionSelector>
export const TriggerIdProjectionSelector = {
  Atom: Object.freeze<TriggerIdProjectionSelector>({ kind: 'Atom' }),
  Name: { Atom: Object.freeze<TriggerIdProjectionSelector>({ kind: 'Name', value: NameProjectionSelector.Atom }) },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', lib.codecOf(NameProjectionSelector)],
    ])
    .discriminated(),
}

export type TriggerPredicateAtom = never
export const TriggerPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type TriggerProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', TriggerPredicateAtom>
  | lib.SumTypeKindValue<'Id', TriggerIdProjectionPredicate>
  | lib.SumTypeKindValue<'Action', ActionProjectionPredicate>
export const TriggerProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: (value: TriggerId): TriggerProjectionPredicate => ({
        kind: 'Id',
        value: TriggerIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: (value: lib.String): TriggerProjectionPredicate => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: (value: lib.String): TriggerProjectionPredicate => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: (value: lib.String): TriggerProjectionPredicate => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: (value: lib.String): TriggerProjectionPredicate => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Action: {
    Atom: {},
    Metadata: {
      Atom: {},
      Key: (value: MetadataKeyProjectionPredicate): TriggerProjectionPredicate => ({
        kind: 'Action',
        value: ActionProjectionPredicate.Metadata.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Atom: [TriggerPredicateAtom]
      Id: [TriggerIdProjectionPredicate]
      Action: [ActionProjectionPredicate]
    }>([
      [0, 'Atom', lib.codecOf(TriggerPredicateAtom)],
      [1, 'Id', lib.codecOf(TriggerIdProjectionPredicate)],
      [2, 'Action', lib.codecOf(ActionProjectionPredicate)],
    ])
    .discriminated(),
}

export type TriggerProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Id', TriggerIdProjectionSelector>
  | lib.SumTypeKindValue<'Action', ActionProjectionSelector>
export const TriggerProjectionSelector = {
  Atom: Object.freeze<TriggerProjectionSelector>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<TriggerProjectionSelector>({ kind: 'Id', value: TriggerIdProjectionSelector.Atom }),
    Name: {
      Atom: Object.freeze<TriggerProjectionSelector>({ kind: 'Id', value: TriggerIdProjectionSelector.Name.Atom }),
    },
  },
  Action: {
    Atom: Object.freeze<TriggerProjectionSelector>({ kind: 'Action', value: ActionProjectionSelector.Atom }),
    Metadata: {
      Atom: Object.freeze<TriggerProjectionSelector>({ kind: 'Action', value: ActionProjectionSelector.Metadata.Atom }),
      Key: (value: MetadataKeyProjectionSelector): TriggerProjectionSelector => ({
        kind: 'Action',
        value: ActionProjectionSelector.Metadata.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [TriggerIdProjectionSelector]; Action: [ActionProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', lib.codecOf(TriggerIdProjectionSelector)],
      [2, 'Action', lib.codecOf(ActionProjectionSelector)],
    ])
    .discriminated(),
}

export type SignedBlockPredicateAtom = never
export const SignedBlockPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type SignedBlockProjectionPredicate =
  | lib.SumTypeKindValue<'Atom', SignedBlockPredicateAtom>
  | lib.SumTypeKindValue<'Header', BlockHeaderProjectionPredicate>
export const SignedBlockProjectionPredicate = {
  Atom: {},
  Header: {
    Atom: {},
    Hash: {
      Atom: {
        Equals: (value: lib.HashWrap): SignedBlockProjectionPredicate => ({
          kind: 'Header',
          value: BlockHeaderProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [SignedBlockPredicateAtom]; Header: [BlockHeaderProjectionPredicate] }>([
      [0, 'Atom', lib.codecOf(SignedBlockPredicateAtom)],
      [1, 'Header', lib.codecOf(BlockHeaderProjectionPredicate)],
    ])
    .discriminated(),
}

export type SignedBlockProjectionSelector =
  | lib.SumTypeKind<'Atom'>
  | lib.SumTypeKindValue<'Header', BlockHeaderProjectionSelector>
export const SignedBlockProjectionSelector = {
  Atom: Object.freeze<SignedBlockProjectionSelector>({ kind: 'Atom' }),
  Header: {
    Atom: Object.freeze<SignedBlockProjectionSelector>({ kind: 'Header', value: BlockHeaderProjectionSelector.Atom }),
    Hash: {
      Atom: Object.freeze<SignedBlockProjectionSelector>({
        kind: 'Header',
        value: BlockHeaderProjectionSelector.Hash.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Header: [BlockHeaderProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Header', lib.codecOf(BlockHeaderProjectionSelector)],
    ])
    .discriminated(),
}

export type QueryBox =
  | lib.SumTypeKindValue<
      'FindDomains',
      QueryWithFilter<null, lib.CompoundPredicate<DomainProjectionPredicate>, lib.Vec<DomainProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindAccounts',
      QueryWithFilter<null, lib.CompoundPredicate<AccountProjectionPredicate>, lib.Vec<AccountProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindAssets',
      QueryWithFilter<null, lib.CompoundPredicate<AssetProjectionPredicate>, lib.Vec<AssetProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindAssetsDefinitions',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
        lib.Vec<AssetDefinitionProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindRoles',
      QueryWithFilter<null, lib.CompoundPredicate<RoleProjectionPredicate>, lib.Vec<RoleProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindRoleIds',
      QueryWithFilter<null, lib.CompoundPredicate<RoleIdProjectionPredicate>, lib.Vec<RoleIdProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindPermissionsByAccountId',
      QueryWithFilter<
        FindPermissionsByAccountId,
        lib.CompoundPredicate<PermissionProjectionPredicate>,
        lib.Vec<PermissionProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindRolesByAccountId',
      QueryWithFilter<
        FindRolesByAccountId,
        lib.CompoundPredicate<RoleIdProjectionPredicate>,
        lib.Vec<RoleIdProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindAccountsWithAsset',
      QueryWithFilter<
        FindAccountsWithAsset,
        lib.CompoundPredicate<AccountProjectionPredicate>,
        lib.Vec<AccountProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindPeers',
      QueryWithFilter<null, lib.CompoundPredicate<PeerIdProjectionPredicate>, lib.Vec<PeerIdProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindActiveTriggerIds',
      QueryWithFilter<null, lib.CompoundPredicate<TriggerIdProjectionPredicate>, lib.Vec<TriggerIdProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindTriggers',
      QueryWithFilter<null, lib.CompoundPredicate<TriggerProjectionPredicate>, lib.Vec<TriggerProjectionSelector>>
    >
  | lib.SumTypeKindValue<
      'FindTransactions',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
        lib.Vec<CommittedTransactionProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindBlocks',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<SignedBlockProjectionPredicate>,
        lib.Vec<SignedBlockProjectionSelector>
      >
    >
  | lib.SumTypeKindValue<
      'FindBlockHeaders',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
        lib.Vec<BlockHeaderProjectionSelector>
      >
    >
export const QueryBox = {
  FindDomains: (
    value: QueryWithFilter<null, lib.CompoundPredicate<DomainProjectionPredicate>, lib.Vec<DomainProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindDomains', value }),
  FindAccounts: (
    value: QueryWithFilter<null, lib.CompoundPredicate<AccountProjectionPredicate>, lib.Vec<AccountProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindAccounts', value }),
  FindAssets: (
    value: QueryWithFilter<null, lib.CompoundPredicate<AssetProjectionPredicate>, lib.Vec<AssetProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindAssets', value }),
  FindAssetsDefinitions: (
    value: QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
      lib.Vec<AssetDefinitionProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindAssetsDefinitions', value }),
  FindRoles: (
    value: QueryWithFilter<null, lib.CompoundPredicate<RoleProjectionPredicate>, lib.Vec<RoleProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindRoles', value }),
  FindRoleIds: (
    value: QueryWithFilter<null, lib.CompoundPredicate<RoleIdProjectionPredicate>, lib.Vec<RoleIdProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindRoleIds', value }),
  FindPermissionsByAccountId: (
    value: QueryWithFilter<
      FindPermissionsByAccountId,
      lib.CompoundPredicate<PermissionProjectionPredicate>,
      lib.Vec<PermissionProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindPermissionsByAccountId', value }),
  FindRolesByAccountId: (
    value: QueryWithFilter<
      FindRolesByAccountId,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindRolesByAccountId', value }),
  FindAccountsWithAsset: (
    value: QueryWithFilter<
      FindAccountsWithAsset,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindAccountsWithAsset', value }),
  FindPeers: (
    value: QueryWithFilter<null, lib.CompoundPredicate<PeerIdProjectionPredicate>, lib.Vec<PeerIdProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindPeers', value }),
  FindActiveTriggerIds: (
    value: QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerIdProjectionPredicate>,
      lib.Vec<TriggerIdProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindActiveTriggerIds', value }),
  FindTriggers: (
    value: QueryWithFilter<null, lib.CompoundPredicate<TriggerProjectionPredicate>, lib.Vec<TriggerProjectionSelector>>,
  ): QueryBox => ({ kind: 'FindTriggers', value }),
  FindTransactions: (
    value: QueryWithFilter<
      null,
      lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
      lib.Vec<CommittedTransactionProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindTransactions', value }),
  FindBlocks: (
    value: QueryWithFilter<
      null,
      lib.CompoundPredicate<SignedBlockProjectionPredicate>,
      lib.Vec<SignedBlockProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindBlocks', value }),
  FindBlockHeaders: (
    value: QueryWithFilter<
      null,
      lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
      lib.Vec<BlockHeaderProjectionSelector>
    >,
  ): QueryBox => ({ kind: 'FindBlockHeaders', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      FindDomains: [
        QueryWithFilter<null, lib.CompoundPredicate<DomainProjectionPredicate>, lib.Vec<DomainProjectionSelector>>,
      ]
      FindAccounts: [
        QueryWithFilter<null, lib.CompoundPredicate<AccountProjectionPredicate>, lib.Vec<AccountProjectionSelector>>,
      ]
      FindAssets: [
        QueryWithFilter<null, lib.CompoundPredicate<AssetProjectionPredicate>, lib.Vec<AssetProjectionSelector>>,
      ]
      FindAssetsDefinitions: [
        QueryWithFilter<
          null,
          lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
          lib.Vec<AssetDefinitionProjectionSelector>
        >,
      ]
      FindRoles: [
        QueryWithFilter<null, lib.CompoundPredicate<RoleProjectionPredicate>, lib.Vec<RoleProjectionSelector>>,
      ]
      FindRoleIds: [
        QueryWithFilter<null, lib.CompoundPredicate<RoleIdProjectionPredicate>, lib.Vec<RoleIdProjectionSelector>>,
      ]
      FindPermissionsByAccountId: [
        QueryWithFilter<
          FindPermissionsByAccountId,
          lib.CompoundPredicate<PermissionProjectionPredicate>,
          lib.Vec<PermissionProjectionSelector>
        >,
      ]
      FindRolesByAccountId: [
        QueryWithFilter<
          FindRolesByAccountId,
          lib.CompoundPredicate<RoleIdProjectionPredicate>,
          lib.Vec<RoleIdProjectionSelector>
        >,
      ]
      FindAccountsWithAsset: [
        QueryWithFilter<
          FindAccountsWithAsset,
          lib.CompoundPredicate<AccountProjectionPredicate>,
          lib.Vec<AccountProjectionSelector>
        >,
      ]
      FindPeers: [
        QueryWithFilter<null, lib.CompoundPredicate<PeerIdProjectionPredicate>, lib.Vec<PeerIdProjectionSelector>>,
      ]
      FindActiveTriggerIds: [
        QueryWithFilter<
          null,
          lib.CompoundPredicate<TriggerIdProjectionPredicate>,
          lib.Vec<TriggerIdProjectionSelector>
        >,
      ]
      FindTriggers: [
        QueryWithFilter<null, lib.CompoundPredicate<TriggerProjectionPredicate>, lib.Vec<TriggerProjectionSelector>>,
      ]
      FindTransactions: [
        QueryWithFilter<
          null,
          lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
          lib.Vec<CommittedTransactionProjectionSelector>
        >,
      ]
      FindBlocks: [
        QueryWithFilter<
          null,
          lib.CompoundPredicate<SignedBlockProjectionPredicate>,
          lib.Vec<SignedBlockProjectionSelector>
        >,
      ]
      FindBlockHeaders: [
        QueryWithFilter<
          null,
          lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
          lib.Vec<BlockHeaderProjectionSelector>
        >,
      ]
    }>([
      [
        0,
        'FindDomains',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(DomainProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(DomainProjectionSelector))),
          ),
        ),
      ],
      [
        1,
        'FindAccounts',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(AccountProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(AccountProjectionSelector))),
          ),
        ),
      ],
      [
        2,
        'FindAssets',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(AssetProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(AssetProjectionSelector))),
          ),
        ),
      ],
      [
        3,
        'FindAssetsDefinitions',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(AssetDefinitionProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(AssetDefinitionProjectionSelector))),
          ),
        ),
      ],
      [
        4,
        'FindRoles',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(RoleProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(RoleProjectionSelector))),
          ),
        ),
      ],
      [
        5,
        'FindRoleIds',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(RoleIdProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(RoleIdProjectionSelector))),
          ),
        ),
      ],
      [
        6,
        'FindPermissionsByAccountId',
        lib.codecOf(
          QueryWithFilter.with(
            lib.codecOf(FindPermissionsByAccountId),
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(PermissionProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(PermissionProjectionSelector))),
          ),
        ),
      ],
      [
        7,
        'FindRolesByAccountId',
        lib.codecOf(
          QueryWithFilter.with(
            lib.codecOf(FindRolesByAccountId),
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(RoleIdProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(RoleIdProjectionSelector))),
          ),
        ),
      ],
      [
        8,
        'FindAccountsWithAsset',
        lib.codecOf(
          QueryWithFilter.with(
            lib.codecOf(FindAccountsWithAsset),
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(AccountProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(AccountProjectionSelector))),
          ),
        ),
      ],
      [
        9,
        'FindPeers',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(PeerIdProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(PeerIdProjectionSelector))),
          ),
        ),
      ],
      [
        10,
        'FindActiveTriggerIds',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(TriggerIdProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(TriggerIdProjectionSelector))),
          ),
        ),
      ],
      [
        11,
        'FindTriggers',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(TriggerProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(TriggerProjectionSelector))),
          ),
        ),
      ],
      [
        12,
        'FindTransactions',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(CommittedTransactionProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(CommittedTransactionProjectionSelector))),
          ),
        ),
      ],
      [
        13,
        'FindBlocks',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(SignedBlockProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(SignedBlockProjectionSelector))),
          ),
        ),
      ],
      [
        14,
        'FindBlockHeaders',
        lib.codecOf(
          QueryWithFilter.with(
            lib.nullCodec,
            lib.codecOf(lib.CompoundPredicate.with(lib.codecOf(BlockHeaderProjectionPredicate))),
            lib.codecOf(lib.Vec.with(lib.codecOf(BlockHeaderProjectionSelector))),
          ),
        ),
      ],
    ])
    .discriminated(),
}

export type QueryOutputBatchBox =
  | lib.SumTypeKindValue<'PublicKey', lib.Vec<lib.PublicKeyWrap>>
  | lib.SumTypeKindValue<'String', lib.Vec<lib.String>>
  | lib.SumTypeKindValue<'Metadata', lib.Vec<lib.Map<lib.Name, lib.Json>>>
  | lib.SumTypeKindValue<'Json', lib.Vec<lib.Json>>
  | lib.SumTypeKindValue<'Numeric', lib.Vec<Numeric>>
  | lib.SumTypeKindValue<'Name', lib.Vec<lib.Name>>
  | lib.SumTypeKindValue<'DomainId', lib.Vec<lib.DomainId>>
  | lib.SumTypeKindValue<'Domain', lib.Vec<Domain>>
  | lib.SumTypeKindValue<'AccountId', lib.Vec<lib.AccountId>>
  | lib.SumTypeKindValue<'Account', lib.Vec<Account>>
  | lib.SumTypeKindValue<'AssetId', lib.Vec<lib.AssetId>>
  | lib.SumTypeKindValue<'Asset', lib.Vec<Asset>>
  | lib.SumTypeKindValue<'AssetValue', lib.Vec<AssetValue>>
  | lib.SumTypeKindValue<'AssetDefinitionId', lib.Vec<lib.AssetDefinitionId>>
  | lib.SumTypeKindValue<'AssetDefinition', lib.Vec<AssetDefinition>>
  | lib.SumTypeKindValue<'Role', lib.Vec<Role>>
  | lib.SumTypeKindValue<'Parameter', lib.Vec<Parameter>>
  | lib.SumTypeKindValue<'Permission', lib.Vec<Permission>>
  | lib.SumTypeKindValue<'CommittedTransaction', lib.Vec<CommittedTransaction>>
  | lib.SumTypeKindValue<'SignedTransaction', lib.Vec<SignedTransaction>>
  | lib.SumTypeKindValue<'TransactionHash', lib.Vec<lib.HashWrap>>
  | lib.SumTypeKindValue<'TransactionRejectionReason', lib.Vec<lib.Option<TransactionRejectionReason>>>
  | lib.SumTypeKindValue<'Peer', lib.Vec<PeerId>>
  | lib.SumTypeKindValue<'RoleId', lib.Vec<RoleId>>
  | lib.SumTypeKindValue<'TriggerId', lib.Vec<TriggerId>>
  | lib.SumTypeKindValue<'Trigger', lib.Vec<Trigger>>
  | lib.SumTypeKindValue<'Action', lib.Vec<Action>>
  | lib.SumTypeKindValue<'Block', lib.Vec<SignedBlock>>
  | lib.SumTypeKindValue<'BlockHeader', lib.Vec<BlockHeader>>
  | lib.SumTypeKindValue<'BlockHeaderHash', lib.Vec<lib.HashWrap>>
export const QueryOutputBatchBox = {
  PublicKey: (value: lib.Vec<lib.PublicKeyWrap>): QueryOutputBatchBox => ({ kind: 'PublicKey', value }),
  String: (value: lib.Vec<lib.String>): QueryOutputBatchBox => ({ kind: 'String', value }),
  Metadata: (value: lib.Vec<lib.Map<lib.Name, lib.Json>>): QueryOutputBatchBox => ({ kind: 'Metadata', value }),
  Json: (value: lib.Vec<lib.Json>): QueryOutputBatchBox => ({ kind: 'Json', value }),
  Numeric: (value: lib.Vec<Numeric>): QueryOutputBatchBox => ({ kind: 'Numeric', value }),
  Name: (value: lib.Vec<lib.Name>): QueryOutputBatchBox => ({ kind: 'Name', value }),
  DomainId: (value: lib.Vec<lib.DomainId>): QueryOutputBatchBox => ({ kind: 'DomainId', value }),
  Domain: (value: lib.Vec<Domain>): QueryOutputBatchBox => ({ kind: 'Domain', value }),
  AccountId: (value: lib.Vec<lib.AccountId>): QueryOutputBatchBox => ({ kind: 'AccountId', value }),
  Account: (value: lib.Vec<Account>): QueryOutputBatchBox => ({ kind: 'Account', value }),
  AssetId: (value: lib.Vec<lib.AssetId>): QueryOutputBatchBox => ({ kind: 'AssetId', value }),
  Asset: (value: lib.Vec<Asset>): QueryOutputBatchBox => ({ kind: 'Asset', value }),
  AssetValue: (value: lib.Vec<AssetValue>): QueryOutputBatchBox => ({ kind: 'AssetValue', value }),
  AssetDefinitionId: (value: lib.Vec<lib.AssetDefinitionId>): QueryOutputBatchBox => ({
    kind: 'AssetDefinitionId',
    value,
  }),
  AssetDefinition: (value: lib.Vec<AssetDefinition>): QueryOutputBatchBox => ({ kind: 'AssetDefinition', value }),
  Role: (value: lib.Vec<Role>): QueryOutputBatchBox => ({ kind: 'Role', value }),
  Parameter: (value: lib.Vec<Parameter>): QueryOutputBatchBox => ({ kind: 'Parameter', value }),
  Permission: (value: lib.Vec<Permission>): QueryOutputBatchBox => ({ kind: 'Permission', value }),
  CommittedTransaction: (value: lib.Vec<CommittedTransaction>): QueryOutputBatchBox => ({
    kind: 'CommittedTransaction',
    value,
  }),
  SignedTransaction: (value: lib.Vec<SignedTransaction>): QueryOutputBatchBox => ({ kind: 'SignedTransaction', value }),
  TransactionHash: (value: lib.Vec<lib.HashWrap>): QueryOutputBatchBox => ({ kind: 'TransactionHash', value }),
  TransactionRejectionReason: (value: lib.Vec<lib.Option<TransactionRejectionReason>>): QueryOutputBatchBox => ({
    kind: 'TransactionRejectionReason',
    value,
  }),
  Peer: (value: lib.Vec<PeerId>): QueryOutputBatchBox => ({ kind: 'Peer', value }),
  RoleId: (value: lib.Vec<RoleId>): QueryOutputBatchBox => ({ kind: 'RoleId', value }),
  TriggerId: (value: lib.Vec<TriggerId>): QueryOutputBatchBox => ({ kind: 'TriggerId', value }),
  Trigger: (value: lib.Vec<Trigger>): QueryOutputBatchBox => ({ kind: 'Trigger', value }),
  Action: (value: lib.Vec<Action>): QueryOutputBatchBox => ({ kind: 'Action', value }),
  Block: (value: lib.Vec<SignedBlock>): QueryOutputBatchBox => ({ kind: 'Block', value }),
  BlockHeader: (value: lib.Vec<BlockHeader>): QueryOutputBatchBox => ({ kind: 'BlockHeader', value }),
  BlockHeaderHash: (value: lib.Vec<lib.HashWrap>): QueryOutputBatchBox => ({ kind: 'BlockHeaderHash', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      PublicKey: [lib.Vec<lib.PublicKeyWrap>]
      String: [lib.Vec<lib.String>]
      Metadata: [lib.Vec<lib.Map<lib.Name, lib.Json>>]
      Json: [lib.Vec<lib.Json>]
      Numeric: [lib.Vec<Numeric>]
      Name: [lib.Vec<lib.Name>]
      DomainId: [lib.Vec<lib.DomainId>]
      Domain: [lib.Vec<Domain>]
      AccountId: [lib.Vec<lib.AccountId>]
      Account: [lib.Vec<Account>]
      AssetId: [lib.Vec<lib.AssetId>]
      Asset: [lib.Vec<Asset>]
      AssetValue: [lib.Vec<AssetValue>]
      AssetDefinitionId: [lib.Vec<lib.AssetDefinitionId>]
      AssetDefinition: [lib.Vec<AssetDefinition>]
      Role: [lib.Vec<Role>]
      Parameter: [lib.Vec<Parameter>]
      Permission: [lib.Vec<Permission>]
      CommittedTransaction: [lib.Vec<CommittedTransaction>]
      SignedTransaction: [lib.Vec<SignedTransaction>]
      TransactionHash: [lib.Vec<lib.HashWrap>]
      TransactionRejectionReason: [lib.Vec<lib.Option<TransactionRejectionReason>>]
      Peer: [lib.Vec<PeerId>]
      RoleId: [lib.Vec<RoleId>]
      TriggerId: [lib.Vec<TriggerId>]
      Trigger: [lib.Vec<Trigger>]
      Action: [lib.Vec<Action>]
      Block: [lib.Vec<SignedBlock>]
      BlockHeader: [lib.Vec<BlockHeader>]
      BlockHeaderHash: [lib.Vec<lib.HashWrap>]
    }>([
      [0, 'PublicKey', lib.codecOf(lib.Vec.with(lib.codecOf(lib.PublicKeyWrap)))],
      [1, 'String', lib.codecOf(lib.Vec.with(lib.codecOf(lib.String)))],
      [
        2,
        'Metadata',
        lib.codecOf(lib.Vec.with(lib.codecOf(lib.Map.with(lib.codecOf(lib.Name), lib.codecOf(lib.Json))))),
      ],
      [3, 'Json', lib.codecOf(lib.Vec.with(lib.codecOf(lib.Json)))],
      [4, 'Numeric', lib.codecOf(lib.Vec.with(lib.codecOf(Numeric)))],
      [5, 'Name', lib.codecOf(lib.Vec.with(lib.codecOf(lib.Name)))],
      [6, 'DomainId', lib.codecOf(lib.Vec.with(lib.codecOf(lib.DomainId)))],
      [7, 'Domain', lib.codecOf(lib.Vec.with(lib.codecOf(Domain)))],
      [8, 'AccountId', lib.codecOf(lib.Vec.with(lib.codecOf(lib.AccountId)))],
      [9, 'Account', lib.codecOf(lib.Vec.with(lib.codecOf(Account)))],
      [10, 'AssetId', lib.codecOf(lib.Vec.with(lib.codecOf(lib.AssetId)))],
      [11, 'Asset', lib.codecOf(lib.Vec.with(lib.codecOf(Asset)))],
      [12, 'AssetValue', lib.codecOf(lib.Vec.with(lib.codecOf(AssetValue)))],
      [13, 'AssetDefinitionId', lib.codecOf(lib.Vec.with(lib.codecOf(lib.AssetDefinitionId)))],
      [14, 'AssetDefinition', lib.codecOf(lib.Vec.with(lib.codecOf(AssetDefinition)))],
      [15, 'Role', lib.codecOf(lib.Vec.with(lib.codecOf(Role)))],
      [16, 'Parameter', lib.codecOf(lib.Vec.with(lib.codecOf(Parameter)))],
      [17, 'Permission', lib.codecOf(lib.Vec.with(lib.codecOf(Permission)))],
      [18, 'CommittedTransaction', lib.codecOf(lib.Vec.with(lib.codecOf(CommittedTransaction)))],
      [19, 'SignedTransaction', lib.codecOf(lib.Vec.with(lib.codecOf(SignedTransaction)))],
      [20, 'TransactionHash', lib.codecOf(lib.Vec.with(lib.codecOf(lib.HashWrap)))],
      [
        21,
        'TransactionRejectionReason',
        lib.codecOf(lib.Vec.with(lib.codecOf(lib.Option.with(lib.codecOf(TransactionRejectionReason))))),
      ],
      [22, 'Peer', lib.codecOf(lib.Vec.with(lib.codecOf(PeerId)))],
      [23, 'RoleId', lib.codecOf(lib.Vec.with(lib.codecOf(RoleId)))],
      [24, 'TriggerId', lib.codecOf(lib.Vec.with(lib.codecOf(TriggerId)))],
      [25, 'Trigger', lib.codecOf(lib.Vec.with(lib.codecOf(Trigger)))],
      [26, 'Action', lib.codecOf(lib.Vec.with(lib.codecOf(Action)))],
      [27, 'Block', lib.codecOf(lib.Vec.with(lib.codecOf(SignedBlock)))],
      [28, 'BlockHeader', lib.codecOf(lib.Vec.with(lib.codecOf(BlockHeader)))],
      [29, 'BlockHeaderHash', lib.codecOf(lib.Vec.with(lib.codecOf(lib.HashWrap)))],
    ])
    .discriminated(),
}

export interface QueryOutputBatchBoxTuple {
  tuple: lib.Vec<QueryOutputBatchBox>
}
export const QueryOutputBatchBoxTuple: lib.CodecProvider<QueryOutputBatchBoxTuple> = {
  [lib.CodecSymbol]: lib.structCodec<QueryOutputBatchBoxTuple>(['tuple'], {
    tuple: lib.codecOf(lib.Vec.with(lib.codecOf(QueryOutputBatchBox))),
  }),
}

export interface QueryOutput {
  batch: QueryOutputBatchBoxTuple
  remainingItems: lib.U64
  continueCursor: lib.Option<ForwardCursor>
}
export const QueryOutput: lib.CodecProvider<QueryOutput> = {
  [lib.CodecSymbol]: lib.structCodec<QueryOutput>(['batch', 'remainingItems', 'continueCursor'], {
    batch: lib.codecOf(QueryOutputBatchBoxTuple),
    remainingItems: lib.codecOf(lib.U64),
    continueCursor: lib.codecOf(lib.Option.with(lib.codecOf(ForwardCursor))),
  }),
}

export interface Sorting {
  sortByMetadataKey: lib.Option<lib.Name>
}
export const Sorting: lib.CodecProvider<Sorting> = {
  [lib.CodecSymbol]: lib.structCodec<Sorting>(['sortByMetadataKey'], {
    sortByMetadataKey: lib.codecOf(lib.Option.with(lib.codecOf(lib.Name))),
  }),
}

export interface QueryParams {
  pagination: Pagination
  sorting: Sorting
  fetchSize: lib.Option<lib.U64>
}
export const QueryParams: lib.CodecProvider<QueryParams> = {
  [lib.CodecSymbol]: lib.structCodec<QueryParams>(['pagination', 'sorting', 'fetchSize'], {
    pagination: lib.codecOf(Pagination),
    sorting: lib.codecOf(Sorting),
    fetchSize: lib.codecOf(lib.Option.with(lib.codecOf(lib.U64))),
  }),
}

export type SingularQueryBox = lib.SumTypeKind<'FindExecutorDataModel'> | lib.SumTypeKind<'FindParameters'>
export const SingularQueryBox = {
  FindExecutorDataModel: Object.freeze<SingularQueryBox>({ kind: 'FindExecutorDataModel' }),
  FindParameters: Object.freeze<SingularQueryBox>({ kind: 'FindParameters' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ FindExecutorDataModel: []; FindParameters: [] }>([
      [0, 'FindExecutorDataModel'],
      [1, 'FindParameters'],
    ])
    .discriminated(),
}

export interface QueryWithParams {
  query: QueryBox
  params: QueryParams
}
export const QueryWithParams: lib.CodecProvider<QueryWithParams> = {
  [lib.CodecSymbol]: lib.structCodec<QueryWithParams>(['query', 'params'], {
    query: lib.codecOf(QueryBox),
    params: lib.codecOf(QueryParams),
  }),
}

export type QueryRequest =
  | lib.SumTypeKindValue<'Singular', SingularQueryBox>
  | lib.SumTypeKindValue<'Start', QueryWithParams>
  | lib.SumTypeKindValue<'Continue', ForwardCursor>
export const QueryRequest = {
  Singular: {
    FindExecutorDataModel: Object.freeze<QueryRequest>({
      kind: 'Singular',
      value: SingularQueryBox.FindExecutorDataModel,
    }),
    FindParameters: Object.freeze<QueryRequest>({ kind: 'Singular', value: SingularQueryBox.FindParameters }),
  },
  Start: (value: QueryWithParams): QueryRequest => ({ kind: 'Start', value }),
  Continue: (value: ForwardCursor): QueryRequest => ({ kind: 'Continue', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Singular: [SingularQueryBox]; Start: [QueryWithParams]; Continue: [ForwardCursor] }>([
      [0, 'Singular', lib.codecOf(SingularQueryBox)],
      [1, 'Start', lib.codecOf(QueryWithParams)],
      [2, 'Continue', lib.codecOf(ForwardCursor)],
    ])
    .discriminated(),
}

export interface QueryRequestWithAuthority {
  authority: lib.AccountId
  request: QueryRequest
}
export const QueryRequestWithAuthority: lib.CodecProvider<QueryRequestWithAuthority> = {
  [lib.CodecSymbol]: lib.structCodec<QueryRequestWithAuthority>(['authority', 'request'], {
    authority: lib.codecOf(lib.AccountId),
    request: lib.codecOf(QueryRequest),
  }),
}

export type SingularQueryOutputBox =
  | lib.SumTypeKindValue<'ExecutorDataModel', ExecutorDataModel>
  | lib.SumTypeKindValue<'Parameters', Parameters>
export const SingularQueryOutputBox = {
  ExecutorDataModel: (value: ExecutorDataModel): SingularQueryOutputBox => ({ kind: 'ExecutorDataModel', value }),
  Parameters: (value: Parameters): SingularQueryOutputBox => ({ kind: 'Parameters', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ ExecutorDataModel: [ExecutorDataModel]; Parameters: [Parameters] }>([
      [0, 'ExecutorDataModel', lib.codecOf(ExecutorDataModel)],
      [1, 'Parameters', lib.codecOf(Parameters)],
    ])
    .discriminated(),
}

export type QueryResponse =
  | lib.SumTypeKindValue<'Singular', SingularQueryOutputBox>
  | lib.SumTypeKindValue<'Iterable', QueryOutput>
export const QueryResponse = {
  Singular: {
    ExecutorDataModel: (value: ExecutorDataModel): QueryResponse => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.ExecutorDataModel(value),
    }),
    Parameters: (value: Parameters): QueryResponse => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.Parameters(value),
    }),
  },
  Iterable: (value: QueryOutput): QueryResponse => ({ kind: 'Iterable', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Singular: [SingularQueryOutputBox]; Iterable: [QueryOutput] }>([
      [0, 'Singular', lib.codecOf(SingularQueryOutputBox)],
      [1, 'Iterable', lib.codecOf(QueryOutput)],
    ])
    .discriminated(),
}

export interface RawGenesisTransaction {
  chain: lib.String
  executor: lib.String
  parameters: lib.Option<Parameters>
  instructions: lib.Vec<InstructionBox>
  wasmDir: lib.String
  wasmTriggers: lib.Vec<GenesisWasmTrigger>
  topology: lib.Vec<PeerId>
}
export const RawGenesisTransaction: lib.CodecProvider<RawGenesisTransaction> = {
  [lib.CodecSymbol]: lib.structCodec<RawGenesisTransaction>(
    ['chain', 'executor', 'parameters', 'instructions', 'wasmDir', 'wasmTriggers', 'topology'],
    {
      chain: lib.codecOf(lib.String),
      executor: lib.codecOf(lib.String),
      parameters: lib.codecOf(lib.Option.with(lib.codecOf(Parameters))),
      instructions: lib.codecOf(lib.Vec.with(lib.lazyCodec(() => lib.codecOf(InstructionBox)))),
      wasmDir: lib.codecOf(lib.String),
      wasmTriggers: lib.codecOf(lib.Vec.with(lib.codecOf(GenesisWasmTrigger))),
      topology: lib.codecOf(lib.Vec.with(lib.codecOf(PeerId))),
    },
  ),
}

export interface SignedQueryV1 {
  signature: lib.SignatureWrap
  payload: QueryRequestWithAuthority
}
export const SignedQueryV1: lib.CodecProvider<SignedQueryV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedQueryV1>(['signature', 'payload'], {
    signature: lib.codecOf(lib.SignatureWrap),
    payload: lib.codecOf(QueryRequestWithAuthority),
  }),
}

export type SignedQuery = lib.SumTypeKindValue<'V1', SignedQueryV1>
export const SignedQuery = {
  V1: (value: SignedQueryV1): SignedQuery => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ V1: [SignedQueryV1] }>([[1, 'V1', lib.codecOf(SignedQueryV1)]]).discriminated(),
}
