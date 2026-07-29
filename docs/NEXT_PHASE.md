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

## Updated product thesis from founder Q1-Q4

Opportunity AI is not merely a search, matching, or profile-enrichment system.

Its stronger thesis is:

> Opportunity AI should discover evidence-grounded meaning in a person's history, translate that meaning into forms that other people and institutions can understand, and use that understanding to improve how resources and opportunities reach that person.

The current product wedge is narrower:

> Use the Applicant's existing evidence to discover under-recognized value and improve the discovery, selection, representation, and pursuit of near-term Opportunities.

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

The objective is not sophisticated language for its own sake. Understanding is instrumental: it should ultimately improve real allocation outcomes such as money, tuition support, living support, access, networks, or other valuable opportunities.

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

## External-world understanding is required

Founder Q3 adds an important constraint: the system cannot judge Applicant value from Applicant data alone.

A useful working model is:

```text
Deep Applicant Model
× External World Knowledge
× Opportunity / Resource-holder Model
= Strategically useful Applicant Intelligence
```

The system should eventually be able to distinguish between:

- something the Applicant personally finds impressive;
- something that is statistically or socially unusual;
- something a particular Resource Holder is likely to value;
- something that can materially improve Opportunity pursuit.

This suggests future knowledge layers such as Applicant knowledge, Opportunity knowledge, Resource-holder knowledge, selection knowledge, and external benchmark knowledge. These are architectural possibilities, not current implementation commitments.

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

This matters because Applicants may normalize or undervalue things they have done. The system should help surface under-recognized value, not merely flatter the Applicant.

Aha is not the terminal objective. Novelty can be wrong, and self-recognition can be strategically irrelevant.

## Meaning-quality and outcome evaluation

Founder Q3 changes the evaluation hierarchy. Insight quality remains necessary, but it is only an upstream measure.

### Level 1 — Insight Quality

Candidate insights can initially be reviewed on dimensions such as:

- **Groundedness** — is it actually supported by evidence?
- **Novelty** — does it add something beyond restating the Applicant's own words?
- **Recognition** — does the Applicant regard it as meaningfully true or illuminating?
- **Compression** — does it organize multiple facts into a useful higher-order structure?
- **External Legibility** — can another person or institution understand why this matters?

### Level 2 — Strategic Lift

A useful insight should change a decision or strategy, for example:

- reveal a previously unseen Opportunity-space;
- change which Opportunities should be pursued;
- expose new evidence worth collecting;
- improve Applicant representation;
- change application or essay strategy;
- improve prioritization under limited time.

### Level 3 — Resource Outcome

The long-run product objective is real-world allocation improvement, such as:

- qualified Opportunities discovered;
- applications submitted;
- awards or acceptances;
- money, tuition support, living support, access, or networks acquired;
- eventually, incremental resource gain attributable to Opportunity AI relative to a plausible baseline.

A useful shorthand is:

```text
Insight Quality
→ Strategic Lift
→ Resource Outcome
```

This prevents the product from optimizing for sophisticated-sounding AI output rather than actual Applicant advantage.

## Current North Star and supporting metrics

The current North Star is not "number of insights" or "number of matched scholarships."

The strongest long-run North Star is:

> Increase the Applicant's ability to acquire valuable resources and Opportunities.

Near-term benchmarks cannot yet prove causal resource lift, so current evaluation should use upstream and intermediate metrics while preserving the downstream objective.

## Short-horizon vs long-horizon Opportunity markets

Founder Q3 identifies a major time-horizon distinction.

### Short-horizon market — current build focus

These are Opportunities close enough that the Applicant cannot materially reinvent their profile before application.

The system should optimize the Applicant's current assets through:

```text
Discovery
× Qualification
× Selection
× Representation
× Application Execution
```

This is the current execution wedge.

### Long-horizon market — future thesis

For Opportunities six months or more away, the problem can change from matching to development:

```text
Target Opportunity
↓
Desired Applicant State
↓
Gap from Current Applicant
↓
Development Strategy
↓
Actions / Experiences / Evidence
↓
Future Applicant
```

This could eventually turn Opportunity AI from a Matching Engine into an Applicant Development / Opportunity Engineering system.

Do not build this now. Preserve it as a future product thesis and architectural consideration only.

## Opportunity access and reversal of advantage

Founder Q3 also introduces a product mission beyond convenience.

Opportunity markets often reward pre-existing advantages such as:

- information access;
- mentors and networks;
- school brand;
- prior application experience;
- available time;
- language and writing support;
- familiarity with funding ecosystems.

Opportunity AI cannot erase all of these advantages, but it may be able to reduce gaps in:

```text
information search ability
+ self-interpretation ability
+ strategic planning ability
```

A useful mission formulation is:

> Reduce the information, search, and interpretation friction between human potential and the systems that allocate resources to it.

This is compatible with the longer-term two-sided allocation thesis without requiring a Side B product now.

## Q4 — Inference boundary and epistemic separation

Founder Q4 adds two important separations: **Applicant self-understanding** is not the same thing as **market-facing assessment**, and a derived interpretation is not the same thing as an observed fact.

### Self Model vs Market Model

The system should preserve two different views rather than collapsing them into one.

**Self Model** may contain:

- what the Applicant wants;
- how the Applicant describes themselves;
- future directions the Applicant explicitly endorses;
- subjective priorities and constraints.

**Market Model** may contain:

