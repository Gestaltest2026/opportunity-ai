# User #1 Curated Opportunity Watchlist v0

## Why this exists

The immediate product need is not a web-wide scholarship crawler. The immediate product need is to stop requiring a human operator to manually trigger every small check while still keeping the system grounded, bounded, and useful for User #1.

This module creates a small, high-trust watchlist of opportunity sources that can be monitored on a schedule without OpenAI API quota, without LLM extraction, and without treating rough data as recommendations.

## What this is

A deterministic monitoring layer for a curated set of official or semi-official opportunity sources.

It can:

- maintain a source registry for User #1;
- fetch each enabled source when it is due;
- hash the source text;
- detect first observations and page-level changes;
- keep failure counts;
- preserve source trust and verification policy;
- generate a markdown report for User #1 opportunity monitoring.

## What this is not

It is not:

- an autonomous web discovery system;
- a crawler;
- a matching engine;
- an LLM extractor;
- an application-ready recommender;
- a substitute for User #1 resume, financial context, transcript, FAFSA, or eligibility verification.

## Core distinction

Discovery and monitoring are separate.

- **Discovery** means finding new sources across the web. That is intentionally out of scope.
- **Monitoring** means periodically checking sources that a human has already selected as trustworthy and relevant. That is in scope.

## Data safety rule

The watchlist uses three separate concepts that must not be collapsed:

1. **Source trust** — whether the page is official, semi-official, aggregator, or archive.
2. **User relevance** — whether the source is high, medium, low, or pattern-only for User #1.
3. **Actionability** — whether the source is application-ready, needs verification, watch-next-cycle, monitor-only, or pattern-only.

A high-relevance source is not automatically application-ready. An aggregator is not enough for an applicant-facing claim. A closed or expired source may be useful for cycle prediction but must not be treated as active.

## Current User #1 fit classes

The v0 watchlist is organized around these opportunity classes:

- FGCU internal scholarships;
- FGCU transfer/admissions scholarships;
- Florida state aid and financial-aid pathways;
- adult women / returning learner grants;
- mothers and family-responsibility education awards;
- external scholarship directories used only for discovery leads;
- pattern-only career-transition funding examples.

## Resume/evidence dependency

The watchlist can monitor sources immediately, but matching quality is blocked by missing User #1 evidence.

The current missing-evidence checklist lives at:

`examples/applicant-001/missing-evidence-v0.md`

Until those facts are confirmed, the system may mark a source as `NEEDS_VERIFICATION`, but it must not mark it as `APPLICATION_READY`.

## Intended workflow

1. A human curates or edits `data/opportunity-source-universe/curated-watchlist.user-001.json`.
2. GitHub Actions runs the deterministic monitor on a schedule.
3. The monitor updates source hashes, timestamps, failures, and signal summaries.
4. A report is written to `examples/applicant-001/opportunity-watchlist-report-v0.md`.
5. A human reviews high-relevance changes before turning anything into an application action.

## Next step after v0

The next product step is not large-scale crawling. It is a User #1 shortlist artifact with three buckets:

- `APPLICATION_READY` — only after official-source and applicant-fact verification;
- `NEEDS_VERIFICATION` — promising source, missing applicant/source facts;
- `WATCH_NEXT_CYCLE` — good fit but closed/upcoming.
