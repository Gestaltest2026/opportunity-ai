import OpenAI from "openai";
import { Applicant } from "../extraction/applicantSchema";
import { Match } from "../matching/schema";
import { Opportunity } from "../opportunity/schema";
import { CLARIFICATION_PROMPT } from "./prompt";
import {
  ClarificationQuestion,
  isClarificationQuestionDraft,
} from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateClarificationQuestion(
  applicantId: string,
  applicant: Applicant,
  opportunity: Opportunity,
  match: Match
): Promise<ClarificationQuestion | null> {
  if (match.eligibility_status !== "needs_clarification") {
    return null;
  }

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: CLARIFICATION_PROMPT,
    input: JSON.stringify({ applicant, opportunity, match }),
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.output_text);
  } catch {
    throw new Error("Clarification generation returned invalid JSON.");
  }

  if (!isClarificationQuestionDraft(parsed)) {
    throw new Error("Clarification generation failed schema validation.");
  }

  return {
    question_id: `${applicantId}:${opportunity.opportunity_id}:${parsed.target_domain}`,
    applicant_id: applicantId,
    opportunity_id: opportunity.opportunity_id,
    ...parsed,
  };
}
