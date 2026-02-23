
export type QueryResolvers = {
    hello: () => string;
    messages: () => string[];
    serverTime: () => string;
}

export const queryResolvers = (messages: string[]): QueryResolvers => {
    return {
        hello: () => "Hello from Next.js GraphQL server!",
        messages: () => messages,
        serverTime: () => new Date().toISOString(),
    }
}

export default queryResolvers;