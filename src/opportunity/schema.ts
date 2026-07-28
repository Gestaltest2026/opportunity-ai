import { z } from "zod";

export const OPPORTUNITY_TYPES = [
  "scholarship",
  "fellowship",
  "grant",
  "program",
  "job",
  "internship",
  "other",
] as const;

export const OPPORTUNITY_AVAILABILITY_STATUSES = [
  "open",
  "closed",
  "upcoming",
  "unknown",
] as const;

export const OpportunityTypeSchema = z.enum(OPPORTUNITY_TYPES);
export const OpportunityAvailabilityStatusSchema = z.enum(
  OPPORTUNITY_AVAILABILITY_STATUSES
);

export const OpportunityCriterionSchema = z.object({
  criterion: z.string(),
  evidence: z.string(),
  confidence: z.number().min(0).max(1),
});

export const OpportunityAwardSchema = z.object({
  amount: z.number().nullable(),
  currency: z.string().nullable(),
  description: z.string().nullable(),
});

export const OpportunitySchema = z.object({
  opportunity_id: z.string(),
  title: z.string(),
  provider: z.string(),
  opportunity_type: OpportunityTypeSchema,
  availability_status: OpportunityAvailabilityStatusSchema,
  award: OpportunityAwardSchema,
  deadline: z.string().nullable(),
  eligibility: z.array(OpportunityCriterionSchema),
  selection_preferences: z.array(OpportunityCriterionSchema),
  narrative_preferences: z.array(z.string()),
  application_requirements: z.array(z.string()),
  restrictions: z.array(z.string()),
  source_evidence: z.array(z.string()),
});

export type OpportunityType = z.infer<typeof OpportunityTypeSchema>;
export type OpportunityAvailabilityStatus = z.infer<
  typeof OpportunityAvailabilityStatusSchema
>;
export type OpportunityCriterion = z.infer<typeof OpportunityCriterionSchema>;
export type OpportunityAward = z.infer<typeof OpportunityAwardSchema>;
export type Opportunity = z.infer<typeof OpportunitySchema>;

export function isOpportunity(value: unknown): value is Opportunity {
  return OpportunitySchema.safeParse(value).success;
}
