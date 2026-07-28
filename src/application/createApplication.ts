import { Match } from "../matching/schema";
import { Opportunity } from "../opportunity/schema";
import { Application } from "./schema";

export function createApplication(
  match: Match,
  opportunity: Opportunity
): Application {
  if (match.eligibility_status !== "eligible") {
    throw new Error("Cannot create an application from a non-eligible match.");
  }

  if (match.actionability_status !== "actionable") {
    throw new Error("Cannot create an application for an opportunity that is not currently actionable.");
  }

  return {
    application_id: `${match.applicant_id}:${opportunity.opportunity_id}:application`,
    applicant_id: match.applicant_id,
    opportunity_id: opportunity.opportunity_id,
    match_id: match.match_id,
    status: "selected",
    requirements: [...opportunity.application_requirements],
    documents: [],
    essays: [],
    missing_items: [...opportunity.application_requirements],
    submitted_at: null,
    notes: [],
  };
}
