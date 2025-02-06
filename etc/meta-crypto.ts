import { Set } from "immutable";
import type { SetEntry } from "./util.ts";
import { resolve } from "./util.ts";

export const IROHA_CRYPTO_TARGETS = Set(["web", "node"] as const);

export type IrohaCryptoTarget = SetEntry<typeof IROHA_CRYPTO_TARGETS>;

export const IrohaCryptoTarget = {
  toWasmPackTarget(target: IrohaCryptoTarget): WasmPackTarget {
    if (target === "node") return "nodejs";
    return target;
  },
};

export const WASM_PACK_TARGETS = Set(["web", "nodejs"] as const);

export type WasmPackTarget = SetEntry<typeof WASM_PACK_TARGETS>;

export const PACKAGES = Set(["core", "util"] as const)
  .merge(IROHA_CRYPTO_TARGETS.map((a) => `target-${a}` as const))
  .map((a) => `crypto-${a}` as const);

export type Package = SetEntry<typeof PACKAGES>;

export const WASM_PACK_CRATE_DIR = resolve("crypto-wasm");

// export function VwasmPackOutDirForTarget(target: WasmPackTarget): string {
//   return path.resolve(WASM_PACK_CRATE_DIR, `wasm-pkg-${target}`)
// }

export const WASM_PACK_OUT_NAME = "iroha_crypto";
