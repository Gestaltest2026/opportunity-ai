import { Application } from "../application/schema";
import { Outcome, OutcomeResult } from "./schema";

export interface OutcomeInput {
  result: OutcomeResult;
  award_amount?: number | null;
  currency?: string | null;
  decision_date?: string | null;
  feedback?: string | null;
}

export function recordOutcome(
  application: Application,
  input: OutcomeInput
): Outcome {
  if (application.status !== "submitted" && input.result !== "withdrawn") {
    throw new Error("A non-withdrawn outcome requires a submitted application.");
  }

  return {
    outcome_id: `${application.application_id}:outcome`,
    application_id: application.application_id,
    applicant_id: application.applicant_id,
    opportunity_id: application.opportunity_id,
    result: input.result,
    award_amount: input.award_amount ?? null,
    currency: input.currency ?? null,
    decision_date: input.decision_date ?? null,
    feedback: input.feedback ?? null,
  };
}
