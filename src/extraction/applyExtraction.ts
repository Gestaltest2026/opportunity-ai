import {
  APPLICANT_DOMAINS,
  Applicant,
  ApplicantClaim,
  createEmptyApplicant,
} from "./applicantSchema";
import { ApplicantExtraction } from "./schema";

function normalizeClaimText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function applyExtraction(
  extraction: ApplicantExtraction,
  applicant: Applicant = createEmptyApplicant(),
  source = "unknown"
): Applicant {
  const next = createEmptyApplicant();

  for (const domain of APPLICANT_DOMAINS) {
    next[domain] = [...applicant[domain]];
  }

  for (const claim of extraction.claims) {
    const canonicalClaim: ApplicantClaim = {
      text: claim.claim,
      type: claim.type,
      evidence: claim.evidence,
      confidence: claim.confidence,
      source,
      opportunity_relevance: claim.opportunity_relevance,
      status: "unreviewed",
    };

    const existingIndex = next[claim.domain].findIndex(
      (existing) =>
        normalizeClaimText(existing.text) === normalizeClaimText(claim.claim)
    );

    if (existingIndex === -1) {
      next[claim.domain].push(canonicalClaim);
      continue;
    }

    const existing = next[claim.domain][existingIndex];
    if (existing.status === "unreviewed" && claim.confidence > existing.confidence) {
      next[claim.domain][existingIndex] = canonicalClaim;
    }
  }

  return next;
}
