import * as dm from '@iroha2/data-model'
import { type QueryExecutor, QueryHandle } from '../query.ts'

export * from '../query.ts'

export function buildQueryHandle<K extends dm.QueryKind, O>(
  executor: QueryExecutor,
  kind: K,
  payload: dm.GetQueryPayload<K>,
  params?: dm.BuildQueryParams<K>,
): QueryHandle<O> {
  const query = dm.buildQuery(kind, payload, params)
  return new QueryHandle<any>(query, executor)
}

export async function executeSingularQuery<K extends dm.SingularQueryKind>(
  executor: QueryExecutor,
  kind: K,
): Promise<dm.GetSingularQueryOutput<K>> {
  const result = await executor.executeSingular({ kind })
  return result.value as dm.GetSingularQueryOutput<K>
}
