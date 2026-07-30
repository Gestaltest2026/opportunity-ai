import type { CuratedOpportunityWatchlist } from "./schema";
import {
  buildUser001OpportunityShortlist,
  generateUser001EvidenceRequestMarkdown,
  generateUser001ShortlistMarkdown,
} from "./user001Shortlist";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const fixture: CuratedOpportunityWatchlist = {
  applicant_id: "applicant-001",
  generated_for: "User #1 shortlist deterministic evaluation",
  purpose: "Verify guarded shortlist generation without network or LLM calls.",
  rules: [
    "Rough observations are not recommendations.",
    "Official-source verification is required before applicant action.",
  ],
  sources: [
    {
      source_id: "open-but-missing-evidence",
      name: "Open But Missing Evidence",
      url: "https://example.org/open",
      provider: "Example Foundation",
      source_tier: "official",
      source_role: "application_source",
      opportunity_classes: ["scholarship"],
      eligibility_signals: ["woman", "financial need", "full-time enrollment"],
      narrative_signals: ["family responsibility"],
      funder_intent_signals: ["need_based_mobility"],
      user_001_relevance: "high",
      watch_reason: ["Fixture open source"],
      actionability: "application_ready",
      current_status: "open",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-30T00:00:00.000Z",
      last_success_at: "2026-07-30T00:00:00.000Z",
      last_changed_at: "2026-07-30T00:00:00.000Z",
      content_hash: "hash-open",
      last_observed_signal_summary:
        "signal_hits=scholarship, woman, financial need, full-time enrollment",
      failure_count: 0,
      notes: ["Fixture"],
    },
    {
      source_id: "closed-next-cycle",
      name: "Closed Next Cycle",
      url: "https://example.org/closed",
      provider: "Example University",
      source_tier: "official",
      source_role: "application_source",
      opportunity_classes: ["foundation scholarship"],
      eligibility_signals: ["FAFSA", "GPA"],
      narrative_signals: ["donor alignment"],
      funder_intent_signals: ["merit_retention"],
      user_001_relevance: "high",
      watch_reason: ["Fixture closed source"],
      actionability: "watch_next_cycle",
      current_status: "closed",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-30T00:00:00.000Z",
      last_success_at: "2026-07-30T00:00:00.000Z",
      last_changed_at: "2026-07-30T00:00:00.000Z",
      content_hash: "hash-closed",
      last_observed_signal_summary: "signal_hits=foundation scholarship, FAFSA, GPA",
      failure_count: 0,
      notes: ["Fixture"],
    },
    {
      source_id: "blocked-source",
      name: "Blocked Source",
      url: "https://example.org/blocked",
      provider: "Example Directory",
      source_tier: "aggregator",
      source_role: "discovery_source",
      opportunity_classes: ["scholarship"],
      eligibility_signals: ["legal studies"],
      narrative_signals: ["public service"],
      funder_intent_signals: ["legal_profession_access"],
      user_001_relevance: "medium",
      watch_reason: ["Fixture blocked source"],
      actionability: "needs_verification",
      current_status: "unknown",
      verification_policy: "aggregator_must_be_verified_at_sponsor",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-30T00:00:00.000Z",
      last_success_at: null,
      last_changed_at: null,
      content_hash: null,
      last_observed_signal_summary: null,
      failure_count: 2,
      notes: ["Fixture"],
    },
    {
      source_id: "clean-application-ready",
      name: "Clean Application Ready",
      url: "https://example.org/ready",
      provider: "Example Provider",
      source_tier: "official",
      source_role: "application_source",
      opportunity_classes: ["program"],
      eligibility_signals: ["confirmed applicant fact"],
      narrative_signals: ["confirmed narrative"],
      funder_intent_signals: ["confirmed intent"],
      user_001_relevance: "high",
      watch_reason: ["Fixture ready source"],
      actionability: "application_ready",
      current_status: "open",
      verification_policy: "official_source_required",
      enabled: true,
      refresh_interval_hours: 24,
      last_checked_at: "2026-07-30T00:00:00.000Z",
      last_success_at: "2026-07-30T00:00:00.000Z",
      last_changed_at: "2026-07-30T00:00:00.000Z",
      content_hash: "hash-ready",
      last_observed_signal_summary: "signal_hits=confirmed applicant fact",
      failure_count: 0,
      notes: ["Fixture"],
    },
  ],
};

const shortlist = buildUser001OpportunityShortlist(
  fixture,
  new Date("2026-07-30T00:00:00.000Z")
);

assert(
  shortlist.buckets.NEEDS_VERIFICATION.some(
    (item) => item.source_id === "open-but-missing-evidence"
  ),
  "Open source with missing evidence must remain NEEDS_VERIFICATION"
);
assert(
  !shortlist.buckets.APPLICATION_READY.some(
    (item) => item.source_id === "open-but-missing-evidence"
  ),
  "Missing evidence must block APPLICATION_READY"
);
assert(
  shortlist.buckets.WATCH_NEXT_CYCLE.some((item) => item.source_id === "closed-next-cycle"),
  "Closed watch source must be WATCH_NEXT_CYCLE"
);
assert(
  shortlist.buckets.SOURCE_ACCESS_BLOCKED.some((item) => item.source_id === "blocked-source"),
  "Failed source without successful observation must be SOURCE_ACCESS_BLOCKED"
);
assert(
  shortlist.buckets.APPLICATION_READY.some((item) => item.source_id === "clean-application-ready"),
  "Clean open source with no inferred missing evidence can be APPLICATION_READY"
);
assert(
  generateUser001ShortlistMarkdown(shortlist).includes(
    "This shortlist is a triage artifact, not final scholarship advice."
  ),
  "Shortlist report must preserve triage guardrail"
);
assert(
  generateUser001EvidenceRequestMarkdown(shortlist).includes("Financial need evidence"),
  "Evidence request should surface missing need evidence"
);

console.log(
  JSON.stringify(
    {
      user_001_shortlist_evaluation: "passed",
      counts: shortlist.counts,
    },
    null,
    2
  )
);
