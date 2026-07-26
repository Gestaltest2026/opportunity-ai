export type ClaimType = "explicit" | "inferred";

export interface ExtractedClaim {
  claim: string;
  type: ClaimType;
  evidence: string;
  confidence: number;
  opportunity_relevance: string;
}

export interface ApplicantExtraction {
  applicant_id: string;
  claims: ExtractedClaim[];
}

export function isApplicantExtraction(
  value: unknown
): value is ApplicantExtraction {
  if (!value || typeof value !== "object") return false;

  const data = value as Record<string, unknown>;

  if (typeof data.applicant_id !== "string") return false;
  if (!Array.isArray(data.claims)) return false;

  return data.claims.every((claim) => {
    if (!claim || typeof claim !== "object") return false;

    const c = claim as Record<string, unknown>;

    return (
      typeof c.claim === "string" &&
      (c.type === "explicit" || c.type === "inferred") &&
      typeof c.evidence === "string" &&
      typeof c.confidence === "number" &&
      c.confidence >= 0 &&
      c.confidence <= 1 &&
      typeof c.opportunity_relevance === "string"
    );
  });
}
