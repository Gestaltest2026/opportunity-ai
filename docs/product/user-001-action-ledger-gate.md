# User #1 Action Ledger Gate

## Purpose

This gate connects Phase 2 source-universe work to real User #1 action.

It prevents the project from moving from curated source coverage directly into Phase 3 autonomous discovery without first executing and recording at least one real-world User #1 inquiry or application.

## What this adds

The system now tracks:

- evidence requests sent to User #1;
- manual verification actions;
- real inquiries to curated sources;
- real applications to curated sources;
- outcome updates.

The default ledger is intentionally not complete. It starts with planned actions only:

- request missing User #1 evidence;
- select and execute the first curated-source inquiry/application.

## Phase 3 unlock condition

Phase 3 autonomous discovery remains blocked unless all of the following are true:

1. Phase 2 source universe is v0-complete.
2. There is at least one completed `inquiry` or `application` action.
3. The completed inquiry/application references a curated `source_id`.
4. The completed action has `executed_at` and `outcome_recorded_at`.
5. The action ledger has no structural warnings.

Evidence requests alone do not unlock Phase 3.

## Public-repo privacy rule

The action ledger must not store private financial details or sensitive documents.

Allowed:

- document names;
- high-level summaries;
- confirmation that evidence was requested or received;
- source IDs;
- action timestamps;
- next-step notes.

Not allowed:

- SSNs;
- tax documents;
- FAFSA forms;
- exact private income values;
- bank statements;
- full resumes or essays if they contain sensitive personal details.

## Workflow outputs

The scheduled User #1 workflow now generates:

- `examples/applicant-001/user-001-action-gate-v0.json`
- `examples/applicant-001/user-001-action-gate-v0.md`

These sit beside:

- `phase-2-readiness-v0.md`
- `opportunity-shortlist-v0.md`
- `user-001-evidence-request-v0.md`

## Product boundary

This is not scholarship advice and not eligibility inference.

It is a transaction-control layer. It answers:

> Has the system produced at least one real User #1 action from the curated universe, or are we still avoiding reality by expanding infrastructure?

## Next real-world action

The first real-world action should be the evidence request to User #1. After that, choose one curated source from the generated shortlist and record a real inquiry or application.
