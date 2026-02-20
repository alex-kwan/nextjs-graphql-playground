# Server Best Practices (Next.js + GraphQL)

This guide is a practical baseline for organizing server code when using Next.js Route Handlers, GraphQL schemas, and a database layer.

## 1) Core principles

- Keep transport, GraphQL, business logic, and data access as separate layers.
- Keep Route Handlers thin and move real logic into server modules.
- Prefer backward-compatible schema/database changes first.
- Make behavior testable by isolating pure logic from framework glue.

---

## 2) Recommended server layout

Use a structure similar to:

```text
src/
  app/
    api/
      graphql/
        route.ts                # Next route adapter only
        __tests__/
          route.smoke.test.ts
  tests/
    integration/
      graphql-route.integration.test.ts
  server/
    graphql/
      schema/
        typeDefs.ts
        resolvers/
          query.ts
          mutation.ts
          index.ts
          __tests__/
            message-resolver.integration.test.ts
      context.ts
      loaders/
        __tests__/
          message-loader.test.ts
    services/
      message-service.ts
      __tests__/
        message-service.test.ts
    db/
      client.ts
      repositories/
        __tests__/
          message-repository.integration.test.ts
      migrations/
        __tests__/
          migration-smoke.test.ts
    observability/
      logger.ts
      metrics.ts
      tracing.ts
      __tests__/
        logger.test.ts
    config/
      env.ts
      __tests__/
        env.test.ts
```

Why this works:

- App Router conventions stay clean.
- GraphQL concerns are grouped in one place.
- Database and business rules remain reusable outside resolvers.

### Where tests typically fit

Use a hybrid approach:

- Keep **unit tests near code** (for example `server/services/__tests__/message-service.test.ts`).
- Keep **cross-layer integration tests** in a top-level test area (for example `src/tests/integration`).

This keeps unit intent local while making end-to-end server checks easy to discover.

### What test types belong in each `__tests__` folder

- `app/api/graphql/__tests__/`
  - **Route smoke tests**
  - Verifies handler accepts request/returns valid response shape
  - Example: `route.smoke.test.ts`

- `server/graphql/schema/resolvers/__tests__/`
  - **Resolver integration tests**
  - Verifies resolver wiring with schema + context + service interaction
  - Example: `message-resolver.integration.test.ts`

- `server/graphql/loaders/__tests__/`
  - **Loader unit tests**
  - Verifies batching, caching, and key mapping behavior
  - Example: `message-loader.test.ts`

- `server/services/__tests__/`
  - **Service unit tests**
  - Verifies business rules, validation, and edge cases
  - Example: `message-service.test.ts`

- `server/db/repositories/__tests__/`
  - **Repository integration tests**
  - Verifies DB read/write behavior and query assumptions
  - Example: `message-repository.integration.test.ts`

- `server/db/migrations/__tests__/`
  - **Migration smoke tests**
  - Verifies migration up/down or compatibility assumptions
  - Example: `migration-smoke.test.ts`

- `server/observability/__tests__/`
  - **Utility unit tests**
  - Verifies logger formatting, metric labels, tracing helpers
  - Example: `logger.test.ts`

- `server/config/__tests__/`
  - **Config/env unit tests**
  - Verifies env parsing, defaults, and failure on invalid config
  - Example: `env.test.ts`

- `src/tests/integration/`
  - **Cross-layer integration tests**
  - Verifies route -> GraphQL -> service -> DB flow together
  - Example: `graphql-route.integration.test.ts`

### Where logging/observability typically fits

Keep shared observability utilities in one place, such as `src/server/observability`:

- `logger.ts`: structured logging setup and helpers
- `metrics.ts`: counters/timers for resolver and DB performance
- `tracing.ts`: request correlation and spans

Then inject or import these into route handlers, GraphQL context, services, and repositories.

---

## 3) Route Handler best practices

Your current route is [src/app/api/graphql/route.ts](src/app/api/graphql/route.ts).

