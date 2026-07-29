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

Applicant Intelligence now exists as an implemented layer between canonical Applicant facts and strategic Opportunity search.

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

The implementation is intentionally paused at the D5 meaning-review gate before Strategic Projection.

## Updated product thesis from founder Q1-Q5

Opportunity AI is not merely a search, matching, or profile-enrichment system.

Its stronger thesis is:

> Opportunity AI should discover evidence-grounded meaning in a person's history, translate that meaning into forms that other people and institutions can understand, continuously map the external Opportunity world, and use that combined intelligence to improve how resources and opportunities reach that person.

The current product wedge is narrower:

> Use the Applicant's existing evidence to discover under-recognized value, reveal Opportunity-spaces the Applicant may not have considered, and improve the discovery, selection, representation, prioritization, and pursuit of near-term Opportunities.

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
→ Opportunity Acquisition
→ Matching
→ Application Strategy
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

Founder Q3-Q5 add an important constraint: the system cannot judge Applicant value from Applicant data alone.

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

This suggests future knowledge layers such as Applicant knowledge, Opportunity knowledge, Resource-holder knowledge, selection knowledge, external benchmark knowledge, and longitudinal outcome knowledge. These are architectural possibilities, not current implementation commitments.

Founder Q5 strengthens the role of Opportunity Acquisition: continuously refreshed, official-source-grounded Opportunity knowledge is not merely back-office plumbing. It is one of the assets that makes the user experience meaningfully different from a generic chat model.

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

## Q4 — Inference boundary and epistemic separation

Applicant self-understanding is not the same thing as market-facing assessment, and a derived interpretation is not the same thing as an observed fact.

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

### Current epistemic states

```text
OBSERVED
DERIVED
HYPOTHESIZED
UNKNOWN
QUESTION
```

These are now encoded in the Applicant Intelligence benchmark contract and guarded by D4 checks. Do not introduce a numeric confidence score until the benchmark shows that one improves decisions.

### Question-value principle

A candidate question becomes more valuable when uncertainty is meaningful **and** the answer could materially change strategy.

```text
Question Value ∝ Uncertainty × Strategic Consequence
```

This remains a design principle, not a locked algorithm.

## Q5 — Product behavior / UX contract

The ideal 30-minute interaction should not end with a generic profile summary. It should leave the Applicant with materially improved optionality and a concrete next move.

A working journey is:

```text
Applicant input / evidence
↓
Grounded understanding
↓
Connection / abstraction / hidden-fit discovery
↓
New keywords, categories, roles, or Opportunity-spaces
↓
Concrete Opportunities from a fresh trusted universe
↓
Why each Opportunity fits this Applicant
↓
Priority under current constraints
↓
Next action / application strategy
```

### Minimum useful 30-minute output

At minimum, a first-session user should leave with:

1. one or more evidence-grounded insights they had not already articulated;
2. one or more new Opportunity-space directions or search terms;
3. a prioritized set of concrete, currently relevant Opportunities where available;
4. an explanation of why each high-priority Opportunity fits;
5. the most important missing information or evidence that could change the decision;
6. a concrete next action for the current session or immediately afterward.

### Difference from generic ChatGPT

Opportunity AI should become meaningfully different from a general-purpose chat model through the combination of:

```text
Persistent Applicant Memory
× Evidence-grounded Applicant Intelligence
× Fresh, continuously updated Opportunity Universe
× Opportunity / Resource-holder understanding
× Closed-loop application and outcome learning
```

## World coverage and trusted-source discipline

The long-run system should have a global Opportunity horizon, but breadth must not override trust.

Current acquisition principles remain:

- prefer official or trusted sources;
- track freshness and semantic change;
- preserve provenance;
- avoid silently ingesting low-trust or malicious content;
- expand the Source Universe deliberately rather than treating arbitrary open-web content as canonical truth.

Global coverage is a strategic direction, not a requirement to build unrestricted crawling now.

## Two-sided strategic model

### Side A — Resource Seeker

```text
Applicant
→ needs capital / education / access / network
→ Opportunity AI
→ Scholarship / Fellowship / Grant / Program / Connection
```

