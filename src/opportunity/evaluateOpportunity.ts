import { z } from "zod";
import {
  Opportunity,
  OpportunityAvailabilityStatusSchema,
  OpportunityTypeSchema,
} from "./schema";

export const ExpectedOpportunitySchema = z.object({
  title_contains: z.string(),
  provider_contains: z.string(),
  opportunity_type: OpportunityTypeSchema,
  availability_status: OpportunityAvailabilityStatusSchema,
  deadline: z.string().nullable(),
  eligibility_contains: z.array(z.string()),
  selection_preferences_contains: z.array(z.string()),
  application_requirements_contains: z.array(z.string()),
});

export const OpportunityGroundTruthSchema = z.object({
  opportunity_id: z.string(),
  expected: ExpectedOpportunitySchema,
  must_not_infer: z.array(z.string()),
});

export type ExpectedOpportunity = z.infer<typeof ExpectedOpportunitySchema>;
export type OpportunityGroundTruth = z.infer<typeof OpportunityGroundTruthSchema>;

export interface OpportunityEvaluation {
  scalar_errors: string[];
  missing_expected_signals: string[];
  prohibited_inferences: string[];
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
    opportunity.availability_status,
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

  if (opportunity.availability_status !== groundTruth.expected.availability_status) {
    scalarErrors.push("availability_status");
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
  };
}
