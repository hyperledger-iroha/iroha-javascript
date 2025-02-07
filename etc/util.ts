import * as path from 'jsr:@std/path'
import { assert } from '@std/assert'
import { expandGlob } from 'jsr:@std/fs'

export function resolveFromRoot(...paths: (string)[]) {
  const dirname = import.meta.dirname
  assert(dirname)
  return path.resolve(dirname, '../', ...paths)
}


export async function glob(pattern: string): Promise<string[]> {
  const items: string[] = []
  for await (const entry of expandGlob(pattern)) {
    items.push(entry.path)
  }
  return items
}