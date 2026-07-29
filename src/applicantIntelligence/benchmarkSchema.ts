import { z } from "zod";

export const EpistemicStateSchema = z.enum([
  "observed",
  "derived",
  "hypothesized",
  "unknown",
  "question",
]);

export const SemanticLevelSchema = z.enum([
  "fact",
  "relation",
  "pattern",
  "abstraction",
  "concept",
  "hypothesis",
  "opportunity_direction",
  "question",
]);

export const ApplicantModelViewSchema = z.enum(["self", "market"]);

export const HumanReviewDispositionSchema = z.enum([
  "retain",
  "revise",
  "downgrade",
  "reject",
]);

export const InsightQualityScoresSchema = z.object({
  groundedness: z.number().int().min(0).max(3),
  novelty: z.number().int().min(0).max(3),
  recognition: z.number().int().min(0).max(3),
  compression: z.number().int().min(0).max(3),
  external_legibility: z.number().int().min(0).max(3),
});

export const ApplicantIntelligenceNodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  semantic_level: SemanticLevelSchema,
  epistemic_state: EpistemicStateSchema,
  model_view: ApplicantModelViewSchema,
  supporting_claims: z.array(z.string()),
  reasoning_bridge: z.string(),
  weakening_or_clarifying_condition: z.string(),
});

export const OpportunityDirectionSchema = z.object({
  id: z.string(),
  label: z.string(),
  supporting_insight_ids: z.array(z.string()),
  rationale: z.string(),
  epistemic_state: EpistemicStateSchema,
  blocking_unknowns: z.array(z.string()),
});

export const TrustedOpportunityReferenceSchema = z.object({
  opportunity_id: z.string(),
  source: z.string(),
  fit_explanation: z.string(),
  eligibility_uncertainty: z.array(z.string()),
});

export const StrategicLiftSchema = z.object({
  occurred: z.boolean(),
  changes: z.array(
    z.enum([
      "new_opportunity_space",
      "opportunity_priority",
      "missing_evidence",
      "representation",
      "application_strategy",
      "next_action",
      "deprioritization",
    ])
  ),
  notes: z.string(),
});

export const HumanEvaluationSchema = z.object({
  disposition: HumanReviewDispositionSchema,
  scores: InsightQualityScoresSchema,
  strategic_lift: StrategicLiftSchema,
  failure_codes: z.array(z.string()),
  notes: z.string(),
});

export const InsightChainSchema = z.object({
  chain_id: z.string(),
  nodes: z.array(ApplicantIntelligenceNodeSchema).min(1),
  opportunity_directions: z.array(OpportunityDirectionSchema),
  trusted_opportunities: z.array(TrustedOpportunityReferenceSchema),
  key_question: z
    .object({
      text: z.string(),
      unknown: z.string(),
      strategic_consequence: z.string(),
    })
    .nullable(),
  next_action: z.string().nullable(),
  human_evaluation: HumanEvaluationSchema.nullable(),
});

export const ApplicantIntelligenceBenchmarkSchema = z.object({
  applicant_id: z.string(),
  baseline_summary: z.string().nullable(),
  candidate_chains: z.array(InsightChainSchema),
  session_artifact: z
    .object({
      primary_insight_chain_id: z.string(),
      opportunity_space_summary: z.string(),
      trusted_opportunity_ids: z.array(z.string()),
      fit_summary: z.string(),
      key_question: z.string(),
      next_action: z.string(),
    })
    .nullable(),
});

export type EpistemicState = z.infer<typeof EpistemicStateSchema>;
export type SemanticLevel = z.infer<typeof SemanticLevelSchema>;
export type ApplicantModelView = z.infer<typeof ApplicantModelViewSchema>;
export type ApplicantIntelligenceNode = z.infer<
  typeof ApplicantIntelligenceNodeSchema
>;
export type ApplicantIntelligenceBenchmark = z.infer<
  typeof ApplicantIntelligenceBenchmarkSchema
>;
