import { OpportunityDatabank } from "../databank/schema";

export interface OpportunityChangeSignal {
  opportunity_id: string;
  source_id: string;
  raw_changed: boolean;
  semantic_changed: boolean;
}

function findRecord(databank: OpportunityDatabank, opportunityId: string) {
  return databank.records.find(
    (record) => record.opportunity.opportunity_id === opportunityId
  );
}

export function detectOpportunityChange(
  before: OpportunityDatabank,
  after: OpportunityDatabank,
  sourceId: string,
  opportunityId: string
): OpportunityChangeSignal {
  const previous = findRecord(before, opportunityId);
  const next = findRecord(after, opportunityId);

  if (!next) {
    throw new Error(`Opportunity missing after refresh: ${opportunityId}`);
  }

  return {
    opportunity_id: opportunityId,
    source_id: sourceId,
    raw_changed: !previous || previous.raw_source_hash !== next.raw_source_hash,
    semantic_changed: !previous || previous.semantic_hash !== next.semantic_hash,
  };
}

export function opportunitiesNeedingRematch(
  changes: OpportunityChangeSignal[]
): string[] {
  return [
    ...new Set(
      changes
        .filter((change) => change.semantic_changed)
        .map((change) => change.opportunity_id)
    ),
  ];
}
