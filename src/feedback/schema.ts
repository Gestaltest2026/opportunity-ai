export type OpportunityFeedbackLabel =
  | "excellent"
  | "good"
  | "bad"
  | "not_relevant";

export interface OpportunityFeedback {
  feedback_id: string;
  applicant_id: string;
  opportunity_id: string;
  match_id: string;
  ai_score: number | null;
  label: OpportunityFeedbackLabel;
  reason: string;
  created_at: string;
}
