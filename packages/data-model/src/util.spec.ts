import { describe, test, expect } from 'vitest'
import { toSortedSet } from './util'
import { Ord, ordCompare, OrdDefault } from './traits'

interface Entry<K, V> {
  key: K
  value: V
}

const compareEntries = <K extends Ord | OrdDefault>(a: Entry<K, unknown>, b: Entry<K, unknown>): number =>
  ordCompare(a.key, b.key)

class NumHolder implements Ord {
  public readonly value: number

  public constructor(value: number) {
    this.value = value
  }

  public compare(other: this): number {
    const a = this.value
    const b = other.value
    return a - b
  }
}

describe('toSortedSet()', () => {
  test('sorts 3 unique strings', () => {
    expect(toSortedSet(['foo', 'bar', 'baz'], ordCompare)).toEqual(['bar', 'baz', 'foo'])
  })

  test('deduplicates strings', () => {
    expect(toSortedSet(['foo', '2', 'bar', 'foo', 'baz', 'baz', '12', '1', '12', '2'], ordCompare)).toEqual([
      '1',
      '12',
      '2',
      'bar',
      'baz',
      'foo',
    ])
  })

  test('sorts key-value pairs (key is string)', () => {
    expect(
      toSortedSet<Entry<string, number>>(
        [
          { key: 'baz', value: 2 },
          { key: 'foo', value: 3 },
          { key: 'bar', value: 1 },
        ],
        compareEntries,
      ),
    ).toEqual([
      { key: 'bar', value: 1 },
      { key: 'baz', value: 2 },
      { key: 'foo', value: 3 },
    ])
  })

  test('deduplicate entries, leaves the last occurences (key is string)', () => {
    expect(
      toSortedSet<Entry<string, number>>(
        [
          { key: 'baz', value: 2 },
          { key: 'foo', value: 3 },
          { key: 'bar', value: 1 },
          { key: 'baz', value: 4 },
        ],
        compareEntries,
      ),
    ).toEqual([
      { key: 'bar', value: 1 },
      { key: 'baz', value: 4 },
      { key: 'foo', value: 3 },
    ])
  })

  test('sorts & deduplicates custom ord implementations', () => {
    expect(
      toSortedSet<NumHolder>(
        [
          new NumHolder(10),
          new NumHolder(100),
          new NumHolder(1),
          new NumHolder(100),
          new NumHolder(9),
          new NumHolder(1000),
          new NumHolder(1),
        ],
        ordCompare,
      ),
    ).toEqual([new NumHolder(1), new NumHolder(9), new NumHolder(10), new NumHolder(100), new NumHolder(1000)])
  })

  test('sort bigints with ordCompare', () => {
    expect(toSortedSet([0n, 10n, 5n, 3n, 3n, 0n, 1n], ordCompare)).toEqual([0n, 1n, 3n, 5n, 10n])
  })
  
  test('sort numbers with ordCompare', () => {
    expect(toSortedSet([0, 5, 1, 6, 2], ordCompare)).toEqual([0, 1, 2, 5, 6])
  })
})
