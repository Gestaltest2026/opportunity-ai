import { OpportunityDatabank } from "../databank/schema";
import { Applicant } from "../extraction/applicantSchema";
import { evaluateMatch } from "./evaluateMatch";
import { Match } from "./schema";

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
  const requested = [...new Set(opportunityIds)];
  const recordsById = new Map(
    databank.records.map((record) => [record.opportunity.opportunity_id, record])
  );

  const foundRecords = requested
    .map((id) => recordsById.get(id))
    .filter((record): record is OpportunityDatabank["records"][number] => Boolean(record));

  const missingOpportunityIds = requested.filter((id) => !recordsById.has(id));

  // Do not pre-filter on fit or availability here. Canonical Opportunity extraction
  // already happened upstream, and evaluateMatch is responsible for eligibility,
  // actionability, evidence, narrative fit, and strategic value.
  const matches = await Promise.all(
    foundRecords.map((record) =>
      evaluateMatch(applicantId, applicant, record.opportunity)
    )
  );

  return {
    evaluated_opportunity_ids: foundRecords.map(
      (record) => record.opportunity.opportunity_id
    ),
    missing_opportunity_ids: missingOpportunityIds,
    matches,
  };
}
