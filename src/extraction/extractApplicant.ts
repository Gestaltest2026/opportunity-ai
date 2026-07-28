import { callStructuredLLM } from "../llm/callStructuredLLM";
import { APPLICANT_EXTRACTION_PROMPT } from "./prompt";
import {
  ApplicantExtraction,
  ApplicantExtractionSchema,
} from "./schema";

export async function extractApplicant(
  applicantId: string,
  sourceText: string
): Promise<ApplicantExtraction> {
  const parsed = await callStructuredLLM({
    schema: ApplicantExtractionSchema.omit({ applicant_id: true }),
    instructions: APPLICANT_EXTRACTION_PROMPT,
    input: sourceText,
  });

  return ApplicantExtractionSchema.parse({
    ...parsed,
    applicant_id: applicantId,
  });
}
