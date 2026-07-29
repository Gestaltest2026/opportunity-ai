# Applicant Intelligence Development Sequence v1

Status: DRAFT implementation contract
Scope: short-horizon Applicant Intelligence only
Validation target: User #1

Source documents:

- `docs/NEXT_PHASE.md`
- `docs/product/applicant-intelligence-requirements-v1.md`
- `docs/product/applicant-intelligence-epistemic-contract-v1.md`
- `docs/product/applicant-intelligence-evaluation-v1.md`
- `docs/product/applicant-intelligence-architecture-v1.md`

## Goal

Define the smallest implementation order that can falsify or support the Applicant Intelligence product hypothesis quickly, while preserving existing boundaries and avoiding speculative infrastructure.

The development order should prove one auditable User #1 loop before generalization.

## Governing rule

Do not build all architecture components in parallel.

Each step should unlock the next observable question:

```text
Can we read canonical evidence safely?
→ Can we generate useful candidate meaning?
→ Can we enforce epistemic boundaries?
→ Can meaning change Opportunity-space?
→ Can that direction resolve to trusted Opportunities?
→ Can it change fit / representation / strategy?
→ Can we identify the most valuable missing information?
→ Can we compose one actionable session artifact?
→ Does a human judge the result useful?
```

Stop and repair the first failing link before expanding scope.

## Phase D0 — Pre-implementation seam inspection

Before writing Applicant Intelligence code:

1. inspect the current Applicant schema/profile interfaces;
2. inspect the structured LLM boundary;
3. inspect current Opportunity Databank access;
4. inspect matching and representation interfaces;
5. inspect current User #1 fixtures and evaluation artifacts;
6. choose the smallest compatible integration seams.

Deliverable:

- a brief implementation map identifying the actual files/functions to reuse.

Exit condition:

- no duplicate Applicant store, Opportunity store, matcher, or LLM boundary is planned.

## Phase D1 — Benchmark fixture contract first

Create the benchmark input/output fixtures before generation logic.

Define a minimal User #1 benchmark artifact shape capable of representing:

- candidate insight chains;
- semantic level;
- epistemic state;
- Self Model / Market Model;
- provenance references;
- reasoning bridge;
- weakening / clarification condition;
- Opportunity-space direction;
- concrete trusted Opportunity reference where available;
- fit / strategy implication;
- key question;
- next action;
- human evaluation result.

This artifact may initially exist only as a fixture/report format.

Why first:

The benchmark output defines what must be observable. It prevents the implementation from optimizing for internal abstractions that cannot be evaluated.

Exit condition:

- a human can inspect the blank/fixture structure and see where every evaluation criterion will be recorded.

## Phase D2 — Canonical Applicant Adapter

Implement the smallest read-only adapter over the existing User #1 canonical profile.

Required behavior:

- expose supported claims and provenance;
- separate explicit Applicant intent from existing inferred material;
- preserve source identifiers;
- do not mutate canonical facts.

Add focused deterministic verification for:

- source/provenance preservation;
- no mutation of canonical input;
- sensitive/absent attributes remaining absent.

Exit condition:

- User #1 evidence can be consumed in a stable, auditable view without changing the canonical fixture.

## Phase D3 — Candidate Insight Generation

Implement one structured generation boundary for a small number of candidate chains.

Target:

- 3–5 candidate chains only.

Required conceptual path:

```text
FACT
→ RELATION
→ PATTERN
→ ABSTRACTION / CONCEPT
→ optional HYPOTHESIS
```

Every material output must carry:

- provenance;
- semantic level;
- proposed epistemic state;
- Self/Market classification;
- concise reasoning bridge;
- what could weaken or clarify it.

Do not yet add Opportunity resolution, question optimization, persistence, multi-model routing, or autonomous iteration.

Exit condition:

- the system can produce at least three inspectable User #1 candidate chains from canonical evidence.

## Phase D4 — Epistemic Guard

Implement deterministic and/or structured validation around candidate chains.

Minimum checks:

- OBSERVED requires direct support;
- DERIVED requires supporting evidence;
- HYPOTHESIZED is not promoted to fact;
- missing sensitive/consequential attributes remain UNKNOWN;
- Market Model does not overwrite Self Model;
- Opportunity Direction does not imply eligibility.

Allowed dispositions:

```text
accept
revise
hypothesis_only
unknown
reject
```

Exit condition:

- known invalid examples from the epistemic contract are rejected or downgraded;
- valid User #1 derived patterns survive with provenance intact.

## Phase D5 — Human review of meaning before Opportunity integration

Run the first manual evaluation on candidate chains before connecting them to Opportunity data.

Score:

- Groundedness;
- Novelty;
- Recognition;
- Compression;
- External Legibility.

Record retain / revise / downgrade / reject.

Decision gate:

- if no candidate insight is retained or revised with scores >=2 across all five dimensions, do **not** continue to Opportunity integration;
- fix generation or epistemic handling first.

Why:

This is the cheapest point to falsify the central product hypothesis that the system can generate useful new meaning.

## Phase D6 — Strategic Projection

