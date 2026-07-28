import { z } from "zod";

export const OUTCOME_RESULTS = [
  "pending",
  "awarded",
  "rejected",
  "waitlisted",
  "withdrawn",
] as const;

export const OutcomeResultSchema = z.enum(OUTCOME_RESULTS);
export const OutcomeSchema = z.object({
  outcome_id: z.string(),
  application_id: z.string(),
  applicant_id: z.string(),
  opportunity_id: z.string(),
  result: OutcomeResultSchema,
  award_amount: z.number().nullable(),
  currency: z.string().nullable(),
  decision_date: z.string().nullable(),
  feedback: z.string().nullable(),
});

export type OutcomeResult = z.infer<typeof OutcomeResultSchema>;
export type Outcome = z.infer<typeof OutcomeSchema>;
