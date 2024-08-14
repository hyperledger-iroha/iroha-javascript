import type { PrivateKey } from '@iroha2/crypto-core'
import { datamodel, extractQueryOutput, signQuery } from '@iroha2/data-model'
import invariant from 'tiny-invariant'
import type { SetOptional } from 'type-fest'
import type { z } from 'zod'
import { ENDPOINT_QUERY } from './const'
import { RestType } from 'typedoc'

export type QueryPayload<Q> = Q extends keyof datamodel.QueryOutputMap
  ? SetOptional<(z.input<typeof datamodel.QueryBox$schema> & { t: Q })['value'], 'predicate'> &
      z.input<typeof datamodel.QueryParams$schema>
  : Q extends keyof datamodel.SingularQueryOutputMap
    ? ValueToMaybeQuery<Q, z.input<typeof datamodel.SingularQueryBox$schema>>
    : never

type ValueToMaybeQuery<Q, T> = NeverToObject<T extends { value: any; t: Q } ? { query: T['value'] } : never>

type NeverToObject<T> = T extends never ? {} : T

export type QueryOutput<Q> = Q extends keyof datamodel.QueryOutputMap
  ? AsyncGenerator<datamodel.QueryOutputMap[Q]>
  : Q extends keyof datamodel.SingularQueryOutputMap
    ? Promise<datamodel.SingularQueryOutputMap[Q]>
    : never

interface QueryBaseParams {
  authority: datamodel.AccountId
  authorityPrivateKey: PrivateKey
  toriiURL: string
}

export function doQuery<
  Q extends keyof datamodel.QueryOutputMap | keyof datamodel.SingularQueryOutputMap,
  P extends QueryPayload<Q>,
>(query: Q, params: P & QueryBaseParams): QueryOutput<Q> {
  const { authority, authorityPrivateKey, toriiURL, ...rest } = params
  const baseParams = { authority, authorityPrivateKey, toriiURL }

  if (query in datamodel.QueryOutputKindMap) {
    type AnyWithFilter = z.ZodLazy<ReturnType<typeof datamodel.QueryWithFilter$schema<any, any>>>
    type Option = z.ZodObject<
      {
        t: z.ZodLiteral<string>
        value: AnyWithFilter
      },
      'strip',
      z.ZodTypeAny,
      { t: string; value: z.input<AnyWithFilter> }
    >
    type BoxSchema = z.ZodDiscriminatedUnion<'t', Option[]>

    const option: Option = (datamodel.QueryBox$schema as unknown as BoxSchema).optionsMap.get(query) /* FIXME */ as any
    const payloadSchema = datamodel.QueryParams$schema.removeDefault().extend({
      query: option.shape.value.schema.shape.query,
      predicate: option.shape.value.schema.shape.predicate.default(() => ({ t: 'And' as const, value: [] })),
    })

    const { pagination, sorting, fetchSize, predicate, query: payload } = payloadSchema.parse(rest)

    return queryIterStream(
      {
        query: datamodel.QueryBox({ t: query /* FIXME */ as any, value: { predicate, query: payload } }),
        params: { pagination, sorting, fetchSize },
      },
      baseParams,
    ) as QueryOutput<Q>
  } else if (query in datamodel.SingularQueryOutputKindMap) {
    return querySingular(
      datamodel.SingularQueryBox({ t: query, value: rest } /* FIXME */ as any),
      baseParams,
    ) as QueryOutput<Q>
  } else {
    throw new TypeError(`Unknown query: "${query}"`)
  }
}

function signQueryRequest(request: datamodel.QueryRequest, params: QueryBaseParams) {
  return signQuery({ authority: params.authority, request }, params.authorityPrivateKey)
}

async function* queryIterStream(
  request: datamodel.QueryWithParams,
  params: QueryBaseParams,
): AsyncGenerator<datamodel.QueryOutputBatchBox['value']> {
  let continueCursor: datamodel.ForwardCursor | null = null
  do {
    const response: datamodel.QueryResponse = await fetch(params.toriiURL + ENDPOINT_QUERY, {
      method: 'POST',
      body: datamodel.SignedQuery$codec.encode(
        signQueryRequest(
          continueCursor
            ? datamodel.QueryRequest({ t: 'Continue', value: continueCursor })
            : datamodel.QueryRequest({ t: 'Start', value: request }),
          params,
        ),
      ),
    }).then(handleQueryResponse)

    invariant(response.t === 'Iterable')
    yield extractQueryOutput(request.query.t, response)

    continueCursor = response.value.continueCursor?.Some ?? null
  } while (continueCursor)
}

async function querySingular(
  query: datamodel.SingularQueryBox,
  params: QueryBaseParams,
): Promise<datamodel.SingularQueryOutputBox['value']> {
  const response = await fetch(params.toriiURL + ENDPOINT_QUERY, {
    method: 'POST',
    body: datamodel.SignedQuery$codec.encode(
      signQueryRequest(datamodel.QueryRequest({ t: 'Singular', value: query }), params),
    ),
  }).then(handleQueryResponse)

  invariant(response.t === 'Singular')
  return extractQueryOutput(query.t, response)
}

async function handleQueryResponse(resp: Response): Promise<datamodel.QueryResponse> {
  if (resp.status === 200) {
    const bytes = await resp.arrayBuffer()
    return datamodel.QueryResponse$codec.decode(new Uint8Array(bytes))
  } else if (resp.status >= 400 && resp.status < 500) {
    const bytes = await resp.arrayBuffer()
    const error = datamodel.ValidationFail$codec.decode(new Uint8Array(bytes))
    // TODO
    console.error(error)
    throw new Error(`Query execution fail`)
  }
  throw new Error(`unexpected response from Iroha: ${resp.status} ${resp.statusText}`)
}
