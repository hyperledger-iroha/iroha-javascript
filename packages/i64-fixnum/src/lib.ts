/**
 * @module @iroha2/i64-fixnum
 */

/**
 * @packageDocumentation
 *
 * JS implementation of fixed-point numbers with explicit rounding.
 * Based on [loyd/fixnum](https://github.com/loyd/fixnum).
 */

import { assert } from '@scale-codec/util'

function fixnumCoef(precision: number | bigint): bigint {
  return 10n ** BigInt(precision)
}

/**
 * Converts fixed-point number from the bigint layout to its f64 string
 * representation
 *
 * @example
 * ```ts
 * fixnumToF64(1234543210001n, 4) === '123454321.0001'
 * ```
 *
 * @see https://github.com/loyd/fixnum/blob/77860b04eb53a2e001b3b97fe3601833e18b01b9/src/lib.rs#L628
 */
export function bigintToF64Str(fixnum: bigint, precision: number | bigint): string {
  const coef = fixnumCoef(precision)
  const isNegative = fixnum < 0
  const fixnumAbs = isNegative ? -fixnum : fixnum

  const integral = fixnumAbs / coef
  let fractional = fixnumAbs % coef

  let fracWidth = fractional > 0 ? Number(precision) : 0

  while (fractional > 0 && fractional % 10n === 0n) {
    fractional /= 10n
    fracWidth--
  }

  return `${isNegative ? '-' : ''}${integral}.${fractional.toString().padStart(fracWidth, '0')}`
}

/**
 * Converts fixed-point number from its f64 string representation to the bigint layout.
 *
 * @example
 * ```ts
 * f64ToFixnum('-102023041.098872', 9) === -102023041098872000n
 * ```
 *
 * @see https://github.com/loyd/fixnum/blob/77860b04eb53a2e001b3b97fe3601833e18b01b9/src/lib.rs#L688
 */
export function f64StrToBigint(f64: string, precision: number | bigint): bigint {
  assert(f64.match(/^\-?\d+\.\d+?$/), () => `Invalid number: "${f64}"`)

  const coef = fixnumCoef(precision)
  const isNegative = f64.startsWith('-')

  // const f64Str = f64ToNormalizedString(f64, precision);
  const parts = f64.split('.')
  if (parts.length === 1) {
    const [integralStr] = parts
    const integral = BigInt(integralStr) * coef
    return integral
  }

  const [integralStr, fractionalStr] = parts
  assert(
    fractionalStr.length <= precision,
    () => `Provided num (${f64}) precision is too high (${fractionalStr.length} > ${precision})`,
  )

  const integral = BigInt(integralStr)
  const finalIntegral = integral * coef

  const exp = 10n ** BigInt(fractionalStr.length)
  const fractionalNum = BigInt(fractionalStr)

  const finalFractional = (coef / exp) * (isNegative ? -fractionalNum : fractionalNum)

  return finalIntegral + finalFractional
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest

  const CASES = [
    { repr_str: '0.0', repr_i64: '0', precision: 4 },
    { repr_str: '0.1', repr_i64: '1000', precision: 4 },
    { repr_str: '123454321.0001', repr_i64: '1234543210001', precision: 4 },
    { repr_str: '-123454321.0001', repr_i64: '-1234543210001', precision: 4 },
    { repr_str: '-5123.0', repr_i64: '-51230000', precision: 4 },
    { repr_str: '0.0', repr_i64: '0', precision: 9 },
    { repr_str: '0.1', repr_i64: '100000000', precision: 9 },
    { repr_str: '0.000000001', repr_i64: '1', precision: 9 },
    { repr_str: '-1.0', repr_i64: '-1000000000', precision: 9 },
    { repr_str: '-102023041.098872', repr_i64: '-102023041098872000', precision: 9 },
  ]

  test.each(CASES)(
    'Two-way conversion between f64 $repr_str and i64 $repr_i64 with precision $precision',
    ({ repr_i64, repr_str, precision }) => {
      const i64 = BigInt(repr_i64)
      const f64 = repr_str

      expect(bigintToF64Str(i64, precision)).toEqual(f64)
      expect(f64StrToBigint(f64, precision)).toEqual(i64)
    },
  )
}
