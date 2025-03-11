import type { GetSingularQueryOutput, SingularQueryKind } from '@iroha/core'
import type { QueryExecutor } from './query.ts'

export * from './query.ts'

export async function executeSingularQuery<K extends SingularQueryKind>(
  executor: QueryExecutor,
  kind: K,
): Promise<GetSingularQueryOutput<K>> {
  const result = await executor.executeSingular({ kind })
  return result.value as GetSingularQueryOutput<K>
}
