# Applicant Intelligence User #1 End-to-End Benchmark Contract v1

Status: DRAFT implementation contract
Scope: short-horizon Applicant Intelligence only
Validation target: User #1

Source documents:

- `docs/NEXT_PHASE.md`
- `docs/product/applicant-intelligence-requirements-v1.md`
- `docs/product/applicant-intelligence-epistemic-contract-v1.md`
- `docs/product/applicant-intelligence-evaluation-v1.md`
- `docs/product/applicant-intelligence-architecture-v1.md`
- `docs/product/applicant-intelligence-development-sequence-v1.md`

## Goal

Define one falsifiable end-to-end benchmark for User #1 before Applicant Intelligence implementation begins.

The benchmark exists to answer a narrow product question:

> Can Opportunity AI turn User #1's canonical evidence into at least one novel, grounded, externally legible insight that creates observable short-horizon Strategic Lift and results in an actionable Opportunity pursuit artifact?

The benchmark is not intended to prove scholarship win-rate improvement, causal resource gain, global Opportunity coverage, or long-run product-market fit.

## Benchmark input

Use the existing canonical User #1 Applicant profile and its supporting source material.

Primary input:

- `examples/applicant-001/canonical-profile-v0.json`
- `examples/applicant-001/source.md`

Existing Opportunity / representation artifacts may be reused where relevant, including the trusted Opportunity fixtures already used for User #1.

Do not modify the canonical profile to make the benchmark easier to pass.

## Benchmark baseline

Record a lightweight stateless baseline using the same canonical Applicant information but without persistent Applicant Intelligence artifacts, Opportunity-space memory, or prior derived intelligence.

The baseline should answer a generic prompt equivalent to:

> Summarize this Applicant's strongest qualities and suggest relevant scholarships, fellowships, grants, or programs.

The baseline is not expected to be exhaustive or vendor-comparative. Its purpose is to test whether Opportunity AI produces meaningful additional structure and Strategic Lift beyond a one-off resume/profile interpretation.

## Required end-to-end flow

The benchmark must expose the following observable sequence:

```text
Canonical Applicant evidence
        ↓
Supported evidence view
        ↓
3–5 candidate insight chains
        ↓
Epistemic review / disposition
        ↓
Human meaning review
        ↓
At least one retained or revised insight
        ↓
Opportunity-space direction(s)
        ↓
Trusted concrete Opportunity candidate(s), where coverage permits
        ↓
Fit / representation / strategy implication
        ↓
Single highest-value unresolved question
        ↓
Concrete next action
        ↓
First-session artifact
        ↓
Human benchmark evaluation
```

## Candidate insight-chain contract

Generate 3–5 candidate chains only.

Each candidate chain must contain, at minimum:

1. supporting canonical evidence references;
2. one or more RELATION steps where appropriate;
3. a PATTERN or higher-order structure;
4. an ABSTRACTION or CONCEPT;
5. optional HYPOTHESIS;
6. semantic level for each material claim;
7. epistemic state for each material claim;
8. Self Model or Market Model classification;
9. concise reasoning bridge;
10. what could weaken, falsify, or clarify the interpretation.

No candidate chain may introduce unsupported financial need, ethnicity, immigration status, first-generation status, or other absent sensitive/consequential attributes.

## Epistemic disposition

Before any candidate insight influences Opportunity strategy, apply the Epistemic Contract.

Allowed dispositions:

```text
accept
revise
hypothesis_only
unknown
reject
```

Hard failures include:

- presenting HYPOTHESIZED material as OBSERVED;
- inventing Applicant facts;
- overwriting Self Model intent with Market Model inference;
- implying eligibility from an Opportunity Direction alone;
- inferring absent sensitive/consequential attributes;
- losing provenance for a material derived claim.

Any accepted chain containing a hard failure causes the benchmark to fail.

## Human meaning review gate

Score each surviving candidate on:

- Groundedness
- Novelty
- Recognition
- Compression
- External Legibility

Use the scoring guidance from `applicant-intelligence-evaluation-v1.md`.

Go/no-go rule:

> At least one candidate must be retained or revised and score >=2 on all five Level 1 dimensions before the benchmark proceeds to Opportunity integration.

If this gate fails, stop. Do not continue to Opportunity-space, matching, or session-artifact integration. Repair meaning generation first.

## Strategic Projection contract

For each retained/revised insight selected for continuation, generate at least one Opportunity-space direction.

Each direction must include:

- label / category / actor type / search term;
- supporting insight reference;
- why that space may value the Applicant;
- epistemic state;
- strategically important unknowns;
- explicit statement that the direction does not itself establish eligibility.

At least one direction should add information beyond terms copied directly from the Applicant source material.

## Trusted Opportunity resolution contract

Resolve directions against the existing trusted Opportunity Databank / Acquisition system.

Rules:

- reuse canonical Opportunity IDs;
- preserve source provenance and freshness;
- do not create a second Opportunity store;
- do not use unrestricted open-web content as canonical truth;
- if no trusted candidate exists, record a coverage limitation explicitly.

