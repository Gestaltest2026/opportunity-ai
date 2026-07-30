import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import {
  evaluateSourceHarvestQueue,
  generateSourceHarvestQueueMarkdownReport,
  SourceHarvestQueueSchema,
} from "./sourceHarvestQueue";

async function writeJsonFile(path: string, value: unknown): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeTextFile(path: string, content: string): Promise<void> {
  const directory = dirname(path);
  if (directory !== ".") await mkdir(directory, { recursive: true });
  await writeFile(path, content, "utf8");
}

async function main() {
  const [queuePath, outputJsonPath, outputMarkdownPath] = process.argv.slice(2);

  if (!queuePath || !outputJsonPath || !outputMarkdownPath) {
    throw new Error(
      "Usage: npm run harvest-queue:user-001 -- <source-harvest-queue.json> <output.json> <output.md>"
    );
  }

  const raw = JSON.parse(await readFile(queuePath, "utf8"));
  const queue = SourceHarvestQueueSchema.parse(raw);
  const report = evaluateSourceHarvestQueue(queue);
  await writeJsonFile(outputJsonPath, report);
  await writeTextFile(outputMarkdownPath, generateSourceHarvestQueueMarkdownReport(report));

  console.log(
    JSON.stringify(
      {
        applicant_id: report.applicant_id,
        status: report.status,
        target_candidate_count: report.harvest_queue_target_candidate_count,
        candidate_gap_count: report.candidate_gap_count,
        output_json_path: outputJsonPath,
        output_markdown_path: outputMarkdownPath,
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
