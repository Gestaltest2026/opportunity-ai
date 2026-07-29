import { z } from "zod";

export const HumanMatchReviewSchema = z
  .object({
    applicant_id: z.string(),
    opportunity_id: z.string(),
    eligibility: z.enum(["eligible", "ineligible", "unknown"]),
    evidence_fit: z.enum(["strong", "moderate", "weak", "unknown"]),
    narrative_fit: z.enum(["strong", "moderate", "weak", "unknown"]),
    strategic_value: z.enum(["high", "medium", "low", "unknown"]),
    pursue_judgment: z.enum(["pursue", "conditional", "do_not_pursue"]),
    strongest_reason_to_pursue: z.string(),
    strongest_reason_not_to_pursue: z.string(),
    single_fact_most_likely_to_change_judgment: z.string(),
    reasoning: z.string(),
  })
  .strict();

export type HumanMatchReview = z.infer<typeof HumanMatchReviewSchema>;
