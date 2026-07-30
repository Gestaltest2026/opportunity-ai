import type { CuratedOpportunitySource, CuratedOpportunityWatchlist } from "./schema";
import {
  evaluatePhase2Readiness,
  generatePhase2ReadinessMarkdownReport,
} from "./phase2ReadinessGate";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const baseSource: Omit<CuratedOpportunitySource, "source_id" | "name" | "url"> = {
  provider: "Fixture Provider",
  source_tier: "official",
  source_role: "application_source",
  opportunity_classes: ["scholarship"],
  eligibility_signals: ["undergraduate"],
  narrative_signals: ["student persistence"],
  funder_intent_signals: ["need_based_mobility"],
  user_001_relevance: "high",
  watch_reason: ["Fixture source"],
  actionability: "needs_verification",
  current_status: "recurring",
  verification_policy: "official_source_required",
  enabled: true,
  refresh_interval_hours: 168,
  last_checked_at: null,
  last_success_at: null,
  last_changed_at: null,
  content_hash: null,
  last_observed_signal_summary: null,
  failure_count: 0,
  notes: ["Fixture"],
};

function makeSource(
  index: number,
  overrides: Partial<CuratedOpportunitySource> = {}
): CuratedOpportunitySource {
  return {
    ...baseSource,
    source_id: `fixture-source-${index}`,
    name: `Fixture Source ${index}`,
    url: `https://example.org/source-${index}`,
    ...overrides,
  };
}

function makeWatchlist(sources: CuratedOpportunitySource[]): CuratedOpportunityWatchlist {
  return {
    applicant_id: "applicant-001",
    generated_for: "Phase 2 readiness fixture",
    purpose: "Verify Phase 2 readiness gate without network or LLM calls.",
    rules: [
      "Rough observations are not recommendations.",
      "Official-source verification is required before applicant action.",
    ],
    sources,
  };
}

const primary = makeWatchlist([
  makeSource(1, {
    source_id: "fgcu-primary",
    name: "FGCU Primary",
    provider: "Florida Gulf Coast University",
    opportunity_classes: ["university internal scholarship"],
    eligibility_signals: ["FGCU undergraduate", "FAFSA", "financial need"],
    narrative_signals: ["institutional fit"],
    funder_intent_signals: ["merit_retention"],
    actionability: "watch_next_cycle",
    current_status: "closed",
  }),
]);

const incompleteStaged = makeWatchlist([
  makeSource(2, {
    source_id: "adult-women-source",
    name: "Adult Women Source",
    provider: "Fixture Women Foundation",
    eligibility_signals: ["woman", "adult learner", "financial need"],
    narrative_signals: ["returning learner", "family responsibility"],
    funder_intent_signals: ["women_advancement", "adult_education_completion"],
  }),
]);

const incomplete = evaluatePhase2Readiness(primary, [incompleteStaged], new Date("2026-07-30T00:00:00.000Z"));
assert(
  incomplete.status === "PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR",
  "Small fixture should be incomplete, not complete."
);
assert(incomplete.phase_3_allowed === false, "Phase 3 must remain blocked.");
assert(incomplete.coverage_gap_count > 0, "Incomplete fixture should have coverage gaps.");

