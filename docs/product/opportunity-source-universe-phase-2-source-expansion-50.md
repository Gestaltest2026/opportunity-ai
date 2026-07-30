# Opportunity Source Universe Phase 2 — Expansion to 50 Sources

## Purpose

This document records the controlled expansion from the 25-source Phase 2 state toward the 50-source User #1 Opportunity Source Universe v0 completion target.

This is not web-wide discovery. It is still curated source expansion.

## What this expansion adds

This expansion adds a second staged source-additions file:

```text
data/opportunity-source-universe/phase-2-source-additions-50.user-001.json
```

The new staged file adds sources across the remaining coverage gaps:

1. FGCU institutional verification and documentation sources.
2. Federal and Florida public-aid sources.
3. Local Southwest Florida civic/community sources.
4. Legal studies / paralegal / professional-pathway sources.
5. Women / adult learner / career-transition pattern sources.
6. Aggregator directories clearly marked as discovery-only or pattern-only.

## Why staged additions remain separate

The primary watchlist contains live monitoring state:

- `last_checked_at`
- `last_success_at`
- `last_changed_at`
- `content_hash`
- `last_observed_signal_summary`
- `failure_count`

The new sources do not yet have that state. They enter as unobserved staged additions. The scheduled workflow folds them into the primary watchlist deterministically before monitoring.

## Workflow change

The User #1 scheduled workflow now folds both staged addition files into the primary watchlist:

```text
data/opportunity-source-universe/phase-2-source-additions.user-001.json
data/opportunity-source-universe/phase-2-source-additions-50.user-001.json
```

Then it runs:

1. maintenance audit;
2. source monitoring;
3. guarded shortlist triage;
4. coverage report generation.

## Maintenance change

`maintenance:user-001` now accepts multiple staged addition files. This lets the maintenance report inspect the combined staged expansion rather than only the first Phase 2 file.

## Product boundary

The added records are source records, not opportunity recommendations.

The following remain true:

- Official-source verification is required before applicant-facing claims.
- Aggregators cannot prove eligibility.
- Pattern-only sources cannot become recommendations.
- Missing User #1 evidence still blocks `APPLICATION_READY`.
- Access-blocked sources remain visible for manual verification rather than being deleted.

## Expected result after the next scheduled workflow

After the workflow runs, the primary watchlist should approach the 50-source v0 target if the previous 13-source base and both staged addition files are folded together.

The decisive files to inspect are:

```text
examples/applicant-001/source-universe-maintenance-v0.md
examples/applicant-001/source-universe-coverage-v0.md
examples/applicant-001/opportunity-shortlist-v0.md
examples/applicant-001/user-001-evidence-request-v0.md
```

## Next non-code gate

Even if Phase 2 coverage passes, Phase 3 autonomous discovery remains deferred until at least one User #1 application or inquiry has been executed from the curated universe.
