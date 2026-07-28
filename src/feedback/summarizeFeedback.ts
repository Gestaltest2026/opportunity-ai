import { OpportunityFeedback } from "./schema";

export interface FeedbackSummary {
  total: number;
  by_label: Record<OpportunityFeedback["label"], number>;
  average_ai_score_by_label: Partial<
    Record<OpportunityFeedback["label"], number>
  >;
}

export function summarizeFeedback(
  feedback: OpportunityFeedback[]
): FeedbackSummary {
  const labels: OpportunityFeedback["label"][] = [
    "excellent",
    "good",
    "bad",
    "not_relevant",
  ];

  const byLabel: FeedbackSummary["by_label"] = {
    excellent: 0,
    good: 0,
    bad: 0,
    not_relevant: 0,
  };

  const averageAiScoreByLabel: FeedbackSummary["average_ai_score_by_label"] = {};

  for (const label of labels) {
    const rows = feedback.filter((item) => item.label === label);
    byLabel[label] = rows.length;

    const scored = rows.filter((item) => item.ai_score !== null);
    if (scored.length > 0) {
      averageAiScoreByLabel[label] =
        scored.reduce((sum, item) => sum + (item.ai_score ?? 0), 0) /
        scored.length;
    }
  }

  return {
    total: feedback.length,
    by_label: byLabel,
    average_ai_score_by_label: averageAiScoreByLabel,
  };
}
