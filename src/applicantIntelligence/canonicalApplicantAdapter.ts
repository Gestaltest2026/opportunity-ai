import {
  APPLICANT_DOMAINS,
  ApplicantSchema,
  type Applicant,
  type ApplicantDomain,
} from "../extraction/applicantSchema";

export interface CanonicalApplicantClaimView {
  claim_id: string;
  domain: ApplicantDomain;
  text: string;
  canonical_type: "explicit" | "inferred";
  canonical_status: "unreviewed" | "confirmed" | "edited" | "rejected";
  source: string;
  evidence: string;
  opportunity_relevance: string;
}

export interface CanonicalApplicantView {
  applicant_id: string;
  claims: CanonicalApplicantClaimView[];
}

export interface ApplicantIntelligenceBenchmarkEvidence {
  applicant_id: string;
  evidence_claims: CanonicalApplicantClaimView[];
  prior_interpretations: CanonicalApplicantClaimView[];
}

export function createCanonicalApplicantView(
  applicantId: string,
  input: Applicant
): CanonicalApplicantView {
  const applicant = ApplicantSchema.parse(input);
  const claims: CanonicalApplicantClaimView[] = [];

  for (const domain of APPLICANT_DOMAINS) {
    applicant[domain].forEach((claim, index) => {
      claims.push({
        claim_id: `${domain}:${index}`,
        domain,
        text: claim.text,
        canonical_type: claim.type,
        canonical_status: claim.status,
        source: claim.source,
        evidence: claim.evidence,
        opportunity_relevance: claim.opportunity_relevance,
      });
    });
  }

  return {
    applicant_id: applicantId,
    claims,
  };
}

/**
 * D5 is intended to test whether Applicant Intelligence can generate new meaning
 * from evidence. Existing inferred claims and narrative themes are therefore
 * separated from generation input and retained only as a novelty/duplication
 * reference set for human review.
 */
export function createApplicantIntelligenceBenchmarkEvidence(
  applicant: CanonicalApplicantView
): ApplicantIntelligenceBenchmarkEvidence {
  return {
    applicant_id: applicant.applicant_id,
    evidence_claims: applicant.claims.filter(
      (claim) => claim.canonical_type === "explicit" && claim.canonical_status === "confirmed"
    ),
    prior_interpretations: applicant.claims.filter(
      (claim) => claim.canonical_type === "inferred" || claim.canonical_status === "unreviewed"
    ),
  };
}
