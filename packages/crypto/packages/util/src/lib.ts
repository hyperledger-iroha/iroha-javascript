/**
 * @module @iroha2/crypto-util
 */

export * from './free'
export type WasmBytes = { t: 'array'; c: Uint8Array } | { t: 'hex'; c: string }

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

  public get wasm(): WasmBytes {
    return this.#data
  }
}
