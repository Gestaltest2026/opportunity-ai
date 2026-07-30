import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import {
  analyzeWatchlistMaintenance,
  generateWatchlistMaintenanceMarkdownReport,
} from "./watchlistMaintenance";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [primaryPath, stagedAdditionsPath, jsonReportPath, markdownReportPath] =
    process.argv.slice(2);

  if (!primaryPath || !stagedAdditionsPath || !jsonReportPath || !markdownReportPath) {
    throw new Error(
      "Usage: npm run maintenance:user-001 -- <primary-watchlist.json> <staged-additions.json> <maintenance-report.json> <maintenance-report.md>"
    );
  }

  const primaryRaw = JSON.parse(await readFile(primaryPath, "utf8"));
  const stagedRaw = JSON.parse(await readFile(stagedAdditionsPath, "utf8"));
  const primary = CuratedOpportunityWatchlistSchema.parse(primaryRaw);
  const stagedAdditions = CuratedOpportunityWatchlistSchema.parse(stagedRaw);

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
