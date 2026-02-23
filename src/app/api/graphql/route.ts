import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";
import queryResolvers from "./queries";
import mutationResolvers from "./mutations";

const messages: string[] = [];

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
    messages: [String!]!
    serverTime: String!
  }

  type Mutation {
    addMessage(message: String!): [String!]!
  }
`;

const resolvers = {Query: queryResolvers(messages), Mutation: mutationResolvers(messages)};

const { handleRequest } = createYoga({
  graphqlEndpoint: "/api/graphql",
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  fetchAPI: { Response },
  maskedErrors: false,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export function POST(request: NextRequest) {
  return handleRequest(request, {});
}