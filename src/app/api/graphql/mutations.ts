import { GraphQLError } from "graphql";
import { Message } from "./types";

export type MutationResolvers = {
    addMessage: (_: unknown, args: { message: string }) => string[];
    addMessageV2: (_: unknown, args: { message: string }) => Message[];
}

const mutationResolvers = (messages: string[], messagesV2: Message[]): MutationResolvers => {
    return {
            addMessage: (_: unknown, { message }: { message: string }) => {
              
              const trimmed = message.trim();
              if (trimmed.length <= 0) {
                throw new GraphQLError("Validation failed", {
                  extensions: {
                    code: "BAD_USER_INPUT",
                    fields: {
                      message: "Message cannot be empty.",
                    }
                  }
                })
              }
        
              if (trimmed.length > 200) {
                throw new GraphQLError("Validation failed", {
                  extensions: {
                    code: "BAD_USER_INPUT",
                    fields: {
                      message: "Message cannot exceed 200 characters.",
                    }
                  }
                })
              }
              messages.push(trimmed);
              return messages;
            },
            addMessageV2: (_: unknown, { message }: { message: string }) => {
              
              const trimmed = message.trim();
              if (trimmed.length <= 0) {
                throw new GraphQLError("Validation failed", {
                  extensions: {
                    code: "BAD_USER_INPUT",
                    fields: {
                      message: "Message cannot be empty.",
                    }
                  }
                })
              }
        
              if (trimmed.length > 200) {
                throw new GraphQLError("Validation failed", {
                  extensions: {
                    code: "BAD_USER_INPUT",
                    fields: {
                      message: "Message cannot exceed 200 characters.",
                    }
                  }
                })
              }
              const newMessage: Message = {
                id: `${Date.now()}`,
                text: trimmed,
                createdAt: new Date().toISOString(),
              };
              messagesV2.push(newMessage);
              return messagesV2;
            },
    }
}

export default mutationResolvers;