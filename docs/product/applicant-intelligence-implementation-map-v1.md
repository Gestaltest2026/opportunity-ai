# Applicant Intelligence Implementation Map v1

Status: D0 seam inspection complete
Scope: short-horizon Applicant Intelligence v1
Validation target: User #1

## Goal

Identify the smallest existing code seams to reuse before implementing Applicant Intelligence. This document records observed interfaces only; it does not create new architecture beyond the approved v1 contract.

## Observed reuse seams

### Applicant source of truth

Observed file: `src/extraction/applicantSchema.ts`

Reuse:

- `ApplicantSchema`
- `ApplicantClaimSchema`
- `ApplicantDomainSchema`
- existing 13-domain Applicant shape

Important constraint:

The current Applicant schema still uses `explicit | inferred` and numeric `confidence`. Applicant Intelligence v1 must not reinterpret those fields as the new epistemic contract. The new intelligence layer should read this canonical shape and keep derived intelligence separate.

### Structured LLM boundary

Observed file: `src/llm/callStructuredLLM.ts`

Reuse:

- `callStructuredLLM(...)`
- Zod-validated structured output
- existing transport / parse / schema error boundaries

Do not introduce a second LLM client or provider router for v1.

### Opportunity source of truth

Observed file: `src/opportunity/schema.ts`

Reuse:

- `OpportunitySchema`
- `opportunity_id`
- availability status
- eligibility / selection preferences
- narrative preferences
- source evidence

Do not create a second Opportunity representation or store.

### Matching seam

Observed file: `src/matching/evaluateMatch.ts`

Reuse:

- `evaluateMatch(applicantId, applicant, opportunity)`
- existing eligibility completion behavior
- existing `needs_clarification` handling
- existing evidence / narrative / strategic-value analysis

Important constraint:

Applicant Intelligence must not create a second generic match score. It may change what evidence or representation is emphasized, while hard eligibility remains governed by the existing Opportunity + Match boundary.

### Representation seam

Observed files:

- `src/representation/schema.ts`
- `src/representation/runRepresentationEvaluation.ts`

Reuse conceptually:

- claim selection roles: `primary | supporting | deprioritized`
- `primary_narrative_themes`
- `fit_rationale`
- `unresolved_high_value_facts`
- `prohibited_inferences`

The representation layer is downstream of Applicant Intelligence. Applicant Intelligence should produce defensible insight / strategic context that representation can consume; it should not rewrite canonical Applicant claims.

### Verification pattern

Observed file: `package.json`

Existing project pattern:

- deterministic verification is separate from LLM-quality evaluation;
- evaluation scripts are explicit `tsx` entrypoints;
- `verify` is the deterministic offline gate;
- `verify:llm` is separate.

Applicant Intelligence should preserve this split.

## Minimal implementation seams

The first implementation should use this mapping:

```text
Existing Applicant fixture/schema
        ↓ read-only
Applicant Intelligence benchmark adapter
        ↓
Existing callStructuredLLM boundary
        ↓
Candidate intelligence chains
        ↓
Epistemic validation
        ↓
Opportunity-space directions
        ↓
Existing Opportunity fixtures / Databank boundary
        ↓
Existing evaluateMatch + representation concepts
        ↓
Benchmark session artifact
```

## D0 decisions

1. No duplicate Applicant store.
2. No duplicate Opportunity store.
3. No duplicate generic matcher.
4. No duplicate LLM client.
5. Derived Applicant Intelligence remains outside the canonical 13-domain Applicant object in v1.
6. The first new artifact should be a benchmark fixture/report shape, not persistence infrastructure.
7. Deterministic epistemic checks should be testable independently of LLM quality.
8. Existing `explicit/inferred/confidence` fields are legacy canonical-profile metadata and must not be treated as equivalent to `OBSERVED/DERIVED/HYPOTHESIZED/UNKNOWN/QUESTION`.

## Next implementation step

Proceed to D1: define the User #1 benchmark fixture contract before generation logic.
