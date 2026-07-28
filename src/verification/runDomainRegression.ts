import { createApplication } from "../application/createApplication";
import { Match } from "../matching/schema";
import { Opportunity } from "../opportunity/schema";

const opportunity: Opportunity = {
  opportunity_id: "domain-test",
  title: "Domain Test Scholarship",
  provider: "Test Foundation",
  opportunity_type: "scholarship",
  availability_status: "closed",
  award: { amount: null, currency: null, description: null },
  deadline: null,
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
  source_evidence: [],
};

const closedMatch: Match = {
  match_id: "applicant-001:domain-test",
  applicant_id: "applicant-001",
  opportunity_id: "domain-test",
  eligibility_status: "eligible",
  actionability_status: "unavailable",
  eligibility_evaluations: [],
  evidence_score: 0.8,
  narrative_fit_score: 0.8,
  strategic_value_score: 0.8,
  blockers: ["Opportunity is currently closed."],
  missing_information: [],
  supporting_claims: [],
  score: null,
  explanation: "Closed opportunity regression fixture.",
};

let rejectsUnavailableApplication = false;
try {
  createApplication(closedMatch, opportunity);
} catch {
  rejectsUnavailableApplication = true;
}

const result = {
  rejects_application_for_unavailable_opportunity: rejectsUnavailableApplication,
};

console.log(JSON.stringify(result, null, 2));

if (Object.values(result).some((value) => !value)) {
  process.exitCode = 1;
}
