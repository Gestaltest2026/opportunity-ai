import { OpportunityDatabank } from "../databank/schema";
import { Applicant } from "../extraction/applicantSchema";
import { evaluateMatch } from "./evaluateMatch";
import { Match } from "./schema";
import { selectRematchTargets } from "./selectRematchTargets";

export interface TargetedRematchResult {
  evaluated_opportunity_ids: string[];
  missing_opportunity_ids: string[];
  matches: Match[];
}

export async function rematchChangedOpportunities(
  applicantId: string,
  applicant: Applicant,
  databank: OpportunityDatabank,
  opportunityIds: string[]
): Promise<TargetedRematchResult> {
  const selection = selectRematchTargets(databank, opportunityIds);
  const recordsById = new Map(
    databank.records.map((record) => [record.opportunity.opportunity_id, record])
  );

  // Do not pre-filter on fit or availability here. Canonical Opportunity extraction
  // already happened upstream, and evaluateMatch is responsible for eligibility,
  // actionability, evidence, narrative fit, and strategic value.
  const matches = await Promise.all(
    selection.found_opportunity_ids.map((id) => {
      const record = recordsById.get(id);
      if (!record) {
        throw new Error(`Selected rematch target disappeared from databank: ${id}`);
      }
      return evaluateMatch(applicantId, applicant, record.opportunity);
    })
  );

  return {
    evaluated_opportunity_ids: selection.found_opportunity_ids,
    missing_opportunity_ids: selection.missing_opportunity_ids,
    matches,
  };
}
