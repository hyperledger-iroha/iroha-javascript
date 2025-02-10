import type { GenCodec } from './codec.ts'

export const SYMBOL_CODEC = '$codec'

/**
 * Extracts codec from its container.
 */
export function getCodec<T>(type: CodecContainer<T>): GenCodec<T> {
  return type[SYMBOL_CODEC]
}

/**
 * Wraps a codec into {@link CodecContainer}.
 */
export function defineCodec<T>(codec: GenCodec<T>): CodecContainer<T> {
  return { [SYMBOL_CODEC]: codec }
}

/**
 * A value that contains a codec under a "special" key ({@link SYMBOL_CODEC}).
 */
export interface CodecContainer<T> {
  [SYMBOL_CODEC]: GenCodec<T>
}

/**
 * Ordering "trait". Tells how to compare values of the same type with each other.
 */
export interface Ord<T> {
  /**
   * Compares `this` with `that`.
   *
   * @param that the other value to compare to
   * @returns a negative number if `this` is less than `that`;
   * a positive number if `this` is greater than `that`;
   * zero if they are equal. Same behaviour as with {@link Array.sort}
   */
  compare: (that: T) => number
}

/**
 * Types for which ordering is "known", that is, the comparison if built-in.
 */
export type OrdKnown = string | bigint | number

function ordCompareString(a: string, b: string): number {
  return a.localeCompare(b)
}

function ordCompareNum<T extends number | bigint>(a: T, b: T): number {
  return Number(a - b)
}

/**
 * Implementation of the compare function for types that are either {@link Ord}
 * or for which ordering is "known" (i.e. {@link OrdKnown}).
 *
 * See {@link Ord.compare}.
 */
export function ordCompare<T extends OrdKnown | Ord<T>>(a: T, b: T): number {
  if (typeof a === 'string') return ordCompareString(a, b as string)
  if (typeof a === 'bigint' || typeof a === 'number') return ordCompareNum(a, b as number | bigint)
  return a.compare(b as T)
}

/**
 * A "trait" that specifies a method to check whether the value is zero or not.
 */
export interface IsZero {
  /**
   * Tells whether `this` is zero.
   * @returns `true` if zero, `false` otherwise.
   */
  isZero: () => boolean
}