For retained/revised insights, generate Opportunity-space directions.

Required output:

- direction/category/actor type/search term;
- supporting insight reference;
- why that space may value the Applicant;
- epistemic state;
- strategically important unknowns.

Do not jump directly from raw facts to one Opportunity.

Exit condition:

- at least one accepted insight creates a defensible Opportunity-space direction not merely copied from the Applicant source text.

## Phase D7 — Trusted Opportunity Resolution

Resolve Opportunity-space directions against the existing Opportunity Databank / Acquisition system.

Rules:

- reuse canonical Opportunity IDs;
- reuse existing source/freshness/provenance;
- do not create a second store;
- coverage gaps remain explicit.

Exit condition:

- at least one direction resolves to a trusted candidate where current coverage permits, or the benchmark records a truthful coverage limitation.

## Phase D8 — Fit / Representation / Strategy Integration

Pass resolved Opportunities through existing matching / representation boundaries.

Observe whether Applicant Intelligence changes:

- fit explanation;
- representation emphasis;
- strategic value;
- pursue/deprioritize reasoning;
- evidence priority.

Do not create a second matching formula.

Exit condition:

- at least one accepted insight produces an observable Strategic Lift event, or the benchmark records that no lift occurred.

## Phase D9 — Key Question Selection

Select one highest-value unresolved question or evidence gap.

Use judgment consistent with:

```text
meaningful uncertainty
× strategic consequence
```

but do not implement a generic scoring optimizer.

The selected question must explain:

- what is unknown;
- why it matters;
- which decision could change if answered.

Exit condition:

- one question is selected and traceable to a concrete strategic consequence.

## Phase D10 — Session Artifact Composer

Assemble the first-session artifact:

```text
new insight
+ Opportunity-space direction
+ concrete trusted Opportunity candidate(s), where available
+ fit explanation
+ missing evidence / key question
+ next action
```

Preserve epistemic labels and provenance in the artifact.

Exit condition:

- a reviewer can use the artifact without reconstructing hidden reasoning from logs or prompts.

## Phase D11 — Full User #1 benchmark

Run the complete benchmark using `applicant-intelligence-evaluation-v1.md`.

Required acceptance targets:

1. at least 3 candidate insight chains;
2. at least 1 retained/revised insight scoring >=2 on all five Level 1 dimensions;
3. at least 1 accepted insight creates observable Strategic Lift;
4. no accepted chain contains a hard epistemic failure;
5. minimum first-session artifact is complete subject to trusted Opportunity coverage;
6. stateless-summary baseline is recorded for comparison.

Do not claim success unless these are actually observed.

## Phase D12 — Verification and closeout

Only after D11:

- add deterministic verification for stable non-LLM boundaries;
- keep LLM-quality evaluation explicitly separate from deterministic CI;
- document observed failures and unresolved product questions;
- decide whether v1 justifies persistence/generalization or another User #1 iteration.

Potential next decisions must be evidence-driven, such as:

- revise insight generation;
- improve Opportunity-space projection;
- expand trusted Source Universe;
- add another Applicant;
- persist review history;
- revisit question selection.

Do not automatically graduate to graph/RAG/multi-agent architecture.

## Implementation batching

Recommended implementation batches:

### Batch 1 — Observability and evidence safety

```text
D0 seam inspection
D1 benchmark fixture contract
D2 canonical Applicant adapter
```

### Batch 2 — Core intelligence hypothesis

```text
D3 insight generation
D4 epistemic guard
D5 human meaning review
```

This is the first major go/no-go gate.

### Batch 3 — Strategic usefulness

```text
D6 strategic projection
D7 trusted Opportunity resolution
D8 fit / representation integration
```

This tests Strategic Lift.

### Batch 4 — Actionable session loop

```text
D9 key question
D10 session artifact
D11 full benchmark
```

### Batch 5 — Verification / closeout

```text
D12 deterministic verification + observed-result documentation
```

## Stop conditions

Stop expansion and repair the current layer if any of the following occurs:

- generated insight cannot preserve evidence provenance;
- derived claims routinely masquerade as facts;
- User #1 rejects all candidate meaning as generic or wrong;
- Opportunity-space directions are merely keyword restatements;
- Strategic Lift cannot be observed;
- current Opportunity coverage is too narrow to evaluate the hypothesis;
- benchmark output requires hidden/manual reasoning not represented in the artifact.

## Scope protections

During this sequence, do not add unless a concrete blocking defect requires it:

- graph DB;
- vector DB / RAG;
- new persistence layer;
- generic Next Best Question optimizer;
- unrestricted crawler;
- Applicant scoring;
- institutional Side B surfaces;
- Talent Intelligence;
- long-horizon development planner;
- multi-model routing;
- autonomous multi-agent loops;
- new matching engine;
- new UI;
- pricing or transaction systems.

## Sequence decision

The v1 development strategy is **benchmark-first, evidence-first, and gated**.

The first thing to prove is not that the full pipeline can be coded. It is that User #1 evidence can yield at least one novel, grounded, externally legible insight that causes observable short-horizon Strategic Lift.

Only then should the implementation broaden.