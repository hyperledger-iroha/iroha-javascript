import TypeDoc from 'typedoc'
import * as meta from './meta'
import { path } from 'zx'
import invariant from 'tiny-invariant'
import { resolve } from './util'

// FIXME: crypto core reexport of crypto util is rendered in crypto core
const app = await TypeDoc.Application.bootstrapWithPlugins({
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-frontmatter',
    'typedoc-vitepress-theme',
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-coverage',
  ],
  name: 'API Documentation',
  disableSources: true,
  githubPages: false,
  readme: 'none',
  includeVersion: true,
  entryPoints: meta.PACKAGES_TO_PUBLISH.toList()
    .map((pkg) => path.join(meta.packageRoot(pkg), 'src/lib.ts'))
    .toArray(),

  // TypeDoc cannot type options for plugins
  // @ts-ignore

  frontmatterGlobals: { prev: false, next: false },
  indexFormat: 'table',

  // for vitepress-theme plugin
  // https://www.typedoc-plugin-markdown.org/plugins/vitepress/options#--docsroot
  out: resolve('docs/api'),
  docsRoot: resolve('docs'),

  coverageOutputType: 'svg',
})

const project = await app.convert()
invariant(project)

await app.generateDocs(project, resolve(`docs/api`))
