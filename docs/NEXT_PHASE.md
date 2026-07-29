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

Applicant Intelligence is now implemented through the D5 human meaning-review infrastructure. The unresolved core is no longer whether to define or code this layer, but whether the current D3 generation actually produces a real User #1 Aha that clears the D5 gate before Strategic Projection begins.

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

The strategy below remains the governing product contract; implementation is intentionally paused at D5 pending real human validation.

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

The following states are now encoded in the Applicant Intelligence benchmark contract and guarded by D4. Their meanings remain the same:

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

This is a design principle, not a locked algorithm. Q5 adds likely additional factors such as user burden, evidence gain, psychological sensitivity, timing, and whether asking now delays immediate short-horizon action.

### Current inference rule

The system may generate evidence-grounded external-fit hypotheses without waiting for Applicant confirmation, but it must:

- preserve provenance;
- preserve the epistemic state;
- avoid presenting hypotheses as facts;
- ask the Applicant when intent, preference, or strategically consequential missing information cannot be safely inferred;
- allow market-facing interpretations to coexist with, rather than overwrite, the Applicant's self-conception.

## Q5 — Product behavior / UX contract

Founder Q5 clarifies the desired short-horizon user experience.

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

The system should not promise guaranteed immediate cash. Founder Q5 used a small cash outcome as an intuitive symbol of user value, but the current product contract is to improve actionable access to resources, not to guarantee a payment within 30 minutes.

### Difference from generic ChatGPT

Opportunity AI should become meaningfully different from a general-purpose chat model through the combination of:

```text
Persistent Applicant Memory
× Evidence-grounded Applicant Intelligence
× Fresh, continuously updated Opportunity Universe
× Opportunity / Resource-holder understanding
× Closed-loop application and outcome learning
```

The differentiation is therefore systemic rather than merely conversational.

A general model may generate good advice from a resume. Opportunity AI should know the Applicant longitudinally, know the Opportunity environment continuously, preserve evidence and uncertainty, and turn those two knowledge systems into persistent decisions and actions.

### World coverage and trusted-source discipline

Founder Q5 emphasizes breadth: the long-run system should have a global Opportunity horizon rather than forcing many Applicants into the same small set of visible programs.

However, breadth must not override trust. Current acquisition principles remain:

- prefer official or trusted sources;
- track freshness and semantic change;
- preserve provenance;
- avoid silently ingesting low-trust or malicious content;
- expand the Source Universe deliberately rather than treating arbitrary open-web content as canonical truth.

Global coverage is a strategic direction, not a requirement to build unrestricted crawling now.

## Two-sided strategic model

Founder Q2 identifies a second side of the market, and Q5 sharpens the long-term position.

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

Q4-Q5 surface larger possibilities that should be preserved without contaminating the current MVP.

Potential future theses include:

- Opportunity AI as an independent third-party assessment layer between Applicant claims and Resource Holder decisions;
- evidence-backed Applicant signaling infrastructure;
- standardized or semi-standardized capability assessment across Applicants;
- Resource Holder reports about talent availability, missing capabilities, or market bottlenecks;
- aggregate Talent Intelligence derived from many Applicants;
- a multi-provider ecosystem in which multiple assessment providers reduce monopoly risk;
- Opportunity AI helping Resource Holders design or create new funding programs when existing Opportunity supply does not match observed human potential or social needs;
- Opportunity AI becoming a trusted intermediary whose value comes partly from longitudinal evidence and consistent assessment rather than one-off self-report.

The credit-score analogy is a useful strategic metaphor for independent signaling, but **do not** build an Applicant score, universal ranking, credit-score analogue, or institutional decision product during the current phase.

The "0→1" thesis is also future-facing: current work optimizes access to existing Opportunities (1→100). Future work may help create new resource-allocation channels or Opportunities themselves (0→1). Do not mix these in the current implementation.

These future theses introduce major concerns—gaming, verification, appeal rights, transparency, bias, feedback loops, legitimacy, and power concentration—and require separate validation before implementation.

