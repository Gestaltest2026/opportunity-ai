import OpenAI from "openai";
import { OPPORTUNITY_EXTRACTION_PROMPT } from "./prompt";
import { Opportunity, isOpportunity } from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractOpportunity(
  opportunityId: string,
  sourceText: string
): Promise<Opportunity> {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: OPPORTUNITY_EXTRACTION_PROMPT,
    input: sourceText,
  });

  const raw = response.output_text;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("Opportunity extraction returned invalid JSON.");
  }

  const candidate =
    parsed && typeof parsed === "object"
      ? { ...(parsed as Record<string, unknown>), opportunity_id: opportunityId }
      : parsed;

  if (!isOpportunity(candidate)) {
    throw new Error("Opportunity extraction failed schema validation.");
  }

  return candidate;
}
