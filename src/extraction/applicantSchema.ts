import { z } from "zod";

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

export const ApplicantDomainSchema = z.enum(APPLICANT_DOMAINS);
export const ApplicantClaimTypeSchema = z.enum(["explicit", "inferred"]);
export const ApplicantClaimStatusSchema = z.enum([
  "unreviewed",
  "confirmed",
  "edited",
  "rejected",
]);

export const ApplicantClaimSchema = z.object({
  text: z.string(),
  type: ApplicantClaimTypeSchema,
  evidence: z.string(),
  confidence: z.number().min(0).max(1),
  source: z.string(),
  opportunity_relevance: z.string(),
  status: ApplicantClaimStatusSchema,
});

export const ApplicantSchema = z.object({
  education: z.array(ApplicantClaimSchema),
  career_work_history: z.array(ApplicantClaimSchema),
  achievements: z.array(ApplicantClaimSchema),
  financial_context: z.array(ApplicantClaimSchema),
  identity_eligibility_attributes: z.array(ApplicantClaimSchema),
  community_involvement: z.array(ApplicantClaimSchema),
  leadership: z.array(ApplicantClaimSchema),
  research_academic_interests: z.array(ApplicantClaimSchema),
  career_direction: z.array(ApplicantClaimSchema),
  lived_experiences: z.array(ApplicantClaimSchema),
  constraints: z.array(ApplicantClaimSchema),
  existing_evidence: z.array(ApplicantClaimSchema),
  narrative_themes: z.array(ApplicantClaimSchema),
});

export type ApplicantDomain = z.infer<typeof ApplicantDomainSchema>;
export type ApplicantClaimType = z.infer<typeof ApplicantClaimTypeSchema>;
export type ApplicantClaimStatus = z.infer<typeof ApplicantClaimStatusSchema>;
export type ApplicantClaim = z.infer<typeof ApplicantClaimSchema>;
export type Applicant = z.infer<typeof ApplicantSchema>;

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
