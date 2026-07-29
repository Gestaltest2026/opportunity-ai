# User #1 — Learning Update v0

## What was observed

1. The same canonical Applicant can support materially different Opportunity-specific representations without changing the underlying facts.
2. Claim priority changes by Opportunity. Examples observed:
   - caregiving became primary in the broad Foundation persistence frame but not in the waiver or study-abroad frames;
   - hula-school leadership and long-term volunteer service became primary in the Out-of-State Waiver frame;
   - Japan→Florida relocation, ESOL, and English-literature study became primary in the study-abroad frame.
3. Representation changed application strategy even when pursue judgment remained conditional.
4. Eligibility, Evidence Fit, Narrative Fit, and Strategic Value must remain separate. Strong Narrative Fit did not cure unresolved hard gates.
5. The highest-value next fact differs by Opportunity:
   - Foundation: which specific donor awards are open/applicable;
   - Waiver: non-Florida tuition residency classification, then transfer GPA;
   - Perez: approved study-abroad participation, then remaining qualification facts.
6. Application drafting should occur after hard-gate verification, not before.

## What was not observed

1. No evidence yet that Opportunity-specific Representation changes final ranking among two simultaneously actionable, hard-eligible opportunities.
2. No real application outcome was produced in this experiment.
3. No basis yet for a generic Narrative Fit weighting formula.
4. No basis yet for automated information-gain or Next Best Question ranking.
5. No evidence yet that the current representation behavior generalizes beyond User #1.

## Observed candidates for future clarification questions

These are candidates only; they are not yet an automated Akinator policy.

- What is the applicant's current cumulative and transfer GPA?
- How is the applicant classified for Florida tuition residency purposes?
- Does the applicant have documented FAFSA/financial-need information when required by a specific opportunity?
- Is the applicant admitted to or applying for an approved study-abroad program?
- Has the applicant received formal recognition, awards, or documented outcomes for long-term community service or leadership?
- Has the applicant formally supervised, trained, or mentored staff in the law office?

## Architecture implications

- Preserve canonical facts separately from derived representations.
- Preserve explicit vs inferred status for Applicant claims.
- Treat Opportunity-specific Representation as a derived object, not a mutation of Applicant truth.
- Store unresolved high-value facts alongside each representation/match.
- Do not let Narrative Fit override hard eligibility.
- Application strategy should consume Representation + verified Opportunity requirements.
- Outcome learning should be added only when real submissions and decisions exist.

## Experiment conclusion

The experiment satisfies its narrow done condition at the application-strategy level: Opportunity-specific Representation materially sharpened how the same Applicant should be presented and which evidence should be used for different real Opportunities, without inventing Applicant facts.

It did not establish that Representation changes final Opportunity ranking or win probability. Those remain open hypotheses for later real-world testing.
