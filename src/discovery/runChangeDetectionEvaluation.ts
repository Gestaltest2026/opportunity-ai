import { OpportunityDatabank } from "../databank/schema";
import { OpportunitySchema } from "../opportunity/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { detectOpportunityChange, opportunitiesNeedingRematch } from "./changeDetection";
import { isStale } from "./refreshSources";
import { OpportunitySourceSchema } from "./schema";

function assertStep(name: string, condition: unknown, details: unknown): asserts condition {
  if (!condition) {
    console.error(JSON.stringify({ failed_step: name, details }, null, 2));
    throw new Error(`Change loop regression failed: ${name}`);
  }
  console.log(`[change-loop] ${name}: ok`);
}

const opportunity = OpportunitySchema.parse({
  opportunity_id: "opportunity-test",
  title: "Example Scholarship",
  provider: "Example University",
  opportunity_type: "scholarship",
  availability_status: "open",
  award: { amount: 1000, currency: "USD", description: null },
  deadline: "2026-12-01",
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
  source_evidence: ["Official scholarship page"],
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
assertStep("raw source changed", rawOnlySignal.raw_changed, rawOnlySignal);
assertStep("raw-only not semantic", !rawOnlySignal.semantic_changed, rawOnlySignal);
assertStep(
  "raw-only does not rematch",
  opportunitiesNeedingRematch([rawOnlySignal]).length === 0,
  opportunitiesNeedingRematch([rawOnlySignal])
);

const changedOpportunity = OpportunitySchema.parse({
  ...opportunity,
  deadline: "2026-12-15",
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
assertStep("semantic change detected", semanticSignal.semantic_changed, semanticSignal);
assertStep(
  "semantic change rematches",
  opportunitiesNeedingRematch([semanticSignal])[0] === opportunity.opportunity_id,
  opportunitiesNeedingRematch([semanticSignal])
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
assertStep(
  "stale source surfaced",
  isStale(staleSource, new Date("2026-07-30T00:00:00.000Z")),
  staleSource
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
