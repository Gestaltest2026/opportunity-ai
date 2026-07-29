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

const before = upsertOpportunity(
  { records: [] },
  opportunity,
  "https://example.edu/scholarship",
  "source v1",
  "2026-07-29T00:00:00.000Z"
);
const changed = OpportunitySchema.parse({ ...opportunity, deadline: "2026-12-15" });
const after = upsertOpportunity(
  before,
  changed,
  "https://example.edu/scholarship",
  "source v2 deadline changed",
  "2026-07-31T00:00:00.000Z"
);
const signal = detectOpportunityChange(before, after, "source-test", opportunity.opportunity_id);

assert(signal.semantic_changed, "Expected semantic change");
assert(opportunitiesNeedingRematch([signal])[0] === opportunity.opportunity_id, "Semantic change must rematch");
console.log(JSON.stringify({ semantic_change: "valid", signal }, null, 2));
