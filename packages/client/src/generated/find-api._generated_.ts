import * as client from './find-api.prelude.ts'
import type * as dm from '@iroha2/data-model'
export class FindAPI {
  private _executor: client.QueryExecutor
  public constructor(executor: client.QueryExecutor) {
    this._executor = executor
  }
  /**
   * Convenience method for `FindDomains` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.DomainProjectionPredicate}
   * - Selector type: {@link dm.DomainProjectionSelector}
   */
  public domains<const P extends dm.BuildQueryParams<'FindDomains'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindDomains', P>> {
    return client.buildQueryHandle(this._executor, 'FindDomains', null, params)
  }

  /**
   * Convenience method for `FindAccounts` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AccountProjectionPredicate}
   * - Selector type: {@link dm.AccountProjectionSelector}
   */
  public accounts<const P extends dm.BuildQueryParams<'FindAccounts'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindAccounts', P>> {
    return client.buildQueryHandle(this._executor, 'FindAccounts', null, params)
  }

  /**
   * Convenience method for `FindAssets` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AssetProjectionPredicate}
   * - Selector type: {@link dm.AssetProjectionSelector}
   */
  public assets<const P extends dm.BuildQueryParams<'FindAssets'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindAssets', P>> {
    return client.buildQueryHandle(this._executor, 'FindAssets', null, params)
  }

  /**
   * Convenience method for `FindAssetsDefinitions` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AssetDefinitionProjectionPredicate}
   * - Selector type: {@link dm.AssetDefinitionProjectionSelector}
   */
  public assetsDefinitions<
    const P extends dm.BuildQueryParams<'FindAssetsDefinitions'>,
  >(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindAssetsDefinitions', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindAssetsDefinitions',
      null,
      params,
    )
  }

  /**
   * Convenience method for `FindRoles` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.RoleProjectionPredicate}
   * - Selector type: {@link dm.RoleProjectionSelector}
   */
  public roles<const P extends dm.BuildQueryParams<'FindRoles'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindRoles', P>> {
    return client.buildQueryHandle(this._executor, 'FindRoles', null, params)
  }

  /**
   * Convenience method for `FindRoleIds` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.RoleIdProjectionPredicate}
   * - Selector type: {@link dm.RoleIdProjectionSelector}
   */
  public roleIds<const P extends dm.BuildQueryParams<'FindRoleIds'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindRoleIds', P>> {
    return client.buildQueryHandle(this._executor, 'FindRoleIds', null, params)
  }

  /**
   * Convenience method for `FindPermissionsByAccountId` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.PermissionProjectionPredicate}
   * - Selector type: {@link dm.PermissionProjectionSelector}
   */
  public permissionsByAccountId<
    const P extends dm.BuildQueryParams<'FindPermissionsByAccountId'>,
  >(
    payload: dm.FindPermissionsByAccountId,
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindPermissionsByAccountId', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindPermissionsByAccountId',
      payload,
      params,
    )
  }

  /**
   * Convenience method for `FindRolesByAccountId` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.RoleIdProjectionPredicate}
   * - Selector type: {@link dm.RoleIdProjectionSelector}
   */
  public rolesByAccountId<
    const P extends dm.BuildQueryParams<'FindRolesByAccountId'>,
  >(
    payload: dm.FindRolesByAccountId,
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindRolesByAccountId', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindRolesByAccountId',
      payload,
      params,
    )
  }

  /**
   * Convenience method for `FindAccountsWithAsset` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AccountProjectionPredicate}
   * - Selector type: {@link dm.AccountProjectionSelector}
   */
  public accountsWithAsset<
    const P extends dm.BuildQueryParams<'FindAccountsWithAsset'>,
  >(
    payload: dm.FindAccountsWithAsset,
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindAccountsWithAsset', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindAccountsWithAsset',
      payload,
      params,
    )
  }

  /**
   * Convenience method for `FindPeers` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.PeerIdProjectionPredicate}
   * - Selector type: {@link dm.PeerIdProjectionSelector}
   */
  public peers<const P extends dm.BuildQueryParams<'FindPeers'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindPeers', P>> {
    return client.buildQueryHandle(this._executor, 'FindPeers', null, params)
  }

  /**
   * Convenience method for `FindActiveTriggerIds` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.TriggerIdProjectionPredicate}
   * - Selector type: {@link dm.TriggerIdProjectionSelector}
   */
  public activeTriggerIds<
    const P extends dm.BuildQueryParams<'FindActiveTriggerIds'>,
  >(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindActiveTriggerIds', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindActiveTriggerIds',
      null,
      params,
    )
  }

  /**
   * Convenience method for `FindTriggers` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.TriggerProjectionPredicate}
   * - Selector type: {@link dm.TriggerProjectionSelector}
   */
  public triggers<const P extends dm.BuildQueryParams<'FindTriggers'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindTriggers', P>> {
    return client.buildQueryHandle(this._executor, 'FindTriggers', null, params)
  }

  /**
   * Convenience method for `FindTransactions` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.CommittedTransactionProjectionPredicate}
   * - Selector type: {@link dm.CommittedTransactionProjectionSelector}
   */
  public transactions<const P extends dm.BuildQueryParams<'FindTransactions'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindTransactions', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindTransactions',
      null,
      params,
    )
  }

  /**
   * Convenience method for `FindBlocks` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.SignedBlockProjectionPredicate}
   * - Selector type: {@link dm.SignedBlockProjectionSelector}
   */
  public blocks<const P extends dm.BuildQueryParams<'FindBlocks'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindBlocks', P>> {
    return client.buildQueryHandle(this._executor, 'FindBlocks', null, params)
  }

  /**
   * Convenience method for `FindBlockHeaders` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.BlockHeaderProjectionPredicate}
   * - Selector type: {@link dm.BlockHeaderProjectionSelector}
   */
  public blockHeaders<const P extends dm.BuildQueryParams<'FindBlockHeaders'>>(
    params?: P,
  ): client.QueryHandle<dm.GetQueryOutput<'FindBlockHeaders', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindBlockHeaders',
      null,
      params,
    )
  }

  /** Convenience method for `FindExecutorDataModel` query, a variant of {@link dm.SingularQueryBox} enum. */ public executorDataModel(): Promise<
    dm.GetSingularQueryOutput<'FindExecutorDataModel'>
  > {
    return client.executeSingularQuery(this._executor, 'FindExecutorDataModel')
  }

  /** Convenience method for `FindParameters` query, a variant of {@link dm.SingularQueryBox} enum. */ public parameters(): Promise<
    dm.GetSingularQueryOutput<'FindParameters'>
  > {
    return client.executeSingularQuery(this._executor, 'FindParameters')
  }
}
