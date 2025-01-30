import { GenCodec } from './codec'

export const SYMBOL_CODEC = '$codec'

export function getCodec<T>(type: CodecContainer<T>): GenCodec<T> {
  return type[SYMBOL_CODEC]
}
export function defineCodec<T>(codec: GenCodec<T>): CodecContainer<T> {
  return { [SYMBOL_CODEC]: codec }
}

export interface CodecContainer<T> {
  [SYMBOL_CODEC]: GenCodec<T>
}

export interface Ord {
  compare(that: this): number
}

export type OrdDefault = string | bigint | number

function ordCompareString(a: string, b: string): number {
  return a.localeCompare(b)
}

function ordCompareNum<T extends number | bigint>(a: T, b: T): number {
  return Number(a - b)
}

export function ordCompare<T extends OrdDefault | Ord>(a: T, b: T): number {
  if (typeof a === 'string') return ordCompareString(a, b as string)
  if (typeof a === 'bigint' || typeof a === 'number') return ordCompareNum(a, b as number | bigint)
  return a.compare(b as Ord)
}

export interface IsZero {
  isZero: () => boolean
}
