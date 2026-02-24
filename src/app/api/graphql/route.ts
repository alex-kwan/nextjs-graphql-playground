import { createSchema, createYoga } from "graphql-yoga";
import { NextRequest } from "next/server";
import { queryResolvers } from "./queries";
import mutationResolvers from "./mutations";
import { Message } from "./types";

const messages: string[] = [];
const messagesV2: Message[] = [];

const typeDefs = /* GraphQL */ `
  type Message {
    id: ID!
    text: String!
    createdAt: String!
  }
  
  type Query {
    hello: String!
    messages: [String!]!
    serverTime: String!
    messagesV2: [Message!]!
  }

  type Mutation {
    addMessage(message: String!): [String!]!
    addMessageV2(message: String!): [Message!]!
  }
`;

const resolvers = {Query: queryResolvers(messages, messagesV2), Mutation: mutationResolvers(messages, messagesV2)};

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