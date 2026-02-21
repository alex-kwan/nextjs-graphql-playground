import { describe, expect, test } from "vitest";
import { POST } from "./route";

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
    throw new Error(payload.errors.map((error) => error.message).join("; "));
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
});
