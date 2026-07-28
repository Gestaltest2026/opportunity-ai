import { Match } from "../matching/schema";
import { Outcome } from "../outcome/schema";

export interface LearningSignal {
  applicant_id: string;
  opportunity_id: string;
  outcome_result: Outcome["result"];
  awarded: boolean | null;
  match_score: number | null;
  evidence_score: number;
  narrative_fit_score: number;
  strategic_value_score: number;
  supporting_claims: string[];
  feedback: string | null;
}

export function deriveLearningSignal(
  match: Match,
  outcome: Outcome
): LearningSignal {
  if (match.applicant_id !== outcome.applicant_id) {
    throw new Error("Match and outcome belong to different applicants.");
  }

  if (match.opportunity_id !== outcome.opportunity_id) {
    throw new Error("Match and outcome belong to different opportunities.");
  }

  return {
    applicant_id: outcome.applicant_id,
    opportunity_id: outcome.opportunity_id,
    outcome_result: outcome.result,
    awarded:
      outcome.result === "awarded"
        ? true
        : outcome.result === "rejected"
          ? false
          : null,
    match_score: match.score,
    evidence_score: match.evidence_score,
    narrative_fit_score: match.narrative_fit_score,
    strategic_value_score: match.strategic_value_score,
    supporting_claims: [...match.supporting_claims],
    feedback: outcome.feedback,
  };
}
