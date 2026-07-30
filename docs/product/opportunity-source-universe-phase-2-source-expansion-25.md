# Opportunity Source Universe Phase 2 Source Expansion to 25

## Purpose

This step expands the User #1 curated Opportunity Source Universe from the initial 13-source watchlist toward the Phase 2 target of 50 curated sources.

The expansion remains intentionally bounded. It does not introduce web-wide discovery, autonomous crawling, LLM extraction, or unverified recommendations.

## What changes

This step adds 12 curated Phase 2 source records covering the most important gaps revealed by the coverage model:

1. FGCU / university aid depth
2. Florida public aid and grant context
3. Women, mothers, and returning-learner grants
4. Local Southwest Florida community foundation sources
5. Legal studies / paralegal professional association sources
6. Local civic and mature-women pattern sources
7. Discovery-only local scholarship connector sources

The new source additions are staged in:

```text
data/opportunity-source-universe/phase-2-source-additions.user-001.json
```

A deterministic merge step folds those additions into the primary watchlist before scheduled monitoring:

```text
npm run watchlist:merge -- \
  data/opportunity-source-universe/curated-watchlist.user-001.json \
  data/opportunity-source-universe/curated-watchlist.user-001.json \
  data/opportunity-source-universe/phase-2-source-additions.user-001.json
```

The merge preserves existing source state. If a source already exists in the primary watchlist, the primary watchlist wins and the duplicate is reported rather than overwritten.

## Why not edit the primary watchlist directly?

The primary watchlist contains live monitoring state: `last_checked_at`, `last_success_at`, `content_hash`, failure counts, and observed summaries.

Phase 2 additions start as unobserved source records. Keeping them in a staged additions file makes the expansion auditable and prevents accidental overwriting of existing monitored state.

## Product boundary

These additions are source-level records, not final opportunity recommendations.

A source may become high priority, but it still cannot become `APPLICATION_READY` unless:

1. the official source is open;
2. the source is successfully observed;
3. source-specific eligibility is verified;
4. User #1 missing evidence is resolved;
5. the shortlist triage engine places it in `APPLICATION_READY`.

## New source classes added

### FGCU and Florida aid

- FGCU Undergraduate Grants
- FGCU Summer Financial Aid

### Women, mothers, and returning learners

- Soroptimist Live Your Dream Awards
- Soroptimist Live Your Dream Application Help Guide

### Local Southwest Florida

- Collaboratory Scholarships
- Collaboratory Scholarship Program Details
- Collier Community Foundation Scholarships
- Scholarship Connector
- Rotary Club of Fort Myers Scholarships
- Naples Woman's Club Scholarship Support

### Legal / paralegal

- Paralegal Association of Florida Scholarships
- NFPA Awards and Scholarships

## Expected result

After the next scheduled workflow run, the primary watchlist should have 25 curated sources. The coverage report should show improved category balance, especially for:

- `LOCAL_SOUTHWEST_FLORIDA`
- `LEGAL_PARALEGAL_PUBLIC_SERVICE`
- `WOMEN_MOTHERS_CAREGIVERS`
- `FGCU_INTERNAL`
- `FLORIDA_PUBLIC_AID`

This still does not complete Phase 2. It moves Phase 2 from 13/50 sources to 25/50 sources.

## Next step

PR 15 should expand from 25 to 50 sources, guided by the generated coverage report rather than by ad hoc source hunting.
