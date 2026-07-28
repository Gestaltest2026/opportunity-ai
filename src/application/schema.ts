import { z } from "zod";

export const APPLICATION_STATUSES = [
  "selected",
  "drafting",
  "ready",
  "submitted",
  "withdrawn",
] as const;

export const ApplicationStatusSchema = z.enum(APPLICATION_STATUSES);
export const ApplicationEssaySchema = z.object({
  prompt: z.string(),
  draft: z.string(),
  supporting_claims: z.array(z.string()),
});

export const ApplicationSchema = z.object({
  application_id: z.string(),
  applicant_id: z.string(),
  opportunity_id: z.string(),
  match_id: z.string(),
  status: ApplicationStatusSchema,
  requirements: z.array(z.string()),
  documents: z.array(z.string()),
  essays: z.array(ApplicationEssaySchema),
  missing_items: z.array(z.string()),
  submitted_at: z.string().nullable(),
  notes: z.array(z.string()),
});

export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>;
export type ApplicationEssay = z.infer<typeof ApplicationEssaySchema>;
export type Application = z.infer<typeof ApplicationSchema>;
