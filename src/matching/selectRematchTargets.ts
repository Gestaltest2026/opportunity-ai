import { OpportunityDatabank } from "../databank/schema";

export interface RematchTargetSelection {
  found_opportunity_ids: string[];
  missing_opportunity_ids: string[];
}

export function selectRematchTargets(
  databank: OpportunityDatabank,
  opportunityIds: string[]
): RematchTargetSelection {
  const requested = [...new Set(opportunityIds)];
  const known = new Set(
    databank.records.map((record) => record.opportunity.opportunity_id)
  );

  return {
    found_opportunity_ids: requested.filter((id) => known.has(id)),
    missing_opportunity_ids: requested.filter((id) => !known.has(id)),
  };
}
