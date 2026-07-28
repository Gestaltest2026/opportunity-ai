import { z } from "zod";
import {
  ActionabilityStatusSchema,
  EligibilityStatusSchema,
  Match,
} from "./schema";

export const MatchGroundTruthSchema = z.object({
  applicant_id: z.string(),
  opportunity_id: z.string(),
  expected: z.object({
    eligibility_status: EligibilityStatusSchema,
    actionability_status: ActionabilityStatusSchema,
    supporting_claims_contain_any: z.array(z.string()),
    blockers_contain: z.array(z.string()),
  }),
  must_not_claim: z.array(z.string()),
});

export type MatchGroundTruth = z.infer<typeof MatchGroundTruthSchema>;

export interface MatchGroundTruthEvaluation {
  status_errors: string[];
  missing_supporting_signals: string[];
  missing_blocker_signals: string[];
  prohibited_claims: string[];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function anyContains(values: string[], signal: string): boolean {
  const normalizedSignal = normalize(signal);
  return values.some((value) => normalize(value).includes(normalizedSignal));
}

export function evaluateMatchGroundTruth(
  match: Match,
  groundTruth: MatchGroundTruth
): MatchGroundTruthEvaluation {
  const statusErrors: string[] = [];

  if (match.eligibility_status !== groundTruth.expected.eligibility_status) {
    statusErrors.push("eligibility_status");
  }

  if (match.actionability_status !== groundTruth.expected.actionability_status) {
    statusErrors.push("actionability_status");
  }

  const supportingSignalFound = groundTruth.expected.supporting_claims_contain_any.some(
    (signal) => anyContains(match.supporting_claims, signal)
  );

  const missingSupportingSignals = supportingSignalFound
    ? []
    : [...groundTruth.expected.supporting_claims_contain_any];

  const missingBlockerSignals = groundTruth.expected.blockers_contain.filter(
    (signal) => !anyContains(match.blockers, signal)
  );

  const allMatchText = [
    ...match.blockers,
    ...match.missing_information,
    ...match.supporting_claims,
    match.explanation,
    ...match.eligibility_evaluations.flatMap((evaluation) => [
      evaluation.criterion,
      evaluation.explanation,
      ...evaluation.supporting_claims,
    ]),
  ];

  const prohibitedClaims = groundTruth.must_not_claim.filter((signal) =>
    anyContains(allMatchText, signal)
  );

  return {
    status_errors: statusErrors,
    missing_supporting_signals: missingSupportingSignals,
    missing_blocker_signals: missingBlockerSignals,
    prohibited_claims: prohibitedClaims,
  };
}
