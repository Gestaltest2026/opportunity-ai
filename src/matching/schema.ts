import { z } from "zod";

export const CriterionStatusSchema = z.enum(["met", "not_met", "unknown"]);
export const EligibilityStatusSchema = z.enum([
  "eligible",
  "ineligible",
  "needs_clarification",
]);
export const ActionabilityStatusSchema = z.enum([
  "actionable",
  "unavailable",
  "upcoming",
  "unknown",
]);

export const MatchCriterionEvaluationSchema = z.object({
  criterion: z.string(),
  status: CriterionStatusSchema,
  supporting_claims: z.array(z.string()),
  explanation: z.string(),
});

export const MatchAnalysisSchema = z.object({
  eligibility_evaluations: z.array(MatchCriterionEvaluationSchema),
  evidence_score: z.number().min(0).max(1),
  narrative_fit_score: z.number().min(0).max(1),
  strategic_value_score: z.number().min(0).max(1),
  blockers: z.array(z.string()),
  missing_information: z.array(z.string()),
  supporting_claims: z.array(z.string()),
  explanation: z.string(),
});

export const MatchSchema = MatchAnalysisSchema.extend({
  match_id: z.string(),
  applicant_id: z.string(),
  opportunity_id: z.string(),
  eligibility_status: EligibilityStatusSchema,
  actionability_status: ActionabilityStatusSchema,
  score: z.number().min(0).max(1).nullable(),
});

export type CriterionStatus = z.infer<typeof CriterionStatusSchema>;
export type EligibilityStatus = z.infer<typeof EligibilityStatusSchema>;
export type ActionabilityStatus = z.infer<typeof ActionabilityStatusSchema>;
export type MatchCriterionEvaluation = z.infer<
  typeof MatchCriterionEvaluationSchema
>;
export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>;
export type Match = z.infer<typeof MatchSchema>;

export function isMatchAnalysis(value: unknown): value is MatchAnalysis {
  return MatchAnalysisSchema.safeParse(value).success;
}
