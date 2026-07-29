import type { FetchedSource } from "../discovery/fetchSource";
import type { CuratedOpportunityWatchlist } from "./schema";
import {
  generateCuratedWatchlistMarkdownReport,
  runCuratedWatchlist,
  type SourceFetcher,
} from "./curatedWatchlist";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fixture: CuratedOpportunityWatchlist = {
  applicant_id: "applicant-001",
  generated_for: "User #1 deterministic evaluation",
  purpose: "Verify curated watchlist monitoring without network or LLM calls.",
  rules: [
    "Rough observations are not recommendations.",
    "Official-source verification is required before applicant action.",
  ],
  sources: [
    {
      source_id: "due-first-observation",
      name: "Due First Observation",
      url: "https://example.org/first",
      provider: "Example",
      source_tier: "official",
      source_role: "monitoring_source",
      opportunity_classes: ["scholarship"],
      eligibility_signals: ["transfer student", "undergraduate"],
      narrative_signals: ["returning learner"],
      funder_intent_signals: ["merit_retention"],
      user_001_relevance: "high",
      watch_reason: ["Fixture source"],
      actionability: "needs_verification",
      current_status: "unknown",
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
    },
    {
      source_id: "due-changed-observation",
      name: "Due Changed Observation",
      url: "https://example.org/changed",
      provider: "Example",
      source_tier: "official",
      source_role: "monitoring_source",
      opportunity_classes: ["grant"],
      eligibility_signals: ["woman", "financial need"],
      narrative_signals: ["family responsibility"],
      funder_intent_signals: ["need_based_mobility"],
      user_001_relevance: "high",
      watch_reason: ["Fixture source"],
      actionability: "needs_verification",
      current_status: "recurring",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-28T00:00:00.000Z",
      last_success_at: "2026-07-28T00:00:00.000Z",
      last_changed_at: "2026-07-28T00:00:00.000Z",
      content_hash: "old-hash",
      last_observed_signal_summary: "old summary",
      failure_count: 0,
      notes: ["Fixture"],
    },
    {
      source_id: "not-due-observation",
      name: "Not Due Observation",
      url: "https://example.org/not-due",
      provider: "Example",
      source_tier: "official",
      source_role: "monitoring_source",
      opportunity_classes: ["scholarship"],
      eligibility_signals: ["legal studies"],
      narrative_signals: ["public service"],
      funder_intent_signals: ["legal_profession_access"],
      user_001_relevance: "medium",
      watch_reason: ["Fixture source"],
      actionability: "monitor_only",
      current_status: "unknown",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-29T23:00:00.000Z",
      last_success_at: "2026-07-29T23:00:00.000Z",
      last_changed_at: "2026-07-29T23:00:00.000Z",
      content_hash: "not-due-hash",
      last_observed_signal_summary: "not due summary",
      failure_count: 0,
      notes: ["Fixture"],
    },
    {
      source_id: "due-failure",
      name: "Due Failure",
      url: "https://example.org/fail",
      provider: "Example",
      source_tier: "official",
      source_role: "monitoring_source",
      opportunity_classes: ["scholarship"],
      eligibility_signals: ["adult learner"],
      narrative_signals: ["education after interruption"],
      funder_intent_signals: ["adult_education_completion"],
      user_001_relevance: "high",
      watch_reason: ["Fixture source"],
      actionability: "needs_verification",
      current_status: "unknown",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: null,
      last_success_at: null,
      last_changed_at: null,
      content_hash: null,
      last_observed_signal_summary: null,
      failure_count: 1,
      notes: ["Fixture"],
    },
  ],
};

const fetchedUrls: string[] = [];

const fetcher: SourceFetcher = async (url: string): Promise<FetchedSource> => {
  fetchedUrls.push(url);

  if (url.includes("fail")) {
    throw new Error("fixture failure");
  }

  return {
    url,
    fetched_at: "2026-07-30T00:00:00.000Z",
    content_type: "text/plain",
    source_text:
      "Scholarship deadline August 1. Transfer student undergraduate award for women with financial need and returning learner family responsibility.",
  };
};

const result = await runCuratedWatchlist(fixture, {
  now: new Date("2026-07-30T00:00:00.000Z"),
  fetcher,
});

assert(result.report.attempted_sources === 3, "Expected three attempted sources");
assert(result.report.skipped_not_due === 1, "Expected one not-due source");
assert(
  result.report.first_observation_source_ids.includes("due-first-observation"),
  "Expected first-observation source to be recorded"
);
assert(
  result.report.changed_source_ids.includes("due-changed-observation"),
  "Expected changed source to be recorded"
);
assert(result.report.failed_sources.length === 1, "Expected one failed source");
assert(
  !fetchedUrls.includes("https://example.org/not-due"),
  "Not-due source must not be fetched"
);
assert(
  result.watchlist.sources.find((source) => source.source_id === "due-failure")
    ?.failure_count === 2,
  "Failure count should increment"
);
assert(
  generateCuratedWatchlistMarkdownReport(result).includes(
    "Rough observations are not recommendations."
  ),
  "Markdown report should preserve guardrails"
);

console.log(
  JSON.stringify(
    {
      curated_watchlist_evaluation: "passed",
      attempted_sources: result.report.attempted_sources,
      skipped_not_due: result.report.skipped_not_due,
      failed_sources: result.report.failed_sources.length,
    },
    null,
    2
  )
);
