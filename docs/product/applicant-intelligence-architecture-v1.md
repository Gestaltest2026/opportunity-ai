# Applicant Intelligence Minimal Architecture v1

Status: DRAFT implementation contract
Scope: short-horizon Applicant Intelligence only
Validation target: User #1

Source documents:

- `docs/NEXT_PHASE.md`
- `docs/product/applicant-intelligence-requirements-v1.md`
- `docs/product/applicant-intelligence-epistemic-contract-v1.md`
- `docs/product/applicant-intelligence-evaluation-v1.md`

## Goal

Define the smallest architecture capable of running the first User #1 Applicant Intelligence benchmark without introducing infrastructure that has not yet been justified by observed product failures.

This document intentionally does **not** define final persistence, graph, RAG, generic Next Best Question, multi-model routing, or Side B architecture.

## Architectural principle

Do not replace the existing Applicant, Opportunity, Representation, Matching, Acquisition, or Databank boundaries.

Applicant Intelligence v1 should sit between the canonical Applicant and the existing strategic Opportunity flow:

```text
Canonical Applicant
        ↓
Applicant Intelligence v1
        ↓
Strategic Directions / Opportunity-space
        ↓
Existing Opportunity Databank / Acquisition
        ↓
Existing Matching / Representation
        ↓
Application Strategy
```

The first implementation should prove one real intelligence loop before generalizing.

## Minimal components

### A1 — Canonical Applicant Adapter

Purpose:

Read the existing canonical Applicant profile and expose supported claims to Applicant Intelligence without changing canonical source data.

Responsibilities:

- consume existing Applicant profile/evidence;
- identify source/provenance for material claims;
- expose Applicant-reported intent separately from inferred market-facing claims;
- never write derived intelligence back into canonical facts automatically.

Non-responsibilities:

- no new persistence layer;
- no identity inference;
- no Applicant scoring.

### A2 — Insight Generator

Purpose:

Generate a small set of candidate intelligence chains from canonical evidence.

Required conceptual output path:

```text
FACT
→ RELATION
→ PATTERN
→ ABSTRACTION / CONCEPT
→ optional HYPOTHESIS
```

Each material output must include enough metadata to support the epistemic contract:

- semantic level;
- epistemic state;
- Self Model or Market Model;
- supporting evidence / claim references;
- concise reasoning bridge;
- what could weaken or clarify the claim.

v1 behavior:

- generate only a small number of candidate chains for User #1;
- prefer depth and auditability over breadth;
- do not create a generic knowledge graph.

### A3 — Epistemic Guard

Purpose:

Reject or downgrade outputs that violate the epistemic contract before they influence strategy.

Checks include:

- OBSERVED must have direct source support;
- derived claims preserve provenance;
- hypotheses are not presented as facts;
- sensitive/consequential missing attributes remain UNKNOWN;
- Market Model fit does not overwrite Self Model intent;
- Opportunity Direction does not imply hard eligibility.

The guard may return:

```text
accept
revise
hypothesis_only
unknown
reject
```

This is a conceptual boundary for v1; it does not require a universal policy engine.

### A4 — Strategic Projector

Purpose:

Translate accepted Applicant insight into one or more Opportunity-space directions before concrete Opportunity selection.

Example:

```text
Derived pattern:
Long-term responsibility across community, legal, family, and education contexts

→ Opportunity directions:
community leadership
adult learner
caregiver support
legal/public-service associations
```

Required output:

- Opportunity-space label/direction;
- supporting Applicant insight IDs/references;
- why that space may value the Applicant;
- epistemic state;
- whether a strategically important unknown blocks stronger projection.

### A5 — Trusted Opportunity Resolver

Purpose:

Resolve Opportunity-space directions against the **existing** trusted Opportunity Databank / Acquisition system.

Rules:

- reuse existing Opportunity identity, source, freshness, and schema boundaries;
- do not create a second Opportunity store;
- do not use unrestricted web search as canonical truth;
- absence of a concrete Opportunity must remain an explicit coverage limitation rather than fabricated completion.

Outputs:

- trusted concrete candidate Opportunities when available;
- unresolved Opportunity-space when coverage is insufficient.

### A6 — Fit / Strategy Adapter

Purpose:

Connect Applicant Intelligence outputs to existing matching and representation logic without duplicating it.

Responsibilities:

- pass concrete Opportunity candidates through existing fit reasoning where possible;
- preserve eligibility uncertainty;
- explain how accepted Applicant insight changes representation or strategic value;
- avoid implementing a second generic matching formula.

### A7 — Key Question Selector

