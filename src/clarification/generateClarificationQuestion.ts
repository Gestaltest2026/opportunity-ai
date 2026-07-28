import { Applicant } from "../extraction/applicantSchema";
import { callStructuredLLM } from "../llm/callStructuredLLM";
import { Match } from "../matching/schema";
import { Opportunity } from "../opportunity/schema";
import { CLARIFICATION_PROMPT } from "./prompt";
import {
  ClarificationQuestion,
  ClarificationQuestionDraftSchema,
} from "./schema";

export async function generateClarificationQuestion(
  applicantId: string,
  applicant: Applicant,
  opportunity: Opportunity,
  match: Match
): Promise<ClarificationQuestion | null> {
  if (match.eligibility_status !== "needs_clarification") {
    return null;
  }

  const draft = await callStructuredLLM({
    schema: ClarificationQuestionDraftSchema,
    instructions: CLARIFICATION_PROMPT,
    input: JSON.stringify({ applicant, opportunity, match }),
  });

  return {
    question_id: `${applicantId}:${opportunity.opportunity_id}:${draft.target_domain}`,
    applicant_id: applicantId,
    opportunity_id: opportunity.opportunity_id,
    ...draft,
  };
}
