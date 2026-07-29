# Applicant Intelligence Reasoning v2 — Research Plan

Status: EXPERIMENT PLAN ONLY — do not adopt into production D3 before baseline comparison
Scope: User #1 Applicant Intelligence meaning generation

## Purpose

Strengthen Applicant Intelligence's ability to infer defensible latent human value from multiple facts without turning the system into a generic admissions-style narrative generator.

The current D3 remains the baseline. v2 is a competing reasoning treatment, not a replacement.

## Governing experiment

```text
Current D3 baseline
→ User #1 D5 human scores
→ failure analysis
→ D3-v2 reasoning treatment
→ same User #1 evidence
→ same D5 scoring rubric
→ paired comparison
→ adopt only if v2 produces a material improvement without new epistemic failures
```

Do not change the D5 acceptance threshold for v2. Do not score v2 more generously because it is more sophisticated.

## Research premise

Selective admissions review often extracts meaning from the whole record rather than treating activities, academics, responsibilities, recommendations, and context as isolated facts. The useful abstraction for Opportunity AI is not "holistic admissions" itself, but a latent-value inference problem:

```text
Sparse evidence
→ cross-context structure
→ competing explanations
→ best evidence-grounded compression
→ human recognition
→ external value translation
```

Opportunity AI must remain applicant-centric. It should not optimize for a particular university's selection criteria.

## v2 inference operators

### O1 — Structural recurrence

Question:

> Does a similar behavioral structure recur across materially different contexts?

A strong recurrence is not keyword repetition. It should link independent contexts whose surface vocabulary may differ.

Example shape:

```text
ambiguity / need
→ Applicant assumes responsibility
→ creates or maintains structure
→ other people rely on that structure
→ continuity is preserved
```

Evidence quality increases when the recurrence appears across independent domains such as work, family, teaching, entrepreneurship, or community service.

Failure mode:

- relabeling several activities with a generic trait such as leadership, resilience, service, or grit.

### O2 — Trajectory

Question:

> Does responsibility, scope, complexity, or trust accumulate over time?

Trajectory is not chronological summary. It should identify directional change.

Possible forms:

- participant → organizer → founder;
- assistant → specialist → operational owner;
- one-time activity → sustained institution;
- local responsibility → cross-context responsibility.

Failure mode:

- treating title changes as proof of capability without supporting responsibility evidence.

### O3 — Context-adjusted signal

Question:

> How does the meaning of an observed outcome change when available resources, constraints, and opportunity set are considered?

Context may change signal strength, but hardship itself is not an achievement and must not be converted into unsupported merit claims.

Use only explicit, confirmed context evidence.

Failure mode:

- "suffered more, therefore stronger Applicant";
- inferring financial need, immigration status, disadvantage, or other sensitive attributes absent evidence.

## Hypothesis competition

v2 should not move directly from evidence to one polished concept.

For the same evidence cluster, generate multiple plausible latent explanations and compare them.

Minimum comparison questions:

1. Which hypothesis explains the largest amount of independent evidence?
2. Which requires the fewest unsupported assumptions?
3. Which important evidence does each hypothesis fail to explain?
4. Is the hypothesis substantially more informative than the existing prior interpretations?
5. Could the observed pattern plausibly arise without the proposed latent property?

The output should prefer explanatory compression over rhetorical attractiveness.

## Counterfactual pressure test

For each candidate latent concept, test:

> If this concept were false, would the observed evidence pattern still be unsurprising?

Interpretation:

- If yes, the concept is weak or generic.
- If no or only with several additional assumptions, the concept may have higher explanatory value.

This is not causal proof. It is a structured anti-fluff test.

## Aha target

The desired human reaction is not merely "new wording."

Target:

> I had not framed myself this way before, but after seeing the evidence connection, it feels difficult to unsee.

Operationally this must still be evaluated through the existing five D5 dimensions:

- Groundedness
- Novelty
- Recognition
- Compression
- External Legibility

Do not add a new production score before the paired experiment demonstrates a need.

## Baseline preservation

Before implementing v2 generation:

1. run current D3 on User #1 using the evidence-isolated D5 path;
2. preserve the exact candidate chains, epistemic diagnostics, and human review bundle;
3. record the model identifier and relevant generation configuration;
4. freeze those artifacts as the baseline treatment;
5. only then introduce v2.

Without a frozen baseline, no claim of improvement is valid.

## Paired comparison design

Use the same:

- Applicant evidence;
- prior-interpretation reference set;
- epistemic guard;
- human reviewer;
- scoring rubric;
- D5 thresholds.

Compare at minimum:

```text
best accepted chain score profile
number of accepted/revised chains
number of epistemically blocked chains
generic-label failure count
duplication-with-prior-interpretation count
human Recognition reaction
```

A v2 win requires more than prettier prose.

## Adoption rule

Adopt v2 into the canonical D3 path only if all are true:

1. at least one v2 chain passes the existing D5 gate;
2. v2 materially improves at least Novelty, Compression, or Recognition relative to baseline;
3. Groundedness does not degrade;
4. epistemic hard failures do not increase materially;
5. the improvement is attributable to reasoning quality rather than looser human scoring.

Otherwise retain current D3 and repair the specific failing operator.

## Non-goals

Do not add during this experiment:

- university-specific admissions scoring;
- Applicant scoring or ranking;
- graph database;
- RAG/vector infrastructure;
- autonomous multi-agent debate;
- separate persistence layer;
- Opportunity projection changes;
- D6–D8 implementation changes.

## Strategic boundary

Admissions-inspired reasoning is an input to Applicant Intelligence, not the product identity.

Opportunity AI's broader objective remains:

```text
Human evidence
→ latent value discovery
→ defensible meaning / Aha
→ external value translation
→ Opportunity-space expansion
→ concrete Opportunity
→ application / action
→ resource gain
```

The distinctive extension beyond admissions is that the system asks not only "how would one institution value this person?" but "which kinds of resource holders could value this latent capability, and what resources can that unlock?"
