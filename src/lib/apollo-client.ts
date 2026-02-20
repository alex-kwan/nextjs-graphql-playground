import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

let client: ApolloClient | null = null;

export function getApolloClient() {
  if (client) {
    return client;
  }

  client = new ApolloClient({
    link: new HttpLink({
      uri: "/api/graphql",
    }),
    cache: new InMemoryCache(),
  });

  return client;
}