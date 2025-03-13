import { describe, test } from '@std/testing/bdd'
import { expect, fn } from '@std/expect'

import { HttpTransport, MainAPI } from './api.ts'

describe('HTTP Transport', () => {
  test('when fetch is used, its "this" is undefined', async () => {
    let capturedThis: unknown
    const mock = fn(async function () {
      // @ts-expect-error it's any and it's fine
      capturedThis = this
      return { text: async () => 'Healthy', status: 200 }
    }) as typeof fetch

    const api = new MainAPI(new HttpTransport(new URL('http://localhost'), mock))
    const result = await api.health()

    expect(result).toEqual({ kind: 'healthy' })
    expect(capturedThis).toBeUndefined()
  })
})
