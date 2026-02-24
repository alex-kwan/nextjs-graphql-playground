import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_DASHBOARD_DATA } from "./useDashboardData";
import { Message } from "../api/graphql/types";

export const ADD_MESSAGE = gql`
  mutation AddMessageV2($message: String!) {
    addMessageV2(message: $message) {
      id
      text
      createdAt
    }
  }
`;


type AddMessageV2Mutation = {
  addMessageV2: Message[];
};

type AddMessageVariables = {
  message: string;
};

export function useAddMessageV2() {
  return useMutation<AddMessageV2Mutation, AddMessageVariables>(ADD_MESSAGE, {
    errorPolicy: "all",
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });
}