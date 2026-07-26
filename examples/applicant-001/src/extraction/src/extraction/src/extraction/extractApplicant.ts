import OpenAI from "openai";
import { APPLICANT_EXTRACTION_PROMPT } from "./prompt";
import type { ApplicantExtraction } from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractApplicant(
  applicantId: string,
  sourceText: string
): Promise<ApplicantExtraction> {
  if (!sourceText.trim()) {
    throw new Error("Applicant source text is empty.");
  }

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: APPLICANT_EXTRACTION_PROMPT,
    input: `
Applicant ID: ${applicantId}

SOURCE MATERIALS:

${sourceText}
`,
  });

  const output = response.output_text;

  if (!output) {
    throw new Error("The model returned no output.");
  }

  try {
    return JSON.parse(output) as ApplicantExtraction;
  } catch {
    throw new Error(
      `Applicant extraction did not return valid JSON.\n\nRaw output:\n${output}`
    );
  }
}
