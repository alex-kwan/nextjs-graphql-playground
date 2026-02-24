import { Message } from "./types";

export type QueryResolvers = {
    hello: () => string;
    messages: () => string[];
    serverTime: () => string;
    messagesV2: () => Message[];
}

export const queryResolvers = (messages: string[], messagesV2: Message[]): QueryResolvers => {
    return {
        hello: () => "Hello from Next.js GraphQL server!",
        messages: () => messages,
        serverTime: () => new Date().toISOString(),
        messagesV2: () => messagesV2.map((message) => ({
            id: message.id,
            text: message.text,
            createdAt: message.createdAt,
        })),
    }
}

export default queryResolvers;