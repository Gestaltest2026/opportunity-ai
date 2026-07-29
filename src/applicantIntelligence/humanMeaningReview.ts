import { z } from "zod";
import {
  HumanEvaluationSchema,
  InsightChainSchema,
  type ApplicantIntelligenceBenchmark,
} from "./benchmarkSchema";

const PriorInterpretationReferenceSchema = z.object({
  claim_id: z.string(),
  domain: z.string(),
  text: z.string(),
});

export const HumanMeaningReviewInputSchema = z.object({
  applicant_id: z.string(),
  candidate_chains: z.array(InsightChainSchema).min(1),
  prior_interpretations: z.array(PriorInterpretationReferenceSchema).default([]),
});

export const HumanMeaningReviewRecordSchema = z.object({
  chain_id: z.string(),
  evaluation: HumanEvaluationSchema,
  corrected_wording: z.string().nullable().default(null),
  missing_evidence: z.array(z.string()).default([]),
  alternative_explanation: z.string().nullable().default(null),
});

export const HumanMeaningReviewBundleSchema = z.object({
  applicant_id: z.string(),
  reviews: z.array(HumanMeaningReviewRecordSchema),
});

export type HumanMeaningReviewBundle = z.infer<typeof HumanMeaningReviewBundleSchema>;

export function applyHumanMeaningReview(
  benchmark: ApplicantIntelligenceBenchmark,
  reviewBundle: HumanMeaningReviewBundle
): ApplicantIntelligenceBenchmark {
  if (benchmark.applicant_id !== reviewBundle.applicant_id) {
    throw new Error("Review bundle applicant_id does not match benchmark applicant_id.");
  }

  const reviews = new Map(
    reviewBundle.reviews.map((review) => [review.chain_id, review] as const)
  );

  return {
    ...benchmark,
    candidate_chains: benchmark.candidate_chains.map((chain) => {
      const review = reviews.get(chain.chain_id);
      if (!review) return chain;
      return {
        ...chain,
        human_evaluation: review.evaluation,
      };
    }),
  };
}

export function meaningReviewGatePasses(
  reviewBundle: HumanMeaningReviewBundle
): boolean {
  return reviewBundle.reviews.some((review) => {
    const { disposition, scores } = review.evaluation;
    return (
      (disposition === "retain" || disposition === "revise") &&
      scores.groundedness >= 2 &&
      scores.novelty >= 2 &&
      scores.recognition >= 2 &&
      scores.compression >= 2 &&
      scores.external_legibility >= 2 &&
      review.evaluation.failure_codes.length === 0
    );
  });
}
