import { Opportunity } from "../opportunity/schema";

export type OpportunityRecordStatus = "active" | "expired" | "closed" | "unknown";

export interface OpportunityRecord {
  opportunity: Opportunity;
  source_url: string;
  first_seen_at: string;
  last_checked_at: string;
  last_changed_at: string;
  status: OpportunityRecordStatus;
  source_hash: string;
}

export interface OpportunityDatabank {
  records: OpportunityRecord[];
}
