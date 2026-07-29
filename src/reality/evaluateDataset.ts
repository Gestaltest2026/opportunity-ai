import { OpportunityEvaluation } from "../opportunity/evaluateOpportunity";

export interface RealityDatasetMetrics {
  evaluated_count: number;
  exact_pass_count: number;
  scalar_error_count: number;
  missing_signal_count: number;
  prohibited_inference_count: number;
  pass_rate: number;
}

export function summarizeOpportunityEvaluations(
  evaluations: OpportunityEvaluation[]
): RealityDatasetMetrics {
  const evaluatedCount = evaluations.length;
  const exactPassCount = evaluations.filter(
    (evaluation) =>
      evaluation.scalar_errors.length === 0 &&
      evaluation.missing_expected_signals.length === 0 &&
      evaluation.prohibited_inferences.length === 0
  ).length;

  const scalarErrorCount = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.scalar_errors.length,
    0
  );
  const missingSignalCount = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.missing_expected_signals.length,
    0
  );
  const prohibitedInferenceCount = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.prohibited_inferences.length,
    0
  );

  return {
    evaluated_count: evaluatedCount,
    exact_pass_count: exactPassCount,
    scalar_error_count: scalarErrorCount,
    missing_signal_count: missingSignalCount,
    prohibited_inference_count: prohibitedInferenceCount,
    pass_rate: evaluatedCount === 0 ? 0 : exactPassCount / evaluatedCount,
  };
}
