import type { CuratedOpportunityWatchlist } from "./schema";
import { mergeCuratedWatchlists } from "./mergeCuratedWatchlists";
import {
  evaluateSourceUniverseCoverage,
  generateSourceCoverageMarkdownReport,
  type SourceCoverageReport,
} from "./sourceCoverage";
import {
  analyzeWatchlistMaintenance,
  generateWatchlistMaintenanceMarkdownReport,
  type WatchlistMaintenanceReport,
} from "./watchlistMaintenance";

export const PHASE_2_READINESS_STATUSES = [
  "BLOCKED_REPAIR_REQUIRED",
  "PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR",
  "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE",
] as const;

export type Phase2ReadinessStatus = (typeof PHASE_2_READINESS_STATUSES)[number];

export interface Phase2ReadinessReport {
  applicant_id: string;
  generated_at: string;
  status: Phase2ReadinessStatus;
  source_universe_v0_complete: boolean;
  phase_3_allowed: boolean;
  phase_3_deferral_reason: string;
  primary_source_count: number;
  staged_source_count: number;
  merged_source_count: number;
  coverage_completed: boolean;
  maintenance_blocking_issue_count: number;
  coverage_gap_count: number;
  blocking_issues: string[];
  coverage_gaps: string[];
  required_next_actions: string[];
  user_action_gate: string;
  generated_artifacts: string[];
  guardrails: string[];
  coverage: SourceCoverageReport;
  maintenance: WatchlistMaintenanceReport;
}

function combineStagedAdditions(
  primary: CuratedOpportunityWatchlist,
  stagedAdditions: CuratedOpportunityWatchlist[]
): CuratedOpportunityWatchlist {
  const merged = mergeCuratedWatchlists(
    {
      ...primary,
      sources: [],
    },
    stagedAdditions
  );

  return {
    ...primary,
    generated_for: "Combined staged Phase 2 additions for maintenance/readiness analysis",
    purpose:
      "Represent all staged Phase 2 additions as one synthetic watchlist for deterministic maintenance and readiness checks.",
    sources: merged.watchlist.sources,
  };
}

function statusFor(
  maintenance: WatchlistMaintenanceReport,
  coverage: SourceCoverageReport
): Phase2ReadinessStatus {
  if (maintenance.blocking_issues.length > 0) return "BLOCKED_REPAIR_REQUIRED";
  if (!coverage.completion_completed) return "PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR";
  return "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE";
}

function requiredNextActionsFor(
  status: Phase2ReadinessStatus,
  coverage: SourceCoverageReport,
  maintenance: WatchlistMaintenanceReport
): string[] {
  if (status === "BLOCKED_REPAIR_REQUIRED") {
    return [
      "Repair blocking maintenance issues before expanding or using the source universe.",
      "Do not add more sources until duplicate IDs, applicant mismatches, or suspicious application-ready states are resolved.",
    ];
  }

  if (status === "PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR") {
    return [
      "Use the coverage gaps to guide the next curated additions or source-state repair.",
      "Keep additions source-level only; do not introduce crawler behavior, LLM extraction, or applicant-facing recommendations.",
      "Let the scheduled monitor observe unobserved official sources before treating them as stable inputs.",
    ];
  }

  const actions = [
    "Stop expanding the source universe by default; treat Phase 2 as v0-complete unless a specific gap is found.",
    "Collect User #1 missing evidence: GPA, FAFSA/financial need, enrollment load, Florida residency, first-degree status, and updated resume/personal statement.",
    "Select one NEEDS_VERIFICATION or WATCH_NEXT_CYCLE source for a real inquiry/application preparation step.",
    "Record the inquiry/application outcome before considering Phase 3 autonomous discovery.",
  ];

  if (maintenance.source_access_blocked_ids.length > 0) {
    actions.push(
      "Manually verify automation access-blocked sources in a browser rather than deleting them."
    );
  }

  return actions;
}

