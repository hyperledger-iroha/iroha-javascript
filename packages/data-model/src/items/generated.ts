import * as lib from './generated-lib'

export type Metadata = lib.Map<lib.Name, lib.Json>
export const Metadata = lib.Map.with(lib.Name[lib.CodecSymbol], lib.Json[lib.CodecSymbol])

export interface Account {
  id: lib.AccountId
  metadata: Metadata
}
export const Account: lib.CodecProvider<Account> = {
  [lib.CodecSymbol]: lib.structCodec<Account>(['id', 'metadata'], {
    id: lib.AccountId[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
  }),
}

export interface Numeric {
  mantissa: lib.Compact
  scale: lib.Compact
}
export const Numeric: lib.CodecProvider<Numeric> = {
  [lib.CodecSymbol]: lib.structCodec<Numeric>(['mantissa', 'scale'], {
    mantissa: lib.Compact[lib.CodecSymbol],
    scale: lib.Compact[lib.CodecSymbol],
  }),
}

export type AssetValue = lib.Variant<'Numeric', Numeric> | lib.Variant<'Store', Metadata>
export const AssetValue = {
  Numeric: <const T extends Numeric>(value: T): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }),
  Store: <const T extends Metadata>(value: T): lib.Variant<'Store', T> => ({ kind: 'Store', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Numeric: [Numeric]; Store: [Metadata] }>([
      [0, 'Numeric', Numeric[lib.CodecSymbol]],
      [1, 'Store', Metadata[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Asset {
  id: lib.AssetId
  value: AssetValue
}
export const Asset: lib.CodecProvider<Asset> = {
  [lib.CodecSymbol]: lib.structCodec<Asset>(['id', 'value'], {
    id: lib.AssetId[lib.CodecSymbol],
    value: AssetValue[lib.CodecSymbol],
  }),
}

export interface AssetChanged {
  asset: lib.AssetId
  amount: AssetValue
}
export const AssetChanged: lib.CodecProvider<AssetChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetChanged>(['asset', 'amount'], {
    asset: lib.AssetId[lib.CodecSymbol],
    amount: AssetValue[lib.CodecSymbol],
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
      key: lib.Name[lib.CodecSymbol],
      value: lib.Json[lib.CodecSymbol],
    }),
  }),
}

export type AssetEvent =
  | lib.Variant<'Created', Asset>
  | lib.Variant<'Deleted', lib.AssetId>
  | lib.Variant<'Added', AssetChanged>
  | lib.Variant<'Removed', AssetChanged>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.AssetId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.AssetId>>
export const AssetEvent = {
  Created: <const T extends Asset>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends lib.AssetId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  Added: <const T extends AssetChanged>(value: T): lib.Variant<'Added', T> => ({ kind: 'Added', value }),
  Removed: <const T extends AssetChanged>(value: T): lib.Variant<'Removed', T> => ({ kind: 'Removed', value }),
  MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(value: T): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }),
  MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(value: T): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Asset]
      Deleted: [lib.AssetId]
      Added: [AssetChanged]
      Removed: [AssetChanged]
      MetadataInserted: [MetadataChanged<lib.AssetId>]
      MetadataRemoved: [MetadataChanged<lib.AssetId>]
    }>([
      [0, 'Created', Asset[lib.CodecSymbol]],
      [1, 'Deleted', lib.AssetId[lib.CodecSymbol]],
      [2, 'Added', AssetChanged[lib.CodecSymbol]],
      [3, 'Removed', AssetChanged[lib.CodecSymbol]],
      [4, 'MetadataInserted', MetadataChanged.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [5, 'MetadataRemoved', MetadataChanged.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Permission {
  name: lib.String
  payload: lib.Json
}
export const Permission: lib.CodecProvider<Permission> = {
  [lib.CodecSymbol]: lib.structCodec<Permission>(['name', 'payload'], {
    name: lib.String[lib.CodecSymbol],
    payload: lib.Json[lib.CodecSymbol],
  }),
}

export interface AccountPermissionChanged {
  account: lib.AccountId
  permission: Permission
}
export const AccountPermissionChanged: lib.CodecProvider<AccountPermissionChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AccountPermissionChanged>(['account', 'permission'], {
    account: lib.AccountId[lib.CodecSymbol],
    permission: Permission[lib.CodecSymbol],
  }),
}

export interface RoleId {
  name: lib.Name
}
export const RoleId: lib.CodecProvider<RoleId> = {
  [lib.CodecSymbol]: lib.structCodec<RoleId>(['name'], { name: lib.Name[lib.CodecSymbol] }),
}

export interface AccountRoleChanged {
  account: lib.AccountId
  role: RoleId
}
export const AccountRoleChanged: lib.CodecProvider<AccountRoleChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AccountRoleChanged>(['account', 'role'], {
    account: lib.AccountId[lib.CodecSymbol],
    role: RoleId[lib.CodecSymbol],
  }),
}

export type AccountEvent =
  | lib.Variant<'Created', Account>
  | lib.Variant<'Deleted', lib.AccountId>
  | lib.Variant<'Asset', AssetEvent>
  | lib.Variant<'PermissionAdded', AccountPermissionChanged>
  | lib.Variant<'PermissionRemoved', AccountPermissionChanged>
  | lib.Variant<'RoleGranted', AccountRoleChanged>
  | lib.Variant<'RoleRevoked', AccountRoleChanged>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.AccountId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.AccountId>>
export const AccountEvent = {
  Created: <const T extends Account>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends lib.AccountId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  Asset: {
    Created: <const T extends Asset>(value: T): lib.Variant<'Asset', lib.Variant<'Created', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Created(value),
    }),
    Deleted: <const T extends lib.AssetId>(value: T): lib.Variant<'Asset', lib.Variant<'Deleted', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Deleted(value),
    }),
    Added: <const T extends AssetChanged>(value: T): lib.Variant<'Asset', lib.Variant<'Added', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Added(value),
    }),
    Removed: <const T extends AssetChanged>(value: T): lib.Variant<'Asset', lib.Variant<'Removed', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Removed(value),
    }),
    MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Asset',
      value: AssetEvent.MetadataInserted(value),
    }),
    MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Asset',
      value: AssetEvent.MetadataRemoved(value),
    }),
  },
  PermissionAdded: <const T extends AccountPermissionChanged>(value: T): lib.Variant<'PermissionAdded', T> => ({
    kind: 'PermissionAdded',
    value,
  }),
  PermissionRemoved: <const T extends AccountPermissionChanged>(value: T): lib.Variant<'PermissionRemoved', T> => ({
    kind: 'PermissionRemoved',
    value,
  }),
  RoleGranted: <const T extends AccountRoleChanged>(value: T): lib.Variant<'RoleGranted', T> => ({
    kind: 'RoleGranted',
    value,
  }),
  RoleRevoked: <const T extends AccountRoleChanged>(value: T): lib.Variant<'RoleRevoked', T> => ({
    kind: 'RoleRevoked',
    value,
  }),
  MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(value: T): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }),
  MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(value: T): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }),
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
      [0, 'Created', Account[lib.CodecSymbol]],
      [1, 'Deleted', lib.AccountId[lib.CodecSymbol]],
      [2, 'Asset', AssetEvent[lib.CodecSymbol]],
      [3, 'PermissionAdded', AccountPermissionChanged[lib.CodecSymbol]],
      [4, 'PermissionRemoved', AccountPermissionChanged[lib.CodecSymbol]],
      [5, 'RoleGranted', AccountRoleChanged[lib.CodecSymbol]],
      [6, 'RoleRevoked', AccountRoleChanged[lib.CodecSymbol]],
      [7, 'MetadataInserted', MetadataChanged.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [8, 'MetadataRemoved', MetadataChanged.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
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
    idMatcher: lib.Option.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: AccountEventSet[lib.CodecSymbol],
  }),
}

export type AccountIdPredicateAtom = lib.Variant<'Equals', lib.AccountId>
export const AccountIdPredicateAtom = {
  Equals: <const T extends lib.AccountId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AccountId] }>([[0, 'Equals', lib.AccountId[lib.CodecSymbol]]])
    .discriminated(),
}

export type DomainIdPredicateAtom = lib.Variant<'Equals', lib.DomainId>
export const DomainIdPredicateAtom = {
  Equals: <const T extends lib.DomainId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.DomainId] }>([[0, 'Equals', lib.DomainId[lib.CodecSymbol]]])
    .discriminated(),
}

export type StringPredicateAtom =
  | lib.Variant<'Equals', lib.String>
  | lib.Variant<'Contains', lib.String>
  | lib.Variant<'StartsWith', lib.String>
  | lib.Variant<'EndsWith', lib.String>
