# User #1 Execution Packet v0

## Purpose

This document defines the first post-Phase-2 execution artifact for User #1.

The source universe can now monitor, shortlist, report coverage, report readiness, and evaluate whether a real-world action has happened. The next product need is not more source expansion. The next product need is a small packet that turns the generated artifacts into something the operator can actually send or use.

## What the packet does

The packet gathers four existing pieces of state:

1. `user-001-action-ledger-v0.json`
2. `user-001-action-gate-v0.json`
3. `user-001-evidence-request-v0.md`
4. the planned first inquiry/application placeholder

It then produces:

```text
examples/applicant-001/user-001-execution-packet-v0.md
```

The packet includes:

- a plain Japanese message to send to User #1;
- a public-safe list of evidence categories to request;
- a first inquiry/application draft shape;
- instructions for updating the action ledger after User #1 responds;
- privacy boundaries for the public repository;
- Phase 3 gate reminders.

## What the packet does not do

The packet does not:

- recommend a scholarship;
- infer eligibility;
- collect private documents;
- store sensitive financial data;
- complete an application;
- unlock Phase 3.

## Privacy boundary

The public repository must not store:

- SSNs;
- FAFSA forms;
- tax records;
- exact private income values;
- bank statements;
- full private documents;
- private document contents copied verbatim.

The repository may store:

- action status;
- non-sensitive summaries;
- source IDs;
- timestamps;
- public-facing inquiry text;
- high-level evidence categories confirmed outside the repo.

## Correct next action

The correct next action after the packet is generated is:

```text
Send the evidence request to User #1.
```

After User #1 responds, the operator should update `user-001-action-ledger-v0.json` with public-safe summaries only.

Examples:

```text
OK: "FAFSA status confirmed in private notes."
OK: "Current GPA document exists outside repo."
OK: "Resume received and stored outside public repo."
NO: exact income amount
NO: FAFSA form contents
NO: tax return text
NO: SSN
```

## Phase 3 rule

Evidence collection alone does not unlock Phase 3.

Phase 3 can only become a candidate after:

1. Phase 2 source universe is v0-complete;
2. at least one inquiry/application is completed;
3. the inquiry/application references a curated `source_id`;
4. `executed_at` and `outcome_recorded_at` are recorded;
5. the action ledger has no structural warnings.

This preserves the product rule:

```text
No more strategic expansion should replace one real User #1 transaction.
```
