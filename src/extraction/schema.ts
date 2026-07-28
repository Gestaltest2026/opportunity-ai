import { z } from "zod";
import {
  ApplicantClaimTypeSchema,
  ApplicantDomainSchema,
} from "./applicantSchema";

export const ExtractedClaimSchema = z.object({
  claim: z.string(),
  domain: ApplicantDomainSchema,
  type: ApplicantClaimTypeSchema,
  evidence: z.string(),
  confidence: z.number().min(0).max(1),
  opportunity_relevance: z.string(),
});

export const ApplicantExtractionSchema = z.object({
  applicant_id: z.string(),
  claims: z.array(ExtractedClaimSchema),
});

export type ClaimType = z.infer<typeof ApplicantClaimTypeSchema>;
export type ExtractedClaim = z.infer<typeof ExtractedClaimSchema>;
export type ApplicantExtraction = z.infer<typeof ApplicantExtractionSchema>;

export function isApplicantExtraction(value: unknown): value is ApplicantExtraction {
  return ApplicantExtractionSchema.safeParse(value).success;
}
