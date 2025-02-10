/**
 * Variant of an enumeration (discriminated union) with value.
 *
 * Also: {@link VariantUnit}
 */
export interface Variant<Kind, Value> {
  /**
   * The kind of variant. This is the field by which the variants are discriminated.
   */
  kind: Kind
  /**
   * The corresponding value of the variant.
   */
  value: Value
}

/**
 * "Unit" variant of an enumeration (discriminated union).
 *
 * Also: {@link Variant}
 */
export interface VariantUnit<Kind> {
  /**
   * The kind of variant. This is the field by which the variants are discriminated.
   */
  kind: Kind
}

// function hexChar(hex: string, index: number): number {
//   const char = hex[index].toLowerCase()
//   if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0)
//   if (char >= 'a' && char <= 'f') return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
//   throw new Error(`Expected 0..9/a..f/A..F, got '${hex[index]}' at position ${index}`)
// }

// /**
//  * Decode hex string and generate its bytes.
//  */
// export function* hexDecode(hex: string): Generator<number> {
//   for (let i = 0; i < hex.length; i += 2) {
//     yield hexChar(hex, i) * 16 + hexChar(hex, i + 1)
//   }
// }

// /**
//  * Encode array of bytes as a hex string
//  */
// export function hexEncode(bytes: Uint8Array): string {
//   // TODO: optimise
//   return [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('')
// }

export type CompareFn<T> = (a: T, b: T) => number

/**
 * Sorts and deduplicates elements of an array given a comparator.
 *
 * Deduplication works for elements for which comparator returns zero.
 * It leaves the last occurence of a value.
 *
 * @param items the array to sort and deduplicate
 * @param compareFn comparator
 * @returns a new array with items sorted and deduplicated.
 */
export function toSortedSet<T>(items: T[], compareFn: CompareFn<T>): T[] {
  // TODO: optimise, not a very efficient implementation
  return [...items].sort(compareFn).filter((val, i, arr) => {
    if (i < arr.length - 1) {
      const next = arr[i + 1]
      const ordering = compareFn(val, next)
      if (ordering === 0) return false
    }
    return true
  })
}
