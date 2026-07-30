# Source Harvest Queue v1

## Why this exists

The strict eligibility gate can correctly return `APPLICATION_READY: 0`, but it cannot fix a small Opportunity Source Universe. If the known source pie is too small, the system keeps cycling over the same expired, blocked, or membership-dependent candidates.

The Source Harvest Queue is the layer between source-universe expansion lanes and curated watchlist insertion.

```text
Expansion lane
→ search/query task
→ candidate source lead
→ sponsor/official verification
→ curated watchlist candidate
→ strict eligibility gate
→ inquiry or application packet
→ action ledger
```

## Product rule

```text
Harvesting creates source leads.
Verification creates usable source records.
Strict eligibility gating creates application-readiness status.
```

No candidate source becomes `APPLICATION_READY` at harvest time.

## User #1 v1 focus

The first harvest queue intentionally covers only the two highest-fit lanes:

1. Legal / paralegal professional bodies
2. Law-firm scholarship programs

This reflects the strongest User #1 evidence currently available: legal-office progression, legal studies, GPA, and public-safe personal-statement themes. Women/adult learner and institutional sources remain important, but they are second-order until the legal/paralegal source universe is less underseeded.

## Target

```text
Current curated sources: 50
Phase 1 source goal: 150
Harvest queue target: 50 candidate source leads
```

The queue is not expected to produce 50 verified scholarships immediately. It should produce enough candidate sponsor URLs to convert the best verified leads into watchlist records.

## Candidate states

- `query_only`: only a search task exists; no URL has been harvested.
- `candidate_url_observed`: a URL has been found, but sponsor authority and current cycle are not yet verified.
- `official_verification_needed`: the candidate looks relevant, but deadline, eligibility, or source authority remains unresolved.
- `ready_for_watchlist_insert`: the source is public, sponsor/official enough, and ready to become a curated watchlist source.
- `rejected`: the source is unrelated, stale, duplicate, attorney-only, school-incompatible, or otherwise unsuitable.

## Guardrails

- Aggregators discover leads but cannot prove current eligibility.
- Sponsor or official pages are required before applicant-facing claims.
- Law-firm marketing language is not eligibility language.
- Membership, citizenship, degree-program, transcript, enrollment, financial-need, and deadline requirements remain hard blockers until observed.
- Private FAFSA, tax, SSN, income, or full personal-statement material must not be stored in the public repository.

## Expected artifacts

- `data/opportunity-source-universe/source-harvest-queue.user-001.json`
- `examples/applicant-001/source-harvest-queue-v0.json`
- `examples/applicant-001/source-harvest-queue-v0.md`

## Next build step

After this queue exists, the next useful build is a watchlist insertion converter:

```text
ready_for_watchlist_insert candidate
→ CuratedOpportunitySource draft
→ strict schema validation
→ source coverage update
```

That converter should still avoid broad autonomous discovery. The immediate target is bounded manual harvesting in the highest-yield lanes.
