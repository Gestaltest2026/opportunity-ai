import { readFile } from "fs/promises";
import { extractApplicant } from "./extractApplicant";
import {
  ApplicantExtractionGroundTruthSchema,
  evaluateExtraction,
} from "./evaluateExtraction";

async function main() {
  const [sourceText, groundTruthText] = await Promise.all([
    readFile("examples/applicant-001/source.md", "utf8"),
    readFile("examples/applicant-001/expected_claims.json", "utf8"),
  ]);

  const extraction = await extractApplicant("applicant-001", sourceText);
  const groundTruth = ApplicantExtractionGroundTruthSchema.parse(
    JSON.parse(groundTruthText)
  );
  const evaluation = evaluateExtraction(extraction, groundTruth);

  console.log(JSON.stringify(evaluation, null, 2));

  if (
    evaluation.missing.length > 0 ||
    evaluation.prohibited_inferences.length > 0
  ) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
