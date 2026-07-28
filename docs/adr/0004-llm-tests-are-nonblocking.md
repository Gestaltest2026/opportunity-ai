# ADR 0004: LLM tests are non-blocking CI

## Context

LLM-backed verification depends on external model availability, latency, rate limits, cost, and nondeterministic output. Treating those tests as mandatory on every push would make a red CI ambiguous: the code may be healthy while the external dependency is not.

## Decision

`npm run verify` contains deterministic offline checks and is suitable as required CI. `npm run verify:llm` remains a separate integration suite for manual, scheduled, or pre-release runs and is not a blocking per-push check.

## Consequences

- A failed required CI check continues to mean the repository itself is broken.
- LLM integration drift is still monitored, but on a separate cadence.
- Future GitHub Actions workflows must preserve this tier separation.
