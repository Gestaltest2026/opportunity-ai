import { OpportunityDatabank } from "../databank/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import { fetchSource } from "./fetchSource";
import { OpportunitySource, SourceRegistry } from "./schema";

export interface RefreshResult {
  registry: SourceRegistry;
  databank: OpportunityDatabank;
  refreshed_source_ids: string[];
  failed_source_ids: string[];
}

function isDue(source: OpportunitySource, now: Date): boolean {
  if (!source.enabled) return false;
  if (!source.last_fetched_at) return true;

  const lastFetched = new Date(source.last_fetched_at).getTime();
  if (!Number.isFinite(lastFetched)) return true;

  const intervalMs = source.refresh_interval_hours * 60 * 60 * 1000;
  return now.getTime() - lastFetched >= intervalMs;
}

export async function refreshSources(
  registry: SourceRegistry,
  databank: OpportunityDatabank,
  now: Date = new Date()
): Promise<RefreshResult> {
  let nextDatabank = databank;
  const refreshedSourceIds: string[] = [];
  const failedSourceIds: string[] = [];

  const nextSources: OpportunitySource[] = [];

  for (const source of registry.sources) {
    if (!isDue(source, now)) {
      nextSources.push(source);
      continue;
    }

    const attemptedAt = now.toISOString();

    try {
      const fetched = await fetchSource(source.url);
      const opportunity = await extractOpportunity(
        source.opportunity_id,
        fetched.source_text
      );

      nextDatabank = upsertOpportunity(
        nextDatabank,
        opportunity,
        fetched.url,
        fetched.source_text,
        attemptedAt
      );

      nextSources.push({
        ...source,
        url: fetched.url,
        last_fetched_at: attemptedAt,
        last_success_at: attemptedAt,
        failure_count: 0,
      });
      refreshedSourceIds.push(source.source_id);
    } catch {
      nextSources.push({
        ...source,
        last_fetched_at: attemptedAt,
        failure_count: source.failure_count + 1,
      });
      failedSourceIds.push(source.source_id);
    }
  }

  return {
    registry: { sources: nextSources },
    databank: nextDatabank,
    refreshed_source_ids: refreshedSourceIds,
    failed_source_ids: failedSourceIds,
  };
}
