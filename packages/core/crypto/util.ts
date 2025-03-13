import { decodeHex, encodeHex } from '@std/encoding/hex'
import type { Bytes as WasmBytes } from './wasm/iroha_crypto_wasm.js'

/**
 * Helper to work with binary data passed into the WASM
 */
export class Bytes {
  public static array(data: Uint8Array): Bytes {
    return new Bytes({ t: 'array', c: data })
  }

  public static hex(hex: string): Bytes {
    return new Bytes({ t: 'hex', c: hex })
  }

  #data: WasmBytes

  private constructor(data: WasmBytes) {
    this.#data = data
  }

  public get asWasmFormat(): WasmBytes {
    return this.#data
  }

  public hex(): string {
    if (this.#data.t == 'hex') return this.#data.c
    return encodeHex(this.#data.c)
  }

  public array(): Uint8Array {
    if (this.#data.t === 'array') return this.#data.c
    return decodeHex(this.#data.c)
  }
}
