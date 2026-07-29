import { z } from "zod";

export const ExceptionTypeSchema = z.enum([
  "candidate_classification_ambiguity",
  "extraction_ambiguity",
  "conflicting_official_sources",
  "eligibility_taxonomy_ambiguity",
  "duplicate_identity_ambiguity",
]);

export const ExceptionStatusSchema = z.enum([
  "open",
  "resolved",
  "dismissed",
]);

export const ExceptionResumeStageSchema = z.enum([
  "classification",
  "intake",
  "opportunity_normalization",
  "matching",
]);

export const HumanExceptionSchema = z
  .object({
    exception_id: z.string(),
    exception_type: ExceptionTypeSchema,
    status: ExceptionStatusSchema,
    source_id: z.string().nullable(),
    candidate_id: z.string().nullable(),
    opportunity_id: z.string().nullable(),
    summary: z.string(),
    evidence: z.array(z.string()),
    human_decision_needed: z.string(),
    resume_stage: ExceptionResumeStageSchema,
    created_at: z.string(),
    resolved_at: z.string().nullable(),
    resolution_note: z.string().nullable(),
  })
  .strict();

export const HumanExceptionQueueSchema = z
  .object({
    exceptions: z.array(HumanExceptionSchema),
  })
  .strict();

export type HumanException = z.infer<typeof HumanExceptionSchema>;
export type HumanExceptionQueue = z.infer<typeof HumanExceptionQueueSchema>;

export function enqueueException(
  queue: HumanExceptionQueue,
  exception: HumanException
): HumanExceptionQueue {
  const existing = queue.exceptions.find(
    (item) => item.exception_id === exception.exception_id
  );

  if (existing) return queue;

  return {
    exceptions: [...queue.exceptions, HumanExceptionSchema.parse(exception)],
  };
}

export function resolveException(
  queue: HumanExceptionQueue,
  exceptionId: string,
  resolutionNote: string,
  resolvedAt: string = new Date().toISOString()
): HumanExceptionQueue {
  return {
    exceptions: queue.exceptions.map((item) =>
      item.exception_id === exceptionId
        ? {
            ...item,
            status: "resolved" as const,
            resolved_at: resolvedAt,
            resolution_note: resolutionNote,
          }
        : item
    ),
  };
}
