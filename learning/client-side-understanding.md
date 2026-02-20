# Client-Side Understanding (Next.js + GraphQL)

This document explains your current app flow from first page load to GraphQL data updates.

## 1) How the client side is served

At a high level:

1. A browser requests `/`.
2. Next.js resolves the App Router page at `src/app/page.tsx`.
3. That page returns `<GraphqlPlayground />` from `src/components/graphql-playground.tsx`.
4. Because `graphql-playground.tsx` has `"use client"`, this component is a **Client Component**.

What that means in practice:

- Next.js still sends initial HTML for the route.
- It also ships client JavaScript for this Client Component.
- React hydrates it in the browser so hooks (`useState`, `useQuery`, `useMutation`) can run.

## 2) How rendering works with Next.js in this app

### Server side (initial route rendering)

- `src/app/page.tsx` is a Server Component by default.
- It simply renders the client boundary (`GraphqlPlayground`).
- Next.js produces initial HTML for the page shell.

### Client side (after hydration)

Inside `GraphqlPlayground`:

- `ApolloProvider` is mounted with `getApolloClient()` from `src/lib/apollo-client.ts`.
- `getApolloClient()` creates (once) an Apollo client configured to call `/api/graphql`.
- `GraphqlDemo` then renders and runs React hooks.

So the UI lifecycle is:

1. Initial HTML appears.
2. Hydration happens in browser.
3. Apollo hooks execute.
4. UI updates when data arrives.

## 3) When GraphQL data “kicks in”

GraphQL requests start on the **client after hydration** when Apollo hooks run.

### Query flow (`useQuery`)

In `GraphqlDemo`:

- `useQuery(GET_DASHBOARD_DATA)` runs on mount.
- Apollo sends POST to `/api/graphql` with:
  - `hello`
  - `messages`
- While waiting, UI shows loading text.
- When response returns, React re-renders with `data.hello` and `data.messages`.

### Mutation flow (`useMutation`)

When you submit the form:

1. `onSubmit` prevents default and trims input.
2. `addMessage` mutation runs with `{ message }`.
3. GraphQL server appends to in-memory `messages` array.
4. Because you configured `refetchQueries`, Apollo re-runs `GET_DASHBOARD_DATA`.
5. UI re-renders with updated messages list.

## 4) What happens inside the GraphQL server route

Your endpoint is `src/app/api/graphql/route.ts`:

- Next.js route handlers expose `GET`/`POST`.
- Both forward the request to GraphQL Yoga’s `handleRequest`.
- Yoga executes schema + resolvers and returns JSON.

Important runtime notes:

- `runtime = "nodejs"` forces Node runtime (not Edge).
- `dynamic = "force-dynamic"` keeps the route dynamic.
- Data is currently stored in memory (`messages` array), so it resets when server restarts.

## 5) End-to-end request timeline

For the first page visit:

1. Browser GET `/`
2. Next renders page + client boundary
3. Browser hydrates `GraphqlPlayground`
4. `useQuery` fires POST `/api/graphql`
5. Server resolves `hello/messages`
6. UI updates with returned data

For adding a message:

1. User submits form
2. `useMutation` fires POST `/api/graphql`
3. Resolver updates `messages`
4. Apollo refetches query
5. UI updates with new message

## 6) Mental model to keep in mind

- **Next.js page routing/rendering** gives structure and hydration.
- **Apollo Client** handles client-side GraphQL operations and cache.
- **GraphQL Yoga route** is your backend API in the same Next.js project.
- The data appears only after client hydration + GraphQL network round trip.

---

If you want, next we can add a second doc that compares this current client-driven fetch flow vs a server-side data-fetch flow in Next.js (RSC-first) so you can see tradeoffs clearly.
