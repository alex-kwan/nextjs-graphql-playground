import { describe, expect, test } from "vitest";
import { POST } from "./route";
import { GraphQLError, GraphQLErrorExtensions } from "graphql";

type GraphqlResponse<TData> = {
  data?: TData;
  errors?: Array<{ message: string }>;
};

async function executeGraphql<TData>(query: string, variables?: Record<string, unknown>) {
  const request = new Request("http://localhost/api/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  const response = await POST(request as never);
  const payload = (await response.json()) as GraphqlResponse<TData>;

  if (payload.errors?.length) {
    throw payload.errors[0]; // Throws the first error, which includes extensions
  }

  return payload.data as TData;
}

describe("GraphQL route", () => {
  test("returns hello greeting", async () => {
    const data = await executeGraphql<{ hello: string }>(`
      query {
        hello
      }
    `);

    expect(data.hello).toBe("Hello from Next.js GraphQL server!");
  });

  test("returns server time", async () => {
    const data = await executeGraphql<{ serverTime: string }>(`
      query {
        serverTime
      }
    `);

    expect(new Date(data.serverTime).getTime()).toBeLessThanOrEqual(Date.now());
  });

  test("adds message through mutation", async () => {
    const newMessage = `test-message-${Date.now()}`;

    const mutationData = await executeGraphql<{ addMessage: string[] }>(
      `
        mutation AddMessage($message: String!) {
          addMessage(message: $message)
        }
      `,
      { message: newMessage },
    );

    expect(mutationData.addMessage).toContain(newMessage);

    const queryData = await executeGraphql<{ messages: string[] }>(`
      query {
        messages
      }
    `);

    expect(queryData.messages).toContain(newMessage);
  });

  test("attempt to add invalid message through mutation", async () => {
    const newMessage = ``;

    try {
      const mutationData = await executeGraphql<{ addMessage: string[] }>(
      `
        mutation AddMessage($message: String!) {
          addMessage(message: $message)
        }
      `,
      { message: newMessage },
    );
    }
    catch (error) {
      const extensions = (error as GraphQLError).extensions as GraphQLErrorExtensions;
      expect(extensions.code).toBe("BAD_USER_INPUT");
      }
    
const longMessage = `This is a very long message that exceeds the 200 character limit set by the GraphQL server. It should trigger a validation error when we attempt to add it through the mutation. The purpose of this test is to ensure that our server correctly handles input that violates our defined constraints and returns the appropriate error response to the client.`;

    try {
      const mutationData = await executeGraphql<{ addMessage: string[] }>(
      `
        mutation AddMessage($message: String!) {
          addMessage(message: $message)
        }
      `,
      { message: longMessage },
    );
    }
    catch (error) {
      const extensions = (error as GraphQLError).extensions as GraphQLErrorExtensions;
      expect(extensions.code).toBe("BAD_USER_INPUT");
      }
  });
});


