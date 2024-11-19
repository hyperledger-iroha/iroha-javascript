import { asyncIterAll, asyncIterOne, asyncIterOneOpt } from './util'
import { describe, expect, test } from 'vitest'

describe('async iterators', () => {
  async function* mockGenerator<T>(batches: T[][]) {
    for (const batch of batches) {
      yield batch
    }
  }

  test('read all from all batches', async () => {
    await expect(asyncIterAll(mockGenerator([[1], [2, 3], [4, 5, 6]]))).resolves.toEqual([1, 2, 3, 4, 5, 6])
  })

  test('read all from an empty generator', async () => {
    await expect(asyncIterAll(mockGenerator([[], [], [], []]))).resolves.toEqual([])
  })

  test('read one from an iterator with one elem', async () => {
    await expect(asyncIterOne(mockGenerator([['foo']]))).resolves.toEqual('foo')
  })

  test('read one from an empty input', async () => {
    await expect(asyncIterOne(mockGenerator([]))).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: expected async iterator to yield exactly one item, but it yielded no items at all]`,
    )
    await expect(asyncIterOne(mockGenerator([[], [], []]))).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: expected async iterator to yield exactly one item, but it yielded no items at all]`,
    )
  })

  test('read one from iterator with multiple non-empty batches', async () => {
    await expect(asyncIterOne(mockGenerator([[1], [], [2]]))).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: expected async iterator with batches to yield exactly one item, but it yields more]`,
    )
  })

  test('read one from iterator with a big batch', async () => {
    await expect(asyncIterOne(mockGenerator([[1, 2, 3]]))).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: expected async iterator with batches to yield exactly one item, but it yields more]`,
    )
  })

  test('read one optional from an empty input', async () => {
    await expect(asyncIterOneOpt(mockGenerator([[], [], []]))).resolves.toBeNull()
  })

  test('read one optional from a valid input', async () => {
    await expect(asyncIterOneOpt(mockGenerator([[], [false], []]))).resolves.toEqual({ some: false })
  })
})