export const StringPredicateAtom = {
  Equals: <const T extends lib.String>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  Contains: <const T extends lib.String>(value: T): lib.Variant<'Contains', T> => ({ kind: 'Contains', value }),
  StartsWith: <const T extends lib.String>(value: T): lib.Variant<'StartsWith', T> => ({ kind: 'StartsWith', value }),
  EndsWith: <const T extends lib.String>(value: T): lib.Variant<'EndsWith', T> => ({ kind: 'EndsWith', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.String]; Contains: [lib.String]; StartsWith: [lib.String]; EndsWith: [lib.String] }>([
      [0, 'Equals', lib.String[lib.CodecSymbol]],
      [1, 'Contains', lib.String[lib.CodecSymbol]],
      [2, 'StartsWith', lib.String[lib.CodecSymbol]],
      [3, 'EndsWith', lib.String[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type NameProjectionPredicate = lib.Variant<'Atom', StringPredicateAtom>
export const NameProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.String>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.Equals(value),
    }),
    Contains: <const T extends lib.String>(value: T): lib.Variant<'Atom', lib.Variant<'Contains', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.Contains(value),
    }),
    StartsWith: <const T extends lib.String>(value: T): lib.Variant<'Atom', lib.Variant<'StartsWith', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.StartsWith(value),
    }),
    EndsWith: <const T extends lib.String>(value: T): lib.Variant<'Atom', lib.Variant<'EndsWith', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.EndsWith(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [StringPredicateAtom] }>([[0, 'Atom', StringPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type DomainIdProjectionPredicate =
  | lib.Variant<'Atom', DomainIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
export const DomainIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.DomainId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: DomainIdPredicateAtom.Equals(value),
    }),
  },
  Name: {
    Atom: {
      Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [DomainIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', DomainIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Name', NameProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type PublicKeyPredicateAtom = lib.Variant<'Equals', lib.PublicKeyWrap>
export const PublicKeyPredicateAtom = {
  Equals: <const T extends lib.PublicKeyWrap>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.PublicKeyWrap] }>([[0, 'Equals', lib.PublicKeyWrap[lib.CodecSymbol]]])
    .discriminated(),
}

export type PublicKeyProjectionPredicate = lib.Variant<'Atom', PublicKeyPredicateAtom>
export const PublicKeyProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.PublicKeyWrap>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: PublicKeyPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PublicKeyPredicateAtom] }>([[0, 'Atom', PublicKeyPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type AccountIdProjectionPredicate =
  | lib.Variant<'Atom', AccountIdPredicateAtom>
  | lib.Variant<'Domain', DomainIdProjectionPredicate>
  | lib.Variant<'Signatory', PublicKeyProjectionPredicate>
export const AccountIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.AccountId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AccountIdPredicateAtom.Equals(value),
    }),
  },
  Domain: {
    Atom: {
      Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Signatory: {
    Atom: {
      Equals: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
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
      [0, 'Atom', AccountIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Domain', DomainIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Signatory', PublicKeyProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type NameProjectionSelector = lib.VariantUnit<'Atom'>
export const NameProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type DomainIdProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Name', NameProjectionSelector>
export const DomainIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Name: {
    Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', NameProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type PublicKeyProjectionSelector = lib.VariantUnit<'Atom'>
export const PublicKeyProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type AccountIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Domain', DomainIdProjectionSelector>
  | lib.Variant<'Signatory', PublicKeyProjectionSelector>
export const AccountIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Domain: {
    Atom: Object.freeze<lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>({
      kind: 'Domain',
      value: DomainIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Domain',
        value: DomainIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Signatory: {
    Atom: Object.freeze<lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>({
      kind: 'Signatory',
      value: PublicKeyProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Domain: [DomainIdProjectionSelector]; Signatory: [PublicKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Domain', DomainIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Signatory', PublicKeyProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AccountPredicateAtom = never
export const AccountPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type MetadataPredicateAtom = never
export const MetadataPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type JsonPredicateAtom = lib.Variant<'Equals', lib.Json>
export const JsonPredicateAtom = {
  Equals: <const T extends lib.Json>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ Equals: [lib.Json] }>([[0, 'Equals', lib.Json[lib.CodecSymbol]]]).discriminated(),
}

export type JsonProjectionPredicate = lib.Variant<'Atom', JsonPredicateAtom>
export const JsonProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.Json>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: JsonPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [JsonPredicateAtom] }>([[0, 'Atom', JsonPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export interface MetadataKeyProjectionPredicate {
  key: lib.Name
  projection: JsonProjectionPredicate
}
export const MetadataKeyProjectionPredicate: lib.CodecProvider<MetadataKeyProjectionPredicate> = {
  [lib.CodecSymbol]: lib.structCodec<MetadataKeyProjectionPredicate>(['key', 'projection'], {
    key: lib.Name[lib.CodecSymbol],
    projection: JsonProjectionPredicate[lib.CodecSymbol],
  }),
}

export type MetadataProjectionPredicate =
  | lib.Variant<'Atom', MetadataPredicateAtom>
  | lib.Variant<'Key', MetadataKeyProjectionPredicate>
export const MetadataProjectionPredicate = {
  Atom: {},
  Key: <const T extends MetadataKeyProjectionPredicate>(value: T): lib.Variant<'Key', T> => ({ kind: 'Key', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [MetadataPredicateAtom]; Key: [MetadataKeyProjectionPredicate] }>([
      [0, 'Atom', MetadataPredicateAtom[lib.CodecSymbol]],
      [1, 'Key', MetadataKeyProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AccountProjectionPredicate =
  | lib.Variant<'Atom', AccountPredicateAtom>
  | lib.Variant<'Id', AccountIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
export const AccountProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Id', value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Id', value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Id', value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value) }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
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
      [0, 'Atom', AccountPredicateAtom[lib.CodecSymbol]],
      [1, 'Id', AccountIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type JsonProjectionSelector = lib.VariantUnit<'Atom'>
export const JsonProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export interface MetadataKeyProjectionSelector {
  key: lib.Name
  projection: JsonProjectionSelector
}
export const MetadataKeyProjectionSelector: lib.CodecProvider<MetadataKeyProjectionSelector> = {
  [lib.CodecSymbol]: lib.structCodec<MetadataKeyProjectionSelector>(['key', 'projection'], {
    key: lib.Name[lib.CodecSymbol],
    projection: JsonProjectionSelector[lib.CodecSymbol],
  }),
}

export type MetadataProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Key', MetadataKeyProjectionSelector>
export const MetadataProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Key', T> => ({ kind: 'Key', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Key: [MetadataKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Key', MetadataKeyProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AccountProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AccountIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
export const AccountProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AccountIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AccountIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>>({
          kind: 'Id',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Signatory: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  Metadata: {
    Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AccountIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', AccountIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type WasmSmartContract = lib.Vec<lib.U8>
export const WasmSmartContract = lib.Vec.with(lib.U8[lib.CodecSymbol])

export type Executable = lib.Variant<'Instructions', lib.Vec<InstructionBox>> | lib.Variant<'Wasm', WasmSmartContract>
export const Executable = {
  Instructions: <const T extends lib.Vec<InstructionBox>>(value: T): lib.Variant<'Instructions', T> => ({
    kind: 'Instructions',
    value,
  }),
  Wasm: <const T extends WasmSmartContract>(value: T): lib.Variant<'Wasm', T> => ({ kind: 'Wasm', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Instructions: [lib.Vec<InstructionBox>]; Wasm: [WasmSmartContract] }>([
      [0, 'Instructions', lib.Vec.with(lib.lazyCodec(() => InstructionBox[lib.CodecSymbol]))[lib.CodecSymbol]],
      [1, 'Wasm', WasmSmartContract[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type Repeats = lib.VariantUnit<'Indefinitely'> | lib.Variant<'Exactly', lib.U32>
export const Repeats = {
  Indefinitely: Object.freeze<lib.VariantUnit<'Indefinitely'>>({ kind: 'Indefinitely' }),
  Exactly: <const T extends lib.U32>(value: T): lib.Variant<'Exactly', T> => ({ kind: 'Exactly', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Indefinitely: []; Exactly: [lib.U32] }>([
      [0, 'Indefinitely'],
      [1, 'Exactly', lib.U32[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface PeerId {
  publicKey: lib.PublicKeyWrap
}
export const PeerId: lib.CodecProvider<PeerId> = {
  [lib.CodecSymbol]: lib.structCodec<PeerId>(['publicKey'], { publicKey: lib.PublicKeyWrap[lib.CodecSymbol] }),
}

export interface TriggerId {
  name: lib.Name
}
export const TriggerId: lib.CodecProvider<TriggerId> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerId>(['name'], { name: lib.Name[lib.CodecSymbol] }),
}

export type FindError =
  | lib.Variant<'Asset', lib.AssetId>
  | lib.Variant<'AssetDefinition', lib.AssetDefinitionId>
  | lib.Variant<'Account', lib.AccountId>
  | lib.Variant<'Domain', lib.DomainId>
  | lib.Variant<'MetadataKey', lib.Name>
  | lib.Variant<'Block', lib.HashWrap>
  | lib.Variant<'Transaction', lib.HashWrap>
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Trigger', TriggerId>
  | lib.Variant<'Role', RoleId>
  | lib.Variant<'Permission', Permission>
  | lib.Variant<'PublicKey', lib.PublicKeyWrap>
export const FindError = {
  Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  AssetDefinition: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }),
  Account: <const T extends lib.AccountId>(value: T): lib.Variant<'Account', T> => ({ kind: 'Account', value }),
  Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  MetadataKey: <const T extends lib.Name>(value: T): lib.Variant<'MetadataKey', T> => ({ kind: 'MetadataKey', value }),
  Block: <const T extends lib.HashWrap>(value: T): lib.Variant<'Block', T> => ({ kind: 'Block', value }),
  Transaction: <const T extends lib.HashWrap>(value: T): lib.Variant<'Transaction', T> => ({
    kind: 'Transaction',
    value,
  }),
  Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }),
  Trigger: <const T extends TriggerId>(value: T): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  Role: <const T extends RoleId>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  Permission: <const T extends Permission>(value: T): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }),
  PublicKey: <const T extends lib.PublicKeyWrap>(value: T): lib.Variant<'PublicKey', T> => ({
    kind: 'PublicKey',
    value,
  }),
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
      [0, 'Asset', lib.AssetId[lib.CodecSymbol]],
      [1, 'AssetDefinition', lib.AssetDefinitionId[lib.CodecSymbol]],
      [2, 'Account', lib.AccountId[lib.CodecSymbol]],
      [3, 'Domain', lib.DomainId[lib.CodecSymbol]],
      [4, 'MetadataKey', lib.Name[lib.CodecSymbol]],
      [5, 'Block', lib.HashWrap[lib.CodecSymbol]],
      [6, 'Transaction', lib.HashWrap[lib.CodecSymbol]],
      [7, 'Peer', PeerId[lib.CodecSymbol]],
      [8, 'Trigger', TriggerId[lib.CodecSymbol]],
      [9, 'Role', RoleId[lib.CodecSymbol]],
      [10, 'Permission', Permission[lib.CodecSymbol]],
      [11, 'PublicKey', lib.PublicKeyWrap[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TransactionLimitError {
  reason: lib.String
}
export const TransactionLimitError: lib.CodecProvider<TransactionLimitError> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionLimitError>(['reason'], { reason: lib.String[lib.CodecSymbol] }),
}

export type InstructionType =
  | lib.VariantUnit<'Register'>
  | lib.VariantUnit<'Unregister'>
  | lib.VariantUnit<'Mint'>
  | lib.VariantUnit<'Burn'>
  | lib.VariantUnit<'Transfer'>
  | lib.VariantUnit<'SetKeyValue'>
  | lib.VariantUnit<'RemoveKeyValue'>
  | lib.VariantUnit<'Grant'>
  | lib.VariantUnit<'Revoke'>
  | lib.VariantUnit<'ExecuteTrigger'>
  | lib.VariantUnit<'SetParameter'>
  | lib.VariantUnit<'Upgrade'>
  | lib.VariantUnit<'Log'>
  | lib.VariantUnit<'Custom'>
export const InstructionType = {
  Register: Object.freeze<lib.VariantUnit<'Register'>>({ kind: 'Register' }),
  Unregister: Object.freeze<lib.VariantUnit<'Unregister'>>({ kind: 'Unregister' }),
  Mint: Object.freeze<lib.VariantUnit<'Mint'>>({ kind: 'Mint' }),
  Burn: Object.freeze<lib.VariantUnit<'Burn'>>({ kind: 'Burn' }),
  Transfer: Object.freeze<lib.VariantUnit<'Transfer'>>({ kind: 'Transfer' }),
  SetKeyValue: Object.freeze<lib.VariantUnit<'SetKeyValue'>>({ kind: 'SetKeyValue' }),
  RemoveKeyValue: Object.freeze<lib.VariantUnit<'RemoveKeyValue'>>({ kind: 'RemoveKeyValue' }),
  Grant: Object.freeze<lib.VariantUnit<'Grant'>>({ kind: 'Grant' }),
  Revoke: Object.freeze<lib.VariantUnit<'Revoke'>>({ kind: 'Revoke' }),
  ExecuteTrigger: Object.freeze<lib.VariantUnit<'ExecuteTrigger'>>({ kind: 'ExecuteTrigger' }),
  SetParameter: Object.freeze<lib.VariantUnit<'SetParameter'>>({ kind: 'SetParameter' }),
  Upgrade: Object.freeze<lib.VariantUnit<'Upgrade'>>({ kind: 'Upgrade' }),
  Log: Object.freeze<lib.VariantUnit<'Log'>>({ kind: 'Log' }),
  Custom: Object.freeze<lib.VariantUnit<'Custom'>>({ kind: 'Custom' }),
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
    scale: lib.Option.with(lib.U32[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type AssetType = lib.Variant<'Numeric', NumericSpec> | lib.VariantUnit<'Store'>
export const AssetType = {
  Numeric: <const T extends NumericSpec>(value: T): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }),
  Store: Object.freeze<lib.VariantUnit<'Store'>>({ kind: 'Store' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Numeric: [NumericSpec]; Store: [] }>([
      [0, 'Numeric', NumericSpec[lib.CodecSymbol]],
      [1, 'Store'],
    ])
    .discriminated(),
}

export type TypeError =
  | lib.Variant<'AssetType', Mismatch<AssetType>>
  | lib.Variant<'NumericAssetTypeExpected', AssetType>
export const TypeError = {
  AssetType: <const T extends Mismatch<AssetType>>(value: T): lib.Variant<'AssetType', T> => ({
    kind: 'AssetType',
    value,
  }),
  NumericAssetTypeExpected: {
    Numeric: <const T extends NumericSpec>(
      value: T,
    ): lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>> => ({
      kind: 'NumericAssetTypeExpected',
      value: AssetType.Numeric(value),
    }),
    Store: Object.freeze<lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>({
      kind: 'NumericAssetTypeExpected',
      value: AssetType.Store,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ AssetType: [Mismatch<AssetType>]; NumericAssetTypeExpected: [AssetType] }>([
      [0, 'AssetType', Mismatch.with(AssetType[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'NumericAssetTypeExpected', AssetType[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type InstructionEvaluationError =
  | lib.Variant<'Unsupported', InstructionType>
  | lib.Variant<'PermissionParameter', lib.String>
  | lib.Variant<'Type', TypeError>
export const InstructionEvaluationError = {
  Unsupported: {
    Register: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>>({
      kind: 'Unsupported',
      value: InstructionType.Register,
    }),
    Unregister: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>>({
      kind: 'Unsupported',
      value: InstructionType.Unregister,
    }),
    Mint: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>({
      kind: 'Unsupported',
      value: InstructionType.Mint,
    }),
    Burn: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>({
      kind: 'Unsupported',
      value: InstructionType.Burn,
    }),
    Transfer: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>>({
      kind: 'Unsupported',
      value: InstructionType.Transfer,
    }),
    SetKeyValue: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>>({
      kind: 'Unsupported',
      value: InstructionType.SetKeyValue,
    }),
    RemoveKeyValue: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>>({
      kind: 'Unsupported',
      value: InstructionType.RemoveKeyValue,
    }),
    Grant: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>({
      kind: 'Unsupported',
      value: InstructionType.Grant,
    }),
    Revoke: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>>({
      kind: 'Unsupported',
      value: InstructionType.Revoke,
    }),
    ExecuteTrigger: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>>({
      kind: 'Unsupported',
      value: InstructionType.ExecuteTrigger,
    }),
    SetParameter: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>>({
      kind: 'Unsupported',
      value: InstructionType.SetParameter,
    }),
    Upgrade: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>>({
      kind: 'Unsupported',
      value: InstructionType.Upgrade,
    }),
    Log: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>({
      kind: 'Unsupported',
      value: InstructionType.Log,
    }),
    Custom: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>>({
      kind: 'Unsupported',
      value: InstructionType.Custom,
    }),
  },
  PermissionParameter: <const T extends lib.String>(value: T): lib.Variant<'PermissionParameter', T> => ({
    kind: 'PermissionParameter',
    value,
  }),
  Type: {
    AssetType: <const T extends Mismatch<AssetType>>(value: T): lib.Variant<'Type', lib.Variant<'AssetType', T>> => ({
      kind: 'Type',
      value: TypeError.AssetType(value),
    }),
    NumericAssetTypeExpected: {
      Numeric: <const T extends NumericSpec>(
        value: T,
      ): lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>> => ({
        kind: 'Type',
        value: TypeError.NumericAssetTypeExpected.Numeric(value),
      }),
      Store: Object.freeze<lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>>({
        kind: 'Type',
        value: TypeError.NumericAssetTypeExpected.Store,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Unsupported: [InstructionType]; PermissionParameter: [lib.String]; Type: [TypeError] }>([
      [0, 'Unsupported', InstructionType[lib.CodecSymbol]],
      [1, 'PermissionParameter', lib.String[lib.CodecSymbol]],
      [2, 'Type', TypeError[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type QueryExecutionFail =
  | lib.Variant<'Find', FindError>
  | lib.Variant<'Conversion', lib.String>
  | lib.VariantUnit<'NotFound'>
  | lib.VariantUnit<'CursorMismatch'>
  | lib.VariantUnit<'CursorDone'>
  | lib.VariantUnit<'FetchSizeTooBig'>
  | lib.VariantUnit<'InvalidSingularParameters'>
  | lib.VariantUnit<'CapacityLimit'>
export const QueryExecutionFail = {
  Find: {
    Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Find', lib.Variant<'Asset', T>> => ({
      kind: 'Find',
      value: FindError.Asset(value),
    }),
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }),
    Account: <const T extends lib.AccountId>(value: T): lib.Variant<'Find', lib.Variant<'Account', T>> => ({
      kind: 'Find',
      value: FindError.Account(value),
    }),
    Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'Find', lib.Variant<'Domain', T>> => ({
      kind: 'Find',
      value: FindError.Domain(value),
    }),
    MetadataKey: <const T extends lib.Name>(value: T): lib.Variant<'Find', lib.Variant<'MetadataKey', T>> => ({
      kind: 'Find',
      value: FindError.MetadataKey(value),
    }),
    Block: <const T extends lib.HashWrap>(value: T): lib.Variant<'Find', lib.Variant<'Block', T>> => ({
      kind: 'Find',
      value: FindError.Block(value),
    }),
    Transaction: <const T extends lib.HashWrap>(value: T): lib.Variant<'Find', lib.Variant<'Transaction', T>> => ({
      kind: 'Find',
      value: FindError.Transaction(value),
    }),
    Peer: <const T extends PeerId>(value: T): lib.Variant<'Find', lib.Variant<'Peer', T>> => ({
      kind: 'Find',
      value: FindError.Peer(value),
    }),
    Trigger: <const T extends TriggerId>(value: T): lib.Variant<'Find', lib.Variant<'Trigger', T>> => ({
      kind: 'Find',
      value: FindError.Trigger(value),
    }),
    Role: <const T extends RoleId>(value: T): lib.Variant<'Find', lib.Variant<'Role', T>> => ({
      kind: 'Find',
      value: FindError.Role(value),
    }),
    Permission: <const T extends Permission>(value: T): lib.Variant<'Find', lib.Variant<'Permission', T>> => ({
      kind: 'Find',
      value: FindError.Permission(value),
    }),
    PublicKey: <const T extends lib.PublicKeyWrap>(value: T): lib.Variant<'Find', lib.Variant<'PublicKey', T>> => ({
      kind: 'Find',
      value: FindError.PublicKey(value),
    }),
  },
  Conversion: <const T extends lib.String>(value: T): lib.Variant<'Conversion', T> => ({ kind: 'Conversion', value }),
  NotFound: Object.freeze<lib.VariantUnit<'NotFound'>>({ kind: 'NotFound' }),
  CursorMismatch: Object.freeze<lib.VariantUnit<'CursorMismatch'>>({ kind: 'CursorMismatch' }),
  CursorDone: Object.freeze<lib.VariantUnit<'CursorDone'>>({ kind: 'CursorDone' }),
  FetchSizeTooBig: Object.freeze<lib.VariantUnit<'FetchSizeTooBig'>>({ kind: 'FetchSizeTooBig' }),
  InvalidSingularParameters: Object.freeze<lib.VariantUnit<'InvalidSingularParameters'>>({
    kind: 'InvalidSingularParameters',
  }),
  CapacityLimit: Object.freeze<lib.VariantUnit<'CapacityLimit'>>({ kind: 'CapacityLimit' }),
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
      [0, 'Find', FindError[lib.CodecSymbol]],
      [1, 'Conversion', lib.String[lib.CodecSymbol]],
      [2, 'NotFound'],
      [3, 'CursorMismatch'],
      [4, 'CursorDone'],
      [5, 'FetchSizeTooBig'],
      [6, 'InvalidSingularParameters'],
      [7, 'CapacityLimit'],
    ])
    .discriminated(),
}

export type CustomParameterId = lib.Name
export const CustomParameterId = lib.Name

export type IdBox =
  | lib.Variant<'DomainId', lib.DomainId>
  | lib.Variant<'AccountId', lib.AccountId>
  | lib.Variant<'AssetDefinitionId', lib.AssetDefinitionId>
  | lib.Variant<'AssetId', lib.AssetId>
  | lib.Variant<'PeerId', PeerId>
  | lib.Variant<'TriggerId', TriggerId>
  | lib.Variant<'RoleId', RoleId>
  | lib.Variant<'Permission', Permission>
  | lib.Variant<'CustomParameterId', CustomParameterId>
export const IdBox = {
  DomainId: <const T extends lib.DomainId>(value: T): lib.Variant<'DomainId', T> => ({ kind: 'DomainId', value }),
  AccountId: <const T extends lib.AccountId>(value: T): lib.Variant<'AccountId', T> => ({ kind: 'AccountId', value }),
  AssetDefinitionId: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'AssetDefinitionId', T> => ({
    kind: 'AssetDefinitionId',
    value,
  }),
  AssetId: <const T extends lib.AssetId>(value: T): lib.Variant<'AssetId', T> => ({ kind: 'AssetId', value }),
  PeerId: <const T extends PeerId>(value: T): lib.Variant<'PeerId', T> => ({ kind: 'PeerId', value }),
  TriggerId: <const T extends TriggerId>(value: T): lib.Variant<'TriggerId', T> => ({ kind: 'TriggerId', value }),
  RoleId: <const T extends RoleId>(value: T): lib.Variant<'RoleId', T> => ({ kind: 'RoleId', value }),
  Permission: <const T extends Permission>(value: T): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }),
  CustomParameterId: <const T extends CustomParameterId>(value: T): lib.Variant<'CustomParameterId', T> => ({
    kind: 'CustomParameterId',
    value,
  }),
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
      CustomParameterId: [CustomParameterId]
    }>([
      [0, 'DomainId', lib.DomainId[lib.CodecSymbol]],
      [1, 'AccountId', lib.AccountId[lib.CodecSymbol]],
      [2, 'AssetDefinitionId', lib.AssetDefinitionId[lib.CodecSymbol]],
      [3, 'AssetId', lib.AssetId[lib.CodecSymbol]],
      [4, 'PeerId', PeerId[lib.CodecSymbol]],
      [5, 'TriggerId', TriggerId[lib.CodecSymbol]],
      [6, 'RoleId', RoleId[lib.CodecSymbol]],
      [7, 'Permission', Permission[lib.CodecSymbol]],
      [8, 'CustomParameterId', CustomParameterId[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface RepetitionError {
  instruction: InstructionType
  id: IdBox
}
export const RepetitionError: lib.CodecProvider<RepetitionError> = {
  [lib.CodecSymbol]: lib.structCodec<RepetitionError>(['instruction', 'id'], {
    instruction: InstructionType[lib.CodecSymbol],
    id: IdBox[lib.CodecSymbol],
  }),
}

export type MintabilityError = lib.VariantUnit<'MintUnmintable'> | lib.VariantUnit<'ForbidMintOnMintable'>
export const MintabilityError = {
  MintUnmintable: Object.freeze<lib.VariantUnit<'MintUnmintable'>>({ kind: 'MintUnmintable' }),
  ForbidMintOnMintable: Object.freeze<lib.VariantUnit<'ForbidMintOnMintable'>>({ kind: 'ForbidMintOnMintable' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ MintUnmintable: []; ForbidMintOnMintable: [] }>([
      [0, 'MintUnmintable'],
      [1, 'ForbidMintOnMintable'],
    ])
    .discriminated(),
}

export type MathError =
  | lib.VariantUnit<'Overflow'>
  | lib.VariantUnit<'NotEnoughQuantity'>
  | lib.VariantUnit<'DivideByZero'>
  | lib.VariantUnit<'NegativeValue'>
  | lib.VariantUnit<'DomainViolation'>
  | lib.VariantUnit<'Unknown'>
  | lib.Variant<'FixedPointConversion', lib.String>
export const MathError = {
  Overflow: Object.freeze<lib.VariantUnit<'Overflow'>>({ kind: 'Overflow' }),
  NotEnoughQuantity: Object.freeze<lib.VariantUnit<'NotEnoughQuantity'>>({ kind: 'NotEnoughQuantity' }),
  DivideByZero: Object.freeze<lib.VariantUnit<'DivideByZero'>>({ kind: 'DivideByZero' }),
  NegativeValue: Object.freeze<lib.VariantUnit<'NegativeValue'>>({ kind: 'NegativeValue' }),
  DomainViolation: Object.freeze<lib.VariantUnit<'DomainViolation'>>({ kind: 'DomainViolation' }),
  Unknown: Object.freeze<lib.VariantUnit<'Unknown'>>({ kind: 'Unknown' }),
  FixedPointConversion: <const T extends lib.String>(value: T): lib.Variant<'FixedPointConversion', T> => ({
    kind: 'FixedPointConversion',
    value,
  }),
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
      [6, 'FixedPointConversion', lib.String[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type InvalidParameterError = lib.Variant<'Wasm', lib.String> | lib.VariantUnit<'TimeTriggerInThePast'>
export const InvalidParameterError = {
  Wasm: <const T extends lib.String>(value: T): lib.Variant<'Wasm', T> => ({ kind: 'Wasm', value }),
  TimeTriggerInThePast: Object.freeze<lib.VariantUnit<'TimeTriggerInThePast'>>({ kind: 'TimeTriggerInThePast' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Wasm: [lib.String]; TimeTriggerInThePast: [] }>([
      [0, 'Wasm', lib.String[lib.CodecSymbol]],
      [1, 'TimeTriggerInThePast'],
    ])
    .discriminated(),
}

export type InstructionExecutionError =
  | lib.Variant<'Evaluate', InstructionEvaluationError>
  | lib.Variant<'Query', QueryExecutionFail>
  | lib.Variant<'Conversion', lib.String>
  | lib.Variant<'Find', FindError>
  | lib.Variant<'Repetition', RepetitionError>
  | lib.Variant<'Mintability', MintabilityError>
  | lib.Variant<'Math', MathError>
  | lib.Variant<'InvalidParameter', InvalidParameterError>
  | lib.Variant<'InvariantViolation', lib.String>
export const InstructionExecutionError = {
  Evaluate: {
    Unsupported: {
      Register: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Register,
      }),
      Unregister: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Unregister,
      }),
      Mint: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Mint,
      }),
      Burn: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Burn,
      }),
      Transfer: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Transfer,
      }),
      SetKeyValue: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.SetKeyValue,
      }),
      RemoveKeyValue: Object.freeze<
        lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>>
      >({ kind: 'Evaluate', value: InstructionEvaluationError.Unsupported.RemoveKeyValue }),
      Grant: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Grant,
      }),
      Revoke: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Revoke,
      }),
      ExecuteTrigger: Object.freeze<
        lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>>
      >({ kind: 'Evaluate', value: InstructionEvaluationError.Unsupported.ExecuteTrigger }),
      SetParameter: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>>>(
        { kind: 'Evaluate', value: InstructionEvaluationError.Unsupported.SetParameter },
      ),
      Upgrade: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Upgrade,
      }),
      Log: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Log,
      }),
      Custom: Object.freeze<lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>>>({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Custom,
      }),
    },
    PermissionParameter: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>> => ({
      kind: 'Evaluate',
      value: InstructionEvaluationError.PermissionParameter(value),
    }),
    Type: {
      AssetType: <const T extends Mismatch<AssetType>>(
        value: T,
      ): lib.Variant<'Evaluate', lib.Variant<'Type', lib.Variant<'AssetType', T>>> => ({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Type.AssetType(value),
      }),
      NumericAssetTypeExpected: {
        Numeric: <const T extends NumericSpec>(
          value: T,
        ): lib.Variant<
          'Evaluate',
          lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>>
        > => ({ kind: 'Evaluate', value: InstructionEvaluationError.Type.NumericAssetTypeExpected.Numeric(value) }),
        Store: Object.freeze<
          lib.Variant<
            'Evaluate',
            lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>
          >
        >({ kind: 'Evaluate', value: InstructionEvaluationError.Type.NumericAssetTypeExpected.Store }),
      },
    },
  },
  Query: {
    Find: {
      Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Asset(value),
      }),
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }),
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Account', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Account(value),
      }),
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Domain', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Domain(value),
      }),
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }),
      Block: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Block(value),
      }),
      Transaction: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Transaction', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Transaction(value),
      }),
      Peer: <const T extends PeerId>(value: T): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Peer(value),
      }),
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Trigger', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Trigger(value),
      }),
      Role: <const T extends RoleId>(value: T): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Role(value),
      }),
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Permission', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Permission(value),
      }),
      PublicKey: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'PublicKey', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.PublicKey(value),
      }),
    },
    Conversion: <const T extends lib.String>(value: T): lib.Variant<'Query', lib.Variant<'Conversion', T>> => ({
      kind: 'Query',
      value: QueryExecutionFail.Conversion(value),
    }),
    NotFound: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'NotFound'>>>({
      kind: 'Query',
      value: QueryExecutionFail.NotFound,
    }),
    CursorMismatch: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>>({
      kind: 'Query',
      value: QueryExecutionFail.CursorMismatch,
    }),
    CursorDone: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>>({
      kind: 'Query',
      value: QueryExecutionFail.CursorDone,
    }),
    FetchSizeTooBig: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>>({
      kind: 'Query',
      value: QueryExecutionFail.FetchSizeTooBig,
    }),
    InvalidSingularParameters: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>>({
      kind: 'Query',
      value: QueryExecutionFail.InvalidSingularParameters,
    }),
    CapacityLimit: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>>({
      kind: 'Query',
      value: QueryExecutionFail.CapacityLimit,
    }),
  },
  Conversion: <const T extends lib.String>(value: T): lib.Variant<'Conversion', T> => ({ kind: 'Conversion', value }),
  Find: {
    Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Find', lib.Variant<'Asset', T>> => ({
      kind: 'Find',
      value: FindError.Asset(value),
    }),
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }),
    Account: <const T extends lib.AccountId>(value: T): lib.Variant<'Find', lib.Variant<'Account', T>> => ({
      kind: 'Find',
      value: FindError.Account(value),
    }),
    Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'Find', lib.Variant<'Domain', T>> => ({
      kind: 'Find',
      value: FindError.Domain(value),
    }),
    MetadataKey: <const T extends lib.Name>(value: T): lib.Variant<'Find', lib.Variant<'MetadataKey', T>> => ({
      kind: 'Find',
      value: FindError.MetadataKey(value),
    }),
    Block: <const T extends lib.HashWrap>(value: T): lib.Variant<'Find', lib.Variant<'Block', T>> => ({
      kind: 'Find',
      value: FindError.Block(value),
    }),
    Transaction: <const T extends lib.HashWrap>(value: T): lib.Variant<'Find', lib.Variant<'Transaction', T>> => ({
      kind: 'Find',
      value: FindError.Transaction(value),
    }),
    Peer: <const T extends PeerId>(value: T): lib.Variant<'Find', lib.Variant<'Peer', T>> => ({
      kind: 'Find',
      value: FindError.Peer(value),
    }),
    Trigger: <const T extends TriggerId>(value: T): lib.Variant<'Find', lib.Variant<'Trigger', T>> => ({
      kind: 'Find',
      value: FindError.Trigger(value),
    }),
    Role: <const T extends RoleId>(value: T): lib.Variant<'Find', lib.Variant<'Role', T>> => ({
      kind: 'Find',
      value: FindError.Role(value),
    }),
    Permission: <const T extends Permission>(value: T): lib.Variant<'Find', lib.Variant<'Permission', T>> => ({
      kind: 'Find',
      value: FindError.Permission(value),
    }),
    PublicKey: <const T extends lib.PublicKeyWrap>(value: T): lib.Variant<'Find', lib.Variant<'PublicKey', T>> => ({
      kind: 'Find',
      value: FindError.PublicKey(value),
    }),
  },
  Repetition: <const T extends RepetitionError>(value: T): lib.Variant<'Repetition', T> => ({
    kind: 'Repetition',
    value,
  }),
  Mintability: {
    MintUnmintable: Object.freeze<lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>>({
      kind: 'Mintability',
      value: MintabilityError.MintUnmintable,
    }),
    ForbidMintOnMintable: Object.freeze<lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>>({
      kind: 'Mintability',
      value: MintabilityError.ForbidMintOnMintable,
    }),
  },
  Math: {
    Overflow: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'Overflow'>>>({
      kind: 'Math',
      value: MathError.Overflow,
    }),
    NotEnoughQuantity: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>>({
      kind: 'Math',
      value: MathError.NotEnoughQuantity,
    }),
    DivideByZero: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>>({
      kind: 'Math',
      value: MathError.DivideByZero,
    }),
    NegativeValue: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>>({
      kind: 'Math',
      value: MathError.NegativeValue,
    }),
    DomainViolation: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>>({
      kind: 'Math',
      value: MathError.DomainViolation,
    }),
    Unknown: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'Unknown'>>>({ kind: 'Math', value: MathError.Unknown }),
    FixedPointConversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>> => ({
      kind: 'Math',
      value: MathError.FixedPointConversion(value),
    }),
  },
  InvalidParameter: {
    Wasm: <const T extends lib.String>(value: T): lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>> => ({
      kind: 'InvalidParameter',
      value: InvalidParameterError.Wasm(value),
    }),
    TimeTriggerInThePast: Object.freeze<lib.Variant<'InvalidParameter', lib.VariantUnit<'TimeTriggerInThePast'>>>({
      kind: 'InvalidParameter',
      value: InvalidParameterError.TimeTriggerInThePast,
    }),
  },
  InvariantViolation: <const T extends lib.String>(value: T): lib.Variant<'InvariantViolation', T> => ({
    kind: 'InvariantViolation',
    value,
  }),
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
      [0, 'Evaluate', InstructionEvaluationError[lib.CodecSymbol]],
      [1, 'Query', QueryExecutionFail[lib.CodecSymbol]],
      [2, 'Conversion', lib.String[lib.CodecSymbol]],
      [3, 'Find', FindError[lib.CodecSymbol]],
      [4, 'Repetition', RepetitionError[lib.CodecSymbol]],
      [5, 'Mintability', MintabilityError[lib.CodecSymbol]],
      [6, 'Math', MathError[lib.CodecSymbol]],
      [7, 'InvalidParameter', InvalidParameterError[lib.CodecSymbol]],
      [8, 'InvariantViolation', lib.String[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type ValidationFail =
  | lib.Variant<'NotPermitted', lib.String>
  | lib.Variant<'InstructionFailed', InstructionExecutionError>
  | lib.Variant<'QueryFailed', QueryExecutionFail>
  | lib.VariantUnit<'TooComplex'>
  | lib.VariantUnit<'InternalError'>
export const ValidationFail = {
  NotPermitted: <const T extends lib.String>(value: T): lib.Variant<'NotPermitted', T> => ({
    kind: 'NotPermitted',
    value,
  }),
  InstructionFailed: {
    Evaluate: {
      Unsupported: {
        Register: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Register }),
        Unregister: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Unregister }),
        Mint: Object.freeze<
          lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>>
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Mint }),
        Burn: Object.freeze<
          lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>>
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Burn }),
        Transfer: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Transfer }),
        SetKeyValue: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.SetKeyValue }),
        RemoveKeyValue: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.RemoveKeyValue }),
        Grant: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Grant }),
        Revoke: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Revoke }),
        ExecuteTrigger: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.ExecuteTrigger }),
        SetParameter: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.SetParameter }),
        Upgrade: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Upgrade }),
        Log: Object.freeze<
          lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>>
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Log }),
        Custom: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>>
          >
        >({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Unsupported.Custom }),
      },
      PermissionParameter: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Evaluate.PermissionParameter(value),
      }),
      Type: {
        AssetType: <const T extends Mismatch<AssetType>>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Evaluate', lib.Variant<'Type', lib.Variant<'AssetType', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Evaluate.Type.AssetType(value) }),
        NumericAssetTypeExpected: {
          Numeric: <const T extends NumericSpec>(
            value: T,
          ): lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>>
            >
          > => ({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Numeric(value),
          }),
          Store: Object.freeze<
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Evaluate',
                lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>
              >
            >
          >({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Store,
          }),
        },
      },
    },
    Query: {
      Find: {
        Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Asset(value),
        }),
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.Find.AssetDefinition(value) }),
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Account', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Account(value),
        }),
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Domain', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Domain(value),
        }),
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.Find.MetadataKey(value) }),
        Block: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Block(value),
        }),
        Transaction: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Transaction', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.Find.Transaction(value) }),
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Peer(value),
        }),
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Trigger', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Trigger(value),
        }),
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>>> => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Role(value),
        }),
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Permission', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.Find.Permission(value) }),
        PublicKey: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>
        > => ({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.Find.PublicKey(value) }),
      },
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Conversion', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.Conversion(value),
      }),
      NotFound: Object.freeze<lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'NotFound'>>>>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.NotFound,
      }),
      CursorMismatch: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.CursorMismatch }),
      CursorDone: Object.freeze<lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>>>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CursorDone,
      }),
      FetchSizeTooBig: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.FetchSizeTooBig }),
      InvalidSingularParameters: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.InvalidSingularParameters }),
      CapacityLimit: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Query.CapacityLimit }),
    },
    Conversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>> => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Conversion(value),
    }),
    Find: {
      Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Asset(value),
      }),
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.AssetDefinition(value),
      }),
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Account', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Account(value),
      }),
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Domain(value),
      }),
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.MetadataKey(value),
      }),
      Block: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Block', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Block(value),
      }),
      Transaction: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Transaction(value),
      }),
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Peer(value),
      }),
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Trigger(value),
      }),
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Role', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Role(value),
      }),
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Permission(value),
      }),
      PublicKey: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.PublicKey(value),
      }),
    },
    Repetition: <const T extends RepetitionError>(
      value: T,
    ): lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>> => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Repetition(value),
    }),
    Mintability: {
      MintUnmintable: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Mintability.MintUnmintable }),
      ForbidMintOnMintable: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Mintability.ForbidMintOnMintable }),
    },
    Math: {
      Overflow: Object.freeze<lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Overflow'>>>>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Overflow,
      }),
      NotEnoughQuantity: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Math.NotEnoughQuantity }),
      DivideByZero: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Math.DivideByZero }),
      NegativeValue: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Math.NegativeValue }),
      DomainViolation: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.Math.DomainViolation }),
      Unknown: Object.freeze<lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Unknown'>>>>({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Unknown,
      }),
      FixedPointConversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.FixedPointConversion(value),
      }),
    },
    InvalidParameter: {
      Wasm: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'InstructionFailed', lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>> => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.InvalidParameter.Wasm(value),
      }),
      TimeTriggerInThePast: Object.freeze<
        lib.Variant<'InstructionFailed', lib.Variant<'InvalidParameter', lib.VariantUnit<'TimeTriggerInThePast'>>>
      >({ kind: 'InstructionFailed', value: InstructionExecutionError.InvalidParameter.TimeTriggerInThePast }),
    },
    InvariantViolation: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'InstructionFailed', lib.Variant<'InvariantViolation', T>> => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.InvariantViolation(value),
    }),
  },
  QueryFailed: {
    Find: {
      Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Asset(value),
      }),
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }),
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Account', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Account(value),
      }),
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Domain(value),
      }),
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }),
      Block: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Block', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Block(value),
      }),
      Transaction: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Transaction(value),
      }),
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Peer(value),
      }),
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Trigger(value),
      }),
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Role', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Role(value),
      }),
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Permission(value),
      }),
      PublicKey: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>> => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.PublicKey(value),
      }),
    },
    Conversion: <const T extends lib.String>(value: T): lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>> => ({
      kind: 'QueryFailed',
      value: QueryExecutionFail.Conversion(value),
    }),
    NotFound: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.NotFound,
    }),
    CursorMismatch: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.CursorMismatch,
    }),
    CursorDone: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.CursorDone,
    }),
    FetchSizeTooBig: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.FetchSizeTooBig,
    }),
    InvalidSingularParameters: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'InvalidSingularParameters'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.InvalidSingularParameters,
    }),
    CapacityLimit: Object.freeze<lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>>({
      kind: 'QueryFailed',
      value: QueryExecutionFail.CapacityLimit,
    }),
  },
  TooComplex: Object.freeze<lib.VariantUnit<'TooComplex'>>({ kind: 'TooComplex' }),
  InternalError: Object.freeze<lib.VariantUnit<'InternalError'>>({ kind: 'InternalError' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      NotPermitted: [lib.String]
      InstructionFailed: [InstructionExecutionError]
      QueryFailed: [QueryExecutionFail]
      TooComplex: []
      InternalError: []
    }>([
      [0, 'NotPermitted', lib.String[lib.CodecSymbol]],
      [1, 'InstructionFailed', InstructionExecutionError[lib.CodecSymbol]],
      [2, 'QueryFailed', QueryExecutionFail[lib.CodecSymbol]],
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
    instruction: lib.lazyCodec(() => InstructionBox[lib.CodecSymbol]),
    reason: lib.String[lib.CodecSymbol],
  }),
}

export interface WasmExecutionFail {
  reason: lib.String
}
export const WasmExecutionFail: lib.CodecProvider<WasmExecutionFail> = {
  [lib.CodecSymbol]: lib.structCodec<WasmExecutionFail>(['reason'], { reason: lib.String[lib.CodecSymbol] }),
}

export type TransactionRejectionReason =
  | lib.Variant<'AccountDoesNotExist', FindError>
  | lib.Variant<'LimitCheck', TransactionLimitError>
  | lib.Variant<'Validation', ValidationFail>
  | lib.Variant<'InstructionExecution', InstructionExecutionFail>
  | lib.Variant<'WasmExecution', WasmExecutionFail>
