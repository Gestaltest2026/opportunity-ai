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

Current boundary:

```text
Canonical Applicant
        ↓
        ?
        ↓
Strategic Directions
        ↓
Opportunity Acquisition
```

The next phase exists to define the `?` before implementing it.

## Strategic hypothesis

Opportunity AI should not be only a search or matching system.

The stronger product thesis is:

```text
Raw Evidence
→ Canonical Facts
→ Connections
→ Patterns
→ Abstractions
→ Hypotheses
→ Strategic Directions
→ Opportunity-space
```

Applicant Intelligence should therefore be able to connect facts that the Applicant may not have connected, abstract recurring structure from concrete experiences, generate evidence-grounded hypotheses, identify valuable unknowns, and use those insights to expand or reshape the Opportunity-space worth exploring.

This is a hypothesis, not yet an implementation contract.

## Open strategic questions

1. What must the system be able to do before we can honestly say it “understands” an Applicant rather than merely stores a profile?
2. What kinds of useful connections should it infer between facts that the Applicant has not explicitly connected?
3. How far should abstraction go beyond generic labels such as leadership, resilience, or persistence, and how should those abstractions remain evidence-grounded?
4. Given a deeper model of the Applicant, what should the system infer about Opportunity-spaces the Applicant does not yet know exist?
5. What must Opportunity AI do materially better than simply giving the same Applicant information to a general-purpose model such as ChatGPT?

The next strategy session should answer these questions with real examples, especially User #1.

## Design principles to preserve

- Canonical facts and derived inference must remain distinguishable.
- Derived claims need evidence, confidence, and reviewability.
- Opportunity-specific representation must not rewrite canonical facts.
- Human review should be concentrated at ambiguity/decision boundaries, not routine data movement.
- Real observed failures should drive complexity; do not pre-build theoretical machinery without evidence.
- The product should generate strategic search directions before recommending individual Opportunities.

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

## Implementation gate

Do not create an Applicant Intelligence schema, service, class hierarchy, graph model, or LLM prompt architecture until the strategy questions above have been answered and synthesized into:

1. product behavior requirements
2. epistemic rules (fact vs relation vs abstraction vs hypothesis)
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

The first Applicant Intelligence experiment should take the existing canonical profile and test whether the system can produce a small number of genuinely useful, evidence-grounded insights of the form:

```text
Facts
→ Connection
→ Abstraction
→ Hypothesis
→ Opportunity implication
→ Unknown / next useful question
```

Success should be judged by human review of whether the insight changes understanding, search direction, or strategy—not by whether the model produces sophisticated-sounding language.

## Phase transition status

```text
Issue #2 — User #1 experiment          CLOSED
Issue #3 — Opportunity Acquisition     CLOSED
Engineering closeout / CI              VERIFIED
Next phase implementation              NOT STARTED
Next phase strategy                     READY
```
