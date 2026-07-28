export type CriterionStatus = "met" | "not_met" | "unknown";
export type EligibilityStatus =
  | "eligible"
  | "ineligible"
  | "needs_clarification";

export interface MatchCriterionEvaluation {
  criterion: string;
  status: CriterionStatus;
  supporting_claims: string[];
  explanation: string;
}

export interface MatchAnalysis {
  eligibility_evaluations: MatchCriterionEvaluation[];
  evidence_score: number;
  narrative_fit_score: number;
  strategic_value_score: number;
  blockers: string[];
  missing_information: string[];
  supporting_claims: string[];
  explanation: string;
}

export interface Match {
  match_id: string;
  applicant_id: string;
  opportunity_id: string;
  eligibility_status: EligibilityStatus;
  eligibility_evaluations: MatchCriterionEvaluation[];
  evidence_score: number;
  narrative_fit_score: number;
  strategic_value_score: number;
  blockers: string[];
  missing_information: string[];
  supporting_claims: string[];
  score: number | null;
  explanation: string;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isScore(value: unknown): value is number {
  return typeof value === "number" && value >= 0 && value <= 1;
}

function isCriterionEvaluation(value: unknown): value is MatchCriterionEvaluation {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    typeof data.criterion === "string" &&
    (data.status === "met" || data.status === "not_met" || data.status === "unknown") &&
    isStringArray(data.supporting_claims) &&
    typeof data.explanation === "string"
  );
}

export function isMatchAnalysis(value: unknown): value is MatchAnalysis {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    Array.isArray(data.eligibility_evaluations) &&
    data.eligibility_evaluations.every(isCriterionEvaluation) &&
    isScore(data.evidence_score) &&
    isScore(data.narrative_fit_score) &&
    isScore(data.strategic_value_score) &&
    isStringArray(data.blockers) &&
    isStringArray(data.missing_information) &&
    isStringArray(data.supporting_claims) &&
    typeof data.explanation === "string"
  );
}
