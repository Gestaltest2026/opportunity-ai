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

  const guardedResults = generated.candidate_chains.map((chain) =>
    guardInsightChain(chain, canonicalView)
  );

  const reviewableChains = guardedResults
    .filter((result) => result.disposition === "accept" || result.disposition === "revise")
    .map((result) => result.chain);

  const blockedChains = guardedResults
    .filter((result) => result.disposition !== "accept" && result.disposition !== "revise")
    .map((result) => ({
      chain_id: result.chain.chain_id,
      disposition: result.disposition,
      findings: result.findings,
    }));

  if (reviewableChains.length === 0) {
    throw new Error(
      "No candidate insight chains are eligible for D5 meaning review after epistemic guarding."
    );
  }

  const reviewInput = HumanMeaningReviewInputSchema.parse({
    applicant_id: canonicalView.applicant_id,
    candidate_chains: reviewableChains,
    prior_interpretations: benchmarkEvidence.prior_interpretations.map((claim) => ({
      claim_id: claim.claim_id,
      domain: claim.domain,
      text: claim.text,
    })),
  });

  const outputPath = "examples/applicant-001/d5-human-review-input.json";
  const diagnosticsPath = "examples/applicant-001/d5-epistemic-diagnostics.json";

  await Promise.all([
    writeFile(outputPath, `${JSON.stringify(reviewInput, null, 2)}\n`, "utf8"),
    writeFile(
      diagnosticsPath,
      `${JSON.stringify(
        {
          applicant_id: canonicalView.applicant_id,
          generated_chain_count: generated.candidate_chains.length,
          reviewable_chain_count: reviewableChains.length,
          blocked_chain_count: blockedChains.length,
          blocked_chains: blockedChains,
        },
        null,
        2
      )}\n`,
      "utf8"
    ),
  ]);

  console.log(
    JSON.stringify(
      {
        applicant_id: canonicalView.applicant_id,
        generation_evidence_count: benchmarkEvidence.evidence_claims.length,
        prior_interpretation_count: benchmarkEvidence.prior_interpretations.length,
        generated_chain_count: generated.candidate_chains.length,
        reviewable_chain_count: reviewableChains.length,
        blocked_chain_count: blockedChains.length,
        output_path: outputPath,
        diagnostics_path: diagnosticsPath,
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