- what the Applicant's evidence appears to demonstrate;
- which capabilities or patterns may be scarce or valuable externally;
- which Opportunity-spaces may value those patterns;
- which Resource Holder needs may plausibly align with the Applicant.

The system may identify a mismatch between Self Model and Market Model as an insight, but it must not silently rewrite Applicant intent.

A useful principle is:

> Applicant intent should normally be asked or explicitly provided; external fit may be inferred from evidence and market context, with uncertainty preserved.

### Provisional epistemic states

Do not encode these as a final schema yet. Use them as the current reasoning contract to be tested on User #1.

```text
OBSERVED
Directly supported by source evidence or explicit Applicant statement.

DERIVED
A defensible relationship or pattern generated from supporting evidence.

HYPOTHESIZED
Plausible and potentially useful, but materially sensitive to missing evidence or alternative explanations.

UNKNOWN
Insufficient evidence to make a useful claim.

QUESTION
An unresolved item worth asking because the answer may materially change understanding or strategy.
```

These states are intentionally categorical for now. Do not introduce a numeric confidence score until the benchmark shows that a score improves decisions.

### Question-value principle

Do not ask every uncertain question.

A candidate question becomes more valuable when uncertainty is meaningful **and** the answer could materially change strategy.

A provisional heuristic is:

```text
Question Value ∝ Uncertainty × Strategic Consequence
```

This is a design principle, not a locked algorithm. Q5 may add additional factors such as user burden, evidence gain, psychological sensitivity, or timing.

### Current inference rule

The system may generate evidence-grounded external-fit hypotheses without waiting for Applicant confirmation, but it must:

- preserve provenance;
- preserve the epistemic state;
- avoid presenting hypotheses as facts;
- ask the Applicant when intent, preference, or strategically consequential missing information cannot be safely inferred;
- allow market-facing interpretations to coexist with, rather than overwrite, the Applicant's self-conception.

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

## Future strategic theses — not current product requirements

Q4 surfaces larger possibilities that should be preserved without contaminating the current MVP.

Potential future theses include:

- Opportunity AI as an independent third-party assessment layer between Applicant claims and Resource Holder decisions;
- evidence-backed Applicant signaling infrastructure;
- standardized or semi-standardized capability assessment across Applicants;
- Resource Holder reports about talent availability, missing capabilities, or market bottlenecks;
- aggregate Talent Intelligence derived from many Applicants;
- a multi-provider ecosystem in which multiple assessment providers reduce monopoly risk.

The credit-score analogy is a useful strategic metaphor for independent signaling, but **do not** build an Applicant score, universal ranking, credit-score analogue, or institutional decision product during the current phase.

These future theses introduce major concerns—gaming, verification, appeal rights, transparency, bias, feedback loops, and legitimacy—and require separate validation before implementation.

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
- Self Model and Market Model must remain distinguishable.
- Applicant intent must not be silently inferred and written back as fact.
- Relations, patterns, abstractions, concepts, and hypotheses are not interchangeable epistemic states.
- Derived claims need evidence, uncertainty, and reviewability.
- Creative language must never sever traceability to evidence.
- Opportunity-specific representation must not rewrite canonical facts.
- Human review should be concentrated at ambiguity/decision boundaries, not routine data movement.
- Real observed failures should drive complexity; do not pre-build theoretical machinery without evidence.
- The system should generate strategic search directions before recommending individual Opportunities.
- Applicant Intelligence should ultimately cash out into real resource or opportunity outcomes.
- Build the short-horizon wedge first; preserve long-horizon development as a future thesis.
- Do not confuse Applicant self-esteem uplift with strategic or economic value.
- Do not build universal Applicant scoring or third-party institutional decision infrastructure in the current phase.

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
- long-horizon Applicant Development / Opportunity Engineering
- Applicant scoring / credit-score analogues
- institutional Applicant assessment products
- aggregate Talent Intelligence

## Remaining strategy questions

Q1, Q2, Q3, and Q4 have now been answered provisionally and incorporated above.

The remaining question should focus on behavior:

1. **Q5 — Product behavior / UX:** After an ideal interaction, what should materially change for the Applicant, and how should questioning, insights, search, and action fit together?

This answer should be grounded in a realistic short-horizon Applicant journey rather than abstract preference alone.

## Implementation gate

Do not create an Applicant Intelligence schema, service, class hierarchy, graph model, or LLM prompt architecture until Q5 has been answered and the complete strategy has been synthesized into:

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

Each candidate insight should preserve provenance back to supporting evidence and be tagged using the provisional epistemic states where appropriate.

Human evaluation should initially score Level 1 insight quality, then record whether each accepted insight creates observable Level 2 strategic lift.

The first benchmark should therefore capture at least:

```text
Groundedness
Novelty
Recognition
Compression
External Legibility
Strategic change caused
```

The first objective is not to prove scholarship win-rate improvement. It is to establish whether Opportunity AI can reliably generate defensible new meaning that changes understanding or short-horizon strategic search direction, while preserving eventual Resource Outcome as the terminal objective.

## Phase transition status

```text
Issue #2 — User #1 experiment          CLOSED
Issue #3 — Opportunity Acquisition     CLOSED
Engineering closeout / CI              VERIFIED
Founder strategy Q1                    SYNTHESIZED
Founder strategy Q2                    SYNTHESIZED
Founder strategy Q3                    SYNTHESIZED
Founder strategy Q4                    SYNTHESIZED
Remaining strategy questions           Q5 OPEN
Applicant Intelligence implementation  NOT STARTED
```
