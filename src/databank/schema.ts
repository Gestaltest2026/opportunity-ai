import { Opportunity, isOpportunity } from "../opportunity/schema";

export const OPPORTUNITY_RECORD_STATUSES = [
  "active",
  "upcoming",
  "expired",
  "closed",
  "unknown",
] as const;

export type OpportunityRecordStatus =
  (typeof OPPORTUNITY_RECORD_STATUSES)[number];

export interface OpportunityRecord {
  opportunity: Opportunity;
  source_url: string;
  first_seen_at: string;
  last_checked_at: string;
  last_changed_at: string;
  status: OpportunityRecordStatus;
  raw_source_hash: string;
  semantic_hash: string;
  /** @deprecated Kept only for reading older databank records during migration. */
  source_hash?: string;
}

export interface OpportunityDatabank {
  records: OpportunityRecord[];
}

function isOpportunityRecord(value: unknown): value is OpportunityRecord {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    isOpportunity(data.opportunity) &&
    typeof data.source_url === "string" &&
    typeof data.first_seen_at === "string" &&
    typeof data.last_checked_at === "string" &&
    typeof data.last_changed_at === "string" &&
    typeof data.status === "string" &&
    (OPPORTUNITY_RECORD_STATUSES as readonly string[]).includes(data.status) &&
    typeof data.raw_source_hash === "string" &&
    typeof data.semantic_hash === "string" &&
    (data.source_hash === undefined || typeof data.source_hash === "string")
  );
}

export function isOpportunityDatabank(value: unknown): value is OpportunityDatabank {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.records) && data.records.every(isOpportunityRecord);
}