export function evaluatePhase2Readiness(
  primary: CuratedOpportunityWatchlist,
  stagedAdditions: CuratedOpportunityWatchlist[],
  now: Date = new Date()
): Phase2ReadinessReport {
  if (stagedAdditions.length === 0) {
    throw new Error("Phase 2 readiness requires at least one staged additions watchlist.");
  }

  const combinedStaged = combineStagedAdditions(primary, stagedAdditions);
  const merged = mergeCuratedWatchlists(primary, stagedAdditions).watchlist;
  const maintenance = analyzeWatchlistMaintenance(primary, combinedStaged, now);
  const coverage = evaluateSourceUniverseCoverage(merged, undefined, now);
  const status = statusFor(maintenance, coverage);
  const sourceUniverseV0Complete =
    status === "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE" &&
    maintenance.blocking_issues.length === 0 &&
    coverage.completion_completed;

  return {
    applicant_id: primary.applicant_id,
    generated_at: now.toISOString(),
    status,
    source_universe_v0_complete: sourceUniverseV0Complete,
    phase_3_allowed: false,
    phase_3_deferral_reason:
      "Phase 3 autonomous discovery remains deferred until Phase 2 is v0-complete and at least one User #1 inquiry/application has been executed and recorded from the curated universe.",
    primary_source_count: primary.sources.length,
    staged_source_count: stagedAdditions.reduce(
      (sum, addition) => sum + addition.sources.length,
      0
    ),
    merged_source_count: merged.sources.length,
    coverage_completed: coverage.completion_completed,
    maintenance_blocking_issue_count: maintenance.blocking_issues.length,
    coverage_gap_count: coverage.coverage_gaps.length,
    blocking_issues: maintenance.blocking_issues,
    coverage_gaps: coverage.coverage_gaps,
    required_next_actions: requiredNextActionsFor(status, coverage, maintenance),
    user_action_gate:
      "No further strategic expansion should replace collecting missing User #1 evidence and executing at least one real inquiry/application from the curated universe.",
    generated_artifacts: [
      "examples/applicant-001/source-universe-maintenance-v0.md",
      "examples/applicant-001/source-universe-coverage-v0.md",
      "examples/applicant-001/opportunity-shortlist-v0.md",
      "examples/applicant-001/user-001-evidence-request-v0.md",
      "examples/applicant-001/phase-2-readiness-v0.md",
    ],
    guardrails: [
      "This readiness gate does not recommend scholarships or infer User #1 eligibility.",
      "A complete source universe is not the same as an application-ready opportunity.",
      "Missing User #1 evidence still blocks application-ready classification.",
      "Aggregator and pattern-only sources remain discovery/pattern inputs, not eligibility proof.",
      "Phase 3 autonomous discovery is explicitly blocked until a real User #1 inquiry/application has happened.",
    ],
    coverage,
    maintenance,
  };
}

function markdownList(values: string[]): string {
  if (values.length === 0) return "- None";
  return values.map((value) => `- ${value}`).join("\n");
}

export function generatePhase2ReadinessMarkdownReport(
  report: Phase2ReadinessReport
): string {
  return `# User #1 Phase 2 Readiness Gate v0

Generated at: ${report.generated_at}
Applicant: ${report.applicant_id}
Status: ${report.status}

## Summary

| Metric | Value |
| --- | ---: |
| Primary sources | ${report.primary_source_count} |
| Staged sources | ${report.staged_source_count} |
| Merged source count | ${report.merged_source_count} |
| Coverage complete | ${report.coverage_completed ? "yes" : "no"} |
| Maintenance blocking issues | ${report.maintenance_blocking_issue_count} |
| Coverage gaps | ${report.coverage_gap_count} |
| Source universe v0 complete | ${report.source_universe_v0_complete ? "yes" : "no"} |
| Phase 3 allowed | ${report.phase_3_allowed ? "yes" : "no"} |

## Phase 3 Deferral

${report.phase_3_deferral_reason}

## Required Next Actions

${markdownList(report.required_next_actions)}

## Blocking Issues

${markdownList(report.blocking_issues)}

## Coverage Gaps

${markdownList(report.coverage_gaps)}

## User Action Gate

${report.user_action_gate}

## Generated Artifacts To Inspect

${markdownList(report.generated_artifacts)}

## Guardrails

${markdownList(report.guardrails)}

---

${generateWatchlistMaintenanceMarkdownReport(report.maintenance)}

---

${generateSourceCoverageMarkdownReport(report.coverage)}
`;
}
