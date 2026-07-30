import type { CuratedOpportunitySource, CuratedOpportunityWatchlist } from "./schema";
import { mergeCuratedWatchlists } from "./mergeCuratedWatchlists";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function source(source_id: string, provider: string): CuratedOpportunitySource {
  return {
    source_id,
    name: source_id,
    url: `https://example.org/${source_id}`,
    provider,
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
  };
}

function watchlist(sources: CuratedOpportunitySource[]): CuratedOpportunityWatchlist {
  return {
    applicant_id: "applicant-001",
    generated_for: "fixture",
    purpose: "fixture",
    rules: ["Rough observations are not recommendations."],
    sources,
  };
}

const base = watchlist([source("base-a", "Base"), source("shared", "Base")]);
const additions = [
  watchlist([source("added-a", "Additions"), source("shared", "Additions")]),
  watchlist([source("added-b", "More Additions")]),
];

const result = mergeCuratedWatchlists(base, additions);
const ids = result.watchlist.sources.map((item) => item.source_id);

assert(result.base_source_count === 2, "Expected base count to be preserved");
assert(result.input_source_count === 5, "Expected input count to include duplicate candidate");
assert(result.merged_source_count === 4, "Expected merged count to dedupe shared source");
assert(ids.includes("base-a"), "Expected base source to remain");
assert(ids.includes("added-a"), "Expected first new source to be added");
assert(ids.includes("added-b"), "Expected second new source to be added");
assert(
  result.watchlist.sources.find((item) => item.source_id === "shared")?.provider === "Base",
  "Existing source state must win over addition duplicate"
);
assert(result.duplicate_source_ids.includes("shared"), "Expected duplicate source to be reported");
assert(
  result.added_source_ids.join(",") === "added-a,added-b",
  "Expected deterministic added source order"
);

console.log(
  JSON.stringify(
    {
      curated_watchlist_merge_evaluation: "passed",
      merged_source_count: result.merged_source_count,
      added_source_ids: result.added_source_ids,
      duplicate_source_ids: result.duplicate_source_ids,
    },
    null,
    2
  )
);
