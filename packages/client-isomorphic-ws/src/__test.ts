import type * as types from '../types'
import * as native from './native'
import * as ws from './ws'

function test(x: typeof types) {}

test(native)
test(ws)
