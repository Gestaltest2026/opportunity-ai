import { readFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import {
  createApplicantIntelligenceBenchmarkEvidence,
  createCanonicalApplicantView,
} from "./canonicalApplicantAdapter";

async function main() {
  const rawText = await readFile(
    "examples/applicant-001/canonical-profile-v0.json",
    "utf8"
  );
  const raw = JSON.parse(rawText);
  const applicant = ApplicantSchema.parse(raw);
  const before = JSON.stringify(applicant);

  const view = createCanonicalApplicantView("applicant-001", applicant);
  const benchmarkEvidence = createApplicantIntelligenceBenchmarkEvidence(view);
  const after = JSON.stringify(applicant);

  if (before !== after) {
    throw new Error("Canonical Applicant adapter mutated its input.");
  }

  const prohibitedDomains = ["financial_context", "identity_eligibility_attributes"];
  const unexpectedSensitiveClaims = view.claims.filter((claim) =>
    prohibitedDomains.includes(claim.domain)
  );

  if (unexpectedSensitiveClaims.length > 0) {
    throw new Error(
      `Expected absent sensitive domains to remain absent, found ${unexpectedSensitiveClaims.length} claim(s).`
    );
  }

  const missingProvenance = view.claims.filter(
    (claim) => !claim.source || !claim.evidence || !claim.claim_id
  );
  if (missingProvenance.length > 0) {
    throw new Error(
      `Found ${missingProvenance.length} canonical claim(s) without provenance.`
    );
  }

  const contaminatedEvidence = benchmarkEvidence.evidence_claims.filter(
    (claim) => claim.canonical_type !== "explicit" || claim.canonical_status !== "confirmed"
  );
  if (contaminatedEvidence.length > 0) {
    throw new Error("D5 generation evidence contains inferred or unconfirmed interpretation.");
  }

  const inferredClaims = view.claims.filter((claim) => claim.canonical_type === "inferred");
  const missingPriorReferences = inferredClaims.filter(
    (claim) => !benchmarkEvidence.prior_interpretations.some((prior) => prior.claim_id === claim.claim_id)
  );
  if (missingPriorReferences.length > 0) {
    throw new Error("D5 novelty reference set lost existing inferred interpretation(s).");
  }

  console.log(
    JSON.stringify(
      {
        applicant_id: view.applicant_id,
        claim_count: view.claims.length,
        d5_generation_evidence_count: benchmarkEvidence.evidence_claims.length,
        d5_prior_interpretation_count: benchmarkEvidence.prior_interpretations.length,
        input_mutated: false,
        missing_provenance_count: 0,
        sensitive_domain_claim_count: 0,
        d5_generation_contamination_count: 0,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
