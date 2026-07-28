export const APPLICANT_DOMAINS = [
  "education",
  "career_work_history",
  "achievements",
  "financial_context",
  "identity_eligibility_attributes",
  "community_involvement",
  "leadership",
  "research_academic_interests",
  "career_direction",
  "lived_experiences",
  "constraints",
  "existing_evidence",
  "narrative_themes",
] as const;

export type ApplicantDomain = (typeof APPLICANT_DOMAINS)[number];
export type ApplicantClaimType = "explicit" | "inferred";
export type ApplicantClaimStatus =
  | "unreviewed"
  | "confirmed"
  | "edited"
  | "rejected";

export interface ApplicantClaim {
  text: string;
  type: ApplicantClaimType;
  evidence: string;
  confidence: number;
  source: string;
  opportunity_relevance: string;
  status: ApplicantClaimStatus;
}

export type Applicant = Record<ApplicantDomain, ApplicantClaim[]>;

export function isApplicantDomain(value: unknown): value is ApplicantDomain {
  return (
    typeof value === "string" &&
    (APPLICANT_DOMAINS as readonly string[]).includes(value)
  );
}

export const createEmptyApplicant = (): Applicant => ({
  education: [],
  career_work_history: [],
  achievements: [],
  financial_context: [],
  identity_eligibility_attributes: [],
  community_involvement: [],
  leadership: [],
  research_academic_interests: [],
  career_direction: [],
  lived_experiences: [],
  constraints: [],
  existing_evidence: [],
  narrative_themes: [],
});
