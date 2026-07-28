import { z } from "zod";

export const OPPORTUNITY_FEEDBACK_LABELS = [
  "excellent",
  "good",
  "bad",
  "not_relevant",
] as const;

export const OpportunityFeedbackLabelSchema = z.enum(
  OPPORTUNITY_FEEDBACK_LABELS
);

export const OpportunityFeedbackSchema = z.object({
  feedback_id: z.string(),
  applicant_id: z.string(),
  opportunity_id: z.string(),
  match_id: z.string(),
  ai_score: z.number().min(0).max(1).nullable(),
  label: OpportunityFeedbackLabelSchema,
  reason: z.string(),
  created_at: z.string(),
});

export type OpportunityFeedbackLabel = z.infer<
  typeof OpportunityFeedbackLabelSchema
>;
export type OpportunityFeedback = z.infer<typeof OpportunityFeedbackSchema>;
