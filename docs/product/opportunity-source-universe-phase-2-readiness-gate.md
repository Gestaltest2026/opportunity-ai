# Opportunity Source Universe Phase 2 Readiness Gate

## Purpose

This document defines the final control layer for Phase 2 of Opportunity AI.

The previous Phase 2 work added:

1. a curated User #1 opportunity watchlist;
2. staged source expansion from 13 toward 50 sources;
3. deterministic merge behavior;
4. a maintenance audit;
5. a coverage evaluator.

The readiness gate answers a different question:

> Is the curated source universe structurally complete enough to stop expanding and move toward a real User #1 inquiry or application?

## What this gate does

The readiness gate reads:

- the primary User #1 watchlist;
- one or more staged addition files;
- the merged source universe implied by those files;
- the maintenance audit;
- the coverage evaluator.

It then emits:

- `examples/applicant-001/phase-2-readiness-v0.json`
- `examples/applicant-001/phase-2-readiness-v0.md`

## Status values

The gate can return three statuses.

### `BLOCKED_REPAIR_REQUIRED`

The source universe has structural problems that must be repaired before expansion or applicant action.

Blocking examples:

- applicant ID mismatch;
- duplicate IDs inside primary;
- duplicate IDs inside staged additions;
- suspicious `application_ready` source state.

### `PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR`

The source universe is structurally usable, but Phase 2 v0 completion thresholds are not yet met.

This means the next action is source repair, additional curated sources, or waiting for the scheduled monitor to observe newly staged sources.

### `PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE`

The source universe meets Phase 2 coverage thresholds and has no maintenance blocking issues.

This does **not** mean any scholarship is application-ready. It means the source universe is broad enough to stop expanding by default.

## Phase 3 remains blocked

Even if the readiness gate returns `PHASE_2_SOURCE_UNIVERSE_V0_COMPLETE`, Phase 3 autonomous discovery remains blocked.

The project must first execute at least one real User #1 inquiry or application from the curated universe and record the outcome.

This keeps the system aligned with the principle:

> System after transaction.

## Required next action after Phase 2 completion

Once Phase 2 is complete, the next non-code action is not more source expansion.

The next action is:

1. collect User #1 missing evidence;
2. select one high-priority source from the shortlist;
3. verify eligibility at the official source;
4. prepare one inquiry or application;
5. record the outcome.

## Explicit non-goals

The readiness gate does not:

- crawl the web;
- call an LLM;
- infer eligibility;
- generate final recommendations;
- convert aggregator entries into official eligibility evidence;
- permit Phase 3 autonomous discovery.

## Why this matters

Without a readiness gate, Phase 2 can become infinite: more sources, more categories, more archive records, more speculative expansion.

The readiness gate creates a stop condition.

A complete source universe is not the final product. It is the point at which Opportunity AI must return to the real transaction: helping User #1 apply or inquire.
