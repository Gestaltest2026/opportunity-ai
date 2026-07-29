import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import {
  generateCuratedWatchlistMarkdownReport,
  runCuratedWatchlist,
} from "./curatedWatchlist";

function parseMaxSources(args: string[]): number | undefined {
  const value = args
    .find((arg) => arg.startsWith("--max-sources="))
    ?.slice("--max-sources=".length);

  if (!value) return undefined;

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Invalid --max-sources value: ${value}`);
  }

  return parsed;
}

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const args = process.argv.slice(2);
  const positional = args.filter((arg) => !arg.startsWith("--"));
  const [watchlistPath, reportPath] = positional;

  if (!watchlistPath || !reportPath) {
    throw new Error(
      "Usage: npm run watchlist:user-001 -- <watchlist.json> <report.md> [--max-sources=N]"
    );
  }

  const raw = JSON.parse(await readFile(watchlistPath, "utf8"));
  const watchlist = CuratedOpportunityWatchlistSchema.parse(raw);
  const result = await runCuratedWatchlist(watchlist, {
    maxSources: parseMaxSources(args),
  });

  await writeTextFile(
    watchlistPath,
    `${JSON.stringify(result.watchlist, null, 2)}\n`
  );
  await writeTextFile(reportPath, generateCuratedWatchlistMarkdownReport(result));

  console.log(JSON.stringify(result.report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
