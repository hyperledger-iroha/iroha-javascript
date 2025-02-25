import type { Schema } from '@iroha/core/data-model/schema'
import SCHEMA from '@iroha/core/data-model/schema-json'
import { generateClientFindAPI, generateDataModel, Resolver } from './codegen.ts'
import $ from 'jsr:@david/dax'
import { expect } from 'jsr:@std/expect'
import * as dprint from 'jsr:@dprint/formatter'
import * as dprintTS from 'npm:@dprint/typescript'
import * as colors from '@std/fmt/colors'

const tsFormatter = dprint.createFromBuffer(await Deno.readFile(dprintTS.getPath()))
const formatTS = (code: string) => {
  console.time('dprint')
  const text = tsFormatter.formatText({ filePath: 'file.ts', fileText: code })
  console.timeEnd('dprint')
  return text
}

async function write({ file, code }: { file: string; code: string }) {
  let status: string
  try {
    const prevCode = await Deno.readTextFile(file)
    if (prevCode === code) {
      status = 'unchanged'
    } else {
      await Deno.writeTextFile(file, code)
      status = 'updated'
    }
  } catch {
    await Deno.writeTextFile(file, code)
    status = 'created'
  }
  $.logStep(`Generated ${colors.cyan(file)} (${status})`)
}

/**
 * There are not included into the schema for some reason, but are useful to generate code for.
 */
const EXTENSION: Schema = {
  Status: {
    Struct: [
      { name: 'peers', type: 'Compact<u128>' },
      { name: 'blocks', type: 'Compact<u128>' },
      { name: 'txs_accepted', type: 'Compact<u128>' },
      { name: 'txs_rejected', type: 'Compact<u128>' },
      { name: 'uptime', type: 'Uptime' },
      { name: 'view_changes', type: 'Compact<u128>' },
      { name: 'queue_size', type: 'Compact<u128>' },
    ],
  },
  Uptime: {
    Struct: [
      { name: 'secs', type: 'Compact<u128>' },
      { name: 'nanos', type: 'u32' },
    ],
  },
}
expect(Object.keys(SCHEMA)).not.toContain(Object.keys(EXTENSION))

const resolver = new Resolver({ ...SCHEMA, ...EXTENSION })

await write({
  file: 'packages/core/data-model/types.generated.ts',
  code: formatTS(generateDataModel(resolver, './types.generated.prelude.ts')),
})

await write({
  file: 'packages/client/find-api.generated.ts',
  code: formatTS(generateClientFindAPI(resolver, './find-api.generated.prelude.ts')),
})
