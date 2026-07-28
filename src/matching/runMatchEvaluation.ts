import { readFile } from "fs/promises";
import { applyExtraction } from "../extraction/applyExtraction";
import { extractApplicant } from "../extraction/extractApplicant";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import { evaluateMatch } from "./evaluateMatch";
import { evaluateMatchGroundTruth } from "./evaluateMatchGroundTruth";

async function main() {
  const [applicantSource, opportunitySource, groundTruthText] = await Promise.all([
    readFile("examples/applicant-001/source.md", "utf8"),
    readFile("examples/opportunity-001/source.md", "utf8"),
    readFile("examples/match-001/expected_match.json", "utf8"),
  ]);

  const applicantExtraction = await extractApplicant(
    "applicant-001",
    applicantSource
  );
  const applicant = applyExtraction(
    applicantExtraction,
    undefined,
    "examples/applicant-001/source.md"
  );

  const opportunity = await extractOpportunity(
    "opportunity-001",
    opportunitySource
  );
  const match = await evaluateMatch("applicant-001", applicant, opportunity);
  const groundTruth = JSON.parse(groundTruthText);
  const evaluation = evaluateMatchGroundTruth(match, groundTruth);

  console.log(JSON.stringify({ match, evaluation }, null, 2));

  if (
    evaluation.status_errors.length > 0 ||
    evaluation.missing_supporting_signals.length > 0 ||
    evaluation.missing_blocker_signals.length > 0 ||
    evaluation.prohibited_claims.length > 0
  ) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
