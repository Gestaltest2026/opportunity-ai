# Opportunity Source Universe Phase 2 Strategy

## Current product state

Opportunity AI now has a bounded User #1 monitoring loop:

1. Applicant Profile v0 exists.
2. Missing Evidence v0 prevents unknown facts from becoming eligibility claims.
3. Curated Watchlist v0 monitors a small set of high-trust sources.
4. Guarded Shortlist Triage converts monitored sources into safe action buckets.
5. The scheduled workflow runs without OpenAI API quota.

Phase 2 starts here. It should not become web-wide discovery.

## Phase 2 goal

Complete a **User #1 Opportunity Source Universe v0**: a curated, categorized, high-trust source map broad enough to support a real scholarship/grant search for User #1 without pretending that rough data is applicant-ready.

Phase 2 is complete when the universe has enough coverage across the funding structures that plausibly matter for User #1:

- university-internal scholarships;
- Florida public aid;
- adult / returning learner support;
- women, mothers, and caregivers;
- legal studies / paralegal / public-service law pathways;
- local Southwest Florida sources;
- discovery, aggregator, and archive sources for pattern learning.

## Non-goals

Phase 2 does not include:

- autonomous web-wide crawling;
- large rough-record generation;
- LLM-based eligibility extraction;
- treating aggregators as eligibility proof;
- turning closed or expired sources into current recommendations;
- treating missing applicant facts as known.

## Operating model

Phase 2 should proceed by source coverage, not by raw count alone.

Each added source must have:

- source tier;
- source role;
- current status;
- actionability;
- verification policy;
- User #1 relevance;
- eligibility / narrative / funder-intent signals;
- a watch reason;
- notes explaining how it should and should not be used.

The source universe can include blocked, closed, or pattern-only sources, but they must remain correctly labeled.

## Phase 2 sequence

### PR 13 — Completion criteria and coverage evaluator

Add a deterministic coverage model that tells us whether the source universe is broad enough to call v0-complete.

Expected output:

- coverage evaluator;
- coverage evaluation fixture;
- User #1 source coverage CLI;
- completion criteria documentation;
- scheduled workflow hook for coverage reports.

### PR 14 — Expand from 13 to 25 sources

Add carefully selected sources in the most direct User #1 categories:

- FGCU / Florida;
- women and adult returning learners;
- legal / paralegal / public-service law.

### PR 15 — Expand from 25 to 50 sources

Add the missing breadth:

- local Southwest Florida community foundations and civic groups;
- professional associations;
- pattern/archive sources;
- additional official or semi-official sources.

### PR 16 — User #1 source universe view

Generate a human-readable map of what the universe now covers, what remains missing, and which opportunity classes are strongest for User #1.

## Phase 3 gate

Do not start autonomous web discovery until both conditions are met:

1. Phase 2 is v0-complete by the coverage criteria.
2. At least one User #1 application or inquiry has been executed from the curated universe.

This protects the project from returning to crawler-first development before there is a real transaction loop.
