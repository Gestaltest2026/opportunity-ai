import { generateCandidateInsights } from "./generateCandidateInsights";
import { loadUser001ApplicantIntelligenceBenchmark } from "./loadUser001Benchmark";

async function main() {
  const { canonicalView, benchmarkEvidence } =
    await loadUser001ApplicantIntelligenceBenchmark();
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