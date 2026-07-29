import { isStale } from "./staleness";
import type { OpportunitySource } from "./schema";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const now = new Date("2026-07-30T00:00:00.000Z");
const source: OpportunitySource = {
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
};

const lastSuccessMs = new Date(source.last_success_at!).getTime();
const ageMs = now.getTime() - lastSuccessMs;
const thresholdMs = source.refresh_interval_hours * 2 * 60 * 60 * 1000;

assert(Number.isFinite(lastSuccessMs), "Fixture timestamp must parse");
assert(ageMs >= thresholdMs, `Fixture must be stale: age=${ageMs}, threshold=${thresholdMs}`);
assert(source.failure_count > 0, "Fixture must include a failed refresh");
assert(isStale(source, now), `Expected stale source: age=${ageMs}, threshold=${thresholdMs}`);

console.log(JSON.stringify({ stale_source: "valid", age_ms: ageMs, threshold_ms: thresholdMs }, null, 2));
