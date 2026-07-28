export const OPPORTUNITY_TYPES = [
  "scholarship",
  "fellowship",
  "grant",
  "program",
  "job",
  "internship",
  "other",
] as const;

export type OpportunityType = (typeof OPPORTUNITY_TYPES)[number];

export interface OpportunityCriterion {
  criterion: string;
  evidence: string;
  confidence: number;
}

export interface OpportunityAward {
  amount: number | null;
  currency: string | null;
  description: string | null;
}

export interface Opportunity {
  opportunity_id: string;
  title: string;
  provider: string;
  opportunity_type: OpportunityType;
  award: OpportunityAward;
  deadline: string | null;
  eligibility: OpportunityCriterion[];
  selection_preferences: OpportunityCriterion[];
  narrative_preferences: string[];
  application_requirements: string[];
  restrictions: string[];
  source_evidence: string[];
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isCriterion(value: unknown): value is OpportunityCriterion {
  if (!value || typeof value !== "object") return false;
  const criterion = value as Record<string, unknown>;

  return (
    typeof criterion.criterion === "string" &&
    typeof criterion.evidence === "string" &&
    typeof criterion.confidence === "number" &&
    criterion.confidence >= 0 &&
    criterion.confidence <= 1
  );
}

export function isOpportunity(value: unknown): value is Opportunity {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  const award = data.award as Record<string, unknown> | undefined;

  return (
    typeof data.opportunity_id === "string" &&
    typeof data.title === "string" &&
    typeof data.provider === "string" &&
    typeof data.opportunity_type === "string" &&
    (OPPORTUNITY_TYPES as readonly string[]).includes(data.opportunity_type) &&
    !!award &&
    (award.amount === null || typeof award.amount === "number") &&
    (award.currency === null || typeof award.currency === "string") &&
    (award.description === null || typeof award.description === "string") &&
    (data.deadline === null || typeof data.deadline === "string") &&
    Array.isArray(data.eligibility) &&
    data.eligibility.every(isCriterion) &&
    Array.isArray(data.selection_preferences) &&
    data.selection_preferences.every(isCriterion) &&
    isStringArray(data.narrative_preferences) &&
    isStringArray(data.application_requirements) &&
    isStringArray(data.restrictions) &&
    isStringArray(data.source_evidence)
  );
}