Coverage limitation is not a benchmark failure by itself.

Fabricated completion is a failure.

## Fit / Representation / Strategy contract

For each high-priority concrete Opportunity surfaced, record:

- eligibility status / uncertainty;
- fit explanation grounded in Applicant and Opportunity evidence;
- which accepted Applicant insight affected the interpretation;
- whether representation emphasis changed;
- whether evidence priority changed;
- whether pursue/deprioritize reasoning changed;
- whether application strategy changed.

Do not implement a second matching formula.

## Strategic Lift event

A Strategic Lift event is an observable before/after change caused by an accepted Applicant Intelligence insight.

Valid event types include:

- new Opportunity-space discovered;
- Opportunity priority changed;
- previously hidden evidence becomes strategically important;
- representation emphasis changes;
- application strategy changes;
- next action changes;
- an Opportunity is defensibly deprioritized.

At least one accepted insight must create at least one observable Strategic Lift event for the benchmark to pass.

## Key Question contract

Select exactly one highest-value unresolved question or evidence gap for the first benchmark artifact.

The question must state:

1. what is unknown or unresolved;
2. why it matters;
3. which decision could change if answered.

Use the provisional principle:

```text
Question Value increases with
meaningful uncertainty
×
strategic consequence
```

Do not implement a generic information-gain score.

## First-session artifact contract

The benchmark must produce one user-facing artifact containing:

```text
1. new evidence-grounded insight
2. Opportunity-space direction
3. concrete trusted Opportunity candidate(s), where coverage permits
4. fit explanation
5. important missing evidence / key question
6. concrete next action
```

The artifact must preserve enough epistemic labeling and provenance that a reviewer can distinguish fact, inference, hypothesis, unknown, and question without reading hidden prompts or logs.

The artifact must not promise guaranteed immediate cash or guaranteed award outcomes.

## Human evaluation record

For every candidate insight chain, record:

- reviewer disposition: retain / revise / downgrade / reject;
- Groundedness score;
- Novelty score;
- Recognition score;
- Compression score;
- External Legibility score;
- epistemic-compliance result;
- failure taxonomy label where relevant;
- Strategic Lift event(s), if any;
- reviewer notes.

For the final session artifact, record whether each required component is present and usable.

## Pass criteria

The User #1 end-to-end benchmark passes only if all of the following are observed:

1. at least 3 candidate insight chains are generated;
2. at least 1 candidate is retained/revised with score >=2 on all five Level 1 dimensions;
3. at least 1 accepted insight creates observable Strategic Lift;
4. no accepted chain contains a hard epistemic failure;
5. all material derived claims preserve provenance;
6. Self Model and Market Model remain distinct;
7. eligibility uncertainty remains explicit;
8. one key question is tied to a concrete strategic consequence;
9. one complete first-session artifact is produced, subject to trusted Opportunity coverage;
10. a lightweight stateless baseline is recorded for comparison.

Do not claim benchmark success unless all ten criteria are actually observed.

## Failure outcomes

The benchmark may fail for different reasons. Record the first failing layer rather than treating every failure as a model-quality problem.

Suggested failure taxonomy:

```text
F1 evidence/provenance failure
F2 generic/restatement insight
F3 unsupported inference
F4 Self/Market contamination
F5 weak compression / no higher-order meaning
F6 no Recognition / human rejection
F7 trivial Opportunity-space projection
F8 trusted Opportunity coverage gap
F9 no Strategic Lift
F10 poor key-question selection
F11 incomplete / unauditable session artifact
F12 baseline parity — no meaningful advantage over stateless summary
```

## Benchmark outputs

A completed run should produce at least:

1. candidate insight chains;
2. epistemic dispositions;
3. human Level 1 scores;
4. retained/revised insight(s);
5. Opportunity-space direction(s);
6. trusted Opportunity resolution result or coverage limitation;
7. fit / representation / strategy implications;
8. key question;
9. next action;
10. first-session artifact;
11. stateless baseline;
12. pass/fail result and failure taxonomy notes.

## What this benchmark does not prove

A passing result does not establish:

- scholarship or fellowship win-rate lift;
- causal economic impact;
- global Opportunity coverage;
- generalization to multiple Applicants;
- institutional trustworthiness of future third-party assessment;
- fairness of Applicant scoring;
- need for graph/RAG/multi-agent architecture;
- viability of Side B monetization.

Those require later experiments.

## Implementation gate transition

Once this benchmark contract is accepted, the strategy/design gate is complete.

Implementation should begin with:

```text
D0 seam inspection
→ D1 benchmark fixture contract
→ D2 canonical Applicant adapter
```

Do not begin with a graph, RAG system, new persistence layer, UI redesign, Side B surface, Applicant scoring system, or multi-model orchestration.

## Closeout decision for Issue #5

Issue #5 may be closed after this benchmark contract is committed and the issue body is synchronized to show that all implementation-contract artifacts are complete.

Closing Issue #5 means only:

> Applicant Intelligence v1 is sufficiently specified to begin implementation.

It does **not** mean Applicant Intelligence has been implemented or validated.