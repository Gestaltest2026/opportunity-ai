# Applicant Intelligence Evaluation Design v1

Status: DRAFT implementation contract
Scope: User #1 short-horizon benchmark
Source strategy: `docs/NEXT_PHASE.md`
Product requirements: `docs/product/applicant-intelligence-requirements-v1.md`
Epistemic contract: `docs/product/applicant-intelligence-epistemic-contract-v1.md`

## Purpose

This document defines how to evaluate Applicant Intelligence v1 before implementation.

The goal is not to prove scholarship win-rate lift yet. The goal is to determine whether the system can produce evidence-grounded new meaning that changes short-horizon Opportunity strategy without fabricating Applicant facts or collapsing uncertainty.

The evaluation hierarchy is:

```text
Insight Quality
→ Strategic Lift
→ Resource Outcome
```

v1 directly evaluates Level 1 and Level 2. Level 3 remains the long-run objective and is recorded when available, but is not an acceptance gate for the first benchmark.

## Unit of evaluation

The primary evaluation unit is a **candidate insight chain**:

```text
supporting evidence
→ relation / pattern
→ abstraction or concept
→ optional hypothesis
→ Opportunity direction
→ concrete Opportunity implication where available
→ key unknown / question
→ next action
```

A single polished sentence is not the unit of success. The chain must be auditable end to end.

## Benchmark source

Use User #1 only for the first benchmark.

Canonical source:

- `examples/applicant-001/source.md`
- `examples/applicant-001/canonical-profile-v0.json`

Existing representations and human match reviews may be consulted to detect duplication, but the benchmark must not merely reproduce those outputs.

## Evaluation dimensions

### L1-1 — Groundedness

Question:

> Is the insight supported by the cited Applicant evidence without introducing unsupported biographical facts?

Rating:

```text
0 = unsupported or contradicted
1 = weak / partially grounded
2 = defensible with identifiable evidence
3 = strongly grounded across multiple supporting facts or sources
```

Hard failure:

- any material fabricated fact;
- sensitive or consequential attribute inferred without evidence;
- hypothesis presented as observed fact.

### L1-2 — Novelty

Question:

> Does the output add useful meaning beyond paraphrasing what the Applicant already explicitly said?

Rating:

```text
0 = restatement only
1 = minor reframing
2 = useful new connection or interpretation
3 = genuinely new and defensible way to understand the Applicant
```

Novelty alone is never sufficient; unsupported novelty fails Groundedness.

### L1-3 — Recognition

Question:

> Does the Applicant or human reviewer regard the interpretation as meaningfully true, illuminating, or worth retaining?

Rating:

```text
0 = rejected / misleading
1 = partly true but not useful
2 = meaningfully true
3 = strong "I had not thought of it that way, but yes" response
```

Recognition records human reaction. It does not promote a derived Market Model claim into externally verified fact.

### L1-4 — Compression

Question:

> Does the insight organize multiple facts into a useful higher-order structure?

Rating:

```text
0 = no compression; isolated fact or generic label
1 = groups facts weakly
2 = organizes several facts into a coherent pattern
3 = creates a compact structure that explains multiple contexts or time periods
```

### L1-5 — External Legibility

Question:

> Could a scholarship reviewer, fellowship provider, association, or other Resource Holder understand why this pattern matters?

Rating:

```text
0 = private/self-referential wording only
1 = understandable but strategically vague
2 = clearly legible to an external reviewer
3 = clearly legible and naturally maps to identifiable Resource Holder values or needs
```

## Level 2 — Strategic Lift

Strategic Lift is not a subjective "good idea" score. Record what changed because of an accepted insight.

For each insight, mark each observable effect as `yes`, `no`, or `not_tested`:

- revealed_new_opportunity_space
- changed_opportunity_priority
- surfaced_missing_evidence
- improved_representation
- changed_application_strategy
- changed_next_action
- caused_deprioritization

Also record a concise `strategic_change_note` describing the before/after decision.

### Strategic Lift acceptance

An accepted v1 insight should create at least one observable strategic change.

An insight may be high-quality but strategically inert. Such an insight is useful research material but does not satisfy the current product wedge by itself.

