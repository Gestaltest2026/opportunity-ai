import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import { mergeCuratedWatchlists } from "./mergeCuratedWatchlists";

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
  const [outputPath, basePath, ...additionPaths] = process.argv.slice(2);

  if (!outputPath || !basePath || additionPaths.length === 0) {
    throw new Error(
      "Usage: npm run watchlist:merge -- <output-watchlist.json> <base-watchlist.json> <addition-watchlist.json> [...more-additions.json]"
    );
  }

  const base = await readWatchlist(basePath);
  const additions = await Promise.all(additionPaths.map(readWatchlist));
  const result = mergeCuratedWatchlists(base, additions);

  await writeTextFile(outputPath, `${JSON.stringify(result.watchlist, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        base_source_count: result.base_source_count,
        input_source_count: result.input_source_count,
        merged_source_count: result.merged_source_count,
        added_source_ids: result.added_source_ids,
        preserved_source_ids: result.preserved_source_ids,
        duplicate_source_ids: result.duplicate_source_ids,
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
