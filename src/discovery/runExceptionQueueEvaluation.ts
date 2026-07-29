import { CandidateClassificationSchema } from "./classifyCandidate";
import { DiscoveryCandidateSchema } from "./candidateSchema";
import {
  enqueueException,
  HumanExceptionQueueSchema,
  resolveException,
} from "./exceptionQueue";
import type { HumanException } from "./exceptionQueue";
import {
  createAcquisitionException,
  exceptionFromCandidateClassification,
} from "./exceptionFactory";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const candidate = DiscoveryCandidateSchema.parse({
  candidate_id: "candidate-1",
  source_id: "source-1",
  provider: "Example University",
  url: "https://example.edu/apply",
  title_hint: "Apply now",
  status: "discovered",
  discovered_at: "2026-07-29T00:00:00.000Z",
  rejection_reason: null,
});

const classification = CandidateClassificationSchema.parse({
  candidate_id: candidate.candidate_id,
  category: "application_portal",
  confidence: 0.85,
  reason: "Portal requires human interpretation before intake.",
  disposition: "human_review",
});

const maybeClassificationException = exceptionFromCandidateClassification(
  candidate,
  classification,
  "2026-07-29T00:00:00.000Z"
);
assert(maybeClassificationException, "Expected candidate ambiguity exception");
const classificationException: HumanException = maybeClassificationException;
assert(
  classificationException.resume_stage === "classification",
  "Classification ambiguity must resume at classification"
);

const additional = [
  createAcquisitionException({
    exceptionType: "extraction_ambiguity",
    stableKey: "opp-1:award",
    opportunityId: "opp-1",
    summary: "Award amount is ambiguous in the official source.",
    evidence: ["Source lists both annual and total amounts."],
    humanDecisionNeeded: "Choose the canonical award interpretation.",
    resumeStage: "intake",
    createdAt: "2026-07-29T00:00:00.000Z",
  }),
  createAcquisitionException({
    exceptionType: "conflicting_official_sources",
    stableKey: "opp-1:deadline",
    opportunityId: "opp-1",
    summary: "Two official pages show different deadlines.",
    evidence: ["Page A: Aug 1", "Page B: Aug 15"],
    humanDecisionNeeded: "Determine which official source controls.",
    resumeStage: "opportunity_normalization",
    createdAt: "2026-07-29T00:00:00.000Z",
  }),
  createAcquisitionException({
    exceptionType: "eligibility_taxonomy_ambiguity",
    stableKey: "opp-1:fafsa",
    opportunityId: "opp-1",
    summary: "FAFSA language may be a preference rather than a hard gate.",
    evidence: ["Official source wording is conditional."],
    humanDecisionNeeded: "Classify the criterion as eligibility, preference, or requirement.",
    resumeStage: "matching",
    createdAt: "2026-07-29T00:00:00.000Z",
  }),
  createAcquisitionException({
    exceptionType: "duplicate_identity_ambiguity",
    stableKey: "url-a:url-b",
    opportunityId: "opp-1",
    summary: "Two official URLs may represent the same Opportunity.",
    evidence: ["Titles match; URLs differ."],
    humanDecisionNeeded: "Confirm whether records should merge or remain separate.",
    resumeStage: "opportunity_normalization",
    createdAt: "2026-07-29T00:00:00.000Z",
  }),
];

let queue = HumanExceptionQueueSchema.parse({ exceptions: [] });
queue = enqueueException(queue, classificationException);
for (const exception of additional) queue = enqueueException(queue, exception);
queue = enqueueException(queue, classificationException);

assert(queue.exceptions.length === 5, `Expected 5 unique exceptions, found ${queue.exceptions.length}`);

const resolved = resolveException(
  queue,
  classificationException.exception_id,
  "Confirmed as application portal; keep out of direct Opportunity intake.",
  "2026-07-29T01:00:00.000Z"
);
const resolvedItem = resolved.exceptions.find(
  (item) => item.exception_id === classificationException.exception_id
);
assert(resolvedItem?.status === "resolved", "Expected resolved exception status");
assert(
  resolvedItem?.resume_stage === "classification",
  "Resolution must preserve resume stage"
);

console.log(
  JSON.stringify(
    {
      typed_exception_categories: "valid",
      deterministic_exception_identity: "valid",
      duplicate_suppression: "valid",
      resolution_state: "valid",
      resume_stage_preserved: "valid",
    },
    null,
    2
  )
);
