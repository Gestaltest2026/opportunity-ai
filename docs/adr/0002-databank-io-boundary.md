# ADR 0002: Databank I/O boundary

## Context

Multiple CLI entrypoints previously parsed and wrote databank JSON independently. That duplicated error handling and allowed unchecked type assertions to bypass runtime validation.

## Decision

All databank file I/O is centralized in `src/databank/io.ts`. Files are parsed as `unknown`, validated against the canonical databank schema, and only then returned to application code.

## Consequences

- CLI adapters do not own persistence validation.
- Invalid persisted data fails at one boundary.
- Future persistence backends can replace file I/O without changing domain logic.
