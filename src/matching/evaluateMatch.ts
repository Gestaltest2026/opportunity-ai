import { Applicant } from "../extraction/applicantSchema";
import { callStructuredLLM } from "../llm/callStructuredLLM";
import { Opportunity } from "../opportunity/schema";
import { MATCH_ANALYSIS_PROMPT } from "./prompt";
import {
  ActionabilityStatus,
  EligibilityStatus,
  Match,
  MatchAnalysis,
  MatchAnalysisSchema,
  MatchCriterionEvaluation,
} from "./schema";

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
  const analysis = await callStructuredLLM({
    schema: MatchAnalysisSchema,
    instructions: MATCH_ANALYSIS_PROMPT,
    input: JSON.stringify({ applicant, opportunity }),
  });

  const eligibilityEvaluations = completeEligibilityEvaluations(
    opportunity,
    analysis
  );
  const eligibilityStatus = deriveEligibilityStatus(eligibilityEvaluations);
  const actionabilityStatus = deriveActionabilityStatus(opportunity);
  const missingEvaluations = eligibilityEvaluations
    .filter(
      (evaluation) =>
        evaluation.status === "unknown" &&
        !analysis.eligibility_evaluations.some(
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
    evidence_score: analysis.evidence_score,
    narrative_fit_score: analysis.narrative_fit_score,
    strategic_value_score: analysis.strategic_value_score,
    blockers: [...new Set([...analysis.blockers, ...availabilityBlocker])],
    missing_information: [
      ...new Set([...analysis.missing_information, ...missingEvaluations]),
    ],
    supporting_claims: analysis.supporting_claims,
    score: calculateScore(analysis, eligibilityStatus, actionabilityStatus),
    explanation: analysis.explanation,
  };
}
