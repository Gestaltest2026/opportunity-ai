import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema, type CuratedOpportunityWatchlist } from "./schema";
import {
  analyzeWatchlistMaintenance,
  generateWatchlistMaintenanceMarkdownReport,
} from "./watchlistMaintenance";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function readWatchlist(path: string): Promise<CuratedOpportunityWatchlist> {
  const raw = JSON.parse(await readFile(path, "utf8"));
  return CuratedOpportunityWatchlistSchema.parse(raw);
}

function combineStagedAdditions(
  stagedAdditions: CuratedOpportunityWatchlist[]
): CuratedOpportunityWatchlist {
  const [first, ...rest] = stagedAdditions;
  if (!first) throw new Error("At least one staged additions file is required");

  for (const staged of rest) {
    if (staged.applicant_id !== first.applicant_id) {
      throw new Error(
        `Cannot combine staged additions for ${staged.applicant_id} with ${first.applicant_id}`
      );
    }
  }

  return {
    ...first,
    generated_for: "Combined staged User #1 source additions for maintenance audit",
    purpose:
      "Combined staged additions view used only for deterministic maintenance checks.",
    sources: stagedAdditions.flatMap((staged) => staged.sources),
  };
}

async function main() {
  const [primaryPath, jsonReportPath, markdownReportPath, ...stagedAdditionsPaths] =
    process.argv.slice(2);

  if (
    !primaryPath ||
    !jsonReportPath ||
    !markdownReportPath ||
    stagedAdditionsPaths.length === 0
  ) {
    throw new Error(
      "Usage: npm run maintenance:user-001 -- <primary-watchlist.json> <maintenance-report.json> <maintenance-report.md> <staged-additions.json> [...more-staged-additions.json]"
    );
  }

  const primary = await readWatchlist(primaryPath);
  const stagedAdditions = combineStagedAdditions(
    await Promise.all(stagedAdditionsPaths.map(readWatchlist))
  );

  const report = analyzeWatchlistMaintenance(primary, stagedAdditions);

  await writeTextFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(
    markdownReportPath,
    generateWatchlistMaintenanceMarkdownReport(report)
  );

  console.log(JSON.stringify(report, null, 2));

  if (report.blocking_issues.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
