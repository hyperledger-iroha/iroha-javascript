import { preview } from "vite";
import { spawn } from "node:child_process";
import { run } from "@iroha2/test-peer/api/server";
import { setWASM } from "@iroha2/crypto";
import { wasmPkg } from "@iroha2/crypto-target-node";
import { PORT_PEER_SERVER } from "./meta.ts";

setWASM(wasmPkg);

async function main() {
  console.info("Starting peer server & vite preview server");
  await Promise.all([run(PORT_PEER_SERVER), preview({})]);

  console.info("Running Cypress");

  await new Promise((resolve, reject) => {
    const child = spawn(`pnpm`, ["cypress", "run"], {
      stdio: ["ignore", "inherit", "inherit"],
    });

    child.on("close", (code) => {
      if (code !== 0) reject(new Error(`non-zero exit code: ${code}`));
      resolve();
    });
  });

  console.info("Tests have passed!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
