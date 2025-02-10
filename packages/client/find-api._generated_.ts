import * as client from './find-api._generated_.prelude.ts'
import type * as core from '@iroha/core'
import type * as dm from '@iroha/core/data-model'
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
  public domains<const P extends core.BuildQueryParams<'FindDomains'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindDomains', P>> {
    return client.buildQueryHandle(this._executor, 'FindDomains', null, params)
  }

  /**
   * Convenience method for `FindAccounts` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AccountProjectionPredicate}
   * - Selector type: {@link dm.AccountProjectionSelector}
   */
  public accounts<const P extends core.BuildQueryParams<'FindAccounts'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindAccounts', P>> {
    return client.buildQueryHandle(this._executor, 'FindAccounts', null, params)
  }

  /**
   * Convenience method for `FindAssets` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AssetProjectionPredicate}
   * - Selector type: {@link dm.AssetProjectionSelector}
   */
  public assets<const P extends core.BuildQueryParams<'FindAssets'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindAssets', P>> {
    return client.buildQueryHandle(this._executor, 'FindAssets', null, params)
  }

  /**
   * Convenience method for `FindAssetsDefinitions` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.AssetDefinitionProjectionPredicate}
   * - Selector type: {@link dm.AssetDefinitionProjectionSelector}
   */
  public assetsDefinitions<
    const P extends core.BuildQueryParams<'FindAssetsDefinitions'>,
  >(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindAssetsDefinitions', P>> {
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
  public roles<const P extends core.BuildQueryParams<'FindRoles'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindRoles', P>> {
    return client.buildQueryHandle(this._executor, 'FindRoles', null, params)
  }

  /**
   * Convenience method for `FindRoleIds` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.RoleIdProjectionPredicate}
   * - Selector type: {@link dm.RoleIdProjectionSelector}
   */
  public roleIds<const P extends core.BuildQueryParams<'FindRoleIds'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindRoleIds', P>> {
    return client.buildQueryHandle(this._executor, 'FindRoleIds', null, params)
  }

  /**
   * Convenience method for `FindPermissionsByAccountId` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.PermissionProjectionPredicate}
   * - Selector type: {@link dm.PermissionProjectionSelector}
   */
  public permissionsByAccountId<
    const P extends core.BuildQueryParams<'FindPermissionsByAccountId'>,
  >(
    payload: dm.FindPermissionsByAccountId,
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindPermissionsByAccountId', P>> {
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
    const P extends core.BuildQueryParams<'FindRolesByAccountId'>,
  >(
    payload: dm.FindRolesByAccountId,
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindRolesByAccountId', P>> {
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
    const P extends core.BuildQueryParams<'FindAccountsWithAsset'>,
  >(
    payload: dm.FindAccountsWithAsset,
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindAccountsWithAsset', P>> {
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
  public peers<const P extends core.BuildQueryParams<'FindPeers'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindPeers', P>> {
    return client.buildQueryHandle(this._executor, 'FindPeers', null, params)
  }

  /**
   * Convenience method for `FindActiveTriggerIds` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.TriggerIdProjectionPredicate}
   * - Selector type: {@link dm.TriggerIdProjectionSelector}
   */
  public activeTriggerIds<
    const P extends core.BuildQueryParams<'FindActiveTriggerIds'>,
  >(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindActiveTriggerIds', P>> {
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
  public triggers<const P extends core.BuildQueryParams<'FindTriggers'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindTriggers', P>> {
    return client.buildQueryHandle(this._executor, 'FindTriggers', null, params)
  }

  /**
   * Convenience method for `FindTransactions` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.CommittedTransactionProjectionPredicate}
   * - Selector type: {@link dm.CommittedTransactionProjectionSelector}
   */
  public transactions<
    const P extends core.BuildQueryParams<'FindTransactions'>,
  >(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindTransactions', P>> {
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
  public blocks<const P extends core.BuildQueryParams<'FindBlocks'>>(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindBlocks', P>> {
    return client.buildQueryHandle(this._executor, 'FindBlocks', null, params)
  }

  /**
   * Convenience method for `FindBlockHeaders` query, a variant of {@link dm.QueryBox} enum.
   * - Predicate type: {@link dm.BlockHeaderProjectionPredicate}
   * - Selector type: {@link dm.BlockHeaderProjectionSelector}
   */
  public blockHeaders<
    const P extends core.BuildQueryParams<'FindBlockHeaders'>,
  >(
    params?: P,
  ): client.QueryHandle<core.GetQueryOutput<'FindBlockHeaders', P>> {
    return client.buildQueryHandle(
      this._executor,
      'FindBlockHeaders',
      null,
      params,
    )
  }

  /** Convenience method for `FindExecutorDataModel` query, a variant of {@link dm.SingularQueryBox} enum. */ public executorDataModel(): Promise<
    core.GetSingularQueryOutput<'FindExecutorDataModel'>
  > {
    return client.executeSingularQuery(this._executor, 'FindExecutorDataModel')
  }

  /** Convenience method for `FindParameters` query, a variant of {@link dm.SingularQueryBox} enum. */ public parameters(): Promise<
    core.GetSingularQueryOutput<'FindParameters'>
  > {
    return client.executeSingularQuery(this._executor, 'FindParameters')
  }
}