## Business-model hypothesis — preserve, do not implement

Founder Q5 raises an important alignment constraint: users seeking scholarships or grants are often resource-constrained, so extracting large fees from Side A may conflict with the mission.

A future working hypothesis is:

```text
Side A: free or very low-friction access
Side B: potential institutional revenue
```

Possible future Side B revenue categories include institutional intelligence, sourcing, program design, sponsored Opportunity creation, allocation analytics, or other services to Resource Holders.

No pricing model is selected. Do not implement success fees, transaction fees, institutional billing, or marketplace economics during the current phase.

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
- Do not confuse global Opportunity ambition with unrestricted crawling or low-trust ingestion.
- The first-session UX should produce concrete optionality and action, not merely insight.
- The product's moat should come from persistent knowledge, fresh Opportunity data, evidence-grounded reasoning, and closed-loop learning—not from a single clever prompt.

## Frozen areas until current D5 gate is resolved

Do not expand these areas unless a concrete blocking defect appears:

- Opportunity Acquisition D1–D7
- generic Next Best Question / information-gain optimization
- vector DB / RAG
- unrestricted open-web crawling
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
- new Opportunity creation / 0→1 institutional program design
- pricing / transaction / success-fee systems

## Founder strategy status

Q1-Q5 have now been answered provisionally and incorporated into this strategy checkpoint.

```text
Q1 — Understanding                 SYNTHESIZED
Q2 — Meaning generation            SYNTHESIZED
Q3 — Objective / meaning quality   SYNTHESIZED
Q4 — Inference boundary            SYNTHESIZED
Q5 — Product behavior / UX         SYNTHESIZED
```

The founder-question phase is complete.

## Implementation gate — current state

The strategy has already been converted into:

1. product behavior requirements;
2. epistemic rules;
3. evaluation criteria;
4. minimal architecture;
5. development sequence;
6. User #1 benchmark contract;
7. D0–D5 implementation and deterministic support infrastructure.

The remaining gate is empirical rather than architectural.

Sequence:

```text
Founder answers                DONE
→ Strategy synthesis           DONE
→ Product requirements         DONE
→ Evaluation design            DONE
→ Architecture                 DONE
→ D0–D5 implementation         DONE
→ User #1 D5 baseline run      NEXT
→ Human Aha / Recognition      UNVERIFIED
→ D6 Strategic Projection      BLOCKED UNTIL D5 PASSES
```

## First real experiment after D5 infrastructure

The default validation target remains User #1.

The current Applicant Intelligence baseline should take the existing canonical profile and generate a small number of candidate insights using the evidence-isolated path:

```text
Explicit confirmed Facts
→ Relations
→ Patterns
→ Abstractions / Concepts
→ optional Hypotheses
```

At D5, each candidate insight must preserve provenance and epistemic state and be scored on:

```text
Groundedness
Novelty
Recognition
Compression
External Legibility
```

Do not proceed to Strategic Directions or Opportunity-space integration unless at least one chain is retained or revised with scores >=2 across all five dimensions and no hard epistemic failure.

If the current D3 baseline fails, use the documented reasoning-v2 experiment plan rather than silently replacing the baseline.

## Phase transition status

```text
Issue #2 — User #1 experiment                     CLOSED
Issue #3 — Opportunity Acquisition                CLOSED
Engineering closeout / CI                         VERIFIED
Founder strategy Q1                               SYNTHESIZED
Founder strategy Q2                               SYNTHESIZED
Founder strategy Q3                               SYNTHESIZED
Founder strategy Q4                               SYNTHESIZED
Founder strategy Q5                               SYNTHESIZED
Founder-question phase                            COMPLETE
Applicant Intelligence D0–D5 infrastructure       IMPLEMENTED
Applicant Intelligence deterministic boundaries  VERIFIED
Real User #1 D5 Aha / Recognition                 UNVERIFIED
Next step                                          RUN USER #1 D5 BASELINE
```
