# Day 8: GraphQL Pagination and Connections (Project-Based)

## Topics
- Adding pagination to messagesV2
- Updating hooks and playground UI for pagination
- Relay-style connection basics

## Exercises
1. Extend your messagesV2 query and resolver to support offset-based pagination (e.g., arguments: offset, limit). Update types and test in the playground.
2. Update useDashboardData.ts and the playground UI to allow paginated fetching of messagesV2. Add UI controls for next/previous page.
3. (Bonus) Refactor your API to use cursor-based pagination for messagesV2. Document the changes and test with the playground.
