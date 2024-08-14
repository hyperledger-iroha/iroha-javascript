import { z } from 'zod'
import * as crypto from '@iroha2/crypto-core'

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

export function parseMultihashPublicKey(hex: string, ctx: z.RefinementCtx) {
  let key: crypto.PublicKey
  try {
    key = crypto.PublicKey.fromMultihash(hex)
  } catch (err) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Failed to parse PublicKey from a multihash hex: ${err}\n\n invalid input: "${hex}"`,
    })
    return z.NEVER
  }
  const result = { algorithm: key.algorithm, payload: key.payload() }
  key.free()
  return result
}
