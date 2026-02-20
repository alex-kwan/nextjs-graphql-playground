import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";

const messages: string[] = ["GraphQL is connected."];

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    messages: [String!]!
  }

  type Mutation {
    addMessage(message: String!): [String!]!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello from Next.js GraphQL server!",
    messages: () => messages,
  },
  Mutation: {
    addMessage: (_: unknown, { message }: { message: string }) => {
      messages.push(message);
      return messages;
    },
  },
};

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  fetchAPI: { Response },
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export function POST(request: NextRequest) {
  return handleRequest(request, {});
}