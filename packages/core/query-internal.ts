import { assert, fail } from '@std/assert'
import type { QueryKind } from './query-types.ts'
import type * as prototypes from './data-model/prototypes.generated.ts'
import { Name } from './data-model/compound.ts'

export const QUERIES_WITH_PAYLOAD = new Set(
  ['FindAccountsWithAsset', 'FindPermissionsByAccountId', 'FindRolesByAccountId'] as const,
)

// deno-lint-ignore ban-types
type JustFunction = Function

type PredicateBuilderChain = string | { t: 'metadata-key'; key: Name }

type PredicateBuilder = JustFunction & {
  __props: PredicateBuilderChain[]
}

function funWithProps<T>(props: T): JustFunction & T {
  function noop() {}
  return Object.assign(noop, props)
}

function makePredicateBuilder(): PredicateBuilder {
  return funWithProps({ __props: [] })
}

function predicateBuilderPushProp(value: PredicateBuilder, prop: string): PredicateBuilder {
  return funWithProps({ __props: [...value.__props, prop] })
}

function fixPropCase(prop: string): string {
  return prop[0].toUpperCase() + prop.slice(1)
}

function predicateBuilderCall(
  value: PredicateBuilder,
  args: unknown[],
): { t: 'final'; value: unknown } | { t: 'continue'; value: PredicateBuilder } {
  assert(value.__props.length)
  const arg = args.length === 0 ? null : args.length === 1 ? { some: args[0] } : fail('must be 0 or 1 args')

  if (value.__props.at(-1) === 'key' && arg && arg.some instanceof Name) {
    return {
      t: 'continue',
      value: funWithProps({
        __props: [...value.__props, { t: 'metadata-key', key: arg.some }],
      }),
    }
  }

  const lastProp = value.__props.at(-1)!
  assert(typeof lastProp === 'string')
  const lastPropFixed = fixPropCase(lastProp)
  let acc: any = arg ? { kind: lastPropFixed, value: arg.some } : { kind: lastPropFixed }
  acc = { kind: 'Atom', value: acc }
  for (let i = value.__props.length - 2; i >= 0; i--) {
    const prop = value.__props[i]
    if (typeof prop === 'string') acc = { kind: fixPropCase(prop), value: acc }
    else if (prop.t === 'metadata-key') acc = { key: prop.key, projection: acc }
    else fail('unreachable')
  }

  return { t: 'final', value: acc }
}

function makePredicateBuilderProxy(builder: PredicateBuilder): unknown {
  return new Proxy(builder, {
    apply(target, _thisArg, args) {
      const ret = predicateBuilderCall(target, args)
      if (ret.t === 'continue') return makePredicateBuilderProxy(ret.value)
      return ret.value
    },
    get(target, p) {
      assert(typeof p === 'string')
      return makePredicateBuilderProxy(predicateBuilderPushProp(target, p))
    },
  })
}

export function predicateProto<Q extends QueryKind>(): prototypes.QueryPredicates[Q] {
  return makePredicateBuilderProxy(makePredicateBuilder()) as any
}

const selector = Symbol('actual-selector')

type SelectorBuilder = JustFunction & { __props: PredicateBuilderChain[] }

function makeSelectorBuilder(): SelectorBuilder {
  return makePredicateBuilder()
}

function selectorBuilderPushProp(value: SelectorBuilder, prop: string): SelectorBuilder {
  return predicateBuilderPushProp(value, prop)
}

function selectorBuilderCall(value: SelectorBuilder, args: unknown[]): SelectorBuilder {
  assert(value.__props.at(-1) === 'key' && args.length === 1)
  const name = args[0]
  assert(name instanceof Name)
  return funWithProps({ __props: [...value.__props, { t: 'metadata-key', key: name }] })
}

function buildSelector(builder: SelectorBuilder): unknown {
  let acc: any = { kind: 'Atom' }
  for (let i = builder.__props.length - 1; i >= 0; i--) {
    const prop = builder.__props[i]
    if (typeof prop === 'string') acc = { kind: fixPropCase(prop), value: acc }
    else if (prop.t === 'metadata-key') acc = { key: prop.key, projection: acc }
    else fail('unreachable')
  }
  return acc
}

function makeSelectorBuilderProxy(value: SelectorBuilder): unknown {
  return new Proxy(value, {
    get(target, p) {
      if (p === selector) return buildSelector(target)
      if (typeof p === 'string') {
        return makeSelectorBuilderProxy(selectorBuilderPushProp(target, p))
      }
    },
    apply(target, _thisArg, args) {
      return makeSelectorBuilderProxy(selectorBuilderCall(target, args))
    },
  })
}

export function selectorProto<Q extends QueryKind>(): prototypes.QuerySelectors[Q] {
  return makeSelectorBuilderProxy(makeSelectorBuilder()) as any
}

export function getActualSelector(builder: unknown): unknown {
  if (typeof builder === 'function' && '__props' in builder) {
    return (builder as any)[selector]
  }
  throw new TypeError(
    'Expected a magical selector builder type, got something else; make sure you are using `.selectWith()` properly.',
  )
}
