# ADR 0003: Zod is the schema source of truth

## Context

Domain interfaces and handwritten runtime type guards can drift apart when a model changes. The same canonical model is consumed by TypeScript, persisted JSON, fixtures, and LLM outputs.

## Decision

Each domain owns a Zod schema in its local `schema.ts`. TypeScript types are inferred from those schemas. Runtime validation, persistence parsing, fixture parsing, and structured LLM parsing use those same schemas. We will not introduce a generic schema framework beyond this local ownership model.

## Consequences

- Canonical model definitions live in one place.
- Type and runtime validation changes stay synchronized.
- Boundary code can parse unknown data instead of asserting types.
- Zod becomes a production dependency.
