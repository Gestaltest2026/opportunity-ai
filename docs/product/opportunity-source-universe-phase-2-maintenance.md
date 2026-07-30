# Opportunity Source Universe Phase 2 Maintenance Pass

## Why this exists

After Phase 2 source expansion to 25 curated sources, the project needs a maintenance layer before adding more sources.

The risk is not lack of ideas. The risk is silently damaging the operating state:

- overwriting observed source hashes;
- duplicating source IDs;
- treating staged additions as already monitored;
- allowing `application_ready` to bypass source verification;
- expanding to 50 sources before the 25-source midpoint is stable.

This maintenance pass is intentionally not a crawler, not an LLM extractor, and not a recommender.

## What the maintenance report checks

The maintenance report audits:

1. primary watchlist source count;
2. staged addition source count;
3. merged source count estimate;
4. duplicate IDs inside the primary watchlist;
5. duplicate IDs inside staged additions;
6. staged sources already folded into the primary watchlist;
7. staged sources not yet folded into the primary watchlist;
8. enabled but unobserved sources;
9. automation access-blocked sources;
10. high-relevance unobserved sources;
11. suspicious `application_ready` states.

## Blocking conditions

Maintenance fails if:

- the primary and staged watchlists have different applicant IDs;
- duplicate source IDs exist within the primary watchlist;
- duplicate source IDs exist within staged additions;
- any source is marked `application_ready` while not open, not official-source verified, or not successfully observed.

Warnings are allowed for unobserved and access-blocked sources. Those are expected during Phase 2, but they must remain visible.

## Readiness rule before 25 → 50

The project may continue toward 50 curated sources only if:

- no blocking maintenance issues exist;
- the merged source count estimate is at least 25;
- staged additions are explicitly tracked as either already folded or not yet folded;
- source access failures are surfaced rather than hidden.

## Guardrail

Do not confuse maintenance readiness with applicant readiness.

A clean maintenance report means the source universe is structurally safe to expand. It does not mean User #1 is eligible for any source, and it does not create application-ready recommendations.
