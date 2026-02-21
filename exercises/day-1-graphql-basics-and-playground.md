# Day 1 (2 hours): GraphQL Basics + Read Queries

## Outcome

Understand the full request flow by adding one new read-only GraphQL field and surfacing it in the client.

## Timebox

- 20 min: Read the existing flow (`route.ts`, client query usage)
- 60 min: Implement schema + client changes
- 25 min: Add/adjust tests
- 15 min: Reflect and write notes

## Exercise

1. Add a new query field in the schema: `serverTime: String!`
2. Implement resolver to return current ISO time string.
3. Update the client query to request `serverTime`.
4. Render `serverTime` in the UI as “Server Time”.
5. Add one server test to validate `serverTime` exists and is a string.
6. Add one client test to confirm “Server Time” renders after query resolves.

## Success criteria

- `npm test` passes.
- GraphQL query returns `hello`, `messages`, and `serverTime`.
- UI shows server time without runtime errors.

## Reflection prompts

- Which part changed first: schema, resolver, or client?
- Where did type safety help most?
