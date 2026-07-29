# Applicant Intelligence Experiment — User #1

## Goal

Test the core product thesis on a real applicant before building more automation:

> The same Applicant can be represented differently for different Opportunities, and those representation choices can materially change match quality and application strategy.

This is not an Akinator benchmark and not a generic scholarship-search test.

## Canonical loop

Raw Applicant Evidence
→ Canonical Applicant Claims
→ Opportunity Profile
→ Opportunity-Specific Representation
→ Match Judgment
→ Application Strategy
→ Outcome / Feedback
→ Learning

## Phase 1 — Canonical Applicant Grounding

1. Treat `examples/applicant-001/source.md` as the current source bundle for User #1.
2. Extract claims into the 13 canonical Applicant domains.
3. Every claim must retain:
   - source
   - evidence
   - explicit vs inferred
   - confidence
   - review status
4. Human-review all claims that could affect eligibility, evidence strength, or narrative positioning.
5. Do not infer protected or financial attributes unless explicitly supported.

Exit condition:
- Applicant Profile v0 is traceable to source evidence.
- Material eligibility claims are confirmed or explicitly unresolved.

## Phase 2 — Real Opportunity Set

Select 3 real, official-source Opportunities first, deliberately different enough to invite different representations.

The first three should ideally emphasize different funding logics, for example:
- institutional / academic persistence
- legal or professional trajectory
- community service / leadership

For each Opportunity:
1. preserve official source evidence;
2. human-verify hard eligibility separately from preferences;
3. identify what the funder appears to reward;
4. record application requirements and current actionability.

Exit condition:
- 3 real Opportunities have human-reviewed Opportunity Profiles.

## Phase 3 — Opportunity-Specific Representation

For each Opportunity, create a Representation object from the same canonical Applicant.

A Representation must record:
- selected claims;
- deprioritized claims;
- primary narrative themes;
- supporting evidence;
- why those themes fit this Opportunity;
- unresolved facts that would materially improve the representation;
- prohibited embellishments or unsupported inferences.

Important rule:

> Representation may select, order, and frame supported Applicant claims. It may not invent facts.

Exit condition:
- User #1 has 3 materially distinct representations derived from the same canonical Applicant.

## Phase 4 — Human Match Review

Before trusting any ranking score, human-review each Applicant × Opportunity pair.

Record:
- eligibility judgment;
- evidence fit;
- narrative fit;
- strategic value;
- overall pursue judgment;
- strongest reason to pursue;
- strongest reason not to pursue;
- what additional Applicant fact would most change the judgment.

Use qualitative labels before numerical precision:
- strong pursue
- consider
- weak fit
- do not pursue

Exit condition:
- Human judgment exists for all 3 pairs.
- At least one pair demonstrates a meaningful representation difference.

## Phase 5 — Application Translation

For the strongest real Opportunity:
1. map the chosen Representation to actual application requirements;
2. identify reusable evidence;
3. identify missing evidence;
4. map narrative themes to essay prompts;
5. create the submission plan.

The point is to test whether Representation improves actual execution, not merely ranking language.

## Phase 6 — Learning

After human review and later after submission/outcome, record:
- which claims mattered;
- which narrative themes mattered;
- which expected fit signals were wrong;
- what information was missing;
- whether the Opportunity-specific Representation was genuinely different and useful;
- what should update in Applicant, Match, or future question selection.

## What remains frozen during this experiment

Do not build these until the experiment creates evidence for them:
- information-gain question ranking;
- automated Next Best Question;
- multi-applicant replication framework;
- generic narrative-scoring formula;
- vector database / RAG architecture;
- large-scale opportunity discovery.

## Product thesis being tested

The experiment succeeds only if we can demonstrate at least one of the following on real data:

1. the same Applicant requires materially different representations for different Opportunities;
2. representation choice changes a human pursue judgment or application strategy;
3. the system surfaces a supported Applicant strength that a flat profile or keyword filter would underuse;
4. outcome or user feedback creates a concrete learning update for the next loop.
