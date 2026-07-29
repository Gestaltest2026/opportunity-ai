import { OpportunitySchema } from "../opportunity/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { detectOpportunityChange, opportunitiesNeedingRematch } from "./changeDetection";

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
  deadline: "2026-12-01",
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
  source_evidence: ["Official scholarship page"],
});

const first = upsertOpportunity(
  { records: [] },
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
const signal = detectOpportunityChange(first, rawOnly, "source-test", opportunity.opportunity_id);

assert(signal.raw_changed, "Expected raw source change");
assert(!signal.semantic_changed, "Raw-only change must not be semantic");
assert(opportunitiesNeedingRematch([signal]).length === 0, "Raw-only change must not rematch");
console.log(JSON.stringify({ raw_change: "valid", signal }, null, 2));
