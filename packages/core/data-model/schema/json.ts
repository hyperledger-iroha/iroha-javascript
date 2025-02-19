/**
 * The embedded `schema.json` used to generate this exact version of the package.
 *
 * Its types are described in the {@linkcode [data-model/schema]} module.
 *
 * @module
 */

import { default as schema } from './schema.json' with { type: 'json' }
import type { Schema } from './mod.ts'

type Test<T extends Schema> = true
type A = Test<typeof schema>

export default schema
