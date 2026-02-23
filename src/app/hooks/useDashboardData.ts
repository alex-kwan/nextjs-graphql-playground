import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

export const GET_DASHBOARD_DATA = gql`
  query DashboardData {
    hello
    messages
    serverTime
  }
`;

export type DashboardDataQuery = {
  hello: string;
  messages: string[];
  serverTime: string;
};

export function useDashboardData() {
  return useQuery<DashboardDataQuery>(GET_DASHBOARD_DATA);
}