Purpose:

Select the single most strategically useful unresolved question or missing evidence item for the first benchmark.

Inputs may include:

- UNKNOWN variables;
- HYPOTHESIZED claims;
- eligibility blockers;
- evidence gaps;
- Self/Market mismatch.

v1 rule:

Use human-readable judgment consistent with:

```text
Question Value increases with
meaningful uncertainty
×
strategic consequence
```

Do not implement generic information-gain optimization yet.

### A8 — Session Artifact Composer

Purpose:

Assemble the minimum useful short-horizon output.

Required artifact:

```text
new evidence-grounded insight
+ Opportunity-space direction
+ concrete trusted Opportunity candidate(s), where coverage permits
+ fit explanation
+ important missing evidence / key question
+ next action
```

The composer must preserve provenance and epistemic labels rather than flattening all outputs into prose.

### A9 — Human Evaluation Adapter

Purpose:

Present candidate insight chains and the session artifact in a form that can be scored using `applicant-intelligence-evaluation-v1.md`.

It must support:

- retain;
- revise;
- downgrade;
- reject;
- Level 1 ratings;
- observed Strategic Lift notes;
- failure taxonomy capture.

This may initially be a fixture/report format rather than a UI.

## Minimal data flow

```text
Existing canonical Applicant
        ↓ A1
Supported evidence view
        ↓ A2
Candidate insight chains
        ↓ A3
Epistemically valid / downgraded chains
        ↓ A4
Opportunity-space directions
        ↓ A5
Trusted concrete Opportunities (when available)
        ↓ A6
Fit / representation / strategy implications
        ↓ A7
Most important unresolved question
        ↓ A8
First-session artifact
        ↓ A9
Human benchmark review
```

## State ownership

### Canonical Applicant facts

Owner: existing Applicant model / fixtures.

Applicant Intelligence may read them but must not silently mutate them.

### Derived intelligence

Owner in v1: benchmark output / Applicant Intelligence artifact.

Do not place derived intelligence inside canonical Applicant fields until an observed need justifies a durable storage model.

### Opportunity data

Owner: existing Opportunity Databank / Acquisition system.

Do not duplicate.

### Human review outcome

Owner in v1: evaluation artifact/fixture.

Future persistence may be added only after the benchmark reveals what review history must survive.

## Model boundary

Applicant Intelligence needs structured reasoning but should not hard-code vendor-specific strategy.

v1 should conceptually expose one structured generation boundary for candidate intelligence chains.

Do not add:

- Gemini/OpenAI routing logic;
- model voting;
- multi-agent orchestration;
- automatic self-consistency loops;
- separate naming model.

These remain future optimization possibilities.

## What is deliberately absent

The minimal architecture does **not** include:

- graph database;
- vector database / RAG;
- new relational database;
- generic ontology service;
- Applicant score;
- universal capability rubric;
- Side B institutional product;
- Talent Intelligence;
- long-horizon development planner;
- unrestricted crawler;
- generic question optimizer;
- new Opportunity matcher;
- new UI.

## Integration rule with existing code

Before implementation, inspect actual current interfaces and choose the smallest compatible seam.

Expected reuse targets include the existing:

- canonical Applicant profile/schema;
- structured LLM boundary;
- Opportunity schema and Databank;
- Opportunity Acquisition/source provenance;
- matching evaluation;
- Opportunity-specific representation layer.

Do not assume file names or APIs beyond what exists at implementation time. The architecture defines responsibilities, not mandatory class/module names.

## First benchmark architecture acceptance criteria

The architecture is sufficient if one User #1 run can produce at least three auditable candidate insight chains and one complete reviewed session artifact through the following observable sequence:

```text
Canonical evidence
→ derived insight
→ epistemic review
→ Opportunity-space
→ trusted Opportunity candidate(s), where available
→ fit/strategy implication
→ key question
→ next action
→ human evaluation
```

and if:

1. no canonical Applicant fact is rewritten by derived intelligence;
2. every accepted non-observed material claim is traceable to evidence;
3. Self Model and Market Model remain distinct;
4. eligibility uncertainty remains explicit;
5. the existing Opportunity store/matching boundaries are reused rather than duplicated;
6. the evaluation artifact can record retain/revise/downgrade/reject and Strategic Lift.

## Architecture decision

For v1, use a **linear auditable pipeline with explicit intermediate artifacts**, not a graph platform or autonomous agent loop.

Reason:

The first unknown is whether evidence-grounded meaning generation produces useful strategic lift for User #1. The architecture should optimize for inspectability and falsifiability until that product hypothesis is observed.
