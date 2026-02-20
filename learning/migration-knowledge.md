# Migration Knowledge: Handling Incompatible GraphQL Schema Changes

This document explains what happens when the GraphQL schema changes in a way that breaks existing client code, and how teams typically migrate safely.

## 1) What is a breaking schema change?

A breaking change is any schema update that makes previously valid client operations fail.

Common examples:

- Removing a field the client still queries
- Renaming a field or mutation
- Changing argument names or types
- Changing nullability (for example `String` to `String!`)
- Removing enum values the client still expects
- Changing return shape in a non-backward-compatible way

If your client still sends old queries/mutations, server responses can include GraphQL errors and UI behavior may fail.

---

## 2) What failure looks like in this project

In this repo, client operations live in [src/components/graphql-playground.tsx](src/components/graphql-playground.tsx), while the schema/resolvers live in [src/app/api/graphql/route.ts](src/app/api/graphql/route.ts).

If schema changes are incompatible:

- Query or mutation can fail at runtime (`errors` in GraphQL response)
- Apollo hooks can surface `error.message`
- Expected fields may be missing, causing UI rendering bugs
- Type mismatches can be caught during build if generated/typesafe documents are used

---

## 3) Why this is tricky in production

Clients and servers are often deployed at different times.

This means there is usually a transition window where:

- Some users run old client bundles
- Server is already on the new schema

If backward compatibility is not preserved during that window, old clients break.

---

## 4) Typical safe migration strategy

The common pattern is **expand -> migrate -> contract**.

### Phase A: Expand (non-breaking)

- Add new fields/arguments/types first
- Keep old fields working
- Mark old fields as deprecated (GraphQL `@deprecated`)

### Phase B: Migrate clients

- Update client queries/mutations to new fields
- Roll out client release
- Monitor operation usage and errors

### Phase C: Contract (breaking cleanup)

- Remove deprecated fields only after old clients are gone
- Keep change logs and migration notes

This minimizes user-facing breakage.

---

## 5) How teams detect risky changes before release

1. **Schema diff checks in CI**
   - Compare current schema with main/previous schema
   - Block merges when breaking changes are unapproved

2. **Operation compatibility checks**
   - Validate all known client operations against proposed schema

3. **Typed client artifacts**
   - GraphQL code generation catches query/schema mismatch at compile time

4. **Contract tests**
   - Ensure critical queries/mutations still work in automated tests

---

## 6) Practical patterns for the client during migration

- Keep UI tolerant to optional fields while migrating
- Use feature flags when switching between old/new fields
- Avoid hard assumptions on enum exhaustiveness during transitions
- Prefer additive changes first, then removals later
- Surface clear errors/fallback UI for operation failures

---

## 7) Practical patterns for the server during migration

- Never remove widely used fields immediately
- Keep resolver behavior stable while clients migrate
- Add deprecation reasons with timeline guidance
- Publish migration notes for frontend teams
- Monitor operation usage (which fields/operations are still called)

---

## 8) Example migration in this repo context

Suppose you want to replace:

- `messages: [String!]!`

with a richer shape:

- `messages: [Message!]!` where `Message` has `id`, `text`, `createdAt`

Safe rollout:

1. Add new `Message` type and `messagesV2` (or update with additive fields)
2. Keep old `messages` field temporarily
3. Update [src/components/graphql-playground.tsx](src/components/graphql-playground.tsx) to query new field
4. Release client
5. Confirm no old operations remain
6. Remove old field in a later release

---

## 9) Recommended team checklist

Before schema release:

- Is the change additive or breaking?
- Are deprecations documented?
- Do CI checks validate existing operations?
- Is client update ready (or already shipped)?
- Is rollback plan defined?

Before removing deprecated fields:

- Has old client usage dropped to near zero?
- Have migration notes been shared?
- Are monitoring alerts in place for new errors?

---

## 10) Short mental model

For GraphQL evolution, think:

- Add new capabilities first
- Move clients gradually
- Remove old paths last

That sequence protects users from version skew between server and client deployments.
