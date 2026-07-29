import { HumanMeaningReviewBundleSchema, meaningReviewGatePasses } from "./humanMeaningReview";

const passing = HumanMeaningReviewBundleSchema.parse({
  applicant_id: "applicant-001",
  reviews: [
    {
      chain_id: "chain-1",
      evaluation: {
        disposition: "retain",
        scores: {
          groundedness: 3,
          novelty: 2,
          recognition: 2,
          compression: 3,
          external_legibility: 2,
        },
        strategic_lift: { occurred: false, changes: [], notes: "Not tested at D5." },
        failure_codes: [],
        notes: "Meaning-quality gate example.",
      },
      corrected_wording: null,
      missing_evidence: [],
      alternative_explanation: null,
    },
  ],
});

const failing = HumanMeaningReviewBundleSchema.parse({
  applicant_id: "applicant-001",
  reviews: [
    {
      chain_id: "chain-1",
      evaluation: {
        disposition: "retain",
        scores: {
          groundedness: 3,
          novelty: 1,
          recognition: 2,
          compression: 2,
          external_legibility: 2,
        },
        strategic_lift: { occurred: false, changes: [], notes: "Not tested at D5." },
        failure_codes: [],
        notes: "Fails novelty threshold.",
      },
      corrected_wording: null,
      missing_evidence: [],
      alternative_explanation: null,
    },
  ],
});

if (!meaningReviewGatePasses(passing)) {
  throw new Error("Expected passing review bundle to clear D5 gate.");
}
if (meaningReviewGatePasses(failing)) {
  throw new Error("Expected failing review bundle to fail D5 gate.");
}

console.log(JSON.stringify({ d5_gate_contract_valid: true }, null, 2));
