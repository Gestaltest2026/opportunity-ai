# Strict Eligibility Gate v0

Generated at: 2026-08-22T07:02:45.828Z
Applicant: applicant-001

## Rule

No evidence, no eligibility. No eligibility, no application. No application, only inquiry.

## Summary

| Status | Count |
| --- | ---: |
| APPLICATION_READY | 0 |
| NEEDS_VERIFICATION | 4 |
| EXPIRED | 1 |
| PATTERN_ONLY | 0 |
| REJECTED | 0 |

## Required Next Actions

- Do not force a top-three application list. APPLICATION_READY is 0 under the strict gate.
- Convert the closest candidates into eligibility inquiries, not applications.
- Send eligibility inquiry for PAF Professional Development Scholarship 2026; unresolved blocker(s): MEMBERSHIP_REQUIRED.
- Send eligibility inquiry for PAF Student Education & Dues Reimbursement Scholarship 2026; unresolved blocker(s): ENROLLMENT_UNKNOWN, MEMBERSHIP_REQUIRED, RECOMMENDATION_REQUIRED.
- Send eligibility inquiry for SWFPA Professional Development Scholarship 2026; unresolved blocker(s): MEMBERSHIP_REQUIRED.

## Findings

### NFPA PCCE Scholarship 2026

| Field | Value |
| --- | --- |
| Opportunity ID | nfpa-pcce-scholarship-2026 |
| Status | EXPIRED |
| Apply now | no |
| Recommended next action | monitor_next_cycle |

**Reason:** The official or controlled deadline evidence marks this opportunity as expired for the current cycle.

**Hard blockers**

- DEADLINE_EXPIRED

**Missing evidence**

- Current-cycle deadline must be open.

**Required documents**

- certification-related application materials

**Fit signal**

Strong legal/paralegal certification fit, but current-cycle deadline blocks application.

### PAF Professional Development Scholarship 2026

| Field | Value |
| --- | --- |
| Opportunity ID | paf-professional-development-2026 |
| Status | NEEDS_VERIFICATION |
| Apply now | no |
| Recommended next action | send_inquiry |

**Reason:** Do not apply yet. Strict gate found unresolved blocker(s): MEMBERSHIP_REQUIRED.

**Hard blockers**

- MEMBERSHIP_REQUIRED

**Missing evidence**

- paf_membership_good_standing

**Required documents**

- professional goals statement
- proof of payment after program/exam
- successful completion evidence after program/exam

**Fit signal**

Strong Florida paralegal professional-development fit; legal work history is aligned.

### PAF Student Education & Dues Reimbursement Scholarship 2026

| Field | Value |
| --- | --- |
| Opportunity ID | paf-student-education-dues-2026 |
| Status | NEEDS_VERIFICATION |
| Apply now | no |
| Recommended next action | send_inquiry |

**Reason:** Do not apply yet. Strict gate found unresolved blocker(s): ENROLLMENT_UNKNOWN, MEMBERSHIP_REQUIRED, RECOMMENDATION_REQUIRED.

**Hard blockers**

- ENROLLMENT_UNKNOWN
- MEMBERSHIP_REQUIRED
- RECOMMENDATION_REQUIRED

**Missing evidence**

- current_enrollment_documentation
- paf_student_membership_good_standing
- professor_recommendation_available

**Required documents**

- goals statement
- current transcript
- professor recommendation
- possible employer recommendation

**Fit signal**

Legal Studies and GPA fit the student-support theory, but student membership and enrollment evidence remain unresolved.

### SWFPA Professional Development Scholarship 2026

| Field | Value |
| --- | --- |
| Opportunity ID | swfpa-professional-development-2026 |
| Status | NEEDS_VERIFICATION |
| Apply now | no |
| Recommended next action | send_inquiry |

**Reason:** Do not apply yet. Strict gate found unresolved blocker(s): MEMBERSHIP_REQUIRED.

**Hard blockers**

- MEMBERSHIP_REQUIRED

**Missing evidence**

- swfpa_active_membership

**Required documents**

- resume
- personal statement
- course or certification information

**Fit signal**

Strong Southwest Florida paralegal professional-development fit; amount is smaller but form is lightweight.

### Buckfire & Buckfire Paralegal Scholarship 2026

| Field | Value |
| --- | --- |
| Opportunity ID | buckfire-paralegal-scholarship-2026 |
| Status | NEEDS_VERIFICATION |
| Apply now | no |
| Recommended next action | send_inquiry |

**Reason:** Do not apply yet. Strict gate found unresolved blocker(s): CITIZENSHIP_UNKNOWN, PROGRAM_TYPE_UNKNOWN, SEMESTER_COMPLETION_UNKNOWN.

**Hard blockers**

- CITIZENSHIP_UNKNOWN
- PROGRAM_TYPE_UNKNOWN
- SEMESTER_COMPLETION_UNKNOWN

**Missing evidence**

- citizenship
- one_semester_completed
- paralegal_program_status

**Required documents**

- online application
- transcript
- essay or application responses

**Fit signal**

Strong essay/GPA/legal-studies fit and larger award amount, but citizenship and paralegal-program requirements are unresolved.


## Guardrails

- Strict mode may return zero application-ready opportunities; that is a valid output, not a failure.
- Do not infer citizenship, membership, enrollment, financial need, or program eligibility from narrative fit.
- Expired sources should be retained only as pattern-only or next-cycle monitoring inputs.
- Membership blockers require source-backed confirmation that the applicant is already in good standing or can become eligible before the scholarship deadline.
- The gate does not search the web; it evaluates curated, source-backed records only.
