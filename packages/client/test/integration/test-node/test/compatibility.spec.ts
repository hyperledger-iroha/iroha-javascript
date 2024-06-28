/**
 * This file is for Compatibility Matrix tests, which assigns specific
 * Allure context tags.
 */

import * as allure from 'allure-vitest'
import { describe, expect, test } from 'vitest'
import { usePeer } from './util'
import { datamodel } from '@iroha2/data-model'

// TODO: consider adding shared context for tests?
// beforeEach(() => { ... })

// Read Allure API: https://allurereport.org/docs/vitest-reference/
describe('Compatibility Matrix tests', () => {
  // Based on https://github.com/AlexStroke/iroha-java/blob/007a9ac55991cd8a2b519e62a10144156d9f8301/modules/client/src/test/kotlin/jp/co/soramitsu/iroha2/InstructionsTest.kt#L134
  test('register domain', async (ctx) => {
    await allure.feature(ctx, 'Domains')
    await allure.story(ctx, 'Account registers a domain')
    // TODO: add more Allure context

    const DOMAIN_NAME = 'new_domain_name'

    const { client } = await usePeer()

    await client.submit(
      datamodel.Executable.Instructions([
        datamodel.InstructionBox.Register(
          datamodel.RegisterBox.Domain({
            object: {
              id: { name: DOMAIN_NAME },
              logo: datamodel.Option.None(),
              metadata: new Map(),
            },
          }),
        ),
      ]),
      { verify: true },
    )

    const registered = (await client.query(datamodel.QueryBox.FindDomainById({ id: { name: DOMAIN_NAME } })))
      .as('V1')
      .batch.enum.as('Identifiable')
      .as('Domain')
    expect(registered.id.name).toBe(DOMAIN_NAME)
  })
})
