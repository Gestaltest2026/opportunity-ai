export type OutcomeResult =
  | "pending"
  | "awarded"
  | "rejected"
  | "waitlisted"
  | "withdrawn";

export interface Outcome {
  outcome_id: string;
  application_id: string;
  applicant_id: string;
  opportunity_id: string;
  result: OutcomeResult;
  award_amount: number | null;
  currency: string | null;
  decision_date: string | null;
  feedback: string | null;
}
