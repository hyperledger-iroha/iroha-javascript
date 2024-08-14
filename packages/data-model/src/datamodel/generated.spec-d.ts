/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expectTypeOf, assertType } from 'vitest'
import type {
  SingularQueryOutputMap,
  QueryOutputMap,
  QueryOutputBatchBox,
  SingularQueryOutputBox,
  SingularQueryBox,
  QueryBox,
  SingularQueryOutputKindMap,
  QueryOutputKindMap,
} from './generated'

export type Equal<a, b> = (<T>() => T extends a ? 1 : 2) extends <T>() => T extends b ? 1 : 2 ? true : false

export type Expect<a extends true> = a

test('Query output maps integrity', () => {
  type cases = [
    Expect<Equal<keyof SingularQueryOutputMap, SingularQueryBox['t']>>,
    Expect<Equal<keyof QueryOutputMap, QueryBox['t']>>,
    Expect<
      Equal<
        {
          [K in keyof typeof SingularQueryOutputKindMap]: SingularQueryOutputMap[K]
        },
        {
          [K in keyof typeof SingularQueryOutputKindMap]: {
            [K in SingularQueryOutputBox['t']]: (SingularQueryOutputBox & { t: K })['value']
          }[(typeof SingularQueryOutputKindMap)[K]]
        }
      >
    >,
    Expect<
      Equal<
        {
          [K in keyof typeof QueryOutputKindMap]: QueryOutputMap[K]
        },
        {
          [K in keyof typeof QueryOutputKindMap]: {
            [K in QueryOutputBatchBox['t']]: (QueryOutputBatchBox & { t: K })['value']
          }[(typeof QueryOutputKindMap)[K]]
        }
      >
    >,
  ]
})
