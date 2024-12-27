export interface Define<I, O> {
  define: (input: I) => O
}

export interface Parse<I, O> {
  parse: (input: I) => O
}

declare const BRAND: unique symbol
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export declare type BRAND<T extends string | number | symbol> = {
  [BRAND]: {
    [k in T]: true
  }
}

export interface SumTypeKind<K> {
  kind: K
}

export interface SumTypeKindValue<K, V> extends SumTypeKind<K> {
  value: V
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
