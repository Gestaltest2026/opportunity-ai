import {
  Applicant,
  createEmptyApplicant,
} from "./applicantSchema";
import { ApplicantExtraction } from "./schema";

export function applyExtraction(
  extraction: ApplicantExtraction,
  applicant: Applicant = createEmptyApplicant()
): Applicant {
  const next: Applicant = {
    ...applicant,
  };

  for (const claim of extraction.claims) {
    next[claim.domain] = [...next[claim.domain], claim.claim];
  }

  return next;
}
