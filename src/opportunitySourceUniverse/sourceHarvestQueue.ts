import { z } from "zod";

export const SOURCE_HARVEST_PRIORITIES = ["critical", "high", "medium", "low"] as const;
export const SOURCE_HARVEST_CANDIDATE_STATUSES = [
  "query_only",
  "candidate_url_observed",
  "official_verification_needed",
  "ready_for_watchlist_insert",
  "rejected",
] as const;
export const SOURCE_HARVEST_QUEUE_STATUSES = [
  "HARVEST_QUEUE_REPAIR_REQUIRED",
  "READY_FOR_MANUAL_HARVEST",
  "READY_FOR_WATCHLIST_INSERTION",
] as const;
export const SOURCE_TYPE_HINTS = [
  "official_sponsor",
  "professional_body",
  "law_firm",
  "database",
  "aggregator",
  "pattern_archive",
  "unknown",
] as const;

export const SourceHarvestPrioritySchema = z.enum(SOURCE_HARVEST_PRIORITIES);
export const SourceHarvestCandidateStatusSchema = z.enum(SOURCE_HARVEST_CANDIDATE_STATUSES);
export const SourceHarvestQueueStatusSchema = z.enum(SOURCE_HARVEST_QUEUE_STATUSES);
export const SourceTypeHintSchema = z.enum(SOURCE_TYPE_HINTS);

