# `@iroha2/crypto-util`

Utilities shared across crypto packages.

## Usage

```ts
import { freeScope } from '@iroha2/crypto-util'
```

See [`@iroha2/crypto-core`](https://github.com/hyperledger/iroha-javascript/tree/iroha2/packages/crypto/packages/core) package for details.

### Work with `Free`s

All WASM objects have `.free()` method to trigger manual deallocation:

```ts
interface Free {
  free: () => void
}
```

#### Wrap everything with `FreeGuard`

`FreeGuard` is a wrapper around any `Free` object which:

- gives access to the inner object
- throws a friendly error when the object is freed (more friendly than a Rust panic in WASM)
- attaches itself to the current [scope](#scope-guards) if there is any

```ts
import { FreeGuard, freeScope, Free } from '@iroha2/crypto-util'

declare const wasmObject: Free & { do_stuff: () => void }

// add this guard to the current scope
const guard = new FreeGuard(wasmObject)

// access the object
guard.object.do_stuff()

// call `.free()` on the guard to:
// - call `.free()` on the guarded object itself, i.e. `guard.object.free()`
// - clear tracks, i.e. remove the guard from the scope (if there is any)
// - empty the guard, i.e. remove the guarded object and make it unusable
//   so that it could no longer be accessed with `guard.object`
guard.free()

// same as `guard.free()` but without calling `.free()` on the guarded object itself
guard.forget()
```

**Note**: You should not call `.free()` on the inner object. You should call it on the guard instead:

```ts
// ✓ CORRECT
guard.free()

// ❌ WRONG
guard.object.free()
```

**Note**: `.forget()` method could be used if you want to "untrack" the guard everywhere without freeing the object itself.

#### Scope guards

You don't need to manually call `.free()` on each guard you create. You can create them within a scope:

```ts
import { freeScope, FreeGuard } from '@iroha2/crypto-util'

const { barGuard } = freeScope((scope) => {
  const fooGuard = new FreeGuard(foo)
  const barGuard = new FreeGuard(bar)

  // explicitly specify the object that you do not want to 
  // be freed when the scope is over
  scope.forget(barGuard)

  return { barGuard }
})

// voila!
// `fooGuard` is freed automatically, while `barGuard` could still be used here
```

You can also use `FreeScope` API without `freeScope()`:

```ts
import { FreeScope } from '@iroha2/crypto-util'

const scope = new FreeScope()

scope.track(foo)
scope.track(bar)

// free every tracked object
scope.free()
```