## Epistemic compliance checks

Each candidate chain must pass all of the following:

- supporting evidence is identifiable;
- semantic level is identified for material derived outputs;
- epistemic state is identified;
- Self Model vs Market Model is preserved where relevant;
- Opportunity direction is not treated as eligibility;
- unknowns remain unknown when evidence is missing;
- Applicant intent is not silently inferred or overwritten;
- derived claims can be rejected without changing canonical facts.

Any violation is a benchmark failure for that chain regardless of prose quality.

## First-session artifact evaluation

The benchmark should also evaluate whether the overall output contains the minimum useful short-horizon artifact:

```text
1. new evidence-grounded insight
2. new Opportunity-space direction
3. concrete Opportunity candidate(s), where trusted universe permits
4. fit explanation for high-priority candidate(s)
5. important missing evidence / key question
6. concrete next action
```

Score each component as:

```text
0 = absent
1 = present but weak / generic
2 = present and decision-useful
```

The session artifact passes when:

- all six components are present unless no trusted concrete Opportunity exists for the direction;
- any absent concrete Opportunity is explicitly explained as a trusted-universe coverage gap rather than fabricated;
- the next action is executable and tied to current short-horizon strategy.

## Human review protocol

For User #1, use one primary human reviewer initially.

For each candidate insight chain, the reviewer should record:

```text
retain | revise | downgrade_to_hypothesis | reject
```

and optionally provide:

- corrected wording;
- missing evidence;
- alternative explanation;
- whether the insight felt novel;
- whether it changed strategy.

Do not optimize for inter-rater reliability in v1. The first objective is to discover failure modes and clarify the rubric.

## Baseline comparison

The first benchmark should include a lightweight baseline to prevent self-congratulation.

Baseline:

> A stateless general-purpose resume/profile summary using the same User #1 canonical information but without persistent Opportunity Intelligence or the Applicant Intelligence chain.

Compare whether Opportunity AI produces:

- more evidence-traceable higher-order insights;
- more useful Opportunity-space expansion;
- clearer unknowns/questions;
- more concrete strategic changes.

This is not a model-vendor benchmark. It is a product-behavior baseline.

## Failure taxonomy

Record failures explicitly rather than only aggregate scores.

Initial failure types:

```text
F1 unsupported_fact
F2 overclaim_from_evidence
F3 generic_label_only
F4 no_novelty
F5 no_external_legibility
F6 self_market_model_collapse
F7 opportunity_direction_as_eligibility
F8 low_value_question
F9 no_strategic_lift
F10 trusted_universe_gap
F11 duplicated_existing_representation
F12 next_action_not_executable
```

Add new failure types only when observed.

## Acceptance criteria for Evaluation Design phase

The Evaluation Design phase is complete when:

1. Level 1 insight dimensions are defined;
2. Level 2 Strategic Lift is observable rather than rhetorical;
3. epistemic compliance checks are explicit;
4. the minimum useful first-session artifact has a scoring rule;
5. a human review protocol exists;
6. a lightweight baseline exists;
7. an initial failure taxonomy exists;
8. the rubric can be applied to User #1 without requiring a production architecture.

## Acceptance criteria for the future User #1 benchmark

The first benchmark should not be declared successful merely because one output sounds impressive.

A provisional benchmark pass requires:

- at least 3 candidate insight chains evaluated;
- at least 1 retained or revised insight with Groundedness >= 2, Novelty >= 2, Recognition >= 2, Compression >= 2, and External Legibility >= 2;
- at least 1 accepted insight producing observable Strategic Lift;
- no accepted chain containing a hard epistemic failure;
- a complete minimum useful first-session artifact, subject to trusted Opportunity coverage;
- all rejected or weak outputs preserved as failure evidence rather than silently discarded.

These thresholds are intentionally provisional. Revise them only after the first observed benchmark run.

## Non-goals

This evaluation does not yet measure:

- causal scholarship win-rate lift;
- causal resource gain;
- Applicant lifetime value;
- institutional adoption;
- fairness of future third-party scoring;
- long-horizon Applicant development outcomes;
- global Opportunity coverage;
- model-vendor superiority.

Those belong to later phases.
