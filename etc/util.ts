import * as path from 'jsr:@std/path'
import { assert } from '@std/assert'
import { expandGlob } from 'jsr:@std/fs'
import { crypto } from 'jsr:@std/crypto'
import { encodeHex } from 'jsr:@std/encoding'

export function resolveFromRoot(...paths: (string)[]) {
  const dirname = import.meta.dirname
  assert(dirname)
  return path.resolve(dirname, '../', ...paths)
}

export function pathRel(to: string) {
  return path.relative(resolveFromRoot(), to)
}

export async function glob(pattern: string): Promise<string[]> {
  const items: string[] = []
  for await (const entry of expandGlob(pattern)) {
    items.push(entry.path)
  }
  return items
}

export async function hashsum(src: string | URL): Promise<string> {
  const file = await Deno.open(src, { read: true })
  const readableStream = file.readable
  const fileHashBuffer = await crypto.subtle.digest('SHA-256', readableStream)
  return encodeHex(fileHashBuffer)
}
