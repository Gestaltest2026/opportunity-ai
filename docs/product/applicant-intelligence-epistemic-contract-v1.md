# Applicant Intelligence Epistemic Contract v1

Status: DRAFT implementation contract
Scope: short-horizon Applicant Intelligence only
Source strategy: `docs/NEXT_PHASE.md`
Product requirements: `docs/product/applicant-intelligence-requirements-v1.md`
Validation target: User #1

## Purpose

This document defines how Opportunity AI must distinguish evidence, interpretation, uncertainty, and questions before Applicant Intelligence is implemented.

The goal is not philosophical completeness. The goal is to prevent the system from converting useful interpretation into fabricated fact while still allowing meaningful reasoning.

## Core principle

Opportunity AI may reason beyond explicit Applicant statements, but every material claim must preserve:

1. what is directly supported;
2. what was derived;
3. what remains hypothetical;
4. what is unknown;
5. what evidence supports the claim;
6. whether the claim belongs to the Applicant's Self Model or an external Market Model.

Canonical evidence is never rewritten by downstream interpretation.

## Two orthogonal dimensions

Do not collapse evidence source and reasoning state into one field.

A statement can be Applicant-reported yet still be OBSERVED as a report, while its truth in the external world may remain unverified. Likewise, a market-fit claim can be DERIVED from several confirmed facts.

### Dimension A — Evidence origin

Examples include:

- Applicant statement;
- uploaded document;
- verified institutional record;
- Opportunity official source;
- external benchmark or statistical source;
- prior system-derived claim.

The first implementation does not need a universal taxonomy for every possible source, but material outputs must preserve enough provenance to identify the supporting source.

### Dimension B — Epistemic state

The initial reasoning states are:

```text
OBSERVED
DERIVED
HYPOTHESIZED
UNKNOWN
QUESTION
```

These are categorical states. Do not add a numeric confidence score in v1.

## State definitions

### E-1 — OBSERVED

A claim is OBSERVED when the system can point directly to source evidence that states or demonstrates the claim without requiring a substantive interpretive bridge.

Examples from User #1:

- "Transfer student in Legal Studies at Florida Gulf Coast University, expected graduation in 2027."
- "Founded and leads Ke Ala O Ka Lei Pikake Hula School."
- "Current caregiver for husband with cancer."

Important distinction:

An Applicant statement is observed **as an Applicant statement**. Opportunity AI must not imply independent verification unless the evidence is actually independently verified.

OBSERVED does not mean globally proven; it means directly grounded in the cited source.

### E-2 — DERIVED

A claim is DERIVED when it is a defensible interpretation produced by connecting two or more OBSERVED claims, or by organizing supported evidence into a relationship or recurring pattern.

A DERIVED claim must:

- cite supporting claim/evidence identifiers or equivalent provenance;
- add information beyond paraphrase;
- remain reversible without altering source facts;
- avoid silently introducing a new biographical fact.

Examples from User #1:

- "Working adult returning to higher education after a long professional career."
- "Long-term community leadership through teaching and service."
- "Professional-to-academic legal transition."

A relation, pattern, abstraction, or concept may all be DERIVED. Epistemic state and semantic level are separate dimensions.

### E-3 — HYPOTHESIZED

A claim is HYPOTHESIZED when it is plausible and strategically useful but meaningfully sensitive to missing evidence, alternative explanations, external context, or Applicant confirmation.

Examples:

- "The Applicant may be unusually strong in roles requiring sustained responsibility across multiple domains."
- "Public-service fellowships may value this combination of legal progression and community service."
- "Institutional leadership may be a plausible future direction."

A HYPOTHESIZED claim must never be presented as a canonical Applicant fact.

A hypothesis may still be useful for:

- generating an Opportunity-space;
- selecting a question;
- identifying evidence to collect;
- testing a representation;
- deciding what to investigate next.

### E-4 — UNKNOWN

A claim or decision-relevant variable is UNKNOWN when the available evidence is insufficient to support a useful conclusion.

Examples:

- current GPA when no reliable evidence is present;
- financial need when it has not been confirmed;
- immigration status when it has not been provided;
- whether a specific future role is personally desired when Applicant intent is absent.

UNKNOWN is a valid output. The system should prefer explicit uncertainty over fabricated completion.

