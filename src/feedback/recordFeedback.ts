import { Match } from "../matching/schema";
import {
  OpportunityFeedback,
  OpportunityFeedbackLabel,
} from "./schema";

export function recordFeedback(
  applicantId: string,
  match: Match,
  label: OpportunityFeedbackLabel,
  reason: string,
  createdAt: string = new Date().toISOString()
): OpportunityFeedback {
  return {
    feedback_id: `${match.match_id}:${createdAt}`,
    applicant_id: applicantId,
    opportunity_id: match.opportunity_id,
    match_id: match.match_id,
    ai_score: match.score,
    label,
    reason,
    created_at: createdAt,
  };
}