export const TransactionRejectionReason = {
  AccountDoesNotExist: {
    Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Asset', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Asset(value),
    }),
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.AssetDefinition(value),
    }),
    Account: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Account', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Account(value),
    }),
    Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Domain', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Domain(value),
    }),
    MetadataKey: <const T extends lib.Name>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'MetadataKey', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.MetadataKey(value),
    }),
    Block: <const T extends lib.HashWrap>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Block', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Block(value),
    }),
    Transaction: <const T extends lib.HashWrap>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Transaction', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Transaction(value),
    }),
    Peer: <const T extends PeerId>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Peer', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Peer(value),
    }),
    Trigger: <const T extends TriggerId>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Trigger', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Trigger(value),
    }),
    Role: <const T extends RoleId>(value: T): lib.Variant<'AccountDoesNotExist', lib.Variant<'Role', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Role(value),
    }),
    Permission: <const T extends Permission>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Permission', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Permission(value),
    }),
    PublicKey: <const T extends lib.PublicKeyWrap>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'PublicKey', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.PublicKey(value),
    }),
  },
  LimitCheck: <const T extends TransactionLimitError>(value: T): lib.Variant<'LimitCheck', T> => ({
    kind: 'LimitCheck',
    value,
  }),
  Validation: {
    NotPermitted: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Validation', lib.Variant<'NotPermitted', T>> => ({
      kind: 'Validation',
      value: ValidationFail.NotPermitted(value),
    }),
    InstructionFailed: {
      Evaluate: {
        Unsupported: {
          Register: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Register }),
          Unregister: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Unregister }),
          Mint: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Mint }),
          Burn: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Burn }),
          Transfer: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Transfer }),
          SetKeyValue: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.SetKeyValue }),
          RemoveKeyValue: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue }),
          Grant: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Grant }),
          Revoke: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Revoke }),
          ExecuteTrigger: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger }),
          SetParameter: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.SetParameter }),
          Upgrade: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Upgrade }),
          Log: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Log }),
          Custom: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>>
              >
            >
          >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Custom }),
        },
        PermissionParameter: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.PermissionParameter(value) }),
        Type: {
          AssetType: <const T extends Mismatch<AssetType>>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'Type', lib.Variant<'AssetType', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Evaluate.Type.AssetType(value) }),
          NumericAssetTypeExpected: {
            Numeric: <const T extends NumericSpec>(
              value: T,
            ): lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>>
                >
              >
            > => ({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric(value),
            }),
            Store: Object.freeze<
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Evaluate',
                    lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>
                  >
                >
              >
            >({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store,
            }),
          },
        },
      },
      Query: {
        Find: {
          Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Asset(value) }),
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
            >
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.AssetDefinition(value) }),
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Account', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Account(value) }),
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Domain', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Domain(value) }),
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.MetadataKey(value) }),
          Block: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Block(value) }),
          Transaction: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Transaction', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Transaction(value) }),
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Peer(value) }),
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Trigger', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Trigger(value) }),
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Role(value) }),
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Permission', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.Permission(value) }),
          PublicKey: <const T extends lib.PublicKeyWrap>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>>
          > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Find.PublicKey(value) }),
        },
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Conversion', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.Conversion(value) }),
        NotFound: Object.freeze<
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'NotFound'>>>>
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.NotFound }),
        CursorMismatch: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.CursorMismatch }),
        CursorDone: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.CursorDone }),
        FetchSizeTooBig: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.FetchSizeTooBig }),
        InvalidSingularParameters: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.InvalidSingularParameters }),
        CapacityLimit: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Query.CapacityLimit }),
      },
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>>> => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Conversion(value),
      }),
      Find: {
        Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Asset(value) }),
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.AssetDefinition(value) }),
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Account', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Account(value) }),
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Domain(value) }),
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.MetadataKey(value) }),
        Block: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Block', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Block(value) }),
        Transaction: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Transaction(value) }),
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Peer(value) }),
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Trigger(value) }),
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Role', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Role(value) }),
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.Permission(value) }),
        PublicKey: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Find.PublicKey(value) }),
      },
      Repetition: <const T extends RepetitionError>(
        value: T,
      ): lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>>> => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Repetition(value),
      }),
      Mintability: {
        MintUnmintable: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Mintability.MintUnmintable }),
        ForbidMintOnMintable: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Mintability.ForbidMintOnMintable }),
      },
      Math: {
        Overflow: Object.freeze<
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Overflow'>>>>
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.Overflow }),
        NotEnoughQuantity: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.NotEnoughQuantity }),
        DivideByZero: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.DivideByZero }),
        NegativeValue: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.NegativeValue }),
        DomainViolation: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.DomainViolation }),
        Unknown: Object.freeze<
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Unknown'>>>>
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.Unknown }),
        FixedPointConversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.Math.FixedPointConversion(value) }),
      },
      InvalidParameter: {
        Wasm: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'InstructionFailed', lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.InstructionFailed.InvalidParameter.Wasm(value) }),
        TimeTriggerInThePast: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'InvalidParameter', lib.VariantUnit<'TimeTriggerInThePast'>>>
          >
        >({ kind: 'Validation', value: ValidationFail.InstructionFailed.InvalidParameter.TimeTriggerInThePast }),
      },
      InvariantViolation: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'InvariantViolation', T>>> => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.InvariantViolation(value),
      }),
    },
    QueryFailed: {
      Find: {
        Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Asset(value),
        }),
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.QueryFailed.Find.AssetDefinition(value) }),
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Account', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Account(value),
        }),
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Domain(value),
        }),
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.QueryFailed.Find.MetadataKey(value) }),
        Block: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Block', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Block(value),
        }),
        Transaction: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.QueryFailed.Find.Transaction(value) }),
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Peer(value),
        }),
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Trigger(value),
        }),
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Role', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Role(value),
        }),
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>>
        > => ({ kind: 'Validation', value: ValidationFail.QueryFailed.Find.Permission(value) }),
        PublicKey: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>> => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.PublicKey(value),
        }),
      },
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>>> => ({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.Conversion(value),
      }),
      NotFound: Object.freeze<lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>>>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.NotFound,
      }),
      CursorMismatch: Object.freeze<
        lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>>
      >({ kind: 'Validation', value: ValidationFail.QueryFailed.CursorMismatch }),
      CursorDone: Object.freeze<lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>>>({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CursorDone,
      }),
      FetchSizeTooBig: Object.freeze<
        lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>>
      >({ kind: 'Validation', value: ValidationFail.QueryFailed.FetchSizeTooBig }),
      InvalidSingularParameters: Object.freeze<
        lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'InvalidSingularParameters'>>>
      >({ kind: 'Validation', value: ValidationFail.QueryFailed.InvalidSingularParameters }),
      CapacityLimit: Object.freeze<
        lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>>
      >({ kind: 'Validation', value: ValidationFail.QueryFailed.CapacityLimit }),
    },
    TooComplex: Object.freeze<lib.Variant<'Validation', lib.VariantUnit<'TooComplex'>>>({
      kind: 'Validation',
      value: ValidationFail.TooComplex,
    }),
    InternalError: Object.freeze<lib.Variant<'Validation', lib.VariantUnit<'InternalError'>>>({
      kind: 'Validation',
      value: ValidationFail.InternalError,
    }),
  },
  InstructionExecution: <const T extends InstructionExecutionFail>(
    value: T,
  ): lib.Variant<'InstructionExecution', T> => ({ kind: 'InstructionExecution', value }),
  WasmExecution: <const T extends WasmExecutionFail>(value: T): lib.Variant<'WasmExecution', T> => ({
    kind: 'WasmExecution',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      AccountDoesNotExist: [FindError]
      LimitCheck: [TransactionLimitError]
      Validation: [ValidationFail]
      InstructionExecution: [InstructionExecutionFail]
      WasmExecution: [WasmExecutionFail]
    }>([
      [0, 'AccountDoesNotExist', FindError[lib.CodecSymbol]],
      [1, 'LimitCheck', TransactionLimitError[lib.CodecSymbol]],
      [2, 'Validation', ValidationFail[lib.CodecSymbol]],
      [3, 'InstructionExecution', InstructionExecutionFail[lib.CodecSymbol]],
      [4, 'WasmExecution', WasmExecutionFail[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransactionStatus =
  | lib.VariantUnit<'Queued'>
  | lib.VariantUnit<'Expired'>
  | lib.VariantUnit<'Approved'>
  | lib.Variant<'Rejected', TransactionRejectionReason>
export const TransactionStatus = {
  Queued: Object.freeze<lib.VariantUnit<'Queued'>>({ kind: 'Queued' }),
  Expired: Object.freeze<lib.VariantUnit<'Expired'>>({ kind: 'Expired' }),
  Approved: Object.freeze<lib.VariantUnit<'Approved'>>({ kind: 'Approved' }),
  Rejected: {
    AccountDoesNotExist: {
      Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Asset', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Asset(value),
      }),
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'AssetDefinition', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.AssetDefinition(value),
      }),
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Account', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Account(value),
      }),
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Domain', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Domain(value),
      }),
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'MetadataKey', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.MetadataKey(value),
      }),
      Block: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Block', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Block(value),
      }),
      Transaction: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Transaction', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Transaction(value),
      }),
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Peer', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Peer(value),
      }),
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Trigger', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Trigger(value),
      }),
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Role', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Role(value),
      }),
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'Permission', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Permission(value),
      }),
      PublicKey: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'AccountDoesNotExist', lib.Variant<'PublicKey', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.PublicKey(value),
      }),
    },
    LimitCheck: <const T extends TransactionLimitError>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'LimitCheck', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.LimitCheck(value),
    }),
    Validation: {
      NotPermitted: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Rejected', lib.Variant<'Validation', lib.Variant<'NotPermitted', T>>> => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.NotPermitted(value),
      }),
      InstructionFailed: {
        Evaluate: {
          Unsupported: {
            Register: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Register,
            }),
            Unregister: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Unregister,
            }),
            Mint: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Mint,
            }),
            Burn: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Burn,
            }),
            Transfer: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Transfer,
            }),
            SetKeyValue: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetKeyValue,
            }),
            RemoveKeyValue: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue,
            }),
            Grant: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Grant,
            }),
            Revoke: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Revoke,
            }),
            ExecuteTrigger: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger,
            }),
            SetParameter: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetParameter,
            }),
            Upgrade: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Upgrade,
            }),
            Log: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Log,
            }),
            Custom: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<'Evaluate', lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>>
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Custom,
            }),
          },
          PermissionParameter: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.PermissionParameter(value),
          }),
          Type: {
            AssetType: <const T extends Mismatch<AssetType>>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Evaluate', lib.Variant<'Type', lib.Variant<'AssetType', T>>>
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.AssetType(value),
            }),
            NumericAssetTypeExpected: {
              Numeric: <const T extends NumericSpec>(
                value: T,
              ): lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>>
                    >
                  >
                >
              > => ({
                kind: 'Rejected',
                value:
                  TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric(
                    value,
                  ),
              }),
              Store: Object.freeze<
                lib.Variant<
                  'Rejected',
                  lib.Variant<
                    'Validation',
                    lib.Variant<
                      'InstructionFailed',
                      lib.Variant<
                        'Evaluate',
                        lib.Variant<'Type', lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>>
                      >
                    >
                  >
                >
              >({
                kind: 'Rejected',
                value:
                  TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store,
              }),
            },
          },
        },
        Query: {
          Find: {
            Asset: <const T extends lib.AssetId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Asset(value),
            }),
            AssetDefinition: <const T extends lib.AssetDefinitionId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.AssetDefinition(value),
            }),
            Account: <const T extends lib.AccountId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Account', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Account(value),
            }),
            Domain: <const T extends lib.DomainId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Domain', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Domain(value),
            }),
            MetadataKey: <const T extends lib.Name>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.MetadataKey(value),
            }),
            Block: <const T extends lib.HashWrap>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Block(value),
            }),
            Transaction: <const T extends lib.HashWrap>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Transaction', T>>>
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Transaction(value),
            }),
            Peer: <const T extends PeerId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Peer(value),
            }),
            Trigger: <const T extends TriggerId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Trigger', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Trigger(value),
            }),
            Role: <const T extends RoleId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Role(value),
            }),
            Permission: <const T extends Permission>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Permission', T>>>
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Permission(value),
            }),
            PublicKey: <const T extends lib.PublicKeyWrap>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>>
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Query.Find.PublicKey(value),
            }),
          },
          Conversion: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.Variant<'Conversion', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.Conversion(value),
          }),
          NotFound: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'NotFound'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Query.NotFound }),
          CursorMismatch: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Query.CursorMismatch }),
          CursorDone: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Query.CursorDone }),
          FetchSizeTooBig: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Query.FetchSizeTooBig }),
          InvalidSingularParameters: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>>
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query.InvalidSingularParameters,
          }),
          CapacityLimit: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Query.CapacityLimit }),
        },
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>>>
        > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Conversion(value) }),
        Find: {
          Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Find.Asset(value) }),
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.AssetDefinition(value),
          }),
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Account', T>>>>
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Account(value),
          }),
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>>>
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Domain(value),
          }),
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.MetadataKey(value),
          }),
          Block: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Block', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Find.Block(value) }),
          Transaction: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Transaction(value),
          }),
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Find.Peer(value) }),
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>>>
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Trigger(value),
          }),
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Role', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Find.Role(value) }),
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.Permission(value),
          }),
          PublicKey: <const T extends lib.PublicKeyWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find.PublicKey(value),
          }),
        },
        Repetition: <const T extends RepetitionError>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>>>
        > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Repetition(value) }),
        Mintability: {
          MintUnmintable: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>>
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Mintability.MintUnmintable,
          }),
          ForbidMintOnMintable: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>>
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Mintability.ForbidMintOnMintable,
          }),
        },
        Math: {
          Overflow: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Overflow'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Math.Overflow }),
          NotEnoughQuantity: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>>
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.NotEnoughQuantity,
          }),
          DivideByZero: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Math.DivideByZero }),
          NegativeValue: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Math.NegativeValue }),
          DomainViolation: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Math.DomainViolation }),
          Unknown: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.VariantUnit<'Unknown'>>>
              >
            >
          >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InstructionFailed.Math.Unknown }),
          FixedPointConversion: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math.FixedPointConversion(value),
          }),
        },
        InvalidParameter: {
          Wasm: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'InstructionFailed', lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.Wasm(value),
          }),
          TimeTriggerInThePast: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'InvalidParameter', lib.VariantUnit<'TimeTriggerInThePast'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.TimeTriggerInThePast,
          }),
        },
        InvariantViolation: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.Variant<'InstructionFailed', lib.Variant<'InvariantViolation', T>>>
        > => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed.InvariantViolation(value),
        }),
      },
      QueryFailed: {
        Find: {
          Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Asset', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Asset(value) }),
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>>
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.AssetDefinition(value),
          }),
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Account', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Account(value) }),
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Domain', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Domain(value) }),
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'MetadataKey', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.MetadataKey(value) }),
          Block: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Block', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Block(value) }),
          Transaction: <const T extends lib.HashWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Transaction', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Transaction(value) }),
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Peer', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Peer(value) }),
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Trigger', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Trigger(value) }),
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Role', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Role(value) }),
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'Permission', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.Permission(value) }),
          PublicKey: <const T extends lib.PublicKeyWrap>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>>
          > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Find.PublicKey(value) }),
        },
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>>>
        > => ({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.Conversion(value) }),
        NotFound: Object.freeze<
          lib.Variant<'Rejected', lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>>>
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.NotFound }),
        CursorMismatch: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>>
          >
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.CursorMismatch }),
        CursorDone: Object.freeze<
          lib.Variant<'Rejected', lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>>>
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.CursorDone }),
        FetchSizeTooBig: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>>
          >
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.FetchSizeTooBig }),
        InvalidSingularParameters: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'InvalidSingularParameters'>>>
          >
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.InvalidSingularParameters }),
        CapacityLimit: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<'Validation', lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>>
          >
        >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.QueryFailed.CapacityLimit }),
      },
      TooComplex: Object.freeze<lib.Variant<'Rejected', lib.Variant<'Validation', lib.VariantUnit<'TooComplex'>>>>({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.TooComplex,
      }),
      InternalError: Object.freeze<
        lib.Variant<'Rejected', lib.Variant<'Validation', lib.VariantUnit<'InternalError'>>>
      >({ kind: 'Rejected', value: TransactionRejectionReason.Validation.InternalError }),
    },
    InstructionExecution: <const T extends InstructionExecutionFail>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'InstructionExecution', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.InstructionExecution(value),
    }),
    WasmExecution: <const T extends WasmExecutionFail>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'WasmExecution', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.WasmExecution(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Queued: []; Expired: []; Approved: []; Rejected: [TransactionRejectionReason] }>([
      [0, 'Queued'],
      [1, 'Expired'],
      [2, 'Approved'],
      [3, 'Rejected', TransactionRejectionReason[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TransactionEventFilter {
  hash: lib.Option<lib.HashWrap>
  blockHeight: lib.Option<lib.Option<lib.NonZero<lib.U64>>>
  status: lib.Option<TransactionStatus>
}
export const TransactionEventFilter: lib.CodecProvider<TransactionEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionEventFilter>(['hash', 'blockHeight', 'status'], {
    hash: lib.Option.with(lib.HashWrap[lib.CodecSymbol])[lib.CodecSymbol],
    blockHeight: lib.Option.with(
      lib.Option.with(lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
    )[lib.CodecSymbol],
    status: lib.Option.with(TransactionStatus[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type BlockRejectionReason = lib.VariantUnit<'ConsensusBlockRejection'>
export const BlockRejectionReason = {
  ConsensusBlockRejection: Object.freeze<lib.VariantUnit<'ConsensusBlockRejection'>>({
    kind: 'ConsensusBlockRejection',
  }),
  [lib.CodecSymbol]: lib.enumCodec<{ ConsensusBlockRejection: [] }>([[0, 'ConsensusBlockRejection']]).discriminated(),
}

export type BlockStatus =
  | lib.VariantUnit<'Created'>
  | lib.VariantUnit<'Approved'>
  | lib.Variant<'Rejected', BlockRejectionReason>
  | lib.VariantUnit<'Committed'>
  | lib.VariantUnit<'Applied'>
export const BlockStatus = {
  Created: Object.freeze<lib.VariantUnit<'Created'>>({ kind: 'Created' }),
  Approved: Object.freeze<lib.VariantUnit<'Approved'>>({ kind: 'Approved' }),
  Rejected: {
    ConsensusBlockRejection: Object.freeze<lib.Variant<'Rejected', lib.VariantUnit<'ConsensusBlockRejection'>>>({
      kind: 'Rejected',
      value: BlockRejectionReason.ConsensusBlockRejection,
    }),
  },
  Committed: Object.freeze<lib.VariantUnit<'Committed'>>({ kind: 'Committed' }),
  Applied: Object.freeze<lib.VariantUnit<'Applied'>>({ kind: 'Applied' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Created: []; Approved: []; Rejected: [BlockRejectionReason]; Committed: []; Applied: [] }>([
      [0, 'Created'],
      [1, 'Approved'],
      [2, 'Rejected', BlockRejectionReason[lib.CodecSymbol]],
      [3, 'Committed'],
      [4, 'Applied'],
    ])
    .discriminated(),
}

export interface BlockEventFilter {
  height: lib.Option<lib.NonZero<lib.U64>>
  status: lib.Option<BlockStatus>
}
export const BlockEventFilter: lib.CodecProvider<BlockEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<BlockEventFilter>(['height', 'status'], {
    height: lib.Option.with(lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
    status: lib.Option.with(BlockStatus[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type PipelineEventFilterBox =
  | lib.Variant<'Transaction', TransactionEventFilter>
  | lib.Variant<'Block', BlockEventFilter>
export const PipelineEventFilterBox = {
  Transaction: <const T extends TransactionEventFilter>(value: T): lib.Variant<'Transaction', T> => ({
    kind: 'Transaction',
    value,
  }),
  Block: <const T extends BlockEventFilter>(value: T): lib.Variant<'Block', T> => ({ kind: 'Block', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Transaction: [TransactionEventFilter]; Block: [BlockEventFilter] }>([
      [0, 'Transaction', TransactionEventFilter[lib.CodecSymbol]],
      [1, 'Block', BlockEventFilter[lib.CodecSymbol]],
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
    idMatcher: lib.Option.with(PeerId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: PeerEventSet[lib.CodecSymbol],
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
    idMatcher: lib.Option.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: DomainEventSet[lib.CodecSymbol],
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
    idMatcher: lib.Option.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: AssetEventSet[lib.CodecSymbol],
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
    idMatcher: lib.Option.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: AssetDefinitionEventSet[lib.CodecSymbol],
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
    idMatcher: lib.Option.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: TriggerEventSet[lib.CodecSymbol],
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
    idMatcher: lib.Option.with(RoleId[lib.CodecSymbol])[lib.CodecSymbol],
    eventSet: RoleEventSet[lib.CodecSymbol],
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
    eventSet: ConfigurationEventSet[lib.CodecSymbol],
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
  [lib.CodecSymbol]: lib.structCodec<ExecutorEventFilter>(['eventSet'], {
    eventSet: ExecutorEventSet[lib.CodecSymbol],
  }),
}

export type DataEventFilter =
  | lib.VariantUnit<'Any'>
  | lib.Variant<'Peer', PeerEventFilter>
  | lib.Variant<'Domain', DomainEventFilter>
  | lib.Variant<'Account', AccountEventFilter>
  | lib.Variant<'Asset', AssetEventFilter>
  | lib.Variant<'AssetDefinition', AssetDefinitionEventFilter>
  | lib.Variant<'Trigger', TriggerEventFilter>
  | lib.Variant<'Role', RoleEventFilter>
  | lib.Variant<'Configuration', ConfigurationEventFilter>
  | lib.Variant<'Executor', ExecutorEventFilter>
export const DataEventFilter = {
  Any: Object.freeze<lib.VariantUnit<'Any'>>({ kind: 'Any' }),
  Peer: <const T extends PeerEventFilter>(value: T): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }),
  Domain: <const T extends DomainEventFilter>(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  Account: <const T extends AccountEventFilter>(value: T): lib.Variant<'Account', T> => ({ kind: 'Account', value }),
  Asset: <const T extends AssetEventFilter>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  AssetDefinition: <const T extends AssetDefinitionEventFilter>(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }),
  Trigger: <const T extends TriggerEventFilter>(value: T): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  Role: <const T extends RoleEventFilter>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  Configuration: <const T extends ConfigurationEventFilter>(value: T): lib.Variant<'Configuration', T> => ({
    kind: 'Configuration',
    value,
  }),
  Executor: <const T extends ExecutorEventFilter>(value: T): lib.Variant<'Executor', T> => ({
    kind: 'Executor',
    value,
  }),
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
      [1, 'Peer', PeerEventFilter[lib.CodecSymbol]],
      [2, 'Domain', DomainEventFilter[lib.CodecSymbol]],
      [3, 'Account', AccountEventFilter[lib.CodecSymbol]],
      [4, 'Asset', AssetEventFilter[lib.CodecSymbol]],
      [5, 'AssetDefinition', AssetDefinitionEventFilter[lib.CodecSymbol]],
      [6, 'Trigger', TriggerEventFilter[lib.CodecSymbol]],
      [7, 'Role', RoleEventFilter[lib.CodecSymbol]],
      [8, 'Configuration', ConfigurationEventFilter[lib.CodecSymbol]],
      [9, 'Executor', ExecutorEventFilter[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Schedule {
  start: lib.Timestamp
  period: lib.Option<lib.Duration>
}
export const Schedule: lib.CodecProvider<Schedule> = {
  [lib.CodecSymbol]: lib.structCodec<Schedule>(['start', 'period'], {
    start: lib.Timestamp[lib.CodecSymbol],
    period: lib.Option.with(lib.Duration[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type ExecutionTime = lib.VariantUnit<'PreCommit'> | lib.Variant<'Schedule', Schedule>
export const ExecutionTime = {
  PreCommit: Object.freeze<lib.VariantUnit<'PreCommit'>>({ kind: 'PreCommit' }),
  Schedule: <const T extends Schedule>(value: T): lib.Variant<'Schedule', T> => ({ kind: 'Schedule', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ PreCommit: []; Schedule: [Schedule] }>([
      [0, 'PreCommit'],
      [1, 'Schedule', Schedule[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TimeEventFilter = ExecutionTime
export const TimeEventFilter = ExecutionTime

export interface ExecuteTriggerEventFilter {
  triggerId: lib.Option<TriggerId>
  authority: lib.Option<lib.AccountId>
}
export const ExecuteTriggerEventFilter: lib.CodecProvider<ExecuteTriggerEventFilter> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTriggerEventFilter>(['triggerId', 'authority'], {
    triggerId: lib.Option.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol],
    authority: lib.Option.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type TriggerCompletedOutcomeType = lib.VariantUnit<'Success'> | lib.VariantUnit<'Failure'>
export const TriggerCompletedOutcomeType = {
  Success: Object.freeze<lib.VariantUnit<'Success'>>({ kind: 'Success' }),
  Failure: Object.freeze<lib.VariantUnit<'Failure'>>({ kind: 'Failure' }),
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
    triggerId: lib.Option.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol],
    outcomeType: lib.Option.with(TriggerCompletedOutcomeType[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type EventFilterBox =
  | lib.Variant<'Pipeline', PipelineEventFilterBox>
  | lib.Variant<'Data', DataEventFilter>
  | lib.Variant<'Time', TimeEventFilter>
  | lib.Variant<'ExecuteTrigger', ExecuteTriggerEventFilter>
  | lib.Variant<'TriggerCompleted', TriggerCompletedEventFilter>
export const EventFilterBox = {
  Pipeline: {
    Transaction: <const T extends TransactionEventFilter>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Transaction', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Transaction(value),
    }),
    Block: <const T extends BlockEventFilter>(value: T): lib.Variant<'Pipeline', lib.Variant<'Block', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Block(value),
    }),
  },
  Data: {
    Any: Object.freeze<lib.Variant<'Data', lib.VariantUnit<'Any'>>>({ kind: 'Data', value: DataEventFilter.Any }),
    Peer: <const T extends PeerEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Peer', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Peer(value),
    }),
    Domain: <const T extends DomainEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Domain', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Domain(value),
    }),
    Account: <const T extends AccountEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Account', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Account(value),
    }),
    Asset: <const T extends AssetEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Asset', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Asset(value),
    }),
    AssetDefinition: <const T extends AssetDefinitionEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Data',
      value: DataEventFilter.AssetDefinition(value),
    }),
    Trigger: <const T extends TriggerEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Trigger', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Trigger(value),
    }),
    Role: <const T extends RoleEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Role', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Role(value),
    }),
    Configuration: <const T extends ConfigurationEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Configuration', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Configuration(value),
    }),
    Executor: <const T extends ExecutorEventFilter>(value: T): lib.Variant<'Data', lib.Variant<'Executor', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Executor(value),
    }),
  },
  Time: {
    PreCommit: Object.freeze<lib.Variant<'Time', lib.VariantUnit<'PreCommit'>>>({
      kind: 'Time',
      value: TimeEventFilter.PreCommit,
    }),
    Schedule: <const T extends Schedule>(value: T): lib.Variant<'Time', lib.Variant<'Schedule', T>> => ({
      kind: 'Time',
      value: TimeEventFilter.Schedule(value),
    }),
  },
  ExecuteTrigger: <const T extends ExecuteTriggerEventFilter>(value: T): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }),
  TriggerCompleted: <const T extends TriggerCompletedEventFilter>(value: T): lib.Variant<'TriggerCompleted', T> => ({
    kind: 'TriggerCompleted',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Pipeline: [PipelineEventFilterBox]
      Data: [DataEventFilter]
      Time: [TimeEventFilter]
      ExecuteTrigger: [ExecuteTriggerEventFilter]
      TriggerCompleted: [TriggerCompletedEventFilter]
    }>([
      [0, 'Pipeline', PipelineEventFilterBox[lib.CodecSymbol]],
      [1, 'Data', DataEventFilter[lib.CodecSymbol]],
      [2, 'Time', TimeEventFilter[lib.CodecSymbol]],
      [3, 'ExecuteTrigger', ExecuteTriggerEventFilter[lib.CodecSymbol]],
      [4, 'TriggerCompleted', TriggerCompletedEventFilter[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Action {
  executable: Executable
  repeats: Repeats
  authority: lib.AccountId
  filter: EventFilterBox
  metadata: Metadata
}
export const Action: lib.CodecProvider<Action> = {
  [lib.CodecSymbol]: lib.structCodec<Action>(['executable', 'repeats', 'authority', 'filter', 'metadata'], {
    executable: Executable[lib.CodecSymbol],
    repeats: Repeats[lib.CodecSymbol],
    authority: lib.AccountId[lib.CodecSymbol],
    filter: EventFilterBox[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
  }),
}

export type ActionPredicateAtom = never
export const ActionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type ActionProjectionPredicate =
  | lib.Variant<'Atom', ActionPredicateAtom>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
export const ActionProjectionPredicate = {
  Atom: {},
  Metadata: {
    Atom: {},
    Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [ActionPredicateAtom]; Metadata: [MetadataProjectionPredicate] }>([
      [0, 'Atom', ActionPredicateAtom[lib.CodecSymbol]],
      [1, 'Metadata', MetadataProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type ActionProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Metadata', MetadataProjectionSelector>
export const ActionProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Metadata: {
    Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Metadata', MetadataProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type Mintable = lib.VariantUnit<'Infinitely'> | lib.VariantUnit<'Once'> | lib.VariantUnit<'Not'>
export const Mintable = {
  Infinitely: Object.freeze<lib.VariantUnit<'Infinitely'>>({ kind: 'Infinitely' }),
  Once: Object.freeze<lib.VariantUnit<'Once'>>({ kind: 'Once' }),
  Not: Object.freeze<lib.VariantUnit<'Not'>>({ kind: 'Not' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Infinitely: []; Once: []; Not: [] }>([
      [0, 'Infinitely'],
      [1, 'Once'],
      [2, 'Not'],
    ])
    .discriminated(),
}

export type IpfsPath = lib.String
export const IpfsPath = lib.String

export interface AssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<IpfsPath>
  metadata: Metadata
  ownedBy: lib.AccountId
  totalQuantity: Numeric
}
export const AssetDefinition: lib.CodecProvider<AssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinition>(
    ['id', 'type', 'mintable', 'logo', 'metadata', 'ownedBy', 'totalQuantity'],
    {
      id: lib.AssetDefinitionId[lib.CodecSymbol],
      type: AssetType[lib.CodecSymbol],
      mintable: Mintable[lib.CodecSymbol],
      logo: lib.Option.with(IpfsPath[lib.CodecSymbol])[lib.CodecSymbol],
      metadata: Metadata[lib.CodecSymbol],
      ownedBy: lib.AccountId[lib.CodecSymbol],
      totalQuantity: Numeric[lib.CodecSymbol],
    },
  ),
}

export interface AssetDefinitionTotalQuantityChanged {
  assetDefinition: lib.AssetDefinitionId
  totalAmount: Numeric
}
export const AssetDefinitionTotalQuantityChanged: lib.CodecProvider<AssetDefinitionTotalQuantityChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinitionTotalQuantityChanged>(['assetDefinition', 'totalAmount'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
    totalAmount: Numeric[lib.CodecSymbol],
  }),
}

export interface AssetDefinitionOwnerChanged {
  assetDefinition: lib.AssetDefinitionId
  newOwner: lib.AccountId
}
export const AssetDefinitionOwnerChanged: lib.CodecProvider<AssetDefinitionOwnerChanged> = {
  [lib.CodecSymbol]: lib.structCodec<AssetDefinitionOwnerChanged>(['assetDefinition', 'newOwner'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
    newOwner: lib.AccountId[lib.CodecSymbol],
  }),
}

export type AssetDefinitionEvent =
  | lib.Variant<'Created', AssetDefinition>
  | lib.Variant<'Deleted', lib.AssetDefinitionId>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.AssetDefinitionId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.AssetDefinitionId>>
  | lib.Variant<'MintabilityChanged', lib.AssetDefinitionId>
  | lib.Variant<'TotalQuantityChanged', AssetDefinitionTotalQuantityChanged>
  | lib.Variant<'OwnerChanged', AssetDefinitionOwnerChanged>
export const AssetDefinitionEvent = {
  Created: <const T extends AssetDefinition>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({ kind: 'MetadataInserted', value }),
  MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({ kind: 'MetadataRemoved', value }),
  MintabilityChanged: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'MintabilityChanged', T> => ({
    kind: 'MintabilityChanged',
    value,
  }),
  TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
    value: T,
  ): lib.Variant<'TotalQuantityChanged', T> => ({ kind: 'TotalQuantityChanged', value }),
  OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(value: T): lib.Variant<'OwnerChanged', T> => ({
    kind: 'OwnerChanged',
    value,
  }),
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
      [0, 'Created', AssetDefinition[lib.CodecSymbol]],
      [1, 'Deleted', lib.AssetDefinitionId[lib.CodecSymbol]],
      [2, 'MetadataInserted', MetadataChanged.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol]],
      [3, 'MetadataRemoved', MetadataChanged.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol]],
      [4, 'MintabilityChanged', lib.AssetDefinitionId[lib.CodecSymbol]],
      [5, 'TotalQuantityChanged', AssetDefinitionTotalQuantityChanged[lib.CodecSymbol]],
      [6, 'OwnerChanged', AssetDefinitionOwnerChanged[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetDefinitionIdPredicateAtom = lib.Variant<'Equals', lib.AssetDefinitionId>
export const AssetDefinitionIdPredicateAtom = {
  Equals: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AssetDefinitionId] }>([[0, 'Equals', lib.AssetDefinitionId[lib.CodecSymbol]]])
    .discriminated(),
}

export type AssetDefinitionIdProjectionPredicate =
  | lib.Variant<'Atom', AssetDefinitionIdPredicateAtom>
  | lib.Variant<'Domain', DomainIdProjectionPredicate>
  | lib.Variant<'Name', NameProjectionPredicate>
export const AssetDefinitionIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AssetDefinitionIdPredicateAtom.Equals(value),
    }),
  },
  Domain: {
    Atom: {
      Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Name: {
    Atom: {
      Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>> => ({
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
      [0, 'Atom', AssetDefinitionIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Domain', DomainIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Name', NameProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetDefinitionIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Domain', DomainIdProjectionSelector>
  | lib.Variant<'Name', NameProjectionSelector>
export const AssetDefinitionIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Domain: {
    Atom: Object.freeze<lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>({
      kind: 'Domain',
      value: DomainIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Domain',
        value: DomainIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Name: {
    Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Domain: [DomainIdProjectionSelector]; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Domain', DomainIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Name', NameProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetDefinitionPredicateAtom = never
export const AssetDefinitionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type AssetDefinitionProjectionPredicate =
  | lib.Variant<'Atom', AssetDefinitionPredicateAtom>
  | lib.Variant<'Id', AssetDefinitionIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
export const AssetDefinitionProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Id', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Id', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Id', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.EndsWith(value) }),
        },
      },
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
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
      [0, 'Atom', AssetDefinitionPredicateAtom[lib.CodecSymbol]],
      [1, 'Id', AssetDefinitionIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetDefinitionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AssetDefinitionIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
export const AssetDefinitionProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AssetDefinitionIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>>({
          kind: 'Id',
          value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    },
    Name: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AssetDefinitionIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Metadata: {
    Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AssetDefinitionIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', AssetDefinitionIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetIdPredicateAtom = lib.Variant<'Equals', lib.AssetId>
export const AssetIdPredicateAtom = {
  Equals: <const T extends lib.AssetId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.AssetId] }>([[0, 'Equals', lib.AssetId[lib.CodecSymbol]]])
    .discriminated(),
}

export type AssetIdProjectionPredicate =
  | lib.Variant<'Atom', AssetIdPredicateAtom>
  | lib.Variant<'Account', AccountIdProjectionPredicate>
  | lib.Variant<'Definition', AssetDefinitionIdProjectionPredicate>
export const AssetIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.AssetId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AssetIdPredicateAtom.Equals(value),
    }),
  },
  Account: {
    Atom: {
      Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Account',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Account', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Account', value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Account', value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Account', value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Account', value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value) }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<'Account', lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  Definition: {
    Atom: {
      Equals: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Definition', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Definition', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Definition', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Definition', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Definition', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Definition', value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.EndsWith(value) }),
        },
      },
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
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
      [0, 'Atom', AssetIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Account', AccountIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Definition', AssetDefinitionIdProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Account', AccountIdProjectionSelector>
  | lib.Variant<'Definition', AssetDefinitionIdProjectionSelector>
export const AssetIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Account: {
    Atom: Object.freeze<lib.Variant<'Account', lib.VariantUnit<'Atom'>>>({
      kind: 'Account',
      value: AccountIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<lib.Variant<'Account', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>({
        kind: 'Account',
        value: AccountIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<
          lib.Variant<'Account', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Account', value: AccountIdProjectionSelector.Domain.Name.Atom }),
      },
    },
    Signatory: {
      Atom: Object.freeze<lib.Variant<'Account', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>>({
        kind: 'Account',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  Definition: {
    Atom: Object.freeze<lib.Variant<'Definition', lib.VariantUnit<'Atom'>>>({
      kind: 'Definition',
      value: AssetDefinitionIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<lib.Variant<'Definition', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<
          lib.Variant<'Definition', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Definition', value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom }),
      },
    },
    Name: {
      Atom: Object.freeze<lib.Variant<'Definition', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Name.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Account: [AccountIdProjectionSelector]; Definition: [AssetDefinitionIdProjectionSelector] }>(
      [
        [0, 'Atom'],
        [1, 'Account', AccountIdProjectionSelector[lib.CodecSymbol]],
        [2, 'Definition', AssetDefinitionIdProjectionSelector[lib.CodecSymbol]],
      ],
    )
    .discriminated(),
}

export type AssetPredicateAtom = never
export const AssetPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type AssetValuePredicateAtom = lib.VariantUnit<'IsNumeric'> | lib.VariantUnit<'IsStore'>
export const AssetValuePredicateAtom = {
  IsNumeric: Object.freeze<lib.VariantUnit<'IsNumeric'>>({ kind: 'IsNumeric' }),
  IsStore: Object.freeze<lib.VariantUnit<'IsStore'>>({ kind: 'IsStore' }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ IsNumeric: []; IsStore: [] }>([
      [0, 'IsNumeric'],
      [1, 'IsStore'],
    ])
    .discriminated(),
}

export type NumericPredicateAtom = never
export const NumericPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type NumericProjectionPredicate = lib.Variant<'Atom', NumericPredicateAtom>
export const NumericProjectionPredicate = {
  Atom: {},
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [NumericPredicateAtom] }>([[0, 'Atom', NumericPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type AssetValueProjectionPredicate =
  | lib.Variant<'Atom', AssetValuePredicateAtom>
  | lib.Variant<'Numeric', NumericProjectionPredicate>
  | lib.Variant<'Store', MetadataProjectionPredicate>
export const AssetValueProjectionPredicate = {
  Atom: {
    IsNumeric: Object.freeze<lib.Variant<'Atom', lib.VariantUnit<'IsNumeric'>>>({
      kind: 'Atom',
      value: AssetValuePredicateAtom.IsNumeric,
    }),
    IsStore: Object.freeze<lib.Variant<'Atom', lib.VariantUnit<'IsStore'>>>({
      kind: 'Atom',
      value: AssetValuePredicateAtom.IsStore,
    }),
  },
  Numeric: { Atom: {} },
  Store: {
    Atom: {},
    Key: <const T extends MetadataKeyProjectionPredicate>(value: T): lib.Variant<'Store', lib.Variant<'Key', T>> => ({
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
      [0, 'Atom', AssetValuePredicateAtom[lib.CodecSymbol]],
      [1, 'Numeric', NumericProjectionPredicate[lib.CodecSymbol]],
      [2, 'Store', MetadataProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetProjectionPredicate =
  | lib.Variant<'Atom', AssetPredicateAtom>
  | lib.Variant<'Id', AssetIdProjectionPredicate>
  | lib.Variant<'Value', AssetValueProjectionPredicate>
export const AssetProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AssetIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Account: {
      Atom: {
        Equals: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Account', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Account.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Account', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Domain.Atom.Equals(value) }),
        },
        Name: {
          Atom: {
            Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.Equals(value) }),
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.Contains(value) }),
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.StartsWith(value) }),
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.EndsWith(value) }),
          },
        },
      },
      Signatory: {
        Atom: {
          Equals: <const T extends lib.PublicKeyWrap>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Account', lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Account.Signatory.Atom.Equals(value) }),
        },
      },
    },
    Definition: {
      Atom: {
        Equals: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Definition', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Definition.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Definition', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Domain.Atom.Equals(value) }),
        },
        Name: {
          Atom: {
            Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Equals(value) }),
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Contains(value) }),
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.StartsWith(value) }),
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
              >
            > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom.EndsWith(value) }),
          },
        },
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<'Definition', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Id', value: AssetIdProjectionPredicate.Definition.Name.Atom.EndsWith(value) }),
        },
      },
    },
  },
  Value: {
    Atom: {
      IsNumeric: Object.freeze<lib.Variant<'Value', lib.Variant<'Atom', lib.VariantUnit<'IsNumeric'>>>>({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Atom.IsNumeric,
      }),
      IsStore: Object.freeze<lib.Variant<'Value', lib.Variant<'Atom', lib.VariantUnit<'IsStore'>>>>({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Atom.IsStore,
      }),
    },
    Numeric: { Atom: {} },
    Store: {
      Atom: {},
      Key: <const T extends MetadataKeyProjectionPredicate>(
        value: T,
      ): lib.Variant<'Value', lib.Variant<'Store', lib.Variant<'Key', T>>> => ({
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
      [0, 'Atom', AssetPredicateAtom[lib.CodecSymbol]],
      [1, 'Id', AssetIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Value', AssetValueProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type NumericProjectionSelector = lib.VariantUnit<'Atom'>
export const NumericProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type AssetValueProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Numeric', NumericProjectionSelector>
  | lib.Variant<'Store', MetadataProjectionSelector>
export const AssetValueProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Numeric: {
    Atom: Object.freeze<lib.Variant<'Numeric', lib.VariantUnit<'Atom'>>>({
      kind: 'Numeric',
      value: NumericProjectionSelector.Atom,
    }),
  },
  Store: {
    Atom: Object.freeze<lib.Variant<'Store', lib.VariantUnit<'Atom'>>>({
      kind: 'Store',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Store', lib.Variant<'Key', T>> => ({
      kind: 'Store',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Numeric: [NumericProjectionSelector]; Store: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Numeric', NumericProjectionSelector[lib.CodecSymbol]],
      [2, 'Store', MetadataProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type AssetProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AssetIdProjectionSelector>
  | lib.Variant<'Value', AssetValueProjectionSelector>
export const AssetProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AssetIdProjectionSelector.Atom,
    }),
    Account: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Account', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AssetIdProjectionSelector.Account.Atom,
      }),
      Domain: {
        Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Account', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>>({
          kind: 'Id',
          value: AssetIdProjectionSelector.Account.Domain.Atom,
        }),
        Name: {
          Atom: Object.freeze<
            lib.Variant<
              'Id',
              lib.Variant<'Account', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
            >
          >({ kind: 'Id', value: AssetIdProjectionSelector.Account.Domain.Name.Atom }),
        },
      },
      Signatory: {
        Atom: Object.freeze<
          lib.Variant<'Id', lib.Variant<'Account', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Id', value: AssetIdProjectionSelector.Account.Signatory.Atom }),
      },
    },
    Definition: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Definition', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: AssetIdProjectionSelector.Definition.Atom,
      }),
      Domain: {
        Atom: Object.freeze<
          lib.Variant<'Id', lib.Variant<'Definition', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Id', value: AssetIdProjectionSelector.Definition.Domain.Atom }),
        Name: {
          Atom: Object.freeze<
            lib.Variant<
              'Id',
              lib.Variant<'Definition', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
            >
          >({ kind: 'Id', value: AssetIdProjectionSelector.Definition.Domain.Name.Atom }),
        },
      },
      Name: {
        Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Definition', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>>(
          { kind: 'Id', value: AssetIdProjectionSelector.Definition.Name.Atom },
        ),
      },
    },
  },
  Value: {
    Atom: Object.freeze<lib.Variant<'Value', lib.VariantUnit<'Atom'>>>({
      kind: 'Value',
      value: AssetValueProjectionSelector.Atom,
    }),
    Numeric: {
      Atom: Object.freeze<lib.Variant<'Value', lib.Variant<'Numeric', lib.VariantUnit<'Atom'>>>>({
        kind: 'Value',
        value: AssetValueProjectionSelector.Numeric.Atom,
      }),
    },
    Store: {
      Atom: Object.freeze<lib.Variant<'Value', lib.Variant<'Store', lib.VariantUnit<'Atom'>>>>({
        kind: 'Value',
        value: AssetValueProjectionSelector.Store.Atom,
      }),
      Key: <const T extends MetadataKeyProjectionSelector>(
        value: T,
      ): lib.Variant<'Value', lib.Variant<'Store', lib.Variant<'Key', T>>> => ({
        kind: 'Value',
        value: AssetValueProjectionSelector.Store.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [AssetIdProjectionSelector]; Value: [AssetValueProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', AssetIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Value', AssetValueProjectionSelector[lib.CodecSymbol]],
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
  | lib.Variant<'Numeric', Transfer<lib.AssetId, Numeric, lib.AccountId>>
  | lib.Variant<'Store', Transfer<lib.AssetId, Metadata, lib.AccountId>>
export const AssetTransferBox = {
  Numeric: <const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>>(value: T): lib.Variant<'Numeric', T> => ({
    kind: 'Numeric',
    value,
  }),
  Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(value: T): lib.Variant<'Store', T> => ({
    kind: 'Store',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Numeric: [Transfer<lib.AssetId, Numeric, lib.AccountId>]
      Store: [Transfer<lib.AssetId, Metadata, lib.AccountId>]
    }>([
      [
        0,
        'Numeric',
        Transfer.with(lib.AssetId[lib.CodecSymbol], Numeric[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[
          lib.CodecSymbol
        ],
      ],
      [
        1,
        'Store',
        Transfer.with(lib.AssetId[lib.CodecSymbol], Metadata[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[
          lib.CodecSymbol
        ],
      ],
    ])
    .discriminated(),
}

export interface BlockHeader {
  height: lib.NonZero<lib.U64>
  prevBlockHash: lib.Option<lib.HashWrap>
  transactionsHash: lib.HashWrap
  creationTime: lib.Timestamp
  viewChangeIndex: lib.U32
}
export const BlockHeader: lib.CodecProvider<BlockHeader> = {
  [lib.CodecSymbol]: lib.structCodec<BlockHeader>(
    ['height', 'prevBlockHash', 'transactionsHash', 'creationTime', 'viewChangeIndex'],
    {
      height: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
      prevBlockHash: lib.Option.with(lib.HashWrap[lib.CodecSymbol])[lib.CodecSymbol],
      transactionsHash: lib.HashWrap[lib.CodecSymbol],
      creationTime: lib.Timestamp[lib.CodecSymbol],
      viewChangeIndex: lib.U32[lib.CodecSymbol],
    },
  ),
}

export interface BlockEvent {
  header: BlockHeader
  status: BlockStatus
}
export const BlockEvent: lib.CodecProvider<BlockEvent> = {
  [lib.CodecSymbol]: lib.structCodec<BlockEvent>(['header', 'status'], {
    header: BlockHeader[lib.CodecSymbol],
    status: BlockStatus[lib.CodecSymbol],
  }),
}

export type BlockHeaderHashPredicateAtom = lib.Variant<'Equals', lib.HashWrap>
export const BlockHeaderHashPredicateAtom = {
  Equals: <const T extends lib.HashWrap>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.HashWrap] }>([[0, 'Equals', lib.HashWrap[lib.CodecSymbol]]])
    .discriminated(),
}

export type BlockHeaderHashProjectionPredicate = lib.Variant<'Atom', BlockHeaderHashPredicateAtom>
export const BlockHeaderHashProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.HashWrap>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: BlockHeaderHashPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [BlockHeaderHashPredicateAtom] }>([[0, 'Atom', BlockHeaderHashPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type BlockHeaderHashProjectionSelector = lib.VariantUnit<'Atom'>
export const BlockHeaderHashProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type BlockHeaderPredicateAtom = never
export const BlockHeaderPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type BlockHeaderProjectionPredicate =
  | lib.Variant<'Atom', BlockHeaderPredicateAtom>
  | lib.Variant<'Hash', BlockHeaderHashProjectionPredicate>
export const BlockHeaderProjectionPredicate = {
  Atom: {},
  Hash: {
    Atom: {
      Equals: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Hash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [BlockHeaderPredicateAtom]; Hash: [BlockHeaderHashProjectionPredicate] }>([
      [0, 'Atom', BlockHeaderPredicateAtom[lib.CodecSymbol]],
      [1, 'Hash', BlockHeaderHashProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type BlockHeaderProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Hash', BlockHeaderHashProjectionSelector>
export const BlockHeaderProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Hash: {
    Atom: Object.freeze<lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>({
      kind: 'Hash',
      value: BlockHeaderHashProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Hash: [BlockHeaderHashProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Hash', BlockHeaderHashProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface BlockSignature {
  peerTopologyIndex: lib.U64
  signature: lib.SignatureWrap
}
export const BlockSignature: lib.CodecProvider<BlockSignature> = {
  [lib.CodecSymbol]: lib.structCodec<BlockSignature>(['peerTopologyIndex', 'signature'], {
    peerTopologyIndex: lib.U64[lib.CodecSymbol],
    signature: lib.SignatureWrap[lib.CodecSymbol],
  }),
}

export type ChainId = lib.String
export const ChainId = lib.String

export interface TransactionPayload {
  chain: ChainId
  authority: lib.AccountId
  creationTime: lib.Timestamp
  instructions: Executable
  timeToLive: lib.Option<lib.NonZero<lib.Duration>>
  nonce: lib.Option<lib.NonZero<lib.U32>>
  metadata: Metadata
}
export const TransactionPayload: lib.CodecProvider<TransactionPayload> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionPayload>(
    ['chain', 'authority', 'creationTime', 'instructions', 'timeToLive', 'nonce', 'metadata'],
    {
      chain: ChainId[lib.CodecSymbol],
      authority: lib.AccountId[lib.CodecSymbol],
      creationTime: lib.Timestamp[lib.CodecSymbol],
      instructions: Executable[lib.CodecSymbol],
      timeToLive: lib.Option.with(lib.NonZero.with(lib.Duration[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
      nonce: lib.Option.with(lib.NonZero.with(lib.U32[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
      metadata: Metadata[lib.CodecSymbol],
    },
  ),
}

export interface SignedTransactionV1 {
  signature: lib.SignatureWrap
  payload: TransactionPayload
}
export const SignedTransactionV1: lib.CodecProvider<SignedTransactionV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedTransactionV1>(['signature', 'payload'], {
    signature: lib.SignatureWrap[lib.CodecSymbol],
    payload: TransactionPayload[lib.CodecSymbol],
  }),
}

export type SignedTransaction = lib.Variant<'V1', SignedTransactionV1>
export const SignedTransaction = {
  V1: <const T extends SignedTransactionV1>(value: T): lib.Variant<'V1', T> => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ V1: [SignedTransactionV1] }>([[1, 'V1', SignedTransactionV1[lib.CodecSymbol]]])
    .discriminated(),
}

export interface BlockPayload {
  header: BlockHeader
  transactions: lib.Vec<SignedTransaction>
}
export const BlockPayload: lib.CodecProvider<BlockPayload> = {
  [lib.CodecSymbol]: lib.structCodec<BlockPayload>(['header', 'transactions'], {
    header: BlockHeader[lib.CodecSymbol],
    transactions: lib.Vec.with(SignedTransaction[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface SignedBlockV1 {
  signatures: lib.Vec<BlockSignature>
  payload: BlockPayload
  errors: lib.Map<lib.U64, TransactionRejectionReason>
}
export const SignedBlockV1: lib.CodecProvider<SignedBlockV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedBlockV1>(['signatures', 'payload', 'errors'], {
    signatures: lib.Vec.with(BlockSignature[lib.CodecSymbol])[lib.CodecSymbol],
    payload: BlockPayload[lib.CodecSymbol],
    errors: lib.Map.with(lib.U64[lib.CodecSymbol], TransactionRejectionReason[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type SignedBlock = lib.Variant<'V1', SignedBlockV1>
export const SignedBlock = {
  V1: <const T extends SignedBlockV1>(value: T): lib.Variant<'V1', T> => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ V1: [SignedBlockV1] }>([[1, 'V1', SignedBlockV1[lib.CodecSymbol]]])
    .discriminated(),
}

export type BlockMessage = SignedBlock
export const BlockMessage = SignedBlock

export type BlockParameter = lib.Variant<'MaxTransactions', lib.NonZero<lib.U64>>
export const BlockParameter = {
  MaxTransactions: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'MaxTransactions', T> => ({
    kind: 'MaxTransactions',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      MaxTransactions: [lib.NonZero<lib.U64>]
    }>([[0, 'MaxTransactions', lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol]]])
    .discriminated(),
}

export interface BlockParameters {
  maxTransactions: lib.NonZero<lib.U64>
}
export const BlockParameters: lib.CodecProvider<BlockParameters> = {
  [lib.CodecSymbol]: lib.structCodec<BlockParameters>(['maxTransactions'], {
    maxTransactions: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface BlockSubscriptionRequest {
  fromBlockHeight: lib.NonZero<lib.U64>
}
export const BlockSubscriptionRequest: lib.CodecProvider<BlockSubscriptionRequest> = {
  [lib.CodecSymbol]: lib.structCodec<BlockSubscriptionRequest>(['fromBlockHeight'], {
    fromBlockHeight: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
  }),
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
  | lib.Variant<'Asset', Burn<Numeric, lib.AssetId>>
  | lib.Variant<'TriggerRepetitions', Burn<lib.U32, TriggerId>>
export const BurnBox = {
  Asset: <const T extends Burn<Numeric, lib.AssetId>>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  TriggerRepetitions: <const T extends Burn<lib.U32, TriggerId>>(value: T): lib.Variant<'TriggerRepetitions', T> => ({
    kind: 'TriggerRepetitions',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Asset: [Burn<Numeric, lib.AssetId>]; TriggerRepetitions: [Burn<lib.U32, TriggerId>] }>([
      [0, 'Asset', Burn.with(Numeric[lib.CodecSymbol], lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'TriggerRepetitions', Burn.with(lib.U32[lib.CodecSymbol], TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface CanBurnAsset {
  asset: lib.AssetId
}
export const CanBurnAsset: lib.CodecProvider<CanBurnAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanBurnAsset>(['asset'], { asset: lib.AssetId[lib.CodecSymbol] }),
}

export interface CanBurnAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanBurnAssetWithDefinition: lib.CodecProvider<CanBurnAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanBurnAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanExecuteTrigger {
  trigger: TriggerId
}
export const CanExecuteTrigger: lib.CodecProvider<CanExecuteTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanExecuteTrigger>(['trigger'], { trigger: TriggerId[lib.CodecSymbol] }),
}

export interface CanMintAsset {
  asset: lib.AssetId
}
export const CanMintAsset: lib.CodecProvider<CanMintAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanMintAsset>(['asset'], { asset: lib.AssetId[lib.CodecSymbol] }),
}

export interface CanMintAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanMintAssetWithDefinition: lib.CodecProvider<CanMintAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanMintAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanModifyAccountMetadata {
  account: lib.AccountId
}
export const CanModifyAccountMetadata: lib.CodecProvider<CanModifyAccountMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAccountMetadata>(['account'], {
    account: lib.AccountId[lib.CodecSymbol],
  }),
}

export interface CanModifyAssetDefinitionMetadata {
  assetDefinition: lib.AssetDefinitionId
}
export const CanModifyAssetDefinitionMetadata: lib.CodecProvider<CanModifyAssetDefinitionMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAssetDefinitionMetadata>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanModifyAssetMetadata {
  asset: lib.AssetId
}
export const CanModifyAssetMetadata: lib.CodecProvider<CanModifyAssetMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyAssetMetadata>(['asset'], { asset: lib.AssetId[lib.CodecSymbol] }),
}

export interface CanModifyDomainMetadata {
  domain: lib.DomainId
}
export const CanModifyDomainMetadata: lib.CodecProvider<CanModifyDomainMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyDomainMetadata>(['domain'], { domain: lib.DomainId[lib.CodecSymbol] }),
}

export interface CanModifyTrigger {
  trigger: TriggerId
}
export const CanModifyTrigger: lib.CodecProvider<CanModifyTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyTrigger>(['trigger'], { trigger: TriggerId[lib.CodecSymbol] }),
}

export interface CanModifyTriggerMetadata {
  trigger: TriggerId
}
export const CanModifyTriggerMetadata: lib.CodecProvider<CanModifyTriggerMetadata> = {
  [lib.CodecSymbol]: lib.structCodec<CanModifyTriggerMetadata>(['trigger'], { trigger: TriggerId[lib.CodecSymbol] }),
}

export interface CanRegisterAccount {
  domain: lib.DomainId
}
export const CanRegisterAccount: lib.CodecProvider<CanRegisterAccount> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAccount>(['domain'], { domain: lib.DomainId[lib.CodecSymbol] }),
}

export interface CanRegisterAsset {
  owner: lib.AccountId
}
export const CanRegisterAsset: lib.CodecProvider<CanRegisterAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAsset>(['owner'], { owner: lib.AccountId[lib.CodecSymbol] }),
}

export interface CanRegisterAssetDefinition {
  domain: lib.DomainId
}
export const CanRegisterAssetDefinition: lib.CodecProvider<CanRegisterAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAssetDefinition>(['domain'], { domain: lib.DomainId[lib.CodecSymbol] }),
}

export interface CanRegisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanRegisterAssetWithDefinition: lib.CodecProvider<CanRegisterAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanRegisterTrigger {
  authority: lib.AccountId
}
export const CanRegisterTrigger: lib.CodecProvider<CanRegisterTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanRegisterTrigger>(['authority'], { authority: lib.AccountId[lib.CodecSymbol] }),
}

export interface CanTransferAsset {
  asset: lib.AssetId
}
export const CanTransferAsset: lib.CodecProvider<CanTransferAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanTransferAsset>(['asset'], { asset: lib.AssetId[lib.CodecSymbol] }),
}

export interface CanTransferAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanTransferAssetWithDefinition: lib.CodecProvider<CanTransferAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanTransferAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanUnregisterAccount {
  account: lib.AccountId
}
export const CanUnregisterAccount: lib.CodecProvider<CanUnregisterAccount> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAccount>(['account'], { account: lib.AccountId[lib.CodecSymbol] }),
}

export interface CanUnregisterAsset {
  asset: lib.AssetId
}
export const CanUnregisterAsset: lib.CodecProvider<CanUnregisterAsset> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAsset>(['asset'], { asset: lib.AssetId[lib.CodecSymbol] }),
}

export interface CanUnregisterAssetDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanUnregisterAssetDefinition: lib.CodecProvider<CanUnregisterAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAssetDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanUnregisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
export const CanUnregisterAssetWithDefinition: lib.CodecProvider<CanUnregisterAssetWithDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface CanUnregisterDomain {
  domain: lib.DomainId
}
export const CanUnregisterDomain: lib.CodecProvider<CanUnregisterDomain> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterDomain>(['domain'], { domain: lib.DomainId[lib.CodecSymbol] }),
}

export interface CanUnregisterTrigger {
  trigger: TriggerId
}
export const CanUnregisterTrigger: lib.CodecProvider<CanUnregisterTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<CanUnregisterTrigger>(['trigger'], { trigger: TriggerId[lib.CodecSymbol] }),
}

export interface CommittedTransaction {
  blockHash: lib.HashWrap
  value: SignedTransaction
  error: lib.Option<TransactionRejectionReason>
}
export const CommittedTransaction: lib.CodecProvider<CommittedTransaction> = {
  [lib.CodecSymbol]: lib.structCodec<CommittedTransaction>(['blockHash', 'value', 'error'], {
    blockHash: lib.HashWrap[lib.CodecSymbol],
    value: SignedTransaction[lib.CodecSymbol],
    error: lib.Option.with(TransactionRejectionReason[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type CommittedTransactionPredicateAtom = never
export const CommittedTransactionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type SignedTransactionPredicateAtom = never
export const SignedTransactionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type TransactionHashPredicateAtom = lib.Variant<'Equals', lib.HashWrap>
export const TransactionHashPredicateAtom = {
  Equals: <const T extends lib.HashWrap>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [lib.HashWrap] }>([[0, 'Equals', lib.HashWrap[lib.CodecSymbol]]])
    .discriminated(),
}

export type TransactionHashProjectionPredicate = lib.Variant<'Atom', TransactionHashPredicateAtom>
export const TransactionHashProjectionPredicate = {
  Atom: {
    Equals: <const T extends lib.HashWrap>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: TransactionHashPredicateAtom.Equals(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TransactionHashPredicateAtom] }>([[0, 'Atom', TransactionHashPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type SignedTransactionProjectionPredicate =
  | lib.Variant<'Atom', SignedTransactionPredicateAtom>
  | lib.Variant<'Hash', TransactionHashProjectionPredicate>
  | lib.Variant<'Authority', AccountIdProjectionPredicate>
export const SignedTransactionProjectionPredicate = {
  Atom: {},
  Hash: {
    Atom: {
      Equals: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Hash',
        value: TransactionHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  Authority: {
    Atom: {
      Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Authority', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Authority',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Domain: {
      Atom: {
        Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<'Authority', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Authority',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      },
      Name: {
        Atom: {
          Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Authority', value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value) }),
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
          > => ({ kind: 'Authority', value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(value) }),
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
          > => ({ kind: 'Authority', value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(value) }),
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
          > => ({ kind: 'Authority', value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(value) }),
        },
      },
    },
    Signatory: {
      Atom: {
        Equals: <const T extends lib.PublicKeyWrap>(
          value: T,
        ): lib.Variant<'Authority', lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
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
      [0, 'Atom', SignedTransactionPredicateAtom[lib.CodecSymbol]],
      [1, 'Hash', TransactionHashProjectionPredicate[lib.CodecSymbol]],
      [2, 'Authority', AccountIdProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransactionErrorPredicateAtom = lib.VariantUnit<'IsSome'>
export const TransactionErrorPredicateAtom = {
  IsSome: Object.freeze<lib.VariantUnit<'IsSome'>>({ kind: 'IsSome' }),
  [lib.CodecSymbol]: lib.enumCodec<{ IsSome: [] }>([[0, 'IsSome']]).discriminated(),
}

export type TransactionErrorProjectionPredicate = lib.Variant<'Atom', TransactionErrorPredicateAtom>
export const TransactionErrorProjectionPredicate = {
  Atom: {
    IsSome: Object.freeze<lib.Variant<'Atom', lib.VariantUnit<'IsSome'>>>({
      kind: 'Atom',
      value: TransactionErrorPredicateAtom.IsSome,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TransactionErrorPredicateAtom] }>([[0, 'Atom', TransactionErrorPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type CommittedTransactionProjectionPredicate =
  | lib.Variant<'Atom', CommittedTransactionPredicateAtom>
  | lib.Variant<'BlockHash', BlockHeaderHashProjectionPredicate>
  | lib.Variant<'Value', SignedTransactionProjectionPredicate>
  | lib.Variant<'Error', TransactionErrorProjectionPredicate>
export const CommittedTransactionProjectionPredicate = {
  Atom: {},
  BlockHash: {
    Atom: {
      Equals: <const T extends lib.HashWrap>(
        value: T,
      ): lib.Variant<'BlockHash', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'BlockHash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  Value: {
    Atom: {},
    Hash: {
      Atom: {
        Equals: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<'Value', lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    },
    Authority: {
      Atom: {
        Equals: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<'Value', lib.Variant<'Authority', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Authority.Atom.Equals(value),
        }),
      },
      Domain: {
        Atom: {
          Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Value',
            lib.Variant<'Authority', lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Value', value: SignedTransactionProjectionPredicate.Authority.Domain.Atom.Equals(value) }),
        },
        Name: {
          Atom: {
            Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Equals(value),
            }),
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>>
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Contains(value),
            }),
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>>
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.StartsWith(value),
            }),
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<'Domain', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>>
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.EndsWith(value),
            }),
          },
        },
      },
      Signatory: {
        Atom: {
          Equals: <const T extends lib.PublicKeyWrap>(
            value: T,
          ): lib.Variant<
            'Value',
            lib.Variant<'Authority', lib.Variant<'Signatory', lib.Variant<'Atom', lib.Variant<'Equals', T>>>>
          > => ({ kind: 'Value', value: SignedTransactionProjectionPredicate.Authority.Signatory.Atom.Equals(value) }),
        },
      },
    },
  },
  Error: {
    Atom: {
      IsSome: Object.freeze<lib.Variant<'Error', lib.Variant<'Atom', lib.VariantUnit<'IsSome'>>>>({
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
      [0, 'Atom', CommittedTransactionPredicateAtom[lib.CodecSymbol]],
      [1, 'BlockHash', BlockHeaderHashProjectionPredicate[lib.CodecSymbol]],
      [2, 'Value', SignedTransactionProjectionPredicate[lib.CodecSymbol]],
      [3, 'Error', TransactionErrorProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransactionHashProjectionSelector = lib.VariantUnit<'Atom'>
export const TransactionHashProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type SignedTransactionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Hash', TransactionHashProjectionSelector>
  | lib.Variant<'Authority', AccountIdProjectionSelector>
export const SignedTransactionProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Hash: {
    Atom: Object.freeze<lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>({
      kind: 'Hash',
      value: TransactionHashProjectionSelector.Atom,
    }),
  },
  Authority: {
    Atom: Object.freeze<lib.Variant<'Authority', lib.VariantUnit<'Atom'>>>({
      kind: 'Authority',
      value: AccountIdProjectionSelector.Atom,
    }),
    Domain: {
      Atom: Object.freeze<lib.Variant<'Authority', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Domain.Atom,
      }),
      Name: {
        Atom: Object.freeze<
          lib.Variant<'Authority', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Authority', value: AccountIdProjectionSelector.Domain.Name.Atom }),
      },
    },
    Signatory: {
      Atom: Object.freeze<lib.Variant<'Authority', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>>({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Hash: [TransactionHashProjectionSelector]; Authority: [AccountIdProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Hash', TransactionHashProjectionSelector[lib.CodecSymbol]],
      [2, 'Authority', AccountIdProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransactionErrorProjectionSelector = lib.VariantUnit<'Atom'>
export const TransactionErrorProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  [lib.CodecSymbol]: lib.enumCodec<{ Atom: [] }>([[0, 'Atom']]).discriminated(),
}

export type CommittedTransactionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'BlockHash', BlockHeaderHashProjectionSelector>
  | lib.Variant<'Value', SignedTransactionProjectionSelector>
  | lib.Variant<'Error', TransactionErrorProjectionSelector>
export const CommittedTransactionProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  BlockHash: {
    Atom: Object.freeze<lib.Variant<'BlockHash', lib.VariantUnit<'Atom'>>>({
      kind: 'BlockHash',
      value: BlockHeaderHashProjectionSelector.Atom,
    }),
  },
  Value: {
    Atom: Object.freeze<lib.Variant<'Value', lib.VariantUnit<'Atom'>>>({
      kind: 'Value',
      value: SignedTransactionProjectionSelector.Atom,
    }),
    Hash: {
      Atom: Object.freeze<lib.Variant<'Value', lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>>({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Hash.Atom,
      }),
    },
    Authority: {
      Atom: Object.freeze<lib.Variant<'Value', lib.Variant<'Authority', lib.VariantUnit<'Atom'>>>>({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Authority.Atom,
      }),
      Domain: {
        Atom: Object.freeze<
          lib.Variant<'Value', lib.Variant<'Authority', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Value', value: SignedTransactionProjectionSelector.Authority.Domain.Atom }),
        Name: {
          Atom: Object.freeze<
            lib.Variant<
              'Value',
              lib.Variant<'Authority', lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>
            >
          >({ kind: 'Value', value: SignedTransactionProjectionSelector.Authority.Domain.Name.Atom }),
        },
      },
      Signatory: {
        Atom: Object.freeze<
          lib.Variant<'Value', lib.Variant<'Authority', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>>
        >({ kind: 'Value', value: SignedTransactionProjectionSelector.Authority.Signatory.Atom }),
      },
    },
  },
  Error: {
    Atom: Object.freeze<lib.Variant<'Error', lib.VariantUnit<'Atom'>>>({
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
      [1, 'BlockHash', BlockHeaderHashProjectionSelector[lib.CodecSymbol]],
      [2, 'Value', SignedTransactionProjectionSelector[lib.CodecSymbol]],
      [3, 'Error', TransactionErrorProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type SumeragiParameter =
  | lib.Variant<'BlockTime', lib.Duration>
  | lib.Variant<'CommitTime', lib.Duration>
  | lib.Variant<'MaxClockDrift', lib.Duration>
export const SumeragiParameter = {
  BlockTime: <const T extends lib.Duration>(value: T): lib.Variant<'BlockTime', T> => ({ kind: 'BlockTime', value }),
  CommitTime: <const T extends lib.Duration>(value: T): lib.Variant<'CommitTime', T> => ({ kind: 'CommitTime', value }),
  MaxClockDrift: <const T extends lib.Duration>(value: T): lib.Variant<'MaxClockDrift', T> => ({
    kind: 'MaxClockDrift',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ BlockTime: [lib.Duration]; CommitTime: [lib.Duration]; MaxClockDrift: [lib.Duration] }>([
      [0, 'BlockTime', lib.Duration[lib.CodecSymbol]],
      [1, 'CommitTime', lib.Duration[lib.CodecSymbol]],
      [2, 'MaxClockDrift', lib.Duration[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransactionParameter =
  | lib.Variant<'MaxInstructions', lib.NonZero<lib.U64>>
  | lib.Variant<'SmartContractSize', lib.NonZero<lib.U64>>
export const TransactionParameter = {
  MaxInstructions: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'MaxInstructions', T> => ({
    kind: 'MaxInstructions',
    value,
  }),
  SmartContractSize: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'SmartContractSize', T> => ({
    kind: 'SmartContractSize',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ MaxInstructions: [lib.NonZero<lib.U64>]; SmartContractSize: [lib.NonZero<lib.U64>] }>([
      [0, 'MaxInstructions', lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'SmartContractSize', lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type SmartContractParameter =
  | lib.Variant<'Fuel', lib.NonZero<lib.U64>>
  | lib.Variant<'Memory', lib.NonZero<lib.U64>>
export const SmartContractParameter = {
  Fuel: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'Fuel', T> => ({ kind: 'Fuel', value }),
  Memory: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'Memory', T> => ({ kind: 'Memory', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Fuel: [lib.NonZero<lib.U64>]; Memory: [lib.NonZero<lib.U64>] }>([
      [0, 'Fuel', lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'Memory', lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface CustomParameter {
  id: CustomParameterId
  payload: lib.Json
}
export const CustomParameter: lib.CodecProvider<CustomParameter> = {
  [lib.CodecSymbol]: lib.structCodec<CustomParameter>(['id', 'payload'], {
    id: CustomParameterId[lib.CodecSymbol],
    payload: lib.Json[lib.CodecSymbol],
  }),
}

export type Parameter =
  | lib.Variant<'Sumeragi', SumeragiParameter>
  | lib.Variant<'Block', BlockParameter>
  | lib.Variant<'Transaction', TransactionParameter>
  | lib.Variant<'SmartContract', SmartContractParameter>
  | lib.Variant<'Executor', SmartContractParameter>
  | lib.Variant<'Custom', CustomParameter>
export const Parameter = {
  Sumeragi: {
    BlockTime: <const T extends lib.Duration>(value: T): lib.Variant<'Sumeragi', lib.Variant<'BlockTime', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.BlockTime(value),
    }),
    CommitTime: <const T extends lib.Duration>(value: T): lib.Variant<'Sumeragi', lib.Variant<'CommitTime', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.CommitTime(value),
    }),
    MaxClockDrift: <const T extends lib.Duration>(
      value: T,
    ): lib.Variant<'Sumeragi', lib.Variant<'MaxClockDrift', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.MaxClockDrift(value),
    }),
  },
  Block: {
    MaxTransactions: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Block', lib.Variant<'MaxTransactions', T>> => ({
      kind: 'Block',
      value: BlockParameter.MaxTransactions(value),
    }),
  },
  Transaction: {
    MaxInstructions: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Transaction', lib.Variant<'MaxInstructions', T>> => ({
      kind: 'Transaction',
      value: TransactionParameter.MaxInstructions(value),
    }),
    SmartContractSize: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Transaction', lib.Variant<'SmartContractSize', T>> => ({
      kind: 'Transaction',
      value: TransactionParameter.SmartContractSize(value),
    }),
  },
  SmartContract: {
    Fuel: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'SmartContract', lib.Variant<'Fuel', T>> => ({
      kind: 'SmartContract',
      value: SmartContractParameter.Fuel(value),
    }),
    Memory: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'SmartContract', lib.Variant<'Memory', T>> => ({
      kind: 'SmartContract',
      value: SmartContractParameter.Memory(value),
    }),
  },
  Executor: {
    Fuel: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'Executor', lib.Variant<'Fuel', T>> => ({
      kind: 'Executor',
      value: SmartContractParameter.Fuel(value),
    }),
    Memory: <const T extends lib.NonZero<lib.U64>>(value: T): lib.Variant<'Executor', lib.Variant<'Memory', T>> => ({
      kind: 'Executor',
      value: SmartContractParameter.Memory(value),
    }),
  },
  Custom: <const T extends CustomParameter>(value: T): lib.Variant<'Custom', T> => ({ kind: 'Custom', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Sumeragi: [SumeragiParameter]
      Block: [BlockParameter]
      Transaction: [TransactionParameter]
      SmartContract: [SmartContractParameter]
      Executor: [SmartContractParameter]
      Custom: [CustomParameter]
    }>([
      [0, 'Sumeragi', SumeragiParameter[lib.CodecSymbol]],
      [1, 'Block', BlockParameter[lib.CodecSymbol]],
      [2, 'Transaction', TransactionParameter[lib.CodecSymbol]],
      [3, 'SmartContract', SmartContractParameter[lib.CodecSymbol]],
      [4, 'Executor', SmartContractParameter[lib.CodecSymbol]],
      [5, 'Custom', CustomParameter[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface ParameterChanged {
  oldValue: Parameter
  newValue: Parameter
}
export const ParameterChanged: lib.CodecProvider<ParameterChanged> = {
  [lib.CodecSymbol]: lib.structCodec<ParameterChanged>(['oldValue', 'newValue'], {
    oldValue: Parameter[lib.CodecSymbol],
    newValue: Parameter[lib.CodecSymbol],
  }),
}

export type ConfigurationEvent = lib.Variant<'Changed', ParameterChanged>
export const ConfigurationEvent = {
  Changed: <const T extends ParameterChanged>(value: T): lib.Variant<'Changed', T> => ({ kind: 'Changed', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Changed: [ParameterChanged] }>([[0, 'Changed', ParameterChanged[lib.CodecSymbol]]])
    .discriminated(),
}

export interface CustomInstruction {
  payload: lib.Json
}
export const CustomInstruction: lib.CodecProvider<CustomInstruction> = {
  [lib.CodecSymbol]: lib.structCodec<CustomInstruction>(['payload'], { payload: lib.Json[lib.CodecSymbol] }),
}

export type PeerEvent = lib.Variant<'Added', PeerId> | lib.Variant<'Removed', PeerId>
export const PeerEvent = {
  Added: <const T extends PeerId>(value: T): lib.Variant<'Added', T> => ({ kind: 'Added', value }),
  Removed: <const T extends PeerId>(value: T): lib.Variant<'Removed', T> => ({ kind: 'Removed', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Added: [PeerId]; Removed: [PeerId] }>([
      [0, 'Added', PeerId[lib.CodecSymbol]],
      [1, 'Removed', PeerId[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Domain {
  id: lib.DomainId
  logo: lib.Option<IpfsPath>
  metadata: Metadata
  ownedBy: lib.AccountId
}
export const Domain: lib.CodecProvider<Domain> = {
  [lib.CodecSymbol]: lib.structCodec<Domain>(['id', 'logo', 'metadata', 'ownedBy'], {
    id: lib.DomainId[lib.CodecSymbol],
    logo: lib.Option.with(IpfsPath[lib.CodecSymbol])[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
    ownedBy: lib.AccountId[lib.CodecSymbol],
  }),
}

export interface DomainOwnerChanged {
  domain: lib.DomainId
  newOwner: lib.AccountId
}
export const DomainOwnerChanged: lib.CodecProvider<DomainOwnerChanged> = {
  [lib.CodecSymbol]: lib.structCodec<DomainOwnerChanged>(['domain', 'newOwner'], {
    domain: lib.DomainId[lib.CodecSymbol],
    newOwner: lib.AccountId[lib.CodecSymbol],
  }),
}

export type DomainEvent =
  | lib.Variant<'Created', Domain>
  | lib.Variant<'Deleted', lib.DomainId>
  | lib.Variant<'AssetDefinition', AssetDefinitionEvent>
  | lib.Variant<'Account', AccountEvent>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.DomainId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.DomainId>>
  | lib.Variant<'OwnerChanged', DomainOwnerChanged>
export const DomainEvent = {
  Created: <const T extends Domain>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends lib.DomainId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  AssetDefinition: {
    Created: <const T extends AssetDefinition>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'Created', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Created(value),
    }),
    Deleted: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Deleted(value),
    }),
    MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataInserted(value),
    }),
    MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataRemoved(value),
    }),
    MintabilityChanged: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'MintabilityChanged', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MintabilityChanged(value),
    }),
    TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'TotalQuantityChanged', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.TotalQuantityChanged(value),
    }),
    OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.OwnerChanged(value),
    }),
  },
  Account: {
    Created: <const T extends Account>(value: T): lib.Variant<'Account', lib.Variant<'Created', T>> => ({
      kind: 'Account',
      value: AccountEvent.Created(value),
    }),
    Deleted: <const T extends lib.AccountId>(value: T): lib.Variant<'Account', lib.Variant<'Deleted', T>> => ({
      kind: 'Account',
      value: AccountEvent.Deleted(value),
    }),
    Asset: {
      Created: <const T extends Asset>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Created', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.Created(value),
      }),
      Deleted: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Deleted', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.Deleted(value),
      }),
      Added: <const T extends AssetChanged>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Added', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.Added(value),
      }),
      Removed: <const T extends AssetChanged>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Removed', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.Removed(value),
      }),
      MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataInserted(value),
      }),
      MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
        value: T,
      ): lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>> => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataRemoved(value),
      }),
    },
    PermissionAdded: <const T extends AccountPermissionChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'PermissionAdded', T>> => ({
      kind: 'Account',
      value: AccountEvent.PermissionAdded(value),
    }),
    PermissionRemoved: <const T extends AccountPermissionChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>> => ({
      kind: 'Account',
      value: AccountEvent.PermissionRemoved(value),
    }),
    RoleGranted: <const T extends AccountRoleChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'RoleGranted', T>> => ({
      kind: 'Account',
      value: AccountEvent.RoleGranted(value),
    }),
    RoleRevoked: <const T extends AccountRoleChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'RoleRevoked', T>> => ({
      kind: 'Account',
      value: AccountEvent.RoleRevoked(value),
    }),
    MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Account',
      value: AccountEvent.MetadataInserted(value),
    }),
    MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Account',
      value: AccountEvent.MetadataRemoved(value),
    }),
  },
  MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(value: T): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }),
  MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(value: T): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }),
  OwnerChanged: <const T extends DomainOwnerChanged>(value: T): lib.Variant<'OwnerChanged', T> => ({
    kind: 'OwnerChanged',
    value,
  }),
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
      [0, 'Created', Domain[lib.CodecSymbol]],
      [1, 'Deleted', lib.DomainId[lib.CodecSymbol]],
      [2, 'AssetDefinition', AssetDefinitionEvent[lib.CodecSymbol]],
      [3, 'Account', AccountEvent[lib.CodecSymbol]],
      [4, 'MetadataInserted', MetadataChanged.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol]],
      [5, 'MetadataRemoved', MetadataChanged.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol]],
      [6, 'OwnerChanged', DomainOwnerChanged[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TriggerNumberOfExecutionsChanged {
  trigger: TriggerId
  by: lib.U32
}
export const TriggerNumberOfExecutionsChanged: lib.CodecProvider<TriggerNumberOfExecutionsChanged> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerNumberOfExecutionsChanged>(['trigger', 'by'], {
    trigger: TriggerId[lib.CodecSymbol],
    by: lib.U32[lib.CodecSymbol],
  }),
}

export type TriggerEvent =
  | lib.Variant<'Created', TriggerId>
  | lib.Variant<'Deleted', TriggerId>
  | lib.Variant<'Extended', TriggerNumberOfExecutionsChanged>
  | lib.Variant<'Shortened', TriggerNumberOfExecutionsChanged>
  | lib.Variant<'MetadataInserted', MetadataChanged<TriggerId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<TriggerId>>
export const TriggerEvent = {
  Created: <const T extends TriggerId>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends TriggerId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  Extended: <const T extends TriggerNumberOfExecutionsChanged>(value: T): lib.Variant<'Extended', T> => ({
    kind: 'Extended',
    value,
  }),
  Shortened: <const T extends TriggerNumberOfExecutionsChanged>(value: T): lib.Variant<'Shortened', T> => ({
    kind: 'Shortened',
    value,
  }),
  MetadataInserted: <const T extends MetadataChanged<TriggerId>>(value: T): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }),
  MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(value: T): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [TriggerId]
      Deleted: [TriggerId]
      Extended: [TriggerNumberOfExecutionsChanged]
      Shortened: [TriggerNumberOfExecutionsChanged]
      MetadataInserted: [MetadataChanged<TriggerId>]
      MetadataRemoved: [MetadataChanged<TriggerId>]
    }>([
      [0, 'Created', TriggerId[lib.CodecSymbol]],
      [1, 'Deleted', TriggerId[lib.CodecSymbol]],
      [2, 'Extended', TriggerNumberOfExecutionsChanged[lib.CodecSymbol]],
      [3, 'Shortened', TriggerNumberOfExecutionsChanged[lib.CodecSymbol]],
      [4, 'MetadataInserted', MetadataChanged.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
      [5, 'MetadataRemoved', MetadataChanged.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Role {
  id: RoleId
  permissions: lib.Vec<Permission>
}
export const Role: lib.CodecProvider<Role> = {
  [lib.CodecSymbol]: lib.structCodec<Role>(['id', 'permissions'], {
    id: RoleId[lib.CodecSymbol],
    permissions: lib.Vec.with(Permission[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface RolePermissionChanged {
  role: RoleId
  permission: Permission
}
export const RolePermissionChanged: lib.CodecProvider<RolePermissionChanged> = {
  [lib.CodecSymbol]: lib.structCodec<RolePermissionChanged>(['role', 'permission'], {
    role: RoleId[lib.CodecSymbol],
    permission: Permission[lib.CodecSymbol],
  }),
}

export type RoleEvent =
  | lib.Variant<'Created', Role>
  | lib.Variant<'Deleted', RoleId>
  | lib.Variant<'PermissionAdded', RolePermissionChanged>
  | lib.Variant<'PermissionRemoved', RolePermissionChanged>
export const RoleEvent = {
  Created: <const T extends Role>(value: T): lib.Variant<'Created', T> => ({ kind: 'Created', value }),
  Deleted: <const T extends RoleId>(value: T): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }),
  PermissionAdded: <const T extends RolePermissionChanged>(value: T): lib.Variant<'PermissionAdded', T> => ({
    kind: 'PermissionAdded',
    value,
  }),
  PermissionRemoved: <const T extends RolePermissionChanged>(value: T): lib.Variant<'PermissionRemoved', T> => ({
    kind: 'PermissionRemoved',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Created: [Role]
      Deleted: [RoleId]
      PermissionAdded: [RolePermissionChanged]
      PermissionRemoved: [RolePermissionChanged]
    }>([
      [0, 'Created', Role[lib.CodecSymbol]],
      [1, 'Deleted', RoleId[lib.CodecSymbol]],
      [2, 'PermissionAdded', RolePermissionChanged[lib.CodecSymbol]],
      [3, 'PermissionRemoved', RolePermissionChanged[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface ExecutorDataModel {
  parameters: lib.Map<CustomParameterId, CustomParameter>
  instructions: lib.Vec<lib.String>
  permissions: lib.Vec<lib.String>
  schema: lib.Json
}
export const ExecutorDataModel: lib.CodecProvider<ExecutorDataModel> = {
  [lib.CodecSymbol]: lib.structCodec<ExecutorDataModel>(['parameters', 'instructions', 'permissions', 'schema'], {
    parameters: lib.Map.with(CustomParameterId[lib.CodecSymbol], CustomParameter[lib.CodecSymbol])[lib.CodecSymbol],
    instructions: lib.Vec.with(lib.String[lib.CodecSymbol])[lib.CodecSymbol],
    permissions: lib.Vec.with(lib.String[lib.CodecSymbol])[lib.CodecSymbol],
    schema: lib.Json[lib.CodecSymbol],
  }),
}

export interface ExecutorUpgrade {
  newDataModel: ExecutorDataModel
}
export const ExecutorUpgrade: lib.CodecProvider<ExecutorUpgrade> = {
  [lib.CodecSymbol]: lib.structCodec<ExecutorUpgrade>(['newDataModel'], {
    newDataModel: ExecutorDataModel[lib.CodecSymbol],
  }),
}

export type ExecutorEvent = lib.Variant<'Upgraded', ExecutorUpgrade>
export const ExecutorEvent = {
  Upgraded: <const T extends ExecutorUpgrade>(value: T): lib.Variant<'Upgraded', T> => ({ kind: 'Upgraded', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Upgraded: [ExecutorUpgrade] }>([[0, 'Upgraded', ExecutorUpgrade[lib.CodecSymbol]]])
    .discriminated(),
}

export type DataEvent =
  | lib.Variant<'Peer', PeerEvent>
  | lib.Variant<'Domain', DomainEvent>
  | lib.Variant<'Trigger', TriggerEvent>
  | lib.Variant<'Role', RoleEvent>
  | lib.Variant<'Configuration', ConfigurationEvent>
  | lib.Variant<'Executor', ExecutorEvent>
export const DataEvent = {
  Peer: {
    Added: <const T extends PeerId>(value: T): lib.Variant<'Peer', lib.Variant<'Added', T>> => ({
      kind: 'Peer',
      value: PeerEvent.Added(value),
    }),
    Removed: <const T extends PeerId>(value: T): lib.Variant<'Peer', lib.Variant<'Removed', T>> => ({
      kind: 'Peer',
      value: PeerEvent.Removed(value),
    }),
  },
  Domain: {
    Created: <const T extends Domain>(value: T): lib.Variant<'Domain', lib.Variant<'Created', T>> => ({
      kind: 'Domain',
      value: DomainEvent.Created(value),
    }),
    Deleted: <const T extends lib.DomainId>(value: T): lib.Variant<'Domain', lib.Variant<'Deleted', T>> => ({
      kind: 'Domain',
      value: DomainEvent.Deleted(value),
    }),
    AssetDefinition: {
      Created: <const T extends AssetDefinition>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'Created', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Created(value),
      }),
      Deleted: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Deleted(value),
      }),
      MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataInserted(value),
      }),
      MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataRemoved(value),
      }),
      MintabilityChanged: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MintabilityChanged', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MintabilityChanged(value),
      }),
      TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'TotalQuantityChanged', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.TotalQuantityChanged(value),
      }),
      OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.OwnerChanged(value),
      }),
    },
    Account: {
      Created: <const T extends Account>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Created', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.Created(value),
      }),
      Deleted: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Deleted', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.Deleted(value),
      }),
      Asset: {
        Created: <const T extends Asset>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Created', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Created(value),
        }),
        Deleted: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Deleted', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Deleted(value),
        }),
        Added: <const T extends AssetChanged>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Added', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Added(value),
        }),
        Removed: <const T extends AssetChanged>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Removed', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Removed(value),
        }),
        MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataInserted(value),
        }),
        MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
          value: T,
        ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>>> => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataRemoved(value),
        }),
      },
      PermissionAdded: <const T extends AccountPermissionChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'PermissionAdded', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionAdded(value),
      }),
      PermissionRemoved: <const T extends AccountPermissionChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionRemoved(value),
      }),
      RoleGranted: <const T extends AccountRoleChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'RoleGranted', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleGranted(value),
      }),
      RoleRevoked: <const T extends AccountRoleChanged>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'RoleRevoked', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleRevoked(value),
      }),
      MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'MetadataInserted', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataInserted(value),
      }),
      MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
        value: T,
      ): lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>>> => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataRemoved(value),
      }),
    },
    MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Domain',
      value: DomainEvent.MetadataInserted(value),
    }),
    MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Domain',
      value: DomainEvent.MetadataRemoved(value),
    }),
    OwnerChanged: <const T extends DomainOwnerChanged>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'OwnerChanged', T>> => ({
      kind: 'Domain',
      value: DomainEvent.OwnerChanged(value),
    }),
  },
  Trigger: {
    Created: <const T extends TriggerId>(value: T): lib.Variant<'Trigger', lib.Variant<'Created', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Created(value),
    }),
    Deleted: <const T extends TriggerId>(value: T): lib.Variant<'Trigger', lib.Variant<'Deleted', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Deleted(value),
    }),
    Extended: <const T extends TriggerNumberOfExecutionsChanged>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Extended', T>> => ({ kind: 'Trigger', value: TriggerEvent.Extended(value) }),
    Shortened: <const T extends TriggerNumberOfExecutionsChanged>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Shortened', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Shortened(value),
    }),
    MetadataInserted: <const T extends MetadataChanged<TriggerId>>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataInserted(value),
    }),
    MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataRemoved(value),
    }),
  },
  Role: {
    Created: <const T extends Role>(value: T): lib.Variant<'Role', lib.Variant<'Created', T>> => ({
      kind: 'Role',
      value: RoleEvent.Created(value),
    }),
    Deleted: <const T extends RoleId>(value: T): lib.Variant<'Role', lib.Variant<'Deleted', T>> => ({
      kind: 'Role',
      value: RoleEvent.Deleted(value),
    }),
    PermissionAdded: <const T extends RolePermissionChanged>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'PermissionAdded', T>> => ({
      kind: 'Role',
      value: RoleEvent.PermissionAdded(value),
    }),
    PermissionRemoved: <const T extends RolePermissionChanged>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'PermissionRemoved', T>> => ({
      kind: 'Role',
      value: RoleEvent.PermissionRemoved(value),
    }),
  },
  Configuration: {
    Changed: <const T extends ParameterChanged>(value: T): lib.Variant<'Configuration', lib.Variant<'Changed', T>> => ({
      kind: 'Configuration',
      value: ConfigurationEvent.Changed(value),
    }),
  },
  Executor: {
    Upgraded: <const T extends ExecutorUpgrade>(value: T): lib.Variant<'Executor', lib.Variant<'Upgraded', T>> => ({
      kind: 'Executor',
      value: ExecutorEvent.Upgraded(value),
    }),
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
      [0, 'Peer', PeerEvent[lib.CodecSymbol]],
      [1, 'Domain', DomainEvent[lib.CodecSymbol]],
      [2, 'Trigger', TriggerEvent[lib.CodecSymbol]],
      [3, 'Role', RoleEvent[lib.CodecSymbol]],
      [4, 'Configuration', ConfigurationEvent[lib.CodecSymbol]],
      [5, 'Executor', ExecutorEvent[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type DomainPredicateAtom = never
export const DomainPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type DomainProjectionPredicate =
  | lib.Variant<'Atom', DomainPredicateAtom>
  | lib.Variant<'Id', DomainIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
export const DomainProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  Metadata: {
    Atom: {},
    Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
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
      [0, 'Atom', DomainPredicateAtom[lib.CodecSymbol]],
      [1, 'Id', DomainIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type DomainProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', DomainIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
export const DomainProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: DomainIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: DomainIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Metadata: {
    Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }),
    Key: <const T extends MetadataKeyProjectionSelector>(value: T): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [DomainIdProjectionSelector]; Metadata: [MetadataProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', DomainIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Metadata', MetadataProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TransactionEvent {
  hash: lib.HashWrap
  blockHeight: lib.Option<lib.NonZero<lib.U64>>
  status: TransactionStatus
}
export const TransactionEvent: lib.CodecProvider<TransactionEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionEvent>(['hash', 'blockHeight', 'status'], {
    hash: lib.HashWrap[lib.CodecSymbol],
    blockHeight: lib.Option.with(lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
    status: TransactionStatus[lib.CodecSymbol],
  }),
}

export type PipelineEventBox = lib.Variant<'Transaction', TransactionEvent> | lib.Variant<'Block', BlockEvent>
export const PipelineEventBox = {
  Transaction: <const T extends TransactionEvent>(value: T): lib.Variant<'Transaction', T> => ({
    kind: 'Transaction',
    value,
  }),
  Block: <const T extends BlockEvent>(value: T): lib.Variant<'Block', T> => ({ kind: 'Block', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Transaction: [TransactionEvent]; Block: [BlockEvent] }>([
      [0, 'Transaction', TransactionEvent[lib.CodecSymbol]],
      [1, 'Block', BlockEvent[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TimeInterval {
  since: lib.Timestamp
  length: lib.Duration
}
export const TimeInterval: lib.CodecProvider<TimeInterval> = {
  [lib.CodecSymbol]: lib.structCodec<TimeInterval>(['since', 'length'], {
    since: lib.Timestamp[lib.CodecSymbol],
    length: lib.Duration[lib.CodecSymbol],
  }),
}

export interface TimeEvent {
  interval: TimeInterval
}
export const TimeEvent: lib.CodecProvider<TimeEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TimeEvent>(['interval'], { interval: TimeInterval[lib.CodecSymbol] }),
}

export interface ExecuteTriggerEvent {
  triggerId: TriggerId
  authority: lib.AccountId
  args: lib.Json
}
export const ExecuteTriggerEvent: lib.CodecProvider<ExecuteTriggerEvent> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTriggerEvent>(['triggerId', 'authority', 'args'], {
    triggerId: TriggerId[lib.CodecSymbol],
    authority: lib.AccountId[lib.CodecSymbol],
    args: lib.Json[lib.CodecSymbol],
  }),
}

export type TriggerCompletedOutcome = lib.VariantUnit<'Success'> | lib.Variant<'Failure', lib.String>
export const TriggerCompletedOutcome = {
  Success: Object.freeze<lib.VariantUnit<'Success'>>({ kind: 'Success' }),
  Failure: <const T extends lib.String>(value: T): lib.Variant<'Failure', T> => ({ kind: 'Failure', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Success: []; Failure: [lib.String] }>([
      [0, 'Success'],
      [1, 'Failure', lib.String[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface TriggerCompletedEvent {
  triggerId: TriggerId
  outcome: TriggerCompletedOutcome
}
export const TriggerCompletedEvent: lib.CodecProvider<TriggerCompletedEvent> = {
  [lib.CodecSymbol]: lib.structCodec<TriggerCompletedEvent>(['triggerId', 'outcome'], {
    triggerId: TriggerId[lib.CodecSymbol],
    outcome: TriggerCompletedOutcome[lib.CodecSymbol],
  }),
}

export type EventBox =
  | lib.Variant<'Pipeline', PipelineEventBox>
  | lib.Variant<'Data', DataEvent>
  | lib.Variant<'Time', TimeEvent>
  | lib.Variant<'ExecuteTrigger', ExecuteTriggerEvent>
  | lib.Variant<'TriggerCompleted', TriggerCompletedEvent>
export const EventBox = {
  Pipeline: {
    Transaction: <const T extends TransactionEvent>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Transaction', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventBox.Transaction(value),
    }),
    Block: <const T extends BlockEvent>(value: T): lib.Variant<'Pipeline', lib.Variant<'Block', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventBox.Block(value),
    }),
  },
  Data: {
    Peer: {
      Added: <const T extends PeerId>(value: T): lib.Variant<'Data', lib.Variant<'Peer', lib.Variant<'Added', T>>> => ({
        kind: 'Data',
        value: DataEvent.Peer.Added(value),
      }),
      Removed: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Peer', lib.Variant<'Removed', T>>> => ({
        kind: 'Data',
        value: DataEvent.Peer.Removed(value),
      }),
    },
    Domain: {
      Created: <const T extends Domain>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Created', T>>> => ({
        kind: 'Data',
        value: DataEvent.Domain.Created(value),
      }),
      Deleted: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Deleted', T>>> => ({
        kind: 'Data',
        value: DataEvent.Domain.Deleted(value),
      }),
      AssetDefinition: {
        Created: <const T extends AssetDefinition>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'Created', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Created(value),
        }),
        Deleted: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Deleted(value),
        }),
        MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>>>
        > => ({ kind: 'Data', value: DataEvent.Domain.AssetDefinition.MetadataInserted(value) }),
        MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>>>
        > => ({ kind: 'Data', value: DataEvent.Domain.AssetDefinition.MetadataRemoved(value) }),
        MintabilityChanged: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'MintabilityChanged', T>>>
        > => ({ kind: 'Data', value: DataEvent.Domain.AssetDefinition.MintabilityChanged(value) }),
        TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'TotalQuantityChanged', T>>>
        > => ({ kind: 'Data', value: DataEvent.Domain.AssetDefinition.TotalQuantityChanged(value) }),
        OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<'Domain', lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>>>
        > => ({ kind: 'Data', value: DataEvent.Domain.AssetDefinition.OwnerChanged(value) }),
      },
      Account: {
        Created: <const T extends Account>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Created', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.Created(value),
        }),
        Deleted: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Deleted', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.Deleted(value),
        }),
        Asset: {
          Created: <const T extends Asset>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Created', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.Created(value) }),
          Deleted: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Deleted', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.Deleted(value) }),
          Added: <const T extends AssetChanged>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Added', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.Added(value) }),
          Removed: <const T extends AssetChanged>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Removed', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.Removed(value) }),
          MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.MetadataInserted(value) }),
          MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>>>
          > => ({ kind: 'Data', value: DataEvent.Domain.Account.Asset.MetadataRemoved(value) }),
        },
        PermissionAdded: <const T extends AccountPermissionChanged>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'PermissionAdded', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionAdded(value),
        }),
        PermissionRemoved: <const T extends AccountPermissionChanged>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionRemoved(value),
        }),
        RoleGranted: <const T extends AccountRoleChanged>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'RoleGranted', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleGranted(value),
        }),
        RoleRevoked: <const T extends AccountRoleChanged>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'RoleRevoked', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleRevoked(value),
        }),
        MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'MetadataInserted', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataInserted(value),
        }),
        MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
          value: T,
        ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>>>> => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataRemoved(value),
        }),
      },
      MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'MetadataInserted', T>>> => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataInserted(value),
      }),
      MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'MetadataRemoved', T>>> => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataRemoved(value),
      }),
      OwnerChanged: <const T extends DomainOwnerChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Domain', lib.Variant<'OwnerChanged', T>>> => ({
        kind: 'Data',
        value: DataEvent.Domain.OwnerChanged(value),
      }),
    },
    Trigger: {
      Created: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'Created', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.Created(value),
      }),
      Deleted: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'Deleted', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.Deleted(value),
      }),
      Extended: <const T extends TriggerNumberOfExecutionsChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'Extended', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.Extended(value),
      }),
      Shortened: <const T extends TriggerNumberOfExecutionsChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'Shortened', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.Shortened(value),
      }),
      MetadataInserted: <const T extends MetadataChanged<TriggerId>>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'MetadataInserted', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.MetadataInserted(value),
      }),
      MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Trigger', lib.Variant<'MetadataRemoved', T>>> => ({
        kind: 'Data',
        value: DataEvent.Trigger.MetadataRemoved(value),
      }),
    },
    Role: {
      Created: <const T extends Role>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Role', lib.Variant<'Created', T>>> => ({
        kind: 'Data',
        value: DataEvent.Role.Created(value),
      }),
      Deleted: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Role', lib.Variant<'Deleted', T>>> => ({
        kind: 'Data',
        value: DataEvent.Role.Deleted(value),
      }),
      PermissionAdded: <const T extends RolePermissionChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Role', lib.Variant<'PermissionAdded', T>>> => ({
        kind: 'Data',
        value: DataEvent.Role.PermissionAdded(value),
      }),
      PermissionRemoved: <const T extends RolePermissionChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Role', lib.Variant<'PermissionRemoved', T>>> => ({
        kind: 'Data',
        value: DataEvent.Role.PermissionRemoved(value),
      }),
    },
    Configuration: {
      Changed: <const T extends ParameterChanged>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Configuration', lib.Variant<'Changed', T>>> => ({
        kind: 'Data',
        value: DataEvent.Configuration.Changed(value),
      }),
    },
    Executor: {
      Upgraded: <const T extends ExecutorUpgrade>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Executor', lib.Variant<'Upgraded', T>>> => ({
        kind: 'Data',
        value: DataEvent.Executor.Upgraded(value),
      }),
    },
  },
  Time: <const T extends TimeEvent>(value: T): lib.Variant<'Time', T> => ({ kind: 'Time', value }),
  ExecuteTrigger: <const T extends ExecuteTriggerEvent>(value: T): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }),
  TriggerCompleted: <const T extends TriggerCompletedEvent>(value: T): lib.Variant<'TriggerCompleted', T> => ({
    kind: 'TriggerCompleted',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Pipeline: [PipelineEventBox]
      Data: [DataEvent]
      Time: [TimeEvent]
      ExecuteTrigger: [ExecuteTriggerEvent]
      TriggerCompleted: [TriggerCompletedEvent]
    }>([
      [0, 'Pipeline', PipelineEventBox[lib.CodecSymbol]],
      [1, 'Data', DataEvent[lib.CodecSymbol]],
      [2, 'Time', TimeEvent[lib.CodecSymbol]],
      [3, 'ExecuteTrigger', ExecuteTriggerEvent[lib.CodecSymbol]],
      [4, 'TriggerCompleted', TriggerCompletedEvent[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type EventMessage = EventBox
export const EventMessage = EventBox

export interface EventSubscriptionRequest {
  filters: lib.Vec<EventFilterBox>
}
export const EventSubscriptionRequest: lib.CodecProvider<EventSubscriptionRequest> = {
  [lib.CodecSymbol]: lib.structCodec<EventSubscriptionRequest>(['filters'], {
    filters: lib.Vec.with(EventFilterBox[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface ExecuteTrigger {
  trigger: TriggerId
  args: lib.Json
}
export const ExecuteTrigger: lib.CodecProvider<ExecuteTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<ExecuteTrigger>(['trigger', 'args'], {
    trigger: TriggerId[lib.CodecSymbol],
    args: lib.Json[lib.CodecSymbol],
  }),
}

export interface Executor {
  wasm: WasmSmartContract
}
export const Executor: lib.CodecProvider<Executor> = {
  [lib.CodecSymbol]: lib.structCodec<Executor>(['wasm'], { wasm: WasmSmartContract[lib.CodecSymbol] }),
}

export interface FindAccountsWithAsset {
  assetDefinition: lib.AssetDefinitionId
}
export const FindAccountsWithAsset: lib.CodecProvider<FindAccountsWithAsset> = {
  [lib.CodecSymbol]: lib.structCodec<FindAccountsWithAsset>(['assetDefinition'], {
    assetDefinition: lib.AssetDefinitionId[lib.CodecSymbol],
  }),
}

export interface FindPermissionsByAccountId {
  id: lib.AccountId
}
export const FindPermissionsByAccountId: lib.CodecProvider<FindPermissionsByAccountId> = {
  [lib.CodecSymbol]: lib.structCodec<FindPermissionsByAccountId>(['id'], { id: lib.AccountId[lib.CodecSymbol] }),
}

export interface FindRolesByAccountId {
  id: lib.AccountId
}
export const FindRolesByAccountId: lib.CodecProvider<FindRolesByAccountId> = {
  [lib.CodecSymbol]: lib.structCodec<FindRolesByAccountId>(['id'], { id: lib.AccountId[lib.CodecSymbol] }),
}

export interface ForwardCursor {
  query: lib.String
  cursor: lib.NonZero<lib.U64>
}
export const ForwardCursor: lib.CodecProvider<ForwardCursor> = {
  [lib.CodecSymbol]: lib.structCodec<ForwardCursor>(['query', 'cursor'], {
    query: lib.String[lib.CodecSymbol],
    cursor: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
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
    executable: lib.String[lib.CodecSymbol],
    repeats: Repeats[lib.CodecSymbol],
    authority: lib.AccountId[lib.CodecSymbol],
    filter: EventFilterBox[lib.CodecSymbol],
  }),
}

export interface GenesisWasmTrigger {
  id: TriggerId
  action: GenesisWasmAction
}
export const GenesisWasmTrigger: lib.CodecProvider<GenesisWasmTrigger> = {
  [lib.CodecSymbol]: lib.structCodec<GenesisWasmTrigger>(['id', 'action'], {
    id: TriggerId[lib.CodecSymbol],
    action: GenesisWasmAction[lib.CodecSymbol],
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
  | lib.Variant<'Permission', Grant<Permission, lib.AccountId>>
  | lib.Variant<'Role', Grant<RoleId, lib.AccountId>>
  | lib.Variant<'RolePermission', Grant<Permission, RoleId>>
export const GrantBox = {
  Permission: <const T extends Grant<Permission, lib.AccountId>>(value: T): lib.Variant<'Permission', T> => ({
    kind: 'Permission',
    value,
  }),
  Role: <const T extends Grant<RoleId, lib.AccountId>>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  RolePermission: <const T extends Grant<Permission, RoleId>>(value: T): lib.Variant<'RolePermission', T> => ({
    kind: 'RolePermission',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Permission: [Grant<Permission, lib.AccountId>]
      Role: [Grant<RoleId, lib.AccountId>]
      RolePermission: [Grant<Permission, RoleId>]
    }>([
      [0, 'Permission', Grant.with(Permission[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'Role', Grant.with(RoleId[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [2, 'RolePermission', Grant.with(Permission[lib.CodecSymbol], RoleId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface NewDomain {
  id: lib.DomainId
  logo: lib.Option<IpfsPath>
  metadata: Metadata
}
export const NewDomain: lib.CodecProvider<NewDomain> = {
  [lib.CodecSymbol]: lib.structCodec<NewDomain>(['id', 'logo', 'metadata'], {
    id: lib.DomainId[lib.CodecSymbol],
    logo: lib.Option.with(IpfsPath[lib.CodecSymbol])[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
  }),
}

export interface NewAccount {
  id: lib.AccountId
  metadata: Metadata
}
export const NewAccount: lib.CodecProvider<NewAccount> = {
  [lib.CodecSymbol]: lib.structCodec<NewAccount>(['id', 'metadata'], {
    id: lib.AccountId[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
  }),
}

export interface NewAssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<IpfsPath>
  metadata: Metadata
}
export const NewAssetDefinition: lib.CodecProvider<NewAssetDefinition> = {
  [lib.CodecSymbol]: lib.structCodec<NewAssetDefinition>(['id', 'type', 'mintable', 'logo', 'metadata'], {
    id: lib.AssetDefinitionId[lib.CodecSymbol],
    type: AssetType[lib.CodecSymbol],
    mintable: Mintable[lib.CodecSymbol],
    logo: lib.Option.with(IpfsPath[lib.CodecSymbol])[lib.CodecSymbol],
    metadata: Metadata[lib.CodecSymbol],
  }),
}

export interface NewRole {
  inner: Role
  grantTo: lib.AccountId
}
export const NewRole: lib.CodecProvider<NewRole> = {
  [lib.CodecSymbol]: lib.structCodec<NewRole>(['inner', 'grantTo'], {
    inner: Role[lib.CodecSymbol],
    grantTo: lib.AccountId[lib.CodecSymbol],
  }),
}

export interface Trigger {
  id: TriggerId
  action: Action
}
export const Trigger: lib.CodecProvider<Trigger> = {
  [lib.CodecSymbol]: lib.structCodec<Trigger>(['id', 'action'], {
    id: TriggerId[lib.CodecSymbol],
    action: Action[lib.CodecSymbol],
  }),
}

export type RegisterBox =
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Domain', NewDomain>
  | lib.Variant<'Account', NewAccount>
  | lib.Variant<'AssetDefinition', NewAssetDefinition>
  | lib.Variant<'Asset', Asset>
  | lib.Variant<'Role', NewRole>
  | lib.Variant<'Trigger', Trigger>
export const RegisterBox = {
  Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }),
  Domain: <const T extends NewDomain>(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  Account: <const T extends NewAccount>(value: T): lib.Variant<'Account', T> => ({ kind: 'Account', value }),
  AssetDefinition: <const T extends NewAssetDefinition>(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }),
  Asset: <const T extends Asset>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  Role: <const T extends NewRole>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  Trigger: <const T extends Trigger>(value: T): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
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
      [0, 'Peer', PeerId[lib.CodecSymbol]],
      [1, 'Domain', NewDomain[lib.CodecSymbol]],
      [2, 'Account', NewAccount[lib.CodecSymbol]],
      [3, 'AssetDefinition', NewAssetDefinition[lib.CodecSymbol]],
      [4, 'Asset', Asset[lib.CodecSymbol]],
      [5, 'Role', NewRole[lib.CodecSymbol]],
      [6, 'Trigger', Trigger[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type UnregisterBox =
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Domain', lib.DomainId>
  | lib.Variant<'Account', lib.AccountId>
  | lib.Variant<'AssetDefinition', lib.AssetDefinitionId>
  | lib.Variant<'Asset', lib.AssetId>
  | lib.Variant<'Role', RoleId>
  | lib.Variant<'Trigger', TriggerId>
export const UnregisterBox = {
  Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }),
  Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  Account: <const T extends lib.AccountId>(value: T): lib.Variant<'Account', T> => ({ kind: 'Account', value }),
  AssetDefinition: <const T extends lib.AssetDefinitionId>(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }),
  Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  Role: <const T extends RoleId>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  Trigger: <const T extends TriggerId>(value: T): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
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
      [0, 'Peer', PeerId[lib.CodecSymbol]],
      [1, 'Domain', lib.DomainId[lib.CodecSymbol]],
      [2, 'Account', lib.AccountId[lib.CodecSymbol]],
      [3, 'AssetDefinition', lib.AssetDefinitionId[lib.CodecSymbol]],
      [4, 'Asset', lib.AssetId[lib.CodecSymbol]],
      [5, 'Role', RoleId[lib.CodecSymbol]],
      [6, 'Trigger', TriggerId[lib.CodecSymbol]],
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
  | lib.Variant<'Asset', Mint<Numeric, lib.AssetId>>
  | lib.Variant<'TriggerRepetitions', Mint<lib.U32, TriggerId>>
export const MintBox = {
  Asset: <const T extends Mint<Numeric, lib.AssetId>>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  TriggerRepetitions: <const T extends Mint<lib.U32, TriggerId>>(value: T): lib.Variant<'TriggerRepetitions', T> => ({
    kind: 'TriggerRepetitions',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Asset: [Mint<Numeric, lib.AssetId>]; TriggerRepetitions: [Mint<lib.U32, TriggerId>] }>([
      [0, 'Asset', Mint.with(Numeric[lib.CodecSymbol], lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'TriggerRepetitions', Mint.with(lib.U32[lib.CodecSymbol], TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TransferBox =
  | lib.Variant<'Domain', Transfer<lib.AccountId, lib.DomainId, lib.AccountId>>
  | lib.Variant<'AssetDefinition', Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>>
  | lib.Variant<'Asset', AssetTransferBox>
export const TransferBox = {
  Domain: <const T extends Transfer<lib.AccountId, lib.DomainId, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  AssetDefinition: <const T extends Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({ kind: 'AssetDefinition', value }),
  Asset: {
    Numeric: <const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Numeric', T>> => ({ kind: 'Asset', value: AssetTransferBox.Numeric(value) }),
    Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Store', T>> => ({ kind: 'Asset', value: AssetTransferBox.Store(value) }),
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
        Transfer.with(lib.AccountId[lib.CodecSymbol], lib.DomainId[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[
          lib.CodecSymbol
        ],
      ],
      [
        1,
        'AssetDefinition',
        Transfer.with(
          lib.AccountId[lib.CodecSymbol],
          lib.AssetDefinitionId[lib.CodecSymbol],
          lib.AccountId[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [2, 'Asset', AssetTransferBox[lib.CodecSymbol]],
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
      key: lib.Name[lib.CodecSymbol],
      value: lib.Json[lib.CodecSymbol],
    }),
  }),
}

export type SetKeyValueBox =
  | lib.Variant<'Domain', SetKeyValue<lib.DomainId>>
  | lib.Variant<'Account', SetKeyValue<lib.AccountId>>
  | lib.Variant<'AssetDefinition', SetKeyValue<lib.AssetDefinitionId>>
  | lib.Variant<'Asset', SetKeyValue<lib.AssetId>>
  | lib.Variant<'Trigger', SetKeyValue<TriggerId>>
export const SetKeyValueBox = {
  Domain: <const T extends SetKeyValue<lib.DomainId>>(value: T): lib.Variant<'Domain', T> => ({
    kind: 'Domain',
    value,
  }),
  Account: <const T extends SetKeyValue<lib.AccountId>>(value: T): lib.Variant<'Account', T> => ({
    kind: 'Account',
    value,
  }),
  AssetDefinition: <const T extends SetKeyValue<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({ kind: 'AssetDefinition', value }),
  Asset: <const T extends SetKeyValue<lib.AssetId>>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  Trigger: <const T extends SetKeyValue<TriggerId>>(value: T): lib.Variant<'Trigger', T> => ({
    kind: 'Trigger',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Domain: [SetKeyValue<lib.DomainId>]
      Account: [SetKeyValue<lib.AccountId>]
      AssetDefinition: [SetKeyValue<lib.AssetDefinitionId>]
      Asset: [SetKeyValue<lib.AssetId>]
      Trigger: [SetKeyValue<TriggerId>]
    }>([
      [0, 'Domain', SetKeyValue.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'Account', SetKeyValue.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [2, 'AssetDefinition', SetKeyValue.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol]],
      [3, 'Asset', SetKeyValue.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [4, 'Trigger', SetKeyValue.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
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
      key: lib.Name[lib.CodecSymbol],
    }),
  }),
}

export type RemoveKeyValueBox =
  | lib.Variant<'Domain', RemoveKeyValue<lib.DomainId>>
  | lib.Variant<'Account', RemoveKeyValue<lib.AccountId>>
  | lib.Variant<'AssetDefinition', RemoveKeyValue<lib.AssetDefinitionId>>
  | lib.Variant<'Asset', RemoveKeyValue<lib.AssetId>>
  | lib.Variant<'Trigger', RemoveKeyValue<TriggerId>>
export const RemoveKeyValueBox = {
  Domain: <const T extends RemoveKeyValue<lib.DomainId>>(value: T): lib.Variant<'Domain', T> => ({
    kind: 'Domain',
    value,
  }),
  Account: <const T extends RemoveKeyValue<lib.AccountId>>(value: T): lib.Variant<'Account', T> => ({
    kind: 'Account',
    value,
  }),
  AssetDefinition: <const T extends RemoveKeyValue<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({ kind: 'AssetDefinition', value }),
  Asset: <const T extends RemoveKeyValue<lib.AssetId>>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  Trigger: <const T extends RemoveKeyValue<TriggerId>>(value: T): lib.Variant<'Trigger', T> => ({
    kind: 'Trigger',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Domain: [RemoveKeyValue<lib.DomainId>]
      Account: [RemoveKeyValue<lib.AccountId>]
      AssetDefinition: [RemoveKeyValue<lib.AssetDefinitionId>]
      Asset: [RemoveKeyValue<lib.AssetId>]
      Trigger: [RemoveKeyValue<TriggerId>]
    }>([
      [0, 'Domain', RemoveKeyValue.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'Account', RemoveKeyValue.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [2, 'AssetDefinition', RemoveKeyValue.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol]],
      [3, 'Asset', RemoveKeyValue.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [4, 'Trigger', RemoveKeyValue.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
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
  | lib.Variant<'Permission', Revoke<Permission, lib.AccountId>>
  | lib.Variant<'Role', Revoke<RoleId, lib.AccountId>>
  | lib.Variant<'RolePermission', Revoke<Permission, RoleId>>
export const RevokeBox = {
  Permission: <const T extends Revoke<Permission, lib.AccountId>>(value: T): lib.Variant<'Permission', T> => ({
    kind: 'Permission',
    value,
  }),
  Role: <const T extends Revoke<RoleId, lib.AccountId>>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  RolePermission: <const T extends Revoke<Permission, RoleId>>(value: T): lib.Variant<'RolePermission', T> => ({
    kind: 'RolePermission',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      Permission: [Revoke<Permission, lib.AccountId>]
      Role: [Revoke<RoleId, lib.AccountId>]
      RolePermission: [Revoke<Permission, RoleId>]
    }>([
      [0, 'Permission', Revoke.with(Permission[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'Role', Revoke.with(RoleId[lib.CodecSymbol], lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [2, 'RolePermission', Revoke.with(Permission[lib.CodecSymbol], RoleId[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type SetParameter = Parameter
export const SetParameter = Parameter

export interface Upgrade {
  executor: Executor
}
export const Upgrade: lib.CodecProvider<Upgrade> = {
  [lib.CodecSymbol]: lib.structCodec<Upgrade>(['executor'], { executor: Executor[lib.CodecSymbol] }),
}

export type Level =
  | lib.VariantUnit<'TRACE'>
  | lib.VariantUnit<'DEBUG'>
  | lib.VariantUnit<'INFO'>
  | lib.VariantUnit<'WARN'>
  | lib.VariantUnit<'ERROR'>
export const Level = {
  TRACE: Object.freeze<lib.VariantUnit<'TRACE'>>({ kind: 'TRACE' }),
  DEBUG: Object.freeze<lib.VariantUnit<'DEBUG'>>({ kind: 'DEBUG' }),
  INFO: Object.freeze<lib.VariantUnit<'INFO'>>({ kind: 'INFO' }),
  WARN: Object.freeze<lib.VariantUnit<'WARN'>>({ kind: 'WARN' }),
  ERROR: Object.freeze<lib.VariantUnit<'ERROR'>>({ kind: 'ERROR' }),
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
    level: Level[lib.CodecSymbol],
    msg: lib.String[lib.CodecSymbol],
  }),
}

export type InstructionBox =
  | lib.Variant<'Register', RegisterBox>
  | lib.Variant<'Unregister', UnregisterBox>
  | lib.Variant<'Mint', MintBox>
  | lib.Variant<'Burn', BurnBox>
  | lib.Variant<'Transfer', TransferBox>
  | lib.Variant<'SetKeyValue', SetKeyValueBox>
  | lib.Variant<'RemoveKeyValue', RemoveKeyValueBox>
  | lib.Variant<'Grant', GrantBox>
  | lib.Variant<'Revoke', RevokeBox>
  | lib.Variant<'ExecuteTrigger', ExecuteTrigger>
  | lib.Variant<'SetParameter', SetParameter>
  | lib.Variant<'Upgrade', Upgrade>
  | lib.Variant<'Log', Log>
  | lib.Variant<'Custom', CustomInstruction>
export const InstructionBox = {
  Register: {
    Peer: <const T extends PeerId>(value: T): lib.Variant<'Register', lib.Variant<'Peer', T>> => ({
      kind: 'Register',
      value: RegisterBox.Peer(value),
    }),
    Domain: <const T extends NewDomain>(value: T): lib.Variant<'Register', lib.Variant<'Domain', T>> => ({
      kind: 'Register',
      value: RegisterBox.Domain(value),
    }),
    Account: <const T extends NewAccount>(value: T): lib.Variant<'Register', lib.Variant<'Account', T>> => ({
      kind: 'Register',
      value: RegisterBox.Account(value),
    }),
    AssetDefinition: <const T extends NewAssetDefinition>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Register',
      value: RegisterBox.AssetDefinition(value),
    }),
    Asset: <const T extends Asset>(value: T): lib.Variant<'Register', lib.Variant<'Asset', T>> => ({
      kind: 'Register',
      value: RegisterBox.Asset(value),
    }),
    Role: <const T extends NewRole>(value: T): lib.Variant<'Register', lib.Variant<'Role', T>> => ({
      kind: 'Register',
      value: RegisterBox.Role(value),
    }),
    Trigger: <const T extends Trigger>(value: T): lib.Variant<'Register', lib.Variant<'Trigger', T>> => ({
      kind: 'Register',
      value: RegisterBox.Trigger(value),
    }),
  },
  Unregister: {
    Peer: <const T extends PeerId>(value: T): lib.Variant<'Unregister', lib.Variant<'Peer', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Peer(value),
    }),
    Domain: <const T extends lib.DomainId>(value: T): lib.Variant<'Unregister', lib.Variant<'Domain', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Domain(value),
    }),
    Account: <const T extends lib.AccountId>(value: T): lib.Variant<'Unregister', lib.Variant<'Account', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Account(value),
    }),
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.AssetDefinition(value),
    }),
    Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Unregister', lib.Variant<'Asset', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Asset(value),
    }),
    Role: <const T extends RoleId>(value: T): lib.Variant<'Unregister', lib.Variant<'Role', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Role(value),
    }),
    Trigger: <const T extends TriggerId>(value: T): lib.Variant<'Unregister', lib.Variant<'Trigger', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Trigger(value),
    }),
  },
  Mint: {
    Asset: <const T extends Mint<Numeric, lib.AssetId>>(value: T): lib.Variant<'Mint', lib.Variant<'Asset', T>> => ({
      kind: 'Mint',
      value: MintBox.Asset(value),
    }),
    TriggerRepetitions: <const T extends Mint<lib.U32, TriggerId>>(
      value: T,
    ): lib.Variant<'Mint', lib.Variant<'TriggerRepetitions', T>> => ({
      kind: 'Mint',
      value: MintBox.TriggerRepetitions(value),
    }),
  },
  Burn: {
    Asset: <const T extends Burn<Numeric, lib.AssetId>>(value: T): lib.Variant<'Burn', lib.Variant<'Asset', T>> => ({
      kind: 'Burn',
      value: BurnBox.Asset(value),
    }),
    TriggerRepetitions: <const T extends Burn<lib.U32, TriggerId>>(
      value: T,
    ): lib.Variant<'Burn', lib.Variant<'TriggerRepetitions', T>> => ({
      kind: 'Burn',
      value: BurnBox.TriggerRepetitions(value),
    }),
  },
  Transfer: {
    Domain: <const T extends Transfer<lib.AccountId, lib.DomainId, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Transfer', lib.Variant<'Domain', T>> => ({ kind: 'Transfer', value: TransferBox.Domain(value) }),
    AssetDefinition: <const T extends Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Transfer', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Transfer',
      value: TransferBox.AssetDefinition(value),
    }),
    Asset: {
      Numeric: <const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>>(
        value: T,
      ): lib.Variant<'Transfer', lib.Variant<'Asset', lib.Variant<'Numeric', T>>> => ({
        kind: 'Transfer',
        value: TransferBox.Asset.Numeric(value),
      }),
      Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(
        value: T,
      ): lib.Variant<'Transfer', lib.Variant<'Asset', lib.Variant<'Store', T>>> => ({
        kind: 'Transfer',
        value: TransferBox.Asset.Store(value),
      }),
    },
  },
  SetKeyValue: {
    Domain: <const T extends SetKeyValue<lib.DomainId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Domain', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Domain(value),
    }),
    Account: <const T extends SetKeyValue<lib.AccountId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Account', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Account(value),
    }),
    AssetDefinition: <const T extends SetKeyValue<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.AssetDefinition(value),
    }),
    Asset: <const T extends SetKeyValue<lib.AssetId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Asset', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Asset(value),
    }),
    Trigger: <const T extends SetKeyValue<TriggerId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Trigger', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Trigger(value),
    }),
  },
  RemoveKeyValue: {
    Domain: <const T extends RemoveKeyValue<lib.DomainId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Domain', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Domain(value),
    }),
    Account: <const T extends RemoveKeyValue<lib.AccountId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Account', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Account(value),
    }),
    AssetDefinition: <const T extends RemoveKeyValue<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.AssetDefinition(value),
    }),
    Asset: <const T extends RemoveKeyValue<lib.AssetId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Asset', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Asset(value),
    }),
    Trigger: <const T extends RemoveKeyValue<TriggerId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Trigger', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Trigger(value),
    }),
  },
  Grant: {
    Permission: <const T extends Grant<Permission, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Grant', lib.Variant<'Permission', T>> => ({ kind: 'Grant', value: GrantBox.Permission(value) }),
    Role: <const T extends Grant<RoleId, lib.AccountId>>(value: T): lib.Variant<'Grant', lib.Variant<'Role', T>> => ({
      kind: 'Grant',
      value: GrantBox.Role(value),
    }),
    RolePermission: <const T extends Grant<Permission, RoleId>>(
      value: T,
    ): lib.Variant<'Grant', lib.Variant<'RolePermission', T>> => ({
      kind: 'Grant',
      value: GrantBox.RolePermission(value),
    }),
  },
  Revoke: {
    Permission: <const T extends Revoke<Permission, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Revoke', lib.Variant<'Permission', T>> => ({ kind: 'Revoke', value: RevokeBox.Permission(value) }),
    Role: <const T extends Revoke<RoleId, lib.AccountId>>(value: T): lib.Variant<'Revoke', lib.Variant<'Role', T>> => ({
      kind: 'Revoke',
      value: RevokeBox.Role(value),
    }),
    RolePermission: <const T extends Revoke<Permission, RoleId>>(
      value: T,
    ): lib.Variant<'Revoke', lib.Variant<'RolePermission', T>> => ({
      kind: 'Revoke',
      value: RevokeBox.RolePermission(value),
    }),
  },
  ExecuteTrigger: <const T extends ExecuteTrigger>(value: T): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }),
  SetParameter: {
    Sumeragi: {
      BlockTime: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Sumeragi', lib.Variant<'BlockTime', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.BlockTime(value),
      }),
      CommitTime: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Sumeragi', lib.Variant<'CommitTime', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.CommitTime(value),
      }),
      MaxClockDrift: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Sumeragi', lib.Variant<'MaxClockDrift', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.MaxClockDrift(value),
      }),
    },
    Block: {
      MaxTransactions: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Block', lib.Variant<'MaxTransactions', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Block.MaxTransactions(value),
      }),
    },
    Transaction: {
      MaxInstructions: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Transaction', lib.Variant<'MaxInstructions', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Transaction.MaxInstructions(value),
      }),
      SmartContractSize: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Transaction', lib.Variant<'SmartContractSize', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Transaction.SmartContractSize(value),
      }),
    },
    SmartContract: {
      Fuel: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'SmartContract', lib.Variant<'Fuel', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.SmartContract.Fuel(value),
      }),
      Memory: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'SmartContract', lib.Variant<'Memory', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.SmartContract.Memory(value),
      }),
    },
    Executor: {
      Fuel: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Executor', lib.Variant<'Fuel', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Executor.Fuel(value),
      }),
      Memory: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<'SetParameter', lib.Variant<'Executor', lib.Variant<'Memory', T>>> => ({
        kind: 'SetParameter',
        value: SetParameter.Executor.Memory(value),
      }),
    },
    Custom: <const T extends CustomParameter>(value: T): lib.Variant<'SetParameter', lib.Variant<'Custom', T>> => ({
      kind: 'SetParameter',
      value: SetParameter.Custom(value),
    }),
  },
  Upgrade: <const T extends Upgrade>(value: T): lib.Variant<'Upgrade', T> => ({ kind: 'Upgrade', value }),
  Log: <const T extends Log>(value: T): lib.Variant<'Log', T> => ({ kind: 'Log', value }),
  Custom: <const T extends CustomInstruction>(value: T): lib.Variant<'Custom', T> => ({ kind: 'Custom', value }),
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
      SetParameter: [SetParameter]
      Upgrade: [Upgrade]
      Log: [Log]
      Custom: [CustomInstruction]
    }>([
      [0, 'Register', RegisterBox[lib.CodecSymbol]],
      [1, 'Unregister', UnregisterBox[lib.CodecSymbol]],
      [2, 'Mint', MintBox[lib.CodecSymbol]],
      [3, 'Burn', BurnBox[lib.CodecSymbol]],
      [4, 'Transfer', TransferBox[lib.CodecSymbol]],
      [5, 'SetKeyValue', SetKeyValueBox[lib.CodecSymbol]],
      [6, 'RemoveKeyValue', RemoveKeyValueBox[lib.CodecSymbol]],
      [7, 'Grant', GrantBox[lib.CodecSymbol]],
      [8, 'Revoke', RevokeBox[lib.CodecSymbol]],
      [9, 'ExecuteTrigger', ExecuteTrigger[lib.CodecSymbol]],
      [10, 'SetParameter', SetParameter[lib.CodecSymbol]],
      [11, 'Upgrade', Upgrade[lib.CodecSymbol]],
      [12, 'Log', Log[lib.CodecSymbol]],
      [13, 'Custom', CustomInstruction[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type Ipv4Addr = [lib.U8, lib.U8, lib.U8, lib.U8]
export const Ipv4Addr = {
  [lib.CodecSymbol]: lib.tupleCodec([
    lib.U8[lib.CodecSymbol],
    lib.U8[lib.CodecSymbol],
    lib.U8[lib.CodecSymbol],
    lib.U8[lib.CodecSymbol],
  ]) satisfies lib.Codec<Ipv4Addr>,
}

export type Ipv6Addr = [lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16, lib.U16]
export const Ipv6Addr = {
  [lib.CodecSymbol]: lib.tupleCodec([
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
    lib.U16[lib.CodecSymbol],
  ]) satisfies lib.Codec<Ipv6Addr>,
}

export interface MultisigApprove {
  account: lib.AccountId
  instructionsHash: lib.HashWrap
}
export const MultisigApprove: lib.CodecProvider<MultisigApprove> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigApprove>(['account', 'instructionsHash'], {
    account: lib.AccountId[lib.CodecSymbol],
    instructionsHash: lib.HashWrap[lib.CodecSymbol],
  }),
}

export interface MultisigSpec {
  signatories: lib.Map<lib.AccountId, lib.U8>
  quorum: lib.NonZero<lib.U16>
  transactionTtl: lib.NonZero<lib.Duration>
}
export const MultisigSpec: lib.CodecProvider<MultisigSpec> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigSpec>(['signatories', 'quorum', 'transactionTtl'], {
    signatories: lib.Map.with(lib.AccountId[lib.CodecSymbol], lib.U8[lib.CodecSymbol])[lib.CodecSymbol],
    quorum: lib.NonZero.with(lib.U16[lib.CodecSymbol])[lib.CodecSymbol],
    transactionTtl: lib.NonZero.with(lib.Duration[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface MultisigRegister {
  account: lib.AccountId
  spec: MultisigSpec
}
export const MultisigRegister: lib.CodecProvider<MultisigRegister> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigRegister>(['account', 'spec'], {
    account: lib.AccountId[lib.CodecSymbol],
    spec: MultisigSpec[lib.CodecSymbol],
  }),
}

export interface MultisigPropose {
  account: lib.AccountId
  instructions: lib.Vec<InstructionBox>
  transactionTtl: lib.Option<lib.NonZero<lib.Duration>>
}
export const MultisigPropose: lib.CodecProvider<MultisigPropose> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigPropose>(['account', 'instructions', 'transactionTtl'], {
    account: lib.AccountId[lib.CodecSymbol],
    instructions: lib.Vec.with(lib.lazyCodec(() => InstructionBox[lib.CodecSymbol]))[lib.CodecSymbol],
    transactionTtl: lib.Option.with(lib.NonZero.with(lib.Duration[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type MultisigInstructionBox =
  | lib.Variant<'Register', MultisigRegister>
  | lib.Variant<'Propose', MultisigPropose>
  | lib.Variant<'Approve', MultisigApprove>
export const MultisigInstructionBox = {
  Register: <const T extends MultisigRegister>(value: T): lib.Variant<'Register', T> => ({ kind: 'Register', value }),
  Propose: <const T extends MultisigPropose>(value: T): lib.Variant<'Propose', T> => ({ kind: 'Propose', value }),
  Approve: <const T extends MultisigApprove>(value: T): lib.Variant<'Approve', T> => ({ kind: 'Approve', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Register: [MultisigRegister]; Propose: [MultisigPropose]; Approve: [MultisigApprove] }>([
      [0, 'Register', MultisigRegister[lib.CodecSymbol]],
      [1, 'Propose', MultisigPropose[lib.CodecSymbol]],
      [2, 'Approve', MultisigApprove[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface MultisigProposalValue {
  instructions: lib.Vec<InstructionBox>
  proposedAt: lib.Timestamp
  expiresAt: lib.Timestamp
  approvals: lib.Vec<lib.AccountId>
  isRelayed: lib.Option<lib.Bool>
}
export const MultisigProposalValue: lib.CodecProvider<MultisigProposalValue> = {
  [lib.CodecSymbol]: lib.structCodec<MultisigProposalValue>(
    ['instructions', 'proposedAt', 'expiresAt', 'approvals', 'isRelayed'],
    {
      instructions: lib.Vec.with(lib.lazyCodec(() => InstructionBox[lib.CodecSymbol]))[lib.CodecSymbol],
      proposedAt: lib.Timestamp[lib.CodecSymbol],
      expiresAt: lib.Timestamp[lib.CodecSymbol],
      approvals: lib.Vec.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol],
      isRelayed: lib.Option.with(lib.Bool[lib.CodecSymbol])[lib.CodecSymbol],
    },
  ),
}

export interface Pagination {
  limit: lib.Option<lib.NonZero<lib.U64>>
  offset: lib.U64
}
export const Pagination: lib.CodecProvider<Pagination> = {
  [lib.CodecSymbol]: lib.structCodec<Pagination>(['limit', 'offset'], {
    limit: lib.Option.with(lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
    offset: lib.U64[lib.CodecSymbol],
  }),
}

export interface SumeragiParameters {
  blockTime: lib.Duration
  commitTime: lib.Duration
  maxClockDrift: lib.Duration
}
export const SumeragiParameters: lib.CodecProvider<SumeragiParameters> = {
  [lib.CodecSymbol]: lib.structCodec<SumeragiParameters>(['blockTime', 'commitTime', 'maxClockDrift'], {
    blockTime: lib.Duration[lib.CodecSymbol],
    commitTime: lib.Duration[lib.CodecSymbol],
    maxClockDrift: lib.Duration[lib.CodecSymbol],
  }),
}

export interface TransactionParameters {
  maxInstructions: lib.NonZero<lib.U64>
  smartContractSize: lib.NonZero<lib.U64>
}
export const TransactionParameters: lib.CodecProvider<TransactionParameters> = {
  [lib.CodecSymbol]: lib.structCodec<TransactionParameters>(['maxInstructions', 'smartContractSize'], {
    maxInstructions: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
    smartContractSize: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface SmartContractParameters {
  fuel: lib.NonZero<lib.U64>
  memory: lib.NonZero<lib.U64>
}
export const SmartContractParameters: lib.CodecProvider<SmartContractParameters> = {
  [lib.CodecSymbol]: lib.structCodec<SmartContractParameters>(['fuel', 'memory'], {
    fuel: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
    memory: lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface Parameters {
  sumeragi: SumeragiParameters
  block: BlockParameters
  transaction: TransactionParameters
  executor: SmartContractParameters
  smartContract: SmartContractParameters
  custom: lib.Map<CustomParameterId, CustomParameter>
}
export const Parameters: lib.CodecProvider<Parameters> = {
  [lib.CodecSymbol]: lib.structCodec<Parameters>(
    ['sumeragi', 'block', 'transaction', 'executor', 'smartContract', 'custom'],
    {
      sumeragi: SumeragiParameters[lib.CodecSymbol],
      block: BlockParameters[lib.CodecSymbol],
      transaction: TransactionParameters[lib.CodecSymbol],
      executor: SmartContractParameters[lib.CodecSymbol],
      smartContract: SmartContractParameters[lib.CodecSymbol],
      custom: lib.Map.with(CustomParameterId[lib.CodecSymbol], CustomParameter[lib.CodecSymbol])[lib.CodecSymbol],
    },
  ),
}

export interface SocketAddrV4 {
  ip: Ipv4Addr
  port: lib.U16
}
export const SocketAddrV4: lib.CodecProvider<SocketAddrV4> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrV4>(['ip', 'port'], {
    ip: Ipv4Addr[lib.CodecSymbol],
    port: lib.U16[lib.CodecSymbol],
  }),
}

export interface SocketAddrV6 {
  ip: Ipv6Addr
  port: lib.U16
}
export const SocketAddrV6: lib.CodecProvider<SocketAddrV6> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrV6>(['ip', 'port'], {
    ip: Ipv6Addr[lib.CodecSymbol],
    port: lib.U16[lib.CodecSymbol],
  }),
}

export interface SocketAddrHost {
  host: lib.String
  port: lib.U16
}
export const SocketAddrHost: lib.CodecProvider<SocketAddrHost> = {
  [lib.CodecSymbol]: lib.structCodec<SocketAddrHost>(['host', 'port'], {
    host: lib.String[lib.CodecSymbol],
    port: lib.U16[lib.CodecSymbol],
  }),
}

export type SocketAddr =
  | lib.Variant<'Ipv4', SocketAddrV4>
  | lib.Variant<'Ipv6', SocketAddrV6>
  | lib.Variant<'Host', SocketAddrHost>
export const SocketAddr = {
  Ipv4: <const T extends SocketAddrV4>(value: T): lib.Variant<'Ipv4', T> => ({ kind: 'Ipv4', value }),
  Ipv6: <const T extends SocketAddrV6>(value: T): lib.Variant<'Ipv6', T> => ({ kind: 'Ipv6', value }),
  Host: <const T extends SocketAddrHost>(value: T): lib.Variant<'Host', T> => ({ kind: 'Host', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Ipv4: [SocketAddrV4]; Ipv6: [SocketAddrV6]; Host: [SocketAddrHost] }>([
      [0, 'Ipv4', SocketAddrV4[lib.CodecSymbol]],
      [1, 'Ipv6', SocketAddrV6[lib.CodecSymbol]],
      [2, 'Host', SocketAddrHost[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface Peer {
  address: SocketAddr
  id: PeerId
}
export const Peer: lib.CodecProvider<Peer> = {
  [lib.CodecSymbol]: lib.structCodec<Peer>(['address', 'id'], {
    address: SocketAddr[lib.CodecSymbol],
    id: PeerId[lib.CodecSymbol],
  }),
}

export type PeerIdPredicateAtom = never
export const PeerIdPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type PeerIdProjectionPredicate =
  | lib.Variant<'Atom', PeerIdPredicateAtom>
  | lib.Variant<'PublicKey', PublicKeyProjectionPredicate>
export const PeerIdProjectionPredicate = {
  Atom: {},
  PublicKey: {
    Atom: {
      Equals: <const T extends lib.PublicKeyWrap>(
        value: T,
      ): lib.Variant<'PublicKey', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'PublicKey',
        value: PublicKeyProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PeerIdPredicateAtom]; PublicKey: [PublicKeyProjectionPredicate] }>([
      [0, 'Atom', PeerIdPredicateAtom[lib.CodecSymbol]],
      [1, 'PublicKey', PublicKeyProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type PeerIdProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'PublicKey', PublicKeyProjectionSelector>
export const PeerIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  PublicKey: {
    Atom: Object.freeze<lib.Variant<'PublicKey', lib.VariantUnit<'Atom'>>>({
      kind: 'PublicKey',
      value: PublicKeyProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; PublicKey: [PublicKeyProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'PublicKey', PublicKeyProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type PermissionPredicateAtom = never
export const PermissionPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type PermissionProjectionPredicate = lib.Variant<'Atom', PermissionPredicateAtom>
export const PermissionProjectionPredicate = {
  Atom: {},
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [PermissionPredicateAtom] }>([[0, 'Atom', PermissionPredicateAtom[lib.CodecSymbol]]])
    .discriminated(),
}

export type PermissionProjectionSelector = lib.VariantUnit<'Atom'>
export const PermissionProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
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

export type RoleIdPredicateAtom = lib.Variant<'Equals', RoleId>
export const RoleIdPredicateAtom = {
  Equals: <const T extends RoleId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib.enumCodec<{ Equals: [RoleId] }>([[0, 'Equals', RoleId[lib.CodecSymbol]]]).discriminated(),
}

export type RoleIdProjectionPredicate =
  | lib.Variant<'Atom', RoleIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
export const RoleIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends RoleId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: RoleIdPredicateAtom.Equals(value),
    }),
  },
  Name: {
    Atom: {
      Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [RoleIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', RoleIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Name', NameProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type RoleProjectionPredicate =
  | lib.Variant<'Atom', RolePredicateAtom>
  | lib.Variant<'Id', RoleIdProjectionPredicate>
export const RoleProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends RoleId>(value: T): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: RoleIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [RolePredicateAtom]; Id: [RoleIdProjectionPredicate] }>([
      [0, 'Atom', RolePredicateAtom[lib.CodecSymbol]],
      [1, 'Id', RoleIdProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type RoleIdProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Name', NameProjectionSelector>
export const RoleIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Name: {
    Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', NameProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type RoleProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Id', RoleIdProjectionSelector>
export const RoleProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: RoleIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: RoleIdProjectionSelector.Name.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [RoleIdProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', RoleIdProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TriggerIdPredicateAtom = lib.Variant<'Equals', TriggerId>
export const TriggerIdPredicateAtom = {
  Equals: <const T extends TriggerId>(value: T): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Equals: [TriggerId] }>([[0, 'Equals', TriggerId[lib.CodecSymbol]]])
    .discriminated(),
}

export type TriggerIdProjectionPredicate =
  | lib.Variant<'Atom', TriggerIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
export const TriggerIdProjectionPredicate = {
  Atom: {
    Equals: <const T extends TriggerId>(value: T): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: TriggerIdPredicateAtom.Equals(value),
    }),
  },
  Name: {
    Atom: {
      Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }),
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }),
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }),
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>> => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [TriggerIdPredicateAtom]; Name: [NameProjectionPredicate] }>([
      [0, 'Atom', TriggerIdPredicateAtom[lib.CodecSymbol]],
      [1, 'Name', NameProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TriggerIdProjectionSelector = lib.VariantUnit<'Atom'> | lib.Variant<'Name', NameProjectionSelector>
export const TriggerIdProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Name: {
    Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Name', NameProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TriggerPredicateAtom = never
export const TriggerPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type TriggerProjectionPredicate =
  | lib.Variant<'Atom', TriggerPredicateAtom>
  | lib.Variant<'Id', TriggerIdProjectionPredicate>
  | lib.Variant<'Action', ActionProjectionPredicate>
export const TriggerProjectionPredicate = {
  Atom: {},
  Id: {
    Atom: {
      Equals: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: TriggerIdProjectionPredicate.Atom.Equals(value),
      }),
    },
    Name: {
      Atom: {
        Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Equals(value),
        }),
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>> => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Contains(value),
        }),
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>> => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.StartsWith(value),
        }),
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<'Id', lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>> => ({
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
      Key: <const T extends MetadataKeyProjectionPredicate>(
        value: T,
      ): lib.Variant<'Action', lib.Variant<'Metadata', lib.Variant<'Key', T>>> => ({
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
      [0, 'Atom', TriggerPredicateAtom[lib.CodecSymbol]],
      [1, 'Id', TriggerIdProjectionPredicate[lib.CodecSymbol]],
      [2, 'Action', ActionProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type TriggerProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', TriggerIdProjectionSelector>
  | lib.Variant<'Action', ActionProjectionSelector>
export const TriggerProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Id: {
    Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: TriggerIdProjectionSelector.Atom,
    }),
    Name: {
      Atom: Object.freeze<lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>>({
        kind: 'Id',
        value: TriggerIdProjectionSelector.Name.Atom,
      }),
    },
  },
  Action: {
    Atom: Object.freeze<lib.Variant<'Action', lib.VariantUnit<'Atom'>>>({
      kind: 'Action',
      value: ActionProjectionSelector.Atom,
    }),
    Metadata: {
      Atom: Object.freeze<lib.Variant<'Action', lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>>({
        kind: 'Action',
        value: ActionProjectionSelector.Metadata.Atom,
      }),
      Key: <const T extends MetadataKeyProjectionSelector>(
        value: T,
      ): lib.Variant<'Action', lib.Variant<'Metadata', lib.Variant<'Key', T>>> => ({
        kind: 'Action',
        value: ActionProjectionSelector.Metadata.Key(value),
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Id: [TriggerIdProjectionSelector]; Action: [ActionProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Id', TriggerIdProjectionSelector[lib.CodecSymbol]],
      [2, 'Action', ActionProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type SignedBlockPredicateAtom = never
export const SignedBlockPredicateAtom = { [lib.CodecSymbol]: lib.neverCodec }

export type SignedBlockProjectionPredicate =
  | lib.Variant<'Atom', SignedBlockPredicateAtom>
  | lib.Variant<'Header', BlockHeaderProjectionPredicate>
export const SignedBlockProjectionPredicate = {
  Atom: {},
  Header: {
    Atom: {},
    Hash: {
      Atom: {
        Equals: <const T extends lib.HashWrap>(
          value: T,
        ): lib.Variant<'Header', lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>>> => ({
          kind: 'Header',
          value: BlockHeaderProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: [SignedBlockPredicateAtom]; Header: [BlockHeaderProjectionPredicate] }>([
      [0, 'Atom', SignedBlockPredicateAtom[lib.CodecSymbol]],
      [1, 'Header', BlockHeaderProjectionPredicate[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type SignedBlockProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Header', BlockHeaderProjectionSelector>
export const SignedBlockProjectionSelector = {
  Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  Header: {
    Atom: Object.freeze<lib.Variant<'Header', lib.VariantUnit<'Atom'>>>({
      kind: 'Header',
      value: BlockHeaderProjectionSelector.Atom,
    }),
    Hash: {
      Atom: Object.freeze<lib.Variant<'Header', lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>>({
        kind: 'Header',
        value: BlockHeaderProjectionSelector.Hash.Atom,
      }),
    },
  },
  [lib.CodecSymbol]: lib
    .enumCodec<{ Atom: []; Header: [BlockHeaderProjectionSelector] }>([
      [0, 'Atom'],
      [1, 'Header', BlockHeaderProjectionSelector[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type QueryBox =
  | lib.Variant<
      'FindDomains',
      QueryWithFilter<null, lib.CompoundPredicate<DomainProjectionPredicate>, lib.Vec<DomainProjectionSelector>>
    >
  | lib.Variant<
      'FindAccounts',
      QueryWithFilter<null, lib.CompoundPredicate<AccountProjectionPredicate>, lib.Vec<AccountProjectionSelector>>
    >
  | lib.Variant<
      'FindAssets',
      QueryWithFilter<null, lib.CompoundPredicate<AssetProjectionPredicate>, lib.Vec<AssetProjectionSelector>>
    >
  | lib.Variant<
      'FindAssetsDefinitions',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
        lib.Vec<AssetDefinitionProjectionSelector>
      >
    >
  | lib.Variant<
      'FindRoles',
      QueryWithFilter<null, lib.CompoundPredicate<RoleProjectionPredicate>, lib.Vec<RoleProjectionSelector>>
    >
  | lib.Variant<
      'FindRoleIds',
      QueryWithFilter<null, lib.CompoundPredicate<RoleIdProjectionPredicate>, lib.Vec<RoleIdProjectionSelector>>
    >
  | lib.Variant<
      'FindPermissionsByAccountId',
      QueryWithFilter<
        FindPermissionsByAccountId,
        lib.CompoundPredicate<PermissionProjectionPredicate>,
        lib.Vec<PermissionProjectionSelector>
      >
    >
  | lib.Variant<
      'FindRolesByAccountId',
      QueryWithFilter<
        FindRolesByAccountId,
        lib.CompoundPredicate<RoleIdProjectionPredicate>,
        lib.Vec<RoleIdProjectionSelector>
      >
    >
  | lib.Variant<
      'FindAccountsWithAsset',
      QueryWithFilter<
        FindAccountsWithAsset,
        lib.CompoundPredicate<AccountProjectionPredicate>,
        lib.Vec<AccountProjectionSelector>
      >
    >
  | lib.Variant<
      'FindPeers',
      QueryWithFilter<null, lib.CompoundPredicate<PeerIdProjectionPredicate>, lib.Vec<PeerIdProjectionSelector>>
    >
  | lib.Variant<
      'FindActiveTriggerIds',
      QueryWithFilter<null, lib.CompoundPredicate<TriggerIdProjectionPredicate>, lib.Vec<TriggerIdProjectionSelector>>
    >
  | lib.Variant<
      'FindTriggers',
      QueryWithFilter<null, lib.CompoundPredicate<TriggerProjectionPredicate>, lib.Vec<TriggerProjectionSelector>>
    >
  | lib.Variant<
      'FindTransactions',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
        lib.Vec<CommittedTransactionProjectionSelector>
      >
    >
  | lib.Variant<
      'FindBlocks',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<SignedBlockProjectionPredicate>,
        lib.Vec<SignedBlockProjectionSelector>
      >
    >
  | lib.Variant<
      'FindBlockHeaders',
      QueryWithFilter<
        null,
        lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
        lib.Vec<BlockHeaderProjectionSelector>
      >
    >
export const QueryBox = {
  FindDomains: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<DomainProjectionPredicate>,
      lib.Vec<DomainProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindDomains', T> => ({ kind: 'FindDomains', value }),
  FindAccounts: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindAccounts', T> => ({ kind: 'FindAccounts', value }),
  FindAssets: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetProjectionPredicate>,
      lib.Vec<AssetProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindAssets', T> => ({ kind: 'FindAssets', value }),
  FindAssetsDefinitions: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
      lib.Vec<AssetDefinitionProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindAssetsDefinitions', T> => ({ kind: 'FindAssetsDefinitions', value }),
  FindRoles: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleProjectionPredicate>,
      lib.Vec<RoleProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindRoles', T> => ({ kind: 'FindRoles', value }),
  FindRoleIds: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindRoleIds', T> => ({ kind: 'FindRoleIds', value }),
  FindPermissionsByAccountId: <
    const T extends QueryWithFilter<
      FindPermissionsByAccountId,
      lib.CompoundPredicate<PermissionProjectionPredicate>,
      lib.Vec<PermissionProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindPermissionsByAccountId', T> => ({ kind: 'FindPermissionsByAccountId', value }),
  FindRolesByAccountId: <
    const T extends QueryWithFilter<
      FindRolesByAccountId,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindRolesByAccountId', T> => ({ kind: 'FindRolesByAccountId', value }),
  FindAccountsWithAsset: <
    const T extends QueryWithFilter<
      FindAccountsWithAsset,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindAccountsWithAsset', T> => ({ kind: 'FindAccountsWithAsset', value }),
  FindPeers: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<PeerIdProjectionPredicate>,
      lib.Vec<PeerIdProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindPeers', T> => ({ kind: 'FindPeers', value }),
  FindActiveTriggerIds: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerIdProjectionPredicate>,
      lib.Vec<TriggerIdProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindActiveTriggerIds', T> => ({ kind: 'FindActiveTriggerIds', value }),
  FindTriggers: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerProjectionPredicate>,
      lib.Vec<TriggerProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindTriggers', T> => ({ kind: 'FindTriggers', value }),
  FindTransactions: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
      lib.Vec<CommittedTransactionProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindTransactions', T> => ({ kind: 'FindTransactions', value }),
  FindBlocks: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<SignedBlockProjectionPredicate>,
      lib.Vec<SignedBlockProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindBlocks', T> => ({ kind: 'FindBlocks', value }),
  FindBlockHeaders: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
      lib.Vec<BlockHeaderProjectionSelector>
    >,
  >(
    value: T,
  ): lib.Variant<'FindBlockHeaders', T> => ({ kind: 'FindBlockHeaders', value }),
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
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(DomainProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(DomainProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        1,
        'FindAccounts',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(AccountProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(AccountProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        2,
        'FindAssets',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(AssetProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(AssetProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        3,
        'FindAssetsDefinitions',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(AssetDefinitionProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(AssetDefinitionProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        4,
        'FindRoles',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(RoleProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(RoleProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        5,
        'FindRoleIds',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(RoleIdProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(RoleIdProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        6,
        'FindPermissionsByAccountId',
        QueryWithFilter.with(
          FindPermissionsByAccountId[lib.CodecSymbol],
          lib.CompoundPredicate.with(PermissionProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(PermissionProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        7,
        'FindRolesByAccountId',
        QueryWithFilter.with(
          FindRolesByAccountId[lib.CodecSymbol],
          lib.CompoundPredicate.with(RoleIdProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(RoleIdProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        8,
        'FindAccountsWithAsset',
        QueryWithFilter.with(
          FindAccountsWithAsset[lib.CodecSymbol],
          lib.CompoundPredicate.with(AccountProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(AccountProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        9,
        'FindPeers',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(PeerIdProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(PeerIdProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        10,
        'FindActiveTriggerIds',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(TriggerIdProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(TriggerIdProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        11,
        'FindTriggers',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(TriggerProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(TriggerProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        12,
        'FindTransactions',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(CommittedTransactionProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(CommittedTransactionProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        13,
        'FindBlocks',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(SignedBlockProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(SignedBlockProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
      [
        14,
        'FindBlockHeaders',
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(BlockHeaderProjectionPredicate[lib.CodecSymbol])[lib.CodecSymbol],
          lib.Vec.with(BlockHeaderProjectionSelector[lib.CodecSymbol])[lib.CodecSymbol],
        )[lib.CodecSymbol],
      ],
    ])
    .discriminated(),
}

export type QueryOutputBatchBox =
  | lib.Variant<'PublicKey', lib.Vec<lib.PublicKeyWrap>>
  | lib.Variant<'String', lib.Vec<lib.String>>
  | lib.Variant<'Metadata', lib.Vec<Metadata>>
  | lib.Variant<'Json', lib.Vec<lib.Json>>
  | lib.Variant<'Numeric', lib.Vec<Numeric>>
  | lib.Variant<'Name', lib.Vec<lib.Name>>
  | lib.Variant<'DomainId', lib.Vec<lib.DomainId>>
  | lib.Variant<'Domain', lib.Vec<Domain>>
  | lib.Variant<'AccountId', lib.Vec<lib.AccountId>>
  | lib.Variant<'Account', lib.Vec<Account>>
  | lib.Variant<'AssetId', lib.Vec<lib.AssetId>>
  | lib.Variant<'Asset', lib.Vec<Asset>>
  | lib.Variant<'AssetValue', lib.Vec<AssetValue>>
  | lib.Variant<'AssetDefinitionId', lib.Vec<lib.AssetDefinitionId>>
  | lib.Variant<'AssetDefinition', lib.Vec<AssetDefinition>>
  | lib.Variant<'Role', lib.Vec<Role>>
  | lib.Variant<'Parameter', lib.Vec<Parameter>>
  | lib.Variant<'Permission', lib.Vec<Permission>>
  | lib.Variant<'CommittedTransaction', lib.Vec<CommittedTransaction>>
  | lib.Variant<'SignedTransaction', lib.Vec<SignedTransaction>>
  | lib.Variant<'TransactionHash', lib.Vec<lib.HashWrap>>
  | lib.Variant<'TransactionRejectionReason', lib.Vec<lib.Option<TransactionRejectionReason>>>
  | lib.Variant<'Peer', lib.Vec<PeerId>>
  | lib.Variant<'RoleId', lib.Vec<RoleId>>
  | lib.Variant<'TriggerId', lib.Vec<TriggerId>>
  | lib.Variant<'Trigger', lib.Vec<Trigger>>
  | lib.Variant<'Action', lib.Vec<Action>>
  | lib.Variant<'Block', lib.Vec<SignedBlock>>
  | lib.Variant<'BlockHeader', lib.Vec<BlockHeader>>
  | lib.Variant<'BlockHeaderHash', lib.Vec<lib.HashWrap>>
export const QueryOutputBatchBox = {
  PublicKey: <const T extends lib.Vec<lib.PublicKeyWrap>>(value: T): lib.Variant<'PublicKey', T> => ({
    kind: 'PublicKey',
    value,
  }),
  String: <const T extends lib.Vec<lib.String>>(value: T): lib.Variant<'String', T> => ({ kind: 'String', value }),
  Metadata: <const T extends lib.Vec<Metadata>>(value: T): lib.Variant<'Metadata', T> => ({ kind: 'Metadata', value }),
  Json: <const T extends lib.Vec<lib.Json>>(value: T): lib.Variant<'Json', T> => ({ kind: 'Json', value }),
  Numeric: <const T extends lib.Vec<Numeric>>(value: T): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }),
  Name: <const T extends lib.Vec<lib.Name>>(value: T): lib.Variant<'Name', T> => ({ kind: 'Name', value }),
  DomainId: <const T extends lib.Vec<lib.DomainId>>(value: T): lib.Variant<'DomainId', T> => ({
    kind: 'DomainId',
    value,
  }),
  Domain: <const T extends lib.Vec<Domain>>(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }),
  AccountId: <const T extends lib.Vec<lib.AccountId>>(value: T): lib.Variant<'AccountId', T> => ({
    kind: 'AccountId',
    value,
  }),
  Account: <const T extends lib.Vec<Account>>(value: T): lib.Variant<'Account', T> => ({ kind: 'Account', value }),
  AssetId: <const T extends lib.Vec<lib.AssetId>>(value: T): lib.Variant<'AssetId', T> => ({ kind: 'AssetId', value }),
  Asset: <const T extends lib.Vec<Asset>>(value: T): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }),
  AssetValue: <const T extends lib.Vec<AssetValue>>(value: T): lib.Variant<'AssetValue', T> => ({
    kind: 'AssetValue',
    value,
  }),
  AssetDefinitionId: <const T extends lib.Vec<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinitionId', T> => ({ kind: 'AssetDefinitionId', value }),
  AssetDefinition: <const T extends lib.Vec<AssetDefinition>>(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }),
  Role: <const T extends lib.Vec<Role>>(value: T): lib.Variant<'Role', T> => ({ kind: 'Role', value }),
  Parameter: <const T extends lib.Vec<Parameter>>(value: T): lib.Variant<'Parameter', T> => ({
    kind: 'Parameter',
    value,
  }),
  Permission: <const T extends lib.Vec<Permission>>(value: T): lib.Variant<'Permission', T> => ({
    kind: 'Permission',
    value,
  }),
  CommittedTransaction: <const T extends lib.Vec<CommittedTransaction>>(
    value: T,
  ): lib.Variant<'CommittedTransaction', T> => ({ kind: 'CommittedTransaction', value }),
  SignedTransaction: <const T extends lib.Vec<SignedTransaction>>(value: T): lib.Variant<'SignedTransaction', T> => ({
    kind: 'SignedTransaction',
    value,
  }),
  TransactionHash: <const T extends lib.Vec<lib.HashWrap>>(value: T): lib.Variant<'TransactionHash', T> => ({
    kind: 'TransactionHash',
    value,
  }),
  TransactionRejectionReason: <const T extends lib.Vec<lib.Option<TransactionRejectionReason>>>(
    value: T,
  ): lib.Variant<'TransactionRejectionReason', T> => ({ kind: 'TransactionRejectionReason', value }),
  Peer: <const T extends lib.Vec<PeerId>>(value: T): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }),
  RoleId: <const T extends lib.Vec<RoleId>>(value: T): lib.Variant<'RoleId', T> => ({ kind: 'RoleId', value }),
  TriggerId: <const T extends lib.Vec<TriggerId>>(value: T): lib.Variant<'TriggerId', T> => ({
    kind: 'TriggerId',
    value,
  }),
  Trigger: <const T extends lib.Vec<Trigger>>(value: T): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  Action: <const T extends lib.Vec<Action>>(value: T): lib.Variant<'Action', T> => ({ kind: 'Action', value }),
  Block: <const T extends lib.Vec<SignedBlock>>(value: T): lib.Variant<'Block', T> => ({ kind: 'Block', value }),
  BlockHeader: <const T extends lib.Vec<BlockHeader>>(value: T): lib.Variant<'BlockHeader', T> => ({
    kind: 'BlockHeader',
    value,
  }),
  BlockHeaderHash: <const T extends lib.Vec<lib.HashWrap>>(value: T): lib.Variant<'BlockHeaderHash', T> => ({
    kind: 'BlockHeaderHash',
    value,
  }),
  [lib.CodecSymbol]: lib
    .enumCodec<{
      PublicKey: [lib.Vec<lib.PublicKeyWrap>]
      String: [lib.Vec<lib.String>]
      Metadata: [lib.Vec<Metadata>]
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
      [0, 'PublicKey', lib.Vec.with(lib.PublicKeyWrap[lib.CodecSymbol])[lib.CodecSymbol]],
      [1, 'String', lib.Vec.with(lib.String[lib.CodecSymbol])[lib.CodecSymbol]],
      [2, 'Metadata', lib.Vec.with(Metadata[lib.CodecSymbol])[lib.CodecSymbol]],
      [3, 'Json', lib.Vec.with(lib.Json[lib.CodecSymbol])[lib.CodecSymbol]],
      [4, 'Numeric', lib.Vec.with(Numeric[lib.CodecSymbol])[lib.CodecSymbol]],
      [5, 'Name', lib.Vec.with(lib.Name[lib.CodecSymbol])[lib.CodecSymbol]],
      [6, 'DomainId', lib.Vec.with(lib.DomainId[lib.CodecSymbol])[lib.CodecSymbol]],
      [7, 'Domain', lib.Vec.with(Domain[lib.CodecSymbol])[lib.CodecSymbol]],
      [8, 'AccountId', lib.Vec.with(lib.AccountId[lib.CodecSymbol])[lib.CodecSymbol]],
      [9, 'Account', lib.Vec.with(Account[lib.CodecSymbol])[lib.CodecSymbol]],
      [10, 'AssetId', lib.Vec.with(lib.AssetId[lib.CodecSymbol])[lib.CodecSymbol]],
      [11, 'Asset', lib.Vec.with(Asset[lib.CodecSymbol])[lib.CodecSymbol]],
      [12, 'AssetValue', lib.Vec.with(AssetValue[lib.CodecSymbol])[lib.CodecSymbol]],
      [13, 'AssetDefinitionId', lib.Vec.with(lib.AssetDefinitionId[lib.CodecSymbol])[lib.CodecSymbol]],
      [14, 'AssetDefinition', lib.Vec.with(AssetDefinition[lib.CodecSymbol])[lib.CodecSymbol]],
      [15, 'Role', lib.Vec.with(Role[lib.CodecSymbol])[lib.CodecSymbol]],
      [16, 'Parameter', lib.Vec.with(Parameter[lib.CodecSymbol])[lib.CodecSymbol]],
      [17, 'Permission', lib.Vec.with(Permission[lib.CodecSymbol])[lib.CodecSymbol]],
      [18, 'CommittedTransaction', lib.Vec.with(CommittedTransaction[lib.CodecSymbol])[lib.CodecSymbol]],
      [19, 'SignedTransaction', lib.Vec.with(SignedTransaction[lib.CodecSymbol])[lib.CodecSymbol]],
      [20, 'TransactionHash', lib.Vec.with(lib.HashWrap[lib.CodecSymbol])[lib.CodecSymbol]],
      [
        21,
        'TransactionRejectionReason',
        lib.Vec.with(lib.Option.with(TransactionRejectionReason[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
      ],
      [22, 'Peer', lib.Vec.with(PeerId[lib.CodecSymbol])[lib.CodecSymbol]],
      [23, 'RoleId', lib.Vec.with(RoleId[lib.CodecSymbol])[lib.CodecSymbol]],
      [24, 'TriggerId', lib.Vec.with(TriggerId[lib.CodecSymbol])[lib.CodecSymbol]],
      [25, 'Trigger', lib.Vec.with(Trigger[lib.CodecSymbol])[lib.CodecSymbol]],
      [26, 'Action', lib.Vec.with(Action[lib.CodecSymbol])[lib.CodecSymbol]],
      [27, 'Block', lib.Vec.with(SignedBlock[lib.CodecSymbol])[lib.CodecSymbol]],
      [28, 'BlockHeader', lib.Vec.with(BlockHeader[lib.CodecSymbol])[lib.CodecSymbol]],
      [29, 'BlockHeaderHash', lib.Vec.with(lib.HashWrap[lib.CodecSymbol])[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type QueryOutputBatchBoxTuple = lib.Vec<QueryOutputBatchBox>
export const QueryOutputBatchBoxTuple = lib.Vec.with(QueryOutputBatchBox[lib.CodecSymbol])

export interface QueryOutput {
  batch: QueryOutputBatchBoxTuple
  remainingItems: lib.U64
  continueCursor: lib.Option<ForwardCursor>
}
export const QueryOutput: lib.CodecProvider<QueryOutput> = {
  [lib.CodecSymbol]: lib.structCodec<QueryOutput>(['batch', 'remainingItems', 'continueCursor'], {
    batch: QueryOutputBatchBoxTuple[lib.CodecSymbol],
    remainingItems: lib.U64[lib.CodecSymbol],
    continueCursor: lib.Option.with(ForwardCursor[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface Sorting {
  sortByMetadataKey: lib.Option<lib.Name>
}
export const Sorting: lib.CodecProvider<Sorting> = {
  [lib.CodecSymbol]: lib.structCodec<Sorting>(['sortByMetadataKey'], {
    sortByMetadataKey: lib.Option.with(lib.Name[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export interface QueryParams {
  pagination: Pagination
  sorting: Sorting
  fetchSize: lib.Option<lib.NonZero<lib.U64>>
}
export const QueryParams: lib.CodecProvider<QueryParams> = {
  [lib.CodecSymbol]: lib.structCodec<QueryParams>(['pagination', 'sorting', 'fetchSize'], {
    pagination: Pagination[lib.CodecSymbol],
    sorting: Sorting[lib.CodecSymbol],
    fetchSize: lib.Option.with(lib.NonZero.with(lib.U64[lib.CodecSymbol])[lib.CodecSymbol])[lib.CodecSymbol],
  }),
}

export type SingularQueryBox = lib.VariantUnit<'FindExecutorDataModel'> | lib.VariantUnit<'FindParameters'>
export const SingularQueryBox = {
  FindExecutorDataModel: Object.freeze<lib.VariantUnit<'FindExecutorDataModel'>>({ kind: 'FindExecutorDataModel' }),
  FindParameters: Object.freeze<lib.VariantUnit<'FindParameters'>>({ kind: 'FindParameters' }),
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
    query: QueryBox[lib.CodecSymbol],
    params: QueryParams[lib.CodecSymbol],
  }),
}

export type QueryRequest =
  | lib.Variant<'Singular', SingularQueryBox>
  | lib.Variant<'Start', QueryWithParams>
  | lib.Variant<'Continue', ForwardCursor>
export const QueryRequest = {
  Singular: {
    FindExecutorDataModel: Object.freeze<lib.Variant<'Singular', lib.VariantUnit<'FindExecutorDataModel'>>>({
      kind: 'Singular',
      value: SingularQueryBox.FindExecutorDataModel,
    }),
    FindParameters: Object.freeze<lib.Variant<'Singular', lib.VariantUnit<'FindParameters'>>>({
      kind: 'Singular',
      value: SingularQueryBox.FindParameters,
    }),
  },
  Start: <const T extends QueryWithParams>(value: T): lib.Variant<'Start', T> => ({ kind: 'Start', value }),
  Continue: <const T extends ForwardCursor>(value: T): lib.Variant<'Continue', T> => ({ kind: 'Continue', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Singular: [SingularQueryBox]; Start: [QueryWithParams]; Continue: [ForwardCursor] }>([
      [0, 'Singular', SingularQueryBox[lib.CodecSymbol]],
      [1, 'Start', QueryWithParams[lib.CodecSymbol]],
      [2, 'Continue', ForwardCursor[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface QueryRequestWithAuthority {
  authority: lib.AccountId
  request: QueryRequest
}
export const QueryRequestWithAuthority: lib.CodecProvider<QueryRequestWithAuthority> = {
  [lib.CodecSymbol]: lib.structCodec<QueryRequestWithAuthority>(['authority', 'request'], {
    authority: lib.AccountId[lib.CodecSymbol],
    request: QueryRequest[lib.CodecSymbol],
  }),
}

export type SingularQueryOutputBox =
  | lib.Variant<'ExecutorDataModel', ExecutorDataModel>
  | lib.Variant<'Parameters', Parameters>
export const SingularQueryOutputBox = {
  ExecutorDataModel: <const T extends ExecutorDataModel>(value: T): lib.Variant<'ExecutorDataModel', T> => ({
    kind: 'ExecutorDataModel',
    value,
  }),
  Parameters: <const T extends Parameters>(value: T): lib.Variant<'Parameters', T> => ({ kind: 'Parameters', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ ExecutorDataModel: [ExecutorDataModel]; Parameters: [Parameters] }>([
      [0, 'ExecutorDataModel', ExecutorDataModel[lib.CodecSymbol]],
      [1, 'Parameters', Parameters[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export type QueryResponse = lib.Variant<'Singular', SingularQueryOutputBox> | lib.Variant<'Iterable', QueryOutput>
export const QueryResponse = {
  Singular: {
    ExecutorDataModel: <const T extends ExecutorDataModel>(
      value: T,
    ): lib.Variant<'Singular', lib.Variant<'ExecutorDataModel', T>> => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.ExecutorDataModel(value),
    }),
    Parameters: <const T extends Parameters>(value: T): lib.Variant<'Singular', lib.Variant<'Parameters', T>> => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.Parameters(value),
    }),
  },
  Iterable: <const T extends QueryOutput>(value: T): lib.Variant<'Iterable', T> => ({ kind: 'Iterable', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ Singular: [SingularQueryOutputBox]; Iterable: [QueryOutput] }>([
      [0, 'Singular', SingularQueryOutputBox[lib.CodecSymbol]],
      [1, 'Iterable', QueryOutput[lib.CodecSymbol]],
    ])
    .discriminated(),
}

export interface RawGenesisTransaction {
  chain: ChainId
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
      chain: ChainId[lib.CodecSymbol],
      executor: lib.String[lib.CodecSymbol],
      parameters: lib.Option.with(Parameters[lib.CodecSymbol])[lib.CodecSymbol],
      instructions: lib.Vec.with(lib.lazyCodec(() => InstructionBox[lib.CodecSymbol]))[lib.CodecSymbol],
      wasmDir: lib.String[lib.CodecSymbol],
      wasmTriggers: lib.Vec.with(GenesisWasmTrigger[lib.CodecSymbol])[lib.CodecSymbol],
      topology: lib.Vec.with(PeerId[lib.CodecSymbol])[lib.CodecSymbol],
    },
  ),
}

export interface SignedQueryV1 {
  signature: lib.SignatureWrap
  payload: QueryRequestWithAuthority
}
export const SignedQueryV1: lib.CodecProvider<SignedQueryV1> = {
  [lib.CodecSymbol]: lib.structCodec<SignedQueryV1>(['signature', 'payload'], {
    signature: lib.SignatureWrap[lib.CodecSymbol],
    payload: QueryRequestWithAuthority[lib.CodecSymbol],
  }),
}

export type SignedQuery = lib.Variant<'V1', SignedQueryV1>
export const SignedQuery = {
  V1: <const T extends SignedQueryV1>(value: T): lib.Variant<'V1', T> => ({ kind: 'V1', value }),
  [lib.CodecSymbol]: lib
    .enumCodec<{ V1: [SignedQueryV1] }>([[1, 'V1', SignedQueryV1[lib.CodecSymbol]]])
    .discriminated(),
}

export interface Uptime {
  secs: lib.Compact
  nanos: lib.U32
}
export const Uptime: lib.CodecProvider<Uptime> = {
  [lib.CodecSymbol]: lib.structCodec<Uptime>(['secs', 'nanos'], {
    secs: lib.Compact[lib.CodecSymbol],
    nanos: lib.U32[lib.CodecSymbol],
  }),
}

export interface Status {
  peers: lib.Compact
  blocks: lib.Compact
  txsAccepted: lib.Compact
  txsRejected: lib.Compact
  uptime: Uptime
  viewChanges: lib.Compact
  queueSize: lib.Compact
}
export const Status: lib.CodecProvider<Status> = {
  [lib.CodecSymbol]: lib.structCodec<Status>(
    ['peers', 'blocks', 'txsAccepted', 'txsRejected', 'uptime', 'viewChanges', 'queueSize'],
    {
      peers: lib.Compact[lib.CodecSymbol],
      blocks: lib.Compact[lib.CodecSymbol],
      txsAccepted: lib.Compact[lib.CodecSymbol],
      txsRejected: lib.Compact[lib.CodecSymbol],
      uptime: Uptime[lib.CodecSymbol],
      viewChanges: lib.Compact[lib.CodecSymbol],
      queueSize: lib.Compact[lib.CodecSymbol],
    },
  ),
}

export type QuerySelectorMap = {
  FindDomains: 'Domain'
  FindAccounts: 'Account'
  FindAssets: 'Asset'
  FindAssetsDefinitions: 'AssetDefinition'
  FindRoles: 'Role'
  FindRoleIds: 'RoleId'
  FindPermissionsByAccountId: 'Permission'
  FindRolesByAccountId: 'RoleId'
  FindAccountsWithAsset: 'Account'
  FindPeers: 'PeerId'
  FindActiveTriggerIds: 'TriggerId'
  FindTriggers: 'Trigger'
  FindTransactions: 'CommittedTransaction'
  FindBlocks: 'SignedBlock'
  FindBlockHeaders: 'BlockHeader'
}

export type SelectorOutputMap = {
  AccountId: {
    Atom: 'AccountId'
    Domain: 'DomainId'
    Signatory: 'PublicKey'
  }
  Account: {
    Atom: 'Account'
    Id: 'AccountId'
    Metadata: 'Metadata'
  }
  Action: {
    Atom: 'Action'
    Metadata: 'Metadata'
  }
  AssetDefinitionId: {
    Atom: 'AssetDefinitionId'
    Domain: 'DomainId'
    Name: 'Name'
  }
  AssetDefinition: {
    Atom: 'AssetDefinition'
    Id: 'AssetDefinitionId'
    Metadata: 'Metadata'
  }
  AssetId: {
    Atom: 'AssetId'
    Account: 'AccountId'
    Definition: 'AssetDefinitionId'
  }
  Asset: {
    Atom: 'Asset'
    Id: 'AssetId'
    Value: 'AssetValue'
  }
  AssetValue: {
    Atom: 'AssetValue'
    Numeric: 'Numeric'
    Store: 'Metadata'
  }
  BlockHeaderHash: {
    Atom: 'BlockHeaderHash'
  }
  BlockHeader: {
    Atom: 'BlockHeader'
    Hash: 'BlockHeaderHash'
  }
  CommittedTransaction: {
    Atom: 'CommittedTransaction'
    BlockHash: 'BlockHeaderHash'
    Value: 'SignedTransaction'
    Error: 'TransactionError'
  }
  DomainId: {
    Atom: 'DomainId'
    Name: 'Name'
  }
  Domain: {
    Atom: 'Domain'
    Id: 'DomainId'
    Metadata: 'Metadata'
  }
  Json: {
    Atom: 'Json'
  }
  Metadata: {
    Atom: 'Metadata'
    Key: 'Json'
  }
  Name: {
    Atom: 'Name'
  }
  Numeric: {
    Atom: 'Numeric'
  }
  PeerId: {
    Atom: 'Peer'
    PublicKey: 'PublicKey'
  }
  Permission: {
    Atom: 'Permission'
  }
  PublicKey: {
    Atom: 'PublicKey'
  }
  RoleId: {
    Atom: 'RoleId'
    Name: 'Name'
  }
  Role: {
    Atom: 'Role'
    Id: 'RoleId'
  }
  SignedBlock: {
    Atom: 'Block'
    Header: 'BlockHeader'
  }
  SignedTransaction: {
    Atom: 'SignedTransaction'
    Hash: 'TransactionHash'
    Authority: 'AccountId'
  }
  TransactionError: {
    Atom: 'TransactionRejectionReason'
  }
  TransactionHash: {
    Atom: 'TransactionHash'
  }
  TriggerId: {
    Atom: 'TriggerId'
    Name: 'Name'
  }
  Trigger: {
    Atom: 'Trigger'
    Id: 'TriggerId'
    Action: 'Action'
  }
}
