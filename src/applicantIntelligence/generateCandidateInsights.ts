import { z } from "zod";
import { callStructuredLLM } from "../llm/callStructuredLLM";
import type { CanonicalApplicantView } from "./canonicalApplicantAdapter";
import {
  ApplicantIntelligenceNodeSchema,
  InsightChainSchema,
  type ApplicantIntelligenceNode,
} from "./benchmarkSchema";

const CandidateInsightChainSchema = InsightChainSchema.pick({
  chain_id: true,
  nodes: true,
}).extend({
  opportunity_directions: z.array(z.never()).default([]),
  trusted_opportunities: z.array(z.never()).default([]),
  key_question: z.null().default(null),
  next_action: z.null().default(null),
  human_evaluation: z.null().default(null),
});

const CandidateInsightGenerationSchema = z.object({
  candidate_chains: z.array(CandidateInsightChainSchema).min(3).max(5),
});

export type CandidateInsightGeneration = z.infer<
  typeof CandidateInsightGenerationSchema
>;

const INSTRUCTIONS = `
You generate Applicant Intelligence candidate insight chains from canonical Applicant evidence.

Return 3 to 5 chains only.

Each chain must be auditable and follow this conceptual path where supported:
FACT -> RELATION -> PATTERN -> ABSTRACTION or CONCEPT -> optional HYPOTHESIS.

Rules:
- Never invent Applicant facts.
- Preserve source claim IDs exactly in supporting_claims.
- OBSERVED nodes must be direct restatements of supplied canonical claims.
- RELATION, PATTERN, ABSTRACTION, CONCEPT, and HYPOTHESIS nodes must not pretend to be observed facts.
- Missing financial need, low-income status, first-generation status, ethnicity, immigration status, or other unsupported sensitive/consequential attributes must not be inferred.
- Applicant goals or intent belong to the self model only when explicitly supported.
- External capability/value/fit interpretations belong to the market model.
- Prefer specific, useful compression over generic labels such as resilience or leadership.
- Each node must include a concise reasoning_bridge and a condition that could weaken or clarify the claim.
- Do not generate Opportunity directions, concrete Opportunities, questions, actions, or evaluation yet.
`;

export async function generateCandidateInsights(
  applicant: CanonicalApplicantView
): Promise<CandidateInsightGeneration> {
  const result = await callStructuredLLM({
    schema: CandidateInsightGenerationSchema,
    instructions: INSTRUCTIONS,
    input: JSON.stringify(applicant),
  });

  // Re-parse nodes explicitly so this boundary fails closed if future schema changes drift.
  for (const chain of result.candidate_chains) {
    chain.nodes.forEach((node: ApplicantIntelligenceNode) =>
      ApplicantIntelligenceNodeSchema.parse(node)
    );
  }

  return result;
}
