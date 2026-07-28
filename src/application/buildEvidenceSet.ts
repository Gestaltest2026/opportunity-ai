import {
  APPLICANT_DOMAINS,
  Applicant,
  ApplicantClaim,
} from "../extraction/applicantSchema";
import { Match } from "../matching/schema";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function buildEvidenceSet(
  applicant: Applicant,
  match: Match
): ApplicantClaim[] {
  const wanted = new Set(match.supporting_claims.map(normalize));
  const evidence: ApplicantClaim[] = [];

  for (const domain of APPLICANT_DOMAINS) {
    for (const claim of applicant[domain]) {
      if (wanted.has(normalize(claim.text)) && claim.status !== "rejected") {
        evidence.push(claim);
      }
    }
  }

  return evidence;
}
