import { decodeHex, encodeHex } from '@std/encoding/hex'

export type BytesRepr = { t: 'array'; array: Uint8Array } | { t: 'hex'; hex: string }

/**
 * Helper to work with binary data passed into the WASM
 */
export class Bytes {
  public static array(array: Uint8Array): Bytes {
    return new Bytes({ t: 'array', array })
  }

  public static hex(hex: string): Bytes {
    return new Bytes({ t: 'hex', hex })
  }

  #repr: BytesRepr

  private constructor(data: BytesRepr) {
    this.#repr = data
  }

  public get repr(): BytesRepr {
    return this.#repr
  }

  public hex(): string {
    if (this.#repr.t == 'hex') return this.#repr.hex
    return encodeHex(this.#repr.array)
  }

  public array(): Uint8Array {
    if (this.#repr.t === 'array') return this.#repr.array
    return decodeHex(this.#repr.hex)
  }
}