### E-5 — QUESTION

A QUESTION is an unresolved item selected for Applicant or human input because resolving it could materially improve understanding or short-horizon strategy.

A question should not exist merely because something is unknown.

Current provisional principle:

```text
Question Value increases when:
uncertainty is meaningful
AND
answer can materially change strategy
```

Potential future factors include user burden, evidence gain, sensitivity, timing, and urgency. Do not encode a generic scoring formula in v1.

## Semantic levels

Epistemic state answers: **How do we know this?**

Semantic level answers: **What kind of meaning is this?**

The initial semantic levels are:

```text
FACT
RELATION
PATTERN
ABSTRACTION
CONCEPT
HYPOTHESIS
OPPORTUNITY_DIRECTION
QUESTION
```

These are not required to become literal TypeScript enums yet. They define the conceptual contract for the benchmark.

### S-1 — FACT

A concrete Applicant or Opportunity claim directly represented in canonical evidence.

Expected epistemic state: normally OBSERVED.

Example:

> Founded a hula school in 2007 and continues to lead it.

### S-2 — RELATION

A meaningful connection between supported facts.

Example:

> The Applicant's legal-office progression and current Legal Studies enrollment connect professional experience with formal legal education.

Expected epistemic state: DERIVED.

### S-3 — PATTERN

A recurring structure supported by multiple facts or relations across contexts or time.

Example:

> Across legal work, teaching, caregiving, and community service, the Applicant repeatedly assumes sustained responsibility for other people or systems.

Expected epistemic state: DERIVED.

A pattern must not be based on a single isolated fact unless explicitly described as tentative.

### S-4 — ABSTRACTION

A higher-order interpretation that compresses one or more patterns into a useful general meaning.

Example:

> Sustained responsibility across professional, family, educational, and community domains.

Expected epistemic state: DERIVED or HYPOTHESIZED depending on how far it extends beyond the evidence.

### S-5 — CONCEPT

A socially legible name or framing used to communicate an abstraction to an Applicant, reviewer, or Resource Holder.

Examples may include conventional labels or newly generated language.

A concept must remain traceable to its supporting abstraction/patterns. Creative naming must not create new facts.

Expected epistemic state: DERIVED when strongly supported; otherwise HYPOTHESIZED.

### S-6 — HYPOTHESIS

A tentative explanation, capability claim, market-fit claim, or future-direction claim that should be tested rather than accepted as fact.

Expected epistemic state: HYPOTHESIZED.

This semantic level is intentionally explicit even though HYPOTHESIZED is also an epistemic state. The distinction is:

- epistemic state = status of certainty;
- semantic level = the output is itself a proposition intended for testing.

### S-7 — OPPORTUNITY_DIRECTION

A strategic projection from Applicant intelligence into a category, actor type, resource type, or search direction.

Examples:

- caregiver-support funding;
- adult-learner foundations;
- community-leadership awards;
- legal/public-service associations.

An Opportunity Direction is not itself a concrete Opportunity and must not imply eligibility.

Expected epistemic state: usually DERIVED or HYPOTHESIZED.

### S-8 — QUESTION

A request for information whose answer could materially alter Applicant understanding, Opportunity-space, eligibility assessment, prioritization, or application strategy.

Expected epistemic state: QUESTION.

## Self Model / Market Model boundary

Every material interpretation should be classifiable as belonging primarily to one of two views.

### Self Model

Contains Applicant-endorsed or Applicant-reported:

- goals;
- preferences;
- identity statements;
- constraints;
- priorities;
- desired future directions;
- self-description.

Market fit must not be written back into the Self Model as if the Applicant endorsed it.

### Market Model

Contains evidence-grounded external interpretations such as:

- demonstrated capability;
- unusual or valuable patterns;
- plausible market fit;
- Resource Holder relevance;
- Opportunity-space implications.

The system may say:

> "Your evidence suggests X may be externally valuable."

It must not silently transform this into:

> "You want X" or "You are definitely X."

A mismatch between Self Model and Market Model may itself be surfaced as an insight.

## Promotion rules

### P-1 — OBSERVED claims cannot be created from inference

A downstream interpretation may never be promoted to OBSERVED merely because the model repeats it confidently or because multiple derived claims agree.

