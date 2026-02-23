import { GraphQLError } from "graphql";

export type MutationResolvers = {
    addMessage: (_: unknown, args: { message: string }) => string[];
}

const mutationResolvers = (messages: string[]): MutationResolvers => {
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
    }
}

export default mutationResolvers;