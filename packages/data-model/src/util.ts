function hexChar(hex: string, index: number): number {
  const char = hex[index].toLowerCase()
  if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0)
  if (char >= 'a' && char <= 'f') return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
  throw new Error(`Expected 0..9/a..f/A..F, got '${hex[index]}' at position ${index}`)
}

export function* parseHex(hex: string): Generator<number> {
  for (let i = 0; i < hex.length; i += 2) {
    yield hexChar(hex, i) * 16 + hexChar(hex, i + 1)
  }
}
