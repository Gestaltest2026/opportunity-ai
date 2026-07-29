import { OpportunityDatabankSchema } from "../databank/schema";
import { selectRematchTargets } from "./selectRematchTargets";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const databank = OpportunityDatabankSchema.parse({
  records: [
    {
      opportunity: {
        opportunity_id: "opportunity-open",
        title: "Open Scholarship",
        provider: "Example Provider",
        opportunity_type: "scholarship",
        availability_status: "open",
        award: null,
        deadline: null,
        eligibility: [],
        selection_preferences: [],
        narrative_preferences: [],
        application_requirements: [],
        restrictions: [],
      },
      source_url: "https://example.edu/open-scholarship",
      first_seen_at: "2026-07-29T00:00:00.000Z",
      last_checked_at: "2026-07-29T00:00:00.000Z",
      last_changed_at: "2026-07-29T00:00:00.000Z",
      raw_source_hash: "raw-open",
      semantic_hash: "semantic-open",
    },
    {
      opportunity: {
        opportunity_id: "opportunity-closed",
        title: "Closed Scholarship",
        provider: "Example Provider",
        opportunity_type: "scholarship",
        availability_status: "closed",
        award: null,
        deadline: null,
        eligibility: [],
        selection_preferences: [],
        narrative_preferences: [],
        application_requirements: [],
        restrictions: [],
      },
      source_url: "https://example.edu/closed-scholarship",
      first_seen_at: "2026-07-29T00:00:00.000Z",
      last_checked_at: "2026-07-29T00:00:00.000Z",
      last_changed_at: "2026-07-29T00:00:00.000Z",
      raw_source_hash: "raw-closed",
      semantic_hash: "semantic-closed",
    },
  ],
});

const selection = selectRematchTargets(databank, [
  "opportunity-open",
  "opportunity-closed",
  "opportunity-open",
  "opportunity-missing",
]);

assert(
  JSON.stringify(selection.found_opportunity_ids) ===
    JSON.stringify(["opportunity-open", "opportunity-closed"]),
  `Unexpected rematch targets: ${JSON.stringify(selection.found_opportunity_ids)}`
);
assert(
  JSON.stringify(selection.missing_opportunity_ids) ===
    JSON.stringify(["opportunity-missing"]),
  `Unexpected missing IDs: ${JSON.stringify(selection.missing_opportunity_ids)}`
);
assert(
  selection.found_opportunity_ids.includes("opportunity-closed"),
  "Closed opportunities must not be pre-filtered before canonical match evaluation"
);

console.log(
  JSON.stringify(
    {
      targeted_selection: "valid",
      duplicate_ids_deduplicated: "valid",
      missing_ids_surfaced: "valid",
      no_pre_filter_by_availability: "valid",
    },
    null,
    2
  )
);
