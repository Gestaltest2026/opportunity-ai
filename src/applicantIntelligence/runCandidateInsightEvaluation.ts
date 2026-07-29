import { readFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import {
  createApplicantIntelligenceBenchmarkEvidence,
  createCanonicalApplicantView,
} from "./canonicalApplicantAdapter";
import { generateCandidateInsights } from "./generateCandidateInsights";

async function main() {
  const raw = JSON.parse(
    await readFile("examples/applicant-001/canonical-profile-v0.json", "utf8")
  );
  const applicant = ApplicantSchema.parse(raw);
  const canonicalView = createCanonicalApplicantView("applicant-001", applicant);
  const benchmarkEvidence = createApplicantIntelligenceBenchmarkEvidence(canonicalView);
  const generated = await generateCandidateInsights(benchmarkEvidence);

  console.log(
    JSON.stringify(
      {
        applicant_id: canonicalView.applicant_id,
        generation_evidence_count: benchmarkEvidence.evidence_claims.length,
        prior_interpretation_count: benchmarkEvidence.prior_interpretations.length,
        candidate_chain_count: generated.candidate_chains.length,
        candidate_chains: generated.candidate_chains,
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