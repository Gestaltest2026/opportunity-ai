# Opportunity AI Development Rules

## Core Principle
Never regenerate the application from scratch unless explicitly requested.

Always inspect the existing repository first and make the smallest viable diff.

## Architecture
Applicant, Opportunity, Match, Application, and Outcome must each have one canonical data model.

UI screens must never maintain duplicate or competing representations of Applicant state.

All screens and workflows must read from and write to the canonical models.

## Applicant
The Applicant model is the core persistent representation of a person.

The canonical Applicant schema must contain exactly these 13 domains:

1. education
2. career_work_history
3. achievements
4. financial_context
5. identity_eligibility_attributes
6. community_involvement
7. leadership
8. research_academic_interests
9. career_direction
10. lived_experiences
11. constraints
12. existing_evidence
13. narrative_themes

## Product
The primary discovery experience should be conversational and Akinator-like.

Questions, documents, and outcomes progressively update the same Applicant representation.

Scholarships are the first vertical, not the permanent scope of the product.

## Editing
Prefer:
- small diffs
- reusable functions
- typed interfaces
- explicit data flow
- isolated state transitions

Avoid:
- wholesale rewrites
- duplicated state
- screen-specific Applicant models
- matching logic embedded directly in UI code
- direct localStorage access from UI components

## Verification
After each meaningful change:

1. inspect the diff
2. run available scripts
3. check TypeScript errors
4. verify affected data flows
5. report remaining architectural debt
