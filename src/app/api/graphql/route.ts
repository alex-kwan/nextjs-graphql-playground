import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLError } from "graphql/error";
import { NextRequest } from "next/server";

const messages: string[] = ["GraphQL is connected."];

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

const resolvers = {
  Query: {
    hello: () => "Hello from Next.js GraphQL server!",
    messages: () => messages,
    serverTime: () => new Date().toISOString(),
  },
  Mutation: {
    addMessage: (_: unknown, { message }: { message: string }) => {
      
      const trimmed = message.trim();
      if (trimmed.length <= 0) {
        throw new GraphQLError("Validation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            fields: {
              message: "Message cannot be empty.",
            }
          }
        })
      }

      if (trimmed.length > 200) {
        throw new GraphQLError("Validation failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            fields: {
              message: "Message cannot exceed 200 characters.",
            }
          }
        })
      }
      messages.push(trimmed);
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