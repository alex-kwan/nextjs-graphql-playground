"use client";

import { useState } from "react";
import { CombinedGraphQLErrors, gql } from "@apollo/client";
import { ApolloProvider, useMutation, useQuery } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo-client";
import styles from "@/app/page.module.css";

export const GET_DASHBOARD_DATA = gql`
  query DashboardData {
    hello
    messages
    serverTime
  }
`;

export const ADD_MESSAGE = gql`
  mutation AddMessage($message: String!) {
    addMessage(message: $message)
  }
`;

type DashboardDataQuery = {
  hello: string;
  messages: string[];
  serverTime: string;
};

type AddMessageMutation = {
  addMessage: string[];
};

type AddMessageVariables = {
  message: string;
};

export function GraphqlDemo() {
  const [message, setMessage] = useState("");
  const { data, loading, error } = useQuery<DashboardDataQuery>(
    GET_DASHBOARD_DATA,
  );
  const [addMessage, { loading: isAdding, error: addError}] =
    useMutation<AddMessageMutation, AddMessageVariables>(ADD_MESSAGE, {
      errorPolicy: "all",
      refetchQueries: [{ query: GET_DASHBOARD_DATA }],
    });

  const graphqlErrors = CombinedGraphQLErrors.is(addError) ? addError.errors : [];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = message.trim();
  
    await addMessage({
      variables: { message: nextValue },
    });
   
    setMessage("");
  }


  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Next.js + GraphQL Playground</h1>
      <p className={styles.subtitle}>
        Query and mutate data from the GraphQL API at <code>/api/graphql</code>.
      </p>
      <p className={styles.subtitle}>
        Server Time : {data?.serverTime}
      </p>

      <section className={styles.card}>
        <h2>Server greeting</h2>
        {loading && <p>Loading query...</p>}
        {error && <p className={styles.error}>{error.message}</p>}
        {!loading && !error && <p>{data?.hello}</p>}
      </section>

      <section className={styles.card}>
        <h2>Messages</h2>
        {loading && <p>Loading messages...</p>}
        {!loading && data?.messages?.length === 0 && <p>No messages yet.</p>}
        <ul className={styles.messages}>
          {data?.messages?.map((entry: string, index: number) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      </section>
      {graphqlErrors != null && graphqlErrors.length > 0 && (
      <p id="errorSpot" className={styles.error}>
        {(graphqlErrors[0].extensions?.fields as { message: string } | undefined)?.message}
      </p>
    )}

      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="message">Add message</label>
        <input
          id="message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" disabled={isAdding}>
          {isAdding ? "Saving..." : "Run mutation"}
        </button>
      </form>
    </main>
  );
}

export function GraphqlPlayground() {
  return (
    <ApolloProvider client={getApolloClient()}>
      <GraphqlDemo />
    </ApolloProvider>
  );
}