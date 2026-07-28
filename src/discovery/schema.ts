export const SOURCE_TYPES = [
  "official_opportunity_page",
  "provider_index",
  "directory",
  "other",
] as const;

export type SourceType = (typeof SOURCE_TYPES)[number];

export interface OpportunitySource {
  source_id: string;
  opportunity_id: string;
  url: string;
  provider: string;
  source_type: SourceType;
  enabled: boolean;
  refresh_interval_hours: number;
  last_fetched_at: string | null;
  last_success_at: string | null;
  failure_count: number;
}

export interface SourceRegistry {
  sources: OpportunitySource[];
}

export function isOpportunitySource(value: unknown): value is OpportunitySource {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    typeof data.source_id === "string" &&
    typeof data.opportunity_id === "string" &&
    typeof data.url === "string" &&
    typeof data.provider === "string" &&
    typeof data.source_type === "string" &&
    (SOURCE_TYPES as readonly string[]).includes(data.source_type) &&
    typeof data.enabled === "boolean" &&
    typeof data.refresh_interval_hours === "number" &&
    data.refresh_interval_hours > 0 &&
    (data.last_fetched_at === null || typeof data.last_fetched_at === "string") &&
    (data.last_success_at === null || typeof data.last_success_at === "string") &&
    typeof data.failure_count === "number" &&
    data.failure_count >= 0
  );
}

export function isSourceRegistry(value: unknown): value is SourceRegistry {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.sources) && data.sources.every(isOpportunitySource);
}
