import { PublicKey } from '@iroha2/crypto-core'
import { z } from 'zod'

function hexChar(hex: string, index: number): number {
  const char = hex[index].toLowerCase()
  if (char >= '0' && char <= '9') return char.charCodeAt(0) - '0'.charCodeAt(0)
  if (char >= 'a' && char <= 'f') return 10 + char.charCodeAt(0) - 'a'.charCodeAt(0)
  throw new Error(`Expected 0..9/a..f/A..F, got '${hex[index]}' at position ${index}`)
}

export function* parseHex(hex: string): Generator<number> {
  for (let i = 0; i < hex.length; i += 2) {
    yield hexChar(hex, i) * 16 + hexChar(hex, i + 1)
  }
}

export function parseAccountId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('@')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'account id should have format `signatory@domain`' })
    return z.NEVER
  }
  const [signatory, domain] = parts
  const result = { domain, signatory }
  return result
}

export function parseAssetDefinitionId(str: string, ctx: z.RefinementCtx) {
  const parts = str.split('#')
  if (parts.length !== 2) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'asset definition id should have format `name#domain`' })
    return z.NEVER
  }
  const [name, domain] = parts
  return { name, domain }
}

/**
 * Parses either `asset##account@domain` or `asset#domain1#account@domain2`
 */
export function parseAssetId(str: string, ctx: z.RefinementCtx) {
  const match = str.match(/^(.+)#(.+)?#(.+)@(.+)$/)
  if (!match) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        'asset id should have format `asset#asset_domain#account@account_domain` ' +
        'or `asset##account@domain` (when asset & account domain are the same)',
    })
    return z.NEVER
  }
  const [, asset, domain1, account, domain2] = match
  // TODO
  return {
    account: parseAccountId(`${account}@${domain2}`, ctx),
    definition: { domain: domain1 ?? domain2, name: asset },
  }
}

export function parseMultihashPublicKey(hex: string) {
  const key = PublicKey.fromMultihash(hex)
  const result = { algorithm: key.algorithm, payload: key.payload() }
  key.free()
  return result
}
