import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Message } from "../api/graphql/types";

export const GET_DASHBOARD_DATA = gql`
  query DashboardData {
    hello
    messages
    serverTime
    messagesV2 {
      id
      text
      createdAt
    }
  }
`;

export type DashboardDataQuery = {
  hello: string;
  messages: string[];
  serverTime: string;
  messagesV2: Message[];
};

export function useDashboardData() {
  return useQuery<DashboardDataQuery>(GET_DASHBOARD_DATA);
}