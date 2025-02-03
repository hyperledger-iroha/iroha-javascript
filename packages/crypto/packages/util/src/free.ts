export interface Free {
  free: () => void
}

export class FreeScope implements Free {
  public static readonly getInnerTrackObject = Symbol('GetInnerTrackObject')

  public static readonly trackObject = Symbol('TrackObject')

  #tracked = new Set<TrackObject>()
  #parent: null | FreeScope

  public constructor(parentScope: null | FreeScope = null) {
    this.#parent = parentScope
  }

  public track(object: TrackObjectOrInner): void {
    this.#tracked.add(unwrapTrackObject(object))
  }

  /**
   * Removes the object from being tracked by the scope, preventing the object from
   * being freed when the scope is freed.
   */
  public forget(
    object: TrackObjectOrInner,
    options?: {
      /**
       * if `true` and the object is not tracked, throws an error
       * @default true
       */
      strict?: boolean
      /**
       * "Adopting" means that if the object is forgotten by the current scope, it will be tracked by the parent one,
       * if there is some.
       * @default true
       */
      adopt?: boolean
    },
  ): void {
    const unwrapped = unwrapTrackObject(object)
    if (this.#tracked.has(unwrapped)) {
      this.#tracked.delete(unwrapped)
      if (options?.adopt ?? true) this.#parent?.track(unwrapped)
    } else if (options?.strict ?? true) throw new Error(`The object ${String(unwrapped)} is not tracked`)
  }

  public free(): void {
    for (const object of this.#tracked) {
      object.free()
    }
  }
}

export interface GetInnerTrackObject {
  [FreeScope.getInnerTrackObject]: () => TrackObjectOrInner
}

export interface TrackObject extends Free {
  [FreeScope.trackObject]: true
}

export type TrackObjectOrInner = TrackObject | GetInnerTrackObject

function unwrapTrackObject(object: TrackObjectOrInner): TrackObject {
  let i = object
  while (!(FreeScope.trackObject in i)) {
    i = i[FreeScope.getInnerTrackObject]()
  }
  return i
}

/**
 * Wrapper around a free-able object to control its access,
 * to track within scopes (see {@link FreeScope}).
 */
export class FreeGuard<T extends Free> implements TrackObject {
  public readonly [FreeScope.trackObject] = true

  #maybeInner: null | {
    object: T
    scope: null | FreeScope
  }

  public constructor(object: T) {
    const scope = getCurrentFreeScope()
    this.#maybeInner = { object, scope }
    scope?.track(this)
  }

  /**
   * Getter to access the underlying object
   *
   * # Errors
   *
   * Throws if the guard was freed or forgotten
   */
  public get object(): T {
    if (!this.#maybeInner) {
      throw new Error('The underlying object is missing')
    }
    return this.#maybeInner.object
  }

  /**
   * Frees the underlying object and calls {@link forget}
   */
  public free(): void {
    const obj = this.object
    obj.free()
    this.forget()
  }

  /**
   * Removes the guard from {@link FREE_HEAP} and the attached scope (if there is)
   * and removes the ability to access the underlying object.
   *
   * Same as {@link free}, but doesn't call {@link Free.free} on the underlying object.
   */
  public forget(): void {
    if (!this.#maybeInner) throw new Error('Already forgotten')
    const { scope } = this.#maybeInner
    scope?.forget(this, { strict: false, adopt: false })
    this.#maybeInner = null
  }
}

const SCOPES_STACK: FreeScope[] = []

export function getCurrentFreeScope(): FreeScope | null {
  return SCOPES_STACK.at(-1) ?? null
}

/**
 * Runs the provided function, tracking all trackable (see {@link TrackObject}) objets that
 * *synchronously* bind to the scope during the function execution. When the execution is over
 * (even if it is failed), all tracked objects are freed.
 *
 * Scopes might be nested into each other.
 *
 * In order to exclude some object from being freed with the scope,
 * or to include it explicitly into the scope, the scope itself is passed
 * as first parameter:
 *
 * ```ts
 * let excluded, automaticallyFreed
 *
 * const included = new FreeGuard()
 *
 * freeScope((scope) => {
 *   automaticallyFreed = new FreeGuard({ ... })
 *   excluded = new FreeGuard({ ... })
 *
 *   scope.forget(excluded)
 *   scope.track(included)
 * })
 *
 * // at this point, `automaticallyFreed` and `included` are freed, but `excluded` is not
 * ```
 *
 * Note that `forget` callback does not execute {@link FreeGuard.forget}, but {@link FreeGuard.forget}
 * removes the guard from the scope.
 */
export function freeScope<T>(fn: (scope: FreeScope) => T): T {
  const scope = new FreeScope(getCurrentFreeScope())
  SCOPES_STACK.push(scope)

  try {
    return fn(scope)
  } finally {
    scope.free()
    SCOPES_STACK.pop()
  }
}
