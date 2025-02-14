/**
 * The Iroha's `schema.json` itself.
 *
 * Data model types are generated based on this schema. It could be used as a reference.
 *
 * @module
 */

import { default as schema } from './schema.json' with { type: 'json' }
import type { Schema } from './mod.ts'

type Test<T extends Schema> = true
type A = Test<typeof schema>

export default schema
