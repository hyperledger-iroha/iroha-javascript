function* hexes(hex: string): Generator<number> {
  for (let i = 0; i < hex.length; ) {
    if (/^[0-9a-fA-F]{2}/.test(hex.slice(i))) {
      yield Number.parseInt(hex.slice(i, i + 2), 0x10)
      i += 2
    } else i += 1
  }
}

export function fromHexWithSpaces(hex: string): Uint8Array {
  return new Uint8Array(hexes(hex))
}

export function toHex(data: Iterable<number>): string {
  return [...data].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export const SAMPLE_ACCOUNT_ID = 'ed0120B23E14F659B91736AAB980B6ADDCE4B1DB8A138AB0267E049C082A744471714E@badland'
