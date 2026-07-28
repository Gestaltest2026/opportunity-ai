import { OpportunityDatabankSchema } from "./schema";
import { Opportunity } from "../opportunity/schema";

const opportunity: Opportunity = {
  opportunity_id: "schema-test",
  title: "Test Scholarship",
  provider: "Test Foundation",
  opportunity_type: "scholarship",
  availability_status: "open",
  award: { amount: null, currency: null, description: null },
  deadline: null,
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
  source_evidence: [],
};

const valid = {
  records: [
    {
      opportunity,
      source_url: "https://example.com",
      first_seen_at: "2026-07-28T00:00:00.000Z",
      last_checked_at: "2026-07-28T00:00:00.000Z",
      last_changed_at: "2026-07-28T00:00:00.000Z",
      raw_source_hash: "raw",
      semantic_hash: "semantic",
    },
  ],
};

const staleDerivedState = {
  records: [
    {
      ...valid.records[0],
      status: "active",
    },
  ],
};

const malformed = {
  records: [
    {
      ...valid.records[0],
      raw_source_hash: 123,
    },
  ],
};

const result = {
  accepts_valid_databank: OpportunityDatabankSchema.safeParse(valid).success,
  strips_or_rejects_persisted_derived_status:
    !OpportunityDatabankSchema.strict().safeParse(staleDerivedState).success,
  rejects_malformed_record: !OpportunityDatabankSchema.safeParse(malformed).success,
};

console.log(JSON.stringify(result, null, 2));

if (Object.values(result).some((value) => !value)) {
  process.exitCode = 1;
}
