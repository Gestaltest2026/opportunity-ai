import { readFile } from "node:fs/promises";
import { ApplicantSchema } from "../extraction/applicantSchema";
import {
  createApplicantIntelligenceBenchmarkEvidence,
  createCanonicalApplicantView,
} from "./canonicalApplicantAdapter";

const USER_001_PROFILE_PATH = "examples/applicant-001/canonical-profile-v0.json";
const USER_001_APPLICANT_ID = "applicant-001";

export async function loadUser001ApplicantIntelligenceBenchmark() {
  const raw = JSON.parse(await readFile(USER_001_PROFILE_PATH, "utf8"));
  const applicant = ApplicantSchema.parse(raw);
  const canonicalView = createCanonicalApplicantView(USER_001_APPLICANT_ID, applicant);
  const benchmarkEvidence = createApplicantIntelligenceBenchmarkEvidence(canonicalView);

  return {
    applicant,
    canonicalView,
    benchmarkEvidence,
  } as const;
}
