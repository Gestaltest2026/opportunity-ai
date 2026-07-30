import { z } from "zod";

export const SOURCE_EXPANSION_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export const SOURCE_EXPANSION_LANE_STATUSES = [
  "underseeded",
  "ready_for_curated_harvest",
  "saturated_for_v1",
  "blocked",
] as const;
export const SOURCE_UNIVERSE_EXPANSION_STATUSES = [
  "SOURCE_UNIVERSE_UNDERSEEDED",
  "LANE_REPAIR_REQUIRED",
  "READY_FOR_CURATED_HARVEST",
] as const;

export const SourceExpansionPrioritySchema = z.enum(SOURCE_EXPANSION_PRIORITIES);
export const SourceExpansionLaneStatusSchema = z.enum(SOURCE_EXPANSION_LANE_STATUSES);
export const SourceUniverseExpansionStatusSchema = z.enum(
  SOURCE_UNIVERSE_EXPANSION_STATUSES
);

export const SourceExpansionLaneSchema = z
  .object({
    lane_id: z.string().min(1),
    name: z.string().min(1),
    priority: SourceExpansionPrioritySchema,
    purpose: z.string().min(1),
    target_source_count: z.number().int().positive(),
    minimum_official_or_semi_official_sources: z.number().int().nonnegative(),
    minimum_application_sources: z.number().int().nonnegative(),
    required_source_types: z.array(z.string().min(1)),
    applicant_fit_signals: z.array(z.string().min(1)),
    acquisition_queries: z.array(z.string().min(1)),
    current_seed_source_ids: z.array(z.string().min(1)),
    current_official_or_semi_official_seed_count: z.number().int().nonnegative(),
    current_application_seed_count: z.number().int().nonnegative(),
    next_harvest_action: z.string().min(1),
    status: SourceExpansionLaneStatusSchema,
    guardrails: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const SourceExpansionPlanSchema = z
  .object({
    applicant_id: z.string().min(1),
    generated_for: z.string().min(1),
    purpose: z.string().min(1),
    rules: z.array(z.string().min(1)),
    current_known_curated_source_count: z.number().int().nonnegative(),
    phase_1_curated_source_goal: z.number().int().positive(),
    total_source_universe_goal: z.number().int().positive(),
    lanes: z.array(SourceExpansionLaneSchema).min(1),
  })
  .strict();

export type SourceExpansionPriority = z.infer<typeof SourceExpansionPrioritySchema>;
export type SourceExpansionLaneStatus = z.infer<typeof SourceExpansionLaneStatusSchema>;
export type SourceUniverseExpansionStatus = z.infer<typeof SourceUniverseExpansionStatusSchema>;
export type SourceExpansionLane = z.infer<typeof SourceExpansionLaneSchema>;
export type SourceExpansionPlan = z.infer<typeof SourceExpansionPlanSchema>;

export interface SourceExpansionLaneReport {
  lane_id: string;
  name: string;
  priority: SourceExpansionPriority;
  status: SourceExpansionLaneStatus;
  target_source_count: number;
  current_seed_count: number;
  source_gap_count: number;
  official_or_semi_official_gap_count: number;
  application_source_gap_count: number;
  next_harvest_action: string;
  acquisition_queries: string[];
  guardrails: string[];
}

export interface SourceExpansionReport {
  applicant_id: string;
  generated_at: string;
  status: SourceUniverseExpansionStatus;
  purpose: string;
  current_known_curated_source_count: number;
  phase_1_curated_source_goal: number;
  total_source_universe_goal: number;
  source_universe_gap_count: number;
  lane_count: number;
  underseeded_lane_count: number;
  blocked_lane_count: number;
  critical_underseeded_lane_ids: string[];
  highest_priority_next_lane_ids: string[];
  lane_reports: SourceExpansionLaneReport[];
  required_next_actions: string[];
  guardrails: string[];
}

const PRIORITY_WEIGHT: Record<SourceExpansionPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function nonnegativeGap(required: number, actual: number): number {
  return Math.max(0, required - actual);
}

function evaluateLane(lane: SourceExpansionLane): SourceExpansionLaneReport {
  const currentSeedCount = lane.current_seed_source_ids.length;
  return {
    lane_id: lane.lane_id,
    name: lane.name,
    priority: lane.priority,
    status: lane.status,
    target_source_count: lane.target_source_count,
    current_seed_count: currentSeedCount,
    source_gap_count: nonnegativeGap(lane.target_source_count, currentSeedCount),
    official_or_semi_official_gap_count: nonnegativeGap(
      lane.minimum_official_or_semi_official_sources,
      lane.current_official_or_semi_official_seed_count
    ),
    application_source_gap_count: nonnegativeGap(
      lane.minimum_application_sources,
      lane.current_application_seed_count
    ),
    next_harvest_action: lane.next_harvest_action,
    acquisition_queries: lane.acquisition_queries,
    guardrails: lane.guardrails,
  };
}

function computeStatus(plan: SourceExpansionPlan, laneReports: SourceExpansionLaneReport[]): SourceUniverseExpansionStatus {
  if (laneReports.some((lane) => lane.status === "blocked")) {
    return "LANE_REPAIR_REQUIRED";
  }

  if (plan.current_known_curated_source_count < plan.phase_1_curated_source_goal) {
    return "SOURCE_UNIVERSE_UNDERSEEDED";
  }

  if (
    laneReports.some(
      (lane) =>
        lane.priority === "critical" &&
        (lane.source_gap_count > 0 ||
          lane.official_or_semi_official_gap_count > 0 ||
          lane.application_source_gap_count > 0)
    )
  ) {
    return "LANE_REPAIR_REQUIRED";
  }

  return "READY_FOR_CURATED_HARVEST";
}

function requiredNextActionsFor(
  status: SourceUniverseExpansionStatus,
  highestPriorityLaneIds: string[]
): string[] {
  if (status === "SOURCE_UNIVERSE_UNDERSEEDED") {
    return [
      "Expand the Opportunity Source Universe before asking for three application-ready scholarships.",
      `Prioritize these lanes first: ${highestPriorityLaneIds.join(", ") || "none"}.`,
      "Harvest sources into a queue first; do not claim applicant eligibility until strict eligibility gate confirms the source.",
    ];
  }

  if (status === "LANE_REPAIR_REQUIRED") {
    return [
      "Repair blocked or critical underseeded lanes before running broad candidate ranking.",
      `Focus first on: ${highestPriorityLaneIds.join(", ") || "none"}.`,
      "Keep aggregator leads separate from official application sources.",
    ];
  }

  return [
    "Run curated harvesting against the highest-yield lanes and convert verified sources into opportunity records.",
    "Keep strict eligibility gating downstream so the system can return zero application-ready opportunities when evidence is missing.",
  ];
}

export function evaluateSourceExpansionPlan(
  plan: SourceExpansionPlan,
  now: Date = new Date()
): SourceExpansionReport {
  const laneReports = plan.lanes.map(evaluateLane);
  const underseededLaneReports = laneReports.filter(
    (lane) =>
      lane.source_gap_count > 0 ||
      lane.official_or_semi_official_gap_count > 0 ||
      lane.application_source_gap_count > 0
  );
  const blockedLaneReports = laneReports.filter((lane) => lane.status === "blocked");
  const criticalUnderseededLaneIds = underseededLaneReports
    .filter((lane) => lane.priority === "critical")
    .map((lane) => lane.lane_id)
    .sort();
  const highestPriorityNextLaneIds = [...underseededLaneReports]
    .sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.source_gap_count - a.source_gap_count;
    })
    .slice(0, 5)
    .map((lane) => lane.lane_id);
  const status = computeStatus(plan, laneReports);

  return {
    applicant_id: plan.applicant_id,
    generated_at: now.toISOString(),
    status,
    purpose: plan.purpose,
    current_known_curated_source_count: plan.current_known_curated_source_count,
    phase_1_curated_source_goal: plan.phase_1_curated_source_goal,
    total_source_universe_goal: plan.total_source_universe_goal,
    source_universe_gap_count: nonnegativeGap(
      plan.phase_1_curated_source_goal,
      plan.current_known_curated_source_count
    ),
    lane_count: laneReports.length,
    underseeded_lane_count: underseededLaneReports.length,
    blocked_lane_count: blockedLaneReports.length,
    critical_underseeded_lane_ids: criticalUnderseededLaneIds,
    highest_priority_next_lane_ids: highestPriorityNextLaneIds,
    lane_reports: laneReports,
    required_next_actions: requiredNextActionsFor(status, highestPriorityNextLaneIds),
    guardrails: plan.rules,
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function laneTable(lanes: SourceExpansionLaneReport[]): string {
  if (lanes.length === 0) return "No lanes.";
  return [
    "| Lane | Priority | Status | Current / Target | Gap | Next action |",
    "| --- | --- | --- | ---: | ---: | --- |",
    ...lanes.map(
      (lane) =>
        `| ${lane.name} | ${lane.priority} | ${lane.status} | ${lane.current_seed_count} / ${lane.target_source_count} | ${lane.source_gap_count} | ${lane.next_harvest_action} |`
    ),
  ].join("\n");
}

export function generateSourceExpansionMarkdownReport(report: SourceExpansionReport): string {
  return `# User #1 Opportunity Source Universe Expansion Lanes v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}
Status: ${report.status}

## Summary

| Metric | Value |
| --- | ---: |
| Current curated sources | ${report.current_known_curated_source_count} |
| Phase 1 curated source goal | ${report.phase_1_curated_source_goal} |
| Phase 1 source gap | ${report.source_universe_gap_count} |
| Total source universe goal | ${report.total_source_universe_goal} |
| Expansion lanes | ${report.lane_count} |
| Underseeded lanes | ${report.underseeded_lane_count} |
| Blocked lanes | ${report.blocked_lane_count} |

## Purpose

${report.purpose}

## Required Next Actions

${markdownList(report.required_next_actions)}

## Highest-Priority Next Lanes

${markdownList(report.highest_priority_next_lane_ids)}

## Critical Underseeded Lanes

${markdownList(report.critical_underseeded_lane_ids)}

## Lane Table

${laneTable(report.lane_reports)}

## Guardrails

${markdownList(report.guardrails)}
`;
}
