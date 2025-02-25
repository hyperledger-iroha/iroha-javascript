import {
  buildQuery,
  type BuildQueryParams,
  type GetQueryPayload,
  type GetSingularQueryOutput,
  type QueryKind,
  type SingularQueryKind,
} from '@iroha/core'
import { type QueryExecutor, QueryHandle } from './query.ts'

export * from './query.ts'

export function buildQueryHandle<K extends QueryKind, O>(
  executor: QueryExecutor,
  kind: K,
  payload: GetQueryPayload<K>,
  params?: BuildQueryParams<K>,
): QueryHandle<O> {
  const query = buildQuery(kind, payload, params)
  return new QueryHandle<any>(query, executor)
}

export async function executeSingularQuery<K extends SingularQueryKind>(
  executor: QueryExecutor,
  kind: K,
): Promise<GetSingularQueryOutput<K>> {
  const result = await executor.executeSingular({ kind })
  return result.value as GetSingularQueryOutput<K>
}
