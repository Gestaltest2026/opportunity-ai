import { spawn } from "node:child_process";

interface Check {
  name: string;
  command: string;
  args: string[];
}

const checks: Check[] = [
  { name: "typecheck", command: "npm", args: ["run", "typecheck"] },
  {
    name: "Applicant Intelligence benchmark fixture regression",
    command: "npm",
    args: ["run", "evaluate:applicant-intelligence-fixture"],
  },
  {
    name: "Applicant Intelligence canonical adapter regression",
    command: "npm",
    args: ["run", "evaluate:applicant-intelligence-adapter"],
  },
  {
    name: "Applicant Intelligence epistemic guard regression",
    command: "npm",
    args: ["run", "evaluate:applicant-intelligence-guard"],
  },
  {
    name: "Applicant Intelligence human review gate regression",
    command: "npm",
    args: ["run", "evaluate:applicant-intelligence-human-review"],
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
    console.log(`\n[verify:applicant-intelligence] ${check.name}`);
    await runCheck(check);
  }

  console.log("\n[verify:applicant-intelligence] deterministic checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
