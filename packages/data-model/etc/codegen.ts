import path from 'path'
import consola from 'consola'
import chalk from 'chalk'
import fs from 'fs/promises'
import { renderNamespaceDefinition } from '@scale-codec/definition-compiler'
import { SCHEMA } from '@iroha2/data-model-schema'
// import { transformSchema } from './schema-transform'
import { CODEGEN_OUTPUT_FILE } from './meta'
import { generate } from './codegen/index'

const AVAILABLE_FIXED_POINTS = new Set(['I64P9'])
const EXTENSION_MODULE = './extension'

async function main() {
  consola.log(
    chalk`Converting {blue.bold SCHEMA} from {yellow.bold \`@iroha2/data-model-schema\`} to compiler-compatible format...`,
  )
  const generated = generate(SCHEMA)

  // for (const { ty } of nonZero) {
  //   definition[ty] = { t: 'import', module: EXTENSION_MODULE }
  // }

  // for (const { decimalPlaces, base, ref } of fixedPoints) {
  //   const code = `${base.toUpperCase()}P${decimalPlaces}`
  //   if (!AVAILABLE_FIXED_POINTS.has(code)) throw new Error(`FixedPoint ${code} is not supported`)
  //   definition[ref] = {
  //     t: 'import',
  //     module: EXTENSION_MODULE,
  //     nameInModule: `FixedPoint${code}`,
  //   }
  // }

  // const generated = renderNamespaceDefinition(definition, {
  //   rollupSingleTuplesIntoAliases: true,
  // })

  await fs.writeFile(CODEGEN_OUTPUT_FILE, generated, { encoding: 'utf8' })

  consola.success(chalk`Code is written into {bold.blue ${path.relative(process.cwd(), CODEGEN_OUTPUT_FILE)}}!`)
}

main().catch((err) => {
  consola.fatal(err)
  process.exit(1)
})
