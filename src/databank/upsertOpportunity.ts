import { createHash } from "node:crypto";
import { Opportunity } from "../opportunity/schema";
import { OpportunityDatabank, OpportunityRecord } from "./schema";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function hashOpportunitySource(sourceText: string): string {
  return sha256(sourceText);
}

export function canonicalizeOpportunity(opportunity: Opportunity): string {
  return JSON.stringify({
    title: opportunity.title,
    provider: opportunity.provider,
    opportunity_type: opportunity.opportunity_type,
    availability_status: opportunity.availability_status,
    award: opportunity.award,
    deadline: opportunity.deadline,
    eligibility: opportunity.eligibility,
    selection_preferences: opportunity.selection_preferences,
    narrative_preferences: opportunity.narrative_preferences,
    application_requirements: opportunity.application_requirements,
    restrictions: opportunity.restrictions,
  });
}

export function hashOpportunitySemantics(opportunity: Opportunity): string {
  return sha256(canonicalizeOpportunity(opportunity));
}

export function upsertOpportunity(
  databank: OpportunityDatabank,
  opportunity: Opportunity,
  sourceUrl: string,
  sourceText: string,
  checkedAt: string = new Date().toISOString()
): OpportunityDatabank {
  const rawSourceHash = hashOpportunitySource(sourceText);
  const semanticHash = hashOpportunitySemantics(opportunity);
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
      raw_source_hash: rawSourceHash,
      semantic_hash: semanticHash,
    };

    return { records: [...databank.records, record] };
  }

  const existing = databank.records[existingIndex];
  const semanticChanged = existing.semantic_hash !== semanticHash;

  const updated: OpportunityRecord = {
    ...existing,
    opportunity,
    source_url: sourceUrl,
    last_checked_at: checkedAt,
    last_changed_at: semanticChanged ? checkedAt : existing.last_changed_at,
    raw_source_hash: rawSourceHash,
    semantic_hash: semanticHash,
  };

  return {
    records: databank.records.map((record, index) =>
      index === existingIndex ? updated : record
    ),
  };
}
