"use client";

import { useState } from "react";
import { useDashboardData } from "@/app/hooks/useDashboardData";
import { useAddMessageV2 } from "@/app/hooks/useAddMessage";
import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "@/lib/apollo-client";
import GraphqlPlaygroundView, { GraphqlPlaygroundViewProps } from "./GraphqlPlaygroundView";

export function GraphqlPlayground() {
  const [message, setMessage] = useState("");
  const { data, loading, error: dashboardError } = useDashboardData();
  const [addMessageV2, { loading: isAdding, error: addError }] = useAddMessageV2();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextValue = message.trim();
  
    await addMessageV2({
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
    messagesV2: data?.messagesV2 ?? [],
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

