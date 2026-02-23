"use client";

import { useState } from "react";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import { useAddMessage } from "@/app/hooks/useAddMessage";
import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo-client";
import GraphqlPlaygroundView, { GraphqlPlaygroundViewProps } from "./GraphqlPlaygroundView";

export function GraphqlPlayground() {
  const [message, setMessage] = useState("");
  const { data, loading, error: dashboardError } = useDashboardData();
  const [addMessage, { loading: isAdding, error: addError }] = useAddMessage();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = message.trim();
  
    await addMessage({
      variables: { message: nextValue },
    });
   
    setMessage("");
  }

   const props: GraphqlPlaygroundViewProps = {
    addError,
    onSubmit,
    message,
    setMessage,
    isAdding,
    serverTime: data?.serverTime ?? "",
    loading,
    dashboardError,
    hello: data?.hello ?? "",
    messages: data?.messages ?? [],
  };
  
  return <GraphqlPlaygroundView {...props} />
}

export function GraphqlDemo() {
  return (
    <ApolloProvider client={getApolloClient()}>
      <GraphqlPlayground />
    </ApolloProvider>
  );
}

