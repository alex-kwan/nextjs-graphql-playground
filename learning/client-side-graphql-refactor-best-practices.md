# Client-Side GraphQL Refactor Best Practices

This guide shows how to refactor your client-side GraphQL code so functionality stays grouped, maintainable, and testable.

## Goal

Keep each feature self-contained by colocating:

- GraphQL operations
- Apollo hooks (data logic)
- UI components
- Styles
- Tests

This gives you local ownership of a feature and avoids scattering related code across many folders.

---

## 1) Recommended feature-first folder structure

For your current `graphql-playground` feature, use a colocated structure like:

```text
src/
  features/
    graphql-playground/
      graphql/
        queries.ts
        mutations.ts
        fragments.ts
      hooks/
        useDashboardData.ts
        useAddMessage.ts
      components/
        GraphqlPlayground.tsx
        GraphqlPlaygroundView.tsx
        GraphqlPlayground.module.css
      __tests__/
        GraphqlPlaygroundView.test.tsx
        GraphqlPlayground.integration.test.tsx
      types.ts
      index.ts
```

And your page becomes a small composition layer:

- `src/app/page.tsx` imports from `src/features/graphql-playground/index.ts`

---

## 2) Separation of responsibilities

### GraphQL documents (`graphql/`)

- Store only `gql` documents (queries, mutations, fragments)
- Keep names stable and descriptive
- Reuse fragments to avoid duplicated field lists

### Data hooks (`hooks/`)

- Wrap `useQuery` / `useMutation` into custom hooks
- Centralize fetch policy, refetch strategy, and error mapping
- Return simple shape for UI (`data`, `isLoading`, `onSubmit`, etc.)

### UI components (`components/`)

- `GraphqlPlayground.tsx` = container (uses hooks/providers)
- `GraphqlPlaygroundView.tsx` = presentational UI (props only)
- Keep style module next to view component

### Types (`types.ts`)

- Shared feature-level interfaces and prop types
- Keep naming consistent with query names

### Tests (`__tests__/`)

- Unit tests for presentational component
- Integration tests for hook+container behavior with `MockedProvider`
- Keep tests in the same feature folder for discoverability

---

## 3) What to test at each layer

### View unit tests (fast, no Apollo)

Test only rendering behavior:

- loading state text
- error state text
- list rendering
- submit button disabled state
- user input callbacks fire

### Hook/container integration tests (Apollo mock)

Test data flow behavior:

- initial query populates UI
- mutation sends expected variables
- post-mutation state is refreshed
- network/error path shows fallback message

### Route/API tests (already present)

Keep existing tests for `/api/graphql` server behavior separate from UI tests.

---

## 4) Styling best practice for colocated features

- Keep a dedicated module style file per feature view:
  - `GraphqlPlayground.module.css`
- Avoid sharing one giant app-level style file for feature-specific CSS
- Keep global-only concerns in app-level styles
- If styles grow, split by component (`Form.module.css`, `Messages.module.css`)

---

## 5) Provider boundary best practice

Keep Apollo provider setup close to feature entry or app provider layer:

- Option A: feature-level provider wrapper for isolated demo features
- Option B: app-level provider in shared provider tree for larger apps

For your learning setup, feature-level provider is fine and keeps everything local.

---

## 6) Migration path from your current code (low risk)

Current main file:

- `src/components/graphql-playground.tsx`

Refactor in this order:

1. Move `GET_DASHBOARD_DATA` and `ADD_MESSAGE` to `graphql/`
2. Extract Apollo calls into `useDashboardData` and `useAddMessage`
3. Split UI into presentational `GraphqlPlaygroundView`
4. Keep container `GraphqlPlayground` as composition entry
5. Move styles to `GraphqlPlayground.module.css` near view component
6. Move/update tests under feature `__tests__/`
7. Keep page file tiny and import feature entry only

This order reduces breakage and keeps diffs readable.

---

## 7) Suggested test layout in same directory

Inside the feature folder:

- `__tests__/GraphqlPlaygroundView.test.tsx` → pure UI tests
- `__tests__/GraphqlPlayground.integration.test.tsx` → Apollo mocked behavior
- Optional: `__tests__/useAddMessage.test.ts` if hook logic grows

Naming convention helps quickly identify test type:

- `*.test.tsx` for component tests
- `*.integration.test.tsx` for data+UI interaction tests

---

## 8) Naming conventions (recommended)

Use naming that reveals **layer + intent** at a glance.

### Feature folders

- Kebab-case for feature folder names:
  - `graphql-playground/`

### GraphQL documents

- `queries.ts` for query documents
- `mutations.ts` for mutation documents
- `fragments.ts` for shared fragments
- Operation names in GraphQL should be explicit:
  - `query DashboardData`
  - `mutation AddMessage`

### Hooks

- Prefix with `use` and action/domain meaning:
  - `useDashboardData.ts`
  - `useAddMessage.ts`

### Components

- Container components: feature name only
  - `GraphqlPlayground.tsx`
- Presentational components: suffix with `View`
  - `GraphqlPlaygroundView.tsx`

### Styles

- Co-located CSS modules with matching component name:
  - `GraphqlPlayground.module.css`
  - `GraphqlPlaygroundView.module.css` (if split)

### Tests

- Unit/component tests:
  - `GraphqlPlaygroundView.test.tsx`
- Integration tests (multiple layers + mocks/providers):
  - `GraphqlPlayground.integration.test.tsx`
- Hook-specific tests when needed:
  - `useAddMessage.test.ts`

Rule of thumb:

- Use `.test` when scope is isolated.
- Use `.integration.test` when testing interactions between multiple parts.

---

## 9) Anti-patterns to avoid

- Mixing `gql` documents, hooks, and JSX in one large file long-term
- Duplicating query strings across components
- Coupling presentational UI directly to Apollo types everywhere
- Storing feature-specific styles in global CSS
- Writing only API tests and skipping UI behavior tests

---

## 10) Practical checklist

Before finishing a feature refactor, verify:

- GraphQL operations are in dedicated files
- UI component can render from props without Apollo context
- Hook handles network/loading/error decisions
- Styles are colocated with view
- Feature tests live in the same feature directory
- `npm test` and `npm run build` pass

---

## 11) A simple mental model

For each feature, think in this stack:

**Documents -> Hooks -> View -> Styles -> Tests**

Keep all five near each other in one feature folder, and your project stays easy to navigate and evolve.