export const SourceHarvestQueryTaskSchema = z
  .object({
    task_id: z.string().min(1),
    query: z.string().min(1),
    target_candidate_count: z.number().int().positive(),
    expected_source_types: z.array(SourceTypeHintSchema).min(1),
    required_verification_steps: z.array(z.string().min(1)).min(1),
    harvested_candidate_ids: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const SourceHarvestCandidateSchema = z
  .object({
    candidate_id: z.string().min(1),
    lane_id: z.string().min(1),
    title: z.string().min(1),
    url: z.string().url().nullable(),
    source_type_hint: SourceTypeHintSchema,
    status: SourceHarvestCandidateStatusSchema,
    evidence_basis: z.array(z.string().min(1)),
    blocker_notes: z.array(z.string().min(1)),
    next_action: z.string().min(1),
  })
  .strict();

export const SourceHarvestLaneSchema = z
  .object({
    lane_id: z.string().min(1),
    name: z.string().min(1),
    priority: SourceHarvestPrioritySchema,
    purpose: z.string().min(1),
    target_candidate_count: z.number().int().positive(),
    minimum_official_or_sponsor_candidates: z.number().int().nonnegative(),
    query_tasks: z.array(SourceHarvestQueryTaskSchema).min(1),
    guardrails: z.array(z.string().min(1)),
    notes: z.array(z.string().min(1)),
  })
  .strict();

export const SourceHarvestQueueSchema = z
  .object({
    applicant_id: z.string().min(1),
    generated_for: z.string().min(1),
    purpose: z.string().min(1),
    rules: z.array(z.string().min(1)),
    source_universe_current_count: z.number().int().nonnegative(),
    source_universe_phase_1_goal: z.number().int().positive(),
    harvest_queue_target_candidate_count: z.number().int().positive(),
    lanes: z.array(SourceHarvestLaneSchema).min(1),
    candidates: z.array(SourceHarvestCandidateSchema),
  })
  .strict();

export type SourceHarvestPriority = z.infer<typeof SourceHarvestPrioritySchema>;
export type SourceHarvestCandidateStatus = z.infer<typeof SourceHarvestCandidateStatusSchema>;
export type SourceHarvestQueueStatus = z.infer<typeof SourceHarvestQueueStatusSchema>;
export type SourceTypeHint = z.infer<typeof SourceTypeHintSchema>;
export type SourceHarvestQueryTask = z.infer<typeof SourceHarvestQueryTaskSchema>;
export type SourceHarvestCandidate = z.infer<typeof SourceHarvestCandidateSchema>;
export type SourceHarvestLane = z.infer<typeof SourceHarvestLaneSchema>;
export type SourceHarvestQueue = z.infer<typeof SourceHarvestQueueSchema>;

export interface SourceHarvestLaneReport {
  lane_id: string;
  name: string;
  priority: SourceHarvestPriority;
  target_candidate_count: number;
  query_task_count: number;
  query_target_candidate_count: number;
  harvested_candidate_count: number;
  ready_for_watchlist_insert_count: number;
  official_verification_needed_count: number;
  candidate_gap_count: number;
  official_or_sponsor_gap_count: number;
  next_queries: string[];
  guardrails: string[];
}

export interface SourceHarvestQueueReport {
  applicant_id: string;
  generated_at: string;
  status: SourceHarvestQueueStatus;
  purpose: string;
  source_universe_current_count: number;
  source_universe_phase_1_goal: number;
  source_universe_gap_count: number;
  harvest_queue_target_candidate_count: number;
  lane_count: number;
  query_task_count: number;
  query_target_candidate_count: number;
  harvested_candidate_count: number;
  ready_for_watchlist_insert_count: number;
  official_verification_needed_count: number;
  rejected_candidate_count: number;
  candidate_gap_count: number;
  highest_priority_next_lane_ids: string[];
  lane_reports: SourceHarvestLaneReport[];
  required_next_actions: string[];
  guardrails: string[];
}

const PRIORITY_WEIGHT: Record<SourceHarvestPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function nonnegativeGap(required: number, actual: number): number {
  return Math.max(0, required - actual);
}

function candidatesForLane(queue: SourceHarvestQueue, laneId: string): SourceHarvestCandidate[] {
  return queue.candidates.filter((candidate) => candidate.lane_id === laneId);
}

function laneOfficialOrSponsorCandidateCount(candidates: SourceHarvestCandidate[]): number {
  return candidates.filter(
    (candidate) =>
      candidate.source_type_hint === "official_sponsor" ||
      candidate.source_type_hint === "professional_body" ||
      candidate.source_type_hint === "law_firm"
  ).length;
}

function evaluateLane(queue: SourceHarvestQueue, lane: SourceHarvestLane): SourceHarvestLaneReport {
  const laneCandidates = candidatesForLane(queue, lane.lane_id);
  const readyForWatchlistInsertCount = laneCandidates.filter(
    (candidate) => candidate.status === "ready_for_watchlist_insert"
  ).length;
  const officialVerificationNeededCount = laneCandidates.filter(
    (candidate) => candidate.status === "official_verification_needed"
  ).length;
  const queryTargetCandidateCount = lane.query_tasks.reduce(
    (sum, task) => sum + task.target_candidate_count,
    0
  );

  return {
    lane_id: lane.lane_id,
    name: lane.name,
    priority: lane.priority,
    target_candidate_count: lane.target_candidate_count,
    query_task_count: lane.query_tasks.length,
    query_target_candidate_count: queryTargetCandidateCount,
    harvested_candidate_count: laneCandidates.length,
    ready_for_watchlist_insert_count: readyForWatchlistInsertCount,
    official_verification_needed_count: officialVerificationNeededCount,
    candidate_gap_count: nonnegativeGap(lane.target_candidate_count, laneCandidates.length),
    official_or_sponsor_gap_count: nonnegativeGap(
      lane.minimum_official_or_sponsor_candidates,
      laneOfficialOrSponsorCandidateCount(laneCandidates)
    ),
    next_queries: lane.query_tasks
      .filter((task) => task.harvested_candidate_ids.length < task.target_candidate_count)
      .slice(0, 5)
      .map((task) => task.query),
    guardrails: lane.guardrails,
  };
}

function computeStatus(queue: SourceHarvestQueue, laneReports: SourceHarvestLaneReport[]): SourceHarvestQueueStatus {
  if (queue.lanes.some((lane) => lane.query_tasks.length === 0)) {
    return "HARVEST_QUEUE_REPAIR_REQUIRED";
  }

  if (laneReports.some((lane) => lane.ready_for_watchlist_insert_count > 0)) {
    return "READY_FOR_WATCHLIST_INSERTION";
  }

  return "READY_FOR_MANUAL_HARVEST";
}

function requiredNextActionsFor(
  status: SourceHarvestQueueStatus,
  highestPriorityNextLaneIds: string[]
): string[] {
  if (status === "HARVEST_QUEUE_REPAIR_REQUIRED") {
    return [
      "Repair harvest lanes with missing query tasks before expanding the source universe.",
      "Do not add harvested candidates to the watchlist until the queue has at least one verification path per lane.",
    ];
  }

  if (status === "READY_FOR_WATCHLIST_INSERTION") {
    return [
      "Review ready_for_watchlist_insert candidates and convert only sponsor or official-source records into curated watchlist entries.",
      "Run strict eligibility gating after watchlist insertion; harvesting never creates application-ready status by itself.",
    ];
  }

  return [
    `Manually harvest the highest-priority lanes first: ${highestPriorityNextLaneIds.join(", ") || "none"}.`,
    "Capture candidate URLs with sponsor/official evidence first; keep aggregators as discovery leads only.",
    "No candidate source becomes application-ready at harvest time; every harvested source still needs verification and strict eligibility gating.",
  ];
}

export function evaluateSourceHarvestQueue(
  queue: SourceHarvestQueue,
  now: Date = new Date()
): SourceHarvestQueueReport {
  const laneReports = queue.lanes.map((lane) => evaluateLane(queue, lane));
  const queryTaskCount = queue.lanes.reduce((sum, lane) => sum + lane.query_tasks.length, 0);
  const queryTargetCandidateCount = laneReports.reduce(
    (sum, lane) => sum + lane.query_target_candidate_count,
    0
  );
  const readyForWatchlistInsertCount = queue.candidates.filter(
    (candidate) => candidate.status === "ready_for_watchlist_insert"
  ).length;
  const officialVerificationNeededCount = queue.candidates.filter(
    (candidate) => candidate.status === "official_verification_needed"
  ).length;
  const rejectedCandidateCount = queue.candidates.filter((candidate) => candidate.status === "rejected")
    .length;
  const candidateGapCount = nonnegativeGap(
    queue.harvest_queue_target_candidate_count,
    queue.candidates.length
  );
  const underharvestedLaneReports = laneReports.filter((lane) => lane.candidate_gap_count > 0);
  const highestPriorityNextLaneIds = [...underharvestedLaneReports]
    .sort((a, b) => {
      const priorityDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.candidate_gap_count - a.candidate_gap_count;
    })
    .slice(0, 5)
    .map((lane) => lane.lane_id);
  const status = computeStatus(queue, laneReports);

  return {
    applicant_id: queue.applicant_id,
    generated_at: now.toISOString(),
    status,
    purpose: queue.purpose,
    source_universe_current_count: queue.source_universe_current_count,
    source_universe_phase_1_goal: queue.source_universe_phase_1_goal,
    source_universe_gap_count: nonnegativeGap(
      queue.source_universe_phase_1_goal,
      queue.source_universe_current_count
    ),
    harvest_queue_target_candidate_count: queue.harvest_queue_target_candidate_count,
    lane_count: queue.lanes.length,
    query_task_count: queryTaskCount,
    query_target_candidate_count: queryTargetCandidateCount,
    harvested_candidate_count: queue.candidates.length,
    ready_for_watchlist_insert_count: readyForWatchlistInsertCount,
    official_verification_needed_count: officialVerificationNeededCount,
    rejected_candidate_count: rejectedCandidateCount,
    candidate_gap_count: candidateGapCount,
    highest_priority_next_lane_ids: highestPriorityNextLaneIds,
    lane_reports: laneReports,
    required_next_actions: requiredNextActionsFor(status, highestPriorityNextLaneIds),
    guardrails: queue.rules,
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

function laneTable(lanes: SourceHarvestLaneReport[]): string {
  if (lanes.length === 0) return "No lanes.";
  return [
    "| Lane | Priority | Queries | Harvested / Target | Gap | Ready inserts | Next queries |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- |",
    ...lanes.map(
      (lane) =>
        `| ${lane.name} | ${lane.priority} | ${lane.query_task_count} | ${lane.harvested_candidate_count} / ${lane.target_candidate_count} | ${lane.candidate_gap_count} | ${lane.ready_for_watchlist_insert_count} | ${lane.next_queries.slice(0, 2).join("<br>") || "None"} |`
    ),
  ].join("\n");
}

export function generateSourceHarvestQueueMarkdownReport(report: SourceHarvestQueueReport): string {
  return `# User #1 Legal / Paralegal Source Harvest Queue v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}
Status: ${report.status}

## Summary

| Metric | Value |
| --- | ---: |
| Current curated sources | ${report.source_universe_current_count} |
| Phase 1 source goal | ${report.source_universe_phase_1_goal} |
| Source universe gap | ${report.source_universe_gap_count} |
| Harvest target candidates | ${report.harvest_queue_target_candidate_count} |
| Query tasks | ${report.query_task_count} |
| Query target candidates | ${report.query_target_candidate_count} |
| Harvested candidates | ${report.harvested_candidate_count} |
| Candidate gap | ${report.candidate_gap_count} |
| Ready for watchlist insert | ${report.ready_for_watchlist_insert_count} |
| Official verification needed | ${report.official_verification_needed_count} |

## Purpose

${report.purpose}

## Required Next Actions

${markdownList(report.required_next_actions)}

## Highest-Priority Next Lanes

${markdownList(report.highest_priority_next_lane_ids)}

## Lane Table

${laneTable(report.lane_reports)}

## Guardrails

${markdownList(report.guardrails)}
`;
}