Use it as an adapter layer only:

- Accept request (`GET`/`POST`)
- Forward to GraphQL server handler
- Return response

Avoid putting in `route.ts`:

- complex resolver logic
- business validation rules
- direct DB query orchestration

Keep those in `server/services` and `server/db`.

---

## 4) GraphQL schema and resolver design

- Keep schema types explicit and stable.
- Organize resolvers by domain or operation type.
- Keep resolvers orchestration-focused, not logic-heavy.
- Push business rules into service functions.
- Use context for auth/session/db access, not global mutable state.

Resolver responsibility should be:

1. Validate presence of required context
2. Call service
3. Map service output to GraphQL shape

---

## 5) Service layer best practices

Service layer should own:

- domain/business rules
- input validation normalization
- transactional boundaries
- error mapping (domain errors -> API-safe errors)

Benefits:

- easy unit testing without GraphQL server boot
- reuse across GraphQL, jobs, scripts, or future REST endpoints

---

## 6) Database layer best practices

- Keep DB client initialization in one place (`db/client.ts`).
- Use repositories (or query modules) to isolate persistence details.
- Keep migrations versioned and reviewed.
- Avoid spreading raw queries throughout resolvers.
- Prefer explicit transactions for multi-step writes.

For production readiness:

- do not use in-memory arrays for persistent data
- use a real datastore and repository abstraction

---

## 7) Schema evolution and compatibility

When changing GraphQL schema or DB shape, use:

1. **Expand**: add new fields/tables/columns first
2. **Migrate**: update clients and resolvers gradually
3. **Contract**: remove deprecated fields after usage drops

Also:

- mark fields deprecated before removal
- monitor operation usage and GraphQL errors
- run schema compatibility checks in CI

---

## 8) Testing strategy by layer

### Route tests

- verify `/api/graphql` accepts and returns expected response envelope
- location example: `src/tests/integration/graphql-route.integration.test.ts`

### Resolver integration tests

- ensure query/mutation wiring works with schema + context
- location example: `src/server/graphql/schema/resolvers/__tests__/message-resolver.integration.test.ts`

### Service unit tests

- validate core business logic and edge cases fast
- location example: `src/server/services/__tests__/message-service.test.ts`

### Repository/db tests

- validate persistence behavior and migration assumptions
- location example: `src/server/db/repositories/__tests__/message-repository.integration.test.ts`

Keep test intent clear with naming:

- `*.test.ts` for isolated logic
- `*.integration.test.ts` for multi-layer behavior

---

## 9) Error handling and observability

- Return user-safe GraphQL errors, keep internals out of responses.
- Log structured errors with request correlation IDs.
- Distinguish expected domain errors from unexpected failures.
- Add metrics for operation latency, error rates, and resolver hotspots.

Implementation placement:

- Create logger/metrics primitives in `src/server/observability/*`.
- Add request IDs in GraphQL context creation and include them in logs.
- Log at service and repository boundaries (where failures are easiest to diagnose).
- Keep resolver logs minimal and contextual (operation name, user/context id, duration).

---

## 10) Security and config hygiene

- Validate environment variables at startup.
- Enforce authentication/authorization in context + services.
- Apply input validation beyond GraphQL type checks for critical flows.
- Avoid exposing stack traces to clients.
- Limit introspection/playground in production if required by policy.

---

## 11) Practical checklist

Before shipping server changes:

- Route files are thin adapters.
- Resolver logic is minimal and delegates to services.
- Services own business rules.
- DB access is centralized through repositories/query modules.
- Schema changes are backward-compatible or explicitly coordinated.
- Tests pass across unit and integration layers.
- Build and runtime env checks are in place.

---

## 12) Mental model

Design server code as:

**Route Adapter -> GraphQL Resolver -> Service -> Repository/DB**

Keep each layer small and focused, and schema/database changes become easier to evolve safely.
