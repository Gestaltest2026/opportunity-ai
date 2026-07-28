import { z } from "zod";
import { ApplicantDomainSchema } from "../extraction/applicantSchema";

export const ClarificationQuestionDraftSchema = z.object({
  target_domain: ApplicantDomainSchema,
  question: z.string(),
  reason: z.string(),
  expected_information: z.string(),
});

export const ClarificationQuestionSchema = ClarificationQuestionDraftSchema.extend({
  question_id: z.string(),
  applicant_id: z.string(),
  opportunity_id: z.string(),
});

export type ClarificationQuestionDraft = z.infer<
  typeof ClarificationQuestionDraftSchema
>;
export type ClarificationQuestion = z.infer<typeof ClarificationQuestionSchema>;

export function isClarificationQuestionDraft(
  value: unknown
): value is ClarificationQuestionDraft {
  return ClarificationQuestionDraftSchema.safeParse(value).success;
}
