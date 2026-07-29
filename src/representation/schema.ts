import { z } from "zod";
import { ApplicantDomainSchema } from "../extraction/applicantSchema";

export const RepresentationClaimReferenceSchema = z
  .object({
    domain: ApplicantDomainSchema,
    claim_text: z.string(),
    role: z.enum(["primary", "supporting", "deprioritized"]),
    rationale: z.string(),
  })
  .strict();

export const OpportunitySpecificRepresentationSchema = z
  .object({
    applicant_id: z.string(),
    opportunity_id: z.string(),
    selected_claims: z.array(RepresentationClaimReferenceSchema),
    primary_narrative_themes: z.array(z.string()).max(3),
    supporting_evidence: z.array(z.string()),
    fit_rationale: z.string(),
    unresolved_high_value_facts: z.array(z.string()),
    prohibited_inferences: z.array(z.string()),
  })
  .strict();

export type RepresentationClaimReference = z.infer<
  typeof RepresentationClaimReferenceSchema
>;
export type OpportunitySpecificRepresentation = z.infer<
  typeof OpportunitySpecificRepresentationSchema
>;
