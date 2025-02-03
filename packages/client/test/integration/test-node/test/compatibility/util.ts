import { TaskContext } from 'vitest'
import * as allure from 'allure-vitest'

export async function annotateAllure(
  ctx: TaskContext,
  attrs: { id: number; feature: string; sdkTestId: string; story: string },
) {
  await Promise.all([
    allure.owner(ctx, 'dulger'),
    allure.label(ctx, 'permission', 'no_permission_required'),
    allure.label(ctx, 'sdk', 'JavaScript'),
    allure.label(ctx, 'allure_id', String(attrs.id)),
    allure.label(ctx, 'feature', attrs.feature),
    allure.label(ctx, 'sdk_test_id', attrs.sdkTestId),
    allure.label(ctx, 'story', attrs.story),
  ])
}
