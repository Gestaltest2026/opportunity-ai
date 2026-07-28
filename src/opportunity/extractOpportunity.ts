import { callStructuredLLM } from "../llm/callStructuredLLM";
import { OPPORTUNITY_EXTRACTION_PROMPT } from "./prompt";
import { Opportunity, OpportunitySchema } from "./schema";

export async function extractOpportunity(
  opportunityId: string,
  sourceText: string
): Promise<Opportunity> {
  const parsed = await callStructuredLLM({
    schema: OpportunitySchema.omit({ opportunity_id: true }),
    instructions: OPPORTUNITY_EXTRACTION_PROMPT,
    input: sourceText,
  });

  return OpportunitySchema.parse({
    ...parsed,
    opportunity_id: opportunityId,
  });
}
