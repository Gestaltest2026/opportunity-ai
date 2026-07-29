# Applicant Intelligence Product Requirements v1

Status: DRAFT implementation contract
Scope: short-horizon Applicant Intelligence only
Source strategy: `docs/NEXT_PHASE.md`
Validation target: User #1

## Product objective

Opportunity AI should use the Applicant's existing evidence to discover under-recognized value, reveal Opportunity-spaces the Applicant may not have considered, and improve the discovery, selection, representation, prioritization, and pursuit of near-term Opportunities.

The system is not successful merely because it produces sophisticated language. The long-run objective is increased access to valuable resources and Opportunities.

## Required product behaviors

### PR-1 — Consume canonical Applicant evidence without rewriting it

Given an existing canonical Applicant profile and its supporting evidence, the system must treat those facts as the source material for intelligence generation.

It must not silently rewrite canonical facts, Applicant intent, goals, or constraints.

### PR-2 — Produce evidence-grounded connections

The system must be able to connect two or more relevant Applicant facts when the connection is defensible and useful.

Every derived connection must preserve provenance to the supporting evidence or canonical facts.

### PR-3 — Produce higher-order patterns and abstractions

The system must be able to organize multiple supported facts or relations into recurring patterns, abstractions, or concepts that add information beyond restating the inputs.

Generic labels are allowed when they are useful, but the system should be capable of generating more specific language when it better compresses the evidence.

### PR-4 — Preserve epistemic separation

Outputs must distinguish at least the following reasoning states conceptually:

- observed;
- derived;
- hypothesized;
- unknown;
- question.

The first implementation does not require a numeric confidence score.

Hypotheses must never be presented as observed facts.

### PR-5 — Keep Self Model and Market Model distinct

The system must distinguish between:

- Applicant intent, self-description, goals, priorities, and constraints; and
- evidence-grounded external interpretations of capability, scarcity, value, or market fit.

The system may surface disagreement between the two as an insight, but must not overwrite Applicant intent with inferred market fit.

### PR-6 — Generate at least one useful hidden-value insight

For the User #1 benchmark, the system must produce at least one candidate insight that:

- is traceable to evidence;
- adds meaning beyond a simple restatement;
- is reviewable by a human;
- could plausibly change search, representation, prioritization, or application strategy.

### PR-7 — Project accepted insight into Opportunity-space

The system must be able to translate an evidence-grounded Applicant insight into at least one strategic Opportunity-space direction, category, actor type, or search term.

It should form the Opportunity-space before jumping directly to a single concrete Opportunity.

### PR-8 — Connect Opportunity-space to concrete trusted Opportunities

Where the current Opportunity Databank / Acquisition system contains relevant candidates, the system must connect the strategic direction to concrete Opportunities from trusted sources.

It must preserve existing source, freshness, and provenance discipline.

It must not treat unrestricted open-web content as canonical truth.

### PR-9 — Explain why a high-priority Opportunity fits

For every high-priority concrete Opportunity surfaced in the first benchmark, the system must provide an evidence-grounded explanation linking Applicant evidence or derived insight to relevant Opportunity criteria, preferences, or strategic properties.

The explanation must not invent eligibility facts.

### PR-10 — Identify strategically important missing information

The system must identify the most important unknown, missing evidence, or unresolved hypothesis that could materially change understanding or short-horizon strategy.

The first version should not implement a generic information-gain optimizer.

A provisional question-selection principle is that uncertainty matters more when the answer could materially change strategy.

### PR-11 — Produce a concrete next action

The first-session output must end with at least one concrete next action, such as:

- verify a critical eligibility fact;
- gather a missing piece of evidence;
- pursue a high-priority Opportunity;
- deprioritize an Opportunity;
- prepare a specific application component;
- answer a strategically important question.

### PR-12 — Prioritize for short-horizon constraints

The current product must optimize the Applicant's existing assets rather than design a multi-month or multi-year development plan.

Priority should reflect current constraints such as availability, eligibility uncertainty, fit, strategic value, and application timing where the existing system can support them.

### PR-13 — Produce a minimum useful first-session artifact

The User #1 benchmark should produce an artifact containing, where the trusted Opportunity universe allows:

```text
new evidence-grounded insight
+ new Opportunity-space direction
+ concrete Opportunity candidate(s)
+ fit explanation
+ important missing evidence / key question
+ next action
```

The product must not promise guaranteed immediate cash or guaranteed award outcomes.

### PR-14 — Remain auditable by a human

A human reviewer must be able to trace each material derived insight and strategic recommendation back to supporting Applicant evidence and, when relevant, Opportunity evidence.

The product should make it possible to reject, revise, or retain derived interpretations without modifying canonical source facts.

### PR-15 — Preserve systemic differentiation from a generic chat session

The implementation should use the system's persistent Applicant knowledge and existing Opportunity intelligence rather than behave like a stateless one-off resume prompt.

The product differentiation should come from the combination of:

```text
Persistent Applicant Memory
× Evidence-grounded Applicant Intelligence
× Fresh Opportunity Universe
× Opportunity / Resource-holder understanding
× Closed-loop learning
```

The first benchmark does not need to implement all future closed-loop learning behavior, but must preserve compatibility with it.

## Explicit non-requirements for this phase

Do not build the following as part of Applicant Intelligence v1:

- universal Applicant scoring or a credit-score analogue;
- institutional Applicant assessment products;
- Side B foundation / donor dashboards;
- aggregate Talent Intelligence;
- new Opportunity creation / institutional program design;
- Applicant Development / long-horizon Opportunity Engineering;
- unrestricted open-web crawling;
- generic Next Best Question optimization;
- vector DB / RAG migration;
- persistence migration;
- multi-model provider routing;
- pricing, transaction, or success-fee systems;
- multi-applicant generalization unless required by a concrete defect.

## Acceptance target for Product Requirements phase

The Product Requirements phase is complete when these behaviors are accepted as the initial implementation contract and can be mapped to:

1. an epistemic contract;
2. a User #1 evaluation rubric;
3. a minimal architecture;
4. a development sequence;
5. one end-to-end benchmark.

No Applicant Intelligence implementation should begin until those remaining contract artifacts are defined.
