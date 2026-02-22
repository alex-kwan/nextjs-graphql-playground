// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MockedProvider } from "@apollo/client/testing/react";
import {
  ADD_MESSAGE,
  GET_DASHBOARD_DATA,
  GraphqlDemo,
} from "./graphql-playground";

describe("GraphqlDemo", () => {
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
        <GraphqlDemo />
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
        <GraphqlDemo />
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
          error: {
            message: "Validation failed",
            extensions: {
              code: "BAD_USER_INPUT",
              fields: {
                message: "Message cannot be empty.",
              },
            },
          }
        },
      },
      {
        request: {
          query: GET_DASHBOARD_DATA,
        },
        result: {
          data: {
            hello: "Hello test!",
            messages: [],
            serverTime: new Date().toISOString(),
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <GraphqlDemo />
      </MockedProvider>,
    );

    await screen.findByText("Hello test!");

    fireEvent.change(screen.getByLabelText("Add message"), {
      target: { value: "" },
    });
    expect(screen.getByLabelText("Add message")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Run mutation" }));
    expect(screen.getByLabelText("Add message")).toHaveValue("");

   await waitFor(() => {
      expect(screen.getByText("No messages yet.")).toBeInTheDocument();
    });
  });
});
