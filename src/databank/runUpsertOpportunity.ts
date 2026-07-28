import { readFile } from "node:fs/promises";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import {
  readOpportunityDatabank,
  writeOpportunityDatabank,
} from "./io";
import { upsertOpportunity } from "./upsertOpportunity";

async function main() {
  const [databankPath, opportunityId, sourceUrl, sourcePath] = process.argv.slice(2);

  if (!databankPath || !opportunityId || !sourceUrl || !sourcePath) {
    throw new Error(
      "Usage: npm run databank:upsert -- <databank.json> <opportunity-id> <source-url> <source-file>"
    );
  }

  const [databank, sourceText] = await Promise.all([
    readOpportunityDatabank(databankPath),
    readFile(sourcePath, "utf8"),
  ]);

  const opportunity = await extractOpportunity(opportunityId, sourceText);
  const next = upsertOpportunity(databank, opportunity, sourceUrl, sourceText);

  await writeOpportunityDatabank(databankPath, next);
  console.log(
    JSON.stringify(
      next.records.find(
        (record) => record.opportunity.opportunity_id === opportunityId
      ),
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
