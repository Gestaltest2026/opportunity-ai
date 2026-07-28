import OpenAI from "openai";
import { Applicant } from "../extraction/applicantSchema";
import { Opportunity } from "../opportunity/schema";
import { MATCH_ANALYSIS_PROMPT } from "./prompt";
import {
  EligibilityStatus,
  Match,
  MatchAnalysis,
  isMatchAnalysis,
} from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function deriveEligibilityStatus(analysis: MatchAnalysis): EligibilityStatus {
  if (analysis.eligibility_evaluations.some((item) => item.status === "not_met")) {
    return "ineligible";
  }

  if (analysis.eligibility_evaluations.some((item) => item.status === "unknown")) {
    return "needs_clarification";
  }

  return "eligible";
}

function calculateScore(analysis: MatchAnalysis, status: EligibilityStatus): number | null {
  if (status !== "eligible") return null;

  return (
    analysis.evidence_score * 0.4 +
    analysis.narrative_fit_score * 0.4 +
    analysis.strategic_value_score * 0.2
  );
}

export async function evaluateMatch(
  applicantId: string,
  applicant: Applicant,
  opportunity: Opportunity
): Promise<Match> {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: MATCH_ANALYSIS_PROMPT,
    input: JSON.stringify({ applicant, opportunity }),
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(response.output_text);
  } catch {
    throw new Error("Match analysis returned invalid JSON.");
  }

  if (!isMatchAnalysis(parsed)) {
    throw new Error("Match analysis failed schema validation.");
  }

  const eligibilityStatus = deriveEligibilityStatus(parsed);

  return {
    match_id: `${applicantId}:${opportunity.opportunity_id}`,
    applicant_id: applicantId,
    opportunity_id: opportunity.opportunity_id,
    eligibility_status: eligibilityStatus,
    eligibility_evaluations: parsed.eligibility_evaluations,
    evidence_score: parsed.evidence_score,
    narrative_fit_score: parsed.narrative_fit_score,
    strategic_value_score: parsed.strategic_value_score,
    blockers: parsed.blockers,
    missing_information: parsed.missing_information,
    supporting_claims: parsed.supporting_claims,
    score: calculateScore(parsed, eligibilityStatus),
    explanation: parsed.explanation,
  };
}
