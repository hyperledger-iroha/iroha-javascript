import { buildQuery, DomainProjectionSelector } from '@iroha2/data-model'
import { describe, test, expect } from 'vitest'

describe('buildQuery()', () => {
  test('default selector is [atom]', () => {
    const res = buildQuery('FindDomains', null)

    expect(res.query.query.value.selector).toEqual([{ kind: 'Atom' }])
  })

  test('when single selector is passed, it is wrapped into an array', () => {
    const res = buildQuery('FindDomains', null, { selector: DomainProjectionSelector.Id.Atom })

    expect(res.query.query.value.selector).toEqual([DomainProjectionSelector.Id.Atom])
  })

  test('when array selector is passed, it is preserved as-is', () => {
    const SELECTOR = [DomainProjectionSelector.Id.Name.Atom, DomainProjectionSelector.Metadata.Atom]

    const res = buildQuery('FindDomains', null, { selector: SELECTOR })

    expect(res.query.query.value.selector).toEqual(SELECTOR)
  })

  test('uses PASS predicate by default (orphan "and")', () => {
    const res = buildQuery('FindAssets', null)

    expect(res.query.query.value.predicate).toEqual({ kind: 'And', value: [] })
  })
})
