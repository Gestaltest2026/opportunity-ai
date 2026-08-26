# User #1 Source Universe Maintenance Report

Generated at: 2026-08-26T13:25:33.063Z
Applicant: applicant-001

## Purpose

Audit User #1 Opportunity Source Universe hygiene before expanding Phase 2 from 25 to 50 curated sources.

## Maintenance Summary

| Metric | Count |
| --- | ---: |
| Primary sources | 53 |
| Staged addition sources | 40 |
| Merged source count estimate | 53 |
| Staged already in primary | 40 |
| Staged not yet in primary | 0 |
| Unobserved enabled sources | 0 |
| Automation access-blocked sources | 12 |
| Application-ready sources | 0 |
| Suspicious application-ready sources | 0 |
| Blocking issues | 0 |

## Readiness Checks

| Check | Status |
| --- | --- |
| No blocking issues | PASS |
| Merged estimate has at least 25 sources | PASS |
| Ready for Phase 2 25→50 expansion | PASS |

## Blocking Issues

- None

## Maintenance Warnings

- 12 sources are access-blocked for automation and require manual browser verification.

## Staged Sources Not Yet in Primary

- None

## Staged Sources Already in Primary

- aafpe-paralegal-education-resources
- adult-student-scholarship-pattern-source
- bold-org-scholarship-platform
- cape-coral-kiwanis-scholarships
- cape-coral-mayors-scholarship-fund
- collaboratory-scholarship-program-details
- collaboratory-scholarships
- collier-community-foundation-apply-scholarships
- collier-community-foundation-education-employment-indicators
- collier-community-foundation-scholarships
- collier-scholarship-connector
- community-foundation-cape-coral-scholarships
- executive-women-international-scholarship-program
- fastweb-scholarship-search
- federal-pell-grant-studentaid-official
- federal-student-aid-fafsa-official
- fgcu-financial-aid-contact-official
- fgcu-financial-aid-forms-resources-official
- fgcu-summer-financial-aid-official
- fgcu-undergraduate-grants-official
- florida-bright-futures-official
- florida-bright-futures-statutory-eligibility
- florida-public-student-assistance-grant-statute
- florida-registered-paralegal-program
- going-merry-scholarship-platform
- legal-scholarship-pattern-source
- nala-certification-exam-scholarship
- naples-womans-club-scholarships
- nfpa-awards-scholarships
- paralegal-association-florida-scholarships
- rotary-club-fort-myers-scholarships
- rotary-fort-myers-trust-fund-action
- scholarship-america-students
- scholarships-com-directory
- soroptimist-live-your-dream-application-help
- soroptimist-live-your-dream-awards
- the-community-foundation-students-scholarships
- unigo-scholarship-directory
- women-in-transition-scholarship-pattern-source
- zonta-international-education-awards

## Unobserved Sources

- None

## Automation Access-Blocked Sources

- aauw-career-development-grants
- careeronestop-scholarship-finder
- executive-women-international-scholarship-program
- federal-pell-grant-studentaid-official
- federal-student-aid-fafsa-official
- florida-osfa-financial-aid-scholarships
- florida-registered-paralegal-program
- going-merry-scholarship-platform
- legal-scholarship-pattern-source
- nala-certification-exam-scholarship
- nfpa-awards-scholarships
- zonta-international-education-awards

## High-Relevance Unobserved Sources

- federal-pell-grant-studentaid-official
- federal-student-aid-fafsa-official

## Guardrails

- Maintenance audits source hygiene; it does not recommend scholarships.
- Staged sources may be folded into the primary watchlist, but observed primary state must not be overwritten.
- Unobserved sources remain non-recommendations until successfully monitored or manually verified.
- Application-ready status is blocked unless the source is open, official-source verified, successfully observed, and not blocked by missing User #1 facts.
- Do not begin Phase 3 autonomous web discovery before Phase 2 is v0-complete and at least one User #1 application or inquiry is executed.
