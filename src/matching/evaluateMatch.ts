import OpenAI from "openai";
import { Applicant } from "../extraction/applicantSchema";
import { Opportunity } from "../opportunity/schema";
import { MATCH_ANALYSIS_PROMPT } from "./prompt";
import {
  ActionabilityStatus,
  EligibilityStatus,
  Match,
  MatchAnalysis,
  MatchCriterionEvaluation,
  isMatchAnalysis,
} from "./schema";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function completeEligibilityEvaluations(
  opportunity: Opportunity,
  analysis: MatchAnalysis
): MatchCriterionEvaluation[] {
  return opportunity.eligibility.map((criterion) => {
    const found = analysis.eligibility_evaluations.find(
      (evaluation) =>
        normalize(evaluation.criterion) === normalize(criterion.criterion)
    );

    return (
      found ?? {
        criterion: criterion.criterion,
        status: "unknown",
        supporting_claims: [],
        explanation: "Eligibility criterion was not evaluated; clarification is required.",
      }
    );
  });
}

function deriveEligibilityStatus(
  evaluations: MatchCriterionEvaluation[]
): EligibilityStatus {
  if (evaluations.some((item) => item.status === "not_met")) {
    return "ineligible";
  }

  if (evaluations.some((item) => item.status === "unknown")) {
    return "needs_clarification";
  }

  return "eligible";
}

function deriveActionabilityStatus(opportunity: Opportunity): ActionabilityStatus {
  switch (opportunity.availability_status) {
    case "open":
      return "actionable";
    case "closed":
      return "unavailable";
    case "upcoming":
      return "upcoming";
    default:
      return "unknown";
  }
}

function calculateScore(
  analysis: MatchAnalysis,
  eligibilityStatus: EligibilityStatus,
  actionabilityStatus: ActionabilityStatus
): number | null {
  if (eligibilityStatus !== "eligible" || actionabilityStatus !== "actionable") {
    return null;
  }

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

  const eligibilityEvaluations = completeEligibilityEvaluations(
    opportunity,
    parsed
  );
  const eligibilityStatus = deriveEligibilityStatus(eligibilityEvaluations);
  const actionabilityStatus = deriveActionabilityStatus(opportunity);
  const missingEvaluations = eligibilityEvaluations
    .filter(
      (evaluation) =>
        evaluation.status === "unknown" &&
        !parsed.eligibility_evaluations.some(
          (returned) =>
            normalize(returned.criterion) === normalize(evaluation.criterion)
        )
    )
    .map((evaluation) => evaluation.criterion);
  const availabilityBlocker =
    actionabilityStatus === "unavailable"
      ? ["Opportunity is currently closed."]
      : actionabilityStatus === "upcoming"
        ? ["Opportunity is not yet open."]
        : actionabilityStatus === "unknown"
          ? ["Opportunity availability is unknown."]
          : [];

  return {
    match_id: `${applicantId}:${opportunity.opportunity_id}`,
    applicant_id: applicantId,
    opportunity_id: opportunity.opportunity_id,
    eligibility_status: eligibilityStatus,
    actionability_status: actionabilityStatus,
    eligibility_evaluations: eligibilityEvaluations,
    evidence_score: parsed.evidence_score,
    narrative_fit_score: parsed.narrative_fit_score,
    strategic_value_score: parsed.strategic_value_score,
    blockers: [...new Set([...parsed.blockers, ...availabilityBlocker])],
    missing_information: [
      ...new Set([...parsed.missing_information, ...missingEvaluations]),
    ],
    supporting_claims: parsed.supporting_claims,
    score: calculateScore(parsed, eligibilityStatus, actionabilityStatus),
    explanation: parsed.explanation,
  };
}
