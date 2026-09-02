# User #1 Execution Packet v0

Generated at: 2026-09-02T04:42:09.488Z
Applicant: applicant-001

## Purpose

Convert the Phase 2 source-universe work into one real User #1 action without storing private evidence in the public repository.

## Current Gate Status

| Gate | Value |
| --- | --- |
| Source universe v0 complete | no |
| Phase 2 status | PHASE_2_INCOMPLETE_EXPAND_OR_REPAIR |
| Phase 3 status | BLOCKED_USER_ACTION_REQUIRED |
| Phase 3 unlock candidate | no |
| Completed evidence requests | 1 |
| Completed inquiries/applications | 0 |

## Action Ledger Snapshot

| Action ID | Type | Status | Source ID | Next step |
| --- | --- | --- | --- | --- |
| action-request-user-001-evidence-v0 | evidence_request | completed | none | Clarify Florida residency, institution for Fall 2026/2026-27 enrollment, expected credits, and whether the GPA is FGCU/cumulative/other. Then choose one curated source for a real inquiry/application. |
| action-first-curated-source-inquiry-v0 | inquiry | planned | fgcu-admissions-scholarships-waivers | Before sending, clarify Florida residency and Fall 2026 institution/credit load. Then send a concise eligibility-confirmation inquiry to the official FGCU scholarship/admissions or financial-aid contact. |

## Immediate Action 1: Send Evidence Request

Action ID: none
Status: none

### Message to Send

お母さんへ

奨学金・学費支援の候補を正確に確認するため、以下だけ一度確認させてください。

- None

現時点では、SSN、税務書類、FAFSA書類そのもの、銀行明細、正確な収入額などのセンシティブな書類は送らなくて大丈夫です。まずは「提出済み/未提出」「該当する/しない」「手元にある/ない」のような要約だけで十分です。

目的は、応募できる可能性があるものと、まだ確認が必要なものを安全に分けることです。

## Immediate Action 2: Prepare First Inquiry/Application

Action ID: action-first-curated-source-inquiry-v0
Status: planned

Do not send this until the evidence request is answered enough to choose a source from the guarded shortlist. If no source is selected yet, use this only as a draft shape.

### Inquiry Draft

Subject: Question About Scholarship / Aid Eligibility for an FGCU Transfer Student

Dear Financial Aid / Scholarship Team,

I am helping an FGCU Legal Studies transfer student identify scholarship or aid opportunities that may fit her current enrollment status and background. Before submitting anything, we would like to confirm which official application path is appropriate and what eligibility facts must be verified.

Could you please confirm the best next step for a transfer undergraduate student seeking scholarship or grant opportunities, including whether GPA, FAFSA status, Florida residency, enrollment load, or first-degree status must be confirmed before applying?

We are not asking for an eligibility decision by email; we only want to identify the correct official process and required documentation.

Thank you.

Sincerely,
[Name]

## After User #1 Responds

Update only public-safe summaries in `examples/applicant-001/user-001-action-ledger-v0.json`:

- Set the evidence request action to `completed` only after User #1 has responded.
- Use `evidence_collected` for summaries such as "FAFSA status confirmed in private notes" or "current GPA document available outside repo".
- Do not paste private document text, exact private income values, FAFSA forms, tax records, SSNs, or bank statements into the repo.
- Select one curated source_id for the first inquiry/application and record the outcome after it is sent.

## Existing Evidence Request Artifact

The generated evidence request artifact should still be inspected when available:

`examples/applicant-001/user-001-evidence-request-v0.md`

## Evidence Request Markdown Snapshot

# User #1 Evidence Request v0

Generated at: 2026-09-02T04:42:07.735Z
Applicant: applicant-001

## Why this exists

Opportunity AI found relevant sources, but it must not convert unknown facts into eligibility claims. These facts are needed before any source can be treated as application-ready.

## Evidence needed

