import { OpportunityDatabank } from "../databank/schema";
import { OpportunitySchema } from "../opportunity/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { detectOpportunityChange, opportunitiesNeedingRematch } from "./changeDetection";
import { isStale } from "./refreshSources";
import { OpportunitySourceSchema } from "./schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const opportunity = OpportunitySchema.parse({
  opportunity_id: "opportunity-test",
  title: "Example Scholarship",
  provider: "Example University",
  opportunity_type: "scholarship",
  availability_status: "open",
  award: { amount: 1000, currency: "USD", description: null },
  deadline: { date: "2026-12-01", timezone: null, description: null },
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
});

const empty: OpportunityDatabank = { records: [] };
const first = upsertOpportunity(
  empty,
  opportunity,
  "https://example.edu/scholarship",
  "source v1",
  "2026-07-29T00:00:00.000Z"
);

const rawOnly = upsertOpportunity(
  first,
  opportunity,
  "https://example.edu/scholarship",
  "source v1 with harmless page chrome change",
  "2026-07-30T00:00:00.000Z"
);
const rawOnlySignal = detectOpportunityChange(
  first,
  rawOnly,
  "source-test",
  opportunity.opportunity_id
);
assert(rawOnlySignal.raw_changed, "Expected raw source change");
assert(!rawOnlySignal.semantic_changed, "Raw-only change must not be semantic");
assert(
  opportunitiesNeedingRematch([rawOnlySignal]).length === 0,
  "Raw-only change must not trigger rematch"
);

const changedOpportunity = OpportunitySchema.parse({
  ...opportunity,
  deadline: { date: "2026-12-15", timezone: null, description: null },
});
const semantic = upsertOpportunity(
  rawOnly,
  changedOpportunity,
  "https://example.edu/scholarship",
  "source v2 deadline changed",
  "2026-07-31T00:00:00.000Z"
);
const semanticSignal = detectOpportunityChange(
  rawOnly,
  semantic,
  "source-test",
  opportunity.opportunity_id
);
assert(semanticSignal.semantic_changed, "Expected semantic change");
assert(
  opportunitiesNeedingRematch([semanticSignal])[0] === opportunity.opportunity_id,
  "Semantic change must trigger rematch"
);

const staleSource = OpportunitySourceSchema.parse({
  source_id: "source-test",
  opportunity_id: opportunity.opportunity_id,
  url: "https://example.edu/scholarship",
  provider: "Example University",
  source_type: "official_opportunity_page",
  enabled: true,
  refresh_interval_hours: 24,
  last_fetched_at: "2026-07-29T00:00:00.000Z",
  last_success_at: "2026-07-27T00:00:00.000Z",
  failure_count: 2,
});
assert(
  isStale(staleSource, new Date("2026-07-30T00:00:00.000Z")),
  "Repeated failures beyond two refresh intervals must surface as stale"
);

console.log(
  JSON.stringify(
    {
      raw_vs_semantic_change: "valid",
      rematch_on_semantic_only: "valid",
      stale_source_signal: "valid",
    },
    null,
    2
  )
);
