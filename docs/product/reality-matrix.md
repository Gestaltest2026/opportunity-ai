# Opportunity AI Reality Matrix

This document separates implementation status from real-world validation. A green implementation check is not evidence that a product hypothesis is true.

| Claim | Status | Evidence / next proof |
| --- | --- | --- |
| Applicant is represented across 13 canonical domains | Implemented + tested | Zod schema and deterministic verification |
| Opportunity has a canonical structured schema | Implemented + tested | Zod schema and fixture validation |
| Known registered URLs can be fetched and refreshed | Implemented | Source Registry + refreshSources; real-source scale not yet established |
| Unknown opportunities are automatically discovered across the web | Not implemented | Requires a later discovery layer |
| Databank persists opportunities | Implemented | Validated local JSON store; not SQLite/Supabase |
| Raw source changes can be distinguished from semantic opportunity changes | Implemented + tested | raw_source_hash vs semantic_hash regression |
| LLM opportunity extraction is accurate across real opportunities | Hypothesized / partially tested | One ground-truth fixture exists; Reality Dataset target is 10–20 official opportunities |
| Match reasoning agrees with human judgment across varied cases | Hypothesized / partially tested | One match ground-truth fixture exists; needs multi-case reality dataset |
| Information gain is the right next-question objective | Hypothesized | Do not encode until human best-next-question trials exist |
| Akinator-style questioning materially reduces user effort while preserving decision quality | Hypothesized | Measure questions asked vs opportunity decisions resolved |

## Phase A0 exit criteria

Before implementing a Next Best Question algorithm:

1. Build a 10–20 opportunity dataset from real, official sources relevant to applicant-001 or deliberately chosen contrast cases.
2. Create human ground truth for each opportunity.
3. Run LLM extraction against those sources and record field-level errors, missing expected signals, and prohibited inferences.
4. Build varied match cases: eligible/actionable, eligible/unavailable, ineligible, and needs-clarification.
5. Manually choose the best next question for unresolved cases and record how many opportunity decisions each answer resolves.
6. Only then derive and test a Question Value model.
