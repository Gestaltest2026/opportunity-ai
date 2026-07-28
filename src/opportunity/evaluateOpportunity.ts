import { Opportunity } from "./schema";

interface ExpectedOpportunity {
  title_contains: string;
  provider_contains: string;
  opportunity_type: Opportunity["opportunity_type"];
  deadline: string | null;
  eligibility_contains: string[];
  selection_preferences_contains: string[];
  application_requirements_contains: string[];
}

export interface OpportunityGroundTruth {
  expected: ExpectedOpportunity;
  must_not_infer: string[];
  known_source_state: "open" | "closed" | "unknown";
}

export interface OpportunityEvaluation {
  scalar_errors: string[];
  missing_expected_signals: string[];
  prohibited_inferences: string[];
  known_source_state: OpportunityGroundTruth["known_source_state"];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function containsSignal(values: string[], signal: string): boolean {
  const normalizedSignal = normalize(signal);
  return values.some((value) => normalize(value).includes(normalizedSignal));
}

function flattenOpportunity(opportunity: Opportunity): string[] {
  return [
    opportunity.title,
    opportunity.provider,
    opportunity.award.description ?? "",
    opportunity.deadline ?? "",
    ...opportunity.eligibility.flatMap((item) => [item.criterion, item.evidence]),
    ...opportunity.selection_preferences.flatMap((item) => [
      item.criterion,
      item.evidence,
    ]),
    ...opportunity.narrative_preferences,
    ...opportunity.application_requirements,
    ...opportunity.restrictions,
    ...opportunity.source_evidence,
  ];
}

export function evaluateOpportunity(
  opportunity: Opportunity,
  groundTruth: OpportunityGroundTruth
): OpportunityEvaluation {
  const scalarErrors: string[] = [];
  const missingExpectedSignals: string[] = [];

  if (!normalize(opportunity.title).includes(normalize(groundTruth.expected.title_contains))) {
    scalarErrors.push("title");
  }

  if (!normalize(opportunity.provider).includes(normalize(groundTruth.expected.provider_contains))) {
    scalarErrors.push("provider");
  }

  if (opportunity.opportunity_type !== groundTruth.expected.opportunity_type) {
    scalarErrors.push("opportunity_type");
  }

  if (opportunity.deadline !== groundTruth.expected.deadline) {
    scalarErrors.push("deadline");
  }

  const eligibilityValues = opportunity.eligibility.flatMap((item) => [
    item.criterion,
    item.evidence,
  ]);
  for (const signal of groundTruth.expected.eligibility_contains) {
    if (!containsSignal(eligibilityValues, signal)) {
      missingExpectedSignals.push(`eligibility:${signal}`);
    }
  }

  const selectionValues = opportunity.selection_preferences.flatMap((item) => [
    item.criterion,
    item.evidence,
  ]);
  for (const signal of groundTruth.expected.selection_preferences_contains) {
    if (!containsSignal(selectionValues, signal)) {
      missingExpectedSignals.push(`selection_preferences:${signal}`);
    }
  }

  for (const signal of groundTruth.expected.application_requirements_contains) {
    if (!containsSignal(opportunity.application_requirements, signal)) {
      missingExpectedSignals.push(`application_requirements:${signal}`);
    }
  }

  const allValues = flattenOpportunity(opportunity);
  const prohibitedInferences = groundTruth.must_not_infer.filter((signal) =>
    containsSignal(allValues, signal)
  );

  return {
    scalar_errors: scalarErrors,
    missing_expected_signals: missingExpectedSignals,
    prohibited_inferences: prohibitedInferences,
    known_source_state: groundTruth.known_source_state,
  };
}
