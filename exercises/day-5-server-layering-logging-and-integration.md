# Day 5 (2 hours): Server Layering, Logging, and Integration Confidence

## Outcome

Improve server maintainability by separating resolver/service/repository concerns and adding observability-focused tests.

## Timebox

- 25 min: Identify current server responsibilities in one file
- 70 min: Extract layers + logging helper
- 25 min: Integration and smoke tests

## Exercise

1. Keep `src/app/api/graphql/route.ts` thin.
2. Move resolver definitions to server layer files (or equivalent structure).
3. Extract message business rules into a service module.
4. Add a basic logger utility (`info`, `error`) in `server/observability`.
5. Add one integration test that validates full mutation flow still works.
6. Add one smoke test that asserts route returns valid GraphQL response envelope.

## Success criteria

- Route handler remains adapter-focused.
- Server responsibilities are split across clear layers.
- Tests cover route + integration behavior.
- Build and tests pass.

## Reflection prompts

- Which extracted layer gave you the biggest clarity gain?
- Where should logs be emitted (route, resolver, service, repository)?
