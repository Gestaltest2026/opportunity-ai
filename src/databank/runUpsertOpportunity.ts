import { readFile, writeFile } from "fs/promises";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import { OpportunityDatabank } from "./schema";
import { upsertOpportunity } from "./upsertOpportunity";

async function readDatabank(path: string): Promise<OpportunityDatabank> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as OpportunityDatabank;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return { records: [] };
    throw error;
  }
}

async function main() {
  const [databankPath, opportunityId, sourceUrl, sourcePath] = process.argv.slice(2);

  if (!databankPath || !opportunityId || !sourceUrl || !sourcePath) {
    throw new Error(
      "Usage: npm run databank:upsert -- <databank.json> <opportunity-id> <source-url> <source-file>"
    );
  }

  const [databank, sourceText] = await Promise.all([
    readDatabank(databankPath),
    readFile(sourcePath, "utf8"),
  ]);

  const opportunity = await extractOpportunity(opportunityId, sourceText);
  const next = upsertOpportunity(databank, opportunity, sourceUrl, sourceText);

  await writeFile(databankPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(next.records.find(
    (record) => record.opportunity.opportunity_id === opportunityId
  ), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
