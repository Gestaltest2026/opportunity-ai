import { readFile } from "node:fs/promises";
import { OpportunityDatabankSchema } from "../databank/schema";
import { SourceRegistrySchema } from "../discovery/schema";
import { MatchGroundTruthSchema } from "../matching/evaluateMatchGroundTruth";
import { OpportunityGroundTruthSchema } from "../opportunity/evaluateOpportunity";

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function main() {
  const [
    opportunityGroundTruth,
    matchGroundTruth,
    sourceRegistry,
    databank,
  ] = await Promise.all([
    readJson("examples/opportunity-001/expected_opportunity.json"),
    readJson("examples/match-001/expected_match.json"),
    readJson("data/sources.json"),
    readJson("data/opportunities.json"),
  ]);

  OpportunityGroundTruthSchema.parse(opportunityGroundTruth);
  MatchGroundTruthSchema.parse(matchGroundTruth);
  SourceRegistrySchema.parse(sourceRegistry);
  OpportunityDatabankSchema.parse(databank);

  console.log(
    JSON.stringify(
      {
        opportunity_ground_truth: "valid",
        match_ground_truth: "valid",
        source_registry: "valid",
        databank: "valid",
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
