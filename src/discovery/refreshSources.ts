import { OpportunityDatabank } from "../databank/schema";
import { upsertOpportunity } from "../databank/upsertOpportunity";
import { extractOpportunity } from "../opportunity/extractOpportunity";
import { detectOpportunityChange, OpportunityChangeSignal, opportunitiesNeedingRematch } from "./changeDetection";
import { fetchSource } from "./fetchSource";
import { OpportunitySource, SourceRegistry } from "./schema";

export interface RefreshFailure {
  source_id: string;
  message: string;
}

export interface StaleSource {
  source_id: string;
  opportunity_id: string;
  last_success_at: string | null;
  failure_count: number;
}

export interface RefreshResult {
  registry: SourceRegistry;
  databank: OpportunityDatabank;
  refreshed_source_ids: string[];
  failed_sources: RefreshFailure[];
  changes: OpportunityChangeSignal[];
  opportunity_ids_needing_rematch: string[];
  stale_sources: StaleSource[];
}

export function isDue(source: OpportunitySource, now: Date): boolean {
  if (!source.enabled) return false;
  if (!source.last_fetched_at) return true;

  const lastFetched = new Date(source.last_fetched_at).getTime();
  if (!Number.isFinite(lastFetched)) return true;

  const intervalMs = source.refresh_interval_hours * 60 * 60 * 1000;
  return now.getTime() - lastFetched >= intervalMs;
}

export function isStale(source: OpportunitySource, now: Date): boolean {
  if (!source.enabled) return false;
  if (!source.last_success_at) return source.failure_count > 0;

  const lastSuccess = new Date(source.last_success_at).getTime();
  if (!Number.isFinite(lastSuccess)) return true;

  const staleAfterMs = source.refresh_interval_hours * 2 * 60 * 60 * 1000;
  return source.failure_count > 0 && now.getTime() - lastSuccess >= staleAfterMs;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function refreshSources(
  registry: SourceRegistry,
  databank: OpportunityDatabank,
  now: Date = new Date()
): Promise<RefreshResult> {
  let nextDatabank = databank;
  const refreshedSourceIds: string[] = [];
  const failedSources: RefreshFailure[] = [];
  const changes: OpportunityChangeSignal[] = [];
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
      const beforeUpsert = nextDatabank;

      nextDatabank = upsertOpportunity(
        nextDatabank,
        opportunity,
        fetched.url,
        fetched.source_text,
        attemptedAt
      );

      changes.push(
        detectOpportunityChange(
          beforeUpsert,
          nextDatabank,
          source.source_id,
          source.opportunity_id
        )
      );

      nextSources.push({
        ...source,
        url: fetched.url,
        last_fetched_at: attemptedAt,
        last_success_at: attemptedAt,
        failure_count: 0,
      });
      refreshedSourceIds.push(source.source_id);
    } catch (error) {
      nextSources.push({
        ...source,
        last_fetched_at: attemptedAt,
        failure_count: source.failure_count + 1,
      });
      failedSources.push({
        source_id: source.source_id,
        message: errorMessage(error),
      });
    }
  }

  const nextRegistry = { sources: nextSources };

  return {
    registry: nextRegistry,
    databank: nextDatabank,
    refreshed_source_ids: refreshedSourceIds,
    failed_sources: failedSources,
    changes,
    opportunity_ids_needing_rematch: opportunitiesNeedingRematch(changes),
    stale_sources: nextSources
      .filter((source) => isStale(source, now))
      .map((source) => ({
        source_id: source.source_id,
        opportunity_id: source.opportunity_id,
        last_success_at: source.last_success_at,
        failure_count: source.failure_count,
      })),
  };
}
