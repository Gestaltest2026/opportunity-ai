import { isStale } from "./refreshSources";
import { OpportunitySourceSchema } from "./schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const now = new Date("2026-07-30T00:00:00.000Z");
const staleAfterHours = 24 * 2;
const lastSuccess = new Date(now.getTime() - (staleAfterHours + 24) * 60 * 60 * 1000);

const staleSource = OpportunitySourceSchema.parse({
  source_id: "source-test",
  opportunity_id: "opportunity-test",
  url: "https://example.edu/scholarship",
  provider: "Example University",
  source_type: "official_opportunity_page",
  enabled: true,
  refresh_interval_hours: 24,
  last_fetched_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  last_success_at: lastSuccess.toISOString(),
  failure_count: 2,
});

assert(
  now.getTime() - lastSuccess.getTime() > staleAfterHours * 60 * 60 * 1000,
  "Fixture must be older than the stale threshold"
);
assert(
  isStale(staleSource, now),
  `Expected stale source; last_success_at=${staleSource.last_success_at}, now=${now.toISOString()}`
);
console.log(JSON.stringify({ stale_source: "valid", last_success_at: staleSource.last_success_at }, null, 2));
