import { createHash } from "node:crypto";
import { CandidateClassification } from "./classifyCandidate";
import { DiscoveryCandidate } from "./candidateSchema";
import { HumanException } from "./exceptionQueue";

function stableExceptionId(value: string): string {
  return `exception-${createHash("sha256").update(value).digest("hex").slice(0, 16)}`;
}

export function exceptionFromCandidateClassification(
  candidate: DiscoveryCandidate,
  classification: CandidateClassification,
  createdAt: string = new Date().toISOString()
): HumanException | null {
  if (classification.disposition !== "human_review") return null;

  return {
    exception_id: stableExceptionId(
      `candidate_classification_ambiguity:${candidate.candidate_id}`
    ),
    exception_type: "candidate_classification_ambiguity",
    status: "open",
    source_id: candidate.source_id,
    candidate_id: candidate.candidate_id,
    opportunity_id: null,
    summary: `Candidate requires human classification review: ${candidate.url}`,
    evidence: [
      `title_hint=${candidate.title_hint ?? "null"}`,
      `category=${classification.category}`,
      `confidence=${classification.confidence}`,
      classification.reason,
    ],
    human_decision_needed:
      "Decide whether this URL is a single official Opportunity detail page, a non-opportunity page, or another source/index that should remain in discovery.",
    resume_stage: "classification",
    created_at: createdAt,
    resolved_at: null,
    resolution_note: null,
  };
}

export function createAcquisitionException(input: {
  exceptionType:
    | "extraction_ambiguity"
    | "conflicting_official_sources"
    | "eligibility_taxonomy_ambiguity"
    | "duplicate_identity_ambiguity";
  stableKey: string;
  sourceId?: string | null;
  candidateId?: string | null;
  opportunityId?: string | null;
  summary: string;
  evidence: string[];
  humanDecisionNeeded: string;
  resumeStage: "intake" | "opportunity_normalization" | "matching";
  createdAt?: string;
}): HumanException {
  return {
    exception_id: stableExceptionId(`${input.exceptionType}:${input.stableKey}`),
    exception_type: input.exceptionType,
    status: "open",
    source_id: input.sourceId ?? null,
    candidate_id: input.candidateId ?? null,
    opportunity_id: input.opportunityId ?? null,
    summary: input.summary,
    evidence: input.evidence,
    human_decision_needed: input.humanDecisionNeeded,
    resume_stage: input.resumeStage,
    created_at: input.createdAt ?? new Date().toISOString(),
    resolved_at: null,
    resolution_note: null,
  };
}
