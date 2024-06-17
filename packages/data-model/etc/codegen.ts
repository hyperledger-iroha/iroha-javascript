import path from 'path'
import consola from 'consola'
import chalk from 'chalk'
import fs from 'fs/promises'
import { renderNamespaceDefinition } from '@scale-codec/definition-compiler'
import { SCHEMA } from '@iroha2/data-model-schema'
// import { transformSchema } from './schema-transform'
import { CODEGEN_OUTPUT_FILE } from './meta'
import { generate } from './codegen/index'

async function main() {
  consola.log(chalk`Generating {blue.bold SCHEMA} from {yellow.bold \`@iroha2/data-model-schema\`}...`)
  const generated = generate(SCHEMA)
  await fs.writeFile(CODEGEN_OUTPUT_FILE, generated, { encoding: 'utf8' })
  consola.success(chalk`Code is written into {bold.blue ${path.relative(process.cwd(), CODEGEN_OUTPUT_FILE)}}!`)
}

main().catch((err) => {
  consola.fatal(err)
  process.exit(1)
})
