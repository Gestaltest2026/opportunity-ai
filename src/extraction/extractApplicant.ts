import OpenAI from "openai";
import { APPLICANT_EXTRACTION_PROMPT } from "./prompt";
import {
  ApplicantExtraction,
  isApplicantExtraction,
} from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractApplicant(
  applicantId: string,
  sourceText: string
): Promise<ApplicantExtraction> {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: APPLICANT_EXTRACTION_PROMPT,
    input: sourceText,
  });

  const raw = response.output_text;

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Applicant extraction returned invalid JSON.");
  }

  const candidate =
    parsed && typeof parsed === "object"
      ? { ...(parsed as Record<string, unknown>), applicant_id: applicantId }
      : parsed;

  if (!isApplicantExtraction(candidate)) {
    throw new Error("Applicant extraction failed schema validation.");
  }

  return candidate;
}
