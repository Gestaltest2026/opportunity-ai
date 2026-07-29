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
