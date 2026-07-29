import { readFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import { createCanonicalApplicantView } from "./canonicalApplicantAdapter";

async function main() {
  const rawText = await readFile(
    "examples/applicant-001/canonical-profile-v0.json",
    "utf8"
  );
  const raw = JSON.parse(rawText);
  const applicant = ApplicantSchema.parse(raw);
  const before = JSON.stringify(applicant);

  const view = createCanonicalApplicantView("applicant-001", applicant);
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

  console.log(
    JSON.stringify(
      {
        applicant_id: view.applicant_id,
        claim_count: view.claims.length,
        input_mutated: false,
        missing_provenance_count: 0,
        sensitive_domain_claim_count: 0,
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
