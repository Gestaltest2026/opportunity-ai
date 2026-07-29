import { readFile } from "node:fs/promises";
import { ApplicantIntelligenceBenchmarkSchema } from "./benchmarkSchema";

async function main() {
  const raw = JSON.parse(
    await readFile(
      "examples/applicant-001/applicant-intelligence-benchmark-v1.json",
      "utf8"
    )
  );

  const benchmark = ApplicantIntelligenceBenchmarkSchema.parse(raw);

  console.log(
    JSON.stringify(
      {
        applicant_id: benchmark.applicant_id,
        schema_valid: true,
        candidate_chain_count: benchmark.candidate_chains.length,
        session_artifact_present: benchmark.session_artifact !== null,
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
