import {
  Applicant,
  ApplicantClaim,
  createEmptyApplicant,
} from "../extraction/applicantSchema";
import { ClarificationQuestion } from "./schema";

export function applyClarificationAnswer(
  applicant: Applicant,
  question: ClarificationQuestion,
  answer: string
): Applicant {
  const next = createEmptyApplicant();

  for (const domain of Object.keys(applicant) as (keyof Applicant)[]) {
    next[domain] = [...applicant[domain]];
  }

  const claim: ApplicantClaim = {
    text: answer.trim(),
    type: "explicit",
    evidence: answer.trim(),
    confidence: 1,
    source: `clarification:${question.question_id}`,
    opportunity_relevance: question.reason,
    status: "confirmed",
  };

  next[question.target_domain].push(claim);
  return next;
}
