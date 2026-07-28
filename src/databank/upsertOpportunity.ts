import { createHash } from "node:crypto";
import { Opportunity } from "../opportunity/schema";
import { OpportunityDatabank, OpportunityRecord } from "./schema";

export function hashOpportunitySource(sourceText: string): string {
  return createHash("sha256").update(sourceText).digest("hex");
}

export function upsertOpportunity(
  databank: OpportunityDatabank,
  opportunity: Opportunity,
  sourceUrl: string,
  sourceText: string,
  checkedAt: string = new Date().toISOString()
): OpportunityDatabank {
  const sourceHash = hashOpportunitySource(sourceText);
  const existingIndex = databank.records.findIndex(
    (record) => record.opportunity.opportunity_id === opportunity.opportunity_id
  );

  if (existingIndex === -1) {
    const record: OpportunityRecord = {
      opportunity,
      source_url: sourceUrl,
      first_seen_at: checkedAt,
      last_checked_at: checkedAt,
      last_changed_at: checkedAt,
      status: "active",
      source_hash: sourceHash,
    };

    return { records: [...databank.records, record] };
  }

  const existing = databank.records[existingIndex];
  const changed = existing.source_hash !== sourceHash;
  const updated: OpportunityRecord = {
    ...existing,
    opportunity,
    source_url: sourceUrl,
    last_checked_at: checkedAt,
    last_changed_at: changed ? checkedAt : existing.last_changed_at,
    source_hash: sourceHash,
  };

  return {
    records: databank.records.map((record, index) =>
      index === existingIndex ? updated : record
    ),
  };
}
