import { ApplicantDomain, isApplicantDomain } from "../extraction/applicantSchema";

export interface ClarificationQuestion {
  question_id: string;
  applicant_id: string;
  opportunity_id: string;
  target_domain: ApplicantDomain;
  question: string;
  reason: string;
  expected_information: string;
}

export interface ClarificationQuestionDraft {
  target_domain: ApplicantDomain;
  question: string;
  reason: string;
  expected_information: string;
}

export function isClarificationQuestionDraft(
  value: unknown
): value is ClarificationQuestionDraft {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;

  return (
    isApplicantDomain(data.target_domain) &&
    typeof data.question === "string" &&
    typeof data.reason === "string" &&
    typeof data.expected_information === "string"
  );
}
