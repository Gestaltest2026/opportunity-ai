import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import {
  evaluateSourceUniverseCoverage,
  generateSourceCoverageMarkdownReport,
} from "./sourceCoverage";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [watchlistPath, jsonReportPath, markdownReportPath] = process.argv.slice(2);

  if (!watchlistPath || !jsonReportPath || !markdownReportPath) {
    throw new Error(
      "Usage: npm run coverage:user-001 -- <watchlist.json> <coverage-report.json> <coverage-report.md>"
    );
  }

  const raw = JSON.parse(await readFile(watchlistPath, "utf8"));
  const watchlist = CuratedOpportunityWatchlistSchema.parse(raw);
  const report = evaluateSourceUniverseCoverage(watchlist);

  await writeTextFile(jsonReportPath, `${JSON.stringify(report, null, 2)}\n`);
  await writeTextFile(markdownReportPath, generateSourceCoverageMarkdownReport(report));

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
