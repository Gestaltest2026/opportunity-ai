# User #1 Opportunity Source Universe v0 Completion Criteria

## Definition of completion

The User #1 Opportunity Source Universe v0 is complete when it is broad enough to guide User #1 scholarship/grant action without relying on autonomous web discovery.

Completion does **not** mean every possible scholarship has been collected. It means the curated universe covers the major opportunity structures relevant to User #1 and can safely generate watchlist, shortlist, evidence request, and coverage reports.

## Quantitative thresholds

Phase 2 v0 completion requires:

| Criterion | Required threshold |
| --- | ---: |
| Total curated sources | at least 50 |
| Covered source categories | at least 7 |
| Official or semi-official sources | at least 30 |
| Official application sources | at least 10 |
| Pattern/archive sources | at least 10 |
| High-relevance User #1 sources | at least 15 |
| Watch-next-cycle sources | at least 10 |
| Unclassified sources | at most 0 |

## Required source categories

1. `FGCU_INTERNAL`
   - FGCU foundation scholarships, admission scholarships, transfer aid, portals, and department-adjacent sources.

2. `FLORIDA_PUBLIC_AID`
   - Florida state aid, OSFA-style sources, residency-linked aid, public grant sources, and state scholarship directories.

3. `ADULT_RETURNING_LEARNER`
   - Adult learner, returning student, nontraditional, first-degree, interrupted-education, or continuing-education sources.

4. `WOMEN_MOTHERS_CAREGIVERS`
   - Women, mothers, single parents, caregivers, dependent-child, and family-responsibility education support.

5. `LEGAL_PARALEGAL_PUBLIC_SERVICE`
   - Legal studies, paralegal, legal assistant, pre-law, bar association, access-to-law, and public-service legal pathways.

6. `LOCAL_SOUTHWEST_FLORIDA`
   - Lee County, Collier County, Fort Myers, Naples, Southwest Florida, community foundations, Rotary, Kiwanis, and local civic sources.

7. `DISCOVERY_AGGREGATOR_ARCHIVE`
   - College Board, CareerOneStop, Scholarship America-style directories, expired pages, archived lists, and pattern-learning sources.

## Product guardrails

- Aggregators can discover leads but cannot prove current eligibility.
- Official or sponsor sources remain required before an applicant-facing claim.
- Open status alone is not enough for `APPLICATION_READY`; missing applicant facts still block readiness.
- Closed and expired sources can support timing and pattern learning, but not current action.
- Fetch failures must not delete sources; they become manual-verification targets.
- Phase 3 discovery stays deferred until v0 coverage and at least one real User #1 application or inquiry exist.

## Expected Phase 2 artifacts

- `examples/applicant-001/source-universe-coverage-v0.json`
- `examples/applicant-001/source-universe-coverage-v0.md`
- `examples/applicant-001/opportunity-source-universe-view-v0.md` later in PR 16
- `examples/applicant-001/source-gap-report-v0.md` later in PR 16

## Why this matters

Without a coverage model, adding sources becomes an endless collection exercise. With the model, Opportunity AI can say precisely:

- what is covered;
- what is missing;
- whether the universe is ready for User #1 action;
- why web-wide discovery is still premature.
