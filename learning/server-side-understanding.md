# Server-Side Understanding (Next.js + GraphQL Yoga)

This document explains what happens on the **server** in your current project, and how that connects to client hydration and GraphQL mutations.

## 1) Where server handling starts

When a request comes in, Next.js decides which route should handle it:

- `GET /` → page route (`src/app/page.tsx`)
- `POST /api/graphql` (or `GET /api/graphql`) → API route (`src/app/api/graphql/route.ts`)

So there are two different server paths:

1. **Page rendering path** (for HTML + app shell)
2. **GraphQL API path** (for data operations)

## 2) Server path for page request (`GET /`)

### Step-by-step

1. Browser requests `/`.
2. Next.js runs `src/app/page.tsx` on the server.
3. `page.tsx` returns `<GraphqlPlayground />`.
4. Because `GraphqlPlayground` is a Client Component (`"use client"`), Next.js emits:
   - server-rendered HTML shell
   - metadata about client component boundaries
   - client JS needed for hydration

At this stage, the server is not executing your Apollo hooks directly. It is preparing the page so the browser can hydrate and run client logic.

## 3) Server path for GraphQL request (`POST /api/graphql`)

Your GraphQL endpoint is implemented in `src/app/api/graphql/route.ts`.

### Key pieces in that file

- `createSchema({ typeDefs, resolvers })` defines GraphQL types and behavior.
- `createYoga(...)` creates a request handler.
- `GET` and `POST` route functions forward to Yoga’s `handleRequest`.

### What happens per GraphQL request

1. Request arrives at `/api/graphql`.
2. Next route handler calls `handleRequest(request, {})`.
3. Yoga parses query/mutation + variables.
4. Resolver executes on server:
   - `hello` returns a string
   - `messages` returns the in-memory array
   - `addMessage` updates that in-memory array
5. Yoga returns GraphQL JSON response to the client.

## 4) How hydration fits in with GraphQL

Hydration is a browser-side step after initial HTML is delivered.

### Timeline connection

1. Server sends initial HTML for `/`.
2. Browser loads JS and hydrates `GraphqlPlayground`.
3. During/after hydration, Apollo hooks execute:
   - `useQuery(GET_DASHBOARD_DATA)` kicks off request to `/api/graphql`.
4. Server handles that GraphQL query and returns data.
5. Browser re-renders with returned data.

So hydration is the bridge:
- Server creates initial page output
- Client becomes interactive
- Then GraphQL network calls begin from the client

## 5) What happens on mutation (`addMessage`)

When user submits the form:

1. Client runs `addMessage` mutation with variables.
2. Browser sends GraphQL mutation POST to `/api/graphql`.
3. Server resolver pushes into `messages` array.
4. Mutation response is returned.
5. Apollo `refetchQueries` re-runs `GET_DASHBOARD_DATA`.
6. Server handles this follow-up query and returns updated list.
7. Client re-renders with the new message shown.

## 6) Important server behavior in your current setup

- `runtime = "nodejs"`: GraphQL route uses Node runtime.
- `dynamic = "force-dynamic"`: route is always dynamic.
- Data store is in-memory (`const messages: string[]`), so:
  - resets on server restart/redeploy
  - not shared across multiple independent server instances

For production learning next steps, replace in-memory state with a database.

## 7) Simple mental model

- **Next page server rendering** gives HTML + hydration boundary.
- **Client hydration** activates Apollo hooks.
- **GraphQL route on server** executes resolvers and returns JSON.
- **Mutation** changes server state, then client refetches and updates UI.
