/**
 * Dynamic version of the codec based directly on the `schema.json`.
 *
 * @module
 */

import { unreachable } from '@std/assert'
import * as scale from '@scale-codec/core'
import { enumCodec, type EnumCodecSchema, GenCodec, nullCodec, structCodec, tupleCodec } from './codec.ts'
import * as dm from './data-model/mod.ts'
import SCHEMA from './data-model/schema/json.ts'
import type { SchemaTypeDefinition } from './data-model/schema/mod.ts'
import { getCodec } from './data-model/prototypes.generated.prelude.ts'

class Registry {
  #types = new Map<string, GenCodec<any>>()

  register(key: string, schema: SchemaTypeDefinition) {
    let codec: GenCodec<any>

    if (schema === null) codec = nullCodec
    else if (schema === 'String') codec = getCodec(dm.String)
    else if (typeof schema === 'string') codec = this.#deferred(schema)
    else if ('Struct' in schema) {
      codec = structCodec(
        schema.Struct.map((x) => x.name),
        schema.Struct.reduce<Record<string, GenCodec<any>>>((acc, def) => {
          acc[def.name] = this.#deferred(def.type)
          return acc
        }, {}),
      )
    } else if ('Enum' in schema) {
      codec = enumCodec(
        schema.Enum.reduce<EnumCodecSchema<any>>((acc, def) => {
          acc[def.tag] = def.type ? [def.discriminant, this.#deferred(def.type)] : [def.discriminant]
          return acc
        }, {}),
      )
    } else if ('Option' in schema) {
      codec = dm.Option.with(this.#deferred(schema.Option))
    } else if ('Result' in schema) {
      codec = enumCodec<{ Ok: [any]; Err: [any] }>({
        Ok: [0, this.#deferred(schema.Result.ok)],
        Err: [1, this.#deferred(schema.Result.err)],
      })
    } else if ('Int' in schema) {
      if (schema.Int === 'Compact') codec = getCodec(dm.Compact)
      else if (schema.Int === 'FixedWidth' && key === 'u8') codec = getCodec(dm.U8)
      else if (schema.Int === 'FixedWidth' && key === 'u16') codec = getCodec(dm.U16)
      else if (schema.Int === 'FixedWidth' && key === 'u32') codec = getCodec(dm.U32)
      else if (schema.Int === 'FixedWidth' && key === 'u64') codec = getCodec(dm.U64)
      else unreachable(`Unknown int ${key} ${schema.Int}`)
    } else if ('Map' in schema) {
      codec = dm.Vec.with(tupleCodec([this.#deferred(schema.Map.key), this.#deferred(schema.Map.value)]))
    } else if ('Array' in schema) {
      codec = new GenCodec({
        encode: scale.encodeFactory<any>(unreachable, unreachable),
        decode: scale.createArrayDecoder(this.#deferred(schema.Array.type).raw.decode, schema.Array.len),
      })
    } else if ('Bitmap' in schema) {
      if (schema.Bitmap.repr !== 'u32') throw new Error('only u32 bitmaps')
      codec = getCodec(dm.U32)
    } else if ('Tuple' in schema) {
      codec = tupleCodec(schema.Tuple.map((x) => this.#deferred(x)) as any)
    } else if ('Vec' in schema) {
      codec = dm.Vec.with(this.#deferred(schema.Vec))
    } else {
      const _a: never = schema
      throw new Error(`unknown schema: ${schema}`)
    }

    this.#types.set(key, codec!)
  }

  #deferred(key: string): GenCodec<any> {
    return GenCodec.lazy(() => this.#get(key))
  }

  #get(key: string): GenCodec<any> {
    console.log(`[registry] dispatch ${key}`)
    const codec = this.#types.get(key)
    if (!codec) throw new Error(`Could not find codec "${key}"`)
    return codec
  }

  decode(key: string, input: string | ArrayBufferView): unknown {
    return this.#get(key).decode(input)
  }
}

const registry = new Registry()

for (const [key, def] of Object.entries(SCHEMA)) {
  if (key.startsWith('MerkleTree') && def && typeof def !== 'string' && 'Vec' in def) {
    registry.register(key, { Vec: `Option<${def.Vec}>` })
  } else {
    registry.register(key, def)
  }
}

export function decode(key: keyof typeof SCHEMA, input: string | ArrayBufferView): unknown {
  return registry.decode(key, input)
}
