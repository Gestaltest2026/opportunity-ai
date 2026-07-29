import type { OpportunitySource } from "./schema";

export function isStale(source: OpportunitySource, now: Date): boolean {
  if (!source.enabled) return false;
  if (!source.last_success_at) return source.failure_count > 0;

  const lastSuccess = new Date(source.last_success_at).getTime();
  if (!Number.isFinite(lastSuccess)) return true;

  const staleAfterMs = source.refresh_interval_hours * 2 * 60 * 60 * 1000;
  return source.failure_count > 0 && now.getTime() - lastSuccess >= staleAfterMs;
}
