# ADR 0001: Opportunity availability is canonical

## Context

Opportunity availability is domain state. Databank records previously stored a second derived status, creating a stale-state risk when the canonical Opportunity changed without the derived value changing with it.

## Decision

`Opportunity.availability_status` is the single source of truth for availability. Databank records must not persist a separate derived availability/status field. Any presentation or filtering status is computed from the Opportunity at read time with a pure function.

## Consequences

- There is one persisted source of truth for availability.
- Derived state cannot become stale in storage.
- Callers that need labels such as active/closed/upcoming compute them from the canonical Opportunity.
