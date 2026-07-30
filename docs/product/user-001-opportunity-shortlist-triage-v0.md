# User #1 Opportunity Shortlist Triage v0

## Why this exists

The watchlist created a bounded, no-token monitor for User #1 opportunity sources. That was necessary but not sufficient: a source monitor tells us what changed, not what User #1 should do next.

This triage layer converts the curated source watchlist into guarded action buckets:

1. `APPLICATION_READY`
2. `NEEDS_VERIFICATION`
3. `WATCH_NEXT_CYCLE`
4. `SOURCE_ACCESS_BLOCKED`
5. `PATTERN_ONLY`

The goal is to move from passive monitoring to an applicant-specific operating loop without allowing unverified source observations or unknown applicant facts to become recommendations.

## Product boundary

This is not a matching engine and not scholarship advice.

It is a deterministic triage artifact that asks:

- Is this source currently open or only useful for a later cycle?
- Is the source official enough to support applicant-facing action?
- Which User #1 facts are still missing before eligibility can be claimed?
- What is the next safe action?

## Guardrail

A source cannot become `APPLICATION_READY` merely because it looks relevant. It must be open, official-source verified, and not blocked by missing applicant facts.

In the current User #1 state, most high-relevance sources should remain `NEEDS_VERIFICATION` or `WATCH_NEXT_CYCLE` because facts such as GPA, FAFSA, financial need, enrollment load, residency, and first-degree status are still unknown.

## Generated artifacts

The scheduled watchlist workflow now generates:

- `examples/applicant-001/opportunity-shortlist-v0.json`
- `examples/applicant-001/opportunity-shortlist-v0.md`
- `examples/applicant-001/user-001-evidence-request-v0.md`

## Intended next human action

Use `user-001-evidence-request-v0.md` to ask User #1 for the few facts that block eligibility verification. After those facts are confirmed, the shortlist can safely promote specific sources from `NEEDS_VERIFICATION` to `APPLICATION_READY`.
