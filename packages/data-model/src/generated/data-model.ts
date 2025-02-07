import * as lib from './data-model.prelude.ts'

export type Metadata = lib.BTreeMap<lib.Name, lib.Json>
export const Metadata = lib.defineCodec(
  lib.BTreeMap.with(lib.getCodec(lib.Name), lib.getCodec(lib.Json)),
)

/**
 * Structure with named fields.
 */
export interface Account {
  id: lib.AccountId
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const Account: lib.CodecContainer<Account> = lib.defineCodec(
  lib.structCodec<Account>(['id', 'metadata'], {
    id: lib.getCodec(lib.AccountId),
    metadata: lib.getCodec(Metadata),
  }),
)

/**
 * Structure with named fields.
 */
export interface Numeric {
  mantissa: lib.Compact
  scale: lib.Compact
}
/**
 * Codec of the structure.
 */
export const Numeric: lib.CodecContainer<Numeric> = lib.defineCodec(
  lib.structCodec<Numeric>(['mantissa', 'scale'], {
    mantissa: lib.getCodec(lib.Compact),
    scale: lib.getCodec(lib.Compact),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Numeric`
 * - `Store`
 *
 * TODO how to construct, how to use
 */
export type AssetValue =
  | lib.Variant<'Numeric', Numeric>
  | lib.Variant<'Store', Metadata>
/**
 * Codec and constructors for enumeration {@link AssetValue}.
 */
export const AssetValue = {
  /**
   * Constructor of variant `AssetValue.Numeric`
   */ Numeric: <const T extends Numeric>(
    value: T,
  ): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }), /**
   * Constructor of variant `AssetValue.Store`
   */
  Store: <const T extends Metadata>(value: T): lib.Variant<'Store', T> => ({
    kind: 'Store',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Numeric: [Numeric]; Store: [Metadata] }>({
      Numeric: [0, lib.getCodec(Numeric)],
      Store: [1, lib.getCodec(Metadata)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Asset {
  id: lib.AssetId
  value: AssetValue
}
/**
 * Codec of the structure.
 */
export const Asset: lib.CodecContainer<Asset> = lib.defineCodec(
  lib.structCodec<Asset>(['id', 'value'], {
    id: lib.getCodec(lib.AssetId),
    value: lib.getCodec(AssetValue),
  }),
)

/**
 * Structure with named fields.
 */
export interface AssetChanged {
  asset: lib.AssetId
  amount: AssetValue
}
/**
 * Codec of the structure.
 */
export const AssetChanged: lib.CodecContainer<AssetChanged> = lib.defineCodec(
  lib.structCodec<AssetChanged>(['asset', 'amount'], {
    asset: lib.getCodec(lib.AssetId),
    amount: lib.getCodec(AssetValue),
  }),
)

/**
 * Structure with named fields and generic parameters.
 */
export interface MetadataChanged<T0> {
  target: T0
  key: lib.Name
  value: lib.Json
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const MetadataChanged = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0>(t0: lib.GenCodec<T0>): lib.GenCodec<MetadataChanged<T0>> =>
    lib.structCodec<MetadataChanged<T0>>(['target', 'key', 'value'], {
      target: t0,
      key: lib.getCodec(lib.Name),
      value: lib.getCodec(lib.Json),
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `Added`
 * - `Removed`
 * - `MetadataInserted`
 * - `MetadataRemoved`
 *
 * TODO how to construct, how to use
 */
export type AssetEvent =
  | lib.Variant<'Created', Asset>
  | lib.Variant<'Deleted', lib.AssetId>
  | lib.Variant<'Added', AssetChanged>
  | lib.Variant<'Removed', AssetChanged>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.AssetId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.AssetId>>
/**
 * Codec and constructors for enumeration {@link AssetEvent}.
 */
export const AssetEvent = {
  /**
   * Constructor of variant `AssetEvent.Created`
   */ Created: <const T extends Asset>(
    value: T,
  ): lib.Variant<'Created', T> => ({ kind: 'Created', value }), /**
   * Constructor of variant `AssetEvent.Deleted`
   */
  Deleted: <const T extends lib.AssetId>(
    value: T,
  ): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }), /**
   * Constructor of variant `AssetEvent.Added`
   */
  Added: <const T extends AssetChanged>(value: T): lib.Variant<'Added', T> => ({
    kind: 'Added',
    value,
  }), /**
   * Constructor of variant `AssetEvent.Removed`
   */
  Removed: <const T extends AssetChanged>(
    value: T,
  ): lib.Variant<'Removed', T> => ({ kind: 'Removed', value }), /**
   * Constructor of variant `AssetEvent.MetadataInserted`
   */
  MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }), /**
   * Constructor of variant `AssetEvent.MetadataRemoved`
   */
  MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({ kind: 'MetadataRemoved', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [Asset]
        Deleted: [lib.AssetId]
        Added: [AssetChanged]
        Removed: [AssetChanged]
        MetadataInserted: [MetadataChanged<lib.AssetId>]
        MetadataRemoved: [MetadataChanged<lib.AssetId>]
      }
    >({
      Created: [0, lib.getCodec(Asset)],
      Deleted: [1, lib.getCodec(lib.AssetId)],
      Added: [2, lib.getCodec(AssetChanged)],
      Removed: [3, lib.getCodec(AssetChanged)],
      MetadataInserted: [4, MetadataChanged.with(lib.getCodec(lib.AssetId))],
      MetadataRemoved: [5, MetadataChanged.with(lib.getCodec(lib.AssetId))],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Permission {
  name: lib.String
  payload: lib.Json
}
/**
 * Codec of the structure.
 */
export const Permission: lib.CodecContainer<Permission> = lib.defineCodec(
  lib.structCodec<Permission>(['name', 'payload'], {
    name: lib.getCodec(lib.String),
    payload: lib.getCodec(lib.Json),
  }),
)

/**
 * Structure with named fields.
 */
export interface AccountPermissionChanged {
  account: lib.AccountId
  permission: Permission
}
/**
 * Codec of the structure.
 */
export const AccountPermissionChanged: lib.CodecContainer<
  AccountPermissionChanged
> = lib.defineCodec(
  lib.structCodec<AccountPermissionChanged>(['account', 'permission'], {
    account: lib.getCodec(lib.AccountId),
    permission: lib.getCodec(Permission),
  }),
)

export type RoleId = lib.Name
export const RoleId = lib.Name

/**
 * Structure with named fields.
 */
export interface AccountRoleChanged {
  account: lib.AccountId
  role: RoleId
}
/**
 * Codec of the structure.
 */
export const AccountRoleChanged: lib.CodecContainer<AccountRoleChanged> = lib
  .defineCodec(
    lib.structCodec<AccountRoleChanged>(['account', 'role'], {
      account: lib.getCodec(lib.AccountId),
      role: lib.getCodec(RoleId),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `Asset`
 * - `PermissionAdded`
 * - `PermissionRemoved`
 * - `RoleGranted`
 * - `RoleRevoked`
 * - `MetadataInserted`
 * - `MetadataRemoved`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link AccountEvent}.
 */
export const AccountEvent = {
  /**
   * Constructor of variant `AccountEvent.Created`
   */ Created: <const T extends Account>(
    value: T,
  ): lib.Variant<'Created', T> => ({ kind: 'Created', value }), /**
   * Constructor of variant `AccountEvent.Deleted`
   */
  Deleted: <const T extends lib.AccountId>(
    value: T,
  ): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }), /**
   * Constructors of nested enumerations under variant `AccountEvent.Asset`
   */
  Asset: {
    /**
     * Constructor of variant `AccountEvent.Asset.Created`
     */ Created: <const T extends Asset>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Created', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Created(value),
    }), /**
     * Constructor of variant `AccountEvent.Asset.Deleted`
     */
    Deleted: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Deleted', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Deleted(value),
    }), /**
     * Constructor of variant `AccountEvent.Asset.Added`
     */
    Added: <const T extends AssetChanged>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Added', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Added(value),
    }), /**
     * Constructor of variant `AccountEvent.Asset.Removed`
     */
    Removed: <const T extends AssetChanged>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Removed', T>> => ({
      kind: 'Asset',
      value: AssetEvent.Removed(value),
    }), /**
     * Constructor of variant `AccountEvent.Asset.MetadataInserted`
     */
    MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Asset',
      value: AssetEvent.MetadataInserted(value),
    }), /**
     * Constructor of variant `AccountEvent.Asset.MetadataRemoved`
     */
    MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Asset',
      value: AssetEvent.MetadataRemoved(value),
    }),
  }, /**
   * Constructor of variant `AccountEvent.PermissionAdded`
   */
  PermissionAdded: <const T extends AccountPermissionChanged>(
    value: T,
  ): lib.Variant<'PermissionAdded', T> => ({
    kind: 'PermissionAdded',
    value,
  }), /**
   * Constructor of variant `AccountEvent.PermissionRemoved`
   */
  PermissionRemoved: <const T extends AccountPermissionChanged>(
    value: T,
  ): lib.Variant<'PermissionRemoved', T> => ({
    kind: 'PermissionRemoved',
    value,
  }), /**
   * Constructor of variant `AccountEvent.RoleGranted`
   */
  RoleGranted: <const T extends AccountRoleChanged>(
    value: T,
  ): lib.Variant<'RoleGranted', T> => ({ kind: 'RoleGranted', value }), /**
   * Constructor of variant `AccountEvent.RoleRevoked`
   */
  RoleRevoked: <const T extends AccountRoleChanged>(
    value: T,
  ): lib.Variant<'RoleRevoked', T> => ({ kind: 'RoleRevoked', value }), /**
   * Constructor of variant `AccountEvent.MetadataInserted`
   */
  MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }), /**
   * Constructor of variant `AccountEvent.MetadataRemoved`
   */
  MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({ kind: 'MetadataRemoved', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [Account]
        Deleted: [lib.AccountId]
        Asset: [AssetEvent]
        PermissionAdded: [AccountPermissionChanged]
        PermissionRemoved: [AccountPermissionChanged]
        RoleGranted: [AccountRoleChanged]
        RoleRevoked: [AccountRoleChanged]
        MetadataInserted: [MetadataChanged<lib.AccountId>]
        MetadataRemoved: [MetadataChanged<lib.AccountId>]
      }
    >({
      Created: [0, lib.getCodec(Account)],
      Deleted: [1, lib.getCodec(lib.AccountId)],
      Asset: [2, lib.getCodec(AssetEvent)],
      PermissionAdded: [3, lib.getCodec(AccountPermissionChanged)],
      PermissionRemoved: [4, lib.getCodec(AccountPermissionChanged)],
      RoleGranted: [5, lib.getCodec(AccountRoleChanged)],
      RoleRevoked: [6, lib.getCodec(AccountRoleChanged)],
      MetadataInserted: [7, MetadataChanged.with(lib.getCodec(lib.AccountId))],
      MetadataRemoved: [8, MetadataChanged.with(lib.getCodec(lib.AccountId))],
    }).discriminated(),
  ),
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
export const AccountEventSet = lib.defineCodec(
  lib.bitmapCodec<AccountEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    AnyAsset: 4,
    PermissionAdded: 8,
    PermissionRemoved: 16,
    RoleGranted: 32,
    RoleRevoked: 64,
    MetadataInserted: 128,
    MetadataRemoved: 256,
  }),
)

/**
 * Structure with named fields.
 */
export interface AccountEventFilter {
  idMatcher: lib.Option<lib.AccountId>
  eventSet: AccountEventSet
}
/**
 * Codec of the structure.
 */
export const AccountEventFilter: lib.CodecContainer<AccountEventFilter> = lib
  .defineCodec(
    lib.structCodec<AccountEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(lib.AccountId)),
      eventSet: lib.getCodec(AccountEventSet),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type AccountIdPredicateAtom = lib.Variant<'Equals', lib.AccountId>
/**
 * Codec and constructors for enumeration {@link AccountIdPredicateAtom}.
 */
export const AccountIdPredicateAtom = {
  /**
   * Constructor of variant `AccountIdPredicateAtom.Equals`
   */ Equals: <const T extends lib.AccountId>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.AccountId] }>({
      Equals: [0, lib.getCodec(lib.AccountId)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type DomainIdPredicateAtom = lib.Variant<'Equals', lib.DomainId>
/**
 * Codec and constructors for enumeration {@link DomainIdPredicateAtom}.
 */
export const DomainIdPredicateAtom = {
  /**
   * Constructor of variant `DomainIdPredicateAtom.Equals`
   */ Equals: <const T extends lib.DomainId>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.DomainId] }>({
      Equals: [0, lib.getCodec(lib.DomainId)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 * - `Contains`
 * - `StartsWith`
 * - `EndsWith`
 *
 * TODO how to construct, how to use
 */
export type StringPredicateAtom =
  | lib.Variant<'Equals', lib.String>
  | lib.Variant<'Contains', lib.String>
  | lib.Variant<'StartsWith', lib.String>
  | lib.Variant<'EndsWith', lib.String>
/**
 * Codec and constructors for enumeration {@link StringPredicateAtom}.
 */
export const StringPredicateAtom = {
  /**
   * Constructor of variant `StringPredicateAtom.Equals`
   */ Equals: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }), /**
   * Constructor of variant `StringPredicateAtom.Contains`
   */
  Contains: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'Contains', T> => ({ kind: 'Contains', value }), /**
   * Constructor of variant `StringPredicateAtom.StartsWith`
   */
  StartsWith: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'StartsWith', T> => ({ kind: 'StartsWith', value }), /**
   * Constructor of variant `StringPredicateAtom.EndsWith`
   */
  EndsWith: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'EndsWith', T> => ({ kind: 'EndsWith', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Equals: [lib.String]
        Contains: [lib.String]
        StartsWith: [lib.String]
        EndsWith: [lib.String]
      }
    >({
      Equals: [0, lib.getCodec(lib.String)],
      Contains: [1, lib.getCodec(lib.String)],
      StartsWith: [2, lib.getCodec(lib.String)],
      EndsWith: [3, lib.getCodec(lib.String)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type NameProjectionPredicate = lib.Variant<'Atom', StringPredicateAtom>
/**
 * Codec and constructors for enumeration {@link NameProjectionPredicate}.
 */
export const NameProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `NameProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `NameProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.Equals(value),
    }), /**
     * Constructor of variant `NameProjectionPredicate.Atom.Contains`
     */
    Contains: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Contains', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.Contains(value),
    }), /**
     * Constructor of variant `NameProjectionPredicate.Atom.StartsWith`
     */
    StartsWith: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'StartsWith', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.StartsWith(value),
    }), /**
     * Constructor of variant `NameProjectionPredicate.Atom.EndsWith`
     */
    EndsWith: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'EndsWith', T>> => ({
      kind: 'Atom',
      value: StringPredicateAtom.EndsWith(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [StringPredicateAtom] }>({
      Atom: [0, lib.getCodec(StringPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type DomainIdProjectionPredicate =
  | lib.Variant<'Atom', DomainIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link DomainIdProjectionPredicate}.
 */
export const DomainIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `DomainIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `DomainIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: DomainIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DomainIdProjectionPredicate.Name`
   */
  Name: {
    /**
     * Constructors of nested enumerations under variant `DomainIdProjectionPredicate.Name.Atom`
     */ Atom: {
      /**
       * Constructor of variant `DomainIdProjectionPredicate.Name.Atom.Equals`
       */ Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }), /**
       * Constructor of variant `DomainIdProjectionPredicate.Name.Atom.Contains`
       */
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Contains', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }), /**
       * Constructor of variant `DomainIdProjectionPredicate.Name.Atom.StartsWith`
       */
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }), /**
       * Constructor of variant `DomainIdProjectionPredicate.Name.Atom.EndsWith`
       */
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [DomainIdPredicateAtom]; Name: [NameProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(DomainIdPredicateAtom)],
      Name: [1, lib.getCodec(NameProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type PublicKeyPredicateAtom = lib.Variant<'Equals', lib.PublicKeyRepr>
/**
 * Codec and constructors for enumeration {@link PublicKeyPredicateAtom}.
 */
export const PublicKeyPredicateAtom = {
  /**
   * Constructor of variant `PublicKeyPredicateAtom.Equals`
   */ Equals: <const T extends lib.PublicKeyRepr>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.PublicKeyRepr] }>({
      Equals: [0, lib.getCodec(lib.PublicKeyRepr)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type PublicKeyProjectionPredicate = lib.Variant<
  'Atom',
  PublicKeyPredicateAtom
>
/**
 * Codec and constructors for enumeration {@link PublicKeyProjectionPredicate}.
 */
export const PublicKeyProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `PublicKeyProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `PublicKeyProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.PublicKeyRepr>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: PublicKeyPredicateAtom.Equals(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [PublicKeyPredicateAtom] }>({
      Atom: [0, lib.getCodec(PublicKeyPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Domain`
 * - `Signatory`
 *
 * TODO how to construct, how to use
 */
export type AccountIdProjectionPredicate =
  | lib.Variant<'Atom', AccountIdPredicateAtom>
  | lib.Variant<'Domain', DomainIdProjectionPredicate>
  | lib.Variant<'Signatory', PublicKeyProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AccountIdProjectionPredicate}.
 */
export const AccountIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `AccountIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AccountIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Domain`
   */
  Domain: {
    /**
     * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Domain.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AccountIdProjectionPredicate.Domain.Atom.Equals`
       */ Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Domain.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Domain.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AccountIdProjectionPredicate.Domain.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `AccountIdProjectionPredicate.Domain.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }), /**
         * Constructor of variant `AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Signatory`
   */
  Signatory: {
    /**
     * Constructors of nested enumerations under variant `AccountIdProjectionPredicate.Signatory.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AccountIdProjectionPredicate.Signatory.Atom.Equals`
       */ Equals: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'Signatory',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Signatory',
        value: PublicKeyProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AccountIdPredicateAtom]
        Domain: [DomainIdProjectionPredicate]
        Signatory: [PublicKeyProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AccountIdPredicateAtom)],
      Domain: [1, lib.getCodec(DomainIdProjectionPredicate)],
      Signatory: [2, lib.getCodec(PublicKeyProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type NameProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link NameProjectionSelector}.
 */
export const NameProjectionSelector = {
  /**
   * Value of variant `NameProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type DomainIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Name', NameProjectionSelector>
/**
 * Codec and constructors for enumeration {@link DomainIdProjectionSelector}.
 */
export const DomainIdProjectionSelector = {
  /**
   * Value of variant `DomainIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `DomainIdProjectionSelector.Name`
   */
  Name: {
    /**
     * Value of variant `DomainIdProjectionSelector.Name.Atom`
     */ Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>({
      Atom: [0],
      Name: [1, lib.getCodec(NameProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type PublicKeyProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link PublicKeyProjectionSelector}.
 */
export const PublicKeyProjectionSelector = {
  /**
   * Value of variant `PublicKeyProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Domain`
 * - `Signatory`
 *
 * TODO how to construct, how to use
 */
export type AccountIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Domain', DomainIdProjectionSelector>
  | lib.Variant<'Signatory', PublicKeyProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AccountIdProjectionSelector}.
 */
export const AccountIdProjectionSelector = {
  /**
   * Value of variant `AccountIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AccountIdProjectionSelector.Domain`
   */
  Domain: {
    /**
     * Value of variant `AccountIdProjectionSelector.Domain.Atom`
     */ Atom: Object.freeze<lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>({
      kind: 'Domain',
      value: DomainIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AccountIdProjectionSelector.Domain.Name`
     */
    Name: {
      /**
       * Value of variant `AccountIdProjectionSelector.Domain.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Domain', value: DomainIdProjectionSelector.Name.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `AccountIdProjectionSelector.Signatory`
   */
  Signatory: {
    /**
     * Value of variant `AccountIdProjectionSelector.Signatory.Atom`
     */ Atom: Object.freeze<lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>({
      kind: 'Signatory',
      value: PublicKeyProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Domain: [DomainIdProjectionSelector]
        Signatory: [PublicKeyProjectionSelector]
      }
    >({
      Atom: [0],
      Domain: [1, lib.getCodec(DomainIdProjectionSelector)],
      Signatory: [2, lib.getCodec(PublicKeyProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type AccountPredicateAtom = never
/**
 * Codec for {@link AccountPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const AccountPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type MetadataPredicateAtom = never
/**
 * Codec for {@link MetadataPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const MetadataPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type JsonPredicateAtom = lib.Variant<'Equals', lib.Json>
/**
 * Codec and constructors for enumeration {@link JsonPredicateAtom}.
 */
export const JsonPredicateAtom = {
  /**
   * Constructor of variant `JsonPredicateAtom.Equals`
   */ Equals: <const T extends lib.Json>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.Json] }>({
      Equals: [0, lib.getCodec(lib.Json)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type JsonProjectionPredicate = lib.Variant<'Atom', JsonPredicateAtom>
/**
 * Codec and constructors for enumeration {@link JsonProjectionPredicate}.
 */
export const JsonProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `JsonProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `JsonProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.Json>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: JsonPredicateAtom.Equals(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [JsonPredicateAtom] }>({
      Atom: [0, lib.getCodec(JsonPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface MetadataKeyProjectionPredicate {
  key: lib.Name
  projection: JsonProjectionPredicate
}
/**
 * Codec of the structure.
 */
export const MetadataKeyProjectionPredicate: lib.CodecContainer<
  MetadataKeyProjectionPredicate
> = lib.defineCodec(
  lib.structCodec<MetadataKeyProjectionPredicate>(['key', 'projection'], {
    key: lib.getCodec(lib.Name),
    projection: lib.getCodec(JsonProjectionPredicate),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Key`
 *
 * TODO how to construct, how to use
 */
export type MetadataProjectionPredicate =
  | lib.Variant<'Atom', MetadataPredicateAtom>
  | lib.Variant<'Key', MetadataKeyProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link MetadataProjectionPredicate}.
 */
export const MetadataProjectionPredicate = {
  /**
   * Constructor of variant `MetadataProjectionPredicate.Key`
   */ Key: <const T extends MetadataKeyProjectionPredicate>(
    value: T,
  ): lib.Variant<'Key', T> => ({ kind: 'Key', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [MetadataPredicateAtom]; Key: [MetadataKeyProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(MetadataPredicateAtom)],
      Key: [1, lib.getCodec(MetadataKeyProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type AccountProjectionPredicate =
  | lib.Variant<'Atom', AccountPredicateAtom>
  | lib.Variant<'Id', AccountIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AccountProjectionPredicate}.
 */
export const AccountProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AccountProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Domain`
     */
    Domain: {
      /**
       * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Domain.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AccountProjectionPredicate.Id.Domain.Atom.Equals`
         */ Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Domain.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Domain.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AccountProjectionPredicate.Id.Domain.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }), /**
           * Constructor of variant `AccountProjectionPredicate.Id.Domain.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(
              value,
            ),
          }), /**
           * Constructor of variant `AccountProjectionPredicate.Id.Domain.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(
              value,
            ),
          }), /**
           * Constructor of variant `AccountProjectionPredicate.Id.Domain.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(
              value,
            ),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Signatory`
     */
    Signatory: {
      /**
       * Constructors of nested enumerations under variant `AccountProjectionPredicate.Id.Signatory.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AccountProjectionPredicate.Id.Signatory.Atom.Equals`
         */ Equals: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<
            'Signatory',
            lib.Variant<'Atom', lib.Variant<'Equals', T>>
          >
        > => ({
          kind: 'Id',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AccountProjectionPredicate.Metadata`
   */
  Metadata: {
    /**
     * Constructor of variant `AccountProjectionPredicate.Metadata.Key`
     */ Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AccountPredicateAtom]
        Id: [AccountIdProjectionPredicate]
        Metadata: [MetadataProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AccountPredicateAtom)],
      Id: [1, lib.getCodec(AccountIdProjectionPredicate)],
      Metadata: [2, lib.getCodec(MetadataProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type JsonProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link JsonProjectionSelector}.
 */
export const JsonProjectionSelector = {
  /**
   * Value of variant `JsonProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface MetadataKeyProjectionSelector {
  key: lib.Name
  projection: JsonProjectionSelector
}
/**
 * Codec of the structure.
 */
export const MetadataKeyProjectionSelector: lib.CodecContainer<
  MetadataKeyProjectionSelector
> = lib.defineCodec(
  lib.structCodec<MetadataKeyProjectionSelector>(['key', 'projection'], {
    key: lib.getCodec(lib.Name),
    projection: lib.getCodec(JsonProjectionSelector),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Key`
 *
 * TODO how to construct, how to use
 */
export type MetadataProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Key', MetadataKeyProjectionSelector>
/**
 * Codec and constructors for enumeration {@link MetadataProjectionSelector}.
 */
export const MetadataProjectionSelector = {
  /**
   * Value of variant `MetadataProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructor of variant `MetadataProjectionSelector.Key`
   */
  Key: <const T extends MetadataKeyProjectionSelector>(
    value: T,
  ): lib.Variant<'Key', T> => ({ kind: 'Key', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Key: [MetadataKeyProjectionSelector] }>({
      Atom: [0],
      Key: [1, lib.getCodec(MetadataKeyProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type AccountProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AccountIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AccountProjectionSelector}.
 */
export const AccountProjectionSelector = {
  /**
   * Value of variant `AccountProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AccountProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `AccountProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AccountIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AccountProjectionSelector.Id.Domain`
     */
    Domain: {
      /**
       * Value of variant `AccountProjectionSelector.Id.Domain.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: AccountIdProjectionSelector.Domain.Atom }), /**
       * Constructors of nested enumerations under variant `AccountProjectionSelector.Id.Domain.Name`
       */
      Name: {
        /**
         * Value of variant `AccountProjectionSelector.Id.Domain.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
          >
        >({ kind: 'Id', value: AccountIdProjectionSelector.Domain.Name.Atom }),
      },
    }, /**
     * Constructors of nested enumerations under variant `AccountProjectionSelector.Id.Signatory`
     */
    Signatory: {
      /**
       * Value of variant `AccountProjectionSelector.Id.Signatory.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: AccountIdProjectionSelector.Signatory.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `AccountProjectionSelector.Metadata`
   */
  Metadata: {
    /**
     * Value of variant `AccountProjectionSelector.Metadata.Atom`
     */ Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }), /**
     * Constructor of variant `AccountProjectionSelector.Metadata.Key`
     */
    Key: <const T extends MetadataKeyProjectionSelector>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Id: [AccountIdProjectionSelector]
        Metadata: [MetadataProjectionSelector]
      }
    >({
      Atom: [0],
      Id: [1, lib.getCodec(AccountIdProjectionSelector)],
      Metadata: [2, lib.getCodec(MetadataProjectionSelector)],
    }).discriminated(),
  ),
}

export type WasmSmartContract = lib.BytesVec
export const WasmSmartContract = lib.BytesVec

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Instructions`
 * - `Wasm`
 *
 * TODO how to construct, how to use
 */
export type Executable =
  | lib.Variant<'Instructions', lib.Vec<InstructionBox>>
  | lib.Variant<'Wasm', WasmSmartContract>
/**
 * Codec and constructors for enumeration {@link Executable}.
 */
export const Executable = {
  /**
   * Constructor of variant `Executable.Instructions`
   */ Instructions: <const T extends lib.Vec<InstructionBox>>(
    value: T,
  ): lib.Variant<'Instructions', T> => ({ kind: 'Instructions', value }), /**
   * Constructor of variant `Executable.Wasm`
   */
  Wasm: <const T extends WasmSmartContract>(
    value: T,
  ): lib.Variant<'Wasm', T> => ({ kind: 'Wasm', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Instructions: [lib.Vec<InstructionBox>]; Wasm: [WasmSmartContract] }
    >({
      Instructions: [
        0,
        lib.Vec.with(lib.lazyCodec(() => lib.getCodec(InstructionBox))),
      ],
      Wasm: [1, lib.getCodec(WasmSmartContract)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Indefinitely`
 * - `Exactly`
 *
 * TODO how to construct, how to use
 */
export type Repeats =
  | lib.VariantUnit<'Indefinitely'>
  | lib.Variant<'Exactly', lib.U32>
/**
 * Codec and constructors for enumeration {@link Repeats}.
 */
export const Repeats = {
  /**
   * Value of variant `Repeats.Indefinitely`
   */ Indefinitely: Object.freeze<lib.VariantUnit<'Indefinitely'>>({
    kind: 'Indefinitely',
  }), /**
   * Constructor of variant `Repeats.Exactly`
   */
  Exactly: <const T extends lib.U32>(value: T): lib.Variant<'Exactly', T> => ({
    kind: 'Exactly',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Indefinitely: []; Exactly: [lib.U32] }>({
      Indefinitely: [0],
      Exactly: [1, lib.getCodec(lib.U32)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface PeerId {
  publicKey: lib.PublicKeyRepr
}
/**
 * Codec of the structure.
 */
export const PeerId: lib.CodecContainer<PeerId> = lib.defineCodec(
  lib.structCodec<PeerId>(['publicKey'], {
    publicKey: lib.getCodec(lib.PublicKeyRepr),
  }),
)

export type TriggerId = lib.Name
export const TriggerId = lib.Name

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Asset`
 * - `AssetDefinition`
 * - `Account`
 * - `Domain`
 * - `MetadataKey`
 * - `Block`
 * - `Transaction`
 * - `Peer`
 * - `Trigger`
 * - `Role`
 * - `Permission`
 * - `PublicKey`
 *
 * TODO how to construct, how to use
 */
export type FindError =
  | lib.Variant<'Asset', lib.AssetId>
  | lib.Variant<'AssetDefinition', lib.AssetDefinitionId>
  | lib.Variant<'Account', lib.AccountId>
  | lib.Variant<'Domain', lib.DomainId>
  | lib.Variant<'MetadataKey', lib.Name>
  | lib.Variant<'Block', lib.HashRepr>
  | lib.Variant<'Transaction', lib.HashRepr>
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Trigger', TriggerId>
  | lib.Variant<'Role', RoleId>
  | lib.Variant<'Permission', Permission>
  | lib.Variant<'PublicKey', lib.PublicKeyRepr>
/**
 * Codec and constructors for enumeration {@link FindError}.
 */
export const FindError = {
  /**
   * Constructor of variant `FindError.Asset`
   */ Asset: <const T extends lib.AssetId>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `FindError.AssetDefinition`
   */
  AssetDefinition: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `FindError.Account`
   */
  Account: <const T extends lib.AccountId>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `FindError.Domain`
   */
  Domain: <const T extends lib.DomainId>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `FindError.MetadataKey`
   */
  MetadataKey: <const T extends lib.Name>(
    value: T,
  ): lib.Variant<'MetadataKey', T> => ({ kind: 'MetadataKey', value }), /**
   * Constructor of variant `FindError.Block`
   */
  Block: <const T extends lib.HashRepr>(value: T): lib.Variant<'Block', T> => ({
    kind: 'Block',
    value,
  }), /**
   * Constructor of variant `FindError.Transaction`
   */
  Transaction: <const T extends lib.HashRepr>(
    value: T,
  ): lib.Variant<'Transaction', T> => ({ kind: 'Transaction', value }), /**
   * Constructor of variant `FindError.Peer`
   */
  Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({
    kind: 'Peer',
    value,
  }), /**
   * Constructor of variant `FindError.Trigger`
   */
  Trigger: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }), /**
   * Constructor of variant `FindError.Role`
   */
  Role: <const T extends RoleId>(value: T): lib.Variant<'Role', T> => ({
    kind: 'Role',
    value,
  }), /**
   * Constructor of variant `FindError.Permission`
   */
  Permission: <const T extends Permission>(
    value: T,
  ): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }), /**
   * Constructor of variant `FindError.PublicKey`
   */
  PublicKey: <const T extends lib.PublicKeyRepr>(
    value: T,
  ): lib.Variant<'PublicKey', T> => ({ kind: 'PublicKey', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Asset: [lib.AssetId]
        AssetDefinition: [lib.AssetDefinitionId]
        Account: [lib.AccountId]
        Domain: [lib.DomainId]
        MetadataKey: [lib.Name]
        Block: [lib.HashRepr]
        Transaction: [lib.HashRepr]
        Peer: [PeerId]
        Trigger: [TriggerId]
        Role: [RoleId]
        Permission: [Permission]
        PublicKey: [lib.PublicKeyRepr]
      }
    >({
      Asset: [0, lib.getCodec(lib.AssetId)],
      AssetDefinition: [1, lib.getCodec(lib.AssetDefinitionId)],
      Account: [2, lib.getCodec(lib.AccountId)],
      Domain: [3, lib.getCodec(lib.DomainId)],
      MetadataKey: [4, lib.getCodec(lib.Name)],
      Block: [5, lib.getCodec(lib.HashRepr)],
      Transaction: [6, lib.getCodec(lib.HashRepr)],
      Peer: [7, lib.getCodec(PeerId)],
      Trigger: [8, lib.getCodec(TriggerId)],
      Role: [9, lib.getCodec(RoleId)],
      Permission: [10, lib.getCodec(Permission)],
      PublicKey: [11, lib.getCodec(lib.PublicKeyRepr)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TransactionLimitError {
  reason: lib.String
}
/**
 * Codec of the structure.
 */
export const TransactionLimitError: lib.CodecContainer<TransactionLimitError> = lib.defineCodec(
  lib.structCodec<TransactionLimitError>(['reason'], {
    reason: lib.getCodec(lib.String),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Register`
 * - `Unregister`
 * - `Mint`
 * - `Burn`
 * - `Transfer`
 * - `SetKeyValue`
 * - `RemoveKeyValue`
 * - `Grant`
 * - `Revoke`
 * - `ExecuteTrigger`
 * - `SetParameter`
 * - `Upgrade`
 * - `Log`
 * - `Custom`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link InstructionType}.
 */
export const InstructionType = {
  /**
   * Value of variant `InstructionType.Register`
   */ Register: Object.freeze<lib.VariantUnit<'Register'>>({
    kind: 'Register',
  }), /**
   * Value of variant `InstructionType.Unregister`
   */
  Unregister: Object.freeze<lib.VariantUnit<'Unregister'>>({
    kind: 'Unregister',
  }), /**
   * Value of variant `InstructionType.Mint`
   */
  Mint: Object.freeze<lib.VariantUnit<'Mint'>>({ kind: 'Mint' }), /**
   * Value of variant `InstructionType.Burn`
   */
  Burn: Object.freeze<lib.VariantUnit<'Burn'>>({ kind: 'Burn' }), /**
   * Value of variant `InstructionType.Transfer`
   */
  Transfer: Object.freeze<lib.VariantUnit<'Transfer'>>({
    kind: 'Transfer',
  }), /**
   * Value of variant `InstructionType.SetKeyValue`
   */
  SetKeyValue: Object.freeze<lib.VariantUnit<'SetKeyValue'>>({
    kind: 'SetKeyValue',
  }), /**
   * Value of variant `InstructionType.RemoveKeyValue`
   */
  RemoveKeyValue: Object.freeze<lib.VariantUnit<'RemoveKeyValue'>>({
    kind: 'RemoveKeyValue',
  }), /**
   * Value of variant `InstructionType.Grant`
   */
  Grant: Object.freeze<lib.VariantUnit<'Grant'>>({ kind: 'Grant' }), /**
   * Value of variant `InstructionType.Revoke`
   */
  Revoke: Object.freeze<lib.VariantUnit<'Revoke'>>({ kind: 'Revoke' }), /**
   * Value of variant `InstructionType.ExecuteTrigger`
   */
  ExecuteTrigger: Object.freeze<lib.VariantUnit<'ExecuteTrigger'>>({
    kind: 'ExecuteTrigger',
  }), /**
   * Value of variant `InstructionType.SetParameter`
   */
  SetParameter: Object.freeze<lib.VariantUnit<'SetParameter'>>({
    kind: 'SetParameter',
  }), /**
   * Value of variant `InstructionType.Upgrade`
   */
  Upgrade: Object.freeze<lib.VariantUnit<'Upgrade'>>({ kind: 'Upgrade' }), /**
   * Value of variant `InstructionType.Log`
   */
  Log: Object.freeze<lib.VariantUnit<'Log'>>({ kind: 'Log' }), /**
   * Value of variant `InstructionType.Custom`
   */
  Custom: Object.freeze<lib.VariantUnit<'Custom'>>({ kind: 'Custom' }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
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
      }
    >({
      Register: [0],
      Unregister: [1],
      Mint: [2],
      Burn: [3],
      Transfer: [4],
      SetKeyValue: [5],
      RemoveKeyValue: [6],
      Grant: [7],
      Revoke: [8],
      ExecuteTrigger: [9],
      SetParameter: [10],
      Upgrade: [11],
      Log: [12],
      Custom: [13],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface Mismatch<T0> {
  expected: T0
  actual: T0
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Mismatch = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0>(t0: lib.GenCodec<T0>): lib.GenCodec<Mismatch<T0>> =>
    lib.structCodec<Mismatch<T0>>(['expected', 'actual'], {
      expected: t0,
      actual: t0,
    }),
}

/**
 * Structure with named fields.
 */
export interface NumericSpec {
  scale: lib.Option<lib.U32>
}
/**
 * Codec of the structure.
 */
export const NumericSpec: lib.CodecContainer<NumericSpec> = lib.defineCodec(
  lib.structCodec<NumericSpec>(['scale'], {
    scale: lib.Option.with(lib.getCodec(lib.U32)),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Numeric`
 * - `Store`
 *
 * TODO how to construct, how to use
 */
export type AssetType =
  | lib.Variant<'Numeric', NumericSpec>
  | lib.VariantUnit<'Store'>
/**
 * Codec and constructors for enumeration {@link AssetType}.
 */
export const AssetType = {
  /**
   * Constructor of variant `AssetType.Numeric`
   */ Numeric: <const T extends NumericSpec>(
    value: T,
  ): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }), /**
   * Value of variant `AssetType.Store`
   */
  Store: Object.freeze<lib.VariantUnit<'Store'>>({ kind: 'Store' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Numeric: [NumericSpec]; Store: [] }>({
      Numeric: [0, lib.getCodec(NumericSpec)],
      Store: [1],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `AssetType`
 * - `NumericAssetTypeExpected`
 *
 * TODO how to construct, how to use
 */
export type TypeError =
  | lib.Variant<'AssetType', Mismatch<AssetType>>
  | lib.Variant<'NumericAssetTypeExpected', AssetType>
/**
 * Codec and constructors for enumeration {@link TypeError}.
 */
export const TypeError = {
  /**
   * Constructor of variant `TypeError.AssetType`
   */ AssetType: <const T extends Mismatch<AssetType>>(
    value: T,
  ): lib.Variant<'AssetType', T> => ({ kind: 'AssetType', value }), /**
   * Constructors of nested enumerations under variant `TypeError.NumericAssetTypeExpected`
   */
  NumericAssetTypeExpected: {
    /**
     * Constructor of variant `TypeError.NumericAssetTypeExpected.Numeric`
     */ Numeric: <const T extends NumericSpec>(
      value: T,
    ): lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>> => ({
      kind: 'NumericAssetTypeExpected',
      value: AssetType.Numeric(value),
    }), /**
     * Value of variant `TypeError.NumericAssetTypeExpected.Store`
     */
    Store: Object.freeze<
      lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>
    >({ kind: 'NumericAssetTypeExpected', value: AssetType.Store }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        AssetType: [Mismatch<AssetType>]
        NumericAssetTypeExpected: [AssetType]
      }
    >({
      AssetType: [0, Mismatch.with(lib.getCodec(AssetType))],
      NumericAssetTypeExpected: [1, lib.getCodec(AssetType)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Unsupported`
 * - `PermissionParameter`
 * - `Type`
 *
 * TODO how to construct, how to use
 */
export type InstructionEvaluationError =
  | lib.Variant<'Unsupported', InstructionType>
  | lib.Variant<'PermissionParameter', lib.String>
  | lib.Variant<'Type', TypeError>
/**
 * Codec and constructors for enumeration {@link InstructionEvaluationError}.
 */
export const InstructionEvaluationError = {
  /**
   * Constructors of nested enumerations under variant `InstructionEvaluationError.Unsupported`
   */ Unsupported: {
    /**
     * Value of variant `InstructionEvaluationError.Unsupported.Register`
     */ Register: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>
    >({ kind: 'Unsupported', value: InstructionType.Register }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Unregister`
     */
    Unregister: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>
    >({ kind: 'Unsupported', value: InstructionType.Unregister }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Mint`
     */
    Mint: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>>({
      kind: 'Unsupported',
      value: InstructionType.Mint,
    }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Burn`
     */
    Burn: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>>({
      kind: 'Unsupported',
      value: InstructionType.Burn,
    }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Transfer`
     */
    Transfer: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>
    >({ kind: 'Unsupported', value: InstructionType.Transfer }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.SetKeyValue`
     */
    SetKeyValue: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>
    >({ kind: 'Unsupported', value: InstructionType.SetKeyValue }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.RemoveKeyValue`
     */
    RemoveKeyValue: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>
    >({ kind: 'Unsupported', value: InstructionType.RemoveKeyValue }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Grant`
     */
    Grant: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>>({
      kind: 'Unsupported',
      value: InstructionType.Grant,
    }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Revoke`
     */
    Revoke: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>
    >({ kind: 'Unsupported', value: InstructionType.Revoke }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.ExecuteTrigger`
     */
    ExecuteTrigger: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>
    >({ kind: 'Unsupported', value: InstructionType.ExecuteTrigger }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.SetParameter`
     */
    SetParameter: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>
    >({ kind: 'Unsupported', value: InstructionType.SetParameter }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Upgrade`
     */
    Upgrade: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>
    >({ kind: 'Unsupported', value: InstructionType.Upgrade }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Log`
     */
    Log: Object.freeze<lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>>({
      kind: 'Unsupported',
      value: InstructionType.Log,
    }), /**
     * Value of variant `InstructionEvaluationError.Unsupported.Custom`
     */
    Custom: Object.freeze<
      lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>
    >({ kind: 'Unsupported', value: InstructionType.Custom }),
  }, /**
   * Constructor of variant `InstructionEvaluationError.PermissionParameter`
   */
  PermissionParameter: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'PermissionParameter', T> => ({
    kind: 'PermissionParameter',
    value,
  }), /**
   * Constructors of nested enumerations under variant `InstructionEvaluationError.Type`
   */
  Type: {
    /**
     * Constructor of variant `InstructionEvaluationError.Type.AssetType`
     */ AssetType: <const T extends Mismatch<AssetType>>(
      value: T,
    ): lib.Variant<'Type', lib.Variant<'AssetType', T>> => ({
      kind: 'Type',
      value: TypeError.AssetType(value),
    }), /**
     * Constructors of nested enumerations under variant `InstructionEvaluationError.Type.NumericAssetTypeExpected`
     */
    NumericAssetTypeExpected: {
      /**
       * Constructor of variant `InstructionEvaluationError.Type.NumericAssetTypeExpected.Numeric`
       */ Numeric: <const T extends NumericSpec>(
        value: T,
      ): lib.Variant<
        'Type',
        lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>
      > => ({
        kind: 'Type',
        value: TypeError.NumericAssetTypeExpected.Numeric(value),
      }), /**
       * Value of variant `InstructionEvaluationError.Type.NumericAssetTypeExpected.Store`
       */
      Store: Object.freeze<
        lib.Variant<
          'Type',
          lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>
        >
      >({ kind: 'Type', value: TypeError.NumericAssetTypeExpected.Store }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Unsupported: [InstructionType]
        PermissionParameter: [lib.String]
        Type: [TypeError]
      }
    >({
      Unsupported: [0, lib.getCodec(InstructionType)],
      PermissionParameter: [1, lib.getCodec(lib.String)],
      Type: [2, lib.getCodec(TypeError)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Find`
 * - `Conversion`
 * - `NotFound`
 * - `CursorMismatch`
 * - `CursorDone`
 * - `FetchSizeTooBig`
 * - `InvalidSingularParameters`
 * - `CapacityLimit`
 *
 * TODO how to construct, how to use
 */
export type QueryExecutionFail =
  | lib.Variant<'Find', FindError>
  | lib.Variant<'Conversion', lib.String>
  | lib.VariantUnit<'NotFound'>
  | lib.VariantUnit<'CursorMismatch'>
  | lib.VariantUnit<'CursorDone'>
  | lib.VariantUnit<'FetchSizeTooBig'>
  | lib.VariantUnit<'InvalidSingularParameters'>
  | lib.VariantUnit<'CapacityLimit'>
/**
 * Codec and constructors for enumeration {@link QueryExecutionFail}.
 */
export const QueryExecutionFail = {
  /**
   * Constructors of nested enumerations under variant `QueryExecutionFail.Find`
   */ Find: {
    /**
     * Constructor of variant `QueryExecutionFail.Find.Asset`
     */ Asset: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Asset', T>> => ({
      kind: 'Find',
      value: FindError.Asset(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.AssetDefinition`
     */
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Account`
     */
    Account: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Account', T>> => ({
      kind: 'Find',
      value: FindError.Account(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Domain`
     */
    Domain: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Domain', T>> => ({
      kind: 'Find',
      value: FindError.Domain(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.MetadataKey`
     */
    MetadataKey: <const T extends lib.Name>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'MetadataKey', T>> => ({
      kind: 'Find',
      value: FindError.MetadataKey(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Block`
     */
    Block: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Block', T>> => ({
      kind: 'Find',
      value: FindError.Block(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Transaction`
     */
    Transaction: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Transaction', T>> => ({
      kind: 'Find',
      value: FindError.Transaction(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Peer`
     */
    Peer: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Peer', T>> => ({
      kind: 'Find',
      value: FindError.Peer(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Trigger`
     */
    Trigger: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Trigger', T>> => ({
      kind: 'Find',
      value: FindError.Trigger(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Role`
     */
    Role: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Role', T>> => ({
      kind: 'Find',
      value: FindError.Role(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.Permission`
     */
    Permission: <const T extends Permission>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Permission', T>> => ({
      kind: 'Find',
      value: FindError.Permission(value),
    }), /**
     * Constructor of variant `QueryExecutionFail.Find.PublicKey`
     */
    PublicKey: <const T extends lib.PublicKeyRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'PublicKey', T>> => ({
      kind: 'Find',
      value: FindError.PublicKey(value),
    }),
  }, /**
   * Constructor of variant `QueryExecutionFail.Conversion`
   */
  Conversion: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'Conversion', T> => ({ kind: 'Conversion', value }), /**
   * Value of variant `QueryExecutionFail.NotFound`
   */
  NotFound: Object.freeze<lib.VariantUnit<'NotFound'>>({
    kind: 'NotFound',
  }), /**
   * Value of variant `QueryExecutionFail.CursorMismatch`
   */
  CursorMismatch: Object.freeze<lib.VariantUnit<'CursorMismatch'>>({
    kind: 'CursorMismatch',
  }), /**
   * Value of variant `QueryExecutionFail.CursorDone`
   */
  CursorDone: Object.freeze<lib.VariantUnit<'CursorDone'>>({
    kind: 'CursorDone',
  }), /**
   * Value of variant `QueryExecutionFail.FetchSizeTooBig`
   */
  FetchSizeTooBig: Object.freeze<lib.VariantUnit<'FetchSizeTooBig'>>({
    kind: 'FetchSizeTooBig',
  }), /**
   * Value of variant `QueryExecutionFail.InvalidSingularParameters`
   */
  InvalidSingularParameters: Object.freeze<
    lib.VariantUnit<'InvalidSingularParameters'>
  >({ kind: 'InvalidSingularParameters' }), /**
   * Value of variant `QueryExecutionFail.CapacityLimit`
   */
  CapacityLimit: Object.freeze<lib.VariantUnit<'CapacityLimit'>>({
    kind: 'CapacityLimit',
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Find: [FindError]
        Conversion: [lib.String]
        NotFound: []
        CursorMismatch: []
        CursorDone: []
        FetchSizeTooBig: []
        InvalidSingularParameters: []
        CapacityLimit: []
      }
    >({
      Find: [0, lib.getCodec(FindError)],
      Conversion: [1, lib.getCodec(lib.String)],
      NotFound: [2],
      CursorMismatch: [3],
      CursorDone: [4],
      FetchSizeTooBig: [5],
      InvalidSingularParameters: [6],
      CapacityLimit: [7],
    }).discriminated(),
  ),
}

export type CustomParameterId = lib.Name
export const CustomParameterId = lib.Name

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `DomainId`
 * - `AccountId`
 * - `AssetDefinitionId`
 * - `AssetId`
 * - `PeerId`
 * - `TriggerId`
 * - `RoleId`
 * - `Permission`
 * - `CustomParameterId`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link IdBox}.
 */
export const IdBox = {
  /**
   * Constructor of variant `IdBox.DomainId`
   */ DomainId: <const T extends lib.DomainId>(
    value: T,
  ): lib.Variant<'DomainId', T> => ({ kind: 'DomainId', value }), /**
   * Constructor of variant `IdBox.AccountId`
   */
  AccountId: <const T extends lib.AccountId>(
    value: T,
  ): lib.Variant<'AccountId', T> => ({ kind: 'AccountId', value }), /**
   * Constructor of variant `IdBox.AssetDefinitionId`
   */
  AssetDefinitionId: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'AssetDefinitionId', T> => ({
    kind: 'AssetDefinitionId',
    value,
  }), /**
   * Constructor of variant `IdBox.AssetId`
   */
  AssetId: <const T extends lib.AssetId>(
    value: T,
  ): lib.Variant<'AssetId', T> => ({ kind: 'AssetId', value }), /**
   * Constructor of variant `IdBox.PeerId`
   */
  PeerId: <const T extends PeerId>(value: T): lib.Variant<'PeerId', T> => ({
    kind: 'PeerId',
    value,
  }), /**
   * Constructor of variant `IdBox.TriggerId`
   */
  TriggerId: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'TriggerId', T> => ({ kind: 'TriggerId', value }), /**
   * Constructor of variant `IdBox.RoleId`
   */
  RoleId: <const T extends RoleId>(value: T): lib.Variant<'RoleId', T> => ({
    kind: 'RoleId',
    value,
  }), /**
   * Constructor of variant `IdBox.Permission`
   */
  Permission: <const T extends Permission>(
    value: T,
  ): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }), /**
   * Constructor of variant `IdBox.CustomParameterId`
   */
  CustomParameterId: <const T extends CustomParameterId>(
    value: T,
  ): lib.Variant<'CustomParameterId', T> => ({
    kind: 'CustomParameterId',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        DomainId: [lib.DomainId]
        AccountId: [lib.AccountId]
        AssetDefinitionId: [lib.AssetDefinitionId]
        AssetId: [lib.AssetId]
        PeerId: [PeerId]
        TriggerId: [TriggerId]
        RoleId: [RoleId]
        Permission: [Permission]
        CustomParameterId: [CustomParameterId]
      }
    >({
      DomainId: [0, lib.getCodec(lib.DomainId)],
      AccountId: [1, lib.getCodec(lib.AccountId)],
      AssetDefinitionId: [2, lib.getCodec(lib.AssetDefinitionId)],
      AssetId: [3, lib.getCodec(lib.AssetId)],
      PeerId: [4, lib.getCodec(PeerId)],
      TriggerId: [5, lib.getCodec(TriggerId)],
      RoleId: [6, lib.getCodec(RoleId)],
      Permission: [7, lib.getCodec(Permission)],
      CustomParameterId: [8, lib.getCodec(CustomParameterId)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface RepetitionError {
  instruction: InstructionType
  id: IdBox
}
/**
 * Codec of the structure.
 */
export const RepetitionError: lib.CodecContainer<RepetitionError> = lib
  .defineCodec(
    lib.structCodec<RepetitionError>(['instruction', 'id'], {
      instruction: lib.getCodec(InstructionType),
      id: lib.getCodec(IdBox),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `MintUnmintable`
 * - `ForbidMintOnMintable`
 *
 * TODO how to construct, how to use
 */
export type MintabilityError =
  | lib.VariantUnit<'MintUnmintable'>
  | lib.VariantUnit<'ForbidMintOnMintable'>
/**
 * Codec and constructors for enumeration {@link MintabilityError}.
 */
export const MintabilityError = {
  /**
   * Value of variant `MintabilityError.MintUnmintable`
   */ MintUnmintable: Object.freeze<lib.VariantUnit<'MintUnmintable'>>({
    kind: 'MintUnmintable',
  }), /**
   * Value of variant `MintabilityError.ForbidMintOnMintable`
   */
  ForbidMintOnMintable: Object.freeze<lib.VariantUnit<'ForbidMintOnMintable'>>({
    kind: 'ForbidMintOnMintable',
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ MintUnmintable: []; ForbidMintOnMintable: [] }>({
      MintUnmintable: [0],
      ForbidMintOnMintable: [1],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Overflow`
 * - `NotEnoughQuantity`
 * - `DivideByZero`
 * - `NegativeValue`
 * - `DomainViolation`
 * - `Unknown`
 * - `FixedPointConversion`
 *
 * TODO how to construct, how to use
 */
export type MathError =
  | lib.VariantUnit<'Overflow'>
  | lib.VariantUnit<'NotEnoughQuantity'>
  | lib.VariantUnit<'DivideByZero'>
  | lib.VariantUnit<'NegativeValue'>
  | lib.VariantUnit<'DomainViolation'>
  | lib.VariantUnit<'Unknown'>
  | lib.Variant<'FixedPointConversion', lib.String>
/**
 * Codec and constructors for enumeration {@link MathError}.
 */
export const MathError = {
  /**
   * Value of variant `MathError.Overflow`
   */ Overflow: Object.freeze<lib.VariantUnit<'Overflow'>>({
    kind: 'Overflow',
  }), /**
   * Value of variant `MathError.NotEnoughQuantity`
   */
  NotEnoughQuantity: Object.freeze<lib.VariantUnit<'NotEnoughQuantity'>>({
    kind: 'NotEnoughQuantity',
  }), /**
   * Value of variant `MathError.DivideByZero`
   */
  DivideByZero: Object.freeze<lib.VariantUnit<'DivideByZero'>>({
    kind: 'DivideByZero',
  }), /**
   * Value of variant `MathError.NegativeValue`
   */
  NegativeValue: Object.freeze<lib.VariantUnit<'NegativeValue'>>({
    kind: 'NegativeValue',
  }), /**
   * Value of variant `MathError.DomainViolation`
   */
  DomainViolation: Object.freeze<lib.VariantUnit<'DomainViolation'>>({
    kind: 'DomainViolation',
  }), /**
   * Value of variant `MathError.Unknown`
   */
  Unknown: Object.freeze<lib.VariantUnit<'Unknown'>>({ kind: 'Unknown' }), /**
   * Constructor of variant `MathError.FixedPointConversion`
   */
  FixedPointConversion: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'FixedPointConversion', T> => ({
    kind: 'FixedPointConversion',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Overflow: []
        NotEnoughQuantity: []
        DivideByZero: []
        NegativeValue: []
        DomainViolation: []
        Unknown: []
        FixedPointConversion: [lib.String]
      }
    >({
      Overflow: [0],
      NotEnoughQuantity: [1],
      DivideByZero: [2],
      NegativeValue: [3],
      DomainViolation: [4],
      Unknown: [5],
      FixedPointConversion: [6, lib.getCodec(lib.String)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Wasm`
 * - `TimeTriggerInThePast`
 *
 * TODO how to construct, how to use
 */
export type InvalidParameterError =
  | lib.Variant<'Wasm', lib.String>
  | lib.VariantUnit<'TimeTriggerInThePast'>
/**
 * Codec and constructors for enumeration {@link InvalidParameterError}.
 */
export const InvalidParameterError = {
  /**
   * Constructor of variant `InvalidParameterError.Wasm`
   */ Wasm: <const T extends lib.String>(value: T): lib.Variant<'Wasm', T> => ({
    kind: 'Wasm',
    value,
  }), /**
   * Value of variant `InvalidParameterError.TimeTriggerInThePast`
   */
  TimeTriggerInThePast: Object.freeze<lib.VariantUnit<'TimeTriggerInThePast'>>({
    kind: 'TimeTriggerInThePast',
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Wasm: [lib.String]; TimeTriggerInThePast: [] }>({
      Wasm: [0, lib.getCodec(lib.String)],
      TimeTriggerInThePast: [1],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Evaluate`
 * - `Query`
 * - `Conversion`
 * - `Find`
 * - `Repetition`
 * - `Mintability`
 * - `Math`
 * - `InvalidParameter`
 * - `InvariantViolation`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link InstructionExecutionError}.
 */
export const InstructionExecutionError = {
  /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.Evaluate`
   */ Evaluate: {
    /**
     * Constructors of nested enumerations under variant `InstructionExecutionError.Evaluate.Unsupported`
     */ Unsupported: {
      /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Register`
       */ Register: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Register,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Unregister`
       */
      Unregister: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Unregister,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Mint`
       */
      Mint: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Mint,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Burn`
       */
      Burn: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Burn,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Transfer`
       */
      Transfer: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Transfer,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.SetKeyValue`
       */
      SetKeyValue: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.SetKeyValue,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.RemoveKeyValue`
       */
      RemoveKeyValue: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.RemoveKeyValue,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Grant`
       */
      Grant: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Grant,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Revoke`
       */
      Revoke: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Revoke,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.ExecuteTrigger`
       */
      ExecuteTrigger: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.ExecuteTrigger,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.SetParameter`
       */
      SetParameter: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.SetParameter,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Upgrade`
       */
      Upgrade: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Upgrade,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Log`
       */
      Log: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Log,
      }), /**
       * Value of variant `InstructionExecutionError.Evaluate.Unsupported.Custom`
       */
      Custom: Object.freeze<
        lib.Variant<
          'Evaluate',
          lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>
        >
      >({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Unsupported.Custom,
      }),
    }, /**
     * Constructor of variant `InstructionExecutionError.Evaluate.PermissionParameter`
     */
    PermissionParameter: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>> => ({
      kind: 'Evaluate',
      value: InstructionEvaluationError.PermissionParameter(value),
    }), /**
     * Constructors of nested enumerations under variant `InstructionExecutionError.Evaluate.Type`
     */
    Type: {
      /**
       * Constructor of variant `InstructionExecutionError.Evaluate.Type.AssetType`
       */ AssetType: <const T extends Mismatch<AssetType>>(
        value: T,
      ): lib.Variant<
        'Evaluate',
        lib.Variant<'Type', lib.Variant<'AssetType', T>>
      > => ({
        kind: 'Evaluate',
        value: InstructionEvaluationError.Type.AssetType(value),
      }), /**
       * Constructors of nested enumerations under variant `InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected`
       */
      NumericAssetTypeExpected: {
        /**
         * Constructor of variant `InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Numeric`
         */ Numeric: <const T extends NumericSpec>(
          value: T,
        ): lib.Variant<
          'Evaluate',
          lib.Variant<
            'Type',
            lib.Variant<'NumericAssetTypeExpected', lib.Variant<'Numeric', T>>
          >
        > => ({
          kind: 'Evaluate',
          value: InstructionEvaluationError.Type.NumericAssetTypeExpected
            .Numeric(value),
        }), /**
         * Value of variant `InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected.Store`
         */
        Store: Object.freeze<
          lib.Variant<
            'Evaluate',
            lib.Variant<
              'Type',
              lib.Variant<'NumericAssetTypeExpected', lib.VariantUnit<'Store'>>
            >
          >
        >({
          kind: 'Evaluate',
          value: InstructionEvaluationError.Type.NumericAssetTypeExpected.Store,
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.Query`
   */
  Query: {
    /**
     * Constructors of nested enumerations under variant `InstructionExecutionError.Query.Find`
     */ Find: {
      /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Asset`
       */ Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Asset', T>>
      > => ({ kind: 'Query', value: QueryExecutionFail.Find.Asset(value) }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.AssetDefinition`
       */
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Account`
       */
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Account', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Account(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Domain`
       */
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Domain', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Domain(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.MetadataKey`
       */
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Block`
       */
      Block: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Block', T>>
      > => ({ kind: 'Query', value: QueryExecutionFail.Find.Block(value) }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Transaction`
       */
      Transaction: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Transaction', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Transaction(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Peer`
       */
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Peer(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Trigger`
       */
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Trigger', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Trigger(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Role`
       */
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>> => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Role(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.Permission`
       */
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'Permission', T>>
      > => ({
        kind: 'Query',
        value: QueryExecutionFail.Find.Permission(value),
      }), /**
       * Constructor of variant `InstructionExecutionError.Query.Find.PublicKey`
       */
      PublicKey: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'Query',
        lib.Variant<'Find', lib.Variant<'PublicKey', T>>
      > => ({ kind: 'Query', value: QueryExecutionFail.Find.PublicKey(value) }),
    }, /**
     * Constructor of variant `InstructionExecutionError.Query.Conversion`
     */
    Conversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Query', lib.Variant<'Conversion', T>> => ({
      kind: 'Query',
      value: QueryExecutionFail.Conversion(value),
    }), /**
     * Value of variant `InstructionExecutionError.Query.NotFound`
     */
    NotFound: Object.freeze<lib.Variant<'Query', lib.VariantUnit<'NotFound'>>>({
      kind: 'Query',
      value: QueryExecutionFail.NotFound,
    }), /**
     * Value of variant `InstructionExecutionError.Query.CursorMismatch`
     */
    CursorMismatch: Object.freeze<
      lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>
    >({ kind: 'Query', value: QueryExecutionFail.CursorMismatch }), /**
     * Value of variant `InstructionExecutionError.Query.CursorDone`
     */
    CursorDone: Object.freeze<
      lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>
    >({ kind: 'Query', value: QueryExecutionFail.CursorDone }), /**
     * Value of variant `InstructionExecutionError.Query.FetchSizeTooBig`
     */
    FetchSizeTooBig: Object.freeze<
      lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>
    >({ kind: 'Query', value: QueryExecutionFail.FetchSizeTooBig }), /**
     * Value of variant `InstructionExecutionError.Query.InvalidSingularParameters`
     */
    InvalidSingularParameters: Object.freeze<
      lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>
    >({
      kind: 'Query',
      value: QueryExecutionFail.InvalidSingularParameters,
    }), /**
     * Value of variant `InstructionExecutionError.Query.CapacityLimit`
     */
    CapacityLimit: Object.freeze<
      lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>
    >({ kind: 'Query', value: QueryExecutionFail.CapacityLimit }),
  }, /**
   * Constructor of variant `InstructionExecutionError.Conversion`
   */
  Conversion: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'Conversion', T> => ({ kind: 'Conversion', value }), /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.Find`
   */
  Find: {
    /**
     * Constructor of variant `InstructionExecutionError.Find.Asset`
     */ Asset: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Asset', T>> => ({
      kind: 'Find',
      value: FindError.Asset(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.AssetDefinition`
     */
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Find',
      value: FindError.AssetDefinition(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Account`
     */
    Account: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Account', T>> => ({
      kind: 'Find',
      value: FindError.Account(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Domain`
     */
    Domain: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Domain', T>> => ({
      kind: 'Find',
      value: FindError.Domain(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.MetadataKey`
     */
    MetadataKey: <const T extends lib.Name>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'MetadataKey', T>> => ({
      kind: 'Find',
      value: FindError.MetadataKey(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Block`
     */
    Block: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Block', T>> => ({
      kind: 'Find',
      value: FindError.Block(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Transaction`
     */
    Transaction: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Transaction', T>> => ({
      kind: 'Find',
      value: FindError.Transaction(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Peer`
     */
    Peer: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Peer', T>> => ({
      kind: 'Find',
      value: FindError.Peer(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Trigger`
     */
    Trigger: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Trigger', T>> => ({
      kind: 'Find',
      value: FindError.Trigger(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Role`
     */
    Role: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Role', T>> => ({
      kind: 'Find',
      value: FindError.Role(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.Permission`
     */
    Permission: <const T extends Permission>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'Permission', T>> => ({
      kind: 'Find',
      value: FindError.Permission(value),
    }), /**
     * Constructor of variant `InstructionExecutionError.Find.PublicKey`
     */
    PublicKey: <const T extends lib.PublicKeyRepr>(
      value: T,
    ): lib.Variant<'Find', lib.Variant<'PublicKey', T>> => ({
      kind: 'Find',
      value: FindError.PublicKey(value),
    }),
  }, /**
   * Constructor of variant `InstructionExecutionError.Repetition`
   */
  Repetition: <const T extends RepetitionError>(
    value: T,
  ): lib.Variant<'Repetition', T> => ({ kind: 'Repetition', value }), /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.Mintability`
   */
  Mintability: {
    /**
     * Value of variant `InstructionExecutionError.Mintability.MintUnmintable`
     */ MintUnmintable: Object.freeze<
      lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>
    >({ kind: 'Mintability', value: MintabilityError.MintUnmintable }), /**
     * Value of variant `InstructionExecutionError.Mintability.ForbidMintOnMintable`
     */
    ForbidMintOnMintable: Object.freeze<
      lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>
    >({ kind: 'Mintability', value: MintabilityError.ForbidMintOnMintable }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.Math`
   */
  Math: {
    /**
     * Value of variant `InstructionExecutionError.Math.Overflow`
     */ Overflow: Object.freeze<
      lib.Variant<'Math', lib.VariantUnit<'Overflow'>>
    >({ kind: 'Math', value: MathError.Overflow }), /**
     * Value of variant `InstructionExecutionError.Math.NotEnoughQuantity`
     */
    NotEnoughQuantity: Object.freeze<
      lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>
    >({ kind: 'Math', value: MathError.NotEnoughQuantity }), /**
     * Value of variant `InstructionExecutionError.Math.DivideByZero`
     */
    DivideByZero: Object.freeze<
      lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>
    >({ kind: 'Math', value: MathError.DivideByZero }), /**
     * Value of variant `InstructionExecutionError.Math.NegativeValue`
     */
    NegativeValue: Object.freeze<
      lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>
    >({ kind: 'Math', value: MathError.NegativeValue }), /**
     * Value of variant `InstructionExecutionError.Math.DomainViolation`
     */
    DomainViolation: Object.freeze<
      lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>
    >({ kind: 'Math', value: MathError.DomainViolation }), /**
     * Value of variant `InstructionExecutionError.Math.Unknown`
     */
    Unknown: Object.freeze<lib.Variant<'Math', lib.VariantUnit<'Unknown'>>>({
      kind: 'Math',
      value: MathError.Unknown,
    }), /**
     * Constructor of variant `InstructionExecutionError.Math.FixedPointConversion`
     */
    FixedPointConversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>> => ({
      kind: 'Math',
      value: MathError.FixedPointConversion(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionExecutionError.InvalidParameter`
   */
  InvalidParameter: {
    /**
     * Constructor of variant `InstructionExecutionError.InvalidParameter.Wasm`
     */ Wasm: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>> => ({
      kind: 'InvalidParameter',
      value: InvalidParameterError.Wasm(value),
    }), /**
     * Value of variant `InstructionExecutionError.InvalidParameter.TimeTriggerInThePast`
     */
    TimeTriggerInThePast: Object.freeze<
      lib.Variant<'InvalidParameter', lib.VariantUnit<'TimeTriggerInThePast'>>
    >({
      kind: 'InvalidParameter',
      value: InvalidParameterError.TimeTriggerInThePast,
    }),
  }, /**
   * Constructor of variant `InstructionExecutionError.InvariantViolation`
   */
  InvariantViolation: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'InvariantViolation', T> => ({
    kind: 'InvariantViolation',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Evaluate: [InstructionEvaluationError]
        Query: [QueryExecutionFail]
        Conversion: [lib.String]
        Find: [FindError]
        Repetition: [RepetitionError]
        Mintability: [MintabilityError]
        Math: [MathError]
        InvalidParameter: [InvalidParameterError]
        InvariantViolation: [lib.String]
      }
    >({
      Evaluate: [0, lib.getCodec(InstructionEvaluationError)],
      Query: [1, lib.getCodec(QueryExecutionFail)],
      Conversion: [2, lib.getCodec(lib.String)],
      Find: [3, lib.getCodec(FindError)],
      Repetition: [4, lib.getCodec(RepetitionError)],
      Mintability: [5, lib.getCodec(MintabilityError)],
      Math: [6, lib.getCodec(MathError)],
      InvalidParameter: [7, lib.getCodec(InvalidParameterError)],
      InvariantViolation: [8, lib.getCodec(lib.String)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `NotPermitted`
 * - `InstructionFailed`
 * - `QueryFailed`
 * - `TooComplex`
 * - `InternalError`
 *
 * TODO how to construct, how to use
 */
export type ValidationFail =
  | lib.Variant<'NotPermitted', lib.String>
  | lib.Variant<'InstructionFailed', InstructionExecutionError>
  | lib.Variant<'QueryFailed', QueryExecutionFail>
  | lib.VariantUnit<'TooComplex'>
  | lib.VariantUnit<'InternalError'>
/**
 * Codec and constructors for enumeration {@link ValidationFail}.
 */
export const ValidationFail = {
  /**
   * Constructor of variant `ValidationFail.NotPermitted`
   */ NotPermitted: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'NotPermitted', T> => ({ kind: 'NotPermitted', value }), /**
   * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed`
   */
  InstructionFailed: {
    /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Evaluate`
     */ Evaluate: {
      /**
       * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Evaluate.Unsupported`
       */ Unsupported: {
        /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Register`
         */ Register: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Register,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Unregister`
         */
        Unregister: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Unregister,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Mint`
         */
        Mint: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Mint,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Burn`
         */
        Burn: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Burn,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Transfer`
         */
        Transfer: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Transfer,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.SetKeyValue`
         */
        SetKeyValue: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.SetKeyValue,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue`
         */
        RemoveKeyValue: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.RemoveKeyValue,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Grant`
         */
        Grant: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Grant,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Revoke`
         */
        Revoke: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Revoke,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger`
         */
        ExecuteTrigger: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.ExecuteTrigger,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.SetParameter`
         */
        SetParameter: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.SetParameter,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Upgrade`
         */
        Upgrade: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Upgrade,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Log`
         */
        Log: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Log,
        }), /**
         * Value of variant `ValidationFail.InstructionFailed.Evaluate.Unsupported.Custom`
         */
        Custom: Object.freeze<
          lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>
            >
          >
        >({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Unsupported.Custom,
        }),
      }, /**
       * Constructor of variant `ValidationFail.InstructionFailed.Evaluate.PermissionParameter`
       */
      PermissionParameter: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Evaluate.PermissionParameter(value),
      }), /**
       * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Evaluate.Type`
       */
      Type: {
        /**
         * Constructor of variant `ValidationFail.InstructionFailed.Evaluate.Type.AssetType`
         */ AssetType: <const T extends Mismatch<AssetType>>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'Evaluate',
            lib.Variant<'Type', lib.Variant<'AssetType', T>>
          >
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Evaluate.Type.AssetType(value),
        }), /**
         * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected`
         */
        NumericAssetTypeExpected: {
          /**
           * Constructor of variant `ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric`
           */ Numeric: <const T extends NumericSpec>(
            value: T,
          ): lib.Variant<
            'InstructionFailed',
            lib.Variant<
              'Evaluate',
              lib.Variant<
                'Type',
                lib.Variant<
                  'NumericAssetTypeExpected',
                  lib.Variant<'Numeric', T>
                >
              >
            >
          > => ({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type
              .NumericAssetTypeExpected.Numeric(value),
          }), /**
           * Value of variant `ValidationFail.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store`
           */
          Store: Object.freeze<
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Evaluate',
                lib.Variant<
                  'Type',
                  lib.Variant<
                    'NumericAssetTypeExpected',
                    lib.VariantUnit<'Store'>
                  >
                >
              >
            >
          >({
            kind: 'InstructionFailed',
            value: InstructionExecutionError.Evaluate.Type.NumericAssetTypeExpected
              .Store,
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Query`
     */
    Query: {
      /**
       * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Query.Find`
       */ Find: {
        /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Asset`
         */ Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Asset(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.AssetDefinition`
         */
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'Query',
            lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
          >
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.AssetDefinition(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Account`
         */
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Account', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Account(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Domain`
         */
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Domain', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Domain(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.MetadataKey`
         */
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'Query',
            lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
          >
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.MetadataKey(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Block`
         */
        Block: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Block(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Transaction`
         */
        Transaction: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'Query',
            lib.Variant<'Find', lib.Variant<'Transaction', T>>
          >
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Transaction(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Peer`
         */
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Peer(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Trigger`
         */
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Trigger', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Trigger(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Role`
         */
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Role(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.Permission`
         */
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'Query',
            lib.Variant<'Find', lib.Variant<'Permission', T>>
          >
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.Permission(value),
        }), /**
         * Constructor of variant `ValidationFail.InstructionFailed.Query.Find.PublicKey`
         */
        PublicKey: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'PublicKey', T>>>
        > => ({
          kind: 'InstructionFailed',
          value: InstructionExecutionError.Query.Find.PublicKey(value),
        }),
      }, /**
       * Constructor of variant `ValidationFail.InstructionFailed.Query.Conversion`
       */
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Query', lib.Variant<'Conversion', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.Conversion(value),
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.NotFound`
       */
      NotFound: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'NotFound'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.NotFound,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.CursorMismatch`
       */
      CursorMismatch: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CursorMismatch,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.CursorDone`
       */
      CursorDone: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CursorDone,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.FetchSizeTooBig`
       */
      FetchSizeTooBig: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.FetchSizeTooBig,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.InvalidSingularParameters`
       */
      InvalidSingularParameters: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.InvalidSingularParameters,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Query.CapacityLimit`
       */
      CapacityLimit: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Query.CapacityLimit,
      }),
    }, /**
     * Constructor of variant `ValidationFail.InstructionFailed.Conversion`
     */
    Conversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>> => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Conversion(value),
    }), /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Find`
     */
    Find: {
      /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Asset`
       */ Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Asset', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Asset(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.AssetDefinition`
       */
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.AssetDefinition(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Account`
       */
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Account', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Account(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Domain`
       */
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Domain', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Domain(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.MetadataKey`
       */
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.MetadataKey(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Block`
       */
      Block: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Block', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Block(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Transaction`
       */
      Transaction: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Transaction', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Transaction(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Peer`
       */
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Peer', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Peer(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Trigger`
       */
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Trigger', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Trigger(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Role`
       */
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Role', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Role(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.Permission`
       */
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'Permission', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.Permission(value),
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Find.PublicKey`
       */
      PublicKey: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Find', lib.Variant<'PublicKey', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Find.PublicKey(value),
      }),
    }, /**
     * Constructor of variant `ValidationFail.InstructionFailed.Repetition`
     */
    Repetition: <const T extends RepetitionError>(
      value: T,
    ): lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>> => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.Repetition(value),
    }), /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Mintability`
     */
    Mintability: {
      /**
       * Value of variant `ValidationFail.InstructionFailed.Mintability.MintUnmintable`
       */ MintUnmintable: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Mintability.MintUnmintable,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Mintability.ForbidMintOnMintable`
       */
      ForbidMintOnMintable: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Mintability', lib.VariantUnit<'ForbidMintOnMintable'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Mintability.ForbidMintOnMintable,
      }),
    }, /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.Math`
     */
    Math: {
      /**
       * Value of variant `ValidationFail.InstructionFailed.Math.Overflow`
       */ Overflow: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'Overflow'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Overflow,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Math.NotEnoughQuantity`
       */
      NotEnoughQuantity: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.NotEnoughQuantity,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Math.DivideByZero`
       */
      DivideByZero: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.DivideByZero,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Math.NegativeValue`
       */
      NegativeValue: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.NegativeValue,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Math.DomainViolation`
       */
      DomainViolation: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.DomainViolation,
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.Math.Unknown`
       */
      Unknown: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<'Math', lib.VariantUnit<'Unknown'>>
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.Unknown,
      }), /**
       * Constructor of variant `ValidationFail.InstructionFailed.Math.FixedPointConversion`
       */
      FixedPointConversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.Math.FixedPointConversion(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `ValidationFail.InstructionFailed.InvalidParameter`
     */
    InvalidParameter: {
      /**
       * Constructor of variant `ValidationFail.InstructionFailed.InvalidParameter.Wasm`
       */ Wasm: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'InstructionFailed',
        lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>
      > => ({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.InvalidParameter.Wasm(value),
      }), /**
       * Value of variant `ValidationFail.InstructionFailed.InvalidParameter.TimeTriggerInThePast`
       */
      TimeTriggerInThePast: Object.freeze<
        lib.Variant<
          'InstructionFailed',
          lib.Variant<
            'InvalidParameter',
            lib.VariantUnit<'TimeTriggerInThePast'>
          >
        >
      >({
        kind: 'InstructionFailed',
        value: InstructionExecutionError.InvalidParameter.TimeTriggerInThePast,
      }),
    }, /**
     * Constructor of variant `ValidationFail.InstructionFailed.InvariantViolation`
     */
    InvariantViolation: <const T extends lib.String>(
      value: T,
    ): lib.Variant<
      'InstructionFailed',
      lib.Variant<'InvariantViolation', T>
    > => ({
      kind: 'InstructionFailed',
      value: InstructionExecutionError.InvariantViolation(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `ValidationFail.QueryFailed`
   */
  QueryFailed: {
    /**
     * Constructors of nested enumerations under variant `ValidationFail.QueryFailed.Find`
     */ Find: {
      /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Asset`
       */ Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Asset', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Asset(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.AssetDefinition`
       */
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.AssetDefinition(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Account`
       */
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Account', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Account(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Domain`
       */
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Domain', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Domain(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.MetadataKey`
       */
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.MetadataKey(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Block`
       */
      Block: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Block', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Block(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Transaction`
       */
      Transaction: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Transaction', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Transaction(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Peer`
       */
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Peer', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Peer(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Trigger`
       */
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Trigger', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Trigger(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Role`
       */
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Role', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Role(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.Permission`
       */
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'Permission', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.Permission(value),
      }), /**
       * Constructor of variant `ValidationFail.QueryFailed.Find.PublicKey`
       */
      PublicKey: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'QueryFailed',
        lib.Variant<'Find', lib.Variant<'PublicKey', T>>
      > => ({
        kind: 'QueryFailed',
        value: QueryExecutionFail.Find.PublicKey(value),
      }),
    }, /**
     * Constructor of variant `ValidationFail.QueryFailed.Conversion`
     */
    Conversion: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>> => ({
      kind: 'QueryFailed',
      value: QueryExecutionFail.Conversion(value),
    }), /**
     * Value of variant `ValidationFail.QueryFailed.NotFound`
     */
    NotFound: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>
    >({ kind: 'QueryFailed', value: QueryExecutionFail.NotFound }), /**
     * Value of variant `ValidationFail.QueryFailed.CursorMismatch`
     */
    CursorMismatch: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>
    >({ kind: 'QueryFailed', value: QueryExecutionFail.CursorMismatch }), /**
     * Value of variant `ValidationFail.QueryFailed.CursorDone`
     */
    CursorDone: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>
    >({ kind: 'QueryFailed', value: QueryExecutionFail.CursorDone }), /**
     * Value of variant `ValidationFail.QueryFailed.FetchSizeTooBig`
     */
    FetchSizeTooBig: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>
    >({ kind: 'QueryFailed', value: QueryExecutionFail.FetchSizeTooBig }), /**
     * Value of variant `ValidationFail.QueryFailed.InvalidSingularParameters`
     */
    InvalidSingularParameters: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'InvalidSingularParameters'>>
    >({
      kind: 'QueryFailed',
      value: QueryExecutionFail.InvalidSingularParameters,
    }), /**
     * Value of variant `ValidationFail.QueryFailed.CapacityLimit`
     */
    CapacityLimit: Object.freeze<
      lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>
    >({ kind: 'QueryFailed', value: QueryExecutionFail.CapacityLimit }),
  }, /**
   * Value of variant `ValidationFail.TooComplex`
   */
  TooComplex: Object.freeze<lib.VariantUnit<'TooComplex'>>({
    kind: 'TooComplex',
  }), /**
   * Value of variant `ValidationFail.InternalError`
   */
  InternalError: Object.freeze<lib.VariantUnit<'InternalError'>>({
    kind: 'InternalError',
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        NotPermitted: [lib.String]
        InstructionFailed: [InstructionExecutionError]
        QueryFailed: [QueryExecutionFail]
        TooComplex: []
        InternalError: []
      }
    >({
      NotPermitted: [0, lib.getCodec(lib.String)],
      InstructionFailed: [1, lib.getCodec(InstructionExecutionError)],
      QueryFailed: [2, lib.getCodec(QueryExecutionFail)],
      TooComplex: [3],
      InternalError: [4],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface InstructionExecutionFail {
  instruction: InstructionBox
  reason: lib.String
}
/**
 * Codec of the structure.
 */
export const InstructionExecutionFail: lib.CodecContainer<
  InstructionExecutionFail
> = lib.defineCodec(
  lib.structCodec<InstructionExecutionFail>(['instruction', 'reason'], {
    instruction: lib.lazyCodec(() => lib.getCodec(InstructionBox)),
    reason: lib.getCodec(lib.String),
  }),
)

/**
 * Structure with named fields.
 */
export interface WasmExecutionFail {
  reason: lib.String
}
/**
 * Codec of the structure.
 */
export const WasmExecutionFail: lib.CodecContainer<WasmExecutionFail> = lib
  .defineCodec(
    lib.structCodec<WasmExecutionFail>(['reason'], {
      reason: lib.getCodec(lib.String),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `AccountDoesNotExist`
 * - `LimitCheck`
 * - `Validation`
 * - `InstructionExecution`
 * - `WasmExecution`
 *
 * TODO how to construct, how to use
 */
export type TransactionRejectionReason =
  | lib.Variant<'AccountDoesNotExist', FindError>
  | lib.Variant<'LimitCheck', TransactionLimitError>
  | lib.Variant<'Validation', ValidationFail>
  | lib.Variant<'InstructionExecution', InstructionExecutionFail>
  | lib.Variant<'WasmExecution', WasmExecutionFail>
/**
 * Codec and constructors for enumeration {@link TransactionRejectionReason}.
 */
export const TransactionRejectionReason = {
  /**
   * Constructors of nested enumerations under variant `TransactionRejectionReason.AccountDoesNotExist`
   */ AccountDoesNotExist: {
    /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Asset`
     */ Asset: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Asset', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Asset(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.AssetDefinition`
     */
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<
      'AccountDoesNotExist',
      lib.Variant<'AssetDefinition', T>
    > => ({
      kind: 'AccountDoesNotExist',
      value: FindError.AssetDefinition(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Account`
     */
    Account: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Account', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Account(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Domain`
     */
    Domain: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Domain', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Domain(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.MetadataKey`
     */
    MetadataKey: <const T extends lib.Name>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'MetadataKey', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.MetadataKey(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Block`
     */
    Block: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Block', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Block(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Transaction`
     */
    Transaction: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Transaction', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Transaction(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Peer`
     */
    Peer: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Peer', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Peer(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Trigger`
     */
    Trigger: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Trigger', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Trigger(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Role`
     */
    Role: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Role', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Role(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.Permission`
     */
    Permission: <const T extends Permission>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'Permission', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.Permission(value),
    }), /**
     * Constructor of variant `TransactionRejectionReason.AccountDoesNotExist.PublicKey`
     */
    PublicKey: <const T extends lib.PublicKeyRepr>(
      value: T,
    ): lib.Variant<'AccountDoesNotExist', lib.Variant<'PublicKey', T>> => ({
      kind: 'AccountDoesNotExist',
      value: FindError.PublicKey(value),
    }),
  }, /**
   * Constructor of variant `TransactionRejectionReason.LimitCheck`
   */
  LimitCheck: <const T extends TransactionLimitError>(
    value: T,
  ): lib.Variant<'LimitCheck', T> => ({ kind: 'LimitCheck', value }), /**
   * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation`
   */
  Validation: {
    /**
     * Constructor of variant `TransactionRejectionReason.Validation.NotPermitted`
     */ NotPermitted: <const T extends lib.String>(
      value: T,
    ): lib.Variant<'Validation', lib.Variant<'NotPermitted', T>> => ({
      kind: 'Validation',
      value: ValidationFail.NotPermitted(value),
    }), /**
     * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed`
     */
    InstructionFailed: {
      /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate`
       */ Evaluate: {
        /**
         * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported`
         */ Unsupported: {
          /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Register`
           */ Register: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Register,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Unregister`
           */
          Unregister: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Unregister,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Mint`
           */
          Mint: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Mint,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Burn`
           */
          Burn: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Burn,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Transfer`
           */
          Transfer: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Transfer,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetKeyValue`
           */
          SetKeyValue: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.SetKeyValue,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue`
           */
          RemoveKeyValue: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'RemoveKeyValue'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported
              .RemoveKeyValue,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Grant`
           */
          Grant: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Grant,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Revoke`
           */
          Revoke: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Revoke,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger`
           */
          ExecuteTrigger: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'ExecuteTrigger'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported
              .ExecuteTrigger,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.SetParameter`
           */
          SetParameter: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'SetParameter'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported
              .SetParameter,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Upgrade`
           */
          Upgrade: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Upgrade,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Log`
           */
          Log: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Log,
          }), /**
           * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Unsupported.Custom`
           */
          Custom: Object.freeze<
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>
                >
              >
            >
          >({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Unsupported.Custom,
          }),
        }, /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.PermissionParameter`
         */
        PermissionParameter: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Evaluate.PermissionParameter(
            value,
          ),
        }), /**
         * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type`
         */
        Type: {
          /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.AssetType`
           */ AssetType: <const T extends Mismatch<AssetType>>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Evaluate',
                lib.Variant<'Type', lib.Variant<'AssetType', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Evaluate.Type.AssetType(
              value,
            ),
          }), /**
           * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected`
           */
          NumericAssetTypeExpected: {
            /**
             * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric`
             */ Numeric: <const T extends NumericSpec>(
              value: T,
            ): lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<
                  'Evaluate',
                  lib.Variant<
                    'Type',
                    lib.Variant<
                      'NumericAssetTypeExpected',
                      lib.Variant<'Numeric', T>
                    >
                  >
                >
              >
            > => ({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type
                .NumericAssetTypeExpected.Numeric(value),
            }), /**
             * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store`
             */
            Store: Object.freeze<
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Evaluate',
                    lib.Variant<
                      'Type',
                      lib.Variant<
                        'NumericAssetTypeExpected',
                        lib.VariantUnit<'Store'>
                      >
                    >
                  >
                >
              >
            >({
              kind: 'Validation',
              value: ValidationFail.InstructionFailed.Evaluate.Type
                .NumericAssetTypeExpected.Store,
            }),
          },
        },
      }, /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Query`
       */
      Query: {
        /**
         * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find`
         */ Find: {
          /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Asset`
           */ Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Asset', T>>>
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Asset(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.AssetDefinition`
           */
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.AssetDefinition(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Account`
           */
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'Account', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Account(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Domain`
           */
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'Domain', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Domain(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.MetadataKey`
           */
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.MetadataKey(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Block`
           */
          Block: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Block', T>>>
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Block(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Transaction`
           */
          Transaction: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'Transaction', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Transaction(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Peer`
           */
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Peer', T>>>
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Peer(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Trigger`
           */
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'Trigger', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Trigger(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Role`
           */
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.Variant<'Find', lib.Variant<'Role', T>>>
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Role(value),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.Permission`
           */
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'Permission', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.Permission(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Find.PublicKey`
           */
          PublicKey: <const T extends lib.PublicKeyRepr>(
            value: T,
          ): lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Query',
                lib.Variant<'Find', lib.Variant<'PublicKey', T>>
              >
            >
          > => ({
            kind: 'Validation',
            value: ValidationFail.InstructionFailed.Query.Find.PublicKey(value),
          }),
        }, /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.Conversion`
         */
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Query', lib.Variant<'Conversion', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.Conversion(value),
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.NotFound`
         */
        NotFound: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'NotFound'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.NotFound,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.CursorMismatch`
         */
        CursorMismatch: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CursorMismatch,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.CursorDone`
         */
        CursorDone: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CursorDone,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.FetchSizeTooBig`
         */
        FetchSizeTooBig: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.FetchSizeTooBig,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.InvalidSingularParameters`
         */
        InvalidSingularParameters: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'InvalidSingularParameters'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.InvalidSingularParameters,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Query.CapacityLimit`
         */
        CapacityLimit: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Query.CapacityLimit,
        }),
      }, /**
       * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Conversion`
       */
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Validation',
        lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>>
      > => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Conversion(value),
      }), /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Find`
       */
      Find: {
        /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Asset`
         */ Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Asset', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Asset(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.AssetDefinition`
         */
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.AssetDefinition(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Account`
         */
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Account', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Account(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Domain`
         */
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Domain', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Domain(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.MetadataKey`
         */
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.MetadataKey(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Block`
         */
        Block: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Block', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Block(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Transaction`
         */
        Transaction: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Transaction', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Transaction(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Peer`
         */
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Peer', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Peer(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Trigger`
         */
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Trigger', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Trigger(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Role`
         */
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Role', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Role(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.Permission`
         */
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'Permission', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.Permission(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Find.PublicKey`
         */
        PublicKey: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Find', lib.Variant<'PublicKey', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Find.PublicKey(value),
        }),
      }, /**
       * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Repetition`
       */
      Repetition: <const T extends RepetitionError>(
        value: T,
      ): lib.Variant<
        'Validation',
        lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>>
      > => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.Repetition(value),
      }), /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Mintability`
       */
      Mintability: {
        /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Mintability.MintUnmintable`
         */ MintUnmintable: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Mintability.MintUnmintable,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Mintability.ForbidMintOnMintable`
         */
        ForbidMintOnMintable: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'Mintability',
                lib.VariantUnit<'ForbidMintOnMintable'>
              >
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Mintability.ForbidMintOnMintable,
        }),
      }, /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.Math`
       */
      Math: {
        /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.Overflow`
         */ Overflow: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'Overflow'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.Overflow,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.NotEnoughQuantity`
         */
        NotEnoughQuantity: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.NotEnoughQuantity,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.DivideByZero`
         */
        DivideByZero: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.DivideByZero,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.NegativeValue`
         */
        NegativeValue: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.NegativeValue,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.DomainViolation`
         */
        DomainViolation: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.DomainViolation,
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.Unknown`
         */
        Unknown: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'Math', lib.VariantUnit<'Unknown'>>
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.Unknown,
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.Math.FixedPointConversion`
         */
        FixedPointConversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.Math.FixedPointConversion(
            value,
          ),
        }),
      }, /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter`
       */
      InvalidParameter: {
        /**
         * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.Wasm`
         */ Wasm: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'InstructionFailed',
            lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.InvalidParameter.Wasm(value),
        }), /**
         * Value of variant `TransactionRejectionReason.Validation.InstructionFailed.InvalidParameter.TimeTriggerInThePast`
         */
        TimeTriggerInThePast: Object.freeze<
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<
                'InvalidParameter',
                lib.VariantUnit<'TimeTriggerInThePast'>
              >
            >
          >
        >({
          kind: 'Validation',
          value: ValidationFail.InstructionFailed.InvalidParameter
            .TimeTriggerInThePast,
        }),
      }, /**
       * Constructor of variant `TransactionRejectionReason.Validation.InstructionFailed.InvariantViolation`
       */
      InvariantViolation: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Validation',
        lib.Variant<'InstructionFailed', lib.Variant<'InvariantViolation', T>>
      > => ({
        kind: 'Validation',
        value: ValidationFail.InstructionFailed.InvariantViolation(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.QueryFailed`
     */
    QueryFailed: {
      /**
       * Constructors of nested enumerations under variant `TransactionRejectionReason.Validation.QueryFailed.Find`
       */ Find: {
        /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Asset`
         */ Asset: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Asset', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Asset(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.AssetDefinition`
         */
        AssetDefinition: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.AssetDefinition(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Account`
         */
        Account: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Account', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Account(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Domain`
         */
        Domain: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Domain', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Domain(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.MetadataKey`
         */
        MetadataKey: <const T extends lib.Name>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.MetadataKey(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Block`
         */
        Block: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Block', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Block(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Transaction`
         */
        Transaction: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Transaction', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Transaction(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Peer`
         */
        Peer: <const T extends PeerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Peer', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Peer(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Trigger`
         */
        Trigger: <const T extends TriggerId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Trigger', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Trigger(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Role`
         */
        Role: <const T extends RoleId>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Role', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Role(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.Permission`
         */
        Permission: <const T extends Permission>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'Permission', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.Permission(value),
        }), /**
         * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Find.PublicKey`
         */
        PublicKey: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.Variant<'Find', lib.Variant<'PublicKey', T>>
          >
        > => ({
          kind: 'Validation',
          value: ValidationFail.QueryFailed.Find.PublicKey(value),
        }),
      }, /**
       * Constructor of variant `TransactionRejectionReason.Validation.QueryFailed.Conversion`
       */
      Conversion: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Validation',
        lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>>
      > => ({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.Conversion(value),
      }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.NotFound`
       */
      NotFound: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>
        >
      >({ kind: 'Validation', value: ValidationFail.QueryFailed.NotFound }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.CursorMismatch`
       */
      CursorMismatch: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>
        >
      >({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CursorMismatch,
      }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.CursorDone`
       */
      CursorDone: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>
        >
      >({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CursorDone,
      }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.FetchSizeTooBig`
       */
      FetchSizeTooBig: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>
        >
      >({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.FetchSizeTooBig,
      }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.InvalidSingularParameters`
       */
      InvalidSingularParameters: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<
            'QueryFailed',
            lib.VariantUnit<'InvalidSingularParameters'>
          >
        >
      >({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.InvalidSingularParameters,
      }), /**
       * Value of variant `TransactionRejectionReason.Validation.QueryFailed.CapacityLimit`
       */
      CapacityLimit: Object.freeze<
        lib.Variant<
          'Validation',
          lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>
        >
      >({
        kind: 'Validation',
        value: ValidationFail.QueryFailed.CapacityLimit,
      }),
    }, /**
     * Value of variant `TransactionRejectionReason.Validation.TooComplex`
     */
    TooComplex: Object.freeze<
      lib.Variant<'Validation', lib.VariantUnit<'TooComplex'>>
    >({ kind: 'Validation', value: ValidationFail.TooComplex }), /**
     * Value of variant `TransactionRejectionReason.Validation.InternalError`
     */
    InternalError: Object.freeze<
      lib.Variant<'Validation', lib.VariantUnit<'InternalError'>>
    >({ kind: 'Validation', value: ValidationFail.InternalError }),
  }, /**
   * Constructor of variant `TransactionRejectionReason.InstructionExecution`
   */
  InstructionExecution: <const T extends InstructionExecutionFail>(
    value: T,
  ): lib.Variant<'InstructionExecution', T> => ({
    kind: 'InstructionExecution',
    value,
  }), /**
   * Constructor of variant `TransactionRejectionReason.WasmExecution`
   */
  WasmExecution: <const T extends WasmExecutionFail>(
    value: T,
  ): lib.Variant<'WasmExecution', T> => ({ kind: 'WasmExecution', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        AccountDoesNotExist: [FindError]
        LimitCheck: [TransactionLimitError]
        Validation: [ValidationFail]
        InstructionExecution: [InstructionExecutionFail]
        WasmExecution: [WasmExecutionFail]
      }
    >({
      AccountDoesNotExist: [0, lib.getCodec(FindError)],
      LimitCheck: [1, lib.getCodec(TransactionLimitError)],
      Validation: [2, lib.getCodec(ValidationFail)],
      InstructionExecution: [3, lib.getCodec(InstructionExecutionFail)],
      WasmExecution: [4, lib.getCodec(WasmExecutionFail)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Queued`
 * - `Expired`
 * - `Approved`
 * - `Rejected`
 *
 * TODO how to construct, how to use
 */
export type TransactionStatus =
  | lib.VariantUnit<'Queued'>
  | lib.VariantUnit<'Expired'>
  | lib.VariantUnit<'Approved'>
  | lib.Variant<'Rejected', TransactionRejectionReason>
/**
 * Codec and constructors for enumeration {@link TransactionStatus}.
 */
export const TransactionStatus = {
  /**
   * Value of variant `TransactionStatus.Queued`
   */ Queued: Object.freeze<lib.VariantUnit<'Queued'>>({ kind: 'Queued' }), /**
   * Value of variant `TransactionStatus.Expired`
   */
  Expired: Object.freeze<lib.VariantUnit<'Expired'>>({ kind: 'Expired' }), /**
   * Value of variant `TransactionStatus.Approved`
   */
  Approved: Object.freeze<lib.VariantUnit<'Approved'>>({
    kind: 'Approved',
  }), /**
   * Constructors of nested enumerations under variant `TransactionStatus.Rejected`
   */
  Rejected: {
    /**
     * Constructors of nested enumerations under variant `TransactionStatus.Rejected.AccountDoesNotExist`
     */ AccountDoesNotExist: {
      /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Asset`
       */ Asset: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Asset', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Asset(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.AssetDefinition`
       */
      AssetDefinition: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'AssetDefinition', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.AssetDefinition(
          value,
        ),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Account`
       */
      Account: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Account', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Account(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Domain`
       */
      Domain: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Domain', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Domain(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.MetadataKey`
       */
      MetadataKey: <const T extends lib.Name>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'MetadataKey', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.MetadataKey(
          value,
        ),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Block`
       */
      Block: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Block', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Block(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Transaction`
       */
      Transaction: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Transaction', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Transaction(
          value,
        ),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Peer`
       */
      Peer: <const T extends PeerId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Peer', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Peer(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Trigger`
       */
      Trigger: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Trigger', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Trigger(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Role`
       */
      Role: <const T extends RoleId>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Role', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Role(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.Permission`
       */
      Permission: <const T extends Permission>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'Permission', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.Permission(value),
      }), /**
       * Constructor of variant `TransactionStatus.Rejected.AccountDoesNotExist.PublicKey`
       */
      PublicKey: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'AccountDoesNotExist', lib.Variant<'PublicKey', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.AccountDoesNotExist.PublicKey(value),
      }),
    }, /**
     * Constructor of variant `TransactionStatus.Rejected.LimitCheck`
     */
    LimitCheck: <const T extends TransactionLimitError>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'LimitCheck', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.LimitCheck(value),
    }), /**
     * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation`
     */
    Validation: {
      /**
       * Constructor of variant `TransactionStatus.Rejected.Validation.NotPermitted`
       */ NotPermitted: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Rejected',
        lib.Variant<'Validation', lib.Variant<'NotPermitted', T>>
      > => ({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.NotPermitted(value),
      }), /**
       * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed`
       */
      InstructionFailed: {
        /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate`
         */ Evaluate: {
          /**
           * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported`
           */ Unsupported: {
            /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Register`
             */ Register: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Register'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Register,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Unregister`
             */
            Unregister: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Unregister'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Unregister,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Mint`
             */
            Mint: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Mint'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Mint,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Burn`
             */
            Burn: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Burn'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Burn,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Transfer`
             */
            Transfer: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Transfer'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Transfer,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.SetKeyValue`
             */
            SetKeyValue: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'SetKeyValue'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.SetKeyValue,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.RemoveKeyValue`
             */
            RemoveKeyValue: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<
                        'Unsupported',
                        lib.VariantUnit<'RemoveKeyValue'>
                      >
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.RemoveKeyValue,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Grant`
             */
            Grant: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Grant'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Grant,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Revoke`
             */
            Revoke: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Revoke'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Revoke,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.ExecuteTrigger`
             */
            ExecuteTrigger: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<
                        'Unsupported',
                        lib.VariantUnit<'ExecuteTrigger'>
                      >
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.ExecuteTrigger,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.SetParameter`
             */
            SetParameter: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<
                        'Unsupported',
                        lib.VariantUnit<'SetParameter'>
                      >
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.SetParameter,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Upgrade`
             */
            Upgrade: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Upgrade'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Upgrade,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Log`
             */
            Log: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Log'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Log,
            }), /**
             * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Unsupported.Custom`
             */
            Custom: Object.freeze<
              lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<'Unsupported', lib.VariantUnit<'Custom'>>
                    >
                  >
                >
              >
            >({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed.Evaluate
                .Unsupported.Custom,
            }),
          }, /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.PermissionParameter`
           */
          PermissionParameter: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Evaluate', lib.Variant<'PermissionParameter', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed
              .Evaluate.PermissionParameter(value),
          }), /**
           * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Type`
           */
          Type: {
            /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Type.AssetType`
             */ AssetType: <const T extends Mismatch<AssetType>>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Evaluate',
                    lib.Variant<'Type', lib.Variant<'AssetType', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Evaluate.Type.AssetType(value),
            }), /**
             * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected`
             */
            NumericAssetTypeExpected: {
              /**
               * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Numeric`
               */ Numeric: <const T extends NumericSpec>(
                value: T,
              ): lib.Variant<
                'Rejected',
                lib.Variant<
                  'Validation',
                  lib.Variant<
                    'InstructionFailed',
                    lib.Variant<
                      'Evaluate',
                      lib.Variant<
                        'Type',
                        lib.Variant<
                          'NumericAssetTypeExpected',
                          lib.Variant<'Numeric', T>
                        >
                      >
                    >
                  >
                >
              > => ({
                kind: 'Rejected',
                value: TransactionRejectionReason.Validation.InstructionFailed
                  .Evaluate.Type.NumericAssetTypeExpected.Numeric(value),
              }), /**
               * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Evaluate.Type.NumericAssetTypeExpected.Store`
               */
              Store: Object.freeze<
                lib.Variant<
                  'Rejected',
                  lib.Variant<
                    'Validation',
                    lib.Variant<
                      'InstructionFailed',
                      lib.Variant<
                        'Evaluate',
                        lib.Variant<
                          'Type',
                          lib.Variant<
                            'NumericAssetTypeExpected',
                            lib.VariantUnit<'Store'>
                          >
                        >
                      >
                    >
                  >
                >
              >({
                kind: 'Rejected',
                value: TransactionRejectionReason.Validation.InstructionFailed
                  .Evaluate.Type.NumericAssetTypeExpected.Store,
              }),
            },
          },
        }, /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query`
         */
        Query: {
          /**
           * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find`
           */ Find: {
            /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Asset`
             */ Asset: <const T extends lib.AssetId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Asset', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Asset(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.AssetDefinition`
             */
            AssetDefinition: <const T extends lib.AssetDefinitionId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.AssetDefinition(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Account`
             */
            Account: <const T extends lib.AccountId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Account', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Account(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Domain`
             */
            Domain: <const T extends lib.DomainId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Domain', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Domain(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.MetadataKey`
             */
            MetadataKey: <const T extends lib.Name>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.MetadataKey(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Block`
             */
            Block: <const T extends lib.HashRepr>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Block', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Block(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Transaction`
             */
            Transaction: <const T extends lib.HashRepr>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Transaction', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Transaction(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Peer`
             */
            Peer: <const T extends PeerId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Peer', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Peer(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Trigger`
             */
            Trigger: <const T extends TriggerId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Trigger', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Trigger(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Role`
             */
            Role: <const T extends RoleId>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Role', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Role(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.Permission`
             */
            Permission: <const T extends Permission>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'Permission', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.Permission(value),
            }), /**
             * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Find.PublicKey`
             */
            PublicKey: <const T extends lib.PublicKeyRepr>(
              value: T,
            ): lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.Variant<'Find', lib.Variant<'PublicKey', T>>
                  >
                >
              >
            > => ({
              kind: 'Rejected',
              value: TransactionRejectionReason.Validation.InstructionFailed
                .Query.Find.PublicKey(value),
            }),
          }, /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.Conversion`
           */
          Conversion: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Query', lib.Variant<'Conversion', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .Conversion(value),
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.NotFound`
           */
          NotFound: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.VariantUnit<'NotFound'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .NotFound,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.CursorMismatch`
           */
          CursorMismatch: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.VariantUnit<'CursorMismatch'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .CursorMismatch,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.CursorDone`
           */
          CursorDone: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.VariantUnit<'CursorDone'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .CursorDone,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.FetchSizeTooBig`
           */
          FetchSizeTooBig: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.VariantUnit<'FetchSizeTooBig'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .FetchSizeTooBig,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.InvalidSingularParameters`
           */
          InvalidSingularParameters: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Query',
                    lib.VariantUnit<'InvalidSingularParameters'>
                  >
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .InvalidSingularParameters,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Query.CapacityLimit`
           */
          CapacityLimit: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Query', lib.VariantUnit<'CapacityLimit'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Query
              .CapacityLimit,
          }),
        }, /**
         * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Conversion`
         */
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Conversion', T>>
          >
        > => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed
            .Conversion(value),
        }), /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find`
         */
        Find: {
          /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Asset`
           */ Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Asset', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Asset(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.AssetDefinition`
           */
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .AssetDefinition(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Account`
           */
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Account', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Account(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Domain`
           */
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Domain', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Domain(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.MetadataKey`
           */
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .MetadataKey(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Block`
           */
          Block: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Block', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Block(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Transaction`
           */
          Transaction: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Transaction', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Transaction(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Peer`
           */
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Peer', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Peer(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Trigger`
           */
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Trigger', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Trigger(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Role`
           */
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Role', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Role(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.Permission`
           */
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'Permission', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .Permission(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Find.PublicKey`
           */
          PublicKey: <const T extends lib.PublicKeyRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Find', lib.Variant<'PublicKey', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Find
              .PublicKey(value),
          }),
        }, /**
         * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Repetition`
         */
        Repetition: <const T extends RepetitionError>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<
            'Validation',
            lib.Variant<'InstructionFailed', lib.Variant<'Repetition', T>>
          >
        > => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed
            .Repetition(value),
        }), /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Mintability`
         */
        Mintability: {
          /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Mintability.MintUnmintable`
           */ MintUnmintable: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Mintability', lib.VariantUnit<'MintUnmintable'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed
              .Mintability.MintUnmintable,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Mintability.ForbidMintOnMintable`
           */
          ForbidMintOnMintable: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'Mintability',
                    lib.VariantUnit<'ForbidMintOnMintable'>
                  >
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed
              .Mintability.ForbidMintOnMintable,
          }),
        }, /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math`
         */
        Math: {
          /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.Overflow`
           */ Overflow: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'Overflow'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .Overflow,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.NotEnoughQuantity`
           */
          NotEnoughQuantity: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'NotEnoughQuantity'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .NotEnoughQuantity,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.DivideByZero`
           */
          DivideByZero: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'DivideByZero'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .DivideByZero,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.NegativeValue`
           */
          NegativeValue: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'NegativeValue'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .NegativeValue,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.DomainViolation`
           */
          DomainViolation: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'DomainViolation'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .DomainViolation,
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.Unknown`
           */
          Unknown: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<'Math', lib.VariantUnit<'Unknown'>>
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .Unknown,
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.Math.FixedPointConversion`
           */
          FixedPointConversion: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'Math', lib.Variant<'FixedPointConversion', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed.Math
              .FixedPointConversion(value),
          }),
        }, /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.InstructionFailed.InvalidParameter`
         */
        InvalidParameter: {
          /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.InvalidParameter.Wasm`
           */ Wasm: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'InstructionFailed',
                lib.Variant<'InvalidParameter', lib.Variant<'Wasm', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed
              .InvalidParameter.Wasm(value),
          }), /**
           * Value of variant `TransactionStatus.Rejected.Validation.InstructionFailed.InvalidParameter.TimeTriggerInThePast`
           */
          TimeTriggerInThePast: Object.freeze<
            lib.Variant<
              'Rejected',
              lib.Variant<
                'Validation',
                lib.Variant<
                  'InstructionFailed',
                  lib.Variant<
                    'InvalidParameter',
                    lib.VariantUnit<'TimeTriggerInThePast'>
                  >
                >
              >
            >
          >({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.InstructionFailed
              .InvalidParameter.TimeTriggerInThePast,
          }),
        }, /**
         * Constructor of variant `TransactionStatus.Rejected.Validation.InstructionFailed.InvariantViolation`
         */
        InvariantViolation: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<
            'Validation',
            lib.Variant<
              'InstructionFailed',
              lib.Variant<'InvariantViolation', T>
            >
          >
        > => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.InstructionFailed
            .InvariantViolation(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.QueryFailed`
       */
      QueryFailed: {
        /**
         * Constructors of nested enumerations under variant `TransactionStatus.Rejected.Validation.QueryFailed.Find`
         */ Find: {
          /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Asset`
           */ Asset: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Asset', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Asset(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.AssetDefinition`
           */
          AssetDefinition: <const T extends lib.AssetDefinitionId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'AssetDefinition', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .AssetDefinition(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Account`
           */
          Account: <const T extends lib.AccountId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Account', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .Account(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Domain`
           */
          Domain: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Domain', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .Domain(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.MetadataKey`
           */
          MetadataKey: <const T extends lib.Name>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'MetadataKey', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .MetadataKey(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Block`
           */
          Block: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Block', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Block(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Transaction`
           */
          Transaction: <const T extends lib.HashRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Transaction', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .Transaction(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Peer`
           */
          Peer: <const T extends PeerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Peer', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Peer(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Trigger`
           */
          Trigger: <const T extends TriggerId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Trigger', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .Trigger(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Role`
           */
          Role: <const T extends RoleId>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Role', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find.Role(
              value,
            ),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.Permission`
           */
          Permission: <const T extends Permission>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'Permission', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .Permission(value),
          }), /**
           * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Find.PublicKey`
           */
          PublicKey: <const T extends lib.PublicKeyRepr>(
            value: T,
          ): lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.Variant<'Find', lib.Variant<'PublicKey', T>>
              >
            >
          > => ({
            kind: 'Rejected',
            value: TransactionRejectionReason.Validation.QueryFailed.Find
              .PublicKey(value),
          }),
        }, /**
         * Constructor of variant `TransactionStatus.Rejected.Validation.QueryFailed.Conversion`
         */
        Conversion: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Rejected',
          lib.Variant<
            'Validation',
            lib.Variant<'QueryFailed', lib.Variant<'Conversion', T>>
          >
        > => ({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.Conversion(
            value,
          ),
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.NotFound`
         */
        NotFound: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.VariantUnit<'NotFound'>>
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.NotFound,
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.CursorMismatch`
         */
        CursorMismatch: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.VariantUnit<'CursorMismatch'>>
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CursorMismatch,
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.CursorDone`
         */
        CursorDone: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.VariantUnit<'CursorDone'>>
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CursorDone,
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.FetchSizeTooBig`
         */
        FetchSizeTooBig: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.VariantUnit<'FetchSizeTooBig'>>
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.FetchSizeTooBig,
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.InvalidSingularParameters`
         */
        InvalidSingularParameters: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<
                'QueryFailed',
                lib.VariantUnit<'InvalidSingularParameters'>
              >
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed
            .InvalidSingularParameters,
        }), /**
         * Value of variant `TransactionStatus.Rejected.Validation.QueryFailed.CapacityLimit`
         */
        CapacityLimit: Object.freeze<
          lib.Variant<
            'Rejected',
            lib.Variant<
              'Validation',
              lib.Variant<'QueryFailed', lib.VariantUnit<'CapacityLimit'>>
            >
          >
        >({
          kind: 'Rejected',
          value: TransactionRejectionReason.Validation.QueryFailed.CapacityLimit,
        }),
      }, /**
       * Value of variant `TransactionStatus.Rejected.Validation.TooComplex`
       */
      TooComplex: Object.freeze<
        lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.VariantUnit<'TooComplex'>>
        >
      >({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.TooComplex,
      }), /**
       * Value of variant `TransactionStatus.Rejected.Validation.InternalError`
       */
      InternalError: Object.freeze<
        lib.Variant<
          'Rejected',
          lib.Variant<'Validation', lib.VariantUnit<'InternalError'>>
        >
      >({
        kind: 'Rejected',
        value: TransactionRejectionReason.Validation.InternalError,
      }),
    }, /**
     * Constructor of variant `TransactionStatus.Rejected.InstructionExecution`
     */
    InstructionExecution: <const T extends InstructionExecutionFail>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'InstructionExecution', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.InstructionExecution(value),
    }), /**
     * Constructor of variant `TransactionStatus.Rejected.WasmExecution`
     */
    WasmExecution: <const T extends WasmExecutionFail>(
      value: T,
    ): lib.Variant<'Rejected', lib.Variant<'WasmExecution', T>> => ({
      kind: 'Rejected',
      value: TransactionRejectionReason.WasmExecution(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Queued: []
        Expired: []
        Approved: []
        Rejected: [TransactionRejectionReason]
      }
    >({
      Queued: [0],
      Expired: [1],
      Approved: [2],
      Rejected: [3, lib.getCodec(TransactionRejectionReason)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TransactionEventFilter {
  hash: lib.Option<lib.HashRepr>
  blockHeight: lib.Option<lib.Option<lib.NonZero<lib.U64>>>
  status: lib.Option<TransactionStatus>
}
/**
 * Codec of the structure.
 */
export const TransactionEventFilter: lib.CodecContainer<
  TransactionEventFilter
> = lib.defineCodec(
  lib.structCodec<TransactionEventFilter>(['hash', 'blockHeight', 'status'], {
    hash: lib.Option.with(lib.getCodec(lib.HashRepr)),
    blockHeight: lib.Option.with(
      lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U64))),
    ),
    status: lib.Option.with(lib.getCodec(TransactionStatus)),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `ConsensusBlockRejection`
 *
 * TODO how to construct, how to use
 */
export type BlockRejectionReason = lib.VariantUnit<'ConsensusBlockRejection'>
/**
 * Codec and constructors for enumeration {@link BlockRejectionReason}.
 */
export const BlockRejectionReason = {
  /**
   * Value of variant `BlockRejectionReason.ConsensusBlockRejection`
   */ ConsensusBlockRejection: Object.freeze<
    lib.VariantUnit<'ConsensusBlockRejection'>
  >({ kind: 'ConsensusBlockRejection' }),
  ...lib.defineCodec(
    lib.enumCodec<{ ConsensusBlockRejection: [] }>({
      ConsensusBlockRejection: [0],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Approved`
 * - `Rejected`
 * - `Committed`
 * - `Applied`
 *
 * TODO how to construct, how to use
 */
export type BlockStatus =
  | lib.VariantUnit<'Created'>
  | lib.VariantUnit<'Approved'>
  | lib.Variant<'Rejected', BlockRejectionReason>
  | lib.VariantUnit<'Committed'>
  | lib.VariantUnit<'Applied'>
/**
 * Codec and constructors for enumeration {@link BlockStatus}.
 */
export const BlockStatus = {
  /**
   * Value of variant `BlockStatus.Created`
   */ Created: Object.freeze<lib.VariantUnit<'Created'>>({
    kind: 'Created',
  }), /**
   * Value of variant `BlockStatus.Approved`
   */
  Approved: Object.freeze<lib.VariantUnit<'Approved'>>({
    kind: 'Approved',
  }), /**
   * Constructors of nested enumerations under variant `BlockStatus.Rejected`
   */
  Rejected: {
    /**
     * Value of variant `BlockStatus.Rejected.ConsensusBlockRejection`
     */ ConsensusBlockRejection: Object.freeze<
      lib.Variant<'Rejected', lib.VariantUnit<'ConsensusBlockRejection'>>
    >({
      kind: 'Rejected',
      value: BlockRejectionReason.ConsensusBlockRejection,
    }),
  }, /**
   * Value of variant `BlockStatus.Committed`
   */
  Committed: Object.freeze<lib.VariantUnit<'Committed'>>({
    kind: 'Committed',
  }), /**
   * Value of variant `BlockStatus.Applied`
   */
  Applied: Object.freeze<lib.VariantUnit<'Applied'>>({ kind: 'Applied' }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: []
        Approved: []
        Rejected: [BlockRejectionReason]
        Committed: []
        Applied: []
      }
    >({
      Created: [0],
      Approved: [1],
      Rejected: [2, lib.getCodec(BlockRejectionReason)],
      Committed: [3],
      Applied: [4],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface BlockEventFilter {
  height: lib.Option<lib.NonZero<lib.U64>>
  status: lib.Option<BlockStatus>
}
/**
 * Codec of the structure.
 */
export const BlockEventFilter: lib.CodecContainer<BlockEventFilter> = lib
  .defineCodec(
    lib.structCodec<BlockEventFilter>(['height', 'status'], {
      height: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U64))),
      status: lib.Option.with(lib.getCodec(BlockStatus)),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Transaction`
 * - `Block`
 *
 * TODO how to construct, how to use
 */
export type PipelineEventFilterBox =
  | lib.Variant<'Transaction', TransactionEventFilter>
  | lib.Variant<'Block', BlockEventFilter>
/**
 * Codec and constructors for enumeration {@link PipelineEventFilterBox}.
 */
export const PipelineEventFilterBox = {
  /**
   * Constructor of variant `PipelineEventFilterBox.Transaction`
   */ Transaction: <const T extends TransactionEventFilter>(
    value: T,
  ): lib.Variant<'Transaction', T> => ({ kind: 'Transaction', value }), /**
   * Constructor of variant `PipelineEventFilterBox.Block`
   */
  Block: <const T extends BlockEventFilter>(
    value: T,
  ): lib.Variant<'Block', T> => ({ kind: 'Block', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Transaction: [TransactionEventFilter]; Block: [BlockEventFilter] }
    >({
      Transaction: [0, lib.getCodec(TransactionEventFilter)],
      Block: [1, lib.getCodec(BlockEventFilter)],
    }).discriminated(),
  ),
}

export type PeerEventSet = Set<'Added' | 'Removed'>
export const PeerEventSet = lib.defineCodec(
  lib.bitmapCodec<PeerEventSet extends Set<infer T> ? T : never>({
    Added: 1,
    Removed: 2,
  }),
)

/**
 * Structure with named fields.
 */
export interface PeerEventFilter {
  idMatcher: lib.Option<PeerId>
  eventSet: PeerEventSet
}
/**
 * Codec of the structure.
 */
export const PeerEventFilter: lib.CodecContainer<PeerEventFilter> = lib
  .defineCodec(
    lib.structCodec<PeerEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(PeerId)),
      eventSet: lib.getCodec(PeerEventSet),
    }),
  )

export type DomainEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'AnyAssetDefinition'
  | 'AnyAccount'
  | 'MetadataInserted'
  | 'MetadataRemoved'
  | 'OwnerChanged'
>
export const DomainEventSet = lib.defineCodec(
  lib.bitmapCodec<DomainEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    AnyAssetDefinition: 4,
    AnyAccount: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
    OwnerChanged: 64,
  }),
)

/**
 * Structure with named fields.
 */
export interface DomainEventFilter {
  idMatcher: lib.Option<lib.DomainId>
  eventSet: DomainEventSet
}
/**
 * Codec of the structure.
 */
export const DomainEventFilter: lib.CodecContainer<DomainEventFilter> = lib
  .defineCodec(
    lib.structCodec<DomainEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(lib.DomainId)),
      eventSet: lib.getCodec(DomainEventSet),
    }),
  )

export type AssetEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'Added'
  | 'Removed'
  | 'MetadataInserted'
  | 'MetadataRemoved'
>
export const AssetEventSet = lib.defineCodec(
  lib.bitmapCodec<AssetEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    Added: 4,
    Removed: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
  }),
)

/**
 * Structure with named fields.
 */
export interface AssetEventFilter {
  idMatcher: lib.Option<lib.AssetId>
  eventSet: AssetEventSet
}
/**
 * Codec of the structure.
 */
export const AssetEventFilter: lib.CodecContainer<AssetEventFilter> = lib
  .defineCodec(
    lib.structCodec<AssetEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(lib.AssetId)),
      eventSet: lib.getCodec(AssetEventSet),
    }),
  )

export type AssetDefinitionEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'MetadataInserted'
  | 'MetadataRemoved'
  | 'MintabilityChanged'
  | 'TotalQuantityChanged'
  | 'OwnerChanged'
>
export const AssetDefinitionEventSet = lib.defineCodec(
  lib.bitmapCodec<AssetDefinitionEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    MetadataInserted: 4,
    MetadataRemoved: 8,
    MintabilityChanged: 16,
    TotalQuantityChanged: 32,
    OwnerChanged: 64,
  }),
)

/**
 * Structure with named fields.
 */
export interface AssetDefinitionEventFilter {
  idMatcher: lib.Option<lib.AssetDefinitionId>
  eventSet: AssetDefinitionEventSet
}
/**
 * Codec of the structure.
 */
export const AssetDefinitionEventFilter: lib.CodecContainer<
  AssetDefinitionEventFilter
> = lib.defineCodec(
  lib.structCodec<AssetDefinitionEventFilter>(['idMatcher', 'eventSet'], {
    idMatcher: lib.Option.with(lib.getCodec(lib.AssetDefinitionId)),
    eventSet: lib.getCodec(AssetDefinitionEventSet),
  }),
)

export type TriggerEventSet = Set<
  | 'Created'
  | 'Deleted'
  | 'Extended'
  | 'Shortened'
  | 'MetadataInserted'
  | 'MetadataRemoved'
>
export const TriggerEventSet = lib.defineCodec(
  lib.bitmapCodec<TriggerEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    Extended: 4,
    Shortened: 8,
    MetadataInserted: 16,
    MetadataRemoved: 32,
  }),
)

/**
 * Structure with named fields.
 */
export interface TriggerEventFilter {
  idMatcher: lib.Option<TriggerId>
  eventSet: TriggerEventSet
}
/**
 * Codec of the structure.
 */
export const TriggerEventFilter: lib.CodecContainer<TriggerEventFilter> = lib
  .defineCodec(
    lib.structCodec<TriggerEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(TriggerId)),
      eventSet: lib.getCodec(TriggerEventSet),
    }),
  )

export type RoleEventSet = Set<
  'Created' | 'Deleted' | 'PermissionAdded' | 'PermissionRemoved'
>
export const RoleEventSet = lib.defineCodec(
  lib.bitmapCodec<RoleEventSet extends Set<infer T> ? T : never>({
    Created: 1,
    Deleted: 2,
    PermissionAdded: 4,
    PermissionRemoved: 8,
  }),
)

/**
 * Structure with named fields.
 */
export interface RoleEventFilter {
  idMatcher: lib.Option<RoleId>
  eventSet: RoleEventSet
}
/**
 * Codec of the structure.
 */
export const RoleEventFilter: lib.CodecContainer<RoleEventFilter> = lib
  .defineCodec(
    lib.structCodec<RoleEventFilter>(['idMatcher', 'eventSet'], {
      idMatcher: lib.Option.with(lib.getCodec(RoleId)),
      eventSet: lib.getCodec(RoleEventSet),
    }),
  )

export type ConfigurationEventSet = Set<'Changed'>
export const ConfigurationEventSet = lib.defineCodec(
  lib.bitmapCodec<ConfigurationEventSet extends Set<infer T> ? T : never>({
    Changed: 1,
  }),
)

/**
 * Structure with named fields.
 */
export interface ConfigurationEventFilter {
  eventSet: ConfigurationEventSet
}
/**
 * Codec of the structure.
 */
export const ConfigurationEventFilter: lib.CodecContainer<
  ConfigurationEventFilter
> = lib.defineCodec(
  lib.structCodec<ConfigurationEventFilter>(['eventSet'], {
    eventSet: lib.getCodec(ConfigurationEventSet),
  }),
)

export type ExecutorEventSet = Set<'Upgraded'>
export const ExecutorEventSet = lib.defineCodec(
  lib.bitmapCodec<ExecutorEventSet extends Set<infer T> ? T : never>({
    Upgraded: 1,
  }),
)

/**
 * Structure with named fields.
 */
export interface ExecutorEventFilter {
  eventSet: ExecutorEventSet
}
/**
 * Codec of the structure.
 */
export const ExecutorEventFilter: lib.CodecContainer<ExecutorEventFilter> = lib
  .defineCodec(
    lib.structCodec<ExecutorEventFilter>(['eventSet'], {
      eventSet: lib.getCodec(ExecutorEventSet),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Any`
 * - `Peer`
 * - `Domain`
 * - `Account`
 * - `Asset`
 * - `AssetDefinition`
 * - `Trigger`
 * - `Role`
 * - `Configuration`
 * - `Executor`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link DataEventFilter}.
 */
export const DataEventFilter = {
  /**
   * Value of variant `DataEventFilter.Any`
   */ Any: Object.freeze<lib.VariantUnit<'Any'>>({ kind: 'Any' }), /**
   * Constructor of variant `DataEventFilter.Peer`
   */
  Peer: <const T extends PeerEventFilter>(
    value: T,
  ): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }), /**
   * Constructor of variant `DataEventFilter.Domain`
   */
  Domain: <const T extends DomainEventFilter>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `DataEventFilter.Account`
   */
  Account: <const T extends AccountEventFilter>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `DataEventFilter.Asset`
   */
  Asset: <const T extends AssetEventFilter>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `DataEventFilter.AssetDefinition`
   */
  AssetDefinition: <const T extends AssetDefinitionEventFilter>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `DataEventFilter.Trigger`
   */
  Trigger: <const T extends TriggerEventFilter>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }), /**
   * Constructor of variant `DataEventFilter.Role`
   */
  Role: <const T extends RoleEventFilter>(
    value: T,
  ): lib.Variant<'Role', T> => ({ kind: 'Role', value }), /**
   * Constructor of variant `DataEventFilter.Configuration`
   */
  Configuration: <const T extends ConfigurationEventFilter>(
    value: T,
  ): lib.Variant<'Configuration', T> => ({ kind: 'Configuration', value }), /**
   * Constructor of variant `DataEventFilter.Executor`
   */
  Executor: <const T extends ExecutorEventFilter>(
    value: T,
  ): lib.Variant<'Executor', T> => ({ kind: 'Executor', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
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
      }
    >({
      Any: [0],
      Peer: [1, lib.getCodec(PeerEventFilter)],
      Domain: [2, lib.getCodec(DomainEventFilter)],
      Account: [3, lib.getCodec(AccountEventFilter)],
      Asset: [4, lib.getCodec(AssetEventFilter)],
      AssetDefinition: [5, lib.getCodec(AssetDefinitionEventFilter)],
      Trigger: [6, lib.getCodec(TriggerEventFilter)],
      Role: [7, lib.getCodec(RoleEventFilter)],
      Configuration: [8, lib.getCodec(ConfigurationEventFilter)],
      Executor: [9, lib.getCodec(ExecutorEventFilter)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Schedule {
  start: lib.Timestamp
  period: lib.Option<lib.Duration>
}
/**
 * Codec of the structure.
 */
export const Schedule: lib.CodecContainer<Schedule> = lib.defineCodec(
  lib.structCodec<Schedule>(['start', 'period'], {
    start: lib.getCodec(lib.Timestamp),
    period: lib.Option.with(lib.getCodec(lib.Duration)),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `PreCommit`
 * - `Schedule`
 *
 * TODO how to construct, how to use
 */
export type ExecutionTime =
  | lib.VariantUnit<'PreCommit'>
  | lib.Variant<'Schedule', Schedule>
/**
 * Codec and constructors for enumeration {@link ExecutionTime}.
 */
export const ExecutionTime = {
  /**
   * Value of variant `ExecutionTime.PreCommit`
   */ PreCommit: Object.freeze<lib.VariantUnit<'PreCommit'>>({
    kind: 'PreCommit',
  }), /**
   * Constructor of variant `ExecutionTime.Schedule`
   */
  Schedule: <const T extends Schedule>(
    value: T,
  ): lib.Variant<'Schedule', T> => ({ kind: 'Schedule', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ PreCommit: []; Schedule: [Schedule] }>({
      PreCommit: [0],
      Schedule: [1, lib.getCodec(Schedule)],
    }).discriminated(),
  ),
}

export type TimeEventFilter = ExecutionTime
export const TimeEventFilter = ExecutionTime

/**
 * Structure with named fields.
 */
export interface ExecuteTriggerEventFilter {
  triggerId: lib.Option<TriggerId>
  authority: lib.Option<lib.AccountId>
}
/**
 * Codec of the structure.
 */
export const ExecuteTriggerEventFilter: lib.CodecContainer<
  ExecuteTriggerEventFilter
> = lib.defineCodec(
  lib.structCodec<ExecuteTriggerEventFilter>(['triggerId', 'authority'], {
    triggerId: lib.Option.with(lib.getCodec(TriggerId)),
    authority: lib.Option.with(lib.getCodec(lib.AccountId)),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Success`
 * - `Failure`
 *
 * TODO how to construct, how to use
 */
export type TriggerCompletedOutcomeType =
  | lib.VariantUnit<'Success'>
  | lib.VariantUnit<'Failure'>
/**
 * Codec and constructors for enumeration {@link TriggerCompletedOutcomeType}.
 */
export const TriggerCompletedOutcomeType = {
  /**
   * Value of variant `TriggerCompletedOutcomeType.Success`
   */ Success: Object.freeze<lib.VariantUnit<'Success'>>({
    kind: 'Success',
  }), /**
   * Value of variant `TriggerCompletedOutcomeType.Failure`
   */
  Failure: Object.freeze<lib.VariantUnit<'Failure'>>({ kind: 'Failure' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Success: []; Failure: [] }>({ Success: [0], Failure: [1] })
      .discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TriggerCompletedEventFilter {
  triggerId: lib.Option<TriggerId>
  outcomeType: lib.Option<TriggerCompletedOutcomeType>
}
/**
 * Codec of the structure.
 */
export const TriggerCompletedEventFilter: lib.CodecContainer<
  TriggerCompletedEventFilter
> = lib.defineCodec(
  lib.structCodec<TriggerCompletedEventFilter>(['triggerId', 'outcomeType'], {
    triggerId: lib.Option.with(lib.getCodec(TriggerId)),
    outcomeType: lib.Option.with(lib.getCodec(TriggerCompletedOutcomeType)),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Pipeline`
 * - `Data`
 * - `Time`
 * - `ExecuteTrigger`
 * - `TriggerCompleted`
 *
 * TODO how to construct, how to use
 */
export type EventFilterBox =
  | lib.Variant<'Pipeline', PipelineEventFilterBox>
  | lib.Variant<'Data', DataEventFilter>
  | lib.Variant<'Time', TimeEventFilter>
  | lib.Variant<'ExecuteTrigger', ExecuteTriggerEventFilter>
  | lib.Variant<'TriggerCompleted', TriggerCompletedEventFilter>
/**
 * Codec and constructors for enumeration {@link EventFilterBox}.
 */
export const EventFilterBox = {
  /**
   * Constructors of nested enumerations under variant `EventFilterBox.Pipeline`
   */ Pipeline: {
    /**
     * Constructor of variant `EventFilterBox.Pipeline.Transaction`
     */ Transaction: <const T extends TransactionEventFilter>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Transaction', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Transaction(value),
    }), /**
     * Constructor of variant `EventFilterBox.Pipeline.Block`
     */
    Block: <const T extends BlockEventFilter>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Block', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventFilterBox.Block(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `EventFilterBox.Data`
   */
  Data: {
    /**
     * Value of variant `EventFilterBox.Data.Any`
     */ Any: Object.freeze<lib.Variant<'Data', lib.VariantUnit<'Any'>>>({
      kind: 'Data',
      value: DataEventFilter.Any,
    }), /**
     * Constructor of variant `EventFilterBox.Data.Peer`
     */
    Peer: <const T extends PeerEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Peer', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Peer(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Domain`
     */
    Domain: <const T extends DomainEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Domain', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Domain(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Account`
     */
    Account: <const T extends AccountEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Account', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Account(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Asset`
     */
    Asset: <const T extends AssetEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Asset', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Asset(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.AssetDefinition`
     */
    AssetDefinition: <const T extends AssetDefinitionEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Data',
      value: DataEventFilter.AssetDefinition(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Trigger`
     */
    Trigger: <const T extends TriggerEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Trigger', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Trigger(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Role`
     */
    Role: <const T extends RoleEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Role', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Role(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Configuration`
     */
    Configuration: <const T extends ConfigurationEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Configuration', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Configuration(value),
    }), /**
     * Constructor of variant `EventFilterBox.Data.Executor`
     */
    Executor: <const T extends ExecutorEventFilter>(
      value: T,
    ): lib.Variant<'Data', lib.Variant<'Executor', T>> => ({
      kind: 'Data',
      value: DataEventFilter.Executor(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `EventFilterBox.Time`
   */
  Time: {
    /**
     * Value of variant `EventFilterBox.Time.PreCommit`
     */ PreCommit: Object.freeze<
      lib.Variant<'Time', lib.VariantUnit<'PreCommit'>>
    >({ kind: 'Time', value: TimeEventFilter.PreCommit }), /**
     * Constructor of variant `EventFilterBox.Time.Schedule`
     */
    Schedule: <const T extends Schedule>(
      value: T,
    ): lib.Variant<'Time', lib.Variant<'Schedule', T>> => ({
      kind: 'Time',
      value: TimeEventFilter.Schedule(value),
    }),
  }, /**
   * Constructor of variant `EventFilterBox.ExecuteTrigger`
   */
  ExecuteTrigger: <const T extends ExecuteTriggerEventFilter>(
    value: T,
  ): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }), /**
   * Constructor of variant `EventFilterBox.TriggerCompleted`
   */
  TriggerCompleted: <const T extends TriggerCompletedEventFilter>(
    value: T,
  ): lib.Variant<'TriggerCompleted', T> => ({
    kind: 'TriggerCompleted',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Pipeline: [PipelineEventFilterBox]
        Data: [DataEventFilter]
        Time: [TimeEventFilter]
        ExecuteTrigger: [ExecuteTriggerEventFilter]
        TriggerCompleted: [TriggerCompletedEventFilter]
      }
    >({
      Pipeline: [0, lib.getCodec(PipelineEventFilterBox)],
      Data: [1, lib.getCodec(DataEventFilter)],
      Time: [2, lib.getCodec(TimeEventFilter)],
      ExecuteTrigger: [3, lib.getCodec(ExecuteTriggerEventFilter)],
      TriggerCompleted: [4, lib.getCodec(TriggerCompletedEventFilter)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Action {
  executable: Executable
  repeats: Repeats
  authority: lib.AccountId
  filter: EventFilterBox
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const Action: lib.CodecContainer<Action> = lib.defineCodec(
  lib.structCodec<Action>([
    'executable',
    'repeats',
    'authority',
    'filter',
    'metadata',
  ], {
    executable: lib.getCodec(Executable),
    repeats: lib.getCodec(Repeats),
    authority: lib.getCodec(lib.AccountId),
    filter: lib.getCodec(EventFilterBox),
    metadata: lib.getCodec(Metadata),
  }),
)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type ActionPredicateAtom = never
/**
 * Codec for {@link ActionPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const ActionPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type ActionProjectionPredicate =
  | lib.Variant<'Atom', ActionPredicateAtom>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link ActionProjectionPredicate}.
 */
export const ActionProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `ActionProjectionPredicate.Metadata`
   */ Metadata: {
    /**
     * Constructor of variant `ActionProjectionPredicate.Metadata.Key`
     */ Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [ActionPredicateAtom]; Metadata: [MetadataProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(ActionPredicateAtom)],
      Metadata: [1, lib.getCodec(MetadataProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type ActionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
/**
 * Codec and constructors for enumeration {@link ActionProjectionSelector}.
 */
export const ActionProjectionSelector = {
  /**
   * Value of variant `ActionProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `ActionProjectionSelector.Metadata`
   */
  Metadata: {
    /**
     * Value of variant `ActionProjectionSelector.Metadata.Atom`
     */ Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }), /**
     * Constructor of variant `ActionProjectionSelector.Metadata.Key`
     */
    Key: <const T extends MetadataKeyProjectionSelector>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Metadata: [MetadataProjectionSelector] }>({
      Atom: [0],
      Metadata: [1, lib.getCodec(MetadataProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Infinitely`
 * - `Once`
 * - `Not`
 *
 * TODO how to construct, how to use
 */
export type Mintable =
  | lib.VariantUnit<'Infinitely'>
  | lib.VariantUnit<'Once'>
  | lib.VariantUnit<'Not'>
/**
 * Codec and constructors for enumeration {@link Mintable}.
 */
export const Mintable = {
  /**
   * Value of variant `Mintable.Infinitely`
   */ Infinitely: Object.freeze<lib.VariantUnit<'Infinitely'>>({
    kind: 'Infinitely',
  }), /**
   * Value of variant `Mintable.Once`
   */
  Once: Object.freeze<lib.VariantUnit<'Once'>>({ kind: 'Once' }), /**
   * Value of variant `Mintable.Not`
   */
  Not: Object.freeze<lib.VariantUnit<'Not'>>({ kind: 'Not' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Infinitely: []; Once: []; Not: [] }>({
      Infinitely: [0],
      Once: [1],
      Not: [2],
    }).discriminated(),
  ),
}

export type IpfsPath = lib.String
export const IpfsPath = lib.String

/**
 * Structure with named fields.
 */
export interface AssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<IpfsPath>
  metadata: Metadata
  ownedBy: lib.AccountId
  totalQuantity: Numeric
}
/**
 * Codec of the structure.
 */
export const AssetDefinition: lib.CodecContainer<AssetDefinition> = lib
  .defineCodec(
    lib.structCodec<AssetDefinition>([
      'id',
      'type',
      'mintable',
      'logo',
      'metadata',
      'ownedBy',
      'totalQuantity',
    ], {
      id: lib.getCodec(lib.AssetDefinitionId),
      type: lib.getCodec(AssetType),
      mintable: lib.getCodec(Mintable),
      logo: lib.Option.with(lib.getCodec(IpfsPath)),
      metadata: lib.getCodec(Metadata),
      ownedBy: lib.getCodec(lib.AccountId),
      totalQuantity: lib.getCodec(Numeric),
    }),
  )

/**
 * Structure with named fields.
 */
export interface AssetDefinitionTotalQuantityChanged {
  assetDefinition: lib.AssetDefinitionId
  totalAmount: Numeric
}
/**
 * Codec of the structure.
 */
export const AssetDefinitionTotalQuantityChanged: lib.CodecContainer<
  AssetDefinitionTotalQuantityChanged
> = lib.defineCodec(
  lib.structCodec<AssetDefinitionTotalQuantityChanged>([
    'assetDefinition',
    'totalAmount',
  ], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
    totalAmount: lib.getCodec(Numeric),
  }),
)

/**
 * Structure with named fields.
 */
export interface AssetDefinitionOwnerChanged {
  assetDefinition: lib.AssetDefinitionId
  newOwner: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const AssetDefinitionOwnerChanged: lib.CodecContainer<
  AssetDefinitionOwnerChanged
> = lib.defineCodec(
  lib.structCodec<AssetDefinitionOwnerChanged>(
    ['assetDefinition', 'newOwner'],
    {
      assetDefinition: lib.getCodec(lib.AssetDefinitionId),
      newOwner: lib.getCodec(lib.AccountId),
    },
  ),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `MetadataInserted`
 * - `MetadataRemoved`
 * - `MintabilityChanged`
 * - `TotalQuantityChanged`
 * - `OwnerChanged`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionEvent =
  | lib.Variant<'Created', AssetDefinition>
  | lib.Variant<'Deleted', lib.AssetDefinitionId>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.AssetDefinitionId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.AssetDefinitionId>>
  | lib.Variant<'MintabilityChanged', lib.AssetDefinitionId>
  | lib.Variant<'TotalQuantityChanged', AssetDefinitionTotalQuantityChanged>
  | lib.Variant<'OwnerChanged', AssetDefinitionOwnerChanged>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionEvent}.
 */
export const AssetDefinitionEvent = {
  /**
   * Constructor of variant `AssetDefinitionEvent.Created`
   */ Created: <const T extends AssetDefinition>(
    value: T,
  ): lib.Variant<'Created', T> => ({ kind: 'Created', value }), /**
   * Constructor of variant `AssetDefinitionEvent.Deleted`
   */
  Deleted: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }), /**
   * Constructor of variant `AssetDefinitionEvent.MetadataInserted`
   */
  MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }), /**
   * Constructor of variant `AssetDefinitionEvent.MetadataRemoved`
   */
  MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }), /**
   * Constructor of variant `AssetDefinitionEvent.MintabilityChanged`
   */
  MintabilityChanged: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'MintabilityChanged', T> => ({
    kind: 'MintabilityChanged',
    value,
  }), /**
   * Constructor of variant `AssetDefinitionEvent.TotalQuantityChanged`
   */
  TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
    value: T,
  ): lib.Variant<'TotalQuantityChanged', T> => ({
    kind: 'TotalQuantityChanged',
    value,
  }), /**
   * Constructor of variant `AssetDefinitionEvent.OwnerChanged`
   */
  OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
    value: T,
  ): lib.Variant<'OwnerChanged', T> => ({ kind: 'OwnerChanged', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [AssetDefinition]
        Deleted: [lib.AssetDefinitionId]
        MetadataInserted: [MetadataChanged<lib.AssetDefinitionId>]
        MetadataRemoved: [MetadataChanged<lib.AssetDefinitionId>]
        MintabilityChanged: [lib.AssetDefinitionId]
        TotalQuantityChanged: [AssetDefinitionTotalQuantityChanged]
        OwnerChanged: [AssetDefinitionOwnerChanged]
      }
    >({
      Created: [0, lib.getCodec(AssetDefinition)],
      Deleted: [1, lib.getCodec(lib.AssetDefinitionId)],
      MetadataInserted: [
        2,
        MetadataChanged.with(lib.getCodec(lib.AssetDefinitionId)),
      ],
      MetadataRemoved: [
        3,
        MetadataChanged.with(lib.getCodec(lib.AssetDefinitionId)),
      ],
      MintabilityChanged: [4, lib.getCodec(lib.AssetDefinitionId)],
      TotalQuantityChanged: [
        5,
        lib.getCodec(AssetDefinitionTotalQuantityChanged),
      ],
      OwnerChanged: [6, lib.getCodec(AssetDefinitionOwnerChanged)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionIdPredicateAtom = lib.Variant<
  'Equals',
  lib.AssetDefinitionId
>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionIdPredicateAtom}.
 */
export const AssetDefinitionIdPredicateAtom = {
  /**
   * Constructor of variant `AssetDefinitionIdPredicateAtom.Equals`
   */ Equals: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.AssetDefinitionId] }>({
      Equals: [0, lib.getCodec(lib.AssetDefinitionId)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Domain`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionIdProjectionPredicate =
  | lib.Variant<'Atom', AssetDefinitionIdPredicateAtom>
  | lib.Variant<'Domain', DomainIdProjectionPredicate>
  | lib.Variant<'Name', NameProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionIdProjectionPredicate}.
 */
export const AssetDefinitionIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `AssetDefinitionIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AssetDefinitionIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Domain`
   */
  Domain: {
    /**
     * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Domain.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals`
       */ Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Domain',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Domain.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Domain.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }), /**
         * Constructor of variant `AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Domain',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Name`
   */
  Name: {
    /**
     * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionPredicate.Name.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetDefinitionIdProjectionPredicate.Name.Atom.Equals`
       */ Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }), /**
       * Constructor of variant `AssetDefinitionIdProjectionPredicate.Name.Atom.Contains`
       */
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Contains', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }), /**
       * Constructor of variant `AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith`
       */
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }), /**
       * Constructor of variant `AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith`
       */
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AssetDefinitionIdPredicateAtom]
        Domain: [DomainIdProjectionPredicate]
        Name: [NameProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AssetDefinitionIdPredicateAtom)],
      Domain: [1, lib.getCodec(DomainIdProjectionPredicate)],
      Name: [2, lib.getCodec(NameProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Domain`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Domain', DomainIdProjectionSelector>
  | lib.Variant<'Name', NameProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionIdProjectionSelector}.
 */
export const AssetDefinitionIdProjectionSelector = {
  /**
   * Value of variant `AssetDefinitionIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionSelector.Domain`
   */
  Domain: {
    /**
     * Value of variant `AssetDefinitionIdProjectionSelector.Domain.Atom`
     */ Atom: Object.freeze<lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>({
      kind: 'Domain',
      value: DomainIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionSelector.Domain.Name`
     */
    Name: {
      /**
       * Value of variant `AssetDefinitionIdProjectionSelector.Domain.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Domain', value: DomainIdProjectionSelector.Name.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetDefinitionIdProjectionSelector.Name`
   */
  Name: {
    /**
     * Value of variant `AssetDefinitionIdProjectionSelector.Name.Atom`
     */ Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Domain: [DomainIdProjectionSelector]
        Name: [NameProjectionSelector]
      }
    >({
      Atom: [0],
      Domain: [1, lib.getCodec(DomainIdProjectionSelector)],
      Name: [2, lib.getCodec(NameProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type AssetDefinitionPredicateAtom = never
/**
 * Codec for {@link AssetDefinitionPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const AssetDefinitionPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionProjectionPredicate =
  | lib.Variant<'Atom', AssetDefinitionPredicateAtom>
  | lib.Variant<'Id', AssetDefinitionIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionProjectionPredicate}.
 */
export const AssetDefinitionProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Domain`
     */
    Domain: {
      /**
       * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Domain.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Domain.Atom.Equals`
         */ Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Domain.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Domain.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Domain.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(
              value,
            ),
          }), /**
           * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Domain.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .Contains(value),
          }), /**
           * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Domain.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .StartsWith(value),
          }), /**
           * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Domain.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .EndsWith(value),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Id.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(
            value,
          ),
        }), /**
         * Constructor of variant `AssetDefinitionProjectionPredicate.Id.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Id',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetDefinitionProjectionPredicate.Metadata`
   */
  Metadata: {
    /**
     * Constructor of variant `AssetDefinitionProjectionPredicate.Metadata.Key`
     */ Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AssetDefinitionPredicateAtom]
        Id: [AssetDefinitionIdProjectionPredicate]
        Metadata: [MetadataProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AssetDefinitionPredicateAtom)],
      Id: [1, lib.getCodec(AssetDefinitionIdProjectionPredicate)],
      Metadata: [2, lib.getCodec(MetadataProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type AssetDefinitionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AssetDefinitionIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AssetDefinitionProjectionSelector}.
 */
export const AssetDefinitionProjectionSelector = {
  /**
   * Value of variant `AssetDefinitionProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AssetDefinitionProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `AssetDefinitionProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AssetDefinitionIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AssetDefinitionProjectionSelector.Id.Domain`
     */
    Domain: {
      /**
       * Value of variant `AssetDefinitionProjectionSelector.Id.Domain.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Id',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }), /**
       * Constructors of nested enumerations under variant `AssetDefinitionProjectionSelector.Id.Domain.Name`
       */
      Name: {
        /**
         * Value of variant `AssetDefinitionProjectionSelector.Id.Domain.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
          >
        >({
          kind: 'Id',
          value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetDefinitionProjectionSelector.Id.Name`
     */
    Name: {
      /**
       * Value of variant `AssetDefinitionProjectionSelector.Id.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: AssetDefinitionIdProjectionSelector.Name.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetDefinitionProjectionSelector.Metadata`
   */
  Metadata: {
    /**
     * Value of variant `AssetDefinitionProjectionSelector.Metadata.Atom`
     */ Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }), /**
     * Constructor of variant `AssetDefinitionProjectionSelector.Metadata.Key`
     */
    Key: <const T extends MetadataKeyProjectionSelector>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Id: [AssetDefinitionIdProjectionSelector]
        Metadata: [MetadataProjectionSelector]
      }
    >({
      Atom: [0],
      Id: [1, lib.getCodec(AssetDefinitionIdProjectionSelector)],
      Metadata: [2, lib.getCodec(MetadataProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type AssetIdPredicateAtom = lib.Variant<'Equals', lib.AssetId>
/**
 * Codec and constructors for enumeration {@link AssetIdPredicateAtom}.
 */
export const AssetIdPredicateAtom = {
  /**
   * Constructor of variant `AssetIdPredicateAtom.Equals`
   */ Equals: <const T extends lib.AssetId>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.AssetId] }>({
      Equals: [0, lib.getCodec(lib.AssetId)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Account`
 * - `Definition`
 *
 * TODO how to construct, how to use
 */
export type AssetIdProjectionPredicate =
  | lib.Variant<'Atom', AssetIdPredicateAtom>
  | lib.Variant<'Account', AccountIdProjectionPredicate>
  | lib.Variant<'Definition', AssetDefinitionIdProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AssetIdProjectionPredicate}.
 */
export const AssetIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `AssetIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: AssetIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account`
   */
  Account: {
    /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetIdProjectionPredicate.Account.Atom.Equals`
       */ Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Account',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Domain`
     */
    Domain: {
      /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Domain.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetIdProjectionPredicate.Account.Domain.Atom.Equals`
         */ Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Account',
          lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Domain.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Domain.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetIdProjectionPredicate.Account.Domain.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<
              'Domain',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Account.Domain.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(
              value,
            ),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Account.Domain.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(
              value,
            ),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Account.Domain.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Account',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Account',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(
              value,
            ),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Signatory`
     */
    Signatory: {
      /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Account.Signatory.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetIdProjectionPredicate.Account.Signatory.Atom.Equals`
         */ Equals: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'Account',
          lib.Variant<
            'Signatory',
            lib.Variant<'Atom', lib.Variant<'Equals', T>>
          >
        > => ({
          kind: 'Account',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition`
   */
  Definition: {
    /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetIdProjectionPredicate.Definition.Atom.Equals`
       */ Equals: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'Definition',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Domain`
     */
    Domain: {
      /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Domain.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetIdProjectionPredicate.Definition.Domain.Atom.Equals`
         */ Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Definition',
          lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Domain.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Domain.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<
              'Domain',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom.Equals(
              value,
            ),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Definition.Domain.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .Contains(value),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Definition.Domain.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .StartsWith(value),
          }), /**
           * Constructor of variant `AssetIdProjectionPredicate.Definition.Domain.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Definition',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Definition',
            value: AssetDefinitionIdProjectionPredicate.Domain.Name.Atom
              .EndsWith(value),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `AssetIdProjectionPredicate.Definition.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetIdProjectionPredicate.Definition.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Definition',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `AssetIdProjectionPredicate.Definition.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Definition',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `AssetIdProjectionPredicate.Definition.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Definition',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.StartsWith(
            value,
          ),
        }), /**
         * Constructor of variant `AssetIdProjectionPredicate.Definition.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Definition',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AssetIdPredicateAtom]
        Account: [AccountIdProjectionPredicate]
        Definition: [AssetDefinitionIdProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AssetIdPredicateAtom)],
      Account: [1, lib.getCodec(AccountIdProjectionPredicate)],
      Definition: [2, lib.getCodec(AssetDefinitionIdProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Account`
 * - `Definition`
 *
 * TODO how to construct, how to use
 */
export type AssetIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Account', AccountIdProjectionSelector>
  | lib.Variant<'Definition', AssetDefinitionIdProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AssetIdProjectionSelector}.
 */
export const AssetIdProjectionSelector = {
  /**
   * Value of variant `AssetIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Account`
   */
  Account: {
    /**
     * Value of variant `AssetIdProjectionSelector.Account.Atom`
     */ Atom: Object.freeze<lib.Variant<'Account', lib.VariantUnit<'Atom'>>>({
      kind: 'Account',
      value: AccountIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Account.Domain`
     */
    Domain: {
      /**
       * Value of variant `AssetIdProjectionSelector.Account.Domain.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Account', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Account',
        value: AccountIdProjectionSelector.Domain.Atom,
      }), /**
       * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Account.Domain.Name`
       */
      Name: {
        /**
         * Value of variant `AssetIdProjectionSelector.Account.Domain.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Account',
            lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
          >
        >({
          kind: 'Account',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Account.Signatory`
     */
    Signatory: {
      /**
       * Value of variant `AssetIdProjectionSelector.Account.Signatory.Atom`
       */ Atom: Object.freeze<
        lib.Variant<
          'Account',
          lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>
        >
      >({ kind: 'Account', value: AccountIdProjectionSelector.Signatory.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Definition`
   */
  Definition: {
    /**
     * Value of variant `AssetIdProjectionSelector.Definition.Atom`
     */ Atom: Object.freeze<lib.Variant<'Definition', lib.VariantUnit<'Atom'>>>(
      { kind: 'Definition', value: AssetDefinitionIdProjectionSelector.Atom },
    ), /**
     * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Definition.Domain`
     */
    Domain: {
      /**
       * Value of variant `AssetIdProjectionSelector.Definition.Domain.Atom`
       */ Atom: Object.freeze<
        lib.Variant<
          'Definition',
          lib.Variant<'Domain', lib.VariantUnit<'Atom'>>
        >
      >({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Domain.Atom,
      }), /**
       * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Definition.Domain.Name`
       */
      Name: {
        /**
         * Value of variant `AssetIdProjectionSelector.Definition.Domain.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Definition',
            lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
          >
        >({
          kind: 'Definition',
          value: AssetDefinitionIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetIdProjectionSelector.Definition.Name`
     */
    Name: {
      /**
       * Value of variant `AssetIdProjectionSelector.Definition.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Definition', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Definition',
        value: AssetDefinitionIdProjectionSelector.Name.Atom,
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Account: [AccountIdProjectionSelector]
        Definition: [AssetDefinitionIdProjectionSelector]
      }
    >({
      Atom: [0],
      Account: [1, lib.getCodec(AccountIdProjectionSelector)],
      Definition: [2, lib.getCodec(AssetDefinitionIdProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type AssetPredicateAtom = never
/**
 * Codec for {@link AssetPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const AssetPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `IsNumeric`
 * - `IsStore`
 *
 * TODO how to construct, how to use
 */
export type AssetValuePredicateAtom =
  | lib.VariantUnit<'IsNumeric'>
  | lib.VariantUnit<'IsStore'>
/**
 * Codec and constructors for enumeration {@link AssetValuePredicateAtom}.
 */
export const AssetValuePredicateAtom = {
  /**
   * Value of variant `AssetValuePredicateAtom.IsNumeric`
   */ IsNumeric: Object.freeze<lib.VariantUnit<'IsNumeric'>>({
    kind: 'IsNumeric',
  }), /**
   * Value of variant `AssetValuePredicateAtom.IsStore`
   */
  IsStore: Object.freeze<lib.VariantUnit<'IsStore'>>({ kind: 'IsStore' }),
  ...lib.defineCodec(
    lib.enumCodec<{ IsNumeric: []; IsStore: [] }>({
      IsNumeric: [0],
      IsStore: [1],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type NumericProjectionPredicate = never
/**
 * Codec for {@link NumericProjectionPredicate}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const NumericProjectionPredicate = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Numeric`
 * - `Store`
 *
 * TODO how to construct, how to use
 */
export type AssetValueProjectionPredicate =
  | lib.Variant<'Atom', AssetValuePredicateAtom>
  | lib.Variant<'Numeric', NumericProjectionPredicate>
  | lib.Variant<'Store', MetadataProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AssetValueProjectionPredicate}.
 */
export const AssetValueProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AssetValueProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Value of variant `AssetValueProjectionPredicate.Atom.IsNumeric`
     */ IsNumeric: Object.freeze<
      lib.Variant<'Atom', lib.VariantUnit<'IsNumeric'>>
    >({ kind: 'Atom', value: AssetValuePredicateAtom.IsNumeric }), /**
     * Value of variant `AssetValueProjectionPredicate.Atom.IsStore`
     */
    IsStore: Object.freeze<lib.Variant<'Atom', lib.VariantUnit<'IsStore'>>>({
      kind: 'Atom',
      value: AssetValuePredicateAtom.IsStore,
    }),
  }, /**
   * Constructors of nested enumerations under variant `AssetValueProjectionPredicate.Store`
   */
  Store: {
    /**
     * Constructor of variant `AssetValueProjectionPredicate.Store.Key`
     */ Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Store', lib.Variant<'Key', T>> => ({
      kind: 'Store',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AssetValuePredicateAtom]
        Numeric: [NumericProjectionPredicate]
        Store: [MetadataProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AssetValuePredicateAtom)],
      Numeric: [1, lib.getCodec(NumericProjectionPredicate)],
      Store: [2, lib.getCodec(MetadataProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Value`
 *
 * TODO how to construct, how to use
 */
export type AssetProjectionPredicate =
  | lib.Variant<'Atom', AssetPredicateAtom>
  | lib.Variant<'Id', AssetIdProjectionPredicate>
  | lib.Variant<'Value', AssetValueProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link AssetProjectionPredicate}.
 */
export const AssetProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `AssetProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: AssetIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account`
     */
    Account: {
      /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetProjectionPredicate.Id.Account.Atom.Equals`
         */ Equals: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Account', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Account.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Domain`
       */
      Domain: {
        /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Domain.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetProjectionPredicate.Id.Account.Domain.Atom.Equals`
           */ Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Account',
              lib.Variant<
                'Domain',
                lib.Variant<'Atom', lib.Variant<'Equals', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Account.Domain.Atom.Equals(value),
          }),
        }, /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Domain.Name`
         */
        Name: {
          /**
           * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Domain.Name.Atom`
           */ Atom: {
            /**
             * Constructor of variant `AssetProjectionPredicate.Id.Account.Domain.Name.Atom.Equals`
             */ Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Equals', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom.Equals(
                value,
              ),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Account.Domain.Name.Atom.Contains`
             */
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Contains', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom
                .Contains(value),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Account.Domain.Name.Atom.StartsWith`
             */
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom
                .StartsWith(value),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Account.Domain.Name.Atom.EndsWith`
             */
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Account.Domain.Name.Atom
                .EndsWith(value),
            }),
          },
        },
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Signatory`
       */
      Signatory: {
        /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Account.Signatory.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetProjectionPredicate.Id.Account.Signatory.Atom.Equals`
           */ Equals: <const T extends lib.PublicKeyRepr>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Account',
              lib.Variant<
                'Signatory',
                lib.Variant<'Atom', lib.Variant<'Equals', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Account.Signatory.Atom.Equals(
              value,
            ),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition`
     */
    Definition: {
      /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Atom`
       */ Atom: {
        /**
         * Constructor of variant `AssetProjectionPredicate.Id.Definition.Atom.Equals`
         */ Equals: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<
            'Definition',
            lib.Variant<'Atom', lib.Variant<'Equals', T>>
          >
        > => ({
          kind: 'Id',
          value: AssetIdProjectionPredicate.Definition.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Domain`
       */
      Domain: {
        /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Domain.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetProjectionPredicate.Id.Definition.Domain.Atom.Equals`
           */ Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<
                'Domain',
                lib.Variant<'Atom', lib.Variant<'Equals', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Domain.Atom.Equals(
              value,
            ),
          }),
        }, /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Domain.Name`
         */
        Name: {
          /**
           * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Domain.Name.Atom`
           */ Atom: {
            /**
             * Constructor of variant `AssetProjectionPredicate.Id.Definition.Domain.Name.Atom.Equals`
             */ Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Equals', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom
                .Equals(value),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Definition.Domain.Name.Atom.Contains`
             */
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Contains', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom
                .Contains(value),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Definition.Domain.Name.Atom.StartsWith`
             */
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom
                .StartsWith(value),
            }), /**
             * Constructor of variant `AssetProjectionPredicate.Id.Definition.Domain.Name.Atom.EndsWith`
             */
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Id',
              value: AssetIdProjectionPredicate.Definition.Domain.Name.Atom
                .EndsWith(value),
            }),
          },
        },
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `AssetProjectionPredicate.Id.Definition.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `AssetProjectionPredicate.Id.Definition.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.Equals(
              value,
            ),
          }), /**
           * Constructor of variant `AssetProjectionPredicate.Id.Definition.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.Contains(
              value,
            ),
          }), /**
           * Constructor of variant `AssetProjectionPredicate.Id.Definition.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.StartsWith(
              value,
            ),
          }), /**
           * Constructor of variant `AssetProjectionPredicate.Id.Definition.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Id',
            value: AssetIdProjectionPredicate.Definition.Name.Atom.EndsWith(
              value,
            ),
          }),
        },
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetProjectionPredicate.Value`
   */
  Value: {
    /**
     * Constructors of nested enumerations under variant `AssetProjectionPredicate.Value.Atom`
     */ Atom: {
      /**
       * Value of variant `AssetProjectionPredicate.Value.Atom.IsNumeric`
       */ IsNumeric: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Atom', lib.VariantUnit<'IsNumeric'>>>
      >({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Atom.IsNumeric,
      }), /**
       * Value of variant `AssetProjectionPredicate.Value.Atom.IsStore`
       */
      IsStore: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Atom', lib.VariantUnit<'IsStore'>>>
      >({ kind: 'Value', value: AssetValueProjectionPredicate.Atom.IsStore }),
    }, /**
     * Constructors of nested enumerations under variant `AssetProjectionPredicate.Value.Store`
     */
    Store: {
      /**
       * Constructor of variant `AssetProjectionPredicate.Value.Store.Key`
       */ Key: <const T extends MetadataKeyProjectionPredicate>(
        value: T,
      ): lib.Variant<'Value', lib.Variant<'Store', lib.Variant<'Key', T>>> => ({
        kind: 'Value',
        value: AssetValueProjectionPredicate.Store.Key(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [AssetPredicateAtom]
        Id: [AssetIdProjectionPredicate]
        Value: [AssetValueProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(AssetPredicateAtom)],
      Id: [1, lib.getCodec(AssetIdProjectionPredicate)],
      Value: [2, lib.getCodec(AssetValueProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type NumericProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link NumericProjectionSelector}.
 */
export const NumericProjectionSelector = {
  /**
   * Value of variant `NumericProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Numeric`
 * - `Store`
 *
 * TODO how to construct, how to use
 */
export type AssetValueProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Numeric', NumericProjectionSelector>
  | lib.Variant<'Store', MetadataProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AssetValueProjectionSelector}.
 */
export const AssetValueProjectionSelector = {
  /**
   * Value of variant `AssetValueProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AssetValueProjectionSelector.Numeric`
   */
  Numeric: {
    /**
     * Value of variant `AssetValueProjectionSelector.Numeric.Atom`
     */ Atom: Object.freeze<lib.Variant<'Numeric', lib.VariantUnit<'Atom'>>>({
      kind: 'Numeric',
      value: NumericProjectionSelector.Atom,
    }),
  }, /**
   * Constructors of nested enumerations under variant `AssetValueProjectionSelector.Store`
   */
  Store: {
    /**
     * Value of variant `AssetValueProjectionSelector.Store.Atom`
     */ Atom: Object.freeze<lib.Variant<'Store', lib.VariantUnit<'Atom'>>>({
      kind: 'Store',
      value: MetadataProjectionSelector.Atom,
    }), /**
     * Constructor of variant `AssetValueProjectionSelector.Store.Key`
     */
    Key: <const T extends MetadataKeyProjectionSelector>(
      value: T,
    ): lib.Variant<'Store', lib.Variant<'Key', T>> => ({
      kind: 'Store',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Numeric: [NumericProjectionSelector]
        Store: [MetadataProjectionSelector]
      }
    >({
      Atom: [0],
      Numeric: [1, lib.getCodec(NumericProjectionSelector)],
      Store: [2, lib.getCodec(MetadataProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Value`
 *
 * TODO how to construct, how to use
 */
export type AssetProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', AssetIdProjectionSelector>
  | lib.Variant<'Value', AssetValueProjectionSelector>
/**
 * Codec and constructors for enumeration {@link AssetProjectionSelector}.
 */
export const AssetProjectionSelector = {
  /**
   * Value of variant `AssetProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `AssetProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `AssetProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: AssetIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Account`
     */
    Account: {
      /**
       * Value of variant `AssetProjectionSelector.Id.Account.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Account', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: AssetIdProjectionSelector.Account.Atom }), /**
       * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Account.Domain`
       */
      Domain: {
        /**
         * Value of variant `AssetProjectionSelector.Id.Account.Domain.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<
              'Account',
              lib.Variant<'Domain', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Id',
          value: AssetIdProjectionSelector.Account.Domain.Atom,
        }), /**
         * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Account.Domain.Name`
         */
        Name: {
          /**
           * Value of variant `AssetProjectionSelector.Id.Account.Domain.Name.Atom`
           */ Atom: Object.freeze<
            lib.Variant<
              'Id',
              lib.Variant<
                'Account',
                lib.Variant<
                  'Domain',
                  lib.Variant<'Name', lib.VariantUnit<'Atom'>>
                >
              >
            >
          >({
            kind: 'Id',
            value: AssetIdProjectionSelector.Account.Domain.Name.Atom,
          }),
        },
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Account.Signatory`
       */
      Signatory: {
        /**
         * Value of variant `AssetProjectionSelector.Id.Account.Signatory.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<
              'Account',
              lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Id',
          value: AssetIdProjectionSelector.Account.Signatory.Atom,
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Definition`
     */
    Definition: {
      /**
       * Value of variant `AssetProjectionSelector.Id.Definition.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Definition', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: AssetIdProjectionSelector.Definition.Atom }), /**
       * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Definition.Domain`
       */
      Domain: {
        /**
         * Value of variant `AssetProjectionSelector.Id.Definition.Domain.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<'Domain', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Id',
          value: AssetIdProjectionSelector.Definition.Domain.Atom,
        }), /**
         * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Definition.Domain.Name`
         */
        Name: {
          /**
           * Value of variant `AssetProjectionSelector.Id.Definition.Domain.Name.Atom`
           */ Atom: Object.freeze<
            lib.Variant<
              'Id',
              lib.Variant<
                'Definition',
                lib.Variant<
                  'Domain',
                  lib.Variant<'Name', lib.VariantUnit<'Atom'>>
                >
              >
            >
          >({
            kind: 'Id',
            value: AssetIdProjectionSelector.Definition.Domain.Name.Atom,
          }),
        },
      }, /**
       * Constructors of nested enumerations under variant `AssetProjectionSelector.Id.Definition.Name`
       */
      Name: {
        /**
         * Value of variant `AssetProjectionSelector.Id.Definition.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Id',
            lib.Variant<
              'Definition',
              lib.Variant<'Name', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Id',
          value: AssetIdProjectionSelector.Definition.Name.Atom,
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `AssetProjectionSelector.Value`
   */
  Value: {
    /**
     * Value of variant `AssetProjectionSelector.Value.Atom`
     */ Atom: Object.freeze<lib.Variant<'Value', lib.VariantUnit<'Atom'>>>({
      kind: 'Value',
      value: AssetValueProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `AssetProjectionSelector.Value.Numeric`
     */
    Numeric: {
      /**
       * Value of variant `AssetProjectionSelector.Value.Numeric.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Numeric', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Value', value: AssetValueProjectionSelector.Numeric.Atom }),
    }, /**
     * Constructors of nested enumerations under variant `AssetProjectionSelector.Value.Store`
     */
    Store: {
      /**
       * Value of variant `AssetProjectionSelector.Value.Store.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Store', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Value', value: AssetValueProjectionSelector.Store.Atom }), /**
       * Constructor of variant `AssetProjectionSelector.Value.Store.Key`
       */
      Key: <const T extends MetadataKeyProjectionSelector>(
        value: T,
      ): lib.Variant<'Value', lib.Variant<'Store', lib.Variant<'Key', T>>> => ({
        kind: 'Value',
        value: AssetValueProjectionSelector.Store.Key(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Id: [AssetIdProjectionSelector]
        Value: [AssetValueProjectionSelector]
      }
    >({
      Atom: [0],
      Id: [1, lib.getCodec(AssetIdProjectionSelector)],
      Value: [2, lib.getCodec(AssetValueProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface Transfer<T0, T1, T2> {
  source: T0
  object: T1
  destination: T2
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Transfer = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1, T2>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
    t2: lib.GenCodec<T2>,
  ): lib.GenCodec<Transfer<T0, T1, T2>> =>
    lib.structCodec<Transfer<T0, T1, T2>>(['source', 'object', 'destination'], {
      source: t0,
      object: t1,
      destination: t2,
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Numeric`
 * - `Store`
 *
 * TODO how to construct, how to use
 */
export type AssetTransferBox =
  | lib.Variant<'Numeric', Transfer<lib.AssetId, Numeric, lib.AccountId>>
  | lib.Variant<'Store', Transfer<lib.AssetId, Metadata, lib.AccountId>>
/**
 * Codec and constructors for enumeration {@link AssetTransferBox}.
 */
export const AssetTransferBox = {
  /**
   * Constructor of variant `AssetTransferBox.Numeric`
   */ Numeric: <const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }), /**
   * Constructor of variant `AssetTransferBox.Store`
   */
  Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Store', T> => ({ kind: 'Store', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Numeric: [Transfer<lib.AssetId, Numeric, lib.AccountId>]
        Store: [Transfer<lib.AssetId, Metadata, lib.AccountId>]
      }
    >({
      Numeric: [
        0,
        Transfer.with(
          lib.getCodec(lib.AssetId),
          lib.getCodec(Numeric),
          lib.getCodec(lib.AccountId),
        ),
      ],
      Store: [
        1,
        Transfer.with(
          lib.getCodec(lib.AssetId),
          lib.getCodec(Metadata),
          lib.getCodec(lib.AccountId),
        ),
      ],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface BlockHeader {
  height: lib.NonZero<lib.U64>
  prevBlockHash: lib.Option<lib.HashRepr>
  transactionsHash: lib.HashRepr
  creationTime: lib.Timestamp
  viewChangeIndex: lib.U32
}
/**
 * Codec of the structure.
 */
export const BlockHeader: lib.CodecContainer<BlockHeader> = lib.defineCodec(
  lib.structCodec<BlockHeader>([
    'height',
    'prevBlockHash',
    'transactionsHash',
    'creationTime',
    'viewChangeIndex',
  ], {
    height: lib.NonZero.with(lib.getCodec(lib.U64)),
    prevBlockHash: lib.Option.with(lib.getCodec(lib.HashRepr)),
    transactionsHash: lib.getCodec(lib.HashRepr),
    creationTime: lib.getCodec(lib.Timestamp),
    viewChangeIndex: lib.getCodec(lib.U32),
  }),
)

/**
 * Structure with named fields.
 */
export interface BlockEvent {
  header: BlockHeader
  status: BlockStatus
}
/**
 * Codec of the structure.
 */
export const BlockEvent: lib.CodecContainer<BlockEvent> = lib.defineCodec(
  lib.structCodec<BlockEvent>(['header', 'status'], {
    header: lib.getCodec(BlockHeader),
    status: lib.getCodec(BlockStatus),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type BlockHeaderHashPredicateAtom = lib.Variant<'Equals', lib.HashRepr>
/**
 * Codec and constructors for enumeration {@link BlockHeaderHashPredicateAtom}.
 */
export const BlockHeaderHashPredicateAtom = {
  /**
   * Constructor of variant `BlockHeaderHashPredicateAtom.Equals`
   */ Equals: <const T extends lib.HashRepr>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.HashRepr] }>({
      Equals: [0, lib.getCodec(lib.HashRepr)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type BlockHeaderHashProjectionPredicate = lib.Variant<
  'Atom',
  BlockHeaderHashPredicateAtom
>
/**
 * Codec and constructors for enumeration {@link BlockHeaderHashProjectionPredicate}.
 */
export const BlockHeaderHashProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `BlockHeaderHashProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `BlockHeaderHashProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: BlockHeaderHashPredicateAtom.Equals(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [BlockHeaderHashPredicateAtom] }>({
      Atom: [0, lib.getCodec(BlockHeaderHashPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type BlockHeaderHashProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link BlockHeaderHashProjectionSelector}.
 */
export const BlockHeaderHashProjectionSelector = {
  /**
   * Value of variant `BlockHeaderHashProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type BlockHeaderPredicateAtom = never
/**
 * Codec for {@link BlockHeaderPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const BlockHeaderPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Hash`
 *
 * TODO how to construct, how to use
 */
export type BlockHeaderProjectionPredicate =
  | lib.Variant<'Atom', BlockHeaderPredicateAtom>
  | lib.Variant<'Hash', BlockHeaderHashProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link BlockHeaderProjectionPredicate}.
 */
export const BlockHeaderProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `BlockHeaderProjectionPredicate.Hash`
   */ Hash: {
    /**
     * Constructors of nested enumerations under variant `BlockHeaderProjectionPredicate.Hash.Atom`
     */ Atom: {
      /**
       * Constructor of variant `BlockHeaderProjectionPredicate.Hash.Atom.Equals`
       */ Equals: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Hash',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Hash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [BlockHeaderPredicateAtom]
        Hash: [BlockHeaderHashProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(BlockHeaderPredicateAtom)],
      Hash: [1, lib.getCodec(BlockHeaderHashProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Hash`
 *
 * TODO how to construct, how to use
 */
export type BlockHeaderProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Hash', BlockHeaderHashProjectionSelector>
/**
 * Codec and constructors for enumeration {@link BlockHeaderProjectionSelector}.
 */
export const BlockHeaderProjectionSelector = {
  /**
   * Value of variant `BlockHeaderProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `BlockHeaderProjectionSelector.Hash`
   */
  Hash: {
    /**
     * Value of variant `BlockHeaderProjectionSelector.Hash.Atom`
     */ Atom: Object.freeze<lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>({
      kind: 'Hash',
      value: BlockHeaderHashProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Hash: [BlockHeaderHashProjectionSelector] }>({
      Atom: [0],
      Hash: [1, lib.getCodec(BlockHeaderHashProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface BlockSignature {
  peerTopologyIndex: lib.U64
  signature: lib.SignatureRepr
}
/**
 * Codec of the structure.
 */
export const BlockSignature: lib.CodecContainer<BlockSignature> = lib
  .defineCodec(
    lib.structCodec<BlockSignature>(['peerTopologyIndex', 'signature'], {
      peerTopologyIndex: lib.getCodec(lib.U64),
      signature: lib.getCodec(lib.SignatureRepr),
    }),
  )

export type ChainId = lib.String
export const ChainId = lib.String

/**
 * Structure with named fields.
 */
export interface TransactionPayload {
  chain: ChainId
  authority: lib.AccountId
  creationTime: lib.Timestamp
  instructions: Executable
  timeToLive: lib.Option<lib.NonZero<lib.Duration>>
  nonce: lib.Option<lib.NonZero<lib.U32>>
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const TransactionPayload: lib.CodecContainer<TransactionPayload> = lib
  .defineCodec(
    lib.structCodec<TransactionPayload>([
      'chain',
      'authority',
      'creationTime',
      'instructions',
      'timeToLive',
      'nonce',
      'metadata',
    ], {
      chain: lib.getCodec(ChainId),
      authority: lib.getCodec(lib.AccountId),
      creationTime: lib.getCodec(lib.Timestamp),
      instructions: lib.getCodec(Executable),
      timeToLive: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.Duration))),
      nonce: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U32))),
      metadata: lib.getCodec(Metadata),
    }),
  )

/**
 * Structure with named fields.
 */
export interface SignedTransactionV1 {
  signature: lib.SignatureRepr
  payload: TransactionPayload
}
/**
 * Codec of the structure.
 */
export const SignedTransactionV1: lib.CodecContainer<SignedTransactionV1> = lib
  .defineCodec(
    lib.structCodec<SignedTransactionV1>(['signature', 'payload'], {
      signature: lib.getCodec(lib.SignatureRepr),
      payload: lib.getCodec(TransactionPayload),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `V1`
 *
 * TODO how to construct, how to use
 */
export type SignedTransaction = lib.Variant<'V1', SignedTransactionV1>
/**
 * Codec and constructors for enumeration {@link SignedTransaction}.
 */
export const SignedTransaction = {
  /**
   * Constructor of variant `SignedTransaction.V1`
   */ V1: <const T extends SignedTransactionV1>(
    value: T,
  ): lib.Variant<'V1', T> => ({ kind: 'V1', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ V1: [SignedTransactionV1] }>({
      V1: [1, lib.getCodec(SignedTransactionV1)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface BlockPayload {
  header: BlockHeader
  transactions: lib.Vec<SignedTransaction>
}
/**
 * Codec of the structure.
 */
export const BlockPayload: lib.CodecContainer<BlockPayload> = lib.defineCodec(
  lib.structCodec<BlockPayload>(['header', 'transactions'], {
    header: lib.getCodec(BlockHeader),
    transactions: lib.Vec.with(lib.getCodec(SignedTransaction)),
  }),
)

/**
 * Structure with named fields.
 */
export interface TransactionErrorWithIndex {
  index: lib.U64
  error: TransactionRejectionReason
}
/**
 * Codec of the structure.
 */
export const TransactionErrorWithIndex: lib.CodecContainer<
  TransactionErrorWithIndex
> = lib.defineCodec(
  lib.structCodec<TransactionErrorWithIndex>(['index', 'error'], {
    index: lib.getCodec(lib.U64),
    error: lib.getCodec(TransactionRejectionReason),
  }),
)

export type TransactionErrors = lib.BTreeSet<TransactionErrorWithIndex>
export const TransactionErrors = lib.defineCodec(
  lib.BTreeSet.withCmp(lib.getCodec(TransactionErrorWithIndex), (a, b) => lib.ordCompare(a.index, b.index)),
)

/**
 * Structure with named fields.
 */
export interface SignedBlockV1 {
  signatures: lib.Vec<BlockSignature>
  payload: BlockPayload
  errors: TransactionErrors
}
/**
 * Codec of the structure.
 */
export const SignedBlockV1: lib.CodecContainer<SignedBlockV1> = lib.defineCodec(
  lib.structCodec<SignedBlockV1>(['signatures', 'payload', 'errors'], {
    signatures: lib.Vec.with(lib.getCodec(BlockSignature)),
    payload: lib.getCodec(BlockPayload),
    errors: lib.getCodec(TransactionErrors),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `V1`
 *
 * TODO how to construct, how to use
 */
export type SignedBlock = lib.Variant<'V1', SignedBlockV1>
/**
 * Codec and constructors for enumeration {@link SignedBlock}.
 */
export const SignedBlock = {
  /**
   * Constructor of variant `SignedBlock.V1`
   */ V1: <const T extends SignedBlockV1>(value: T): lib.Variant<'V1', T> => ({
    kind: 'V1',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ V1: [SignedBlockV1] }>({
      V1: [1, lib.getCodec(SignedBlockV1)],
    }).discriminated(),
  ),
}

export type BlockMessage = SignedBlock
export const BlockMessage = SignedBlock

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `MaxTransactions`
 *
 * TODO how to construct, how to use
 */
export type BlockParameter = lib.Variant<
  'MaxTransactions',
  lib.NonZero<lib.U64>
>
/**
 * Codec and constructors for enumeration {@link BlockParameter}.
 */
export const BlockParameter = {
  /**
   * Constructor of variant `BlockParameter.MaxTransactions`
   */ MaxTransactions: <const T extends lib.NonZero<lib.U64>>(
    value: T,
  ): lib.Variant<'MaxTransactions', T> => ({ kind: 'MaxTransactions', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ MaxTransactions: [lib.NonZero<lib.U64>] }>({
      MaxTransactions: [0, lib.NonZero.with(lib.getCodec(lib.U64))],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface BlockParameters {
  maxTransactions: lib.NonZero<lib.U64>
}
/**
 * Codec of the structure.
 */
export const BlockParameters: lib.CodecContainer<BlockParameters> = lib
  .defineCodec(
    lib.structCodec<BlockParameters>(['maxTransactions'], {
      maxTransactions: lib.NonZero.with(lib.getCodec(lib.U64)),
    }),
  )

/**
 * Structure with named fields.
 */
export interface BlockSubscriptionRequest {
  fromBlockHeight: lib.NonZero<lib.U64>
}
/**
 * Codec of the structure.
 */
export const BlockSubscriptionRequest: lib.CodecContainer<
  BlockSubscriptionRequest
> = lib.defineCodec(
  lib.structCodec<BlockSubscriptionRequest>(['fromBlockHeight'], {
    fromBlockHeight: lib.NonZero.with(lib.getCodec(lib.U64)),
  }),
)

/**
 * Structure with named fields and generic parameters.
 */
export interface Burn<T0, T1> {
  object: T0
  destination: T1
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Burn = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
  ): lib.GenCodec<Burn<T0, T1>> =>
    lib.structCodec<Burn<T0, T1>>(['object', 'destination'], {
      object: t0,
      destination: t1,
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Asset`
 * - `TriggerRepetitions`
 *
 * TODO how to construct, how to use
 */
export type BurnBox =
  | lib.Variant<'Asset', Burn<Numeric, lib.AssetId>>
  | lib.Variant<'TriggerRepetitions', Burn<lib.U32, TriggerId>>
/**
 * Codec and constructors for enumeration {@link BurnBox}.
 */
export const BurnBox = {
  /**
   * Constructor of variant `BurnBox.Asset`
   */ Asset: <const T extends Burn<Numeric, lib.AssetId>>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `BurnBox.TriggerRepetitions`
   */
  TriggerRepetitions: <const T extends Burn<lib.U32, TriggerId>>(
    value: T,
  ): lib.Variant<'TriggerRepetitions', T> => ({
    kind: 'TriggerRepetitions',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Asset: [Burn<Numeric, lib.AssetId>]
        TriggerRepetitions: [Burn<lib.U32, TriggerId>]
      }
    >({
      Asset: [0, Burn.with(lib.getCodec(Numeric), lib.getCodec(lib.AssetId))],
      TriggerRepetitions: [
        1,
        Burn.with(lib.getCodec(lib.U32), lib.getCodec(TriggerId)),
      ],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface CanBurnAsset {
  asset: lib.AssetId
}
/**
 * Codec of the structure.
 */
export const CanBurnAsset: lib.CodecContainer<CanBurnAsset> = lib.defineCodec(
  lib.structCodec<CanBurnAsset>(['asset'], {
    asset: lib.getCodec(lib.AssetId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanBurnAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanBurnAssetWithDefinition: lib.CodecContainer<
  CanBurnAssetWithDefinition
> = lib.defineCodec(
  lib.structCodec<CanBurnAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanExecuteTrigger {
  trigger: TriggerId
}
/**
 * Codec of the structure.
 */
export const CanExecuteTrigger: lib.CodecContainer<CanExecuteTrigger> = lib
  .defineCodec(
    lib.structCodec<CanExecuteTrigger>(['trigger'], {
      trigger: lib.getCodec(TriggerId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanMintAsset {
  asset: lib.AssetId
}
/**
 * Codec of the structure.
 */
export const CanMintAsset: lib.CodecContainer<CanMintAsset> = lib.defineCodec(
  lib.structCodec<CanMintAsset>(['asset'], {
    asset: lib.getCodec(lib.AssetId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanMintAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanMintAssetWithDefinition: lib.CodecContainer<
  CanMintAssetWithDefinition
> = lib.defineCodec(
  lib.structCodec<CanMintAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanModifyAccountMetadata {
  account: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const CanModifyAccountMetadata: lib.CodecContainer<
  CanModifyAccountMetadata
> = lib.defineCodec(
  lib.structCodec<CanModifyAccountMetadata>(['account'], {
    account: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanModifyAssetDefinitionMetadata {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanModifyAssetDefinitionMetadata: lib.CodecContainer<
  CanModifyAssetDefinitionMetadata
> = lib.defineCodec(
  lib.structCodec<CanModifyAssetDefinitionMetadata>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanModifyAssetMetadata {
  asset: lib.AssetId
}
/**
 * Codec of the structure.
 */
export const CanModifyAssetMetadata: lib.CodecContainer<
  CanModifyAssetMetadata
> = lib.defineCodec(
  lib.structCodec<CanModifyAssetMetadata>(['asset'], {
    asset: lib.getCodec(lib.AssetId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanModifyDomainMetadata {
  domain: lib.DomainId
}
/**
 * Codec of the structure.
 */
export const CanModifyDomainMetadata: lib.CodecContainer<
  CanModifyDomainMetadata
> = lib.defineCodec(
  lib.structCodec<CanModifyDomainMetadata>(['domain'], {
    domain: lib.getCodec(lib.DomainId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanModifyTrigger {
  trigger: TriggerId
}
/**
 * Codec of the structure.
 */
export const CanModifyTrigger: lib.CodecContainer<CanModifyTrigger> = lib
  .defineCodec(
    lib.structCodec<CanModifyTrigger>(['trigger'], {
      trigger: lib.getCodec(TriggerId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanModifyTriggerMetadata {
  trigger: TriggerId
}
/**
 * Codec of the structure.
 */
export const CanModifyTriggerMetadata: lib.CodecContainer<
  CanModifyTriggerMetadata
> = lib.defineCodec(
  lib.structCodec<CanModifyTriggerMetadata>(['trigger'], {
    trigger: lib.getCodec(TriggerId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanRegisterAccount {
  domain: lib.DomainId
}
/**
 * Codec of the structure.
 */
export const CanRegisterAccount: lib.CodecContainer<CanRegisterAccount> = lib
  .defineCodec(
    lib.structCodec<CanRegisterAccount>(['domain'], {
      domain: lib.getCodec(lib.DomainId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanRegisterAsset {
  owner: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const CanRegisterAsset: lib.CodecContainer<CanRegisterAsset> = lib
  .defineCodec(
    lib.structCodec<CanRegisterAsset>(['owner'], {
      owner: lib.getCodec(lib.AccountId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanRegisterAssetDefinition {
  domain: lib.DomainId
}
/**
 * Codec of the structure.
 */
export const CanRegisterAssetDefinition: lib.CodecContainer<
  CanRegisterAssetDefinition
> = lib.defineCodec(
  lib.structCodec<CanRegisterAssetDefinition>(['domain'], {
    domain: lib.getCodec(lib.DomainId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanRegisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanRegisterAssetWithDefinition: lib.CodecContainer<
  CanRegisterAssetWithDefinition
> = lib.defineCodec(
  lib.structCodec<CanRegisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanRegisterTrigger {
  authority: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const CanRegisterTrigger: lib.CodecContainer<CanRegisterTrigger> = lib
  .defineCodec(
    lib.structCodec<CanRegisterTrigger>(['authority'], {
      authority: lib.getCodec(lib.AccountId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanTransferAsset {
  asset: lib.AssetId
}
/**
 * Codec of the structure.
 */
export const CanTransferAsset: lib.CodecContainer<CanTransferAsset> = lib
  .defineCodec(
    lib.structCodec<CanTransferAsset>(['asset'], {
      asset: lib.getCodec(lib.AssetId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanTransferAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanTransferAssetWithDefinition: lib.CodecContainer<
  CanTransferAssetWithDefinition
> = lib.defineCodec(
  lib.structCodec<CanTransferAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanUnregisterAccount {
  account: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterAccount: lib.CodecContainer<CanUnregisterAccount> = lib.defineCodec(
  lib.structCodec<CanUnregisterAccount>(['account'], {
    account: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanUnregisterAsset {
  asset: lib.AssetId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterAsset: lib.CodecContainer<CanUnregisterAsset> = lib
  .defineCodec(
    lib.structCodec<CanUnregisterAsset>(['asset'], {
      asset: lib.getCodec(lib.AssetId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanUnregisterAssetDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterAssetDefinition: lib.CodecContainer<
  CanUnregisterAssetDefinition
> = lib.defineCodec(
  lib.structCodec<CanUnregisterAssetDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanUnregisterAssetWithDefinition {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterAssetWithDefinition: lib.CodecContainer<
  CanUnregisterAssetWithDefinition
> = lib.defineCodec(
  lib.structCodec<CanUnregisterAssetWithDefinition>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CanUnregisterDomain {
  domain: lib.DomainId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterDomain: lib.CodecContainer<CanUnregisterDomain> = lib
  .defineCodec(
    lib.structCodec<CanUnregisterDomain>(['domain'], {
      domain: lib.getCodec(lib.DomainId),
    }),
  )

/**
 * Structure with named fields.
 */
export interface CanUnregisterTrigger {
  trigger: TriggerId
}
/**
 * Codec of the structure.
 */
export const CanUnregisterTrigger: lib.CodecContainer<CanUnregisterTrigger> = lib.defineCodec(
  lib.structCodec<CanUnregisterTrigger>(['trigger'], {
    trigger: lib.getCodec(TriggerId),
  }),
)

/**
 * Structure with named fields.
 */
export interface CommittedTransaction {
  blockHash: lib.HashRepr
  value: SignedTransaction
  error: lib.Option<TransactionRejectionReason>
}
/**
 * Codec of the structure.
 */
export const CommittedTransaction: lib.CodecContainer<CommittedTransaction> = lib.defineCodec(
  lib.structCodec<CommittedTransaction>(['blockHash', 'value', 'error'], {
    blockHash: lib.getCodec(lib.HashRepr),
    value: lib.getCodec(SignedTransaction),
    error: lib.Option.with(lib.getCodec(TransactionRejectionReason)),
  }),
)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type CommittedTransactionPredicateAtom = never
/**
 * Codec for {@link CommittedTransactionPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const CommittedTransactionPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type SignedTransactionPredicateAtom = never
/**
 * Codec for {@link SignedTransactionPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const SignedTransactionPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type TransactionHashPredicateAtom = lib.Variant<'Equals', lib.HashRepr>
/**
 * Codec and constructors for enumeration {@link TransactionHashPredicateAtom}.
 */
export const TransactionHashPredicateAtom = {
  /**
   * Constructor of variant `TransactionHashPredicateAtom.Equals`
   */ Equals: <const T extends lib.HashRepr>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [lib.HashRepr] }>({
      Equals: [0, lib.getCodec(lib.HashRepr)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type TransactionHashProjectionPredicate = lib.Variant<
  'Atom',
  TransactionHashPredicateAtom
>
/**
 * Codec and constructors for enumeration {@link TransactionHashProjectionPredicate}.
 */
export const TransactionHashProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `TransactionHashProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `TransactionHashProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends lib.HashRepr>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: TransactionHashPredicateAtom.Equals(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [TransactionHashPredicateAtom] }>({
      Atom: [0, lib.getCodec(TransactionHashPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Hash`
 * - `Authority`
 *
 * TODO how to construct, how to use
 */
export type SignedTransactionProjectionPredicate =
  | lib.Variant<'Atom', SignedTransactionPredicateAtom>
  | lib.Variant<'Hash', TransactionHashProjectionPredicate>
  | lib.Variant<'Authority', AccountIdProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link SignedTransactionProjectionPredicate}.
 */
export const SignedTransactionProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Hash`
   */ Hash: {
    /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Hash.Atom`
     */ Atom: {
      /**
       * Constructor of variant `SignedTransactionProjectionPredicate.Hash.Atom.Equals`
       */ Equals: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'Hash',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Hash',
        value: TransactionHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  }, /**
   * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority`
   */
  Authority: {
    /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Atom`
     */ Atom: {
      /**
       * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Atom.Equals`
       */ Equals: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'Authority',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Authority',
        value: AccountIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Domain`
     */
    Domain: {
      /**
       * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Domain.Atom`
       */ Atom: {
        /**
         * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Domain.Atom.Equals`
         */ Equals: <const T extends lib.DomainId>(
          value: T,
        ): lib.Variant<
          'Authority',
          lib.Variant<'Domain', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Authority',
          value: AccountIdProjectionPredicate.Domain.Atom.Equals(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Domain.Name`
       */
      Name: {
        /**
         * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom`
         */ Atom: {
          /**
           * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Equals`
           */ Equals: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<
              'Domain',
              lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
            >
          > => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Equals(value),
          }), /**
           * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.Contains`
           */
          Contains: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'Contains', T>>
              >
            >
          > => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.Contains(
              value,
            ),
          }), /**
           * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.StartsWith`
           */
          StartsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
              >
            >
          > => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.StartsWith(
              value,
            ),
          }), /**
           * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Domain.Name.Atom.EndsWith`
           */
          EndsWith: <const T extends lib.String>(
            value: T,
          ): lib.Variant<
            'Authority',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Name',
                lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
              >
            >
          > => ({
            kind: 'Authority',
            value: AccountIdProjectionPredicate.Domain.Name.Atom.EndsWith(
              value,
            ),
          }),
        },
      },
    }, /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Signatory`
     */
    Signatory: {
      /**
       * Constructors of nested enumerations under variant `SignedTransactionProjectionPredicate.Authority.Signatory.Atom`
       */ Atom: {
        /**
         * Constructor of variant `SignedTransactionProjectionPredicate.Authority.Signatory.Atom.Equals`
         */ Equals: <const T extends lib.PublicKeyRepr>(
          value: T,
        ): lib.Variant<
          'Authority',
          lib.Variant<
            'Signatory',
            lib.Variant<'Atom', lib.Variant<'Equals', T>>
          >
        > => ({
          kind: 'Authority',
          value: AccountIdProjectionPredicate.Signatory.Atom.Equals(value),
        }),
      },
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [SignedTransactionPredicateAtom]
        Hash: [TransactionHashProjectionPredicate]
        Authority: [AccountIdProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(SignedTransactionPredicateAtom)],
      Hash: [1, lib.getCodec(TransactionHashProjectionPredicate)],
      Authority: [2, lib.getCodec(AccountIdProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `IsSome`
 *
 * TODO how to construct, how to use
 */
export type TransactionErrorPredicateAtom = lib.VariantUnit<'IsSome'>
/**
 * Codec and constructors for enumeration {@link TransactionErrorPredicateAtom}.
 */
export const TransactionErrorPredicateAtom = {
  /**
   * Value of variant `TransactionErrorPredicateAtom.IsSome`
   */ IsSome: Object.freeze<lib.VariantUnit<'IsSome'>>({ kind: 'IsSome' }),
  ...lib.defineCodec(
    lib.enumCodec<{ IsSome: [] }>({ IsSome: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type TransactionErrorProjectionPredicate = lib.Variant<
  'Atom',
  TransactionErrorPredicateAtom
>
/**
 * Codec and constructors for enumeration {@link TransactionErrorProjectionPredicate}.
 */
export const TransactionErrorProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `TransactionErrorProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Value of variant `TransactionErrorProjectionPredicate.Atom.IsSome`
     */ IsSome: Object.freeze<lib.Variant<'Atom', lib.VariantUnit<'IsSome'>>>({
      kind: 'Atom',
      value: TransactionErrorPredicateAtom.IsSome,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [TransactionErrorPredicateAtom] }>({
      Atom: [0, lib.getCodec(TransactionErrorPredicateAtom)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `BlockHash`
 * - `Value`
 * - `Error`
 *
 * TODO how to construct, how to use
 */
export type CommittedTransactionProjectionPredicate =
  | lib.Variant<'Atom', CommittedTransactionPredicateAtom>
  | lib.Variant<'BlockHash', BlockHeaderHashProjectionPredicate>
  | lib.Variant<'Value', SignedTransactionProjectionPredicate>
  | lib.Variant<'Error', TransactionErrorProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link CommittedTransactionProjectionPredicate}.
 */
export const CommittedTransactionProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.BlockHash`
   */ BlockHash: {
    /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.BlockHash.Atom`
     */ Atom: {
      /**
       * Constructor of variant `CommittedTransactionProjectionPredicate.BlockHash.Atom.Equals`
       */ Equals: <const T extends lib.HashRepr>(
        value: T,
      ): lib.Variant<
        'BlockHash',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'BlockHash',
        value: BlockHeaderHashProjectionPredicate.Atom.Equals(value),
      }),
    },
  }, /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value`
   */
  Value: {
    /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Hash`
     */ Hash: {
      /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Hash.Atom`
       */ Atom: {
        /**
         * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Hash.Atom.Equals`
         */ Equals: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Value',
          lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority`
     */
    Authority: {
      /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Atom`
       */ Atom: {
        /**
         * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Atom.Equals`
         */ Equals: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Value',
          lib.Variant<
            'Authority',
            lib.Variant<'Atom', lib.Variant<'Equals', T>>
          >
        > => ({
          kind: 'Value',
          value: SignedTransactionProjectionPredicate.Authority.Atom.Equals(
            value,
          ),
        }),
      }, /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain`
       */
      Domain: {
        /**
         * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Atom`
         */ Atom: {
          /**
           * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Atom.Equals`
           */ Equals: <const T extends lib.DomainId>(
            value: T,
          ): lib.Variant<
            'Value',
            lib.Variant<
              'Authority',
              lib.Variant<
                'Domain',
                lib.Variant<'Atom', lib.Variant<'Equals', T>>
              >
            >
          > => ({
            kind: 'Value',
            value: SignedTransactionProjectionPredicate.Authority.Domain.Atom
              .Equals(value),
          }),
        }, /**
         * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name`
         */
        Name: {
          /**
           * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name.Atom`
           */ Atom: {
            /**
             * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name.Atom.Equals`
             */ Equals: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Equals', T>>
                  >
                >
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name
                .Atom.Equals(value),
            }), /**
             * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name.Atom.Contains`
             */
            Contains: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'Contains', T>>
                  >
                >
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name
                .Atom.Contains(value),
            }), /**
             * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name.Atom.StartsWith`
             */
            StartsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name
                .Atom.StartsWith(value),
            }), /**
             * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Domain.Name.Atom.EndsWith`
             */
            EndsWith: <const T extends lib.String>(
              value: T,
            ): lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<
                  'Domain',
                  lib.Variant<
                    'Name',
                    lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
                  >
                >
              >
            > => ({
              kind: 'Value',
              value: SignedTransactionProjectionPredicate.Authority.Domain.Name
                .Atom.EndsWith(value),
            }),
          },
        },
      }, /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Signatory`
       */
      Signatory: {
        /**
         * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Value.Authority.Signatory.Atom`
         */ Atom: {
          /**
           * Constructor of variant `CommittedTransactionProjectionPredicate.Value.Authority.Signatory.Atom.Equals`
           */ Equals: <const T extends lib.PublicKeyRepr>(
            value: T,
          ): lib.Variant<
            'Value',
            lib.Variant<
              'Authority',
              lib.Variant<
                'Signatory',
                lib.Variant<'Atom', lib.Variant<'Equals', T>>
              >
            >
          > => ({
            kind: 'Value',
            value: SignedTransactionProjectionPredicate.Authority.Signatory.Atom
              .Equals(value),
          }),
        },
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Error`
   */
  Error: {
    /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionPredicate.Error.Atom`
     */ Atom: {
      /**
       * Value of variant `CommittedTransactionProjectionPredicate.Error.Atom.IsSome`
       */ IsSome: Object.freeze<
        lib.Variant<'Error', lib.Variant<'Atom', lib.VariantUnit<'IsSome'>>>
      >({
        kind: 'Error',
        value: TransactionErrorProjectionPredicate.Atom.IsSome,
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [CommittedTransactionPredicateAtom]
        BlockHash: [BlockHeaderHashProjectionPredicate]
        Value: [SignedTransactionProjectionPredicate]
        Error: [TransactionErrorProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(CommittedTransactionPredicateAtom)],
      BlockHash: [1, lib.getCodec(BlockHeaderHashProjectionPredicate)],
      Value: [2, lib.getCodec(SignedTransactionProjectionPredicate)],
      Error: [3, lib.getCodec(TransactionErrorProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type TransactionHashProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link TransactionHashProjectionSelector}.
 */
export const TransactionHashProjectionSelector = {
  /**
   * Value of variant `TransactionHashProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Hash`
 * - `Authority`
 *
 * TODO how to construct, how to use
 */
export type SignedTransactionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Hash', TransactionHashProjectionSelector>
  | lib.Variant<'Authority', AccountIdProjectionSelector>
/**
 * Codec and constructors for enumeration {@link SignedTransactionProjectionSelector}.
 */
export const SignedTransactionProjectionSelector = {
  /**
   * Value of variant `SignedTransactionProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `SignedTransactionProjectionSelector.Hash`
   */
  Hash: {
    /**
     * Value of variant `SignedTransactionProjectionSelector.Hash.Atom`
     */ Atom: Object.freeze<lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>({
      kind: 'Hash',
      value: TransactionHashProjectionSelector.Atom,
    }),
  }, /**
   * Constructors of nested enumerations under variant `SignedTransactionProjectionSelector.Authority`
   */
  Authority: {
    /**
     * Value of variant `SignedTransactionProjectionSelector.Authority.Atom`
     */ Atom: Object.freeze<lib.Variant<'Authority', lib.VariantUnit<'Atom'>>>({
      kind: 'Authority',
      value: AccountIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionSelector.Authority.Domain`
     */
    Domain: {
      /**
       * Value of variant `SignedTransactionProjectionSelector.Authority.Domain.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Authority', lib.Variant<'Domain', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Domain.Atom,
      }), /**
       * Constructors of nested enumerations under variant `SignedTransactionProjectionSelector.Authority.Domain.Name`
       */
      Name: {
        /**
         * Value of variant `SignedTransactionProjectionSelector.Authority.Domain.Name.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Authority',
            lib.Variant<'Domain', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
          >
        >({
          kind: 'Authority',
          value: AccountIdProjectionSelector.Domain.Name.Atom,
        }),
      },
    }, /**
     * Constructors of nested enumerations under variant `SignedTransactionProjectionSelector.Authority.Signatory`
     */
    Signatory: {
      /**
       * Value of variant `SignedTransactionProjectionSelector.Authority.Signatory.Atom`
       */ Atom: Object.freeze<
        lib.Variant<
          'Authority',
          lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>
        >
      >({
        kind: 'Authority',
        value: AccountIdProjectionSelector.Signatory.Atom,
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Hash: [TransactionHashProjectionSelector]
        Authority: [AccountIdProjectionSelector]
      }
    >({
      Atom: [0],
      Hash: [1, lib.getCodec(TransactionHashProjectionSelector)],
      Authority: [2, lib.getCodec(AccountIdProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type TransactionErrorProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link TransactionErrorProjectionSelector}.
 */
export const TransactionErrorProjectionSelector = {
  /**
   * Value of variant `TransactionErrorProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `BlockHash`
 * - `Value`
 * - `Error`
 *
 * TODO how to construct, how to use
 */
export type CommittedTransactionProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'BlockHash', BlockHeaderHashProjectionSelector>
  | lib.Variant<'Value', SignedTransactionProjectionSelector>
  | lib.Variant<'Error', TransactionErrorProjectionSelector>
/**
 * Codec and constructors for enumeration {@link CommittedTransactionProjectionSelector}.
 */
export const CommittedTransactionProjectionSelector = {
  /**
   * Value of variant `CommittedTransactionProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.BlockHash`
   */
  BlockHash: {
    /**
     * Value of variant `CommittedTransactionProjectionSelector.BlockHash.Atom`
     */ Atom: Object.freeze<lib.Variant<'BlockHash', lib.VariantUnit<'Atom'>>>({
      kind: 'BlockHash',
      value: BlockHeaderHashProjectionSelector.Atom,
    }),
  }, /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value`
   */
  Value: {
    /**
     * Value of variant `CommittedTransactionProjectionSelector.Value.Atom`
     */ Atom: Object.freeze<lib.Variant<'Value', lib.VariantUnit<'Atom'>>>({
      kind: 'Value',
      value: SignedTransactionProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value.Hash`
     */
    Hash: {
      /**
       * Value of variant `CommittedTransactionProjectionSelector.Value.Hash.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Hash.Atom,
      }),
    }, /**
     * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value.Authority`
     */
    Authority: {
      /**
       * Value of variant `CommittedTransactionProjectionSelector.Value.Authority.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Value', lib.Variant<'Authority', lib.VariantUnit<'Atom'>>>
      >({
        kind: 'Value',
        value: SignedTransactionProjectionSelector.Authority.Atom,
      }), /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value.Authority.Domain`
       */
      Domain: {
        /**
         * Value of variant `CommittedTransactionProjectionSelector.Value.Authority.Domain.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Value',
            lib.Variant<
              'Authority',
              lib.Variant<'Domain', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Value',
          value: SignedTransactionProjectionSelector.Authority.Domain.Atom,
        }), /**
         * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value.Authority.Domain.Name`
         */
        Name: {
          /**
           * Value of variant `CommittedTransactionProjectionSelector.Value.Authority.Domain.Name.Atom`
           */ Atom: Object.freeze<
            lib.Variant<
              'Value',
              lib.Variant<
                'Authority',
                lib.Variant<
                  'Domain',
                  lib.Variant<'Name', lib.VariantUnit<'Atom'>>
                >
              >
            >
          >({
            kind: 'Value',
            value: SignedTransactionProjectionSelector.Authority.Domain.Name.Atom,
          }),
        },
      }, /**
       * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Value.Authority.Signatory`
       */
      Signatory: {
        /**
         * Value of variant `CommittedTransactionProjectionSelector.Value.Authority.Signatory.Atom`
         */ Atom: Object.freeze<
          lib.Variant<
            'Value',
            lib.Variant<
              'Authority',
              lib.Variant<'Signatory', lib.VariantUnit<'Atom'>>
            >
          >
        >({
          kind: 'Value',
          value: SignedTransactionProjectionSelector.Authority.Signatory.Atom,
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `CommittedTransactionProjectionSelector.Error`
   */
  Error: {
    /**
     * Value of variant `CommittedTransactionProjectionSelector.Error.Atom`
     */ Atom: Object.freeze<lib.Variant<'Error', lib.VariantUnit<'Atom'>>>({
      kind: 'Error',
      value: TransactionErrorProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        BlockHash: [BlockHeaderHashProjectionSelector]
        Value: [SignedTransactionProjectionSelector]
        Error: [TransactionErrorProjectionSelector]
      }
    >({
      Atom: [0],
      BlockHash: [1, lib.getCodec(BlockHeaderHashProjectionSelector)],
      Value: [2, lib.getCodec(SignedTransactionProjectionSelector)],
      Error: [3, lib.getCodec(TransactionErrorProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type DomainPredicateAtom = never
/**
 * Codec for {@link DomainPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const DomainPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type DomainProjectionPredicate =
  | lib.Variant<'Atom', DomainPredicateAtom>
  | lib.Variant<'Id', DomainIdProjectionPredicate>
  | lib.Variant<'Metadata', MetadataProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link DomainProjectionPredicate}.
 */
export const DomainProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `DomainProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `DomainProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `DomainProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: DomainIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `DomainProjectionPredicate.Id.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `DomainProjectionPredicate.Id.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `DomainProjectionPredicate.Id.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `DomainProjectionPredicate.Id.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `DomainProjectionPredicate.Id.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.StartsWith(value),
        }), /**
         * Constructor of variant `DomainProjectionPredicate.Id.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Id',
          value: DomainIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `DomainProjectionPredicate.Metadata`
   */
  Metadata: {
    /**
     * Constructor of variant `DomainProjectionPredicate.Metadata.Key`
     */ Key: <const T extends MetadataKeyProjectionPredicate>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionPredicate.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [DomainPredicateAtom]
        Id: [DomainIdProjectionPredicate]
        Metadata: [MetadataProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(DomainPredicateAtom)],
      Id: [1, lib.getCodec(DomainIdProjectionPredicate)],
      Metadata: [2, lib.getCodec(MetadataProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type PeerIdPredicateAtom = never
/**
 * Codec for {@link PeerIdPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const PeerIdPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `PublicKey`
 *
 * TODO how to construct, how to use
 */
export type PeerIdProjectionPredicate =
  | lib.Variant<'Atom', PeerIdPredicateAtom>
  | lib.Variant<'PublicKey', PublicKeyProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link PeerIdProjectionPredicate}.
 */
export const PeerIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `PeerIdProjectionPredicate.PublicKey`
   */ PublicKey: {
    /**
     * Constructors of nested enumerations under variant `PeerIdProjectionPredicate.PublicKey.Atom`
     */ Atom: {
      /**
       * Constructor of variant `PeerIdProjectionPredicate.PublicKey.Atom.Equals`
       */ Equals: <const T extends lib.PublicKeyRepr>(
        value: T,
      ): lib.Variant<
        'PublicKey',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'PublicKey',
        value: PublicKeyProjectionPredicate.Atom.Equals(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [PeerIdPredicateAtom]; PublicKey: [PublicKeyProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(PeerIdPredicateAtom)],
      PublicKey: [1, lib.getCodec(PublicKeyProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type PermissionProjectionPredicate = never
/**
 * Codec for {@link PermissionProjectionPredicate}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const PermissionProjectionPredicate = lib.defineCodec(lib.neverCodec)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type RolePredicateAtom = never
/**
 * Codec for {@link RolePredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const RolePredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type RoleIdPredicateAtom = lib.Variant<'Equals', RoleId>
/**
 * Codec and constructors for enumeration {@link RoleIdPredicateAtom}.
 */
export const RoleIdPredicateAtom = {
  /**
   * Constructor of variant `RoleIdPredicateAtom.Equals`
   */ Equals: <const T extends RoleId>(value: T): lib.Variant<'Equals', T> => ({
    kind: 'Equals',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [RoleId] }>({ Equals: [0, lib.getCodec(RoleId)] })
      .discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type RoleIdProjectionPredicate =
  | lib.Variant<'Atom', RoleIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link RoleIdProjectionPredicate}.
 */
export const RoleIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `RoleIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `RoleIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: RoleIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `RoleIdProjectionPredicate.Name`
   */
  Name: {
    /**
     * Constructors of nested enumerations under variant `RoleIdProjectionPredicate.Name.Atom`
     */ Atom: {
      /**
       * Constructor of variant `RoleIdProjectionPredicate.Name.Atom.Equals`
       */ Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }), /**
       * Constructor of variant `RoleIdProjectionPredicate.Name.Atom.Contains`
       */
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Contains', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }), /**
       * Constructor of variant `RoleIdProjectionPredicate.Name.Atom.StartsWith`
       */
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }), /**
       * Constructor of variant `RoleIdProjectionPredicate.Name.Atom.EndsWith`
       */
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [RoleIdPredicateAtom]; Name: [NameProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(RoleIdPredicateAtom)],
      Name: [1, lib.getCodec(NameProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 *
 * TODO how to construct, how to use
 */
export type RoleProjectionPredicate =
  | lib.Variant<'Atom', RolePredicateAtom>
  | lib.Variant<'Id', RoleIdProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link RoleProjectionPredicate}.
 */
export const RoleProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `RoleProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `RoleProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `RoleProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends RoleId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: RoleIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `RoleProjectionPredicate.Id.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `RoleProjectionPredicate.Id.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `RoleProjectionPredicate.Id.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `RoleProjectionPredicate.Id.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `RoleProjectionPredicate.Id.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.StartsWith(value),
        }), /**
         * Constructor of variant `RoleProjectionPredicate.Id.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Id',
          value: RoleIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [RolePredicateAtom]; Id: [RoleIdProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(RolePredicateAtom)],
      Id: [1, lib.getCodec(RoleIdProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type SignedBlockPredicateAtom = never
/**
 * Codec for {@link SignedBlockPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const SignedBlockPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Header`
 *
 * TODO how to construct, how to use
 */
export type SignedBlockProjectionPredicate =
  | lib.Variant<'Atom', SignedBlockPredicateAtom>
  | lib.Variant<'Header', BlockHeaderProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link SignedBlockProjectionPredicate}.
 */
export const SignedBlockProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `SignedBlockProjectionPredicate.Header`
   */ Header: {
    /**
     * Constructors of nested enumerations under variant `SignedBlockProjectionPredicate.Header.Hash`
     */ Hash: {
      /**
       * Constructors of nested enumerations under variant `SignedBlockProjectionPredicate.Header.Hash.Atom`
       */ Atom: {
        /**
         * Constructor of variant `SignedBlockProjectionPredicate.Header.Hash.Atom.Equals`
         */ Equals: <const T extends lib.HashRepr>(
          value: T,
        ): lib.Variant<
          'Header',
          lib.Variant<'Hash', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Header',
          value: BlockHeaderProjectionPredicate.Hash.Atom.Equals(value),
        }),
      },
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [SignedBlockPredicateAtom]
        Header: [BlockHeaderProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(SignedBlockPredicateAtom)],
      Header: [1, lib.getCodec(BlockHeaderProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type TriggerPredicateAtom = never
/**
 * Codec for {@link TriggerPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const TriggerPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Equals`
 *
 * TODO how to construct, how to use
 */
export type TriggerIdPredicateAtom = lib.Variant<'Equals', TriggerId>
/**
 * Codec and constructors for enumeration {@link TriggerIdPredicateAtom}.
 */
export const TriggerIdPredicateAtom = {
  /**
   * Constructor of variant `TriggerIdPredicateAtom.Equals`
   */ Equals: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'Equals', T> => ({ kind: 'Equals', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Equals: [TriggerId] }>({
      Equals: [0, lib.getCodec(TriggerId)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type TriggerIdProjectionPredicate =
  | lib.Variant<'Atom', TriggerIdPredicateAtom>
  | lib.Variant<'Name', NameProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link TriggerIdProjectionPredicate}.
 */
export const TriggerIdProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `TriggerIdProjectionPredicate.Atom`
   */ Atom: {
    /**
     * Constructor of variant `TriggerIdProjectionPredicate.Atom.Equals`
     */ Equals: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Atom', lib.Variant<'Equals', T>> => ({
      kind: 'Atom',
      value: TriggerIdPredicateAtom.Equals(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `TriggerIdProjectionPredicate.Name`
   */
  Name: {
    /**
     * Constructors of nested enumerations under variant `TriggerIdProjectionPredicate.Name.Atom`
     */ Atom: {
      /**
       * Constructor of variant `TriggerIdProjectionPredicate.Name.Atom.Equals`
       */ Equals: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Equals', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Equals(value),
      }), /**
       * Constructor of variant `TriggerIdProjectionPredicate.Name.Atom.Contains`
       */
      Contains: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'Contains', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.Contains(value),
      }), /**
       * Constructor of variant `TriggerIdProjectionPredicate.Name.Atom.StartsWith`
       */
      StartsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'StartsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.StartsWith(value),
      }), /**
       * Constructor of variant `TriggerIdProjectionPredicate.Name.Atom.EndsWith`
       */
      EndsWith: <const T extends lib.String>(
        value: T,
      ): lib.Variant<
        'Name',
        lib.Variant<'Atom', lib.Variant<'EndsWith', T>>
      > => ({
        kind: 'Name',
        value: NameProjectionPredicate.Atom.EndsWith(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      { Atom: [TriggerIdPredicateAtom]; Name: [NameProjectionPredicate] }
    >({
      Atom: [0, lib.getCodec(TriggerIdPredicateAtom)],
      Name: [1, lib.getCodec(NameProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Action`
 *
 * TODO how to construct, how to use
 */
export type TriggerProjectionPredicate =
  | lib.Variant<'Atom', TriggerPredicateAtom>
  | lib.Variant<'Id', TriggerIdProjectionPredicate>
  | lib.Variant<'Action', ActionProjectionPredicate>
/**
 * Codec and constructors for enumeration {@link TriggerProjectionPredicate}.
 */
export const TriggerProjectionPredicate = {
  /**
   * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Id`
   */ Id: {
    /**
     * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Id.Atom`
     */ Atom: {
      /**
       * Constructor of variant `TriggerProjectionPredicate.Id.Atom.Equals`
       */ Equals: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<'Id', lib.Variant<'Atom', lib.Variant<'Equals', T>>> => ({
        kind: 'Id',
        value: TriggerIdProjectionPredicate.Atom.Equals(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Id.Name`
     */
    Name: {
      /**
       * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Id.Name.Atom`
       */ Atom: {
        /**
         * Constructor of variant `TriggerProjectionPredicate.Id.Name.Atom.Equals`
         */ Equals: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Equals', T>>>
        > => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Equals(value),
        }), /**
         * Constructor of variant `TriggerProjectionPredicate.Id.Name.Atom.Contains`
         */
        Contains: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'Contains', T>>>
        > => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.Contains(value),
        }), /**
         * Constructor of variant `TriggerProjectionPredicate.Id.Name.Atom.StartsWith`
         */
        StartsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'StartsWith', T>>>
        > => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.StartsWith(value),
        }), /**
         * Constructor of variant `TriggerProjectionPredicate.Id.Name.Atom.EndsWith`
         */
        EndsWith: <const T extends lib.String>(
          value: T,
        ): lib.Variant<
          'Id',
          lib.Variant<'Name', lib.Variant<'Atom', lib.Variant<'EndsWith', T>>>
        > => ({
          kind: 'Id',
          value: TriggerIdProjectionPredicate.Name.Atom.EndsWith(value),
        }),
      },
    },
  }, /**
   * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Action`
   */
  Action: {
    /**
     * Constructors of nested enumerations under variant `TriggerProjectionPredicate.Action.Metadata`
     */ Metadata: {
      /**
       * Constructor of variant `TriggerProjectionPredicate.Action.Metadata.Key`
       */ Key: <const T extends MetadataKeyProjectionPredicate>(
        value: T,
      ): lib.Variant<
        'Action',
        lib.Variant<'Metadata', lib.Variant<'Key', T>>
      > => ({
        kind: 'Action',
        value: ActionProjectionPredicate.Metadata.Key(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: [TriggerPredicateAtom]
        Id: [TriggerIdProjectionPredicate]
        Action: [ActionProjectionPredicate]
      }
    >({
      Atom: [0, lib.getCodec(TriggerPredicateAtom)],
      Id: [1, lib.getCodec(TriggerIdProjectionPredicate)],
      Action: [2, lib.getCodec(ActionProjectionPredicate)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `BlockTime`
 * - `CommitTime`
 * - `MaxClockDrift`
 *
 * TODO how to construct, how to use
 */
export type SumeragiParameter =
  | lib.Variant<'BlockTime', lib.Duration>
  | lib.Variant<'CommitTime', lib.Duration>
  | lib.Variant<'MaxClockDrift', lib.Duration>
/**
 * Codec and constructors for enumeration {@link SumeragiParameter}.
 */
export const SumeragiParameter = {
  /**
   * Constructor of variant `SumeragiParameter.BlockTime`
   */ BlockTime: <const T extends lib.Duration>(
    value: T,
  ): lib.Variant<'BlockTime', T> => ({ kind: 'BlockTime', value }), /**
   * Constructor of variant `SumeragiParameter.CommitTime`
   */
  CommitTime: <const T extends lib.Duration>(
    value: T,
  ): lib.Variant<'CommitTime', T> => ({ kind: 'CommitTime', value }), /**
   * Constructor of variant `SumeragiParameter.MaxClockDrift`
   */
  MaxClockDrift: <const T extends lib.Duration>(
    value: T,
  ): lib.Variant<'MaxClockDrift', T> => ({ kind: 'MaxClockDrift', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        BlockTime: [lib.Duration]
        CommitTime: [lib.Duration]
        MaxClockDrift: [lib.Duration]
      }
    >({
      BlockTime: [0, lib.getCodec(lib.Duration)],
      CommitTime: [1, lib.getCodec(lib.Duration)],
      MaxClockDrift: [2, lib.getCodec(lib.Duration)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `MaxInstructions`
 * - `SmartContractSize`
 *
 * TODO how to construct, how to use
 */
export type TransactionParameter =
  | lib.Variant<'MaxInstructions', lib.NonZero<lib.U64>>
  | lib.Variant<'SmartContractSize', lib.NonZero<lib.U64>>
/**
 * Codec and constructors for enumeration {@link TransactionParameter}.
 */
export const TransactionParameter = {
  /**
   * Constructor of variant `TransactionParameter.MaxInstructions`
   */ MaxInstructions: <const T extends lib.NonZero<lib.U64>>(
    value: T,
  ): lib.Variant<'MaxInstructions', T> => ({
    kind: 'MaxInstructions',
    value,
  }), /**
   * Constructor of variant `TransactionParameter.SmartContractSize`
   */
  SmartContractSize: <const T extends lib.NonZero<lib.U64>>(
    value: T,
  ): lib.Variant<'SmartContractSize', T> => ({
    kind: 'SmartContractSize',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        MaxInstructions: [lib.NonZero<lib.U64>]
        SmartContractSize: [lib.NonZero<lib.U64>]
      }
    >({
      MaxInstructions: [0, lib.NonZero.with(lib.getCodec(lib.U64))],
      SmartContractSize: [1, lib.NonZero.with(lib.getCodec(lib.U64))],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Fuel`
 * - `Memory`
 *
 * TODO how to construct, how to use
 */
export type SmartContractParameter =
  | lib.Variant<'Fuel', lib.NonZero<lib.U64>>
  | lib.Variant<'Memory', lib.NonZero<lib.U64>>
/**
 * Codec and constructors for enumeration {@link SmartContractParameter}.
 */
export const SmartContractParameter = {
  /**
   * Constructor of variant `SmartContractParameter.Fuel`
   */ Fuel: <const T extends lib.NonZero<lib.U64>>(
    value: T,
  ): lib.Variant<'Fuel', T> => ({ kind: 'Fuel', value }), /**
   * Constructor of variant `SmartContractParameter.Memory`
   */
  Memory: <const T extends lib.NonZero<lib.U64>>(
    value: T,
  ): lib.Variant<'Memory', T> => ({ kind: 'Memory', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Fuel: [lib.NonZero<lib.U64>]; Memory: [lib.NonZero<lib.U64>] }
    >({
      Fuel: [0, lib.NonZero.with(lib.getCodec(lib.U64))],
      Memory: [1, lib.NonZero.with(lib.getCodec(lib.U64))],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface CustomParameter {
  id: CustomParameterId
  payload: lib.Json
}
/**
 * Codec of the structure.
 */
export const CustomParameter: lib.CodecContainer<CustomParameter> = lib
  .defineCodec(
    lib.structCodec<CustomParameter>(['id', 'payload'], {
      id: lib.getCodec(CustomParameterId),
      payload: lib.getCodec(lib.Json),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Sumeragi`
 * - `Block`
 * - `Transaction`
 * - `SmartContract`
 * - `Executor`
 * - `Custom`
 *
 * TODO how to construct, how to use
 */
export type Parameter =
  | lib.Variant<'Sumeragi', SumeragiParameter>
  | lib.Variant<'Block', BlockParameter>
  | lib.Variant<'Transaction', TransactionParameter>
  | lib.Variant<'SmartContract', SmartContractParameter>
  | lib.Variant<'Executor', SmartContractParameter>
  | lib.Variant<'Custom', CustomParameter>
/**
 * Codec and constructors for enumeration {@link Parameter}.
 */
export const Parameter = {
  /**
   * Constructors of nested enumerations under variant `Parameter.Sumeragi`
   */ Sumeragi: {
    /**
     * Constructor of variant `Parameter.Sumeragi.BlockTime`
     */ BlockTime: <const T extends lib.Duration>(
      value: T,
    ): lib.Variant<'Sumeragi', lib.Variant<'BlockTime', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.BlockTime(value),
    }), /**
     * Constructor of variant `Parameter.Sumeragi.CommitTime`
     */
    CommitTime: <const T extends lib.Duration>(
      value: T,
    ): lib.Variant<'Sumeragi', lib.Variant<'CommitTime', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.CommitTime(value),
    }), /**
     * Constructor of variant `Parameter.Sumeragi.MaxClockDrift`
     */
    MaxClockDrift: <const T extends lib.Duration>(
      value: T,
    ): lib.Variant<'Sumeragi', lib.Variant<'MaxClockDrift', T>> => ({
      kind: 'Sumeragi',
      value: SumeragiParameter.MaxClockDrift(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `Parameter.Block`
   */
  Block: {
    /**
     * Constructor of variant `Parameter.Block.MaxTransactions`
     */ MaxTransactions: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Block', lib.Variant<'MaxTransactions', T>> => ({
      kind: 'Block',
      value: BlockParameter.MaxTransactions(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `Parameter.Transaction`
   */
  Transaction: {
    /**
     * Constructor of variant `Parameter.Transaction.MaxInstructions`
     */ MaxInstructions: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Transaction', lib.Variant<'MaxInstructions', T>> => ({
      kind: 'Transaction',
      value: TransactionParameter.MaxInstructions(value),
    }), /**
     * Constructor of variant `Parameter.Transaction.SmartContractSize`
     */
    SmartContractSize: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Transaction', lib.Variant<'SmartContractSize', T>> => ({
      kind: 'Transaction',
      value: TransactionParameter.SmartContractSize(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `Parameter.SmartContract`
   */
  SmartContract: {
    /**
     * Constructor of variant `Parameter.SmartContract.Fuel`
     */ Fuel: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'SmartContract', lib.Variant<'Fuel', T>> => ({
      kind: 'SmartContract',
      value: SmartContractParameter.Fuel(value),
    }), /**
     * Constructor of variant `Parameter.SmartContract.Memory`
     */
    Memory: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'SmartContract', lib.Variant<'Memory', T>> => ({
      kind: 'SmartContract',
      value: SmartContractParameter.Memory(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `Parameter.Executor`
   */
  Executor: {
    /**
     * Constructor of variant `Parameter.Executor.Fuel`
     */ Fuel: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Executor', lib.Variant<'Fuel', T>> => ({
      kind: 'Executor',
      value: SmartContractParameter.Fuel(value),
    }), /**
     * Constructor of variant `Parameter.Executor.Memory`
     */
    Memory: <const T extends lib.NonZero<lib.U64>>(
      value: T,
    ): lib.Variant<'Executor', lib.Variant<'Memory', T>> => ({
      kind: 'Executor',
      value: SmartContractParameter.Memory(value),
    }),
  }, /**
   * Constructor of variant `Parameter.Custom`
   */
  Custom: <const T extends CustomParameter>(
    value: T,
  ): lib.Variant<'Custom', T> => ({ kind: 'Custom', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Sumeragi: [SumeragiParameter]
        Block: [BlockParameter]
        Transaction: [TransactionParameter]
        SmartContract: [SmartContractParameter]
        Executor: [SmartContractParameter]
        Custom: [CustomParameter]
      }
    >({
      Sumeragi: [0, lib.getCodec(SumeragiParameter)],
      Block: [1, lib.getCodec(BlockParameter)],
      Transaction: [2, lib.getCodec(TransactionParameter)],
      SmartContract: [3, lib.getCodec(SmartContractParameter)],
      Executor: [4, lib.getCodec(SmartContractParameter)],
      Custom: [5, lib.getCodec(CustomParameter)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface ParameterChanged {
  oldValue: Parameter
  newValue: Parameter
}
/**
 * Codec of the structure.
 */
export const ParameterChanged: lib.CodecContainer<ParameterChanged> = lib
  .defineCodec(
    lib.structCodec<ParameterChanged>(['oldValue', 'newValue'], {
      oldValue: lib.getCodec(Parameter),
      newValue: lib.getCodec(Parameter),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Changed`
 *
 * TODO how to construct, how to use
 */
export type ConfigurationEvent = lib.Variant<'Changed', ParameterChanged>
/**
 * Codec and constructors for enumeration {@link ConfigurationEvent}.
 */
export const ConfigurationEvent = {
  /**
   * Constructor of variant `ConfigurationEvent.Changed`
   */ Changed: <const T extends ParameterChanged>(
    value: T,
  ): lib.Variant<'Changed', T> => ({ kind: 'Changed', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Changed: [ParameterChanged] }>({
      Changed: [0, lib.getCodec(ParameterChanged)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface CustomInstruction {
  payload: lib.Json
}
/**
 * Codec of the structure.
 */
export const CustomInstruction: lib.CodecContainer<CustomInstruction> = lib
  .defineCodec(
    lib.structCodec<CustomInstruction>(['payload'], {
      payload: lib.getCodec(lib.Json),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Added`
 * - `Removed`
 *
 * TODO how to construct, how to use
 */
export type PeerEvent =
  | lib.Variant<'Added', PeerId>
  | lib.Variant<'Removed', PeerId>
/**
 * Codec and constructors for enumeration {@link PeerEvent}.
 */
export const PeerEvent = {
  /**
   * Constructor of variant `PeerEvent.Added`
   */ Added: <const T extends PeerId>(value: T): lib.Variant<'Added', T> => ({
    kind: 'Added',
    value,
  }), /**
   * Constructor of variant `PeerEvent.Removed`
   */
  Removed: <const T extends PeerId>(value: T): lib.Variant<'Removed', T> => ({
    kind: 'Removed',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Added: [PeerId]; Removed: [PeerId] }>({
      Added: [0, lib.getCodec(PeerId)],
      Removed: [1, lib.getCodec(PeerId)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Domain {
  id: lib.DomainId
  logo: lib.Option<IpfsPath>
  metadata: Metadata
  ownedBy: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const Domain: lib.CodecContainer<Domain> = lib.defineCodec(
  lib.structCodec<Domain>(['id', 'logo', 'metadata', 'ownedBy'], {
    id: lib.getCodec(lib.DomainId),
    logo: lib.Option.with(lib.getCodec(IpfsPath)),
    metadata: lib.getCodec(Metadata),
    ownedBy: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface DomainOwnerChanged {
  domain: lib.DomainId
  newOwner: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const DomainOwnerChanged: lib.CodecContainer<DomainOwnerChanged> = lib
  .defineCodec(
    lib.structCodec<DomainOwnerChanged>(['domain', 'newOwner'], {
      domain: lib.getCodec(lib.DomainId),
      newOwner: lib.getCodec(lib.AccountId),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `AssetDefinition`
 * - `Account`
 * - `MetadataInserted`
 * - `MetadataRemoved`
 * - `OwnerChanged`
 *
 * TODO how to construct, how to use
 */
export type DomainEvent =
  | lib.Variant<'Created', Domain>
  | lib.Variant<'Deleted', lib.DomainId>
  | lib.Variant<'AssetDefinition', AssetDefinitionEvent>
  | lib.Variant<'Account', AccountEvent>
  | lib.Variant<'MetadataInserted', MetadataChanged<lib.DomainId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<lib.DomainId>>
  | lib.Variant<'OwnerChanged', DomainOwnerChanged>
/**
 * Codec and constructors for enumeration {@link DomainEvent}.
 */
export const DomainEvent = {
  /**
   * Constructor of variant `DomainEvent.Created`
   */ Created: <const T extends Domain>(
    value: T,
  ): lib.Variant<'Created', T> => ({ kind: 'Created', value }), /**
   * Constructor of variant `DomainEvent.Deleted`
   */
  Deleted: <const T extends lib.DomainId>(
    value: T,
  ): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }), /**
   * Constructors of nested enumerations under variant `DomainEvent.AssetDefinition`
   */
  AssetDefinition: {
    /**
     * Constructor of variant `DomainEvent.AssetDefinition.Created`
     */ Created: <const T extends AssetDefinition>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'Created', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Created(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.Deleted`
     */
    Deleted: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.Deleted(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.MetadataInserted`
     */
    MetadataInserted: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataInserted(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.MetadataRemoved`
     */
    MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MetadataRemoved(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.MintabilityChanged`
     */
    MintabilityChanged: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<
      'AssetDefinition',
      lib.Variant<'MintabilityChanged', T>
    > => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.MintabilityChanged(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.TotalQuantityChanged`
     */
    TotalQuantityChanged: <const T extends AssetDefinitionTotalQuantityChanged>(
      value: T,
    ): lib.Variant<
      'AssetDefinition',
      lib.Variant<'TotalQuantityChanged', T>
    > => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.TotalQuantityChanged(value),
    }), /**
     * Constructor of variant `DomainEvent.AssetDefinition.OwnerChanged`
     */
    OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
      value: T,
    ): lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>> => ({
      kind: 'AssetDefinition',
      value: AssetDefinitionEvent.OwnerChanged(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DomainEvent.Account`
   */
  Account: {
    /**
     * Constructor of variant `DomainEvent.Account.Created`
     */ Created: <const T extends Account>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'Created', T>> => ({
      kind: 'Account',
      value: AccountEvent.Created(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.Deleted`
     */
    Deleted: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'Deleted', T>> => ({
      kind: 'Account',
      value: AccountEvent.Deleted(value),
    }), /**
     * Constructors of nested enumerations under variant `DomainEvent.Account.Asset`
     */
    Asset: {
      /**
       * Constructor of variant `DomainEvent.Account.Asset.Created`
       */ Created: <const T extends Asset>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'Created', T>>
      > => ({ kind: 'Account', value: AccountEvent.Asset.Created(value) }), /**
       * Constructor of variant `DomainEvent.Account.Asset.Deleted`
       */
      Deleted: <const T extends lib.AssetId>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'Deleted', T>>
      > => ({ kind: 'Account', value: AccountEvent.Asset.Deleted(value) }), /**
       * Constructor of variant `DomainEvent.Account.Asset.Added`
       */
      Added: <const T extends AssetChanged>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'Added', T>>
      > => ({ kind: 'Account', value: AccountEvent.Asset.Added(value) }), /**
       * Constructor of variant `DomainEvent.Account.Asset.Removed`
       */
      Removed: <const T extends AssetChanged>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'Removed', T>>
      > => ({ kind: 'Account', value: AccountEvent.Asset.Removed(value) }), /**
       * Constructor of variant `DomainEvent.Account.Asset.MetadataInserted`
       */
      MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>
      > => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataInserted(value),
      }), /**
       * Constructor of variant `DomainEvent.Account.Asset.MetadataRemoved`
       */
      MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
        value: T,
      ): lib.Variant<
        'Account',
        lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>
      > => ({
        kind: 'Account',
        value: AccountEvent.Asset.MetadataRemoved(value),
      }),
    }, /**
     * Constructor of variant `DomainEvent.Account.PermissionAdded`
     */
    PermissionAdded: <const T extends AccountPermissionChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'PermissionAdded', T>> => ({
      kind: 'Account',
      value: AccountEvent.PermissionAdded(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.PermissionRemoved`
     */
    PermissionRemoved: <const T extends AccountPermissionChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>> => ({
      kind: 'Account',
      value: AccountEvent.PermissionRemoved(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.RoleGranted`
     */
    RoleGranted: <const T extends AccountRoleChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'RoleGranted', T>> => ({
      kind: 'Account',
      value: AccountEvent.RoleGranted(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.RoleRevoked`
     */
    RoleRevoked: <const T extends AccountRoleChanged>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'RoleRevoked', T>> => ({
      kind: 'Account',
      value: AccountEvent.RoleRevoked(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.MetadataInserted`
     */
    MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Account',
      value: AccountEvent.MetadataInserted(value),
    }), /**
     * Constructor of variant `DomainEvent.Account.MetadataRemoved`
     */
    MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
      value: T,
    ): lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Account',
      value: AccountEvent.MetadataRemoved(value),
    }),
  }, /**
   * Constructor of variant `DomainEvent.MetadataInserted`
   */
  MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }), /**
   * Constructor of variant `DomainEvent.MetadataRemoved`
   */
  MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({
    kind: 'MetadataRemoved',
    value,
  }), /**
   * Constructor of variant `DomainEvent.OwnerChanged`
   */
  OwnerChanged: <const T extends DomainOwnerChanged>(
    value: T,
  ): lib.Variant<'OwnerChanged', T> => ({ kind: 'OwnerChanged', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [Domain]
        Deleted: [lib.DomainId]
        AssetDefinition: [AssetDefinitionEvent]
        Account: [AccountEvent]
        MetadataInserted: [MetadataChanged<lib.DomainId>]
        MetadataRemoved: [MetadataChanged<lib.DomainId>]
        OwnerChanged: [DomainOwnerChanged]
      }
    >({
      Created: [0, lib.getCodec(Domain)],
      Deleted: [1, lib.getCodec(lib.DomainId)],
      AssetDefinition: [2, lib.getCodec(AssetDefinitionEvent)],
      Account: [3, lib.getCodec(AccountEvent)],
      MetadataInserted: [4, MetadataChanged.with(lib.getCodec(lib.DomainId))],
      MetadataRemoved: [5, MetadataChanged.with(lib.getCodec(lib.DomainId))],
      OwnerChanged: [6, lib.getCodec(DomainOwnerChanged)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TriggerNumberOfExecutionsChanged {
  trigger: TriggerId
  by: lib.U32
}
/**
 * Codec of the structure.
 */
export const TriggerNumberOfExecutionsChanged: lib.CodecContainer<
  TriggerNumberOfExecutionsChanged
> = lib.defineCodec(
  lib.structCodec<TriggerNumberOfExecutionsChanged>(['trigger', 'by'], {
    trigger: lib.getCodec(TriggerId),
    by: lib.getCodec(lib.U32),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `Extended`
 * - `Shortened`
 * - `MetadataInserted`
 * - `MetadataRemoved`
 *
 * TODO how to construct, how to use
 */
export type TriggerEvent =
  | lib.Variant<'Created', TriggerId>
  | lib.Variant<'Deleted', TriggerId>
  | lib.Variant<'Extended', TriggerNumberOfExecutionsChanged>
  | lib.Variant<'Shortened', TriggerNumberOfExecutionsChanged>
  | lib.Variant<'MetadataInserted', MetadataChanged<TriggerId>>
  | lib.Variant<'MetadataRemoved', MetadataChanged<TriggerId>>
/**
 * Codec and constructors for enumeration {@link TriggerEvent}.
 */
export const TriggerEvent = {
  /**
   * Constructor of variant `TriggerEvent.Created`
   */ Created: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'Created', T> => ({ kind: 'Created', value }), /**
   * Constructor of variant `TriggerEvent.Deleted`
   */
  Deleted: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'Deleted', T> => ({ kind: 'Deleted', value }), /**
   * Constructor of variant `TriggerEvent.Extended`
   */
  Extended: <const T extends TriggerNumberOfExecutionsChanged>(
    value: T,
  ): lib.Variant<'Extended', T> => ({ kind: 'Extended', value }), /**
   * Constructor of variant `TriggerEvent.Shortened`
   */
  Shortened: <const T extends TriggerNumberOfExecutionsChanged>(
    value: T,
  ): lib.Variant<'Shortened', T> => ({ kind: 'Shortened', value }), /**
   * Constructor of variant `TriggerEvent.MetadataInserted`
   */
  MetadataInserted: <const T extends MetadataChanged<TriggerId>>(
    value: T,
  ): lib.Variant<'MetadataInserted', T> => ({
    kind: 'MetadataInserted',
    value,
  }), /**
   * Constructor of variant `TriggerEvent.MetadataRemoved`
   */
  MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(
    value: T,
  ): lib.Variant<'MetadataRemoved', T> => ({ kind: 'MetadataRemoved', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [TriggerId]
        Deleted: [TriggerId]
        Extended: [TriggerNumberOfExecutionsChanged]
        Shortened: [TriggerNumberOfExecutionsChanged]
        MetadataInserted: [MetadataChanged<TriggerId>]
        MetadataRemoved: [MetadataChanged<TriggerId>]
      }
    >({
      Created: [0, lib.getCodec(TriggerId)],
      Deleted: [1, lib.getCodec(TriggerId)],
      Extended: [2, lib.getCodec(TriggerNumberOfExecutionsChanged)],
      Shortened: [3, lib.getCodec(TriggerNumberOfExecutionsChanged)],
      MetadataInserted: [4, MetadataChanged.with(lib.getCodec(TriggerId))],
      MetadataRemoved: [5, MetadataChanged.with(lib.getCodec(TriggerId))],
    }).discriminated(),
  ),
}

export type PermissionsSet = lib.BTreeSet<Permission>
export const PermissionsSet = lib.defineCodec(
  lib.BTreeSet.withCmp(lib.getCodec(Permission), (a, b) => {
    const names = lib.ordCompare(a.name, b.name)
    if (names !== 0) return names
    return lib.ordCompare(a.payload, b.payload)
  }),
)

/**
 * Structure with named fields.
 */
export interface Role {
  id: RoleId
  permissions: PermissionsSet
}
/**
 * Codec of the structure.
 */
export const Role: lib.CodecContainer<Role> = lib.defineCodec(
  lib.structCodec<Role>(['id', 'permissions'], {
    id: lib.getCodec(RoleId),
    permissions: lib.getCodec(PermissionsSet),
  }),
)

/**
 * Structure with named fields.
 */
export interface RolePermissionChanged {
  role: RoleId
  permission: Permission
}
/**
 * Codec of the structure.
 */
export const RolePermissionChanged: lib.CodecContainer<RolePermissionChanged> = lib.defineCodec(
  lib.structCodec<RolePermissionChanged>(['role', 'permission'], {
    role: lib.getCodec(RoleId),
    permission: lib.getCodec(Permission),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Created`
 * - `Deleted`
 * - `PermissionAdded`
 * - `PermissionRemoved`
 *
 * TODO how to construct, how to use
 */
export type RoleEvent =
  | lib.Variant<'Created', Role>
  | lib.Variant<'Deleted', RoleId>
  | lib.Variant<'PermissionAdded', RolePermissionChanged>
  | lib.Variant<'PermissionRemoved', RolePermissionChanged>
/**
 * Codec and constructors for enumeration {@link RoleEvent}.
 */
export const RoleEvent = {
  /**
   * Constructor of variant `RoleEvent.Created`
   */ Created: <const T extends Role>(value: T): lib.Variant<'Created', T> => ({
    kind: 'Created',
    value,
  }), /**
   * Constructor of variant `RoleEvent.Deleted`
   */
  Deleted: <const T extends RoleId>(value: T): lib.Variant<'Deleted', T> => ({
    kind: 'Deleted',
    value,
  }), /**
   * Constructor of variant `RoleEvent.PermissionAdded`
   */
  PermissionAdded: <const T extends RolePermissionChanged>(
    value: T,
  ): lib.Variant<'PermissionAdded', T> => ({
    kind: 'PermissionAdded',
    value,
  }), /**
   * Constructor of variant `RoleEvent.PermissionRemoved`
   */
  PermissionRemoved: <const T extends RolePermissionChanged>(
    value: T,
  ): lib.Variant<'PermissionRemoved', T> => ({
    kind: 'PermissionRemoved',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Created: [Role]
        Deleted: [RoleId]
        PermissionAdded: [RolePermissionChanged]
        PermissionRemoved: [RolePermissionChanged]
      }
    >({
      Created: [0, lib.getCodec(Role)],
      Deleted: [1, lib.getCodec(RoleId)],
      PermissionAdded: [2, lib.getCodec(RolePermissionChanged)],
      PermissionRemoved: [3, lib.getCodec(RolePermissionChanged)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface ExecutorDataModel {
  parameters: lib.BTreeMap<CustomParameterId, CustomParameter>
  instructions: lib.BTreeSet<lib.String>
  permissions: lib.BTreeSet<lib.String>
  schema: lib.Json
}
/**
 * Codec of the structure.
 */
export const ExecutorDataModel: lib.CodecContainer<ExecutorDataModel> = lib
  .defineCodec(
    lib.structCodec<ExecutorDataModel>([
      'parameters',
      'instructions',
      'permissions',
      'schema',
    ], {
      parameters: lib.BTreeMap.with(
        lib.getCodec(CustomParameterId),
        lib.getCodec(CustomParameter),
      ),
      instructions: lib.BTreeSet.with(lib.getCodec(lib.String)),
      permissions: lib.BTreeSet.with(lib.getCodec(lib.String)),
      schema: lib.getCodec(lib.Json),
    }),
  )

/**
 * Structure with named fields.
 */
export interface ExecutorUpgrade {
  newDataModel: ExecutorDataModel
}
/**
 * Codec of the structure.
 */
export const ExecutorUpgrade: lib.CodecContainer<ExecutorUpgrade> = lib
  .defineCodec(
    lib.structCodec<ExecutorUpgrade>(['newDataModel'], {
      newDataModel: lib.getCodec(ExecutorDataModel),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Upgraded`
 *
 * TODO how to construct, how to use
 */
export type ExecutorEvent = lib.Variant<'Upgraded', ExecutorUpgrade>
/**
 * Codec and constructors for enumeration {@link ExecutorEvent}.
 */
export const ExecutorEvent = {
  /**
   * Constructor of variant `ExecutorEvent.Upgraded`
   */ Upgraded: <const T extends ExecutorUpgrade>(
    value: T,
  ): lib.Variant<'Upgraded', T> => ({ kind: 'Upgraded', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Upgraded: [ExecutorUpgrade] }>({
      Upgraded: [0, lib.getCodec(ExecutorUpgrade)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Peer`
 * - `Domain`
 * - `Trigger`
 * - `Role`
 * - `Configuration`
 * - `Executor`
 *
 * TODO how to construct, how to use
 */
export type DataEvent =
  | lib.Variant<'Peer', PeerEvent>
  | lib.Variant<'Domain', DomainEvent>
  | lib.Variant<'Trigger', TriggerEvent>
  | lib.Variant<'Role', RoleEvent>
  | lib.Variant<'Configuration', ConfigurationEvent>
  | lib.Variant<'Executor', ExecutorEvent>
/**
 * Codec and constructors for enumeration {@link DataEvent}.
 */
export const DataEvent = {
  /**
   * Constructors of nested enumerations under variant `DataEvent.Peer`
   */ Peer: {
    /**
     * Constructor of variant `DataEvent.Peer.Added`
     */ Added: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Peer', lib.Variant<'Added', T>> => ({
      kind: 'Peer',
      value: PeerEvent.Added(value),
    }), /**
     * Constructor of variant `DataEvent.Peer.Removed`
     */
    Removed: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Peer', lib.Variant<'Removed', T>> => ({
      kind: 'Peer',
      value: PeerEvent.Removed(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DataEvent.Domain`
   */
  Domain: {
    /**
     * Constructor of variant `DataEvent.Domain.Created`
     */ Created: <const T extends Domain>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'Created', T>> => ({
      kind: 'Domain',
      value: DomainEvent.Created(value),
    }), /**
     * Constructor of variant `DataEvent.Domain.Deleted`
     */
    Deleted: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'Deleted', T>> => ({
      kind: 'Domain',
      value: DomainEvent.Deleted(value),
    }), /**
     * Constructors of nested enumerations under variant `DataEvent.Domain.AssetDefinition`
     */
    AssetDefinition: {
      /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.Created`
       */ Created: <const T extends AssetDefinition>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'Created', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Created(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.Deleted`
       */
      Deleted: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.Deleted(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.MetadataInserted`
       */
      MetadataInserted: <
        const T extends MetadataChanged<lib.AssetDefinitionId>,
      >(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataInserted(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.MetadataRemoved`
       */
      MetadataRemoved: <const T extends MetadataChanged<lib.AssetDefinitionId>>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MetadataRemoved(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.MintabilityChanged`
       */
      MintabilityChanged: <const T extends lib.AssetDefinitionId>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'MintabilityChanged', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.MintabilityChanged(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.TotalQuantityChanged`
       */
      TotalQuantityChanged: <
        const T extends AssetDefinitionTotalQuantityChanged,
      >(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'TotalQuantityChanged', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.TotalQuantityChanged(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.AssetDefinition.OwnerChanged`
       */
      OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.AssetDefinition.OwnerChanged(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `DataEvent.Domain.Account`
     */
    Account: {
      /**
       * Constructor of variant `DataEvent.Domain.Account.Created`
       */ Created: <const T extends Account>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'Created', T>>
      > => ({ kind: 'Domain', value: DomainEvent.Account.Created(value) }), /**
       * Constructor of variant `DataEvent.Domain.Account.Deleted`
       */
      Deleted: <const T extends lib.AccountId>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'Deleted', T>>
      > => ({ kind: 'Domain', value: DomainEvent.Account.Deleted(value) }), /**
       * Constructors of nested enumerations under variant `DataEvent.Domain.Account.Asset`
       */
      Asset: {
        /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.Created`
         */ Created: <const T extends Asset>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<
            'Account',
            lib.Variant<'Asset', lib.Variant<'Created', T>>
          >
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Created(value),
        }), /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.Deleted`
         */
        Deleted: <const T extends lib.AssetId>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<
            'Account',
            lib.Variant<'Asset', lib.Variant<'Deleted', T>>
          >
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Deleted(value),
        }), /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.Added`
         */
        Added: <const T extends AssetChanged>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<'Account', lib.Variant<'Asset', lib.Variant<'Added', T>>>
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Added(value),
        }), /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.Removed`
         */
        Removed: <const T extends AssetChanged>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<
            'Account',
            lib.Variant<'Asset', lib.Variant<'Removed', T>>
          >
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.Removed(value),
        }), /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.MetadataInserted`
         */
        MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<
            'Account',
            lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>
          >
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataInserted(value),
        }), /**
         * Constructor of variant `DataEvent.Domain.Account.Asset.MetadataRemoved`
         */
        MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
          value: T,
        ): lib.Variant<
          'Domain',
          lib.Variant<
            'Account',
            lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>
          >
        > => ({
          kind: 'Domain',
          value: DomainEvent.Account.Asset.MetadataRemoved(value),
        }),
      }, /**
       * Constructor of variant `DataEvent.Domain.Account.PermissionAdded`
       */
      PermissionAdded: <const T extends AccountPermissionChanged>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'PermissionAdded', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionAdded(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.Account.PermissionRemoved`
       */
      PermissionRemoved: <const T extends AccountPermissionChanged>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.PermissionRemoved(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.Account.RoleGranted`
       */
      RoleGranted: <const T extends AccountRoleChanged>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'RoleGranted', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleGranted(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.Account.RoleRevoked`
       */
      RoleRevoked: <const T extends AccountRoleChanged>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'RoleRevoked', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.RoleRevoked(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.Account.MetadataInserted`
       */
      MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'MetadataInserted', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataInserted(value),
      }), /**
       * Constructor of variant `DataEvent.Domain.Account.MetadataRemoved`
       */
      MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
        value: T,
      ): lib.Variant<
        'Domain',
        lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>>
      > => ({
        kind: 'Domain',
        value: DomainEvent.Account.MetadataRemoved(value),
      }),
    }, /**
     * Constructor of variant `DataEvent.Domain.MetadataInserted`
     */
    MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Domain',
      value: DomainEvent.MetadataInserted(value),
    }), /**
     * Constructor of variant `DataEvent.Domain.MetadataRemoved`
     */
    MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Domain',
      value: DomainEvent.MetadataRemoved(value),
    }), /**
     * Constructor of variant `DataEvent.Domain.OwnerChanged`
     */
    OwnerChanged: <const T extends DomainOwnerChanged>(
      value: T,
    ): lib.Variant<'Domain', lib.Variant<'OwnerChanged', T>> => ({
      kind: 'Domain',
      value: DomainEvent.OwnerChanged(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DataEvent.Trigger`
   */
  Trigger: {
    /**
     * Constructor of variant `DataEvent.Trigger.Created`
     */ Created: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Created', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Created(value),
    }), /**
     * Constructor of variant `DataEvent.Trigger.Deleted`
     */
    Deleted: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Deleted', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Deleted(value),
    }), /**
     * Constructor of variant `DataEvent.Trigger.Extended`
     */
    Extended: <const T extends TriggerNumberOfExecutionsChanged>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Extended', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Extended(value),
    }), /**
     * Constructor of variant `DataEvent.Trigger.Shortened`
     */
    Shortened: <const T extends TriggerNumberOfExecutionsChanged>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'Shortened', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.Shortened(value),
    }), /**
     * Constructor of variant `DataEvent.Trigger.MetadataInserted`
     */
    MetadataInserted: <const T extends MetadataChanged<TriggerId>>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'MetadataInserted', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataInserted(value),
    }), /**
     * Constructor of variant `DataEvent.Trigger.MetadataRemoved`
     */
    MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(
      value: T,
    ): lib.Variant<'Trigger', lib.Variant<'MetadataRemoved', T>> => ({
      kind: 'Trigger',
      value: TriggerEvent.MetadataRemoved(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DataEvent.Role`
   */
  Role: {
    /**
     * Constructor of variant `DataEvent.Role.Created`
     */ Created: <const T extends Role>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'Created', T>> => ({
      kind: 'Role',
      value: RoleEvent.Created(value),
    }), /**
     * Constructor of variant `DataEvent.Role.Deleted`
     */
    Deleted: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'Deleted', T>> => ({
      kind: 'Role',
      value: RoleEvent.Deleted(value),
    }), /**
     * Constructor of variant `DataEvent.Role.PermissionAdded`
     */
    PermissionAdded: <const T extends RolePermissionChanged>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'PermissionAdded', T>> => ({
      kind: 'Role',
      value: RoleEvent.PermissionAdded(value),
    }), /**
     * Constructor of variant `DataEvent.Role.PermissionRemoved`
     */
    PermissionRemoved: <const T extends RolePermissionChanged>(
      value: T,
    ): lib.Variant<'Role', lib.Variant<'PermissionRemoved', T>> => ({
      kind: 'Role',
      value: RoleEvent.PermissionRemoved(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DataEvent.Configuration`
   */
  Configuration: {
    /**
     * Constructor of variant `DataEvent.Configuration.Changed`
     */ Changed: <const T extends ParameterChanged>(
      value: T,
    ): lib.Variant<'Configuration', lib.Variant<'Changed', T>> => ({
      kind: 'Configuration',
      value: ConfigurationEvent.Changed(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `DataEvent.Executor`
   */
  Executor: {
    /**
     * Constructor of variant `DataEvent.Executor.Upgraded`
     */ Upgraded: <const T extends ExecutorUpgrade>(
      value: T,
    ): lib.Variant<'Executor', lib.Variant<'Upgraded', T>> => ({
      kind: 'Executor',
      value: ExecutorEvent.Upgraded(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Peer: [PeerEvent]
        Domain: [DomainEvent]
        Trigger: [TriggerEvent]
        Role: [RoleEvent]
        Configuration: [ConfigurationEvent]
        Executor: [ExecutorEvent]
      }
    >({
      Peer: [0, lib.getCodec(PeerEvent)],
      Domain: [1, lib.getCodec(DomainEvent)],
      Trigger: [2, lib.getCodec(TriggerEvent)],
      Role: [3, lib.getCodec(RoleEvent)],
      Configuration: [4, lib.getCodec(ConfigurationEvent)],
      Executor: [5, lib.getCodec(ExecutorEvent)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Metadata`
 *
 * TODO how to construct, how to use
 */
export type DomainProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', DomainIdProjectionSelector>
  | lib.Variant<'Metadata', MetadataProjectionSelector>
/**
 * Codec and constructors for enumeration {@link DomainProjectionSelector}.
 */
export const DomainProjectionSelector = {
  /**
   * Value of variant `DomainProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `DomainProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `DomainProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: DomainIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `DomainProjectionSelector.Id.Name`
     */
    Name: {
      /**
       * Value of variant `DomainProjectionSelector.Id.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: DomainIdProjectionSelector.Name.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `DomainProjectionSelector.Metadata`
   */
  Metadata: {
    /**
     * Value of variant `DomainProjectionSelector.Metadata.Atom`
     */ Atom: Object.freeze<lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Atom,
    }), /**
     * Constructor of variant `DomainProjectionSelector.Metadata.Key`
     */
    Key: <const T extends MetadataKeyProjectionSelector>(
      value: T,
    ): lib.Variant<'Metadata', lib.Variant<'Key', T>> => ({
      kind: 'Metadata',
      value: MetadataProjectionSelector.Key(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Id: [DomainIdProjectionSelector]
        Metadata: [MetadataProjectionSelector]
      }
    >({
      Atom: [0],
      Id: [1, lib.getCodec(DomainIdProjectionSelector)],
      Metadata: [2, lib.getCodec(MetadataProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TransactionEvent {
  hash: lib.HashRepr
  blockHeight: lib.Option<lib.NonZero<lib.U64>>
  status: TransactionStatus
}
/**
 * Codec of the structure.
 */
export const TransactionEvent: lib.CodecContainer<TransactionEvent> = lib
  .defineCodec(
    lib.structCodec<TransactionEvent>(['hash', 'blockHeight', 'status'], {
      hash: lib.getCodec(lib.HashRepr),
      blockHeight: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U64))),
      status: lib.getCodec(TransactionStatus),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Transaction`
 * - `Block`
 *
 * TODO how to construct, how to use
 */
export type PipelineEventBox =
  | lib.Variant<'Transaction', TransactionEvent>
  | lib.Variant<'Block', BlockEvent>
/**
 * Codec and constructors for enumeration {@link PipelineEventBox}.
 */
export const PipelineEventBox = {
  /**
   * Constructor of variant `PipelineEventBox.Transaction`
   */ Transaction: <const T extends TransactionEvent>(
    value: T,
  ): lib.Variant<'Transaction', T> => ({ kind: 'Transaction', value }), /**
   * Constructor of variant `PipelineEventBox.Block`
   */
  Block: <const T extends BlockEvent>(value: T): lib.Variant<'Block', T> => ({
    kind: 'Block',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ Transaction: [TransactionEvent]; Block: [BlockEvent] }>({
      Transaction: [0, lib.getCodec(TransactionEvent)],
      Block: [1, lib.getCodec(BlockEvent)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TimeInterval {
  since: lib.Timestamp
  length: lib.Duration
}
/**
 * Codec of the structure.
 */
export const TimeInterval: lib.CodecContainer<TimeInterval> = lib.defineCodec(
  lib.structCodec<TimeInterval>(['since', 'length'], {
    since: lib.getCodec(lib.Timestamp),
    length: lib.getCodec(lib.Duration),
  }),
)

/**
 * Structure with named fields.
 */
export interface TimeEvent {
  interval: TimeInterval
}
/**
 * Codec of the structure.
 */
export const TimeEvent: lib.CodecContainer<TimeEvent> = lib.defineCodec(
  lib.structCodec<TimeEvent>(['interval'], {
    interval: lib.getCodec(TimeInterval),
  }),
)

/**
 * Structure with named fields.
 */
export interface ExecuteTriggerEvent {
  triggerId: TriggerId
  authority: lib.AccountId
  args: lib.Json
}
/**
 * Codec of the structure.
 */
export const ExecuteTriggerEvent: lib.CodecContainer<ExecuteTriggerEvent> = lib
  .defineCodec(
    lib.structCodec<ExecuteTriggerEvent>(['triggerId', 'authority', 'args'], {
      triggerId: lib.getCodec(TriggerId),
      authority: lib.getCodec(lib.AccountId),
      args: lib.getCodec(lib.Json),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Success`
 * - `Failure`
 *
 * TODO how to construct, how to use
 */
export type TriggerCompletedOutcome =
  | lib.VariantUnit<'Success'>
  | lib.Variant<'Failure', lib.String>
/**
 * Codec and constructors for enumeration {@link TriggerCompletedOutcome}.
 */
export const TriggerCompletedOutcome = {
  /**
   * Value of variant `TriggerCompletedOutcome.Success`
   */ Success: Object.freeze<lib.VariantUnit<'Success'>>({
    kind: 'Success',
  }), /**
   * Constructor of variant `TriggerCompletedOutcome.Failure`
   */
  Failure: <const T extends lib.String>(
    value: T,
  ): lib.Variant<'Failure', T> => ({ kind: 'Failure', value }),
  ...lib.defineCodec(
    lib.enumCodec<{ Success: []; Failure: [lib.String] }>({
      Success: [0],
      Failure: [1, lib.getCodec(lib.String)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface TriggerCompletedEvent {
  triggerId: TriggerId
  outcome: TriggerCompletedOutcome
}
/**
 * Codec of the structure.
 */
export const TriggerCompletedEvent: lib.CodecContainer<TriggerCompletedEvent> = lib.defineCodec(
  lib.structCodec<TriggerCompletedEvent>(['triggerId', 'outcome'], {
    triggerId: lib.getCodec(TriggerId),
    outcome: lib.getCodec(TriggerCompletedOutcome),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Pipeline`
 * - `Data`
 * - `Time`
 * - `ExecuteTrigger`
 * - `TriggerCompleted`
 *
 * TODO how to construct, how to use
 */
export type EventBox =
  | lib.Variant<'Pipeline', PipelineEventBox>
  | lib.Variant<'Data', DataEvent>
  | lib.Variant<'Time', TimeEvent>
  | lib.Variant<'ExecuteTrigger', ExecuteTriggerEvent>
  | lib.Variant<'TriggerCompleted', TriggerCompletedEvent>
/**
 * Codec and constructors for enumeration {@link EventBox}.
 */
export const EventBox = {
  /**
   * Constructors of nested enumerations under variant `EventBox.Pipeline`
   */ Pipeline: {
    /**
     * Constructor of variant `EventBox.Pipeline.Transaction`
     */ Transaction: <const T extends TransactionEvent>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Transaction', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventBox.Transaction(value),
    }), /**
     * Constructor of variant `EventBox.Pipeline.Block`
     */
    Block: <const T extends BlockEvent>(
      value: T,
    ): lib.Variant<'Pipeline', lib.Variant<'Block', T>> => ({
      kind: 'Pipeline',
      value: PipelineEventBox.Block(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `EventBox.Data`
   */
  Data: {
    /**
     * Constructors of nested enumerations under variant `EventBox.Data.Peer`
     */ Peer: {
      /**
       * Constructor of variant `EventBox.Data.Peer.Added`
       */ Added: <const T extends PeerId>(
        value: T,
      ): lib.Variant<'Data', lib.Variant<'Peer', lib.Variant<'Added', T>>> => ({
        kind: 'Data',
        value: DataEvent.Peer.Added(value),
      }), /**
       * Constructor of variant `EventBox.Data.Peer.Removed`
       */
      Removed: <const T extends PeerId>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Peer', lib.Variant<'Removed', T>>
      > => ({ kind: 'Data', value: DataEvent.Peer.Removed(value) }),
    }, /**
     * Constructors of nested enumerations under variant `EventBox.Data.Domain`
     */
    Domain: {
      /**
       * Constructor of variant `EventBox.Data.Domain.Created`
       */ Created: <const T extends Domain>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Domain', lib.Variant<'Created', T>>
      > => ({ kind: 'Data', value: DataEvent.Domain.Created(value) }), /**
       * Constructor of variant `EventBox.Data.Domain.Deleted`
       */
      Deleted: <const T extends lib.DomainId>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Domain', lib.Variant<'Deleted', T>>
      > => ({ kind: 'Data', value: DataEvent.Domain.Deleted(value) }), /**
       * Constructors of nested enumerations under variant `EventBox.Data.Domain.AssetDefinition`
       */
      AssetDefinition: {
        /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.Created`
         */ Created: <const T extends AssetDefinition>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'Created', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Created(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.Deleted`
         */
        Deleted: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'Deleted', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.Deleted(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.MetadataInserted`
         */
        MetadataInserted: <
          const T extends MetadataChanged<lib.AssetDefinitionId>,
        >(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'MetadataInserted', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MetadataInserted(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.MetadataRemoved`
         */
        MetadataRemoved: <
          const T extends MetadataChanged<lib.AssetDefinitionId>,
        >(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'MetadataRemoved', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MetadataRemoved(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.MintabilityChanged`
         */
        MintabilityChanged: <const T extends lib.AssetDefinitionId>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'MintabilityChanged', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.MintabilityChanged(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.TotalQuantityChanged`
         */
        TotalQuantityChanged: <
          const T extends AssetDefinitionTotalQuantityChanged,
        >(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<
              'AssetDefinition',
              lib.Variant<'TotalQuantityChanged', T>
            >
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.TotalQuantityChanged(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.AssetDefinition.OwnerChanged`
         */
        OwnerChanged: <const T extends AssetDefinitionOwnerChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'AssetDefinition', lib.Variant<'OwnerChanged', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.AssetDefinition.OwnerChanged(value),
        }),
      }, /**
       * Constructors of nested enumerations under variant `EventBox.Data.Domain.Account`
       */
      Account: {
        /**
         * Constructor of variant `EventBox.Data.Domain.Account.Created`
         */ Created: <const T extends Account>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'Created', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.Created(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.Deleted`
         */
        Deleted: <const T extends lib.AccountId>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'Deleted', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.Deleted(value),
        }), /**
         * Constructors of nested enumerations under variant `EventBox.Data.Domain.Account.Asset`
         */
        Asset: {
          /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.Created`
           */ Created: <const T extends Asset>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'Created', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Created(value),
          }), /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.Deleted`
           */
          Deleted: <const T extends lib.AssetId>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'Deleted', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Deleted(value),
          }), /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.Added`
           */
          Added: <const T extends AssetChanged>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'Added', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Added(value),
          }), /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.Removed`
           */
          Removed: <const T extends AssetChanged>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'Removed', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.Removed(value),
          }), /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.MetadataInserted`
           */
          MetadataInserted: <const T extends MetadataChanged<lib.AssetId>>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'MetadataInserted', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.MetadataInserted(value),
          }), /**
           * Constructor of variant `EventBox.Data.Domain.Account.Asset.MetadataRemoved`
           */
          MetadataRemoved: <const T extends MetadataChanged<lib.AssetId>>(
            value: T,
          ): lib.Variant<
            'Data',
            lib.Variant<
              'Domain',
              lib.Variant<
                'Account',
                lib.Variant<'Asset', lib.Variant<'MetadataRemoved', T>>
              >
            >
          > => ({
            kind: 'Data',
            value: DataEvent.Domain.Account.Asset.MetadataRemoved(value),
          }),
        }, /**
         * Constructor of variant `EventBox.Data.Domain.Account.PermissionAdded`
         */
        PermissionAdded: <const T extends AccountPermissionChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'PermissionAdded', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionAdded(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.PermissionRemoved`
         */
        PermissionRemoved: <const T extends AccountPermissionChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'PermissionRemoved', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.PermissionRemoved(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.RoleGranted`
         */
        RoleGranted: <const T extends AccountRoleChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'RoleGranted', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleGranted(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.RoleRevoked`
         */
        RoleRevoked: <const T extends AccountRoleChanged>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'RoleRevoked', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.RoleRevoked(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.MetadataInserted`
         */
        MetadataInserted: <const T extends MetadataChanged<lib.AccountId>>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'MetadataInserted', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataInserted(value),
        }), /**
         * Constructor of variant `EventBox.Data.Domain.Account.MetadataRemoved`
         */
        MetadataRemoved: <const T extends MetadataChanged<lib.AccountId>>(
          value: T,
        ): lib.Variant<
          'Data',
          lib.Variant<
            'Domain',
            lib.Variant<'Account', lib.Variant<'MetadataRemoved', T>>
          >
        > => ({
          kind: 'Data',
          value: DataEvent.Domain.Account.MetadataRemoved(value),
        }),
      }, /**
       * Constructor of variant `EventBox.Data.Domain.MetadataInserted`
       */
      MetadataInserted: <const T extends MetadataChanged<lib.DomainId>>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Domain', lib.Variant<'MetadataInserted', T>>
      > => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataInserted(value),
      }), /**
       * Constructor of variant `EventBox.Data.Domain.MetadataRemoved`
       */
      MetadataRemoved: <const T extends MetadataChanged<lib.DomainId>>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Domain', lib.Variant<'MetadataRemoved', T>>
      > => ({
        kind: 'Data',
        value: DataEvent.Domain.MetadataRemoved(value),
      }), /**
       * Constructor of variant `EventBox.Data.Domain.OwnerChanged`
       */
      OwnerChanged: <const T extends DomainOwnerChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Domain', lib.Variant<'OwnerChanged', T>>
      > => ({ kind: 'Data', value: DataEvent.Domain.OwnerChanged(value) }),
    }, /**
     * Constructors of nested enumerations under variant `EventBox.Data.Trigger`
     */
    Trigger: {
      /**
       * Constructor of variant `EventBox.Data.Trigger.Created`
       */ Created: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'Created', T>>
      > => ({ kind: 'Data', value: DataEvent.Trigger.Created(value) }), /**
       * Constructor of variant `EventBox.Data.Trigger.Deleted`
       */
      Deleted: <const T extends TriggerId>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'Deleted', T>>
      > => ({ kind: 'Data', value: DataEvent.Trigger.Deleted(value) }), /**
       * Constructor of variant `EventBox.Data.Trigger.Extended`
       */
      Extended: <const T extends TriggerNumberOfExecutionsChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'Extended', T>>
      > => ({ kind: 'Data', value: DataEvent.Trigger.Extended(value) }), /**
       * Constructor of variant `EventBox.Data.Trigger.Shortened`
       */
      Shortened: <const T extends TriggerNumberOfExecutionsChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'Shortened', T>>
      > => ({ kind: 'Data', value: DataEvent.Trigger.Shortened(value) }), /**
       * Constructor of variant `EventBox.Data.Trigger.MetadataInserted`
       */
      MetadataInserted: <const T extends MetadataChanged<TriggerId>>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'MetadataInserted', T>>
      > => ({
        kind: 'Data',
        value: DataEvent.Trigger.MetadataInserted(value),
      }), /**
       * Constructor of variant `EventBox.Data.Trigger.MetadataRemoved`
       */
      MetadataRemoved: <const T extends MetadataChanged<TriggerId>>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Trigger', lib.Variant<'MetadataRemoved', T>>
      > => ({ kind: 'Data', value: DataEvent.Trigger.MetadataRemoved(value) }),
    }, /**
     * Constructors of nested enumerations under variant `EventBox.Data.Role`
     */
    Role: {
      /**
       * Constructor of variant `EventBox.Data.Role.Created`
       */ Created: <const T extends Role>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Role', lib.Variant<'Created', T>>
      > => ({ kind: 'Data', value: DataEvent.Role.Created(value) }), /**
       * Constructor of variant `EventBox.Data.Role.Deleted`
       */
      Deleted: <const T extends RoleId>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Role', lib.Variant<'Deleted', T>>
      > => ({ kind: 'Data', value: DataEvent.Role.Deleted(value) }), /**
       * Constructor of variant `EventBox.Data.Role.PermissionAdded`
       */
      PermissionAdded: <const T extends RolePermissionChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Role', lib.Variant<'PermissionAdded', T>>
      > => ({ kind: 'Data', value: DataEvent.Role.PermissionAdded(value) }), /**
       * Constructor of variant `EventBox.Data.Role.PermissionRemoved`
       */
      PermissionRemoved: <const T extends RolePermissionChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Role', lib.Variant<'PermissionRemoved', T>>
      > => ({ kind: 'Data', value: DataEvent.Role.PermissionRemoved(value) }),
    }, /**
     * Constructors of nested enumerations under variant `EventBox.Data.Configuration`
     */
    Configuration: {
      /**
       * Constructor of variant `EventBox.Data.Configuration.Changed`
       */ Changed: <const T extends ParameterChanged>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Configuration', lib.Variant<'Changed', T>>
      > => ({ kind: 'Data', value: DataEvent.Configuration.Changed(value) }),
    }, /**
     * Constructors of nested enumerations under variant `EventBox.Data.Executor`
     */
    Executor: {
      /**
       * Constructor of variant `EventBox.Data.Executor.Upgraded`
       */ Upgraded: <const T extends ExecutorUpgrade>(
        value: T,
      ): lib.Variant<
        'Data',
        lib.Variant<'Executor', lib.Variant<'Upgraded', T>>
      > => ({ kind: 'Data', value: DataEvent.Executor.Upgraded(value) }),
    },
  }, /**
   * Constructor of variant `EventBox.Time`
   */
  Time: <const T extends TimeEvent>(value: T): lib.Variant<'Time', T> => ({
    kind: 'Time',
    value,
  }), /**
   * Constructor of variant `EventBox.ExecuteTrigger`
   */
  ExecuteTrigger: <const T extends ExecuteTriggerEvent>(
    value: T,
  ): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }), /**
   * Constructor of variant `EventBox.TriggerCompleted`
   */
  TriggerCompleted: <const T extends TriggerCompletedEvent>(
    value: T,
  ): lib.Variant<'TriggerCompleted', T> => ({
    kind: 'TriggerCompleted',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Pipeline: [PipelineEventBox]
        Data: [DataEvent]
        Time: [TimeEvent]
        ExecuteTrigger: [ExecuteTriggerEvent]
        TriggerCompleted: [TriggerCompletedEvent]
      }
    >({
      Pipeline: [0, lib.getCodec(PipelineEventBox)],
      Data: [1, lib.getCodec(DataEvent)],
      Time: [2, lib.getCodec(TimeEvent)],
      ExecuteTrigger: [3, lib.getCodec(ExecuteTriggerEvent)],
      TriggerCompleted: [4, lib.getCodec(TriggerCompletedEvent)],
    }).discriminated(),
  ),
}

export type EventMessage = EventBox
export const EventMessage = EventBox

/**
 * Structure with named fields.
 */
export interface EventSubscriptionRequest {
  filters: lib.Vec<EventFilterBox>
}
/**
 * Codec of the structure.
 */
export const EventSubscriptionRequest: lib.CodecContainer<
  EventSubscriptionRequest
> = lib.defineCodec(
  lib.structCodec<EventSubscriptionRequest>(['filters'], {
    filters: lib.Vec.with(lib.getCodec(EventFilterBox)),
  }),
)

/**
 * Structure with named fields.
 */
export interface ExecuteTrigger {
  trigger: TriggerId
  args: lib.Json
}
/**
 * Codec of the structure.
 */
export const ExecuteTrigger: lib.CodecContainer<ExecuteTrigger> = lib
  .defineCodec(
    lib.structCodec<ExecuteTrigger>(['trigger', 'args'], {
      trigger: lib.getCodec(TriggerId),
      args: lib.getCodec(lib.Json),
    }),
  )

/**
 * Structure with named fields.
 */
export interface Executor {
  wasm: WasmSmartContract
}
/**
 * Codec of the structure.
 */
export const Executor: lib.CodecContainer<Executor> = lib.defineCodec(
  lib.structCodec<Executor>(['wasm'], {
    wasm: lib.getCodec(WasmSmartContract),
  }),
)

/**
 * Structure with named fields.
 */
export interface FindAccountsWithAsset {
  assetDefinition: lib.AssetDefinitionId
}
/**
 * Codec of the structure.
 */
export const FindAccountsWithAsset: lib.CodecContainer<FindAccountsWithAsset> = lib.defineCodec(
  lib.structCodec<FindAccountsWithAsset>(['assetDefinition'], {
    assetDefinition: lib.getCodec(lib.AssetDefinitionId),
  }),
)

/**
 * Structure with named fields.
 */
export interface FindPermissionsByAccountId {
  id: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const FindPermissionsByAccountId: lib.CodecContainer<
  FindPermissionsByAccountId
> = lib.defineCodec(
  lib.structCodec<FindPermissionsByAccountId>(['id'], {
    id: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface FindRolesByAccountId {
  id: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const FindRolesByAccountId: lib.CodecContainer<FindRolesByAccountId> = lib.defineCodec(
  lib.structCodec<FindRolesByAccountId>(['id'], {
    id: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface ForwardCursor {
  query: lib.String
  cursor: lib.NonZero<lib.U64>
}
/**
 * Codec of the structure.
 */
export const ForwardCursor: lib.CodecContainer<ForwardCursor> = lib.defineCodec(
  lib.structCodec<ForwardCursor>(['query', 'cursor'], {
    query: lib.getCodec(lib.String),
    cursor: lib.NonZero.with(lib.getCodec(lib.U64)),
  }),
)

/**
 * Structure with named fields.
 */
export interface GenesisWasmAction {
  executable: lib.String
  repeats: Repeats
  authority: lib.AccountId
  filter: EventFilterBox
}
/**
 * Codec of the structure.
 */
export const GenesisWasmAction: lib.CodecContainer<GenesisWasmAction> = lib
  .defineCodec(
    lib.structCodec<GenesisWasmAction>([
      'executable',
      'repeats',
      'authority',
      'filter',
    ], {
      executable: lib.getCodec(lib.String),
      repeats: lib.getCodec(Repeats),
      authority: lib.getCodec(lib.AccountId),
      filter: lib.getCodec(EventFilterBox),
    }),
  )

/**
 * Structure with named fields.
 */
export interface GenesisWasmTrigger {
  id: TriggerId
  action: GenesisWasmAction
}
/**
 * Codec of the structure.
 */
export const GenesisWasmTrigger: lib.CodecContainer<GenesisWasmTrigger> = lib
  .defineCodec(
    lib.structCodec<GenesisWasmTrigger>(['id', 'action'], {
      id: lib.getCodec(TriggerId),
      action: lib.getCodec(GenesisWasmAction),
    }),
  )

/**
 * Structure with named fields and generic parameters.
 */
export interface Grant<T0, T1> {
  object: T0
  destination: T1
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Grant = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
  ): lib.GenCodec<Grant<T0, T1>> =>
    lib.structCodec<Grant<T0, T1>>(['object', 'destination'], {
      object: t0,
      destination: t1,
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Permission`
 * - `Role`
 * - `RolePermission`
 *
 * TODO how to construct, how to use
 */
export type GrantBox =
  | lib.Variant<'Permission', Grant<Permission, lib.AccountId>>
  | lib.Variant<'Role', Grant<RoleId, lib.AccountId>>
  | lib.Variant<'RolePermission', Grant<Permission, RoleId>>
/**
 * Codec and constructors for enumeration {@link GrantBox}.
 */
export const GrantBox = {
  /**
   * Constructor of variant `GrantBox.Permission`
   */ Permission: <const T extends Grant<Permission, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }), /**
   * Constructor of variant `GrantBox.Role`
   */
  Role: <const T extends Grant<RoleId, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Role', T> => ({ kind: 'Role', value }), /**
   * Constructor of variant `GrantBox.RolePermission`
   */
  RolePermission: <const T extends Grant<Permission, RoleId>>(
    value: T,
  ): lib.Variant<'RolePermission', T> => ({ kind: 'RolePermission', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Permission: [Grant<Permission, lib.AccountId>]
        Role: [Grant<RoleId, lib.AccountId>]
        RolePermission: [Grant<Permission, RoleId>]
      }
    >({
      Permission: [
        0,
        Grant.with(lib.getCodec(Permission), lib.getCodec(lib.AccountId)),
      ],
      Role: [1, Grant.with(lib.getCodec(RoleId), lib.getCodec(lib.AccountId))],
      RolePermission: [
        2,
        Grant.with(lib.getCodec(Permission), lib.getCodec(RoleId)),
      ],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface NewDomain {
  id: lib.DomainId
  logo: lib.Option<IpfsPath>
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const NewDomain: lib.CodecContainer<NewDomain> = lib.defineCodec(
  lib.structCodec<NewDomain>(['id', 'logo', 'metadata'], {
    id: lib.getCodec(lib.DomainId),
    logo: lib.Option.with(lib.getCodec(IpfsPath)),
    metadata: lib.getCodec(Metadata),
  }),
)

/**
 * Structure with named fields.
 */
export interface NewAccount {
  id: lib.AccountId
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const NewAccount: lib.CodecContainer<NewAccount> = lib.defineCodec(
  lib.structCodec<NewAccount>(['id', 'metadata'], {
    id: lib.getCodec(lib.AccountId),
    metadata: lib.getCodec(Metadata),
  }),
)

/**
 * Structure with named fields.
 */
export interface NewAssetDefinition {
  id: lib.AssetDefinitionId
  type: AssetType
  mintable: Mintable
  logo: lib.Option<IpfsPath>
  metadata: Metadata
}
/**
 * Codec of the structure.
 */
export const NewAssetDefinition: lib.CodecContainer<NewAssetDefinition> = lib
  .defineCodec(
    lib.structCodec<NewAssetDefinition>([
      'id',
      'type',
      'mintable',
      'logo',
      'metadata',
    ], {
      id: lib.getCodec(lib.AssetDefinitionId),
      type: lib.getCodec(AssetType),
      mintable: lib.getCodec(Mintable),
      logo: lib.Option.with(lib.getCodec(IpfsPath)),
      metadata: lib.getCodec(Metadata),
    }),
  )

/**
 * Structure with named fields.
 */
export interface NewRole {
  inner: Role
  grantTo: lib.AccountId
}
/**
 * Codec of the structure.
 */
export const NewRole: lib.CodecContainer<NewRole> = lib.defineCodec(
  lib.structCodec<NewRole>(['inner', 'grantTo'], {
    inner: lib.getCodec(Role),
    grantTo: lib.getCodec(lib.AccountId),
  }),
)

/**
 * Structure with named fields.
 */
export interface Trigger {
  id: TriggerId
  action: Action
}
/**
 * Codec of the structure.
 */
export const Trigger: lib.CodecContainer<Trigger> = lib.defineCodec(
  lib.structCodec<Trigger>(['id', 'action'], {
    id: lib.getCodec(TriggerId),
    action: lib.getCodec(Action),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Peer`
 * - `Domain`
 * - `Account`
 * - `AssetDefinition`
 * - `Asset`
 * - `Role`
 * - `Trigger`
 *
 * TODO how to construct, how to use
 */
export type RegisterBox =
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Domain', NewDomain>
  | lib.Variant<'Account', NewAccount>
  | lib.Variant<'AssetDefinition', NewAssetDefinition>
  | lib.Variant<'Asset', Asset>
  | lib.Variant<'Role', NewRole>
  | lib.Variant<'Trigger', Trigger>
/**
 * Codec and constructors for enumeration {@link RegisterBox}.
 */
export const RegisterBox = {
  /**
   * Constructor of variant `RegisterBox.Peer`
   */ Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({
    kind: 'Peer',
    value,
  }), /**
   * Constructor of variant `RegisterBox.Domain`
   */
  Domain: <const T extends NewDomain>(value: T): lib.Variant<'Domain', T> => ({
    kind: 'Domain',
    value,
  }), /**
   * Constructor of variant `RegisterBox.Account`
   */
  Account: <const T extends NewAccount>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `RegisterBox.AssetDefinition`
   */
  AssetDefinition: <const T extends NewAssetDefinition>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `RegisterBox.Asset`
   */
  Asset: <const T extends Asset>(value: T): lib.Variant<'Asset', T> => ({
    kind: 'Asset',
    value,
  }), /**
   * Constructor of variant `RegisterBox.Role`
   */
  Role: <const T extends NewRole>(value: T): lib.Variant<'Role', T> => ({
    kind: 'Role',
    value,
  }), /**
   * Constructor of variant `RegisterBox.Trigger`
   */
  Trigger: <const T extends Trigger>(value: T): lib.Variant<'Trigger', T> => ({
    kind: 'Trigger',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Peer: [PeerId]
        Domain: [NewDomain]
        Account: [NewAccount]
        AssetDefinition: [NewAssetDefinition]
        Asset: [Asset]
        Role: [NewRole]
        Trigger: [Trigger]
      }
    >({
      Peer: [0, lib.getCodec(PeerId)],
      Domain: [1, lib.getCodec(NewDomain)],
      Account: [2, lib.getCodec(NewAccount)],
      AssetDefinition: [3, lib.getCodec(NewAssetDefinition)],
      Asset: [4, lib.getCodec(Asset)],
      Role: [5, lib.getCodec(NewRole)],
      Trigger: [6, lib.getCodec(Trigger)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Peer`
 * - `Domain`
 * - `Account`
 * - `AssetDefinition`
 * - `Asset`
 * - `Role`
 * - `Trigger`
 *
 * TODO how to construct, how to use
 */
export type UnregisterBox =
  | lib.Variant<'Peer', PeerId>
  | lib.Variant<'Domain', lib.DomainId>
  | lib.Variant<'Account', lib.AccountId>
  | lib.Variant<'AssetDefinition', lib.AssetDefinitionId>
  | lib.Variant<'Asset', lib.AssetId>
  | lib.Variant<'Role', RoleId>
  | lib.Variant<'Trigger', TriggerId>
/**
 * Codec and constructors for enumeration {@link UnregisterBox}.
 */
export const UnregisterBox = {
  /**
   * Constructor of variant `UnregisterBox.Peer`
   */ Peer: <const T extends PeerId>(value: T): lib.Variant<'Peer', T> => ({
    kind: 'Peer',
    value,
  }), /**
   * Constructor of variant `UnregisterBox.Domain`
   */
  Domain: <const T extends lib.DomainId>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `UnregisterBox.Account`
   */
  Account: <const T extends lib.AccountId>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `UnregisterBox.AssetDefinition`
   */
  AssetDefinition: <const T extends lib.AssetDefinitionId>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `UnregisterBox.Asset`
   */
  Asset: <const T extends lib.AssetId>(value: T): lib.Variant<'Asset', T> => ({
    kind: 'Asset',
    value,
  }), /**
   * Constructor of variant `UnregisterBox.Role`
   */
  Role: <const T extends RoleId>(value: T): lib.Variant<'Role', T> => ({
    kind: 'Role',
    value,
  }), /**
   * Constructor of variant `UnregisterBox.Trigger`
   */
  Trigger: <const T extends TriggerId>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Peer: [PeerId]
        Domain: [lib.DomainId]
        Account: [lib.AccountId]
        AssetDefinition: [lib.AssetDefinitionId]
        Asset: [lib.AssetId]
        Role: [RoleId]
        Trigger: [TriggerId]
      }
    >({
      Peer: [0, lib.getCodec(PeerId)],
      Domain: [1, lib.getCodec(lib.DomainId)],
      Account: [2, lib.getCodec(lib.AccountId)],
      AssetDefinition: [3, lib.getCodec(lib.AssetDefinitionId)],
      Asset: [4, lib.getCodec(lib.AssetId)],
      Role: [5, lib.getCodec(RoleId)],
      Trigger: [6, lib.getCodec(TriggerId)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface Mint<T0, T1> {
  object: T0
  destination: T1
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Mint = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
  ): lib.GenCodec<Mint<T0, T1>> =>
    lib.structCodec<Mint<T0, T1>>(['object', 'destination'], {
      object: t0,
      destination: t1,
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Asset`
 * - `TriggerRepetitions`
 *
 * TODO how to construct, how to use
 */
export type MintBox =
  | lib.Variant<'Asset', Mint<Numeric, lib.AssetId>>
  | lib.Variant<'TriggerRepetitions', Mint<lib.U32, TriggerId>>
/**
 * Codec and constructors for enumeration {@link MintBox}.
 */
export const MintBox = {
  /**
   * Constructor of variant `MintBox.Asset`
   */ Asset: <const T extends Mint<Numeric, lib.AssetId>>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `MintBox.TriggerRepetitions`
   */
  TriggerRepetitions: <const T extends Mint<lib.U32, TriggerId>>(
    value: T,
  ): lib.Variant<'TriggerRepetitions', T> => ({
    kind: 'TriggerRepetitions',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Asset: [Mint<Numeric, lib.AssetId>]
        TriggerRepetitions: [Mint<lib.U32, TriggerId>]
      }
    >({
      Asset: [0, Mint.with(lib.getCodec(Numeric), lib.getCodec(lib.AssetId))],
      TriggerRepetitions: [
        1,
        Mint.with(lib.getCodec(lib.U32), lib.getCodec(TriggerId)),
      ],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Domain`
 * - `AssetDefinition`
 * - `Asset`
 *
 * TODO how to construct, how to use
 */
export type TransferBox =
  | lib.Variant<'Domain', Transfer<lib.AccountId, lib.DomainId, lib.AccountId>>
  | lib.Variant<
    'AssetDefinition',
    Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>
  >
  | lib.Variant<'Asset', AssetTransferBox>
/**
 * Codec and constructors for enumeration {@link TransferBox}.
 */
export const TransferBox = {
  /**
   * Constructor of variant `TransferBox.Domain`
   */ Domain: <
    const T extends Transfer<lib.AccountId, lib.DomainId, lib.AccountId>,
  >(value: T): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `TransferBox.AssetDefinition`
   */
  AssetDefinition: <
    const T extends Transfer<
      lib.AccountId,
      lib.AssetDefinitionId,
      lib.AccountId
    >,
  >(value: T): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructors of nested enumerations under variant `TransferBox.Asset`
   */
  Asset: {
    /**
     * Constructor of variant `TransferBox.Asset.Numeric`
     */ Numeric: <
      const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>,
    >(value: T): lib.Variant<'Asset', lib.Variant<'Numeric', T>> => ({
      kind: 'Asset',
      value: AssetTransferBox.Numeric(value),
    }), /**
     * Constructor of variant `TransferBox.Asset.Store`
     */
    Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Asset', lib.Variant<'Store', T>> => ({
      kind: 'Asset',
      value: AssetTransferBox.Store(value),
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Domain: [Transfer<lib.AccountId, lib.DomainId, lib.AccountId>]
        AssetDefinition: [
          Transfer<lib.AccountId, lib.AssetDefinitionId, lib.AccountId>,
        ]
        Asset: [AssetTransferBox]
      }
    >({
      Domain: [
        0,
        Transfer.with(
          lib.getCodec(lib.AccountId),
          lib.getCodec(lib.DomainId),
          lib.getCodec(lib.AccountId),
        ),
      ],
      AssetDefinition: [
        1,
        Transfer.with(
          lib.getCodec(lib.AccountId),
          lib.getCodec(lib.AssetDefinitionId),
          lib.getCodec(lib.AccountId),
        ),
      ],
      Asset: [2, lib.getCodec(AssetTransferBox)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface SetKeyValue<T0> {
  object: T0
  key: lib.Name
  value: lib.Json
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const SetKeyValue = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0>(t0: lib.GenCodec<T0>): lib.GenCodec<SetKeyValue<T0>> =>
    lib.structCodec<SetKeyValue<T0>>(['object', 'key', 'value'], {
      object: t0,
      key: lib.getCodec(lib.Name),
      value: lib.getCodec(lib.Json),
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Domain`
 * - `Account`
 * - `AssetDefinition`
 * - `Asset`
 * - `Trigger`
 *
 * TODO how to construct, how to use
 */
export type SetKeyValueBox =
  | lib.Variant<'Domain', SetKeyValue<lib.DomainId>>
  | lib.Variant<'Account', SetKeyValue<lib.AccountId>>
  | lib.Variant<'AssetDefinition', SetKeyValue<lib.AssetDefinitionId>>
  | lib.Variant<'Asset', SetKeyValue<lib.AssetId>>
  | lib.Variant<'Trigger', SetKeyValue<TriggerId>>
/**
 * Codec and constructors for enumeration {@link SetKeyValueBox}.
 */
export const SetKeyValueBox = {
  /**
   * Constructor of variant `SetKeyValueBox.Domain`
   */ Domain: <const T extends SetKeyValue<lib.DomainId>>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `SetKeyValueBox.Account`
   */
  Account: <const T extends SetKeyValue<lib.AccountId>>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `SetKeyValueBox.AssetDefinition`
   */
  AssetDefinition: <const T extends SetKeyValue<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `SetKeyValueBox.Asset`
   */
  Asset: <const T extends SetKeyValue<lib.AssetId>>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `SetKeyValueBox.Trigger`
   */
  Trigger: <const T extends SetKeyValue<TriggerId>>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Domain: [SetKeyValue<lib.DomainId>]
        Account: [SetKeyValue<lib.AccountId>]
        AssetDefinition: [SetKeyValue<lib.AssetDefinitionId>]
        Asset: [SetKeyValue<lib.AssetId>]
        Trigger: [SetKeyValue<TriggerId>]
      }
    >({
      Domain: [0, SetKeyValue.with(lib.getCodec(lib.DomainId))],
      Account: [1, SetKeyValue.with(lib.getCodec(lib.AccountId))],
      AssetDefinition: [
        2,
        SetKeyValue.with(lib.getCodec(lib.AssetDefinitionId)),
      ],
      Asset: [3, SetKeyValue.with(lib.getCodec(lib.AssetId))],
      Trigger: [4, SetKeyValue.with(lib.getCodec(TriggerId))],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface RemoveKeyValue<T0> {
  object: T0
  key: lib.Name
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const RemoveKeyValue = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0>(t0: lib.GenCodec<T0>): lib.GenCodec<RemoveKeyValue<T0>> =>
    lib.structCodec<RemoveKeyValue<T0>>(['object', 'key'], {
      object: t0,
      key: lib.getCodec(lib.Name),
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Domain`
 * - `Account`
 * - `AssetDefinition`
 * - `Asset`
 * - `Trigger`
 *
 * TODO how to construct, how to use
 */
export type RemoveKeyValueBox =
  | lib.Variant<'Domain', RemoveKeyValue<lib.DomainId>>
  | lib.Variant<'Account', RemoveKeyValue<lib.AccountId>>
  | lib.Variant<'AssetDefinition', RemoveKeyValue<lib.AssetDefinitionId>>
  | lib.Variant<'Asset', RemoveKeyValue<lib.AssetId>>
  | lib.Variant<'Trigger', RemoveKeyValue<TriggerId>>
/**
 * Codec and constructors for enumeration {@link RemoveKeyValueBox}.
 */
export const RemoveKeyValueBox = {
  /**
   * Constructor of variant `RemoveKeyValueBox.Domain`
   */ Domain: <const T extends RemoveKeyValue<lib.DomainId>>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `RemoveKeyValueBox.Account`
   */
  Account: <const T extends RemoveKeyValue<lib.AccountId>>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `RemoveKeyValueBox.AssetDefinition`
   */
  AssetDefinition: <const T extends RemoveKeyValue<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `RemoveKeyValueBox.Asset`
   */
  Asset: <const T extends RemoveKeyValue<lib.AssetId>>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `RemoveKeyValueBox.Trigger`
   */
  Trigger: <const T extends RemoveKeyValue<TriggerId>>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Domain: [RemoveKeyValue<lib.DomainId>]
        Account: [RemoveKeyValue<lib.AccountId>]
        AssetDefinition: [RemoveKeyValue<lib.AssetDefinitionId>]
        Asset: [RemoveKeyValue<lib.AssetId>]
        Trigger: [RemoveKeyValue<TriggerId>]
      }
    >({
      Domain: [0, RemoveKeyValue.with(lib.getCodec(lib.DomainId))],
      Account: [1, RemoveKeyValue.with(lib.getCodec(lib.AccountId))],
      AssetDefinition: [
        2,
        RemoveKeyValue.with(lib.getCodec(lib.AssetDefinitionId)),
      ],
      Asset: [3, RemoveKeyValue.with(lib.getCodec(lib.AssetId))],
      Trigger: [4, RemoveKeyValue.with(lib.getCodec(TriggerId))],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface Revoke<T0, T1> {
  object: T0
  destination: T1
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const Revoke = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
  ): lib.GenCodec<Revoke<T0, T1>> =>
    lib.structCodec<Revoke<T0, T1>>(['object', 'destination'], {
      object: t0,
      destination: t1,
    }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Permission`
 * - `Role`
 * - `RolePermission`
 *
 * TODO how to construct, how to use
 */
export type RevokeBox =
  | lib.Variant<'Permission', Revoke<Permission, lib.AccountId>>
  | lib.Variant<'Role', Revoke<RoleId, lib.AccountId>>
  | lib.Variant<'RolePermission', Revoke<Permission, RoleId>>
/**
 * Codec and constructors for enumeration {@link RevokeBox}.
 */
export const RevokeBox = {
  /**
   * Constructor of variant `RevokeBox.Permission`
   */ Permission: <const T extends Revoke<Permission, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }), /**
   * Constructor of variant `RevokeBox.Role`
   */
  Role: <const T extends Revoke<RoleId, lib.AccountId>>(
    value: T,
  ): lib.Variant<'Role', T> => ({ kind: 'Role', value }), /**
   * Constructor of variant `RevokeBox.RolePermission`
   */
  RolePermission: <const T extends Revoke<Permission, RoleId>>(
    value: T,
  ): lib.Variant<'RolePermission', T> => ({ kind: 'RolePermission', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Permission: [Revoke<Permission, lib.AccountId>]
        Role: [Revoke<RoleId, lib.AccountId>]
        RolePermission: [Revoke<Permission, RoleId>]
      }
    >({
      Permission: [
        0,
        Revoke.with(lib.getCodec(Permission), lib.getCodec(lib.AccountId)),
      ],
      Role: [1, Revoke.with(lib.getCodec(RoleId), lib.getCodec(lib.AccountId))],
      RolePermission: [
        2,
        Revoke.with(lib.getCodec(Permission), lib.getCodec(RoleId)),
      ],
    }).discriminated(),
  ),
}

export type SetParameter = Parameter
export const SetParameter = Parameter

/**
 * Structure with named fields.
 */
export interface Upgrade {
  executor: Executor
}
/**
 * Codec of the structure.
 */
export const Upgrade: lib.CodecContainer<Upgrade> = lib.defineCodec(
  lib.structCodec<Upgrade>(['executor'], { executor: lib.getCodec(Executor) }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `TRACE`
 * - `DEBUG`
 * - `INFO`
 * - `WARN`
 * - `ERROR`
 *
 * TODO how to construct, how to use
 */
export type Level =
  | lib.VariantUnit<'TRACE'>
  | lib.VariantUnit<'DEBUG'>
  | lib.VariantUnit<'INFO'>
  | lib.VariantUnit<'WARN'>
  | lib.VariantUnit<'ERROR'>
/**
 * Codec and constructors for enumeration {@link Level}.
 */
export const Level = {
  /**
   * Value of variant `Level.TRACE`
   */ TRACE: Object.freeze<lib.VariantUnit<'TRACE'>>({ kind: 'TRACE' }), /**
   * Value of variant `Level.DEBUG`
   */
  DEBUG: Object.freeze<lib.VariantUnit<'DEBUG'>>({ kind: 'DEBUG' }), /**
   * Value of variant `Level.INFO`
   */
  INFO: Object.freeze<lib.VariantUnit<'INFO'>>({ kind: 'INFO' }), /**
   * Value of variant `Level.WARN`
   */
  WARN: Object.freeze<lib.VariantUnit<'WARN'>>({ kind: 'WARN' }), /**
   * Value of variant `Level.ERROR`
   */
  ERROR: Object.freeze<lib.VariantUnit<'ERROR'>>({ kind: 'ERROR' }),
  ...lib.defineCodec(
    lib.enumCodec<{ TRACE: []; DEBUG: []; INFO: []; WARN: []; ERROR: [] }>({
      TRACE: [0],
      DEBUG: [1],
      INFO: [2],
      WARN: [3],
      ERROR: [4],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Log {
  level: Level
  msg: lib.String
}
/**
 * Codec of the structure.
 */
export const Log: lib.CodecContainer<Log> = lib.defineCodec(
  lib.structCodec<Log>(['level', 'msg'], {
    level: lib.getCodec(Level),
    msg: lib.getCodec(lib.String),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Register`
 * - `Unregister`
 * - `Mint`
 * - `Burn`
 * - `Transfer`
 * - `SetKeyValue`
 * - `RemoveKeyValue`
 * - `Grant`
 * - `Revoke`
 * - `ExecuteTrigger`
 * - `SetParameter`
 * - `Upgrade`
 * - `Log`
 * - `Custom`
 *
 * TODO how to construct, how to use
 */
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
/**
 * Codec and constructors for enumeration {@link InstructionBox}.
 */
export const InstructionBox = {
  /**
   * Constructors of nested enumerations under variant `InstructionBox.Register`
   */ Register: {
    /**
     * Constructor of variant `InstructionBox.Register.Peer`
     */ Peer: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Peer', T>> => ({
      kind: 'Register',
      value: RegisterBox.Peer(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.Domain`
     */
    Domain: <const T extends NewDomain>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Domain', T>> => ({
      kind: 'Register',
      value: RegisterBox.Domain(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.Account`
     */
    Account: <const T extends NewAccount>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Account', T>> => ({
      kind: 'Register',
      value: RegisterBox.Account(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.AssetDefinition`
     */
    AssetDefinition: <const T extends NewAssetDefinition>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Register',
      value: RegisterBox.AssetDefinition(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.Asset`
     */
    Asset: <const T extends Asset>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Asset', T>> => ({
      kind: 'Register',
      value: RegisterBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.Role`
     */
    Role: <const T extends NewRole>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Role', T>> => ({
      kind: 'Register',
      value: RegisterBox.Role(value),
    }), /**
     * Constructor of variant `InstructionBox.Register.Trigger`
     */
    Trigger: <const T extends Trigger>(
      value: T,
    ): lib.Variant<'Register', lib.Variant<'Trigger', T>> => ({
      kind: 'Register',
      value: RegisterBox.Trigger(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Unregister`
   */
  Unregister: {
    /**
     * Constructor of variant `InstructionBox.Unregister.Peer`
     */ Peer: <const T extends PeerId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Peer', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Peer(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.Domain`
     */
    Domain: <const T extends lib.DomainId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Domain', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Domain(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.Account`
     */
    Account: <const T extends lib.AccountId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Account', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Account(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.AssetDefinition`
     */
    AssetDefinition: <const T extends lib.AssetDefinitionId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.AssetDefinition(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.Asset`
     */
    Asset: <const T extends lib.AssetId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Asset', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.Role`
     */
    Role: <const T extends RoleId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Role', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Role(value),
    }), /**
     * Constructor of variant `InstructionBox.Unregister.Trigger`
     */
    Trigger: <const T extends TriggerId>(
      value: T,
    ): lib.Variant<'Unregister', lib.Variant<'Trigger', T>> => ({
      kind: 'Unregister',
      value: UnregisterBox.Trigger(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Mint`
   */
  Mint: {
    /**
     * Constructor of variant `InstructionBox.Mint.Asset`
     */ Asset: <const T extends Mint<Numeric, lib.AssetId>>(
      value: T,
    ): lib.Variant<'Mint', lib.Variant<'Asset', T>> => ({
      kind: 'Mint',
      value: MintBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.Mint.TriggerRepetitions`
     */
    TriggerRepetitions: <const T extends Mint<lib.U32, TriggerId>>(
      value: T,
    ): lib.Variant<'Mint', lib.Variant<'TriggerRepetitions', T>> => ({
      kind: 'Mint',
      value: MintBox.TriggerRepetitions(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Burn`
   */
  Burn: {
    /**
     * Constructor of variant `InstructionBox.Burn.Asset`
     */ Asset: <const T extends Burn<Numeric, lib.AssetId>>(
      value: T,
    ): lib.Variant<'Burn', lib.Variant<'Asset', T>> => ({
      kind: 'Burn',
      value: BurnBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.Burn.TriggerRepetitions`
     */
    TriggerRepetitions: <const T extends Burn<lib.U32, TriggerId>>(
      value: T,
    ): lib.Variant<'Burn', lib.Variant<'TriggerRepetitions', T>> => ({
      kind: 'Burn',
      value: BurnBox.TriggerRepetitions(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Transfer`
   */
  Transfer: {
    /**
     * Constructor of variant `InstructionBox.Transfer.Domain`
     */ Domain: <
      const T extends Transfer<lib.AccountId, lib.DomainId, lib.AccountId>,
    >(value: T): lib.Variant<'Transfer', lib.Variant<'Domain', T>> => ({
      kind: 'Transfer',
      value: TransferBox.Domain(value),
    }), /**
     * Constructor of variant `InstructionBox.Transfer.AssetDefinition`
     */
    AssetDefinition: <
      const T extends Transfer<
        lib.AccountId,
        lib.AssetDefinitionId,
        lib.AccountId
      >,
    >(
      value: T,
    ): lib.Variant<'Transfer', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'Transfer',
      value: TransferBox.AssetDefinition(value),
    }), /**
     * Constructors of nested enumerations under variant `InstructionBox.Transfer.Asset`
     */
    Asset: {
      /**
       * Constructor of variant `InstructionBox.Transfer.Asset.Numeric`
       */ Numeric: <
        const T extends Transfer<lib.AssetId, Numeric, lib.AccountId>,
      >(
        value: T,
      ): lib.Variant<
        'Transfer',
        lib.Variant<'Asset', lib.Variant<'Numeric', T>>
      > => ({ kind: 'Transfer', value: TransferBox.Asset.Numeric(value) }), /**
       * Constructor of variant `InstructionBox.Transfer.Asset.Store`
       */
      Store: <const T extends Transfer<lib.AssetId, Metadata, lib.AccountId>>(
        value: T,
      ): lib.Variant<
        'Transfer',
        lib.Variant<'Asset', lib.Variant<'Store', T>>
      > => ({ kind: 'Transfer', value: TransferBox.Asset.Store(value) }),
    },
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.SetKeyValue`
   */
  SetKeyValue: {
    /**
     * Constructor of variant `InstructionBox.SetKeyValue.Domain`
     */ Domain: <const T extends SetKeyValue<lib.DomainId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Domain', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Domain(value),
    }), /**
     * Constructor of variant `InstructionBox.SetKeyValue.Account`
     */
    Account: <const T extends SetKeyValue<lib.AccountId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Account', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Account(value),
    }), /**
     * Constructor of variant `InstructionBox.SetKeyValue.AssetDefinition`
     */
    AssetDefinition: <const T extends SetKeyValue<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.AssetDefinition(value),
    }), /**
     * Constructor of variant `InstructionBox.SetKeyValue.Asset`
     */
    Asset: <const T extends SetKeyValue<lib.AssetId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Asset', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.SetKeyValue.Trigger`
     */
    Trigger: <const T extends SetKeyValue<TriggerId>>(
      value: T,
    ): lib.Variant<'SetKeyValue', lib.Variant<'Trigger', T>> => ({
      kind: 'SetKeyValue',
      value: SetKeyValueBox.Trigger(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.RemoveKeyValue`
   */
  RemoveKeyValue: {
    /**
     * Constructor of variant `InstructionBox.RemoveKeyValue.Domain`
     */ Domain: <const T extends RemoveKeyValue<lib.DomainId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Domain', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Domain(value),
    }), /**
     * Constructor of variant `InstructionBox.RemoveKeyValue.Account`
     */
    Account: <const T extends RemoveKeyValue<lib.AccountId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Account', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Account(value),
    }), /**
     * Constructor of variant `InstructionBox.RemoveKeyValue.AssetDefinition`
     */
    AssetDefinition: <const T extends RemoveKeyValue<lib.AssetDefinitionId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'AssetDefinition', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.AssetDefinition(value),
    }), /**
     * Constructor of variant `InstructionBox.RemoveKeyValue.Asset`
     */
    Asset: <const T extends RemoveKeyValue<lib.AssetId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Asset', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Asset(value),
    }), /**
     * Constructor of variant `InstructionBox.RemoveKeyValue.Trigger`
     */
    Trigger: <const T extends RemoveKeyValue<TriggerId>>(
      value: T,
    ): lib.Variant<'RemoveKeyValue', lib.Variant<'Trigger', T>> => ({
      kind: 'RemoveKeyValue',
      value: RemoveKeyValueBox.Trigger(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Grant`
   */
  Grant: {
    /**
     * Constructor of variant `InstructionBox.Grant.Permission`
     */ Permission: <const T extends Grant<Permission, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Grant', lib.Variant<'Permission', T>> => ({
      kind: 'Grant',
      value: GrantBox.Permission(value),
    }), /**
     * Constructor of variant `InstructionBox.Grant.Role`
     */
    Role: <const T extends Grant<RoleId, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Grant', lib.Variant<'Role', T>> => ({
      kind: 'Grant',
      value: GrantBox.Role(value),
    }), /**
     * Constructor of variant `InstructionBox.Grant.RolePermission`
     */
    RolePermission: <const T extends Grant<Permission, RoleId>>(
      value: T,
    ): lib.Variant<'Grant', lib.Variant<'RolePermission', T>> => ({
      kind: 'Grant',
      value: GrantBox.RolePermission(value),
    }),
  }, /**
   * Constructors of nested enumerations under variant `InstructionBox.Revoke`
   */
  Revoke: {
    /**
     * Constructor of variant `InstructionBox.Revoke.Permission`
     */ Permission: <const T extends Revoke<Permission, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Revoke', lib.Variant<'Permission', T>> => ({
      kind: 'Revoke',
      value: RevokeBox.Permission(value),
    }), /**
     * Constructor of variant `InstructionBox.Revoke.Role`
     */
    Role: <const T extends Revoke<RoleId, lib.AccountId>>(
      value: T,
    ): lib.Variant<'Revoke', lib.Variant<'Role', T>> => ({
      kind: 'Revoke',
      value: RevokeBox.Role(value),
    }), /**
     * Constructor of variant `InstructionBox.Revoke.RolePermission`
     */
    RolePermission: <const T extends Revoke<Permission, RoleId>>(
      value: T,
    ): lib.Variant<'Revoke', lib.Variant<'RolePermission', T>> => ({
      kind: 'Revoke',
      value: RevokeBox.RolePermission(value),
    }),
  }, /**
   * Constructor of variant `InstructionBox.ExecuteTrigger`
   */
  ExecuteTrigger: <const T extends ExecuteTrigger>(
    value: T,
  ): lib.Variant<'ExecuteTrigger', T> => ({
    kind: 'ExecuteTrigger',
    value,
  }), /**
   * Constructors of nested enumerations under variant `InstructionBox.SetParameter`
   */
  SetParameter: {
    /**
     * Constructors of nested enumerations under variant `InstructionBox.SetParameter.Sumeragi`
     */ Sumeragi: {
      /**
       * Constructor of variant `InstructionBox.SetParameter.Sumeragi.BlockTime`
       */ BlockTime: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Sumeragi', lib.Variant<'BlockTime', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.BlockTime(value),
      }), /**
       * Constructor of variant `InstructionBox.SetParameter.Sumeragi.CommitTime`
       */
      CommitTime: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Sumeragi', lib.Variant<'CommitTime', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.CommitTime(value),
      }), /**
       * Constructor of variant `InstructionBox.SetParameter.Sumeragi.MaxClockDrift`
       */
      MaxClockDrift: <const T extends lib.Duration>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Sumeragi', lib.Variant<'MaxClockDrift', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Sumeragi.MaxClockDrift(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `InstructionBox.SetParameter.Block`
     */
    Block: {
      /**
       * Constructor of variant `InstructionBox.SetParameter.Block.MaxTransactions`
       */ MaxTransactions: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Block', lib.Variant<'MaxTransactions', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Block.MaxTransactions(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `InstructionBox.SetParameter.Transaction`
     */
    Transaction: {
      /**
       * Constructor of variant `InstructionBox.SetParameter.Transaction.MaxInstructions`
       */ MaxInstructions: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Transaction', lib.Variant<'MaxInstructions', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Transaction.MaxInstructions(value),
      }), /**
       * Constructor of variant `InstructionBox.SetParameter.Transaction.SmartContractSize`
       */
      SmartContractSize: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Transaction', lib.Variant<'SmartContractSize', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Transaction.SmartContractSize(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `InstructionBox.SetParameter.SmartContract`
     */
    SmartContract: {
      /**
       * Constructor of variant `InstructionBox.SetParameter.SmartContract.Fuel`
       */ Fuel: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'SmartContract', lib.Variant<'Fuel', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.SmartContract.Fuel(value),
      }), /**
       * Constructor of variant `InstructionBox.SetParameter.SmartContract.Memory`
       */
      Memory: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'SmartContract', lib.Variant<'Memory', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.SmartContract.Memory(value),
      }),
    }, /**
     * Constructors of nested enumerations under variant `InstructionBox.SetParameter.Executor`
     */
    Executor: {
      /**
       * Constructor of variant `InstructionBox.SetParameter.Executor.Fuel`
       */ Fuel: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Executor', lib.Variant<'Fuel', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Executor.Fuel(value),
      }), /**
       * Constructor of variant `InstructionBox.SetParameter.Executor.Memory`
       */
      Memory: <const T extends lib.NonZero<lib.U64>>(
        value: T,
      ): lib.Variant<
        'SetParameter',
        lib.Variant<'Executor', lib.Variant<'Memory', T>>
      > => ({
        kind: 'SetParameter',
        value: SetParameter.Executor.Memory(value),
      }),
    }, /**
     * Constructor of variant `InstructionBox.SetParameter.Custom`
     */
    Custom: <const T extends CustomParameter>(
      value: T,
    ): lib.Variant<'SetParameter', lib.Variant<'Custom', T>> => ({
      kind: 'SetParameter',
      value: SetParameter.Custom(value),
    }),
  }, /**
   * Constructor of variant `InstructionBox.Upgrade`
   */
  Upgrade: <const T extends Upgrade>(value: T): lib.Variant<'Upgrade', T> => ({
    kind: 'Upgrade',
    value,
  }), /**
   * Constructor of variant `InstructionBox.Log`
   */
  Log: <const T extends Log>(value: T): lib.Variant<'Log', T> => ({
    kind: 'Log',
    value,
  }), /**
   * Constructor of variant `InstructionBox.Custom`
   */
  Custom: <const T extends CustomInstruction>(
    value: T,
  ): lib.Variant<'Custom', T> => ({ kind: 'Custom', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
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
      }
    >({
      Register: [0, lib.getCodec(RegisterBox)],
      Unregister: [1, lib.getCodec(UnregisterBox)],
      Mint: [2, lib.getCodec(MintBox)],
      Burn: [3, lib.getCodec(BurnBox)],
      Transfer: [4, lib.getCodec(TransferBox)],
      SetKeyValue: [5, lib.getCodec(SetKeyValueBox)],
      RemoveKeyValue: [6, lib.getCodec(RemoveKeyValueBox)],
      Grant: [7, lib.getCodec(GrantBox)],
      Revoke: [8, lib.getCodec(RevokeBox)],
      ExecuteTrigger: [9, lib.getCodec(ExecuteTrigger)],
      SetParameter: [10, lib.getCodec(SetParameter)],
      Upgrade: [11, lib.getCodec(Upgrade)],
      Log: [12, lib.getCodec(Log)],
      Custom: [13, lib.getCodec(CustomInstruction)],
    }).discriminated(),
  ),
}

export type Ipv4Addr = [lib.U8, lib.U8, lib.U8, lib.U8]
export const Ipv4Addr = lib.defineCodec(
  lib.tupleCodec([
    lib.getCodec(lib.U8),
    lib.getCodec(lib.U8),
    lib.getCodec(lib.U8),
    lib.getCodec(lib.U8),
  ]),
)

export type Ipv6Addr = [
  lib.U16,
  lib.U16,
  lib.U16,
  lib.U16,
  lib.U16,
  lib.U16,
  lib.U16,
  lib.U16,
]
export const Ipv6Addr = lib.defineCodec(
  lib.tupleCodec([
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
    lib.getCodec(lib.U16),
  ]),
)

/**
 * Structure with named fields.
 */
export interface MultisigApprove {
  account: lib.AccountId
  instructionsHash: lib.HashRepr
}
/**
 * Codec of the structure.
 */
export const MultisigApprove: lib.CodecContainer<MultisigApprove> = lib
  .defineCodec(
    lib.structCodec<MultisigApprove>(['account', 'instructionsHash'], {
      account: lib.getCodec(lib.AccountId),
      instructionsHash: lib.getCodec(lib.HashRepr),
    }),
  )

/**
 * Structure with named fields.
 */
export interface MultisigSpec {
  signatories: lib.BTreeMap<lib.AccountId, lib.U8>
  quorum: lib.NonZero<lib.U16>
  transactionTtl: lib.NonZero<lib.Duration>
}
/**
 * Codec of the structure.
 */
export const MultisigSpec: lib.CodecContainer<MultisigSpec> = lib.defineCodec(
  lib.structCodec<MultisigSpec>(['signatories', 'quorum', 'transactionTtl'], {
    signatories: lib.BTreeMap.with(
      lib.getCodec(lib.AccountId),
      lib.getCodec(lib.U8),
    ),
    quorum: lib.NonZero.with(lib.getCodec(lib.U16)),
    transactionTtl: lib.NonZero.with(lib.getCodec(lib.Duration)),
  }),
)

/**
 * Structure with named fields.
 */
export interface MultisigRegister {
  account: lib.AccountId
  spec: MultisigSpec
}
/**
 * Codec of the structure.
 */
export const MultisigRegister: lib.CodecContainer<MultisigRegister> = lib
  .defineCodec(
    lib.structCodec<MultisigRegister>(['account', 'spec'], {
      account: lib.getCodec(lib.AccountId),
      spec: lib.getCodec(MultisigSpec),
    }),
  )

/**
 * Structure with named fields.
 */
export interface MultisigPropose {
  account: lib.AccountId
  instructions: lib.Vec<InstructionBox>
  transactionTtl: lib.Option<lib.NonZero<lib.Duration>>
}
/**
 * Codec of the structure.
 */
export const MultisigPropose: lib.CodecContainer<MultisigPropose> = lib
  .defineCodec(
    lib.structCodec<MultisigPropose>([
      'account',
      'instructions',
      'transactionTtl',
    ], {
      account: lib.getCodec(lib.AccountId),
      instructions: lib.Vec.with(lib.lazyCodec(() => lib.getCodec(InstructionBox))),
      transactionTtl: lib.Option.with(
        lib.NonZero.with(lib.getCodec(lib.Duration)),
      ),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Register`
 * - `Propose`
 * - `Approve`
 *
 * TODO how to construct, how to use
 */
export type MultisigInstructionBox =
  | lib.Variant<'Register', MultisigRegister>
  | lib.Variant<'Propose', MultisigPropose>
  | lib.Variant<'Approve', MultisigApprove>
/**
 * Codec and constructors for enumeration {@link MultisigInstructionBox}.
 */
export const MultisigInstructionBox = {
  /**
   * Constructor of variant `MultisigInstructionBox.Register`
   */ Register: <const T extends MultisigRegister>(
    value: T,
  ): lib.Variant<'Register', T> => ({ kind: 'Register', value }), /**
   * Constructor of variant `MultisigInstructionBox.Propose`
   */
  Propose: <const T extends MultisigPropose>(
    value: T,
  ): lib.Variant<'Propose', T> => ({ kind: 'Propose', value }), /**
   * Constructor of variant `MultisigInstructionBox.Approve`
   */
  Approve: <const T extends MultisigApprove>(
    value: T,
  ): lib.Variant<'Approve', T> => ({ kind: 'Approve', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Register: [MultisigRegister]
        Propose: [MultisigPropose]
        Approve: [MultisigApprove]
      }
    >({
      Register: [0, lib.getCodec(MultisigRegister)],
      Propose: [1, lib.getCodec(MultisigPropose)],
      Approve: [2, lib.getCodec(MultisigApprove)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface MultisigProposalValue {
  instructions: lib.Vec<InstructionBox>
  proposedAt: lib.Timestamp
  expiresAt: lib.Timestamp
  approvals: lib.BTreeSet<lib.AccountId>
  isRelayed: lib.Option<lib.Bool>
}
/**
 * Codec of the structure.
 */
export const MultisigProposalValue: lib.CodecContainer<MultisigProposalValue> = lib.defineCodec(
  lib.structCodec<MultisigProposalValue>([
    'instructions',
    'proposedAt',
    'expiresAt',
    'approvals',
    'isRelayed',
  ], {
    instructions: lib.Vec.with(lib.lazyCodec(() => lib.getCodec(InstructionBox))),
    proposedAt: lib.getCodec(lib.Timestamp),
    expiresAt: lib.getCodec(lib.Timestamp),
    approvals: lib.BTreeSet.with(lib.getCodec(lib.AccountId)),
    isRelayed: lib.Option.with(lib.getCodec(lib.Bool)),
  }),
)

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type NumericPredicateAtom = never
/**
 * Codec for {@link NumericPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const NumericPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Structure with named fields.
 */
export interface SumeragiParameters {
  blockTime: lib.Duration
  commitTime: lib.Duration
  maxClockDrift: lib.Duration
}
/**
 * Codec of the structure.
 */
export const SumeragiParameters: lib.CodecContainer<SumeragiParameters> = lib
  .defineCodec(
    lib.structCodec<SumeragiParameters>([
      'blockTime',
      'commitTime',
      'maxClockDrift',
    ], {
      blockTime: lib.getCodec(lib.Duration),
      commitTime: lib.getCodec(lib.Duration),
      maxClockDrift: lib.getCodec(lib.Duration),
    }),
  )

/**
 * Structure with named fields.
 */
export interface TransactionParameters {
  maxInstructions: lib.NonZero<lib.U64>
  smartContractSize: lib.NonZero<lib.U64>
}
/**
 * Codec of the structure.
 */
export const TransactionParameters: lib.CodecContainer<TransactionParameters> = lib.defineCodec(
  lib.structCodec<TransactionParameters>([
    'maxInstructions',
    'smartContractSize',
  ], {
    maxInstructions: lib.NonZero.with(lib.getCodec(lib.U64)),
    smartContractSize: lib.NonZero.with(lib.getCodec(lib.U64)),
  }),
)

/**
 * Structure with named fields.
 */
export interface SmartContractParameters {
  fuel: lib.NonZero<lib.U64>
  memory: lib.NonZero<lib.U64>
}
/**
 * Codec of the structure.
 */
export const SmartContractParameters: lib.CodecContainer<
  SmartContractParameters
> = lib.defineCodec(
  lib.structCodec<SmartContractParameters>(['fuel', 'memory'], {
    fuel: lib.NonZero.with(lib.getCodec(lib.U64)),
    memory: lib.NonZero.with(lib.getCodec(lib.U64)),
  }),
)

/**
 * Structure with named fields.
 */
export interface Parameters {
  sumeragi: SumeragiParameters
  block: BlockParameters
  transaction: TransactionParameters
  executor: SmartContractParameters
  smartContract: SmartContractParameters
  custom: lib.BTreeMap<CustomParameterId, CustomParameter>
}
/**
 * Codec of the structure.
 */
export const Parameters: lib.CodecContainer<Parameters> = lib.defineCodec(
  lib.structCodec<Parameters>([
    'sumeragi',
    'block',
    'transaction',
    'executor',
    'smartContract',
    'custom',
  ], {
    sumeragi: lib.getCodec(SumeragiParameters),
    block: lib.getCodec(BlockParameters),
    transaction: lib.getCodec(TransactionParameters),
    executor: lib.getCodec(SmartContractParameters),
    smartContract: lib.getCodec(SmartContractParameters),
    custom: lib.BTreeMap.with(
      lib.getCodec(CustomParameterId),
      lib.getCodec(CustomParameter),
    ),
  }),
)

/**
 * Structure with named fields.
 */
export interface Pagination {
  limit: lib.Option<lib.NonZero<lib.U64>>
  offset: lib.U64
}
/**
 * Codec of the structure.
 */
export const Pagination: lib.CodecContainer<Pagination> = lib.defineCodec(
  lib.structCodec<Pagination>(['limit', 'offset'], {
    limit: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U64))),
    offset: lib.getCodec(lib.U64),
  }),
)

/**
 * Structure with named fields.
 */
export interface SocketAddrV4 {
  ip: Ipv4Addr
  port: lib.U16
}
/**
 * Codec of the structure.
 */
export const SocketAddrV4: lib.CodecContainer<SocketAddrV4> = lib.defineCodec(
  lib.structCodec<SocketAddrV4>(['ip', 'port'], {
    ip: lib.getCodec(Ipv4Addr),
    port: lib.getCodec(lib.U16),
  }),
)

/**
 * Structure with named fields.
 */
export interface SocketAddrV6 {
  ip: Ipv6Addr
  port: lib.U16
}
/**
 * Codec of the structure.
 */
export const SocketAddrV6: lib.CodecContainer<SocketAddrV6> = lib.defineCodec(
  lib.structCodec<SocketAddrV6>(['ip', 'port'], {
    ip: lib.getCodec(Ipv6Addr),
    port: lib.getCodec(lib.U16),
  }),
)

/**
 * Structure with named fields.
 */
export interface SocketAddrHost {
  host: lib.String
  port: lib.U16
}
/**
 * Codec of the structure.
 */
export const SocketAddrHost: lib.CodecContainer<SocketAddrHost> = lib
  .defineCodec(
    lib.structCodec<SocketAddrHost>(['host', 'port'], {
      host: lib.getCodec(lib.String),
      port: lib.getCodec(lib.U16),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Ipv4`
 * - `Ipv6`
 * - `Host`
 *
 * TODO how to construct, how to use
 */
export type SocketAddr =
  | lib.Variant<'Ipv4', SocketAddrV4>
  | lib.Variant<'Ipv6', SocketAddrV6>
  | lib.Variant<'Host', SocketAddrHost>
/**
 * Codec and constructors for enumeration {@link SocketAddr}.
 */
export const SocketAddr = {
  /**
   * Constructor of variant `SocketAddr.Ipv4`
   */ Ipv4: <const T extends SocketAddrV4>(
    value: T,
  ): lib.Variant<'Ipv4', T> => ({ kind: 'Ipv4', value }), /**
   * Constructor of variant `SocketAddr.Ipv6`
   */
  Ipv6: <const T extends SocketAddrV6>(value: T): lib.Variant<'Ipv6', T> => ({
    kind: 'Ipv6',
    value,
  }), /**
   * Constructor of variant `SocketAddr.Host`
   */
  Host: <const T extends SocketAddrHost>(value: T): lib.Variant<'Host', T> => ({
    kind: 'Host',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Ipv4: [SocketAddrV4]; Ipv6: [SocketAddrV6]; Host: [SocketAddrHost] }
    >({
      Ipv4: [0, lib.getCodec(SocketAddrV4)],
      Ipv6: [1, lib.getCodec(SocketAddrV6)],
      Host: [2, lib.getCodec(SocketAddrHost)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Peer {
  address: SocketAddr
  id: PeerId
}
/**
 * Codec of the structure.
 */
export const Peer: lib.CodecContainer<Peer> = lib.defineCodec(
  lib.structCodec<Peer>(['address', 'id'], {
    address: lib.getCodec(SocketAddr),
    id: lib.getCodec(PeerId),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `PublicKey`
 *
 * TODO how to construct, how to use
 */
export type PeerIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'PublicKey', PublicKeyProjectionSelector>
/**
 * Codec and constructors for enumeration {@link PeerIdProjectionSelector}.
 */
export const PeerIdProjectionSelector = {
  /**
   * Value of variant `PeerIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `PeerIdProjectionSelector.PublicKey`
   */
  PublicKey: {
    /**
     * Value of variant `PeerIdProjectionSelector.PublicKey.Atom`
     */ Atom: Object.freeze<lib.Variant<'PublicKey', lib.VariantUnit<'Atom'>>>({
      kind: 'PublicKey',
      value: PublicKeyProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; PublicKey: [PublicKeyProjectionSelector] }>({
      Atom: [0],
      PublicKey: [1, lib.getCodec(PublicKeyProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * This type could not be constructed.
 *
 * It is a enumeration without any variants that could be created _at this time_. However,
 * in future it is possible that this type will be extended with actual constructable variants.
 */
export type PermissionPredicateAtom = never
/**
 * Codec for {@link PermissionPredicateAtom}.
 *
 * Since the type is `never`, this codec does nothing and throws an error if actually called.
 */
export const PermissionPredicateAtom = lib.defineCodec(lib.neverCodec)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 *
 * TODO how to construct, how to use
 */
export type PermissionProjectionSelector = lib.VariantUnit<'Atom'>
/**
 * Codec and constructors for enumeration {@link PermissionProjectionSelector}.
 */
export const PermissionProjectionSelector = {
  /**
   * Value of variant `PermissionProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }),
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: [] }>({ Atom: [0] }).discriminated(),
  ),
}

/**
 * Structure with named fields and generic parameters.
 */
export interface QueryWithFilter<T0, T1, T2> {
  query: T0
  predicate: T1
  selector: T2
}
/**
 * Codec constructor for the structure with generic parameters.
 */
export const QueryWithFilter = {
  /**
   * Create a codec with the actual codecs for generic parameters.
   */
  with: <T0, T1, T2>(
    t0: lib.GenCodec<T0>,
    t1: lib.GenCodec<T1>,
    t2: lib.GenCodec<T2>,
  ): lib.GenCodec<QueryWithFilter<T0, T1, T2>> =>
    lib.structCodec<QueryWithFilter<T0, T1, T2>>([
      'query',
      'predicate',
      'selector',
    ], { query: t0, predicate: t1, selector: t2 }),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type RoleIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Name', NameProjectionSelector>
/**
 * Codec and constructors for enumeration {@link RoleIdProjectionSelector}.
 */
export const RoleIdProjectionSelector = {
  /**
   * Value of variant `RoleIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `RoleIdProjectionSelector.Name`
   */
  Name: {
    /**
     * Value of variant `RoleIdProjectionSelector.Name.Atom`
     */ Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>({
      Atom: [0],
      Name: [1, lib.getCodec(NameProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 *
 * TODO how to construct, how to use
 */
export type RoleProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', RoleIdProjectionSelector>
/**
 * Codec and constructors for enumeration {@link RoleProjectionSelector}.
 */
export const RoleProjectionSelector = {
  /**
   * Value of variant `RoleProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `RoleProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `RoleProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: RoleIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `RoleProjectionSelector.Id.Name`
     */
    Name: {
      /**
       * Value of variant `RoleProjectionSelector.Id.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: RoleIdProjectionSelector.Name.Atom }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Id: [RoleIdProjectionSelector] }>({
      Atom: [0],
      Id: [1, lib.getCodec(RoleIdProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Name`
 *
 * TODO how to construct, how to use
 */
export type TriggerIdProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Name', NameProjectionSelector>
/**
 * Codec and constructors for enumeration {@link TriggerIdProjectionSelector}.
 */
export const TriggerIdProjectionSelector = {
  /**
   * Value of variant `TriggerIdProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `TriggerIdProjectionSelector.Name`
   */
  Name: {
    /**
     * Value of variant `TriggerIdProjectionSelector.Name.Atom`
     */ Atom: Object.freeze<lib.Variant<'Name', lib.VariantUnit<'Atom'>>>({
      kind: 'Name',
      value: NameProjectionSelector.Atom,
    }),
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Name: [NameProjectionSelector] }>({
      Atom: [0],
      Name: [1, lib.getCodec(NameProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Id`
 * - `Action`
 *
 * TODO how to construct, how to use
 */
export type TriggerProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Id', TriggerIdProjectionSelector>
  | lib.Variant<'Action', ActionProjectionSelector>
/**
 * Codec and constructors for enumeration {@link TriggerProjectionSelector}.
 */
export const TriggerProjectionSelector = {
  /**
   * Value of variant `TriggerProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `TriggerProjectionSelector.Id`
   */
  Id: {
    /**
     * Value of variant `TriggerProjectionSelector.Id.Atom`
     */ Atom: Object.freeze<lib.Variant<'Id', lib.VariantUnit<'Atom'>>>({
      kind: 'Id',
      value: TriggerIdProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `TriggerProjectionSelector.Id.Name`
     */
    Name: {
      /**
       * Value of variant `TriggerProjectionSelector.Id.Name.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Id', lib.Variant<'Name', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Id', value: TriggerIdProjectionSelector.Name.Atom }),
    },
  }, /**
   * Constructors of nested enumerations under variant `TriggerProjectionSelector.Action`
   */
  Action: {
    /**
     * Value of variant `TriggerProjectionSelector.Action.Atom`
     */ Atom: Object.freeze<lib.Variant<'Action', lib.VariantUnit<'Atom'>>>({
      kind: 'Action',
      value: ActionProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `TriggerProjectionSelector.Action.Metadata`
     */
    Metadata: {
      /**
       * Value of variant `TriggerProjectionSelector.Action.Metadata.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Action', lib.Variant<'Metadata', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Action', value: ActionProjectionSelector.Metadata.Atom }), /**
       * Constructor of variant `TriggerProjectionSelector.Action.Metadata.Key`
       */
      Key: <const T extends MetadataKeyProjectionSelector>(
        value: T,
      ): lib.Variant<
        'Action',
        lib.Variant<'Metadata', lib.Variant<'Key', T>>
      > => ({
        kind: 'Action',
        value: ActionProjectionSelector.Metadata.Key(value),
      }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Atom: []
        Id: [TriggerIdProjectionSelector]
        Action: [ActionProjectionSelector]
      }
    >({
      Atom: [0],
      Id: [1, lib.getCodec(TriggerIdProjectionSelector)],
      Action: [2, lib.getCodec(ActionProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Atom`
 * - `Header`
 *
 * TODO how to construct, how to use
 */
export type SignedBlockProjectionSelector =
  | lib.VariantUnit<'Atom'>
  | lib.Variant<'Header', BlockHeaderProjectionSelector>
/**
 * Codec and constructors for enumeration {@link SignedBlockProjectionSelector}.
 */
export const SignedBlockProjectionSelector = {
  /**
   * Value of variant `SignedBlockProjectionSelector.Atom`
   */ Atom: Object.freeze<lib.VariantUnit<'Atom'>>({ kind: 'Atom' }), /**
   * Constructors of nested enumerations under variant `SignedBlockProjectionSelector.Header`
   */
  Header: {
    /**
     * Value of variant `SignedBlockProjectionSelector.Header.Atom`
     */ Atom: Object.freeze<lib.Variant<'Header', lib.VariantUnit<'Atom'>>>({
      kind: 'Header',
      value: BlockHeaderProjectionSelector.Atom,
    }), /**
     * Constructors of nested enumerations under variant `SignedBlockProjectionSelector.Header.Hash`
     */
    Hash: {
      /**
       * Value of variant `SignedBlockProjectionSelector.Header.Hash.Atom`
       */ Atom: Object.freeze<
        lib.Variant<'Header', lib.Variant<'Hash', lib.VariantUnit<'Atom'>>>
      >({ kind: 'Header', value: BlockHeaderProjectionSelector.Hash.Atom }),
    },
  },
  ...lib.defineCodec(
    lib.enumCodec<{ Atom: []; Header: [BlockHeaderProjectionSelector] }>({
      Atom: [0],
      Header: [1, lib.getCodec(BlockHeaderProjectionSelector)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `FindDomains`
 * - `FindAccounts`
 * - `FindAssets`
 * - `FindAssetsDefinitions`
 * - `FindRoles`
 * - `FindRoleIds`
 * - `FindPermissionsByAccountId`
 * - `FindRolesByAccountId`
 * - `FindAccountsWithAsset`
 * - `FindPeers`
 * - `FindActiveTriggerIds`
 * - `FindTriggers`
 * - `FindTransactions`
 * - `FindBlocks`
 * - `FindBlockHeaders`
 *
 * TODO how to construct, how to use
 */
export type QueryBox =
  | lib.Variant<
    'FindDomains',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<DomainProjectionPredicate>,
      lib.Vec<DomainProjectionSelector>
    >
  >
  | lib.Variant<
    'FindAccounts',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >
  >
  | lib.Variant<
    'FindAssets',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetProjectionPredicate>,
      lib.Vec<AssetProjectionSelector>
    >
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
    QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleProjectionPredicate>,
      lib.Vec<RoleProjectionSelector>
    >
  >
  | lib.Variant<
    'FindRoleIds',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >
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
    QueryWithFilter<
      null,
      lib.CompoundPredicate<PeerIdProjectionPredicate>,
      lib.Vec<PeerIdProjectionSelector>
    >
  >
  | lib.Variant<
    'FindActiveTriggerIds',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerIdProjectionPredicate>,
      lib.Vec<TriggerIdProjectionSelector>
    >
  >
  | lib.Variant<
    'FindTriggers',
    QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerProjectionPredicate>,
      lib.Vec<TriggerProjectionSelector>
    >
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
/**
 * Codec and constructors for enumeration {@link QueryBox}.
 */
export const QueryBox = {
  /**
   * Constructor of variant `QueryBox.FindDomains`
   */ FindDomains: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<DomainProjectionPredicate>,
      lib.Vec<DomainProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindDomains', T> => ({
    kind: 'FindDomains',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindAccounts`
   */
  FindAccounts: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindAccounts', T> => ({
    kind: 'FindAccounts',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindAssets`
   */
  FindAssets: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetProjectionPredicate>,
      lib.Vec<AssetProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindAssets', T> => ({
    kind: 'FindAssets',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindAssetsDefinitions`
   */
  FindAssetsDefinitions: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
      lib.Vec<AssetDefinitionProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindAssetsDefinitions', T> => ({
    kind: 'FindAssetsDefinitions',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindRoles`
   */
  FindRoles: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleProjectionPredicate>,
      lib.Vec<RoleProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindRoles', T> => ({
    kind: 'FindRoles',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindRoleIds`
   */
  FindRoleIds: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindRoleIds', T> => ({
    kind: 'FindRoleIds',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindPermissionsByAccountId`
   */
  FindPermissionsByAccountId: <
    const T extends QueryWithFilter<
      FindPermissionsByAccountId,
      lib.CompoundPredicate<PermissionProjectionPredicate>,
      lib.Vec<PermissionProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindPermissionsByAccountId', T> => ({
    kind: 'FindPermissionsByAccountId',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindRolesByAccountId`
   */
  FindRolesByAccountId: <
    const T extends QueryWithFilter<
      FindRolesByAccountId,
      lib.CompoundPredicate<RoleIdProjectionPredicate>,
      lib.Vec<RoleIdProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindRolesByAccountId', T> => ({
    kind: 'FindRolesByAccountId',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindAccountsWithAsset`
   */
  FindAccountsWithAsset: <
    const T extends QueryWithFilter<
      FindAccountsWithAsset,
      lib.CompoundPredicate<AccountProjectionPredicate>,
      lib.Vec<AccountProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindAccountsWithAsset', T> => ({
    kind: 'FindAccountsWithAsset',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindPeers`
   */
  FindPeers: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<PeerIdProjectionPredicate>,
      lib.Vec<PeerIdProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindPeers', T> => ({
    kind: 'FindPeers',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindActiveTriggerIds`
   */
  FindActiveTriggerIds: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerIdProjectionPredicate>,
      lib.Vec<TriggerIdProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindActiveTriggerIds', T> => ({
    kind: 'FindActiveTriggerIds',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindTriggers`
   */
  FindTriggers: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<TriggerProjectionPredicate>,
      lib.Vec<TriggerProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindTriggers', T> => ({
    kind: 'FindTriggers',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindTransactions`
   */
  FindTransactions: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<CommittedTransactionProjectionPredicate>,
      lib.Vec<CommittedTransactionProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindTransactions', T> => ({
    kind: 'FindTransactions',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindBlocks`
   */
  FindBlocks: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<SignedBlockProjectionPredicate>,
      lib.Vec<SignedBlockProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindBlocks', T> => ({
    kind: 'FindBlocks',
    value,
  }), /**
   * Constructor of variant `QueryBox.FindBlockHeaders`
   */
  FindBlockHeaders: <
    const T extends QueryWithFilter<
      null,
      lib.CompoundPredicate<BlockHeaderProjectionPredicate>,
      lib.Vec<BlockHeaderProjectionSelector>
    >,
  >(value: T): lib.Variant<'FindBlockHeaders', T> => ({
    kind: 'FindBlockHeaders',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        FindDomains: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<DomainProjectionPredicate>,
            lib.Vec<DomainProjectionSelector>
          >,
        ]
        FindAccounts: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<AccountProjectionPredicate>,
            lib.Vec<AccountProjectionSelector>
          >,
        ]
        FindAssets: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<AssetProjectionPredicate>,
            lib.Vec<AssetProjectionSelector>
          >,
        ]
        FindAssetsDefinitions: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<AssetDefinitionProjectionPredicate>,
            lib.Vec<AssetDefinitionProjectionSelector>
          >,
        ]
        FindRoles: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<RoleProjectionPredicate>,
            lib.Vec<RoleProjectionSelector>
          >,
        ]
        FindRoleIds: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<RoleIdProjectionPredicate>,
            lib.Vec<RoleIdProjectionSelector>
          >,
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
          QueryWithFilter<
            null,
            lib.CompoundPredicate<PeerIdProjectionPredicate>,
            lib.Vec<PeerIdProjectionSelector>
          >,
        ]
        FindActiveTriggerIds: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<TriggerIdProjectionPredicate>,
            lib.Vec<TriggerIdProjectionSelector>
          >,
        ]
        FindTriggers: [
          QueryWithFilter<
            null,
            lib.CompoundPredicate<TriggerProjectionPredicate>,
            lib.Vec<TriggerProjectionSelector>
          >,
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
      }
    >({
      FindDomains: [
        0,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(DomainProjectionPredicate)),
          lib.Vec.with(lib.getCodec(DomainProjectionSelector)),
        ),
      ],
      FindAccounts: [
        1,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(AccountProjectionPredicate)),
          lib.Vec.with(lib.getCodec(AccountProjectionSelector)),
        ),
      ],
      FindAssets: [
        2,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(AssetProjectionPredicate)),
          lib.Vec.with(lib.getCodec(AssetProjectionSelector)),
        ),
      ],
      FindAssetsDefinitions: [
        3,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(
            lib.getCodec(AssetDefinitionProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(AssetDefinitionProjectionSelector)),
        ),
      ],
      FindRoles: [
        4,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(RoleProjectionPredicate)),
          lib.Vec.with(lib.getCodec(RoleProjectionSelector)),
        ),
      ],
      FindRoleIds: [
        5,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(RoleIdProjectionPredicate)),
          lib.Vec.with(lib.getCodec(RoleIdProjectionSelector)),
        ),
      ],
      FindPermissionsByAccountId: [
        6,
        QueryWithFilter.with(
          lib.getCodec(FindPermissionsByAccountId),
          lib.CompoundPredicate.with(
            lib.getCodec(PermissionProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(PermissionProjectionSelector)),
        ),
      ],
      FindRolesByAccountId: [
        7,
        QueryWithFilter.with(
          lib.getCodec(FindRolesByAccountId),
          lib.CompoundPredicate.with(lib.getCodec(RoleIdProjectionPredicate)),
          lib.Vec.with(lib.getCodec(RoleIdProjectionSelector)),
        ),
      ],
      FindAccountsWithAsset: [
        8,
        QueryWithFilter.with(
          lib.getCodec(FindAccountsWithAsset),
          lib.CompoundPredicate.with(lib.getCodec(AccountProjectionPredicate)),
          lib.Vec.with(lib.getCodec(AccountProjectionSelector)),
        ),
      ],
      FindPeers: [
        9,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(PeerIdProjectionPredicate)),
          lib.Vec.with(lib.getCodec(PeerIdProjectionSelector)),
        ),
      ],
      FindActiveTriggerIds: [
        10,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(
            lib.getCodec(TriggerIdProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(TriggerIdProjectionSelector)),
        ),
      ],
      FindTriggers: [
        11,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(lib.getCodec(TriggerProjectionPredicate)),
          lib.Vec.with(lib.getCodec(TriggerProjectionSelector)),
        ),
      ],
      FindTransactions: [
        12,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(
            lib.getCodec(CommittedTransactionProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(CommittedTransactionProjectionSelector)),
        ),
      ],
      FindBlocks: [
        13,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(
            lib.getCodec(SignedBlockProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(SignedBlockProjectionSelector)),
        ),
      ],
      FindBlockHeaders: [
        14,
        QueryWithFilter.with(
          lib.nullCodec,
          lib.CompoundPredicate.with(
            lib.getCodec(BlockHeaderProjectionPredicate),
          ),
          lib.Vec.with(lib.getCodec(BlockHeaderProjectionSelector)),
        ),
      ],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `PublicKey`
 * - `String`
 * - `Metadata`
 * - `Json`
 * - `Numeric`
 * - `Name`
 * - `DomainId`
 * - `Domain`
 * - `AccountId`
 * - `Account`
 * - `AssetId`
 * - `Asset`
 * - `AssetValue`
 * - `AssetDefinitionId`
 * - `AssetDefinition`
 * - `Role`
 * - `Parameter`
 * - `Permission`
 * - `CommittedTransaction`
 * - `SignedTransaction`
 * - `TransactionHash`
 * - `TransactionRejectionReason`
 * - `Peer`
 * - `RoleId`
 * - `TriggerId`
 * - `Trigger`
 * - `Action`
 * - `Block`
 * - `BlockHeader`
 * - `BlockHeaderHash`
 *
 * TODO how to construct, how to use
 */
export type QueryOutputBatchBox =
  | lib.Variant<'PublicKey', lib.Vec<lib.PublicKeyRepr>>
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
  | lib.Variant<'TransactionHash', lib.Vec<lib.HashRepr>>
  | lib.Variant<
    'TransactionRejectionReason',
    lib.Vec<lib.Option<TransactionRejectionReason>>
  >
  | lib.Variant<'Peer', lib.Vec<PeerId>>
  | lib.Variant<'RoleId', lib.Vec<RoleId>>
  | lib.Variant<'TriggerId', lib.Vec<TriggerId>>
  | lib.Variant<'Trigger', lib.Vec<Trigger>>
  | lib.Variant<'Action', lib.Vec<Action>>
  | lib.Variant<'Block', lib.Vec<SignedBlock>>
  | lib.Variant<'BlockHeader', lib.Vec<BlockHeader>>
  | lib.Variant<'BlockHeaderHash', lib.Vec<lib.HashRepr>>
/**
 * Codec and constructors for enumeration {@link QueryOutputBatchBox}.
 */
export const QueryOutputBatchBox = {
  /**
   * Constructor of variant `QueryOutputBatchBox.PublicKey`
   */ PublicKey: <const T extends lib.Vec<lib.PublicKeyRepr>>(
    value: T,
  ): lib.Variant<'PublicKey', T> => ({ kind: 'PublicKey', value }), /**
   * Constructor of variant `QueryOutputBatchBox.String`
   */
  String: <const T extends lib.Vec<lib.String>>(
    value: T,
  ): lib.Variant<'String', T> => ({ kind: 'String', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Metadata`
   */
  Metadata: <const T extends lib.Vec<Metadata>>(
    value: T,
  ): lib.Variant<'Metadata', T> => ({ kind: 'Metadata', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Json`
   */
  Json: <const T extends lib.Vec<lib.Json>>(
    value: T,
  ): lib.Variant<'Json', T> => ({ kind: 'Json', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Numeric`
   */
  Numeric: <const T extends lib.Vec<Numeric>>(
    value: T,
  ): lib.Variant<'Numeric', T> => ({ kind: 'Numeric', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Name`
   */
  Name: <const T extends lib.Vec<lib.Name>>(
    value: T,
  ): lib.Variant<'Name', T> => ({ kind: 'Name', value }), /**
   * Constructor of variant `QueryOutputBatchBox.DomainId`
   */
  DomainId: <const T extends lib.Vec<lib.DomainId>>(
    value: T,
  ): lib.Variant<'DomainId', T> => ({ kind: 'DomainId', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Domain`
   */
  Domain: <const T extends lib.Vec<Domain>>(
    value: T,
  ): lib.Variant<'Domain', T> => ({ kind: 'Domain', value }), /**
   * Constructor of variant `QueryOutputBatchBox.AccountId`
   */
  AccountId: <const T extends lib.Vec<lib.AccountId>>(
    value: T,
  ): lib.Variant<'AccountId', T> => ({ kind: 'AccountId', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Account`
   */
  Account: <const T extends lib.Vec<Account>>(
    value: T,
  ): lib.Variant<'Account', T> => ({ kind: 'Account', value }), /**
   * Constructor of variant `QueryOutputBatchBox.AssetId`
   */
  AssetId: <const T extends lib.Vec<lib.AssetId>>(
    value: T,
  ): lib.Variant<'AssetId', T> => ({ kind: 'AssetId', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Asset`
   */
  Asset: <const T extends lib.Vec<Asset>>(
    value: T,
  ): lib.Variant<'Asset', T> => ({ kind: 'Asset', value }), /**
   * Constructor of variant `QueryOutputBatchBox.AssetValue`
   */
  AssetValue: <const T extends lib.Vec<AssetValue>>(
    value: T,
  ): lib.Variant<'AssetValue', T> => ({ kind: 'AssetValue', value }), /**
   * Constructor of variant `QueryOutputBatchBox.AssetDefinitionId`
   */
  AssetDefinitionId: <const T extends lib.Vec<lib.AssetDefinitionId>>(
    value: T,
  ): lib.Variant<'AssetDefinitionId', T> => ({
    kind: 'AssetDefinitionId',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.AssetDefinition`
   */
  AssetDefinition: <const T extends lib.Vec<AssetDefinition>>(
    value: T,
  ): lib.Variant<'AssetDefinition', T> => ({
    kind: 'AssetDefinition',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.Role`
   */
  Role: <const T extends lib.Vec<Role>>(value: T): lib.Variant<'Role', T> => ({
    kind: 'Role',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.Parameter`
   */
  Parameter: <const T extends lib.Vec<Parameter>>(
    value: T,
  ): lib.Variant<'Parameter', T> => ({ kind: 'Parameter', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Permission`
   */
  Permission: <const T extends lib.Vec<Permission>>(
    value: T,
  ): lib.Variant<'Permission', T> => ({ kind: 'Permission', value }), /**
   * Constructor of variant `QueryOutputBatchBox.CommittedTransaction`
   */
  CommittedTransaction: <const T extends lib.Vec<CommittedTransaction>>(
    value: T,
  ): lib.Variant<'CommittedTransaction', T> => ({
    kind: 'CommittedTransaction',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.SignedTransaction`
   */
  SignedTransaction: <const T extends lib.Vec<SignedTransaction>>(
    value: T,
  ): lib.Variant<'SignedTransaction', T> => ({
    kind: 'SignedTransaction',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.TransactionHash`
   */
  TransactionHash: <const T extends lib.Vec<lib.HashRepr>>(
    value: T,
  ): lib.Variant<'TransactionHash', T> => ({
    kind: 'TransactionHash',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.TransactionRejectionReason`
   */
  TransactionRejectionReason: <
    const T extends lib.Vec<lib.Option<TransactionRejectionReason>>,
  >(value: T): lib.Variant<'TransactionRejectionReason', T> => ({
    kind: 'TransactionRejectionReason',
    value,
  }), /**
   * Constructor of variant `QueryOutputBatchBox.Peer`
   */
  Peer: <const T extends lib.Vec<PeerId>>(
    value: T,
  ): lib.Variant<'Peer', T> => ({ kind: 'Peer', value }), /**
   * Constructor of variant `QueryOutputBatchBox.RoleId`
   */
  RoleId: <const T extends lib.Vec<RoleId>>(
    value: T,
  ): lib.Variant<'RoleId', T> => ({ kind: 'RoleId', value }), /**
   * Constructor of variant `QueryOutputBatchBox.TriggerId`
   */
  TriggerId: <const T extends lib.Vec<TriggerId>>(
    value: T,
  ): lib.Variant<'TriggerId', T> => ({ kind: 'TriggerId', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Trigger`
   */
  Trigger: <const T extends lib.Vec<Trigger>>(
    value: T,
  ): lib.Variant<'Trigger', T> => ({ kind: 'Trigger', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Action`
   */
  Action: <const T extends lib.Vec<Action>>(
    value: T,
  ): lib.Variant<'Action', T> => ({ kind: 'Action', value }), /**
   * Constructor of variant `QueryOutputBatchBox.Block`
   */
  Block: <const T extends lib.Vec<SignedBlock>>(
    value: T,
  ): lib.Variant<'Block', T> => ({ kind: 'Block', value }), /**
   * Constructor of variant `QueryOutputBatchBox.BlockHeader`
   */
  BlockHeader: <const T extends lib.Vec<BlockHeader>>(
    value: T,
  ): lib.Variant<'BlockHeader', T> => ({ kind: 'BlockHeader', value }), /**
   * Constructor of variant `QueryOutputBatchBox.BlockHeaderHash`
   */
  BlockHeaderHash: <const T extends lib.Vec<lib.HashRepr>>(
    value: T,
  ): lib.Variant<'BlockHeaderHash', T> => ({ kind: 'BlockHeaderHash', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        PublicKey: [lib.Vec<lib.PublicKeyRepr>]
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
        TransactionHash: [lib.Vec<lib.HashRepr>]
        TransactionRejectionReason: [
          lib.Vec<lib.Option<TransactionRejectionReason>>,
        ]
        Peer: [lib.Vec<PeerId>]
        RoleId: [lib.Vec<RoleId>]
        TriggerId: [lib.Vec<TriggerId>]
        Trigger: [lib.Vec<Trigger>]
        Action: [lib.Vec<Action>]
        Block: [lib.Vec<SignedBlock>]
        BlockHeader: [lib.Vec<BlockHeader>]
        BlockHeaderHash: [lib.Vec<lib.HashRepr>]
      }
    >({
      PublicKey: [0, lib.Vec.with(lib.getCodec(lib.PublicKeyRepr))],
      String: [1, lib.Vec.with(lib.getCodec(lib.String))],
      Metadata: [2, lib.Vec.with(lib.getCodec(Metadata))],
      Json: [3, lib.Vec.with(lib.getCodec(lib.Json))],
      Numeric: [4, lib.Vec.with(lib.getCodec(Numeric))],
      Name: [5, lib.Vec.with(lib.getCodec(lib.Name))],
      DomainId: [6, lib.Vec.with(lib.getCodec(lib.DomainId))],
      Domain: [7, lib.Vec.with(lib.getCodec(Domain))],
      AccountId: [8, lib.Vec.with(lib.getCodec(lib.AccountId))],
      Account: [9, lib.Vec.with(lib.getCodec(Account))],
      AssetId: [10, lib.Vec.with(lib.getCodec(lib.AssetId))],
      Asset: [11, lib.Vec.with(lib.getCodec(Asset))],
      AssetValue: [12, lib.Vec.with(lib.getCodec(AssetValue))],
      AssetDefinitionId: [
        13,
        lib.Vec.with(lib.getCodec(lib.AssetDefinitionId)),
      ],
      AssetDefinition: [14, lib.Vec.with(lib.getCodec(AssetDefinition))],
      Role: [15, lib.Vec.with(lib.getCodec(Role))],
      Parameter: [16, lib.Vec.with(lib.getCodec(Parameter))],
      Permission: [17, lib.Vec.with(lib.getCodec(Permission))],
      CommittedTransaction: [
        18,
        lib.Vec.with(lib.getCodec(CommittedTransaction)),
      ],
      SignedTransaction: [19, lib.Vec.with(lib.getCodec(SignedTransaction))],
      TransactionHash: [20, lib.Vec.with(lib.getCodec(lib.HashRepr))],
      TransactionRejectionReason: [
        21,
        lib.Vec.with(lib.Option.with(lib.getCodec(TransactionRejectionReason))),
      ],
      Peer: [22, lib.Vec.with(lib.getCodec(PeerId))],
      RoleId: [23, lib.Vec.with(lib.getCodec(RoleId))],
      TriggerId: [24, lib.Vec.with(lib.getCodec(TriggerId))],
      Trigger: [25, lib.Vec.with(lib.getCodec(Trigger))],
      Action: [26, lib.Vec.with(lib.getCodec(Action))],
      Block: [27, lib.Vec.with(lib.getCodec(SignedBlock))],
      BlockHeader: [28, lib.Vec.with(lib.getCodec(BlockHeader))],
      BlockHeaderHash: [29, lib.Vec.with(lib.getCodec(lib.HashRepr))],
    }).discriminated(),
  ),
}

export type QueryOutputBatchBoxTuple = lib.Vec<QueryOutputBatchBox>
export const QueryOutputBatchBoxTuple = lib.defineCodec(
  lib.Vec.with(lib.getCodec(QueryOutputBatchBox)),
)

/**
 * Structure with named fields.
 */
export interface QueryOutput {
  batch: QueryOutputBatchBoxTuple
  remainingItems: lib.U64
  continueCursor: lib.Option<ForwardCursor>
}
/**
 * Codec of the structure.
 */
export const QueryOutput: lib.CodecContainer<QueryOutput> = lib.defineCodec(
  lib.structCodec<QueryOutput>(['batch', 'remainingItems', 'continueCursor'], {
    batch: lib.getCodec(QueryOutputBatchBoxTuple),
    remainingItems: lib.getCodec(lib.U64),
    continueCursor: lib.Option.with(lib.getCodec(ForwardCursor)),
  }),
)

/**
 * Structure with named fields.
 */
export interface Sorting {
  sortByMetadataKey: lib.Option<lib.Name>
}
/**
 * Codec of the structure.
 */
export const Sorting: lib.CodecContainer<Sorting> = lib.defineCodec(
  lib.structCodec<Sorting>(['sortByMetadataKey'], {
    sortByMetadataKey: lib.Option.with(lib.getCodec(lib.Name)),
  }),
)

/**
 * Structure with named fields.
 */
export interface QueryParams {
  pagination: Pagination
  sorting: Sorting
  fetchSize: lib.Option<lib.NonZero<lib.U64>>
}
/**
 * Codec of the structure.
 */
export const QueryParams: lib.CodecContainer<QueryParams> = lib.defineCodec(
  lib.structCodec<QueryParams>(['pagination', 'sorting', 'fetchSize'], {
    pagination: lib.getCodec(Pagination),
    sorting: lib.getCodec(Sorting),
    fetchSize: lib.Option.with(lib.NonZero.with(lib.getCodec(lib.U64))),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `FindExecutorDataModel`
 * - `FindParameters`
 *
 * TODO how to construct, how to use
 */
export type SingularQueryBox =
  | lib.VariantUnit<'FindExecutorDataModel'>
  | lib.VariantUnit<'FindParameters'>
/**
 * Codec and constructors for enumeration {@link SingularQueryBox}.
 */
export const SingularQueryBox = {
  /**
   * Value of variant `SingularQueryBox.FindExecutorDataModel`
   */ FindExecutorDataModel: Object.freeze<
    lib.VariantUnit<'FindExecutorDataModel'>
  >({ kind: 'FindExecutorDataModel' }), /**
   * Value of variant `SingularQueryBox.FindParameters`
   */
  FindParameters: Object.freeze<lib.VariantUnit<'FindParameters'>>({
    kind: 'FindParameters',
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ FindExecutorDataModel: []; FindParameters: [] }>({
      FindExecutorDataModel: [0],
      FindParameters: [1],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface QueryWithParams {
  query: QueryBox
  params: QueryParams
}
/**
 * Codec of the structure.
 */
export const QueryWithParams: lib.CodecContainer<QueryWithParams> = lib
  .defineCodec(
    lib.structCodec<QueryWithParams>(['query', 'params'], {
      query: lib.getCodec(QueryBox),
      params: lib.getCodec(QueryParams),
    }),
  )

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Singular`
 * - `Start`
 * - `Continue`
 *
 * TODO how to construct, how to use
 */
export type QueryRequest =
  | lib.Variant<'Singular', SingularQueryBox>
  | lib.Variant<'Start', QueryWithParams>
  | lib.Variant<'Continue', ForwardCursor>
/**
 * Codec and constructors for enumeration {@link QueryRequest}.
 */
export const QueryRequest = {
  /**
   * Constructors of nested enumerations under variant `QueryRequest.Singular`
   */ Singular: {
    /**
     * Value of variant `QueryRequest.Singular.FindExecutorDataModel`
     */ FindExecutorDataModel: Object.freeze<
      lib.Variant<'Singular', lib.VariantUnit<'FindExecutorDataModel'>>
    >({ kind: 'Singular', value: SingularQueryBox.FindExecutorDataModel }), /**
     * Value of variant `QueryRequest.Singular.FindParameters`
     */
    FindParameters: Object.freeze<
      lib.Variant<'Singular', lib.VariantUnit<'FindParameters'>>
    >({ kind: 'Singular', value: SingularQueryBox.FindParameters }),
  }, /**
   * Constructor of variant `QueryRequest.Start`
   */
  Start: <const T extends QueryWithParams>(
    value: T,
  ): lib.Variant<'Start', T> => ({ kind: 'Start', value }), /**
   * Constructor of variant `QueryRequest.Continue`
   */
  Continue: <const T extends ForwardCursor>(
    value: T,
  ): lib.Variant<'Continue', T> => ({ kind: 'Continue', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      {
        Singular: [SingularQueryBox]
        Start: [QueryWithParams]
        Continue: [ForwardCursor]
      }
    >({
      Singular: [0, lib.getCodec(SingularQueryBox)],
      Start: [1, lib.getCodec(QueryWithParams)],
      Continue: [2, lib.getCodec(ForwardCursor)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface QueryRequestWithAuthority {
  authority: lib.AccountId
  request: QueryRequest
}
/**
 * Codec of the structure.
 */
export const QueryRequestWithAuthority: lib.CodecContainer<
  QueryRequestWithAuthority
> = lib.defineCodec(
  lib.structCodec<QueryRequestWithAuthority>(['authority', 'request'], {
    authority: lib.getCodec(lib.AccountId),
    request: lib.getCodec(QueryRequest),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `ExecutorDataModel`
 * - `Parameters`
 *
 * TODO how to construct, how to use
 */
export type SingularQueryOutputBox =
  | lib.Variant<'ExecutorDataModel', ExecutorDataModel>
  | lib.Variant<'Parameters', Parameters>
/**
 * Codec and constructors for enumeration {@link SingularQueryOutputBox}.
 */
export const SingularQueryOutputBox = {
  /**
   * Constructor of variant `SingularQueryOutputBox.ExecutorDataModel`
   */ ExecutorDataModel: <const T extends ExecutorDataModel>(
    value: T,
  ): lib.Variant<'ExecutorDataModel', T> => ({
    kind: 'ExecutorDataModel',
    value,
  }), /**
   * Constructor of variant `SingularQueryOutputBox.Parameters`
   */
  Parameters: <const T extends Parameters>(
    value: T,
  ): lib.Variant<'Parameters', T> => ({ kind: 'Parameters', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { ExecutorDataModel: [ExecutorDataModel]; Parameters: [Parameters] }
    >({
      ExecutorDataModel: [0, lib.getCodec(ExecutorDataModel)],
      Parameters: [1, lib.getCodec(Parameters)],
    }).discriminated(),
  ),
}

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `Singular`
 * - `Iterable`
 *
 * TODO how to construct, how to use
 */
export type QueryResponse =
  | lib.Variant<'Singular', SingularQueryOutputBox>
  | lib.Variant<'Iterable', QueryOutput>
/**
 * Codec and constructors for enumeration {@link QueryResponse}.
 */
export const QueryResponse = {
  /**
   * Constructors of nested enumerations under variant `QueryResponse.Singular`
   */ Singular: {
    /**
     * Constructor of variant `QueryResponse.Singular.ExecutorDataModel`
     */ ExecutorDataModel: <const T extends ExecutorDataModel>(
      value: T,
    ): lib.Variant<'Singular', lib.Variant<'ExecutorDataModel', T>> => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.ExecutorDataModel(value),
    }), /**
     * Constructor of variant `QueryResponse.Singular.Parameters`
     */
    Parameters: <const T extends Parameters>(
      value: T,
    ): lib.Variant<'Singular', lib.Variant<'Parameters', T>> => ({
      kind: 'Singular',
      value: SingularQueryOutputBox.Parameters(value),
    }),
  }, /**
   * Constructor of variant `QueryResponse.Iterable`
   */
  Iterable: <const T extends QueryOutput>(
    value: T,
  ): lib.Variant<'Iterable', T> => ({ kind: 'Iterable', value }),
  ...lib.defineCodec(
    lib.enumCodec<
      { Singular: [SingularQueryOutputBox]; Iterable: [QueryOutput] }
    >({
      Singular: [0, lib.getCodec(SingularQueryOutputBox)],
      Iterable: [1, lib.getCodec(QueryOutput)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface RawGenesisTransaction {
  chain: ChainId
  executor: lib.String
  parameters: lib.Option<Parameters>
  instructions: lib.Vec<InstructionBox>
  wasmDir: lib.String
  wasmTriggers: lib.Vec<GenesisWasmTrigger>
  topology: lib.Vec<PeerId>
}
/**
 * Codec of the structure.
 */
export const RawGenesisTransaction: lib.CodecContainer<RawGenesisTransaction> = lib.defineCodec(
  lib.structCodec<RawGenesisTransaction>([
    'chain',
    'executor',
    'parameters',
    'instructions',
    'wasmDir',
    'wasmTriggers',
    'topology',
  ], {
    chain: lib.getCodec(ChainId),
    executor: lib.getCodec(lib.String),
    parameters: lib.Option.with(lib.getCodec(Parameters)),
    instructions: lib.Vec.with(lib.lazyCodec(() => lib.getCodec(InstructionBox))),
    wasmDir: lib.getCodec(lib.String),
    wasmTriggers: lib.Vec.with(lib.getCodec(GenesisWasmTrigger)),
    topology: lib.Vec.with(lib.getCodec(PeerId)),
  }),
)

/**
 * Structure with named fields.
 */
export interface SignedQueryV1 {
  signature: lib.SignatureRepr
  payload: QueryRequestWithAuthority
}
/**
 * Codec of the structure.
 */
export const SignedQueryV1: lib.CodecContainer<SignedQueryV1> = lib.defineCodec(
  lib.structCodec<SignedQueryV1>(['signature', 'payload'], {
    signature: lib.getCodec(lib.SignatureRepr),
    payload: lib.getCodec(QueryRequestWithAuthority),
  }),
)

/**
 * Enumeration (discriminated union). Represented as one of the following variants:
 *
 * - `V1`
 *
 * TODO how to construct, how to use
 */
export type SignedQuery = lib.Variant<'V1', SignedQueryV1>
/**
 * Codec and constructors for enumeration {@link SignedQuery}.
 */
export const SignedQuery = {
  /**
   * Constructor of variant `SignedQuery.V1`
   */ V1: <const T extends SignedQueryV1>(value: T): lib.Variant<'V1', T> => ({
    kind: 'V1',
    value,
  }),
  ...lib.defineCodec(
    lib.enumCodec<{ V1: [SignedQueryV1] }>({
      V1: [1, lib.getCodec(SignedQueryV1)],
    }).discriminated(),
  ),
}

/**
 * Structure with named fields.
 */
export interface Uptime {
  secs: lib.Compact
  nanos: lib.U32
}
/**
 * Codec of the structure.
 */
export const Uptime: lib.CodecContainer<Uptime> = lib.defineCodec(
  lib.structCodec<Uptime>(['secs', 'nanos'], {
    secs: lib.getCodec(lib.Compact),
    nanos: lib.getCodec(lib.U32),
  }),
)

/**
 * Structure with named fields.
 */
export interface Status {
  peers: lib.Compact
  blocks: lib.Compact
  txsAccepted: lib.Compact
  txsRejected: lib.Compact
  uptime: Uptime
  viewChanges: lib.Compact
  queueSize: lib.Compact
}
/**
 * Codec of the structure.
 */
export const Status: lib.CodecContainer<Status> = lib.defineCodec(
  lib.structCodec<Status>([
    'peers',
    'blocks',
    'txsAccepted',
    'txsRejected',
    'uptime',
    'viewChanges',
    'queueSize',
  ], {
    peers: lib.getCodec(lib.Compact),
    blocks: lib.getCodec(lib.Compact),
    txsAccepted: lib.getCodec(lib.Compact),
    txsRejected: lib.getCodec(lib.Compact),
    uptime: lib.getCodec(Uptime),
    viewChanges: lib.getCodec(lib.Compact),
    queueSize: lib.getCodec(lib.Compact),
  }),
)

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
  TriggerId: {
    Atom: 'TriggerId'
    Name: 'Name'
  }
  SignedBlock: {
    Atom: 'Block'
    Header: 'BlockHeader'
  }
  RoleId: {
    Atom: 'RoleId'
    Name: 'Name'
  }
  Role: {
    Atom: 'Role'
    Id: 'RoleId'
  }
  Trigger: {
    Atom: 'Trigger'
    Id: 'TriggerId'
    Action: 'Action'
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
}
