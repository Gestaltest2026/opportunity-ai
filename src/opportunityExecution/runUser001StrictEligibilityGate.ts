import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  evaluateStrictEligibilityGate,
  generateStrictEligibilityGateMarkdownReport,
  StrictEligibilityInputSchema,
} from "./strictEligibilityGate";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [inputPath, jsonOutputPath, markdownOutputPath] = process.argv.slice(2);

  if (!inputPath || !jsonOutputPath || !markdownOutputPath) {
    throw new Error(
      "Usage: npm run eligibility-gate:user-001 -- <strict-eligibility-candidates.json> <strict-eligibility-report.json> <strict-eligibility-report.md>"
    );
  }

  const rawCandidates = JSON.parse(await readFile(inputPath, "utf8"));
  const candidates = StrictEligibilityInputSchema.parse(rawCandidates);
  const report = evaluateStrictEligibilityGate(candidates);

  await writeTextFile(jsonOutputPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(markdownOutputPath, generateStrictEligibilityGateMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        applicant_id: report.applicant_id,
        application_ready_count: report.application_ready_count,
        needs_verification_count: report.needs_verification_count,
        expired_count: report.expired_count,
        json_output_path: jsonOutputPath,
        markdown_output_path: markdownOutputPath,
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
