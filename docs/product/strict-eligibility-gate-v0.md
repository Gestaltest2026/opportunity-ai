# Strict Eligibility Gate v0

## Purpose

Opportunity AI must not behave like a generic scholarship-search summary. Its job is to protect the operator from presenting a candidate as application-ready when the applicant evidence does not support that status.

This gate implements the operating rule:

```text
No evidence, no eligibility.
No eligibility, no application.
No application, only inquiry.
```

The correct strict-mode output may be zero application-ready opportunities. That is not a failure. It is the system refusing to invent eligibility.

## Problem this fixes

The User #1 scholarship search exposed a recurring failure mode:

```text
source looks relevant
→ narrative fit is strong
→ assistant/user wants three candidates
→ hard blocker is still unknown
→ candidate is accidentally framed as apply-now
```

Examples:

- PAF Professional Development fit is strong, but PAF/local chapter good standing is unresolved.
- SWFPA Professional Development fit is strong, but active membership is unresolved.
- Buckfire Paralegal fit is strong, but citizenship, paralegal-program status, and one-semester completion are unresolved.
- NFPA PCCE can be a useful pattern, but a passed deadline blocks current-cycle submission.

## Status taxonomy

| Status | Meaning |
| --- | --- |
| `APPLICATION_READY` | Future deadline, official source, and no unresolved hard blockers. |
| `NEEDS_VERIFICATION` | Candidate may be promising, but at least one blocker requires inquiry or evidence. |
| `EXPIRED` | Current-cycle deadline is past. Keep only as next-cycle or pattern evidence. |
| `PATTERN_ONLY` | Useful for opportunity-space learning or essay reuse, not a current application. |
| `REJECTED` | A recorded requirement is not satisfied. |

## Hard blockers

The first v0 blocker set is deliberately concrete:

- `DEADLINE_EXPIRED`
- `DEADLINE_UNKNOWN`
- `MEMBERSHIP_REQUIRED`
- `ONE_YEAR_MEMBERSHIP_REQUIRED`
- `CITIZENSHIP_UNKNOWN`
- `PROGRAM_TYPE_UNKNOWN`
- `ENROLLMENT_UNKNOWN`
- `SEMESTER_COMPLETION_UNKNOWN`
- `FINANCIAL_NEED_REQUIRED`
- `LOCATION_REQUIRED`
- `RECOMMENDATION_REQUIRED`
- `OFFICIAL_SOURCE_REQUIRED`

## Current User #1 fixture result

The v0 fixture intentionally produces:

```text
APPLICATION_READY: 0
NEEDS_VERIFICATION: 4
EXPIRED: 1
PATTERN_ONLY: 0
REJECTED: 0
```

This preserves the strict truth: there are good targets for inquiry, but no current candidate should be called application-ready from the recorded evidence alone.

## Next operational move

For User #1, strict mode converts the closest candidates into inquiries:

1. PAF Professional Development — verify whether new active membership can become good standing before the scholarship deadline.
2. PAF Student Education & Dues Reimbursement — verify whether new student membership and scholarship submission can happen in the same cycle.
3. SWFPA Professional Development — verify active membership approval timing and electronic submission availability.
4. Buckfire — verify citizenship, paralegal-program status, and one-semester completion before drafting the application.

## Non-goals

This gate does not search the web. It evaluates curated, source-backed opportunity records only.

It does not generate applications. It decides whether application generation is allowed.

It does not infer missing applicant facts from narrative fit. Unknown remains unknown.
