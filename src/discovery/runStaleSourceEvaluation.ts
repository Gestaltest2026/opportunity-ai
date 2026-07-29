import { isStale } from "./refreshSources";
import { OpportunitySourceSchema } from "./schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const staleSource = OpportunitySourceSchema.parse({
  source_id: "source-test",
  opportunity_id: "opportunity-test",
  url: "https://example.edu/scholarship",
  provider: "Example University",
  source_type: "official_opportunity_page",
  enabled: true,
  refresh_interval_hours: 24,
  last_fetched_at: "2026-07-29T00:00:00.000Z",
  last_success_at: "2026-07-26T00:00:00.000Z",
  failure_count: 2,
});

assert(
  isStale(staleSource, new Date("2026-07-30T00:00:00.000Z")),
  "Repeated failures beyond two refresh intervals must surface as stale"
);
console.log(JSON.stringify({ stale_source: "valid" }, null, 2));
