import SCHEMA from '@iroha/core/data-model/schema-json'
import { generateClientFindAPI, generateDataModel, generatePrototypes, Resolver } from './codegen.ts'
import * as colors from '@std/fmt/colors'
import { parseArgs } from 'jsr:@std/cli/parse-args'
import { assertEquals } from '@std/assert/equals'
import { fail } from '@std/assert/fail'

const args = parseArgs(Deno.args, {
  boolean: ['update'],
})

async function write(entry: { file: string; code: () => string }) {
  const logPre = `${colors.gray(entry.file + ' =>')} `

  const code = entry.code()

  try {
    const prevCode = await Deno.readTextFile(entry.file)
    if (prevCode === code) {
      console.log(logPre + colors.green('unchanged'))
    } else {
      if (!args.update) {
        assertEquals(code, prevCode, 'codegen changed (overwrite with --update)')
        fail('previous always fails')
      }
      await Deno.writeTextFile(entry.file, code)
      console.log(logPre + colors.blue('updated'))
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err
    await Deno.writeTextFile(entry.file, code)
    console.log(logPre + colors.green('created'))
  }
}

async function writeAll(entries: { file: string; code: () => string }[]) {
  for (const i of entries) {
    await write(i)
  }
}

const resolver = new Resolver(SCHEMA)

console.time('codegen')
await writeAll([
  {
    file: 'packages/core/data-model/prototypes.generated.ts',
    code: () => generatePrototypes(resolver, './prototypes.generated.prelude.ts'),
  },
  {
    file: 'packages/core/data-model/types.generated.ts',
    code: () => generateDataModel(resolver, './types.generated.prelude.ts'),
  },
  {
    file: 'packages/client/find-api.generated.ts',
    code: () => generateClientFindAPI(resolver, './find-api.generated.prelude.ts'),
  },
])
console.timeEnd('codegen')
