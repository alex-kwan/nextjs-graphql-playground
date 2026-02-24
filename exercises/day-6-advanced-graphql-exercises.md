# Day 6: Advanced GraphQL Queries and Fragments (Project-Based)

## Topics
- Using query variables with your API
- Aliases for multiple message queries
- Fragments for message fields
- Nested queries with messagesV2

## Exercises
1. In your GraphQL Playground UI, write a query using variables to fetch messagesV2 with a specific filter (e.g., by text substring). If this filter does not exist, add it to your API in queries.ts and types.ts, then test it.
2. Use aliases in a query to fetch messages and messagesV2 in the same request, and display both in the playground.
3. Refactor your GET_DASHBOARD_DATA query in useDashboardData.ts to use a fragment for the Message fields (id, text, createdAt). Show how this improves maintainability.
4. (Bonus) Add a new nested field to Message (e.g., author info), update your schema/types, and demonstrate querying it from the playground.