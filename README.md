# Next.js GraphQL Playground

This project is a learning sandbox with:

- A **GraphQL server** in Next.js Route Handlers (`/api/graphql`)
- A **GraphQL client** in the Next.js app using Apollo Client
- A simple page to run a query and mutation

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/app/api/graphql/route.ts`: GraphQL schema + resolvers (server)
- `src/lib/apollo-client.ts`: Apollo Client setup (client)
- `src/components/graphql-playground.tsx`: Query + mutation UI
- `src/app/page.tsx`: Home page entry

## Example GraphQL operations

Endpoint: `http://localhost:3000/api/graphql`

Query:

```graphql
query DashboardData {
	hello
	messages
}
```

Mutation:

```graphql
mutation AddMessage($message: String!) {
	addMessage(message: $message)
}
```

Variables:

```json
{
	"message": "Testing GraphQL from Next.js"
}
```

## Next learning ideas

- Replace in-memory data with a database (Prisma + Postgres)
- Add GraphQL types for users/posts
- Add authentication and protect specific resolvers
