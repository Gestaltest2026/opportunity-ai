import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  evaluateSourceExpansionPlan,
  generateSourceExpansionMarkdownReport,
  SourceExpansionPlanSchema,
} from "./sourceExpansionLanes";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [planPath, jsonOutputPath, markdownOutputPath] = process.argv.slice(2);

  if (!planPath || !jsonOutputPath || !markdownOutputPath) {
    throw new Error(
      "Usage: npm run source-expansion:user-001 -- <expansion-plan.json> <report.json> <report.md>"
    );
  }

  const raw = JSON.parse(await readFile(planPath, "utf8"));
  const plan = SourceExpansionPlanSchema.parse(raw);
  const report = evaluateSourceExpansionPlan(plan);

  await writeTextFile(jsonOutputPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(markdownOutputPath, generateSourceExpansionMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        applicant_id: report.applicant_id,
        status: report.status,
        current_known_curated_source_count: report.current_known_curated_source_count,
        phase_1_curated_source_goal: report.phase_1_curated_source_goal,
        source_universe_gap_count: report.source_universe_gap_count,
        underseeded_lane_count: report.underseeded_lane_count,
        highest_priority_next_lane_ids: report.highest_priority_next_lane_ids,
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