| Evidence | Used by sources |
| --- | --- |
| FAFSA completion and aid year | collaboratory-scholarships, fgcu-financial-aid-contact-official, fgcu-undergraduate-grants-official, collaboratory-scholarship-program-details, fgcu-financial-aid-forms-resources-official, fgcu-summer-financial-aid-official, fgcu-undergraduate-scholarships-overview, fgcu-foundation-scholarships-official, fgcu-scholarship-application-portal, federal-pell-grant-studentaid-official, federal-student-aid-fafsa-official, florida-osfa-financial-aid-scholarships, going-merry-scholarship-platform, florida-public-student-assistance-grant-statute |
| Financial need evidence, income threshold, SAI, Pell status, or equivalent documentation | collaboratory-scholarships, fgcu-undergraduate-grants-official, patsy-mink-education-support-award, peo-program-for-continuing-education, soroptimist-live-your-dream-application-help, soroptimist-live-your-dream-awards, collier-community-foundation-scholarships, fgcu-summer-financial-aid-official, scholarship-america-students, scholarships-com-directory, fgcu-foundation-scholarships-official, fgcu-scholarship-application-portal, jeannette-rankin-scholar-grants, federal-pell-grant-studentaid-official, federal-student-aid-fafsa-official, florida-osfa-financial-aid-scholarships, florida-public-student-assistance-grant-statute, adult-student-scholarship-pattern-source, women-in-transition-scholarship-pattern-source |
| 2026-27 enrollment status and course load | collaboratory-scholarships, fgcu-admissions-scholarships-waivers, fgcu-transfer-aid-official, fgcu-undergraduate-grants-official, patsy-mink-education-support-award, peo-pce-eligibility-process, peo-program-for-continuing-education, soroptimist-live-your-dream-awards, fgcu-summer-financial-aid-official, fgcu-undergraduate-scholarships-overview, rotary-club-fort-myers-scholarships, rotary-fort-myers-trust-fund-action, collier-scholarship-connector, cape-coral-mayors-scholarship-fund, fgcu-foundation-scholarships-official, jeannette-rankin-scholar-grants, federal-pell-grant-studentaid-official, florida-osfa-financial-aid-scholarships, nala-certification-exam-scholarship, florida-public-student-assistance-grant-statute, aauw-career-development-grants, adult-student-scholarship-pattern-source |
| U.S. citizenship, permanent residency, eligible noncitizen, or funder-specific residency requirement | collaboratory-scholarships, fgcu-admissions-scholarships-waivers, fgcu-transfer-aid-official, fgcu-undergraduate-grants-official, patsy-mink-education-support-award, collier-community-foundation-scholarships, community-foundation-cape-coral-scholarships, rotary-fort-myers-trust-fund-action, jeannette-rankin-scholar-grants |
| Resume, updated personal statement, and evidence for legal work/community leadership | collaboratory-scholarships, paralegal-association-florida-scholarships, collaboratory-scholarship-program-details, collier-community-foundation-apply-scholarships, collier-community-foundation-scholarships, naples-womans-club-scholarships, rotary-club-fort-myers-scholarships, aafpe-paralegal-education-resources, community-foundation-cape-coral-scholarships, rotary-fort-myers-trust-fund-action, collier-scholarship-connector, cape-coral-mayors-scholarship-fund, the-community-foundation-students-scholarships, fgcu-foundation-scholarships-official, nala-certification-exam-scholarship, nfpa-awards-scholarships, zonta-international-education-awards, florida-registered-paralegal-program, aauw-career-development-grants, collier-community-foundation-education-employment-indicators, cape-coral-kiwanis-scholarships, legal-scholarship-pattern-source |
| FGCU transfer GPA / current academic record | fgcu-admissions-scholarships-waivers, fgcu-transfer-aid-official, collier-community-foundation-scholarships, florida-bright-futures-official, rotary-club-fort-myers-scholarships, community-foundation-cape-coral-scholarships, rotary-fort-myers-trust-fund-action, fgcu-foundation-scholarships-official, fgcu-scholarship-application-portal, florida-bright-futures-statutory-eligibility |
| AA degree or Florida college transfer status | fgcu-admissions-scholarships-waivers, fgcu-transfer-aid-official, florida-bright-futures-official, rotary-club-fort-myers-scholarships, rotary-fort-myers-trust-fund-action, fgcu-foundation-scholarships-official, jeannette-rankin-scholar-grants, florida-public-student-assistance-grant-statute |
| Florida residency for tuition or aid purposes | fgcu-admissions-scholarships-waivers, fgcu-undergraduate-grants-official, florida-bright-futures-official, florida-osfa-financial-aid-scholarships, florida-public-student-assistance-grant-statute, florida-bright-futures-statutory-eligibility |
| Funder-specific mother/dependent-child eligibility language | patsy-mink-education-support-award, peo-program-for-continuing-education, soroptimist-live-your-dream-application-help, soroptimist-live-your-dream-awards, adult-student-scholarship-pattern-source, women-in-transition-scholarship-pattern-source |
| P.E.O. chapter sponsorship path or local contact | peo-pce-eligibility-process, peo-program-for-continuing-education, executive-women-international-scholarship-program |
| First bachelor's degree / first undergraduate degree status | jeannette-rankin-scholar-grants |

## Message draft to User #1

Could you send or confirm the following so I can check scholarship eligibility accurately?

- FAFSA completion and aid year
- Financial need evidence, income threshold, SAI, Pell status, or equivalent documentation
- 2026-27 enrollment status and course load
- U.S. citizenship, permanent residency, eligible noncitizen, or funder-specific residency requirement
- Resume, updated personal statement, and evidence for legal work/community leadership
- FGCU transfer GPA / current academic record
- AA degree or Florida college transfer status
- Florida residency for tuition or aid purposes
- Funder-specific mother/dependent-child eligibility language
- P.E.O. chapter sponsorship path or local contact

Screenshots or unofficial records are fine for the first pass. I will verify each scholarship at the official source before treating anything as ready to apply.

## Guardrail

Do not mark any opportunity as APPLICATION_READY until the relevant facts above are confirmed and the official source is re-checked.

## Guardrails

- This packet does not recommend a scholarship.
- This packet does not infer eligibility.
- Evidence collection alone does not unlock Phase 3.
- Phase 3 requires at least one completed inquiry/application with outcome recorded.
- Keep sensitive evidence outside the public repository.