const categoryFixtures: CuratedOpportunitySource[] = [
  makeSource(10, {
    source_id: "fgcu-internal",
    name: "FGCU Internal",
    provider: "Florida Gulf Coast University",
    opportunity_classes: ["university internal scholarship"],
    eligibility_signals: ["FGCU undergraduate", "FAFSA", "financial need"],
    narrative_signals: ["institutional fit"],
    funder_intent_signals: ["merit_retention"],
    actionability: "watch_next_cycle",
    current_status: "closed",
  }),
  makeSource(11, {
    source_id: "florida-public-aid",
    name: "Florida Public Aid",
    provider: "Florida Department of Education",
    opportunity_classes: ["state aid"],
    eligibility_signals: ["Florida resident", "state aid", "financial need"],
    narrative_signals: ["education affordability"],
    funder_intent_signals: ["state_student_support"],
    source_role: "monitoring_source",
    user_001_relevance: "medium",
  }),
  makeSource(12, {
    source_id: "adult-returning",
    name: "Adult Returning Learner",
    provider: "Adult Learner Foundation",
    eligibility_signals: ["adult learner", "returning student", "first bachelor"],
    narrative_signals: ["education after interruption"],
    funder_intent_signals: ["adult_education_completion"],
  }),
  makeSource(13, {
    source_id: "women-mothers",
    name: "Women Mothers Caregivers",
    provider: "Women Foundation",
    eligibility_signals: ["woman", "mother", "dependent child"],
    narrative_signals: ["family responsibility"],
    funder_intent_signals: ["women_advancement"],
  }),
  makeSource(14, {
    source_id: "legal-paralegal",
    name: "Legal Paralegal Public Service",
    provider: "Paralegal Association",
    opportunity_classes: ["paralegal scholarship"],
    eligibility_signals: ["legal studies", "paralegal"],
    narrative_signals: ["public service"],
    funder_intent_signals: ["legal_profession_access"],
  }),
  makeSource(15, {
    source_id: "local-swfl",
    name: "Southwest Florida Community Foundation",
    provider: "Southwest Florida Community Foundation",
    opportunity_classes: ["community foundation scholarship"],
    eligibility_signals: ["Lee County", "Collier County"],
    narrative_signals: ["local civic"],
    funder_intent_signals: ["community_service"],
    source_role: "monitoring_source",
  }),
  makeSource(16, {
    source_id: "discovery-archive",
    name: "Scholarship Directory Archive",
    provider: "Directory Fixture",
    source_tier: "aggregator",
    source_role: "discovery_source",
    opportunity_classes: ["scholarship directory"],
    eligibility_signals: ["directory"],
    narrative_signals: ["broad discovery"],
    funder_intent_signals: ["opportunity_discovery"],
    user_001_relevance: "medium",
    actionability: "pattern_only",
    current_status: "pattern_only",
    verification_policy: "aggregator_must_be_verified_at_sponsor",
  }),
];

const fillerSources = Array.from({ length: 43 }, (_, index) =>
  makeSource(index + 100, {
    source_id: `filler-${index}`,
    name: `Filler Official Application Source ${index}`,
    provider: index < 33 ? "Florida Gulf Coast University" : "Archive Fixture",
    source_tier: index < 32 ? "official" : "archive",
    source_role: index < 20 ? "application_source" : index < 33 ? "monitoring_source" : "pattern_archive",
    opportunity_classes: index < 33 ? ["FGCU scholarship"] : ["scholarship directory archive"],
    eligibility_signals:
      index < 15 ? ["woman", "financial need", "FGCU undergraduate"] : ["FGCU undergraduate"],
    narrative_signals: index < 15 ? ["returning learner"] : ["student persistence"],
    funder_intent_signals: index < 15 ? ["women_advancement"] : ["need_based_mobility"],
    user_001_relevance: index < 15 ? "high" : index < 33 ? "medium" : "pattern_only",
    actionability: index < 12 ? "watch_next_cycle" : index < 33 ? "needs_verification" : "pattern_only",
    current_status: index < 12 ? "upcoming" : index < 33 ? "recurring" : "pattern_only",
    verification_policy: index < 33 ? "official_source_required" : "pattern_only_no_recommendation",
  })
);

const completeStaged = makeWatchlist([...categoryFixtures, ...fillerSources]);
const complete = evaluatePhase2Readiness(
  makeWatchlist([]),
  [completeStaged],
  new Date("2026-07-30T00:00:00.000Z")
);

assert(
  complete.status === "PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE",
  `Expected complete fixture, got ${complete.status}`
);
assert(complete.source_universe_v0_complete, "Complete fixture should mark source universe complete.");
assert(complete.phase_3_allowed === false, "Even complete Phase 2 must not allow Phase 3 automatically.");
assert(
  generatePhase2ReadinessMarkdownReport(complete).includes("Phase 3 Deferral"),
  "Markdown report should preserve Phase 3 deferral."
);

console.log(
  JSON.stringify(
    {
      phase_2_readiness_evaluation: "passed",
      incomplete_status: incomplete.status,
      complete_status: complete.status,
      complete_phase_3_allowed: complete.phase_3_allowed,
    },
    null,
    2
  )
);
