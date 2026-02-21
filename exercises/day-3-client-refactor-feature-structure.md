# Day 3 (2 hours): Client Refactor to Feature Structure

## Outcome

Refactor client GraphQL code into a maintainable feature-first layout with clear separation of concerns.

## Timebox

- 25 min: Plan target structure
- 65 min: Refactor files
- 30 min: Update tests and verify build

## Exercise

1. Create feature folder: `src/features/graphql-playground/`
2. Move GraphQL documents into `graphql/queries.ts` and `graphql/mutations.ts`.
3. Extract Apollo logic into hooks:
   - `useDashboardData.ts`
   - `useAddMessage.ts`
4. Split component into:
   - container (`GraphqlPlayground.tsx`)
   - presentational view (`GraphqlPlaygroundView.tsx`)
5. Move styles next to view (CSS module).
6. Update imports from `src/app/page.tsx`.

## Success criteria

- `npm run build` passes.
- `npm test` passes.
- Feature code is easier to navigate and each file has one main purpose.

## Reflection prompts

- Which file now has the clearest responsibility?
- What became easier to test after refactor?
