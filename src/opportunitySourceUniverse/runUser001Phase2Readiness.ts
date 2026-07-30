import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import {
  evaluatePhase2Readiness,
  generatePhase2ReadinessMarkdownReport,
} from "./phase2ReadinessGate";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function readWatchlist(path: string) {
  const raw = JSON.parse(await readFile(path, "utf8"));
  return CuratedOpportunityWatchlistSchema.parse(raw);
}

async function main() {
  const [primaryPath, jsonReportPath, markdownReportPath, ...stagedPaths] =
    process.argv.slice(2);

  if (!primaryPath || !jsonReportPath || !markdownReportPath || stagedPaths.length === 0) {
    throw new Error(
      "Usage: npm run phase2:user-001 -- <primary-watchlist.json> <readiness-report.json> <readiness-report.md> <staged-additions.json> [...more-staged-additions.json]"
    );
  }

  const primary = await readWatchlist(primaryPath);
  const stagedAdditions = await Promise.all(stagedPaths.map(readWatchlist));
  const report = evaluatePhase2Readiness(primary, stagedAdditions);

  await writeTextFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(markdownReportPath, generatePhase2ReadinessMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        status: report.status,
        source_universe_v0_complete: report.source_universe_v0_complete,
        phase_3_allowed: report.phase_3_allowed,
        merged_source_count: report.merged_source_count,
        coverage_gap_count: report.coverage_gap_count,
        maintenance_blocking_issue_count: report.maintenance_blocking_issue_count,
      },
      null,
      2
    )
  );

  if (report.status === "BLOCKED_REPAIR_REQUIRED") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
