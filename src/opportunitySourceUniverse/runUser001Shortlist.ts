import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { CuratedOpportunityWatchlistSchema } from "./schema";
import {
  buildUser001OpportunityShortlist,
  generateUser001EvidenceRequestMarkdown,
  generateUser001ShortlistMarkdown,
} from "./user001Shortlist";

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [watchlistPath, shortlistJsonPath, shortlistMarkdownPath, evidenceRequestPath] =
    process.argv.slice(2);

  if (!watchlistPath || !shortlistJsonPath || !shortlistMarkdownPath || !evidenceRequestPath) {
    throw new Error(
      "Usage: npm run shortlist:user-001 -- <watchlist.json> <shortlist.json> <shortlist.md> <evidence-request.md>"
    );
  }

  const raw = JSON.parse(await readFile(watchlistPath, "utf8"));
  const watchlist = CuratedOpportunityWatchlistSchema.parse(raw);
  const shortlist = buildUser001OpportunityShortlist(watchlist);

  await Promise.all([
    writeTextFile(shortlistJsonPath, `${JSON.stringify(shortlist, null, 2)}\n`),
    writeTextFile(shortlistMarkdownPath, generateUser001ShortlistMarkdown(shortlist)),
    writeTextFile(evidenceRequestPath, generateUser001EvidenceRequestMarkdown(shortlist)),
  ]);

  console.log(
    JSON.stringify(
      {
        applicant_id: shortlist.applicant_id,
        generated_at: shortlist.generated_at,
        counts: shortlist.counts,
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
