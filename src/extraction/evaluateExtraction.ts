import { z } from "zod";
import { ApplicantDomainSchema } from "./applicantSchema";
import { ApplicantExtraction } from "./schema";

export const ExpectedClaimSchema = z.object({
  claim: z.string(),
  domain: ApplicantDomainSchema,
});

export const ApplicantExtractionGroundTruthSchema = z.object({
  applicant_id: z.string(),
  expected_claims: z.array(ExpectedClaimSchema),
  claims_requiring_caution: z.array(
    ExpectedClaimSchema.extend({
      reason: z.string(),
    })
  ),
  claims_not_to_infer_without_confirmation: z.array(ExpectedClaimSchema),
});

export type ExpectedClaim = z.infer<typeof ExpectedClaimSchema>;
export type ApplicantExtractionGroundTruth = z.infer<
  typeof ApplicantExtractionGroundTruthSchema
>;

export interface ExtractionEvaluation {
  expected_total: number;
  matched: ExpectedClaim[];
  missing: ExpectedClaim[];
  prohibited_inferences: ExpectedClaim[];
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
  groundTruth: ApplicantExtractionGroundTruth
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

  return {
    expected_total: groundTruth.expected_claims.length,
    matched,
    missing,
    prohibited_inferences,
  };
}
