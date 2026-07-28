import { ApplicantDomain, isApplicantDomain } from "./applicantSchema";
import { ApplicantExtraction } from "./schema";

interface ExpectedClaim {
  claim: string;
  domain: ApplicantDomain;
}

interface GroundTruth {
  expected_claims: ExpectedClaim[];
  claims_not_to_infer_without_confirmation: ExpectedClaim[];
}

export interface ExtractionEvaluation {
  expected_total: number;
  matched: ExpectedClaim[];
  missing: ExpectedClaim[];
  prohibited_inferences: ExpectedClaim[];
  invalid_domains: string[];
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function claimMatches(expected: string, actual: string): boolean {
  const e = normalize(expected);
  const a = normalize(actual);
  return e === a || a.includes(e) || e.includes(a);
}

export function evaluateExtraction(
  extraction: ApplicantExtraction,
  groundTruth: GroundTruth
): ExtractionEvaluation {
  const matched: ExpectedClaim[] = [];
  const missing: ExpectedClaim[] = [];

  for (const expected of groundTruth.expected_claims) {
    const found = extraction.claims.some(
      (actual) =>
        actual.domain === expected.domain &&
        claimMatches(expected.claim, actual.claim)
    );

    (found ? matched : missing).push(expected);
  }

  const prohibited_inferences =
    groundTruth.claims_not_to_infer_without_confirmation.filter((prohibited) =>
      extraction.claims.some(
        (actual) =>
          actual.domain === prohibited.domain &&
          claimMatches(prohibited.claim, actual.claim)
      )
    );

  const invalid_domains = extraction.claims
    .map((claim) => claim.domain as string)
    .filter((domain) => !isApplicantDomain(domain));

  return {
    expected_total: groundTruth.expected_claims.length,
    matched,
    missing,
    prohibited_inferences,
    invalid_domains,
  };
}
