import { readFile } from "node:fs/promises";
import { ApplicationSchema } from "../application/schema";
import { OpportunityDatabankSchema } from "../databank/schema";
import { SourceRegistrySchema } from "../discovery/schema";
import { ApplicantExtractionGroundTruthSchema } from "../extraction/evaluateExtraction";
import { OpportunityFeedbackSchema } from "../feedback/schema";
import { MatchGroundTruthSchema } from "../matching/evaluateMatchGroundTruth";
import { OpportunityGroundTruthSchema } from "../opportunity/evaluateOpportunity";
import { OutcomeSchema } from "../outcome/schema";

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(path, "utf8"));
}

async function main() {
  const [
    applicantGroundTruth,
    opportunityGroundTruth,
    matchGroundTruth,
    sourceRegistry,
    databank,
  ] = await Promise.all([
    readJson("examples/applicant-001/expected_claims.json"),
    readJson("examples/opportunity-001/expected_opportunity.json"),
    readJson("examples/match-001/expected_match.json"),
    readJson("data/sources.json"),
    readJson("data/opportunities.json"),
  ]);

  ApplicantExtractionGroundTruthSchema.parse(applicantGroundTruth);
  OpportunityGroundTruthSchema.parse(opportunityGroundTruth);
  MatchGroundTruthSchema.parse(matchGroundTruth);
  SourceRegistrySchema.parse(sourceRegistry);
  OpportunityDatabankSchema.parse(databank);

  ApplicationSchema.parse({
    application_id: "fixture-application",
    applicant_id: "applicant-001",
    opportunity_id: "opportunity-001",
    match_id: "applicant-001:opportunity-001",
    status: "selected",
    requirements: [],
    documents: [],
    essays: [],
    missing_items: [],
    submitted_at: null,
    notes: [],
  });

  OutcomeSchema.parse({
    outcome_id: "fixture-outcome",
    application_id: "fixture-application",
    applicant_id: "applicant-001",
    opportunity_id: "opportunity-001",
    result: "pending",
    award_amount: null,
    currency: null,
    decision_date: null,
    feedback: null,
  });

  OpportunityFeedbackSchema.parse({
    feedback_id: "fixture-feedback",
    applicant_id: "applicant-001",
    opportunity_id: "opportunity-001",
    match_id: "applicant-001:opportunity-001",
    ai_score: null,
    label: "good",
    reason: "fixture validation",
    created_at: "2026-07-29T00:00:00.000Z",
  });

  console.log(
    JSON.stringify(
      {
        applicant_ground_truth: "valid",
        opportunity_ground_truth: "valid",
        match_ground_truth: "valid",
        source_registry: "valid",
        databank: "valid",
        application_schema: "valid",
        outcome_schema: "valid",
        feedback_schema: "valid",
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
