import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { Phase2ReadinessReport } from "./phase2ReadinessGate";
import {
  evaluateUser001ActionGate,
  generateUser001ActionGateMarkdownReport,
  User001ActionLedgerSchema,
} from "./user001ActionGate";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [readinessPath, ledgerPath, jsonReportPath, markdownReportPath] = process.argv.slice(2);

  if (!readinessPath || !ledgerPath || !jsonReportPath || !markdownReportPath) {
    throw new Error(
      "Usage: npm run action-gate:user-001 -- <phase-2-readiness.json> <action-ledger.json> <action-gate-report.json> <action-gate-report.md>"
    );
  }

  const readiness = JSON.parse(await readFile(readinessPath, "utf8")) as Phase2ReadinessReport;
  const ledgerRaw = JSON.parse(await readFile(ledgerPath, "utf8"));
  const ledger = User001ActionLedgerSchema.parse(ledgerRaw);
  const report = evaluateUser001ActionGate(readiness, ledger);

  await writeTextFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(markdownReportPath, generateUser001ActionGateMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        phase_2_status: report.phase_2_status,
        source_universe_v0_complete: report.source_universe_v0_complete,
        phase_3_status: report.phase_3_status,
        completed_inquiry_or_application_count:
          report.completed_inquiry_or_application_count,
        completed_evidence_request_count: report.completed_evidence_request_count,
        action_ledger_warning_count: report.action_ledger_warnings.length,
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
