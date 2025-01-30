export interface Variant<Kind, Value> {
  kind: Kind
  value: Value
}

export interface VariantUnit<Kind> {
  kind: Kind
}

function hexChar(hex: string, index: number): number {
  const char = hex[index].toLowerCase()
  if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0)
  if (char >= 'a' && char <= 'f') return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
  throw new Error(`Expected 0..9/a..f/A..F, got '${hex[index]}' at position ${index}`)
}

export function* hexDecode(hex: string): Generator<number> {
  for (let i = 0; i < hex.length; i += 2) {
    yield hexChar(hex, i) * 16 + hexChar(hex, i + 1)
  }
}

export function hexEncode(bytes: Uint8Array): string {
  // TODO: optimise
  return [...bytes].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export type CompareFn<T> = (a: T, b: T) => number

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
