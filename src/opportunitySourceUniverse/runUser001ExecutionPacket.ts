import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { generateUser001ExecutionPacket } from "./user001ExecutionPacket";
import { User001ActionLedgerSchema, type User001ActionGateReport } from "./user001ActionGate";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function readOptionalText(path: string): Promise<string> {
  try {
    return await readFile(path, "utf8");
  } catch {
    return "";
  }
}

async function main() {
  const [ledgerPath, actionGatePath, evidenceRequestPath, outputPath] = process.argv.slice(2);

  if (!ledgerPath || !actionGatePath || !evidenceRequestPath || !outputPath) {
    throw new Error(
      "Usage: npm run execution-packet:user-001 -- <action-ledger.json> <action-gate.json> <evidence-request.md> <execution-packet.md>"
    );
  }

  const ledgerRaw = JSON.parse(await readFile(ledgerPath, "utf8"));
  const actionGateRaw = JSON.parse(await readFile(actionGatePath, "utf8")) as User001ActionGateReport;
  const evidenceRequestMarkdown = await readOptionalText(evidenceRequestPath);
  const ledger = User001ActionLedgerSchema.parse(ledgerRaw);

  const packet = generateUser001ExecutionPacket({
    ledger,
    actionGate: actionGateRaw,
    evidenceRequestMarkdown,
  });

  await writeTextFile(outputPath, packet);

  console.log(
    JSON.stringify(
      {
        applicant_id: ledger.applicant_id,
        action_count: ledger.actions.length,
        execution_packet_path: outputPath,
        phase_3_status: actionGateRaw.phase_3_status,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
