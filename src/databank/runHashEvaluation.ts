import { Opportunity } from "../opportunity/schema";
import {
  hashOpportunitySemantics,
  hashOpportunitySource,
} from "./upsertOpportunity";

const baseOpportunity: Opportunity = {
  opportunity_id: "hash-test",
  title: "Test Scholarship",
  provider: "Test Foundation",
  opportunity_type: "scholarship",
  availability_status: "open",
  award: {
    amount: 1000,
    currency: "USD",
    description: "$1,000 scholarship",
  },
  deadline: "2026-10-01",
  eligibility: [],
  selection_preferences: [],
  narrative_preferences: [],
  application_requirements: [],
  restrictions: [],
  source_evidence: ["Original page text"],
};

const rawA = "Scholarship page. Updated banner: Monday.";
const rawB = "Scholarship page. Updated banner: Tuesday.";

const rawChanged = hashOpportunitySource(rawA) !== hashOpportunitySource(rawB);
const semanticStable =
  hashOpportunitySemantics(baseOpportunity) ===
  hashOpportunitySemantics({
    ...baseOpportunity,
    source_evidence: ["Same scholarship, differently rendered source text"],
  });
const semanticChanged =
  hashOpportunitySemantics(baseOpportunity) !==
  hashOpportunitySemantics({
    ...baseOpportunity,
    deadline: "2026-10-15",
  });

const result = {
  raw_changed_for_page_noise: rawChanged,
  semantic_stable_for_source_evidence_only: semanticStable,
  semantic_changed_for_deadline_change: semanticChanged,
};

console.log(JSON.stringify(result, null, 2));

if (!rawChanged || !semanticStable || !semanticChanged) {
  process.exitCode = 1;
}
