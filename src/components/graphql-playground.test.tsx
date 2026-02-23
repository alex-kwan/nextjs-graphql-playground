// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import { GET_DASHBOARD_DATA } from "@/app/hooks/useDashboardData";
import { GraphqlPlayground } from "./graphql-playground";
import { ADD_MESSAGE } from "@/app/hooks/useAddMessage";
import { GraphQLError } from "graphql/error";

describe("GraphqlPlayground", () => {
  test("renders greeting and messages from query", async () => {
    const mocks = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            hello: "Hello test!",
            messages: ["First message"],
            serverTime: "2026-02-21T05:25:51.000Z",
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <GraphqlPlayground />
      </MockedProvider>,
    );

    expect(screen.getByText("Loading query...")).toBeInTheDocument();
    expect(await screen.findByText("Hello test!")).toBeInTheDocument();
    expect(screen.getByText("First message")).toBeInTheDocument();
    expect(screen.getByText(`Server Time : 2026-02-21T05:25:51.000Z`)).toBeInTheDocument();
  });

  test("runs add message mutation and shows updated list", async () => {
    const inputValue = "Client mutation message";

    const mocks = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            hello: "Hello test!",
            messages: ["Existing"],
            serverTime: "2026-02-21T05:25:51.000Z",
          },
        },
      },
      {
        request: {
          query: ADD_MESSAGE,
          variables: { message: inputValue },
        },
        result: {
          data: {
            addMessage: ["Existing", inputValue],
          },
        },
      },
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            hello: "Hello test!",
            messages: ["Existing", inputValue],
            serverTime: new Date().toISOString(),
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <GraphqlPlayground />
      </MockedProvider>,
    );

    await screen.findByText("Existing");

    fireEvent.change(screen.getByLabelText("Add message"), {
      target: { value: inputValue },
    });

    fireEvent.click(screen.getByRole("button", { name: "Run mutation" }));

    await waitFor(() => {
      expect(screen.getByText(inputValue)).toBeInTheDocument();
    });
  });

  test("try to add an empty message", async () => {
    const inputValue = "";
    const mocks = [
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            hello: "Hello test!",
            messages: [""],
            serverTime: "2026-02-21T05:25:51.000Z",
          },
        },
      },
      {
        request: {
          query: ADD_MESSAGE,
          variables: { message: inputValue },
        },
        result: {
          errors: [new GraphQLError("Message cannot be empty.", {
            extensions: {
              fields: {
                message: "Message cannot be empty.",
              },
            },          
          })],
        },
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <GraphqlPlayground />
      </MockedProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Run mutation" }), { bubbles: false });

    await waitFor(() => {
      expect(screen.getByText("Message cannot be empty.")).toBeInTheDocument();
    });
  });
});
