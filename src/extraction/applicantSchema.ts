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

export const ApplicantSchema = z.object(
  Object.fromEntries(
    APPLICANT_DOMAINS.map((domain) => [domain, z.array(ApplicantClaimSchema)])
  ) as Record<(typeof APPLICANT_DOMAINS)[number], z.ZodArray<typeof ApplicantClaimSchema>>
);

export type ApplicantDomain = z.infer<typeof ApplicantDomainSchema>;
export type ApplicantClaimType = z.infer<typeof ApplicantClaimTypeSchema>;
export type ApplicantClaimStatus = z.infer<typeof ApplicantClaimStatusSchema>;
export type ApplicantClaim = z.infer<typeof ApplicantClaimSchema>;
export type Applicant = z.infer<typeof ApplicantSchema>;

export function isApplicantDomain(value: unknown): value is ApplicantDomain {
  return ApplicantDomainSchema.safeParse(value).success;
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
