import { readFile } from "fs/promises";
import { evaluateOpportunity, OpportunityGroundTruth } from "./evaluateOpportunity";
import { extractOpportunity } from "./extractOpportunity";

async function main() {
  const [sourceText, groundTruthText] = await Promise.all([
    readFile("examples/opportunity-001/source.md", "utf8"),
    readFile("examples/opportunity-001/expected_opportunity.json", "utf8"),
  ]);

  const opportunity = await extractOpportunity("opportunity-001", sourceText);
  const groundTruth = JSON.parse(groundTruthText) as OpportunityGroundTruth;
  const evaluation = evaluateOpportunity(opportunity, groundTruth);

  console.log(JSON.stringify({ opportunity, evaluation }, null, 2));

  if (
    evaluation.scalar_errors.length > 0 ||
    evaluation.missing_expected_signals.length > 0 ||
    evaluation.prohibited_inferences.length > 0
  ) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
