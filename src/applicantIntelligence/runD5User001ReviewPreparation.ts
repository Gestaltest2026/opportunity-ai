import { readFile, writeFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import {
  createApplicantIntelligenceBenchmarkEvidence,
  createCanonicalApplicantView,
} from "./canonicalApplicantAdapter";
import { generateCandidateInsights } from "./generateCandidateInsights";
import { guardInsightChain } from "./epistemicGuard";
import { HumanMeaningReviewInputSchema } from "./humanMeaningReview";

async function main() {
  const raw = JSON.parse(
    await readFile("examples/applicant-001/canonical-profile-v0.json", "utf8")
  );
  const applicant = ApplicantSchema.parse(raw);
  const canonicalView = createCanonicalApplicantView("applicant-001", applicant);
  const benchmarkEvidence = createApplicantIntelligenceBenchmarkEvidence(canonicalView);
  const generated = await generateCandidateInsights(benchmarkEvidence);

  const guardedChains = generated.candidate_chains
    .map((chain) => guardInsightChain(chain, canonicalView))
    .filter((result) => result.disposition !== "reject")
    .map((result) => result.chain);

  if (guardedChains.length === 0) {
    throw new Error("No candidate insight chains survived the epistemic guard.");
  }

  const reviewInput = HumanMeaningReviewInputSchema.parse({
    applicant_id: canonicalView.applicant_id,
    candidate_chains: guardedChains,
    prior_interpretations: benchmarkEvidence.prior_interpretations.map((claim) => ({
      claim_id: claim.claim_id,
      domain: claim.domain,
      text: claim.text,
    })),
  });

  const outputPath = "examples/applicant-001/d5-human-review-input.json";
  await writeFile(outputPath, `${JSON.stringify(reviewInput, null, 2)}\n`, "utf8");

  console.log(
    JSON.stringify(
      {
        applicant_id: canonicalView.applicant_id,
        generation_evidence_count: benchmarkEvidence.evidence_claims.length,
        prior_interpretation_count: benchmarkEvidence.prior_interpretations.length,
        generated_chain_count: generated.candidate_chains.length,
        reviewable_chain_count: guardedChains.length,
        output_path: outputPath,
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