This remains the current product surface.

### Side B — Resource Holder

Potential future actors include foundations, companies, institutions, governments, alumni networks, philanthropists, and other organizations with capital, access, or support to allocate.

Their inverse problem is:

> "Given what we value and want to advance, who or what should we support?"

Long-term, Opportunity AI may become an allocation layer between human potential and resources.

Do **not** build a Side B product in the current phase.

## Future strategic theses — not current product requirements

Preserve without implementing:

- independent third-party assessment;
- evidence-backed Applicant signaling;
- standardized capability assessment;
- Resource Holder intelligence;
- aggregate Talent Intelligence;
- new Opportunity creation / program design;
- long-horizon Applicant Development.

These future theses introduce major concerns—gaming, verification, appeal rights, transparency, bias, feedback loops, legitimacy, and power concentration—and require separate validation before implementation.

## Model-provider strategy

Do not hard-code the strategy around a specific model vendor.

Separate capabilities conceptually:

```text
Evidence Reasoning
Concept Generation
Naming / Linguistic Compression
Critique / Verification
```

No multi-model routing should be implemented until a benchmark demonstrates material benefit.

## Design principles to preserve

- Canonical facts and derived inference must remain distinguishable.
- Self Model and Market Model must remain distinguishable.
- Applicant intent must not be silently inferred and written back as fact.
- Derived claims need evidence, uncertainty, and reviewability.
- Creative language must never sever traceability to evidence.
- Opportunity-specific representation must not rewrite canonical facts.
- Human review should be concentrated at ambiguity/decision boundaries, not routine data movement.
- Real observed failures should drive complexity; do not pre-build theoretical machinery without evidence.
- The system should generate strategic search directions before recommending individual Opportunities.
- Applicant Intelligence should ultimately cash out into real resource or opportunity outcomes.
- Build the short-horizon wedge first; preserve long-horizon development as a future thesis.
- Do not confuse Applicant self-esteem uplift with strategic or economic value.
- Do not build universal Applicant scoring or institutional decision infrastructure in the current phase.
- The product's moat should come from persistent knowledge, fresh Opportunity data, evidence-grounded reasoning, and closed-loop learning—not from a single clever prompt.

## Founder strategy status

Q1-Q5 have been answered provisionally and incorporated into the current strategy.

```text
Q1 — Understanding                 SYNTHESIZED
Q2 — Meaning generation            SYNTHESIZED
Q3 — Objective / meaning quality   SYNTHESIZED
Q4 — Inference boundary            SYNTHESIZED
Q5 — Product behavior / UX         SYNTHESIZED
```

## Current implementation and validation status

The strategy documents have been converted into product requirements, epistemic rules, evaluation criteria, minimal architecture, development sequence, and the User #1 benchmark contract.

Current engineering state:

```text
D0 — seam inspection                         IMPLEMENTED
D1 — benchmark fixture contract              IMPLEMENTED + DETERMINISTICALLY VERIFIED
D2 — canonical Applicant adapter             IMPLEMENTED + DETERMINISTICALLY VERIFIED
D3 — candidate insight generation            IMPLEMENTED; HUMAN QUALITY UNVERIFIED
D4 — epistemic guard                         IMPLEMENTED + DETERMINISTICALLY VERIFIED
D5 — human meaning-review infrastructure     IMPLEMENTED + DETERMINISTIC GATE VERIFIED
D5 — real User #1 Aha / Recognition          NOT YET OBSERVED
D6 — strategic projection                    NOT STARTED BY DESIGN
```

## Current next step

```text
Freeze current D3 baseline
→ run User #1 through the evidence-isolated D5 path
→ inspect 3–5 real candidate insight chains
→ perform human meaning review
→ if no chain passes, diagnose D3 and test reasoning-v2 treatment
→ if at least one chain passes, proceed to D6 Strategic Projection
```

Do not claim Applicant Intelligence success until a real User #1 insight is retained/revised with scores >=2 across Groundedness, Novelty, Recognition, Compression, and External Legibility.
