import { spawn } from "node:child_process";

interface Check {
  name: string;
  command: string;
  args: string[];
}

const checks: Check[] = [
  { name: "typecheck", command: "npm", args: ["run", "typecheck"] },
  { name: "hash regression", command: "npm", args: ["run", "evaluate:hash"] },
  {
    name: "databank schema regression",
    command: "npm",
    args: ["run", "evaluate:databank-schema"],
  },
  {
    name: "fixture schema validation",
    command: "npm",
    args: ["run", "evaluate:fixtures"],
  },
  {
    name: "pure domain regression",
    command: "npm",
    args: ["run", "evaluate:domain"],
  },
];

function runCheck(check: Check): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(check.command, check.args, {
      stdio: "inherit",
      shell: process.platform === "win32",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${check.name} failed with exit code ${code ?? "unknown"}.`));
    });
  });
}

async function main() {
  for (const check of checks) {
    console.log(`\n[verify] ${check.name}`);
    await runCheck(check);
  }

  console.log("\n[verify] offline stabilization checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
