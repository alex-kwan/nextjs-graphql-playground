import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { GET_DASHBOARD_DATA } from "./useDashboardData";

export const ADD_MESSAGE = gql`
  mutation AddMessage($message: String!) {
    addMessage(message: $message)
  }
`;

type AddMessageMutation = {
  addMessage: string[];
};

type AddMessageVariables = {
  message: string;
};

export function useAddMessage() {
  return useMutation<AddMessageMutation, AddMessageVariables>(ADD_MESSAGE, {
    errorPolicy: "all",
    refetchQueries: [{ query: GET_DASHBOARD_DATA }],
  });
}