Promotion to OBSERVED requires direct supporting source evidence.

### P-2 — Applicant confirmation can change status, but not erase provenance

If the Applicant explicitly confirms a hypothesis, the confirmation becomes new OBSERVED evidence of Applicant endorsement or report.

The original hypothesis and its derivation history should remain auditable.

Applicant confirmation does not automatically constitute independent external verification.

### P-3 — Market hypotheses do not become Self Model intent without confirmation

External fit, likely aptitude, or Resource Holder appeal remains Market Model interpretation unless the Applicant explicitly endorses the corresponding goal or self-description.

### P-4 — Opportunity direction does not imply eligibility

Generating an Opportunity-space or concrete candidate must not silently imply that the Applicant satisfies hard eligibility requirements.

Eligibility remains governed by Opportunity evidence and the matching layer.

### P-5 — Missing protected/sensitive attributes remain unknown

Do not infer sensitive or materially consequential identity/financial attributes from indirect signals when they are not explicitly supported.

For User #1, examples that must remain unknown without evidence include:

- financial need;
- low-income status;
- first-generation status;
- ethnicity;
- immigration status.

## Rejection and revision rules

Human review may:

- retain a derived claim;
- revise its wording;
- downgrade it to hypothesis;
- mark it unsupported;
- reject it;
- add evidence;
- convert an unknown into an observed Applicant statement through explicit input.

No review action on a derived claim may rewrite the underlying canonical evidence.

## Auditability requirement

For every material non-OBSERVED output in the first benchmark, a reviewer must be able to answer:

1. Which source facts support this?
2. What reasoning step transformed those facts?
3. What semantic level is this?
4. What epistemic state is this?
5. Is this Self Model or Market Model?
6. What would falsify, weaken, or clarify it?
7. What decision could change because of it?

If these questions cannot be answered, the output is not ready to influence Opportunity strategy.

## User #1 benchmark examples

### Example A — valid derived pattern

Evidence:

- founded and sustained hula school since 2007;
- long-term community teaching/performing;
- progressed to Paralegal and Office Manager;
- current caregiver while studying.

Candidate output:

> "The Applicant shows sustained responsibility across professional, educational, family, and community contexts."

Classification:

```text
semantic level: PATTERN
epistemic state: DERIVED
model: MARKET MODEL
```

### Example B — valid hypothesis

Candidate output:

> "This pattern may make the Applicant unusually relevant to fellowships that value mature public-service leadership."

Classification:

```text
semantic level: HYPOTHESIS
epistemic state: HYPOTHESIZED
model: MARKET MODEL
```

This should generate investigation, not an eligibility conclusion.

### Example C — invalid promotion

Invalid output:

> "The Applicant is financially needy and therefore qualifies for need-based awards."

Reason:

No financial-context evidence currently supports the claim. The correct state is UNKNOWN unless new evidence is supplied.

### Example D — Self/Market mismatch

If the Market Model suggests strong community-leadership fit but the Applicant says they do not want leadership-oriented opportunities:

- preserve the external fit insight;
- preserve the Applicant preference;
- do not overwrite either;
- use the conflict to adjust search and prioritization.

## v1 non-goals

This contract does not define:

- numeric confidence calibration;
- universal Applicant scoring;
- automated truth verification of all Applicant claims;
- a knowledge graph implementation;
- a vector database;
- generic information-gain optimization;
- institutional decision scoring;
- bias/fairness policy for a future Side B assessment product;
- multi-model arbitration.

These require separate evidence and design work.

## Acceptance target for Epistemic Contract phase

This phase is complete when:

1. the semantic levels and epistemic states are sufficiently distinct to classify User #1 benchmark outputs;
2. Self Model and Market Model cannot silently overwrite each other;
3. derived claims preserve provenance;
4. hypotheses cannot masquerade as facts;
5. Opportunity directions cannot masquerade as eligibility;
6. missing sensitive or consequential attributes remain unknown;
7. the rules can be mapped into a User #1 evaluation rubric without committing to a premature storage/schema architecture.

No Applicant Intelligence implementation should begin solely because this document exists. Evaluation design, minimal architecture, development sequence, and the end-to-end benchmark must still be defined.
