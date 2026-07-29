# Next Phase — Applicant Intelligence Strategy

## Last completed phase

Opportunity Acquisition (Issue #3) is closed.

Verified capabilities now include:

- bounded Source Universe
- deterministic candidate discovery
- candidate classification with human-review routing
- accepted-candidate Opportunity intake
- stable Opportunity identity
- Databank upsert
- raw vs semantic change detection
- stale/failure surfacing
- targeted Applicant rematch
- typed Human Exception Queue
- fresh GitHub Actions verification across the deterministic suite

Issue #2 (User #1 Applicant experiment) is also closed.

## Current architectural boundary

The current product can ingest Applicant facts, ingest Opportunities, construct Opportunity-specific representations, evaluate fit, and continuously acquire/update Opportunities from trusted sources.

The next unresolved core is the layer between canonical Applicant facts and strategic Opportunity search.

```text
Canonical Applicant
        ↓
Applicant Intelligence
        ↓
Strategic Directions
        ↓
Opportunity-space
        ↓
Opportunity Acquisition
```

The strategy phase defines Applicant Intelligence before implementation.

## Updated product thesis from founder Q1-Q2

Opportunity AI is not merely a search, matching, or profile-enrichment system.

Its stronger thesis is:

> Opportunity AI should discover evidence-grounded meaning in a person's history, translate that meaning into forms that other people and institutions can understand, and use that understanding to expand the space of resources and opportunities worth pursuing.

The current working pipeline is:

```text
Raw Evidence
→ Memory / Canonical Facts
→ Connections
→ Patterns
→ Abstractions
→ Concepts / Naming
→ Hypotheses
→ Strategic Directions
→ Opportunity-space
→ Matching
→ Application
→ Economic / Opportunity Outcome
```

The objective is not sophisticated language for its own sake. Understanding must eventually improve real allocation outcomes: money, tuition support, living support, access, networks, or other valuable opportunities.

## What "understanding" means

Founder Q1 establishes that remembering prior facts is necessary but insufficient.

The system begins to feel as though it understands an Applicant when it can:

1. remember relevant prior evidence across time;
2. connect facts the Applicant did not explicitly connect;
3. reframe the same factual history from a new but defensible angle;
4. generate an "aha" insight the Applicant had not already articulated;
5. turn that insight into a better search, representation, application, or resource-allocation decision.

A useful shorthand is:

```text
Remember
→ Connect
→ Reframe
→ Aha
→ Act
```

The legal-advocacy analogy is important: the canonical facts remain fixed, while the meaningful framing can change depending on the audience and purpose. Opportunity-specific representation therefore remains valid, but it must be grounded in the same canonical evidence.

## Applicant Intelligence layers

### Layer A — Grounded Understanding

Purpose: establish what can be defended from evidence.

```text
Fact
→ Relation
→ Pattern
```

This layer prioritizes grounding over creativity.

### Layer B — Meaning Generation

Purpose: convert recurring evidence into socially legible meaning.

```text
Pattern
→ Abstraction
→ Concept / Naming
→ Hypothesis
```

The system should not be limited to generic labels such as `leadership`, `resilience`, or `nontraditional student`. It may create more specific language when that language compresses the Applicant's evidence better.

Creative naming is allowed only if the result remains traceable to supporting patterns and facts.

```text
Concept
↑ supported by Patterns
↑ supported by Relations
↑ supported by Facts / Evidence
```

### Layer C — Strategic Projection

Purpose: project the generated meaning into the external opportunity environment.

```text
Concept
→ Who values this?
→ Why would they value it?
→ What resources could they allocate?
→ Where do such actors exist?
→ Which Opportunity-spaces should be explored?
```

Applicant understanding should therefore be capable of expanding the Source Universe rather than merely ranking Opportunities already known to the system.

## Opportunity-space expansion

A key working principle is:

> Applicant understanding itself can expand the Opportunity Universe.

The system should be able to move from evidence such as:

```text
caregiving
+ adult learning
+ legal professional progression
+ community teaching
+ cross-cultural adaptation
```

not directly to one scholarship, but first to new search directions such as relevant foundations, professional associations, public-service programs, caregiver support, community-leadership funding, or other resource-holder categories.

Only after the opportunity-space is formed should Acquisition search for concrete Opportunities.

## Aha as a product requirement

A successful Applicant Intelligence system should sometimes create a reaction equivalent to:

> "I had not thought of myself that way, but the evidence supports it."

This is not sufficient by itself, because novelty can also be wrong. Candidate insights should eventually be evaluated on at least four dimensions:

- **Groundedness** — is it actually supported by evidence?
- **Novelty** — does it add something beyond restating the Applicant's own words?
- **Recognition** — does the Applicant regard it as meaningfully true or illuminating?
- **Actionability** — does it change search direction, representation, application strategy, or resource allocation?

Initial User #1 evaluation can use simple human ratings before any automated metric is designed.

## Questioning / Akinator direction

The future questioning system should not merely fill missing profile fields or optimize generic information gain.

A useful question may create different kinds of value:

```text
Eligibility Gain
Evidence Gain
Understanding Gain
Opportunity-space Gain
```

The system should ask individualized questions because of what it already knows about the Applicant, not because every Applicant receives the same questionnaire.

Generic Next Best Question machinery remains frozen until the Applicant Intelligence benchmark shows which question types actually improve outcomes.

## Two-sided strategic model

Founder Q2 identifies a second side of the market.

### Side A — Resource Seeker

```text
Applicant
→ needs capital / education / access / network
→ Opportunity AI
→ Scholarship / Fellowship / Grant / Program / Connection
```

This remains the current product surface.

### Side B — Resource Holder

Potential future actors include:

- foundations
- philanthropists
- companies
- institutions
- governments
- alumni networks
- other organizations with capital, access, or support to allocate

Their inverse problem is:

> "Given what we value and want to advance, who or what should we support?"

Long-term, Opportunity AI may become an allocation layer between human potential and resources:

```text
Human Potential
      ↕
Opportunity AI
      ↕
Capital / Education / Networks / Institutions
```

### Constraint for the current phase

Do **not** build a Side B product, foundation dashboard, donor marketplace, or institutional sales workflow now.

Side B is a **future product hypothesis and a current architectural constraint**: internal representations should avoid assumptions that make the system permanently one-directional, but current experiments remain Applicant-first.

## Model-provider strategy

Do not hard-code the strategy around a specific model vendor.

Separate capabilities conceptually:

```text
Evidence Reasoning
Concept Generation
Naming / Linguistic Compression
Critique / Verification
```

These capabilities may eventually route to different models. For example, one model could perform grounded reasoning while another specializes in naming or language generation.

No multi-model routing should be implemented until a benchmark demonstrates that the separation materially improves output.

## Design principles to preserve

- Canonical facts and derived inference must remain distinguishable.
- Relations, patterns, abstractions, concepts, and hypotheses are not interchangeable epistemic states.
- Derived claims need evidence, confidence, and reviewability.
- Creative language must never sever traceability to evidence.
- Opportunity-specific representation must not rewrite canonical facts.
- Human review should be concentrated at ambiguity/decision boundaries, not routine data movement.
- Real observed failures should drive complexity; do not pre-build theoretical machinery without evidence.
- The system should generate strategic search directions before recommending individual Opportunities.
- Applicant Intelligence should ultimately cash out into real resource or opportunity outcomes.

## Frozen areas until strategy is resolved

Do not expand these areas during the strategy phase unless a concrete blocking defect appears:

- Opportunity Acquisition D1–D7
- generic Next Best Question / information-gain optimization
- vector DB / RAG
- open-web crawling
- large-scale source expansion
- UI redesign
- persistence migration (SQLite/Supabase/etc.)
- multi-applicant generalization
- generic Narrative Fit formulas
- Side B product surfaces
- donor/foundation marketplace features
- multi-model provider routing

## Remaining strategy questions

Q1 and Q2 have now been answered provisionally and incorporated above.

The next questions should focus on validation and boundaries:

1. **Meaning quality:** How should Opportunity AI decide whether a newly generated interpretation, abstraction, or concept is actually good?
2. **Inference boundary:** How far may the system infer beyond explicit Applicant facts before it must label something a hypothesis or ask the Applicant?
3. **Product behavior / UX:** After an ideal interaction, what should materially change for the Applicant, and how should questioning, insights, search, and action fit together?

These answers should be grounded in real examples rather than abstract preference alone.

## Implementation gate

Do not create an Applicant Intelligence schema, service, class hierarchy, graph model, or LLM prompt architecture until the remaining strategy questions have been answered and the complete strategy has been synthesized into:

1. product behavior requirements
2. epistemic rules (fact vs relation vs pattern vs abstraction vs concept vs hypothesis)
3. evaluation criteria
4. minimal architecture
5. development sequence

Sequence:

```text
Founder answers
→ Strategy synthesis
→ Product requirements
→ Evaluation design
→ Architecture
→ Smallest real experiment
→ Code
```

## First experiment after design

The default validation target remains User #1.

The first Applicant Intelligence benchmark should take the existing canonical profile and generate a small number of candidate insights using the pipeline:

```text
Facts
→ Relations
→ Patterns
→ Abstractions / Concepts
→ Hypotheses
→ Strategic Directions
→ Opportunity-space implications
→ Unknown / next useful question
```

Each candidate insight should preserve provenance back to supporting evidence.

Human evaluation should initially score:

```text
Groundedness
Novelty
Recognition
Actionability
```

The first objective is not to prove ranking lift or scholarship win-rate improvement. It is to establish whether Opportunity AI can reliably generate evidence-grounded meaning that changes understanding or strategic search direction.

## Phase transition status

```text
Issue #2 — User #1 experiment          CLOSED
Issue #3 — Opportunity Acquisition     CLOSED
Engineering closeout / CI              VERIFIED
Founder strategy Q1                    SYNTHESIZED
Founder strategy Q2                    SYNTHESIZED
Remaining strategy questions           OPEN
Applicant Intelligence implementation  NOT STARTED
```
