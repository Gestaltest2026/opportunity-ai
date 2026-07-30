import type { CuratedOpportunityWatchlist } from "./schema";
import {
  analyzeWatchlistMaintenance,
  generateWatchlistMaintenanceMarkdownReport,
} from "./watchlistMaintenance";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function source(overrides: Partial<CuratedOpportunityWatchlist["sources"][number]>): CuratedOpportunityWatchlist["sources"][number] {
  return {
    source_id: "source-default",
    name: "Default Source",
    url: "https://example.org/default",
    provider: "Example",
    source_tier: "official",
    source_role: "monitoring_source",
    opportunity_classes: ["scholarship"],
    eligibility_signals: ["undergraduate"],
    narrative_signals: ["student persistence"],
    funder_intent_signals: ["need_based_mobility"],
    user_001_relevance: "medium",
    watch_reason: ["Fixture"],
    actionability: "monitor_only",
    current_status: "recurring",
    verification_policy: "official_source_required",
    enabled: true,
    refresh_interval_hours: 24,
    last_checked_at: null,
    last_success_at: null,
    last_changed_at: null,
    content_hash: null,
    last_observed_signal_summary: null,
    failure_count: 0,
    notes: ["Fixture"],
    ...overrides,
  };
}

const primary: CuratedOpportunityWatchlist = {
  applicant_id: "applicant-001",
  generated_for: "Maintenance fixture primary",
  purpose: "Verify maintenance audit behavior.",
  rules: ["Rough observations are not recommendations."],
  sources: [
    source({
      source_id: "observed-official",
      name: "Observed Official",
      url: "https://example.org/observed",
      last_checked_at: "2026-07-30T00:00:00.000Z",
      last_success_at: "2026-07-30T00:00:00.000Z",
      content_hash: "hash-observed",
      last_observed_signal_summary: "signal_hits=scholarship",
    }),
    source({
      source_id: "blocked-source",
      name: "Blocked Source",
      url: "https://example.org/blocked",
      failure_count: 2,
      user_001_relevance: "high",
    }),
  ],
};

const staged: CuratedOpportunityWatchlist = {
  applicant_id: "applicant-001",
  generated_for: "Maintenance fixture staged",
  purpose: "Verify staged additions.",
  rules: ["Staged sources are not recommendations."],
  sources: [
    source({
      source_id: "staged-new-high",
      name: "Staged New High",
      url: "https://example.org/staged-new-high",
      user_001_relevance: "high",
      actionability: "needs_verification",
    }),
    source({
      source_id: "observed-official",
      name: "Duplicate Existing",
      url: "https://example.org/duplicate",
    }),
  ],
};

const report = analyzeWatchlistMaintenance(
  primary,
  staged,
  new Date("2026-07-30T00:00:00.000Z")
);

assert(report.primary_source_count === 2, "Expected two primary sources");
assert(report.staged_source_count === 2, "Expected two staged sources");
assert(report.merged_source_count_estimate === 3, "Expected merged estimate of three");
assert(
  report.staged_sources_not_yet_in_primary.includes("staged-new-high"),
  "Expected new staged source to be reported"
);
assert(
  report.staged_sources_already_in_primary.includes("observed-official"),
  "Expected existing staged duplicate to be reported"
);
assert(
  report.source_access_blocked_ids.includes("blocked-source"),
  "Expected blocked source to be reported"
);
assert(
  report.high_relevance_unobserved_source_ids.includes("staged-new-high"),
  "Expected high-relevance unobserved staged source to be reported"
);
assert(report.blocking_issues.length === 0, "Expected no blocking issues");
assert(
  generateWatchlistMaintenanceMarkdownReport(report).includes(
    "Maintenance audits source hygiene; it does not recommend scholarships."
  ),
  "Expected markdown to preserve guardrails"
);

const suspiciousPrimary: CuratedOpportunityWatchlist = {
  ...primary,
  sources: [
    source({
      source_id: "suspicious-ready",
      name: "Suspicious Ready",
      url: "https://example.org/suspicious-ready",
      actionability: "application_ready",
      current_status: "recurring",
      last_success_at: null,
      content_hash: null,
    }),
  ],
};

const suspiciousReport = analyzeWatchlistMaintenance(
  suspiciousPrimary,
  { ...staged, sources: [] },
  new Date("2026-07-30T00:00:00.000Z")
);

assert(
  suspiciousReport.suspicious_application_ready_source_ids.includes("suspicious-ready"),
  "Expected suspicious application-ready state"
);
assert(
  suspiciousReport.blocking_issues.length === 1,
  "Expected suspicious application-ready state to block maintenance"
);

console.log(
  JSON.stringify(
    {
      watchlist_maintenance_evaluation: "passed",
      merged_source_count_estimate: report.merged_source_count_estimate,
      staged_sources_not_yet_in_primary: report.staged_sources_not_yet_in_primary.length,
      access_blocked_sources: report.source_access_blocked_ids.length,
      suspicious_ready_blocked: suspiciousReport.blocking_issues.length,
    },
    null,
    2
  )
);
